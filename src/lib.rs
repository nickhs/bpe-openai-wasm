use wasm_bindgen::prelude::*;
use bpe_openai::{cl100k_base, o200k_base, voyage3_base};

#[wasm_bindgen]
pub struct Tokenizer {
    inner: &'static bpe_openai::Tokenizer,
}

#[wasm_bindgen]
impl Tokenizer {
    #[wasm_bindgen(constructor)]
    pub fn new(model: &str) -> Result<Tokenizer, JsError> {
        let inner = match model {
            "cl100k_base" => cl100k_base(),
            "o200k_base" => o200k_base(),
            "voyage3_base" => voyage3_base(),
            _ => return Err(JsError::new(&format!("Unknown model: {}", model))),
        };
        Ok(Tokenizer { inner })
    }

    #[wasm_bindgen]
    pub fn encode(&self, text: &str) -> Vec<u32> {
        self.inner.encode(text)
    }

    #[wasm_bindgen]
    pub fn decode(&self, tokens: &[u32]) -> Option<String> {
        self.inner.decode(tokens)
    }

    #[wasm_bindgen]
    pub fn count(&self, text: &str) -> usize {
        self.inner.count(text)
    }
}

#[wasm_bindgen]
pub fn init_panic_hook() {
    console_error_panic_hook::set_once();
}