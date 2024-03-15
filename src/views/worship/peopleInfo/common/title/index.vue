<template>
  <div class="rectangle">
    <slot></slot>
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
.rectangle {
  // width: 200px;
  min-width: 180px;
  height: 36px;
  background: linear-gradient(-45deg, transparent 50px, #1a70e8 0) bottom right,
    linear-gradient(-135deg, transparent 50px, #1a70e8 0) top right;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  color: #fff;
  display: flex;
  align-items: center;
  padding: 0 60px 0 16px;
  box-sizing: border-box;
  font-size: 18px;
  font-weight: 600;
}
</style>
