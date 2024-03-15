<template>
  <div class="app-container">
    <div class="header">思想教育</div>
    <div class="tabs">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="学习活动" name="1"></el-tab-pane>
        <el-tab-pane label="学习内容" name="2"></el-tab-pane>
      </el-tabs>
    </div>
    <el-form
      class="search-form"
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width=""
    >
      <span v-if="activeName === '1'">
        <el-form-item label="行政区划：" prop="divisionCode">
          <TreeSelectDivision
            v-model="queryParams.divisionCode"
            @treeselectChange="(e) => treeselectChange(e, queryParams, 'divisionCode')"
          ></TreeSelectDivision>
        </el-form-item>
        <el-form-item label="搜索：" prop="activityTitle">
          <el-input
            v-model="queryParams.activityTitle"
            placeholder="请输入标题"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
      </span>
      <span v-else>
        <el-form-item label="搜索：" prop="title">
          <el-input v-model="queryParams.title" placeholder="请输入" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
      </span>
      <el-form-item class="search-right">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="table" v-if="activeName === '1'">
      <div class="table-title-box">
        <div class="title-name">活动列表</div>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </div>
      <el-table v-loading="loading" :data="partyStudyFileList" @selection-change="handleSelectionChange" height="85%">
        <el-table-column label="行政区划" align="center" prop="divisionName" />
        <el-table-column label="活动标题" align="center" prop="activityTitle" />
        <el-table-column label="参加人数" align="center" prop="numOfParticipants">
          <template slot-scope="scope"> {{ scope.row.numOfParticipants }}人 </template>
        </el-table-column>
        <el-table-column label="活动日期" align="center" prop="activityTime" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.activityTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleActivityDetail(scope.row)">详情</el-button>
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
    <div class="table" v-if="activeName === '2'">
      <div class="table-title-box">
        <div class="title-name">文件列表</div>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </div>
      <el-table
        key="partyStudyFileList"
        v-loading="loading"
        :data="partyStudyFileList"
        @selection-change="handleSelectionChange"
        height="85%"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="标题" align="center" prop="title" />
        <el-table-column label="上传人" align="center" prop="createNickname">
          <template slot-scope="scope">
            <span>{{ scope.row.createNickname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="上传时间" align="center" prop="createTime" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleDetail(scope.row)">详情</el-button>
            <el-button size="mini" type="text" @click="handleUpdate(scope.row)">修改</el-button>
            <el-button size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>
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
    <!-- 活动详情对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="45%" append-to-body>
      <template v-if="title === '活动详情'">
        <el-row class="rows">
          <el-col :span="24" class="alignCenter">
            <el-tag type="info" class="info-tag"
              ><dict-tag :options="dict.type.sys_worship_activity" :value="form.activityType"
            /></el-tag>
            <span class="name">{{ form.activityTitle }}</span>
          </el-col>
          <el-col :span="12"> 组织单位：{{ form.divisionName }} </el-col>
          <el-col :span="12">参加人数：{{ form.numOfParticipants }}人</el-col>
          <el-col :span="12"> 活动日期：{{ form.activityTime }} </el-col>
          <el-col :span="24">
            <div>活动地址：</div>
            {{ form.activityAddress }}
          </el-col>
          <el-col :span="24">
            <div>活动内容：</div>
            {{ form.activityContent }}
          </el-col>
          <el-col :span="24">
            <span class="mr10"> 活动照片:</span>
            <el-image
              class="mr10"
              v-for="(item, index) in form.fileList"
              :key="index"
              style="width: 100px; height: 100px"
              :src="item.url"
              :preview-src-list="form.fileList[0].url"
            >
            </el-image>
          </el-col>
        </el-row>
      </template>
      <template v-else-if="title === '文件详情'">
        <el-row class="rows">
          <el-col :span="24"
            ><span class="name">{{ form.title }}</span></el-col
          >
          <el-col :span="12">上传人：{{ form.createNickname }}</el-col>
          <el-col :span="12">上传时间：{{ form.createTime }}</el-col>
          <el-col :span="24">
            <div>内容：</div>
            {{ form.content }}
          </el-col>
          <el-col :span="24">
            <div>文件：</div>
            <div class="file" v-for="(item, index) in srcList" :key="index" @click="openPath(item.url)">
              {{ item.name }}
            </div>
          </el-col>
        </el-row>
      </template>
      <template v-else>
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-form-item label="标题：" prop="title">
            <el-input v-model="form.title" placeholder="请输入标题" />
          </el-form-item>
          <el-form-item label="内容：">
            <el-input v-model="form.content" type="textarea" placeholder="请输入内容" />
          </el-form-item>
          <el-form-item label="上传文件：" prop="fileUrl">
            <file-upload v-model="form.fileUrl" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  listPartyStudyFile,
  getPartyStudyFile,
  delPartyStudyFile,
  addPartyStudyFile,
  updatePartyStudyFile,
} from '@/api/worship/partyStudyFile';
import { listPartyActivities, getPartyActivities } from '@/api/worship/cjEvent';
import { listByIds } from '@/api/system/oss';
export default {
  name: 'PartyStudyFile',
  dicts: ['sys_worship_activity'],
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
      // 学习内容文件表格数据
      partyStudyFileList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: undefined,
      },
      // 表单参数
      form: {},
      activeName: '1',
      srcList: [],
      // 表单校验
      rules: {
        id: [{ required: true, message: '主键不能为空', trigger: 'blur' }],
        title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询学习内容文件列表 */
    getList() {
      this.loading = true;
      let query = Object.assign({}, this.queryParams);
      this.activeName === '1' ? (query.activityType = '2') : '';
      let func = this.activeName === '1' ? listPartyActivities(query) : listPartyStudyFile(query);
      func.then((response) => {
        this.partyStudyFileList = response.rows;
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
        createId: undefined,
        updateId: undefined,
        title: undefined,
        content: undefined,
        fileUrl: undefined,
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
      this.title = '添加学习内容';
    },
    /** 学习活动详情按钮操作 */
    handleActivityDetail(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids;
      getPartyActivities(id).then(async (response) => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = '活动详情';
        // if(response.data.activityFileUrl){
        //   let file = await this.getImgList(response.data.activityFileUrl)
        //   this.srcList = file.map(e => e.url)
        // }
      });
    },
    /** 学习内容详情按钮操作 */
    handleDetail(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids;
      getPartyStudyFile(id).then(async (response) => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = '文件详情';
        this.srcList = response.data.fileUrl && (await this.getImgList(response.data.fileUrl));
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids;
      getPartyStudyFile(id).then((response) => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = '修改学习内容';
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updatePartyStudyFile(this.form)
              .then((response) => {
                this.$modal.msgSuccess('修改成功');
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else {
            addPartyStudyFile(this.form)
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
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      const name = row.title ?? this.filterDelData(this.ids, this.partyStudyFileList, 'title');

      this.$modal
        .confirm('是否确认删除学习内容文件标题为"' + name + '"的数据项？')
        .then(() => {
          this.loading = true;
          return delPartyStudyFile(ids);
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
    handleClick() {
      this.handleQuery();
    },
    openPath(url) {
      window.open(url);
    },
    async getImgList(id) {
      const { data } = await listByIds(id);
      let list = data.map((e) => {
        return { name: e.originalName, url: e.url, ossId: e.ossId };
      });
      return list;
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
  .search-right {
    float: right;
  }
}
.tabs {
  display: flex;
  line-height: 40px;
  .el-tabs {
    margin: 0 20px 0 0;
  }
}
.table {
  background: #fff;
  margin: 16px 0 0 0;
  padding: 16px;
  box-sizing: border-box;
  height: 642px;
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
.rows {
  .name {
    font-weight: 600;
    font-size: 24px;
  }
  .info-tag {
    margin-right: 12px;
  }
  .file {
    color: #1890ff;
    cursor: pointer;
    margin-bottom: 12px;
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
}
::v-deep .el-tabs__nav-wrap::after {
  height: 0px !important;
}
</style>
