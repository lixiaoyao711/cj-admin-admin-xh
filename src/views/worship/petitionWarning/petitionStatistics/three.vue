<template>
  <div class="three">
    <div class="item pie-box">
      <div class="pie-count">
        <div class="count-item" @click="toPath('petitionLetter', '')">
          <duv class="count-item-title"> 登记人数 </duv>
          <div class="count-item-value">
            <div class="number">{{ propsData.petitionInfoPersonNum }}</div>
            <div class="unit">人</div>
          </div>
        </div>
        <div class="count-item" @click="toPath('petitionLetter', '1')">
          <duv class="count-item-title"> 重复访人数 </duv>
          <div class="count-item-value">
            <div class="number">{{ propsData.repeatInfoPersonNum }}</div>
            <div class="unit">人</div>
          </div>
        </div>
      </div>
      <div class="pie" ref="pie"></div>
    </div>
    <div class="item">
      <div class="bar" ref="bar"></div>
    </div>
    <div class="rank">
      <div class="title">信访咨询渠道</div>
      <div class="list">
        <div class="list-item" v-for="(item, index) in rankList" :key="index">
          <div class="left">
            <div class="icon">{{ index + 1 }}</div>
            <div class="name">{{ item.name }}</div>
          </div>
          <div class="text">
            <!-- <el-progress :percentage="(item.value * 100).toFixed(2)"></el-progress> -->
            <div class="rank-box">
              <div class="ranks" :style="{ width: ((item.count / rankSum) * 100).toFixed(2) + '%' }"></div>
            </div>
            <div class="number">{{ item.count }}</div>
            <div class="percentage">{{ ((item.count / rankSum) * 100).toFixed(2) }}%</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    propsData: Object,
    query: Object,
  },
  components: {},
  data() {
    return {
      chart: null,
      pChart: null,
      bChart: null,
      barList: [],
      rankList: [],
      rankSum: 0,
    };
  },
  computed: {},
  watch: {
    propsData() {
      this.rankList = this.propsData.infoChannelList.sort((a, b) => {
        return b.value - a.value;
      });
      this.rankSum = this.rankList.reduce((cur, next) => cur + next.count, 0);

      this.initPCharts();
      this.initBChart();
      this.getList();
    },
  },
  created() {},
  mounted() {
    this.rankList = this.propsData.infoChannelList.sort((a, b) => {
      return b.value - a.value;
    });
    this.rankSum = this.rankList.reduce((cur, next) => cur + next.count, 0);

    this.getList();
    this.initBChart();
    window.addEventListener('resize', this.resizeFunThree);
  },
  methods: {
    getList() {
      let receiveDictValue =
        this.query.receiveDictValue?.length == 2
          ? this.query.receiveDictValue[this.query.receiveDictValue.length - 1]
          : '';
      axios({
        url: '/visitStatistics/getPeInfoPeopleCate',
        method: 'get',
        params: Object.assign({}, this.form, {
          receiveDictValue,
        }),
      }).then((res) => {
        for (const item in res) {
          let obj = {
            name: item,
            value: res[item][0],
          };
          this.barList.push(obj);
        }
        console.log('visitStatistics', this.barList);
        this.initPCharts();
      });
    },
    initChart() {
      this.chart = echarts.init(this.$refs.line);
      let option = {
        title: {
          text: '信访件趋势',
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
          left: '5%',
          top: '15%',
          zleval: '',
          itemWidth: 25, //图标的宽度类型number
          itemHeight: 14, //图标的高度类型number
          // icon: 'circle',
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true, //是否把标题也包括在内
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
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
          axisLine: {
            // 坐标轴轴线相关设置。
            show: false,
          },
          axisTick: {
            // 坐标轴刻度配置
            show: false,
          },
          // y轴背景线是否显示
          splitLine: { show: false },
          axisLabel: {
            // 坐标轴刻度标签的相关设置。
            interval: 0, // 解决x轴数据显示不完全的bug
            rotate: 0, // 旋转
            color: '#fff',
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
        series: [
          {
            color: '#409eff',
            areaStyle: {},
            // showSymbol: false,
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
            data: this.propsData.xfjqs[2022],
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
                  color: '#fff',
                },
                {
                  offset: 1,
                  color: '#82B4FF',
                },
              ]),
            },
          },
          {
            color: '#eaeaea',
            areaStyle: {},
            // showSymbol: false,
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
            data: this.propsData.xfjqs[2021],
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
                  color: '#fff',
                },
                {
                  offset: 1,
                  color: '#333',
                },
              ]),
            },
          },
        ],
      };
      this.chart.setOption(option);
    },
    toPath(path, value) {
      this.$router.push({
        name: path,
        query: {
          repeatInfo: value,
        },
      });
    },
    resizeFunThree() {
      this.chart.resize();
      this.pChart.resize();
      this.bChart.resize();
    },
    // 初始化饼图
    // initPCharts() {
    //   this.pChart = echarts.init(this.$refs.pie);
    //   // --------------------给饼图设置渐变颜色--------------------------
    //   // let colorMap = {
    //   //     烟雾数: new this.$echarts.graphic.LinearGradient(0, 0, 1, 1, [
    //   //         { offset: 0, color: '#F77392' },
    //   //         { offset: 1, color: '#EC3F59' },
    //   //     ]),
    //   //     燃气数: new this.$echarts.graphic.LinearGradient(0, 0, 1, 1, [
    //   //         { offset: 0, color: '#F8DC77' },
    //   //         { offset: 1, color: '#E5981D' },
    //   //     ]),
    //   //     电力数: new this.$echarts.graphic.LinearGradient(0, 0, 1, 1, [
    //   //         { offset: 0, color: '#56BFFD' },
    //   //         { offset: 1, color: '#2B8BF9' },
    //   //     ]),
    //   //     其他: new this.$echarts.graphic.LinearGradient(0, 0, 1, 1, [
    //   //         { offset: 0, color: '#53DEC4' },
    //   //         { offset: 1, color: '#29BA91' },
    //   //     ]),
    //   // };
    //   // let color = this.pieData.map(e => {
    //   //     console.log(colorMap[e.name]);
    //   //     return colorMap[e.name];
    //   // });

    //   this.pChart.setOption({
    //     title: {
    //       show: true,
    //       text: '信访人员画像',
    //       subtext: '',
    //       textStyle: {
    //         fontSize: 16,
    //         color: '',
    //       },
    //       subtextStyle: {
    //         color: '',
    //         fontSize: 16,
    //       },
    //       top: '5%',
    //       right: '5%',
    //       bottom: '5%',
    //       left: '5%',
    //     },
    //     tooltip: {
    //       trigger: 'item',
    //     },
    //     legend: {
    //       top: '20%',
    //       type: 'scroll',
    //       // right: '30%',
    //       left: '50%',
    //       bottom: '5%',
    //       // left: '5%',

    //       orient: 'vertical', //图例列表的布局朝向。horizontal横排,vertical竖排
    //       icon: 'circle', //'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'
    //       fontSize: '12',
    //       // formatter: '{a|ihohi}',
    //       formatter: val => {
    //         return `${val}     ${this.barList.filter(item => item.name === val)[0].value}`;
    //       },
    //       textStyle: {
    //         width: 200,
    //       },
    //     },
    //     series: [
    //       {
    //         // name: '访问来源',
    //         type: 'pie',
    //         //调整圆角
    //         radius: ['45%', '70%'],
    //         //调整位置
    //         center: ['26%', '56%'],
    //         //图表文字显示
    //         label: {
    //           show: true,
    //           position: 'inner', //outside饼图扇区外侧，通过视觉引导线连到相应的扇区inside饼图扇区内部center在饼图中心位置。
    //           formatter: val => {
    //             return `${val.percent}%`;
    //           },
    //         },
    //         //鼠标移动上去显示标题,标题的内容根据label的formatter显示
    //         emphasis: {
    //           label: {
    //             show: true,
    //             fontSize: '19',
    //             fontWeight: 'bold',
    //             formatter: `{d}%`,
    //           },
    //         },
    //         labelLine: {
    //           show: false,
    //         },
    //         data: this.barList,
    //         left: '0%',
    //         right: '5%',
    //       },
    //     ],
    //   });
    // },
    initPCharts() {
      this.pChart = echarts.init(this.$refs.pie);
      // --------------------给饼图设置渐变颜色--------------------------
      // let colorMap = {
      //     烟雾数: new this.$echarts.graphic.LinearGradient(0, 0, 1, 1, [
      //         { offset: 0, color: '#F77392' },
      //         { offset: 1, color: '#EC3F59' },
      //     ]),
      //     燃气数: new this.$echarts.graphic.LinearGradient(0, 0, 1, 1, [
      //         { offset: 0, color: '#F8DC77' },
      //         { offset: 1, color: '#E5981D' },
      //     ]),
      //     电力数: new this.$echarts.graphic.LinearGradient(0, 0, 1, 1, [
      //         { offset: 0, color: '#56BFFD' },
      //         { offset: 1, color: '#2B8BF9' },
      //     ]),
      //     其他: new this.$echarts.graphic.LinearGradient(0, 0, 1, 1, [
      //         { offset: 0, color: '#53DEC4' },
      //         { offset: 1, color: '#29BA91' },
      //     ]),
      // };
      // let color = this.pieData.map(e => {
      //     console.log(colorMap[e.name]);
      //     return colorMap[e.name];
      // });
      let data = [
        { value: Number(this.propsData.infoSourceMap['国家级'][0]), name: '国家级' },
        { value: Number(this.propsData.infoSourceMap['省级'][0]), name: '省级' },
        { value: Number(this.propsData.infoSourceMap['市级'][0]), name: '市级' },
        { value: Number(this.propsData.infoSourceMap['区级及以下'][0]), name: '区级及以下' },
      ];
      this.pChart.setOption({
        color: ['#F6BD16', '#667898', '#5AD8A6', '#5B8FF9'],
        title: {
          show: true,
          text: '登记级别',
          subtext: '',
          textStyle: {
            fontSize: 16,
            color: '',
          },
          subtextStyle: {
            color: '',
            fontSize: 16,
          },
          top: '0%',
          right: '5%',
          bottom: '5%',
          left: '5%',
        },
        tooltip: {
          trigger: 'item',
        },
        legend: {
          top: '30%',
          right: '26%',
          bottom: '5%',
          // left: '5%',

          orient: 'vertical', //图例列表的布局朝向。horizontal横排,vertical竖排
          icon: 'circle', //'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'
          fontSize: '12',
          // formatter: '{a|ihohi}',
          formatter: (val) => {
            return `${val}       ${data.filter((item) => item.name === val)[0].value}`;
          },
          textStyle: {},
        },
        series: [
          {
            // name: '访问来源',
            type: 'pie',
            //调整圆角
            radius: ['45%', '70%'],
            //调整位置
            center: ['26%', '50%'],
            //图表文字显示
            label: {
              show: true,
              position: 'inner', //outside饼图扇区外侧，通过视觉引导线连到相应的扇区inside饼图扇区内部center在饼图中心位置。
              formatter: '{d}%',
            },
            //鼠标移动上去显示标题,标题的内容根据label的formatter显示
            emphasis: {
              label: {
                show: true,
                fontSize: '19',
                fontWeight: 'bold',
              },
            },
            labelLine: {
              show: false,
            },
            data: data,
            left: '0%',
            right: '5%',
          },
        ],
      });
    },

    initBChart() {
      this.bChart = echarts.init(this.$refs.bar);

      let sum = this.propsData.infoTypeList.reduce((cout, next) => cout + next.count, 0);
      let option = {
        color: '#6395fa',
        xAxis: {
          type: 'category',
          data: this.propsData.infoTypeList.map((item) => item.name),
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
        yAxis: [
          {
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
          {
            type: 'value',
            name: '',
            min: 0,
            max: 100,
            interval: 20,
            splitLine: { show: false },
            axisLabel: {
              formatter: '{value} %',
            },
            axisLine: {
              lineStyle: {
                color: '#000', //纵坐标轴和字体颜色
                width: 2,
              },
            },
          },
        ],
        // 滑动条型数据区域缩放组件（dataZoomInside）
        dataZoom: [
          {
            show: false,
          },
        ],
        title: {
          text: '登记目的',
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
          left: '5%',
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
          left: '5%',
          containLabel: true, //是否把标题也包括在内
        },
        tooltip: {
          // 鼠标移动上去是否显示信息
          show: true,
        },
        series: [
          {
            color: '#5D7092',
            name: '件数',
            data: this.propsData.infoTypeList.map((item) => item.count),
            type: 'bar',
            // 线条宽度
            barWidth: '22px',
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
                  formatter: (val) => {
                    console.log(val);
                    return `${val.value} (${((val.value / sum) * 100).toFixed(2)}%)`;
                  },
                  show: true,
                  position: 'top', //支持top / left / right / bottom / inside / insideLeft / insideRight / insideTop / insideBottom / insideTopLeft / insideBottomLeft / insideTopRight / insideBottomRight
                },
              },
            },
          },
          // {
          //   color: '#FFC376',
          //   name: '占比',
          //   data: this.propsData.infoTypeList.map(item => ((item.count / sum) * 100).toFixed(2)),
          //   type: 'bar',
          //   // 线条宽度
          //   barWidth: '22px',
          //   // 平均线
          //   markLine: {
          //     // 图形是否不响应和触发鼠标事件，默认为 false，即响应和触发鼠标事件。
          //     silent: true,
          //     // 平均值
          //     data: [{ type: 'average', name: '' }],
          //     itemStyle: {
          //       normal: {
          //         lineStyle: {
          //           color: '',
          //           opacity: 0, // 平均线透明度设置设置为0为隐藏,1为显示
          //         },
          //       },
          //     },
          //     label: {
          //       formatter: '',
          //       position: 'insideEndTop', //更多标签位置：'start', 'middle', 'end', 'insideStartTop', 'insideStartBottom', 'insideMiddleTop', 'insideMiddleBottom', 'insideEndTop', 'insideEndBottom'
          //     },
          //   },
          //   itemStyle: {
          //     normal: {
          //       color: '',
          //       label: {
          //         show: true,
          //         formatter: val => {
          //           return `${val.value}%`;
          //         },
          //         position: 'top', //支持top / left / right / bottom / inside / insideLeft / insideRight / insideTop / insideBottom / insideTopLeft / insideBottomLeft / insideTopRight / insideBottomRight
          //       },
          //     },
          //   },
          // },
        ],
      };
      this.bChart.setOption(option);
    },
  },
};
</script>

<style scoped lang="scss">
.three {
  display: flex;
  justify-content: space-between;
  .item {
    flex: 1;
    height: 400px;
    background: #ffffff;
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.06);
    border-radius: 2px;

    .line {
      width: 100%;
      height: 100%;
    }
    .pie {
      width: 100%;
      height: 100%;
    }
    .bar {
      width: 100%;
      height: 100%;
    }
  }
  .pie-box {
    position: relative;
    .pie {
      width: 100%;
      height: 60%;
      margin: 160px 0 0 0;
    }
    .pie-count {
      display: flex;
      margin: 26px 0 0 0;
      position: absolute;
      width: 100%;
      .count-item {
        flex: 1;
        padding: 0 0 0 30px;
        box-sizing: border-box;
        cursor: pointer;
        .count-item-title {
          font-family: PingFangSC-Regular;
          font-weight: 400;
          font-size: 18.67px;
          color: #000000;
        }
        .count-item-value {
          display: flex;
          .number {
            font-family: HelveticaNeue;
            font-size: 40px;
            color: #1890ff;
            margin: 18px 10px 0 0;
            border-bottom: 1px solid #1890ff;
          }
          .unit {
            font-family: PingFangSC-Regular;
            font-weight: 400;
            font-size: 26.67px;
            color: #000000d9;
            align-self: flex-end;
          }
        }
      }
      .count-item:first-child {
        border-right: 1px solid rgba(0, 0, 0, 0.08);
      }
    }
  }
  .item:not(:last-child) {
    margin: 0 16px 0 0;
  }
  .rank {
    flex: 1;
    height: 400px;
    background: #ffffff;
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.06);
    border-radius: 2px;
    // margin: 0 16px 0 0;
    padding: 20px 0px 38px 0px;
    box-sizing: border-box;
    overflow: scroll;
    .title {
      font-family: PingFangSC-Medium;
      font-weight: 600;
      font-size: 16px;
      color: rgba(0, 0, 0, 0.85);
      margin: 0 0 0 27px;
    }
    .list {
      margin: 0 0 0 27px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .list-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 24px 0 0 0;
        width: 100%;
        .left {
          display: flex;
          align-items: center;
          // width: 100%;
          flex: 1;
          .icon {
            width: 18px;
            height: 18px;
            background: #1890ff;
            color: #fff;
            border-radius: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0 12px 0 0;
          }
          .name {
            font-family: PingFangSC-Regular;
            font-weight: 400;
            font-size: 14px;
            color: #000000;
          }
        }
        .text {
          width: 70%;
          display: flex;
          .rank-box {
            width: 200px;
            height: 13.33px;
            background: #f0f0f0;
            .ranks {
              height: 13.33px;
              background: #5b8ff9d9;
            }
          }
          .number {
            margin: 0 32px;
            width: 30px;
          }
        }
      }
    }
  }
}
</style>
