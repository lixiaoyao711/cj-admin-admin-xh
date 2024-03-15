<template>
  <div class="workInfoEditDialog">
    <el-dialog :title="title" :visible.sync="open" width="900px" append-to-body @close="cancel">
      <el-form ref="form" :model="form.expandContent" :rules="rules" label-width="180px">
        <el-form-item label="所在志愿服务组织" prop="">
          <el-input v-model="form.expandContent.volunteerServiceSituation"></el-input>
        </el-form-item>

        <el-form-item label="主要服务项目" prop="">
          <el-input v-model="form.expandContent.mainServiceItems"></el-input>
        </el-form-item>

        <el-form-item label="何时参加志愿服务活动" prop="">
          <el-date-picker
            v-model="form.expandContent.volunteerActivities"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="累计参加志愿服务时数" prop="">
          <el-input v-model="form.expandContent.durationOfParticipation" type="number"></el-input>
        </el-form-item>
        <el-form-item label="组织单位" prop="">
          <el-input v-model="form.expandContent.organizationalUnit"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
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
  dicts: ['sys_worship_educationlevel', 'sys_worship_academicdegree'],
  components: {},
  data() {
    return {
      open: true,
      form: {
        expandChildType: 'B3',
        expandParentType: 'B',
        expandContent: {
          areaLeader: '',
          areaPhone: '',
          streetLeader: '',
          streetPhone: '',
          specialPerson: '',
          specialPhone: '',
        },
      },

      rules: {
        educationBackground: [{ required: true, message: '学历情况不能为空', trigger: 'blur' }],
        // name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
      },
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
  },
};
</script>

<style scoped lang="scss">
.workInfoEditDialog {
}
.icon {
  cursor: pointer;
  color: red;
  margin: 5px 0 0 16px;
  font-size: 20px;
}
.peopleList {
  display: flex;
  // justify-content: space-between;
  .item {
    // flex: 20%;
    width: 46%;
  }
}
</style>
