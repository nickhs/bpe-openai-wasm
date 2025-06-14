# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a WebAssembly tokenizer project that wraps the Rust `bpe-openai` tokenizer for JavaScript/TypeScript usage. The project consists of:

- `bpe-openai-wasm/`: Main WASM wrapper crate with TypeScript bindings
- `rust-gems/`: Git subtree containing Rust algorithm implementations including the core `bpe-openai` tokenizer

## Build Commands

### WASM Package
```bash
cd bpe-openai-wasm
yarn build       # Builds WASM package with wasm-pack and compiles TypeScript
yarn test        # Runs Jest tests
```

### Core Rust Libraries (rust-gems/)
```bash
cd rust-gems
make build        # Build all Rust crates with all features and targets
make test         # Run all tests including doc tests
make lint         # Format check and clippy with strict settings
make format       # Format all Rust code
```

## Architecture

The project creates JavaScript bindings for OpenAI's tokenizers (cl100k_base, o200k_base, voyage3_base) using:

1. **Rust Layer** (`bpe-openai-wasm/src/lib.rs`): WASM bindings using wasm-bindgen that expose the core tokenizer functionality
2. **TypeScript Layer** (`bpe-openai-wasm/src/index.ts`): Higher-level TypeScript API that wraps the WASM module
3. **Core Tokenizers** (`rust-gems/crates/bpe-openai/`): Fast BPE implementations with pre-built tokenizer data

The TypeScript API provides an async factory pattern where `Tokenizer.create()` initializes the WASM module and returns a tokenizer instance with methods for `encode()`, `decode()`, and `count()`.

## Development Environment

This project uses devenv (Nix-based development environment) for consistent tooling. The main dependencies are managed through the devenv configuration.