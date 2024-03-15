<template>
  <div class="changeTime">
    <el-dialog title="配置时间" :visible.sync="dialogVisible" width="700px" :before-close="handleClose">
      <el-form
        v-if="type == '1'"
        :model="formData"
        :rules="rules"
        ref="formData"
        label-width="100px"
        class="demo-formData"
      >
        <el-form-item label="选择日" prop="dateDay">
          <el-select filterable v-model="formData.dateDay" placeholder="请选择">
            <el-option v-for="(item, index) in 28" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择时间" prop="dateTime">
          <el-time-picker v-model="formData.dateTime" placeholder="请选择" format="HH:mm" value-format="HH:mm">
          </el-time-picker>
        </el-form-item>
      </el-form>
      <el-form
        v-if="type == '2'"
        :model="formData"
        :rules="rules"
        ref="formData"
        label-width="100px"
        class="demo-formData"
      >
        <el-form-item label="" prop="region">
          <template>
            <el-radio v-model="radio" label="1">每天通知</el-radio>
            <el-radio v-model="radio" label="2">按时间段</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="" prop="time" v-if="radio === '2'">
          <el-date-picker
            v-model="formData.time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始"
            end-placeholder="结束"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="" prop="dateTime">
          <el-time-picker v-model="formData.dateTime" placeholder="请选择" format="HH:mm" value-format="HH:mm">
          </el-time-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="saveItem">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { addRiskNoticeConfig, updateRiskNoticeConfig } from '@/api/system/disposition';
export default {
  props: {
    type: String,
    propsData: Object,
  },
  components: {},
  data() {
    return {
      rules: {
        dateDay: [{ required: true, message: '请选择', trigger: 'blur' }],
        dateTime: [{ required: true, message: '请选择', trigger: 'blur' }],
        time: [{ required: true, message: '请选择', trigger: 'blur' }],
      },
      radio: '0',
      dialogVisible: true,
      formData: {
        time: [],
      },
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.type == 2 ? (this.radio = '1') : '';

    if (this.propsData.id) {
      this.formData = this.propsData;
      if (this.formData.beginTime) {
        // this.formData.time = [this.formData.beginTime, this.formData.endTime];
        this.$set(this.formData, 'time', [this.formData.beginTime, this.formData.endTime]);
      }
    }
  },
  methods: {
    saveItem() {
      this.$refs.formData.validate((val) => {
        if (val) {
          if (this.formData.time) {
            this.formData.beginTime = this.formData.time[0];
            this.formData.endTime = this.formData.time[1];
            // delete this.formData.time;
          }
          if (this.formData.id) {
            updateRiskNoticeConfig({ ...this.formData, noticeType: this.radio, type: this.type }).then((res) => {
              this.$message.success('操作成功');
              this.handleClose();
            });
          } else {
            addRiskNoticeConfig({ ...this.formData, noticeType: this.radio, type: this.type }).then((res) => {
              this.$message.success('操作成功');
              this.handleClose();
            });
          }
        }
      });
    },
    handleClose() {
      this.$emit('close');
    },
  },
};
</script>

<style scoped lang="scss">
.changeTime {
  .el-select {
    width: auto;
  }
}
</style>
