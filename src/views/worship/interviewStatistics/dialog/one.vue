<template>
  <div class="one">
    <div class="count-box">
      <div class="item" v-for="(item, index) in listData" :key="index">
        <div class="title">
          <div class="icon" :style="{ background: item.color }"></div>
          <span>{{ item.name }}</span>
        </div>
        <div>
          <span class="value">{{ item.value }}</span>
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
      listData: [],
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
      this.listData = [
        {
          name: '总人数',
          value: this.propsData.totalNum,
        },
        {
          name: '退役军人',
          value: this.propsData.retireNum,
          color: '#5AD8A6',
        },
        {
          name: '困难人员',
          value: this.propsData.difficultNum,
          color: '#1890FF',
        },
        {
          name: '三色人员',
          value: this.propsData.colorNum,
          color: '#000000',
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
        display: flex;
        align-items: center;
        .icon {
          width: 6.25px;
          height: 6px;
          // background: #5ad8a6;
          border-radius: 30px;
          margin: 0 8px 0 0;
        }
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
