const path = require('path');

module.exports = {
    devServer: {
        host: '127.0.0.1',
        port: 8080,
    },

    configureWebpack: {
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
                '@ui$': path.resolve(__dirname, 'src/ui/index.js'),
                '@assets': path.resolve(__dirname, 'src/assets'),
                '@components': path.resolve(__dirname, 'src/components'),
            },
            extensions: ['.js', '.ts', '.vue', '.json'],
        },
    },
};
