<template>
  <div class="signBoard">
    <el-dialog title="签名" :visible.sync="dialogVisible" width="800px" :before-close="handleClose">
      <div class="page-content">
        <div class="content">
          <vue-esign ref="esign" :width="800" :height="500" :line-width="8" line-color="#000" bg-color="#FFF" />
        </div>
        <div class="flex">
          <el-button type="danger" @click="handleReset">重签</el-button>
          <!-- <el-button type="primary" @click="viewGenerate">预览</el-button> -->
          <el-button type="success" @click="handleGenerate">确认</el-button>
        </div>
        <el-image-viewer
          v-if="showViewer"
          :on-close="
            () => {
              showViewer = false;
            }
          "
          :url-list="[resultImg]"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {},
  components: {
    'el-image-viewer': () => import('element-ui/packages/image/src/image-viewer'), // 预览签名图片的插件，无需下载，elementui自带
  },
  data() {
    return {
      dialogVisible: true,
      // 签名画布相关
      lineWidth: 8, // 画笔粗细
      lineColor: '#000', // 画笔颜色
      bgColor: '#fff', // 画布背景颜色
      isCrop: false, // 是否剪裁
      showViewer: false, // 预览签名
      resultImg: '', // base64图片};
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    handleClose() {
      this.$emit('close', this.resultImg);
    },
    // 签名画布相关
    handleReset() {
      this.$refs['esign'].reset(); // 清空画布
    },
    // viewGenerate() {
    //   this.$refs['esign']
    //     .generate()
    //     .then(res => {
    //       this.resultImg = res; // 得到了签字生成的base64图片
    //       console.log(this.$Base64(this.resultImg));
    //       // this.handleClose();
    //       this.showViewer = true;
    //     })
    //     .catch(() => {
    //       // 没有签名，点击生成图片时调用
    //       this.$message({
    //         message: '未签名!',
    //         type: 'warning',
    //       });
    //     });
    // },
    // base64转blob
    base64ToBlob(base64Data) {
      let arr = base64Data.split(','),
        fileType = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        l = bstr.length,
        u8Arr = new Uint8Array(l);

      while (l--) {
        u8Arr[l] = bstr.charCodeAt(l);
      }
      return new Blob([u8Arr], {
        type: fileType,
      });
    },
    // blob转file
    blobToFile(newBlob, fileName) {
      newBlob.lastModifiedDate = new Date();
      newBlob.name = fileName;
      return newBlob;
    },
    handleGenerate() {
      this.$refs['esign']
        .generate()
        .then((res) => {
          this.resultImg = JSON.parse(JSON.stringify(res)); // 得到了签字生成的base64图片
          this.handleClose();

          // var file1 = new File(['file', this.resultImg], 'file');

          // fetch(`/common/upload`, {
          //   method: 'POST', // *GET, POST, PUT, DELETE, etc.
          //   headers: {
          //     Authorization: sessionStorage.token,
          //   },
          //   body: { file1 },
          // }).then(async img => {
          //   console.log(await img.json());
          // });

          // // axios({
          // //   url: '/common/upload',
          // //   method: 'post',
          // //   data: formData,
          // // }).then(res => {
          // //   console.log(res);
          // // });
        })
        .catch(() => {
          // 没有签名，点击生成图片时调用
          this.$message({
            message: '未签名!',
            type: 'warning',
          });
        });
    },
  },
};
</script>

<style scoped lang="scss">
.signBoard {
  .content {
    border: 1px solid #f1f1f1;
  }
  .flex {
    margin: 10px;
    display: flex;
    align-content: center;
  }
  ::v-deep .el-image-viewer {
    z-index: 9999;
  }
}
</style>
