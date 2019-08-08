import Vue from 'vue';
import Tpl from './index.vue';
import store from '../../store';
import router from './router';
import 'babel-polyfill';
import promise from 'es6-promise';
require('es6-promise').polyfill();
promise.polyfill();

new Vue({
  router,
  store,
  render: (h) => h(Tpl)
}).$mount('#app');
