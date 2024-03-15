<template>
  <div class="four">
    <div class="left"><div class="pie" ref="pie"></div></div>
    <div class="center">
      <div class="title">走访方式</div>
      <div class="content">
        <div class="rank">
          <el-progress
            type="circle"
            :percentage="parseInt(propsData.visitMethodMap['电话走访'][1] * 100)"
            :stroke-width="16"
          ></el-progress>
          <div class="data">
            <div class="name">电话走访</div>
            <div class="value">{{ propsData.visitMethodMap['电话走访'][0] }}人</div>
          </div>
        </div>
        <div class="rank">
          <el-progress
            type="circle"
            :percentage="parseInt(propsData.visitMethodMap['实地走访'][1] * 100)"
            color="#1CB8D7"
            :stroke-width="16"
          ></el-progress>
          <div class="name">实地走访</div>
          <div class="value">{{ propsData.visitMethodMap['实地走访'][0] }}人</div>
        </div>
      </div>
    </div>
    <div class="right"><div class="pie" ref="pie1"></div></div>
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
      pChart: null,
      pChart1: null,
      barList: [],
    };
  },
  computed: {},
  watch: {
    propsData() {
      this.barList = [];
      this.initPCharts();
      // this.initPCharts1();
      this.getList();
    },
  },
  created() {},
  mounted() {
    this.initPCharts();
    this.getList();
    window.addEventListener('resize', this.resizePFun);
  },
  methods: {
    getList() {
      for (const item in this.propsData.visitTypeMap) {
        let obj = {
          name: item,
          value: this.propsData.visitTypeMap[item][0],
        };
        this.barList.push(obj);
      }
      this.initPCharts1();
    },
    // 初始化饼图
    //随机生成颜色
    handleColors() {
      let color = '';
      let r = Math.floor(Math.random() * 256);
      let g = Math.floor(Math.random() * 256);
      let b = Math.floor(Math.random() * 256);
      color = `rgb(${r},${g},${b})`;
      return color; //所有方法的拼接都可以用ES6新特性`其他字符串{$变量名}`替换
    },
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
        { value: this.propsData.ageMap['30-45岁'][0], name: '30岁以下' },
        { value: this.propsData.ageMap['30岁以下'][0], name: '30-45岁' },
        { value: this.propsData.ageMap['45-60岁'][0], name: '45-60岁' },
        { value: this.propsData.ageMap['60岁以上'][0], name: '60岁以上' },
      ];
      this.pChart.setOption({
        color: ['#5B8FF9', '#5AD8A6', '#667898', '#F6BD16'],
        title: {
          show: true,
          text: '走访年龄段',
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
          top: '30%',
          right: '14%',
          bottom: '5%',
          // left: '5%',

          orient: 'vertical', //图例列表的布局朝向。horizontal横排,vertical竖排
          icon: 'circle', //'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'
          fontSize: '12',
          // formatter: '{a|ihohi}',
          formatter: (val) => {
            return `${val}     ${data.filter((item) => item.name === val)[0].value}`;
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
            center: ['40%', '56%'],
            //图表文字显示
            label: {
              show: true,
              position: 'inner', //outside饼图扇区外侧，通过视觉引导线连到相应的扇区inside饼图扇区内部center在饼图中心位置。
              formatter: `{d}%`,
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
            data,
            left: '0%',
            right: '5%',
          },
        ],
      });
    },
    resizePFun() {
      this.pChart.resize();
      this.pChart1.resize();
    },
    // 初始化饼图
    initPCharts1() {
      this.pChart1 = echarts.init(this.$refs.pie1);
      let data = this.barList;
      this.pChart1.setOption({
        color: [
          '#C34760',
          '#CD70F2',
          '#923729',
          '#FAB87C',
          '#B59345',
          '#9BBD91',
          '#E23C09',
          '#FD4539',
          '#386694',
          '#6A80D5',
          '#136770',
          '#2A94C4',
          '#361386',
          '#F508B6',
          '#539D43',
          '#A5D359',
          '#B64CF3',
          '#E4C292',
          '#35D211',
          '#A225B9',
        ],
        title: {
          show: true,
          text: '走访类型',
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
          // type: 'scroll',
          top: '6%',
          right: '10%',
          bottom: '10%',
          // left: '5%',

          orient: 'vertical', //图例列表的布局朝向。horizontal横排,vertical竖排
          icon: 'circle', //'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'
          fontSize: '12',
          // formatter: '{a|ihohi}',
          formatter: (val) => {
            return `${val}     ${data.filter((item) => item.name === val)[0].value}`;
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
            center: ['26%', '56%'],
            //图表文字显示
            label: {
              show: true,
              position: 'inner', //outside饼图扇区外侧，通过视觉引导线连到相应的扇区inside饼图扇区内部center在饼图中心位置。
              formatter: `{d}%`,
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
            data: this.barList,
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
  .left {
    // flex: 1;
    width: 30%;
    height: 272px;
    background: #ffffff;
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.06);
    border-radius: 2px;
    .bar {
      width: 100%;
      height: 100%;
    }
    .pie {
      width: 100%;
      height: 100%;
    }
  }
  // .item:not(:last-child) {
  //   margin: 0 16px 0 0;
  // }
  .center {
    // flex: 1;
    width: 30%;

    height: 272px;
    background: #ffffff;
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.06);
    border-radius: 2px;
    // margin: 0 16px 0 0;
    padding: 20px 40px;
    box-sizing: border-box;
    .title {
      font-family: PingFangSC-Medium;
      font-weight: 600;
      font-size: 16px;
      color: rgba(0, 0, 0, 0.85);
    }
    .content {
      display: flex;
      // justify-content: space-between;
      justify-content: space-around;
      margin: 36px 0 0 0;
      .rank {
        text-align: center;
        .data {
          font-family: PingFangSC-Regular;
          font-weight: 400;
          font-size: 14px;
          color: rgba(0, 0, 0, 0.85);
        }
      }
    }
  }
  .right {
    // flex: 1;
    width: 38%;
    height: 272px;
    background: #ffffff;
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.06);
    border-radius: 2px;
    .bar {
      width: 100%;
      height: 100%;
    }
    .pie {
      width: 100%;
      height: 100%;
    }
  }
  .item:not(:last-child) {
    margin: 0 16px 0 0;
  }
}
</style>
