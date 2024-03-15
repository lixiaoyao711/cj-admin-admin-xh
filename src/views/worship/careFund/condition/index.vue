<template>
  <div class="helpingDynamics">
    <el-form
      class="search-form"
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width=""
    >
      <el-form-item label="行政区划：" prop="divisionCode">
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
    <div class="table">
      <div class="table-title-box">
        <div class="title-name">基金使用情况</div>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </div>
      <el-table v-loading="loading" :data="supportList" @selection-change="handleSelectionChange" height="85%">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="时间" align="center" prop="createTime" />
        <el-table-column label="使用人" align="center" prop="beneficiariesName" />
        <el-table-column label="行政区划" align="center" prop="beneficiariesDivisionName" />

        <el-table-column label="使用金额" align="center" prop="applicationAmount" />
        <el-table-column label="基金项目" align="center" prop="entryName" />
        <el-table-column label="状态" align="center" prop="currentLink">
          <template slot-scope="{ row }">
            <dict-tag :options="dict.type.care_fund_process" :value="row.currentLink" />
          </template>
        </el-table-column>

        <el-table-column label="登记人员" align="center" prop="createName" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleActivityDetail(scope.row)">更多资料</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>
    <itemInfo v-if="open" :propsData="propsData" @close="open = false" />
  </div>
</template>

<script>
import { fundUsageList } from '@/api/worship/careFund';
import { listByIds } from '@/api/system/oss';
import itemInfo from '../dialog/itemInfo';
export default {
  name: 'PartyStudyFile',
  dicts: [
    'sys_worship_visitingmethods',
    'sys_worship_assistancemeasures',
    'sys_worship_difficultytype',
    'sys_worship_difficultytype',
    'care_fund_process',
  ],
  components: {
    itemInfo,
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
      // 学习内容文件表格数据
      supportList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 表单参数
      form: {},
      activeName: '1',
      srcList: [],
      helpMethodStr: [],
      propsData: {},
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询学习内容文件列表 */
    getList() {
      this.loading = true;
      fundUsageList(this.queryParams).then((response) => {
        this.supportList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        createTime: undefined,
        createBy: undefined,
        updateTime: undefined,
        updateBy: undefined,
        delFlag: undefined,
        createId: undefined,
        updateId: undefined,
        title: undefined,
        content: undefined,
        fileUrl: undefined,
      };
      this.resetForm('form');
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 就业创业活动详情按钮操作 */
    handleActivityDetail(row) {
      // this.loading = true;
      this.propsData = JSON.parse(JSON.stringify(row));
      this.reset();
      const id = row.id || this.ids;
      this.open = true;
      // getVisiting(id).then(async (response) => {
      //   this.loading = false;
      //   this.form = response.data;
      //   let helpMethodList = [];
      //   this.form.helpMethod.split(',').map((e) => {
      //     let label = this.dict.type.sys_worship_assistancemeasures[e]?.label;
      //     label && helpMethodList.push(label);
      //   });
      //   this.helpMethodStr = helpMethodList.join(',');
      //   this.open = true;
      //   this.title = '帮扶详情';
      //   if (response.data.fileUrl) {
      //     let file = await this.getImgList(response.data.fileUrl);
      //     this.srcList = file.map((e) => e.url);
      //   }
      // });
    },
    openPath(url) {
      window.open(url);
    },
    async getImgList(id) {
      const { data } = await listByIds(id);
      let list = data.map((e) => {
        return { name: e.originalName, url: e.url, ossId: e.ossId };
      });
      return list;
    },
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
  margin: 16px 0 0 0;
  padding: 16px;
  box-sizing: border-box;
  height: 642px;
  .table-title-box {
    display: flex;
    justify-content: space-between;
    .title-name {
      font-family: PingFangSC-Medium;
      font-weight: 600;
      font-size: 18px;
      color: #333333;
    }
  }
}
.rows {
  .borderTop {
    border-top: 1px solid #efefef;
    padding-top: 24px;
  }
  .el-col {
    margin-bottom: 24px;
    color: #333333;
    display: flex;
    & > div {
      white-space: nowrap;
    }
    &.alignCenter {
      align-items: center;
    }
  }
}
</style>
