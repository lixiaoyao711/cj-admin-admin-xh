<!-- 现役军人家属详情-基本信息-家庭成员关系 -->
<template>
  <div class="workInfoEditDialog">
    <el-dialog :title="title" :visible.sync="open" width="900px" append-to-body @close="cancel">
      <el-form ref="form" :model="form.expandContent" :rules="rules" label-width="140px">
        <el-row>
          <el-col :span="11">
            <el-form-item label="与现役军人关系" prop="relationship">
              <el-input v-model="form.expandContent.relationship" placeholder="请输入" /> </el-form-item
          ></el-col>
          <el-col :span="11">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="form.expandContent.name" placeholder="请输入" /> </el-form-item
          ></el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="身份证号" prop="idCard">
              <el-input v-model="form.expandContent.idCard" placeholder="请输入" /> </el-form-item
          ></el-col>
          <el-col :span="11">
            <el-form-item label="应征地" prop="landAcquisitionCode">
              <el-cascader
                :disabled="title === '现役军人详情'"
                v-model="form.expandContent.landAcquisitionCode"
                clearable
                ref="landAcquisition"
                :props="customProps"
                @change="handleChange('landAcquisition')"
                :options="mapList"
                placeholder="请选择"
              ></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="军队驻地" prop="armyBaseCode">
              <el-cascader
                ref="armyBase"
                :disabled="title === '现役军人详情'"
                v-model="form.expandContent.armyBaseCode"
                clearable
                :props="customProps"
                @change="handleChange('armyBase')"
                :options="mapList"
                placeholder="请选择"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="服役地区" prop="serviceArea">
              <el-select
                :disabled="title === '现役军人详情'"
                v-model="form.expandContent.serviceArea"
                placeholder="请选择服役地区"
                clearable
              >
                <el-option
                  v-for="dict in dict.type.sys_worship_servicearea"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="军人类别" prop="">
              <el-select v-model="form.expandContent.militaryCategory" placeholder="请选择军人类别">
                <el-option
                  v-for="item in soldierType"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="军衔等级" prop="rankLevel">
              <el-select v-model="form.expandContent.rankLevel" placeholder="请选择军人类别">
                <el-option
                  v-for="(item, index) in soldierTypeLevel"
                  :key="item"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
              <!-- <el-radio-group v-model="form.expandContent.rankLevel">
                <el-radio
                  v-for="(item, index) in soldierType.find((item) => item.name === form.expandContent.militaryCategory).value"
                  :key="index"
                  :label="item"
                  >{{ item }}</el-radio
                >
              </el-radio-group> -->
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
import { testIdentity, checkPhone } from '@/utils/regular';
// 编辑人员拓展信息
import { getPersonExpandById, addPersonExpand, updatePersonExpand } from '@/api/worship/retiredSoldier';
export default {
  props: {
    propsId: '',
    title: {
      type: String,
      default: '',
    },
  },
  dicts: [
    'sys_worship_personneltype',
    'sys_worship_physicalcondition',
    'sys_worship_servicearea',
    'sys_worship_militaryrank',
  ],
  components: {},
  data() {
    return {
      open: true,
      customProps: {
        emitPath: true,
        label: 'name',
        value: 'adcode',
      },
      form: {
        expandChildType: 'A2',
        expandParentType: 'A',
        expandContent: {
          relationship: '', //与现役军人关系
          name: '', //与现役军人关系
          idCard: '', //身份证号
          landAcquisition: '', //应征地(文字)
          landAcquisitionCode: '', //应征地(code字符串)
          armyBase: '', //军队驻地(文字)
          armyBaseCode: '', //军队驻地(code字符串)
          militaryCategory: '', //军人类别
          rankLevel: '', //军衔等级
        },
      },
      soldierType: [
        {
          name: '军官',
          value: ['上将', '中将', '少将', '大校', '中校', '上校', '少校', '上尉', '中尉', '少尉'],
        },
        {
          name: '文职',
          value: [
            '文职特级',
            '文职一级',
            '文职二级',
            '文职三级',
            '文职四级',
            '文职五级',
            '文职六级',
            '文职七级',
            '文职八级',
            '文职九级',
          ],
        },
        {
          name: '高级士官',
          value: ['一级士官', '二级士官', '三级士官', '四级士官', '五级士官'],
        },
        {
          name: '中级士官',
          value: ['一级士官', '二级士官', '三级士官', '四级士官', '五级士官'],
        },
        {
          name: '初级士官',
          value: ['一级士官', '二级士官', '三级士官', '四级士官', '五级士官'],
        },
        {
          name: '义务兵',
          value: ['上士', '中士', '下士', '上等兵', '列兵'],
        },
        {
          name: '志愿兵',
          value: [
            '一级志愿兵',
            '二级志愿兵',
            '三级志愿兵',
            '四级志愿兵',
            '五级志愿兵',
            '六级志愿兵',
            '七级志愿兵',
            '八级志愿兵',
          ],
        },
      ],
      rules: {
        relationship: [{ required: true, message: '关系不能为空', trigger: 'blur' }],
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
        militaryCategory: [{ required: true, message: '军人类别不能为空', trigger: 'blur' }],
      },
    };
  },
  computed: {
    mapList() {
      return this.$store.getters.mapList;
    },
    soldierTypeLevel() {
      let data = [];
      if (this.form.expandContent.militaryCategory) {
        data = this.soldierType.find((item) => item.name === this.form.expandContent.militaryCategory).value;
      }
      // console.log('soldierTypeLevel', data);
      return data;
    },
  },
  watch: {},
  created() {},
  mounted() {
    this.getData();
  },
  methods: {
    handleChange(key) {
      let data = this.$refs[key]?.getCheckedNodes();
      // console.log(key, data);
      this.form.expandContent[key] = data[0].pathLabels.join(',');
      this.form.expandContent[`${key}Code`] = data[0].path.join(',');
      console.log(this.form.expandContent[key], this.form.expandContent[`${key}Code`], this.form.expandContent);
    },
    getData() {
      if (this.propsId) {
        getPersonExpandById(this.propsId).then((res) => {
          let expandContent = JSON.parse(res.data.expandContent);
          console.log(res.data.expandContent, expandContent);
          ['armyBaseCode', 'landAcquisitionCode'].map((key) => {
            if (typeof expandContent[key] == 'string') {
              expandContent[key] = expandContent[key].split(',');
            }
          });
          // expandContent['armyBaseCode'] = expandContent['armyBaseCode'].split(',');
          // expandContent['landAcquisitionCode'] = expandContent['landAcquisitionCode'].split(',');
          res.data['expandContent'] = expandContent;
          this.form = res.data;
          console.log(this.form);
        });
      }
    },
    submitForm() {
      this.$refs['form'].validate((val) => {
        if (val) {
          ['armyBaseCode', 'landAcquisitionCode'].map((key) => {
            if (typeof this.form.expandContent[key] !== 'string') {
              this.form.expandContent[key] = this.form.expandContent[key].join(',');
            }
          });
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
  },
};
</script>

<style scoped lang="scss">
.workInfoEditDialog {
}
.icon {
  cursor: pointer;
  color: red;
  margin: 5px 0 0 16px;
  font-size: 20px;
}
.peopleList {
  display: flex;
  // justify-content: space-between;
  .item {
    // flex: 20%;
    width: 46%;
  }
}
</style>
