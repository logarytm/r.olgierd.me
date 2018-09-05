const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');
const pkg = require('../../package.json');

module.exports = {
    entry: {
        main: './src/index.js',
    },
    output: {
        publicPath: '/',
        path: `${__dirname}/../../build`,
        filename: '[hash].js',
    },
    optimization: {
        minimizer: [new UglifyjsWebpackPlugin({
            uglifyOptions: {
                keep_fnames: true,
            },
        })],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [require('autoprefixer')],
                        },
                    },
                    {
                        loader: 'sass-loader',
                    },
                ],
            },
            {
                test: /\.(png|jpg|svg)$/,
                loader: 'url-loader?limit=10240',
            },
        ],
    },
    resolve: {
        alias: {
            '~': `${__dirname}/../../src`,
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Loading…',
            template: 'src/index.html',
        }),
        new CopyWebpackPlugin([
            { from: 'src/favicon.ico' },
        ]),
    ],
};
