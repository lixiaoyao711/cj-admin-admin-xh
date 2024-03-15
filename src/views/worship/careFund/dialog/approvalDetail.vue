<template>
  <el-dialog
    title="申请详情"
    width="600px"
    top="10vh"
    :visible.sync="dialogVisible"
    @close="$emit('close')"
    append-to-body
  >
    <section>
      <header>
        <div v-for="(item, index) in titleArray" :key="index">
          <div v-if="item.show" :class="{ changeItem: currtIndex === index }" @click="clickItem(index)">
            <span>{{ item.number }}</span> {{ item.name }}
          </div>
        </div>
      </header>
      <main>
        <div v-if="currtIndex === 0">
          <div class="item0" v-for="(item, index) in infoList" :key="index">
            <span>{{ item.name }}</span
            ><span>{{ item.value }}</span>
          </div>
        </div>
        <div v-if="currtIndex === 1">
          <div class="item1" v-for="(item, index) in formData.familyList" :key="index">
            <div class="list">
              <span>与申请人关系: {{ item.relationWithCareFundPerson }}</span>
            </div>
            <div class="list">
              <span>姓名: {{ item.name }}</span>
            </div>
            <div class="list">
              <span>工作单位: {{ item.workUnit }}</span>
            </div>
            <div class="list">
              <span>月收入: {{ item.monthlyIncome }}</span>
            </div>
            <div class="list">
              <span>备注: {{ item.remarks }}</span>
            </div>
          </div>
        </div>
        <div v-if="currtIndex === 2">
          <div class="item2" v-for="(item, index) in imgList" :key="index">
            <div class="title">
              {{ item.name }}
            </div>
            <div class="img-list">
              <template>
                <div>
                  <el-image
                    v-for="(img, indey) in item.list"
                    :key="indey"
                    @click="imgClick(img)"
                    :src="img"
                    :preview-src-list="srcList"
                  ></el-image>
                </div>
              </template>
            </div>
          </div>
        </div>
      </main>
      <!-- <ul>
                <li>时间: {{ info.createdDate }}</li>
                <li>使用人: {{ info.name }}</li>
                <li>所属镇街: {{ info.departName }}</li>
                <li>基金项目: {{ info.fundName }}</li>
                <li>使用金额: {{ info.requestAmount }}</li>
                <li>登记人员: {{ info.createdName }}</li>
                <li class="line"><span>附件内容:</span> 
                    <a :href="attach.url" target="_blank" class="attach" v-for="attach in info.filePath" :key="attach.id">{{attach.name}}</a>
                </li>
            </ul>
            <div class="beneficiary">
                <div class="title">受惠人员</div>
                <beneficiary-box :list="beneficiaryList" :currentNode="currentNode"></beneficiary-box>
                <el-col :span="24" class="passBtn" v-if="showBtn">
                    <el-button @click="noPass">不通过</el-button>
                    <el-button type="primary" @click="pass">通 过</el-button>
                </el-col>
            </div>
            <footer>
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleAdd">确 定</el-button>
            </footer> -->
    </section>
  </el-dialog>
</template>

<script>
export default {
  props: ['info', 'currentNode'],
  components: {},
  data() {
    return {
      dialogVisible: true,
      beneficiaryData: {},
      beneficiaryList: [],
      currtIndex: 0,
      titleArray: [
        {
          number: '①',
          name: '基本情况',
          show: true,
        },
        {
          number: '②',
          name: '家庭成员',
          show: true,
        },
        {
          number: '③',
          name: '相关资料',
          show: this.currentNode !== 'info',
        },
      ],
      infoList: [],
      srcList: [''],
      fileMap: {
        1: '身份证或居住证',
        2: '户口簿或租房合同',
        3: '病史诊断证明',
        4: '近一年基本医疗保险查询单',
        5: '退役军人救助申请表',
      },
      imgList: [
        {
          name: '身份证或居住证',
          status: 1,
          list: [],
        },
        {
          name: '户口薄或租房合同',
          status: 2,

          list: [],
        },
        {
          name: '病史诊断证明',
          status: 3,

          list: [],
        },
        {
          name: '近一年基本医疗保险查询单',
          status: 4,

          list: [],
        },
        {
          name: '退役军人救助申请表',
          status: 5,

          list: [],
        },
        {
          name: '申请书',
          status: 6,

          list: [],
        },
      ],
      formData: {},
    };
  },
  created() {
    if (this.info && this.info.reason === null) {
      this.info.noPassReason = '无';
    } else {
      this.info.noPassReason = this.info.reason;
    }
    this.beneficiaryList.push(this.info);
    this.getData();
  },
  computed: {
    showBtn() {
      return this.currentNode == '4';
    },
  },
  methods: {
    getData() {
      // careFundPersonZlbGetById(this.info.id).then((res) => {
      //   this.formData = res;
      //   transferText(this.formData);
      //   this.infoList = [
      //     {
      //       name: '所在镇街/社区',
      //       value: this.formData.departName,
      //     },
      //     {
      //       name: '所属项目',
      //       value: this.formData.fundName,
      //     },
      //     {
      //       name: '姓名',
      //       value: this.formData.name,
      //     },
      //     {
      //       name: '性别',
      //       value: this.formData.sex,
      //     },
      //     {
      //       name: '出生年月',
      //       value: this.formData.birthDate,
      //     },
      //     {
      //       name: '婚姻状况',
      //       value: this.formData.marriage,
      //     },
      //     {
      //       name: '联系电话',
      //       value: this.formData.telephone,
      //     },
      //     {
      //       name: '现住址',
      //       value: this.formData.address,
      //     },
      //     {
      //       name: '身份证',
      //       value: this.formData.cardCode,
      //     },
      //     {
      //       name: '工作单位',
      //       value: this.formData.workUnit,
      //     },
      //     {
      //       name: '申请人卡号',
      //       value: this.formData.accountNumber,
      //     },
      //     {
      //       name: '开户行',
      //       value: this.formData.accountBank,
      //     },
      //     {
      //       name: '申请前12个月家庭总收入',
      //       value: this.formData.familyIncome,
      //     },
      //     {
      //       name: '申请人类型',
      //       value: this.formData.personType,
      //     },
      //     {
      //       name: '救助原因',
      //       value: this.formData.reason,
      //     },
      //   ];
      //   for (const item of this.formData.filePath) {
      //     this.imgList.forEach((element) => {
      //       if (element.status == item.fileType) {
      //         element.list.push(item.url);
      //       }
      //     });
      //   }
      //   console.log(this.formData);
      // });
    },
    handleAdd() {
      this.dialogVisible = false;
    },
    noPass() {
      this.$emit('noPass', this.info);
      this.dialogVisible = false;
    },
    pass() {
      this.$emit('pass', this.info);
      this.dialogVisible = false;
    },
    ////////////////////////////////////
    clickItem(index) {
      this.currtIndex = index;
    },
    imgClick(img) {
      this.srcList[0] = img;
      console.log(this.srcList);
    },
  },
};
</script>

<style scoped lang="scss">
header {
  display: flex;
  align-items: center;
  font-size: 18px;
  justify-content: center;
  border-bottom: 10px solid #f2f2f2;
  padding-bottom: 10px;
  box-sizing: border-box;
  div {
    margin-right: 26px;
    cursor: pointer;
  }
  span {
    margin-right: 3px;
  }
}
main {
  height: 600px;
  overflow: scroll;
  .item0 {
    display: flex;
    justify-content: space-between;
    font-size: 18px;
    border-bottom: 1px solid #f2f2f2;
    padding-bottom: 10px;
    margin-top: 10px;
    box-sizing: border-box;
  }
  .item1 {
    font-size: 18px;
    border-bottom: 1px solid #f2f2f2;
    padding-bottom: 10px;
    margin-top: 10px;
    box-sizing: border-box;
    .list {
      padding-left: 16px;
    }
  }
  .item2 {
    font-size: 18px;
    padding-bottom: 10px;
    margin-top: 10px;
    box-sizing: border-box;
    .img-list {
      margin-top: 12px;
      .el-image {
        width: 65px;
        height: 65px;
        cursor: pointer;
        margin-right: 16px;
      }
    }
  }
}
.changeItem {
  color: #39f;
}
section {
  display: flex;
  height: 100%;
  flex-direction: column;
}
ul {
  flex: 1;
  li {
    line-height: 2.2;
  }
}
.beneficiary {
  &::after {
    content: '';
    display: block;
    clear: both;
  }
  .title {
    font-size: 16px;
    font-weight: 550;
    margin-top: 18px;
  }
  .box {
    padding: 6px 16px 6px 16px;
    margin: 16px 20px 0 0;
  }
  .group {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .passBtn {
    text-align: center;
    margin-top: 18px;
  }
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.bg-purple {
  background: #f4f4f4;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
footer {
  text-align: right;
  margin-top: 18px;
}
</style>
