<template>
  <div class="conscripts">
    <div class="table">
      <div class="table-title">
        <div>{{ mainTab }}</div>
        <div class="right">
          <!-- <el-button type="primary" @click="addItem">发布通知</el-button> -->
        </div>
      </div>
      <el-table
        :data="tableData"
        border
        header-row-class-name="table-header"
        size="medium"
        style="width: 100%"
        height="calc(100% - 80px)"
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column type="selection" width="55"> </el-table-column> -->

        <el-table-column
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          v-for="(item, index) in tableColumns[mainTab]"
          :key="index"
        >
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="query.page"
        :page-sizes="[10, 15, 30, 50, 100]"
        :page-size="query.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <el-dialog class="img-dialog" append-to-body :visible.sync="imgDialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
// 组件

export default {
  props: {},
  components: {},
  data() {
    return {
      mainTab: '日志列表',
      query: {
        page: 1,
        size: 30,
        keyWord: '',
        operType: '1',
      },
      imgDialogVisible: false,
      dialogImageUrl: '',
      tableColumns: {
        日志列表: [
          {
            width: 400,
            label: '操作内容',
            prop: 'title',
          },
          {
            width: 400,
            label: '操作结果',
            prop: 'operResult',
          },
          {
            width: 0,
            label: '操作时间',
            prop: 'createdDate',
          },
          {
            width: 0,
            label: '操作人',
            prop: 'operName',
          },
          {
            width: 0,
            label: '日志类型',
            prop: 'operTypeName',
          },
        ],
      },
      tableData: [],
      checkData: [],
      value: true,
      total: 0,
      // -----------------tabs---------------------
      tableTab: '1',
      // -----------------dialog-------------------
      addOrEditDialog: false,
      infoDialog: false,
      addOrEditTitleName: '新建内容',
      addOrEditData: {},
      infoData: {},
    };
  },
  computed: {
    dictMap() {
      return this.$store.state.dictMap;
    },
  },
  watch: {
    // $route: {
    //   handler(val) {
    //     this.query.departCode = this.$route.query.departCode;
    //     this.getList();
    //     if (val.query.id) {
    //       this.getById(val.query.id);
    //       this.viewItem(this.infoData);
    //     }
    //   },
    //   immediate: true,
    // },
  },
  created() {
    this.getList();
  },
  mounted() {},
  methods: {
    getList() {
      // let depart = getFormDepartCode(this.query.departCode);

      axios({
        url: '/sysOperLog/getPage',
        method: 'get',
        params: this.query,
      }).then((res) => {
        this.tableData = res.records;
        this.total = res.total;
      });
    },
    getById(id) {
      axios({
        methods: 'get',
        url: '/visitsCondolences/getById',
        params: { id: id },
      }).then((res) => {
        this.infoData = res;
      });
    },
    viewImg(url) {
      this.dialogImageUrl = url;
      this.imgDialogVisible = true;
    },
    search() {
      this.query.page = 1;
      this.getList();
    },
    mainTabClick(tab) {
      this.mainTab = tab.name;

      this.$router.replace({
        query: {
          tab: tab.name,
          subTab: this.$route.query.subTab,
        },
      });
      // this.getList()
    },
    tableTabClick(tab) {
      this.tableTab = tab.name;
      this.$router.replace({
        query: {
          tab: tab.name,
          subTab: this.$route.query.subTab,
        },
      });
      // this.getList()
    },
    reset() {
      this.query = {
        page: 1,
        size: 30,
        keyWord: '',
      };
      this.getList();
    },
    addItem() {
      this.addOrEditTitleName = '新建内容';
      this.addOrEditDialog = true;
    },
    editItem(row) {
      this.addOrEditTitleName = '编辑内容';
      this.addOrEditData = JSON.parse(JSON.stringify(row));
      this.addOrEditDialog = true;
    },
    delItem(row) {
      axios({
        url: '/sysOperLog/delete',
        method: 'get',
        params: { id: row.id },
      }).then((res) => {
        this.$message.success('删除成功');
        this.getList();
      });
    },
    viewItem(row) {
      this.infoDialog = true;
      this.infoData = JSON.parse(JSON.stringify(row));
    },
    handleSelectionChange(data) {
      this.checkData = data;
    },
    addOrEditClose() {
      this.addOrEditDialog = false;
      this.addOrEditData = {};
      this.getList();
      this.dashboardUpdate();
    },
    dashboardUpdate() {
      window.dashboardWindow && window.dashboardWindow.postMessage('update', '*');
    },
    handleCurrentChange(val) {
      this.query.page = val;
      this.getList();
    },
    handleSizeChange(val) {
      this.query.size = val;
      this.getList();
    },
  },
};
</script>

<style scoped lang="scss">
.conscripts {
  height: auto;
  .serch {
    height: 60px;
    padding: 0 24px;
    box-sizing: border-box;
    background: #ffffff;
    border-radius: 2px;
    display: flex;
    align-items: center;
    v-deep .el-form {
      width: 100%;
      display: flex;
      justify-content: space-between;
      .el-form-item {
        margin-bottom: 0;
      }
      .el-input {
        width: 12vw;
      }
      .el-select .el-input {
        width: 8vw;
      }
    }
  }
  .table {
    height: calc(100vh - 26vh);
    background-color: #fff;
    margin-top: 16px;
    padding: 6px 24px;
    .table-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }
  }
  .pagination {
    height: 40px;
    padding-top: 10px;
    background: #fff;
    text-align: right;
    padding-right: 24px;
  }
  .tag {
    height: 36px;
    background: #fffbe6;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    padding-left: 20px;
    box-sizing: border-box;
    i {
      margin-right: 10px;
      font-size: 20px;
      color: #ffaa00;
    }
  }
}
.img-dialog {
  v-deep .el-dialog__header {
    border-bottom: none;
    // }
  }
}
.content-img {
  width: 100px;
  height: 100px;
  cursor: pointer;
}
.toolbar {
  display: flex;
  align-items: center;
  background: #fff;
  height: 60px;
  padding: 0 24px;
  v-deep {
    .el-form {
      width: 100%;
      display: flex;
      justify-content: space-between;
      .el-form-item {
        margin-bottom: 0;
      }
      .el-input {
        width: 12vw;
      }
      .el-select {
        .el-input {
          width: 8vw;
        }
      }
    }
  }
}
</style>
