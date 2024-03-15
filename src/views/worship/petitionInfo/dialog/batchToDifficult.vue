<template>
  <div class="batchToDifficult">
    <el-dialog title="提示" :visible.sync="dialogVisible" width="400px" :before-close="handleClose">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
        <el-table-column prop="difficultType" label="困难类型" width="180">
          <template slot-scope="scope">
            <div>
              <div class="no-data" v-if="scope.row.difficultType === '无'">
                <span @click="toDifficult(scope.row, 'toDifficultDialog')" class="tri-popper-color" type="text" plain
                  >无,转困难</span
                >
              </div>
              <div v-else>
                {{ scope.row.difficultType }}
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <toDifficult
      v-if="toDifficultDialog"
      :propsData="toDifficultForm"
      @success="toDifficultSuccess"
      @close="toDifficultDialog = false"
    />
  </div>
</template>

<script>
import toDifficult from '../dialog/toDifficult.vue';
import { getPetitionInfo } from '@/api/worship/petitionInfo';

export default {
  props: {
    propsData: {},
  },
  components: {
    toDifficult,
  },
  data() {
    return {
      dialogVisible: true,
      toDifficultDialog: false,
      toDifficultForm: {},
      tableData: [],
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.getData();
    // this.tableData = this.propsData.difficultTypeList;
  },
  methods: {
    getData() {
      getPetitionInfo(this.propsData.id).then((res) => {
        this.tableData = res.data.difficultTypeList;
      });
    },
    handleClose() {
      this.$emit('close');
    },
    toDifficult(row) {
      this.toDifficultForm = JSON.parse(JSON.stringify(row));
      this.toDifficultDialog = true;
    },
    toDifficultSuccess() {
      this.getData();
      this.toDifficultDialog = false;
    },
  },
};
</script>

<style scoped lang="scss">
.batchToDifficult {
  .no-data {
    color: #1890ff;
    cursor: pointer;
  }
}
</style>
