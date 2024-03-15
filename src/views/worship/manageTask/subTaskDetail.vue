<template>
  <div class="right">
    <div class="task-detail">
      <section>
        <header>
          <div class="title">任务详情</div>
          <div class="state">
            任务状态：
            <span v-if="!showStateSelect">
              <dict-tag :options="dict.type.sys_worship_managetaskstate" :value="form.state" />
            </span>
            <span v-else>
              <el-select class="stateSelect" v-model="form.state" @change="handleStateChange" size="mini">
                <el-option key="0" label="待开始" value="0" />
                <el-option key="1" label="进行中" value="1" />
                <el-option key="2" label="已完成" value="2" />
                <el-option v-if="form.state === '3'" key="3" label="已滞后" value="3" />
              </el-select>
            </span>
            <span
              v-if="!showStateSelect && form.state !== '2' && hasAuth"
              :disabled="form.childTaskCount > 0"
              class="update-btn"
              @click="showStateSelect = true"
              >更新</span
            >
          </div>
        </header>
        <div class="steps">
          <el-steps :active="steps" align-center>
            <el-step title="待开始"></el-step>
            <el-step title="进行中"></el-step>
            <el-step title="已完成"></el-step>
          </el-steps>
        </div>
        <div class="desc">
          <div class="line">所属部门：{{ form.deptName }}</div>
          <div class="line">责任人：{{ form.responsibleEmployeeCode }}</div>
          <div class="line">协作人：{{ form.collaboratorEmployeeCode }}</div>
          <div class="line">创建时间：{{ form.createTime }}</div>
          <div class="line">截止时间：{{ form.deadlineTime }}</div>
          <div class="line">创建人：{{ form.createBy }}</div>
        </div>
      </section>
      <section v-if="form.state === '2'">
        <header>
          <div class="title">任务评价</div>
          <div class="rate">
            <el-rate :value="form.evaluateScore" disabled></el-rate>
            <span>{{ form.evaluateContent }}</span>
          </div>
          <el-button v-if="hasAuth" class="rate-btn" type="primary" size="mini" @click="open = true">{{
            form.evaluateScore ? '修改评价' : '评价'
          }}</el-button>
        </header>
        <el-dialog title="任务评价" :visible.sync="open" width="35%" append-to-body>
          <el-form ref="form" :model="form" label-width="120px">
            <el-form-item label="评价分数：" prop="evaluateScore">
              <el-rate v-model="form.evaluateScore"></el-rate>
            </el-form-item>
            <el-form-item label="评价内容：" prop="evaluateContent">
              <el-input v-model="form.evaluateContent" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="open = false">取 消</el-button>
            <el-button :loading="buttonLoading" type="primary" @click="handleSubmit">保 存</el-button>
          </div>
        </el-dialog>
      </section>
    </div>
    <div class="words">
      <header>
        <div class="title">任务动态</div>
      </header>
      <div class="list">
        <div class="item" v-for="item in logList" :key="item.id">
          <div class="line">
            <span class="user">{{ item.createName }}</span>
            <div v-if="item.isFile === '1'">
              <img
                v-if="item.fileType === 'img'"
                @click="openPath(item.url)"
                class="content image"
                :src="item.url"
                alt=""
              />
              <span v-else @click="openPath(item.url)" class="content image">{{ item.name }}</span>
              <span class="date">{{ item.createTime }}</span>
            </div>
            <div v-else>
              <span class="content">{{ item.content }}</span>
              <span class="date">{{ item.createTime }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="submit" v-if="manageSubtaskId && hasAuth && form.state !== '2'">
        <el-input v-model="wordForm.content"></el-input>
        <el-button type="text" @click="addLog">发送</el-button>
        <el-upload
          class="upload-demo"
          :action="uploadFileUrl"
          :before-upload="handleBeforeUpload"
          :on-error="handleUploadError"
          :on-success="msgFileSuccess"
          :headers="headers"
          multiple
          :show-file-list="false"
        >
          <el-button type="text"> 上传文件</el-button>
        </el-upload>
      </div>
    </div>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth';
import { listByIds } from '@/api/system/oss';
import { getManageTask, updateManageTask } from '@/api/worship/manageTask';
import { listManageTaskDynamic, addManageTaskDynamic } from '@/api/worship/manageTaskDynamic';
export default {
  props: ['manageSubtaskId', 'hasAuth'],
  dicts: ['sys_worship_managetaskstate'],
  components: {},
  data() {
    return {
      form: {},
      wordForm: {},
      showStateSelect: false,
      editModel: false,
      rateEdit: false,
      open: false,
      buttonLoading: false,
      fileList: [],
      logList: [],
      imgType: ['png', 'jpg', 'jpeg', 'gif'],
      baseUrl: process.env.VUE_APP_BASE_API,
      headers: {
        Authorization: 'Bearer ' + getToken(),
      },
      uploadFileUrl: process.env.VUE_APP_BASE_API + '/system/oss/upload', // 上传文件服务器地址
    };
  },
  computed: {
    steps() {
      const data = Number(this.form.state) + 1 == 4 ? 2 : Number(this.form.state) + 1;
      return data;
    },
  },
  watch: {
    manageSubtaskId: {
      handler(id) {
        this.getData();
        this.showStateSelect = false;
      },
    },
  },
  mounted() {},
  methods: {
    async getData() {
      this.tableData = [];
      getManageTask(this.manageSubtaskId).then((res) => {
        this.form = res.data;
        this.form.appraise = this.form.appraise | 0;
      });
      listManageTaskDynamic({ taskId: this.manageSubtaskId }).then(async (res) => {
        this.logList = await Promise.all(
          res.rows.map(async (item) => {
            if (item.isFile === '1') {
              await this.getImg(item);
            }
            return item;
          })
        );
      });
    },
    async getImg(item) {
      await listByIds(item.content).then((res) => {
        let file = res.data[0];
        let path = '',
          fileType = '';
        if (file.fileSuffix) {
          path = file.fileSuffix.split('.')[file.fileSuffix.split('.').length - 1];
          this.imgType.find((e) => e == path) ? (fileType = 'img') : '';
        }
        item.fileType = fileType;
        item.name = file.originalName;
        item.url = file.url;
        item.ossId = file.ossId;
      });
      return item;
    },
    openPath(url) {
      console.log(url);
      window.open(url);
    },
    handleStateChange() {
      this.handleSubmit();
    },
    handleSubmit() {
      let formData = Object.assign({}, this.form);
      updateManageTask(formData).then((res) => {
        this.$message.success('操作成功');
        this.open = false;
        this.getData();
      });
    },
    addLog() {
      if (!this.wordForm.content) {
        this.$message.warning('请输入动态');
        return;
      }
      this.wordForm.taskId = this.form.id;
      this.wordForm.isFile = 0;
      addManageTaskDynamic(this.wordForm).then((res) => {
        this.getData();
        this.$message.success('发送成功');
        this.wordForm.content = '';
      });
    },
    addFileLog(content, filePath) {
      let obj = {
        content: content,
        isFile: 1,
        taskId: this.form.id,
      };
      addManageTaskDynamic(obj).then((res) => {
        this.getData();
        this.$message.success('发送成功');
        this.wordForm.content = '';
      });
    },
    // 上传成功回调
    msgFileSuccess(res, file, fileList) {
      console.log('msgFileSuccess', res, file);
      this.$modal.closeLoading();
      this.addFileLog(res.data.ossId);
    },
    // 上传前
    handleBeforeUpload(file) {
      this.$modal.loading('正在上传文件，请稍候...');
      return true;
    },
    // 上传失败
    handleUploadError(err) {
      this.$modal.msgError('上传文件失败，请重试');
      this.$modal.closeLoading();
    },
  },
};
</script>

<style scoped lang="scss">
.right {
  flex: 6;
  display: flex;
  background: #fff;
  header {
    display: flex;
    justify-content: space-between;
    .title {
      font-size: 16px;
      font-weight: bold;
      margin: 0;
    }
  }
  .task-detail {
    flex: 6;
    border-right: 1px solid #ddd;
    section {
      padding: 16px 24px;
      &:last-child {
        border-bottom: 1px solid #eee;
        border-top: 1px solid #eee;
      }
    }
    .state {
      height: 28px;
      display: flex;
      align-items: center;
    }
    .steps {
      margin: 16px 0;
    }
    .line {
      line-height: 40px;
    }
    .rate {
      flex: 1;
      overflow: hidden;
      margin-left: 10px;
    }
    .el-rate {
      margin-bottom: 6px;
      transform: scale(1.2);
      transform-origin: left center;
    }
    .rate-btn {
      height: 28px;
    }
    .update-btn {
      margin-left: 10px;
      color: #1890ff;
      cursor: pointer;
      font-size: 14px;
    }
    .detail {
      align-items: flex-start;
    }
    .content {
      flex: 1;
      margin-left: 10px;
    }
    .imgs {
      img {
        width: 100px;
        height: 100px;
        margin-right: 10px;
        margin-bottom: 10px;
      }
    }
  }
  .words {
    flex: 4;
    padding: 16px 24px;
    .list {
      height: calc(100% - 73px);
      color: #333;
      margin-top: 16px;
      .item {
        margin-bottom: 16px;
      }
      .line {
        display: flex;
        .user {
          margin-right: 10px;
        }
        .image {
          color: #247fff;
          cursor: pointer;
          width: 60px;
          height: 60px;
          object-fit: contain;
        }
      }
      .date {
        color: #999;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 12px;
        margin-top: 10px;
      }
    }
    .submit {
      display: flex;
      .el-input {
        flex: 1;
        margin-right: 16px;
        input {
          background: #eee;
        }
      }
    }
  }
}
.right .task-detail .feedback,
.right .task-detail .upload,
.right .task-detail .date {
  margin-bottom: 10px;
}
.upload-demo {
  margin-left: 10px;
}
.stateSelect {
  width: 6vw;
}
</style>
