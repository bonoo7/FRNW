const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// إصلاح مشكلة Node.js modules في React Native
config.resolver = {
  ...config.resolver,
  extraNodeModules: {
    buffer: require.resolve('buffer/'),
    fs: require.resolve('expo-file-system'),
  },
};

config.transformer = {
  ...config.transformer,
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
};

module.exports = config;
