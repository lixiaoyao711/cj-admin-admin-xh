<template>
  <div class="lineBox">
    <div class="item">
      <div class="charts" ref="line1"></div>
      <div class="table">
        <div class="table-title">
          <span class="span">同比</span>
          <span>环比</span>
        </div>
        <div class="table-item" v-for="(item, index) in propsData['登记总量'].slice(0, this.month)" :key="index">
          <span>{{ item.monthName }}</span>
          <span v-if="item.yoy !== '--'">{{ Number(item.yoy).toFixed(0) + '%' }}</span>
          <span v-else>{{ item.yoy }}</span>
          <span v-if="item.mom !== '--'">{{ Number(item.mom).toFixed(0) + '%' }}</span>
          <span v-else>{{ item.mom }}</span>
        </div>
      </div>
    </div>
    <div class="item">
      <div class="charts" ref="line2"></div>
      <div class="table">
        <div class="table-title">
          <span class="span">同比</span>
          <span>环比</span>
        </div>
        <div class="table-item" v-for="(item, index) in propsData['信访量'].slice(0, this.month)" :key="index">
          <span>{{ item.monthName }}</span>
          <span v-if="item.yoy !== '--'">{{ Number(item.yoy).toFixed(0) + '%' }}</span>
          <span v-else>{{ item.yoy }}</span>
          <span v-if="item.mom !== '--'">{{ Number(item.mom).toFixed(0) + '%' }}</span>
          <span v-else>{{ item.mom }}</span>
        </div>
      </div>
    </div>
    <div class="item">
      <div class="charts" ref="line3"></div>
      <div class="table">
        <div class="table-title">
          <span class="span">同比</span>
          <span>环比</span>
        </div>
        <div class="table-item" v-for="(item, index) in propsData['咨询量'].slice(0, this.month)" :key="index">
          <span>{{ item.monthName }}</span>
          <span v-if="item.yoy !== '--'">{{ Number(item.yoy).toFixed(0) + '%' }}</span>
          <span v-else>{{ item.yoy }}</span>
          <span v-if="item.mom !== '--'">{{ Number(item.mom).toFixed(0) + '%' }}</span>
          <span v-else>{{ item.mom }}</span>
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
  },
  components: {},
  data() {
    return {
      chart1: null,
      chart2: null,
      chart3: null,
      month: new Date().getMonth() + 1,
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    // this.getList()
    this.initChart1();
    this.initChart2();
    this.initChart3();
    window.addEventListener('resize', this.resizeFunThree);
  },
  methods: {
    getList() {
      axios({
        url: '/visitStatistics/getPetitionTrends',
        method: 'get',
        params: {},
      }).then((res) => {
        console.log(res);
      });
    },

    initChart1() {
      this.chart1 = echarts.init(this.$refs.line1);
      let option = {
        title: {
          text: '登记总量',
          subtext: '',
          textStyle: {
            fontSize: 16,
            color: '#000',
          },
          subtextStyle: {
            fontSize: 12,
            color: '#fff',
          },
          top: '5%',
          right: '5%',
          bottom: '5%',
          left: '5%',
        },
        tooltip: {
          // 鼠标移动上去是否显示信息
          trigger: 'axis',
        },
        // 每列标题
        legend: {
          show: true,
          left: '10%',
          top: '16%',
          zleval: '',
          itemWidth: 25, //图标的宽度类型number
          itemHeight: 14, //图标的高度类型number
          // icon: 'circle',
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '30%',
          containLabel: true, //是否把标题也包括在内
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.propsData['登记总量'].map((item) => item.monthName),
          // 坐标轴轴线相关设置。
          axisLine: {
            show: true,
          },
          // 坐标轴刻度配置
          axisTick: {
            show: true,
          },
          axisLabel: {
            // 坐标轴刻度标签的相关设置。
            interval: 0, // 解决x轴数据显示不完全的bug
            rotate: 0, // 旋转
            color: '#000',
            formatter: (val) => {
              return val;
            },
          },
        },
        yAxis: {
          type: 'value',
          // axisLine: {
          //   // 坐标轴轴线相关设置。
          //   show: true,
          // },
          // axisTick: {
          //   // 坐标轴刻度配置
          //   show: true,
          // },
          // label: {
          // },
          // // y轴背景线是否显示
          // splitLine: { show: true },
          // axisLabel: {
          //   // 坐标轴刻度标签的相关设置。
          //   interval: 0, // 解决x轴数据显示不完全的bug
          //   rotate: 0, // 旋转
          //   color: '#fff',
          //   formatter: val => {
          //     return val;
          //   },
          // },
        },
        // 滑动条型数据区域缩放组件（dataZoomInside）
        dataZoom: [
          {
            show: false,
          },
        ],
        series: [
          {
            color: '#409eff',
            // areaStyle: {},
            showSymbol: true,
            // 数据点的显示与隐藏
            name: '今年',
            type: 'line',
            // 是否重叠
            stack: '',
            // y轴数据显示
            label: {
              show: true,
              // position: 'top',
              // color: '#000',
              formatter: (val) => {
                console.log(val);
              },

              rich: {
                a: {
                  color: 'red',
                  lineHeight: 10,
                  width: 60,
                  height: 60,
                  backgroundColor: '#',
                },
                b: {
                  backgroundColor: {
                    image: 'xxx/xxx.jpg',
                  },
                  height: 40,
                },
                x: {
                  fontSize: 18,
                  fontFamily: 'Microsoft YaHei',
                  borderColor: '#449933',
                  borderRadius: 4,
                },
              },
            },
            data: this.propsData['登记总量'].slice(0, this.month).map((item) => item.thisYearNum),
            // 线条宽度
            barWidth: '',
            // 平均线
            markLine: {
              // 图形是否不响应和触发鼠标事件，默认为 false，即响应和触发鼠标事件。
              silent: true,
              // 平均值
              data: [{ type: 'average', name: '' }],
              itemStyle: {
                normal: {
                  lineStyle: {
                    color: '',
                    opacity: 0, // 平均线透明度设置设置为0为隐藏,1为显示
                  },
                },
              },
              label: {
                formatter: '',
                position: 'insideEndTop', //更多标签位置：'start', 'middle', 'end', 'insideStartTop', 'insideStartBottom', 'insideMiddleTop', 'insideMiddleBottom', 'insideEndTop', 'insideEndBottom'
              },
            },
            areaStyle: {
              opacity: 0.4,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#82B4FF',
                },
                {
                  offset: 1,
                  color: '#fff',
                },
              ]),
            },
          },
          {
            color: '#eaeaea',
            areaStyle: {},
            showSymbol: true,
            // 数据点的显示与隐藏
            name: '去年',
            type: 'line',
            // 是否重叠
            stack: '',
            // y轴数据显示
            label: {
              show: true,
              position: 'top',
              color: '#000',
            },
            data: this.propsData['登记总量'].map((item) => item.lastYearNum),
            // 线条宽度
            barWidth: '',
            // 平均线
            markLine: {
              // 图形是否不响应和触发鼠标事件，默认为 false，即响应和触发鼠标事件。
              silent: true,
              // 平均值
              data: [{ type: 'average', name: '' }],
              itemStyle: {
                normal: {
                  lineStyle: {
                    color: '',
                    opacity: 0, // 平均线透明度设置设置为0为隐藏,1为显示
                  },
                },
              },
              label: {
                formatter: '',
                position: 'insideEndTop', //更多标签位置：'start', 'middle', 'end', 'insideStartTop', 'insideStartBottom', 'insideMiddleTop', 'insideMiddleBottom', 'insideEndTop', 'insideEndBottom'
              },
            },
            areaStyle: {
              opacity: 0.4,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#333',
                },
                {
                  offset: 1,
                  color: '#fff',
                },
              ]),
            },
          },
        ],
      };
      this.chart1.setOption(option);
    },
    initChart2() {
      this.chart2 = echarts.init(this.$refs.line2);
      let option = {
        title: {
          text: '信访量',
          subtext: '',
          textStyle: {
            fontSize: 16,
            color: '#000',
          },
          subtextStyle: {
            fontSize: 12,
            color: '#fff',
          },
          top: '5%',
          right: '5%',
          bottom: '5%',
          left: '5%',
        },
        tooltip: {
          // 鼠标移动上去是否显示信息
          trigger: 'axis',
        },
        // 每列标题
        legend: {
          show: true,
          left: '10%',
          top: '16%',
          zleval: '',
          itemWidth: 25, //图标的宽度类型number
          itemHeight: 14, //图标的高度类型number
          // icon: 'circle',
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '30%',
          containLabel: true, //是否把标题也包括在内
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.propsData['信访量'].map((item) => item.monthName),
          // 坐标轴轴线相关设置。
          axisLine: {
            show: false,
          },
          // 坐标轴刻度配置
          axisTick: {
            show: false,
          },
          axisLabel: {
            // 坐标轴刻度标签的相关设置。
            interval: 0, // 解决x轴数据显示不完全的bug
            rotate: 0, // 旋转
            color: '#000',
            formatter: (val) => {
              return val;
            },
          },
        },
        yAxis: {
          type: 'value',
          // axisLine: {
          //   // 坐标轴轴线相关设置。
          //   show: false,
          // },
          // axisTick: {
          //   // 坐标轴刻度配置
          //   show: false,
          // },
          // // y轴背景线是否显示
          // splitLine: { show: false },
          // axisLabel: {
          //   // 坐标轴刻度标签的相关设置。
          //   interval: 0, // 解决x轴数据显示不完全的bug
          //   rotate: 0, // 旋转
          //   color: '#fff',
          //   formatter: val => {
          //     return val;
          //   },
          // },
        },
        // 滑动条型数据区域缩放组件（dataZoomInside）
        dataZoom: [
          {
            show: false,
          },
        ],
        series: [
          {
            color: 'red',
            areaStyle: {},
            showSymbol: true,
            // 数据点的显示与隐藏
            name: '今年',
            type: 'line',
            // 是否重叠
            stack: '',
            // y轴数据显示
            label: {
              show: true,
              position: 'top',
              color: '#000',
            },
            data: this.propsData['信访量'].slice(0, this.month).map((item) => item.thisYearNum),
            // 线条宽度
            barWidth: '',
            // 平均线
            markLine: {
              // 图形是否不响应和触发鼠标事件，默认为 false，即响应和触发鼠标事件。
              silent: true,
              // 平均值
              data: [{ type: 'average', name: '' }],
              itemStyle: {
                normal: {
                  lineStyle: {
                    color: '',
                    opacity: 0, // 平均线透明度设置设置为0为隐藏,1为显示
                  },
                },
              },
              label: {
                formatter: '',
                position: 'insideEndTop', //更多标签位置：'start', 'middle', 'end', 'insideStartTop', 'insideStartBottom', 'insideMiddleTop', 'insideMiddleBottom', 'insideEndTop', 'insideEndBottom'
              },
            },
            areaStyle: {
              opacity: 0.4,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'red',
                },
                {
                  offset: 1,
                  color: '#fff',
                },
              ]),
            },
          },
          {
            color: '#eaeaea',
            areaStyle: {},
            showSymbol: true,
            // 数据点的显示与隐藏
            name: '去年',
            type: 'line',
            // 是否重叠
            stack: '',
            // y轴数据显示
            label: {
              show: true,
              position: 'top',
              color: '#000',
            },
            data: this.propsData['信访量'].map((item) => item.lastYearNum),
            // 线条宽度
            barWidth: '',
            // 平均线
            markLine: {
              // 图形是否不响应和触发鼠标事件，默认为 false，即响应和触发鼠标事件。
              silent: true,
              // 平均值
              data: [{ type: 'average', name: '' }],
              itemStyle: {
                normal: {
                  lineStyle: {
                    color: '',
                    opacity: 0, // 平均线透明度设置设置为0为隐藏,1为显示
                  },
                },
              },
              label: {
                formatter: '',
                position: 'insideEndTop', //更多标签位置：'start', 'middle', 'end', 'insideStartTop', 'insideStartBottom', 'insideMiddleTop', 'insideMiddleBottom', 'insideEndTop', 'insideEndBottom'
              },
            },
            areaStyle: {
              opacity: 0.4,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#333',
                },
                {
                  offset: 1,
                  color: '#fff',
                },
              ]),
            },
          },
        ],
      };
      this.chart2.setOption(option);
    },
    initChart3() {
      this.chart3 = echarts.init(this.$refs.line3);
      let option = {
        title: {
          text: '咨询量',
          subtext: '',
          textStyle: {
            fontSize: 16,
            color: '#000',
          },
          subtextStyle: {
            fontSize: 12,
            color: '#fff',
          },
          top: '5%',
          right: '5%',
          bottom: '5%',
          left: '5%',
        },
        tooltip: {
          // 鼠标移动上去是否显示信息
          trigger: 'axis',
        },
        // 每列标题
        legend: {
          show: true,
          left: '10%',
          top: '16%',
          zleval: '',
          itemWidth: 25, //图标的宽度类型number
          itemHeight: 14, //图标的高度类型number
          // icon: 'circle',
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '30%',
          containLabel: true, //是否把标题也包括在内
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.propsData['咨询量'].map((item) => item.monthName),
          // 坐标轴轴线相关设置。
          axisLine: {
            show: false,
          },
          // 坐标轴刻度配置
          axisTick: {
            show: false,
          },
          axisLabel: {
            // 坐标轴刻度标签的相关设置。
            interval: 0, // 解决x轴数据显示不完全的bug
            rotate: 0, // 旋转
            color: '#000',
            formatter: (val) => {
              return val;
            },
          },
        },
        yAxis: {
          type: 'value',
          // axisLine: {
          //   // 坐标轴轴线相关设置。
          //   show: false,
          // },
          // axisTick: {
          //   // 坐标轴刻度配置
          //   show: false,
          // },
          // // y轴背景线是否显示
          // splitLine: { show: false },
          // axisLabel: {
          //   // 坐标轴刻度标签的相关设置。
          //   interval: 0, // 解决x轴数据显示不完全的bug
          //   rotate: 0, // 旋转
          //   color: '#fff',
          //   formatter: val => {
          //     return val;
          //   },
          // },
        },
        // 滑动条型数据区域缩放组件（dataZoomInside）
        dataZoom: [
          {
            show: false,
          },
        ],
        series: [
          {
            color: 'green',
            areaStyle: {},
            showSymbol: true,
            // 数据点的显示与隐藏
            name: '今年',
            type: 'line',
            // 是否重叠
            stack: '',
            // y轴数据显示
            label: {
              show: true,
              position: 'top',
              color: '#000',
            },
            data: this.propsData['咨询量'].slice(0, this.month).map((item) => item.thisYearNum),
            // 线条宽度
            barWidth: '',
            // 平均线
            markLine: {
              // 图形是否不响应和触发鼠标事件，默认为 false，即响应和触发鼠标事件。
              silent: true,
              // 平均值
              data: [{ type: 'average', name: '' }],
              itemStyle: {
                normal: {
                  lineStyle: {
                    color: '',
                    opacity: 0, // 平均线透明度设置设置为0为隐藏,1为显示
                  },
                },
              },
              label: {
                formatter: '',
                position: 'insideEndTop', //更多标签位置：'start', 'middle', 'end', 'insideStartTop', 'insideStartBottom', 'insideMiddleTop', 'insideMiddleBottom', 'insideEndTop', 'insideEndBottom'
              },
            },
            areaStyle: {
              opacity: 0.4,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#2CF198',
                },
                {
                  offset: 1,
                  color: '#fff',
                },
              ]),
            },
          },
          {
            color: '#eaeaea',
            areaStyle: {},
            showSymbol: true,
            // 数据点的显示与隐藏
            name: '去年',
            type: 'line',
            // 是否重叠
            stack: '',
            // y轴数据显示
            label: {
              show: true,
              position: 'top',
              color: '#000',
            },
            data: this.propsData['咨询量'].map((item) => item.lastYearNum),
            // 线条宽度
            barWidth: '',
            // 平均线
            markLine: {
              // 图形是否不响应和触发鼠标事件，默认为 false，即响应和触发鼠标事件。
              silent: true,
              // 平均值
              data: [{ type: 'average', name: '' }],
              itemStyle: {
                normal: {
                  lineStyle: {
                    color: '',
                    opacity: 0, // 平均线透明度设置设置为0为隐藏,1为显示
                  },
                },
              },
              label: {
                formatter: '',
                position: 'insideEndTop', //更多标签位置：'start', 'middle', 'end', 'insideStartTop', 'insideStartBottom', 'insideMiddleTop', 'insideMiddleBottom', 'insideEndTop', 'insideEndBottom'
              },
            },
            areaStyle: {
              opacity: 0.4,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#333',
                },
                {
                  offset: 1,
                  color: '#fff',
                },
              ]),
            },
          },
        ],
      };
      this.chart3.setOption(option);
    },
    resizeFunThree() {
      this.chart1.resize();
      this.chart2.resize();
      this.chart3.resize();
    },
  },
};
</script>

<style scoped lang="scss">
.lineBox {
  height: 408px;
  background: #ffffff;
  box-shadow: 0 1.33px 5.33px 0 #0000000f;
  border-radius: 2.67px;
  display: flex;
  .item {
    flex: 1;
    position: relative;
    .charts {
      height: 90%;
      width: 70%;
    }
    .table {
      position: absolute;
      top: 20px;
      right: 20px;
      .table-title {
        width: 132px;
        height: 26px;
        background: #f3f3f3;
        color: #000;
        padding: 0 0 0 50px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        font-size: 12px;
        .span {
          margin: 0 28px 0 0;
        }
      }
      .table-item {
        font-family: PingFangSC-Regular;
        font-weight: 400;
        font-size: 12px;
        color: #333333;
        margin: 10px 0 0 0;
        display: flex;
        span {
          margin: 0 8px;
          display: inline-block;
          width: 30px;
        }
      }
    }
  }
}
</style>
