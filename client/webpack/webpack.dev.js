const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackMerge = require('webpack-merge');
const Dotenv = require('dotenv-webpack');

const common = require('./webpack.common');

const CURRENT_WORKING_DIR = process.cwd();

const config = {
  mode: 'development',
  output: {
    path: path.join(CURRENT_WORKING_DIR, '/dist'),
    filename: '[name].js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(scss|sass|css)$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [require('autoprefixer')]
              }
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|ico)$/,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name][ext]'
        }
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]'
        }
      }
    ]
  },
  plugins: [
    new Dotenv(),
    new HtmlWebpackPlugin({
      template: path.join(CURRENT_WORKING_DIR, 'public/index.html'),
      inject: true
    })
  ],
  devServer: {
    port: process.env.PORT || 8070, // Use .env or fallback
    allowedHosts: 'all', // replaces disableHostCheck
    open: true,
    compress: true,
    hot: true,
    historyApiFallback: true,
    client: {
      overlay: true,
      progress: true
    }
  },
  devtool: 'eval-source-map'
};

module.exports = webpackMerge(common, config);
