declare module 'kuroshiro' {
  export interface KuroshiroOptions {
    mode?: 'normal' | 'spaced' | 'okurigana' | 'furigana' | 'romaji';
    romajiSystem?: 'nippon' | 'passport' | 'hepburn';
    to?: 'hiragana' | 'katakana' | 'romaji';
  }

  export default class Kuroshiro {
    constructor();
    init(analyzer: unknown): Promise<void>;
    convert(text: string, options: KuroshiroOptions): Promise<string>;
  }
}

declare module 'kuroshiro-analyzer-kuromoji' {
  export default class KuromojiAnalyzer {
    constructor(options?: { dictPath?: string });
  }
}
