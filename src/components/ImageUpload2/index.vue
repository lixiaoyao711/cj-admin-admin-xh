<template>
  <div class="index">
    <el-upload
      :action="uploadImgUrl"
      :headers="headers"
      list-type="picture-card"
      :before-upload="handleBeforeUpload"
      :on-success="handleUploadSuccess"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :limit="limit"
      :file-list="fileList"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <!-- 上传提示 -->
    <div class="el-upload__tip" slot="tip" v-if="showTip">
      请上传
      <template v-if="fileSize">
        大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b>
      </template>
      <template v-if="fileType">
        格式为 <b style="color: #f56c6c">{{ fileType.join('/') }}</b>
      </template>
      的文件
    </div>
    <el-dialog :visible.sync="dialogVisible" title="预览" width="800" append-to-body>
      <img :src="dialogImageUrl" style="display: block; max-width: 100%; margin: 0 auto" />
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth';
export default {
  props: {
    value: [String, Object, Array],
    // 图片数量限制
    limit: {
      type: Number,
      default: 9,
    },
    // 大小限制(MB)
    fileSize: {
      type: Number,
      default: 5,
    },
    // 文件类型, 例如['png', 'jpg', 'jpeg']
    fileType: {
      type: Array,
      default: () => ['png', 'jpg', 'jpeg'],
    },
    // 是否显示提示
    isShowTip: {
      type: Boolean,
      default: true,
    },
    //是否展示图片列表
    showFileList: {
      type: Boolean,
      default: true,
    },
  },
  components: {},
  data() {
    return {
      //附件相关
      uploadImgUrl: process.env.VUE_APP_BASE_API + '/system/oss/upload', // 上传的图片服务器地址
      dialogVisible: false,
      dialogImageUrl: '',
      fileList: [],
      headers: {
        Authorization: 'Bearer ' + getToken(),
      },
    };
  },
  computed: {
    // 是否显示提示
    showTip() {
      return this.isShowTip && (this.fileType || this.fileSize);
    },
  },
  watch: {
    value: {
      handler(val) {
        if (val) {
          const list = JSON.parse(val);
          console.log('list', list);
          // 然后将数组转为对象数组
          this.fileList = list.map((item) => {
            // 此处name使用ossId 防止删除出现重名
            item = { name: item.name, url: this.baseOss + item.ossId, ossId: item.ossId, type: item.type };
            return item;
          });
        } else {
          this.fileList = [];
          return [];
        }
      },
      deep: true,
      immediate: true,
    },
  },
  created() {},
  mounted() {},
  methods: {
    // -------------------附件上传------------------
    // 上传前loading加载
    handleBeforeUpload(file) {
      let isImg = false;
      if (this.fileType.length) {
        let fileExtension = '';
        if (file.name.lastIndexOf('.') > -1) {
          fileExtension = file.name.slice(file.name.lastIndexOf('.') + 1);
        }
        isImg = this.fileType.some((type) => {
          if (file.type.indexOf(type) > -1) return true;
          if (fileExtension && fileExtension.indexOf(type) > -1) return true;
          return false;
        });
      } else {
        isImg = file.type.indexOf('image') > -1;
      }

      if (!isImg) {
        this.$modal.msgError(`文件格式不正确, 请上传${this.fileType.join('/')}图片格式文件!`);
        return false;
      }
      if (this.fileSize) {
        const isLt = file.size / 1024 / 1024 < this.fileSize;
        if (!isLt) {
          this.$modal.msgError(`上传头像图片大小不能超过 ${this.fileSize} MB!`);
          return false;
        }
      }
      // this.$modal.loading('正在上传图片，请稍候...');
    },
    handleRemove(file, fileList) {
      this.$emit('input', this.listToString(fileList));
    },
    handleUploadSuccess(res, file, fileList) {
      this.$emit('input', this.listToString(fileList));
    },
    // 将list转换成指定的格式
    listToString(list) {
      console.log(list);
      const backList = list.map((item) => {
        return {
          name: item.name,
          ossId: item.ossId || item.response.data.ossId,
          type: item.type || item.raw.type,
          // url: item.url || this.baseOss + item.response.data.ossId,
        };
      });
      console.log('backList', backList);
      return JSON.stringify(backList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
  },
};
</script>

<style scoped lang="scss">
.index {
}
</style>
