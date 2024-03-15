<template>
  <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body @close="cancel">
    <el-form ref="form" :model="form.expandContent" :rules="rules" label-width="140px">
      <el-row>
        <el-form-item label="军休类别：" prop="">
          <el-radio-group v-model="form.expandContent.categoryMilitaryRest">
            <el-radio v-for="(item, index) in categoryMilitaryRest" :key="index" :label="item">{{ item }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="安置/报道时间：" prop="">
            <el-date-picker
              v-model="form.expandContent.placementTime"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="安置地：" prop="">
            <TreeSelectDivision
              v-model="form.expandContent.placementSiteCode"
              @treeselectChange="(e) => treeselectChange(e, form.expandContent, 'placementSite', 'placementSiteCode')"
            ></TreeSelectDivision>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="安置管理单位名称：" prop="">
            <el-input v-model="form.expandContent.placementOrgName" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-form-item label="安置管理单位性质：" prop="">
          <el-radio-group v-model="form.expandContent.placementOrgNature">
            <el-radio v-for="(item, index) in placementOrgNature" :key="index" :label="item">{{ item }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="服务机构管理名称：" prop="">
            <el-input v-model="form.expandContent.serverOrgName" placeholder="请输入"></el-input>
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
  dicts: [],
  components: {},
  data() {
    return {
      open: true,
      form: {
        expandChildType: 'D5',
        expandParentType: 'D',
        expandContent: {},
      },
      categoryMilitaryRest: ['离休干部', '退休干部', '退休士官', '退休改离休干部'],
      placementOrgNature: ['政府管理', '军队管理'],
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
