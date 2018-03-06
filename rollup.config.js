import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import postcss from "rollup-plugin-postcss";
import url from "rollup-plugin-url";
import pcssUrl from "postcss-url";
import browsersync from 'rollup-plugin-browsersync';

export default {
  input: "src/app.js",
  output: [
    {
      file: "dist/rambler-map.js",
      format: "umd",
      name: "evergis"
    }
  ],
  plugins: [
    resolve(),
    commonjs(),
    url({
      limit: 1024 * 1024, // inline files < 1mb, copy files > 1mb
      emitFiles: true // defaults to true
    }),
    postcss({
      modules: true,
      minimize: true,
      plugins: [
        pcssUrl({
          url: "inline"
        })
      ]
    }),
    babel({
      exclude: "node_modules/**"
    }),
    browsersync({server: './'})
  ],
}