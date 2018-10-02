import cleanup from "rollup-plugin-cleanup";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import executable from "rollup-plugin-executable";
import json from "rollup-plugin-json";
import pkg from "./package.json";
import babel from "rollup-plugin-babel";

const external = ["fs", "path"];

const plugins = [
  resolve(),
  commonjs(),
  babel({
    runtimeHelpers: false,
    externalHelpers: true,
    babelrc: false,
    presets: [
      [
        "@babel/preset-env",
        {
          targets: {
            safari: "tp"
          }
        }
      ]
    ],
    exclude: "node_modules/**"
  }),
  cleanup()
];

export default [
  ...Object.keys(pkg.bin || {}).map(name => {
    return {
      input: `src/${name}.mjs`,
      output: {
        file: pkg.bin[name],
        format: "es",
        banner:
          '#!/bin/sh\n":" //# comment; exec /usr/bin/env node --experimental-modules --experimental-worker "$0" "$@"',
        interop: false
      },
      plugins: [
        ...plugins,
        json({
          include: "package.json",
          preferConst: true,
          compact: true
        }),
        executable()
      ],
      external
    };
  }),
  {
    input: pkg.module,
    output: {
      file: pkg.main,
      format: "cjs",
      interop: false
    },
    plugins,
    external
  }
];
