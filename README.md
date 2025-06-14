# `bpe-openai-wasm`

A WebAssembly replacement for [OpenAI's tiktoken](https://github.com/openai/tiktoken) that's [around 4x faster](https://github.blog/ai-and-ml/llms/so-many-tokens-so-little-time-introducing-a-faster-more-flexible-byte-pair-tokenizer/) and [supports repeated characters](https://github.com/openai/tiktoken/issues/195) based on [Github's `bpe` implementation](https://github.com/github/rust-gems/tree/main/crates/bpe).

Use this as a replacement for `tiktoken` in your JS/TS projects.

## Features

- **Fast BPE tokenization** using Rust and WebAssembly
- **Multiple tokenizer models**: cl100k_base, o200k_base, voyage3_base
- **TypeScript support** with full type definitions
- **Async API** with proper WASM initialization
- **Comprehensive methods**: encode, decode, and count tokens

## Installation

```bash
npm install --save bpe-openai-wasm
```

## Usage

```typescript
import { Tokenizer, TOKENIZER_MODELS } from './bpe-openai-wasm';

// Create a tokenizer instance
const tokenizer = new Tokenizer("o200k_base")

// Encode text to tokens
const tokens = tokenizer.encode("Hello, world!");
console.log(tokens); // Uint32Array

// Count tokens without encoding
const count = tokenizer.count("Hello, world!");
console.log(count); // number

// Decode tokens back to text
const text = tokenizer.decode(tokens);
console.log(text); // "Hello, world!"
```

### Usage in Next.js Projects

Cry

## Available Models

- `cl100k_base` - Used by GPT-4, GPT-3.5-turbo
- `o200k_base` - Used by GPT-4o, oX models
- `voyage3_base` - Used by Voyage AI models

## Architecture

The project consists of three layers:

1. **Core Tokenizers** (`rust-gems/crates/bpe-openai/`): Fast BPE implementations with pre-built tokenizer data
2. **WASM Bindings** (`bpe-openai-wasm/src/lib.rs`): Rust-to-WASM bridge using wasm-bindgen
3. **TypeScript API** (`bpe-openai-wasm/src/index.ts`): High-level async API for JavaScript/TypeScript

## License

MIT