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
      <el-form-item prop="departCode">
        <el-cascader
          :disabled="userinfo.departCode.length > 1"
          :props="{ checkStrictly: true }"
          v-model="form.departCode"
          :options="dictMap.userDistrict"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="性别:" prop="sex" class="sex-item">
        <el-select v-model="form.sex">
          <el-option label="全部" :value="null"></el-option>
          <el-option
            v-for="item in dictMap.sys_user_sex"
            :key="item.dictCode"
            :label="item.dictLabel"
            :value="item.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>

      <!-- <el-form-item label="政治面貌:" prop="political">
        <el-select v-model="form.political">
          <el-option label="全部" value=""></el-option>
          <el-option
            v-for="item in dictMap.political_landscape"
            :key="item.dictCode"
            :label="item.dictLabel"
            :value="item.dictValue"
          ></el-option>
        </el-select>
      </el-form-item> -->
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
        <el-table-column prop="name" label="姓名" width="120"></el-table-column>
        <el-table-column prop="sexText" label="性别" width="50"></el-table-column>
        <el-table-column prop="politicalText" label="政治面貌" width="150"></el-table-column>
        <el-table-column prop="cardCode" label="身份证号" width="200"></el-table-column>
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
        <el-table-column prop="sexText" label="性别" width="50"></el-table-column>
        <!-- <el-table-column prop="politicalText" label="政治面貌" width="150"></el-table-column> -->
        <el-table-column prop="telephone" label="联系方式" width="200"></el-table-column>
        <el-table-column prop="cardCode" label="身份证号" width="200"></el-table-column>
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
import { mapState } from 'vuex';
export default {
  props: ['code', 'type', 'url'],
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
        keyWord: '',
      },
      total: 0,
      radio: '',

      currentRow: {},
      rules: {},
      selection: [],
    };
  },
  computed: {
    dictMap() {
      return this.$store.state.dictMap;
    },
    ...mapState(['userinfo']),
  },
  watch: {
    userinfo() {
      this.form.departCode = this.userinfo.departCode;
    },
  },
  async mounted() {
    this.form.departCode = this.userinfo.departCode;

    this.getList();
  },
  methods: {
    async getList() {
      this.tableData = [];
      this.radio = '';
      axios({
        methods: 'get',
        url: this.url,
        params: Object.assign({}, this.form, {
          departCode,
        }),
      }).then((res) => {
        console.log(res);
        this.tableData = res.records;
        // transferText(this.tableData);
        this.total = res.total;
      });
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
        // retireId: val.id,
        name: val.name,
        telephone: val.telephone,
        cardCode: val.cardCode,
        domicile: val.domicile,
        livingAddressDetail: val.livingAddressDetail,
        // departCode: val.departCode,
        // departName: val.departName,
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
  ::v-deep .el-input--small {
    .el-input__inner {
      width: 80px;
    }
  }
}
</style>
<style lang="scss" scoped>
::v-deep {
  .el-tabs__header {
    margin: 0;
  }
}
</style>
