<template>
  <div class="app-container">
    <div class="header">政策文件</div>
    <div class="tabs">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="业务条线文件" name="0"></el-tab-pane>
        <el-tab-pane label="区内行政文件" name="1"></el-tab-pane>
        <el-tab-pane label="公共政策发布" name="2"></el-tab-pane>
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
      <el-form-item label="文件来源：" prop="source">
        <el-select v-model="queryParams.source" placeholder="请选择文件来源" clearable>
          <el-option
            v-for="dict in dict.type.sys_worship_level"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="activeName !== '2'" label="所属板块：" prop="module">
        <el-select v-model="queryParams.module" placeholder="请选择文件来源" clearable>
          <el-option
            v-for="dict in dict.type.document_module"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="" prop="keyWord">
        <el-input
          v-model="queryParams.keyWord"
          placeholder="请输入政策标题"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item class="search-right">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="table">
      <div class="table-title-box">
        <div class="title-name">{{ activeName !== '2' ? '政策列表' : '政策文件列表' }}</div>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['worship:policyDocument:add']"
              >新增</el-button
            >
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </div>
      <el-table v-loading="loading" :data="policyDocumentList" @selection-change="handleSelectionChange" height="85%">
        <el-table-column label="政策标题" align="center" prop="title" />
        <el-table-column label="文件来源" align="center" prop="source" width="100">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_worship_level" :value="scope.row.source" />
          </template>
        </el-table-column>
        <el-table-column v-if="['1', '2'].indexOf(activeName) > -1" label="所属板块" align="center" prop="module">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.document_module" :value="scope.row.module" />
          </template>
        </el-table-column>
        <el-table-column label="上传人" align="center" prop="createNickname" />
        <el-table-column label="发布日期" align="center" prop="releaseTime" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.releaseTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="上传日期" align="center" prop="createTime" />
        <el-table-column v-if="activeName === '2'" label="阅读量" width="100" align="center" prop="readNum" />
        <el-table-column v-if="activeName === '2'" prop="content" label="解读内容" key="content">
          <template slot-scope="scope">
            <span v-html="scope.row.content"></span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleDetail(scope.row)">详情</el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['worship:policyDocument:edit']"
              >修改</el-button
            >
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.row)"
              v-hasPermi="['worship:policyDocument:remove']"
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
    <!-- 添加或修改政策文件对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="40%" append-to-body>
      <template v-if="title !== '政策详情'">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-form-item label="政策标题：" prop="title">
            <el-input v-model="form.title" placeholder="请输入政策标题" />
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="政策来源：" prop="source">
                <el-select v-model="form.source" placeholder="请选择政策来源">
                  <el-option
                    v-for="dict in dict.type.sys_worship_level"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发布日期：" prop="releaseTime">
                <el-date-picker
                  clearable
                  v-model="form.releaseTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="请选择发布日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="所属板块：" prop="module">
            <el-select v-model="form.module" placeholder="请选择所属板块" clearable>
              <el-option
                v-for="dict in dict.type.document_module"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="上传文件：" prop="fileUrl">
            <file-upload v-model="form.fileUrl" />
          </el-form-item>
          <template v-if="activeName === '2'">
            <el-form-item label="是否解读：" prop="whetherExplain">
              <el-switch v-model="form.whetherExplain" active-value="1" inactive-value="0"></el-switch>
            </el-form-item>
            <el-form-item label="解读内容：">
              <editor v-model="form.explainContent" :min-height="192" />
            </el-form-item>
          </template>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
      <template v-else>
        <el-row class="rows">
          <el-col :span="24" class="alignCenter">
            <i class="el-icon-collection"></i>
            <span class="name">{{ form.title }}</span>
          </el-col>
          <el-col :span="12"
            >政策来源：<dict-tag :options="dict.type.sys_worship_level" :value="form.source" />
          </el-col>
          <el-col :span="12"
            >所属板块：<dict-tag :options="dict.type.document_module" :value="form.module" />
          </el-col>
          <el-col :span="12">发布日期：{{ parseTime(form.releaseTime, '{y}年{m}月{d}日') }} </el-col>
          <el-col :span="12">上传日期：{{ parseTime(form.createTime, '{y}年{m}月{d}日') }} </el-col>
          <el-col :span="12">上传人：{{ form.createBy }}</el-col>
          <el-col :span="24" class="file">
            <div>附件：</div>
            <div>
              <div class="attach" v-for="file in fileList">
                <el-link :href="`${file.url}`" :underline="true" target="_blank">
                  <span class="el-icon-paperclip"> {{ file.name }} </span>
                </el-link>
              </div>
            </div>
          </el-col>
          <template v-if="form.documentType === '2'">
            <el-col :span="24" class="title">政策解读</el-col>
            <el-col :span="24"><span class="content" v-html="form.explainContent"></span></el-col>
          </template>
        </el-row>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  listPolicyDocument,
  getPolicyDocument,
  delPolicyDocument,
  addPolicyDocument,
  updatePolicyDocument,
} from '@/api/worship/policyDocument';
import { listByIds } from '@/api/system/oss';

export default {
  name: 'PolicyDocument',
  dicts: ['sys_worship_level', 'document_module'],
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
      // 政策文件表格数据
      policyDocumentList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        keyWord: undefined,
        source: undefined,
        documentType: undefined,
      },
      activeName: '0',
      // 表单参数
      form: {},
      fileList: [],
      // 表单校验
      rules: {
        id: [{ required: true, message: '主键不能为空', trigger: 'blur' }],
        title: [{ required: true, message: '政策标题不能为空', trigger: 'blur' }],
        source: [{ required: true, message: '政策来源不能为空', trigger: 'change' }],
        fileUrl: [{ required: true, message: '附件url不能为空', trigger: 'blur' }],
        documentType: [{ required: true, message: '文件类型(数据字典)不能为空', trigger: 'blur' }],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询政策文件列表 */
    getList() {
      this.loading = true;
      let formData = Object.assign({}, this.queryParams, {
        documentType: this.activeName,
      });
      listPolicyDocument(formData).then((response) => {
        this.policyDocumentList = response.rows.map((e) => {
          if (e.explainContent) {
            e.content = e.explainContent.length > 40 ? `${e.explainContent.slice(0, 40)}...` : e.explainContent;
          }
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
        createId: undefined,
        updateId: undefined,
        title: undefined,
        source: undefined,
        releaseTime: undefined,
        module: undefined,
        whetherExplain: undefined,
        explainContent: undefined,
        fileUrl: undefined,
        documentType: undefined,
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
      let text = this.activeName === '2' ? '公共政策' : '政策';
      this.title = `上传${text}`;
    },
    handleDetail(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids;
      getPolicyDocument(id).then(async (response) => {
        this.loading = false;
        this.form = response.data;
        await this.getImg(response.data);
        this.open = true;
        this.title = `政策详情`;
      });
    },
    async getImg(item) {
      await listByIds(item.fileUrl).then((res) => {
        this.fileList = res.data.map((oss) => {
          oss = { name: oss.originalName, url: oss.url, ossId: oss.ossId };
          return oss;
        });
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids;
      getPolicyDocument(id).then((response) => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        let text = this.activeName === '2' ? '公共政策' : '政策';
        this.title = `修改${text}`;
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          let formData = Object.assign({}, this.form, {
            documentType: this.activeName,
          });
          if (formData.id != null) {
            updatePolicyDocument(formData)
              .then((response) => {
                this.$modal.msgSuccess('修改成功');
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else {
            addPolicyDocument(formData)
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
      this.$modal
        .confirm('是否确认删除政策文件编号为"' + ids + '"的数据项？')
        .then(() => {
          this.loading = true;
          return delPolicyDocument(ids);
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
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        'worship/policyDocument/export',
        {
          ...this.queryParams,
        },
        `policyDocument_${new Date().getTime()}.xlsx`
      );
    },
    handleClick() {
      this.resetQuery();
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
  .name {
    font-weight: 500;
    font-size: 24px;
    margin-right: 12px;
  }
  .file {
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    padding: 16px 0 4px 0;
    .attach {
      margin-bottom: 12px;
    }
  }
  .title {
    font-weight: 600;
    font-size: 16px;
    margin-bottom: 0;
  }
}
.content > p {
  margin: 0;
}
.el-icon-collection {
  font-size: 32px;
  margin-right: 6px;
  color: #5396ff;
}
::v-deep .el-tabs__nav-wrap::after {
  height: 0px !important;
}
</style>
