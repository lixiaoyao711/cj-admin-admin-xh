<template>
  <el-dialog title="服役情况" :visible.sync="open" width="900px" append-to-body @close="cancel">
    <el-form ref="form" :model="form.expandContent" :rules="rules" label-width="110px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="入伍时间" prop="">
            <el-date-picker
              v-model="form.expandContent.dateOfEnlistment"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="入伍时户籍" prop="">
            <el-radio-group v-model="form.expandContent.rwRegisteredResidence">
              <el-radio label="城镇">城镇</el-radio>
              <el-radio label="农村">农村</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="入伍地" prop="">
          <el-cascader
            v-model="conscriptionSite"
            clearable
            ref="conscriptionSite"
            :props="customProps"
            @change="handleChange('conscriptionSite')"
            :options="mapList"
            placeholder="请选择"
          ></el-cascader>
        </el-form-item>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="部队代号" prop="">
            <el-input v-model="form.expandContent.unitCode"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="大单位" prop="">
            <el-select v-model="form.expandContent.largeUnits">
              <el-option
                v-for="(item, index) in dict.type.sys_worship_dadanwei"
                :key="item.label"
                :label="item.label"
                :value="item.label"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="二次入伍情况" prop="">
          <el-radio-group v-model="form.expandContent.secondEnlistment">
            <el-radio label="是">是</el-radio>
            <el-radio label="否">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="军人类别" prop="">
          <el-select
            :disabled="title === '现役军人详情'"
            v-model="form.expandContent.militaryCategory"
            placeholder="请选择军人类别"
          >
            <el-option
              v-for="dict in dict.type.sys_worship_personneltype"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
          <!-- <el-radio-group v-model="form.expandContent.militaryCategory">
              <el-radio v-for="(item, index) in soldierType" :key="index" :label="item.name">{{ item.name }}</el-radio>
            </el-radio-group> -->
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="军衔" prop="">
          <el-radio-group v-model="form.expandContent.militaryRank">
            <el-radio
              v-for="(item, index) in soldierType.find((item) => item.name === form.expandContent.militaryCategory)
                .value"
              :key="index"
              :label="item"
              >{{ item }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
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
  dicts: ['sys_worship_fyjrlb', 'sys_worship_fyjx', 'sys_worship_dadanwei'],
  components: {},
  data() {
    return {
      open: true,
      form: {
        expandChildType: 'C1',
        expandParentType: 'C',
        expandContent: {
          militaryCategory: '军官',
        },
      },
      customProps: {
        emitPath: true,
        label: 'name',
        value: 'name',
      },

      rules: {
        educationBackground: [{ required: true, message: '学历情况不能为空', trigger: 'blur' }],
        // name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
      },
      conscriptionSite: [],
      largeUnits: [],
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
          this.conscriptionSite = this.form.expandContent.conscriptionSite.split(',');
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
