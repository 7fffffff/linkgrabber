var path = require('path');
var webpack = require('webpack');

var config = {
  mode: process.env.NODE_ENV || "development",
  context: path.resolve('./src/'),
  entry: {
    background: './background.js',
    contentscript: './contentscript.js',
    links: './links.js',
    options: './options.js',
  },
  output: {
    path: path.resolve('./js/'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          }
        ],
      },
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  externals: {
    'chrome': 'chrome',
  },
  optimization: {
    minimize: false,
    runtimeChunk: false,
    splitChunks: {
      cacheGroups: {
        commons: {
          name: 'preamble',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  devtool: 'cheap-module-source-map',
};

module.exports = config;
