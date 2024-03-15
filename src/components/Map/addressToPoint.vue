<template>
  <div>
    <div class="search">
      <el-input id="tipinput" placeholder="请输入内容" type="text" v-model="search" class="input-with-select">
        <el-button @click="searchAddress" slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
  </div>
</template>

<script>
export default {
  props: {},
  components: {},
  data() {
    return {
      search: '',
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    searchAddress() {
      this.$emit('searchAddress', this.search);
    },
  },
};
</script>

<style scoped lang="scss">
.search {
  position: absolute;
  top: 10px;
  left: 10px;
}
</style>
<style lang="scss">
.amap-sug-result {
  z-index: 99999;
}
</style>
