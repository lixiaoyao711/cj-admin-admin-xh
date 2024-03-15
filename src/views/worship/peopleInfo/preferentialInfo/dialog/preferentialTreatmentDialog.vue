<template>
  <!-- 抚恤优待情况 -->
  <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body @close="cancel">
    <el-form ref="form" :model="form.expandContent" :rules="rules" label-width="140px">
      <el-row>
        <el-form-item label="人员类别：" prop="">
          <el-checkbox-group v-model="form.expandContent.personnelCategory">
            <el-checkbox
              v-for="(item, index) in dict.type.sys_worship_tuiyijunrenyoufuleibie"
              :key="item.label"
              :label="item.label"
            ></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="享受优抚待遇情况：" prop="">
          <el-checkbox-group v-model="form.expandContent.preferentialTreatment">
            <el-checkbox v-for="(item, index) in preferentialTreatment" :key="index" :label="item"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item label="供养情况：" prop="">
          <el-radio-group v-model="form.expandContent.supportSituation">
            <el-radio v-for="(item, index) in supportSituation" :key="index" :label="item">{{ item }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="供养单位：" prop="">
          <el-select v-model="form.expandContent.supportingUnit">
            <el-option
              v-for="(item, index) in dict.type.sys_worship_gydw"
              :key="index"
              :label="item.label"
              :value="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="孤老情况：" prop="">
            <el-radio-group v-model="form.expandContent.lonelyElderlySituation">
              <el-radio v-for="(item, index) in collegeStudents" :key="index" :label="item">{{ item }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="孤儿情况：" prop="">
            <el-radio-group v-model="form.expandContent.orphan">
              <el-radio v-for="(item, index) in collegeStudents" :key="index" :label="item">{{ item }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
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
import { getBasicPerson, updateBasicPerson } from '@/api/worship/externalPerson.js'; //人员基本信息
import { String2Array, Array2String } from '@/utils/toolFn.js';

export default {
  dicts: ['sys_worship_gydw', 'sys_worship_tuiyijunrenyoufuleibie'],
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
        expandChildType: 'G1',
        expandParentType: 'G',
        expandContent: {
          personnelCategory: [],
          preferentialTreatment: [],
        },
      },
      personnelCategory: [
        '退伍红军老战士',
        '西路军红军老战士',
        '红军失散人员',
        '老复员军人',
        '带病回乡退伍军人',
        '年满60周岁衣村籍退役士兵',
        '烈士老年子女',
        '残疾军人',
        '伤残民兵民工',
        '伤残人民警察',
        '伤残预备役人员',
        '因公伤残人员',
        '烈土遗属',
        '因公牺牲军人遗属',
        '病故军人遗属',
      ],
      preferentialTreatment: ['定期抚恤金', '定期生活补助金', '定期护理费', '其他', '不享受'],
      collegeStudents: ['是', '否'],
      supportSituation: ['集中供养', '分散供养', '无'],
      certificateCategory: [
        '职业资格证',
        '职业技能等级证',
        '专项职业能力证',
        '特种作业操作证',
        '全民技能提升培训合格证',
        '其他',
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
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      // 初始化数据
      if (this.propsId) {
        // 拓展数据id存在 -> 编辑
        getPersonExpandById(this.propsId).then((res) => {
          this.form = res.data;
          this.form.expandContent = JSON.parse(this.form.expandContent);
          if (Object.keys(this.form.expandContent).length === 0) {
            this.$set(this.form, 'expandContent', {
              personnelCategory: [],
              preferentialTreatment: [],
            });
          } else {
            // 人员类别 字符串转成 数组
            this.form.expandContent.personnelCategory = String2Array(this.form.expandContent.personnelCategory);
          }
        });
      }
    },
    getDictValueString(dictArray, checkedLabelArray) {
      let checkedDictValueStr = ''; // 转字符串拼接
      let checkedDictValueArr = []; //根据checkedLabelArray获取对应Dict的Value
      // console.log(dictArray, checkedLabelArray);
      if (checkedLabelArray && dictArray) {
        dictArray.map((item) => {
          if (Array.isArray(checkedLabelArray)) {
            //数组
            if (checkedLabelArray.includes(item.label)) {
              checkedDictValueArr.push(item.value);
            }
          } else if (typeof checkedLabelArray == 'string') {
            //字符串
            let labelArray = String2Array(checkedLabelArray);
            if (labelArray.includes(item.label)) {
              checkedDictValueArr.push(item.value);
            }
          }
        });
      }
      checkedDictValueStr = Array2String(checkedDictValueArr);
      console.log('🚀 checkedDictValueArr:', checkedDictValueArr, checkedDictValueStr);
      return checkedDictValueStr;
    },
    async updateBasicPersonData(personnelCategory) {
      // 根据表单人员类别 同步修改 人员基本信息的  抚恤类别
      // retirePreferentialCategory(退役军人抚恤优待类别,其他优抚对象也是用这个字段)
      if (this.$route.params.id) {
        let { data, code, msg } = await getBasicPerson(this.$route.params.id);
        let new_personnelCategory = this.getDictValueString(
          this.dict.type.sys_worship_tuiyijunrenyoufuleibie,
          personnelCategory
        );
        data.retirePreferentialCategory = new_personnelCategory;
        let result = await updateBasicPerson(data);
        // console.log('🚀 ~ updateBasicPersonData ', data, new_personnelCategory, result);
      }
    },
    submitForm() {
      this.$refs['form'].validate((val) => {
        if (val) {
          let personnelCategoryArray = JSON.parse(JSON.stringify(this.form.expandContent.personnelCategory));
          this.form.expandContent.personnelCategory = Array2String(this.form.expandContent.personnelCategory);
          this.form.expandContent = JSON.stringify(this.form.expandContent);
          this.form.personId = this.$route.params.id;
          if (this.propsId) {
            updatePersonExpand(this.form).then((res) => {
              this.$message.success('修改成功');
              this.updateBasicPersonData(personnelCategoryArray);
              this.$emit('success');
              this.$emit('close');
            });
          } else {
            addPersonExpand(this.form).then((res) => {
              this.updateBasicPersonData(personnelCategoryArray);
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
.check {
  margin: 6px 0 0 12px;
}
</style>
