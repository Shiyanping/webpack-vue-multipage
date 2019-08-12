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

// function txb(total, day) {
//   if (day === 0) {
//     return;
//   }
//   console.log(`第${21 - day}天获得：${total * 0.002}个TXB`);
//   let totalTemp = total - total * 0.002;
//   txb(totalTemp, day - 1);
// }
// txb(24135.99, 20);
