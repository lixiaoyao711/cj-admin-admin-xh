<template>
  <div class="reportList">
    <el-table :data="tableData" border header-row-class-name="table-header" size="medium" height="64vh">
      <el-table-column prop="divisionName" label="镇街" width="300"></el-table-column>
      <el-table-column prop="" label="上传内容">
        <template slot-scope="{ row }">
          <div @click="openUrl(row.filePath)" class="file">
            {{ row.fileName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" fixed="right">
        <template slot-scope="{ row }">
          <el-button type="text">
            <el-popconfirm title="确定删除吗？" @confirm="delItem(row)">
              <el-button type="text" size="small" slot="reference">删除</el-button>
            </el-popconfirm>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { listRiskFile, delRiskFile } from '@/api/worship/risk';
import { listByIds } from '@/api/system/oss';
export default {
  props: {
    propsQuery: {},
  },
  components: {},
  data() {
    return {
      tableData: [],
      query: {
        pageNum: 1,
        pageSize: 999999,
        type: 1,
      },
    };
  },
  computed: {},
  watch: {
    propsQuery: {
      handler(val) {
        this.query = {
          ...this.query,
          ...val,
          type: 1,
        };
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    this.getList();
  },
  mounted() {},
  methods: {
    getList() {
      if (this.query.searchTime) {
        this.query.beginDate = this.query.searchTime[0] || null;
        this.query.endDate = this.query.searchTime[1] || null;
      } else {
        this.query.beginDate = null;
        this.query.endDate = null;
      }
      listRiskFile({ ...this.query, searchTime: null }).then((res) => {
        console.log(res);
        this.tableData = res.rows;
      });
    },
    openUrl(url) {
      listByIds(url).then((res) => {
        window.open(res.data[0].url);
      });
    },
    delItem(row) {
      delRiskFile(row.id).then((res) => {
        this.$message.success('删除成功!');
        this.getList();
      });
    },
  },
};
</script>

<style scoped lang="scss">
.reportList {
  .file {
    cursor: pointer;
    color: #409eff;
  }
}
</style>
