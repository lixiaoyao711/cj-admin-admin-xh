<template>
  <div class="workInfoEditDialog">
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body @close="cancel">
      <el-form ref="form" :model="form.expandContent" :rules="rules" label-width="100px">
        <el-row>
          <el-form-item label="退役干部：" prop="">
            <el-radio-group v-model="form.expandContent.personCategory">
              <el-radio v-for="(item, index) in retiredCadre" :key="index" :label="item">{{ item }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="退役士兵：" prop="">
            <el-radio-group v-model="form.expandContent.personCategory">
              <el-radio v-for="(item, index) in retiredSoldier" :key="index" :label="item">{{ item }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="复员军人：" prop="">
            <el-radio-group v-model="form.expandContent.personCategory">
              <el-radio v-for="(item, index) in demobilizedSoldier" :key="index" :label="item">{{ item }}</el-radio>
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
        expandChildType: 'D2',
        expandParentType: 'D',
        expandContent: {},
      },
      retiredCadre: [
        '军队离退休干部',
        '企业军转干部',
        '白愿自行就业军转干部',
        '计划分配军转干部(转业军官)',
        '自主择业军转干部',
        '现役干部转改文职人员',
        '复员干部（复员军官）',
        '逐月领取退役金的退役军官',
      ],
      retiredSoldier: [
        '退休士官',
        '政府安排工作的退役士兵',
        '白谋职业退役士兵',
        '灵活就业退役士兵',
        '符合转业条件作复员安置的士官和志愿兵',
        '回乡生产的退役士兵',
        '自主就业退役士兵',
        '国家供养退役士兵',
        '逐月领取退役金的退役士兵',
      ],
      demobilizedSoldier: ['复原军人'],
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
.el-radio {
  margin: 16px 16px 0 0;
}
</style>
