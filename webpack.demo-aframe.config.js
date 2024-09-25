const path = require('path');
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.config.js');

module.exports = merge(baseConfig, {
  mode: 'development',
  devServer: {
    static: [
      {
        directory: path.join(__dirname, 'demo-aframe'),
        publicPath: '/',
      },
      {
        directory: path.join(__dirname, 'dist'),
        publicPath: '/',
      },
    ],
    compress: false,
    port: 9000,
  },
});