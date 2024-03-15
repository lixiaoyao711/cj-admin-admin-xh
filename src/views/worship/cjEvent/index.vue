<template>
  <div class="app-container">
    <div class="header">崇军活动</div>
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
        <el-form-item label="组织单位" prop="divisionCode">
          <TreeSelectDivision
            v-model="queryParams.divisionCode"
            @treeselectChange="(e) => treeselectChange(e, queryParams, 'divisionCode')"
          ></TreeSelectDivision>
        </el-form-item>
        <el-form-item label="活动类型" prop="activityType">
          <el-select v-model="queryParams.activityType" placeholder="请选择活动类型" clearable>
            <el-option
              v-for="dict in dict.type.sys_worship_activity"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="活动日期" prop="">
          <el-date-picker
            clearable
            v-model="queryParams.searchTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
            placeholder="请选择活动日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="搜索" prop="keyWord">
          <el-input
            v-model="queryParams.keyWord"
            placeholder="请输入标题"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
      </el-row>
      <el-form-item class="search-right">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <div class="table">
      <div class="table-title-box">
        <div class="title-name">活动列表</div>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['worship:partyActivities:add']"
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
              v-hasPermi="['worship:partyActivities:remove']"
              >删除</el-button
            >
          </el-col>

          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </div>

      <el-table v-loading="loading" :data="partyActivitiesList" @selection-change="handleSelectionChange" height="86%">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="活动类型" align="center" prop="activityType">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_worship_activity" :value="scope.row.activityType" />
          </template>
        </el-table-column>
        <el-table-column label="活动标题" align="center" prop="activityTitle" />
        <el-table-column label="组织单位" align="center" prop="divisionName" />

        <el-table-column label="参加人数" align="center" prop="numOfParticipants" />
        <el-table-column label="活动日期" align="center" prop="activityTime" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.activityTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="活动照片" align="center" prop="activityTime" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.activityTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="活动内容" align="center" prop="activityContent" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleUpdate(scope.row, 'infoOpen')">详情</el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleUpdate(scope.row, 'open')"
              v-hasPermi="['worship:partyActivities:edit']"
              >修改</el-button
            >
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.row)"
              v-hasPermi="['worship:partyActivities:remove']"
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

    <!-- 添加或修改党建引领活动对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="活动类型" prop="activityType">
          <el-radio-group v-model="form.activityType">
            <el-radio v-for="(item, index) in dict.type.sys_worship_activity" :key="index" :label="item.value">{{
              item.label
            }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-if="form.activityType === '3'">
          <el-row>
            <el-col :span="12">
              <el-form-item label="活动标题" prop="activityTitle">
                <el-input v-model="form.activityTitle" placeholder="请输入活动标题" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="组织单位" prop="divisionCode">
                <TreeSelectDivision @treeselectChange="(e) => treeselectChange(e, form)"></TreeSelectDivision>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="活动日期" prop="activityTime">
                <el-date-picker
                  clearable
                  v-model="form.activityTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="请选择活动日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="参与人" prop="participantsName">
            <el-input @focus="changePeoPleDialog = true" v-model="form.participantsName" placeholder="请选择参与人" />
          </el-form-item>
          <el-row>
            <el-col :span="8">
              <el-form-item label="活动时长" prop="activityDuration">
                <div class="df">
                  <el-input v-model="form.activityDuration" placeholder="" type="number" :min="0" />
                  <div class="time">小时</div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="活动地址" prop="activityAddress">
            <el-input :readonly="!form.activityAddress" v-model="form.activityAddress" placeholder="请输入内容">
              <el-button @click="openMap" slot="append" icon="el-icon-location-outline"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="活动内容" prop="activityContent">
            <el-input v-model="form.activityContent" type="textarea" placeholder="请输入内容" />
          </el-form-item>
          <el-form-item label="上传图片" prop="fileList">
            <el-upload
              :action="uploadImgUrl"
              :headers="headers"
              list-type="picture-card"
              :on-success="handleUploadSuccess"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :file-list="fileList"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
        </div>
        <div v-else>
          <el-row>
            <el-col :span="12">
              <el-form-item label="活动标题" prop="activityTitle">
                <el-input v-model="form.activityTitle" placeholder="请输入活动标题" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="组织单位" prop="divisionCode">
                <TreeSelectDivision
                  v-model="form.divisionCode"
                  @treeselectChange="(e) => treeselectChange(e, form)"
                ></TreeSelectDivision>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="参加人数" prop="">
                <el-input
                  v-model="form.numOfParticipants"
                  placeholder="请输入参加人数"
                  type="number"
                  :min="0"
                /> </el-form-item
            ></el-col>
            <el-col :span="12">
              <el-form-item label="活动日期" prop="activityTime">
                <el-date-picker
                  clearable
                  v-model="form.activityTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="请选择活动日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item v-if="form.activityType === '7'" label="组织名称" prop="socialOrganizationId">
            <el-select
              v-model="socialOrganizationIdList"
              multiple
              @change="handleOrgChange"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="org in socialOrganizationList"
                :key="org.id"
                :label="org.organizationName"
                :value="org.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="活动地址" prop="activityAddress">
            <el-input :readonly="!form.activityAddress" v-model="form.activityAddress" placeholder="请输入内容">
              <el-button @click="openMap" slot="append" icon="el-icon-location-outline"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="活动内容" prop="activityContent">
            <el-input v-model="form.activityContent" type="textarea" placeholder="请输入内容" />
          </el-form-item>
          <el-form-item label="上传图片" prop="fileList">
            <el-upload
              :action="uploadImgUrl"
              :headers="headers"
              list-type="picture-card"
              :on-success="handleUploadSuccess"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :file-list="fileList"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
          <div v-if="form.activityType === '5'">
            <div class="line"></div>
            <el-alert
              class="mt10"
              title="若就业招聘活动有企业参加，可填写参与公司，若没有可不填写"
              type="warning"
              show-icon
            >
            </el-alert>
            <el-row class="row-title mt10">
              <el-col :span="20" class="title-name">参与公司</el-col>
              <el-col :span="4">
                <el-button @click="companyOpen = true">添加参与公司</el-button>
              </el-col>
            </el-row>
            <el-table :data="tableList" class="mt10">
              <el-table-column label="公司名称" prop="companyName" />
              <el-table-column label="操作" align="center" width="80px" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <el-button size="mini" type="text" @click="companyDelete(scope.row, scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-form>
      <el-dialog title="添加参与公司" :visible.sync="companyOpen" width="400px" append-to-body>
        <span class="mr10">公司名称</span>
        <el-select
          multiple
          filterable
          allow-create
          default-first-option
          v-model="company"
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="company in companyList"
            :key="company.id"
            :label="company.companyName"
            :value="company.companyName"
          />
        </el-select>
        <div slot="footer" class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitOmpany">确 定</el-button>
          <el-button @click="cancelOmpany">取 消</el-button>
        </div>
      </el-dialog>

      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel('open')">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 详情 -->
    <el-dialog title="活动详情" :visible.sync="infoOpen" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row class="df">
          <el-tag type="info">
            <dict-tag :options="dict.type.sys_worship_activity" :value="form.activityType" />
          </el-tag>
          <span class="info-title">{{ form.activityTitle }}</span>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="组织单位" prop="">
              <span>{{ form.divisionName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="参与人数" prop="">
              <span>{{ form.numOfParticipants }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="活动日期" prop="">
              <span>{{ parseTime(form.activityTime, '{y}-{m}-{d}') }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.activityType === '7'">
            <el-form-item label="组织名称" prop="">
              <span>{{ form.socialOrganizationName }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="活动地址" prop="">
          <span>{{ form.activityAddress }}</span>
        </el-form-item>
        <el-form-item label="活动内容" prop="">
          <span>{{ form.activityContent }}</span>
        </el-form-item>
        <el-row>
          <el-form-item label="活动照片" prop="">
            <el-image
              class="mr10"
              v-for="(item, index) in form.fileList"
              :key="item.ossId"
              style="width: 100px; height: 100px"
              :src="item.url"
              :preview-src-list="form.fileList.map((item) => baseOss + item.ossId)"
            >
            </el-image>
          </el-form-item>
        </el-row>
        <div v-if="form.activityType === '5'">
          <div class="line mt10"></div>
          <el-form-item label="参与公司" prop=""> </el-form-item>
          <el-table :data="tableList" class="mt10">
            <el-table-column label="公司名称" prop="companyName" />
          </el-table>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('infoOpen')">取 消</el-button>
      </div>
    </el-dialog>
    <ChangePeoPle
      v-if="changePeoPleDialog"
      @close="changePeoPleDialog = false"
      @success="changePeoPleSuccess"
      :type="'petitionData'"
      :peopleList="peopleList"
    />
    <!-- 地图 -->
    <MapDialog
      @saveMap="saveMap"
      v-if="mapDialogVisible"
      @close="mapDialogVisible = false"
      :propCenter="propCenter"
      :propAddress="propAddress"
    />
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import {
  listPartyActivities,
  getPartyActivities,
  delPartyActivities,
  addPartyActivities,
  updatePartyActivities,
} from '@/api/worship/cjEvent';
import { listByIds } from '@/api/system/oss';
import ChangePeoPle from '@/components/ChangePeoPle/people';
import { listJobCompany } from '@/api/worship/jobCompany';
import { listSocialOrganization } from '@/api/worship/socialOrganization';
import MapDialog from '@/components/Map/mapDialog';
import { getToken } from '@/utils/auth';

export default {
  name: 'PartyActivities',
  dicts: ['sys_worship_activity'],
  components: {
    ChangePeoPle,
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
      // 党建引领活动表格数据
      partyActivitiesList: [],
      tableList: [],
      peopleList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      companyOpen: false,
      infoOpen: false,
      changePeoPleDialog: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        keyWord: undefined,
        divisionCode: undefined,
        activityType: undefined,
        activityTime: undefined,
        searchTime: [],
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        id: [{ required: true, message: '主键不能为空', trigger: 'blur' }],
        activityTitle: [{ required: true, message: '活动标题不能为空', trigger: 'blur' }],
        divisionCode: [{ required: true, message: '组织单位不能为空', trigger: 'change' }],
        divisionName: [{ required: true, message: '行政区划名称不能为空', trigger: 'change' }],
        activityType: [{ required: true, message: '活动类型不能为空', trigger: 'change' }],
        numOfParticipants: [{ required: true, message: '参加人数不能为空', trigger: 'blur' }],
        numOfOrganizations: [{ required: true, message: '组织人数不能为空', trigger: 'blur' }],
        activityTime: [{ required: true, message: '活动日期不能为空', trigger: 'blur' }],
        activityDuration: [{ required: true, message: '请输入活动时长', trigger: 'blur' }],
        participantsName: [{ required: true, message: '请选择参与人', trigger: 'blur' }],
      },
      //公司名称
      company: [],
      viewImgList: [],
      companyList: [],
      socialOrganizationList: [],
      socialOrganizationIdList: [],
      // mapDialog
      mapDialogVisible: false,
      // map经纬度
      propCenter: [120.130203, 30.259324],
      // map地址
      propAddress: '',
      //附件相关
      uploadImgUrl: process.env.VUE_APP_BASE_API + '/system/oss/upload', // 上传的图片服务器地址
      dialogVisible: false,
      dialogImageUrl: '',
      fileList: [],
      headers: {
        Authorization: 'Bearer ' + getToken(),
      },
    };
  },
  created() {
    this.getList();
    this.getCompanyList();
  },
  methods: {
    /** 查询党建引领活动列表 */
    getList() {
      this.loading = true;
      this.queryParams.beginTime = this.queryParams?.searchTime?.[0];
      this.queryParams.endTime = this.queryParams?.searchTime?.[1];
      listPartyActivities(this.queryParams).then((response) => {
        this.partyActivitiesList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    // 取消按钮
    cancel(key) {
      this[key] = false;
      this.fileList = [];
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
        activityTitle: undefined,
        divisionCode: undefined,
        divisionName: undefined,
        activityType: undefined,
        numOfParticipants: undefined,
        numOfOrganizations: undefined,
        activityTime: undefined,
        activityAddress: undefined,
        activityContent: undefined,
        fileList: undefined,
        activityMode: undefined,
      };
      this.socialOrganizationIdList = [];
      this.resetForm('form');
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
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
      this.title = '添加活动';
    },
    /** 修改按钮操作 */
    handleUpdate(row, key) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids;
      getPartyActivities(id).then((response) => {
        this.loading = false;
        this.form = response.data;
        this[key] = true;
        this.title = '修改活动';
        // this.getImgList();
        this.fileList = this.form.fileList;

        this.tableList = [];
        this.socialOrganizationIdList = this.form?.socialOrganizationId?.split(',');
        if (response.data.participateCompany) {
          response.data.participateCompany.split(',').forEach((e) => {
            this.tableList.push({ companyName: e });
          });
        }
      });
    },
    async getImgList() {
      if (this.form.fileList) {
        const { data } = await listByIds(this.form.fileList);
        this.viewImgList = data.map((item) => item.url);
      }
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          if (this.tableList.length) {
            this.form.participateCompany = this.tableList.map((e) => e.companyName).join(',');
          }
          if (this.form.id != null) {
            updatePartyActivities(this.form)
              .then((response) => {
                this.$modal.msgSuccess('修改成功');
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else {
            addPartyActivities(this.form)
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
    getCompanyList() {
      listJobCompany().then((res) => {
        this.companyList = res.rows;
      });
      listSocialOrganization().then((response) => {
        this.socialOrganizationList = response.rows;
      });
    },
    submitOmpany() {
      this.company.forEach((e) => {
        this.tableList.push({ companyName: e });
      });
      this.companyOpen = false;
      this.company = [];
    },
    cancelOmpany() {
      this.companyOpen = false;
      this.company = [];
    },
    companyDelete(row, index) {
      this.$modal
        .confirm('是否确认删除公司名称为"' + row.companyName + '"的数据项？')
        .then(() => {
          this.tableList.splice(index, 1);
        })
        .then(() => {})
        .catch(() => {})
        .finally(() => {});
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除活动编号为"' + ids + '"的数据项？')
        .then(() => {
          this.loading = true;
          return delPartyActivities(ids);
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
        'worship/partyActivities/export',
        {
          ...this.queryParams,
        },
        `partyActivities_${new Date().getTime()}.xlsx`
      );
    },
    changePeoPleSuccess(people, type) {
      let data = null;
      if (!Array.isArray(people)) {
        data = [people];
      } else {
        data = people;
      }

      // this.peopleList = data;
      const id = data.map((item) => item.id).join(',');
      const name = data.map((item) => item.name).join(',');
      this.$set(this.form, 'participantsPersonId', id);
      this.$set(this.form, 'participantsName', name);
      this.changePeoPleDialog = false;
    },
    handleOrgChange(val) {
      let names = [];
      this.form.socialOrganizationId = val.join(',');
      val.forEach((e) => {
        this.socialOrganizationList.forEach((f) => {
          f.id === e && names.push(f.organizationName);
        });
      });
      this.form.socialOrganizationName = names.join(',');
    },

    //地图相关
    // 打开地图
    openMap() {
      this.form.id ? (this.propCenter = [this.form.longitude || 120.130203, this.form.latitude || 30.259324]) : '';
      this.propAddress = this.form.location;
      this.mapDialogVisible = true;
    },
    // 点击地图保存回调
    saveMap(latLong, address) {
      let point = latLong.split(',');
      this.$set(this.form, 'activityAddress', address);
      this.$set(this.form, 'longitude', point[0]);
      this.$set(this.form, 'latitude', point[1]);
      this.$set(this.form, 'location', `${point[0]},${point[1]}`);

      this.propCenter = point;
      this.mapDialogVisible = false;
    },

    // 上传图片相关方法
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.form.fileList = fileList;
    },
    async handleUploadSuccess(res, file, fileList) {
      console.log(res, file, fileList);
      if (res.code === 200) {
        const ids = fileList.map((item) => {
          return item.ossId || item.response.data.ossId;
        });
        await listByIds(ids).then((res) => {
          let list = res.data;
          this.form.fileList = list.map((item) => {
            return {
              url: this.baseOss + item.ossId,
              name: item.originalName,
              ossId: item.ossId,
            };
          });
        });
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
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
  .search-right {
    // float: right;
    width: 14%;
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
.df {
  .time {
    width: 100px;
    margin: 0 0 0 6px;
  }
}
.line {
  height: 10px;
  background: #f6f6f6;
}
.row-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.info-title {
  font-size: 18px;
  font-weight: 600;
  color: #333333;
  margin-left: 10px;
}
.el-radio {
  margin-bottom: 12px;
}
</style>
