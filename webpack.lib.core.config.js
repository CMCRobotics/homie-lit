const path = require('path');
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.lib.baseconfig.js');

module.exports = merge(baseConfig, {
  mode: 'production',
  output: {
    filename: 'homie-lit.core.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'HomieLit',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  externals: {
    'lit': 'lit',
    'rxjs': 'rxjs',
    'mqtt': 'mqtt',
    'loglevel': 'loglevel'
  }
});
