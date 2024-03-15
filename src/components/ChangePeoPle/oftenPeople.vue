<template>
  <div class="box">
    <section class="tree-box">
      <div class="tree">
        <div class="title">组织机构</div>
        <el-tree
          ref="tree"
          :data="allDepartment"
          node-key="deptId"
          @node-click="handleNodeClick"
          @check-change="handleChange"
          @node-expand="handleNodeClick"
          :props="props"
          :load="loadNode"
          check-strictly
          lazy
          :show-checkbox="showCheckbox"
        ></el-tree>
      </div>
      <div class="table">
        <div class="right">
          <el-input placeholder="请输入搜索关键字" v-model="form.keyWord"></el-input>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
        <el-table
          :data="tableData"
          style="height: 100%"
          height="88%"
          @selection-change="handleSelectionChange"
          @current-change="currentChangeionChange"
        >
          <el-table-column v-if="isRadio" label="选择" width="55">
            <template slot-scope="{ row }">
              <el-radio v-model="checkData" :disabled="checkedKeys.length" :label="row"><i></i></el-radio>
            </template>
          </el-table-column>
          <el-table-column v-else type="selection" width="55"> </el-table-column>
          <el-table-column prop="nickName" label="姓名" width=""> </el-table-column>
          <el-table-column prop="ancestorsName" label="组织架构" width=""> </el-table-column>
        </el-table>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    isRadio: {
      type: Boolean,
      default: false,
    },
    showCheckbox: {
      type: Boolean,
      default: true,
    },
    getType: String,
  },
  components: {},
  data() {
    return {
      dialogVisible: true,
      treePath: [],
      peopleList: [],
      receivePeaple: [],
      fileList: [],
      accept: ['.jpg', '.png'],
      headers: {
        Authorization: sessionStorage.token,
      },
      form: {
        targetId: '',
        targetName: '',
        logContent: '',
      },
      props: {
        isLeaf: 'leaf',
        label: 'deptName',
        value: 'deptId',
      },
      allDepartment: [],
      checkData: [],
      editCheckId: '',
      tableData: [],
      checkedKeys: [],
      uacDeptId: 0,
    };
  },
  computed: {
    // allDepartment () { return this.$store.state.allDepartment }
  },
  watch: {},
  created() {
    this.getTreeData();
  },
  methods: {
    search() {
      this.getOftenPeople();
    },
    reset() {
      this.form.keyWord = '';
      this.getOftenPeople();
    },
    getTreeData() {
      axios({
        url: '/system/dept/sideList',
        method: 'get',
        params: {
          deptId: null,
        },
      }).then((res) => {
        console.log(res);
        this.allDepartment = res;
      });
    },
    filterNodeMethod(value, data) {
      return data.label !== value;
    },
    loadNode(node, resolve) {
      console.log('node', node);
      if (node.level === 0) {
        return resolve(node.data);
      }
      this.getOftenTreeData(node.data.uacDeptId || node.data.deptId).then((res) => {
        // length为0代表到了最后的节点需要请求人员
        if (res.length !== 0) {
          node.data.children = res;
          resolve(res);
        } else {
          resolve([]);
        }
      });
    },
    handleSave() {
      if (this.checkData.length === 0) {
        this.$message.warning('请选择要发送的人员');
        return;
      }
      this.$emit('success', this.checkData);
    },
    handleNodeClick(data) {
      console.log(data);
      this.uacDeptId = data.uacDeptId || data.deptId;
      this.getOftenTreeData(data.uacDeptId || data.deptId).then((res) => {
        // length为0代表到了最后的节点需要请求人员
        if (res.length !== 0) {
        } else {
          this.getOftenPeople(data.uacDeptId || data.deptId);
        }
      });
    },
    // 获取常用人员
    getOftenPeople(uacDeptId) {
      axios({
        url: '/admin/system/dept/getStockUserByStockDeptId',
        method: 'get',
        params: {
          keyWord: this.form.keyWord,
          stockDeptId: this.uacDeptId || 19891,
        },
      }).then((peo) => {
        this.tableData = peo.map((item) => {
          let arr = ['启用', '禁用'];
          item.statusName = arr[item.status];
          return item;
        });
      });
    },
    async getOftenTreeData(path = null) {
      return axios({
        url: '/system/dept/sideList',
        method: 'get',
        params: {
          deptId: path,
        },
      }).then((res) => {
        !path ? (this.allDepartment = res) : '';
        return res;
      });
    },
    async getReportTreeData(path = 'top') {
      return axios({
        url: '/system/dept/stockUacListWithType',
        method: 'get',
        params: {
          uacDeptId: path,
          // uacDeptId: 10,
          type: this.getType,
        },
      }).then((res) => {
        path == 'top' ? (this.allDepartment = res) : '';
        return res;
      });
    },
    handleSelectionChange(data) {
      this.checkData = data;
      this.$emit('checkClick', data);
      // let phoneNumber = data.map(item => item.phoneNumber);
      // let name = data.map(item => item.nickName);
      // // 获取所有选择的人员的电话并且去重
      // this.phones = [...new Set([...this.phones, ...phoneNumber])];
      // // 获取所有选择的人员的姓名并且去重
      // this.names = [...new Set([...this.names, ...name])];
    },
    currentChangeionChange(data) {
      this.$emit('radioClick', data);
    },
    handleChange(data, checked) {
      if (checked) {
        this.$refs.tree.setCheckedKeys([data.deptId]);
        this.checkData = [];
        this.$emit('radioClick', data);
      }
      this.checkedKeys = this.$refs.tree.getCheckedKeys();
    },
  },
};
</script>
<style lang="scss">
.el-tree {
  .el-checkbox__inner {
    display: inline-block !important;
  }
}
</style>
<style lang="scss" scoped>
.right {
  display: flex;
  margin: 6px 0;
  .el-input {
    margin: 0 16px 0 0;
  }
}
</style>

<style scoped lang="scss">
.box {
  width: 100%;
}
section {
  border: 1px solid #e5e5e5;
}
.tree-box {
  display: flex;
  .table {
    width: 50%;
  }
  .title {
    background: #f6f6f6;
    border-bottom: 1px solid #e5e5e5;
    line-height: 40px;
    padding: 0 16px;
  }
  .tree {
    padding: 16px;
    height: 30vh;
    width: 100%;
    overflow-y: auto;
  }
}
header {
  line-height: 40px;
}
.remark {
  padding: 16px;
  textarea {
    border: none;
    outline: none;
    width: 100%;
  }
}

::v-deep .el-upload--picture-card {
  width: 80px;
  height: 80px;
  line-height: 1;
  i {
    margin-top: 15px;
  }
}

::v-deep .el-upload-list--picture-card {
  .el-upload-list__item {
    width: 80px;
    height: 80px;
  }
}
::v-deep .el-tree .el-tree-node .is-leaf + .el-checkbox .el-checkbox__inner {
  display: inline-block;
}
::v-deep .el-tree .el-tree-node .el-checkbox .el-checkbox__inner {
  display: none;
}
</style>
