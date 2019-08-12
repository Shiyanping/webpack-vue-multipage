/**
 * 页面配置文件，支持多层级，这样就不需要引入 vue-router 了
 * 多层级 dir/page
 * 新建页面需要重启 webpack
 */
module.exports = {
  HTMLDirs: [
    {
      page: 'index',
      title: '首页'
    },
    {
      page: 'list',
      title: '列表页',
      dir: 'content' // 支持设置多级目录
    },
    {
      page: 'detail',
      title: '详情页'
    },
    {
      page: 'growth_report',
      title: '儿童成长报告'
    }
  ],
  imgOutputPath: 'img/',
  fontOutputPath: 'font'
};
