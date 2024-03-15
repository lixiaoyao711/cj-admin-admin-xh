<template>
  <div class="zlbLog">
    <div class="toolbar">
      <el-form :model="query" ref="form" :inline="true">
        <div class="left">
          <el-form-item label="日期查询:">
            <el-date-picker
              v-model="searchTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
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
        <div class="left">2023-01-01至{{ time }}浙里办平均登录次数：{{ count }}次</div>
        <div class="right">
          <el-button type="primary" @click="toExcelData">导出日志</el-button>
        </div>
      </div>
      <el-table
        :data="tableData | handleTableList"
        v-loading="loading"
        border
        :span-method="arraySpanMethod"
        header-row-class-name="table-header"
        size="medium"
        style="width: 100%"
        height="calc(100% - 70px)"
      >
        <el-table-column prop="loginDateStr" label="登录日期"> </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="loginTimesStr" label="登录次数"> </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="query.page"
        :page-sizes="[10, 15, 30, 50, 100]"
        :page-size="query.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { formatDateTime } from '@/utils/common';
import { listLoginLog, getAverageOfLoginTime } from '@/api/monitor/operlog';
export default {
  filters: {
    // 处理企业生产数据表格数据list
    handleTableList(data) {
      data = JSON.parse(JSON.stringify(data));
      for (var i = 0; i < data.length; i++) {
        if (data[i].already !== 1) {
          if (data[i + 1]) {
            data[i].num = 1;
            for (var a = i + 1; a < data.length; a++) {
              // 需要合并的列名
              if (data[i].loginDateStr === data[a].loginDateStr) {
                data[i].num++;
                data[a].num = 0;
                data[a].already = 1;
              } else {
                break;
              }
            }
          }
        }
      }
      //将整理后的数据交给表格渲染
      // this.dataList = data
      console.log('过滤器', data);
      return data;
    },
  },
  props: {},
  components: {},
  data() {
    return {
      searchTime: null,
      query: {
        pageNum: 1,
        pageSize: 30,
        moduleType: 2,
        beginDate: '',
        endDate: '',
      },
      loading: false,

      tableData: [],
      total: 0,
      count: 0,
      time: formatDateTime(new Date()),
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.getList();
  },
  methods: {
    async getList() {
      this.rowIndexArr = [];
      this.loading = true;
      this.query.beginDate = this.searchTime?.[0];
      this.query.endDate = this.searchTime?.[1];
      const res  = await listLoginLog(this.query);
      this.tableData = res.rows;
      this.total = res.total;
      this.loading = false;
      this.getCount();
      // axios({
      //   url: '/loginLog/getPage',
      //   method: 'get',
      //   params: this.query,
      // }).then((res) => {
      //   this.tableData = res.records;
      //   this.total = res.total;
      //   this.loading = false;
      //   this.getCount();
      // });
    },
    async getCount() {
      const { data } = await getAverageOfLoginTime(this.query);
      this.count = data;
      // axios({
      //   url: '/loginLog/getAverageOfLoginTime',
      //   method: 'get',
      //   params: this.query,
      // }).then((res) => {
      //   this.count = res;
      // });
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      //合并第二列,这里columnIndex==1 根据具体业务要在前端写死
      if (columnIndex == 0) {
        //计算合并的行数列数
        let x = row.num == 0 ? 0 : row.num;
        let y = row.num == 0 ? 0 : 1;
        return [x, y];
      }
    },
    search() {
      this.getList();
    },
    reset() {
      this.query = {
        page: 1,
        size: 30,
        moduleType: 2,
        beginDate: '',
        endDate: '',
      };
      this.searchTime = [];
      this.search();
    },
    toExcelData() {
      this.query.beginDate = this.searchTime?.[0];
      this.query.endDate = this.searchTime?.[1];
      fetch(
        `/worship/loginLog/exportZlbLoginLog?beginDate=${this.query.beginDate || ''}&endDate=${
          this.query.endDate || ''
        }&page=${this.query.page}&size=${this.query.size}&moduleType=2`,
        {
          headers: {
            Authorization: sessionStorage.token,
          },
        }
      ).then((res) => {
        res.blob().then((blob) => {
          var a = document.createElement('a');
          var url = window.URL.createObjectURL(blob);
          var filename = '登录明细.xlsx';
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        });
      });
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
.toolbar {
  display: flex;
  align-items: center;
  background: #fff;
  height: 60px;
  padding: 0 24px;

  .el-form {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
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
.left {
  display: flex;
  align-items: center;
}
.zlbLog {
  .table {
    height: calc(100vh - 40vh);
    background-color: #fff;
    margin-top: 16px;
    padding: 6px 24px;
    .table-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 12px 0;
    }
  }
  .pagination {
    height: 40px;
    padding-top: 10px;
    background: #fff;
    text-align: right;
    padding-right: 24px;
  }
}
</style>
