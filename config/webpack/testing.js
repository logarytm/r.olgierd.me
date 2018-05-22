module.exports = Object.assign({}, require('./production'), {
    entry: {
        main: './src/tests/index.js',
    },
    output: {
        path: `${__dirname}/../../build/tests`,
        filename: 'index.js',
    },
    devtool: 'source-map',
    node: {
        fs: 'empty',
    },
    plugins: [],
});
