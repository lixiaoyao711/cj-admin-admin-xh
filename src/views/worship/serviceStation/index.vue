<template>
  <div class="app-container">
    <div class="header">退役军人服务站</div>
    <el-form
      class="search-form"
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="100px"
    >
      <el-form-item label="行政区划：" prop="divisionCode">
        <TreeSelectDivision
          v-model="queryParams.divisionCode"
          @treeselectChange="(e) => treeselectChange(e, queryParams, 'divisionCode')"
        ></TreeSelectDivision>
      </el-form-item>
      <div class="search-right">
        <el-form-item label="" prop="searchValue">
          <el-input
            v-model="queryParams.searchValue"
            placeholder="输入关键字搜索"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </div>
    </el-form>

    <div class="table">
      <div class="table-title-box">
        <div class="title-name">服务站列表</div>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['worship:serviceStation:add']"
              >新增</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="handleImport"
              v-hasPermi="['worship:serviceStation:import']"
              >导入</el-button
            >
          </el-col>

          <!-- <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['worship:serviceStation:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['worship:serviceStation:export']"
              >导出</el-button
            >
          </el-col> -->
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </div>

      <el-table v-loading="loading" :data="serviceStationList" @selection-change="handleSelectionChange" height="60vh">
        <el-table-column type="selection" width="55" align="center" />

        <el-table-column label="名称" align="center" prop="name" />
        <el-table-column label="联系电话" align="center" prop="phone" />
        <el-table-column label="地址" align="center" prop="address" />
        <el-table-column label="所属镇街" align="center" prop="divisionName" />

        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['worship:serviceStation:edit']"
              >修改</el-button
            >
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.row)"
              v-hasPermi="['worship:serviceStation:remove']"
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

    <!-- 添加或修改退役军人服务站管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-form-item label="服务站名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入服务站名称" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="行政区划" prop="name">
              <TreeSelectDivision
                v-model="form.divisionCode"
                @treeselectChange="(e) => treeselectChange(e, form)"
              ></TreeSelectDivision>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入联系电话" /> </el-form-item
          ></el-col>
        </el-row>
        <el-row>
          <el-form-item label="经纬度" prop="location">
            <el-input readonly v-model="form.location" placeholder="请选择">
              <el-button @click="openMap" slot="append" icon="el-icon-location-outline"></el-button>
            </el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="地址" prop="address">
            <el-input v-model="form.address" placeholder="请输入地址" />
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
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
    <!-- 地图 -->
    <MapDialog
      @saveMap="saveMap"
      v-if="mapDialogVisible"
      @close="mapDialogVisible = false"
      :propCenter="propCenter"
      :propAddress="propAddress"
    />
  </div>
</template>

<script>
import {
  listServiceStation,
  getServiceStation,
  delServiceStation,
  addServiceStation,
  updateServiceStation,
} from '@/api/worship/serviceStation';
import { getToken } from '@/utils/auth';

import MapDialog from '@/components/Map/mapDialog';

export default {
  name: 'ServiceStation',
  components: {
    MapDialog,
  },
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
      // 退役军人服务站管理表格数据
      serviceStationList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        searchValue: undefined,
        divisionName: undefined,
        divisionCode: undefined,
      },
      // 表单参数
      form: {},
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
      // 表单校验
      rules: {
        id: [{ required: true, message: '主键不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '服务站名称不能为空', trigger: 'blur' }],
        phone: [{ required: true, message: '联系电话不能为空', trigger: 'blur' }],
        address: [{ required: true, message: '地址不能为空', trigger: 'blur' }],
        divisionName: [{ required: true, message: '行政区划名称不能为空', trigger: 'blur' }],
        divisionCode: [{ required: true, message: '行政区划code不能为空', trigger: 'blur' }],
        longitude: [{ required: true, message: '经度不能为空', trigger: 'blur' }],
        latitude: [{ required: true, message: '纬度不能为空', trigger: 'blur' }],
        location: [{ required: true, message: '请选择地址', trigger: 'blur' }],
      },
      // mapDialog
      mapDialogVisible: false,
      // map经纬度
      propCenter: [120.130203, 30.259324],
      // map地址
      propAddress: '',
    };
  },
  computed: {},
  created() {
    this.getList();
  },
  methods: {
    /** 查询退役军人服务站管理列表 */
    getList() {
      this.loading = true;
      listServiceStation(this.queryParams).then((response) => {
        this.serviceStationList = response.rows;
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
        createId: undefined,
        updateId: undefined,
        createName: undefined,
        updateName: undefined,
        delFlag: undefined,
        name: undefined,
        phone: undefined,
        address: undefined,
        divisionName: undefined,
        divisionCode: undefined,
        longitude: undefined,
        latitude: undefined,
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
      this.title = '添加退役军人服务站管理';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids;
      getServiceStation(id).then((response) => {
        this.loading = false;
        this.form = response.data;
        this.form.location = `${response.data.longitude},${response.data.latitude}`;
        this.open = true;
        this.title = '修改退役军人服务站管理';
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateServiceStation(this.form)
              .then((response) => {
                this.$modal.msgSuccess('修改成功');
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else {
            addServiceStation(this.form)
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

    // 打开地图
    openMap() {
      this.form.id ? (this.propCenter = [this.form.longitude, this.form.latitude]) : '';
      this.propAddress = this.form.location;
      this.mapDialogVisible = true;
    },
    // 点击地图保存回调
    saveMap(latLong, address) {
      let point = latLong.split(',');
      this.$set(this.form, 'address', address);
      this.$set(this.form, 'longitude', point[0]);
      this.$set(this.form, 'latitude', point[1]);
      this.$set(this.form, 'location', `${point[0]},${point[1]}`);

      this.propCenter = point;
      this.mapDialogVisible = false;
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除退役军人服务站管理编号为"' + ids + '"的数据项？')
        .then(() => {
          this.loading = true;
          return delServiceStation(ids);
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
        'worship/serviceStation/export',
        {
          ...this.queryParams,
        },
        `serviceStation_${new Date().getTime()}.xlsx`
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
    // width: 14%;
    display: flex;
  }
}

.table {
  background: #fff;
  margin: 16px 0 0 0;
  padding: 16px;
  box-sizing: border-box;
  height: 680px;
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
