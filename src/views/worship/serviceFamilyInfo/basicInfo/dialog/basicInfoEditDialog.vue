<template>
  <div class="editDialog">
    <!-- 添加或修改基础身份信息 -->
    <el-dialog
      title="修改基础身份信息"
      :visible.sync="open"
      width="1080px"
      append-to-body
      @close="cancel"
      destroy-on-close
    >
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
            <el-form-item label="身份证有效期" prop="dateRange">
              <!-- 有效期不为长期 -->
              <el-date-picker
                v-if="form.longTerm !== '1'"
                clearable
                v-model="dateRange"
                type="daterange"
                value-format="yyyy-MM-dd"
                placeholder="请选择身份证有效期结束时间"
              >
              </el-date-picker>
              <!-- 有效期为长期 -->
              <el-date-picker
                v-else
                clearable
                v-model="form.idCardStartTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择身份证有效期结束时间"
              >
              </el-date-picker>
              <el-checkbox
                class="longTerm"
                false-label="0"
                true-label="1"
                v-model="form.longTerm"
                @change="longTermChange"
                >长期</el-checkbox
              >
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
                  :value="dict.label"
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
                  :value="dict.label"
                ></el-option>
              </el-select> </el-form-item
          ></el-col>
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
            <el-form-item label="文化程度" prop="culturalStatus">
              <el-select v-model="form.culturalStatus" placeholder="请选择文化程度">
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
            <el-form-item label="户籍类别" prop="registeredType">
              <el-select v-model="form.registeredResidenceType" placeholder="请选择户籍类别">
                <el-option
                  v-for="dict in dict.type.sys_worship_householdeegistration"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.label"
                ></el-option>
              </el-select> </el-form-item
          ></el-col>
          <el-col :span="8">
            <el-form-item label="户籍管理单位" prop="registeredResidenceUnit">
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
            <el-form-item label="户籍地" prop="registeredResidence">
              <el-cascader
                v-model="registeredResidence"
                clearable
                ref="registeredResidence"
                :props="customProps"
                @change="handleChange('registeredResidence')"
                :options="mapList"
                placeholder="请选择户籍地"
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
                placeholder="请选择常住地"
              ></el-cascader> </el-form-item
          ></el-col>
          <el-col :span="16">
            <el-form-item label="常住地详细地址" prop="">
              <el-input v-model="form.permanentResidenceAddress" placeholder="请输入内容" /> </el-form-item
          ></el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="人员标签" prop="personnelTags">
              <el-select v-model="personTagsList" multiple placeholder="请选择人员标签" clearable >
                <el-option
                  v-for="dict in $store.state.user.peoPleTagList"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
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
          <el-col :span="8">
            <el-form-item label="是否随军" prop="accompanyingStatus">
              <el-select v-model="form.accompanyingStatus" placeholder="请选择" clearable>
                <el-option
                  v-for="dict in dict.type.sys_0_1"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="是否安置" prop="placementStatus">
              <el-select v-model="form.placementStatus" placeholder="请选择" clearable>
                <el-option
                  v-for="dict in dict.type.sys_0_1"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
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
  </div>
</template>
<script>
import { getBasicPerson, addBasicPerson, updateBasicPerson } from '@/api/worship/retiredSoldier';
export default {
  name: 'BasicInfoEditDialog',
  props: {
    propsId: '',
  },
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
  components: {},
  data() {
    return {
      open: true,
      form: {
        longTerm: '0',
      },
      dateRange: [], // 身份证有效期
      permanentResidence: [],
      registeredResidence: [],
      personTagsList: [],
      customProps: {
        emitPath: true,
        label: 'name',
        value: 'adcode',
      },
      datePickerOptions: {
        shortcuts: [
          {
            text: '5年',
            onClick(picker) {
              const start = picker.minDate ? picker.minDate : new Date();
              const end = new Date();
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 365 * 5);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '10年',
            onClick(picker) {
              const end = new Date();
              const start = picker.minDate ? picker.minDate : new Date();
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 365 * 10);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '20年',
            onClick(picker) {
              const end = new Date();
              const start = picker.minDate ? picker.minDate : new Date();
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 365 * 20);
              picker.$emit('pick', [start, end]);
            },
          },
        ],
      },
      // 表单校验
      rules: {
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        idCard: [{ required: true, message: '身份证不能为空', trigger: 'blur' }],
        phone: [{ required: true, message: '联系方式不能为空', trigger: 'blur' }],
        divisionCode: [{ required: true, message: '行政区划代码不能为空', trigger: 'blur' }],
        registeredResidenceUnit: [{ required: true, message: '户籍管理单位不能为空', trigger: 'blur' }],
        registeredUnitCode: [{ required: true, message: '户籍管理单位不能为空', trigger: 'blur' }],
        registeredResidenceType: [{ required: true, message: '户籍类别管理单位不能为空', trigger: 'blur' }],
        divisionName: [{ required: true, message: '行政区划名称不能为空', trigger: 'blur' }],
        registeredResidenceType: [{ required: true, message: '户籍类别不能为空', trigger: 'change' }],
        registeredResidence: [{ required: true, message: '户籍地不能为空', trigger: 'blur' }],
        permanentResidence: [{ required: true, message: '常住地不能为空', trigger: 'blur' }],
        whetherToFocusOnGroups: [{ required: true, message: '是否重点关注群体不能为空', trigger: 'change' }],
        keyTypes: [{ required: true, message: '重点类型不能为空', trigger: 'change' }],
      },
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
    longTermChange(value) {
      console.log('🚀 ~ longTermChange ~ value:', value, typeof value);
      if (value == '1') {
        this.dateRange = [];
      }
    },
    getData() {
      getBasicPerson(this.propsId).then((response) => {
        let data = response.data;
        console.log('getBasicPerson', data);
        // 户籍地
        this.registeredResidence = data.registeredResidenceCode ? data.registeredResidenceCode.split(',') : [];
        console.log(this.registeredResidence);
        this.permanentResidence = data.permanentResidenceCode ? data.permanentResidenceCode.split(',') : [];
        this.personTagsList = data.personnelTags ? data.personnelTags.split(',') : [];
        this.form = data;
        if (this.form.idCardStartTime && this.form.idCardEndTime) {
          this.dateRange = [data.idCardStartTime, data.idCardEndTime];
        }
        console.log('update', this.form);
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.longTerm !== '1') {
            this.form.idCardStartTime = this.form?.searchTime?.[0] || null;
            this.form.idCardEndTime = this.form?.searchTime?.[1] || null;
          }
          this.form.personnelTags = this.personTagsList.join(',');
          this.form.attribute = 3;
          if (this.form.id != null) {
            console.log('修改', this.form);
            updateBasicPerson(this.form)
              .then((response) => {
                this.$modal.msgSuccess('修改成功');
                this.$emit('success');
                this.$emit('close');
                // this.open = false;
                // this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else {
            addBasicPerson(this.form)
              .then((response) => {
                this.$modal.msgSuccess('新增成功');
                this.$emit('success');
                this.$emit('close');
                // this.open = false;
                // this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          }
        }
      });
    },
    handleChange(value) {
      let data = this.$refs[value]?.getCheckedNodes();
      this.form[`${value}Code`] = this[value].join(',');
      this.form[value] = data[0].pathLabels.join(',');
    },
    cancel() {
      this.$emit('close');
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .el-cascader .el-input__inner::placeholder {
  color: #000; // 你想要的颜色
}
.el-icon-location-information {
  font-size: 24px;
  margin: 5px 0 0 18px;
  cursor: pointer;
}
.longTerm {
  margin: 0 0 0 16px;
}
</style>
