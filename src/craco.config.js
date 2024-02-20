const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      return {
        ...webpackConfig,
        resolve: {
          ...webpackConfig.resolve,
          fallback: {
            crypto: require.resolve('crypto-browserify'),
            stream: require.resolve('stream-browserify'),
            buffer: require.resolve('buffer'),
            // add other polyfills you need here
          },
        },
        plugins: [
          ...webpackConfig.plugins,
          new webpack.ProvidePlugin({
            process: 'process/browser', // if you need a process polyfill
            Buffer: ['buffer', 'Buffer'], // if you need a Buffer polyfill
          }),
        ],
      };
    },
  },
};
