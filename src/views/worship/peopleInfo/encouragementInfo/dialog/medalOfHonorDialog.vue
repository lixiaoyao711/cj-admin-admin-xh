<template>
  <div class="workInfoEditDialog">
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body @close="cancel">
      <el-form ref="form" :model="form.expandContent" :rules="rules" label-width="160px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="光荣牌悬挂情况：" prop="">
              <el-radio-group v-model="form.expandContent.suspensionSituation">
                <el-radio v-for="(item, index) in sex" :key="index" :label="item">{{ item }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请悬挂时间：" prop="">
              <el-date-picker
                v-model="form.expandContent.applicationTime"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="悬挂地址：" prop="">
              <TreeSelectDivision
                v-model="form.expandContent.hangingAddressCode"
                @treeselectChange="
                  (e) => treeselectChange(e, form.expandContent, 'hangingAddress', 'hangingAddressCode')
                "
              ></TreeSelectDivision>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" label-width="0" prop="">
              <el-input v-model="form.expandContent.hangingAddressData"></el-input> </el-form-item
          ></el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="悬挂时间：" prop="">
              <el-date-picker
                v-model="form.expandContent.suspensionTime"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否取消：" prop="">
              <el-radio-group v-model="form.expandContent.cancelOrNot">
                <el-radio v-for="(item, index) in sex" :key="index" :label="item">{{ item }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否更换：" prop="">
              <el-radio-group v-model="form.expandContent.replaceOrNot">
                <el-radio v-for="(item, index) in sex" :key="index" :label="item">{{ item }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="更换时间：" prop="">
              <el-date-picker
                v-model="form.expandContent.replacementTime"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
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
  dicts: ['sys_worship_xyjrjsgx'],
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
        expandChildType: 'H1',
        expandParentType: 'H',

        expandContent: {},
      },
      sex: ['是', '否'],

      customProps: {
        emitPath: true,
        label: 'name',
        value: 'adcode',
      },

      rules: {},
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
            this.$set(this.form, 'expandContent', {});
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
.workInfoEditDialog {
}
.line {
  background: #f2f2f2;
  height: 10px;
}
.title {
  font-size: 20px;
  color: #1890ff;
}
.check {
  margin: 6px 0 0 12px;
}
</style>
