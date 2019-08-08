const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const merge = require('webpack-merge');
const argv = require('yargs-parser')(process.argv.slice(2));
const _mode = argv.mode || 'development';
const _mergeConfig = require(`./build/webpack.${_mode}.js`);
const entryConfig = require('./src/utils/get_entry_config');

const resolve = (dir) => {
  return path.resolve(__dirname, dir);
};

const webpackBaseConfig = {
  entry: entryConfig.Entries,
  output: {
    publicPath: '/',
    filename: 'js/[name].[hash:8].js',
    path: resolve('dist')
  },
  module: {
    rules: [
      {
        test: /\.vue$/, // 处理vue模块
        use: 'vue-loader'
      },
      {
        test: /\.js$/, //处理es6语法
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  resolve: {
    // 设置模块如何被解析
    alias: {
      '@': resolve('src'),
      '@components': resolve('src/components'),
      '@styles': resolve('src/styles'),
      '@assets': resolve('src/assets'),
      '@commons': resolve('src/commons')
    },
    // 用于查找模块的目录
    extensions: ['.css', '.js', '.vue']
  },
  plugins: [
    new VueLoaderPlugin(),
    new CopyWebpackPlugin([
      {
        from: resolve('public'),
        to: resolve('dist'),
        ignore: ['*.html']
      },
      {
        from: resolve('src/scripts/lib'),
        to: resolve('dist')
      }
    ]),
    ...entryConfig.HTMLPlugins // 利用 HTMLWebpackPlugin 插件合成最终页面
  ]
};

module.exports = merge(webpackBaseConfig, _mergeConfig);
