<template>
  <el-dialog
    title="评价"
    width="600px"
    :visible.sync="dialogVisible"
    @close="$emit('close')"
    :close-on-click-modal="false"
  >
    <section class="remark">
      <div class="tip"><i class="el-icon-warning"></i>请对本次办事人进行评价</div>
      <div class="score">
        <el-rate v-model="form.appraise" size="medium"></el-rate>
        <div class="desc">{{ appraiseText }}</div>
      </div>
      <textarea v-model="form.logContent" name="" id="" cols="30" rows="5" placeholder="请输入反馈内容"></textarea>
    </section>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSave">提 交</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: ['info'],
  components: {},
  data() {
    return {
      dialogVisible: true,
      fileList: [],
      form: {},
    };
  },
  computed: {
    appraiseText() {
      switch (this.form.appraise) {
        case 1:
          return '很不满意';
        case 2:
          return '不满意';
        case 3:
          return '一般';
        case 4:
          return '满意';
        case 5:
          return '很满意';
        default:
          return '请评分';
      }
    },
  },
  watch: {},
  created() {
    console.log(this.info);
    let { appraise, logContent } = this.info;
    this.form = {
      appraise: appraise | 0,
      logContent,
    };
  },
  methods: {
    handleSave() {
      if (!this.form.appraise) {
        this.$message.warning('请评分');
        return;
      }
      if (!this.form.logContent) {
        this.$message.warning('请填写评价');
        return;
      }
      let formData = Object.assign({}, this.info, this.form, {
        flowType: '8',
      });
      axios.post(`/${this.info.appraise ? 'petitionInfoLog' : 'petitionInfo'}/update`, formData).then(() => {
        this.$message.success('评价成功');
        this.$emit('success');
      });
      // axios.post(`/petitionInfoLog/update`, formData).then(() => {
      //     this.$message.success('评价成功')
      //     this.$emit('success')
      // })
    },
  },
};
</script>

<style scoped lang="scss">
.remark {
  .tip {
    background: #fffbe6;
    border-radius: 2px;
    border: 1px solid #ffe58f;
    padding: 4px 20px;
    i {
      color: #fc9a22;
      margin-right: 5px;
    }
  }
  .score {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-left: 100px;
    height: 50px;
    line-height: 50px;
    .el-rate {
      transform: scale(1.5);
      transform-origin: right center;
    }
    .desc {
      width: 100px;
      color: #fc9a22;
      font-size: 16px;
    }
  }
  textarea {
    border: 1px solid #ddd;
    outline: none;
    padding: 12px 16px;
    box-sizing: border-box;
    width: 100%;
  }
}
::v-deep .el-upload--picture-card {
  width: 80px;
  height: 80px;
  line-height: 1;
  i {
    margin-top: 15px;
  }
}
::v-deep .el-upload-list--picture-card {
  .el-upload-list__item {
    width: 80px;
    height: 80px;
  }
}
</style>
