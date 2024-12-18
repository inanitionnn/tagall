import axios from "axios";
import {
  AnilistDetailsResultType,
  AnilistSearchResultType,
  SearchResultType,
} from "../types";
import { ANILIST_DETAILS_QUERY, ANILIST_SEARCH_QUERY } from "../constants";

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
  } = result.data.Media;

  return {
    image: coverImage?.extraLarge ?? null,
    id,
    year: startDate?.year ?? null,
    title: title.english ?? title.romaji ?? "",
    description,
    chapters,
    volumes,
    people: staff?.nodes.map((node) => node.name.full).filter(Boolean) ?? [],
    keywords: [
      ...(tags?.map((tag) => tag.name) ?? []),
      ...(genres ?? []),
    ].filter(Boolean),
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

  return result.data.Page.media.map((media) => {
    const description = media.description ?? null;
    const image = media.coverImage?.medium ?? null;
    const link = `https://anilist.co/manga/${media.id}`;
    const parsedId = media.id.toString() ?? null;
    const title = media.title.english ?? media.title.romaji ?? "";
    const year = media.startDate?.year ?? null;
    const tags = media.tags?.map((tag) => tag.name) ?? [];
    const staff =
      (media.staff?.nodes
        .map((node) => node.name.full)
        .filter(Boolean) as string[]) ?? [];
    const genres = media.genres ?? [];
    const keywords = [
      media.status,
      media.countryOfOrigin,
      ...genres,
      ...tags,
      ...staff,
    ].filter(Boolean) as string[];
    return {
      description,
      image,
      keywords,
      link,
      parsedId,
      title,
      year,
      inCollection: false,
    };
  });
}
