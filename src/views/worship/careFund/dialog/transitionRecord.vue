<template>
  <div class="transitionRecord">
    <transition name="record">
      <div v-if="people.isShowLine" ref="record" class="record">
        <div class="title">审批流程</div>
        <div class="line">
          <el-timeline>
            <el-timeline-item
              v-for="(item, index) in people.applicationProcessVoList"
              :key="index"
              :timestamp="item.updateTime"
              placement="bottom"
            >
              <div>
                <div class="line-name">
                  <span>{{ item.handlingStreets }}</span>
                  <span class="text">{{ item.currentProcessorName }}</span
                  ><el-tag :type="requestStatusMap[item.passedStatus].class"
                    >{{ requestStatusMap[item.passedStatus].text }}
                  </el-tag>
                </div>
                <div>{{ item.handlingOpinions }}</div>
                <div class="number" v-if="people.applicationAmount">
                  <span>金额:</span><span> {{ people.applicationAmount }}元</span>
                </div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    propsData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  components: {},
  data() {
    return {
      people: {},
      requestStatusMap: {
        0: {
          class: 'danger',
          text: '未通过',
        },
        1: {
          class: 'primary',
          text: '通过',
        },
        null: {
          class: 'success',
          text: '审核中',
        },
      },
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.people = this.propsData;
  },
  methods: {},
};
</script>

<style scoped lang="scss">
.transitionRecord {
  .record {
    position: absolute;
    left: 40px;
    top: 40px;
    width: 300px;
    max-height: 600px;
    overflow: scroll;
    background-color: #fff;
    z-index: 10;
    .title {
      width: 100%;
      padding: 16px;
      box-sizing: border-box;
      font-size: 14px;
      border-bottom: 1px solid #f2f2f2;
    }
    .line {
      padding: 16px;
      box-sizing: border-box;
      .line-name {
        display: flex;
        justify-content: space-between;
      }
      .number {
        color: #f4d15c;
        margin-top: 6px;
      }
    }
  }
  .record-enter-active,
  .record-leave-active {
    transition: opacity 0.3s;
  }
  .record-enter, .record-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
  .name {
    margin-right: 26px;
    font-weight: 500;
    font-size: 24px;
  }
}
</style>
