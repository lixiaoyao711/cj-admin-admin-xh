<template>
  <div class="index">
    <div class="group">
      <div class="left">
        <div class="card todo">
          <header>待办事项</header>
          <div class="card-item">
            <div
              @click="toPath(item.path, item.key, item.query)"
              v-for="(item, index) in backlogData"
              :key="index"
              :style="{ color: item.number > 0 ? 'red' : '' }"
              class="item"
              :title="index"
            >
              {{ item.number }}
            </div>
          </div>
        </div>
        <div class="card todo">
          <header>人员优待</header>
          <div class="card-item">
            <div
              @click="toPath(item.path, item.key, item.query)"
              v-for="(item, index) in personData"
              :key="index"
              :style="{ color: item.number > 0 ? 'red' : '' }"
              class="item"
              :title="index"
            >
              {{ item.number }}
            </div>
          </div>
        </div>
      </div>
      <div class="card right-box">
        <header>信息核查</header>
        <div
          class="list"
          v-for="(item, index) in peopleCount"
          :key="index"
          @click="toPath(item.path, item.key, item.query)"
        >
          <div>
            <span class="title">{{ item.number }} {{ index === '未关联现役军人' ? '家属' : '人' }}</span
            ><span class="content">{{ index }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="card link">
      <header>快捷链接</header>
      <div class="items">
        <div class="item" @click="toScreen">
          <div class="icon driver"></div>
          <div class="desc" title="驾驶舱">西湖区崇军指数驾驶舱</div>
        </div>
        <div class="item" @click="toGov">
          <div class="icon task"></div>
          <div class="desc" title="办事平台">浙江政府服务网</div>
        </div>
        <div class="item" @click="toWechat">
          <div class="icon service"></div>
          <div class="desc" title="服务平台">西湖区退役军人微信公众号</div>
        </div>
        <div class="item">
          <div class="icon msg"></div>
          <router-link to="/worship/messagePlatform/index">
            <div class="desc" title="短信平台">西湖区退役军人局短信发送平台</div>
          </router-link>
        </div>
        <div class="item" @click="$router.push('/supportTreat/visiting')">
          <div class="icon visit"></div>
          <div class="desc" title="走访慰问">新建与查看走访记录</div>
        </div>
        <div class="item" @click="$router.push('/supportTreat/cjEvent')">
          <div class="icon active"></div>
          <div class="desc" title="活动中心">新建与查看活动记录</div>
        </div>
      </div>
    </div>
    <div class="card lifeCircle">
      <header>退役军人全生命周期</header>
      <div class="items">
        <!-- <div class="item" @click="$router.push('allPeople')">全部人员</div> -->
        <div class="item" @click="$router.push('/personnelManagement/retiredSoldier')">退役军人</div>
        <div class="item" @click="$router.push('/personnelManagement/serviceFamily')">现役军人家属</div>
        <div class="item" @click="$router.push('/personnelManagement/compensatedIndividuals')">其他优抚对象</div>
        <div class="item" @click="$router.push('/personnelManagement/ageAppropriate')">我要参军</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getVerificationInfo, getPrefInfo, getTodoData } from '@/api/worship/home';
import { getToken } from '@/utils/auth';
import { deptTreeSelect } from '@/api/system/user';

export default {
  props: {},
  components: {},
  dicts: ['sys_worship_tuiyijunrenanzhileibie'],
  data() {
    return {
      backlogData: {},
      personData: {},
      peopleCount: [],
      form: {},
    };
  },
  computed: {},
  watch: {},
  mounted() {
    console.log(this.dict);
    this.getDeptTreeSelectDict();
    this.getAnZhiType();

    this.getBacklogData();
    this.$store.dispatch('getTodoSignData');
  },
  methods: {
    toScreen() {
      // this.$store.dispatch('getUnreadFlge');
      window.dashboardWindow = window.open(window.dashboardUrl + `?token=${getToken() || ''}}`, 'dashboard');
    },
    toGov() {
      window.open(
        'https://recept.zjzwfw.gov.cn/online/accept#/accept/entry?matterType=union&matterId=1112368883&syncUserType=true'
      );
    },
    toWechat() {
      window.open('https://mp.weixin.qq.com/');
    },
    toMsg() {
      // this.$router.push({
      //   name: 'allPeople',
      //   query: {
      //     componentId: 'MsgList', //跳转到短信记录界面
      //     titleName: '短信发送历史', //跳转到短信记录界面
      //     returnPath: 'index', //回跳到首页
      //   },
      // });
    },
    toPath(path, tab, name) {
      if (!name) {
        return;
      }
      this.$router.push({
        path: path,
        query: {
          name: name,
          tab: tab || '',
        },
      });
    },
    // 首页待办事项数据
    getBacklogData() {
      getTodoData().then((res) => {
        let data = res.data;
        this.backlogData = {
          工作任务: {
            number: data.manageTask,
            path: '/work/manageTask',
            key: '1',
            query: '1',
          },
          领导批示: {
            number: data.leaderInstruction,
            path: '/work/leaderInstruction',
            key: '1',
            query: '1',
          },
          权益维护待办: {
            number: data.petitionInfo,
            path: '/petition/myBacklog',
            key: 'processing',
            query: '1',
          },
          双拥清单: {
            number: data.supportDouble,
            path: '/supportTreat/supportTask',
            key: 'Worship',
            query: '1',
          },
          困难人员转出: {
            number: data.difficultOut,
            path: '/care/carePersonList',
            key: 'tobeTransferred',
            query: '1',
          },
          关爱基金待审核: {
            number: data.careFund,
            path: '/care/careFund',
            key: 'charge',
            query: '1',
          },
        };
      });
      getVerificationInfo().then((res) => {
        let data = res.data;
        this.peopleCount = {
          手机号信息不全: {
            number: data.noPhone,
            path: '/worship/informationVerification/index',
            key: 'noPhone',
            query: 'verification',
          },
          身份证信息不全: {
            number: data.noIdCard,
            path: '/worship/informationVerification/index',
            key: 'noIdCard',
            query: 'verification',
          },
          未关联现役军人: {
            number: data.noActive,
            path: '/worship/informationVerification/index',
            key: 'noActive',
            query: 'verification',
          },
          被判刑人员: {
            number: data.sentenced,
            path: '/personnelManagement/sentenceInfo',
            key: 'retired',
            query: 'sentenceInfo',
          },
          入伍满两年的义务兵: {
            number: data.twoYearConscripts,
            path: '/personnelManagement/serviceMen',
            key: 'retired',
            query: '1',
          },
        };
      });
      getPrefInfo().then((res) => {
        let data = res.data;
        this.personData = {
          疑似困难: {
            number: data.suspectDifficult,
            path: '/care/carePersonList',
            key: 'suspectedDifficultyPerson',
            query: 'carePersonList',
          },
          三个月内即将满55岁女性: {
            number: data.ageFemale,
            path: '/worship/informationVerification/index',
            key: 'ageFemale',
            query: 'reachAgePerson',
          },
          三个月内即将满60岁男性: {
            number: data.ageMale,
            path: '/worship/informationVerification/index',
            key: 'ageMale',
            query: 'reachAgePerson',
          },
          本月去世人员: {
            number: data.thisMonthDeath,
            path: '/worship/informationVerification/index',
            key: 'thisMonthDeath',
            query: 'deceasedPerson',
          },
        };
      });
    },

    getDeptTreeSelectDict() {
      deptTreeSelect({
        whetherStock: 1,
      }).then((res) => {
        this.$store.commit('SET_DEPTTREESELECTDICT', res.data);
      });
    },
    getAnZhiType() {
      setTimeout(() => {
        let list = JSON.parse(JSON.stringify(this.dict.type.sys_worship_tuiyijunrenanzhileibie));
        let arr = [
          {
            label: '退役干部',
            value: '1',
            children: [],
          },
          {
            label: '退役士兵',
            value: '2',
            children: [],
          },
          {
            label: '复员军人',
            value: '3',
            children: [],
          },
        ];
        arr.forEach((e, index) => {
          let key = index + 1;
          e.children = list.filter((f) => f.value.indexOf(key) == 0);
        });
        console.log(arr);
        this.$store.commit('SET_ANZHITYPEDICT', arr);
      }, 2000);
    },
  },
};
</script>

<style scoped lang="scss">
.index {
  padding: 24px 60px;
}
.card {
  padding: 16px 24px 30px;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.06);
  background: #fff;
  margin-bottom: 24px;
}
.card header {
  display: flex;
  align-items: center;
  font-size: 16px;
  margin-top: 20px;
}
.card header::before {
  content: '';
  width: 4px;
  height: 16px;
  background: #1890ff;
  margin-right: 10px;
}
.items {
  margin-top: 22px;
}
.items,
.group {
  display: flex;
}
.group .left {
  width: 80%;
}
.group .right-box {
  flex: 1;
  margin-left: 20px;
}
.group .right-box .list {
  width: 320px;
  height: 40px;
  background: #f6f7f8;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  padding: 0 10px;
  box-sizing: border-box;
}
.group .right-box .list .title {
  font-size: 16px;
  font-weight: 600;
  margin-right: 10px;
}
.group .right-box .list .content {
  color: #abacac;
}
.group .right-box .list .view {
  cursor: pointer;
  color: #68bbf6;
}
.card .card-item {
  display: flex;
  flex-wrap: wrap;
}
.card.todo .item {
  width: 25%;
  font-size: 30px;
  line-height: 50px;
  height: 60px;
  margin-top: 20px;
}
.card.todo .item:last-child {
  border: none;
}
.card.todo .item::before {
  content: attr(title);
  display: block;
  font-size: 14px;
  line-height: 20px;
}
.card.link .items {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 20px;
}
.card.link .item {
  background: #f6f7f8;
  padding: 18px;
  display: flex;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;
}
.card.link .item:hover {
  box-shadow: 2px 4px 10px 0px rgba(0, 0, 0, 0.4);
}
.card.link .item .icon {
  width: 60px;
  height: 60px;
  background-size: 100% 100%;
}
.card.link .item .icon.driver {
  background-image: url('~@/assets/img/driver.png');
}
.card.link .item .icon.task {
  background-image: url('~@/assets/img/task.png');
}
.card.link .item .icon.service {
  background-image: url('~@/assets/img/service.png');
}
.card.link .item .icon.msg {
  background-image: url('~@/assets/img/msg.png');
}
.card.link .item .icon.visit {
  background-image: url('~@/assets/img/visit.png');
}
.card.link .item .icon.active {
  background-image: url('~@/assets/img/active.png');
}
.card.link .item .desc {
  flex: 1;
  font-size: 16px;
  margin-left: 12px;
  color: #999;
}
.card.link .item .desc::before {
  content: attr(title);
  font-size: 24px;
  display: block;
  color: #000;
  margin-bottom: 8px;
}
.card.link .item:last-child {
  margin-right: 0;
}
.card.lifeCircle {
  padding-bottom: 0;
}
.card.lifeCircle .items {
  justify-content: space-around;
  margin-top: 30px;
}
.card.lifeCircle .item {
  width: 160px;
  height: 160px;
  text-align: center;
  color: #fff;
  font-size: 23px;
  background: url('~@/assets/img/circle.png');
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 24px 36px;
  box-sizing: border-box;
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.34);
  cursor: pointer;
  transition: 0.2s;
}
.card.lifeCircle .item:hover {
  transform: scale(1.2);
}
</style>
