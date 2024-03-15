<template>
  <div class="workInfoEditDialog">
    <el-dialog :title="title" :visible.sync="open" width="900px" append-to-body @close="cancel">
      <el-form ref="form" :model="form.expandContent" :rules="rules" label-width="140px">
        <el-row>
          <el-col :span="11">
            <el-form-item label="关系" prop="relationship">
              <el-input v-model="form.expandContent.relationship" placeholder="请输入" /> </el-form-item
          ></el-col>
          <el-col :span="11">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="form.expandContent.name" placeholder="请输入" /> </el-form-item
          ></el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="form.expandContent.phone" placeholder="请输入" /> </el-form-item
          ></el-col>
          <el-col :span="11">
            <el-form-item label="身份证号" prop="idCard">
              <el-input v-model="form.expandContent.idCard" placeholder="请输入" /> </el-form-item
          ></el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="健康状况" prop="healthCondition">
              <el-input v-model="form.expandContent.healthCondition" placeholder="请输入" /> </el-form-item
          ></el-col>
          <el-col :span="11">
            <el-form-item label="就业状况" prop="employmentStatus">
              <el-input v-model="form.expandContent.employmentStatus" placeholder="请输入" /> </el-form-item
          ></el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="工作单位" prop="workUnit">
              <el-input v-model="form.expandContent.workUnit" placeholder="请输入" /> </el-form-item
          ></el-col>
          <el-col :span="11">
            <el-form-item label="工作职务" prop="post">
              <el-input v-model="form.expandContent.post" placeholder="请输入" /> </el-form-item
          ></el-col>
        </el-row>
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
  components: {},
  data() {
    return {
      open: true,
      form: {
        expandChildType: 'A2',
        expandParentType: 'A',
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
        relationship: [{ required: true, message: '关系不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
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
