<template>
  <div class="loginLogInfo">
    <div class="table">
      <div class="table-title">
        <el-form :model="query" ref="form" :inline="true">
          <div class="left">
            <el-form-item label="">
              <el-tabs v-model="query.departType" @tab-click="handleClick">
                <el-tab-pane
                  v-for="(item, index) in tabList"
                  :key="index"
                  :label="item.label"
                  :name="item.name"
                ></el-tab-pane>
              </el-tabs>
            </el-form-item>
            <el-form-item label="行政区划:">
              <TreeSelectDivision
                :disabled="query.departType !== '1'"
                v-model="query.divisionCode"
                @treeselectChange="(e) => treeselectChange(e, query, 'divisionCode')"
              ></TreeSelectDivision>
            </el-form-item>
            <el-form-item label="日期查询:">
              <el-date-picker
                :picker-options="pickerOptions"
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
            <el-button type="primary" @click="toExcelData">导出日志</el-button>
            <el-button type="primary" @click="getList">查 询</el-button>
            <el-button @click="reset">重 置</el-button>
          </div>
        </el-form>
      </div>
      <el-table
        key="1"
        v-show="query.departType === '3'"
        :data="tableData | handleTableList"
        v-loading="loading"
        border
        :span-method="arraySpanMethod"
        header-row-class-name="table-header"
        size="medium"
        style="width: 100%"
        height="calc(100% - 70px)"
        @selection-change="handleSelectionChange"
      >
        <el-table-column width="180" prop="deptName" label="部门"> </el-table-column>
        <el-table-column width="180" prop="divisionName" label="行政区划"> </el-table-column>
        <el-table-column width="100" prop="nickName" label="姓名"> </el-table-column>
        <el-table-column width="110" v-for="(item, index) in loginMap" prop="divisionName" :label="index">
          <template slot-scope="{ row }">
            <div>
              <div v-if="row.loginMap[index] >= 0" :class="row.loginMap[index] === 0 ? 'noData' : ''">
                {{ row.loginMap[index] }} 次
              </div>
              <div v-if="row.loginMap[index] === -1" class="noData">无账号</div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-table
        key="2"
        v-show="query.departType === '4'"
        :data="tableData | handleTable"
        v-loading="loading"
        border
        :span-method="arraySpanMethod"
        header-row-class-name="table-header"
        size="medium"
        style="width: 100%"
        height="calc(100% - 70px)"
        @selection-change="handleSelectionChange"
      >
        <el-table-column width="180" prop="divisionName" label="行政区划"> </el-table-column>
        <el-table-column width="100" prop="nickName" label="姓名"> </el-table-column>
        <el-table-column width="110" v-for="(item, index) in loginMap" prop="divisionName" :label="index">
          <template slot-scope="{ row }">
            <div>
              <div v-if="row.loginMap[index] >= 0" :class="row.loginMap[index] === 0 ? 'noData' : ''">
                {{ row.loginMap[index] }} 次
              </div>
              <div v-if="row.loginMap[index] === -1" class="noData">无账号</div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-table
        key="3"
        v-show="query.departType === '1'"
        :data="tableData | handleTableData"
        v-loading="loading"
        border
        :span-method="arraySpan"
        header-row-class-name="table-header"
        size="medium"
        style="width: 100%"
        height="calc(100% - 70px)"
        @selection-change="handleSelectionChange"
      >
        <el-table-column width="180" prop="divisionName" label="行政区划"> </el-table-column>
        <el-table-column width="180" prop="deptName" label="部门"> </el-table-column>
        <el-table-column width="180" prop="nickName" label="姓名"> </el-table-column>
        <el-table-column width="110" v-for="(item, index) in loginMap" prop="divisionName" :label="index">
          <template slot-scope="{ row }">
            <div>
              <div v-if="row.loginMap[index] >= 0" :class="row.loginMap[index] === 0 ? 'noData' : ''">
                {{ row.loginMap[index] }} 次
              </div>
              <div v-if="row.loginMap[index] === -1" class="noData">无账号</div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { timeFormat } from '@/utils/common';
import { listGetLoginTail } from '@/api/monitor/operlog';
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
              if (data[i].deptName === data[a].deptName) {
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

      return data;
    },
    // 处理企业生产数据表格数据list
    handleTable(data) {
      data = JSON.parse(JSON.stringify(data));
      for (var i = 0; i < data.length; i++) {
        if (data[i].already !== 1) {
          if (data[i + 1]) {
            data[i].num = 1;
            for (var a = i + 1; a < data.length; a++) {
              // 需要合并的列名
              if (data[i].divisionName === data[a].divisionName) {
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
      return data;
    },
    // 处理企业生产数据表格数据list
    handleTableData(data) {
      data = JSON.parse(JSON.stringify(data));
      for (var i = 0; i < data.length; i++) {
        if (data[i].already !== 1) {
          if (data[i + 1]) {
            data[i].num = 1;
            for (var a = i + 1; a < data.length; a++) {
              // 需要合并的列名
              if (data[i].divisionName === data[a].divisionName) {
                data[i].num++;
                data[a].num = 0;
                data[a].already = 1;
              } else {
                break;
              }
            }
          }
        }
        if (data[i].already1 !== 1) {
          if (data[i + 1]) {
            data[i].num1 = 1;
            for (var b = i + 1; b < data.length; b++) {
              // 需要合并的列名
              if (data[i].deptName === data[b].deptName) {
                data[i].num1++;
                data[b].num1 = 0;
                data[b].already1 = 1;
              } else {
                break;
              }
            }
          }
        }
      }
      return data;
    },
  },
  props: {
    propsQuery: {},
  },
  components: {},
  data() {
    return {
      tabList: [
        {
          label: '区本级',
          name: '3',
        },
        {
          label: '街道本级',
          name: '4',
        },
        {
          label: '精确查询',
          name: '1',
        },
      ],
      // 只能筛指定日期
      pickerOptions: {
        // 限制时间
        disabledDate(time) {
          // 只能选当前31天的时间
          return time.getTime() > new Date() || time.getTime() < new Date().getTime() - 3600 * 1000 * 24 * 40;
        },
      },
      loading: false,

      searchTime: [],

      query: {
        departType: '3',
        divisionCode: undefined,
      },
      tableData: [],
      loginMap: [],
      total: 0,
    };
  },

  computed: {
    // ...mapState(['userinfo', 'dictMap']),
  },
  watch: {
    // userinfo() {
    //   this.form.divisionCode = this.userinfo.departCode;
    // },
    // propsQuery: {
    //   handler(val) {
    //     this.query = {
    //       ...this.query,
    //       ...val,
    //     };
    //     console.log('this.query', this.query);
    //   },
    //   deep: true,
    // },
  },
  created() {
    this.searchTime = [this.countTime(15), new Date()];
    // this.searchTime = [new Date().setDate(new Date().getDate() - 60), new Date().setDate(new Date().getDate() + 45)];

    this.query.departType = this.$route.query.minTab || '3';
    this.getList();
  },
  mounted() {},
  methods: {
    async getList() {
      this.loading = true;
      this.query.beginDate = timeFormat(this.searchTime?.[0], 'yyyy-MM-dd');
      this.query.endDate = timeFormat(this.searchTime?.[1], 'yyyy-MM-dd');
      const { data } = await listGetLoginTail({
        ...this.query,
        searchTime: null,
      });
      if (data[0]) {
        this.tableData = data;
        this.loginMap = data[0].loginMap;
      } 
      else {
        this.tableData = [];
        this.loginMap = [];
      }
      this.loading = false;

      // axios({
      //   url: '/loginLog/getLoginTail',
      //   method: 'post',
      //   data: { ...this.query, searchTime: null, divisionCode },
      // }).then((res) => {
      //   if (res[0]) {
      //     this.tableData = res;
      //     this.loginMap = res[0].loginMap;
      //   }
      //   this.loading = false;
      // });
    },

    countTime(day) {
      let time = new Date().getTime();
      let dayNumber = 3600 * 1000 * 24 * day;
      let sumTime = time - dayNumber;
      return new Date(timeFormat(sumTime, 'yyyy,MM,dd'));
    },

    reset() {
      this.searchTime = [this.countTime(15), new Date()];
      this.query = {
        departType: this.query.departType,
        divisionCode: undefined,
      };
      this.getList();
    },
    arraySpan({ row, column, rowIndex, columnIndex }) {
      console.log(row, column, rowIndex, columnIndex);
      //合并第二列,这里columnIndex==1 根据具体业务要在前端写死
      if (columnIndex == 0 && this.tableData.length > 1) {
        //计算合并的行数列数
        let x = row.num === 0 ? 0 : row.num;
        let y = row.num === 0 ? 0 : 1;
        return [x, y];
      }
      if (columnIndex == 1 && this.tableData.length > 1) {
        //计算合并的行数列数
        let x = row.num1 === 0 ? 0 : row.num1 || 1;
        let y = row.num1 === 0 ? 0 : 1;
        return [x, y];
      }
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      //合并第二列,这里columnIndex==1 根据具体业务要在前端写死
      if (columnIndex == 0 && this.tableData.length > 1) {
        //计算合并的行数列数
        let x = row.num == 0 ? 0 : row.num || 1;
        let y = row.num == 0 ? 0 : 1;
        return [x, y];
      }
    },
    handleSelectionChange(data) {
      this.checkData = data;
    },
    handleCurrentChange(val) {
      this.query.page = val;
      this.getList();
    },
    handleSizeChange(val) {
      this.query.size = val;
      this.getList();
    },
    handleClick(vm) {
      this.$router.replace({
        name: '',
        query: {
          ...this.$route.query,
          minTab: vm.name,
        },
      });
      if (this.query.departType !== '1') {
        this.query.divisionCode = undefined;
      }
      this.getList();
    },
    // 导出岗位列表
    toExcelData() {
      this.query.beginDate = timeFormat(this.searchTime?.[0], 'yyyy-MM-dd');
      this.query.endDate = timeFormat(this.searchTime?.[1], 'yyyy-MM-dd');

      let divisionCode = '';
      fetch(
        `/worship/loginLog/export?beginDate=${this.query.beginDate || ''}&endDate=${
          this.query.endDate || ''
        }&departType=${this.query.departType}&divisionCode=${divisionCode || ''}`,

        {
          headers: {
            Authorization: sessionStorage.token,
          },
        }
      ).then((res) => {
        res.blob().then((blob) => {
          var a = document.createElement('a');
          var url = window.URL.createObjectURL(blob);
          var filename = '登录统计.xlsx';
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        });
      });
    },
  },
};
</script>

<style scoped lang="scss">
.loginLogInfo {
  height: auto;
  .serch {
    height: 60px;
    padding: 0 24px;
    box-sizing: border-box;
    background: #ffffff;
    border-radius: 2px;
    display: flex;
    align-items: center;
    v-deep .el-form {
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
  }
  .table {
    height: calc(100vh - 33vh);
    background-color: #fff;
    margin-top: 16px;
    padding: 6px 24px;
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
.left {
  display: flex;
  align-items: center;
}
.el-form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.noData {
  color: red;
}
</style>
