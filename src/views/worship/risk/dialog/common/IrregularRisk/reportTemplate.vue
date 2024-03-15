<template>
  <div class="reportList">
    <el-table :data="tableData" border header-row-class-name="table-header" size="medium" height="64vh">
      <el-table-column prop="fileName" label="模板名称">
        <template slot-scope="{ row }">
          <div class="file">
            {{ row.fileName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="上传时间"></el-table-column>
      <el-table-column prop="departName" label="发送通知 " width="200">
        <template slot-scope="{ row }">
          <div v-if="row.noticeStatus">
            <el-button disabled type="text">已通知</el-button>
            <el-button @click="openMsg(row)" type="text">再次通知</el-button>
          </div>
          <el-button v-else @click="openMsg(row)" type="text">发送通知</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" fixed="right">
        <template slot-scope="{ row }">
          <el-button type="text" @click="openUrl(row.filePath)">下载</el-button>
          <el-button type="text">
            <el-popconfirm title="确定删除吗？" @confirm="delItem(row)">
              <el-button type="text" size="small" slot="reference">删除</el-button>
            </el-popconfirm>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <sendMsgDialog
      v-if="showSendMsg"
      :propsData="sendMsgData"
      @close="showSendMsg = false"
      @success="showSendMsgSuccess"
    />
  </div>
</template>

<script>
import sendMsgDialog from './dialog/sendMsgDialog.vue';
import { listRiskFile, delRiskFile } from '@/api/worship/risk';
import { listByIds } from '@/api/system/oss';
export default {
  props: {
    propsQuery: {},
  },
  components: {
    sendMsgDialog,
  },
  data() {
    return {
      tableData: [],
      query: {
        pageNum: 1,
        pageSize: 999999,
        type: 0,
      },
      showSendMsg: false,
      sendMsgData: {},
    };
  },
  computed: {},
  watch: {
    propsQuery: {
      handler(val) {
        this.query = {
          ...this.query,
          ...val,
          type: 0,
        };
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    this.getList();
  },
  mounted() {},
  methods: {
    getList() {
      if (this.query.searchTime) {
        this.query.beginDate = this.query.searchTime[0] || null;
        this.query.endDate = this.query.searchTime[1] || null;
      } else {
        this.query.beginDate = null;
        this.query.endDate = null;
      }
      // let departCode = getFormDepartCode(this.query.departCode).departCode;
      listRiskFile({ ...this.query, searchTime: null }).then((res) => {
        console.log(res);
        this.tableData = res.rows;
      });
      // axios({
      //   url: '/riskFile/getPage',
      //   method: 'get',
      //   params: { ...this.query, searchTime: null, departCode },
      // }).then((res) => {
      //   console.log(res);
      //   this.tableData = res.records;
      // });
    },
    openUrl(url) {
      listByIds(url).then((res) => {
        window.open(res.data[0].url);
      });
    },
    delItem(row) {
      delRiskFile(row.id).then((res) => {
        this.$message.success('删除成功!');
        this.getList();
      });
    },
    openMsg(row) {
      this.sendMsgData = JSON.parse(JSON.stringify(row));
      this.showSendMsg = true;
    },
    showSendMsgSuccess() {
      this.getList();
      this.showSendMsg = false;
    },
  },
};
</script>

<style scoped lang="scss">
.reportList {
  .file {
    color: #409eff;
  }
}
</style>
