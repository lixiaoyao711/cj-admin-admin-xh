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
            <el-form-item label="健康状况" prop="">
              <el-select v-model="form.healthCondition" placeholde r="请选择健康状况">
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
              <el-select v-model="form.educationLevel" placeholder="请选择文化程度">
                <el-option
                  v-for="dict in dict.type.sys_worship_educationlevel"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select> </el-form-item
          ></el-col>
        </el-row>
        <el-row>
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
                @treeselectChange="(e) => treeselectChange(e, form, 'registeredResidenceUnit', 'registeredResidenceUnitCode')"
              ></TreeSelectDivision>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="户籍地" prop="registeredResidence">
              <!-- <el-input v-model="form.registeredResidence" placeholder="请输入户籍地" />  -->
              <el-cascader
                v-model="registeredResidence"
                clearable
                ref="registeredResidence"
                :props="customProps"
                @change="handleChange('registeredResidence')"
                :options="mapList"
                placeholder="请选择"
              ></el-cascader> </el-form-item
          ></el-col>
          <el-col :span="16">
            <el-form-item label="户籍地详细地址" prop="">
              <el-input v-model="form.registeredResidenceAddress" placeholder="请输入内容" /> </el-form-item
          ></el-col>
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
                placeholder="请选择"
              ></el-cascader> </el-form-item
          ></el-col>
          <el-col :span="16">
            <el-form-item label="常住地详细地址" prop="">
              <el-input v-model="form.permanentResidenceAddress" placeholder="请输入内容" /> </el-form-item
          ></el-col>
        </el-row>

        <el-form-item label="人员标签" prop="">
          <el-select multiple v-model="personTagsList" placeholder="请选择人员标签">
            <el-option
              v-for="dict in dict.type.sys_worship_personneltag"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item label="是否关注重点群体" prop="whetherToFocusOnGroups">
              <el-select v-model="form.whetherToFocusOnGroups" placeholder="请选择" clearable>
                <el-option v-for="dict in dict.type.sys_0_1" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="重点类型" prop="keyGroupTypes" v-if="form.whetherToFocusOnGroups === '1'">
              <el-select v-model="form.keyGroupTypes" placeholder="请选择重点群体类型">
                <el-option
                  v-for="dict in dict.type.sys_worship_focustype"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select> </el-form-item
          ></el-col>
          <el-col :span="8">
            <el-form-item label="是否随军" prop="accompanyingStatus">
              <el-select v-model="form.accompanyingStatus" placeholder="请选择" clearable>
                <el-option v-for="dict in dict.type.sys_0_1" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="是否安置" prop="placementStatus">
              <el-select v-model="form.placementStatus" placeholder="请选择" clearable>
                <el-option v-for="dict in dict.type.sys_0_1" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="form.placementStatus === '1'">
            <el-form-item label="安置地" prop="placementResidence">
              <el-cascader
                v-model="placementResidence"
                clearable
                ref="placementResidence"
                :props="customProps"
                @change="handleChange('placementResidence')"
                :options="mapList"
                placeholder="请选择"
              ></el-cascader> </el-form-item
          ></el-col>
          <el-col :span="8" v-if="form.placementStatus === '1'">
            <el-form-item label="" prop="" label-width="20px">
              <el-input v-model="form.placementResidenceAddress" placeholder="请输入内容" /> </el-form-item
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
import { addBasicPerson, updateBasicPerson } from '@/api/worship/retiredSoldier';
import { testIdentity, checkPhone } from '@/utils/regular'
export default {
  props: ['title', 'open', 'formData'],
  components: {},
  dicts: [
    'sys_worship_householdeegistration',
    'sys_worship_personneltag',
    'sys_worship_facetype',
    'sys_user_sex',
    'sys_yes_no',
    'sys_worship_physicalcondition',
    'sys_worship_focustype',
    'sys_worship_educationlevel',
    'sys_worship_maritalstatus',
    'sys_worship_ethnicgroup',
    'sys_0_1',
  ],
  data() {
    return {
      form: {
        longTerm:'0'
      },
      permanentResidence: [],
      registeredResidence: [],
      buttonLoading:false,
      customProps: {
        emitPath: true,
        label: 'name',
        value: 'adcode',
      },
      personTagsList:[],
      placementResidence:[],
      rules: {
        id: [{ required: true, message: '主键不能为空', trigger: 'blur' }],
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
        idCardIssuing: [{ required: true, message: '身份证签发机关不能为空', trigger: 'blur' }],
        idCardStartTime: [{ required: true, message: '身份证有效期开始时间不能为空', trigger: 'blur' }],
        idCardEndTime: [{ required: true, message: '身份证有效期结束时间不能为空', trigger: 'blur' }],
        searchTime: [{ required: true, message: '身份证有效期不能为空', trigger: 'blur' }],
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
        nation: [{ required: true, message: '民族不能为空', trigger: 'blur' }],
        divisionName: [{ required: true, message: '行政区划名称不能为空', trigger: 'blur' }],
        divisionCode: [{ required: true, message: '行政区划代码不能为空', trigger: 'blur' }],
        politicalLandscape: [{ required: true, message: '政治面貌不能为空', trigger: 'change' }],
        maritalStatus: [{ required: true, message: '婚姻状况不能为空', trigger: 'change' }],
        healthCondition: [{ required: true, message: '健康状况不能为空', trigger: 'change' }],
        educationLevel: [{ required: true, message: '文化程度不能为空', trigger: 'change' }],
        registeredResidenceType: [{ required: true, message: '户籍类别不能为空', trigger: 'change' }],
        registeredResidenceUnitCode: [{ required: true, message: '户籍管理单位不能为空', trigger: 'blur' }],
        registeredResidence: [{ required: true, message: '户籍地不能为空', trigger: 'blur' }],
        registeredResidenceAddress: [{ required: true, message: '户籍地详细地址不能为空', trigger: 'blur' }],
        permanentResidence: [{ required: true, message: '常住地不能为空', trigger: 'blur' }],
        permanentResidenceAddress: [{ required: true, message: '常住地详细地址不能为空', trigger: 'blur' }],
        personTags: [{ required: true, message: '人员标签不能为空', trigger: 'change' }],
        whetherToFocusOnGroups: [{ required: true, message: '是否重点群体不能为空', trigger: 'change' }],
        keyGroupTypes: [{ required: true, message: '重点群体类型不能为空', trigger: 'change' }],
        accompanyingStatus: [{ required: true, message: '是否随军不能为空', trigger: 'change' }],
        placementStatus: [{ required: true, message: '是否安置不能为空', trigger: 'change' }],
        serviceMenId: [{ required: true, message: '关联现役军人id不能为空', trigger: 'blur' }],
        placementResidence: [{ required: true, message: '安置地不能为空', trigger: 'blur' }],
      },
    };
  },
  computed: {
    mapList() {
      return this.$store.getters.mapList;
    },
  },
  watch: {
    formData(nv,ov){
      if(nv){
        this.form = nv
        this.registeredResidence = this.form.registeredResidenceCode?.split(',');
        this.permanentResidence = this.form.permanentResidenceCode?.split(',');
        this.personTagsList = this.form.personnelTags ? this.form.personnelTags.split(',') : [];
        this.placementResidence = this.form.placementResidenceCode ? this.form?.placementResidenceCode?.split(',') : [];
        if(this.form.idCardStartTime && this.form.idCardEndTime){
          this.form.searchTime = [this.form.idCardStartTime, this.form.idCardEndTime]
        }
      }
    }
  },
  mounted() {
  },
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
          this.form.attribute = 3
          if(this.form.longTerm !== '1'){
            this.form.idCardStartTime = this.form?.searchTime?.[0] || null;
            this.form.idCardEndTime = this.form?.searchTime?.[1] || null;
          }
          this.form.personTags = this.personTagsList.join(',');
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
    cancel(){
      this.$emit('cancel');
    }
  },
};
</script>

<style scoped lang="scss">
.longTerm {
  margin: 0 0 0 16px;
}
</style>
