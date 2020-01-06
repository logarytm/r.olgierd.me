const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');
const CssoWebpackPlugin = require('csso-webpack-plugin').default;
const pkg = require('../../package.json');

module.exports = {
    mode: 'production',
    entry: {
        main: './src/index.js',
    },
    output: {
        publicPath: '/',
        path: `${__dirname}/../../build`,
        filename: '[hash].js',
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
                        loader: MiniCssExtractPlugin.loader,
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
            filename: 'index.html',
        }),
        new MiniCssExtractPlugin({
            filename: '[id].[hash].css',
        }),
        new CssoWebpackPlugin(),
        new CopyWebpackPlugin([
            { from: 'src/favicon.ico' },
        ]),
    ],
};
