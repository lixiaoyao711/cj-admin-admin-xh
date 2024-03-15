<template>
  <div class="component-upload-image">
    <el-upload
      multiple
      :action="uploadImgUrl"
      list-type="picture-card"
      :on-success="handleUploadSuccess"
      :before-upload="handleBeforeUpload"
      :limit="limit"
      :on-error="handleUploadError"
      :on-exceed="handleExceed"
      ref="imageUpload"
      :on-remove="handleDelete"
      :show-file-list="showFileList"
      :headers="headers"
      :file-list="fileList"
      :on-preview="handlePictureCardPreview"
      :class="{ hide: this.fileList.length >= this.limit || disabled }"
      :disabled="disabled"
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
import { listByIds, delOss } from '@/api/system/oss';

export default {
  props: {
    value: [String, Object, Array],
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false,
    },
    // 图片数量限制
    limit: {
      type: Number,
      default: 5,
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
  data() {
    return {
      number: 0,
      uploadList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      hideUpload: false,
      baseUrl: process.env.VUE_APP_BASE_API,
      uploadImgUrl: process.env.VUE_APP_BASE_API + '/system/oss/upload', // 上传的图片服务器地址
      headers: {
        Authorization: 'Bearer ' + getToken(),
      },
      fileList: [],
    };
  },
  watch: {
    value: {
      async handler(val) {
        if (val) {
          // 首先将值转为数组
          let list;
          if (Array.isArray(val)) {
            list = val;
          } else {
            const regex = /^(http:\/\/|https:\/\/)(.*)$/; // 定义正则表达式
            if (val && val.length > 0) {
              let arr = val.split(',');
              let urlFiles = []; // 数据直接为http图片链接地址的文件（可能外部导入）
              let ossIdFiles = []; // 数据为ossId的图片文件
              let httpFileArr = arr.filter((item) => {
                //进行文件链接匹配操作
                return item.match(regex);
              });
              urlFiles = httpFileArr.map((item) => {
                return {
                  name: item,
                  url: item,
                };
              });
              let ossIdsArr = arr.filter((item) => {
                //进行文件链接匹配操作
                return !item.match(regex);
              });
              let ossIds = ossIdsArr.join(',');
              // console.log('🚀  httpFileArr,ossIdsArr', httpFileArr, ossIdsArr);
              // 根据ossIds 获取文件列表
              if (ossIds) {
                await listByIds(ossIds).then((res) => {
                  list = res.data;
                });
                // 然后将数组转为对象数组
                ossIdFiles = list.map((item) => {
                  // 此处name使用ossId 防止删除出现重名
                  item = { name: item.ossId, url: item.url, ossId: item.ossId };
                  return item;
                });
              }

              this.fileList = [...urlFiles, ...ossIdFiles];
              console.log(this.fileList);
            }
          }
        } else {
          this.fileList = [];
          return [];
        }
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    // 是否显示提示
    showTip() {
      return this.isShowTip && (this.fileType || this.fileSize);
    },
  },
  methods: {
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
      this.$modal.loading('正在上传图片，请稍候...');
      this.number++;
    },
    // 文件个数超出
    handleExceed() {
      this.$modal.msgError(`上传文件数量不能超过 ${this.limit} 个!`);
    },
    // 上传成功回调
    handleUploadSuccess(res, file) {
      if (res.code === 200) {
        this.uploadList.push({ name: res.data.fileName, url: res.data.url, ossId: res.data.ossId });
        this.uploadedSuccessfully();
      } else {
        this.number--;
        this.$modal.closeLoading();
        this.$modal.msgError(res.msg);
        this.$refs.imageUpload.handleRemove(file);
        this.uploadedSuccessfully();
      }
    },
    // 删除图片
    handleDelete(file) {
      const findex = this.fileList.map((f) => f.name).indexOf(file.name);
      if (findex > -1) {
        let ossId = this.fileList[findex].ossId;
        delOss(ossId);
        this.fileList.splice(findex, 1);
        this.$emit('input', this.listToString(this.fileList));
      }
    },
    // 上传失败
    handleUploadError(res) {
      this.$modal.msgError('上传图片失败，请重试');
      this.$modal.closeLoading();
    },
    // 上传结束处理
    uploadedSuccessfully() {
      if (this.number > 0 && this.uploadList.length === this.number) {
        this.fileList = this.fileList.concat(this.uploadList);
        this.uploadList = [];
        this.number = 0;
        this.$emit('input', this.listToString(this.fileList));
        this.$modal.closeLoading();
      }
    },
    // 预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 对象转成指定字符串分隔
    listToString(list, separator) {
      let strs = '';
      separator = separator || ',';
      for (let i in list) {
        if (list[i].ossId) {
          strs += list[i].ossId + separator;
        }
      }
      return strs != '' ? strs.substr(0, strs.length - 1) : '';
    },
  },
};
</script>
<style scoped lang="scss">
// .el-upload--picture-card 控制加号部分
::v-deep.hide .el-upload--picture-card {
  display: none;
}
// 去掉动画效果
::v-deep .el-list-enter-active,
::v-deep .el-list-leave-active {
  transition: all 0s;
}

::v-deep .el-list-enter,
.el-list-leave-active {
  opacity: 0;
  transform: translateY(0);
}
</style>
