<template>
  <div class="box">
    <el-dialog
      title="选择人员或机构"
      width="1200px"
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
            accordion
            check-strictly
            :show-checkbox="!isRadioOrg && isOrgChange"
          ></el-tree>
        </div>

        <div class="table" v-if="isTable">
          <div class="right">
            <el-input placeholder="请输入搜索关键字" v-model="queryParams.userName"></el-input>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </div>
          <el-table
            v-loading="loading"
            height="92%"
            :data="tableData"
            style="width: 30vw"
            @selection-change="handleSelectionChange"
            @current-change="currentChangeionChange"
            :header-cell-class-name="cellClass"
            ref="table"
          >
            <el-table-column v-if="isRadio" label="选择" width="55">
              <template slot-scope="{ row }">
                <el-radio v-model="checkData" :disabled="checkedKeys.length !== 0" :label="row"><i></i></el-radio>
              </template>
            </el-table-column>
            <el-table-column v-else :selectable="selectable" type="selection" width="55"> </el-table-column>
            <el-table-column prop="nickName" label="姓名" width=""> </el-table-column>
            <el-table-column prop="phonenumber" label="联系方式" width=""> </el-table-column>
            <el-table-column prop="phonenumber" label="组织架构" width=""> </el-table-column>
          </el-table>
          <pagination
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getOftenPeople"
          />
        </div>
      </section>
      <!-- 多选框选中数据用tag展示,单选不需要 -->
      <div v-if="isRadio === false || isOrgChange">
        <div v-if="checkTreeData.length || isTable === false || isOrgChange">
          <header><el-tag type="danger">已选部门</el-tag></header>
          <div class="change-tag">
            <el-tag
              class="mr5"
              v-for="item in checkTreeData"
              :key="item.id"
              closable
              @close="tagClose(item, 'org')"
              type="info"
              size="mini"
            >
              {{ item.label }}
            </el-tag>
          </div>
        </div>
        <div v-else>
          <header>
            <el-tag>已选人员</el-tag>
          </header>
          <div class="change-tag">
            <el-tag
              class="mr5"
              v-for="item in checkData"
              :key="item.userId"
              closable
              @close="tagClose(item, 'people')"
              type="info"
              size="mini"
            >
              {{ item.nickName }}
            </el-tag>
          </div>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="$emit('close')">取 消</el-button>
        <el-button type="primary" @click="handleSave">下一步</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { deptTreeSelect, listUser } from '@/api/system/user';

export default {
  props: {
    // 0:浙政钉人员 1:常用人员
    type: {
      type: String,
      default: '1',
    },
    // 是否单选人员
    isRadio: {
      type: Boolean,
      default: false,
    },
    // 是否单选组织机构
    isRadioOrg: {
      type: Boolean,
      default: false,
    },
    // 是否可以选择组织机构
    isOrgChange: {
      type: Boolean,
      default: true,
    },
    // 是否可以选人
    isTable: {
      type: Boolean,
      default: true,
    },
  },
  components: {},
  data() {
    return {
      dialogVisible: true,
      loading: false,
      treePath: [],
      peopleList: [],
      receivePeaple: [],
      fileList: [],
      accept: ['.jpg', '.png'],
      form: {
        targetId: '',
        targetName: '',
        logContent: '',
        searchValue: '',
      },
      props: {
        isLeaf: 'leaf',
        value: 'id',
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        id: undefined,
        whetherStock: this.type,
        userName: '',
      },
      allDepartment: [],
      ///存表格选择的数据
      checkData: [],
      //存选择组织机构的数据
      checkTreeData: [],

      editCheckId: '',
      tableData: [],
      checkedKeys: [],
      id: 0,
      total: 0,
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getTreeData();
    this.getOftenPeople();
  },
  methods: {
    search() {
      this.queryParams.pageNum = 1;
      this.getOftenPeople();
    },
    reset() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        deptId: undefined,
        whetherStock: this.type,
        userName: '',
      };
      this.getOftenPeople();
    },
    getTreeData() {
      deptTreeSelect({
        whetherStock: 1,
      }).then((res) => {
        console.log(res);
        this.allDepartment = res.data;
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
      this.getOftenTreeData(node.data.id).then((res) => {
        // length为0代表到了最后的节点需要请求人员
        if (res.data.length !== 0) {
          node.data.children = res.data;
          resolve(res.data);
        } else {
          resolve([]);
        }
      });
    },
    handleSave() {
      if (
        ((Array.isArray(this.checkData) && this.checkData.length === 0) ||
          (!Array.isArray(this.checkData) && !this.checkData.userId)) &&
        !!!this.checkTreeData.length
      ) {
        this.$message.warning('请选择人员或者组织机构');
        return;
      }
      let type = this.checkTreeData.length ? 'org' : 'people';
      let emitList = this.checkTreeData.length ? this.checkTreeData : this.checkData;
      this.$emit('success', emitList, type);
    },
    handleNodeClick(data) {
      if (this.isRadioOrg && this.isOrgChange && !data.children) {
        this.checkTreeData = [data];
      }
      this.queryParams.deptId = data.id;
      this.getOftenPeople();
    },
    // 获取常用人员
    getOftenPeople() {
      this.loading = true;
      listUser(this.queryParams).then((peo) => {
        this.total = peo.total;
        this.tableData = peo.rows.map((item) => {
          let arr = ['启用', '禁用'];
          item.statusName = arr[item.status];
          return item;
        });
        this.loading = false;
      });
    },
    async getOftenTreeData(path = null) {
      return request({
        url: '/system/dept/list',
        method: 'get',
        params: {
          parentId: path,
        },
      }).then((res) => {
        !path ? (this.allDepartment = res.data) : '';
        return res;
      });
    },

    handleSelectionChange(data) {
      this.checkData = data;
      this.$emit('checkClick', data);
    },
    currentChangeionChange(data) {
      this.$emit('radioClick', data);
    },
    handleChange(data, checked) {
      console.log(data, checked);
      if (checked) {
        // if (this.isRadio) {
        //   this.$refs.tree.setCheckedKeys([data.id]);
        // }
        this.checkData = [];
        this.isTable ?? this.$refs.table.clearSelection();
        this.checkTreeData = JSON.parse(JSON.stringify([...this.checkTreeData, data]));
        this.$emit('radioClick', data);
      } else {
        this.checkTreeData = this.checkTreeData.filter((item) => item.id !== data.id);
      }

      this.checkedKeys = this.$refs.tree.getCheckedKeys();
    },
    selectable() {
      return this.checkedKeys.length === 0;
    },
    /**
     * 全选按钮隐藏
     */
    cellClass(row) {
      if (this.checkedKeys.length && row.columnIndex === 0) {
        return 'DisableSelection';
      }
    },
    // tag关闭
    tagClose(row, type = 'people') {
      /**
       * type:people 人员 org:组织机构
       */
      if (type === 'people') {
        this.checkData = this.checkData.filter((item) => item.userId !== row.userId);
        this.$refs.table.toggleRowSelection(row);
      }
      console.log(row, this.checkTreeData);
      if (type === 'org') {
        this.checkTreeData = this.checkTreeData.filter((item) => item.id !== row.id);
        console.log(this.checkTreeData.map((item) => item.id));
        this.$refs.tree.setCheckedKeys(this.checkTreeData.map((item) => item.id));
      }
    },
  },
};
</script>
<style lang="scss">
.el-table .DisableSelection .cell .el-checkbox__inner {
  display: none !important;
}
</style>

<style scoped lang="scss">
.right {
  display: flex;
  margin: 6px 0;
  .el-input {
    margin: 0 16px 0 0;
  }
}
.box {
  width: 100%;
}
section {
  border: 1px solid #e5e5e5;
}
.tree-box {
  display: flex;
  .table {
    width: 100%;
    height: 50vh;
  }

  .title {
    background: #f6f6f6;
    border-bottom: 1px solid #e5e5e5;
    line-height: 40px;
    padding: 0 16px;
  }
  .tree {
    padding: 16px;
    height: 58vh;
    width: 100%;
    overflow-y: auto;
  }
}
.change-tag {
  height: 100px;
  overflow: scroll;
  border: 1px solid #e5e5e5;
  padding: 6px;
  box-sizing: border-box;
  margin: 10px 0 0 0;
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
::v-deep.el-tree {
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
// ::v-deep {
//   .el-tree {
//     .el-tree-node {
//       .el-checkbox {
//         .el-checkbox__inner {
//           display: none;
//         }
//       }
//     }
//   }
// }
/* 去除滚动条 */
::-webkit-scrollbar {
  display: none;
}
</style>
