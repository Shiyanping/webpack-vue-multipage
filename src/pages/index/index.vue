<template>
  <div class="index">
    <p>Index Page</p>
    <div class="count">
      <span v-text="count"></span>
      <button @click="add">add count</button>
    </div>
    <img src="../../assets/logo.png" alt="" />
    <button>111</button>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  name: 'index',
  computed: {
    ...mapGetters(['count'])
  },
  methods: {
    add() {
      this.$store.commit('app/ADD_COUNT', { amount: 10 });
    }
  }
};
</script>
<style lang="scss">
.index {
  position: relative;
  font-size: 24px;
  // color: $titleColor;
  .count {
    text-align: center;
  }
  img {
    position: relative;
    margin-top: 60px;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
