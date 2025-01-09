import { type ImdbDetailsResultType, type SearchResultType } from "../types";
import * as cheerio from "cheerio";
import axios from "axios";

// #region Private Functions
async function GetHtmlFromUrl(url: string): Promise<string> {
  const response = await axios.get(url, {
    headers: {
      "Accept-Language": "en-US,en;q=0.9",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      Accept: "text/html",
    },
  });

  return response.data as string;
}

function ExtractElements<T>(...arrays: Record<string, any>[][]): T[] {
  const getItem = (item: Record<string, any>): T => {
    return (
      item.id ||
      item.name ||
      item.genre?.text ||
      item.node?.text ||
      item.name?.nameText?.text ||
      item.node?.primaryText?.text ||
      item.node?.company?.companyText?.text ||
      item.credits?.map((credit: any) => credit?.name?.nameText?.text)?.[0]
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
    description: props.plot?.plotText?.plainText ?? null,
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
// #endregion Private Functions

// #region Public Functions
export async function GetImdbDetailsById(
  id: string,
): Promise<ImdbDetailsResultType> {
  try {
    const html = await GetHtmlFromUrl(`https://www.imdb.com/title/${id}/`);

    const $ = cheerio.load(html);

    const nextdataScriptString = $("#__NEXT_DATA__").html();
    const nextdataScriptJson = JSON.parse(nextdataScriptString ?? "");
    const pageProps = nextdataScriptJson.props.pageProps.aboveTheFoldData;

    const metadataScriptString = $('script[type="application/ld+json"]').html();
    const metadata = JSON.parse(metadataScriptString ?? "");

    return FillImdbDetailsResult({ ...pageProps, ...metadata });
  } catch (error) {
    console.error(error);
    throw new Error("Imdb parse error");
  }
}

export async function SearchImdb(
  query: string,
  type: "film" | "series" | "all" = "all",
  limit = 10,
): Promise<SearchResultType[]> {
  const url = `https://www.imdb.com/find/?q=${encodeURIComponent(query)}&s=tt&${
    type === "film" ? "ttype=ft" : type === "series" ? "ttype=tv" : ""
  }&ref_=fn_tt`;

  try {
    const html = await GetHtmlFromUrl(url);
    const $ = cheerio.load(html);

    const results: SearchResultType[] = [];
    const elements = $("li.find-title-result").slice(0, limit);
    elements.each((index, element) => {
      const titleElement = $(element).find(
        ".ipc-metadata-list-summary-item__t",
      );
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
  } catch (error) {
    console.error(error);
    throw new Error("IMDB parse error");
  }
}

export async function AdvancedSearchImdb(
  query: string,
  type: "film" | "series",
  limit = 10,
): Promise<SearchResultType[]> {
  let title_type;
  switch (type) {
    case "film":
      title_type = "feature,tv_movie,short,tv_short,video";
      break;
    case "series":
      title_type = "tv_series,tv_miniseries";
      break;
  }

  const url = `https://www.imdb.com/search/title/?title=${encodeURIComponent(
    query,
  )}&title_type=${encodeURIComponent(title_type)}`;

  try {
    const html = await GetHtmlFromUrl(url);

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
      // result.rank = parseInt(rawTitle.split(".")[0]) ?? null;
      result.title = rawTitle.split(". ")[1] ?? rawTitle ?? null;

      const metadata = $(element).find(".dli-title-metadata-item");
      metadata.each((index, item) => {
        const text = $(item).text();
        if (index === 0) result.year = parseInt(text) ?? null;
        if (index === 1) result.keywords.push(text);
        if (index === 2) result.keywords.push(text);
      });

      // const ratingElement = $(element).find(".ratingGroup--imdb-rating");
      // if (ratingElement.length) {
      //   const rating =
      //     ratingElement.find(".ipc-rating-star--rating").text() + " imdb";
      //   result.keywords.push(rating);
      // }

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
  } catch (error) {
    console.error(error);
    throw new Error("Imdb parse error");
  }
}
// #endregion Public Functions
