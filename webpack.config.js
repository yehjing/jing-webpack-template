const path = require('path');
// const utils = require('./utils')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


const devMode = process.env.NODE_ENV !== 'production';
const paths = {
  src: path.join(__dirname, 'src'),
  dist: path.join(__dirname, 'dist'),
}

const createLintingRule = () => ({
  test: /\.js$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  // include: [path.join(__dirname, '..', 'src'), path.join(__dirname, '..', 'test')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: devMode,
    fix: true
  }
})

module.exports = {
  mode: devMode ? 'development' : 'production',
  entry:{
    app: './src/main.js'
  },
  output: {
    filename: devMode ? '[name].bundle.js' : '[name].[hash:8].bundle.js',
    path: paths.dist,
    publicPath: devMode ? '/' : './',
  },
  devServer: {
    host: "localhost",
    port: 8881,
    contentBase: path.join(__dirname, 'dist'),
    compress: true
  },
  module: {
    rules: [
      ...(devMode ? [createLintingRule()] : []),
      {
        test: /\.(html)$/,
        use: {
            loader: 'html-loader',
            options: {
                attrs: ['img:src'],
            }
        }
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader:"postcss-loader",
            options:{
              ident:'postcss',
              plugins:[
                require('autoprefixer')
              ]
            }
          },
          'sass-loader',
        ],
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          // options: {
          //   presets: ['@babel/preset-env']
          // }
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        // exclude: [resolve('src/images')],
        options: {
          limit: 10,
          name: '[name].[hash:7].[ext]',
          outputPath: "assets/images",   //输出图片放置的位置
          publicPath: './assets/images', //html的img标签src所指向图片的位置，与outputPath一致
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10,
          name: '[name].[hash:7].[ext]',
          outputPath: "assets/media",   //输出图片放置的位置
          publicPath: './assets/media', //html的img标签src所指向图片的位置，与outputPath一致
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10,
          name: '[name].[hash:7].[ext]',
          outputPath: "assets/fonts",   //输出图片放置的位置
          publicPath: './assets/fonts', //html的img标签src所指向图片的位置，与outputPath一致
        }
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'My web',
      minify:{
        removeComments: devMode ? false : true,
        collapseWhitespace: devMode ? false : true,
        removeAttributeQuotes: devMode ? false : true
      },
      hash:true,
      inject: true,
      // template: './src/index.html'
      template: path.join(paths.src, 'index.html'),
      filename: path.join(paths.dist, 'index.html'),
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // all options are optional
      filename: devMode ? '[name].min.css' : '[name].min.css?[hash:8]'
      // filename: '[name].min.css',
    })
  ]
};