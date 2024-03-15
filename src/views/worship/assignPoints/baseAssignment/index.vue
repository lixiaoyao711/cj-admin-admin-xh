<template>
  <div class="ageAppropriate">
    <el-form
      class="search-form"
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width=""
    >
      <el-form-item label="赋分年份:" prop="searchTime">
        <el-date-picker v-model="queryParams.searchTime" type="year" placeholder="选择年" value-format="yyyy">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="所属镇街:" prop="divisionCode">
        <TreeSelectDivision
          v-model="queryParams.divisionCode"
          @treeselectChange="(e) => treeselectChange(e, queryParams, 'divisionCode')"
        ></TreeSelectDivision>
      </el-form-item>
      <el-form-item class="search-right">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="table mt10">
      <div class="table-header">
        <div class="table-title">赋分记录</div>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
              >导出统计表</el-button
            >
          </el-col>
        </el-row>
      </div>
      <el-table v-loading="loading" :data="ageAppropriateList | handleTableList" height="50vh" :span-method="arraySpan">
        <el-table-column label="所属板块" align="center" prop="module">
          <template slot-scope="scope">
            <div v-if="scope.row.num !== 0">
              <div>{{ scope.row.module }}</div>
              <div>最后得分:{{ scope.row.sumValue }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="赋分内容" align="center" prop="msg" />
        <el-table-column label="赋分计算" align="center" prop="fractionalValue" />
        <el-table-column label="是否隔年清零" align="center" prop="frequency" />
        <el-table-column label="原始分数" align="center" prop="originalScore" />
        <el-table-column label="权重" align="center" prop="weight" />
        <el-table-column label="赋分次数" align="center" prop="pointNum" />
        <el-table-column label="计算得分" align="center" prop="totalScore" />
      </el-table>
      <pagination
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>
  </div>
</template>

<script>
import { totalList, getFractionTotalByCode } from '@/api/worship/assignPoints.js';

export default {
  name: '',
  dicts: [],
  components: {},
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
              if (data[i].module == data[a].module) {
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
      //   console.log('过滤器', data);
      return data;
    },
  },
  data() {
    return {
      // 按钮loading
      buttonLoading: false,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      ageAppropriateList: [],
      fractionalValue: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        divisionCode: undefined,
        searchTime: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        id: [{ required: true, message: '主键不能为空', trigger: 'blur' }],
      },
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.user;
    },
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询适龄人员列表 */
    async getList() {
      this.loading = true;
      const code = this.queryParams.divisionCode ? this.queryParams.divisionCode : this.userInfo.divisionCode;
      const params = {
        ...this.queryParams,
        divisionCode: code,
        searchTime: this.queryParams.searchTime || new Date().getFullYear(),
      };
      await totalList(params).then((response) => {
        this.ageAppropriateList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      const divisionCode = this.queryParams.divisionCode
        ? this.queryParams.divisionCode + ':*'
        : this.userInfo.divisionCode + ':*';
      getFractionTotalByCode({
        divisionCode,
      }).then((response) => {
        this.fractionalValue = response.data;

        this.ageAppropriateList = this.ageAppropriateList.map((item) => {
          const data = this.fractionalValue.find((e) => e.module === item.module);
          item.sumValue = data?.totalScore || '暂无分数';
          return item;
        });
        console.log('ageAppropriateList', this.ageAppropriateList);
      });
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm');
      this.handleQuery();
    },

    /** 导出按钮操作 */
    handleExport() {
      const params = {
        ...this.queryParams,
        searchTime: this.queryParams.searchTime || new Date().getFullYear(),
      };
      this.download('/fraction/total/export', params, `赋分情况_${new Date().getTime()}.xlsx`);
    },
    arraySpan({ row, column, rowIndex, columnIndex }) {
      //合并第二列,这里columnIndex==1 根据具体业务要在前端写死
      if (columnIndex == 0 && this.ageAppropriateList.length > 1) {
        //计算合并的行数列数
        let x = row.num === 0 ? 0 : row.num;
        let y = row.num === 0 ? 0 : 1;
        return [x, y];
      }
      if (columnIndex == 1 && this.ageAppropriateList.length > 1) {
        //计算合并的行数列数
        let x = row.num1 === 0 ? 0 : row.num1 || 1;
        let y = row.num1 === 0 ? 0 : 1;
        return [x, y];
      }
    },
    handleClick() {},
  },
};
</script>
<style lang="scss" scoped>
.header {
  height: 37.33px;
  font-family: PingFangSC-Medium;
  font-weight: 600;
  font-size: 26.67px;
  color: #000000d9;
  letter-spacing: 0;
  line-height: 37.33px;
  margin-bottom: 16px;
}
.search-form {
  background-color: #fff;
  padding: 20px 0 0 20px;
  box-sizing: border-box;
  .search-right {
    float: right;
  }
}

.table {
  background: #fff;
  padding: 10px 20px;
  box-sizing: border-box;
  height: 64vh;
  .table-header {
    display: flex;
    justify-content: space-between;
  }
}
.tabs {
  display: flex;
  line-height: 40px;
  .draft {
    background: url('~@/assets/images/draft.png');
    width: 102px;
    height: 40px;
    cursor: pointer;
  }
  .el-tabs {
    margin: 0 20px 0 0;
  }
}
::v-deep .el-tabs__nav-wrap::after {
  height: 0px !important;
}
</style>
