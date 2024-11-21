import axios from "axios";

export async function GetHtmlFromUrl(url: string) {
  const response = await axios.get(url, {
    headers: {
      "Accept-Language": "en-US,en;q=0.9",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      Accept: "text/html",
    },
  });

  return response.data;
}
