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
      { test: /\.css$/, exclude: /\.useable\.css$/, loader: 'style!css' },
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.useable\.css$/, loader: 'style/useable!css' }
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
