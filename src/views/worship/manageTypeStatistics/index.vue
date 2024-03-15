<template>
  <div class="stat">
    <div class="line">
      <section v-for="(item,index) in workData">
        <header>
          <div class="line-title">{{ workTitle[index] }}</div>
        </header>
        <div class="content">
          <div class="count">
            <div class="left">
              <span class="num">{{ item.total }}</span>
              <span class="unit">项</span>
            </div>
            <div class="detail" @click="toPath(index + 1)">查看 ></div>
          </div>
          <div class="rates">
            <div class="rate">
              <div class="num blue">{{ item['正常'] }}</div>
              <div class="desc">正常</div>
            </div>
            <div class="rate">
              <div class="num green">{{ item['已完成'] }}</div>
              <div class="desc">已完成</div>
            </div>
            <div class="rate">
              <div class="num red">{{ item['滞后'] }}</div>
              <div class="desc">滞后</div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <div class="line">
      <section class="">
        <div class="title-box">
          <div class="line-title">工作效能指数</div>
          <div class="toolbar">
            <!-- <el-date-picker
              @change="getOfficeIndex"
              v-model="form.birthDate"
              value-format="yyyy-MM-dd"
              type="date"
              size="mini"
              placeholder="选择日期"
            >
            </el-date-picker> -->
          </div>
        </div>
        <div class="list">
          <div class="person">
            <div class="tag">个人</div>
            <div class="cards user">
              <div class="card" v-for="(card, index) in personList" :key="index" :title="card.name">
                <div class="icon">{{ card.name }}</div>
                <!-- <div class="name">{{ card.name }}</div> -->
                <div class="score">
                  <span class="num">{{ card.grade }}</span
                  >分
                </div>
              </div>
            </div>
            <div class="change-icon">
              <i class="el-icon-caret-top" @click="getOfficeIndex(-1)"> </i>
              <i class="el-icon-caret-bottom" @click="getOfficeIndex(1)"> </i>
            </div>
          </div>
          <div class="depart">
            <div class="tag">科室</div>
            <div class="cards">
              <div class="card" v-for="(card, index) in departList" :key="index" :title="card.name">
                <div class="icon">{{ card.name.slice(0, 2) }}</div>
                <div class="name">{{ card.name }}</div>
                <div class="score">
                  <span class="num">{{ card.grade }}</span
                  >分
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <div class="line">
      <section class="work">
        <header>
          <div class="line-title">科室工作统计</div>
          <div class="toolbar">
            <el-date-picker
              v-model="endTime"
              value-format="yyyy-MM-dd"
              type="date"
              size="mini"
              placeholder="选择日期"
              @change="initRankList"
            >
            </el-date-picker>
          </div>
        </header>
        <div class="chart">
          <div class="item" v-for="(item, index) in rankList" :key="index">
            <div class="item-title">{{ item.name }}</div>
            <div class="info-box">
              <div class="rank-box">
                <div class="value-box">
                  <div class="text"><i class="icon green"></i>已完成</div>
                  <span class="value">{{ item['已完成'] }}</span>
                </div>
                <div class="value-box">
                  <div class="text"><i class="icon bule"></i>进行中</div>
                  <span class="value">{{ item['进行中'] }}</span>
                </div>
                <div class="value-box">
                  <div class="text"><i class="icon red"></i>滞后</div>
                  <span class="value">{{ item['滞后'] }}</span>
                </div>
              </div>
              <div class="rank-value">
                <div class="rank-green" :style="{ width: `${(item['已完成'] / item.sum) * 100}%` }"></div>
                <div class="rank-bule" :style="{ width: `${(item['进行中'] / item.sum) * 100}%` }"></div>
                <div class="rank-red" :style="{ width: `${(item['滞后'] / item.sum) * 100}%` }"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="trend">
        <header>
          <div class="line-title">完成任务数量趋势统计</div>
          <div class="toolbar">
            <span class="label">科室：</span>
            <el-select class="select" v-model="form.deptId" clearable size="mini" @change="getYearTrend">
              <el-option label="全部" value=""></el-option>
              <el-option
                v-for="dict in dict.type.	sys_worship_managedepartment"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
            <el-select v-model="form.year" size="mini" clearable @change="getYearTrend">
              <el-option v-for="item in yearOptons" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </div>
        </header>
        <div class="chart" ref="trend"></div>
      </section>
    </div>
  </div>
</template>

<script>
import { getManageTypeStatistics,getYearTrend, getManageDepartmentStatistics } from '@/api/worship/manageTypeStatistics'
import { getYearList } from "@/api/worship/manageTask";
import * as echarts from 'echarts'
export default {
  props: {},
  components: {},
  dicts: ['sys_worship_managetaskstate','sys_worship_managedepartment'],
  data() {
    return {
      workData:[],
      workTitle:['年度重点工作','局务会交办工作','镇街工作任务'],
      form: {
        year: '',
        deptId: '',
      },
      endTime:'',
      personList: [],
      departList: [],
      chartWork: null,
      chart: null,
      rankList: [],
      yearOptons: [],
      linList: [],
      currentIndex: 0,
      total: 0,
    };
  },
  computed: {},
  watch: {},
  mounted() {
    this.getData();
    // this.getOfficeIndex();
    this.initRankList();
    this.getYearList();
    this.getYearTrend();
  },
  methods: {
    getYearTrend() {
      getYearTrend(this.form).then(res =>{
        this.linList = res.data;
        console.log('res', Object.values(this.linList));
        this.initChart();
      })
    },
    getData() {
      getManageTypeStatistics().then(res =>{
        this.workData = res.data
      })
    },
    initRankList() {
      getManageDepartmentStatistics({endTime:this.endTime}).then(res =>{
        this.rankList = res.data.map(item => {
          item.sum = item['已完成'] + item['滞后'] + item['进行中'];
          return item;
        });
      })
    },
    initChart() {
      this.chart = echarts.init(this.$refs.trend);
      let option = {
        title: {
          text: '',
          subtext: '',
          textStyle: {
            fontSize: 18,
            color: '#fff',
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
          show: false,
          right: '5%',
          top: '5%',
          zleval: '',
          itemWidth: 25, //图标的宽度类型number
          itemHeight: 14, //图标的高度类型number
          icon: 'circle',
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
          data: Object.values(this.linList).map((item, index) => `${index + 1}月`),
          // 坐标轴轴线相关设置。
          axisLine: {
            show: true,
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
            formatter: val => {
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
          splitLine: { show: true },
          axisLabel: {
            // 坐标轴刻度标签的相关设置。
            interval: 0, // 解决x轴数据显示不完全的bug
            rotate: 0, // 旋转
            color: '#000',
            formatter: val => {
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
            color: '#5c8ff9',
            showSymbol: true,
            // 数据点的显示与隐藏
            name: '',
            type: 'line',
            // 是否重叠
            stack: '',
            // y轴数据显示
            label: {
              show: true,
              position: 'top',
            },
            data: Object.values(this.linList),
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
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(91, 143, 249, 0.65)',
                },
                {
                  offset: 1,
                  color: 'rgba(91, 143, 249, 0)',
                },
              ]),
            },
          },
        ],
      };
      this.chart.setOption(option);
    },
    resizeFun() {
      const titleFontSize = (this.$refs.line.offsetWidth / 100) * 1.5;
      let updataOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize,
          },
          tooltip: {
            axisPointer: {
              lineStyle: {
                width: titleFontSize,
              },
            },
          },
        },
      };
      this.chart.setOption(updataOption);
      this.chart.resize();
    },
    getYearList() {
      getYearList().then(res =>{
        this.yearOptons = res.data
      })
    },
    getOfficeIndex(value = 0) {
      // 前端分页
      this.currentIndex += value;
      if (this.currentIndex * 8 > this.total) {
        this.currentIndex = 0;
      }
      axios({
        url: '/manageTask/addOriginData',
        method: 'get',
        params: {
          time: this.form.birthDate,
        },
      }).then(res => {
        console.log(res);
        this.personList = res['个人'].slice(this.currentIndex * 8, this.currentIndex * 8 + 8);
        this.departList = res['科室'];
        this.total = res['个人'].length;
      });
    },
    toPath(index) {
      this.$router.push({
        path: '/work/manageTask',
        query: {
          tab: index,
        },
      });
    },
  },
};
</script>

<style scoped lang="scss">
.stat {
	padding: 21px;
	.line {
		display: flex;
	}
}
section {
	background: #fff;
	border-radius: 4px;
	padding: 16px 24px;
	flex: 1;
	margin-bottom: 16px;
	& + section {
		margin-left: 16px;
	}
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		.line-title {
			font-size: 16px;
			font-weight: bold;
			&::before {
				content: '';
				display: inline-block;
				width: 4px;
				height: 20px;
				background: #1492ff;
				float: left;
				margin-left: -24px;
			}
		}
	}
	.content {
		.count {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: 30px;
			.left {
				.num {
					font-size: 36px;
				}
				.unit {
					font-size: 18px;
					margin-left: 5px;
				}
			}
      .detail {
        cursor: pointer;
        padding: 4px 10px;
        background: #f4f5f7;
        border-radius: 100px;
        font-size: 12px;
      }
		}
		.rates {
			display: flex;
			justify-content: space-around;
			align-items: center;
			background: #f8f8f8;
			border-radius: 4px;
			padding: 12px 0 12px 12px;
			margin-top: 15px;
			.rate {
				.num {
					font-size: 24px;
					&::before {
						content: '';
						display: inline-block;
						width: 10px;
						height: 10px;
						border-radius: 50%;
						float: left;
						margin-left: -20px;
						margin-top: 12px;
					}
					&.blue {
						&::before {
							background: #1890ff;
						}
					}
					&.green {
						&::before {
							background: #55c51e;
						}
					}
					&.red {
						&::before {
							background: #ff0909;
						}
					}
				}
				.desc {
					color: #999;
				}
			}
		}
	}
}
.list {
	display: flex;
	margin-left: -24px;
	.cards {
		display: flex;
		align-items: center;
		height: 150px;
		.card {
			height: 100px;
			text-align: center;
			margin-left: 30px;
			.icon {
				width: 56px;
				height: 56px;
				line-height: 56px;
				background: #ddd;
				border-radius: 50%;
				margin: 0 auto;
				display: -webkit-box;
				overflow: hidden;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
			}
			.score {
				.num {
					font-size: 24px;
					margin-right: 5px;
					color: #ffce4e;
				}
			}
		}
	}
	.depart {
		.card {
			&:nth-child(1) {
				.icon {
					background: #e3efff;
					color: #1890ff;
				}
			}
			&:nth-child(2) {
				.icon {
					background: #fff0da;
					color: #fb900b;
				}
			}
			&:nth-child(3) {
				.icon {
					background: #ffeded;
					color: #f66;
				}
			}
		}
	}
}
.list .person,
.list .depart {
	width: 50%;
	position: relative;
	margin-top: 10px;
}
.list .person .tag,
.list .depart .tag {
	position: absolute;
	left: 1px;
	top: 0;
	background: #f6f7f8;
	padding: 4px 12px;
	border-radius: 0 30px 30px 0;
}
.work .chart,
.trend .chart {
	height: 300px;
}

.user {
  overflow: hidden;
  margin: 18px 0 0 0;
  width: 690px;
}
.cards {
  margin: 18px 0 0 0;
}
.person {
  display: flex;
  justify-content: center;
  align-items: center;
  justify-content: space-between;
  padding-left: 30px;
  box-sizing: border-box;
  .change-icon {
    margin: 0 0 0 60px;
    display: flex;
    flex-direction: column;
    font-size: 20px;
    i:hover {
      color: #1890ff;

      cursor: pointer;
    }
  }
}
.score {
  display: flex;
  justify-content: center;
  align-items: center;
}
.chart {
  padding: 20px 0 0 0;
  box-sizing: border-box;
  overflow: scroll;
  .item {
    // width: 524px;
    height: 78px;
    background: #f8f8f8;
    border-radius: 8px;
    display: flex;
    align-items: center;
    padding: 0 20px 0 18px;
    box-sizing: border-box;
    margin: 10px 0 0 0;
    .item-title {
      font-family: PingFangSC-SNaNpxibold;
      font-weight: 600;
      font-size: 16px;
      color: #333333;
      margin: 0 52px 0 0;
      width: 20%;
    }
    .info-box {
      flex: 1;
    }
    .rank-box {
      display: flex;
      justify-content: space-between;
      .value-box {
        margin: 0 36px 0 0;
        display: flex;
        .text {
          font-family: PingFangSC-Regular;
          font-weight: 400;
          font-size: 14px;
          color: #000000;
          margin: 0 8px 0 0;
        }
        .value {
          font-family: PingFangSC-Medium;
          font-weight: 500;
          font-size: 14px;
          color: #000000;
        }
        .icon {
          display: inline-block;
          border-radius: 30px;
          width: 6px;
          height: 6px;
          // background: #5ad8a6;
          margin: 0 8px 0 0;
        }
        .green {
          background: #5ad8a6;
        }
        .bule {
          background: #5b8ff9;
        }
        .red {
          background: #ff8282;
        }
      }
    }
    .rank-value {
      // width: 173px;
      height: 16px;
      background: #babdbc;
      border-radius: 8px;
      margin: 12px 0 0 0;
      display: flex;
      .rank-green {
        // border-radius: 8px 0px 0 8px;
        // width: 30%;
        border-radius: 8px;

        background: #5ad8a6;
      }
      .rank-bule {
        border-radius: 8px;

        // width: 30%;
        background: #5b8ff9;
      }
      .rank-red {
        // border-radius: 0px 8px 8px 0px;
        border-radius: 8px;
        // width: 30%;
        background: #ff8282;
      }
    }
  }
}
.title-box {
  display: flex;
  // justify-content: space-between;
  width: 100%;
  position: relative;
  .line-title {
    font-size: 16px;
    font-weight: bold;
    margin: 0 16px 0 0;
  }
  &::before {
    margin: 0 16px 0 0;
    content: '';
    display: inline-block;
    width: 4px;
    height: 20px;
    background: #1492ff;
    margin-left: -24px;
  }
}
.trend,.work{
  margin-bottom: 0;
}
.select {
  margin: 0 16px 0 0;
}

.el-select, .el-cascader{
  width: 8vw;
}
.el-date-editor{
  width: 10vw;
  margin-left: 10px;
}
</style>
