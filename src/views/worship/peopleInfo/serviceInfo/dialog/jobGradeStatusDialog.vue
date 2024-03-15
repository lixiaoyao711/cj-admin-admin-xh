<template>
  <el-dialog title="职级情况" :visible.sync="open" width="900px" append-to-body @close="cancel">
    <el-form ref="form" :model="form.expandContent" :rules="rules" label-width="130px">
      <el-row>
        <el-form-item label="干部类别" prop="">
          <el-radio-group v-model="form.expandContent.cadreCategory">
            <el-radio label="军官">军官</el-radio>
            <el-radio label="文职">文职</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="军官类别" prop="">
          <el-radio-group v-model="form.expandContent.officerCategory">
            <el-radio label="行政军官（指挥管理军官）">行政军官（指挥管理军官）</el-radio>
            <el-radio label="技术军官（专业技术军官）">技术军官（专业技术军官）</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="行政军官原最高级" prop="">
            <el-select v-model="form.expandContent.xzHighestRank" placeholder="请选择">
              <el-option v-for="item in options" :key="item" :label="item" :value="item"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="技术军官原最高级" prop="">
            <el-select v-model="form.expandContent.jsHighestRank" placeholder="请选择">
              <el-option v-for="item in options" :key="item" :label="item" :value="item"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="文职类别" prop="">
          <el-radio-group v-model="form.expandContent.civilianCategory">
            <el-radio label="管理文职">管理文职</el-radio>
            <el-radio label="技术文职">技术文职</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="管理文职原最高级" prop="">
            <el-select v-model="form.expandContent.wzHighestRank" placeholder="请选择">
              <el-option v-for="item in options" :key="item" :label="item" :value="item"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="技术文职原最高级" prop="">
            <el-select v-model="form.expandContent.jsWzHighestRank" placeholder="请选择">
              <el-option v-for="item in options" :key="item" :label="item" :value="item"> </el-option>
            </el-select>
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
      options: ['上将', '中将', '少将', '大校', '中校', '上校', '少校', '上尉', '中尉', '少尉'],
      form: {
        expandChildType: 'C2',
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
