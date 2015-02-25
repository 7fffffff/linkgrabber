var webpack = require('webpack');
var plugins = [];
if (process.env.NODE_ENV === "production") {
  plugins.push(new webpack.DefinePlugin({
    'process.env.NODE_ENV': '"production"'
  }));
}

module.exports = {
  entry: {
    background: './src/background.js',
    contentscript: './src/contentscript.js',
    LinkList: './src/LinkList.jsx',
    Options: './src/Options.jsx'
  },
  output: {
    path: './js/',
    filename: '[name].js'
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, loader: 'jsx-loader?harmony' }
    ]
  },
  externals: {
    "react": "React"
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  plugins: plugins
};