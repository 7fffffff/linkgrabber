var webpack = require('webpack');
var plugins = [
  new webpack.EnvironmentPlugin('NODE_ENV')
];

if (process.env.NODE_ENV === 'production') {
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    beautify: true,
    compress: true,
    mangle: false
  }));
}

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
