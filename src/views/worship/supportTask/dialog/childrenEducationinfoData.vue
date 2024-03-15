<template>
  <div>
    <el-dialog title="详情" :visible.sync="dialogVisible" width="500px" :before-close="handleClose">
      <el-form :model="propsData">
        <el-form-item label="姓名：">
          <span>{{ propsData.name }}</span>
        </el-form-item>
        <el-form-item label="性别：">
          <span>{{ propsData.sexName }}</span>
        </el-form-item>
        <el-form-item label="年龄：">
          <span>{{ propsData.age }}</span>
        </el-form-item>
        <el-form-item label="身份证号：">
          <span>{{ propsData.cardCode }}</span>
        </el-form-item>
        <el-form-item label="民族：">
          <span>{{ propsData.nationalName }}</span>
        </el-form-item>
        <el-form-item label="行政区划：">
          <span>{{ propsData.departName }}</span>
        </el-form-item>
        <el-form-item label="所属军人证号：">
          <span>{{ propsData.militaryCardCode }}</span>
        </el-form-item>
        <el-form-item label="学校名称：">
          <span>{{ propsData.academyName }}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="handleClose">取 消</el-button> -->
        <el-button type="primary" @click="saveItem">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    propsData: Object,
  },
  components: {},
  data() {
    return {
      dialogVisible: true,
      formData: {
        name: '',
        region: '',
        type: '',
      },
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    handleClose() {
      this.$emit('close');
    },
    saveItem() {
      this.$emit('close');
    },
  },
};
</script>

<style scoped lang="scss">
img {
  width: 104px;
  height: 104px;
  background: #ffffff;
  border-radius: 2px;
  border: 1px solid rgba(0, 0, 0, 0.15);
}
</style>
