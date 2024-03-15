<template>
  <div class="monthView">
    <el-table :data="tableData" border header-row-class-name="table-header" size="medium" height="54vh">
      <el-table-column prop="departName" label="行政区划"> </el-table-column>
      <el-table-column prop="complainant" label="信访人"> </el-table-column>
      <el-table-column prop="address" label="户籍地址"> </el-table-column>
      <el-table-column prop="actualAddress" label="实际居住地址"> </el-table-column>
      <el-table-column prop="idCard" label="身份证号"> </el-table-column>
      <el-table-column prop="phone" label="联系电话"> </el-table-column>
      <el-table-column prop="complaintContent" label="信访诉求"> </el-table-column>
      <el-table-column prop="currentStatus" label="目前状况"> </el-table-column>
      <el-table-column prop="workMeasures" label="工作措施"> </el-table-column>
      <el-table-column prop="workThisMonth" label="本月工作情况"> </el-table-column>
      <el-table-column prop="leaderPhone" label="包案领导及联系方式"> </el-table-column>
      <el-table-column prop="staffPhone" label="专办工作人员及联系方式"> </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="query.page"
        :page-sizes="[10, 15, 30, 50, 100]"
        :page-size="query.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { riskScreenGetPageMuti } from '@/api/worship/risk';
import { mapState } from 'vuex';
export default {
  props: {
    propsQuery: Object,
  },
  components: {},
  data() {
    return {
      tableData: [],
      query: {
        pageNum: 1,
        pageSize: 30,
        departCode: '',
      },
      total: 0,
    };
  },
  computed: {
    ...mapState(['userinfo']),
  },
  watch: {
    propsQuery: {
      handler(val) {
        this.query = {
          ...this.query,
          ...val,
        };
        console.log('this.query', this.query);
      },
      deep: true,
    },
  },
  created() {
    this.getList();
  },
  mounted() {},
  methods: {
    getList() {
      // let departCode = getFormDepartCode(this.query.departCode).departCode;

      riskScreenGetPageMuti(this.query).then((res) => {
        console.log('res', res);
        this.tableData = res.data.records;
        this.total = res.total;
      });
    },
    handleCurrentChange(val) {
      this.query.page = val;
      this.getList();
    },
    handleSizeChange(val) {
      this.query.size = val;
      this.getList();
    },
  },
};
</script>

<style scoped lang="scss">
.monthView {
  .table {
    height: calc(100% - 240px);
    background: #fff;
    margin-top: 16px;
    padding: 6px 24px;
  }
  .pagination {
    margin: 6px 0 0 0;
    text-align: right;
  }
}
</style>
