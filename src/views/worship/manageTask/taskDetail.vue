<template>
  <div class="instruction">
    <header>
      <i class="el-icon-back" @click="$router.back()"></i> 任务详情
    </header>
    <div class="table">
      <div class="left">
        <div class="group top">
          <div class="g-title">
            <span class="title">{{ info.title }}</span>
            <span>
              <el-button v-if="info.type === '1'" type="text" @click="getData">返回主任务</el-button>
              <el-button v-if="hasAuth" type="text" @click="editRow(info)">编辑</el-button>
            </span>
          </div>
          <p>任务介绍</p>
          <p class="taskIntroduction" v-if="info.taskIntroduction">{{ info.taskIntroduction }}</p>
          <el-empty v-else description="没有填写任务介绍"></el-empty>
        </div>
        <div class="group">
          <div class="g-title">
            <span class="title">子任务</span>
            <el-button v-if="hasAuth && info.state !== '2'" type="primary" @click="addSubTask">新建子任务</el-button>
          </div>
          <el-table
            :data="tableData"
            border
            highlight-current-row
            row-key="id"
            height="calc(100% - 80px)"
            @current-change="currentChange"
            :current-row-key="currentRowKey"
          >
            <el-table-column prop="title" label="任务内容" width="">
              <template slot-scope="scope">
                <span :class="[info.id === scope.row.id ? 'textColor' : 'textLine']" @click="rowClick(scope.row)">{{ scope.row.title }}</span>
              </template>
            </el-table-column>
            <el-table-column label="任务状态" align="center" prop="state" width="80">
              <template slot-scope="scope">
                <dict-tag :options="dict.type.sys_worship_managetaskstate" :value="scope.row.state"/>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100" fixed="right">
              <template slot-scope="scope">
                <el-button type="text" v-if="hasAuth" @click="editRow(scope.row)">编辑</el-button>
                <el-button type="text" v-if="hasAuth">
                  <el-popconfirm title="确定从删除该任务吗？" @confirm="deleteRow(scope.row.id)">
                    <span slot="reference">删除</span>
                  </el-popconfirm>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="form.page"
              :page-sizes="[10, 15, 30, 50, 100]"
              :page-size="form.size"
              layout="total, prev, pager, next"
              :total="total"
            >
            </el-pagination>
          </div>
        </div>
      </div>
      <SubTaskDetail :manageSubtaskId="info.id" :hasAuth="hasAuth"></SubTaskDetail>
      <AddSubTask v-if="showSubTask" :dialogVisible.sync="showSubTask" :row="activeRow" @success="addTaskSuccess" @close="showSubTask = false" />
      <AddMainTask v-if="showMainTask" :row="activeRow" :dialogVisible.sync="showMainTask" @success="addTaskSuccess" @close="showMainTask = false"/>
    </div>
  </div>
</template>

<script>
import AddSubTask from './dialog/addSubTask.vue';
import AddMainTask from "./dialog/addMainTask.vue";
import SubTaskDetail from './subTaskDetail.vue';
import { listManageTask, getManageTask, delManageTask } from "@/api/worship/manageTask";
export default {
  props: {},
  dicts: ['sys_worship_managetaskstate'],
  components: { SubTaskDetail,AddSubTask,AddMainTask },
  data() {
    return {
      info: {},
      tableData: [],
      total: 0,
      activeRow: {},
      rowData: {},
      currentRowKey: '',
      showSubTask: false,
      showMainTask:false,
      hasAuth:false,
      accept: ['.jpg', '.png'],
      headers: {
        Authorization: sessionStorage.token,
      },
      form: {
        type: '1',
        taskId: this.$route.params.id,
        page: 1,
        size: 5,
      },
      pagination: {
        page: 1,
        size: 15,
      },
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getData();
  },
  methods: {
    getData() {
      this.tableData = [];
      getManageTask(this.$route.params.id).then(res =>{
        this.info = res.data
        this.getList();
        let responsibleList = res.data.responsibleUserId.split(',')
        let collaboratorList = res.data.collaboratorUserId.split(',')
        let list = [...responsibleList,...collaboratorList]
        this.hasAuth = list.some(e => e == this.$store.state.user.userId)
      })
    },
    getList() {
      listManageTask(this.form).then(res =>{
        this.tableData = res.rows
        this.total = res.total
      })
    },
    editRow(row) {
      console.log(row);
      this.activeRow = JSON.parse(JSON.stringify(row));
      row.type === '1' ? this.showSubTask = true : this.showMainTask = true
    },
    addTaskSuccess() {
      this.showSubTask = this.showMainTask = false;
      this.getData();
    },
    addSubTask() {
      this.showSubTask = true;
      this.activeRow = {
        taskId: this.$route.params.id,
      };
    },
    rowClick(row) {
      this.info = row;
    },
    currentChange(currentRow, oldCurrentRow) {
      this.currentRowKey = currentRow.id;
    },
    handleCurrentChange(val) {
      this.form.page = val;
      this.getList();
    },
    handleSizeChange(val) {
      this.form.size = val;
      this.getList();
    },
    deleteRow(id) {
      delManageTask(id).then(res =>{
        this.$message.success('删除成功');
        this.getList()
      })
    },
  },
};
</script>

<style scoped lang="scss">
.instruction {
	height: 879px;
	position: relative;
  padding: 20px;
  box-sizing: border-box;
	header {
		height: 50px;
    line-height: 50px;
		background: #fff;
		margin-bottom: 16px;
		padding: 0 24px;
    font-weight: bold;
    font-size: 20px;
    i{
      cursor: pointer;
    }
	}
	.table {
		height: calc(100% - 66px);
		margin-top: 16px;
		display: flex;
    
		.title {
			font-size: 16px;
			font-weight: bold;
      margin: 0;
		}
		.left {
			margin-right: 16px;
			flex: 4;
      .group{
			  background: #fff;
			  padding: 6px 24px;
        height: 49%;
        &.top{
          margin-bottom: 12px;
        }
        .g-title{
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 40px;
          margin-bottom: 12px;
        }
        .textColor{
          color: #1890ff;
          text-decoration: underline;
          cursor: pointer;
        }
        .textLine{
          cursor: pointer;
          text-decoration: underline;
        }
      }
      .taskIntroduction{
        height: calc(100% - 96px);
        overflow-y: auto;
      }
		}
	}
	.pagination {
		text-align: center;
	}
}
</style>
