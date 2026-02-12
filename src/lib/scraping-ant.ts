import axios from "axios";
import { env } from "~/env";

type ScrapingAntOptions = {
  timeout?: number;
  waitForSelector?: string;
  browser?: boolean;
  proxyType?: "datacenter" | "residential";
};

type ScrapingAntErrorResponse = {
  detail: string;
};

export class ScrapingAntError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
  ) {
    super(message);
    this.name = "ScrapingAntError";
  }
}

/**
 * Fetches HTML content from a URL using ScrapingAnt API to bypass WAF and anti-bot systems
 */
export async function fetchWithScrapingAnt(
  url: string,
  options: ScrapingAntOptions = {},
): Promise<string> {
  const {
    timeout = 30,
    waitForSelector,
    browser = true,
    proxyType = "datacenter",
  } = options;

  const scrapingAntUrl = new URL("https://api.scrapingant.com/v2/general");
  scrapingAntUrl.searchParams.set("url", url);
  scrapingAntUrl.searchParams.set("x-api-key", env.SCRAPING_ANT_API_KEY);
  scrapingAntUrl.searchParams.set("browser", browser.toString());
  scrapingAntUrl.searchParams.set("timeout", timeout.toString());
  scrapingAntUrl.searchParams.set("proxy_type", proxyType);

  if (waitForSelector) {
    scrapingAntUrl.searchParams.set("wait_for_selector", waitForSelector);
  }

  try {
    const response = await axios.get<string>(scrapingAntUrl.toString(), {
      headers: {
        Accept: "text/html",
      },
      timeout: (timeout + 5) * 1000, // Add 5 seconds buffer for axios timeout
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data as ScrapingAntErrorResponse;
      const statusCode = error.response?.status;
      const errorMessage =
        errorData?.detail ?? error.message ?? "ScrapingAnt request failed";

      throw new ScrapingAntError(errorMessage, statusCode);
    }

    throw new ScrapingAntError(
      error instanceof Error ? error.message : "Unknown error occurred",
    );
  }
}
