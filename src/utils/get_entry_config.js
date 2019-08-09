/**
 * created shiyanping 2019/08/07
 * 多页面获取入口配置
 */
const fs = require('fs');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const config = require('./../../config/page_config'); // 多页面的配置项

const resolve = (dir) => {
  return path.resolve(process.cwd(), dir);
};

let HTMLPlugins = [];
let Entries = {};

config.HTMLDirs.forEach((item) => {
  let filename = `${item.page}.html`;

  /**
   * 支持多级目录，dir/page.html
   * 多页面框架中可以采用这种方式增加层级目录，一个目录下有多个页面
   * 也可以使用 router 进行同级目录下一个html，通过 router 控制路由
   */
  if (item.dir) {
    filename = `${item.dir}/${item.page}.html`;
  }

  // 每个页面的文件夹下可以含有一个自己的index.html，如果有会根据这个模板进行build
  let pageHtml = `src/pages/${item.page}/index.html`;

  // 如果文件夹下没有制定的模板，则采用默认的模板 build
  if (!fs.existsSync(pageHtml)) {
    pageHtml = 'src/template/default.html';
  }

  console.log(pageHtml);

  const htmlPlugin = new HTMLWebpackPlugin({
    title: item.title, // 生成的html页面的标题
    filename: filename, // 生成到dist目录下的 html 文件名称
    template: resolve(pageHtml), // 模板文件，不同入口可以根据需要设置不同模板
    chunks: [item.page, 'vendor'] // html文件中需要要引入的 js模块，这里的 vendor 是 webpack 默认配置下抽离的公共模块的名称
  });

  HTMLPlugins.push(htmlPlugin);

  // 添加 babel-polyfill 解决安卓 4.4 以下兼容问题
  Entries[item.page] = ['babel-polyfill', resolve(`src/pages/${item.page}/index.js`)]; // 根据配置设置入口js文件
});

module.exports = {
  HTMLPlugins,
  Entries
};
