<template>
  <div class="petitionStatistics">
    <div class="toolbar">
      <el-form :model="form" ref="form" :inline="true">
        <div class="left">
          <el-form-item label="人员类别:" class="peopleCategory">
            <el-select v-model="peopleCategoryList" multiple collapse-tags @change="getList">
              <el-option label="全部" value=""></el-option>
              <el-option
                v-for="(item, index) in peopleTypeOptions"
                :key="index"
                :label="item.dictLabel"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="退役类别:" prop="infoType">
            <el-cascader
              clearable
              @change="soldierTypeOptionsChange"
              @expand-change="soldierTypeOptionsChange"
              :props="soldierTypeProps"
              v-model="form.receiveDictValue"
              :options="soldierTypeOptions"
            ></el-cascader>
          </el-form-item>

          <el-form-item label="所属镇街:" prop="departCode">
            <el-cascader
              @change="getList"
              :disabled="userinfo.departCode.length > 1"
              :props="{ checkStrictly: true }"
              v-model="form.departCode"
              :options="dictMap.userDistrict"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="时间范围:" prop="departCode">
            <el-date-picker
              @change="getList"
              v-model="searchDate"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
        </div>
      </el-form>
      <div class="right">
        <div>
          <el-button @click="ExportSavePdf('信访统计', nowTime)" size="mini" type="primary">导出总览</el-button>
          <el-button @click="toExcelData" size="mini">导出明细</el-button>
        </div>
      </div>
    </div>
    <div id="pdfCentent">
      <!-- <One v-if="isOpen" :propsData="tableData" /> -->
      <Two v-if="isOpen" class="mt-16" :propsData="tableData" />
      <Three v-if="isOpen" class="mt-16" :propsData="tableData" :query="form" />
      <Four v-if="isOpen" class="mt-16" :propsData="tableData" :query="form" />
      <lineBox v-if="isOpen" class="mt-16" :propsData="tableData"></lineBox>
      <Five v-if="isOpen" class="mt-16" :propsData="tableData" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import One from './petitionStatistics/one';
import Two from './petitionStatistics/two';
import Three from './petitionStatistics/three.vue';
import Four from './petitionStatistics/four';
import lineBox from './petitionStatistics/lineBox.vue';
import Five from './petitionStatistics/five';
export default {
  // props: { form: Object },
  // model: {
  //   prop: 'form',
  // },
  components: { One, Two, Three, Four, Five, lineBox },
  data() {
    return {
      form: {
        departCode: [],
        receiveDictCode: '',
      },
      peopleCategoryList: [],
      peopleTypeOptions: [],
      // 退役军人类别
      soldierTypeOptions: [
        { value: 'retire_cadre_type', label: '退役干部', children: [] },
        {
          value: 'retire_soldier_type',
          label: '退役士兵',
          children: [],
        },
        {
          value: 'restore_soldier_type',
          label: '复原军人',
        },
      ],
      soldierTypeProps: {
        checkStrictly: true,
      },
      tableData: {},
      isOpen: false,
      searchDate: [],
    };
  },
  computed: {
    dictMap() {
      return this.$store.state.dictMap;
    },
    ...mapState(['userinfo']),
  },
  watch: {},
  created() {
    this.form.departCode = this.userinfo.departCode;

    this.getPeopleTypeOptions();
    this.getList();
  },
  updated() {},
  mounted() {},
  methods: {
    //获取人员类别
    getPeopleTypeOptions() {
      axios({
        url: '/retireInfo/getPeopleCate',
        method: 'get',
        params: {},
      }).then((res) => {
        this.peopleTypeOptions = res;
      });
    },
    soldierTypeOptionsChange(val) {
      this.form.receiveDictCode = val[0];
      // 复员军人不需要调用接口查询子数据
      if (val.length === 1 && val[0] !== 'restore_soldier_type') {
        // 查询需要传递receiveDictCode和receiveDictValue两个值
        axios({
          url: '/receiveDict/getReceiveDictByCode',
          method: 'get',
          params: {
            code: val[0],
          },
        }).then((res) => {
          console.log('receiveDict', res);
          this.soldierTypeOptions.map((item) => {
            if (item.value === val[0]) {
              item.children = res;
            }
            return item;
          });
        });
      }
      this.getList();
    },
    // 导出
    toExcelData() {
      let receiveDictValue =
        this.form.receiveDictValue?.length == 2
          ? this.form.receiveDictValue[this.form.receiveDictValue.length - 1]
          : '';

      fetch(
        `/worship/visitStatistics/exportPetitionInfo?departCode=&receiveDictCode=${this.form.receiveDictCode}&peopleCategory=${this.form.peopleCategory}&receiveDictValue=${receiveDictValue}&endDate=${this.form.endDate}&beginDate=${this.form.beginDate}`,
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
    async getList() {
      this.form.beginDate = this?.searchDate?.[0] || '';
      this.form.endDate = this?.searchDate?.[1] || '';
      this.form.peopleCategory = this.peopleCategoryList.join(',');
      let receiveDictValue =
        this.form.receiveDictValue?.length == 2
          ? this.form.receiveDictValue[this.form.receiveDictValue.length - 1]
          : '';

      const loading = this.$loading({
        lock: true,
        text: '拼命加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      });

      await this.getVisitStatisticsPeInfo(receiveDictValue, departCode);
      await this.getPetitionInfoData(receiveDictValue, departCode);
      await this.getPetitionTrends(receiveDictValue, departCode);
      loading.close();
      this.isOpen = true;
      console.log('this.tableData', this.tableData);
    },
    async getVisitStatisticsPeInfo(receiveDictValue) {
      await axios({
        url: '/visitStatistics/getVisitStatisticsPeInfo',
        method: 'get',
        params: Object.assign({}, this.form, {
          receiveDictValue,
        }),
      }).then((res) => {
        console.log(res);
        this.tableData = { ...this.tableData, ...res };
      });
    },
    async getPetitionInfoData(receiveDictValue) {
      await axios({
        url: '/visitStatistics/getPetitionInfoData',
        method: 'get',
        params: Object.assign({}, this.form, {
          receiveDictValue,
        }),
      }).then((ret) => {
        this.tableData = { ...this.tableData, ...ret };
      });
    },
    async getPetitionTrends(receiveDictValue) {
      await axios({
        url: '/visitStatistics/getPetitionTrends',
        method: 'get',
        params: Object.assign({}, this.form, {
          receiveDictValue,
        }),
      }).then((res) => {
        this.tableData = { ...this.tableData, ...res };
      });
    },
  },
};
</script>

<style scoped lang="scss">
.petitionStatistics {
  .count-box {
    background: #fff;
    display: flex;
    align-items: center;
    height: 100px;
    .item,
    .list-item {
      flex: 1;
      padding: 0 94px 0 24px;
      box-sizing: border-box;
      // height: 66px;

      .title {
        font-family: PingFangSC-Regular;
        font-weight: 400;
        font-size: 14px;
        color: #000000;
        margin: 0 0 6px 0;
        width: 100px;
      }
      .value {
        font-family: HelveticaNeue;
        font-size: 30px;
        color: rgba(0, 0, 0, 0.85);
        margin: 0 10px 0 0;
      }
      .unit {
        font-family: PingFangSC-Regular;
        font-weight: 400;
        font-size: 20px;
        color: rgba(0, 0, 0, 0.85);
      }

      .rank {
        margin: 6px 0 0;
      }
      .rank-box {
        width: 360px;
        height: 16px;
        background: #46e391;
        border-radius: 8px;
      }
    }
    .circle-item {
      flex: 1;
      padding: 0 94px 0 24px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      .circle {
        display: flex;
        align-items: center;
        .circle-title {
          margin: 0 0 0 12px;
        }
      }
    }
    .item:not(:last-child) {
      border-right: rgba(0, 0, 0, 0.08) 1px solid;
    }
    .list {
      display: flex;
      .list-item:last-child {
        border-right: rgba(0, 0, 0, 0.08) 1px solid;
      }
    }
  }
  .toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .mt-16 {
    margin: 16px 0 0 0;
  }
  .div-box {
    height: 100vh;
  }
}
</style>
