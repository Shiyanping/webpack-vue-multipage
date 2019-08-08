import Vue from 'vue';
// import '@styles/lib/main.scss';
import Tpl from './index.vue';
import store from '../../store';
import 'babel-polyfill';
import promise from 'es6-promise';
require('es6-promise').polyfill();
promise.polyfill();

new Vue({
  store,
  render: (h) => h(Tpl)
}).$mount('#app');
