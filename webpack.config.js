const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const {
  BaseHrefWebpackPlugin,
  GlobCopyWebpackPlugin
} = require('@angular/cli/plugins/webpack')

const { root } = require('./tools/webpack-helpers')

const {
  HashedModuleIdsPlugin,
  ContextReplacementPlugin,
  ProgressPlugin,
  optimize
} = webpack
const { CommonsChunkPlugin } = optimize

module.exports = {
  entry: {
    app: './src/app/main.ts',
    polyfills: './src/app/polyfills.ts'
  },

  output: {
    path: root('dist', 'app'),
    // publicPath: '/',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js'
  },

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
      {
        test: /\.ts$/,
        loaders: [
          {
            loader: '@angularclass/hmr-loader',
            options: {
              pretty: true,
              prod: false
            }
          },
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
        loader: [
          {
            loader: 'file-loader',
            options: { name: 'assets/[name].[hash:8].[ext]' }
          }
        ]
      },
      {
        test: /\.css$/,
        include: root('src', 'app', 'style'),
        loader: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: { sourceMap: true, importLoaders: 1 }
            },
            {
              loader: 'postcss-loader',
              options: { sourceMap: 'inline' }
            }
          ],
          fallback: 'style-loader'
        })
      },
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
      }
    ]
  },

  plugins: [
    new ProgressPlugin(),

    new GlobCopyWebpackPlugin({
      patterns: ['assets', 'monux.*'],
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

    new ExtractTextPlugin('[name].css'),

    new HashedModuleIdsPlugin({
      hashFunction: 'sha256',
      hashDigest: 'base64',
      hashDigestLength: 8
    })
  ]
}
