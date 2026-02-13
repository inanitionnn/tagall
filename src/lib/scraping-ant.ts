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

type QueuedRequest<T> = {
  execute: () => Promise<T>;
  resolve: (value: T) => void;
  reject: (error: unknown) => void;
};

/**
 * Request queue to ensure only 1 concurrent ScrapingAnt request
 * ScrapingAnt free plan has a concurrency limit of 1
 */
class ScrapingAntQueue {
  private queue: QueuedRequest<string>[] = [];
  private isProcessing = false;

  async add<T>(request: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push({
        execute: request as () => Promise<string>,
        resolve: resolve as (value: string) => void,
        reject,
      } as QueuedRequest<string>);

      if (!this.isProcessing) {
        void this.processQueue();
      }
    });
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.queue.length > 0) {
      const request = this.queue.shift();
      if (!request) break;

      try {
        const result = await request.execute();
        request.resolve(result);
      } catch (error) {
        request.reject(error);
      }

      // Small delay between requests to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    this.isProcessing = false;
  }
}

const scrapingAntQueue = new ScrapingAntQueue();

/**
 * Internal function to make actual ScrapingAnt request
 */
async function makeScrapingAntRequest(
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

/**
 * Fetches HTML content from a URL using ScrapingAnt API with queuing and retry logic
 * Ensures only 1 concurrent request due to ScrapingAnt free plan limitation
 */
export async function fetchWithScrapingAnt(
  url: string,
  options: ScrapingAntOptions = {},
): Promise<string> {
  const maxRetries = 3;
  const baseDelay = 2000; // 2 seconds

  return scrapingAntQueue.add(async () => {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await makeScrapingAntRequest(url, options);
      } catch (error) {
        lastError = error as Error;

        // Check if it's a rate limit error
        const isConcurrencyError =
          error instanceof ScrapingAntError &&
          (error.message.includes("concurrency limit") ||
            error.message.includes("rate limit"));

        // Only retry on concurrency/rate limit errors
        if (isConcurrencyError && attempt < maxRetries - 1) {
          // Exponential backoff with jitter
          const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
          console.log(
            `ScrapingAnt concurrency limit hit, retrying in ${Math.round(delay)}ms (attempt ${attempt + 1}/${maxRetries})`,
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }

        // For other errors or last attempt, throw immediately
        throw error;
      }
    }

    // This should never be reached, but TypeScript needs it
    throw lastError ?? new Error("Failed to fetch from ScrapingAnt");
  });
}
