<template>
  <div class="conscripts">
    <div class="serch">
      <el-form :inline="true" :model="query" class="demo-form-inline">
        <div class="left">
          <el-form-item label="接收部门：">
            <el-select v-model="query.region" placeholder="活动区域">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态：">
            <el-select v-model="query.region" placeholder="活动区域">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="right">
          <el-form-item label="">
            <el-input
              placeholder="请输入搜索关键字"
              @input="search"
              v-model="query.keyWord"
              class="input-with-select search"
            >
              <el-button @click="search" slot="append" icon="el-icon-search"></el-button
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查 询</el-button>
            <el-button @click="onSubmit">重 置</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="table">
      <div class="table-title">
        <el-tabs v-model="tableTab" @tab-click="tableTabClick" class="main-tab">
          <el-tab-pane label="服务记录" name="1"></el-tab-pane>
          <el-tab-pane label="子女教育情况" name="2"></el-tab-pane>
        </el-tabs>
        <div class="right">
          <el-button @click="delItem">删 除</el-button>
          <el-button type="primary" @click="addItem">新 建</el-button>
        </div>
      </div>
      <el-table
        :data="tableData"
        border
        header-row-class-name="table-header"
        size="medium"
        style="width: 100%"
        height="calc(100% - 80px)"
        @selection-change="selection = $event"
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
              <el-button type="text">编辑</el-button>
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
    <AddOrEdit
      v-if="addOrEditDialog"
      @close="addOrEditClose"
      :propsData="addOrEditData"
      :titleName="addOrEditTitleName"
    />
    <!-- 详情弹窗 -->
    <InfoData v-if="infoDialog" @close="infoDialog = false" :propsData="infoData" />
  </div>
</template>

<script>
// 组件

import AddOrEdit from '../dialog/addOrEdit.vue';
import InfoData from '../dialog/infoData.vue';
export default {
  props: {},
  components: { AddOrEdit, InfoData },
  data() {
    return {
      query: {
        user: '',
        region: '',
        keyWord: '',
      },
      tableColumns: [
        {
          width: 500,
          label: '任务内容',
          prop: 'name',
        },
        {
          width: 0,
          label: '反映人员',
          prop: 'name',
        },
        {
          width: 0,
          label: '接收部门',
          prop: 'name',
        },
        {
          width: 0,
          label: '任务状态',
          prop: 'name',
        },
        {
          width: 0,
          label: '办结日期',
          prop: 'name',
        },
      ],
      tableData: [{}],
      total: 0,
      // -----------------tabs---------------------
      mainTab: '1',
      tableTab: '1',
      // -----------------dialog-------------------
      addOrEditDialog: false,
      infoDialog: false,
      addOrEditTitleName: '新建内容',
      addOrEditData: {},
      infoData: {},
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
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
    onSubmit() {},
    search() {},
    addItem() {
      this.addOrEditDialog = true;
    },
    delItem() {},
    viewItem(row) {
      this.infoDialog = true;
      this.infoData = JSON.parse(JSON.stringify(row));
    },
    addOrEditClose() {
      this.addOrEditDialog = false;
      this.addOrEditData = {};
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
    height: calc(100vh - 34vh);
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
