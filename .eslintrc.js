module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true,
    es6: true
  },
  extends: ['eslint-config-alloy/vue', 'prettier'],

  // 可以添加自己的规则，可以参考 eslint-config-vue 和 腾讯的 eslint
  // https://github.com/vuejs/eslint-config-vue
  // https://alloyteam.github.io/eslint-config-alloy/
  rules: {
    'vue/mustache-interpolation-spacing': ['error', 'always'],
    'vue/singleline-html-element-content-newline': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    // vue 中 script 的空格
    'vue/script-indent': [
      'error',
      2,
      {
        baseIndent: 0,
        switchCase: 0,
        ignores: []
      }
    ],
    // vue 中 template 的空格
    'vue/html-indent': [
      'error',
      2,
      {
        attribute: 1,
        baseIndent: 1,
        closeBracket: 0,
        alignAttributesVertically: true,
        ignores: []
      }
    ],
    // 缩进使用 tab
    indent: [
      2,
      2,
      {
        SwitchCase: 1,
        VariableDeclarator: 1
      }
    ],
    // 可以直接只用 new Vue()
    'no-new': 0,
    // 线上禁用debugger
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    // parseInt 可以不传第二个参数
    radix: 0
  }
};
