import resolve from 'rollup-plugin-node-resolve';
import babelrc from 'babelrc-rollup';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';
import url from 'rollup-plugin-url';
import pcssUrl from 'postcss-url';
import browsersync from 'rollup-plugin-browsersync';
import minify from 'rollup-plugin-minify-es';
import path from 'path';

function resolvePath(dir) {
    return path.join(__dirname, dir);
}

const isDev = process.env.NODE_ENV === 'development';

const babelConfig = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    browsers: ['last 2 versions'],
                },
                modules: false,
                useBuiltIns: 'entry',
            },
        ],
        '@babel/preset-stage-2',
    ],
};

export default {
    input: resolvePath('./src/App.js'),
    output: [
        {
            file: resolvePath('./dist/rambler-map.js'),
            format: 'umd',
            name: 'evergis',
        },
    ],
    watch: {
        chokidar: true,
        include: 'src/**',
        clearScreen: true,
    },
    sourceMap: true,
    plugins: [
        resolve(),
        commonjs(),
        url({
            limit: 1024 * 1024, // inline files < 1mb, copy files > 1mb
            emitFiles: true, // defaults to true
        }),
        postcss({
            modules: true,
            minimize: true,
            plugins: [
                pcssUrl({
                    url: 'inline',
                }),
            ],
        }),
        babel(
            babelrc({
                addExternalHelpersPlugin: false,
                config: babelConfig,
                include: 'node_modules/**',
            }),
        ),
    ].concat(isDev ? [browsersync({ server: resolvePath('./') })] : [minify()]),
};
