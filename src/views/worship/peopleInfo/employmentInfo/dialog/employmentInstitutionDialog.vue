<template>
  <div class="workInfoEditDialog">
    <el-dialog :title="title" :visible.sync="open" width="860px" append-to-body @close="cancel">
      <el-form ref="form" :model="form.expandContent" :rules="rules" label-width="160px">
        <el-row>
          <el-form-item label="单位类型：" prop="">
            <el-radio-group v-model="form.expandContent.unitNature">
              <el-radio v-for="(item, index) in unitNature" :key="index" :label="item">{{ item }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="岗位类型：" prop="">
            <el-radio-group v-model="form.expandContent.jobType">
              <el-radio v-for="(item, index) in jobType" :key="index" :label="item">{{ item }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="是否新业态就业：" prop="">
            <el-radio-group v-model="form.expandContent.newTypeEmployment">
              <el-radio v-for="(item, index) in newTypeEmployment" :key="index" :label="item">{{ item }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="新业态就业类型：" prop="">
            <el-radio-group v-model="form.expandContent.typeEmploymentNewFormats">
              <el-radio v-for="(item, index) in typeEmploymentNewFormats" :key="index" :label="item">{{
                item
              }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="单位名称：" prop="">
            <el-input v-model="form.expandContent.orgName" placeholder="单位名称"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="单位地址：" prop="">
              <TreeSelectDivision
                v-model="form.expandContent.orgAddressCode"
                @treeselectChange="(e) => treeselectChange(e, form.expandContent, 'orgAddress', 'orgAddressCode')"
              ></TreeSelectDivision>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="" label-width="0">
              <el-input v-model="form.expandContent.placementOrgName" placeholder="请输入详细地址"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="何时进入现单位工作：" prop="">
              <el-date-picker
                v-model="form.expandContent.workTime"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属行业：" prop="">
              <el-select v-model="form.expandContent.industry" placeholder="请选择" clearable>
                <el-option
                  v-for="dict in dict.type.sys_worship_industry"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.label"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-form-item label="劳务合同类型：" prop="">
            <el-radio-group v-model="form.expandContent.typeLaborContract">
              <el-radio v-for="(item, index) in typeLaborContract" :key="index" :label="item">{{ item }}</el-radio>
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
  dicts: ['sys_worship_industry'],
  components: {},
  data() {
    return {
      open: true,
      form: {
        expandChildType: 'E2',
        expandParentType: 'E',
        expandContent: {},
      },
      unitNature: ['国家机关', '事业单位', '国有企业', '集体企业', '私营企业', '外资企业', '其他'],
      jobType: ['管理岗位', '技术岗位', '临时岗位', '劳务工', '其他'],
      newTypeEmployment: ['是', '否'],
      typeEmploymentNewFormats: ['快递', '外卖', '网约车司机', '家政服务', '网店', '直播', '其他'],
      typeLaborContract: [
        '元固定期限合同',
        '三年及以上有期限合同',
        '三年以下有期限合同',
        '未签订劳动合同',
        '不需要签订劳动合同',
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
