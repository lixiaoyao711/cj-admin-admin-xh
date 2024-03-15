<!-- 烈士寻亲 - 详情弹框 -->
<!-- createTime : 2024-01-17 -->
<template>
  <el-dialog
    title="详情"
    width="800px"
    top="10vh"
    :visible.sync="dialogVisible"
    :before-close="beforeClose"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    append-to-body
  >
    <el-descriptions :border="true" class="details" :column="1" size="small">
      <el-descriptions-item>
        <template slot="label">标题</template>
        {{ data.title }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label"> 类型 </template>
        {{ data.type === '0' ? '寻找烈士安葬地' : '寻找烈士亲属' }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label"> 发布日期 </template>
        {{ data.createTime }}
      </el-descriptions-item>
      +
      <el-descriptions-item>
        <template slot="label"> 内容 </template>
        <p>{{ data.content }}</p>
      </el-descriptions-item>
    </el-descriptions>
    <el-card v-if="data.id" class="clue-list">
      <template #header>
        <header class="card-header">
          <span class="title">线索</span>
          <!-- <el-button icon="el-icon-refresh" circle size="small" @click="getMartyrClueList"></el-button> -->
        </header>
      </template>
      <div class="list-container">
        <div class="list-item" v-for="item in clueList" :key="item.id">
          <ClueItem :data="item" @delSuccess="getMartyrClueList"></ClueItem>
        </div>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="pagination.pageNum"
          :page-size="pagination.pageSize"
          layout="total, prev, pager, next"
          :total="listTotal"
        >
        </el-pagination>
      </div>
    </el-card>
  </el-dialog>
</template>

<script setup>
import { ref, watch, computed, onMounted, getCurrentInstance } from 'vue';
import martyrClue from '@/api/worship/martyrClue';
import ClueItem from './clueItem.vue';
const props = defineProps({
  data: Object,
  show: Boolean,
});
const emit = defineEmits(['close']);
let pagination = ref({
  pageSize: 10,
  pageNum: 1,
});
let listTotal = ref(0);
const dialogVisible = computed({
  set(v) {
    emit('update:show', v);
    return v;
  },
  get() {
    return props.show;
  },
});
function beforeClose() {
  emit('close');
}
function handleSizeChange(size) {
  console.log('🚀 ~ handleSizeChange ~ size:', size);
}
function handleCurrentChange(currentPage) {
  console.log('🚀 ~ handleCurrentChange ~ currentPage:', currentPage);
}
const loadingList = ref(false);
const clueList = ref([]);
async function getMartyrClueList() {
  if (props.data && props.data.id) {
    let query = { martyrId: props.data.id, pageSize: pagination.value.pageSize, pageNum: pagination.value.pageNum };
    loadingList.value = true;
    let { rows, code, total } = await martyrClue.list(query);
    loadingList.value = false;
    console.log('🚀 ~ getMartyrClueList ~ rows, code:', rows, code);
    clueList.value = rows;
    listTotal.value = total;
  }
}
watch(
  () => pagination.value,
  (v) => {
    getMartyrClueList();
  }
);
onMounted(() => {
  getMartyrClueList();
});
</script>

<style lang="scss" scoped>
.clue-list {
  margin-top: 20px;
  .card-header {
    > .title {
      font-size: 16px;
      font-weight: bold;
    }
    display: flex;
    justify-content: space-between;
  }
  .list-container {
    max-height: 400px;
    overflow-y: auto;
  }
}
</style>
