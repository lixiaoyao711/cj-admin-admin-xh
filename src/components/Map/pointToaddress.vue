<template>
  <div class="viewport">
    <el-input v-model="latLong">
      <template slot="prepend">经纬度</template>
    </el-input>
    <el-input class="address" v-model="address">
      <template slot="prepend">地&nbsp&nbsp&nbsp址</template>
    </el-input>
  </div>
</template>

<script>
export default {
  props: {
    latLong: String,
    address: String,
  },
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
.viewport {
  position: absolute;
  padding: 20px;
  box-sizing: border-box;
  right: 10px;
  bottom: 10px;
  width: 338px;
  height: 140px;
  background: rgba(255, 255, 255, 0.8);
  z-index: 9;
  .address {
    margin-top: 30px;
  }
}
</style>
