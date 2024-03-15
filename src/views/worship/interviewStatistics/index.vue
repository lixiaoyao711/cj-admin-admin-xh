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
          <el-form-item label="所属镇街:" prop="departCode">
            <TreeSelectDivision
              v-model="form.divisionCode"
              @treeselectChange="(e) => treeselectChange(e, form, 'divisionCode')"
            ></TreeSelectDivision>
          </el-form-item>
          <el-form-item label="时间范围:" prop="departCode">
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
    </div>
    <One v-if="isOpen" :propsData="tableData" />
    <Two v-if="isOpen" class="mt-16" :propsData="tableData" :query="form" />
    <Three v-if="isOpen" class="mt-16" :propsData="tableData" :query="form" />
    <Four v-if="isOpen" class="mt-16" :propsData="tableData" />
  </div>
</template>

<script>
import One from './dialog/one';
import Two from './dialog/two';
import Three from './dialog/three';
import Four from './dialog/four';
import { getVisitStatisticsCon, getVisitDataAnalysisForStatistics } from '@/api/worship/interviewStatistics';
import Five from './dialog/five';
export default {
  dicts: ['sys_worship_personneltype', 'sys_worship_tuiyijunrenyoufuleibie'],

  // props: { form: Object },
  model: {
    prop: 'form',
  },
  components: { One, Two, Three, Four, Five },
  data() {
    return {
      form: {
        level: undefined,
        divisionCode: undefined,
        receiveDictCode: '',
        personCategory: '',
      },
      // form: {
      //   departCode: [],
      //   receiveDictCode: '',
      //   year: new Date().getFullYear().toString(),
      //   dateType: '1',
      //   date: '',
      // },      // 优抚类别
      categoryMap: [],
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
  created() {},
  mounted() {
    this.searchDate = [new Date(new Date().getFullYear() + '-01-01').getTime(), new Date().getTime()];
    this.getList();
  },
  methods: {
    //获取人员类别
    // getPeopleTypeOptions() {
    //   axios({
    //     url: '/retireInfo/getPeopleCate',
    //     method: 'get',
    //     params: {},
    //   }).then(res => {
    //     this.peopleTypeOptions = res;
    //   });
    // },
    soldierTypeOptionsChange(val) {
      // this.form.receiveDictCode = val[0];
      // // 复员军人不需要调用接口查询子数据
      // if (val.length === 1 && val[0] !== 'restore_soldier_type') {
      //   // 查询需要传递receiveDictCode和receiveDictValue两个值
      //   axios({
      //     url: '/receiveDict/getReceiveDictByCode',
      //     method: 'get',
      //     params: {
      //       code: val[0],
      //     },
      //   }).then((res) => {
      //     console.log('receiveDict', res);
      //     this.soldierTypeOptions.map((item) => {
      //       if (item.value === val[0]) {
      //         item.children = res;
      //       }
      //       return item;
      //     });
      //   });
      // }
      this.getList();
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
      const { data } = await getVisitStatisticsCon(this.form);
      this.tableData = { ...this.tableData, ...data };
      const { data: data1 } = await getVisitDataAnalysisForStatistics(this.form);
      this.tableData = { ...this.tableData, ...data1 };
      console.log('this.tableData', this.tableData);

      loading.close();
      this.isOpen = true;
      // let receiveDictValue =
      //   this.form.receiveDictValue?.length == 2
      //     ? this.form.receiveDictValue[this.form.receiveDictValue.length - 1]
      //     : '';
      // this.form.receiveDictSpeValue && this.form.receiveDictSpeValue != ''
      //   ? (this.form.receiveDictSpeCode = 'pension_person_category')
      //   : (this.form.receiveDictSpeCode = '');
      // let receiveDictSpeValue = this.form.receiveDictSpeValue
      //   ? this.form.receiveDictSpeValue[this.form.receiveDictSpeValue.length - 1]
      //   : '';
      // let departCode = '';
      // const loading = this.$loading({
      //   lock: true,
      //   text: '拼命加载中',
      //   spinner: 'el-icon-loading',
      //   background: 'rgba(0, 0, 0, 0.7)',
      // });
      // axios({
      //   url: '/visitStatistics/getVisitStatisticsCon',
      //   method: 'get',
      //   params: Object.assign({}, this.form, {
      //     departCode,
      //     receiveDictValue,
      //     receiveDictSpeValue,
      //   }),
      // })
      //   .then((res) => {
      //     console.log(res);
      //     this.tableData = res;
      //     axios({
      //       url: '/visitStatistics/getVisitCondolences',
      //       method: 'get',
      //       params: Object.assign({}, this.form, {
      //         departCode,
      //         receiveDictValue,
      //         receiveDictSpeValue,
      //       }),
      //     })
      //       .then((ret) => {
      //         this.tableData = { ...this.tableData, ...ret };
      //         this.isOpen = true;
      //         loading.close();
      //         console.log('this.tableData', this.tableData);
      //       })
      //       .catch((err) => {
      //         loading.close();
      //       });
      //   })
      //   .catch((err) => {
      //     loading.close();
      //   });
    },
    timeChange(val) {
      console.log(val);
      switch (val) {
        case '1':
          this.form.date = '';
          break;
        case '2':
          this.form.date = '1';
          break;
        case '3':
          this.form.date = '3';
          break;
      }
      this.getList();
    },
    treeselectChange(e) {
      this.form.divisionCode = e.weight;
      this.form.level = e.level;
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
  .mt-16 {
    margin: 16px 0 0 0;
  }
}
.year {
  width: 100px;
}
</style>
