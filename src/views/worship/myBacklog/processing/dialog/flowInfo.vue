<template>
  <div class="flowInfo">
    <el-dialog title="流转详情" :visible.sync="dialogVisible" width="500px" :before-close="handleClose">
      <el-timeline>
        <el-timeline-item
          placement="top"
          color="#409eff"
          v-for="(activity, index) in activities"
          :key="index"
          :timestamp="activity.updateTime"
        >
          {{ activity.content }}
        </el-timeline-item>
      </el-timeline>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleClose">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getLogList } from '@/api/worship/petitionInfo';
export default {
  props: {
    propsData: Object,
  },
  components: {},
  data() {
    return {
      dialogVisible: true,
      activities: [],
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      getLogList({
        petitionId: this.propsData.id,
        userId: this.propsData.submitId || null,
      }).then((res) => {
        this.activities = res.data;
      });
    },
    handleClose() {
      this.$emit('close');
    },
  },
};
</script>

<style scoped lang="scss">
.flowInfo {
}
</style>
