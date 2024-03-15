<template>
  <!-- 职业技能培训情况 -->
  <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body @close="cancel">
    <el-form ref="form" :model="form.expandContent" :rules="rules" label-width="160px">
      <el-row>
        <el-form-item label="培训类型：" prop="">
          <el-checkbox-group v-model="form.expandContent.trainingType">
            <el-checkbox v-for="(item, index) in trainingType" :key="index" :label="item"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="参加培训情况：" prop="">
          <el-checkbox-group v-model="form.expandContent.trainingAttendance">
            <el-checkbox v-for="(item, index) in trainingAttendance" :key="index" :label="item"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item label="获取证书情况：" prop="">
          <el-radio-group v-model="form.expandContent.obtainingCertificates">
            <el-radio v-for="(item, index) in collegeStudents" :key="index" :label="item">{{ item }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="证书类别：" prop="">
          <el-checkbox-group v-model="form.expandContent.certificateCategory">
            <el-checkbox v-for="(item, index) in certificateCategory" :key="index" :label="item"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="证书名称：" prop="">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="form.expandContent.certificateName"
            maxlength="500"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="职业技能培训后是否直接就业：" prop="">
          <el-radio-group v-model="form.expandContent.directEmployment">
            <el-radio v-for="(item, index) in collegeStudents" :key="index" :label="item">{{ item }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="培训专业与就业岗位是否匹配：" prop="">
          <el-radio-group v-model="form.expandContent.isTrainingProvided">
            <el-radio v-for="(item, index) in collegeStudents" :key="index" :label="item">{{ item }}</el-radio>
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
import { String2Array, Array2String } from '@/utils/toolFn.js';
export default {
  props: {
    propsId: '',
    title: {
      type: String,
      default: '',
    },
  },
  components: {},
  data() {
    return {
      open: true,
      trainingAttendance: [],
      certificateCategory: [],
      form: {
        expandChildType: 'F3',
        expandParentType: 'F',
        expandContent: {
          trainingType: [],
          trainingAttendance: [],
          certificateCategory: [],
        },
      },
      trainingType: ['适应性培训', '职业技能培训', '个性化培训', '其他培训'],
      trainingAttendance: ['策规定免费职业技能培训', '其他类型培训'],
      collegeStudents: ['是', '否'],
      certificateCategory: [
        '职业资格证',
        '职业技能等级证',
        '专项职业能力证',
        '特种作业操作证',
        '全民技能提升培训合格证',
        '其他',
      ],
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
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      if (this.propsId) {
        getPersonExpandById(this.propsId).then((res) => {
          console.log('🚀 ~ getPersonExpandById ~ res.data:', res.data);
          this.form = res.data;
          this.form.expandContent = JSON.parse(this.form.expandContent);
          // 将数组里的字段值 字符串转成数组
          ['trainingType', 'trainingAttendance', 'certificateCategory'].forEach((key) => {
            this.form.expandContent[key] = String2Array(this.form.expandContent[key]);
          });
          if (Object.keys(this.form.expandContent).length === 0) {
            this.$set(this.form, 'expandContent', {
              trainingType: [],
              trainingAttendance: [],
              certificateCategory: [],
            });
          }
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
