import { IMDB_TYPES } from "../types";
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

function fillImdbDetailsResult(props: any): IMDB_TYPES.ImdbDetailsResult {
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
    year: {
      release: props.releaseYear?.year || null,
      end: props.releaseYear?.endYear || null,
    },
    runtime: {
      seconds: props.runtime?.seconds || null,
      text: props.runtime?.displayableProperty?.value?.plainText || null,
    },
    rating: props.ratingsSummary?.aggregateRating || null,
    contentRating: {
      isAdult: props.isAdult || null,
      rating: props.contentRating || null,
    },
    production: extractElements<string>(props.production?.edges),
    people: extractElements<string>(
      props.castPageTitle?.edges,
      props.actor,
      props.director,
      props.creator,
      props.creatorsPageTitle,
      props.directorsPageTitle,
    ),
    keywords: extractElements<string>(
      props.genres?.genres,
      props.titleGenres?.genres,
      props.keywords?.edges,
      props.interests?.edges,
    ),
  };
}
// #endregion Private Functions

// #region Public Functions
export async function getImdbDetailsByUrl(
  url: string,
): Promise<IMDB_TYPES.ImdbDetailsResult> {
  try {
    const html = await getHtmlFromUrl(url);

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
): Promise<IMDB_TYPES.ImdbSearchResult[]> {
  const url = `https://www.imdb.com/find/?q=${encodeURIComponent(
    query,
  )}&ref_=nv_sr_sm`;

  try {
    const html = await getHtmlFromUrl(url);

    const $ = cheerio.load(html);

    const results: IMDB_TYPES.ImdbSearchResult[] = [];

    $("li.find-title-result").each((_, element) => {
      const titleElement = $(element).find(
        ".ipc-metadata-list-summary-item__t",
      );
      const title = titleElement.text();
      const link = titleElement.attr("href");
      const imageElement = $(element).find("img.ipc-image");
      const image = imageElement.attr("src") ?? null;

      const yearText = $(element).find(".ipc-inline-list__item").first().text();
      let year = null;
      const match = yearText.match(/\b\d{4}\b/g);
      if (match && match[0]) {
        year = parseInt(match[0]);
      }

      results.push({
        title,
        link: `https://www.imdb.com${link}`,
        image,
        year,
      });
    });

    return results;
  } catch (error) {
    console.error(error);
    throw new Error("Imdb parse error");
  }
}
// #endregion Public Functions
