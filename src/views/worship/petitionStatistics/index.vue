<template>
  <div class="petitionStatistics app-container">
    <div class="toolbar">
      <el-form :model="form" ref="form" :inline="true">
        <div class="left">
          <el-form-item label="安置类别:" prop="infoType">
            <el-cascader
              clearable
              @change="soldierTypeOptionsChange"
              v-model="personCategoryList"
              :options="anzhiType"
            ></el-cascader>
          </el-form-item>

          <el-form-item label="所属镇街:" prop="divisionCode">
            <TreeSelectDivision
              v-model="form.divisionCode"
              @treeselectChange="(e) => treeselectChange(e, form, 'divisionCode')"
            ></TreeSelectDivision>
          </el-form-item>
          <el-form-item label="时间范围:" prop="divisionCode">
            <el-date-picker
              @change="getList"
              v-model="searchDate"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
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
import One from './dialog/one';
import Two from './dialog/two';
import Three from './dialog/three.vue';
import Four from './dialog/four';
import lineBox from './dialog/lineBox.vue';
import Five from './dialog/five';
import {
  getPetitionPersonDataStatistics,
  getPetitionInfoDataStatistics,
  getDivisionPetitionInfoData,
  getPetitionTrends,
} from '@/api/worship/petitionStatistics';
export default {
  dicts: ['sys_worship_personneltype'],
  components: { One, Two, Three, Four, lineBox, Five },
  data() {
    return {
      form: {
        receiveDictCode: '',
        beginTime: '',
        endTime: '',
      },
      peopleCategoryList: [],
      personCategoryList: [],
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
    userInfo() {
      return this.$store.state.user;
    },
    anzhiType() {
      return this.$store.getters.anzhiTypeDict;
    },
  },
  watch: {},
  created() {
    this.searchDate = [new Date(new Date().getFullYear() + '-01-01').getTime(), new Date().getTime()];
    this.getList();
  },
  updated() {},
  mounted() {},
  methods: {
    soldierTypeOptionsChange(val) {
      this.getList();
    },
    // 导出
    toExcelData() {
      this.download('/worship/petitionScreen/exportPetitionInfo', this.form, `信访统计${new Date().getTime()}.xlsx`);
    },
    async getList() {
      const loading = this.$loading({
        lock: true,
        text: '拼命加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      this.form.beginTime = this.parseTime(this.searchDate[0], '{y}-{m}-{d}') || '';
      this.form.endTime = this.parseTime(this.searchDate[1], '{y}-{m}-{d}') || '';
      this.form.personCategory = this.personCategoryList?.[1];

      const { data } = await getPetitionPersonDataStatistics(this.form);
      this.tableData = { ...this.tableData, ...data };
      const { data: data2 } = await getPetitionInfoDataStatistics(this.form);
      this.tableData = { ...this.tableData, ...data2 };
      const { data: data3 } = await getPetitionTrends(this.form);
      this.tableData = { ...this.tableData, ...data3 };
      const { data: data4 } = await getDivisionPetitionInfoData(this.form);
      let zjxfbl = [];
      for (const key in data4) {
        if (Object.hasOwnProperty.call(data4, key)) {
          const element = data4[key];
          zjxfbl.push({
            departName: key,
            value: element,
          });
        }
      }
      this.tableData = { ...this.tableData, zjxfbl };
      loading.close();
      this.isOpen = true;

      console.log('this.tableData', this.tableData);
    },
    treeselectChange(e) {
      this.form.divisionCode = e.weight;
      this.getList();
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
