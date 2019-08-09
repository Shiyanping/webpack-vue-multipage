<template>
  <div>
    <header-bar></header-bar>
    <p class="detail">detail Page 测试</p>
    <div>{{ result }}</div>
    <div>{{ result1 }}</div>
    <button>测试11</button>
  </div>
</template>
<script>
import HeaderBar from '@components/Header';
// import { getClubActivityList, getClubDetail } from '@/api/detail';
export default {
  components: {
    HeaderBar
  },
  data() {
    return {
      result: '',
      result1: ''
    };
  },
  async created() {
    // 测试网路请求
    // const result = await getClubActivityList();
    // this.result = `非jsonp请求：${JSON.stringify(result)}`
    // console.log('非jsonp请求：', result);
    // const result1 = await getClubDetail();
    // this.result1 = `jsonp请求：${JSON.stringify(result1)}`
    // console.log('jsonp:', result1);
  },
  methods: {}
};
</script>
<style lang="scss">
.detail {
  font-size: 24px;
  // color: $titleColor;
}
</style>
