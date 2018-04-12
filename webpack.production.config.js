var webpack = require('webpack')
var path = require('path')
var HtmlwebpackPlugin = require('html-webpack-plugin')
var ROOT_PATH = path.resolve(__dirname)
var productionEnv = require('./env/production.js')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports={
  devtool: 'cheap-module-source-map',
  entry:'./main.js',
  output:{
    path:'./',
    filename:'index.js'
  },
  output: {
    path: path.resolve(ROOT_PATH, 'build'),
    publicPath: '/',
    filename: 'bundle.min.js'
  },
  module:{
    rules:[
      {
        test:/\.js$/,
        exclude:/node_modules/,
        loader:'babel-loader',
        query:{
          presets:['es2015','react','stage-1']
        }
      },
      {
        test: /\.scss|css$/,
        loaders: [ 'style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader?limit=8192'
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9].[0-9].[0-9])?$/,
        loader: 'file-loader?name=fonts/[name].[ext]'
      },
      { test: /\.json$/,
        loader: 'json'
      },
    ],
  },
  mode: 'production',
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        sourceMap: true,
        uglifyOptions: {
          compress: {
            inline: false,
          },
        },
      }),
    ],
  },

  plugins: [
    new HtmlwebpackPlugin({
      template: path.resolve(ROOT_PATH, 'index.html'),
      inject: 'body',
    }),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify('production'),
        SERVER_URL: JSON.stringify(productionEnv.SERVER_URL)
      }
    }),
  ]
}
