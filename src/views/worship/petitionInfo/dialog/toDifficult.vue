<template>
  <div class="toDifficult">
    <!-- 困难转出 -->
    <el-dialog title="困难转入" :visible.sync="open" width="50%" append-to-body @close="cancel">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <template>
          <el-form-item label="核实困难类型：" prop="verifyTypeDifficulty">
            <el-checkbox-group v-model="verifyTypeDifficultyList" @change="handleCheckboxChange">
              <el-checkbox v-for="dict in dict.type.sys_worship_difficultytype" :key="dict.value" :label="dict.label">
                {{ dict.label }}</el-checkbox
              >
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="困难情况说明：" prop="explanationDifficulties">
            <el-input v-model="form.explanationDifficulties" type="textarea" placeholder="请输入困难情况说明" />
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { updateCareInfo, careInfoList, addCareInfo } from '@/api/worship/carePersonList';

export default {
  props: {
    propsData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  dicts: ['sys_worship_difficultytype'],

  components: {},
  data() {
    return {
      verifyTypeDifficultyList: [],
      // 表单参数
      form: {},
      open: true, // 表单校验
      rules: {
        verifyTypeDifficulty: [{ required: true, message: '核实困难类型不能为空', trigger: 'blur' }],
        explanationDifficulties: [{ required: true, message: '困难情况说明不能为空', trigger: 'blur' }],
      },
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.form = this.propsData;
  },
  methods: {
    handleCheckboxChange(val) {
      this.form.verifyTypeDifficulty = val.join(',');
    },
    /** 提交按钮 */
    submitForm() {
      const { verifyTypeDifficulty, explanationDifficulties } = this.form;
      const personId = this.form.difficultTypeList?.[0].id || this.propsData.id;
      const params = {
        verifyTypeDifficulty,
        explanationDifficulties,
        personId,
        type: '1',
      };
      this.$refs['form'].validate((valid) => {
        if (valid) {
          addCareInfo(params)
            .then((response) => {
              this.$modal.msgSuccess('成功');
              this.form = {};
              this.$emit('success');
            })
            .finally(() => {});
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
.toDifficult {
}
</style>
