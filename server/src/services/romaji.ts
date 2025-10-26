import Kuroshiro from 'kuroshiro';
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji';

let kuroshiro: Kuroshiro;
let isInitialized = false;

export async function initializeRomaji() {
  if (isInitialized) return;

  kuroshiro = new Kuroshiro();
  await kuroshiro.init(new KuromojiAnalyzer());
  isInitialized = true;
}

export async function convertToRomaji(text: string): Promise<string> {
  if (!isInitialized) {
    await initializeRomaji();
  }

  try {
    // Convert to romaji with Hepburn romanization
    const romaji = await kuroshiro.convert(text, {
      mode: 'spaced',
      to: 'romaji',
      romajiSystem: 'hepburn',
    });
    return romaji;
  } catch (error) {
    console.error('Error converting to romaji:', error);
    return ''; // Return empty string if conversion fails
  }
}

export async function isJapaneseText(text: string): Promise<boolean> {
  // Simple check for Japanese characters
  const japaneseRegex = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/;
  return japaneseRegex.test(text);
}
