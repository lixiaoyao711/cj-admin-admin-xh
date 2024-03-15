<template>
  <div class="sendMsgDialog">
    <el-dialog title="短信群发" :visible.sync="dialogVisible" width="600px" :before-close="handleClose">
      <div>
        <div class="title">*短信内容：</div>
        <div class="inpnt-item" v-for="(item, index) in textarea" :key="index">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="item.text"
            maxlength="200"
            :autosize="{ minRows: 4, maxRows: 9 }"
            show-word-limit
            class="input"
          >
          </el-input>
          <i v-if="index == 1" @click="delItem(index)" class="el-icon-remove-outline"> </i>
        </div>
        <div class="footer">
          <span
            >*每条短信只能发送150个文字，若超出限制，请<span @click="addInput" class="this">点击此处</span
            >分为两条短信发送</span
          >
        </div>
        <div class="sendPeople">
          <div>选择接收人</div>
          <div class="btns">
            <el-button @click="handleExport" type="info">获取模板</el-button>
            <el-upload
              class="upload"
              :action="action"
              :show-file-list="false"
              :headers="headers"
              :on-success="uploadSuccess"
            >
              <el-button slot="trigger" type="success">导入</el-button>
            </el-upload>

            <el-button @click="addPeople" plain>选择人员</el-button>
          </div>
        </div>
        <div v-if="infoList.length < 20">
          <el-tag @close="tagClose(item)" v-for="(item, index) in infoList" :key="index" type="info" closable>{{
            item.name
          }}</el-tag>
        </div>
        <div v-else>
          <el-tag
            @close="tagClose(item)"
            v-for="(item, index) in infoList.slice(0, 5)"
            :key="index"
            type="info"
            closable
            >{{ item.name }}</el-tag
          >
          <el-tag type="info">等{{ infoList.length }}人</el-tag>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="saveItem">确 定</el-button>
      </span>
    </el-dialog>
    <!-- <VeteransPeople
      v-if="showUp"
      :isRadio="false"
      :isShowAll="false"
      :checkList="infoList"
      @close="showUp = false"
      @success="upSuccess"
    /> -->
    <ChangePeoPle v-if="showUp" @close="showUp = false" type="petitionData" @success="upSuccess" />
  </div>
</template>

<script>
// import VeteransPeople from '@/components/veteransPeople';
import ChangePeoPle from '@/components/ChangePeoPle/people.vue';
import { sendSms } from '@/api/worship/messagePlatform';
import { getToken } from '@/utils/auth';

export default {
  props: {},
  components: {
    //  VeteransPeople
    ChangePeoPle,
  },
  data() {
    return {
      dialogVisible: true,
      showUp: false,
      headers: {
        Authorization: 'Bearer ' + getToken(),
      },
      textarea: [
        {
          text: '',
        },
      ],
      infoList: [],
      flg: false,
      action: process.env.VUE_APP_BASE_API + '/worship/sendSmsLog/importSmsInfo',
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.user.user;
    },
  },
  watch: {},
  created() {},
  mounted() {
    console.log('this', this.userInfo);
  },
  methods: {
    handleClose() {
      this.$emit('close');
    },
    async saveItem() {
      for (const item of this.textarea) {
        if (item.text == '') {
          this.$message.warning('请输入短信内容');
          return;
        }
      }
      for (const item of this.textarea) {
        let obj = {
          messageContent: item.text,
          recipientName: this.infoList.map((item) => item.name).join(','),
          // recipientPhone: '18290403841',
          recipientPhone: this.infoList.map((item) => item.phone).join(','),
          sender: this.userInfo.userId,
          senderCode: this.userInfo.divisionCode,
          senderName: this.userInfo.nickName,
          moduleType: 7,
        };
        console.log(obj);
        const { data } = await sendSms(obj);
        if (data) {
          this.flg = true;
        }
        // await axios({
        //   url: '/retireInfo/sendSms',
        //   method: 'post',
        //   data: obj,
        // }).then((res) => {
        //   this.flg = true;
        // });
      }
      if (this.flg) {
        this.$message.success('短信发送成功');
        this.$emit('close');
      }
    },
    addInput() {
      if (this.textarea.length == 2) {
        this.$message.warning('内容最多只能添加两个弹窗');
        return;
      }
      this.textarea.push({
        text: '',
      });
    },
    // 删掉点击了关闭的tag
    tagClose(tag) {
      console.log(tag);
      this.infoList.splice(this.infoList.indexOf(tag), 1);
      console.log(this.infoList);
    },
    delItem(index) {
      this.textarea.splice(index, 1);
    },
    upSuccess(list) {
      console.log(list);
      if (list) {
        this.infoList.push(...list);
        let hash = {};
        this.infoList = this.infoList.reduce(function (item, next) {
          hash[next.phone] ? '' : (hash[next.phone] = true && item.push(next));
          return item;
        }, []);
      }
      console.log('infoList', this.infoList);
      this.showUp = false;
    },
    addPeople() {
      this.showUp = true;
    },
    uploadSuccess(data) {
      if (data.code === 500) {
        this.$notify.error({
          title: '错误',
          message: data.msg,
          duration: 0,
        });
        return;
      }
      this.$message.success('导入成功');
      this.infoList.push(...data.data);
      let hash = {};
      this.infoList = this.infoList.reduce(function (item, next) {
        hash[next.phone] ? '' : (hash[next.phone] = true && item.push(next));
        return item;
      }, []);
    },
    handleExport() {
      this.download('/worship/sendSmsLog/smsInfoTemplate', {}, `导入模板.xlsx`);
    },
  },
};
</script>

<style scoped lang="scss">
.sendMsgDialog {
  .footer {
    .this {
      color: #66b1ff;
      cursor: pointer;
    }
  }
  .input {
    margin: 10px 0;
    width: 510px;
  }
  .sendPeople {
    display: flex;
    justify-content: space-between;
    margin-top: 50px;
  }
  .el-tag {
    margin-right: 6px;
    margin-top: 6px;
  }
  .inpnt-item {
    display: flex;
    align-items: center;
    .el-icon-remove-outline {
      margin-left: 16px;
      cursor: pointer;
    }
  }
  .btns {
    display: flex;
    .upload {
      margin: 0 10px;
    }
  }
}
</style>
