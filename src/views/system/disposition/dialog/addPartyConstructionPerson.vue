<template>
  <el-dialog
    :title="'选择人员'"
    width="600px"
    top="10vh"
    :modal="false"
    :visible.sync="dialogVisible"
    @close="handleClose"
  >
    <div class="title">选择人员</div>
    <el-form :model="form" :rules="rules" ref="form" class="form" :inline="true">
      <el-form-item prop="keyWord">
        <el-input placeholder="请输入搜索关键字" v-model="form.keyWord"></el-input>
      </el-form-item>
      <el-button type="primary" @click="handleSearch">查询</el-button>
      <el-button @click="resetForm">重置</el-button>
    </el-form>
    <div class="table" v-if="type === 'checkBox'">
      <el-table
        :data="tableData"
        header-row-class-name="table-header"
        size="medium"
        ref="table"
        highlight-current-row
        style="width: 100%; height: 100%"
        height="calc(100% - 40px)"
        @selection-change="handleSelectionChange"
        :row-key="getRowKey"
      >
        <el-table-column type="selection" width="55" :reserve-selection="true"> </el-table-column>
        <el-table-column prop="nickName" label="姓名" width="120"></el-table-column>
        <el-table-column prop="divsionName" label="行政区划" width=""></el-table-column>
      </el-table>
    </div>
    <div class="table" v-else>
      <el-table
        :data="tableData"
        header-row-class-name="table-header"
        size="medium"
        ref="table"
        highlight-current-row
        style="width: 100%; height: 100%"
        height="calc(100% - 40px)"
        @current-change="handleCurrentChange"
        :row-key="getRowKey"
      >
        <el-table-column width="50">
          <template slot-scope="scope">
            <el-radio :value="radio" :label="scope.row.userId"><span> </span></el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="nickName" label="姓名" width="120"></el-table-column>
        <el-table-column prop="divsionName" label="行政区划" width=""></el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        @current-change="handleCurrentPageChange"
        :current-page="form.pageNum"
        :page-size="form.pageSize"
        layout="prev, pager, next"
        :total="total"
      >
      </el-pagination>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSave">下一步</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { listUser } from '@/api/system/user';
export default {
  props: ['code', 'type', 'url', 'divisionCode'],
  components: {},
  data() {
    return {
      dialogVisible: true,
      showAddOut: false,
      tableData: [],
      form: {
        pageNum: 1,
        pageSize: 15,
        whetherStock: 1,
        // whetherSystemBuild: 2,
        divisionCode: this.divisionCode,
      },
      total: 0,
      radio: '',

      currentRow: {},
      rules: {},
      selection: [],
    };
  },
  computed: {
    treeList() {
      return this.$store.getters.divisionsTreeList;
    },
  },
  watch: {
    divisionCode: {
      handler() {
        this.form.divisionCode = this.divisionCode;
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    console.log(this.divisionCode);
    this.getList();
  },
  methods: {
    getDivsionName(data, code, result = []) {
      data.forEach((e) => {
        if (e.weight === code) {
          result.push(e.label);
          return;
        }
        e.children && this.getDivsionName(e.children, code, result);
      });
      return result;
    },
    async getList() {
      this.tableData = [];
      listUser(this.form).then((res) => {
        this.tableData = res.rows.map((item) => {
          item.divsionName = this.getDivsionName(this.treeList, item.divisionCode)[0];
          return item;
        });
        this.tableData = this.tableData.filter((item) => item.openId!==null);
        this.total = res.total;
      });
    },
    handleSave() {
      console.log(this.currentRow);
      if (this.type === 'radio') {
        if (!this.currentRow.nickName) {
          this.$message.warning('请选择人员');
          return;
        }
        this.$emit('success', this.currentRow);
      } else if (this.type === 'checkBox') {
        if (!this.selection.length) {
          this.$message.warning('请选择人员');
          return;
        }
        console.log(this.selection);
        this.$emit('success', this.selection);
      }
    },
    handleSelectionChange(val) {
      this.selection = val;
    },
    getRowKey(row) {
      return row.userId;
    },
    handleCurrentChange(val) {
      this.currentRow = val || {};
      this.radio = val ? val.userId : '';
      // this.$refs.singleTable.setCurrentRow(row)
    },
    handleCurrentPageChange(val) {
      this.form.pageNum = val;
      this.getList();
    },
    handleTabClick() {
      this.radio = '';
      this.form.pageNum = 1;
      this.getList();
    },
    handleSearch() {
      this.getList();
    },
    handleClose() {
      this.$emit('close');
    },

    resetForm() {
      this.$refs['form'].resetFields();
      this.getList();
    },
  },
};
</script>

<style scoped lang="scss">
.title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
}
.main-tab {
  margin-bottom: 16px;
}
.form {
  width: 100%;
  &::after {
    content: '';
    display: table;
    clear: both;
  }
}
.form .select,
.form .input {
  width: 40%;
  margin-right: 10px;
}
.subToolBar {
  display: flex;
  align-items: center;
  button {
    margin-left: 10px;
    i {
      font-size: 14px;
      margin-right: 3px;
    }
  }
}
.table {
  height: 45vh;
}
.pagination {
  text-align: center;
}
.sex-item {
  v-deep .el-input--small {
    .el-input__inner {
      width: 80px;
    }
  }
}
v-deep {
  .el-tabs__header {
    margin: 0;
  }
}
</style>
