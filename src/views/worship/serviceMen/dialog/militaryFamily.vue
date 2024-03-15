<template>
  <el-dialog
    :title="'选择人员'"
    width="700px"
    top="10vh"
    :modal="false"
    :visible.sync="dialogVisible"
    @close="handleClose"
    append-to-body
  >
    <div class="title">选择人员</div>
    <el-form :model="form" :rules="rules" ref="form" class="form" :inline="true">
      <el-form-item prop="departCode">
        <TreeSelectDivision @treeselectChange="treeselectChange"></TreeSelectDivision>
      </el-form-item>
      <el-form-item prop="keyWord">
        <el-input placeholder="请输入搜索关键字" v-model="form.keyWord"></el-input>
      </el-form-item>
      <el-button type="primary" @click="handleSearch">查询</el-button>
      <el-button @click="resetForm">重置</el-button>
    </el-form>
    <div class="table" v-if="type === 'checkBox'">
      <el-table
        v-loading="loading"
        :data="tableData"
        header-row-class-name="table-header"
        size="medium"
        highlight-current-row
        style="width: 100%; height: 100%"
        height="calc(100% - 40px)"
        @selection-change="handleSelectionChange"
        :row-key="getRowKey"
      >
        <el-table-column type="selection" width="55" :reserve-selection="true"> </el-table-column>
        <el-table-column prop="name" label="姓名" width="120"></el-table-column>
        <el-table-column prop="idCard" label="身份证号" width="200"></el-table-column>
        <el-table-column
          prop="divisionName"
          label="行政区
        划"
          width=""
        ></el-table-column>
      </el-table>
    </div>
    <div class="table" v-else>
      <el-table
        v-loading="loading"
        :data="tableData"
        header-row-class-name="table-header"
        size="medium"
        highlight-current-row
        style="width: 100%; height: 100%"
        height="calc(100% - 40px)"
        @current-change="handleCurrentChange"
        :row-key="getRowKey"
      >
        <el-table-column width="50">
          <template slot-scope="scope">
            <el-radio :value="radio" :label="scope.row.id"><span> </span></el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="120"></el-table-column>
        <el-table-column prop="idCard" label="身份证号" width="200"></el-table-column>
        <el-table-column prop="divisionName" label="行政区划" width=""></el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        @current-change="handleCurrentPageChange"
        :current-page="form.page"
        :page-size="form.size"
        layout="prev, pager, next"
        :total="total"
      >
      </el-pagination>
      <div class="people-list"></div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSave">下一步</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { listServiceFamily } from '@/api/worship/serviceFamily';
export default {
  props: ['code', 'type', 'url'],
  components: {},
  data() {
    return {
      dialogVisible: true,
      showAddOut: false,
      tableData: [],
      form: {
        isParty: '',
        isVolunteer: '',
        page: 1,
        size: 15,
        departCode: '',
        keyWord: '',
      },
      total: 0,
      radio: '',
      currentRow: {},
      rules: {},
      selection: [],
      loading: false,
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
    dictMap() {
      return this.$store.state.dictMap;
    },
  },
  watch: {},
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      listServiceFamily(this.queryParams).then((response) => {
        this.tableData = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    treeselectChange(node, id) {
      this.form.divisionName = node.label;
    },
    handleSave() {
      // this.$refs['form'].validate(valid => {
      //     if (!valid) { return }
      // axios.post('/mock', this.form).then(res => {
      // this.$message.success('添加成功')
      if (this.type === 'radio') {
        if (!this.currentRow) {
          this.$message.warning('请选择人员');
          return;
        }
        this.$emit('success', this.currentRow);
      } else if (this.type === 'checkBox') {
        if (!this.selection.length) {
          this.$message.warning('请选择志愿人员');
          return;
        }
        console.log(this.selection);
        this.$emit('success', this.selection);
      }
      // })
      // })
    },
    handleSelectionChange(val) {
      this.selection = val;
    },
    getRowKey(row) {
      return row.id;
    },
    handleCurrentChange(val) {
      let obj = {
        retireId: val.id,
        name: val.name,
        departCode: val.departCode,
        departName: val.departName,
      };
      this.currentRow = obj || {};
      this.radio = val ? val.id : '';
      // this.$refs.singleTable.setCurrentRow(row)
    },
    handleCurrentPageChange(val) {
      this.form.page = val;
      this.getList();
    },
    handleTabClick() {
      this.radio = '';
      this.form.page = 1;
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

<style lang="scss" scoped>
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
}
::after {
  content: '';
  display: table;
  clear: both;
}
.select,
.input {
  width: 40%;
  margin-right: 10px;
}
.subToolBar {
  display: flex;
  align-items: center;
}
button {
  margin-left: 10px i {
    font-size: 14px;
    margin-right: 3px;
  }
}

.table {
  height: 45vh;
}
.pagination {
  text-align: center;
}
::v-deep .el-tabs__header {
  margin: 0;
}
.people-list {
  width: 100%;
  height: 100px;
  border: 1px solid #ccc;
}
</style>
