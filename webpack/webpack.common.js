const Path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Webpack = require('webpack');


module.exports = {
  entry: {
    app: Path.resolve(__dirname, '../src/scripts/app.js')
  },
  output: {
    path: Path.join(__dirname, '../build'),
    filename: 'js/[name].js'
  },
  optimization: {
    minimize: true
  //   splitChunks: {
  //     chunks: 'all',
  //     name: false
  //   }
  },
  plugins: [
    new CleanWebpackPlugin(['build'], {
      root: Path.resolve(__dirname, '..')
    }),
    new CopyWebpackPlugin([{
      from: Path.resolve(__dirname, '../src/assets'),
      to: 'assets'
    }]),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: Path.resolve(__dirname, '../src/index.html')
    }),
    new Webpack.HotModuleReplacementPlugin(),
  ],
  resolve: {
    // alias: {
    //   '~': Path.resolve(__dirname, '../src')
    // }
  },
  module: {
    rules: [{
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      },
      {
        test: /\.(gif|jpg|png|jpe?g)$/i,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            useRelativePath: true,
            outputPath: 'assets/images',
            publicPath: ''
          }
        }]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|svg)$/i,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            useRelativePath: true,
            outputPath: 'assets/fonts',
            publicPath: ''
          }
        }]
      }
    ]
  }
};