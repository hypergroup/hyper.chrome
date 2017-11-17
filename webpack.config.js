/**
 * Module dependencies
 */

const webpack = require('webpack');

exports.entry = {
  background: __dirname + '/src/background/index.js',
  content: __dirname + '/src/content/index.js',
};

exports.output = {
  path: __dirname + '/browser',
  filename: '[name].js',
  libraryTarget: 'this'
};

exports.plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': `"#{process.env.NODE_ENV}"`,
  }),
];

if (process.env.MIN) exports.plugins.push(new webpack.optimize.UglifyJsPlugin({output: {comments: false}}));

exports.module = {
  loaders: [
    {
      test: /\.css$/,
      loader: 'style-loader!css-loader'
    },
    {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      options: {
        presets: ['@babel/preset-env'],
      }
    }
  ]
};
