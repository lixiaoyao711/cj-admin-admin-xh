<template>
  <el-dialog
    :title="'选择人员'"
    width="1050px"
    top="10vh"
    :modal="false"
    :visible.sync="dialogVisible"
    @close="handleClose"
  >
    <div class="title">选择人员</div>
    <el-form :model="form" :rules="rules" ref="form" class="form" :inline="true">
      <el-form-item label="行政区划：" prop="divisionCode">
        <TreeSelectDivision v-model="form.divisionCode" @treeselectChange="(e) => treeselectChange(e, form)"></TreeSelectDivision>
      </el-form-item>
      <el-form-item label="" prop="divisionName"></el-form-item>
      <el-form-item label="性别:">
        <el-select v-model="form.sex" placeholder="请选择性别">
          <el-option
            v-for="dict in dict.type.sys_user_sex"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          ></el-option>
        </el-select>
      </el-form-item>
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
        style="width: 100%;height:100%"
        height="calc(100% - 40px)"
        @selection-change="handleSelectionChange"
        :row-key="getRowKey"
      >
        <el-table-column type="selection" width="55" :reserve-selection="true"> </el-table-column>
        <el-table-column prop="name" label="姓名" width="120"></el-table-column>
        <el-table-column prop="sexText" label="性别" width="50"></el-table-column>
        <el-table-column prop="idCard" label="身份证号" width="200"></el-table-column>
        <el-table-column prop="departName" label="行政区划" width=""></el-table-column>
      </el-table>
    </div>
    <div class="table" v-else>
      <el-table
        :data="tableData"
        header-row-class-name="table-header"
        size="medium"
        ref="table"
        highlight-current-row
        style="width: 100%;height:100%"
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
        <el-table-column prop="sexText" label="性别" width="50"></el-table-column>
        <el-table-column prop="idCard" label="身份证号" width="200"></el-table-column>
        <el-table-column prop="departName" label="行政区划" width=""></el-table-column>
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
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSave">下一步</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { listPhysicalExaminationApplication } from "@/api/worship/physicalExaminationApplication";
export default {
  props: ['code', 'type', 'url', 'checkData'],
  dicts: ['sys_user_sex'],
  components: {},
  data() {
    return {
      dialogVisible: true,
      showAddOut: false,
      tableData: [],
      form: {
        page: 1,
        size: 15,
        political: '',
        departCode: '',
        sex: '',
        testStatus: '0',
        keyWord: '',
        // peopleCategory: '',
      },
      total: 0,
      radio: '',

      currentRow: {},
      rules: {},
      selection: [],
    };
  },
  computed: {},
  watch: {},
  async mounted() {
    console.log(this.code, this.type, this.url);
    console.log(this.checkData);
    this.selection = this.checkData;
    this.getList();
  },
  methods: {
    async getList() {
      this.tableData = [];
      this.radio = '';
      listPhysicalExaminationApplication(this.form).then(res =>{
        this.tableData = res.rows;
        this.total = res.total;
        // 回显已经选中的数据,由于执行机制需要setTimeout一下.
        this.$nextTick(() => {
          this.tableData.forEach(item => {
            console.log('this.selection', this.selection);
            if (this.selection.some(data => item.personId === data.personId)) {
              setTimeout(() => {
                this.$refs.table.toggleRowSelection(item, true);
              }, 300);
            }
          });
        });
      })
    },
    handleSave() {
      if (this.type === 'radio') {
        if (!this.currentRow) {
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
      return row.id;
    },
    handleCurrentChange(val) {
      let obj = {
        personId: val.id,
        name: val.name,
      };
      this.currentRow = obj || {};
      this.radio = val ? val.id : '';
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
</style>

