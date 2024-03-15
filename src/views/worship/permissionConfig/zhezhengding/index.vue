<template>
  <div class="index">
    <div class="toolbar">
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <div class="left"></div>
        <div class="right">
          <el-form-item prop="userName">
            <el-input placeholder="请输入搜索关键字" v-model="queryParams.userName" maxlength="100"></el-input>
          </el-form-item>
          <el-button type="primary" @click="getList">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </div>
      </el-form>
    </div>
    <!-- 常用人员 -->
    <div class="tree-box">
      <div class="tree">
        <div class="tree-list">
          <div class="title">部门列表</div>
          <el-tree
            ref="tree"
            :data="selfTreeData"
            node-key="id"
            @node-click="selfhandleNodeClick"
            @node-expand="selfhandleNodeClick"
            :filter-node-method="filterNodeMethod"
            :expand-on-click-node="false"
            :props="props"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
            </span>
          </el-tree>
        </div>
        <!-- <el-button @click="showAddOrg = true">新建一级部门</el-button> -->
      </div>

      <div class="table">
        <div class="title">用户列表</div>
        <el-table :data="selfuacTableData" style="height: 100%" height="120%">
          <el-table-column prop="userName" label="用户名" width=""> </el-table-column>
          <el-table-column prop="nickName" label="姓名" width="80"> </el-table-column>
          <el-table-column prop="phonenumber" label="手机号" width=""> </el-table-column>
          <el-table-column prop="roleName" label="角色" width=""> </el-table-column>
          <el-table-column prop="deptAncestorsName" label="部门" width="200"> </el-table-column>
          <el-table-column prop="statusName" label="是否启用" width="80">
            <template slot-scope="scope">
              {{ scope.row.statusName }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="{ row }">
              <div>
                <el-button type="text" size="small" @click="editUser(row)">编辑</el-button>
                <el-button v-show="row.isStock == 0" @click="importOften(row)" type="text" size="small"
                  >转到常用人员</el-button
                >
                <el-button v-show="row.isStock == 1" size="mini" type="text" disabled>已是常用人员</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!-- <pagination
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        /> -->
      </div>
    </div>
    <OftenOrgDialog
      v-if="oftenOrgDialog"
      :propsData="oftenOrgData"
      @close="oftenOrgDialog = false"
      @success="oftenOrgsuccess"
      :type="'1'"
    ></OftenOrgDialog>
    <AddOrg v-if="showAddOrg" @close="showAddOrg = false" @success="addOrgSuccess"></AddOrg>
    <AddUser
      v-if="showAddUser"
      :type="'0'"
      :info="activeRow"
      @close="showAddUser = false"
      @success="addUserSuccess"
    ></AddUser>
  </div>
</template>

<script>
import OftenOrgDialog from './dialog/oftenOrgDialog.vue';
import AddOrg from './dialog/addOrg.vue';
import AddUser from './dialog/addUser.vue';
import { addDept, updateDept, delDept } from '@/api/system/dept';

import {
  deptTreeSelect,
  listUser,
  changeUserStatus,
  deleteAreCommonlyUs,
  tagsAreCommonlyUsBuilt,
} from '@/api/system/user';
export default {
  props: {},
  components: {
    OftenOrgDialog,
    AddOrg,
    AddUser,
  },
  data() {
    return {
      selfuacTableData: [],
      selfTreeData: [],
      props: {
        isLeaf: 'leaf',
        value: 'id',
      },
      oftenOrgData: {},
      activeRow: {},
      showAddUser: false,
      oftenOrgDialog: false,
      showAddOrg: false,
      name1: '',
      name2: '',
      name3: '',
      name4: '',
      // 查询参数
      queryParams: {
        // pageNum: -1,
        // pageSize: -1,
        deptId: undefined,
        whetherStock: 0,
        keyWord: '',
      },
      total: 0,
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getList();
    this.getSelfTreeData();
  },
  mounted() {},
  methods: {
    getList() {
      this.getStockUserList();
    },
    // 转入常用人员
    importOften(row) {
      this.oftenOrgData = JSON.parse(JSON.stringify(row));
      this.oftenOrgDialog = true;
    },
    // // 转到常用人员
    // importOften(row) {
    //   tagsAreCommonlyUsBuilt(row.userId).then((res) => {
    //     this.$message.success('移出成功');
    //     this.getStockUserList();
    //   });
    // },
    editUser(row) {
      this.activeRow = JSON.parse(JSON.stringify(row));
      this.showAddUser = true;
    },
    orgChange(row, e) {
      changeUserStatus({
        userId: row.userId,
        status: row.status,
      }).then((res) => {
        this.$message.success('操作成功!');
        this.getStockUserList();
      });
    },
    remove(node, data) {
      delDept(data.id).then((res) => {
        this.$message.success('删除成功');
        this.getSelfTreeData();
      });
    },
    resizeName(node, data, name) {
      let dept = Object.assign({}, data, {
        deptName: name,
        level: node.level,
        orderNum: 0,
        deptId: data.id,
      });
      updateDept(dept).then((res) => {
        this.$message.success('重命名成功');
        this.getSelfTreeData();
      });
      this.$set(data, 'visible4', false);
      this.name4 = '';
    },
    append(node, data, name, index) {
      console.log(node, data, name, index);

      let dept = {
        parentId: data.id,
        deptName: name,
        level: node.level + 1,
        orderNum: 0,
        status: 0,
        whetherStock: 0,
      };

      addDept(dept).then((res) => {
        this.$message.success('新建成功');
        this.getSelfTreeData();
      });

      this.$set(data, 'visible1', false);
      this.$set(data, 'visible3', false);
      this.name1 = this.name3 = '';
    },
    appendSame(node, data, name, index) {
      console.log(node, data, name, index);
      let dept = {
        parentId: data.parentId,
        deptName: name,
        level: node.level,
        orderNum: 0,
        status: 0,
        whetherStock: 0,
      };
      addDept(dept).then((res) => {
        this.$message.success('新建成功');
        this.getSelfTreeData();
      });

      this.$set(data, 'visible2', false);
      this.name2 = '';
    },

    filterNodeMethod(value, data) {
      console.log(value, data);
      return data.label !== value;
    },
    selfhandleNodeClick(data) {
      console.log(data);
      this.queryParams.deptId = data.id;
      this.getStockUserList();
    },
    // 获取常用人员列表
    getStockUserList() {
      listUser(this.queryParams).then((peo) => {
        this.total = peo.total;

        this.selfuacTableData = peo.rows.map((item) => {
          let arr = ['启用', '禁用'];
          item.statusName = arr[item.status];
          return item;
        });
      });
    },
    getSelfTreeData() {
      deptTreeSelect({
        whetherStock: 0,
      }).then((res) => {
        console.log(res);
        this.selfTreeData = res.data;
        // this.selfTreeData.forEach((e) => {
        //   return (e.visible = e.visible1 = e.visible2 = e.visible3 = false);
        // });
      });
    },
    addOrgSuccess() {
      this.showAddOrg = false;
      this.getSelfTreeData();
    },
    addUserSuccess() {
      this.getStockUserList();
      this.showAddUser = false;
    },
    oftenOrgsuccess() {
      this.getStockUserList();
      this.oftenOrgDialog = false;
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
  },
};
</script>

<style scoped lang="scss">
.auth {
  height: 100%;
  position: relative;
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    .title {
      font-size: 20px;
      font-weight: bold;
    }
  }
  .main-tab {
    height: 60px;
  }
  .table {
    background: #fff;
    margin-top: 16px;
    padding: 6px 24px;
    .subToolbar {
      height: 50px;
      overflow: hidden;
    }
    .sub {
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .title {
      font-size: 16px;
      height: 34px;
      font-weight: bold;
    }
  }
  .pagination {
    height: 40px;
    background: #fff;
    text-align: right;
    padding-right: 24px;
  }
}
.toolbar {
  display: flex;
  align-items: center;
  background: #fff;
  height: 60px;
  padding: 0 24px;
  ::v-deep {
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
.upload {
  display: inline-block;
  margin: 0 10px;
}
.tree-box {
  width: 100%;
  height: 90%;
  display: flex;
  justify-content: space-between;
  .tree {
    width: 30%;
    overflow: scroll;
    display: flex;
    margin-right: 16px;
    flex-direction: column;
    justify-content: space-between;
    height: 71vh;
    background: #fff;
  }
  .table {
    width: 70%;
    height: 70vh;
  }
}
.async-btn {
  display: flex;
  .upload {
    margin-left: 10px;
  }
}
::v-deep .el-tree {
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
    .el-button {
      display: block;
    }
  }
}
::v-deep .el-popover,
.el-popper {
  font-size: 22px;
}
::v-deep .el-popover .popoverBtn,
.el-popper .popoverBtn {
  margin-top: 10px;
  float: right;
}
::v-deep .el-popover .remove,
.el-popper .remove {
  top: 350px;
}
.el-dropdown {
  cursor: pointer;
  float: right;
}
.btn-box {
  margin-top: 10px !important;
}

.index {
  .tree-box {
    margin: 16px 16px 0 0;
    .list {
      width: 30%;
      .item {
        margin-top: 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .name {
          margin-right: 20px;
        }
      }
      .maring {
        // margin-top: 16px;
        width: 100%;
        padding: 8px;
        box-sizing: border-box;
        background: #fffbe6;
        border: 1px solid yellow;
        .el-icon-warning {
          color: #faad14;
        }
      }
    }
  }
}
.el-table {
  height: 100% !important;
}
.toolbar {
  display: flex;
  align-items: center;
  background: #fff;
  height: 60px;
  padding: 0 24px;

  ::v-deep .el-form {
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
.title {
  font-size: 20px;
  font-weight: 600;
  margin: 6px 0;
}
</style>
