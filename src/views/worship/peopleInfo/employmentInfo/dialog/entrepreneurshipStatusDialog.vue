<template>
  <div class="workInfoEditDialog">
    <el-dialog :title="title" :visible.sync="open" width="860px" append-to-body @close="cancel">
      <el-form ref="form" :model="form.expandContent" :rules="rules" label-width="160px">
        <el-row>
          <el-form-item label="企业(项目)名称：" prop="">
            <el-input v-model="form.expandContent.enterpriseName" placeholder="请输入"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="创业类型：" prop="">
            <el-radio-group v-model="form.expandContent.entrepreneurshipType">
              <el-radio v-for="(item, index) in entrepreneurshipType" :key="index" :label="item">{{ item }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="职务：" prop="">
            <el-radio-group v-model="form.expandContent.post">
              <el-radio v-for="(item, index) in post" :key="index" :label="item">{{ item }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="法定代表人：" prop="">
              <el-input v-model="form.expandContent.legalPerson" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="法定代表人联系方式：" prop="">
              <el-input v-model="form.expandContent.legalPersonPhone" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="控股情况：" prop="">
            <el-radio-group v-model="form.expandContent.holdingSituation">
              <el-radio v-for="(item, index) in holdingSituation" :key="index" :label="item">{{ item }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="社会统一信用代码：" prop="">
            <el-input v-model="form.expandContent.socialCreditCode" type="number" placeholder="请输入"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
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
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="注册地址：" prop="">
              <TreeSelectDivision
                v-model="form.expandContent.registeredAddressCode"
                @treeselectChange="
                  (e) => treeselectChange(e, form.expandContent, 'registeredAddress', 'registeredAddressCode')
                "
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
          <el-form-item label="成立时间(注册时间)：" prop="">
            <el-date-picker
              v-model="form.expandContent.establishmentTime"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="吸纳就业人数：" prop="">
              <el-input v-model="form.expandContent.employmentAbsorption" type="number" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="吸纳退役军人人数：" prop="">
              <el-input
                v-model="form.expandContent.employmentRetireAbsorption"
                type="number"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="资产总额(万元)：" prop="">
              <el-input v-model="form.expandContent.totalAssets" type="number" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年营业收入（万元)：" prop="">
              <el-input v-model="form.expandContent.annualIncome" type="number" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="享受扶持政策情况：" prop="">
            <el-input v-model="form.expandContent.policySituation" type="textarea" placeholder="请输入"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="下(返)乡创业：" prop="">
            <el-radio-group v-model="form.expandContent.goCountryside">
              <el-radio v-for="(item, index) in goCountryside" :key="index" :label="item">{{ item }}</el-radio>
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
        expandChildType: 'E3',
        expandParentType: 'E',
        expandContent: {},
      },
      entrepreneurshipType: ['企业', '个体工商户', '项目筹划阶段', '其他'],
      post: ['法人代表', '股东', '主要管理人', '合伙人', '其他'],
      holdingSituation: ['国有控股', '集体控股', '私人控股', '港澳台控股', '外商控股', '其他'],
      goCountryside: ['是', '否'],
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
