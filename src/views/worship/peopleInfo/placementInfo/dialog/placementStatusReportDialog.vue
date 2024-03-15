<template>
  <div class="workInfoEditDialog">
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body @close="cancel">
      <el-form ref="form" :model="form.expandContent" :rules="rules" label-width="130px">
        <el-row>
          <el-form-item label="安置/报道时间：" prop="">
            <el-date-picker
              v-model="form.expandContent.reportingTime"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="安置地：" prop="">
            <TreeSelectDivision
              v-model="form.expandContent.placementSiteCode"
              @treeselectChange="(e) => treeselectChange(e, form.expandContent, 'placementSite', 'placementSiteCode')"
            ></TreeSelectDivision>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="安置单位名称：" prop="">
            <el-input v-model="form.expandContent.placementOrgName" placeholder="安置单位名称"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="安置单位性质：" prop="">
            <el-radio-group v-model="form.expandContent.placementNature">
              <el-radio v-for="(item, index) in placementNature" :key="index" :label="item">{{ item }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="安置职务级别：" prop="">
            <el-radio-group v-model="form.expandContent.placementPositionLevel">
              <el-radio v-for="(item, index) in placementPositionLevel" :key="index" :label="item">{{ item }}</el-radio>
            </el-radio-group>
          </el-form-item>
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
  dicts: ['sys_worship_fyjrlb', 'sys_worship_fyjx'],
  components: {},
  data() {
    return {
      open: true,
      form: {
        expandChildType: 'D4',
        expandParentType: 'D',
        expandContent: {},
      },
      placementNature: ['机关', '群团组织', '事业单位', '国有企业', '其他'],
      placementPositionLevel: [
        '厅局级正职',
        '厅局级副职',
        '县处级正职',
        '县处级副职',
        '乡科级正职',
        '乡科级副职',
        '科员级',
        '办事员级',
        '未定职公务员',
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
.check {
  margin: 6px 0 0 12px;
}
</style>
