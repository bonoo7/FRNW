/**
 * Metro bundler configuration for Expo
 * This file ensures proper bundling for Android builds
 */

const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Configure resolver
config.resolver = {
  ...config.resolver,
  extraNodeModules: {
    buffer: path.resolve(__dirname, 'node_modules/buffer/'),
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    vm: require.resolve('vm-browserify'),
  },
  // Source extensions
  sourceExts: [...(config.resolver.sourceExts || []), 'jsx', 'js', 'ts', 'tsx', 'json'],
  // Asset extensions
  assetExts: [...(config.resolver.assetExts || []).filter(ext => ext !== 'svg'), 'webp'],
};

// Configure transformer
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
  minifierConfig: {
    keep_classnames: true,
    keep_fnames: true,
    mangle: {
      keep_classnames: true,
      keep_fnames: true,
    },
  },
};

module.exports = config;
