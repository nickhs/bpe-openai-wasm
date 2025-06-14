import { Tokenizer as WasmTokenizer, init_panic_hook } from 'bpe-openai-wasm';

export const TOKENIZER_MODELS = {
  CL100K_BASE: 'cl100k_base',
  O200K_BASE: 'o200k_base',
  VOYAGE3_BASE: 'voyage3_base',
} as const;

export type TokenizerModel = typeof TOKENIZER_MODELS[keyof typeof TOKENIZER_MODELS];

export class Tokenizer {
  private wasm: WasmTokenizer;

  private constructor(wasm: WasmTokenizer) {
    this.wasm = wasm;
  }

  static async create(model: TokenizerModel): Promise<Tokenizer> {
    init_panic_hook();
    const wasm = new WasmTokenizer(model);
    return new Tokenizer(wasm);
  }

  encode(text: string): Uint32Array {
    return this.wasm.encode(text);
  }

  decode(tokens: Uint32Array): string | undefined {
    return this.wasm.decode(tokens);
  }

  count(text: string): number {
    return this.wasm.count(text);
  }
} 