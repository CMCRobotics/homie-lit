const path = require('path');
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.config.js');

module.exports = merge(baseConfig, {
    entry: './src/index.ts',
    output: {
        filename: 'homie-lit.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'HomieLit',
        libraryTarget: 'umd',
        globalObject: 'this',
        clean: true
      }
  });