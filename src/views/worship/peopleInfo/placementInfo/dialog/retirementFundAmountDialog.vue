<template>
  <div class="workInfoEditDialog">
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body @close="cancel">
      <el-form ref="form" :model="form.expandContent" :rules="rules" label-width="200px">
        <el-row>
          <el-form-item label="是否领取一次性退役金：" prop="">
            <el-radio-group v-model="form.expandContent.whetherCollectOrNot">
              <el-radio label="是">是</el-radio>
              <el-radio label="否">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item type="number" label="领取一次性退役金金额（元)：" prop="">
            <el-input v-model="form.expandContent.collectionMoney" type="number"></el-input>
          </el-form-item>
        </el-row>

        <el-row>
          <el-form-item label="领取时间：" prop="">
            <el-date-picker
              v-model="form.expandContent.collectionTime"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item type="number" label="逐月领取退役金金额（元)：" prop="">
            <el-input v-model="form.expandContent.monthlyCollectionMoney" type="number"></el-input>
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
        expandChildType: 'D3',
        expandParentType: 'D',
        expandContent: {},
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
.check {
  margin: 6px 0 0 12px;
}
</style>
