<template>
  <div class="monthPdf">
    <el-dialog title="盖章预览" :visible.sync="dialogVisible" width="1400px" :before-close="handleClose">
      <div ref="dialogInfo" id="pdfCentent">
        <el-table
          :data="tableData"
          border
          header-row-class-name="table-header"
          size="medium"
          style="width: 100%; height: 100%"
          height="calc(100% - 100px)"
        >
          <el-table-column prop="name" label="信访人">
            <template slot-scope="{ row }">
              <div>
                {{ row.complainant }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="sexText" label="户籍地址">
            <template slot-scope="{ row }">
              <div>
                {{ row.address }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="sexText" label="实际居住地址">
            <template slot-scope="{ row }">
              <div>
                {{ row.actualAddress }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="sexText" label="身份证号">
            <template slot-scope="{ row }">
              <div>
                {{ row.idCard }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="sexText" label="联系电话">
            <template slot-scope="{ row }">
              <div>
                {{ row.phone }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="sexText" label="信访诉求">
            <template slot-scope="{ row }">
              <div>
                {{ row.complaintContent }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="sexText" label="目前状况">
            <template slot-scope="{ row }">
              <div>
                {{ row.currentStatus }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="sexText" label="工作措施">
            <template slot-scope="{ row }">
              <div>
                {{ row.workMeasures }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="sexText" label="本月工作情况">
            <template slot-scope="{ row }">
              <div>
                {{ row.workThisMonth }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="sexText" label="包案领导及联系方式">
            <template slot-scope="{ row }">
              <div>
                {{ row.leaderPhone }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="sexText" label="专办工作人员及联系方式">
            <template slot-scope="{ row }">
              <div>
                {{ row.staffPhone }}
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="font">
          <div>制表人（签字）：<img src="" alt="" /></div>
          <div>退役军人服务站站长（签字）：<img src="" alt="" /></div>
          <div>分管领导（签字）：<img src="" alt="" /></div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="tableToPdf">盖章</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {},
  components: {},
  data() {
    return {
      dialogVisible: true,
      tableData: [{}],
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
    tableToPdf() {
      console.log(this.$refs.dialogInfo);
      let heigiht = this.$refs.dialogInfo.offsetHeight;
      console.log(heigiht);
      this.ExportSavePdf('车辆排班详情', heigiht);
    },
  },
};
</script>

<style scoped lang="scss">
.monthPdf {
  .font {
    margin-top: 40px;
    display: flex;
    justify-content: space-between;
    padding: 0 40px;
    box-sizing: border-box;
    background: #fff;
    > div {
      display: flex;
      align-items: center;
    }
    img {
      width: 100px;
      height: 100px;
    }
  }
}
</style>
