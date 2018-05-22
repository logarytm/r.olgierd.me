module.exports = Object.assign({}, require('./production'), {
    devtool: 'source-map',
    devServer: {
        historyApiFallback: true,
    },
});
