<template>
  <div class="addOrUpdate">
    <el-dialog :title="title" :visible.sync="open" width="1080px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="form.name" placeholder="请输入姓名" /> </el-form-item
          ></el-col>
          <el-col :span="8">
            <el-form-item label="身份证" prop="idCard">
              <el-input v-model="form.idCard" placeholder="请输入身份证" /> </el-form-item
          ></el-col>
          <el-col :span="8">
            <el-form-item label="身份证签发机关" prop="">
              <el-input v-model="form.idCardIssuing" placeholder="请输入身份证签发机关" /> </el-form-item
          ></el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="身份证有效期" prop="searchTime">
              <el-date-picker
                v-if="form.longTerm !== '1'"
                clearable
                v-model="form.searchTime"
                type="daterange"
                value-format="yyyy-MM-dd"
                placeholder="请选择身份证有效期结束时间"
              >
              </el-date-picker>
              <el-date-picker
                v-else
                clearable
                v-model="form.idCardStartTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择身份证有效期结束时间"
              >
              </el-date-picker>
              <el-checkbox class="longTerm" false-label="0" true-label="1" v-model="form.longTerm">长期</el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系方式" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入手机号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="民族" prop="">
              <el-select v-model="form.nation" placeholder="请选择">
                <el-option
                  v-for="dict in dict.type.sys_worship_ethnicgroup"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.label"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="行政区划" prop="divisionCode">
              <TreeSelectDivision
                v-model="form.divisionCode"
                @treeselectChange="(e) => treeselectChange(e, form)"
              ></TreeSelectDivision>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="政治面貌" prop="">
              <el-select v-model="form.politicalLandscape" placeholder="请选择政治面貌">
                <el-option
                  v-for="dict in dict.type.sys_worship_facetype"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="婚姻状况" prop="">
              <el-select v-model="form.maritalStatus" placeholder="请选择婚姻状况">
                <el-option
                  v-for="dict in dict.type.sys_worship_maritalstatus"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select> </el-form-item
          ></el-col>
          <el-col :span="8">
            <el-form-item label="户籍类别" prop="registeredResidenceType">
              <el-select v-model="form.registeredResidenceType" placeholder="请选择户籍类别">
                <el-option
                  v-for="dict in dict.type.sys_worship_householdeegistration"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select> </el-form-item
          ></el-col>
          <el-col :span="8">
            <el-form-item label="户籍管理单位" prop="registeredResidenceUnitCode">
              <TreeSelectDivision
                v-model="form.registeredResidenceUnitCode"
                @treeselectChange="
                  (e) => treeselectChange(e, form, 'registeredResidenceUnit', 'registeredResidenceUnitCode')
                "
              ></TreeSelectDivision>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="健康状况" prop="">
              <el-select v-model="form.health" placeholder="请选择健康状况">
                <el-option
                  v-for="dict in dict.type.sys_worship_physicalcondition"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select> </el-form-item
          ></el-col>
          <el-col :span="8">
            <el-form-item label="文化程度" prop="">
              <el-select v-model="form.culturalStatus" placeholder="请选择文化程度">
                <el-option
                  v-for="dict in dict.type.sys_worship_educationlevel"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select> </el-form-item
          ></el-col>
          <!-- <el-col :span="8">
            <el-form-item label="人员类别" prop="">
              <el-select v-model="form.health" placeholder="请选择人员类别">
                <el-option
                  v-for="dict in dict.type.sys_worship_personneltype"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select> </el-form-item
          ></el-col> -->
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="户籍地" prop="registeredResidence">
              <el-cascader
                v-model="registeredResidence"
                clearable
                ref="registeredResidence"
                :props="customProps"
                @change="handleChange('registeredResidence')"
                :options="mapList"
                :placeholder="formData.registeredResidenceCode ? '请选择' : form.registeredResidence"
              ></el-cascader> </el-form-item
          ></el-col>

          <el-col :span="16">
            <el-form-item label="户籍地详细地址" prop="">
              <el-input v-model="form.registeredResidenceAddress" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="常住地" prop="permanentResidence">
              <el-cascader
                v-model="permanentResidence"
                clearable
                ref="permanentResidence"
                :props="customProps"
                @change="handleChange('permanentResidence')"
                :options="mapList"
                :placeholder="formData.permanentResidenceCode ? '请选择' : form.permanentResidence"
              ></el-cascader> </el-form-item
          ></el-col>
          <el-col :span="16">
            <el-form-item label="常住地详细地址" prop="">
              <el-input v-model="form.permanentResidenceAddress" placeholder="请输入内容" /> </el-form-item
          ></el-col>
        </el-row>

        <el-form-item label="人员标签" prop="">
          <el-select v-model="personTagsList" multiple placeholder="请选择人员标签">
            <el-option
              v-for="dict in peoPleTagList"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item label="是否关注重点群体" prop="whetherToFocusOnGroups">
              <el-select v-model="form.whetherToFocusOnGroups" placeholder="请选择" clearable>
                <el-option
                  v-for="dict in dict.type.sys_0_1"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="重点类型" prop="keyTypes" v-if="form.whetherToFocusOnGroups === '1'">
              <el-select v-model="form.keyTypes" placeholder="请选择重点群体类型">
                <el-option
                  v-for="dict in dict.type.sys_worship_focustype"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select> </el-form-item
          ></el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addBasicPerson, updateBasicPerson, transferRetireMan } from '@/api/worship/retiredSoldier';
import { testIdentity, checkPhone } from '@/utils/regular';
export default {
  props: ['title', 'open', 'formData'],
  components: {},
  dicts: [
    'sys_worship_householdeegistration',
    'sys_worship_personneltag',
    'sys_worship_facetype',
    'sys_worship_physicalcondition',
    'sys_worship_focustype',
    'sys_worship_educationlevel',
    'sys_worship_ethnicgroup',
    'sys_worship_maritalstatus',
    'sys_user_sex',
    'sys_yes_no',
    'sys_0_1',
  ],
  data() {
    return {
      form: {
        longTerm: '0',
      },
      longTermTag: false,
      permanentResidence: [],
      registeredResidence: [],
      buttonLoading: false,
      customProps: {
        emitPath: true,
        label: 'name',
        value: 'adcode',
      },
      personTagsList: [],
      rules: {
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        idCard: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('身份证不能为空'));
              } else if (!testIdentity(value)) {
                callback(new Error('请输入正确的身份证'));
              } else {
                callback();
              }
            },
          },
        ],
        phone: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('手机号不能为空'));
              } else if (!checkPhone(value)) {
                callback(new Error('请输入正确的手机号'));
              } else {
                callback();
              }
            },
          },
        ],
        divisionCode: [{ required: true, message: '行政区划代码不能为空', trigger: 'blur' }],
        registeredResidenceUnitCode: [{ required: true, message: '户籍管理单位不能为空', trigger: 'blur' }],
        registeredUnitCode: [{ required: true, message: '户籍类别管理单位不能为空', trigger: 'blur' }],
        divisionName: [{ required: true, message: '行政区划名称不能为空', trigger: 'blur' }],
        registeredResidenceType: [{ required: true, message: '户籍类别不能为空', trigger: 'change' }],
        registeredResidenceUnit: [{ required: true, message: '户籍管理单位不能为空', trigger: 'blur' }],
        registeredResidence: [{ required: true, message: '户籍地不能为空', trigger: 'blur' }],
        permanentResidence: [{ required: true, message: '常住地不能为空', trigger: 'blur' }],
        whetherToFocusOnGroups: [{ required: true, message: '是否重点关注群体不能为空', trigger: 'change' }],
        keyTypes: [{ required: true, message: '重点类型不能为空', trigger: 'change' }],
        personTagsList: [{ required: true, message: '人员标签不能为空', trigger: 'change' }],
      },
    };
  },
  computed: {
    mapList() {
      return this.$store.getters.mapList;
    },
    peoPleTagList() {
      return this.$store.state.user.peoPleTagList;
    },
  },
  watch: {
    formData(nv, ov) {
      if (nv) {
        this.form = JSON.parse(JSON.stringify(nv));
        this.registeredResidence = this.form.registeredResidenceCode?.split(',');
        this.permanentResidence = this.form.permanentResidenceCode?.split(',');
        this.personTagsList = this.form.personnelTags ? this.form.personnelTags.split(',') : [];
        if (this.form.idCardStartTime && this.form.idCardEndTime) {
          this.form.searchTime = [this.form.idCardStartTime, this.form.idCardEndTime];
        }
        this.$set(this.form, 'whetherToFocusOnGroups', '0');
        console.log(this.form);
      }
    },
  },
  mounted() {},
  methods: {
    handleChange(value) {
      let data = this.$refs[value]?.getCheckedNodes();
      this.form[`${value}Code`] = this[value].join(',');
      this.form[value] = data[0].pathLabels.join(',');
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.longTerm !== '1') {
            this.form.idCardStartTime = this.form?.searchTime?.[0] || null;
            this.form.idCardEndTime = this.form?.searchTime?.[1] || null;
          }
          this.form.personnelTags = this.personTagsList.join(',');
          this.form.attribute = 1;
          if (this.title === '转退役军人') {
            this.form.serviceManId = this.form.id;
            transferRetireMan(this.form)
              .then((response) => {
                this.$modal.msgSuccess('转退役军人成功');
                this.$emit('success');
              })
              .finally(() => {
                this.buttonLoading = false;
              });
            return;
          }
          if (this.title === '转区内退役军人') {
            this.form.outsideArea = 0;
          }
          if (this.form.id != null) {
            updateBasicPerson(this.form)
              .then((response) => {
                this.$modal.msgSuccess('修改成功');
                this.$emit('success');
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else {
            addBasicPerson(this.form)
              .then((response) => {
                this.$modal.msgSuccess('新增成功');
                this.$emit('success');
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          }
        }
      });
    },
    cancel() {
      this.$emit('cancel');
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .el-cascader .el-input__inner::placeholder {
  color: #000; // 你想要的颜色
}
.longTerm {
  margin: 0 0 0 16px;
}
</style>
