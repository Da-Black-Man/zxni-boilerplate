const Path = require('path');
const Webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'cheap-eval-source-map',
  output: {
    chunkFilename: 'scripts/vendor.js'
  },
  module: {
    rules: [{
        test: /\.(js)$/,
        include: Path.resolve(__dirname, '../src'),
        enforce: 'pre',
        loader: 'eslint-loader',
        options: {
          emitWarning: true,
          // fix: true,
        }
      },
      {
        test: /\.(js)$/,
        include: Path.resolve(__dirname, '../src'),
        loader: 'babel-loader'
      },
      {
        test: /\.scss$/i,
        use: ['style-loader', 'css-loader?url=false', 'sass-loader?sourcMap']
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader', 'resolve-url-loader']
      },
    ]
  },
  plugins: [
    new Webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new Webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    inline: true,
    contentBase: Path.join(__dirname, '../src/assets'),
    publicPath: "/",
    host: '0.0.0.0',
    port: 8080,
    hot: true,
    open: true,
    before(app, server) {
      const files = [Path.join(__dirname, '../src/*.html')];
      const chokidar = require('chokidar');
      chokidar
        .watch(files, {
          alwaysStat: true,
          atomic: false,
          followSymlinks: false,
          ignoreInitial: true,
          ignorePermissionErrors: true,
          ignored: /(^|[\/\\])\../,
          interval: typeof poll === 'number' ? poll : null,
          persistent: true,
          usePolling: Boolean(false)
        })
        .on("all", () => {
          server.sockWrite(server.sockets, "content-changed");
        });
    }
  },
});