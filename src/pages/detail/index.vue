<template>
  <div>
    <header-bar></header-bar>
    <p class="detail">detail Page 测试1</p>
    <div>{{ result }}</div>
  </div>
</template>
<script>
import axios from 'axios';
import HeaderBar from '@components/Header';

export default {
  components: {
    HeaderBar
  },
  data() {
    return {
      result: ''
    };
  },
  created() {
    axios
      .get(
        'https://xwz.coohua.com/task/sign/history?base-key=9VbTPbdKqOcFausRd_ztnArQldzz0m4Xz6E0flYBGBrOP_chqmncOTvHPgFg9djK'
      )
      .then((response) => {
        console.log(response.data);
        const { result } = { ...response.data };
        console.log(result);
        this.result = result;
      })
      .catch(function(error) {
        console.log(error);
      });
  }
};
</script>
<style lang="scss">
.detail {
  font-size: 24px;
  color: $titleColor;
}
</style>
