<template>
  <div class="four">
    <div class="item">
      <div class="pie" ref="pie"></div>
    </div>
    <div class="item">
      <div class="bar" ref="bar"></div>
      <div class="backPeople">
        回访
        <span class="backPeople-number">
          {{ this.propsData.activeVisitCount + this.propsData.stableVisitCount + this.propsData.toResolveVisitCount }}
        </span>
        人次
      </div>
    </div>
    <div class="rank">
      <div class="title">访源状态</div>
      <div class="list">
        <div class="list-item" @click="toPath(item)" v-for="(item, index) in rankList" :key="index">
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
      bChart: null,
      pChart: null,
      rankList: [],
      barList: [],
      rankSum: 0,
    };
  },
  computed: {},
  watch: {
    propsData() {
      this.rankList = this.propsData.colorMark.sort((a, b) => {
        return b.value - a.value;
      });
      this.rankSum = this.rankList.reduce((cur, next) => cur + next.count, 0);

      this.initBChart();
      this.getList();
    },
  },
  created() {},
  mounted() {
    this.rankList = this.propsData.colorMark.sort((a, b) => {
      return b.value - a.value;
    });
    this.rankSum = this.rankList.reduce((cur, next) => cur + next.count, 0);

    this.initBChart();
    this.getList();
    window.addEventListener('resize', this.resizeFunFour);
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
        params: Object.assign({}, this.query, {
          receiveDictValue,
        }),
      }).then((res) => {
        console.log(res);
        this.barList = res.map((item) => {
          item.value = item.count;
          return item;
        });
        console.log('visitStatistics', this.barList);
        this.initPCharts();
      });
    },
    toPath(row) {
      //跳转对应的路由
      let map = {
        活跃人员: 0,
        稳定人员: 1,
        化解人员: 2,
        未标记: 4,
      };
      console.log(map[row.name]);

      if (map[row.name] < 3) {
        this.$router.push({
          name: 'interview',
          query: {
            tab: String(map[row.name] + 1),
          },
        });
      } else {
        this.$router.push({
          name: 'maintenancePersonnelList',
          query: {
            colorMark: '0',
          },
        });
      }
    },
    initBChart() {
      this.bChart = echarts.init(this.$refs.bar);
      let option = {
        color: '#6395fa',
        xAxis: {
          type: 'category',
          data: ['活跃人员', '稳定人员', '化解人员'],
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
            min: 0,
            max: 100,
            interval: 20,
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
          text: '访源走访联系情况',
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
          top: '10%',
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
            color: '#5B8FF9',
            name: '人次',
            data: [
              this.propsData.activeVisitCount,
              this.propsData.stableVisitCount,
              this.propsData.toResolveVisitCount,
            ],
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
                  show: true,
                  position: 'top', //支持top / left / right / bottom / inside / insideLeft / insideRight / insideTop / insideBottom / insideTopLeft / insideBottomLeft / insideTopRight / insideBottomRight
                },
              },
            },
          },
          {
            color: '#FFC376',
            name: '走访覆盖率',
            data: [
              this.propsData.activeVisitProp * 100,
              this.propsData.stableVisitProp * 100,
              this.propsData.toResolveVisitProp * 100,
            ],
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
                  show: true,
                  formatter: (val) => {
                    return `${val.value}%`;
                  },
                  position: 'top', //支持top / left / right / bottom / inside / insideLeft / insideRight / insideTop / insideBottom / insideTopLeft / insideBottomLeft / insideTopRight / insideBottomRight
                },
              },
            },
          },
        ],
      };
      this.bChart.setOption(option);
    },

    resizeFunFour() {
      this.bChart.resize();
      this.pChart.resize();
    },
    // 初始化饼图
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
      let data = this.barList;
      this.pChart.setOption({
        color: ['#F6BD16', '#667898', '#5AD8A6', '#5B8FF9'],
        title: {
          show: true,
          text: '人员类别',
          subtext: '',
          textStyle: {
            fontSize: 16,
            color: '',
          },
          subtextStyle: {
            color: '',
            fontSize: 16,
          },
          top: '5%',
          right: '5%',
          bottom: '5%',
          left: '5%',
        },
        tooltip: {
          trigger: 'item',
        },
        legend: {
          top: '40%',
          right: '6%',
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
            center: ['36%', '56%'],
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
  },
};
</script>

<style scoped lang="scss">
.four {
  display: flex;
  justify-content: space-between;
  .item {
    flex: 1;
    height: 370px;
    background: #ffffff;
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.06);
    border-radius: 2px;
    // margin: 0 16px 0 0;
    position: relative;

    .bar {
      width: 100%;
      height: 100%;
    }

    .backPeople {
      font-family: PingFangSC-Regular;
      font-weight: 400;
      font-size: 18.67px;
      color: #000000;
      position: absolute;
      right: 10px;
      top: 10px;
      .backPeople-number {
        font-family: HelveticaNeue;
        font-size: 21.33px;
        color: #000000d9;
      }
    }
    .pie {
      width: 100%;
      height: 100%;
    }
  }

  .item:not(:last-child) {
    margin: 0 16px 0 0;
  }
  .rank {
    flex: 1;
    height: 370px;
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
        cursor: pointer;
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
              width: 60px;
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
