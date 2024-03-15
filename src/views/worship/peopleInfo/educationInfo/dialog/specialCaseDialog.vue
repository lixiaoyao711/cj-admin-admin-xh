<template>
  <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body @close="cancel">
    <el-form ref="form" :model="form.expandContent" :rules="rules" label-width="180px">
      <el-row>
        <el-form-item label="" prop="" label-width="0"> <div class="title">培训情况</div> </el-form-item>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="承训机构：" prop="">
            <el-input v-model="form.expandContent.trainingInstitutions"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="专业：" prop="">
            <el-input v-model="form.expandContent.major"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="请输入培训时长（小时）：" prop="">
            <el-input v-model="form.expandContent.trainingOften" type="number"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="" prop="" label-width="0"> <div class="title">培训经费情况</div> </el-form-item>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="补助资金（元）：" prop="">
            <el-input v-model="form.expandContent.subsidyFunds" type="number"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="个人支付金额（元）：" prop="">
            <el-input v-model="form.expandContent.individualPaymentAmount" type="number"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="总金额（元）：" prop="">
            <el-input v-model="form.expandContent.totalAmount" type="number"></el-input>
          </el-form-item>
        </el-col>
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
  dicts: ['sys_worship_fyjrlb', 'sys_worship_fyjx'],
  components: {},
  data() {
    return {
      open: true,
      trainingAttendance: [],
      certificateCategory: [],
      form: {
        expandChildType: 'F4',
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
.title {
  font-size: 18px;
  color: #1890ff;
}
</style>
