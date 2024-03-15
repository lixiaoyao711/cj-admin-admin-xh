<template>
  <div class="index">
    <main>
      <div class="title">
        <span>三色走访记录</span>
        <div class="buttons">
          <!-- <el-button type="" size="mini">删 除</el-button>
          <el-button type="primary" size="mini">新 建</el-button> -->
        </div>
      </div>
      <div class="table">
        <el-table :data="tableData" border stripe height="100%">
          <el-table-column type="selection" label="" width=""></el-table-column>

          <el-table-column prop="visitPersonName" label="走访人" width=""></el-table-column>
          <el-table-column prop="visitPersonPhone" label="走访人联系方式" width=""></el-table-column>
          <el-table-column prop="name" label="走访方式" width="">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.sys_worship_visitingmethods" :value="scope.row.visitMethod" />
            </template>
          </el-table-column>
          <el-table-column prop="visitTime" label="走访时间"></el-table-column>
          <el-table-column prop="content" label="走访内容"></el-table-column>
          <el-table-column prop="satisfactionRemark" label="满意情况"></el-table-column>
          <el-table-column prop="address" label="操作" width="90">
            <template slot-scope="scope">
              <el-button type="text" size="mini">详情</el-button>
              <el-button type="text" size="mini">编辑</el-button>
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
import { listVisiting } from '@/api/worship/visiting';
export default {
  dicts: ['sys_worship_visitingmethods'],
  props: {},
  components: {},
  data() {
    return {
      tableData: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        visitType: 4,
        personId: this.$route.params.id,
      },
      total: 0,
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      listVisiting(this.queryParams).then((res) => {
        this.tableData = res.rows;
        this.total = res.total;
      });
    },
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
    height: 52vh;
    margin: 10px 0 0 0;
  }
}
</style>
