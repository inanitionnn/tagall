import type {
  ImdbDetailsResultType,
  SearchResultType,
  ImdbSearchInputType,
  SearchType,
  SearchQuery,
} from "../types";
import * as cheerio from "cheerio";
import axios from "axios";

// #region Private Functions
async function GetHtmlFromUrl(url: string): Promise<string> {
  try {
    const response = await axios.get(url, {
      headers: {
        "Accept-Language": "en-US,en;q=0.9",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept: "text/html",
      },
    });

    return response.data as string;
  } catch {
    throw new Error("IMDB parse error");
  }
}

function ExtractElements<T>(...arrays: Record<string, any>[][]): T[] {
  const getItem = (item: Record<string, any>): T => {
    return (
      item.credits?.map((credit: any) => credit?.name?.nameText?.text)?.[0] ||
      item.node?.company?.companyText?.text ||
      item.node?.primaryText?.text ||
      item.name?.nameText?.text ||
      item.node?.text ||
      item.genre?.text ||
      item.name ||
      item.id
    );
  };

  const extractedArrays = arrays.map((array) => {
    if (!array) return [];
    return array.filter(getItem).map(getItem);
  });

  return [...new Set(extractedArrays.flat())];
}

function FillImdbDetailsResult(props: any): ImdbDetailsResultType {
  return {
    title: props.titleText?.text ?? props.originalTitleText?.text ?? null,
    image: GetHighQualityImageUrls(props.primaryImage?.url)?.optimized ?? null,
    description: props.summaries[1] || props.plot?.plotText?.plainText || null,
    type: {
      titleType: props.titleType?.id ?? null,
      isSeries: !!props.titleType?.isSeries,
      isEpisode: !!props.titleType?.isEpisode,
      canHaveEpisodes: !!props.titleType?.canHaveEpisodes,
    },
    // year: {
    //   release: props.releaseYear?.year ?? null,
    //   end: props.releaseYear?.endYear ?? null,
    // },
    year: props.releaseYear?.year ?? null,
    // runtime: {
    //   seconds: props.runtime?.seconds ?? null,
    //   text: props.runtime?.displayableProperty?.value?.plainText ?? null,
    // },
    runtime: props.runtime?.displayableProperty?.value?.plainText ?? null,
    rating: props.ratingsSummary?.aggregateRating ?? null,
    isAdult: props.isAdult ?? null,
    contentRating: props.contentRating ?? null,
    production: ExtractElements<string>(props.production?.edges),
    people: ExtractElements<string>(
      props.castPageTitle?.edges,
      props.actor,
      props.director,
      props.creator,
      props.creatorsPageTitle,
      props.directorsPageTitle,
    ),
    genres: ExtractElements<string>(
      props.genres?.genres,
      props.titleGenres?.genres,
    ),
    keywords: ExtractElements<string>(
      props.keywords?.edges,
      props.interests?.edges,
    ),
  };
}

function GetHighQualityImageUrls(originalUrl: string | null) {
  if (!originalUrl) return null;

  const baseUrlMatch = /(.*?)\._V1/.exec(originalUrl);
  if (!baseUrlMatch)
    return {
      raw: originalUrl,
      optimized: originalUrl,
      small: originalUrl,
    };

  const baseUrl = baseUrlMatch[1];

  return {
    raw: `${baseUrl}._V1_.jpg`,
    optimized: `${baseUrl}._V1_QL80_UY1080_.jpg`,
    small: `${baseUrl}._V1_QL75_UY600_.jpg`,
  };
}

function parseQueryString(input: string): SearchQuery {
  const result: SearchQuery = {
    title: "",
    meta: null,
    year: null,
  };

  const titleRegex = /^(.*?)( \[| \(|$)/;
  const titleMatch = titleRegex.exec(input)?.at(1);
  result.title = titleMatch || "";

  if (!result.title) throw new Error("Title is required");

  const yearRegex = /\((\d{4})\)$/;
  const yearMatch = yearRegex.exec(input)?.at(1);
  result.year = yearMatch ? parseInt(yearMatch, 10) : null;

  const metaRegex = /\[([^\]]*)\]/;
  const metaMatch = metaRegex.exec(input)?.at(1);
  result.meta = metaMatch || null;

  return result;
}

function mergeMeta(meta1: string | null, meta2: string | null): string {
  const params = new URLSearchParams();

  [meta1, meta2].forEach((meta) => {
    if (meta) {
      const metaParams = new URLSearchParams(meta);
      metaParams.forEach((value, key) => {
        params.set(key, value);
      });
    }
  });

  return params.toString() ? `?${params.toString()}` : "";
}

function removeSignatures(text: string): string {
  const signaturePattern = /\s?—[\w\s]+$/gm;
  return text.replace(signaturePattern, "");
}

function ParseQuickSearch(props: {
  html: string;
  limit: number;
}): SearchResultType[] {
  const { html, limit } = props;
  const $ = cheerio.load(html);
  const results: SearchResultType[] = [];
  const elements = $("li.find-title-result").slice(0, limit);
  elements.each((_, element) => {
    const titleElement = $(element).find(".ipc-metadata-list-summary-item__t");
    const title = titleElement.text().trim() ?? null;
    const link = titleElement.attr("href") ?? null;

    const imageElement = $(element).find("img.ipc-image");
    const image = imageElement.attr("src") ?? null;

    const yearElement = $(element).find(".ipc-inline-list__item").first();
    const year = parseInt(yearElement.text().trim()) ?? null;

    const actorElements = $(element).find(
      ".ipc-metadata-list-summary-item__stl .ipc-inline-list__item",
    );
    const actors: string[] = [];
    actorElements.each((_, actorEl) => {
      const actor = $(actorEl).text().trim();
      if (actor) actors.push(actor);
    });

    const parsedId = link?.match(/\/title\/(tt\d+)/)?.[1];
    if (parsedId) {
      results.push({
        id: null,
        title,
        image: GetHighQualityImageUrls(image)?.small ?? null,
        year,
        description: null,
        keywords: actors,
        parsedId,
      });
    }
  });

  return results;
}

function ParseAdvancedSearch(props: {
  html: string;
  limit: number;
}): SearchResultType[] {
  const { html, limit } = props;
  const $ = cheerio.load(html);

  const results: SearchResultType[] = [];
  const elements = $(".ipc-metadata-list-summary-item").slice(0, limit);
  elements.each((_, element) => {
    const result: SearchResultType = {
      id: null,
      description: null,
      image: null,
      keywords: [],
      title: null,
      year: null,
      parsedId: "",
    };

    const titleElement = $(element).find(".dli-title h3.ipc-title__text");
    const rawTitle = titleElement.text();
    result.title = rawTitle.split(". ").slice(1).join(". ") ?? rawTitle ?? null;

    const metadata = $(element).find(".dli-title-metadata-item");
    metadata.each((index, item) => {
      const text = $(item).text();
      if (index === 0) result.year = parseInt(text) ?? null;
      if (index === 1) result.keywords.push(text);
      if (index === 2) result.keywords.push(text);
    });

    const ratingElement = $(element).find(".ratingGroup--imdb-rating");
    if (ratingElement.length) {
      const rating =
        ratingElement.find(".ipc-rating-star--rating").text() + " imdb";
      result.keywords.push(rating);
    }

    // const metacriticElement = $(element).find(".metacritic-score-box");
    // if (metacriticElement.length) {
    //   const metacritic = parseInt(metacriticElement.text()) + " metascore";
    //   result.keywords.push(metacritic);
    // }

    const plotElement = $(element).find(".dli-plot-container");
    result.description = plotElement.text().trim();

    // Get poster URL
    const posterImg = $(element).find(".ipc-image").attr("src");
    if (posterImg) {
      result.image = GetHighQualityImageUrls(posterImg)?.small ?? null;
    }

    // Get movie/show URL
    const linkElement = $(element).find(".ipc-title-link-wrapper");
    const link = "https://www.imdb.com" + linkElement.attr("href");
    const match = /\/title\/(tt\d+)/.exec(link);
    result.parsedId = match?.[1] ?? "";

    if (result.parsedId) {
      results.push(result);
    }
  });

  return results;
}

async function GetQuickSearchHtml(
  props: {
    type: SearchType;
  } & Omit<SearchQuery, "meta">,
): Promise<string> {
  const { type, title, year } = props;

  let query = `q=${encodeURIComponent(title)}`;

  if (year) {
    query += ` ${year}`;
  }

  let defaultMeta = `?${query}?&s=tt`;

  switch (type) {
    case "film":
      defaultMeta += "&ttype=ft";
      break;
    case "series":
      defaultMeta += "&ttype=tv";
      break;
    case "all":
      break;
  }

  const url = `https://www.imdb.com/find/${defaultMeta}`;
  console.log("url", url);
  return GetHtmlFromUrl(url);
}

async function GetAdvancedSearchHtml(
  props: {
    type: SearchType;
  } & SearchQuery,
): Promise<string> {
  const { type, title, meta, year } = props;

  let defaultMeta = `?title=${encodeURIComponent(title)}`;
  switch (type) {
    case "film":
      defaultMeta += `&title_type=${encodeURIComponent("feature,tv_movie,short,tv_short,video")}`;
      break;
    case "series":
      defaultMeta += `&title_type=${encodeURIComponent("tv_series,tv_miniseries")}`;
      break;
  }

  if (year) {
    const release_date = `&release_date=${year}-01-01,${year}-12-31`;
    defaultMeta += release_date;
  }

  const mergedMeta = mergeMeta(meta, defaultMeta);

  const url = `https://www.imdb.com/search/title/${mergedMeta}`;

  return GetHtmlFromUrl(url);
}

// #endregion Private Functions

// #region Public Functions
export async function GetImdbDetailsById(
  id: string,
): Promise<ImdbDetailsResultType> {
  try {
    const plotHtml = await GetHtmlFromUrl(
      `https://www.imdb.com/title/${id}/plotsummary`,
    );
    const $Plot = cheerio.load(plotHtml);
    const summaries: string[] = [];
    $Plot('[data-testid="sub-section-summaries"]')
      .children()
      .children()
      .each((_, element) => {
        const summary = $Plot(element).text().trim();
        summaries.push(removeSignatures(summary));
      });

    const mainHtml = await GetHtmlFromUrl(`https://www.imdb.com/title/${id}/`);
    const $Main = cheerio.load(mainHtml);

    const nextdataScriptString = $Main("#__NEXT_DATA__").html();
    const nextdataScriptJson = JSON.parse(nextdataScriptString ?? "");
    const pageProps = nextdataScriptJson.props.pageProps.aboveTheFoldData;

    const metadataScriptString = $Main(
      'script[type="application/ld+json"]',
    ).html();
    const metadata = JSON.parse(metadataScriptString ?? "");

    return FillImdbDetailsResult({ ...pageProps, ...metadata, summaries });
  } catch (error) {
    console.error(error);
    throw new Error("Imdb parse error");
  }
}

export async function SearchImdb(
  props: ImdbSearchInputType,
): Promise<SearchResultType[]> {
  const { query, isQuickSearch = false, type = "all", limit = 10 } = props;
  const { meta, title, year } = parseQueryString(query);

  const quickSearchResults = [];
  if (isQuickSearch) {
    const quickSearchHtml = await GetQuickSearchHtml({ type, title, year });
    quickSearchResults.push(
      ...ParseQuickSearch({
        html: quickSearchHtml,
        limit: 4,
      }),
    );
  }

  const advancedSearchHtml = await GetAdvancedSearchHtml({
    type,
    title,
    meta,
    year,
  });
  const advancedSearchResults = ParseAdvancedSearch({
    html: advancedSearchHtml,
    limit: limit,
  });

  const advancedSearchIdsSet = new Set(
    advancedSearchResults.map((result) => result.parsedId),
  );

  return [
    ...quickSearchResults.filter(
      (result) => !advancedSearchIdsSet.has(result.parsedId),
    ),
    ...advancedSearchResults,
  ].slice(0, limit);
}

// #endregion Public Functions
