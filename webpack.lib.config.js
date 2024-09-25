const path = require('path');
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.lib.baseconfig.js');

module.exports = merge(baseConfig, {
    mode: 'production'
  });