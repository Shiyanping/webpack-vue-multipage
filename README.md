# 基于 webpack4 搭建 vue2 多页应用

## 背景

前司和现司都会存在这种业务场景：有很多 H5 页面是不相关的，如果使用 SPA 的话，对于很多落地页和活动页不太友好，有一些纯前端页面加载过慢，所以就萌生了创建一个多页面 MPA 的框架。

起初想着使用 vue-cli3 去创建，因为 vue-cli3 本身带有多页面配置的选项，直接修改 pages 这个选项就可以完成多页面配置，需要的小伙伴可以进行参考，链接：[vue-cli3 的 pages](https://cli.vuejs.org/zh/config/#pages)。但是因为要兼容安卓 4.4 以下系统（**有一些请求库中包含 E6 语法，如：axios，安卓 4.4 以下系统无法识别，所以会导致打开页面是空白的问题**），pages 的入口不能配置数组，没办法添加 babel-polyfill，不能兼容低版本原生系统，所以最终采用了 webpack4 来进行多页面打包。

## 技术栈

本项目涉及到的技术栈主要是：webpack4，vue2，vuex3，vue-router，eslint。主要是 webpack4 的配置，其实 vue，vuex，vue-router 使用起来都是一样的。

## 框架解决的问题

- webpack 根据页面不同进行打包

其实原理是 webpack 根据页面入口文件，将一个 SPA 项目分成多个 SPA 进行打包。

- 安卓 4.4 以下手机的兼容

- 页面 router 和 支持文件夹层级打包

这两种方式都是为了支持同一个项目下有多个页面，比如我们做的一个简易版商城也是在这个多页面中，这个时候商城可以使用 router 去控制页面路由，也可以使用层级的方式去创建多个 html 页面去实现，这个可以根据自己的业务去采用不同的方案，我们两种方式都会介绍。

- 不同页面可以根据不同的 html 打包

有些 js 需要直接在 html 模板中引入，打包直接生成在 html 中，但是有些页面不需要引入其他的 js，比如一些纯静态页面。

- git commit 提交时根据 eslint 进行校验

保证一个团队提交代码的统一性，可以参考我之前掘金的文章，[手摸手带你实践标准的前端开发规范
](https://juejin.im/post/5d3aa57f6fb9a07ed524e5a6)

介绍的差不多了，废话不多说，直接开整：

## 如何使用

```bash
git clone https://github.com/Shiyanping/webpack-vue-multipage.git

cd webpack-vue-multipage

npm install

npm run dev
# 启动之后在浏览器访问即可，http://localhost:8022/index.html

# eslint
npm run eslint

# 格式化代码
npm run prettier

# build
npm run build
```

## webpack 的配置

多页面和单页面的区别，主要是在 entry 上，所以我们首先对 entry 进行处理。

### entry

多页面和单页面最大的不同点，就在于入口的不同。

- 多页：最终打包生成多个入口（ html 页面），一般每个入口文件除了要引入公共的静态文件（ js/css ）还要另外引入页面特有的静态资源

- 单页：只有一个入口( index.html )，页面中需要引入打包后的所有静态文件，所有的页面内容全由 JavaScript 控制

直接看代码吧，在 utils 中有一个 get_entry_config.js 去获取 entry 的配置，其中包括了入口选择性引用模板 html，babel-polyfill 加到入口的配置中。注释其实写的听明白的，各位看官有什么不知道的可以像老哥我咨询。

```js
const fs = require("fs");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const config = require("./../../config/page_config"); // 多页面的配置项

const resolve = dir => {
  return path.resolve(process.cwd(), dir);
};

let HTMLPlugins = [];
let Entries = {};

config.HTMLDirs.forEach(item => {
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
    pageHtml = "src/template/default.html";
  }

  const htmlPlugin = new HTMLWebpackPlugin({
    title: item.title, // 生成的html页面的标题
    filename: filename, // 生成到dist目录下的 html 文件名称
    template: resolve(pageHtml), // 模板文件，不同入口可以根据需要设置不同模板
    chunks: [item.page, "vendor"] // html文件中需要要引入的 js模块，这里的 vendor 是 webpack 默认配置下抽离的公共模块的名称
  });

  HTMLPlugins.push(htmlPlugin);

  // 添加 babel-polyfill 解决安卓 4.4 以下兼容问题
  Entries[item.page] = [
    "babel-polyfill",
    resolve(`src/pages/${item.page}/index.js`)
  ];
});

module.exports = {
  HTMLPlugins,
  Entries
};
```

上面的 js 中引用了一个 page_config.js，这个 js 中，主要是多页面的配置信息：

```js
module.exports = {
  HTMLDirs: [
    {
      page: "index",
      title: "首页"
    },
    {
      page: "list",
      title: "列表页",
      dir: "content" // 支持设置多级目录
    },
    {
      page: "detail",
      title: "详情页"
    }
  ]
};
```

最后在 webpack.config.js 中引入相关配置：

```js
module.exports = {
  entry: entryConfig.Entries,
  plugins: [
    ...entryConfig.HTMLPlugins // 利用 HTMLWebpackPlugin 插件合成最终页面
  ]
};
```

这些就是我们多页面的主要设置，也就是多页面的入口。

### 不同页面使用不同的 html 模板

其实说白了多页面就是将多个小项目汇总到一个大项目，这个是 webpack 帮我们做的事，只不过这些小项目之间的关联性不大，所以做成了多页面。

在实际开发中，有些页面需要直接在 html 中引入的 js 文件，比如公司的公共 jsbridge，没有封装成 npm 包，只能用下面这种方式引入了：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>
      <%= htmlWebpackPlugin.options.title %>
    </title>
  </head>
  <body>
    <div id="app"></div>
    <script src="http://www.xxx.com/jsbridge.min.js"></script>
  </body>
</html>
```

但是有些分享出去的页面，并不需要这个 js，如果我们都使用同一个 html 模板打包，那相当于打包出去的多页面，每个页面都有这个 js，这样就会导致页面请求慢一些问题。

这个时候就有必要对不同的小项目使用不同的 html 模板了。

其实主要的代码就是下面这几句，很简单：

```js
  // 每个页面的文件夹下可以含有一个自己的index.html，如果有会根据这个模板进行build
  let pageHtml = `src/pages/${item.page}/index.html`;

  // 如果文件夹下没有制定的模板，则采用默认的模板 build
  if(!fs.existsSync(pageHtml)){
    pageHtml = 'src/template/default.html';
  }

  const htmlPlugin = new HTMLWebpackPlugin({
    ...
    template: resolve(pageHtml), // 模板文件，不同入口可以根据需要设置不同模板
    ...
  });
```

根据文件夹目录去引用 html 模板，如果当前页面文件夹下有自己的 index.html，那我们就使用自己的，如果没有就使用默认的。这样在打包生成 html 的时候就可以按照不同页面引用不同的 html 模板了，不会造成不想要的 js 被引用的问题存在。

## 安卓 4.4 以下兼容问题

这个问题说起来很多人都不想弄，其实我也不想，但是没办法啊，公司的用户群体中安卓机占了很大一部分，并且安卓 4.4 以下机型占了 20%，这样的情况就必须要对页面做兼容了。

其实单页面做兼容很简单，在 webpack 的 entry 配置一下 babel-polyfill，然后在单页面的 main.js 中，直接引入 babel-polyfill 和 es6-promise 就可以了。如下：

```js
// webpack.config.js
entry = ["babel-polyfill", resolve("src/main.js")];

// main.js
import "babel-polyfill";
import promise from "es6-promise";
require("es6-promise").polyfill();
promise.polyfill();
```

这样 SPA 就可以解决兼容问题，MPA 就有一点麻烦了，举一反三，我们要在 entry 的每一个入口增加 babel-polyfill，然后在每个 page 下的 index.js 中引入 babel-polyfill 和 es6-promise。

写文章没点图怎么行，不上代码了，这次上截图：

get_entry_config.js：

![](media/15652472037514/15652483085872.jpg)

感觉看着不舒服，算了，还是上代码吧~

```js
// 添加 babel-polyfill 解决安卓 4.4 以下兼容问题
Entries[item.page] = [
  "babel-polyfill",
  resolve(`src/pages/${item.page}/index.js`)
]; // 根据配置设置入口js文件
```

然后在每个文件夹的 index.js 中都要加入编译的代码。

![](media/15652472037514/15652490723067.jpg)

```js
// src/pages/**/index.js
import Vue from "vue";
import Tpl from "./index.vue";
import store from "../../store";
import "babel-polyfill";
import promise from "es6-promise";
require("es6-promise").polyfill();
promise.polyfill();

new Vue({
  store,
  render: h => h(Tpl)
}).$mount("#app");
```

这样编译之后就可以解决安卓 4.4 以下的兼容了，亲测有效哦~

## 页面 router 和 支持文件夹层级打包

每个小项目中，可能会涉及到一些页面相对来说比较多的项目，比如一个简易版的商城，包括商品列表页，商品详情页，订单页。

这个时候我们可以使用两种方式：

- 使用 vue-router 控制路由

这个我觉得不用多说了吧，在需要使用路由的文件夹下创建一个 router.js，并且引入 vue-router，**一定要在某个文件夹下创建哦，否则几个页面公用一个 router，会有意想不到的结果**。其实我们就可以把 MPA 想象成多个 SPA，一个 SPA 一个路由，他们之间没有关联，纯页面的东西不用路由就不需要创建。

这样就可以实现用路由的方式去控制不同页面的走向了。

结构如下：

```
├── components
│   ├── About
│   │   └── Index.vue
│   └── Home
│       └── Index.vue
├── index.js
├── index.vue
└── router.js
```

使用方式和开发其他 SPA 没区别。

- 使用层级打包的方式

这是另外一种方式，就是通过打包成有层级目录的方式控制页面的走向，这个里面没有涉及到路由，只是单纯的打包加一个层级就行。

主要有两点需要控制，一个是页面配置 `page_config.js`，另外一个是 webpack 处理入口这块 `get_entry_config.js`，看代码：

**page_config.js：**

```js
{
  page: 'list',
  title: '列表页',
  dir: 'content' // 支持设置多级目录
}
```

**get_entry_config.js：**

```js
let filename = `${item.page}.html`;

/**
 * 支持多级目录，dir/page.html
 * 多页面框架中可以采用这种方式增加层级目录，一个目录下有多个页面
 * 也可以使用 router 进行同级目录下一个html，通过 router 控制路由
 */
if (item.dir) {
  filename = `${item.dir}/${item.page}.html`;
}
```

这样打包之后的文件就能实现以下层级的关系：

```
├── list.html
└── list1.html
```

访问的时候就可以不需要依赖路由，直接访问页面即可。

## git commit 钩子校验 eslint

这个我就不细说了，主要是为了保持团队中每个人提交代码之前进行不合格的校验，确保 git 仓库中的代码是没问题的，并且格式是一样的，这个还可以搭配 prettier 使用，可以自行百度。

配置的问题，可以参考我之前的文章，[手摸手带你实践标准的前端开发规范
](https://juejin.im/post/5d3aa57f6fb9a07ed524e5a6)。

**有一点需要注意，一开始你 clone 的是我仓库，如果想实现提交就校验 eslint，需要将文件夹中.git 删除掉，关联到你的 git 仓库，然后重新安装 husky 包。**

## 总结

基本的功能都实现了，不过还不是很完美，有很多功能都没加进来，比如移动端的样式适配，网络请求库封装，公共方法的提取...，所以说还有很多不足之处，欢迎大家进行 pr 和提 issue，我会及时为大家解答。

## 阅读完后三部曲

非常感谢各位花时间阅读完，衷心希望各位小伙伴可以花少量的时间帮忙做两件事：

- 动动你的手指，帮忙点个赞吧，你的点赞是对我最大的动力。

- 有兴趣的可以添加我微信，我邀请你加入前端讨论群，有惊喜哦~

![](https://user-gold-cdn.xitu.io/2019/8/7/16c69c170870f307?w=458&h=470&f=png&s=262092)

- 希望各位关注一下我的公众号，新的文章第一时间发到公众号，公众号主要发一些个人随笔、读书笔记、还有一些技术热点和实时热点，并且还有非常吸引人的我个人自费抽奖活动哦~

![](https://user-gold-cdn.xitu.io/2019/7/16/16bfa1cb0db942ad?w=2800&h=800&f=jpeg&s=152910)