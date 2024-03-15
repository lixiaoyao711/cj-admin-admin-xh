<template>
  <div class="app-container">
    <header>
      <div
        class="tab"
        v-hasPermi="['worship:manageTask:type1']"
        :class="{ active: queryParams.taskType === '1' }"
        @click="changeTopTab('1')"
      >
        年度重点工作 ({{ countData[1] || 0 }})
      </div>
      <div
        class="tab"
        v-hasPermi="['worship:manageTask:type2']"
        :class="{ active: queryParams.taskType === '2' }"
        @click="changeTopTab('2')"
      >
        局务会领导交办 ({{ countData[2] || 0 }})
      </div>
      <div
        class="tab"
        v-hasPermi="['worship:manageTask:type3']"
        :class="{ active: queryParams.taskType === '3' }"
        @click="changeTopTab('3')"
      >
        镇街工作任务 ({{ countData[3] || 0 }})
      </div>
    </header>
    <el-form class="search-form" :model="queryParams" ref="queryForm" :inline="true" v-if="showSearch">
      <el-form-item label="所属年份:" prop="deadlineTime">
        <el-select v-model="queryParams.deadlineTime" size="small" clearable>
          <el-option v-for="item in yearOptons" :key="item.label" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="任务状态：" prop="state">
        <el-select v-model="queryParams.state" size="small" @keyup.enter.native="handleQuery" clearable>
          <el-option label="全部" value=""></el-option>
          <el-option
            v-for="dict in dict.type.sys_worship_managetaskstate"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所属部门:" prop="deptId">
        <el-select v-model="queryParams.deptId" size="small" @keyup.enter.native="handleQuery" clearable>
          <el-option label="全部" value=""></el-option>
          <el-option
            v-for="dict in dict.type.sys_worship_managedepartment"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item class="search-right">
        <el-form-item prop="title">
          <el-input placeholder="请输入搜索关键字" size="small" v-model="queryParams.title" maxlength="100"></el-input>
        </el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="table">
      <div class="table-title-box">
        <div class="title-name">重点工作列表</div>
        <el-row :gutter="10" class="mb8">
          <!-- <el-col :span="1.5">
            <el-button
              plain
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['worship:manageTask:remove']"
            >删除</el-button>
          </el-col> -->
          <el-col :span="1.5">
            <el-button type="primary" plain size="mini" @click="handleAdd" v-hasPermi="['worship:manageTask:add']"
              >新建任务</el-button
            >
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </div>
      <el-table v-loading="loading" :data="manageTaskList" @selection-change="handleSelectionChange" height="85%">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="任务标题" align="center" prop="title" min-width="200" />
        <el-table-column prop="childTaskCount" label="子任务" width="80">
          <template slot-scope="scope">
            <el-popover placement="bottom" title="子任务列表" width="380" trigger="click">
              <span slot="reference">{{ scope.row.childTaskCount }}</span>
              <div class="task-list">
                <div class="subTask" v-for="child in scope.row.childTaskVOList" :key="child.id">
                  <span>{{ child.title }}</span>
                  <el-tag :type="child.stateType">{{ child.stateText }}</el-tag>
                </div>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="所属部门" align="center" prop="deptName" width="180" />
        <el-table-column label="责任人" align="center" prop="responsibleEmployeeCode" width="180" />
        <el-table-column label="截止时间" align="center" prop="deadlineTime" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.deadlineTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="任务状态" align="center" prop="state" width="120">
          <template slot-scope="scope">
            <el-tag :type="tagMap[scope.row.state]">
              <dict-tag :options="dict.type.sys_worship_managetaskstate" :value="scope.row.state" />
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleDetail(scope.row)">详情</el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleUpdate(scope.row)"
              v-if="scope.row.hasAuth && scope.row.state !== '2'"
              v-hasPermi="['worship:manageTask:edit']"
              >修改</el-button
            >
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.row)"
              v-if="scope.row.hasAuth"
              v-hasPermi="['worship:manageTask:remove']"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>

    <!-- 添加或修改办公任务对话框 -->
    <AddMainTask v-if="open" :row="form" :dialogVisible.sync="open" @success="dialogSuccess" @close="open = false" />
  </div>
</template>

<script>
import {
  listManageTask,
  getManageTask,
  delManageTask,
  addManageTask,
  updateManageTask,
  listCount,
  getYearList,
} from '@/api/worship/manageTask';
import AddMainTask from './dialog/addMainTask.vue';
import { deptTreeSelect } from '@/api/system/user';
import Treeselect from '@riophae/vue-treeselect';
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
export default {
  name: 'ManageTask',
  components: { AddMainTask, Treeselect },
  dicts: ['sys_worship_managetaskstate', 'sys_worship_managedepartment'],
  data() {
    return {
      // 按钮loading
      buttonLoading: false,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 办公任务表格数据
      manageTaskList: [],
      yearOptons: [],
      allDepartment: [],
      countData: {},
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        taskType: '1',
        title: undefined,
        year: undefined,
        state: undefined,
        deptId: undefined,
        deptName: undefined,
        type: 0,
      },
      // 表单参数
      form: {},
      normalizer(node) {
        return {
          id: node.id,
        };
      },
      tagMap: ['info', '', 'success', 'danger'],
      // 表单校验
      rules: {
        title: [{ required: true, message: '任务标题不能为空', trigger: 'blur' }],
        responsibleUserId: [{ required: true, message: '责任人不能为空', trigger: 'blur' }],
        deadlineTime: [{ required: true, message: '截止时间不能为空', trigger: 'blur' }],
        deptId: [{ required: true, message: '所属部门不能为空', trigger: 'change' }],
        deptName: [{ required: true, message: '所属部门名称不能为空', trigger: 'change' }],
      },
    };
  },
  watch: {
    $route: {
      handler(nv, ov) {
        this.queryParams.taskType = nv.query.tab || '1';
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    this.queryParams.taskType = this.$route.query.tab || '1';
    this.getList();
    this.getTreeData();
  },
  methods: {
    /** 查询办公任务列表 */
    getList() {
      this.loading = true;
      listManageTask(this.queryParams).then((response) => {
        this.manageTaskList = response.rows.map((e) => {
          console.log('🚀 ~ listManageTask ~ e:', e);

          e.hasAuth = true;
          let responsibleList = e.responsibleUserId ? e.responsibleUserId.split(',') : [];
          let collaboratorList = e.collaboratorUserId ? e.collaboratorUserId.split(',') : [];
          let list = [...responsibleList, ...collaboratorList];
          e.hasAuth =
            list.some((f) => f == this.$store.state.user.userId) || e.createId == this.$store.state.user.userId;
          return e;
        });
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
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
        type: undefined,
        taskId: undefined,
        taskType: undefined,
        title: undefined,
        responsibleUserId: undefined,
        responsibleEmployeeCode: undefined,
        collaboratorUserId: undefined,
        collaboratorEmployeeCode: undefined,
        deadlineTime: undefined,
        deptId: undefined,
        deptName: undefined,
      };
      this.resetForm('queryForm');
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm');
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.form.taskType = this.queryParams.taskType;
      this.open = true;
      this.title = '添加办公任务';
    },
    /** 详情按钮操作 */
    handleDetail(row) {
      const id = row.id || this.ids;
      this.$router.push({
        path: `/worship/manageTask/taskDetail/${id}`,
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids;
      getManageTask(id).then((response) => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = '修改办公任务';
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          let formData = Object.assign({}, this.form, {
            taskType: this.queryParams.taskType,
            state: '0',
          });
          if (formData.id != null) {
            updateManageTask(formData)
              .then((response) => {
                this.$modal.msgSuccess('修改成功');
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else {
            addManageTask(formData)
              .then((response) => {
                this.$modal.msgSuccess('新增成功');
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          }
        }
      });
    },
    dialogSuccess() {
      this.open = false;
      this.getList();
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除办公任务编号为"' + ids + '"的数据项？')
        .then(() => {
          this.loading = true;
          return delManageTask(ids);
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
    changeTopTab(num) {
      this.queryParams.taskType = num;
      this.getList();
      this.$router.replace({
        name: '',
        query: {
          tab: num,
        },
      });
    },
    getTreeData() {
      deptTreeSelect({
        whetherStock: 1,
      }).then((res) => {
        console.log(res);
        this.allDepartment = res.data;
      });
      getYearList().then((res) => {
        this.yearOptons = res.data.map((e) => {
          return (e = { label: e, value: e + '-12-31' });
        });
      });
      listCount().then((res) => {
        this.countData = res.data;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
header {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
  background: #247fff;
  .tab {
    padding: 12px 20px;
    border-radius: 100px;
    background: rgba(255, 255, 255, 0.16);
    color: #fff;
    margin: 0 20px;
    cursor: pointer;
    &.active {
      background: #fff;
      color: #247fff;
    }
  }
}
.search-form {
  background-color: #fff;
  padding: 20px 0 0 20px;
  box-sizing: border-box;
  .search-right {
    float: right;
  }
}
.table {
  background: #fff;
  margin: 16px 0 0 0;
  padding: 16px;
  box-sizing: border-box;
  height: 663px;
  .table-title-box {
    display: flex;
    justify-content: space-between;
    .title-name {
      font-family: PingFangSC-Medium;
      font-weight: 600;
      font-size: 18px;
      color: #333333;
    }
  }
}
.el-icon-location-information {
  font-size: 24px;
  margin: 5px 0 0 18px;
  cursor: pointer;
}
</style>
