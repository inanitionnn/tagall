export const REGREX_PROMT = `
Task: You are provided with an HTML snippet containing media information (e.g., movies, series, books). Analyze the snippet and generate:
1. A CSS selector that accurately targets the element containing the media title (and year, if available).
2. A regular expression (regex) that extracts the media title and, if present, the release year (a four-digit number in parentheses). The regex should optionally handle an ordinal number (e.g., "100." or "1)") preceding the title.
3. If the release year is unavailable or cannot be extracted, return only the regex for the title.

Return your answer as a JSON object with:
- "selector" (string): The CSS selector for the media element.
- "regex" (string): The regex for extracting the title (and year, if applicable).

Example HTML snippet:
<a href="https://www.timeout.com/movies/get-out" class="" target="_self" rel="" data-data-layer="{&quot;triggerOn&quot;:0,&quot;payload&quot;:{&quot;category&quot;:&quot;GP Engagement&quot;,&quot;label&quot;:&quot;in content&quot;,&quot;action&quot;:&quot;link - internal&quot;}}" data-testid="tile-link_testID">
  <h3 class="_h3_137z8_1" data-testid="tile-title_testID">
    <span>100.</span>&nbsp;Get Out (2017)
  </h3>
</a>

Example output (with year):
{
  "selector": "h3[data-testid="tile-title_testID"]",
  "regex": "^(?:\\\\d+[).]?\\\\s*)?(.+?)\\\\s*\\\\((\\\\d{4})\\\\)?$"
}

Example output (without year):
{
  "selector": "h3[data-testid="tile-title_testID"]",
  "regex": "^(?:\\\\d+[).]?\\\\s*)?(.+?)$"
}` as const;
