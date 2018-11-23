module.exports = Object.assign({}, require('./production'), {
    mode: 'development',
    devtool: 'source-map',
    optimization: {},
    devServer: {
        historyApiFallback: true,
    },
});
