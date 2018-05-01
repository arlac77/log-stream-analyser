import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import multiEntry from 'rollup-plugin-multi-entry';

export default {
  input: 'tests/**/*-test.js',
  output: {
    file: 'build/bundle-test.js',
    format: 'cjs',
    sourcemap: true
  },
  external: ['ava', 'fs', 'path'],
  plugins: [multiEntry(), resolve(), commonjs()]
};
