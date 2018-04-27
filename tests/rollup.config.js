import babel from 'rollup-plugin-babel';
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
  external: ['ava'],
  plugins: [
    multiEntry(),
    resolve(),
    commonjs(),
    babel({
      babelrc: false,
      presets: ['env'],
      exclude: 'node_modules/**'
    })
  ]
};
