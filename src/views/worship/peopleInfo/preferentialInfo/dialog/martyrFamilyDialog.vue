<template>
  <div class="workInfoEditDialog">
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body @close="cancel">
      <el-form ref="form" :model="form.expandContent" :rules="rules" label-width="160px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="与烈士关系：" prop="">
              <el-select v-model="form.expandContent.martyrsRelations">
                <el-option
                  v-for="(item, index) in dict.type.sys_worship_xyjrjsgx"
                  :key="index"
                  :label="item.label"
                  :value="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否是持证人：" prop="">
              <el-radio-group v-model="form.expandContent.holder">
                <el-radio v-for="(item, index) in collegeStudents" :key="index" :label="item">{{ item }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="证明书编号：" prop="">
              <el-input v-model="form.expandContent.certificateNumber" type="number"></el-input>
            </el-form-item>
          </el-col>
          <el-checkbox v-model="form.expandContent.laborCapacity">遗失</el-checkbox>
        </el-row>
        <div class="line"></div>
        <el-row>
          <el-form-item label="" prop="" label-width="80px">
            <div class="title">烈士情况</div>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名：" prop="">
              <el-input v-model="form.expandContent.martyrsNames"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别：" prop="">
              <el-radio-group v-model="form.expandContent.sex">
                <el-radio v-for="(item, index) in sex" :key="index" :label="item">{{ item }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="出生日期：" prop="">
              <el-date-picker
                v-model="form.expandContent.birthday"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入伍日期：" prop="">
              <el-date-picker
                v-model="form.expandContent.dateOfEnlistment"
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
            <el-form-item label="生前所在单位：" prop="">
              <el-input v-model="form.expandContent.livingUnit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="牺牲日期：" prop="">
              <el-date-picker
                v-model="form.expandContent.sacrificialDate"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-form-item label="牺牲原因：" prop="">
            <el-input v-model="form.expandContent.sacrificialReasons"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="评定时间：" prop="">
              <el-date-picker
                v-model="form.expandContent.evaluationTime"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="评定烈士单位：" prop="">
              <el-input v-model="form.expandContent.assessingMartyrsUnits"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-form-item label="烈士安葬情况：" prop="">
            <el-radio-group v-model="form.expandContent.theBurialOfMartyrs">
              <el-radio v-for="(item, index) in theBurialOfMartyrs" :key="index" :label="item">{{ item }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="烈士安葬地：" prop="">
              <TreeSelectDivision
                v-model="form.expandContent.martyrsBurialGroundCode"
                @treeselectChange="
                  (e) => treeselectChange(e, form.expandContent, 'martyrsBurialGround', 'martyrsBurialGroundCode')
                "
              ></TreeSelectDivision>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="" label-width="0px">
              <el-input v-model="form.expandContent.martyrsBurialGrounds" placeholder="请输入详细地址"></el-input>
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
        expandChildType: 'G3',
        expandParentType: 'G',

        expandContent: {},
      },
      laborCapacity: ['具备劳动能力', '劳动功能障碍'],
      sex: ['男', '女'],
      theBurialOfMartyrs: ['境内', '境外', '不清楚'],
      disabilityNature: ['因战', '因公', '因病'],
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
