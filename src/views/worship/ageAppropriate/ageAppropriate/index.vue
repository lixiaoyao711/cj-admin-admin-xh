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
      <el-form-item label="行政区划" prop="divisionCode">
        <TreeSelectDivision
          v-model="queryParams.divisionCode"
          @treeselectChange="(e) => treeselectChange(e, queryParams, 'divisionCode')"
        ></TreeSelectDivision>
      </el-form-item>
      <el-form-item label="性别:" prop="sex">
        <el-select v-model="queryParams.sex" placeholder="请选择性别" clearable>
          <el-option v-for="dict in dict.type.sys_user_sex" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="出生日期" prop="searchTime">
        <el-date-picker
          clearable
          v-model="queryParams.searchTime"
          type="daterange"
          value-format="yyyy-MM-dd"
          placeholder="请选择出生日期"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="年龄:" prop="searchAge">
        <input-number-range v-model="queryParams.searchAge"></input-number-range>
      </el-form-item>
      <el-form-item label="搜索:" prop="keyWord">
        <el-input
          v-model="queryParams.keyWord"
          placeholder="请输入姓名、身份证"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <div class="table mt10">
      <div class="table-header">
        <div class="table-title">适龄人员列表</div>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button plain size="mini" :disabled="multiple" @click="handleDelete">批量转现役军人</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              size="mini"
              :disabled="multiple"
              @click="handleExport('worship/ageAppropriate/export', 1, '适龄人员列表')"
              v-hasPermi="['worship:ageAppropriate:export']"
              >导出所选</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              size="mini"
              @click="handleExport('worship/ageAppropriate/export', 2, '适龄人员列表')"
              v-hasPermi="['worship:ageAppropriate:export']"
              >导出列表</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              size="mini"
              @click="handleExport('worship/ageAppropriate/export', 3, '适龄人员列表')"
              v-hasPermi="['worship:ageAppropriate:export']"
              >导出全部</el-button
            >
          </el-col>
        </el-row>
      </div>

      <el-table v-loading="loading" :data="ageAppropriateList" @selection-change="handleSelectionChange" height="50vh">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="姓名" align="center" prop="name" />
        <el-table-column label="身份证" align="center" prop="idCard" />
        <el-table-column label="性别" align="center" prop="sex" />
        <el-table-column label="年龄" align="center" prop="age" />
        <el-table-column label="联系方式" align="center" prop="phone" />
        <el-table-column label="行政区划" align="center" prop="divisionName" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleDelete(scope.row)">转现役军人</el-button>
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

    <!-- 添加或修改适龄人员对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="身份证" prop="idCard">
          <el-input v-model="form.idCard" placeholder="请输入身份证" />
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="form.age" placeholder="请输入年龄" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="行政区划代码" prop="divisionCode">
          <el-input v-model="form.divisionCode" placeholder="请输入行政区划代码" />
        </el-form-item>
        <el-form-item label="行政区划名称" prop="divisionName">
          <el-input v-model="form.divisionName" placeholder="请输入行政区划名称" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listAgeAppropriate,
  getAgeAppropriate,
  addAgeAppropriate,
  updateAgeAppropriate,
  transferToServiceMan,
} from '@/api/worship/ageAppropriate';

import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import inputNumberRange from '@/views/worship/components/inputNumberRange';

export default {
  name: 'AgeAppropriate',
  dicts: ['sys_worship_facetype', 'sys_worship_personneltag', 'sys_worship_ethnicgroup', 'sys_user_sex'],
  components: {
    Treeselect,
    inputNumberRange,
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
      // 适龄人员表格数据
      ageAppropriateList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        idCard: undefined,
        sex: undefined,
        age: undefined,
        divisionCode: undefined,
        politicalLandscape: undefined,
        personTags: undefined,
        nation: undefined,
        searchAge: undefined,
        keyWord: undefined,
        searchTime: [],
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        id: [{ required: true, message: '主键不能为空', trigger: 'blur' }],
      },
      // treeselect配置项
      normalizer(node) {
        return {
          id: node.weight,
        };
      },
    };
  },
  computed: {
    treeOptions() {
      return this.$store.getters.divisionsTreeList;
    },
    userInfo() {
      return this.$store.state.user;
    },
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询适龄人员列表 */
    getList() {
      this.loading = true;
      this.queryParams.beginTime = this.queryParams?.searchTime?.[0];
      this.queryParams.endTime = this.queryParams?.searchTime?.[1];
      this.queryParams.beginAge = this.queryParams.searchAge?.[0];
      this.queryParams.endAge = this.queryParams.searchAge?.[1];
      listAgeAppropriate(this.queryParams).then((response) => {
        this.ageAppropriateList = response.rows;
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
        name: undefined,
        idCard: undefined,
        sex: undefined,
        age: undefined,
        phone: undefined,
        divisionCode: undefined,
        divisionName: undefined,
        politicalLandscape: undefined,
        searchTime: [],
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = '添加适龄人员';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids;
      getAgeAppropriate(id).then((response) => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = '修改适龄人员';
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateAgeAppropriate(this.form)
              .then((response) => {
                this.$modal.msgSuccess('修改成功');
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else {
            addAgeAppropriate(this.form)
              .then((response) => {
                this.$modal.msgSuccess('新增成功');
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      const name = row.name || this.filterDelData(ids, this.ageAppropriateList, 'name');
      this.$modal
        .confirm('是否转现役军人姓名为"' + name + '"的数据项？')
        .then(() => {
          this.loading = true;
          return transferToServiceMan(ids);
        })
        .then(() => {
          this.loading = false;
          this.getList();
          this.$modal.msgSuccess('转现役军人成功成功');
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false;
        });
    },
    /** 导出按钮操作 */
    handleExport(path, type, name) {
      let params = {};
      if (type === 1) {
        params = {
          ids: this.ids.join(','),
        };
      }
      if (type === 2) {
        params = {
          ...this.queryParams,
          divisionCode: this.queryParams.divisionCode || this.userInfo.divisionCode,
        };
      }
      if (type === 3) {
        params = {
          divisionCode: this.userInfo.divisionCode,
        };
      }
      this.download(path, params, `${name}_${new Date().getTime()}.xlsx`);
    },

    handleClick() {},
    openLink() {
      window.open('https://www.gfbzb.gov.cn/');
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
