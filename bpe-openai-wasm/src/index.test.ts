import { Tokenizer, TokenizerModel, TOKENIZER_MODELS } from './index';

// Get all model values from the TOKENIZER_MODELS object
const models = Object.values(TOKENIZER_MODELS);

describe('Tokenizer', () => {
  let tokenizer: Tokenizer;

  beforeAll(async () => {
    tokenizer = await Tokenizer.create(TOKENIZER_MODELS.CL100K_BASE);
  });

  test('should encode text', () => {
    const text = 'Hello, world!';
    const tokens = tokenizer.encode(text);
    expect(tokens.length).toBeGreaterThan(0);
    expect(tokens.every(token => typeof token === 'number')).toBe(true);
  });

  test('should decode tokens', () => {
    const text = 'Hello, world!';
    const tokens = tokenizer.encode(text);
    const decoded = tokenizer.decode(tokens);
    expect(decoded).toBe(text);
  });

  test('should count tokens', () => {
    const text = 'Hello, world!';
    const count = tokenizer.count(text);
    const tokens = tokenizer.encode(text);
    expect(count).toBe(tokens.length);
  });

  test('should work with different models', async () => {
    const o200kTokenizer = await Tokenizer.create(TOKENIZER_MODELS.O200K_BASE);
    const text = 'Hello, world!';
    const tokens = o200kTokenizer.encode(text);
    expect(tokens.length).toBeGreaterThan(0);
  });

  test('should handle repeated characters', () => {
    const repeatedText = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
    const tokens = tokenizer.encode(repeatedText);
    const decoded = tokenizer.decode(tokens);
    expect(decoded).toBe(repeatedText);
    expect(tokens.length).toBeGreaterThan(0);
  });

  describe('roundtrip encoding/decoding', () => {
    const testCases = [
      'Hello, world!',
      'This is a test with some special characters: !@#$%^&*()',
      'Mixed case TeXt with numbers 123 and symbols @#$',
      'Unicode characters: 你好, 世界!',
      'Multiple lines\nof text\nwith line breaks',
      '   Spaces   and   tabs\t\t\t',
      'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', // repeated characters
      'The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog.', // repeated phrases
    ];

    test.each(models)('should roundtrip encode/decode with %s model', async (model) => {
      const tokenizer = await Tokenizer.create(model);
      
      for (const text of testCases) {
        const tokens = tokenizer.encode(text);
        const decoded = tokenizer.decode(tokens);
        expect(decoded).toBe(text);
      }
    });
  });
});