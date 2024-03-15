<template>
  <div>
    <el-dialog :title="titleName" :visible.sync="dialogVisible" width="600px" :before-close="handleClose">
      <el-form :rules="rules" ref="formRules" label-width="120px" :model="formData">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formData.name"> </el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="cardCode">
          <el-input v-model="formData.cardCode"> </el-input>
        </el-form-item>
        <el-form-item label="所属军人证号" prop="militaryCardCode">
          <el-input v-model="formData.militaryCardCode"> </el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="性别">
              <el-select v-model="formData.sex" placeholder="请选择">
                <el-option label="男" value="1"></el-option>
                <el-option label="女" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="民族">
              <el-select v-model="formData.national" placeholder="请选择">
                <el-option
                  v-for="item in dictMap.national"
                  :key="item.dictCode"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="年龄">
              <el-input type="number" v-model="formData.age"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="行政区划" prop="departCode">
              <el-cascader
                :props="{ checkStrictly: true }"
                v-model="formData.departCode"
                clearable
                :options="dictMap.addDistrict"
                placeholder="请选择"
              ></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="学校名称">
          <el-input v-model="formData.academyName"> </el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            resize="none"
            type="textarea"
            placeholder="请输入内容"
            v-model="formData.type"
            show-word-limit
            :autosize="{
              minRows: 5,
            }"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="saveItem">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// api

export default {
  props: {
    titleName: String,
    propsData: Object,
  },
  components: {},
  data() {
    return {
      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'change' }],
        departCode: [{ required: true, message: '请选择行政区划', trigger: 'change' }],
        cardCode: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入身份证号码',
          },
          {
            // validator: (rule, value, callback) => {
            //   if (!value) {
            //     callback();
            //   } else if (
            //     !testIdentity(value)) {
            //     callback(new Error('请输入正确的身份证号码')
            //     );
            //   }
            //   else {
            //     callback();
            //   }
            // },
            trigger: 'blur',
          },
        ],
        militaryCardCode: [{ required: true, message: '请输入所属军人证号', trigger: 'change' }],
      },
      dialogVisible: true,
      imgDialogVisible: false,
      formData: {
        name: '',
        region: '',
        type: '',
      },
      // -------------------附件上传------------------
      dialogImageUrl: '',
    };
  },
  computed: {
    dictMap() {
      return this.$store.state.dictMap;
    },
  },
  watch: {},
  created() {},
  mounted() {
    this.propsData.id ? (this.formData = this.propsData) : '';
    this.formData.departCode = '';
  },
  methods: {
    handleClose() {
      this.$emit('close');
    },
    saveItem() {
      this.$refs.formRules.validate((val) => {
        if (val) {
          let depart = '';

          if (this.titleName === '添加子女入学信息') {
            // childrenEducationAdd(Object.assign({}, this.formData, depart)).then((res) => {
            //   this.$message('新增成功');
            //   this.$emit('close');
            // });
          }
          if (this.titleName === '编辑子女入学信息') {
            // childrenEducationUpdate(Object.assign({}, this.formData, depart)).then((res) => {
            //   this.$message('编辑成功');
            //   this.$emit('close');
            // });
          }
        }
      });
    },
    // -------------------附件上传------------------
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
  },
};
</script>

<style scoped lang="scss">
.span1 {
  margin-right: 16px;
}
.el-icon-user {
  cursor: pointer;
}
.age {
  width: 4vw;
}
</style>
