<template>
  <div class="leader">
    <component
      :is="currIndex"
      @viewItemDay="viewItemDay"
      @viewItemMonth="viewItemMonth"
      @backItem="backItem"
      :propsData="infoData"
    ></component>
  </div>
</template>

<script>
import Index from './dialog/index';
import InfoDataMonth from './dialog/infoDataMonth.vue';
import InfoDataDay from './dialog/infoDataDay.vue';
export default {
  props: {},
  components: { Index, InfoDataMonth, InfoDataDay },
  data() {
    return {
      currIndex: 'Index',
      infoData: {},
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    viewItemMonth(row) {
      this.currIndex = 'InfoDataMonth';
      this.infoData = JSON.parse(JSON.stringify(row));
    },
    viewItemDay(row) {
      this.currIndex = 'InfoDataDay';
      this.infoData = JSON.parse(JSON.stringify(row));
    },
    backItem() {
      this.currIndex = 'Index';
    },
  },
};
</script>

<style scoped lang="scss">
.leader {
}
</style>
