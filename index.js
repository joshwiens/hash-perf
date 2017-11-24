/* eslint-disable no-console */
const Benchmark = require('benchmark');
const benchmarks = require('beautify-benchmark');
const crypto = require('crypto');
const xxhashwasm = require('xxhash-wasm');
const XXHash = require('xxhash');
const XXHash64 = XXHash.XXHash64;
const XXH = require('xxhashjs');
const metrohash128 = require('metrohash').metrohash128;
const metrohash64 = require('metrohash').metrohash64;
const farmhash = require('farmhash');

const maxSingleByteChar = 0x7f;

function randomInputString(numBytes) {
  const strings = [];
  const numChunks = Math.ceil(numBytes / 1e5);
  for (let i = 1; i <= numChunks; i++) {
    const bytes =
      i === numChunks && numBytes % 1e5 !== 0 ? numBytes % 1e5 : 1e5;
    const codePoints = Array(bytes)
      .fill()
      .map(() => Math.floor(Math.random() * (maxSingleByteChar + 1)));
    strings.push(String.fromCodePoint(...codePoints));
  }
  return ''.concat(...strings);
}

const eventHandlers = {
  onCycle(event) {
    benchmarks.add(event.target);
  },
  onComplete() {
    benchmarks.log();
    console.log(
      `Benchmark ${this.name} - Fastest is: ${
        this.filter('fastest')[0].name
      }\n`,
    );
  },
};

const seed = 0;

async function runBench() {
  console.time('wasm setup');
  const { h32, h64 } = await xxhashwasm();
  console.timeEnd('wasm setup');

  for (let i = 1; i <= 1e8; i *= 10) {
    const suite = new Benchmark.Suite(`${i} bytes`, eventHandlers);
    const input = randomInputString(i);

    suite
      .add('xxhashjs#h32', () => {
        XXH.h32(input, seed).toString(16);
      })
      .add('xxhashjs#h64', () => {
        XXH.h64(input, seed).toString(16);
      })
      .add('xxhash-wasm#h32', () => {
        h32(input, seed);
      })
      .add('xxhash-wasm#h64', () => {
        h64(input, 0, seed);
      })
      .add('metrohash64', () => {
        metrohash64(input, seed);
      })
      .add('metrohash128', () => {
        metrohash128(input, seed);
      })
      .add('farmhash#h32', () => {
        farmhash.hash32WithSeed(input, seed);
      })
      .add('farmhash#h64', () => {
        farmhash.hash64WithSeed(input, seed);
      })
      .add('md4', () => {
        crypto
          .createHash('md4')
          .update(input)
          .digest('base64');
      })
      .add('md5', () => {
        crypto
          .createHash('md5')
          .update(input)
          .digest('base64');
      })
      .add('sha1', () => {
        crypto
          .createHash('sha1')
          .update(input)
          .digest('base64');
      })
      .run();
  }
}

runBench();
