<template>
  <div class="app-container">
    <div class="header">军创企业</div>
    <el-form class="search-form" :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="">
      <!-- <el-form-item label="创业类型" prop="entrepreneurshipType">
        <el-select v-model="queryParams.entrepreneurshipType" placeholder="请选择创业类型" clearable>
          <el-option
            v-for="dict in dict.type.sys_worship_level"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item label="职务：" prop="entrepreneurshipType">
        <el-select v-model="queryParams.entrepreneurshipType" placeholder="请选择职务" clearable>
          <el-option
            v-for="dict in dict.type.sys_worship_level"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item label="控股情况：" prop="entrepreneurshipType">
        <el-select v-model="queryParams.entrepreneurshipType" placeholder="请选择控股情况" clearable>
          <el-option
            v-for="dict in dict.type.sys_worship_level"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item label="搜索：" prop="companyName">
        <el-input
          v-model="queryParams.companyName"
          placeholder="请输入"
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
        <div class="title-name">军创企业列表</div>
        <el-row :gutter="10" class="mb8">
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </div>
      <el-table v-loading="loading" :data="militaryEntrepreneurshipList" @selection-change="handleSelectionChange" height="86%">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="姓名" align="center" prop="name" />
        <el-table-column label="企业名称" align="center" prop="companyName" />
        <el-table-column label="统一信用代码" align="center" prop="unifiedCreditCode" />
        <el-table-column label="创业类型" align="center" prop="entrepreneurshipType"></el-table-column>
        <el-table-column label="法定代表人" align="center" prop="legalPersonName" />
        <el-table-column label="法定代表人联系方式" align="center" prop="legalPersonPhonenumber" />
        <el-table-column label="控股情况" align="center" prop="registrationCost" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <router-link :to="'/worship/people-info/info/' + scope.row.personId + '?tab=employmentInfo'" class="link-type">
              <el-button size="mini" type="text">详情</el-button>
            </router-link>
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
    <!-- 添加或修改军创企业对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
    </el-dialog>
  </div>
</template>

<script>
import { listMilitaryEntrepreneurship, getMilitaryEntrepreneurship, delMilitaryEntrepreneurship, addMilitaryEntrepreneurship, updateMilitaryEntrepreneurship } from "@/api/worship/militaryEntrepreneurship";

export default {
  name: "MilitaryEntrepreneurship",
  dicts: ['sys_worship_level'],
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
      // 军创企业表格数据
      militaryEntrepreneurshipList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        companyName: undefined,
        entrepreneurshipType: undefined,
        legalPersonPhonenumber: undefined,
        stockSituation: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        id: [
          { required: true, message: "主键不能为空", trigger: "blur" }
        ],
        personId: [
          { required: true, message: "人员id不能为空", trigger: "blur" }
        ],
        companyName: [
          { required: true, message: "企业名称不能为空", trigger: "blur" }
        ],
        unifiedCreditCode: [
          { required: true, message: "统一信用代码不能为空", trigger: "blur" }
        ],
        entrepreneurshipType: [
          { required: true, message: "创业类型不能为空", trigger: "change" }
        ],
        legalPersonName: [
          { required: true, message: "法定代表人不能为空", trigger: "blur" }
        ],
        legalPersonPhonenumber: [
          { required: true, message: "法定代表人联系方式不能为空", trigger: "blur" }
        ],
        stockSituation: [
          { required: true, message: "控股情况不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询军创企业列表 */
    getList() {
      this.loading = true;
      listMilitaryEntrepreneurship(this.queryParams).then(response => {
        this.militaryEntrepreneurshipList = response.rows;
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
        createId: undefined,
        updateId: undefined,
        delFlag: undefined,
        personId: undefined,
        companyName: undefined,
        unifiedCreditCode: undefined,
        entrepreneurshipType: undefined,
        legalPersonName: undefined,
        legalPersonPhonenumber: undefined,
        stockSituation: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('worship/militaryEntrepreneurship/export', {
        ...this.queryParams
      }, `militaryEntrepreneurship_${new Date().getTime()}.xlsx`)
    }
  }
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
.el-icon-location-information {
  font-size: 24px;
  margin: 5px 0 0 18px;
  cursor: pointer;
}
</style>
