<template>
  <!-- 退役军人走访慰问记录 -->
  <div class="index">
    <main>
      <div class="title">
        <span>走访慰问记录</span>
      </div>
      <div class="table">
        <el-table :data="tableData" border stripe height="100%">
          <el-table-column type="selection" label="" width=""></el-table-column>
          <el-table-column label="走访类型" align="center" prop="visitType">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.sys_worship_visittype" :value="scope.row.visitType" />
            </template>
          </el-table-column>
          <el-table-column prop="visitPersonName" label="走访人"></el-table-column>
          <el-table-column prop="visitPersonPhone" label="走访人电话"></el-table-column>
          <el-table-column label="走访方式" align="center" prop="visitMethod">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.sys_worship_visitingmethods" :value="scope.row.visitMethod" />
            </template>
          </el-table-column>
          <el-table-column prop="divisionName" label="行政区划"></el-table-column>
          <el-table-column label="走访日期" align="center" prop="visitTime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.visitTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="content" label="走访内容"></el-table-column>
          <el-table-column prop="feedback" label="走访反馈"></el-table-column>
          <el-table-column label="满意情况" align="center" prop="satisfactionStr" />
          <el-table-column prop="address" class-name="small-padding fixed-width" label="操作">
            <template slot-scope="scope">
              <el-button @click="handleUpdate(scope.row, 'infoOpen')" type="text" size="mini">详情</el-button>
              <!-- <el-button
                size="mini"
                type="text"
                @click="handleDelete(scope.row)"
                v-hasPermi="['worship:visiting:remove']"
                >删除</el-button
              > -->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </main>
    <!-- 详情对话框 -->
    <el-dialog class="info" title="走访详情" :visible.sync="infoOpen" width="800px" append-to-body>
      <el-row>
        <el-col :span="12">
          <span> 被走访:</span>
          <span>{{ form.personName }}</span>
        </el-col>
        <el-col :span="12">
          <span> 行政区划:</span>
          <span>{{ form.divisionName }}</span></el-col
        >
      </el-row>
      <el-row>
        <el-col :span="12">
          <span> 走访人:</span>
          <span>{{ form.visitPersonName }}</span>
        </el-col>
        <el-col :span="12">
          <span> 走访人联系方式:</span>
          <span>{{ form.visitPersonPhone }}</span></el-col
        >
      </el-row>
      <el-row>
        <el-col :span="12">
          <span> 走访方式:</span>
          <dict-tag :options="dict.type.sys_worship_visitingmethods" :value="form.visitMethod" />
        </el-col>
        <el-col :span="12">
          <span> 走访日期:</span>
          <span>{{ parseTime(form.visitTime, '{y}-{m}-{d}') }}</span>
        </el-col>
      </el-row>
      <el-row>
        <span> 走访地址:</span>
        <span>{{ form.address }}</span>
      </el-row>
      <el-row>
        <span> 走访内容:</span>
        <span>{{ form.content }}</span>
      </el-row>
      <el-row>
        <span> 走访反馈:</span>
        <span>{{ form.feedback }}</span>
      </el-row>
      <el-row>
        <span> 附件:</span>
        <el-image
          v-for="(item, index) in viewImgList"
          :key="index"
          style="width: 100px; height: 100px"
          :src="viewImgList[index]"
          :preview-src-list="viewImgList"
        >
        </el-image>
      </el-row>
      <el-row>
        <span> 走访满意度:</span>
        <el-rate disabled v-model="form.satisfactionStr" show-text> </el-rate>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('infoOpen')">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listVisiting, getVisiting, delVisiting, addVisiting, updateVisiting } from '@/api/worship/visiting';
import { listByIds } from '@/api/system/oss';

export default {
  dicts: ['sys_worship_visittype', 'sys_worship_visitingmethods', 'sys_worship_visitingmethods'],
  props: {},
  components: {},
  data() {
    return {
      infoOpen: false,
      tableData: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        divisionCode: undefined,
        visitType: undefined,
        visitMethod: undefined,
        visitTime: undefined,
        searchTime: [],
      },
      // 表单参数
      form: {
        helpMethod: [],
      },
      total: 0,
      // 遮罩层
      loading: true,
      viewImgList: [],
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getList();
  },
  mounted() {},
  methods: {
    /** 查询走访信息标（走访慰问、困难走访、三色走访）列表 */
    getList() {
      this.loading = true;
      this.queryParams.personId = this.$route.params.id;
      listVisiting(this.queryParams).then((response) => {
        this.tableData = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row, key) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids;
      getVisiting(id).then(async (response) => {
        this.loading = false;
        const helpMethod = response.data.helpMethod?.split(',') || [];
        this.form = { ...response.data, helpMethod };
        console.log(this.form);
        this[key] = true;
        this.title = '修改走访信息';
        if (this.form.fileUrl) {
          const { data } = await listByIds(this.form.fileUrl);
          this.viewImgList = data.map((item) => item.url);
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;

      this.$modal
        .confirm('是否确认删除走访信息标（走访慰问、困难走访、三色走访）编号为"' + ids + '"的数据项？')
        .then(() => {
          this.loading = true;
          return delVisiting(ids);
        })
        .then(() => {
          this.loading = false;
          this.getList();
          this.$modal.msgSuccess('删除成功');
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false;
        });
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        createTime: undefined,
        createBy: undefined,
        updateTime: undefined,
        updateBy: undefined,
        delFlag: undefined,
        divisionCode: undefined,
        divisionName: undefined,
        personId: undefined,
        visitType: undefined,
        personName: undefined,
        visitPersonName: undefined,
        address: undefined,
        visitPersonPhone: undefined,
        visitMethod: undefined,
        visitTime: undefined,
        content: undefined,
        feedback: undefined,
        difficultReason: undefined,
        helpMethod: [],
        fileUrl: undefined,
      };
      this.resetForm('form');
    },
    // 取消按钮
    cancel(key) {
      this[key] = false;
      this.reset();
    },
  },
};
</script>

<style scoped lang="scss">
.index {
  main {
    background: #fff;
    padding: 16px 10px;
    box-sizing: border-box;
    .title {
      display: flex;

      justify-content: space-between;
    }
  }
  .table {
    height: 58vh;
    margin: 10px 0 0 0;
  }
}
.info {
  .el-row {
    margin: 20px 0 0 0;
    display: flex;
    .el-col {
      display: flex;
      span {
        margin: 0 16px 0 0;
      }
    }
  }
  .el-image {
    margin: 0 16px 0 16px;
  }
}
</style>
