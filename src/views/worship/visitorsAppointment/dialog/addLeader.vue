<template>
  <div class="addLeader">
    <el-dialog
      :title="titleName"
      append-to-body
      :visible.sync="dialogVisible"
      width="800px"
      :before-close="handleClose"
    >
      <el-form ref="formData" :model="formData" :rules="rules" label-width="100px">
        <!-- // 人员详情新建||编辑自动填充被接访人并且不可更改 -->
        <el-form-item label="被接访人：" prop="name">
          <el-input
            :disabled="titleName === '详情' || titleName === '人员详情新建' || titleName === '人员详情编辑'"
            v-model="formData.name"
            @focus="showPeopleSelect = true"
            readonly
          ></el-input>
        </el-form-item>
        <el-row v-for="(item, index) in convenerList">
          <el-col :span="11">
            <el-form-item label="召集人:" required>
              <el-input :disabled="titleName === '详情'" v-model="item.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="职务:" required>
              <el-input :disabled="titleName === '详情'" v-model="item.work"></el-input>
            </el-form-item>
          </el-col>
          <i
            @click="removeConvener(index)"
            v-if="convenerList.length > 1 && titleName !== '详情'"
            class="el-icon-remove-outline"
          ></i>
        </el-row>
        <el-form-item>
          <el-tag v-if="titleName !== '详情'" @click="addConvener" type="info" effect="plain">添加召集人</el-tag>
        </el-form-item>
        <el-row v-for="(item, index) in participantsList">
          <el-col :span="11">
            <el-form-item label="参加人:" required>
              <el-input :disabled="titleName === '详情'" v-model="item.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="职务:" required>
              <el-input :disabled="titleName === '详情'" v-model="item.work"></el-input>
            </el-form-item>
          </el-col>
          <i
            @click="removeParticipants(index)"
            v-if="participantsList.length > 1 && titleName !== '详情'"
            class="el-icon-remove-outline"
          ></i>
        </el-row>
        <el-form-item>
          <el-tag v-if="titleName !== '详情'" @click="addParticipants" type="info" effect="plain">添加参加人</el-tag>
        </el-form-item>
        <div class="line"></div>

        <el-row>
          <el-col :span="12">
            <el-form-item label="接访日期：" prop="visitTime">
              <el-date-picker
                :disabled="titleName === '详情'"
                v-model="formData.visitTime"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属镇街：" prop="departCode">
              <!-- <el-cascader
                :disabled="userinfo.departCode.length > 1 || titleName === '详情'"
                :props="{ checkStrictly: true }"
                v-model="formData.departCode"
                :options="dictMap.addDistrict"
              ></el-cascader> -->
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="接访地点：" prop="">
          <el-input :disabled="titleName === '详情'" v-model="formData.visitAddress"></el-input>
        </el-form-item>
        <el-form-item label="接访内容：" prop="content">
          <el-input
            :disabled="titleName === '详情'"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 6 }"
            placeholder="请输入内容"
            v-model="formData.content"
            resize="none"
          ></el-input>
        </el-form-item>
        <el-form-item label="上传照片：">
          <el-upload
            :disabled="titleName === '详情'"
            action="/common/upload"
            list-type="picture-card"
            :accept="accept.join(',')"
            :on-preview="handlePictureCardPreview"
            :on-success="handleAvatarSuccess"
            :on-remove="handleRemove"
            :file-list="fileList"
            :headers="headers"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <span class="upload-type">支持上传照片或视频</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="saveItem">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="imgDialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
    <!-- <PeopleSelect
      :isRadio="true"
      v-if="showPeopleSelect"
      @success="peopleSelectSuccess"
      @close="showPeopleSelect = false"
      :config="{ multiple: false }"
    ></PeopleSelect> -->
  </div>
</template>

<script>
// import PeopleSelect from '@/components/peopleSelect.vue';
// import { mapState } from 'vuex';
export default {
  inject: ['dad'],
  props: {
    propsData: Object,
    titleName: String,
  },
  components: {
    //  PeopleSelect
  },
  data() {
    return {
      dialogVisible: true,
      showPeopleSelect: false,
      accept: ['.jpg', '.png', '.avi', '.wmv', '.mpeg', '.mp4'],
      rules: {
        name: [{ required: true, message: '请选择被接访人', trigger: 'change' }],
        visitTime: [{ required: true, message: '请选择接访日期', trigger: 'blur' }],
        departCode: [{ required: true, message: '请选择所属镇街', trigger: 'blur' }],
      },
      convenerList: [
        {
          name: '',
          work: '',
        },
      ],
      participantsList: [
        {
          name: '',
          work: '',
        },
      ],
      formData: {
        name: '',
        participants: '',
        convener: '',
      },
      fileList: [],
      dialogImageUrl: '',
      imgDialogVisible: false,
      deleteFile: [],
      headers: {
        Authorization: sessionStorage.token,
      },
    };
  },
  computed: {
    // ...mapState(['userinfo', 'dictMap']),
  },
  watch: {},
  created() {},
  mounted() {
    // 有id代表编辑
    console.log(this.propsData);
    if (this.propsData.id) {
      this.formData = this.propsData;
      // this.$nextTick(() => {
      this.fileList = this.propsData?.filePath.map((item) => {
        item.postUrl = item.url;
        // 视频的样式
        let videoTypes = 'mp4,wav,avi,ram,rmvb,mpg,flv,mov';
        // 拿到当前文件后缀名,如果不是图片提示不支持预览
        let suffix = item.url.split('.')[item.url.split('.').length - 1];
        // 视频文件添加一个默认图片
        if (videoTypes.indexOf(suffix) > -1) {
          item.url = 'https://img-qn.51miz.com/Element/00/22/73/86/03d5a825_E227386_4d1abb2c.png';
        }
        return item;
      });
      // });
      console.log(this.formData.convener.split(';'));
      this.convenerList = this.formData.convener.split(';').map((item) => {
        console.log(item);
        return {
          name: item.split(',')[0],
          work: item.split(',')[1],
        };
      });
      this.participantsList = this.formData.participants.split(';').map((item) => {
        console.log(item);
        return {
          name: item.split(',')[0],
          work: item.split(',')[1],
        };
      });
    }
    // 人员详情新建||编辑自动填充被接访人并且不可更改
    if (this.titleName === '人员详情新建' || this.titleName === '人员详情编辑') {
      // this.formData.name = this.dad.userinfo.name;
      // this.formData.retireId = this.dad.userinfo.id;
    }
    console.log(this.participantsList);
    console.log(this.convenerList);
  },
  methods: {
    handleClose() {
      this.$emit('close');
    },
    addConvener() {
      this.convenerList.push({
        name: '',
        work: '',
      });
    },
    addParticipants() {
      this.participantsList.push({
        name: '',
        work: '',
      });
    },
    removeConvener(index) {
      this.convenerList.splice(index, 1);
    },
    removeParticipants(index) {
      this.participantsList.splice(index, 1);
    },
    saveItem() {
      if (this.titleName === '详情') {
        this.handleClose();
        return;
      }
      // if (this.fileList.length == 0) {
      //   this.$message.error('请插入图片');
      //   return;
      // }
      // this.formData.filePath = this.fileList.map(e => {
      //   let { id, name, url, postUrl } = e;
      //   return { id, name, url: postUrl };
      // });
      // this.formData.delFileId = this.deleteFile.map(e => e.id).join(',');
      // this.formData.participants = '';
      // this.formData.convener = '';
      // if (this.participantsList.some(item => item.name === '' || item.work === '')) {
      //   this.$message.error(' 请检查参加人输入是否合法');
      //   return;
      // } else {
      //   this.formData.participants = this.participantsList.map(item => `${item.name},${item.work}`).join(';');
      // }
      // if (this.convenerList.some(item => item.name === '' || item.work === '')) {
      //   this.$message.error('请检查召集人输入是否合法');
      //   return;
      // } else {
      //   this.formData.convener = this.convenerList.map(item => `${item.name},${item.work}`).join(';');
      // }
      // console.log(this.formData.participants);
      // this.$refs.formData.validate(val => {
      //   if (val) {
      //     axios({
      //       url: `/leadershipVisit/${this.formData.id ? 'update' : 'add'}`,
      //       method: 'post',
      //       data: { ...this.formData, departCode, departName },
      //     }).then(res => {
      //       this.$message.success('操作成功');
      //       this.handleClose();
      //     });
      //   }
      // });
    },
    peopleSelectSuccess(people) {
      console.log(people);
      this.$set(this.formData, 'name', people.name);
      this.formData.retireId = people.id;
      this.showPeopleSelect = false;
    },
    // 文件上传相关
    handleAvatarSuccess(res, file, fileList) {
      console.log(fileList);
      this.fileList = fileList;
      // file.url = res.data.url;
      // 视频的样式
      let videoTypes = 'mp4,wav,avi,ram,rmvb,mpg,flv,mov';
      // 拿到当前文件后缀名,如果不是图片提示不支持预览
      let suffix = res.data.url.split('.')[res.data.url.split('.').length - 1];
      // 视频文件添加一个默认图片
      if (videoTypes.indexOf(suffix) > -1) {
        file.url = 'https://img-qn.51miz.com/Element/00/22/73/86/03d5a825_E227386_4d1abb2c.png';
      } else {
        file.url = res.data.url;
      }
      file.postUrl = res.data.url;

      this.dialogImageUrl = URL.createObjectURL(file.raw);
    },

    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.fileList = fileList;
      this.deleteFile.push(file);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.imgDialogVisible = true;
    },
  },
};
</script>

<style scoped lang="scss">
.addLeader {
  .el-tag {
    cursor: pointer;
  }
  .el-icon-remove-outline {
    margin-left: 10px;
    line-height: 32px;
    cursor: pointer;
  }
  .line {
    height: 10px;
    background: #f2f2f2;
    margin-bottom: 20px;
  }
  .upload-type {
    color: #a7a9aa;
  }
}
.el-icon-remove-outline {
  margin-left: 16px;
  line-height: 34px;
  cursor: pointer;
}
.el-tag {
  cursor: pointer;
}
</style>
