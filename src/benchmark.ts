import { Tokenizer, TOKENIZER_MODELS } from './index';
import { get_encoding } from 'tiktoken';
import { readFileSync } from 'fs';
import { join } from 'path';

interface BenchmarkResult {
  name: string;
  tokensPerSecond: number;
  avgTimeMs: number;
  totalTokens: number;
}

// Load test texts from fixture files
function loadFixture(filename: string): string {
  return readFileSync(join(__dirname, '..', 'fixtures', filename), 'utf-8');
}

// Test texts of various sizes and complexity
const testTexts = {
  short: "Hello, world!",
  medium: "The quick brown fox jumps over the lazy dog. This is a test of the emergency broadcast system. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  long: `
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

The technology sector has been experiencing unprecedented growth over the past decade, with artificial intelligence and machine learning leading the charge. Companies are investing billions of dollars in research and development to create more sophisticated algorithms that can process natural language, recognize images, and make decisions with human-like accuracy.
  `.trim(),
  
  // Load longer texts from fixtures
  prideAndPrejudice: loadFixture('pride-and-prejudice.txt'),
  aliceInWonderland: loadFixture('alice-in-wonderland.txt'),
  technicalDoc: loadFixture('technical-doc.txt'),
  repeatedChars: loadFixture('repeated-chars.txt'),
  veryLong: loadFixture('very-long.txt'),
  code: loadFixture('code-sample.txt'),
  unicode: loadFixture('unicode.txt')
};

function formatNumber(num: number): string {
  return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

function formatTime(ms: number): string {
  if (ms < 1) {
    return `${(ms * 1000).toFixed(2)}μs`;
  } else if (ms < 1000) {
    return `${ms.toFixed(2)}ms`;
  } else {
    return `${(ms / 1000).toFixed(2)}s`;
  }
}

async function benchmarkTokenizer(
  name: string,
  encode: (text: string) => any,
  testText: string,
  iterations: number = 1000
): Promise<BenchmarkResult> {
  // Warmup
  for (let i = 0; i < 10; i++) {
    encode(testText);
  }
  
  const times: number[] = [];
  let totalTokens = 0;
  
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    const tokens = encode(testText);
    const end = performance.now();
    
    times.push(end - start);
    totalTokens = Array.isArray(tokens) ? tokens.length : tokens.length;
  }
  
  const avgTimeMs = times.reduce((a, b) => a + b, 0) / times.length;
  const tokensPerSecond = (totalTokens / avgTimeMs) * 1000;
  
  return {
    name,
    tokensPerSecond,
    avgTimeMs,
    totalTokens
  };
}

async function runBenchmarks() {
  console.log('🚀 Starting Tokenizer Performance Benchmarks\n');
  console.log('Comparing WASM Tokenizer vs tiktoken\n');
  
  // Initialize tokenizers
  console.log('Initializing tokenizers...');
  const wasmTokenizer = await Tokenizer.create(TOKENIZER_MODELS.CL100K_BASE);
  const tiktokenEnc = get_encoding('cl100k_base');
  
  const iterations = 1000;
  console.log(`Running ${iterations} iterations per test...\n`);
  
  for (const [textName, text] of Object.entries(testTexts)) {
    console.log(`📊 Benchmarking: ${textName.toUpperCase()} TEXT (${text.length} chars)`);
    console.log('─'.repeat(60));
    
    // Benchmark WASM tokenizer
    const wasmResult = await benchmarkTokenizer(
      'WASM Tokenizer',
      (text) => wasmTokenizer.encode(text),
      text,
      iterations
    );
    
    // Benchmark tiktoken
    const tiktokenResult = await benchmarkTokenizer(
      'tiktoken',
      (text) => tiktokenEnc.encode(text),
      text,
      iterations
    );
    
    // Calculate speedup
    const speedup = wasmResult.tokensPerSecond / tiktokenResult.tokensPerSecond;
    const timeRatio = tiktokenResult.avgTimeMs / wasmResult.avgTimeMs;
    
    console.log(`Tokens: ${wasmResult.totalTokens}`);
    console.log('');
    console.log('PERFORMANCE RESULTS:');
    console.log(`WASM Tokenizer: ${formatNumber(wasmResult.tokensPerSecond)} tokens/sec (${formatTime(wasmResult.avgTimeMs)} avg)`);
    console.log(`tiktoken:       ${formatNumber(tiktokenResult.tokensPerSecond)} tokens/sec (${formatTime(tiktokenResult.avgTimeMs)} avg)`);
    console.log('');
    
    if (speedup > 1) {
      console.log(`🏆 WASM is ${speedup.toFixed(2)}x FASTER (${timeRatio.toFixed(2)}x faster per operation)`);
    } else {
      console.log(`📉 WASM is ${(1/speedup).toFixed(2)}x slower (${(1/timeRatio).toFixed(2)}x slower per operation)`);
    }
    
    console.log('\n' + '='.repeat(60) + '\n');
  }
}

// Run benchmarks if this file is executed directly
if (require.main === module) {
  runBenchmarks().catch(console.error);
}

export { runBenchmarks };