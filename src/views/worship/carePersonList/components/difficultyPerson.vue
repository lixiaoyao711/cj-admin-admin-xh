<template>
  <div class="difficultyPerson">
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
      <el-form-item label="困难类型：" prop="verifyTypeDifficulty">
        <el-select v-model="queryParams.verifyTypeDifficulty" placeholder="请选择" clearable>
          <el-option
            v-for="dict in dict.type.sys_worship_difficultytype"
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
        <div class="title-name">困难人员列表</div>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              :disabled="multiple"
              size="mini"
              @click="handleExport(1)"
              v-hasPermi="['worship:difficultyPerson:export']"
              >导 出</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              size="mini"
              @click="handleExport(2)"
              v-hasPermi="['worship:difficultyPerson:export']"
              >全部导出</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['worship:difficultyPerson:add']"
              >新 增</el-button
            >
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </div>
      <el-table v-loading="loading" :data="difficultyPersonList" @selection-change="handleSelectionChange" height="85%">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="姓名" align="center" prop="name" width="100">
          <template slot-scope="scope">{{ scope.row.personInfo.name }}</template>
        </el-table-column>
        <el-table-column label="性别" align="center" prop="sex" width="100">
          <template slot-scope="scope">{{ scope.row.personInfo.sex }}</template>
        </el-table-column>
        <el-table-column label="身份证号" align="center" prop="idCard">
          <template slot-scope="scope">{{ scope.row.personInfo.idCard }}</template>
        </el-table-column>
        <el-table-column label="联系方式" align="center" prop="phone">
          <template slot-scope="scope">{{ scope.row.personInfo.phone }}</template>
        </el-table-column>
        <el-table-column label="行政区划" align="center" prop="divisionName">
          <template slot-scope="scope">{{ scope.row.personInfo.divisionName }}</template>
        </el-table-column>
        <el-table-column label="认定困难情况" align="center" prop="difficultyType">
          <template slot-scope="scope">{{ scope.row.difficultInfo.difficultyType }}</template>
        </el-table-column>
        <el-table-column label="困难类型" align="center" prop="verifyTypeDifficulty">
          <template slot-scope="scope">{{
            scope.row.difficultInfo.verifyTypeDifficulty === 'null'
              ? '无'
              : scope.row.difficultInfo.verifyTypeDifficulty
          }}</template>
        </el-table-column>
        <el-table-column label="困难说明" align="center" prop="explanationDifficulties">
          <template slot-scope="scope">{{
            scope.row.difficultInfo.explanationDifficulties === 'null'
              ? '无'
              : scope.row.difficultInfo.explanationDifficulties
          }}</template>
        </el-table-column>
        <el-table-column label="人员标签" align="center" prop="personnelTags" width="160">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_worship_personneltag" :value="scope.row.personTags" />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <router-link :to="'/worship/people-info/info/' + scope.row.personId" class="link-type">
              <!-- <router-link :to="'/worship/people-info/info/' + scope.row.id + '?tab=assistanceInfo'" class="link-type"> -->
              <el-button class="btn" size="mini" type="text">详情</el-button>
            </router-link>
            <el-button
              size="mini"
              type="text"
              v-if="scope.row.type === '1'"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['worship:difficultyPerson:transfer']"
              >转出困难</el-button
            >
            <el-button size="mini" type="text" disabled v-if="scope.row.type === '4'">待转出</el-button>
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
    <!-- 困难转出 -->
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
          <el-form-item label="转出时间:" prop="transferTime">
            <el-date-picker
              v-model="form.transferTime"
              type="datetime"
              placeholder="选择日期"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="核实人员：" prop="verifyPerson">
            <el-input v-model="form.verifyPerson" placeholder="请输入核实人员" />
          </el-form-item>
          <el-form-item label="转出类型:" prop="transferType">
            <el-radio-group v-model="form.transferType">
              <el-radio v-for="dict in dict.type.sys_worship_transferout" :key="dict.value" :label="dict.label">{{
                dict.label
              }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="核实情况：" prop="noDifficultReason">
            <el-input v-model="form.noDifficultReason" type="textarea" placeholder="请输入内容" />
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <People
      v-if="showPeople"
      :type="'retireStatus'"
      :isRadio="true"
      @close="showPeople = false"
      @success="peoSuccess"
    />
  </div>
</template>

<script>
import { updateCareInfo, careInfoList, addCareInfo } from '@/api/worship/carePersonList';
import People from '@/components/ChangePeoPle/people';

export default {
  name: 'difficultyPerson',
  dicts: ['sys_worship_difficultytype', 'sys_worship_personneltag', 'sys_worship_transferout'],
  components: { People },
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
      // 入驻企业表格数据
      difficultyPersonList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        searchValue: '',
        companyName: undefined,
      },
      // 表单参数
      form: {},
      showPeople: false,
      verifyTypeDifficultyList: [],
      // 表单校验
      rules: {
        transferTime: [{ required: true, message: '转出时间不能为空', trigger: 'blur' }],
        transferType: [{ required: true, message: '转出类型不能为空', trigger: 'blur' }],
        verifyPerson: [{ required: true, message: '核实人员不能为空', trigger: 'change' }],
        verifyTypeDifficulty: [{ required: true, message: '核实困难类型不能为空', trigger: 'blur' }],
        explanationDifficulties: [{ required: true, message: '困难情况说明不能为空', trigger: 'blur' }],
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
    getList() {
      this.loading = true;
      this.queryParams.type = '1';
      careInfoList(this.queryParams).then((response) => {
        this.difficultyPersonList = response.rows;
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
        companyName: undefined,
        industry: undefined,
        companyAddress: undefined,
        contacts: undefined,
        contactsPhone: undefined,
        companyIntroduction: undefined,
        activityNum: undefined,
      };
      this.verifyTypeDifficultyList = [];
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.showPeople = true;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids;
      this.loading = false;
      this.form = {
        id: row.id,
        personId: row.personId,
        type: '4',
        whetherMessage: '1',
      };
      this.open = true;
      this.title = '转出困难';
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateCareInfo(this.form)
              .then((response) => {
                this.$modal.msgSuccess('成功');
                this.open = false;
                this.getList();
                this.$emit('changeTag');
                this.form = {};
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else {
            addCareInfo(this.form)
              .then((response) => {
                this.$modal.msgSuccess('成功');
                this.open = false;
                this.showPeople = false;
                this.getList();
                this.form = {};
                this.$emit('changeTag');
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          }
        }
      });
    },
    /** 导出按钮操作 */
    handleExport(type) {
      let params = {};
      if (type === 1) {
        params = {
          ids: this.ids.join(','),
        };
      }
      if (type === 2) {
        params = {
          divisionCode: this.userInfo.divisionCode,
        };
      }

      this.download('/worship/careInfo/export', params, `困难人员_${new Date().getTime()}.xlsx`);
    },
    handleCheckboxChange(val) {
      this.form.verifyTypeDifficulty = val.join(',');
    },
    peoSuccess(data) {
      this.loading = true;
      this.reset();
      this.loading = false;
      this.form = {
        personId: data.id,
        type: '1',
      };
      this.open = true;
      this.title = '困难转入';
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
.rows {
  margin-bottom: 24px;
  .name {
    font-weight: 600;
    font-size: 24px;
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
