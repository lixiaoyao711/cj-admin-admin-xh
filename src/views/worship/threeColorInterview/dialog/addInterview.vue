<template>
  <el-dialog
    title="添加走访信息"
    width="650px"
    top="10vh"
    :visible.sync="dialogVisible"
    @close="$emit('close')"
    :close-on-click-modal="false"
  >
    <ul class="info">
      <li><span>被走访人:</span>{{ info.name }}</li>
      <li><span>联系方式:</span>{{ info.phone }}</li>
      <li><span>行政区划:</span>{{ info.divisionName }}</li>
    </ul>
    <el-form :model="form" :rules="rules" ref="form" class="form" label-width="120px">
      <el-col :span="24">
        <el-form-item label="走访地址:" prop="address">
          <el-input v-model="form.address" maxlength="20"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="走访人:" prop="visitPersonName">
          <el-input v-model="form.visitPersonName" maxlength="20"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="走访人电话:" prop="visitPersonPhone">
          <el-input v-model="form.visitPersonPhone" maxlength="20"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="走访方式:" prop="visitMethod">
          <el-select v-model="form.visitMethod">
            <el-option
              v-for="dict in dict.type.sys_worship_visitingmethods"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="走访时间:" prop="visitTime">
          <el-date-picker
            :picker-options="pickerOptions"
            v-model="form.visitTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="09:30:00"
            placeholder="选择时间"
          >
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="走访内容:" prop="content">
          <el-input type="textarea" v-model="form.content" maxlength="1000" placeholder="字符长度不超过4000"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="走访反馈:" prop="feedback">
          <el-input
            type="textarea"
            v-model="form.feedback"
            maxlength="1000"
            placeholder="字符长度不超过4000"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="走访照片:">
          <div class="upload">
            <imageUpload v-model="form.fileUrl"></imageUpload>
          </div>
        </el-form-item>
      </el-col>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="handleSave">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { checkPhone } from '@/utils/regular';
import { addVisiting } from '@/api/worship/visiting';
export default {
  dicts: ['sys_worship_visitingmethods'],
  props: ['info', 'row'],
  components: {},
  data() {
    return {
      dialogVisible: true,
      form: {},
      // 只能筛今天之前的日期
      pickerOptions: {
        // 限制时间
        disabledDate(time) {
          // 今天之后都禁用
          return time.getTime() > new Date();
        },
      },
      headers: {
        Authorization: sessionStorage.token,
      },
      fileList: [],
      deleteFile: [],
      accept: ['.jpg', '.png'],
      rules: {
        visitPersonName: [{ required: true, message: '请输入走访人', trigger: 'blur' }],
        visitPersonPhone: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('请输入走访人电话'));
              } else if (!checkPhone(value)) {
                callback(new Error('请输入正确的手机号'));
              } else {
                callback();
              }
            },
          },
        ],
        visitMethod: [{ required: true, message: '请选择走访人方式', trigger: 'change' }],
        visitTime: [{ required: true, message: '请选择走访时间', trigger: 'change' }],
        content: [{ required: true, message: '请输入走访内容', trigger: 'blur' }],
      },
    };
  },
  computed: {
    // dictMap() {
    //   return this.$store.state.dictMap;
    // },
  },
  watch: {},
  mounted() {
    // console.log(this.info, this.row);
    // this.form.personId = this.info.personId;
    if (this.info.id) {
      this.form = Object.assign({}, this.form, this.info);
    }
    console.log(this.form);
  },
  methods: {
    handleSave() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.form.personName = this.form.name;
          this.form.visitType = 4;
          delete this.form.id;
          addVisiting(this.form).then((res) => {
            this.$message.success('添加成功');
            this.$emit('success');
          });
        }
      });
    },
    close() {
      this.$emit('close');
    },
  },
};
</script>

<style scoped lang="scss">
.info {
  overflow: hidden;
  li {
    float: left;
    width: 50%;
    margin-bottom: 16px;
    display: flex;
    span {
      margin-right: 5px;
      width: 108px;
      padding-right: 12px;
      text-align: right;
    }
  }
}
.form {
  width: 100%;
  &::after {
    content: '';
    display: table;
    clear: both;
  }
}
.form .select,
.form .input {
  width: 40%;
  margin-right: 10px;
}
.subToolBar {
  display: flex;
  align-items: center;
  button {
    margin-left: 10px;
    i {
      font-size: 14px;
      margin-right: 3px;
    }
  }
}
.table {
  height: 45vh;
}
.pagination {
  text-align: center;
}
.el-input,
.el-select,
.el-textarea {
  width: 100%;
}
::v-deep .el-upload--picture-card {
  width: 80px;
  height: 80px;
  //   line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
::v-deep .el-upload-list--picture-card {
  .el-upload-list__item {
    width: 80px;
    height: 80px;
  }
}
</style>
