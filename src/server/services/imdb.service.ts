import { PARSE_TYPES } from "../types";
import { getHtmlFromUrl } from "./axios.service";
import * as cheerio from "cheerio";

// #region Private Functions
function extractElements<T>(...arrays: T[][]): T[] {
  const getItem = (item: any) => {
    return (
      item.id ||
      item.name ||
      item.genre?.text ||
      item.node?.text ||
      item.name?.nameText?.text ||
      item.node?.primaryText?.text ||
      item.node?.company?.companyText?.text ||
      item.credits?.map((credit: any) => credit?.name?.nameText?.text)[0]
    );
  };

  const extractedArrays = arrays.map((array) => {
    if (!array) return [];
    return array.filter(getItem).map(getItem);
  });

  return [...new Set(extractedArrays.flat())];
}

function fillImdbDetailsResult(props: any): PARSE_TYPES.ImdbDetailsResult {
  return {
    title: props.titleText?.text || props.originalTitleText?.text || null,
    image: props.primaryImage?.url || null,
    plot: props.plot?.plotText?.plainText || null,
    type: {
      titleType: props.titleType?.id || null,
      isSeries: !!props.titleType?.isSeries,
      isEpisode: !!props.titleType?.isEpisode,
      canHaveEpisodes: !!props.titleType?.canHaveEpisodes,
    },
    // year: {
    //   release: props.releaseYear?.year || null,
    //   end: props.releaseYear?.endYear || null,
    // },
    year: props.releaseYear?.year || null,
    // runtime: {
    //   seconds: props.runtime?.seconds || null,
    //   text: props.runtime?.displayableProperty?.value?.plainText || null,
    // },
    runtime: props.runtime?.displayableProperty?.value?.plainText || null,
    rating: props.ratingsSummary?.aggregateRating || null,
    isAdult: props.isAdult || null,
    contentRating: props.contentRating || null,
    production: extractElements<string>(props.production?.edges),
    people: extractElements<string>(
      props.castPageTitle?.edges,
      props.actor,
      props.director,
      props.creator,
      props.creatorsPageTitle,
      props.directorsPageTitle,
    ),
    keyword: extractElements<string>(
      props.genres?.genres,
      props.titleGenres?.genres,
      props.keywords?.edges,
      props.interests?.edges,
    ),
  };
}

function getHighQualityImageUrls(originalUrl: string) {
  if (!originalUrl) return null;

  // Extract the base part of the URL (before the resolution parameters)
  const baseUrlMatch = originalUrl.match(/(.*?)\._V1/);
  if (!baseUrlMatch) return { original: originalUrl };

  const baseUrl = baseUrlMatch[1];

  return {
    small: `${baseUrl}._V1_QL75_UX140_CR0,0,140,207_.jpg`, // 140px width
    medium: `${baseUrl}._V1_QL75_UX280_CR0,0,280,414_.jpg`, // 280px width
    large: `${baseUrl}._V1_QL75_UX380_CR0,0,380,562_.jpg`, // 380px width
    xLarge: `${baseUrl}._V1_QL75_UX500_CR0,0,500,740_.jpg`, // 500px width
    original: `${baseUrl}._V1_QL75_UY1000_CR0,0,675,1000_.jpg`, // Maximum quality
    raw: `${baseUrl}._V1_.jpg`, // Original without quality parameters
  };
}
// #endregion Private Functions

// #region Public Functions
export async function getImdbDetailsById(
  id: string,
): Promise<PARSE_TYPES.ImdbDetailsResult> {
  try {
    const html = await getHtmlFromUrl(`https://www.imdb.com/title/${id}/`);

    const $ = cheerio.load(html);

    const nextdataScriptString = $("#__NEXT_DATA__").html();
    const nextdataScriptJson = JSON.parse(nextdataScriptString ?? "");
    const pageProps = nextdataScriptJson.props.pageProps.aboveTheFoldData;

    const metadataScriptString = $('script[type="application/ld+json"]').html();
    const metadata = JSON.parse(metadataScriptString ?? "");

    return fillImdbDetailsResult({ ...pageProps, ...metadata });
  } catch (error) {
    console.error(error);
    throw new Error("Imdb parse error");
  }
}

export async function searchImdb(
  query: string,
  type: "film" | "series",
): Promise<PARSE_TYPES.SearchResult[]> {
  let title_type;
  switch (type) {
    case "film":
      title_type = "feature,tv_movie,short,tv_short";
      break;
    case "series":
      title_type = "tv_series,tv_miniseries";
      break;
  }

  const url = `https://www.imdb.com/search/title/?title=${encodeURIComponent(
    query,
  )}&title_type=${encodeURIComponent(title_type)}`;

  try {
    const html = await getHtmlFromUrl(url);

    const $ = cheerio.load(html);

    const results: PARSE_TYPES.SearchResult[] = [];

    // Select all list items that contain movie/show information
    $(".ipc-metadata-list-summary-item").each((_, element) => {
      const result: PARSE_TYPES.SearchResult = {
        description: null,
        image: null,
        keywords: [],
        link: null,
        title: null,
        year: null,
      };

      const titleElement = $(element).find(".dli-title h3.ipc-title__text");
      const rawTitle = titleElement.text();
      // result.rank = parseInt(rawTitle.split(".")[0]) || null;
      result.title = rawTitle.split(". ")[1] || rawTitle || null;

      const metadata = $(element).find(".dli-title-metadata-item");
      metadata.each((index, item) => {
        const text = $(item).text();
        if (index === 0) result.year = parseInt(text) || null;
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
        result.image = getHighQualityImageUrls(posterImg)?.large ?? null;
      }

      // Get movie/show URL
      const linkElement = $(element).find(".ipc-title-link-wrapper");
      if (linkElement.length) {
        result.link = "https://www.imdb.com" + linkElement.attr("href");
      }

      results.push(result);
    });

    return results;
  } catch (error) {
    console.error(error);
    throw new Error("Imdb parse error");
  }
}
// #endregion Public Functions
