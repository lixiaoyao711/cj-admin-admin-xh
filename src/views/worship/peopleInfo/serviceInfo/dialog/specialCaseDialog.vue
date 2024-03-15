<template>
  <el-dialog title="特殊地区服役" :visible.sync="open" width="900px" append-to-body @close="cancel">
    <el-form ref="form" :model="form.expandContent" :rules="rules" label-width="130px">
      <el-row>
        <el-form-item label="特殊地区性质" prop="">
          <el-checkbox-group v-model="specialRegionalNature">
            <el-checkbox v-for="(item, index) in dict.type.sys_worship_tsdqfy" :key="index" :label="item.label">{{
              item.label
            }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="服役时长(月)" prop="">
          <el-input v-model="form.expandContent.serviceDuration" type="number"> </el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="特殊岗位" prop="">
          <el-radio-group v-model="form.expandContent.specialPositions">
            <el-radio v-for="(item, index) in radioMap" :key="index" :label="item">{{ item }}</el-radio>
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
  dicts: ['sys_worship_tsdqfy'],
  components: {},
  data() {
    return {
      open: true,
      form: {
        expandChildType: 'C4',
        expandParentType: 'C',
        expandContent: {
          militaryCategory: '军官',
        },
      },
      customProps: {
        emitPath: true,
        label: 'name',
        value: 'adcode',
      },

      rules: {
        educationBackground: [{ required: true, message: '学历情况不能为空', trigger: 'blur' }],
        // name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
      },
      specialRegionalNature: [],
      radioMap: ['飞行', '舰艇', '涉核', '其他'],
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
          this.specialRegionalNature = this.form.expandContent.specialRegionalNature.split(',');
          this.punishment = this.form.expandContent.punishment.split(',');
        });
      }
    },
    submitForm() {
      this.$refs['form'].validate((val) => {
        if (val) {
          this.form.expandContent.specialRegionalNature = this.specialRegionalNature.join(',');
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
