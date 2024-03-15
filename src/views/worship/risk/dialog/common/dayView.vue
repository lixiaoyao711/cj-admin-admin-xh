<template>
  <div class="monthView">
    <el-table :data="tableData" border header-row-class-name="table-header" size="medium" height="54vh">
      <el-table-column prop="content" label="内容" width="600"> </el-table-column>
      <el-table-column prop="leaderSign" label="值班领导签字"> </el-table-column>
      <el-table-column prop="fillPerson" label="填报人"> </el-table-column>
      <el-table-column prop="sexText" label="填报时间">
        <template slot-scope="{ row }">
          <div>
            {{ row.fillTime.slice(0, 16) }}
          </div>
        </template>
      </el-table-column>
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
import { mapState } from 'vuex';
import { riskZeroGetPageMuti } from '@/api/worship/risk';
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
      riskZeroGetPageMuti(this.query).then((res) => {
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
