<template>
  <div class="index">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="(item, index) in tabs" :key="item.path" :label="item.name" :name="item.path"> </el-tab-pane>
    </el-tabs>
    <component :is="activeName"></component>
  </div>
</template>

<script>
import rightsRecords from './rightsRecords/index.vue';
import visitInfo from './visitInfo/index.vue';
import recordInfo from './recordInfo/index.vue';
import { listPetitionPerson } from '@/api/worship/peopleList.js'; //权益维护人员
export default {
  props: {},
  components: {
    rightsRecords,
    visitInfo,
    recordInfo,
  },
  data() {
    return {
      tabs: [
        {
          name: '权益维护信息',
          path: 'rightsRecords',
        },
        {
          name: '三色走访记录',
          path: 'visitInfo',
        },
        {
          name: '领导接访',
          path: 'recordInfo',
        },
      ],
      activeName: 'rightsRecords',
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getPersonDataById(this.$route.params.id);
  },
  mounted() {},
  methods: {
    async getPersonDataById(personId) {
      let res = await listPetitionPerson({ personId });
      console.log('权益维护人员信息', personId, res);
    },
    handleClick() {},
  },
};
</script>

<style scoped lang="scss">
.index {
  ::v-deep .el-tabs__nav-wrap::after {
    height: 0px !important;
  }
}
</style>
