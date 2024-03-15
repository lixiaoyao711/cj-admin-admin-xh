<template>
  <div class="app-container">
    <div class="header">就业创业活动</div>
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
      <el-form-item label="搜索：" prop="activityTitle">
        <el-input
          v-model="queryParams.activityTitle"
          placeholder="请输入标题"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item class="search-right">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="table">
      <div class="table-title-box">
        <div class="title-name">活动列表</div>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </div>
      <el-table
        v-loading="loading"
        :data="employmentActivityList"
        @selection-change="handleSelectionChange"
        height="85%"
      >
        <el-table-column label="行政区划" align="center" prop="divisionName" />
        <el-table-column label="活动标题" align="center" prop="activityTitle" />
        <el-table-column label="参加人数" align="center" prop="numOfParticipants">
          <template slot-scope="scope"> {{ scope.row.numOfParticipants }}人 </template>
        </el-table-column>
        <el-table-column label="活动日期" align="center" prop="activityTime" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.activityTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleActivityDetail(scope.row)">详情</el-button>
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
    <!-- 添加或修改学习内容文件对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="45%" append-to-body>
      <el-row class="rows">
        <el-col :span="24" class="alignCenter">
          <el-tag type="info" class="info-tag"
            ><dict-tag :options="dict.type.sys_worship_activity" :value="form.activityType"
          /></el-tag>
          <span class="name">{{ form.activityTitle }}</span>
        </el-col>
        <el-col :span="12"> 组织单位：{{ form.divisionName }} </el-col>
        <el-col :span="12">参加人数：{{ form.numOfParticipants }}人</el-col>
        <el-col :span="12"> 活动日期：{{ form.activityTime }} </el-col>
        <el-col :span="24">
          <div>活动地址：</div>
          {{ form.activityAddress }}
        </el-col>
        <el-col :span="24">
          <div>活动内容：</div>
          {{ form.activityContent }}
        </el-col>
        <el-col :span="24">
          <span class="mr10"> 活动照片:</span>
          <el-image
            class="mr10"
            v-for="(item, index) in form.fileList"
            :key="index"
            style="width: 100px; height: 100px"
            :src="item.url"
            :preview-src-list="form.fileList[0].url"
          >
          </el-image>
        </el-col>
      </el-row>
      <div class="line mt10"></div>
      <el-form-item label="参与公司" prop=""> </el-form-item>
      <el-table :data="tableList" class="mt10">
        <el-table-column label="公司名称" prop="companyName" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { listPartyActivities, getPartyActivities } from '@/api/worship/cjEvent';
import { listByIds } from '@/api/system/oss';
export default {
  name: 'PartyStudyFile',
  dicts: ['sys_worship_activity'],
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
      employmentActivityList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: undefined,
        activityTitle: undefined,
        activityType: '5',
      },
      // 表单参数
      form: {},
      activeName: '1',
      srcList: [],
      tableList: [],
      // 表单校验
      rules: {
        id: [{ required: true, message: '主键不能为空', trigger: 'blur' }],
        title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询学习内容文件列表 */
    getList() {
      this.loading = true;
      listPartyActivities(this.queryParams).then((response) => {
        this.employmentActivityList = response.rows;
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
      this.loading = true;
      this.reset();
      const id = row.id || this.ids;
      getPartyActivities(id).then(async (response) => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = '活动详情';

        this.tableList = [];
        if (response.data.participateCompany) {
          response.data.participateCompany.split(',').forEach((e) => {
            this.tableList.push({ companyName: e });
          });
        }
      });
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
  height: 696px;
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
.line {
  height: 10px;
  background: #f6f6f6;
}
.rows {
  .name {
    font-weight: 600;
    font-size: 24px;
  }
  .info-tag {
    margin-right: 12px;
  }
  .file {
    color: #1890ff;
    cursor: pointer;
    margin-bottom: 12px;
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
::v-deep .el-tabs__nav-wrap::after {
  height: 0px !important;
}
</style>
