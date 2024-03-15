<template>
  <div class="suspectedDifficultyPerson">
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
      <el-form-item label="认定困难情况：" prop="difficultyType">
        <el-select v-model="queryParams.difficultyType" placeholder="请选择" clearable>
          <el-option
            v-for="dict in dict.type.sys_worship_difficultyinidentification"
            :key="dict.value"
            :label="dict.label"
            :value="dict.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item class="search-right">
        <el-form-item label="" prop="searchValue">
          <el-input
            v-model="queryParams.searchValue"
            placeholder="输入关键字搜索"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="table">
      <div class="table-title-box">
        <div class="title-name">疑似困难人员</div>
        <el-row :gutter="10" class="mb8">
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </div>
      <el-table v-loading="loading" :data="suspectedList" @selection-change="handleSelectionChange" height="85%">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="姓名" align="center" prop="name" width="100" />
        <el-table-column label="性别" align="center" prop="sex" width="100" />
        <el-table-column label="身份证号" align="center" prop="idCard" />
        <el-table-column label="联系方式" align="center" prop="phone" width="120" />
        <el-table-column label="行政区划" align="center" prop="divisionName" />
        <el-table-column label="政治面貌" align="center" prop="politicalLandscape" />
        <el-table-column label="认定困难情况" align="center" prop="difficultyType">
          <template slot-scope="scope">
            <span>{{ scope.row.difficultInfo.difficultyType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="人员标签" align="center" prop="personnelTags" width="160">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_worship_personneltag" :value="scope.row.personTags" />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
              <router-link :to="'/worship/people-info/info/' + scope.row.id" class="link-type">
              <!-- <router-link :to="'/worship/people-info/info/' + scope.row.id + '?tab=assistanceInfo'" class="link-type"> -->
              <el-button class="btn" size="mini" type="text">详情</el-button>
            </router-link>
            <el-button
              size="mini"
              type="text"
              @click="handleUpdate(scope.row, '困难转入')"
              v-hasPermi="['worship:suspectedDifficultyPerson:transfer']"
              >困难转入</el-button
            >
            <el-button
              size="mini"
              type="text"
              @click="handleUpdate(scope.row, '核实非困难')"
              v-hasPermi="['worship:suspectedDifficultyPerson:verify']"
              >核实非困难</el-button
            >
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
    <!-- 添加或修改岗位库对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <template v-if="title === '困难转入'">
          <el-form-item label="核实困难类型：" prop="verifyTypeDifficulty">
            <el-checkbox-group v-model="verifyTypeDifficultyList" @change="handleCheckboxChange">
              <el-checkbox v-for="dict in dict.type.sys_worship_difficultytype" :key="dict.value" :label="dict.label">
                {{ dict.label }}</el-checkbox
              >
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="困难情况说明：" prop="explanationDifficulties">
            <el-input v-model="form.explanationDifficulties" type="textarea" placeholder="请输入困难情况说明" />
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item label="非困难原因：" prop="noDifficultReason">
            <el-input v-model="form.noDifficultReason" type="textarea" placeholder="请输入非困难原因" />
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryPageSuspect, addCareInfo } from '@/api/worship/carePersonList';

export default {
  name: 'suspectedDifficultyPerson',
  dicts: [
    'sys_worship_difficultytype',
    'sys_worship_facetype',
    'sys_worship_personneltag',
    'sys_worship_visitingmethods',
    'sys_worship_difficultyinidentification',
  ],
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
      // 岗位库表格数据
      suspectedList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        searchValue: '',
        divisionCode: undefined,
      },
      // 表单参数
      form: {},
      verifyTypeDifficultyList: [],
      // 表单校验
      rules: {
        verifyTypeDifficulty: [{ required: true, message: '核实困难类型不能为空', trigger: 'blur' }],
        explanationDifficulties: [{ required: true, message: '困难情况说明不能为空', trigger: 'blur' }],
        noDifficultReason: [{ required: true, message: '非困难原因不能为空', trigger: 'change' }],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      queryPageSuspect(this.queryParams).then((response) => {
        this.suspectedList = response.rows;
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
        jobName: undefined,
        companyName: undefined,
        industry: undefined,
        jobSalary: undefined,
        workAddress: undefined,
        contacts: undefined,
        contactsPhone: undefined,
        jobIntroduction: undefined,
        recommendationNum: undefined,
        recruitStatus: undefined,
        divisionCode: undefined,
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
    handleCheckboxChange(val) {
      this.form.verifyTypeDifficulty = val.join(',');
    },
    /** 修改按钮操作 */
    handleUpdate(row, title) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids;
      this.loading = false;
      this.form = {
        personId: row.id,
        type: title === '困难转入' ? '1' : '3',
      };
      this.open = true;
      this.title = title;
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          addCareInfo(this.form)
            .then((response) => {
              this.$modal.msgSuccess('成功');
              this.open = false;
              this.getList();
              this.form = {};
              this.verifyTypeDifficultyList = [];
              this.$emit('changeTag');
            })
            .finally(() => {
              this.buttonLoading = false;
            });
        }
      });
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
  .btn {
    margin-right: 8px;
  }
}
.el-icon-location-information {
  font-size: 24px;
  margin: 5px 0 0 18px;
  cursor: pointer;
}
.rows {
  margin-bottom: 24px;
  .name {
    font-weight: 600;
    font-size: 24px;
  }
  &.title {
    font-weight: 600;
    font-size: 18px;
    padding-top: 12px;
    border-top: 10px solid #efefef;
  }
  .el-col {
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
