<template>
  <div class="two">
    <div class="count-box">
      <div class="list">
        <div class="list-item">
          <div class="title">登记总量</div>
          <span class="value">{{ propsData.petitionInfoNum }}</span>
        </div>
        <div class="list-item">
          <div class="title">重复登记</div>
          <span class="value">{{ propsData.repeatInfoNum }}</span>
        </div>
        <div class="list-item">
          <div class="title">持续跟踪</div>
          <span class="value">{{ propsData.trackingNum }}</span>
        </div>
        <div class="list-item">
          <div class="title">积案</div>
          <span class="value">{{ propsData.accumulationNum }}</span>
        </div>
      </div>
      <div class="item">
        <el-progress
          class="rank"
          :text-inside="true"
          :stroke-width="20"
          :percentage="parseInt((sum === 0 ? 0 : propsData.stateMap['待处理'] / sum) * 100)"
          color="#FF6565"
          :format="format"
        ></el-progress>
        <el-progress
          class="rank"
          :text-inside="true"
          :stroke-width="20"
          :percentage="parseInt((sum === 0 ? 0 : propsData.stateMap['受理中'] / sum) * 100)"
          color="#52ACFF"
          :format="format1"
        ></el-progress>
        <el-progress
          class="rank"
          :text-inside="true"
          :stroke-width="20"
          :percentage="parseInt((sum === 0 ? 0 : propsData.stateMap['已结案'] / sum) * 100)"
          color="#46E391"
          :format="format2"
        ></el-progress>
      </div>
      <div class="circle-item">
        <div class="circle">
          <el-progress
            type="circle"
            :percentage="propsData.infoLevelMap['一般']"
            :stroke-width="10"
            :width="80"
            :format="format3"
          ></el-progress>
          <span class="circle-title">一般</span>
        </div>
        <div class="circle">
          <el-progress
            type="circle"
            :percentage="propsData.infoLevelMap['紧急']"
            :stroke-width="10"
            :width="80"
            color="#FF9C35"
            :format="format3"
          ></el-progress>
          <span class="circle-title">紧急</span>
        </div>
        <div class="circle">
          <el-progress
            type="circle"
            :percentage="propsData.infoLevelMap['特急']"
            :stroke-width="10"
            :width="80"
            color="#FF5454"
            :format="format3"
          ></el-progress>
          <span class="circle-title">特急</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    propsData: Object,
  },
  components: {},
  data() {
    return {};
  },
  computed: {
    sum() {
      return this.propsData.stateMap['待处理'] + this.propsData.stateMap['受理中'] + this.propsData.stateMap['已结案'];
    },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    format(percentage) {
      return `待处理${Object.is(percentage, NaN) ? 0 : percentage}%`;
    },
    format1(percentage) {
      return `待处理${Object.is(percentage, NaN) ? 0 : percentage}%`;
    },
    format2(percentage) {
      return `待处理${Object.is(percentage, NaN) ? 0 : percentage}%`;
    },
    format3(percentage) {
      return `${Object.is(percentage, NaN) ? 0 : percentage}%`;
    },
  },
};
</script>

<style scoped lang="scss">
.two {
  .count-box {
    background: #fff;
    display: flex;
    align-items: center;
    height: 100px;
    .item,
    .list-item {
      flex: 1;
      padding: 0 30px 0 24px;
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
    .list-item:first-child {
      border-right: rgba(0, 0, 0, 0.08) 1px solid;
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
}
::v-deep .el-progress-bar__innerText {
  color: #000;
}
</style>
