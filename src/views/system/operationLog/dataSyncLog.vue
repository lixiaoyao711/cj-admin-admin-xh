<template>
  <div class="conscripts">
    <div class="toolbar">
      <el-form :model="query" ref="form" :inline="true">
        <div class="left">
          <el-form-item label="选择模块:">
            <el-select v-model="query.module" placeholder="请选择" clearable>
              <el-option
                v-for="dict in dict.type.sys_worship_ssmk"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="日期查询:">
            <el-date-picker
              v-model="searchTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              clearable
            >
            </el-date-picker>
          </el-form-item>
        </div>
        <div class="right">
          <el-button type="primary" @click="search">查 询</el-button>
          <el-button @click="reset">重 置</el-button>
        </div>
      </el-form>
    </div>
    <div class="table">
      <div class="table-title">
        <div>数据更新记录</div>
        <div class="right"></div>
      </div>
      <el-table
        :data="tableData"
        border
        header-row-class-name="table-header"
        size="medium"
        style="width: 100%"
        height="calc(100% - 70px)"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="数据同步源" align="center" prop="interfaceName" />
        <el-table-column label="相关模块" align="center" prop="module">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_worship_ssmk" :value="scope.row.module" />
          </template>
        </el-table-column>
        <el-table-column label="上次同步时间" align="center" prop="updateTime" />
        <el-table-column label="同步情况" align="center" prop="status">
          <template slot-scope="scope">
            <span>{{ scope.row.status == '0' ? '正常' : '异常' }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="query.pageNum"
        :page-sizes="[10, 15, 30, 50, 100]"
        :page-size="query.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { listExternalInterfaceLog } from '@/api/monitor/operlog';
export default {
  dicts: ['sys_worship_ssmk'],
  props: {},
  components: {},
  data() {
    return {
      query: {
        pageNum: 1,
        pageSize: 10,
        searchValue: undefined,
        module: undefined,
        beginDate: null,
        endDate: null,
      },
      searchTime: [],

      tableData: [],
      total: 0,
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getList();
  },
  mounted() {},
  methods: {
    getList() {
      this.query.beginDate = this.searchTime?.[0];
      this.query.endDate = this.searchTime?.[1];
      listExternalInterfaceLog(this.query).then((response) => {
        this.tableData = response.rows;
        this.total = response.total;
      });
    },
    search() {
      this.query.pageNum = 1;
      this.getList();
    },
    reset() {
      this.query = {
        pageNum: 1,
        pageSize: 30,
        keyWord: '',
        relatedModules: '',
      };
      this.searchTime = [];
      this.getList();
    },

    handleCurrentChange(val) {
      this.query.pageNum = val;
      this.getList();
    },
    handleSizeChange(val) {
      this.query.pageSize = val;
      this.getList();
    },
  },
};
</script>

<style scoped lang="scss">
.conscripts {
  height: auto;
  .el-form {
    width: 100%;
    display: flex;
    justify-content: space-between;
    .el-form-item {
      margin-bottom: 0;
    }
    .el-input {
      width: 12vw;
    }
    .el-select .el-input {
      width: 8vw;
    }
  }
  .table {
    height: calc(100vh - 34vh);
    background-color: #fff;
    margin-top: 16px;
    padding: 6px 24px;
    .table-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }
  }
  .pagination {
    height: 40px;
    padding-top: 10px;
    background: #fff;
    text-align: right;
    padding-right: 24px;
  }
  .tag {
    height: 36px;
    background: #fffbe6;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    padding-left: 20px;
    box-sizing: border-box;
    i {
      margin-right: 10px;
      font-size: 20px;
      color: #ffaa00;
    }
  }
}
.img-dialog {
  v-deep .el-dialog__header {
    border-bottom: none;
    // }
  }
}
.content-img {
  width: 100px;
  height: 100px;
  cursor: pointer;
}
</style>
<style lang="scss" scoped>
.toolbar {
  display: flex;
  align-items: center;
  background: #fff;
  height: 60px;
  padding: 0 24px;
  v-deep {
    .el-form {
      width: 100%;
      display: flex;
      justify-content: space-between;
      .el-form-item {
        margin-bottom: 0;
      }
      .el-input {
        width: 12vw;
      }
      .el-select {
        .el-input {
          width: 8vw;
        }
      }
    }
  }
}
</style>
