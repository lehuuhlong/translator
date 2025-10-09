/**
 * Splits text into sentences while preserving delimiters and whitespace
 * @param text The text to split into sentences
 * @returns Array of sentences with their delimiters
 */
export function splitSentences(text: string): string[] {
  if (!text) return [];

  // Match sentence boundaries but keep the delimiters
  const pattern = /([^.!?。！？\n]+[.!?。！？\n]*)|\n/g;
  const matches = text.match(pattern);

  if (!matches) return [text];

  // Filter out empty strings but preserve newlines
  return matches.filter((sentence) => sentence.length > 0);
}
