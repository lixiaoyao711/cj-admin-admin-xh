<template>
  <div class="directorMailboxInfo">
    <el-dialog title="咨询记录" :visible.sync="dialogVisible" width="800px" :before-close="handleClose">
      <div v-if="consultingType != 2" class="change-box">
        <div>
          <span>信息传达给:</span>
          <el-tag @close="closeTag" v-if="deptName" type="info" :closable="isAdmin">{{ deptName }}</el-tag
          ><el-tag @click="openDialog" type="info" effect="plain" v-if="isAdmin">
            {{ deptName ? '变更' : '+ 新增' }}</el-tag
          >
        </div>
      </div>
      <div class="msg-box" v-for="(item, index) in formData">
        <div class="item">
          <div class="mgs-text" v-if="item.type == 0">
            <div class="text-left">
              <span class="title-icon" :class="'yellow'">问</span>
              <div v-if="item.isFile && item.isFile !== '0'">
                <span>{{ item.name }} :</span>
                <img @click="viewImg(item.content)" class="back-img" :src="item.content" alt="" />
              </div>
              <div v-else>
                <span>{{ item.name }} :</span>
                {{ item.content }}
              </div>
            </div>
            <div class="createdDateStr">{{ item.createdDateStr }}</div>
          </div>
          <div class="mgs-text" v-if="item.type == 1">
            <div class="text-left">
              <span class="title-icon" :class="'green'">答</span>
              <div>
                <span v-if="isAdmin">{{ item.name }} :</span>{{ item.content }}
              </div>
            </div>
            <div class="createdDateStr">
              {{ item.createdDateStr }}
            </div>
          </div>
        </div>
      </div>
      <div class="back-msg">
        <el-input
          type="textarea"
          maxlength="1000"
          show-word-limit
          :autosize="{ minRows: 6 }"
          resize="none"
          placeholder="请输入内容"
          v-model="backMsg"
        >
        </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">关 闭</el-button>
        <el-button type="primary" @click="saveItem">发 送</el-button>
      </span>
      <el-dialog class="img-dialog" append-to-body :visible.sync="imgDialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="" />
      </el-dialog>
    </el-dialog>
    <!-- <el-dialog title="常用人员" :visible.sync="oftenPeopleDialogVisible" width="800px" :before-close="oftenOrgClose">
    </el-dialog> -->
    <OftenPeople
      v-if="oftenPeopleDialogVisible"
      type="1"
      :isRadio="true"
      :isTable="false"
      :isRadioOrg="true"
      @close="oftenPeopleDialogVisible = false"
      @success="oftenOrgSuccess"
    />
  </div>
</template>

<script>
import OftenPeople from '@/components/ChangePeoPle/orgPeople.vue';
import { setDeptId, getListById, addConsulting } from '@/api/worship/reply';
export default {
  props: {
    info: Object,
    url: String,
    consultingType: Number,
  },
  components: { OftenPeople },
  data() {
    return {
      oftenOrgDialog: false,
      dialogVisible: true,
      imgDialogVisible: false,
      oftenPeopleDialogVisible: false,
      dialogImageUrl: '',
      textarea: '',
      backMsg: '',
      popover: false,
      formData: [],
      deptName: '',
      isAdmin: false,
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
    this.getByid();
    console.log('userInfo', this.userInfo);
    this.isAdmin =
      this.userInfo.roles.map((item) => item.roleName).includes('管理员') || this.userInfo.divisionCode == '330106';
  },
  methods: {
    getByid() {
      console.log('userInfo', this.userInfo);

      getListById({ id: this.info.createId, consultingType: this.consultingType }).then((res) => {
        this.formData = res.data.map((item) => {
          return item;
        });
        if (this.formData.length) {
          this.deptName = this.formData[0].deptName;
        }
      });
      // axios({
      //   method: 'get',
      //   url: `/${this.url}/getListById`,
      //   params: { id: this.propsId, consultingType: this.consultingType },
      // }).then((res) => {
      //   this.formData = res.map((item) => {
      //     return item;
      //   });
      //   if (this.formData.length) {
      //     this.deptName = this.formData[0].deptName;
      //   }
      // });
    },
    handleClose() {
      this.$emit('close');
    },

    viewImg(url) {
      this.dialogImageUrl = url;
      this.imgDialogVisible = true;
    },
    saveItem() {
      if (!this.backMsg) {
        this.$message.error('请输入内容');
        return;
      }
      addConsulting({
        targetUserId: this.info.createId,
        content: this.backMsg,
        type: 1,
        consultingType: this.consultingType,
        isFile: '0',
      }).then((res) => {
        this.getByid();
        this.backMsg = '';
      });
      // axios({
      //   method: 'post',
      //   url: `/${this.url}/add`,
      //   data: { targetUserId: this.propsId, content: this.backMsg, type: 1, consultingType: this.consultingType },
      // }).then((res) => {
      //   this.getByid();
      //   this.backMsg = '';
      // });
    },
    oftenOrgClose() {
      this.oftenPeopleDialogVisible = false;
    },
    oftenOrgSuccess(data) {
      console.log(data);
      setDeptId({ receiveDeptId: data[0].id, createId: this.info.createId }).then((res) => {
        this.oftenPeopleDialogVisible = false;
        this.getByid();
      });
    },
    closeTag(row) {
      setDeptId({ receiveDeptId: '', createId: this.info.createId }).then((res) => {
        this.getByid();
      });
      // axios({
      //   url: `/${this.url}/setDeptId`,
      //   method: 'get',
      //   params: {
      //     deptId: '',
      //     createdBy: this.showRow.userId,
      //   },
      // }).then((res) => {
      //   this.getList();
      // });
    },
    openDialog() {
      this.oftenPeopleDialogVisible = true;
    },
  },
};
</script>

<style lang="scss">
.el-tag {
  cursor: pointer;
}
</style>
<style scoped lang="scss">
.directorMailboxInfo {
  .change-box {
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    padding: 16px 0px;
    box-sizing: border-box;
    .el-tag {
      margin-right: 10px;
    }
  }
  .msg-box {
    .item {
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
      .back {
        color: #1890ff;
        cursor: pointer;
      }
      .title-icon {
        width: 20px;
        height: 20px;
        box-sizing: border-box;
        padding: 2px;
        color: #fff;
      }
      .yellow {
        background: #f48b1c;
        margin-right: 6px;
      }
      .green {
        background: #09887c;
      }
    }
  }
}
.popover-box {
  .popover-title {
    border-bottom: 1px solid #eee;
    padding-bottom: 6px;
    margin-bottom: 6px;
    box-sizing: border-box;
  }
  .dialog-footer {
    margin-top: 10px;
    display: flex;
    justify-content: flex-end;
  }
}
.back-user {
  margin: 0 6px;
}
.back-info {
  color: #51aba2;
}
.back-msg {
  margin-top: 90px;
}
.mgs-text {
  width: 90%;
  display: flex;
  justify-content: space-between;
  .text-left {
    display: flex;
    width: 70%;
  }
}
.back-img {
  width: 100px;
  height: 100px;
  cursor: pointer;
}
.img-dialog {
  ::v-deep .el-dialog__header {
    border-bottom: none;
  }
}
</style>
