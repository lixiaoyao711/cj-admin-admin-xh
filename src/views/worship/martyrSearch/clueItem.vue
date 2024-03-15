<!-- 寻亲线索 item -->
<!-- createTime : 2024-01-17 -->
<template>
  <div class="clue-item" v-if="data">
    <div class="header">
      <div class="info">
        <span class="lead-provider">{{ data.leadProvider }}</span>
        <span class="time">{{ data.createTime }} </span>
      </div>
      <span class="del-btn" v-hasPermi="['worship:martyrClue:remove']" @click="handelDel"> 删除 </span>
    </div>
    <div class="content">
      {{ data.content }}
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, getCurrentInstance } from 'vue';
import martyrClue from '@/api/worship/martyrClue';

const props = defineProps({
  data: Object,
});
const emit = defineEmits(['delSuccess']);
async function handelDel() {
  let { code } = await martyrClue.del(props.data.id);
  if (code === 200) {
    emit('delSuccess', props.data);
  }
}
onMounted(() => {});
</script>

<style lang="scss" scoped>
.clue-item {
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  border-bottom: 1px solid #e6ebf5;
  line-height: 2;
  > .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .info {
      flex: 1;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .lead-provider {
        color: #1890ff;
        margin-right: 20px;
      }
    }
    .del-btn {
      cursor: pointer;
      color: rgb(255, 0, 0);
    }
  }
  > .content {
  }
}
</style>
