import istanbul from "rollup-plugin-istanbul";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import multiEntry from "rollup-plugin-multi-entry";
import babel from "rollup-plugin-babel";

export default {
  input: "tests/**/*-test.mjs",
  output: {
    file: "build/bundle-test.js",
    format: "cjs",
    sourcemap: true,
    interop: false
  },
  external: ["ava", "fs", "path"],
  plugins: [
    babel({
      runtimeHelpers: false,
      externalHelpers: true,
      babelrc: false,
      plugins: ["@babel/plugin-proposal-async-generator-functions"],
      presets: [
        [
          "@babel/preset-env",
          {
            targets: {
              safari: "tp"
            },
            modules: false
          }
        ]
      ],
      exclude: "node_modules/**"
    }),
    multiEntry(),
    resolve(),
    commonjs(),
    istanbul({
      exclude: ["tests/**/*-test.mjs", "node_modules/**/*"]
    })
  ]
};
