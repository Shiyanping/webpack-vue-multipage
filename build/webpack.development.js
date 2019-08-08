const path = require('path');
const config = require('../config/page_config');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  devServer: {
    port: '8022',
    host: '0.0.0.0',
    noInfo: true,
    overlay: {
      warnings: false,
      errors: true
    },
    contentBase: path.resolve(__dirname, '../dist'),
    proxy: {},
    open: true,
    hot: true,
    clientLogLevel: 'none'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: ['应用启动成功，请访问：http://localhost:8022'],
        notes: ['Some additionnal notes to be displayed unpon successful compilation']
      },
      clearConsole: true
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ['vue-style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader',
          'postcss-loader',
          {
            loader: 'sass-resources-loader',
            options: {
              resources: path.resolve(__dirname, '../src/styles/lib/main.scss')
            }
          }
        ]
      },
      {
        test: /\.(js|vue)$/,
        enforce: 'pre', // 强制先进行 ESLint 检查
        exclude: /node_modules|lib/,
        loader: 'eslint-loader'
        // options: {
        //   // 启用自动修复
        //   fix: true,
        //   // 启用警告信息
        //   emitWarning: true
        // }
      },
      {
        test: /\.(png|svg|jpg|gif)$/, // 处理图片
        use: {
          loader: 'file-loader', // 解决打包css文件中图片路径无法解析的问题
          options: {
            // 打包生成图片的名字
            name: '[name].[hash:8].[ext]',
            // 图片的生成路径
            outputPath: config.imgOutputPath
          }
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/, // 处理字体
        use: {
          loader: 'file-loader',
          options: {
            outputPath: config.fontOutputPath
          }
        }
      }
    ]
  }
};
