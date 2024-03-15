<template>
  <div class="indoor">
    <el-form
      class="search-form"
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="行政区划" prop="infoDivisionCode">
        <TreeSelectDivision
          v-model="queryParams.infoDivisionCode"
          @treeselectChange="(e) => treeselectChange(e, queryParams,'', 'infoDivisionCode')"
        ></TreeSelectDivision>
      </el-form-item>

      <el-form-item label="登记级别" prop="infoRegisterLevel">
        <el-select v-model="queryParams.infoRegisterLevel" placeholder="请选择" clearable>
          <el-option
            v-for="dict in dict.type.sys_worship_djjb"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="信访等级" prop="infoUrgencyLevel">
        <el-select v-model="queryParams.infoUrgencyLevel" placeholder="请选择" clearable>
          <el-option
            v-for="dict in dict.type.sys_worship_jjcd"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="信访渠道" prop="infoChannel">
        <el-select v-model="queryParams.infoChannel" placeholder="请选择" clearable>
          <el-option
            v-for="dict in dict.type.sys_worship_xfdjqd"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="信访目的" prop="infoObjective">
        <el-select v-model="queryParams.infoObjective" placeholder="请选择" clearable>
          <el-option
            v-for="dict in dict.type.sys_worship_xfmd"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="重复访" prop="isRepeat">
        <el-select v-model="queryParams.isRepeat" placeholder="请选择" clearable>
          <el-option v-for="dict in yesMap" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="处理进度" prop="state">
        <el-select v-model="queryParams.state" placeholder="请选择" clearable>
          <el-option
            v-for="dict in dict.type.sys_worship_xfzt"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="登记日期" prop="searchTime">
        <el-date-picker
          v-model="queryParams.searchTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item label="搜索" prop="searchValue">
        <el-input v-model="queryParams.searchValue" placeholder="姓名、身份证号、联系方式" clearable />
      </el-form-item>
      <el-form-item class="search-right">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <div class="table">
      <div class="table-title-box">
        <div class="title-name"></div>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button plain size="mini" @click="handleAdd">导入</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button plain size="mini" @click="handleAdd">导入模板下载</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button plain size="mini" @click="handleAdd">导出</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button plain size="mini" @click="handleAdd('自行处置', '1')">自行处置</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd('新建信访事件')"
              >新增</el-button
            >
          </el-col>

          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar
        ></el-row>
      </div>
      <el-table v-loading="loading" :data="serviceFamilyList" @selection-change="handleSelectionChange" height="50vh">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="日期" align="center" prop="reportTime" />
        <el-table-column label="登记级别" align="center" prop="sex">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_worship_djjb" :value="scope.row.infoRegisterLevel" />
          </template>
        </el-table-column>
        <el-table-column label="信访人" align="center" prop="petitionPersonName" />
        <el-table-column label="困难类型" align="center" prop="divisionName">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_worship_difficultytype" :value="scope.row.infoRegisterLevel" />
          </template>
        </el-table-column>
        <el-table-column label="信访目的" align="center" prop="infoObjective">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_worship_xfmd" :value="scope.row.infoObjective" />
          </template>
        </el-table-column>
        <el-table-column label="信访渠道" align="center" prop="infoChannel">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_worship_xfdjqd" :value="scope.row.infoChannel" />
          </template>
        </el-table-column>
        <el-table-column label="诉求内容" align="center" prop="petitionContent">
          <template slot-scope="scope">
            <div :title="scope.row.petitionContent">
              <span v-if="scope.row.petitionContent.length < 30">{{ scope.row.petitionContent }}</span>
              <span v-else>{{ scope.row.petitionContent.slice(0, 30) }}.......</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="行政区划" align="center" prop="infoDivisionName" />
        <el-table-column label="是否重复访" align="center" prop="divisionName">
          <template slot-scope="scope"> {{ scope.row.isRepeat == '1' ? '是' : '否' }} </template>
        </el-table-column>
        <el-table-column label="处理进度" align="center" prop="state">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_worship_xfzt" :value="scope.row.state" />
          </template>
        </el-table-column>
        <el-table-column label="距办结时间" align="center" prop="divisionName">
          <template slot-scope="scope">
            <div>
              <dict-tag
                v-if="typeof scope.row.lagState === 'number'"
                :options="dict.type.sys_worship_wczt"
                :value="scope.row.lagState"
              />
              <span v-else>{{ scope.row.lagState }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200">
          <template slot-scope="scope">
            <el-button size="mini" type="text">
              <router-link :to="`/petitionInfo/detail/info/${scope.row.id}`">
                <el-button size="mini" type="text">详情</el-button>
              </router-link>
            </el-button>

            <el-button size="mini" type="text" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button size="mini" type="text" class="del" @click="handleDelete(scope.row)">删除</el-button>
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

    <AddData v-if="open" @close="cancel" @success="addSuccess" :title="title" :propsData="form" />
  </div>
</template>

<script>
import {
  listPetitionInfo,
  getPetitionInfo,
  addPetitionInfo,
  updatePetitionInfo,
  delPetitionInfo,
} from '@/api/worship/petitionInfo';
import { getToken } from '@/utils/auth';
import AddData from '../dialog/addData.vue';
export default {
  name: 'ServiceFamily',
  components: {
    AddData,
  },
  dicts: [
    'sys_worship_xfzt',
    'sys_worship_xfmd',
    'sys_worship_djjb',
    'sys_worship_jjcd',
    'sys_worship_xfdjqd',
    'sys_worship_xfmdlx',
    'sys_worship_wczt',
    'sys_worship_difficultytype',
  ],
  data() {
    return {
      // 按钮loading
      buttonLoading: false,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      peopleList: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 现役军人家属表格数据
      serviceFamilyList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      changePeoPleDialog: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        infoDivisionCode: undefined,
        infoRegisterLevel: undefined,
        infoUrgencyLevel: undefined,
        infoChannel: undefined,
        infoObjective: undefined,
        isRepeat: undefined,
        state: '1',
        searchValue: undefined,
        searchTime: [],
      },

      // 表单参数
      form: {
        infoUrgencyLevel: '0',
        reportPhone: undefined,
        reportTime: undefined,
        deadline: undefined,
      },
      permanentResidence: [],
      registeredResidence: [],
      placementResidence: [],
      personTagsList: [],
      personCategoryList: [],
      yesMap: [
        { label: '是', value: '1' },
        { label: '否', value: '0' },
      ],
      // 表单校验
      rules: {
        // petitionPersonName: [{ required: true, message: '信访人不能为空', trigger: 'blur' }],
        reportUser: [{ required: true, message: '登记人不能为空', trigger: 'blur' }],
        reportPhone: [{ required: true, message: '登记人电话不能为空', trigger: 'blur' }],
        infoObjective: [{ required: true, message: '请选择', trigger: 'blur' }],
        // infoObjectiveType: [{ required: true, message: '请选择', trigger: 'blur' }],
        infoDivisionCode: [{ required: true, message: '请选择', trigger: 'blur' }],
        infoRegisterLevel: [{ required: true, message: '请选择', trigger: 'blur' }],
        infoChannel: [{ required: true, message: '请选择', trigger: 'blur' }],
        infoUrgencyLevel: [{ required: true, message: '请选择', trigger: 'blur' }],
        reportTime: [{ required: true, message: '请选择', trigger: 'blur' }],
        deadline: [{ required: true, message: '请选择', trigger: 'blur' }],
        // reportTime: [{ required: true, message: '请选择', trigger: 'blur' }],
        // deadline: [{ required: true, message: '请选择', trigger: 'blur' }],
        petitionContent: [{ required: true, message: '请输入', trigger: 'blur' }],
        fileUrl: [{ required: true, message: '请选择', trigger: 'blur' }],
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
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.user.user;
    },
  },
  watch: {},
  created() {
    this.getList();
  },
  methods: {
    /** 查询现役军人家属列表 */
    getList() {
      this.loading = true;
      this.queryParams.beginTime = this.queryParams?.searchTime[0];
      this.queryParams.endTime = this.queryParams?.searchTime[1];
      listPetitionInfo({ ...this.queryParams, searchTime: null }).then((response) => {
        this.serviceFamilyList = response.rows;
        this.total = response.total;
        this.loading = false;
        this.$emit('getList', { infoDivisionCode: this.queryParams.infoDivisionCode });
      });
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    addSuccess() {
      this.cancel();
      this.getList();
    },
    // 表单重置
    reset() {
      this.form = {
        infoUrgencyLevel: '0',
        reportPhone: undefined,
        reportTime: undefined,
        deadline: undefined,
      };
      this.personTagsList = this.permanentResidence = this.registeredResidence = this.placementResidence = [];
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
    handleAdd(title = '新建信访事件', disposeFlag) {
      console.log(disposeFlag);
      this.reset();
      this.form.reportTime = new Date();
      this.form.reportUser = this.userInfo.nickName;
      this.form.reportPhone = this.userInfo.phonenumber;
      this.form.infoDivisionCode = this.userInfo.infoDivisionCode;
      this.form.divisionName = this.userInfo.divisionName;
      this.$set(this.form, 'infoUrgencyLevel', '0');
      if (disposeFlag === '1') {
        this.$set(this.form, 'petitionInfoFlowBo', { operType: '7' });
      } else {
        this.$set(this.form, 'petitionInfoFlowBo', { operType: '0' });
      }

      this.updateDeadline();
      this.title = title;
      this.open = true;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();

      getPetitionInfo(row.id).then((response) => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = '修改信访事件';
      });
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      const name = row.petitionPersonName ?? this.filterDelData(this.ids, this.serviceFamilyList, 'petitionPersonName');

      this.$modal
        .confirm('是否确认删除信访人为"' + name + '"的数据项？')
        .then(() => {
          this.loading = true;
          return delPetitionInfo(ids);
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
        'worship/serviceFamily/export',
        {
          ...this.queryParams,
        },
        `serviceFamily_${new Date().getTime()}.xlsx`
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
    updateDeadline() {
      if (!this.form.reportTime || !this.form.infoUrgencyLevel) {
        return;
      }
      // 截止日期根据紧急程度自动计算
      let stamp = Date.parse(new Date(this.form.reportTime));
      let deadlineMap = {
        2: 86400000, // 1天
        1: 172800000, // 2天
        0: 259200000, // 3天
      };
      // this.form.deadline =
      this.$set(
        this.form,
        'deadline',
        this.parseTime(new Date(stamp + deadlineMap[this.form.infoUrgencyLevel]), '{y}-{m}-{d}')
      );
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
  // height: 544px;

  .table-title-box {
    display: flex;
    justify-content: space-between;
    // height: 36px;
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
