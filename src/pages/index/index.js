import Vue from 'vue';
import Tpl from './index.vue';
import store from '../../store';
import 'babel-polyfill';
import promise from 'es6-promise';
promise.polyfill();

new Vue({
  store,
  render: (h) => h(Tpl)
}).$mount('#app');
