<template>
  <!-- 选择常用组织机构 -->
  <div class="box">
    <el-dialog
      title="选择转到的部门或镇街"
      width="600px"
      top="10vh"
      :visible.sync="dialogVisible"
      @close="$emit('close')"
      :close-on-click-modal="false"
      append-to-body
    >
      <section class="tree-box">
        <div class="tree">
          <div class="title">组织机构</div>
          <el-tree
            ref="tree"
            :data="allDepartment"
            node-key="id"
            @node-click="handleNodeClick"
            @check-change="handleChange"
            @node-expand="handleNodeClick"
            :filter-node-method="filterNodeMethod"
            :props="props"
          ></el-tree>
        </div>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button @click="$emit('close')">取 消</el-button>
        <el-button type="primary" @click="handleSave">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { deptTreeSelect, listUser, changeUserStatus, changeAreCommonlyUs } from '@/api/system/user';

export default {
  props: {
    // 0:浙政钉组织  1:常用人员
    type: {
      type: String,
      default: '1',
    },
    propsData: Object,
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
        value: 'id',
      },
      allDepartment: [],
      checkData: [],
      editCheckId: '',
      tableData: [],
      uacCode: '',
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
    getTreeData() {
      deptTreeSelect({
        whetherStock: this.type,
      }).then((res) => {
        console.log(res);
        this.allDepartment = res.data;
      });
    },
    filterNodeMethod(value, data) {
      return data.label !== value;
    },

    handleSave() {
      changeAreCommonlyUs({
        userId: this.propsData.userId,
        deptId: this.checkData.id,
      }).then((res) => {
        this.$message.success('转入成功');
        this.$emit('success');
      });
    },
    handleNodeClick(data) {
      console.log('handleNodeClick', data);
      this.checkData = data;
    },
    // 获取常用人员
    getOftenPeople(uacDeptId) {
      // type===troops为选择部队人员,其他情况为常用人员
      if (this.type === 'troops') {
        axios({
          url: '/admin/system/dept/getStockUserByUacDeptIdSup',
          method: 'get',
          params: {
            uacDeptId,
          },
        }).then((peo) => {
          this.tableData = peo.map((item) => {
            let arr = ['启用', '禁用'];
            item.statusName = arr[item.status];
            return item;
          });
        });
      } else {
        axios({
          url: '/admin/system/dept/getStockUserByStockDeptId',
          method: 'get',
          params: {
            stockDeptId: uacDeptId,
          },
        }).then((peo) => {
          this.tableData = peo.map((item) => {
            let arr = ['启用', '禁用'];
            item.statusName = arr[item.status];
            return item;
          });
        });
      }
    },
    async getOftenTreeData(path = null) {
      return axios({
        url: '/system/dept/sideList',
        method: 'get',
        params: {
          deptId: node.data.deptId,
        },
      }).then((res) => {
        !path ? (this.allDepartment = res) : '';
        return res;
      });
    },
    handleSelectionChange(data) {
      this.checkData = data;
      console.log(this.checkData);

      // let phoneNumber = data.map(item => item.phoneNumber);
      // let name = data.map(item => item.nickName);
      // // 获取所有选择的人员的电话并且去重
      // this.phones = [...new Set([...this.phones, ...phoneNumber])];
      // // 获取所有选择的人员的姓名并且去重
      // this.names = [...new Set([...this.names, ...name])];
    },
    handleChange(data, checked) {},
  },
};
</script>

<style scoped lang="scss">
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
::v-deep .el-tree {
  .el-tree-node {
    .is-leaf {
      & + .el-checkbox {
        .el-checkbox__inner {
          display: inline-block;
        }
      }
    }
  }
}
::v-deep .el-tree {
  .el-tree-node {
    .el-checkbox {
      .el-checkbox__inner {
        display: none;
      }
    }
  }
}
</style>
