<template>
  <div class="">
    <el-dialog title="选择人员" width="1350px" top="10vh" :visible.sync="dialogVisible" @close="handleClose">
      <el-tabs v-if="isShowAll" v-model="form.isRights" class="main-tab" @tab-click="handleTabClick">
        <el-tab-pane name="2"><span slot="label">全部人员</span></el-tab-pane>
        <el-tab-pane name="1"><span slot="label">权益维护人员</span></el-tab-pane>
      </el-tabs>
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
            <el-option
              v-for="item in dictMap.sys_user_sex"
              :key="item.dictCode"
              :label="item.dictLabel"
              :value="item.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="人员类别:" class="peopleCategory">
          <el-select v-model="peopleCategoryList" multiple collapse-tags>
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="item in dictMap.people_category"
              :key="item.dictCode"
              :label="item.dictLabel"
              :value="item.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="政治面貌:" prop="political">
          <el-select v-model="form.political">
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="item in dictMap.political_landscape"
              :key="item.dictCode"
              :label="item.dictLabel"
              :value="item.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="keyWord">
          <el-input placeholder="请输入搜索关键字" v-model="form.keyWord"></el-input>
        </el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form>
      <div class="subToolBar" v-if="form.isRights === '1'">
        <el-tabs v-model="subTab" type="card" @tab-click="subTabClick">
          <el-tab-pane label="户内人员" name="1"></el-tab-pane>
          <el-tab-pane label="户外人员" name="2"></el-tab-pane>
        </el-tabs>
        <el-button type="text" @click="showAddOut = true" v-show="subTab === '2'">
          <i class="el-icon-circle-plus-outline"></i>新建户外人员
        </el-button>
      </div>
      <div class="table">
        <el-table
          :data="tableData"
          header-row-class-name="table-header"
          size="medium"
          highlight-current-row
          style="width: 100%; height: 100%"
          height="calc(100% - 40px)"
          @selection-change="handleSelectionChange"
          :row-key="getRowKey"
        >
          <el-table-column v-if="!isRadio" type="selection" width="55" :reserve-selection="true"> </el-table-column>
          <el-table-column v-else width="50">
            <template slot-scope="scope">
              <el-radio v-model="selection" :label="scope.row.id"><span> </span></el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="姓名" width="120"></el-table-column>
          <el-table-column prop="sexText" label="性别" width="50"></el-table-column>
          <el-table-column prop="peopleCategoryText" label="人员类别"></el-table-column>
          <el-table-column prop="politicalText" label="政治面貌" width="150"></el-table-column>
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
        <el-button @click="noChange" v-if="showBtn">不选择，直接下一步</el-button>
        <el-button type="primary" @click="handleSave">{{ btnName }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: {
    isShowAll: {
      type: Boolean,
      default: true,
    },
    btnName: {
      type: String,
      default: '下一步',
    },
    showBtn: {
      type: Boolean,
      default: false,
    },
    isRadio: {
      type: Boolean,
      default: false,
    },
  },
  components: {},
  data() {
    return {
      dialogVisible: true,
      showAddOut: false,
      tableData: [],
      form: {
        isRights: '2',
        page: 1,
        size: 15,
        political: '',
        departCode: '',
        sex: '',
        keyWord: '',
        peopleCategory: '',
      },
      mainTab: '',
      subTab: '1',
      total: 0,
      radio: '',
      currentRow: {},
      peopleCategoryList: [],

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
  mounted() {
    this.form.departCode = this.userinfo.departCode;

    this.getList();
  },
  methods: {
    getList() {
      this.tableData = [];
      this.radio = '';
      let url = '';
      this.form.peopleCategory = this.peopleCategoryList.join(',');

      if (this.form.isRights === '1' && this.subTab === '2') {
        url = '/worshipPetitionInfoOut/getPage';
      } else {
        url = '/retireInfo/getPage';
      }
      // let departCode = getFormDepartCode(this.form.departCode).departCode;
      axios({
        methods: 'get',
        url,
        params: Object.assign({}, this.form, {
          isRights: this.form.isRights === '1' ? 1 : '',
        }),
      }).then((res) => {
        // console.log('全部', res.records)
        let isOut = this.form.isRights === '1' && this.subTab === '2';
        this.tableData = res.records.map((e) => {
          e.isOut = isOut ? 1 : 0;
          return e;
        });
        // transferText(this.tableData);
        this.total = res.total;
      });
    },
    addOutSuccess() {
      this.showAddOut = false;
      this.getList();
    },
    handleSelectionChange(val) {
      // console.log(val);
      this.selection = val;
    },
    getRowKey(row) {
      return row.id;
    },
    handleCurrentChange(val) {
      console.log(val);
      this.currentRow = val || {};
      this.radio = val ? val.id : '';
      // this.$refs.singleTable.setCurrentRow(row)
    },
    handleCurrentPageChange(val) {
      this.form.page = val;
      this.getList();
    },
    handleSizeChange(val) {},
    handleTabClick() {
      this.radio = '';
      this.form.page = 1;
      this.getList();
    },
    subTabClick() {
      this.form.page = 1;
      this.getList();
    },
    handleSearch() {
      this.getList();
    },

    handleClose() {
      this.$emit('close');
    },
    handleSave() {
      // this.$refs['form'].validate(valid => {
      //     if (!valid) { return }
      // axios.post('/mock', this.form).then(res => {
      // this.$message.success('添加成功')
      if (!this.selection.length && !this.isRadio && this.selection.length) {
        this.$message.warning('请选择人员');
        return;
      }
      this.$emit('success', this.selection);
      // })
      // })
    },
    noChange() {
      this.$emit('success', []);
    },
    resetForm() {
      this.$refs['form'].resetFields();
      this.peopleCategoryList = [];

      this.getList();
    },
  },
};
</script>

<style scoped lang="scss">
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
  ::v-deep.el-input--small {
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
