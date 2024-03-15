<template>
  <div class="worship">
    <div class="serch">
      <el-form :inline="true" :model="query" class="demo-form-inline">
        <div class="left">
          <el-form-item label="行政区划：">
            <TreeSelectDivision
              v-model="query.divisionCode"
              @treeselectChange="(e) => treeselectChange(e, query, 'divisionCode')"
            ></TreeSelectDivision>
          </el-form-item>

        </div>
        <div class="right">
          <el-form-item label="" prop="keyWord">
            <el-input placeholder="请输入搜索关键字" v-model="query.keyWord" class="input-with-select search">
              </el-input
            >
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查 询</el-button>
            <el-button @click="onSubmit">重 置</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="table">
      <div class="table-title">
        <div>子女入学情况</div>
        <div class="right">
          <!-- <el-button type="primary" @click="addItem">新 建</el-button>
          <el-button type="text">
            <el-popconfirm title="确定批量删除吗？" @confirm="delItem">
              <el-button slot="reference" class="del-button" :disabled="checkData.length === 0">删 除</el-button>
            </el-popconfirm>
          </el-button> -->
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
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          v-for="(item, index) in tableColumns"
          :key="index"
        ></el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="{ row }">
            <div>
              <el-button @click="viewItem(row)" type="text">详情</el-button>
              <el-button @click="editItem(row)" type="text">编辑</el-button>
              <el-button type="text">
                <el-popconfirm title="确定删除吗？" @confirm="delItem(row)">
                  <el-button type="text" size="small" slot="reference">删除</el-button>
                </el-popconfirm>
              </el-button>
            </div>
          </template>
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
    <!-- 新增编辑弹窗 -->
    <ChildrenEducationaddOrEdit
      v-if="addOrEditDialog"
      @close="addOrEditClose"
      :propsData="addOrEditData"
      :titleName="addOrEditTitleName"
    />
    <!-- 详情弹窗 -->
    <ChildrenEducationinfoData v-if="infoDialog" @close="infoDialog = false" :propsData="infoData" />
  </div>
</template>

<script>
// 组件

import ChildrenEducationaddOrEdit from '../dialog/childrenEducationaddOrEdit.vue';
import ChildrenEducationinfoData from '../dialog/childrenEducationinfoData.vue';
// api

export default {
  props: {},
  components: { ChildrenEducationaddOrEdit, ChildrenEducationinfoData },
  data() {
    return {
      tableColumns: [
        {
          width: 0,
          label: '姓名',
          prop: 'name',
        },
        {
          width: 0,
          label: '性别',
          prop: 'sexName',
        },
        {
          width: 0,
          label: '年龄',
          prop: 'name',
        },
        {
          width: 0,
          label: '身份证号',
          prop: 'cardCode',
        },
        {
          width: 0,
          label: '民族',
          prop: 'nationalName',
        },
        {
          width: 0,
          label: '行政区划',
          prop: 'departName',
        },
        {
          width: 0,
          label: '所属军人证号',
          prop: 'militaryCardCode',
        },
        {
          width: 0,
          label: '学校名称',
          prop: 'academyName',
        },
      ],
      tableData: [],
      checkData: [],
      sexMap: {
        1: '男',
        2: '女',
      },
      // -----------------查询相关---------------------
      query: {
        page: 1,
        size: 30,
        sex: '',
        departCode: '',
        keyWord: '',
      },
      total: 0,
      // -----------------tabs---------------------
      mainTab: '1',
      tableTab: '1',
      // -----------------dialog-------------------
      addOrEditDialog: false,
      infoDialog: false,
      addOrEditTitleName: '添加子女入学信息',
      addOrEditData: {},
      infoData: {},
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      let depart = '';

      // childrenEducationGetPage(Object.assign({}, this.query, depart)).then((res) => {
      //   // this.tableData = res.records;
      //   this.tableData = res.records.map((item) => {
      //     item.sexName = this.sexMap[item.sex];
      //     return item;
      //   });
      //   this.total = res.total;
      // });
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
    onSubmit() {
      this.query = {
        page: 1,
        size: 30,
        sex: '',
        departCode: '',
        keyWord: '',
      };
      this.getList();
    },
    addItem() {
      this.addOrEditDialog = true;
    },
    editItem(row) {
      this.addOrEditTitleName = '编辑子女入学信息';
      this.addOrEditData = JSON.parse(JSON.stringify(row));
      this.addOrEditDialog = true;
    },
    delItem(row) {
      // 批量删除
      if (this.checkData.length) {
        let id = this.checkData.reduce((pre, cur) => {
          return pre + `${cur.id},`;
        }, '');
        id = id.slice(0, -1);
        // childrenEducationDelete(id).then((res) => {
        //   this.$message.success('批量删除成功');
        //   this.getList();
        //   return;
        // });
      }
      // childrenEducationDelete(row.id).then((res) => {
      //   this.$message.success('删除成功');
      //   this.getList();
      // });
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
.worship {
  height: auto;
  .serch {
    height: 60px;
    padding: 0 24px;
    background: #fff;
    border-radius: 2px;
    display: flex;
    align-items: center;

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
  .table {
    height: calc(100vh - 32vh);
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
}
</style>
