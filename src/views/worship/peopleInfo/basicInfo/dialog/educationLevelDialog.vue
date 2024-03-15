<template>
  <div class="workInfoEditDialog">
    <el-dialog title="编辑最高学历、学位" :visible.sync="open" width="900px" append-to-body @close="cancel">
      <el-form ref="form" :model="form.expandContent" :rules="rules" label-width="140px">
        <el-row>
          <el-col :span="11">
            <el-form-item label="学历情况" prop="educationBackground">
              <el-select v-model="form.expandContent.educationBackground" placeholder="请选择学历情况">
                <el-option
                  v-for="dict in dict.type.sys_worship_educationlevel"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.label"
                ></el-option>
              </el-select> </el-form-item
          ></el-col>
          <el-col :span="11">
            <el-form-item label="取得时间" prop="">
              <el-date-picker
                v-model="form.expandContent.educationBackgroundTime"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker> </el-form-item
          ></el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="学位情况" prop="">
              <el-select v-model="form.expandContent.degreeSituation" placeholder="请选择学位情况">
                <el-option
                  v-for="dict in dict.type.sys_worship_academicdegree"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.label"
                ></el-option>
              </el-select> </el-form-item
          ></el-col>
          <el-col :span="11">
            <el-form-item label="取得时间" prop="">
              <el-date-picker
                v-model="form.expandContent.degreeSituationTime"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker> </el-form-item
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
  dicts: ['sys_worship_educationlevel', 'sys_worship_academicdegree'],
  components: {},
  data() {
    return {
      open: true,
      form: {
        expandChildType: 'A3',
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
