<template>
  <div class="app-container">
    <div class="header">双拥模范城</div>
    <el-form
      class="search-form"
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-row>
        <el-form-item label="单位" prop="divisionCode">
          <TreeSelectDivision
            v-model="queryParams.divisionCode"
            @treeselectChange="(e) => treeselectChange(e, queryParams, 'divisionCode')"
          ></TreeSelectDivision>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
            <el-option
              v-for="dict in dict.type.sys_worship_wczt"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="queryParams.type" placeholder="请选择类型" clearable>
            <el-option v-for="item in typeOption" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="计划完成时间" prop="finishDate" label-width="100px">
          <el-date-picker
            clearable
            v-model="queryParams.searchTime"
            type="daterange"
            value-format="yyyy-MM-dd"
            placeholder="请选择计划完成时间"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="搜索:" prop="keyWord">
          <el-input v-model="queryParams.keyWord" placeholder="请输入" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
      </el-row>
      <el-form-item class="search-right">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <div class="table">
      <div class="table-title-box">
        <div class="title-name">双拥模范城列表</div>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['worship:exemplaryCity:add']"
              >新增</el-button
            >
          </el-col>

          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['worship:exemplaryCity:remove']"
              >删除</el-button
            >
          </el-col>

          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </div>

      <el-table v-loading="loading" :data="exemplaryCityList" @selection-change="handleSelectionChange" height="86%">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="任务标题" align="center" prop="title" />
        <el-table-column label="任务内容" align="center" prop="content" />
        <el-table-column label="单位" align="center" prop="divisionName" />
        <el-table-column label="状态" align="center" prop="status">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status" :type="statusMap[scope.row.status]">
              <dict-tag :options="dict.type.sys_worship_wczt" :value="scope.row.status" />
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="类型" align="center" prop="status">
          <template slot-scope="scope">
            <el-popover trigger="click" popper-class="tri-popper">
              <el-button
                class="tri-popper-color"
                :type="scope.row.type === '2' ? 'danger' : 'success'"
                plain
                slot="reference"
                >{{ scope.row.type ? typeOption[scope.row.type].label : '点击标记' }}</el-button
              >
              <el-button @click="changePopperType(scope.row, 'type', 1)" type="success" plain>一般任务</el-button><br />
              <el-button @click="changePopperType(scope.row, 'type', 2)" type="danger" plain>重点任务</el-button><br />
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="计划完成时间" align="center" prop="finishDate" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.finishDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleUpdate(scope.row, 'openInfo')">详情</el-button>
            <template v-if="['2', '4'].indexOf(scope.row.status) == -1">
              <el-button size="mini" type="text" @click="handleFeedback(scope.row)">反馈</el-button>
              <el-button
                size="mini"
                type="text"
                @click="handleUpdate(scope.row, 'open')"
                v-hasPermi="['worship:exemplaryCity:edit']"
                >修改</el-button
              >
              <el-button size="mini" type="text" @click="changePopperType(scope.row, 'status', 2)">完成</el-button>
            </template>
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.row)"
              v-hasPermi="['worship:exemplaryCity:remove']"
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

    <!-- 添加或修改双拥模范城对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="任务标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入任务标题" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="单位" prop="divisionCode">
              <TreeSelectDivision
                v-model="form.divisionCode"
                @treeselectChange="(e) => treeselectChange(e, form)"
              ></TreeSelectDivision> </el-form-item
          ></el-col>
          <el-col :span="12">
            <el-form-item label="计划完成时间" prop="finishDate">
              <el-date-picker
                clearable
                v-model="form.finishDate"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="请选择计划完成时间"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="任务内容" prop="content">
          <el-input v-model="form.content" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="上传文件" prop="fileUrl">
          <file-upload v-model="form.fileUrl" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 详情对话框 -->
    <el-dialog :title="'详情'" :visible.sync="openInfo" width="700px" append-to-body>
      <div class="trapezoid">
        <div class="text">
          <p>{{ form.type ? typeOption[form.type]['label'] : '' }}</p>
        </div>
      </div>
      <el-row class="info-title">
        <el-col :span="24">
          <span class="info-title-span">{{ form.title }}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12"> 所属单位：{{ form.divisionName }} </el-col>
        <el-col :span="12">计划完成时间：{{ form.finishDate }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div>内容：</div>
          {{ form.content }}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <span class="mr10"> 附件：</span>
          <file-upload v-model="form.fileUrl" :isView="true" />
        </el-col>
      </el-row>
      <div class="info-line"></div>
      <p class="back-records">反馈记录</p>
      <el-timeline :reverse="true">
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :timestamp="activity.deptName + ' ' + activity.personName + ' ' + activity.createTime"
          placement="top"
          color="#328ffe"
        >
          <p>{{ activity.content }}</p>
          <div class="file" v-for="(item, index) in activity.srcList" :key="index" @click="openPath(item.url)">
            {{ item.name }}
          </div>
        </el-timeline-item>
      </el-timeline>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="'反馈'" :visible.sync="showFeedback" width="700px" append-to-body>
      <el-form ref="form" :model="form" label-width="110px">
        <el-form-item label="" prop="content" label-width="10px">
          <el-input v-model="form.content" type="textarea" placeholder="请输入反馈内容" />
        </el-form-item>
        <el-form-item label="上传文件：" prop="fileUrl">
          <file-upload v-model="form.fileUrl" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitFeedback">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listExemplaryCity,
  getExemplaryCity,
  delExemplaryCity,
  addExemplaryCity,
  updateExemplaryCity,
  addExemplaryCityLog,
  listExemplaryCityLog,
} from '@/api/worship/exemplaryCity';
import { listByIds } from '@/api/system/oss';

export default {
  name: 'ExemplaryCity',
  dicts: ['sys_notice_status', 'sys_worship_wczt'],
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
      // 双拥模范城表格数据
      exemplaryCityList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      openInfo: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        divisionCode: undefined,
        status: undefined,
        finishDate: undefined,
        fileUrl: undefined,
        type: undefined,
        keyWord: undefined,
        searchTime: [],
      },
      // 表单参数
      form: {},
      showFeedback: false,
      // 表单校验
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        divisionCode: [{ required: true, message: '请选择单位', trigger: 'blur' }],
        finishDate: [{ required: true, message: '请选择计划完成时间', trigger: 'blur' }],
        content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
      },
      typeOption: {
        1: {
          label: '一般任务',
          value: 1,
        },
        2: {
          label: '重点任务',
          value: 2,
        },
      },
      statusMap: {
        1: 'warning',
        2: '',
        3: 'danger',
        4: 'success',
      },
      activities: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询双拥模范城列表 */
    getList() {
      this.loading = true;
      this.queryParams.beginTime = this.queryParams?.searchTime?.[0];
      this.queryParams.endTime = this.queryParams?.searchTime?.[1];
      listExemplaryCity(this.queryParams).then((response) => {
        this.exemplaryCityList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.openInfo = this.open = this.showFeedback = false;
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
        divisionCode: undefined,
        divisionName: undefined,
        title: undefined,
        content: undefined,
        status: undefined,
        pointFlag: undefined,
        finishDate: undefined,
        type: undefined,
      };
      this.resetForm('form');
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm');
      this.queryParams.searchTime = [];
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
      this.open = true;
      this.title = '添加双拥模范城';
    },
    /** 修改按钮操作 */
    handleUpdate(row, dialog) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids;
      getExemplaryCity(id).then(async (response) => {
        this.loading = false;
        this.form = response.data;
        this[dialog] = true;
        this.title = '修改双拥模范城';
        this.activities = [];
        if (this.form.logList && this.form.logList.length) {
          this.activities = await Promise.all(
            this.form.logList.map(async (item) => {
              return {
                ...item,
                srcList: item.fileUrl ? await this.getFileList(item.fileUrl) : [],
              };
            })
          );
        }
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateExemplaryCity(this.form)
              .then((response) => {
                this.$modal.msgSuccess('修改成功');
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else {
            this.form.status = 0;
            addExemplaryCity(this.form)
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
    submitFeedback() {
      this.buttonLoading = true;
      addExemplaryCityLog(this.form)
        .then((response) => {
          this.$modal.msgSuccess('反馈成功');
          this.showFeedback = false;
          this.getList();
        })
        .finally(() => {
          this.buttonLoading = false;
        });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      const name = row.title ?? this.filterDelData(this.ids, this.exemplaryCityList, 'title');
      this.$modal
        .confirm('是否确认删除任务标题为"' + name + '"的数据项？')
        .then(() => {
          this.loading = true;
          return delExemplaryCity(ids);
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
    // 改变任务类型
    changePopperType(row, key, value) {
      row[key] = value;
      updateExemplaryCity(row).then((res) => {
        this.getList();
        this.$modal.msgSuccess('修改成功');
      });
    },
    handleFeedback(row) {
      this.form = {
        exemplaryCityId: row.id,
      };
      this.showFeedback = true;
    },
    async getFileList(id) {
      const { data } = await listByIds(id);
      let list = data.map((e) => {
        return { name: e.originalName, url: e.url, ossId: e.ossId };
      });
      return list;
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        'worship/exemplaryCity/export',
        {
          ...this.queryParams,
        },
        `exemplaryCity_${new Date().getTime()}.xlsx`
      );
    },
    openPath(url) {
      window.open(url);
    },
  },
};
</script>
<style lang="scss" scoped>
.header {
  height: 37.33px;
  font-family: PingFangSC-Medium;
  font-weight: 600;
  font-size: 26.67px;
  color: #000000d9;
  letter-spacing: 0;
  line-height: 37.33px;
  margin-bottom: 16px;
}
.search-form {
  background-color: #fff;
  padding: 20px 0 0 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  .search-right {
    width: 14%;
    // float: right;
  }
}

.table {
  background: #fff;
  margin: 16px 0 0 0;
  padding: 16px;
  box-sizing: border-box;
  height: 640px;
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
.info-title {
  display: flex;
  // justify-content: space-between;
  // align-items: center;
  .info-title-span {
    font-weight: 600;
    font-size: 20px;
  }
}
.info-line {
  height: 10px;
  background: #eef1f2;
}
.back-records {
  font-size: 18px;
}
.el-timeline {
  margin: 16px 0 0 0;
}
.trapezoid {
  /* 梯形 */
  position: absolute;
  right: 20px;
  top: 54px;
  border-top: 48px solid #ff6e6e;
  border-left: 25px solid transparent;
  border-right: 25px solid transparent;
  height: 0;
  width: 110px;
  text-align: center;
  .text {
    position: absolute;
    text-align: center;
    top: -35px;
    left: 0;
  }
  p {
    margin: 0;
    color: #fff;
    white-space: nowrap;
  }
}
.el-col {
  margin-bottom: 24px;
  color: #333333;
  display: flex;
  & > div {
    white-space: nowrap;
  }
  &.alignCenter {
    align-items: center;
  }
}
.tri-popper {
  min-width: 0;
  width: 80px;
  .el-button {
    margin-bottom: 10px;
    width: 100%;
  }
}
.file {
  color: #1890ff;
  cursor: pointer;
  margin-bottom: 12px;
}
</style>
