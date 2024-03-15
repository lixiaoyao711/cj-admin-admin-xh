<template>
  <div class="one">
    <div class="count-box">
      <div class="item" v-for="(item, index) in tableData" :key="index">
        <div class="title">{{ item.name }}</div>
        <div>
          <span class="value">{{ item.value }}</span>
          <span class="unit">{{ item.unit }}</span>
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
    return {
      tableData: [
        {
          name: '信访总量',
          value: 0,
          unit: '次',
        },
        {
          name: '信访人数',
          value: 0,
          unit: '人',
        },
        {
          name: '回访人次',
          value: 0,
          unit: '人次',
        },
        {
          name: '活跃人员',
          value: 0,
          unit: '人',
        },
        {
          name: '稳定人员',
          value: 0,
          unit: '人',
        },
        {
          name: '化解人员',
          value: 0,
          unit: '人',
        },
      ],
    };
  },
  computed: {},
  watch: {
    propsData() {
      this.getList();
    },
  },
  created() {},
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      this.tableData = [
        {
          name: '信访总量',
          value: this.propsData.petitionInfoNum,
          unit: '次',
        },
        {
          name: '信访人数',
          value: this.propsData.xfrs,
          unit: '人',
        },
        {
          name: '回访人次',
          value: this.propsData.hfrs,
          unit: '人次',
        },
        {
          name: '活跃人员',
          value: this.propsData.activeCount,
          unit: '人',
        },
        {
          name: '稳定人员',
          value: this.propsData.stableCount,
          unit: '人',
        },
        {
          name: '化解人员',
          value: this.propsData.toResolveCount,
          unit: '人',
        },
      ];
    },
  },
};
</script>

<style scoped lang="scss">
.one {
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
}
</style>
