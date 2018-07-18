import istanbul from 'rollup-plugin-istanbul';

import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import multiEntry from 'rollup-plugin-multi-entry';

export default {
  input: 'tests/**/*-test.mjs',
  output: {
    file: 'build/bundle-test.mjs',
    format: 'cjs',
    sourcemap: true,
    interop: false
  },
  external: ['ava', 'fs', 'path'],
  plugins: [multiEntry(), resolve(), commonjs(), istanbul({
    exclude: ['tests/**/*-test.js']
  })]
};
