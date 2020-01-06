const Path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');



module.exports = {
  entry: {
    app: Path.resolve(__dirname, '../src/scripts/app.js')
  },
  output: {
    path: Path.join(__dirname, '../build'),
    filename: 'scripts/[name].js'
  },
  optimization: {
    // minimize: true,
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "all",
          enforce: true
        }
      },
      chunks: "all"
    }
    // splitChunks: {
    //   chunks: 'all',
    //   name: false
    // },
    // runtimeChunk: {
    //   name: "runtime"
    // }
  },

  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
        { from: Path.resolve(__dirname, '../src/assets'), to: 'assets' }
    ]),
    new HtmlWebpackPlugin({
      title: 'Home | Boilerplate',
      filename: 'index.html',
      minify:  false,
      template: Path.resolve(__dirname, '../src/index.html')
    }),
    new HtmlWebpackPlugin({
      title: 'Page | Boilerplate',
      filename: 'page.html',
      minify:  false,
      template: Path.resolve(__dirname, '../src/page.html')
    }),
    new HtmlWebpackPlugin({
      title: 'Image | Boilerplate',
      filename: 'image.html',
      minify:  false,
      template: Path.resolve(__dirname, '../src/image.html')
    })
  ],
  resolve: {
    alias: {
      '~': Path.resolve(__dirname, '../src')
    }
  },
  module: {
    rules: [{
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      },
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
          options: {
            interpolate: true,
            minimize: false,
          }
        }
      },
      {
        test: /\.(gif|jpg|png|jpe?g)$/i,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            useRelativePath: true,
            outputPath: 'assets/images',
            publicPath: '',
            esModule: false
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
            publicPath: '',
            esModule: false
          }
        }]
      }
    ]
  }
};
