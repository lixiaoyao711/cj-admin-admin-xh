<template>
  <div class="registerToday">
    <div class="title">
      <span class="back" @click="back"> <i class="el-icon-back"></i> 返回</span>
      <div class="registerToday-title">今日登记情况</div>
    </div>
    <div class="toolbar">
      <el-form :model="query" ref="form" :inline="true">
        <el-form-item label="登记日期:">
          <el-date-picker
            @change="getPage"
            v-model="query.date"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
          <el-button class="back-time" @click="backTime">回到今日</el-button>
        </el-form-item>
      </el-form>
      <div class="right" prop="keyWord">
        <el-button type="text" v-if="query.date === nowTime">
          <el-popconfirm title="重新生成会替换已有数据，是否继续？" @confirm="onClickTable">
            <el-button slot="reference" type="primary">再次生成</el-button>
          </el-popconfirm>
        </el-button>
        <!-- <el-button @click="preview">预览</el-button> -->
        <el-button @click="toExcelData" type="primary">导出word</el-button>
      </div>
    </div>
    <div class="table" v-if="tableData.length || query.date !== nowTime">
      <el-alert
        title="我们已为您生成今日登记情况，请做最后调整，确认无误后即可导出 Word"
        type="success"
        show-icon
        :closable="false"
      >
      </el-alert>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" width="50" label="序号"> </el-table-column>
        <el-table-column prop="typeName" label="登记类型"> </el-table-column>
        <el-table-column prop="levelOrChannelName" label="级别 / 渠道"> </el-table-column>
        <el-table-column prop="divisionName" label="行政区划">
          <template slot-scope="{ row }">
            <div class="refresh" @click="openUpdate(row, 'divisionName')">
              {{ row.divisionName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="personName" label="信访人">
          <template slot-scope="{ row }">
            <div class="refresh" @click="openUpdate(row, 'personName')">
              {{ row.personName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="personType" label="人员类别">
          <template slot-scope="{ row }">
            <div class="refresh" @click="openUpdate(row, 'personType')">
              {{ row.personType }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="petitionType" label="信访类型">
          <template slot-scope="{ row }">
            <div class="refresh" @click="openUpdate(row, 'petitionType')">
              {{ row.petitionType }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="petitionContent" label="信访内容">
          <template slot-scope="{ row }">
            <div class="refresh" @click="openUpdate(row, 'petitionContent')">
              {{ row.petitionContent }}
            </div>
          </template></el-table-column
        >
        <el-table-column prop="resultContent" label="处理结果">
          <template slot-scope="{ row }">
            <div class="refresh" @click="openUpdate(row, 'resultContent')">
              {{ row.resultContent }}
            </div>
          </template></el-table-column
        >
        <el-table-column prop="name" label="操作">
          <template slot-scope="{ row }">
            <el-button type="text" v-if="query.date === nowTime">
              <el-popconfirm title="重新生成会替换已有数据，是否继续？" @confirm="refreshItem(row)">
                <div class="refresh" slot="reference">重新生成</div>
              </el-popconfirm>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="no-data" v-else>
      <img src="@/assets/img/nodata.png" alt="" />
      <div class="text">快速生成进入登记情况</div>
      <el-button @click="onClickTable" type="primary">一键生成</el-button>
    </div>

    <UpdateDialog
      v-if="showDialog"
      :propsData="updateData"
      :updateType="updateType"
      @success="updateSuccess"
      @close="showDialog = false"
    />
  </div>
</template>

<script>
import { timeFormat } from '@/utils/common';
import UpdateDialog from './dialog/updateDialog.vue';
import { listGetPetitionDailyLog, updateDataSingle, generateNewDataFull } from '@/api/worship/registerToday';
export default {
  props: {},
  components: {
    UpdateDialog,
  },
  data() {
    return {
      query: {
        date: timeFormat(new Date(), 'yyyy-MM-dd'),
      },
      nowTime: timeFormat(new Date(), 'yyyy-MM-dd'),
      showDialog: false,
      visible: false,
      tableData: [],
      updateData: {},
      updateType: '',
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.getPage();
  },
  methods: {
    backTime() {
      this.query.date = timeFormat(new Date(), 'yyyy-MM-dd');
      this.getPage();
    },
    back() {
      this.$router.go(-1);
    },
    openUpdate(row, type) {
      this.updateData = JSON.parse(JSON.stringify(row));
      this.updateType = type;
      this.showDialog = true;
    },
    getPage() {
      listGetPetitionDailyLog({
        pageNum: 1,
        pageSize: 99999,
        logDate: this.query.date,
      }).then((res) => {
        this.tableData = res.rows;
      });
      // axios({
      //   url: '/petitionDailyLog/getPage',
      //   method: 'get',
      //   params: {
      //     page: -1,
      //     size: -1,
      //     logDate: this.query.date,
      //   },
      // }).then((res) => {
      //   this.tableData = res.records;
      // });
    },

    onClickTable() {
      generateNewDataFull({
        date: this.query.date,
      }).then((res) => {
        this.getPage();
      });
      // axios({
      //   url: '/petitionDailyLog/generateNewDataFull',
      //   method: 'get',
      //   params: {
      //     date: this.query.date,
      //   },
      // }).then((res) => {
      //   this.getPage();
      // });
    },
    updateSuccess() {
      this.getPage();
      this.showDialog = false;
    },
    preview() {
      let path =
        `https://yiqwzgl.hzxh.gov.cn/view/preview/onlinePreview?url=` +
        encodeURIComponent(
          this.$Base64.encode(
            `https://cjzs.hzxh.gov.cn/worship/petitionDailyLog/exportWord?date=${this.query.date}&fullfilename=${
              this.query.date
            }${new Date().getTime()}.docx`
          )
        );
      console.log(path);
      window.open(path);
    },
    // 导出
    toExcelData() {
      // fetch(`/worship/petitionDailyLog/exportWord?date=${this.query.date}`, {
      //   headers: {
      //     Authorization: sessionStorage.token,
      //   },
      // }).then((res) => {
      //   res.blob().then((blob) => {
      //     var a = document.createElement('a');
      //     var url = window.URL.createObjectURL(blob);
      //     var filename = '登记情况.docx';
      //     a.href = url;
      //     a.download = filename;
      //     a.click();
      //     window.URL.revokeObjectURL(url);
      //   });
      // });

      this.download(
        'worship/petitionDailyLog/exportWord',
        {
          date: this.query.date,
        },
        `当日登记情况${new Date().getTime()}.docx`
      );
    },
    refreshItem(row) {
      updateDataSingle({
        petitionId: row.petitionId,
        id: row.id,
      }).then((res) => {
        this.$message.success('操作成功!');
        this.getPage();
      });
      // axios({
      //   url: '/petitionDailyLog/updateDataSingle',
      //   method: 'get',
      //   params: {
      //     petitionId: row.petitionId,
      //     id: row.id,
      //   },
      // }).then((res) => {
      //   // this.$message.success('操作成功!');
      //   this.getPage();
      // });
    },
  },
};
</script>

<style scoped lang="scss">
.registerToday {
  height: 100%;
  .title {
    display: flex;
    align-items: center;
    margin: 0 0 16px 0;
    .back {
      cursor: pointer;
      margin: 0 16px 0 0;
    }
  }
  .registerToday-title {
    font-size: 20px;
    font-weight: 600;
  }
  .toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff;
    min-height: 60px;
    padding: 10px 24px;
    .back-time {
      margin: 0 0 0 16px;
    }
  }
  .no-data {
    height: calc(100% - 120px);
    background: #fff;
    margin: 16px 0 0 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    img {
      width: 160px;
      height: 160px;
      object-fit: contain;
    }
    .text {
      margin: 16px 0 0 0;
    }
    .el-button {
      margin: 16px 0 0 0;
    }
  }
  .refresh {
    color: #66b1ff;
    cursor: pointer;
  }
  .table {
    height: calc(100% - 120px);
    background: #fff;
    margin: 16px 0 0 0;
    overflow: scroll;
  }
}
</style>
