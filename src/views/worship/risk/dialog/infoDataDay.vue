<template>
  <div class="interview app-container">
    <header>
      <div class="h-title" @click="backItem">
        <i class="el-icon-back"></i>{{ propsData.departName }}信访不稳定因素每日零报告表
      </div>
    </header>
    <el-tabs v-model="form.colorMark" class="main-tab" @tab-click="mainTabClick">
      <el-tab-pane v-for="(item, index) in stateMap" :key="index" :name="index">
        <span slot="label">{{ item.label }}</span>
      </el-tab-pane>
    </el-tabs>
    <div class="toolbar">
      <el-form :model="form" ref="form" :inline="true">
        <div class="left">
          <el-form-item label="选择日期:" prop="departCode">
            <el-date-picker
              :picker-options="PickerOptions"
              v-model="form.statMonth"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </el-form-item>
        </div>
        <div class="right" v-if="form.colorMark == 1">
          <el-upload
            class="upload"
            action="/worship/worshipRiskZero/importData"
            :show-file-list="false"
            :headers="headers"
            :on-success="uploadSuccess"
          >
            <el-button v-if="btnsIsShow.signaturePreparer && isMotn" :disabled="whetherCommit == 1" slot="trigger"
              >导入</el-button
            >
          </el-upload>
          <el-button
            v-if="btnsIsShow.signaturePreparer && isMotn"
            :disabled="whetherCommit == 1"
            @click="uploadTemp('/worship/worshipRiskZero/exportTemplate', '信访不稳定因素每日零报告表')"
            >导入模板下载</el-button
          >
          <el-button v-if="btnsIsShow.signaturePreparer" @click="handleExportByStatId">导出</el-button>
          <el-button type="primary" @click="getList">查询</el-button>
          <el-button @click="reset">重置</el-button>
          <el-button
            v-if="isShowTop && btnsIsShow.signaturePreparer && isMotn"
            :disabled="whetherCommit == 1"
            type="primary"
            @click="addItem"
            >新建</el-button
          >
          <el-button v-if="whetherCommit == 0 && isShowTop && btnsIsShow.signaturePreparer && isMotn" type="text">
            <el-popconfirm title="确定提交吗？" @confirm="commitRow">
              <el-button :disabled="tableData.length === 0" slot="reference" type="primary">提交至上级单位</el-button>
            </el-popconfirm>
          </el-button>
          <el-button v-if="whetherCommit == 1 && isShowTop && btnsIsShow.signaturePreparer && isMotn" type="text">
            <el-popconfirm title="确定撤回吗？" @confirm="backRow(row)">
              <el-button slot="reference" type="primary">撤回</el-button>
            </el-popconfirm>
          </el-button>
        </div>
        <div class="right" v-if="form.colorMark == 2">
          <!-- <el-upload
            class="upload"
            action="/worship/worshipRiskZero/importData"
            :show-file-list="false"
            :headers="headers"
            :on-success="uploadSuccess"
          >
            <el-button :disabled="whetherCommit == 1" slot="trigger">导入</el-button>
          </el-upload> -->

          <el-button @click="handleExport">导出</el-button>
          <el-button type="primary" @click="getList">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </el-form>
    </div>
    <div class="table">
      <div class="subToolbar">
        <div class="sub" v-if="form.colorMark == 1">
          <div class="left">
            <div class="title">{{ motn }}</div>
            <!-- <div class="upluad" v-if="isShowTop">
              <span>填报镇街盖章：</span
              ><el-upload
                action="https://jsonplaceholder.typicode.com/posts/"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
              >
                <span class="sign">上传</span>
              </el-upload>
            </div> -->
          </div>
          <div class="right"></div>
        </div>
        <div class="sub" v-if="form.colorMark == 2">
          <div class="title">村社列表</div>
          <div>本日已提交：{{ submitValue }}个村社 本日未提交：{{ uncommittValue }}个村社</div>
        </div>
      </div>
      <el-table
        v-if="form.colorMark == 1"
        :data="tableData"
        border
        header-row-class-name="table-header"
        size="medium"
        style="width: 100%; height: 100%"
        height="calc(100% - 100px)"
      >
        <el-table-column prop="name" label="内容" width="800">
          <template slot-scope="{ row }">
            <div v-if="!row.inputShow">
              {{ row.content }}
            </div>
            <div v-else>
              <el-input v-model="row.content"> </el-input>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="sexText" label="说明">
          <template slot-scope="{ row }">
            <div v-if="!row.inputShow">
              {{ row.instructions }}
            </div>
            <div v-else>
              <el-input v-model="row.instructions"> </el-input>
            </div>
          </template>
        </el-table-column> -->
        <el-table-column prop="sexText" label="值班领导签字">
          <template slot-scope="{ row }">
            <div v-if="!row.inputShow">
              {{ row.leaderSign }}
            </div>
            <div v-else>
              <el-input v-model="row.leaderSign"> </el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="sexText" label="填报人">
          <template slot-scope="{ row }">
            <div v-if="!row.inputShow">
              {{ row.fillPerson }}
            </div>
            <div v-else>
              <el-input v-model="row.fillPerson"> </el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="sexText" label="填报时间">
          <template slot-scope="{ row }">
            <div v-if="!row.inputShow">
              {{ row?.fillTime.slice(0, 16) }}
            </div>
            <div v-else>
              <el-date-picker
                :picker-options="PickerOptions"
                v-model="row.fillTime"
                type="datetime"
                placeholder="选择日期"
                disabled
                value-format="yyyy-MM-dd HH:mm:ss"
              >
              </el-date-picker>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right" v-if="btnsIsShow.signaturePreparer && isMotn">
          <template slot-scope="{ row }">
            <div v-if="whetherCommit == 0 && isShowTop">
              <div v-if="!row.inputShow">
                <el-button type="text" size="small" @click="row.inputShow = !row.inputShow">编辑</el-button>
                <el-button type="text">
                  <el-popconfirm title="确定删除吗？" @confirm="delItem(row)">
                    <el-button type="text" size="small" slot="reference">删除</el-button>
                  </el-popconfirm>
                </el-button>
              </div>
              <div v-else>
                <el-button type="text" size="small" @click="saveItem(row)">保存</el-button>
                <el-button type="text" size="small" @click="cancel(row)">取消</el-button>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-table
        v-if="form.colorMark == 2"
        :data="tableData"
        border
        header-row-class-name="table-header"
        size="medium"
        style="width: 100%; height: 100%"
        height="calc(100% - 100px)"
      >
        <el-table-column key="departName" prop="departName" label="村社"> </el-table-column>
        <el-table-column key="commit" label="今日已提交" width="300">
          <template slot-scope="{ row }">
            {{ row.whetherCommit == 1 ? '是' : '否' }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="100" fixed="right">
          <template slot-scope="{ row }">
            <div v-if="row.whetherCommit == 1 || userinfo.departCode != '330106000000'">
              <el-button type="text" size="small" @click="openDetail(row)">查看</el-button>
              <el-button v-if="row.whetherCommit == 1" type="text" size="small" @click="handleExport(row.id)"
                >导出</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="font" v-if="form.colorMark == 1 && total > 0">
      <div class="font-box">
        制表人（签字）：

        <div class="demo-image__preview" v-if="worshipRiskZeroStat.signaturePreparerUrl">
          <el-image
            @click="viewFont(worshipRiskZeroStat.signaturePreparerUrl)"
            style="width: 100px; height: 100px"
            :src="worshipRiskZeroStat.signaturePreparerUrl"
            :preview-src-list="srcList"
          >
          </el-image>
        </div>

        <span class="user-font" v-else></span>

        <span
          v-if="btnsIsShow.signaturePreparer && isMotn"
          @click="openSignBoard('signaturePreparerUrl')"
          class="sign"
          >{{ worshipRiskZeroStat.signaturePreparerUrl ? '重签' : '签字' }}</span
        >
      </div>
      <div class="font-box">
        退役军人服务站站长（签字）：
        <div class="demo-image__preview" v-if="worshipRiskZeroStat.serviceStationSignUrl">
          <el-image
            @click="viewFont(worshipRiskZeroStat.serviceStationSignUrl)"
            style="width: 100px; height: 100px"
            :src="worshipRiskZeroStat.serviceStationSignUrl"
            :preview-src-list="srcList"
          >
          </el-image>
        </div>
        <span class="user-font" v-else></span>

        <span v-if="btnsIsShow.serviceStation && isMotn" @click="openSignBoard('serviceStationSignUrl')" class="sign">{{
          worshipRiskZeroStat.serviceStationSignUrl ? '重签' : '签字'
        }}</span>
      </div>
      <div class="font-box">
        分管领导（签字）：
        <div class="demo-image__preview" v-if="worshipRiskZeroStat.leaderSignUrl">
          <el-image
            @click="viewFont(worshipRiskZeroStat.leaderSignUrl)"
            style="width: 100px; height: 100px"
            :src="worshipRiskZeroStat.leaderSignUrl"
            :preview-src-list="srcList"
          >
          </el-image>
        </div>
        <span class="user-font" v-else></span>
        <span v-if="btnsIsShow.leader && isMotn" @click="openSignBoard('leaderSignUrl')" class="sign">{{
          worshipRiskZeroStat.leaderSignUrl ? '重签' : '签字'
        }}</span>
      </div>
    </div>
    <div class="pagination" v-if="form.colorMark == 1">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="form.page"
        :page-sizes="[10, 15, 30, 50, 100]"
        :page-size="form.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <SignBoard v-if="signBoardDialog" @close="signBoardClose" />
  </div>
</template>

<script>
import AddLeader from './addLeader.vue';
import SignBoard from './signBoard.vue';
import { formatDate, countDay } from '@/utils/index';

import {
  riskZeroStatGetRiskZero,
  listRiskZeroStatStat,
  riskSignConfigCheckSignPerm,
  addRiskZero,
  updateRiskZero,
  deleteRiskZero,
  updateRiskZeroStat,
  riskZeroSubmitSuperior,
  riskZeroRollback,
} from '@/api/worship/risk';
import { mapState } from 'vuex';

export default {
  props: {
    propsData: Object,
  },
  components: {
    AddLeader,
    SignBoard,
  },
  data() {
    return {
      //日期不能设置在今天之后
      PickerOptions: {
        // 限制时间
        disabledDate(time) {
          // 今天之后都禁用
          return time.getTime() > Date.now();
        },
      },
      tableData: [],
      dateValue: new Date(),
      stateMap: {
        1: { label: '镇街本级', count: 0, time: '', times: '', start: '', end: '' },
        2: { label: '下属村社', count: 0, time: '', times: '', start: '', end: '' },
      },
      todoCount: 0,
      done: 0,
      form: {
        pageNum: 1,
        statId: this.propsData.id,
        departCode: this.propsData.deptCode,
        statMonth: null,
        pageSize: 30,

        colorMark: '1',
      },
      total: 0,
      whetherCommit: 0,
      // 单子信息
      worshipRiskZeroStat: {},
      submitValue: 0,
      uncommittValue: 0,
      //dialog drawer
      activeRow: {},
      selectedPeople: {},
      addLeaderDialog: false,
      signBoardDialog: false,
      // 判断是否需要显示提交的按钮的权限
      isShowTop: true,
      //判断当前筛选日期份是否大于等于当前日期
      isMotn: true,
      headers: {
        Authorization: sessionStorage.token,
      },
      motn: `${new Date().getMonth() + 1}月${new Date().getDate()}日`,
      signBoardField: '',
      srcList: [],
      // 签字权限控制
      btnsIsShow: {},
    };
  },
  computed: {
    dictMap() {
      return this.$store.state.dictMap;
    },
    ...mapState(['userinfo']),
    userinfo() {
      return this.$store.state.user;
    },
  },
  watch: {
    // userinfo(newVal, oldValu) {
    //   // 如果权限是区本级,默认展示全部,否则展示当前权限所拥有的行政区划
    //   if (newVal.divisionLevel === '3') {
    //     this.form.departCode = [''];
    //   } else {
    //     this.form.departCode = this.userinfo.divisionCode;
    //   }
    // },
  },
  created() {
    // // 如果权限是区本级,默认展示全部,否则展示当前权限所拥有的行政区划
    // if (newVal.divisionLevel === '3') {
    //   this.form.departCode = [''];
    // } else {
    //   this.form.departCode = this.userinfo.divisionCode;
    // }

    this.form.statMonth = this.propsData.searchTime;
    setTimeout(() => {
      this.getList();
      if (this.userinfo.rankLevel === '3') {
        this.isShowTop = false;
      }
      // 村社账号直接显示当前社区的报表
      if (this.userinfo.rankLevel === '5') {
        this.openDetail();
      }
    }, 100);
  },
  methods: {
    getList() {
      this.tableData = [];
      this.submitValue = 0;
      this.total = 0;
      this.uncommittValue = 0;
      this.isMotn = true;
      this.motn = this.form.statMonth
        ? `${this.form.statMonth.slice(5, 7)}月${this.form.statMonth.slice(8, 10)}日`
        : `${new Date().getMonth() + 1}月${new Date().getDate()}日`;

      // // 如果搜索天数小于当前天数,隐藏编辑提交按钮
      // if (this.form.statMonth && countDay(this.form.statMonth)) {
      //   this.isMotn = false;
      // }
      console.log(' this.isMotn', this.isMotn);
      if (this.form.colorMark == 1) {
        riskZeroStatGetRiskZero({ ...this.form, departCode: this.propsData.departCode }).then((res) => {
          this.tableData = res.data.pageList.records.map((item) => {
            item.inputShow = false;
            return item;
          });
          this.total = res.data.pageList.total;
          this.whetherCommit = res.data.whetherCommit;
          this.worshipRiskZeroStat = res.data.worshipRiskZeroStat;
        });
        // axios({
        //   url: '/worshipRiskZeroStat/getRiskZero',
        //   method: 'get',
        //   params: { ...this.form, departCode: this.propsData.departCode },
        // }).then((res) => {
        //   this.tableData = res.pageList.records.map((item) => {
        //     item.inputShow = false;
        //     return item;
        //   });
        //   this.total = res.pageList.total;
        //   this.whetherCommit = res.whetherCommit;
        //   this.worshipRiskZeroStat = res.worshipRiskZeroStat;
        // });
      } else {
        listRiskZeroStatStat({ ...this.form, departCode: this.propsData.departCode, queryVillage: true }).then(
          (res) => {
            this.tableData = res.data;
            for (const item of this.tableData) {
              item.whetherCommit == 1 ? this.submitValue++ : this.uncommittValue++;
            }
            this.total = res.total;
          }
        );
        // axios({
        //   url: '/worshipRiskZeroStat/stat',
        //   method: 'get',
        //   params: { ...this.form, departCode: this.propsData.departCode, queryVillage: true },
        // }).then((res) => {
        //   this.tableData = res;
        //   for (const item of this.tableData) {
        //     item.whetherCommit == 1 ? this.submitValue++ : this.uncommittValue++;
        //   }
        //   this.total = res.total;
        // });
      }
      this.getCheckSignPerm();
    },
    // transferText(tableData) {
    //   tableData.forEach(e => {
    //     let typeMap = ['danger', 'warning', 'success'];
    //     e.infoLevelType = typeMap[e.infoLevel - 1] || '';
    //     e.infoLevelText = e.infoLevel ? this.dictMap['info_level'][e.infoLevel].dictLabel : '';
    //   });
    //   console.log('transfer', tableData);
    // },
    removeItem() {},
    openDetail(row) {
      //社区查看去掉下属村社tabs切换

      this.$emit('viewItemDay', row);

      setTimeout(() => {
        // 社区账号需要提交新建按钮

        if (this.userinfo.divisionLevel !== '5') {
          this.isShowTop = false;
        }

        this.stateMap = {
          1: { label: this.propsData.departName, count: 0, time: '', times: '', start: '', end: '' },
        };
        this.form.colorMark = '1';
        this.getList();
      }, 100);
    },
    addItem() {
      this.tableData.push({
        fillPerson: this.userinfo.name,
        inputShow: true,
        fillTime: formatDate(new Date().getTime()),
      });
    },
    saveItem(row) {
      if (row.id != null) {
        updateRiskZero({ ...row, departCode: this.propsData.departCode })
          .then((response) => {
            this.$modal.msgSuccess('修改成功');
            this.getList();
          })
          .finally(() => {});
      } else {
        addRiskZero({ ...row, departCode: this.propsData.departCode })
          .then((response) => {
            this.$modal.msgSuccess('新增成功');
            this.getList();
          })
          .finally(() => {});
      }
    },
    cancel(row) {
      row.inputShow = false;
      this.tableData = this.tableData.filter((item) => item !== row);
    },
    delItem(row) {
      deleteRiskZero(row.id).then((res) => {
        this.$message.success('删除成功');
        this.getList();
      });
    },
    commitRow() {
      riskZeroSubmitSuperior({
        departCode: this.propsData.departCode,
      }).then((res) => {
        this.$message.success('提交成功');
        this.getList();
      });
    },
    backRow() {
      riskZeroRollback({
        departCode: this.propsData.departCode,
      }).then((res) => {
        this.$message.success('撤回成功');
        this.getList();
      });
    },
    handleExport(id) {
      let ids = '';
      if (typeof id == 'number') {
        ids = id;
      } else {
        ids = this.tableData.map((e) => e.id).join(',');
      }
      console.log(ids);
      if (!ids) {
        this.$message.warning('当前无镇街已提交,无导出数据');
        return;
      }

      fetch(`/worship/worshipRiskZero/export?statId=${ids}`, {
        headers: {
          Authorization: sessionStorage.token,
        },
      }).then((res) => {
        res.blob().then((blob) => {
          var a = document.createElement('a');
          var url = window.URL.createObjectURL(blob);
          var filename = '镇街列表.xlsx';
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        });
      });
    },
    handleExportByStatId(id) {
      let ids = '';
      if (typeof id == 'number') {
        ids = id;
      } else {
        ids = this.tableData.map((e) => e.id).join(',');
      }
      console.log(ids);
      if (!ids) {
        this.$message.warning('当前无镇街已提交,无导出数据');
        return;
      }

      fetch(`/worship/worshipRiskZero/export?ids=${ids}`, {
        headers: {
          Authorization: sessionStorage.token,
        },
      }).then((res) => {
        res.blob().then((blob) => {
          var a = document.createElement('a');
          var url = window.URL.createObjectURL(blob);
          var filename = '镇街列表.xlsx';
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        });
      });
    },
    //导入
    uploadSuccess() {
      this.$message.success('导入成功');
      this.getList();
    },
    uploadTemp(path, name) {
      fetch(path, {
        headers: {
          Authorization: sessionStorage.token,
        },
      }).then((res) => {
        res.blob().then((blob) => {
          var a = document.createElement('a');
          var url = window.URL.createObjectURL(blob);
          var filename = `${name}.xlsx`;
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        });
      });
    },
    openEdit() {
      this.addLeaderDialog = true;
    },
    openAdd() {
      this.addLeaderDialog = true;
    },
    leaderColose() {
      this.addLeaderDialog = false;
      this.getList();
    },
    signBoardClose(imgUrl) {
      // 通过判断url来确定是否签名
      if (imgUrl) {
        updateRiskZeroStat({
          id: this.worshipRiskZeroStat.id,
          [this.signBoardField]: imgUrl,
        }).then((res) => {
          console.log(res);
          this.getList();
        });
      }
      this.signBoardDialog = false;
    },
    handleCurrentChange(val) {
      this.form.page = val;
      this.getList();
    },
    handleSizeChange(val) {
      this.form.size = val;
      this.getList();
    },
    reset() {
      this.form = {
        page: 1,
        statId: this.propsData.id,
        departCode: this.propsData.deptCode,
        statMonth: null,
        size: 30,
        colorMark: this.form.colorMark,
      };
      this.getList();
    },
    mainTabClick(vm) {
      console.log(vm.name);
      // this.$router.replace({
      //   query: {
      //     tab: vm.name,
      //   },
      // });
      this.getList();
    },
    openSignBoard(url) {
      this.signBoardDialog = true;
      this.signBoardField = url;
    },
    // 获取签名权限
    getCheckSignPerm() {
      riskSignConfigCheckSignPerm({
        divisionCode: this.propsData.departCode,
        type: 2,
      }).then((res) => {
        this.btnsIsShow = res.data;
      });
    },
    // 开启签名预览
    viewFont(url) {
      this.srcList.push(url);
    },
    backItem() {
      this.$emit('backItem');
    },
    // upload相关
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {},
  },
};
</script>

<style scoped lang="scss">
.interview {
  height: 100%;
  position: relative;
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    .h-title {
      font-size: 20px;
      font-weight: bold;
    }
  }
  .main-tab {
    height: 60px;
    .num {
      background: rgba(140, 140, 140, 0.1);
      border-radius: 20px;
      padding: 0 5px;
      height: 20px;
      line-height: 20px;
      font-size: 12px;
      margin-left: 5px;
    }
    ::v-deep {
      .el-tabs__item {
        &.is-active {
          .num {
            color: #1890ff;
            background: #e6f7ff;
          }
        }
      }
    }
  }
  .table {
    height: 50vh;
    background: #fff;
    margin-top: 16px;
    padding: 6px 24px;
    .state {
      .today {
        background: #fc9a22;
        color: #fff;
        padding: 4px 8px;
      }
      &.state2 {
        color: #fc9a22;
      }
      &.state3 {
        color: #ff0909;
      }
    }
    .table-header {
      height: calc(100% - 40px);
    }
    .subToolbar {
      height: 70px;
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
    padding-top: 10px;
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
.el-icon-back {
  cursor: pointer;
}
.font {
  display: flex;
  justify-content: space-between;
  padding: 0 40px;
  box-sizing: border-box;
  background: #fff;
  .user-font {
    width: 100px;
    height: 100px;
    display: inline-block;
  }
}
.sign {
  color: #1890ff;
  margin-left: 20px;
  cursor: pointer;
}
.upluad {
  display: flex;
}
.right {
  display: flex;
  align-items: center;
  .upload {
    margin-right: 12px;
  }
}
.font-box {
  display: flex;
  align-items: flex-end;
}
</style>

<style lang="scss">
.tri-popper-color {
  width: 80px;
}
.tri-popper {
  min-width: 0;
  width: 80px;
  .el-button {
    margin-bottom: 10px;
    width: 100%;
  }
}
</style>
