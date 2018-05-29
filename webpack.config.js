const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { AngularCompilerPlugin } = require('@ngtools/webpack')

const { root } = require('./tools/webpack-helpers')

const {
  HashedModuleIdsPlugin,
  ContextReplacementPlugin,
  ProgressPlugin
} = webpack

const dev = process.env.NODE_ENV === 'dev'

module.exports = {
  entry: {
    app: './src/app/main.ts',
    polyfills: './src/app/polyfills.ts'
  },

  output: {
    path: root('dist', 'app')
  },

  mode: 'development',

  target: 'electron-renderer',

  resolve: {
    extensions: ['.ts', '.js', '.json'],
    modules: ['./node_modules']
  },

  resolveLoader: {
    modules: ['./node_modules']
  },

  externals: {
    keytar: 'require(\'keytar\')'
  },

  devtool: 'inline-source-map',

  watchOptions: {
    aggregateTimeout: 1000,
    ignored: ['node_modules', 'dist']
  },

  module: {
    rules: [
      // html files
      {
        test: /\.html$/,
        loader: 'html-loader'
      },

      // asset files
      {
        test: /\.(png|jpe?g|gif|svg|woff2?|(t|o)tf|eot|ico)$/,
        loaders: [
          {
            loader: 'file-loader',
            options: { name: 'assets/[name].[hash:8].[ext]' }
          }
        ]
      },

      // page css
      {
        test: /\.css$/,
        include: root('src', 'app', 'style'),
        loaders: [
          {
            loader: 'style-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'css-loader',
            options: { sourceMap: true, importLoaders: 1 }
          },
          {
            loader: 'postcss-loader',
            options: { sourceMap: 'inline' }
          }
        ]
      },

      // angular component css
      {
        test: /\.css$/,
        exclude: root('src', 'app', 'style'),
        loaders: [
          'to-string-loader',
          {
            loader: 'css-loader',
            options: { sourceMap: true, importLoaders: 1 }
          },
          {
            loader: 'postcss-loader',
            options: { sourceMap: 'inline' }
          }
        ]
      },

      // angular files
      {
        test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
        loader: '@ngtools/webpack'
      }
    ]
  },

  plugins: [
    new CopyWebpackPlugin([
      { from: './monux.*', context: './src' },
      { from: './assets/', context: './src/app', to: './assets' }
    ]),

    new AngularCompilerPlugin({
      tsConfigPath: './tsconfig.json',
      mainPath: './src/app/main.ts',
      sourceMap: true
    }),

    new ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)@angular/,
      './src/app'
    ),

    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),

    new HtmlWebpackPlugin({
      template: './src/app/index.html',
      baseHref: dev ? '/' : './',
      chunksSortMode: (chunk1, chunk2) => {
        const orders = ['polyfills', 'app']
        return orders.indexOf(chunk1.names[0]) - orders.indexOf(chunk2.names[0])
      }
    }),

    new HashedModuleIdsPlugin({
      hashFunction: 'sha256',
      hashDigest: 'base64',
      hashDigestLength: 8
    })
  ]
}
