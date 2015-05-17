var webpack = require('webpack');
var plugins = [
  new webpack.EnvironmentPlugin('NODE_ENV')
];

module.exports = {
  entry: {
    background: './src/background.js',
    contentscript: './src/contentscript.js',
    links: './src/links.js',
    options: './src/options.js'
  },
  output: {
    path: './js/',
    filename: '[name].js'
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, loader: 'babel-loader', exclude: /node_modules/ }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  externals: {
    'chrome': 'chrome'
  },
  plugins: plugins
};
