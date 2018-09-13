import cleanup from "rollup-plugin-cleanup";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import executable from "rollup-plugin-executable";
import pkg from "./package.json";
import babel from "rollup-plugin-babel";

const plugins = [
  resolve(),
  commonjs(),
  babel({
    runtimeHelpers: false,
    externalHelpers: true,
    babelrc: false,
    plugins: ["@babel/plugin-proposal-async-generator-functions"],
    presets: [
      [
        "env",
        {
          targets: {
            node: "10"
          },
          modules: false,
          loose: true
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
      input: `src/${name}.js`,
      output: {
        file: pkg.bin[name],
        format: "cjs",
        banner:
          "#!/usr/bin/env node --experimental-modules --experimental-worker",
        interop: false
      },
      plugins: [...plugins, executable()]
    };
  }),
  {
    input: pkg.module,
    output: {
      file: pkg.main,
      format: "cjs",
      interop: false
    },
    plugins
  }
];
