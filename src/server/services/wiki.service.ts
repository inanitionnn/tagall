import { info } from "console";
import { WikiDetailsResult, WikiSearchResult } from "../types";
import { getHtmlFromUrl } from "./axios.service";
import * as cheerio from "cheerio";
import * as wtf from "wtf_wikipedia";

// #region Private Functions
function extractArray(...texts: (any | null)[]): string[] {
  const textArray = texts.map((t) => t.text).filter(Boolean) as string[];

  let result: string[] = [];
  for (const text of textArray) {
    const correctText = text.replace(/\([^)]*\)/g, "");
    let subArray: string[] = [correctText];
    if (correctText.includes("\n\n")) {
      subArray = correctText.split("\n\n");
    } else if (correctText.includes("\n")) {
      subArray = correctText.split("\n");
    } else if (correctText.includes("(")) {
      const arr = correctText.split("(");
      subArray = arr[0] ? [arr[0]] : [];
    }
    result = [...result, ...subArray];
  }

  return [...new Set(result)];
}

function getRangeYear(data: any, infobox: any): WikiDetailsResult["year"] {
  let startYear: number | null = null;
  let endYear: number | null = null;

  const getYearFromText = (text: string, index: number = 0): number | null => {
    const match = text.match(/\b\d{4}\b/g);
    if (!match) return null;
    return match[index] ? parseInt(match[index]) : null;
  };

  const startYearKeys = ["first", "first_aired", "startyr"];
  for (const key of startYearKeys) {
    if (startYear) break;
    startYear = getYearFromText(infobox[key].text);
  }
  const endYearKeys = ["last", "last_aired", "endyr"];
  for (const key of endYearKeys) {
    if (endYear) break;
    endYear = getYearFromText(infobox[key].text);
  }

  const date = infobox.date.text;
  if (date && !endYear) {
    startYear = getYearFromText(date);
    endYear = getYearFromText(date, 1);
  }

  if (!startYear) {
    const firstSection = data.section();
    if (firstSection) {
      startYear = getYearFromText(firstSection.text());
    }
  }

  return { release: startYear, end: endYear };
}

function getName(data: any, infobox: any): string | null {
  return data.title() || infobox.name.text || infobox.title.text || null;
}

function getImage(data: any): string | null {
  return data.image()?.json()?.url || null;
}

function getPlot(data: any): any | null {
  let plotSection: any | null = null;
  const sections = [
    "Plot",
    "Plot summary",
    "Overview",
    "Summary",
    "Synopsis",
    "Premise",
  ];
  for (const section of sections) {
    if (plotSection) break;
    plotSection = data.section(section);
  }
  if (!plotSection) {
    plotSection = data.sections()[0];
  }
  if (!plotSection) return null;

  const paragraphs = plotSection.paragraphs();
  if (paragraphs[0]) {
    return paragraphs[0].text();
  }
  if (paragraphs[1]) {
    return paragraphs[1].text();
  }
  return null;
}

function getRuntime(infobox: any): WikiDetailsResult["runtime"] {
  const runTime = infobox.runtime.text;
  if (!runTime) return null;
  const minutes = parseInt(runTime.split(" ")[0]);
  const text = `${(minutes / 60) >> 0}h ${minutes % 60}m`;
  return {
    seconds: minutes * 60,
    text,
  };
}

// #endregion Private Functions

export async function getWikiDetailsByUrl(url: string) {
  try {
    const data: any | null = await wtf.fetch(url);
    if (!data) {
      throw new Error("Wiki parse error");
    }
    const infobox = data.infobox()?.json();

    const result: WikiDetailsResult = {
      title: getName(data, infobox),
      image: getImage(data),
      year: getRangeYear(data, infobox),
      plot: getPlot(data),
      country: extractArray(infobox.country),
      runtime: getRuntime(infobox),
      keywords: data.categories(),
      people: extractArray(
        infobox.author,
        infobox.writer,
        infobox.writers,
        infobox.director,
        infobox.directors,
        infobox.creator,
        infobox.creators,
        infobox.starring,
      ),
    };
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Wiki parse error");
  }
}

export async function searchWiki(query: string): Promise<WikiSearchResult[]> {
  const url = `https://en.wikipedia.org/w/index.php?title=Special:Search&limit=5&offset=0&ns0=1&search=${encodeURIComponent(
    query,
  )}`;

  try {
    const html = await getHtmlFromUrl(url);
    const $ = cheerio.load(html);

    const $listItems = $("ul.mw-search-results li");
    const links: string[] = [];
    $listItems.each((_, element) => {
      const resultUrl = $(element).find("a").attr("href");
      if (resultUrl) {
        const fullUrl = `https://en.wikipedia.org${resultUrl}`;
        links.push(fullUrl);
      }
    });
    links.filter(Boolean);

    /*
    Allows you to get title, link and image from search very fast.
    Not used because in most cases it does not contain an image.

    $listItems.each((_, element) => {
      const title = $(element).find("a").text();
      const resultUrl = $(element).find("a").attr("href");
      const imageUrl = $(element).find("img").attr("src")
        ? `https:${$(element).find("img").attr("src")}`
        : null;

      if (resultUrl) {
        const fullUrl = `https://en.wikipedia.org${resultUrl}`;
        links.push({
          title,
          url: fullUrl,
          imageUrl,
        });
      }
    });
    */

    const results: WikiSearchResult[] = [];
    for (const link of links) {
      const data: any | null = await wtf.fetch(link);
      if (!data) continue;
      const infobox = data.infobox()?.json();

      results.push({
        title: getName(data, infobox),
        image: getImage(data),
        year: getRangeYear(data, infobox),
        url: link,
      });
    }

    return results;
  } catch (err) {
    console.log(err);
    throw new Error("Wiki parse error");
  }
}
