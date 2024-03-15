<template>
  <div class="app-container">
    <div class="header">选树典型</div>
    <el-form
      class="search-form"
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width=""
    >
      <el-form-item label="行政区划：" prop="divisionCode">
        <TreeSelectDivision
          v-model="queryParams.divisionCode"
          @treeselectChange="(e) => treeselectChange(e, queryParams, 'divisionCode')"
        ></TreeSelectDivision>
      </el-form-item>
      <el-form-item label="类型：" prop="type">
        <el-select v-model="queryParams.type" @keyup.enter.native="handleQuery" placeholder="请选择类型" clearable>
          <el-option
            v-for="dict in dict.type.sys_worship_typicaltreeselection"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="级别：" prop="level">
        <el-select v-model="queryParams.level" @keyup.enter.native="handleQuery" placeholder="请选择级别" clearable>
          <el-option
            v-for="dict in dict.type.sys_worship_level"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="年度：" prop="year">
        <el-select v-model="queryParams.year" placeholder="请选择年度">
          <el-option v-for="(year, index) in yearList" :key="index" :label="year" :value="year"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="搜索:" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入人物姓名" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item class="search-right">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="table">
      <div class="table-title-box">
        <div class="title-name">人物列表</div>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              plain
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['worship:typical:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['worship:typical:add']"
              >新增</el-button
            >
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </div>
      <el-table v-loading="loading" :data="typicalList" @selection-change="handleSelectionChange" height="85%">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="照片" align="center" prop="fileUrl" width="100">
          <template slot-scope="scope">
            <image-preview :src="scope.row.file" :width="50" :height="50" />
          </template>
        </el-table-column>
        <el-table-column label="人物" align="center" prop="name" width="100" />
        <el-table-column label="性别" align="center" prop="sex" width="80">
          <template slot-scope="scope">
            {{ scope.row.sex }}
          </template>
        </el-table-column>
        <el-table-column label="行政区划" align="center" prop="divisionName" width="" />
        <el-table-column label="事迹" align="center" prop="deeds" width="600" />
        <el-table-column label="类型" align="center" prop="type" width="">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_worship_typicaltreeselection" :value="scope.row.type" />
          </template>
        </el-table-column>
        <el-table-column label="级别" align="center" prop="level" width="100">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_worship_level" :value="scope.row.level" />
          </template>
        </el-table-column>
        <el-table-column label="年度" align="center" prop="year" width="100"></el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleDetail(scope.row)">详情</el-button>
            <el-button size="mini" type="text" @click="handleUpdate(scope.row)" v-hasPermi="['worship:typical:edit']"
              >修改</el-button
            >
            <el-button size="mini" type="text" @click="handleDelete(scope.row)" v-hasPermi="['worship:typical:remove']"
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
    <!-- 添加或修改选树典型对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="人物：" prop="name">
              <el-input v-model="form.name" placeholder="请输入人物姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别：" prop="sex">
              <el-radio-group v-model="form.sex">
                <el-radio label="男性">男性</el-radio>
                <el-radio label="女性">女性</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="类型：" prop="type">
              <el-select v-model="form.type" placeholder="请选择类型">
                <el-option
                  v-for="dict in dict.type.sys_worship_typicaltreeselection"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="行政区划：" prop="divisionCode">
              <TreeSelectDivision
                v-model="form.divisionCode"
                @treeselectChange="(e) => treeselectChange(e, form)"
              ></TreeSelectDivision>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="级别：" prop="level">
              <el-select v-model="form.level" placeholder="请选择级别">
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
            <el-form-item label="年度：" prop="year">
              <el-date-picker v-model="form.year" type="year" value-format="yyyy" placeholder="请选择年度">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="事迹：" prop="deeds">
          <el-input v-model="form.deeds" type="textarea" placeholder="请输入内容" :rows="5" />
        </el-form-item>
        <el-form-item label="照片：" prop="fileUrl">
          <image-upload v-model="form.fileUrl" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="openDetail" :title="'选树典型详情'" width="50%" :modal="false" append-to-body>
      <el-row class="rows">
        <el-col :span="24" class="alignCenter">
          <span class="name">{{ form.name }}</span>
          <el-tag type="info"
            ><dict-tag :options="dict.type.sys_worship_typicaltreeselection" :value="form.type"
          /></el-tag>
        </el-col>
        <el-col :span="12"> 性别：{{ form.sex }}</el-col>
        <el-col :span="12">行政区划：{{ form.divisionName }}</el-col>
        <el-col :span="12"> 级别：<dict-tag :options="dict.type.sys_worship_level" :value="form.level" /> </el-col>
        <el-col :span="12">年度：{{ form.year }}年</el-col>
        <el-col :span="24">
          <div>事迹：</div>
          {{ form.deeds }}
        </el-col>
        <el-col :span="24">
          <span class="mr10"> 活动照片:</span>
          <el-image
            class="mr10"
            v-for="(item, index) in fileList"
            :key="index"
            style="width: 100px; height: 100px"
            :src="fileList[index]"
            :preview-src-list="fileList"
          >
          </el-image>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { listTypical, getTypical, delTypical, addTypical, updateTypical, getYearList } from '@/api/worship/typical';
import { listByIds } from '@/api/system/oss';
export default {
  name: 'Typical',
  dicts: ['sys_worship_level', 'sys_worship_typicaltreeselection'],
  data() {
    return {
      sexOptions: [
        {
          label: '男性',
          value: '0',
        },
        {
          label: '女性',
          value: '1',
        },
      ],
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
      // 选树典型表格数据
      typicalList: [],
      srcList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 是否展示详情弹出层
      openDetail: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        divisionCode: undefined,
        name: undefined,
        type: undefined,
        level: undefined,
        year: undefined,
      },
      // 表单参数
      form: {},
      divisionCode: '330106004',
      fileList: [],
      yearList: [],
      // 表单校验
      rules: {
        id: [{ required: true, message: '主键不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '人物不能为空', trigger: 'blur' }],
        divisionCode: [{ required: true, message: '行政区划不能为空', trigger: 'change' }],
        divisionName: [{ required: true, message: '行政区划名称不能为空', trigger: 'change' }],
        type: [{ required: true, message: '类型不能为空', trigger: 'change' }],
        level: [{ required: true, message: '级别不能为空', trigger: 'change' }],
        year: [{ required: true, message: '年度不能为空', trigger: 'blur' }],
        deeds: [{ required: true, message: '事迹不能为空', trigger: 'blur' }],
      },
    };
  },
  created() {
    this.getList();
    this.getDate();
  },
  methods: {
    /** 查询选树典型列表 */
    getList() {
      this.loading = true;
      listTypical(this.queryParams).then(async (response) => {
        this.typicalList = await Promise.all(
          response.rows.map(async (item) => {
            if (item.fileUrl) {
              let url = await this.getImgList(item.fileUrl);
              item.file = url[0];
            }
            return item;
          })
        );
        this.total = response.total;
        this.loading = false;
      });
    },
    async getImgList(id) {
      const { data } = await listByIds(id);
      let list = data.map((item) => item.url);
      return list;
    },
    getDate() {
      getYearList().then((res) => {
        this.yearList = res.data;
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
        name: undefined,
        sex: '0',
        divisionCode: undefined,
        divisionName: undefined,
        type: undefined,
        level: undefined,
        year: undefined,
        deeds: undefined,
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
      this.title = '添加选树典型';
    },
    /** 详情按钮操作 */
    handleDetail(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids;
      getTypical(id).then(async (response) => {
        this.loading = false;
        this.form = response.data;
        this.openDetail = true;
        console.log(this.form, 'this.form');
        if (this.form.fileUrl) {
          this.fileList = await this.getImgList(this.form.fileUrl);
        }
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids;
      getTypical(id).then((response) => {
        this.loading = false;
        if (response.data.sex) {
          response.data.sex.trim();
        } else {
          response.data.sex = '';
        }
        this.form = response.data;
        console.log(this.form);
        this.open = true;
        this.title = '修改选树典型';
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateTypical(this.form)
              .then((response) => {
                this.$modal.msgSuccess('修改成功');
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else {
            addTypical(this.form)
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
        .confirm('是否确认删除选树典型编号为"' + ids + '"的数据项？')
        .then(() => {
          this.loading = true;
          return delTypical(ids);
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
  height: 696px;

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
    font-weight: 600;
    font-size: 28px;
    margin-right: 12px;
  }
}
</style>
