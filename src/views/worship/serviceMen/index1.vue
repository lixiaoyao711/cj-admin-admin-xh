<template>
  <div class="app-container">
    <div class="header">现役军人</div>
    <el-form
      class="search-form"
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="80px"
    >
      <el-form-item label="行政区划" prop="divisionCode">
        <TreeSelectDivision
          v-model="queryParams.divisionCode"
          @treeselectChange="(e) => treeselectChange(e, queryParams, 'divisionCode')"
        ></TreeSelectDivision>
      </el-form-item>
      <el-form-item label="人员类别" prop="personnelCategory">
        <el-select v-model="queryParams.personnelCategory" placeholder="请选择人员类别" clearable>
          <el-option
            v-for="dict in dict.type.sys_worship_personneltype"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="属地信息" prop="armyBaseCode">
        <el-cascader
          v-model="armyBaseCode"
          clearable
          ref="armyBaseCode"
          :props="customProps2"
          @change="handleBaseCodeChange"
          :options="mapList"
          placeholder="请选择"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="搜索" prop="keyWord">
        <el-input v-model="queryParams.keyWord" placeholder="请输入姓名" clearable />
      </el-form-item>
      <el-form-item class="search-right">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="table">
      <div class="table-title-box">
        <div class="title-name">现役军人列表</div>
        <el-row :gutter="10" class="mb8">
          <!-- <el-col :span="1.5">
            <el-button size="mini" :disabled="multiple" @click="handleTransfer({})" v-hasPermi="['worship:serviceMen:remove']"
              >批量转退役军人</el-button
            >
          </el-col> -->
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['worship:serviceMen:remove']"
              >删除所选</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['worship:serviceMen:export']"
              >导出所选</el-button
            >
          </el-col>

          <el-col :span="1.5">
            <el-button
              type="info"
              plain
              icon="el-icon-upload2"
              size="mini"
              @click="handleImport"
              v-hasPermi="['worship:serviceMen:export']"
              >导入</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['worship:serviceMen:add']"
              >新增</el-button
            >
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </div>

      <el-table v-loading="loading" :data="serviceMenList" @selection-change="handleSelectionChange" height="61vh">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="姓名" align="center" prop="name" />
        <el-table-column label="人员类别" align="center" prop="personnelCategory">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_worship_personneltype" :value="scope.row.personnelCategory" />
          </template>
        </el-table-column>
        <el-table-column label="军队驻地" align="center" prop="armyBase" />
        <el-table-column label="入伍时间" align="center" prop="dateOfEnlistment" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.dateOfEnlistment, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="160px" class-name="small-padding fixed-width" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleInfo(scope.row)">详情</el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleTransfer(scope.row)"
              v-hasPermi="['worship:serviceMen:edit']"
              >转退役军人</el-button
            >
            <el-button
              size="mini"
              type="text"
              @click="handleUpdate(scope.row, '修改现役军人')"
              v-hasPermi="['worship:serviceMen:edit']"
              >修改</el-button
            >
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.row)"
              v-hasPermi="['worship:serviceMen:remove']"
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

    <!-- 添加或修改现役军人对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="900px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="姓名" prop="name">
              <el-input :disabled="title === '现役军人详情'" v-model="form.name" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="行政区划" prop="divisionCode">
              <TreeSelectDivision
                v-model="form.divisionCode"
                :disabled="title === '现役军人详情'"
                @treeselectChange="(e) => treeselectChange(e, form)"
              ></TreeSelectDivision>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="入伍时间" prop="">
              <el-date-picker
                :disabled="title === '现役军人详情'"
                v-model="form.dateOfEnlistment"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                clearable
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="军人类别" prop="">
              <el-select
                :disabled="title === '现役军人详情'"
                v-model="form.personnelCategory"
                placeholder="请选择军人类别"
              >
                <el-option
                  v-for="dict in dict.type.sys_worship_personneltype"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="属地信息" prop="armyBase">
              <el-cascader
                :disabled="title === '现役军人详情'"
                v-model="armyBase"
                clearable
                ref="armyBase"
                :props="customProps"
                @change="handleChange('armyBase')"
                :options="mapList"
                placeholder="请选择"
              ></el-cascader> </el-form-item
          ></el-col>
          <el-col :span="12" v-if="armyBase.length">
            <el-form-item label="详细地址" prop="">
              <el-input
                :disabled="title === '现役军人详情'"
                v-model="form.armyBaseDetail"
                placeholder="请输入详细地址"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel('open')">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 现役军人详情 -->
    <el-dialog title="现役军人详情" :visible.sync="infoOpen" width="760px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="姓名:" prop="">
              <span>{{ form.name }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="入伍时间:" prop="">
              <span>{{ form.dateOfEnlistment }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="人员类别:" prop="">
              <dict-tag :options="dict.type.sys_worship_personneltype" :value="form.personnelCategory" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="军队驻地:" prop="armyBase">
              <span>{{ form.armyBase }}</span>
            </el-form-item></el-col
          >
          <el-col :span="12" v-if="armyBase.length">
            <el-form-item label="" prop="">
              <span>{{ form.armyBaseDetail }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('infoOpen')">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <div class="el-upload__tip" slot="tip">
            <el-checkbox v-model="upload.updateSupport" /> 是否更新已经存在的用户数据
          </div>
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link
            type="primary"
            :underline="false"
            style="font-size: 12px; vertical-align: baseline"
            @click="importTemplate"
            >下载模板</el-link
          >
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
    <AddOrUpdate
      :open="showTransferDialog"
      :title="title"
      :formData="transferForm"
      @cancel="showTransferDialog = false"
      @success="success"
    />
  </div>
</template>

<script>
import {
  listServiceMen,
  getServiceMen,
  delServiceMen,
  addServiceMen,
  updateServiceMen,
} from '@/api/worship/serviceMen';
import { addBasicPerson } from '@/api/worship/retiredSoldier';
import { getToken } from '@/utils/auth';
import AddOrUpdate from '@/views/worship/retiredSoldier/dialog/addOrUpdate';
export default {
  name: 'ServiceMen',
  components: { AddOrUpdate },
  dicts: ['sys_worship_personneltype', 'sys_worship_personneltag'],
  data() {
    return {
      // 按钮loading
      buttonLoading: false,
      showAddPeople: false,
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
      // 现役军人表格数据
      serviceMenList: [],
      tableData: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      infoOpen: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        idCard: undefined,
        sex: undefined,
        age: undefined,
        phone: undefined,
        personnelCategory: undefined,
        divisionCode: undefined,
        divisionName: undefined,
        armyBase: undefined,
        landAcquisition: undefined,
        homeAddress: undefined,
        rankLevel: undefined,
        serviceArea: undefined,
        dateOfEnlistment: undefined,
        personTags: undefined,
      },
      // 表单参数
      form: {},
      armyBase: [],
      showTransferDialog: false,
      transferForm: {},
      armyBaseCode: [],
      // 表单校验
      rules: {
        id: [{ required: true, message: '主键不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        divisionCode: [{ required: true, message: '行政区划不能为空', trigger: 'blur' }],
      },
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: '',
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: 'Bearer ' + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + '/system/user/importData',
      },
      customProps: {
        emitPath: true,
        label: 'name',
        value: 'adcode',
      },
      customProps2: {
        emitPath: true,
        label: 'name',
        value: 'adcode',
        checkStrictly: true,
      },
    };
  },
  computed: {
    mapList() {
      return this.$store.getters.mapList;
    },
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询现役军人列表 */
    getList() {
      this.loading = true;
      listServiceMen(this.queryParams).then((response) => {
        this.serviceMenList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel(type) {
      this[type] = false;
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
        idCard: undefined,
        sex: undefined,
        age: undefined,
        phone: undefined,
        personnelCategory: undefined,
        divisionCode: undefined,
        divisionName: undefined,
        armyBase: undefined,
        landAcquisition: undefined,
        homeAddress: undefined,
        rankLevel: undefined,
        serviceArea: undefined,
        dateOfEnlistment: undefined,
        personTags: undefined,
        homeAddressList: [],
        landAcquisitionList: [],
      };
      this.armyBase = [];
      this.resetForm('form');
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.armyBaseCode = [];
      this.queryParams.searchTime = [];
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
      this.title = '添加现役军人';
    },
    /** 详情操作 */
    handleInfo(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids;
      this.armyBase = row.armyBaseCode ? row?.armyBaseCode?.split(',') : [];
      getServiceMen(id).then((response) => {
        this.loading = false;
        this.form = response.data;
        this.infoOpen = true;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row, title = '修改现役军人') {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids;
      this.armyBase = row.armyBaseCode ? row?.armyBaseCode?.split(',') : [];
      getServiceMen(id).then((response) => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = title;
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateServiceMen(this.form)
              .then((response) => {
                this.$modal.msgSuccess('修改成功');
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else {
            addServiceMen(this.form)
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
      const name = row.name ?? this.filterDelData(this.ids, this.serviceMenList, 'name');

      this.$modal
        .confirm('是否确认删除现役军人姓名为"' + name + '"的数据项？')
        .then(() => {
          this.loading = true;
          return delServiceMen(ids);
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
        'worship/serviceMen/export',
        {
          ...this.queryParams,
        },
        `serviceMen_${new Date().getTime()}.xlsx`
      );
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = '用户导入';
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download('system/user/importTemplate', {}, `user_template_${new Date().getTime()}.xlsx`);
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(
        "<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" +
          response.msg +
          '</div>',
        '导入结果',
        { dangerouslyUseHTMLString: true }
      );
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
    handleChange(value) {
      let data = this.$refs[value]?.getCheckedNodes();
      this.form[`${value}Code`] = this[value].join(',');
      this.form[value] = data[0].pathLabels.join(',');
      console.log(this.form);
    },
    handleBaseCodeChange(val) {
      this.queryParams['armyBaseCode'] = val.join(',');
    },
    // 转退役军人
    handleTransfer(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids;
      if (row.id) {
        this.ids = id;
        getServiceMen(id).then((response) => {
          this.loading = false;
          this.transferForm = Object.assign({}, response.data, { id: null });
          this.title = '转退役军人';
          this.showTransferDialog = true;
        });
      } else {
        this.serviceMenList.forEach((e) => {
          let formData = Object.assign({}, e, { id: null });
          addBasicPerson(formData).then((response) => {});
        });
        delServiceMen(id)
          .then((res) => {
            this.$modal.msgSuccess('转出成功');
          })
          .finally(() => {
            this.buttonLoading = false;
          });
      }
    },
    success() {
      this.showTransferDialog = false;
      delServiceMen(this.ids).then((res) => {});
      this.getList();
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
  ::v-deep {
    .el-select {
      width: 9vw;
    }
  }
}

.table {
  background: #fff;
  margin: 16px 0 0 0;
  padding: 16px;
  box-sizing: border-box;
  height: 690px;
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
.tags {
  display: flex;
  .tag-item {
    margin: 0 10px 0 0;
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
</style>
