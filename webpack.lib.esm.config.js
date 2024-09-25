const path = require('path');
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.lib.baseconfig.js');

module.exports = merge(baseConfig, {
  mode: 'production',
  entry: './src/index.ts',
  output: {
    filename: 'homie-lit.esm.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      type: 'module'
    }
  },
  experiments: {
    outputModule: true
  },
  externals: {
    'lit': 'lit',
    'rxjs': 'rxjs',
    'mqtt': 'mqtt'
  },
  target: ['web', 'es2015']
});
