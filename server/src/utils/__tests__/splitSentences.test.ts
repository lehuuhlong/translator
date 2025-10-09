import { splitSentences } from '../src/utils/splitSentences';

describe('splitSentences', () => {
  it('should handle empty string', () => {
    expect(splitSentences('')).toEqual([]);
  });

  it('should split on standard punctuation', () => {
    const text = 'Hello. How are you? I am fine!';
    expect(splitSentences(text)).toEqual(['Hello.', 'How are you?', 'I am fine!']);
  });

  it('should handle Japanese punctuation', () => {
    const text = 'こんにちは。元気ですか？はい！';
    expect(splitSentences(text)).toEqual(['こんにちは。', '元気ですか？', 'はい！']);
  });

  it('should preserve newlines', () => {
    const text = 'Line one.\nLine two.\nLine three.';
    expect(splitSentences(text)).toEqual(['Line one.', '\n', 'Line two.', '\n', 'Line three.']);
  });

  it('should handle mixed punctuation', () => {
    const text = 'Hello。How are you？I am fine!';
    expect(splitSentences(text)).toEqual(['Hello。', 'How are you？', 'I am fine!']);
  });
});
