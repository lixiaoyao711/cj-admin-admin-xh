<template>
  <div class="conscripts app-container">
    <div class="title-label">双拥服务</div>
    <el-tabs v-model="mainTab" @tab-click="mainTabClick" class="main-tab">
      <el-tab-pane label="我收到的" name="Worship"></el-tab-pane>
      <el-tab-pane label="我发出的" name="AirService"></el-tab-pane>
      <el-tab-pane label="军人子女教育" name="ChildrenEducation"></el-tab-pane>
    </el-tabs>
    <!-- 动态组件 -->
    <component :is="mainTab"></component>
  </div>
</template>

<script>
// 组件
import AddOrEdit from './dialog/worshipAddOrEdit.vue';
import AirService from './dialog/airService.vue';
import InfoData from './dialog/worshipInfoData.vue';
import Worship from './dialog/worship.vue';
import ChildrenEducation from './dialog/childrenEducation.vue';

export default {
  props: {},
  components: { AddOrEdit, InfoData, Worship, AirService, ChildrenEducation },
  data() {
    return {
      query: {
        user: '',
        region: '',
        keyWord: '',
      },
      tableColumns: [
        {
          width: 500,
          label: '任务内容',
          prop: 'name',
        },
        {
          width: 0,
          label: '反映人员',
          prop: 'name',
        },
        {
          width: 0,
          label: '接收部门',
          prop: 'name',
        },
        {
          width: 0,
          label: '任务状态',
          prop: 'name',
        },
        {
          width: 0,
          label: '办结日期',
          prop: 'name',
        },
      ],
      tableData: [],
      total: 0,
      // -----------------tabs---------------------
      mainTab: 'Worship',
      tableTab: '1',
      // -----------------dialog-------------------
      addOrEditDialog: false,
      infoDialog: false,
      addOrEditTitleName: '新建内容',
      addOrEditData: {},
      infoData: {},
    };
  },
  computed: {},
  watch: {
    '$route.query.tab': {
      handler(tab) {
        this.mainTab = tab;
      },
    },
  },
  created() {
    this.mainTab = this.$route.query.tab || 'Worship';
  },
  mounted() {},
  methods: {
    mainTabClick(tab) {
      this.mainTab = tab.name;
      this.$router.replace({
        query: {
          tab: tab.name,
          subTab: this.$route.query.subTab,
        },
      });
      // this.getList()
    },
    tableTabClick(tab) {
      this.tableTab = tab.name;
      this.$router.replace({
        query: {
          tab: tab.name,
          subTab: this.$route.query.subTab,
        },
      });
      // this.getList()
    },
    onSubmit() {},
    search() {},
    addItem() {
      this.addOrEditDialog = true;
    },
    delItem() {},
    viewItem(row) {
      this.infoDialog = true;
      this.infoData = JSON.parse(JSON.stringify(row));
    },
    addOrEditClose() {
      this.addOrEditDialog = false;
      this.addOrEditData = {};
    },
    handleCurrentChange(val) {
      this.query.page = val;
      this.getList();
    },
    handleSizeChange(val) {
      this.query.size = val;
      this.getList();
    },
  },
};
</script>
<style lang="scss" scoped>
.title-label {
  font-size: 24px;
  font-weight: 600;
}
</style>
