/**
 * Module dependencies
 */

var webpack = require('webpack');

var SRC = __dirname + '/src';

var config = module.exports = {};

config.entry = {
  background: SRC + '/background/index.js',
  content: SRC + '/content/index.js',
  options: SRC + '/options/index.js'
};

config.output = {
  path: __dirname + '/chrome',
  filename: '[name].js',
  libraryTarget: 'this'
};

config.plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': '"' + process.env.NODE_ENV + '"'
  }),
];

if (process.env.MIN) config.plugins.push(new webpack.optimize.UglifyJsPlugin({output: {comments: false}}));

config.module = {
  loaders: [
    {test: /\.styl$/, loader: 'style-loader!css-loader!stylus-loader?paths=node_modules'}
  ]
}
