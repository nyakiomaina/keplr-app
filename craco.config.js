const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      const rule = webpackConfig.module.rules.find(r => r.oneOf);
      if (rule && rule.oneOf) {
        const assetResource = rule.oneOf.find(r => r.type === 'asset/resource');
        if (assetResource) {
          if (!assetResource.exclude) {
            assetResource.exclude = [];
          }
          assetResource.exclude.push(/\.wasm$/);
        }
      }

      webpackConfig.experiments = {
        ...webpackConfig.experiments,
        asyncWebAssembly: true,
        layers: true,
      };

      return {
        ...webpackConfig,
        resolve: {
          ...webpackConfig.resolve,
          fallback: {
            crypto: require.resolve('crypto-browserify'),
            stream: require.resolve('stream-browserify'),
            buffer: require.resolve('buffer'),
            // Add other polyfills as needed
          },
        },
        plugins: [
          ...webpackConfig.plugins,
          new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
          }),
        ],
      };
    },
  },
};
