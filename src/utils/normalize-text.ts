/**
 * Normalizes text by converting to lowercase and trimming whitespace
 * Used to ensure consistent storage and searching of text fields
 * 
 * @param text - Text to normalize
 * @returns Normalized text (lowercase + trimmed)
 * 
 * @example
 * normalizeText("  Action  ") // "action"
 * normalizeText("DRAMA") // "drama"
 * normalizeText("") // ""
 */
export function normalizeText(text: string | null | undefined): string {
  if (!text) return "";
  return text.toLowerCase().trim();
}

/**
 * Normalizes an array of text values
 * Filters out empty values after normalization
 * 
 * @param texts - Array of texts to normalize
 * @returns Array of normalized texts (non-empty only)
 * 
 * @example
 * normalizeTexts(["  Action  ", "DRAMA", ""]) // ["action", "drama"]
 */
export function normalizeTexts(texts: (string | null | undefined)[]): string[] {
  return texts
    .map(normalizeText)
    .filter(text => text.length > 0);
}
