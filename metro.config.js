const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// إصلاح مشكلة Node.js modules في React Native
config.resolver = {
  ...config.resolver,
  extraNodeModules: {
    buffer: path.resolve(__dirname, 'node_modules/buffer/'),
  },
  blockList: [
    /react-native-svg\/src\/utils\/fetchData\.ts/,
  ],
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
