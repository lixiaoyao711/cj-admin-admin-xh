<template>
  <div class="index">
    <div class="toolbar">
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <div class="left">
          <el-form-item label="行政区划:" prop="divisionCode">
            <TreeSelectDivision
              v-model="queryParams.divisionCode"
              @treeselectChange="(e) => treeselectChange(e, queryParams, 'divisionCode')"
            ></TreeSelectDivision>
          </el-form-item>
          <el-form-item label="角色:" prop="sex">
            <el-select v-model="queryParams.roleId" placeholder="请选择角色" clearable>
              <el-option v-for="role in roleList" :key="role.roleId" :label="role.roleName" :value="role.roleId" />
            </el-select>
          </el-form-item>
        </div>
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
    <div class="table">
      <div class="table-title-box">
        <div class="title-name">人员管理</div>
        <div class="btns">
          <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新 增</el-button>
        </div>
      </div>
      <el-table :data="selfuacTableData" height="58vh">
        <!-- <el-table-column prop="userName" label="用户名" width=""> </el-table-column> -->
        <el-table-column prop="nickName" label="姓名" width="" align="center"> </el-table-column>
        <el-table-column prop="userName" label="账号" width="" align="center"> </el-table-column>
        <el-table-column prop="phonenumber" label="手机号" width="" align="center"> </el-table-column>
        <el-table-column prop="divsionName" label="行政区划" width="" align="center"> </el-table-column>
        <el-table-column prop="roleName" label="角色" width="" align="center"> </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="" align="center"> </el-table-column>
        <el-table-column prop="statusName" label="是否启用" width="80" align="center">
          <template slot-scope="{ row }">
            <el-switch
              v-model="row.status"
              @change="changeStatus(row)"
              active-value="0"
              inactive-value="1"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center" class-name="small-padding fixed-width">
          <template slot-scope="{ row }">
            <div>
              <el-button type="text" size="small" @click="editUser(row)">编辑</el-button>
              <el-button type="text" size="small" v-hasPermi="['system:user:resetPwd']" @click="handleResetPwd(row)"
                >重置密码</el-button
              >
              <el-button type="text" size="small" v-hasPermi="['system:user:remove']" @click="handleDelete(row)"
                >删除</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>

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
import AddUser from './dialog/addUser.vue';

import {
  deptTreeSelect,
  listUser,
  delUser,
  changeUserStatus,
  deleteAreCommonlyUs,
  tagsAreCommonlyUsBuilt,
  resetUserPwd,
} from '@/api/system/user';
import { listRole } from '@/api/system/role';

export default {
  props: {},
  dicts: ['sys_user_sex'],
  components: {
    AddUser,
  },
  data() {
    return {
      selfuacTableData: [],
      selfTreeData: [],
      roleList: [],
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
        pageNum: 1,
        pageSize: 10,
        deptId: undefined,
        roleId: undefined,
        whetherSystemBuild: 1,
        keyWord: '',
      },
      total: 0,
    };
  },
  computed: {
    treeList() {
      return this.$store.getters.divisionsTreeList;
    },
  },
  watch: {},
  created() {
    this.getList();
    this.getRoleList();
    // this.getSelfTreeData();
  },
  mounted() {},
  methods: {
    getList() {
      this.getStockUserList();
    },
    /** 查询角色列表 */
    getRoleList() {
      this.loading = true;
      listRole({
        page: -1,
        size: -1,
      }).then((response) => {
        this.roleList = response.rows;
        this.loading = false;
      });
    },
    // 转入常用人员
    importOften(row) {
      this.oftenOrgData = JSON.parse(JSON.stringify(row));
      this.oftenOrgDialog = true;
    },
    handleAdd() {
      this.activeRow = {};
      this.showAddUser = true;
    },
    editUser(row) {
      this.activeRow = JSON.parse(JSON.stringify(row));
      this.showAddUser = true;
    },
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
    // 获取常用人员列表
    getStockUserList() {
      listUser(this.queryParams).then((peo) => {
        this.total = peo.total;
        this.selfuacTableData = peo.rows.map((item) => {
          let arr = ['启用', '禁用'];
          item.statusName = arr[item.status];
          item.divsionName = this.getDivsionName(this.treeList, item.divisionCode)[0];
          return item;
        });
        console.log(this.selfuacTableData);
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
    changeStatus(row) {
      changeUserStatus(row.userId, row.status).then((res) => {
        this.$message.success('修改成功');
        this.getList();
      });
    },
    /** 重置密码按钮操作 */
    handleResetPwd(row) {
      this.$prompt('请输入"' + row.userName + '"的新密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        inputPattern: /^.{5,20}$/,
        inputErrorMessage: '用户密码长度必须介于 5 和 20 之间',
      })
        .then(({ value }) => {
          resetUserPwd(row.userId, value).then((response) => {
            this.$modal.msgSuccess('修改成功，新密码是：' + value);
          });
        })
        .catch(() => {});
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.userId || this.ids;
      this.$modal
        .confirm('是否确认删除姓名为"' + row.nickName + '"的数据项？')
        .then(() => {
          this.loading = true;
          return delUser(ids);
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
.table {
  background: #fff;
  margin: 16px 0 0 0;
  padding: 16px;
  box-sizing: border-box;
  height: 650px;
  .table-title-box {
    display: flex;
    justify-content: space-between;
    margin: 0 0 16px 0;
    .title-name {
      font-family: PingFangSC-Medium;
      font-weight: 600;
      font-size: 18px;
      color: #333333;
    }
  }
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
