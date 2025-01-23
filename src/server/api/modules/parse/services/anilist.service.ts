import axios from "axios";
import type {
  AnilistDetailsResultType,
  AnilistSearchResultType,
  SearchResultType,
} from "../types";
import { ANILIST_DETAILS_QUERY, ANILIST_SEARCH_QUERY } from "../constants";
import { Truthy } from "../../../../../lib";

function cleanText(input: string): string {
  const withoutTags = input.replace(/<[^>]*>/g, "");

  const withoutSource = withoutTags.replace(/\(.*?Source.*?\)/gi, "");

  const normalized = withoutSource.replace(/\s+/g, " ").trim();

  return normalized;
}

const url = "https://graphql.anilist.co";

export async function GetAnilistDetailsById(mediaId: string) {
  const variables = {
    mediaId: parseInt(mediaId),
  };

  const result: AnilistDetailsResultType = await axios.post(
    url,
    {
      query: ANILIST_DETAILS_QUERY,
      variables: variables,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
  );

  const {
    coverImage,
    id,
    title,
    chapters,
    description,
    genres,
    staff,
    startDate,
    tags,
    volumes,
  } = result.data.data.Media;

  return {
    image: coverImage?.extraLarge ?? null,
    id,
    year: startDate?.year ?? null,
    title: title.english ?? title.romaji ?? "",
    description: cleanText(description ?? ""),
    chapters,
    volumes,
    people: staff?.nodes.map((node) => node.name.full).filter(Truthy) ?? [],
    genres: (genres ?? []).filter(Truthy),
    keywords: tags?.map((tag) => tag.name).filter(Truthy),
  };
}

export async function SearchAnilist(
  query: string,
  limit = 10,
): Promise<SearchResultType[]> {
  const variables = {
    search: query,
    type: "MANGA",
    perPage: limit,
    sort: [],
    genreNotIn: ["Hentai"],
  };

  const result: AnilistSearchResultType = await axios.post(
    url,
    {
      query: ANILIST_SEARCH_QUERY,
      variables: variables,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
  );

  return result.data.data.Page.media.map((media) => {
    const description = media.description ?? null;
    const image = media.coverImage?.large ?? null;
    const parsedId = media.id.toString() ?? null;
    const title = media.title.english ?? media.title.romaji ?? "";
    const year = media.startDate?.year ?? null;
    const tags = media.tags?.map((tag) => tag.name) ?? [];
    const genres = media.genres ?? [];
    const keywords = [
      media.volumes ? `${media.volumes} volumes` : null,
      media.status,
      ...genres,
      ...tags,
    ].filter(Truthy);
    return {
      id: null,
      description: cleanText(description ?? ""),
      image,
      keywords,
      parsedId,
      title,
      year,
    };
  });
}
