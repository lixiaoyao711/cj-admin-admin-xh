<template>
  <div class="index">
    <main>
      <div class="title">
        <span>褒扬纪念</span> 
      </div>
      <div class="table">
        <el-table :data="tableData" border stripe height="100%">
          <el-table-column type="selection" label="" width=""></el-table-column>
          <el-table-column prop="date" label="事件" width="800"></el-table-column>
          <el-table-column prop="name" label="办事类型" width=""></el-table-column>
          <el-table-column prop="name" label="流转部门" width=""></el-table-column>
          <el-table-column prop="address" label="联系方式"></el-table-column>
          <el-table-column prop="address" label="办理状态"></el-table-column>
          <el-table-column prop="address" label="操作" width="90">
            <template slot-scope="scope">
              <el-button type="text" size="mini">详情</el-button>
              <el-button type="text" size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </main>
  </div>
</template>

<script>
export default {
  props: {},
  components: {},
  data() {
    return {
      tableData: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    getList() {},
  },
};
</script>

<style scoped lang="scss">
.index {
  main {
    background: #fff;
    padding: 16px 10px;
    box-sizing: border-box;
    .title {
      display: flex;

      justify-content: space-between;
    }
  }
  .table {
    height: 58vh;
    margin: 10px 0 0 0;
  }
}
</style>
