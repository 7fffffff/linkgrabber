var webpack = require('webpack');
var config = {
  entry: {
    background: './src/background.js',
    contentscript: './src/contentscript.js',
    links: './src/links.js',
    options: './src/options.js',
  },
  output: {
    path: './js/',
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
            options: {
              presets: ['es2015', 'react'],
            },
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
  plugins: [
    new webpack.EnvironmentPlugin('NODE_ENV')
  ],
};

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    beautify: true,
    compress: true,
    mangle: false
  }));
} else {
  config.devtool = 'cheap-module-source-map';
}

module.exports = config;
