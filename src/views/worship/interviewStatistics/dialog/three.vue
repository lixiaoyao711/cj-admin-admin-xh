<template>
  <div class="two">
    <div class="left">
      <div class="sub-title">{{ leftTitle }}</div>
      <div class="content">
        <div class="value">{{ propsData['走访频率'] }}<span class="unit">人次</span></div>
        <div class="count">
          <div class="count-left">
            <span class="name">总人数</span>
            <span class="values">{{ propsData['总人数'] }}</span>
          </div>
          <div class="count-right">
            <span class="name">走访次数</span>
            <span class="values">{{ propsData['走访次数'] }}</span>
          </div>
        </div>
        <el-progress
          class="sum"
          :percentage="propsData['走访频率'] * 100"
          :stroke-width="10"
          :show-text="false"
        ></el-progress>
      </div>
    </div>
    <div class="right">
      <div class="sub-title">{{ rightTitle }}</div>
      <div class="content">
        <div class="list">
          <div class="item" v-for="(item, index) in dataList" :key="index">
            <div class="left-box">
              <div class="icon">{{ index + 1 }}</div>
              <div class="name">{{ item.name }}</div>
            </div>
            <div class="right-box">
              <el-progress :format="progress" :percentage="Number(item.count)" :stroke-width="10"></el-progress>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
require('echarts/theme/macarons'); // echarts theme
export default {
  props: {
    propsData: Object,
    query: Object,
  },
  components: {},
  data() {
    return {
      dataList: [],
    };
  },
  computed: {
    leftTitle() {
      const map = {
        3: '全区走访频率',
        4: '镇街走访频率',
        5: '村社区走访频率',
      };
      return this.query.level ? map[this.query.level] : '全区走访频率';
    },
    rightTitle() {
      const map = {
        3: '镇街走访频率',
        4: '村社区走访频率',
        5: '村社区走访频率',
      };
      return this.query.level ? map[this.query.level] : '镇街走访频率';
    },
  },
  watch: {
    propsData() {
      this.dataList = this.propsData['下级走访频率'].sort((a, b) => {
        return b.value - a.value;
      });
    },
  },
  created() {},
  mounted() {
    this.dataList = this.propsData['下级走访频率'].sort((a, b) => {
      return b.value - a.value;
    });
  },
  methods: {
    progress(percentage) {
      return `${percentage.toFixed(4)}次`;
    },
  },
};
</script>

<style scoped lang="scss">
.two {
  display: flex;
  height: 300px;
  .sub-title {
    font-family: PingFangSC-Medium;
    font-weight: 600;
    font-size: 16px;
    color: #000000;
  }
  .left {
    width: 284px;
    background: #ffffff;
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.06);
    border-radius: 2px;
    margin: 0 16px 0 0;
    padding: 20px 24px 26px 24px;
    box-sizing: border-box;

    .content {
      margin: 20px 0 0 0;
      .value {
        font-family: HelveticaNeue-CondensedBold;
        font-weight: CondensedBold;
        font-size: 36px;
        color: rgba(0, 0, 0, 0.85);
        .unit {
          font-family: PingFangSC-Regular;
          font-weight: 400;
          font-size: 12px;
          color: #000000;
          // margin: 0 0 0 6px;
        }
      }
      .count {
        font-family: SFProText-Regular;
        font-weight: 400;
        font-size: 12px;
        color: rgba(0, 0, 0, 0.45);
        margin: 42px 0 0 0;
        .count-left,
        .count-right {
          margin: 12px 0 0 0;
          .name {
            margin: 0 4px 0 0;
          }
        }
      }
      .sum {
        margin: 10px 0 0 0;
      }
    }
  }
  .right {
    flex: 1;
    background: #ffffff;
    padding: 20px 0 36px 24px;
    box-sizing: border-box;
    .content {
      height: 100%;
      overflow: scroll;
      .list {
        display: flex;
        flex-wrap: wrap;
        .item {
          width: 33%;
          display: flex;
          align-items: center;
          margin: 26px 0 0 0;
          // justify-content: space-between;
          .left-box {
            display: flex;
            align-items: center;
            margin: 0 34px 0 0;
            width: 100px;
            .icon {
              width: 18px;
              height: 18px;
              background: #314659;
              border-radius: 30px;
              display: flex;
              justify-content: center;
              align-items: center;
              color: #fff;
              margin: 0 12px 0 0;
            }
            .name {
              font-family: PingFangSC-Regular;
              font-weight: 400;
              font-size: 14px;
              color: #000000;
            }
          }
          .right-box {
            width: 240px;
          }
        }
      }
    }
    .el-progress {
      width: 164px;
    }
  }
}
::v-deep .el-progress-bar__outer {
  border-radius: 0px;
}
::v-deep .el-progress-bar__inner {
  border-radius: 0px;
}
</style>
