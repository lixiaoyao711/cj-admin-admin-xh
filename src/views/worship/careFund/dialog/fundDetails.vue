<template>
  <div class="fileInfo app-container" @click="hideMaskPopup">
    <header>
      <div @click="toPath" class="back mr10"><i class="el-icon-back"></i>返回</div>
      <span class="title">{{ formData.entryName }}</span>
    </header>
    <main>
      <div class="project">
        <div class="title">项目详情</div>
        <el-form :inline="true" :model="formData" class="form demo-form-inline">
          <el-row>
            <el-col :span="6">
              <el-form-item label="项目开始时间:">
                <span>{{ formData.startTime }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="项目结束时间:">
                <span>{{ formData.endTime }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="预计金额:">
                <span>{{ formData.estimatedAmount }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="申请人数:">
                <span>{{ formData.applicantsNum }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="通过人数:">
                <span>{{ formData.passersNum }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="实际使用金额:">
                <span>{{ formData.actualAmount }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item label="">
                项目介绍:
                <span> {{ formData.msg }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="附件内容:">
                <fileUpload v-model="formData.fileUrl" :isView="true" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="people">
        <div class="people-title">受惠人员</div>
        <div v-for="(people, index) in formData.assistanceApplicationList" :key="index" class="item">
          <div class="head">
            <div class="left">
              <div class="left-one">
                <span class="name">{{ people.beneficiariesName }}</span>
                <el-tag @click.stop="showLine(people, index)" :type="requestStatusMap[people.passStatus]">{{
                  requestStatusMap[people.passStatus]?.text
                }}</el-tag>
                <div v-if="people.applicationProcessVoList?.length">
                  <span class="mr10 ml10">{{
                    currentLinkMap[
                      people.applicationProcessVoList[people.applicationProcessVoList?.length - 1].currentLink
                    ]
                  }}</span>
                  <span>{{
                    people.applicationProcessVoList[people.applicationProcessVoList?.length - 1].handlingStreets
                  }}</span>
                </div>
              </div>
              <transitionRecord :propsData="people" />
            </div>
            <div>
              <span v-if="people.isZlb" class="vip">来自浙里办</span>
              <el-button type="text">
                <el-popconfirm title="确定删除吗？" @confirm="delItem(people)">
                  <el-button slot="reference" type="text">删除</el-button>
                </el-popconfirm>
              </el-button>
            </div>
          </div>
          <div class="content">
            <div class="text">
              <div class="time">
                <span>申请时间:</span><span>{{ people.createTime }}</span>
              </div>
              <div>
                <span>申请金额:</span><span>{{ people.applicationAmount }}元</span>
              </div>
            </div>
            <div class="text" v-if="people.reason">
              <div class="time">
                <span>原因:</span><span>{{ people.reason }}</span>
              </div>
            </div>
            <div class="img-list">
              <div class="upload">
                <div class="upload-item">
                  <div class="upload-title">基本材料</div>
                  <div class="img-list" v-for="(item, index) in basicsMap" :key="index">
                    <div
                      v-for="(img, index) in people[index + 'Path']"
                      class="demo-image__preview img-item"
                      @click="viewBigImg(img)"
                    >
                      <el-image style="width: 100px; height: 100px" :src="img" :preview-src-list="srcList"> </el-image>
                      <div class="img-title">{{ item }}</div>
                    </div>
                  </div>
                  <el-button @click="editItem(people, 'image')">编 辑</el-button>
                </div>
                <div class="upload-item">
                  <div class="upload-title">公示书</div>
                  <div class="img-list" v-for="(item, index) in communitMap" :key="index">
                    <div
                      v-for="(img, index) in people.communityUrlPath"
                      class="demo-image__preview img-item"
                      @click="viewBigImg(img)"
                    >
                      <el-image style="width: 100px; height: 100px" :src="img" :preview-src-list="srcList"> </el-image>
                      <div class="img-title">{{ item }}</div>
                    </div>
                  </div>
                  <!-- <imageUpload
                    v-model="people.communityUrl"
                    @input="(e) => changeFile(e, people)"
                    :showFileList="false"
                  ></imageUpload> -->
                </div>
                <div class="upload-item">
                  <div class="upload-title">领导批示</div>
                  <div class="img-list" v-for="(item, index) in leaderMap" :key="index">
                    <div
                      v-for="(img, index) in people.signatureLeaderUrlPath"
                      class="demo-image__preview img-item"
                      @click="viewBigImg(img)"
                    >
                      <el-image style="width: 100px; height: 100px" :src="img" :preview-src-list="srcList"> </el-image>
                      <div class="img-title">{{ item }}</div>
                    </div>
                  </div>
                  <imageUpload
                    v-model="people.signatureLeaderUrl"
                    @input="(e) => changeFile(e, people)"
                    :showFileList="false"
                  ></imageUpload>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <approval-detail
      v-if="showApprovalDetail"
      :info="approvalData"
      :currentNode="'info'"
      @close="showApprovalDetail = false"
    />
    <AddBeneficiary
      v-if="showaddBeneficiary"
      :title="'修改受惠人员'"
      :info="activeRow"
      :type="addType"
      @close="showaddBeneficiary = false"
      @success="addSuccess"
    ></AddBeneficiary>
    <!-- <ChangePeople
      v-if="changePeopleDialog"
      type="difficulty"
      @success="peopleSuccess"
      :isRadio="true"
      @close="changePeopleDialog = false"
    ></ChangePeople> -->
    <!-- 预览附件 -->
    <!-- <Swiper v-if="isSwiper" :list="imgList" :carouselIndex="0" @close="isSwiper = false" /> -->
  </div>
</template>

<script>
import { getProjectManagement, updateAssistanceApplication, deleteAssistanceApplication } from '@/api/worship/careFund';
import AddBeneficiary from './addBeneficiary.vue';
import ApprovalDetail from './approvalDetail.vue';
import transitionRecord from '../dialog/transitionRecord.vue';

import { listByIds } from '@/api/system/oss';

export default {
  props: {},
  components: {
    AddBeneficiary,
    ApprovalDetail,
    transitionRecord,
  },
  data() {
    return {
      formData: {},
      approvalData: {},
      iframePath: '',
      workableDialog: false,
      isSwiper: false,
      imgList: [],
      srcList: [],
      activeRow: {},
      addType: 'image',
      showaddBeneficiary: false,
      showApprovalDetail: false,
      workableData: {},
      isShowLineIndex: '0',
      fileMap: {
        1: '身份证或居住证',
        2: '户口簿或租房合同',
        3: '病史诊断证明',
        4: '近一年基本医疗保险查询单',
        5: '退役军人救助申请表',
        6: '社区公示书',
        8: '打款凭证',
      },
      fileMaps: {
        idCardUrl: '身份证或居住证',
        householdBookUrl: '户口簿或租房合同',
        medicalHistoryUrl: '病史诊断证明',
        basicMedicalInsuranceUrl: '近一年基本医疗保险查询单',
        retiredSoldierAssistanceUrl: '退役军人救助申请表',
        communityUrl: '社区公示书',
        paymentVoucher: '打款凭证',
        signatureLeaderUrl: '领导批示',
      },
      basicsMap: {
        idCardUrl: '身份证或居住证',
        householdBookUrl: '户口簿或租房合同',
        medicalHistoryUrl: '病史诊断证明',
        basicMedicalInsuranceUrl: '近一年基本医疗保险查询单',
        retiredSoldierAssistanceUrl: '退役军人救助申请表',
      },
      communitMap: {
        communityUrl: '社区公示书',
      },
      leaderMap: {
        signatureLeaderUrl: '领导批示',
      },
      headers: {
        Authorization: sessionStorage.token,
      },
      recordList: [],
      accept: ['.jpg', '.png'],
      fileList: [],
      communityFileList: [],
      deleteFile: [],
      changeImg: {},
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
      currentLinkMap: {
        0: '社区审批',
        1: '街道审批',
        2: '区级一审',
        3: '上传公示书',
        4: '区级二审',
        5: '完成',
      },
      lineStatusMap: {
        待审批: 'warning',
        待修改: 'primary',
        已提交: 'success',
        未通过: 'danger',
        通过: '',
      },
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      getProjectManagement(this.$route.params.id).then(async (res) => {
        this.formData = res.data;
        for await (const item of this.formData.assistanceApplicationList) {
          this.$set(item, 'isShowLine', false);
          for (const file in this.fileMaps) {
            if (item[file]) {
              const url = await this.getImgList(item[file]);
              this.$set(item, file + 'Path', url);
            }
          }
        }
        console.log('formData', this.formData);
      });
    },
    linkImg(path) {
      window.open(path);
    },
    changeFile(file, row) {
      console.log(file, row);
      updateAssistanceApplication(row).then((res) => {
        // this.$message.success('修改成功');
        this.getData();
      });
    },
    showLine(row, index) {
      console.log(row);
      if (!row.applicationProcessVoList || row.applicationProcessVoList?.length === 0) {
        this.$message.warning('暂无审批记录');
        return;
      }
      if (this.isShowLineIndex !== '0') {
        this.formData.assistanceApplicationList[this.isShowLineIndex].isShowLine = false;
      }
      row.isShowLine = true;
      this.isShowLineIndex = index;
    },
    hideMaskPopup(e) {
      let dom = document.querySelector('.record');
      if (dom && !dom.contains(e.target)) {
        this.formData.assistanceApplicationList[this.isShowLineIndex].isShowLine = false;
      }
    },
    delItem(row) {
      deleteAssistanceApplication(row.id).then((res) => {
        this.$message.success('删除成功');
        // this.$emit('success');
        this.getData();
      });
    },
    editItem(row, type) {
      this.activeRow = JSON.parse(JSON.stringify(row));
      this.activeRow.projectId = this.formData.id;
      this.activeRow.entryName = this.formData.entryName;
      this.addType = type;
      this.showaddBeneficiary = true;
    },
    toPath() {
      this.$router.go(-1);
    },
    changeUpload(img) {
      this.changeImg = img;
      console.log(this.changeImg);
    },
    viewBigImg(url) {
      console.log(url);
      this.$set(this.srcList, 0, url);
    },
    viewImg(row) {
      this.imgList = row.filePath.filter((item) => item.fileType === '7');
      if (this.imgList.length === 0) {
        this.$message.error('没有审批意见可查看');
        return;
      }
      this.isSwiper = true;
    },
    viewInfo(row) {
      this.approvalData = JSON.parse(JSON.stringify(row));
      this.showApprovalDetail = true;
    },
    addSuccess() {
      this.showaddBeneficiary = false;
      // this.$emit('success');
      this.getData();
    },
    // 附件上传相关
    handleSuccess(res, file, fileList) {
      this.fileList = [fileList[fileList.length - 1]];
      file.url = res.data.url;
      let filePath = this.fileList.map((e) => {
        let { id, name, url } = e;
        return { id, name, url, fileType: '8' };
      });
      console.log(filePath);
      this.changeImg.filePath = [...this.changeImg.filePath, ...filePath];
      // careFundPersonUpdate(this.changeImg).then((res) => {
      //   this.$emit('success');
      //   this.$message.success('添加成功');
      //   this.getData();
      // });
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.fileList = fileList;
      this.deleteFile.push(file);
    },
    communitySuccess(res, file, fileList) {
      this.communityFileList = [fileList[fileList.length - 1]];
      file.url = res.data.url;
      let filePath = this.communityFileList.map((e) => {
        let { id, name, url } = e;
        return { id, name, url, fileType: '6' };
      });
      this.changeImg.filePath = [...this.changeImg.filePath, ...filePath];
      // careFundPersonUpdate(this.changeImg).then((res) => {
      //   this.$emit('success');
      //   this.$message.success('添加成功');
      //   this.getData();
      // });
    },
    communityRemove(file, fileList) {
      this.communityFileList = fileList;
      this.deleteFile.push(file);
    },
    handlePreview(file) {
      // console.log(file.url);
      window.open(file.url);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    deleteImg(row, img) {
      console.log(row, img);
      row.filePath = row.filePath.filter((item) => item.id !== img.id);
      row.delFileId = img.id;
      // careFundPersonUpdate(row).then((res) => {
      //   this.$emit('success');
      //   this.$message.success('添加成功');
      //   this.getData();
      // });
    },
    async getImgList(id) {
      const { data } = await listByIds(id);
      let list = data.map((e) => {
        return { name: e.originalName, url: e.url, ossId: e.ossId };
      });
      return list.map((e) => e.url);
    },
  },
};
</script>

<style scoped lang="scss">
.fileInfo {
  header {
    width: 200px;
    font-size: 16px;
    display: flex;
    align-items: center;
    margin-bottom: 18px;
    .back {
      cursor: pointer;
    }
    .people-title {
      font-weight: 700;
      font-size: 26px;
      margin-left: 6px;
    }
  }
  main {
    background-color: #fff;
    padding: 30px;
    box-sizing: border-box;
    .project {
      display: flex;
      border-bottom: 1px solid #a5a5a5;
      .title {
        font-weight: 800;
        font-size: 20px;
        width: 120px;
      }
      .form {
        flex: 1;
      }
    }
    .people {
      margin-top: 22px;
      .title {
        font-weight: 800;
        font-size: 20px;
        width: 120px;
      }
      .item {
        flex: 1;
        background: #f6f6f6;
        padding: 20px;
        box-sizing: border-box;
        margin-top: 16px;
        .head {
          .left {
            position: relative;
            .left-one {
              display: flex;
              align-items: center;
              .icon-box {
                display: flex;
                align-items: center;
              }
              .icon {
                margin: 0 0 0 16px;
                width: 10px;
                height: 10px;
                border-radius: 20px;
                border: 3px solid #1890ff;
                background: #fff;
              }
              .status-text {
                font-size: 16px;
                font-weight: 600;
                color: #000000;
                margin: 0 16px;
              }
              .status-address {
                color: #9f9b9b;
              }
            }
          }
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
          display: flex;
          justify-content: space-between;
        }
        .content {
          .text {
            display: flex;
            margin-top: 10px;
            .time {
              margin-right: 60px;
            }
          }
          .img-list {
            // margin-top: 32px;
            // margin-bottom: 20px;
            display: flex;
            align-items: center;
            text-align: center;
            .img {
              width: 100px;
              margin-top: 16px;
              height: 100px;
              margin-right: 26px;
              cursor: pointer;
            }
          }
        }
        .vip {
          color: #bbb;
          margin-right: 6px;
        }
      }
    }
  }
  .clearfix {
    // height: 22px;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    color: #000000;
    line-height: 22px;
    display: flex;
    justify-content: space-between;
  }
  .upload {
    color: #1890ff;
    .upload-item {
      display: flex;
      margin: 40px 40px 0 40px;
      align-items: center;
      flex-wrap: wrap;
      .upload-demo {
        margin: 0 0 0 40px;
      }

      .upload-title {
        width: 22px;
        height: 80px;
        color: #fff;
        background: #1890ff;
        border-radius: 3px;
        text-align: center;
      }
      .img-list {
        display: flex;
        .img-item {
          position: relative;
          margin: 0 20px 0 10px;
          display: flex;
          justify-content: center;
          flex-direction: column;
          width: 100%;
          align-items: center;
          img {
            width: 80px;
            height: 80px;
            object-fit: contain;
          }
          .image-delete {
            position: absolute;
            bottom: 18px;
            left: 0;
            height: 22%;
            width: 100%;
            background: rgba(0, 0, 0, 0.3);
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
          }
        }
      }
    }
  }
  .upload:hover {
    cursor: pointer;
  }
  .view {
    margin-left: 16px;
    color: #1890ff;
    cursor: pointer;
  }
  .el-tag {
    cursor: pointer;
  }
  ::v-deep .el-upload-list__item-status-label {
    display: none;
  }
  ::v-deep .el-icon-close:before {
    display: none;
  }
}
::v-deep .el-upload--picture-card {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}
::v-deep .el-upload-list__item-thumbnail {
  width: 100px;
  height: 100px;
}
::v-deep .el-upload-list__item {
  width: 100px;
  height: 100px;
}
.component-upload-image {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
<style lang="scss" scope>
.el-popover {
  min-width: 0px;
}
</style>
