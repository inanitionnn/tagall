import * as cheerio from "cheerio";
import axios from "axios";
import { GetSelectorAndRegex } from "../../open-ai/services";
import type { ContextType } from "../../../../types";
import type { Prisma } from "@prisma/client";
import type { ParseRegrexInputType, ParseRegrexResult } from "../types";

async function getHtmlFromUrl(url: string): Promise<string> {
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
  } catch (error) {
    throw new Error(`Failed to fetch HTML: ` + String(error));
  }
}

function extractDataFromHtml(
  html: string,
  selector: string,
  textRegex: RegExp,
): { title: string; year?: number }[] {
  const $ = cheerio.load(html);
  const results: { title: string; year?: number }[] = [];

  $(selector).each((_, element) => {
    const text = $(element).text().trim();
    const match = text.match(textRegex);
    if (match?.[1]) {
      results.push({
        title: match[1].trim(),
        year: match[2] ? Number(match[2]) : undefined,
      });
    }
  });

  return results;
}

async function parseMediaList(props: ParseRegrexInputType) {
  const { url, htmlQuery, userMessage } = props;

  const html = await getHtmlFromUrl(url);

  const { regex, selector } = await GetSelectorAndRegex(htmlQuery, userMessage);

  return extractDataFromHtml(html, selector, new RegExp(regex));
}

type UserItemWithItem = Prisma.UserToItemGetPayload<{
  include: {
    item: true;
  };
}>;

export async function ParseRegrex(props: {
  ctx: ContextType;
  input: ParseRegrexInputType;
}): Promise<ParseRegrexResult[]> {
  const { ctx, input } = props;
  const parsedMedias: ParseRegrexResult[] = await parseMediaList(input);

  const userItems = await ctx.db.userToItem.findMany({
    where: {
      OR: parsedMedias.map((media) => ({
        userId: ctx.session.user.id,
        item: {
          title: media.title,
          year: media.year,
        },
      })),
    },
    include: {
      item: true,
    },
  });

  const mediaToUserItem: Record<string, UserItemWithItem> = {};

  for (const media of parsedMedias) {
    const userItem = userItems.find(
      (userItem) => userItem.item.title === media.title,
    );

    if (userItem) {
      mediaToUserItem[media.title] = userItem;
    }
  }

  return parsedMedias
    .map((media) => {
      const userItem = mediaToUserItem[media.title];
      if (userItem) {
        const {
          rate,
          status,
          item: { title, year, id },
        } = userItem;
        return { id, title, year, rate, status };
      }
      return media;
    })
    .sort((a, b) => +(a.id !== null) - +(b.id !== null)); // first items without id
}
