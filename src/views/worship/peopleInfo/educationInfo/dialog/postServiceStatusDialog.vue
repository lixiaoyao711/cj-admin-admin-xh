<template>
  <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body @close="cancel">
    <el-form ref="form" :model="form.expandContent" :rules="rules" label-width="160px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="是否复学：" prop="">
            <el-radio-group v-model="form.expandContent.resumptionOfStudies">
              <el-radio v-for="(item, index) in collegeStudents" :key="index" :label="item">{{ item }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否转入其他专业：" prop="">
            <el-radio-group v-model="form.expandContent.transferOtherMajors">
              <el-radio v-for="(item, index) in collegeStudents" :key="index" :label="item">{{ item }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="是否得到学费资助" prop="">
            <el-radio-group v-model="form.expandContent.tuitionSubsidy">
              <el-radio v-for="(item, index) in collegeStudents" :key="index" :label="item">{{ item }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="学费资助金额：" prop="">
            <el-input v-model="form.expandContent.tuitionSubsidyAmount" type="number"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="是否继续深造：" prop="">
          <el-radio-group v-model="form.expandContent.continuingEducation">
            <el-radio v-for="(item, index) in collegeStudents" :key="index" :label="item">{{ item }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="深造学历情况：" prop="">
          <el-radio-group v-model="form.expandContent.furtherEducationBackground">
            <el-radio v-for="(item, index) in educationInProgress" :key="index" :label="item">{{ item }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getPersonExpandById, addPersonExpand, updatePersonExpand } from '@/api/worship/retiredSoldier';
export default {
  props: {
    propsId: '',
    title: {
      type: String,
      default: '',
    },
  },
  dicts: [],
  components: {},
  data() {
    return {
      open: true,
      form: {
        expandChildType: 'F2',
        expandParentType: 'F',
        expandContent: {},
      },
      collegeStudents: ['是', '否'],
      educationInProgress: ['博士研究生', '硕士研究生', '大学本科', '大学专科'],
      customProps: {
        emitPath: true,
        label: 'name',
        value: 'adcode',
      },

      rules: {
        educationBackground: [{ required: true, message: '学历情况不能为空', trigger: 'blur' }],
        // name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
      },
      conscriptionSite: [],
      largeUnits: [],
    };
  },
  computed: {
    mapList() {
      return this.$store.getters.mapList;
    },
  },
  watch: {},
  created() {},
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      if (this.propsId) {
        getPersonExpandById(this.propsId).then((res) => {
          this.form = res.data;
          this.form.expandContent = JSON.parse(this.form.expandContent);
        });
      }
    },
    submitForm() {
      this.$refs['form'].validate((val) => {
        if (val) {
          this.form.expandContent = JSON.stringify(this.form.expandContent);
          this.form.personId = this.$route.params.id;

          if (this.propsId) {
            updatePersonExpand(this.form).then((res) => {
              this.$message.success('修改成功');
              this.$emit('success');
              this.$emit('close');
            });
          } else {
            addPersonExpand(this.form).then((res) => {
              this.$message.success('添加成功');
              this.$emit('success');
              this.$emit('close');
            });
          }
        }
      });
    },
    cancel() {
      this.$emit('close');
    },
    handleChange(value) {
      let data = this.$refs[value]?.getCheckedNodes();
      // this.form[`${value}Code`] = this[value].join(',');
      this.form.expandContent[value] = data[0].pathLabels.join(',');
    },
  },
};
</script>

<style scoped lang="scss">
.check {
  margin: 6px 0 0 12px;
}
</style>
