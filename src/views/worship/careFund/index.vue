<template>
  <div class="app-container">
    <div class="header">关爱基金</div>
    <div class="tabs">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane
          v-for="(item, index) in tabsMap"
          :label="item.label"
          :name="item.name"
          :key="item.name"
        ></el-tab-pane>
      </el-tabs>
      <div class="btns">
        <el-button @click="openFile" size="mini">相关政策</el-button>
        <el-button @click="open = true" size="mini">我要捐助</el-button>
      </div>
    </div>

    <component :is="activeName"></component>
    <el-dialog title="我要捐助" :visible.sync="open" width="800px" append-to-body>
      <div class="title">
        <div class="title-name">捐助列表</div>
        <div class="title-btn">
          <el-button @click="openADD" type="primary" size="mini">新建捐助</el-button>
        </div>
      </div>
      <el-table :data="tableData" height="400px">
        <el-table-column label="捐助时间" align="center" prop="donationTime" />
        <el-table-column label="姓名" align="center" prop="donors" />
        <el-table-column label="捐助金额" align="center" prop="donationAmount" />
        <el-table-column label="行政区划" align="center" prop="divisionName" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleUpdate(scope.row, 'open')">编辑</el-button>
            <el-button size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancel('open')">确 定</el-button>
      </div>
      <!-- 新建捐助记录 -->
      <el-dialog :title="title" :visible.sync="addOpen" width="600px" append-to-body>
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-form-item label="捐助人" prop="donors">
            <el-input v-model="form.donors"></el-input>
          </el-form-item>
          <el-form-item label="捐助时间" prop="donationTime">
            <el-date-picker
              v-model="form.donationTime"
              type="date"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item label="捐助金额" prop="donationAmount">
            <el-input v-model="form.donationAmount" type="number"></el-input>
          </el-form-item>
          <el-form-item label="行政区划：" prop="divisionCode">
            <TreeSelectDivision
              v-model="form.divisionCode"
              @treeselectChange="(e) => treeselectChange(e, form)"
            ></TreeSelectDivision>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel('addOpen')">取 消</el-button>
        </div>
      </el-dialog>
    </el-dialog>
    <el-dialog title="录入信息" :visible.sync="dialogVisible" width="600px" :before-close="handleClose">
      <div class="passDialog">
        <div class="title"><i class="el-icon-warning-outline"></i>录入后会在浙里办个人申请页显示</div>
        <div>
          <editor v-model="editorContent" :min-height="400" />
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="saveItem">确 定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import project from './project/index.vue';
import condition from './condition/index.vue';
import charge from './charge/index.vue';
import {
  donationFormList,
  addDonationForm,
  updateDonationForm,
  getDonationForm,
  delDonationForm,
  relatedPolicies,
  systemConfigList,
  addInsertCurrency,
  updateInsertCurrency,
} from '@/api/worship/careFund';
export default {
  name: 'hardshipSupport',
  components: { 
    project,
    condition,
    charge,
  },
  data() {
    return {
      activeName: 'project',
      tableData: [],
      tabsMap: [
        {
          label: '项目管理',
          name: 'project',
        },
        {
          label: '使用基金情况',
          name: 'condition',
        },
        {
          label: '我的待办',
          name: 'charge',
        },
      ],
      total: 0,
      open: false,
      dialogVisible: false,
      addOpen: false,
      title: '新建捐助记录',
      editorContent: '',
      editorForm: {},
      form: {
        donors: '',
        donationTime: '',
        donationAmount: '',
        divisionCode: undefined,
      },
      // 表单校验
      rules: {
        donors: [{ required: true, message: '请输入', trigger: 'blur' }],
        donationTime: [{ required: true, message: '请选择', trigger: 'blur' }],
        donationAmount: [{ required: true, message: '请输入', trigger: 'blur' }],
      },
    };
  },
  created() {
    this.activeName = this.$route.query.tab || 'project';
    this.getList();
  },
  methods: {
    getList() {
      donationFormList({
        pageNum: 1,
        pageSize: 99999,
      }).then((response) => {
        this.tableData = response.rows;
        this.total = response.total;
      });
    },
    handleClick(vm) {
      this.$router.replace({
        path: '',
        query: {
          tab: vm.name,
        },
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateDonationForm(this.form).then((response) => {
              this.$modal.msgSuccess('修改成功');
              this.addOpen = false;
              this.getList();
            });
          } else {
            addDonationForm(this.form).then((response) => {
              this.$modal.msgSuccess('新增成功');
              this.addOpen = false;
              this.getList();
            });
          }
        }
      });
    },
    cancel(key) {
      this[key] = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        donors: '',
        donationTime: '',
        donationAmount: '',
        divisionCode: undefined,
      };
      this.resetForm('form');
    },
    openADD() {
      this.addOpen = true;
      this.title = '新增捐助记录';
    },
    openFile() {
      let params = {
        configType: 'xgzc',
      };
      systemConfigList(params).then((res) => {
        console.log(res);
        this.editorContent = res.rows?.[0].configJson||'';
        this.editorForm = res.rows?.[0];
        this.dialogVisible = true;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getDonationForm(id).then(async (response) => {
        this.form = response.data;
        this.addOpen = true;
        this.title = '修改捐助记录';
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      const name = row.donors ?? this.filterDelData(this.ids, this.tableData, 'donors');

      this.$modal
        .confirm('是否确认删除姓名为"' + name + '"的数据项？')
        .then(() => {
          this.loading = true;
          return delDonationForm(ids);
        })
        .then(() => {
          this.loading = false;
          this.getList();
          this.$modal.msgSuccess('删除成功');
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false;
        });
    },
    handleClose() {
      this.dialogVisible = false;
    },
    saveItem() {
      let params = {
        configType: 'xgzc',
        configJson: this.editorContent,
        id: this.editorForm.id,
      };
      if (this.editorForm.id) {
        updateInsertCurrency(params).then((res) => {
          this.$message.success('更新政策文件成功');
          this.handleClose();
        });
      } else {
        addInsertCurrency(params).then((res) => {
          this.$message.success('更新政策文件成功');
          this.handleClose();
        });
      }
      // axios({
      //   url: '/careFundPolicyFile/update',
      //   method: 'post',
      //   data: {
      //     id: this.propsId,
      //     content: this.editorContent,
      //   },
      // }).then((res) => {
      //   this.$message.success('更新政策文件成功');
      //   this.handleClose();
      // });
    },
  },
};
</script>
<style lang="scss" scoped>
.passDialog {
  .title {
    font-size: 18px;
    margin-bottom: 16px;
  }
  .toolbar {
    border: 1px solid #ccc;
  }
  .text {
    border: 1px solid #ccc;
    min-height: 300px;
  }
}
.dialog-footer {
  margin: 10px 0 0 0;
  width: 100%;
  text-align: center;
}
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
  display: flex;
  justify-content: space-between;
  .search-right {
    width: 10%;
  }
}
.title {
  display: flex;
  justify-content: space-between;
  margin: 0 0 16px 0;
}

.el-icon-location-information {
  font-size: 24px;
  margin: 5px 0 0 18px;
  cursor: pointer;
}
.tabs {
  display: flex;
  justify-content: space-between;
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
