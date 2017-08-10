const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const {
  BaseHrefWebpackPlugin,
  GlobCopyWebpackPlugin
} = require('@angular/cli/plugins/webpack')

const { root } = require('./tools/webpack-helpers')

const { ContextReplacementPlugin, ProgressPlugin, optimize } = webpack
const { CommonsChunkPlugin } = optimize

module.exports = {
  entry: {
    app: './src/app/main.ts',
    polyfills: './src/app/polyfills.ts'
    // vendor: './src/app/vendor.js'
  },

  output: {
    path: root('dist', 'app'),
    // publicPath: '/',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js'
  },

  resolve: {
    extensions: ['.ts', '.js', '.json']
  },

  devtool: 'inline-source-map',

  watchOptions: {
    aggregateTimeout: 1000,
    ignored: ['node_modules', 'dist']
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        loaders: [
          {
            loader: 'awesome-typescript-loader',
            options: { configFileName: './tsconfig.json' }
          },
          'angular2-template-loader'
        ]
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff2?|(t|o)tf|eot|ico)$/,
        loader: 'file-loader?name=assets/[name].[hash].[ext]'
      },
      {
        test: /\.css$/,
        exclude: root('src', 'app'),
        loader: ExtractTextPlugin.extract({
          use: 'postcss-loader',
          fallback: 'style-loader'
        })
      },
      {
        test: /\.css$/,
        include: root('src', 'app'),
        loaders: ['raw-loader', 'postcss-loader']
      }
    ]
  },

  plugins: [
    new ProgressPlugin(),

    new GlobCopyWebpackPlugin({
      patterns: ['assets', 'icons', 'monux.*'],
      globOptions: {
        cwd: root('./src'),
        dot: true,
        ignore: '**/.gitkeep'
      }
    }),

    new ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)@angular/,
      './src/app',
      {}
    ),

    new HtmlWebpackPlugin({
      template: './src/app/index.html'
    }),

    new BaseHrefWebpackPlugin({}),

    new CommonsChunkPlugin({
      name: ['app', 'polyfills']
    }),

    new ExtractTextPlugin('[name].css')
  ]
}
