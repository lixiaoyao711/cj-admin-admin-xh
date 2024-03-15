<template>
  <div class="petitionLetter app-container">
    <template v-if="!mainTab">
      <header>
        <div class="h-title">异动信息</div>
      </header>
      <template>
        <div class="toolbar">
          <el-form :model="form" ref="form" :inline="true">
            <div class="left">
              <el-form-item label="行政区划:" prop="departCode">
                <TreeSelectDivision
                  v-model="form.departCode"
                  @treeselectChange="(e) => treeselectChange(e, form, 'departCode')"
                ></TreeSelectDivision>
              </el-form-item>
              <el-form-item label="登记级别:" prop="infoSource">
                <el-select v-model="form.infoSource" placeholder="请选择" clearable>
                  <el-option
                    v-for="dict in dict.type.sys_worship_djjb"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="预警等级:" prop="infoLevel">
                <el-select v-model="form.infoLevel" placeholder="请选择">
                  <el-option
                    v-for="dict in dict.type.sys_worship_jjcd"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="信息渠道:" prop="infoChannel">
                <el-select v-model="form.infoChannel" placeholder="请选择">
                  <el-option
                    v-for="dict in dict.type.sys_worship_xfdjqd"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="诉求类别:" prop="infoClassify">
                <el-select v-model="form.infoClassify" placeholder="请选择">
                  <el-option
                    v-for="dict in dict.type.sys_worship_xfmdlx"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="登记日期：" prop="time">
                <el-date-picker
                  v-model="searchTime"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :default-time="['00:00:00', '23:59:59']"
                >
                </el-date-picker>
              </el-form-item>
            </div>
            <div class="right" prop="keyWord">
              <el-input placeholder="请输入搜索关键字" v-model="form.keyWord" maxlength="100"></el-input>
              <el-button type="primary" @click="getList">查询</el-button>
              <el-button @click="reset">重置</el-button>
            </div>
          </el-form>
        </div>
        <div class="table">
          <div class="subToolbar">
            <div class="sub">
              <el-tabs v-model="form.state" @tab-click="subTabClick" class="sub-tab">
                <el-tab-pane v-for="(item, index) in stateMap" :key="index" :name="index">
                  <span slot="label"
                    >{{ item.label }}<span class="num">{{ item.count }}</span></span
                  >
                </el-tab-pane>
              </el-tabs>
              <div class="btns">
                <el-button :disabled="!selection.length" type="" @click="handleExport">导出</el-button>
                <el-button type="primary" @click="handleAdd(false)">创 建</el-button>
              </div>
            </div>
          </div>
          <el-table
            :data="tableData"
            border
            v-loading="loading"
            header-row-class-name="table-header"
            size="medium"
            style="width: 100%; height: 100%"
            height="58vh"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="40"> </el-table-column>
            <el-table-column prop="petitionDate" label="日期" width="100">
              <template slot-scope="{ row }">
                <div>{{ parseTime(row.petitionDate, '{y}-{m}-{d}') }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="departName" label="行政区划" width="160"></el-table-column>
            <el-table-column prop="personNames" label="预警人" width="160"></el-table-column>
            <el-table-column prop="infoChannelText" label="渠道" width="160">
              <template slot-scope="scope">
                <dict-tag :options="dict.type.sys_worship_xfdjqd" :value="scope.row.infoChannel"></dict-tag>
              </template>
            </el-table-column>
            <el-table-column prop="infoSourceText" label="登记级别" width="160">
              <template slot-scope="scope">
                <dict-tag :options="dict.type.sys_worship_djjb" :value="scope.row.infoSource"></dict-tag>
              </template>
            </el-table-column>
            <el-table-column prop="infoClassify" label="诉求类别" width="160">
              <template slot-scope="scope">
                <dict-tag :options="dict.type.sys_worship_xfmdlx" :value="scope.row.infoClassify"></dict-tag>
              </template>
            </el-table-column>
            <el-table-column prop="content" label="上访诉求" min-width="220">
              <template slot-scope="{ row }">
                <div>
                  <div v-if="row.content && row.content.length > 40">{{ row.content.slice(0, 40) }}...</div>
                  <div v-else>{{ row.content }}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="infoLevelText" label="预警等级" width="160">
              <template slot-scope="scope">
                <dict-tag :options="dict.type.sys_worship_jjcd" :value="scope.row.infoLevel"></dict-tag>
              </template>
            </el-table-column>
            <el-table-column prop="state" label="状态" width="160">
              <template slot-scope="{ row }">
                <div>
                  {{ row.state == 1 ? '已解除预警' : '正在预警' }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="toEndTime" label="距办结时间" width="100"></el-table-column>
            <el-table-column label="操作" width="190" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" type="text">
                  <router-link :to="`/petitionWarning/abnormalInfoDetail/info/${scope.row.id}`">
                    <el-button size="mini" type="text">详情</el-button>
                  </router-link>
                </el-button>
                <el-button type="text" size="small" @click="editLetter(scope.row)">编辑</el-button>
                <el-button type="text" size="small" class="table-button">
                  <el-popconfirm title="确定删除该信息吗？" @confirm="deleteRow(scope.row)">
                    <span slot="reference">删除</span>
                  </el-popconfirm>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination">
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
        <AddLetterPeople
          v-if="showLetterPeople"
          :showBtn="true"
          :isShowAll="false"
          @close="showLetterPeople = false"
          @success="addPeopleSuccess"
        ></AddLetterPeople>
        <LetterContentForm
          v-if="showLetterContent"
          :info="activeRow"
          :people="selectedPeople"
          @close="showLetterContent = false"
          @success="addLetterSuccess"
          :type="associatedPersonType"
        ></LetterContentForm>
        <RepeatLetter
          v-if="showRepeatLetter"
          :info="activeRow"
          @close="showRepeatLetter = false"
          @success="addRepeatSuccess"
        ></RepeatLetter>
        <BatchDifficult :propsData="batchData" v-if="batchDialog" @close="batchClose" />
      </template>
    </template>
    <RegisterToday v-else @back="pageChange(0)" />

    <ChangePeoPle
      v-if="changePeoPleDialog"
      @close="changePeoPleDialog = false"
      type="petitionDynamics"
      @success="addPeopleSuccess"
      :peopleList="peopleList"
    />
  </div>
</template>

<script>
import AddLetterPeople from './dialog/addLetterPeople.vue';
import LetterContentForm from './dialog/abnormalInfo/letterContentForm.vue';
import RepeatLetter from './dialog/repeatLetter.vue';
import { mapState } from 'vuex';
import BatchDifficult from './dialog/batchDifficult.vue';
import PetitionStatistics from './petitionStatistics.vue';
import RegisterToday from './registerToday';

import ChangePeoPle from '@/components/ChangePeoPle/people.vue';

import {
  listPetitionWarning,
  getTabNum,
  getPetitionWarning,
  addPetitionWarning,
  updatePetitionWarning,
  deletePetitionWarning,
} from '@/api/worship/petitionWarning';
export default {
  props: {},
  dicts: [
    'sys_worship_djjb',
    'sys_worship_xfmdlx',
    'sys_worship_jjcd',
    'sys_worship_xfdjqd',
    'sys_worship_xfmd',
    'sys_worship_wczt',
  ],
  components: {
    AddLetterPeople,
    LetterContentForm,
    RepeatLetter,
    BatchDifficult,
    PetitionStatistics,
    RegisterToday,

    ChangePeoPle,
  },
  data() {
    return {
      tableData: [],
      searchTime: [],
      peopleList: [],
      // 0:待处理,1:办理中,2：办结 3：已评价 9:积案
      stateMap: {
        0: {
          label: '全部',
          count: 0,
        },
        1: {
          label: '正在预警',
          count: 0,
        },
        2: {
          label: '已解除预警',
          count: 0,
        },
        3: {
          label: '追踪列表',
          count: 0,
        },
      },
      lagStateMap: {
        0: '未超时',
        1: '超时未完成',
        2: '按时完成',
        3: '超时完成',
      },
      query: {
        receiveDictCode: '',
      },
      associatedPersonType: '',
      form: {
        infoLevel: '',
        infoSource: '',
        infoChannel: [],
        infoType: '',
        keyWord: '',
        trackState: '', //是否追踪
        state: '', // 0:待处理,1:受理中,2：办结 3：已评价
        pageNum: 1,
        pageSize: 30,
        multiple: '',
        lagState: '',
        repeatInfo: '',
      },
      total: 0,
      selection: [],
      checkList: [],
      mainTab: 0,
      //dialog drawer
      activeRow: {},
      selectedPeople: {},
      showLetterPeople: false,
      showLetterContent: false,
      showRepeatLetter: false,
      batchData: [],
      batchDialog: false,
      loading: false,
      changePeoPleDialog: false,
      title: '异动信息',
      headers: {
        Authorization: sessionStorage.token,
      },
    };
  },
  computed: {
    userinfo() {
      return this.$store.state.user;
    },
  },
  watch: {
    '$route.query': {
      handler() {
        this.initParam();
        // this.$route.query.departCode && this.getList();
        // this.getList();
      },
      immediate: true,
    },
    userinfo(newVal, oldValue) {
      console.log('newVal', newVal);
      // 如果权限是区本级,默认展示全部,否则展示当前权限所拥有的行政区划
      // if (this.userinfo.divisionLevel === '3') {
      //   this.form.departCode = [''];
      // } else {
      //   this.form.departCode = this.userinfo.divisionCode;
      // }
    },
  },
  created() {
    this.title = this.$route.query.title || '异动信息';
    this.form.repeatInfo = this.$route.query.repeatInfo || '';
    this.initParam();
    // 如果权限是区本级,默认展示全部,否则展示当前权限所拥有的行政区划
    // if (this.userinfo.divisionLevel === '3') {
    //   this.form.departCode = [''];
    // } else {
    //   this.form.departCode = this.userinfo.divisionCode;
    // }
    setTimeout(() => {
      this.getList();
      this.getCount();
    }, 500);
  },
  //冒泡排序

  methods: {
    initParam() {
      let query = this.$route.query;
      this.form.infoSource = query.infoSource || '';
      this.form.state = query.state || '';
      // this.form.departCode = setDashboardFormDepartCode(query.departCode);
    },
    getList() {
      this.loading = true;
      this.tableData = [];
      console.log(this.form);
      this.form.beginDate = this.searchTime?.[0];
      this.form.endDate = this.searchTime?.[1];
      let state = this.form.state == '0' || this.form.state == '' ? '' : this.form.state - 1;
      // let departCode = getFormDepartCode(this.form.departCode).departCode;
      // let infoChannel = this.form.infoChannel.join(',');

      listPetitionWarning({ ...this.form, state }).then((res) => {
        console.log('全部', res.records);
        this.tableData = res.rows;
        this.total = res.total;
        if (this.total === '' || this.form.state === 'all') {
        }
        this.loading = false;
      });
    },

    getCount() {
      getTabNum(this.form.departCode).then((res) => {
        let count = {};
        count = res.data;
        //处理统计数据
        for (let i in this.stateMap) {
          for (let j in count) {
            if (this.stateMap[i].label == j) {
              this.stateMap[i].count = count[j];
            }
          }
        }
      });
    },
    handleDemo() {
      fetch(`/worship/petitionInfo/exportTemplate`, {
        headers: {
          Authorization: sessionStorage.token,
        },
      }).then((res) => {
        res.blob().then((blob) => {
          var a = document.createElement('a');
          var url = window.URL.createObjectURL(blob);
          var filename = '导入模板.xlsx';
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        });
      });
    },
    handleExport() {
      let ids = this.selection.map((e) => e.personId || e.id).join(',');
      if (!ids) {
        this.$message.warning('请选择数据');
        return;
      }
      fetch(`/worship/petitionWarning/export?ids=${ids}`, {
        headers: {
          Authorization: sessionStorage.token,
        },
      }).then((res) => {
        res.blob().then((blob) => {
          var a = document.createElement('a');
          var url = window.URL.createObjectURL(blob);
          var filename = '异动信息.xlsx';
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        });
      });
    },
    addRepeatLetter(row) {
      console.log(row);
      this.showRepeatLetter = true;
      this.activeRow = {
        name: row.name,
        personId: row.personId,
        serialNumber: row.serialNumber,
        parentId: row.id,
      };
    },
    addRepeatSuccess() {
      this.showRepeatLetter = false;
      this.getList();
    },
    editLetter(row) {
      this.showLetterContent = true;
      this.activeRow = row;
    },
    addPeopleSuccess(selection, type) {
      this.showLetterContent = true;
      this.changePeoPleDialog = false;
      console.log(selection);
      this.selectedPeople = selection;
      this.associatedPersonType = type;
    },
    handleAdd(disposeFlag) {
      console.log('disposeFlag', !!disposeFlag);
      this.activeRow = disposeFlag ? { disposeFlag: 1 } : {};
      this.changePeoPleDialog = true;
    },
    openLetterDetail(row) {
      this.activeRow = row;
      this.$router.push({
        name: 'abnormalInfoDetail',
        query: {
          id: row.id,
        },
      });
    },
    addLetterSuccess() {
      this.showLetterContent = false;
      this.getList();
      this.getCount();
      window.dashboardWindow && window.dashboardWindow.postMessage('update', '*');
    },
    handleSelectionChange(val) {
      this.selection = val;
    },
    deleteAll() {
      // let ids = this.selection.map((e) => e.personId || e.id).join(',');
      // if (!ids) {
      //   this.$message.warning('请选择数据');
      //   return;
      // }
      // this.$confirm('确定删除这些数据吗?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning',
      // }).then(() => {
      //   axios.get(`/petitionInfo/deleteSome?ids=` + ids).then((res) => {
      //     this.$message.success('删除成功');
      //     this.getList();
      //   });
      // });
    },
    deleteRow(row) {
      deletePetitionWarning(row.id).then((res) => {
        this.$message.success('删除成功');
        this.getList();
      });
      // axios.get(`/petitionWarning/delete?id=` + row.id).then((res) => {
      //   this.$message.success('删除成功');
      //   this.getList();
      // });
    },
    handleCurrentChange(val) {
      this.form.page = val;
      this.getList();
    },
    handleSizeChange(val) {
      this.form.size = val;
      this.getList();
    },
    subTabClick(vm) {
      console.log(vm.name);
      // if (this.form.state !== 'all') {
      this.total = this.stateMap[this.form.state].count;
      // }
      if (vm.name === '3') {
        this.form.trackState = 1;
        this.form.state = '';
      } else {
        this.form.trackState = '';
      }
      this.getList();
    },
    //导入
    uploadSuccess(data) {
      if (data.code === 500) {
        this.$notify.error({
          title: '错误',
          message: data.msg,
          duration: 0,
        });
        return;
      }
      this.$message.success('导入成功');
      this.query.page = 1;
      this.getList();
    },
    reset() {
      this.form = {
        infoLevel: '',
        infoSource: '',
        infoChannel: [],
        infoType: '',
        keyWord: '',
        trackState: '', //是否追踪
        state: '', // 0:待处理,1:受理中,2：办结 3：已评价
        pageNum: 1,
        pageSize: 30,
        multiple: '',
        lagState: '',
        repeatInfo: '',
      };
      this.searchTime = [];
      this.initParam();
      this.getList();
    },
    submit(row) {
      // row.careDifficultList[0].difficultType = this.checkList;
      // axios({
      //   url: '/careDifficult/add',
      //   method: 'post',
      //   data: row.careDifficultList[0],
      // }).then((res) => {
      //   this.$message.success('操作成功');
      //   this.getList();
      // });
    },
    closePop(row) {
      this.$refs[`popover-${row.id}`].doClose();
    },
    openBatchDifficult(row) {
      this.batchData = JSON.parse(JSON.stringify(row.careDifficultList));
      this.batchDialog = true;
    },
    batchClose() {
      this.batchDialog = false;
      this.getList();
    },
    popoverHide() {
      this.checkList = [];
    },
    //开启追踪
    openRow(row) {
      // // trackState为0未开启 1已开启
      // axios({
      //   url: '/petitionInfo/operationTracking',
      //   method: 'post',
      //   data: { ...row, operation: row.trackState == 0 ? true : false },
      // }).then((res) => {
      //   this.getList();
      //   this.$message.success('操作成功');
      // });
    },
    pageChange(value) {
      this.mainTab = value;
    },
    mainTabClick(vm) {
      this.title = vm.label;
      this.form.page = 1;
      this.mainTab = vm.name;
      this.$router.push({
        query: {
          tab: vm.name,
          title: vm.title,
          subTab: this.$route.query.subTab,
        },
      });
      this.reset();
    },
    // 导出
    toExcelData() {
      let receiveDictValue =
        this.query.receiveDictValue?.length == 2
          ? this.query.receiveDictValue[this.query.receiveDictValue.length - 1]
          : '';

      fetch(
        `/worship/visitStatistics/exportPetitionInfo?departCode=&receiveDictCode=${this.query.receiveDictCode}&peopleCategory=${this.query.peopleCategory}&receiveDictValue=${receiveDictValue}&endDate=${this.query.endDate}&beginDate=${this.query.beginDate}`,
        {
          headers: {
            Authorization: sessionStorage.token,
          },
        }
      ).then((res) => {
        res.blob().then((blob) => {
          var a = document.createElement('a');
          var url = window.URL.createObjectURL(blob);
          var filename = '信访统计.xlsx';
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        });
      });
    },
  },
};
</script>

<style scoped lang="scss">
.sub-title {
}
.el-form-item {
  margin: 6px 0 0 0;
}
.petitionLetter {
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
  .sub {
    .num {
      background: rgba(140, 140, 140, 0.1);
      border-radius: 20px;
      padding: 0 5px;
      height: 20px;
      line-height: 20px;
      font-size: 12px;
      margin-left: 5px;
    }
    :v-deep {
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
    height: calc(100% - 220px);
    background: #fff;
    margin-top: 16px;
    padding: 6px 24px;
    .process {
      &.process1 {
        color: #55c51e;
      }
      &.process2 {
        color: #1890ff;
      }
      &.process3 {
        color: #fc9a22;
      }
      &.process9 {
        color: #ff0909;
      }
    }
    .red {
      color: #ff0909;
    }
    .table-header {
      height: calc(100% - 40px);
    }
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
    button {
      & + span {
        margin: 0 10px;
      }
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
  min-height: 60px;
  padding: 10px 24px;
  ::v-deep {
    .el-form {
      width: 100%;
      display: flex;
      justify-content: space-between;
      .el-form-item {
        margin: 16px 16px 0 0;
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
.right {
  width: 40%;
  display: flex;
  align-items: center;
  .el-input {
    margin: 0 12px 0 0;
  }
}
.el-radio {
  margin: 20px 0 0 0;
}
.pop-btn {
  cursor: pointer;
  text-align: center;
  margin: 20px 0 0 0;
  .submit {
    color: #1890ff;
    margin-left: 20px;
  }
}
.dicff-info {
  cursor: pointer;
  color: #409eff;
}
</style>
<style lang="scss">
.el-popover {
  min-width: 0px;
}
</style>
