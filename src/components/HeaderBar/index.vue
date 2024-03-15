<template>
  <div class="bar-box">
    <img class="logo" src="@/assets/images/logo.png" alt="" />
  </div>
</template>

<script>
export default {
  props: {},
  components: {},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style scoped lang="scss">
.bar-box {
  width: 100vw;
  height: 64px;
  background: #ffffff;
  box-shadow: 0 1.33px 5.33px 0 #00000014;
  position: absolute;
  top: 0;
  display: flex;
  align-items: center;
  padding: 0 32px;
  box-sizing: border-box;
  .logo {
    width: 39.36px;
    height: 26.67px;
  }
}
</style>
