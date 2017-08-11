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
    // vendor: './src/app/vendor.js'
  },

  output: {
    path: root('dist', 'app'),
    // publicPath: '/',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js'
  },

  resolve: {
    extensions: ['.ts', '.js', '.json'],
    modules: ['./node_modules']
  },

  resolveLoader: {
    modules: ['./node_modules']
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
        loader: [
          {
            loader: 'file-loader',
            options: { name: 'assets/[name].[hash].[ext]' }
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

    new ExtractTextPlugin('[name].css'),

    new HashedModuleIdsPlugin({
      hashFunction: 'sha256',
      hashDigest: 'base64',
      hashDigestLength: 5
    })
  ],

  externals: {
    child_process: 'require(\'child_process\')',
    crypto: 'require(\'crypto\')',
    events: 'require(\'events\')',
    fs: 'require(\'fs\')',
    http: 'require(\'http\')',
    https: 'require(\'https\')',
    assert: 'require(\'assert\')',
    dns: 'require(\'dns\')',
    net: 'require(\'net\')',
    os: 'require(\'os\')',
    path: 'require(\'path\')',
    querystring: 'require(\'querystring\')',
    readline: 'require(\'readline\')',
    repl: 'require(\'repl\')',
    stream: 'require(\'stream\')',
    string_decoder: 'require(\'string_decoder\')',
    url: 'require(\'url\')',
    util: 'require(\'util\')',
    zlib: 'require(\'zlib\')',

    electron: 'require(\'electron\')',

    keytar: 'require(\'keytar\')'
  },

  node: {
    fs: 'empty',
    global: true,
    crypto: 'empty',
    tls: 'empty',
    net: 'empty',
    process: true,
    module: false,
    clearImmediate: false,
    setImmediate: false,
    __dirname: false,
    __filename: false
  }
}
