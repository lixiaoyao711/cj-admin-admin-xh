<template>
  <div class="loginLogInfo">
    <div class="table">
      <div class="table-title">
        <el-form :model="query" ref="form" :inline="true">
          <div class="left">
            <el-form-item label="">
              <el-tabs v-model="query.divisionLevel" @tab-click="handleClick">
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
                :disabled="query.divisionLevel !== 'null'"
                v-model="query.divisionCode"
                @treeselectChange="(e) => treeselectChange(e, query, 'divisionCode')"
              ></TreeSelectDivision>
            </el-form-item>
            <el-form-item label="登录设备:">
              <el-select v-model="query.loginType" placeholder="请选择">
                <el-option
                  v-for="dict in dict.type.sys_worship_logintype"
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
                :default-time="['00:00:00', '23:59:59']"
              >
              </el-date-picker>
            </el-form-item>
          </div>
          <div class="right">
            <el-button type="primary" @click="toExcelData">导出日志</el-button>
            <el-button type="primary" @click="search">查 询</el-button>
            <el-button @click="reset">重 置</el-button>
          </div>
        </el-form>
      </div>
      <el-table
        :data="tableData"
        border
        header-row-class-name="table-header"
        size="medium"
        style="width: 100%"
        height="calc(100% - 70px)"
        @selection-change="handleSelectionChange"
      >
        <el-table-column prop="userName" label="操作人"> </el-table-column>
        <el-table-column prop="divisionName" label="行政区划"> </el-table-column>
        <el-table-column prop="msg" label="操作内容"> </el-table-column>
        <el-table-column prop="equTypeName" label="平台">
          <template slot-scope="{ row }">
            <dict-tag :options="dict.type.sys_worship_logintype" :value="row.loginType" />
          </template>
        </el-table-column>
        <el-table-column prop="loginTime" label="操作时间"> </el-table-column>
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
import { listLogininfor } from '@/api/monitor/operlog';
export default {
  props: {
    // query: Object,
  },
  dicts: ['sys_worship_logintype'],
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
          name: 'null',
        },
      ],
      options: [
        {
          label: '全部',
          value: 0,
        },
        {
          label: 'pc端',
          value: 1,
        },
        {
          label: '移动端',
          value: 2,
        },
      ],
      searchTime: [],
      query: {
        pageNum: 1,
        pageSize: 30,
        loginType: '0,1,2,3',
        divisionLevel: '3',
        divisionCode: undefined,
      },

      tableData: [],
      total: 0,
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.user;
    },
  },
  watch: {},
  created() {
    this.query.divisionLevel = this.$route.query.minTab || '3';
    this.query.divisionCode = this.userInfo.divisionCode;
    this.getList();
  },
  mounted() {},
  methods: {
    getList() {
      console.log('userInfo', this.userInfo);
      this.query.beginTime = this.searchTime?.[0];
      this.query.endTime = this.searchTime?.[1];
      const divisionLevel = this.query.divisionLevel === 'null' ? '' : this.query.divisionLevel;
      const divisionCode = this.query.divisionLevel !== 'null' ? '' : this.query.divisionCode;
      listLogininfor({ ...this.query, divisionLevel, divisionCode }).then((res) => {
        this.tableData = res.rows;
        this.total = res.total;
      });
      // let departCode = '';
      // axios({
      //   url: '/loginLog/getLoginPage',
      //   method: 'get',
      //   params: { ...this.query, searchTime: null, departCode },
      // }).then((res) => {
      //   this.tableData = res.records;
      //   this.total = res.total;
      // });
    },
    search() {
      this.query.pageNum = 1;
      this.getList();
    },
    reset() {
      this.query = {
        pageNum: 1,
        pageSize: 30,
        loginType: '0,1,2,3',
        divisionLevel: '3',
        divisionCode: this.userInfo.divisionCode,
      };
      this.getList();
    },
    getById(id) {
      // axios({
      //   methods: 'get',
      //   url: '/visitsCondolences/getById',
      //   params: { id: id },
      // }).then((res) => {
      //   this.infoData = res;
      // });
    },
    viewImg(url) {
      this.dialogImageUrl = url;
      this.imgDialogVisible = true;
    },

    handleSelectionChange(data) {
      this.checkData = data;
    },
    handleCurrentChange(val) {
      this.query.pageNum = val;
      this.getList();
    },
    handleSizeChange(val) {
      this.query.pageSize = val;
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
      this.getList();
    },
    // 导出岗位列表
    toExcelData() {
      this.query.beginTime = this.searchTime?.[0];
      this.query.endTime = this.searchTime?.[1];
      let departCode = getFormDepartCode(this.query.departCode).departCode;
      fetch(
        `/worship/loginLog/exportLoginLog?beginTime=${this.query.beginTime || ''}&endTime=${
          this.query.endTime || ''
        }&page=${this.query.page}&size=${this.query.size}&departType=${this.query.departType}&departCode=${
          departCode || ''
        }&platType=${this.query.platType}`,
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
</style>
