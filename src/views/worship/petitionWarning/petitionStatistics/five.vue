<template>
  <div class="five">
    <div class="bar" ref="bar"></div>
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
      bChart: null,
    };
  },
  computed: {},
  watch: {
    propsData() {
      this.initBChart();
    },
  },
  created() {},
  mounted() {
    this.initBChart();
    window.addEventListener('resize', this.resizeFunFive);
  },
  methods: {
    initBChart() {
      this.bChart = echarts.init(this.$refs.bar);
      let option = {
        xAxis: {
          type: 'category',
          data: this.propsData.zjxfbl.map((item) => item.departName),
          axisLine: {
            // 坐标轴轴线相关设置。
            show: true,
          },
          axisTick: {
            // 坐标轴刻度配置
            show: true,
          },
          axisLabel: {
            // 坐标轴刻度标签的相关设置。
            interval: 0, // 解决x轴数据显示不完全的bug
            rotate: 0, // 旋转
            formatter: (val) => {
              return val;
            },
          },
        },
        yAxis: {
          type: 'value',
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
            formatter: (val) => {
              return val;
            },
          },
        },
        // 滑动条型数据区域缩放组件（dataZoomInside）
        dataZoom: [
          {
            show: false,
          },
        ],
        title: {
          text: '镇街信访情况',
          subtext: '',
          textStyle: {
            fontSize: 16,
            color: '',
          },
          subtextStyle: {
            fontSize: 12,
            color: '',
          },
          top: '5%',
          right: '5%',
          bottom: '5%',
          left: '2%',
        },
        legend: {
          show: true,
          right: '5%',
          top: '5%',
          itemWidth: 25, //图标的宽度类型number
          itemHeight: 14, //图标的高度类型number
          icon: '', //circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none
          zleval: '',
        },
        grid: {
          top: '30%',
          right: '5%',
          bottom: '5%',
          left: '3%',
          containLabel: true, //是否把标题也包括在内
        },
        tooltip: {
          // 鼠标移动上去是否显示信息
          show: true,
        },
        series: [
          {
            color: '#5B8FF9',
            name: '越级上访',
            data: this.propsData.zjxfbl.map((item) => item['越级上访']),
            type: 'bar',
            // 线条宽度
            barWidth: '18',
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
            itemStyle: {
              normal: {
                color: '',
                label: {
                  show: true,
                  position: 'top', //支持top / left / right / bottom / inside / insideLeft / insideRight / insideTop / insideBottom / insideTopLeft / insideBottomLeft / insideTopRight / insideBottomRight
                },
              },
            },
          },

          {
            color: '#5D7092',
            name: '总上访',
            data: this.propsData.zjxfbl.map((item) => item['总上访']),
            type: 'bar',
            // 线条宽度
            barWidth: '18',
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
            itemStyle: {
              normal: {
                color: '',
                label: {
                  show: true,
                  position: 'top', //支持top / left / right / bottom / inside / insideLeft / insideRight / insideTop / insideBottom / insideTopLeft / insideBottomLeft / insideTopRight / insideBottomRight
                },
              },
            },
          },
          {
            color: '#5AD8A6',
            name: '重复上访',
            data: this.propsData.zjxfbl.map((item) => item['重复上访']),
            type: 'bar',
            // 线条宽度
            barWidth: '18',
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
            itemStyle: {
              normal: {
                color: '',
                label: {
                  show: true,
                  position: 'top', //支持top / left / right / bottom / inside / insideLeft / insideRight / insideTop / insideBottom / insideTopLeft / insideBottomLeft / insideTopRight / insideBottomRight
                },
              },
            },
          },
        ],
      };
      this.bChart.setOption(option);
    },
    resizeFunFive() {
      this.bChart.resize();
    },
  },
};
</script>

<style scoped lang="scss">
.five {
  height: 355px;
  background: #ffffff;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.06);
  border-radius: 2px;
  .bar {
    width: 100%;
    height: 100%;
  }
}
</style>
