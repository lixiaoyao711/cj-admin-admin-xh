<template>
  <div class="notVisited">
    <div class="tabs">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="(item, index) in tabs" :key="index" :label="item.name" :name="item.value"></el-tab-pane>
      </el-tabs>
    </div>
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
        <el-form-item label="行政区划" prop="divisionCode">
          <TreeSelectDivision
            v-model="queryParams.divisionCode"
            @treeselectChange="(e) => treeselectChange(e, queryParams, 'divisionCode')"
          ></TreeSelectDivision>
        </el-form-item>
        <el-form-item label="走访日期" prop="searchTime" v-if="activeName < 4">
          <el-date-picker
            :key="activeName"
            clearable
            v-model="queryParams.searchTime"
            type="daterange"
            placeholder="请选择"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="超时日期" prop="searchEndTime" v-else>
          <el-date-picker
            :key="activeName"
            clearable
            v-model="queryParams.searchEndTime"
            type="daterange"
            placeholder="请选择"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="安置类别" prop="personCategory" v-if="activeName != 2">
          <el-cascader v-model="personCategoryList" :options="anzhiType"> </el-cascader>
        </el-form-item>
        <el-form-item label="抚恤类别" prop="retirePreferentialCategory" v-else>
          <el-select v-model="queryParams.retirePreferentialCategory" placeholder="请选择抚恤类别" clearable>
            <el-option
              v-for="dict in dict.type.sys_worship_tuiyijunrenyoufuleibie"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item v-else label="人员类别" prop="retirePersonCategory">
          <el-cascader v-model="personCategoryList" :options="anzhiType"> </el-cascader>
        </el-form-item> -->
        <el-form-item label="人员标签" prop="personTags" v-if="activeName === '7'">
          <el-select v-model="queryParams.personTags" placeholder="请选择人员标签" clearable>
            <el-option
              v-for="dict in peoPleTagList"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="人员标签" prop="personnelTags" v-else>
          <el-select v-model="queryParams.personnelTags" placeholder="请选择人员标签" clearable>
            <el-option
              v-for="dict in peoPleTagList"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="搜索" prop="keyWord">
          <el-input
            v-model="queryParams.keyWord"
            placeholder="输入姓名身份证号联系方式"
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
        <div class="title-name">
          未走访人员列表
          <!-- <el-button size="mini" type="info">若无数据请先选择走访区间</el-button> -->
          <span><el-alert title="若无数据请先选择走访日期" type="info" :closable="false"></el-alert></span>
        </div>
        <el-row :gutter="10" class="mb8" v-if="activeName < 4">
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              :disabled="multiple"
              @click="handleExport('/worship/basicPerson/exportUnvisitedData', 1, '未走访人员列表')"
              >导出所选</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="handleExport('/worship/basicPerson/exportUnvisitedData', 2, '未走访人员列表')"
              >导出列表</el-button
            >
          </el-col>

          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
        <el-row :gutter="10" class="mb8" v-else>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              :disabled="multiple"
              @click="handleExport('/worship/visitingOvertimeLog/export', 1, '未走访人员列表')"
              >导出所选</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="handleExport('/worship/visitingOvertimeLog/export', 2, '未走访人员列表')"
              >导出列表</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="handleExport('/worship/visitingOvertimeLog/export', 3, '未走访人员列表')"
              >导出全部</el-button
            >
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </div>

      <el-table v-loading="loading" :data="visitingList" @selection-change="handleSelectionChange" height="82%">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="行政区划" align="center" prop="divisionName" />
        <el-table-column label="姓名" align="center" prop="name" />
        <el-table-column label="性别" align="center" prop="sex" />
        <el-table-column label="年龄" align="center" prop="age" />
        <el-table-column label="安置类别" align="center" prop="personCategory" v-if="activeName != 2">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_worship_tuiyijunrenanzhileibie" :value="scope.row.personCategory" />
          </template>
        </el-table-column>
        <el-table-column label="抚恤类别" align="center" prop="personCategory" v-else>
          <template slot-scope="scope">
            <dict-tag
              :options="dict.type.sys_worship_tuiyijunrenyoufuleibie"
              :value="scope.row.retirePreferentialCategory"
            />
          </template>
        </el-table-column>

        <el-table-column v-if="activeName === '7'" label="困难类型" align="center" prop="difficultType">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_worship_difficultytype" :value="scope.row.difficultType" />
          </template>
        </el-table-column>
        <el-table-column
          v-if="['1', '2', '3'].indexOf(activeName) > -1"
          label="家庭住址"
          align="center"
          prop="permanentResidenceAddress"
        />
        <el-table-column v-else label="家庭住址" align="center" prop="registeredResidence" />

        <el-table-column label="人员标签" align="center" prop="personnelTags" width="160">
          <!-- <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_worship_personneltag" :value="scope.row.personnelTags" />
          </template> -->
          <template slot-scope="scope">
            <div v-if="scope.row.personnelTags">
              <div v-for="(item, index) in scope.row.personnelTags.split(',')" :key="index">
                {{ peoPleTagList.find((tag) => tag.dictValue === item).dictLabel }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="上次走访日期" align="center" prop="visitingLastTime" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.visitingLastTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="['4', '5', '6', '7'].indexOf(activeName) > -1"
          label="超时日期"
          align="center"
          prop="visitingOverTime"
          width="180"
        >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.visitingOverTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="['1', '2', '3'].indexOf(activeName) > -1"
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button type="text">
              <router-link :to="tabs[Number(activeName) - 1].detailLink + scope.row.id" class="link-type">
                <el-button size="mini" type="text">详情</el-button>
              </router-link>
            </el-button>
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

    <!-- 添加或修改走访信息标（走访慰问、困难走访、三色走访）对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="走访类型" prop="visitType">
          <el-radio-group v-model="form.visitType">
            <el-radio v-for="dict in dict.type.sys_worship_visittype" :key="dict.value" :label="parseInt(dict.value)">{{
              dict.label
            }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 走访类型为三色走访人员的时候，显示的表单 -->
        <div v-if="form.visitType === 4">
          <el-row>
            <el-col :span="12">
              <el-form-item label="被走访人" prop="personId">
                <el-input v-model="form.personId" placeholder="请输入被走访" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="行政区划" prop="divisionCode">
                <TreeSelectDivision
                  v-model="form.divisionCode"
                  @treeselectChange="(e) => treeselectChange(e, form)"
                ></TreeSelectDivision>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="走访地址" prop="address">
            <el-input v-model="form.address" placeholder="请输入走访地址" />
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="走访人" prop="visitPersonName">
                <el-input v-model="form.visitPersonName" placeholder="请输入走访人" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="走访人联系方式" prop="visitPersonPhone" label-width="130px">
                <el-input v-model="form.visitPersonPhone" placeholder="请输入走访人联系方式" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="走访方式" prop="visitMethod">
                <el-select v-model="form.visitMethod" placeholder="请选择走访方式">
                  <el-option
                    v-for="dict in dict.type.sys_worship_visitingmethods"
                    :key="dict.value"
                    :label="dict.label"
                    :value="parseInt(dict.value)"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="走访日期" prop="visitTime">
                <el-date-picker
                  clearable
                  v-model="form.visitTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="请选择走访日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="走访内容" prop="content">
            <el-input v-model="form.content" type="textarea" placeholder="请输入内容" />
          </el-form-item>
          <el-form-item label="走访反馈" prop="feedback">
            <el-input v-model="form.feedback" type="textarea" placeholder="请输入内容" />
          </el-form-item>

          <el-form-item label="走访照片" prop="fileUrl">
            <image-upload v-model="form.fileUrl" />
          </el-form-item>
        </div>
        <!-- 走访类型为三色走访人员之外的时候，显示的表单 -->
        <div v-else>
          <el-row>
            <el-col :span="12">
              <el-form-item label="被帮扶人" prop="personId">
                <el-input v-model="form.personId" placeholder="请输入被帮扶人" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="行政区划" prop="divisionCode">
                <TreeSelectDivision
                  v-model="form.divisionCode"
                  @treeselectChange="(e) => treeselectChange(e, form)"
                ></TreeSelectDivision>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="走访地址" prop="address">
            <el-input v-model="form.address" placeholder="请输入走访地址" />
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="帮扶人" prop="visitPersonName">
                <el-input v-model="form.visitPersonName" placeholder="请输入帮扶人姓名" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="帮扶人电话" prop="personPhone" label-width="130px">
                <el-input v-model="form.visitPersonPhone" placeholder="请输入帮扶人电话" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="走访方式" prop="visitMethod">
                <el-select v-model="form.visitMethod" placeholder="请选择走访方式">
                  <el-option
                    v-for="dict in dict.type.sys_worship_visitingmethods"
                    :key="dict.value"
                    :label="dict.label"
                    :value="parseInt(dict.value)"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="走访日期" prop="visitTime">
                <el-date-picker
                  clearable
                  v-model="form.visitTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="请选择走访日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="困难原因" prop="difficultReason">
            <el-input v-model="form.difficultReason" type="textarea" placeholder="请输入内容" />
          </el-form-item>

          <el-form-item label="帮扶措施" prop="">
            <el-checkbox-group v-model="form.helpMethod">
              <el-checkbox
                v-for="dict in dict.type.sys_worship_assistancemeasures"
                :key="dict.value"
                :label="dict.value"
              >
                {{ dict.label }}</el-checkbox
              >
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="帮扶内容" prop="content">
            <el-input v-model="form.content" type="textarea" placeholder="请输入内容" />
          </el-form-item>
          <el-form-item label="帮扶反馈" prop="feedback">
            <el-input v-model="form.feedback" type="textarea" placeholder="请输入内容" />
          </el-form-item>

          <el-form-item label="走访照片" prop="fileUrl">
            <image-upload v-model="form.fileUrl" />
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel('open')">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 详情对话框 -->
    <el-dialog class="info" title="走访详情" :visible.sync="infoOpen" width="800px" append-to-body>
      <el-row>
        <el-col :span="12">
          <span> 被走访:</span>
          <span>{{ form.personName }}</span>
        </el-col>
        <el-col :span="12">
          <span> 行政区划:</span>
          <span>{{ form.divisionName }}</span></el-col
        >
      </el-row>
      <el-row>
        <el-col :span="12">
          <span> 走访人:</span>
          <span>{{ form.visitPersonName }}</span>
        </el-col>
        <el-col :span="12">
          <span> 走访人联系方式:</span>
          <span>{{ form.visitPersonPhone }}</span></el-col
        >
      </el-row>
      <el-row>
        <el-col :span="12">
          <span> 走访方式:</span>
          <dict-tag :options="dict.type.sys_worship_visitingmethods" :value="form.visitMethod" />
        </el-col>
        <el-col :span="12">
          <span> 走访日期:</span>
          <span>{{ parseTime(form.visitTime, '{y}-{m}-{d}') }}</span>
        </el-col>
      </el-row>
      <el-row>
        <span> 走访地址:</span>
        <span>{{ form.address }}</span>
      </el-row>
      <el-row>
        <span> 走访内容:</span>
        <span>{{ form.content }}</span>
      </el-row>
      <el-row>
        <span> 走访反馈:</span>
        <span>{{ form.feedback }}</span>
      </el-row>
      <el-row>
        <span> 附件:</span>
        <el-image
          v-for="(item, index) in viewImgList"
          :key="index"
          style="width: 100px; height: 100px"
          :src="viewImgList[index]"
          :preview-src-list="viewImgList"
        >
        </el-image>
      </el-row>
      <el-row>
        <span> 走访满意度:</span>
        <el-rate disabled v-model="form.satisfactionStr" show-text> </el-rate>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('infoOpen')">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 退役军人及其他优抚对象弹窗 -->
    <RetiredSoldier
      :open="openSolider"
      :title="title"
      :formData="form"
      @cancel="openSolider = false"
      @success="success"
    />
    <!-- 现役军人家属弹窗 -->
    <ServiceFamily :open="openFamily" :title="title" :formData="form" @cancel="openFamily = false" @success="success" />
  </div>
</template>

<script>
import { listVisitingOvertimeLog } from '@/api/worship/visiting';
import RetiredSoldier from '@/views/worship/retiredSoldier/dialog/addOrUpdate';
import ServiceFamily from '@/views/worship/serviceFamily/dialog/addOrUpdate';
import { timeFormat } from '@/utils/common';
import { listBasicPerson, getBasicPerson, delBasicPerson } from '@/api/worship/basicPerson.js';
export default {
  name: 'Visiting',
  components: {
    RetiredSoldier,
    ServiceFamily,
  },
  dicts: [
    'sys_worship_visittype',
    'sys_worship_visitingmethods',
    'sys_worship_assistancemeasures',
    'sys_worship_personneltype',
    'sys_worship_personneltag',
    'sys_user_sex',
    'sys_worship_difficultytype',
    'sys_worship_tuiyijunrenanzhileibie',
    'sys_worship_tuiyijunrenyoufuleibie',
  ],
  data() {
    return {
      // 按钮loading
      buttonLoading: false,
      // 遮罩层
      loading: false,
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
      // 走访信息标（走访慰问、困难走访、三色走访）表格数据
      visitingList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      infoOpen: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        divisionCode: undefined,
        retirePersonCategory: undefined,
        visitingBeginTime: undefined,
        visitingEndTime: undefined,
        personTags: undefined,
        keyWord: undefined,
        retirePreferentialCategory: undefined,
        outsideArea: 0,
        searchTime: [],
        searchEndTime: [],
        attribute: null,
        logType: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        id: [{ required: true, message: '主键不能为空', trigger: 'blur' }],
        divisionCode: [{ required: true, message: '行政区划代码不能为空', trigger: 'blur' }],
        personId: [{ required: true, message: '被帮扶人不能为空', trigger: 'blur' }],
        visitType: [{ required: true, message: '走访类型不能为空', trigger: 'change' }],
        personName: [{ required: true, message: '被帮扶人名称不能为空', trigger: 'blur' }],
        visitPersonName: [{ required: true, message: '走访人姓名不能为空', trigger: 'blur' }],
        visitPersonPhone: [{ required: true, message: '走访人联系方式不能为空', trigger: 'blur' }],
        visitMethod: [{ required: true, message: '走访方式不能为空', trigger: 'change' }],
        visitTime: [{ required: true, message: '走访日期不能为空', trigger: 'blur' }],
        content: [{ required: true, message: '走访内容不能为空', trigger: 'blur' }],
      },
      activeName: '1',
      checkList: [],
      viewImgList: [],
      personCategoryList: [],
      openSolider: false,
      openFamily: false,
      tabs: [
        {
          name: '退役军人',
          value: '1',
          detailLink: '/worship/people-info/info/',
        },
        {
          name: '其他优抚对象',
          value: '2',
          detailLink: '/worship/people-info/info/',
        },
        {
          name: '现役军人家属',
          value: '3',
          detailLink: '/worship/serviceFamily/info/',
        },
        {
          name: '活跃人员',
          value: '4',
        },
        {
          name: '稳定人员',
          value: '5',
        },
        {
          name: '化解人员',
          value: '6',
        },
        {
          name: '困难人员',
          value: '7',
        },
      ],
    };
  },
  computed: {
    anzhiType() {
      return this.$store.getters.anzhiTypeDict;
    },
    peoPleTagList() {
      return this.$store.state.user.peoPleTagList;
    },
    userInfo() {
      return this.$store.state.user;
    },
  },
  created() {
    this.queryParams.searchTime = [new Date(new Date().getFullYear() + '-01-01').getTime(), new Date().getTime()];

    this.getList();
  },
  methods: {
    getList() {
      if (!this.queryParams.searchTime.length) {
        this.$modal.msgWarning('请选择走访日期');
        return;
      }
      this.loading = true;

      this.queryParams.personCategory = this.personCategoryList?.[1];
      let url = null;
      if (this.activeName < 4) {
        this.queryParams.visitingBeginTime = this.parseTime(this.queryParams.searchTime?.[0], '{y}-{m}-{d}') || '';
        this.queryParams.visitingEndTime = this.parseTime(this.queryParams.searchTime?.[1], '{y}-{m}-{d}') || '';
        this.queryParams['attribute'] = this.activeName;
        this.queryParams['logType'] = null;
        url = listBasicPerson(this.queryParams);
      } else {
        this.queryParams.beginTime = this.parseTime(this.queryParams.searchEndTime?.[0], '{y}-{m}-{d}') || '';
        this.queryParams.endTime = this.parseTime(this.queryParams.searchEndTime?.[1], '{y}-{m}-{d}') || '';
        this.queryParams['logType'] = Number(this.activeName) - 3;
        this.queryParams['attribute'] = null;
        url = listVisitingOvertimeLog(this.queryParams);
      }
      url.then((response) => {
        this.visitingList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel(key) {
      this[key] = false;
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
        personId: undefined,
        visitType: undefined,
        personName: undefined,
        visitPersonName: undefined,
        address: undefined,
        visitPersonPhone: undefined,
        visitMethod: undefined,
        visitTime: undefined,
        content: undefined,
        feedback: undefined,
        difficultReason: undefined,
        helpMethod: [],
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
      this.personCategoryList = [];
      this.resetForm('queryForm');
      this.queryParams.searchTime = [new Date(new Date().getFullYear() + '-01-01').getTime(), new Date().getTime()];
      this.queryParams.searchEndTime = [];
      this.visitingList = [];
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
      this.title = '添加走访信息';
    },
    /** 修改按钮操作 */
    handleUpdate(row, key) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids;
      getBasicPerson(id).then((response) => {
        this.loading = false;
        this.activeName === '1' ? (this.openFamily = true) : (this.openSolider = true);
        this.form = response.data;
        this.title = '修改';
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          let helpMethod = this.form.helpMethod.join(',');
          if (this.form.id != null) {
            updateVisiting({ ...this.form, helpMethod })
              .then((response) => {
                this.$modal.msgSuccess('修改成功');
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else {
            addVisiting({ ...this.form, helpMethod })
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
        .confirm('是否确认删除编号为"' + ids + '"的数据项？')
        .then(() => {
          this.loading = true;
          return delBasicPerson(ids);
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
    handleExport(path, type, name) {
      let params = {};
      if (type === 1) {
        params = {
          ids: this.ids.join(','),
          attribute: this.queryParams.attribute,
          logType: this.queryParams.logType,
        };
      }
      if (type === 2) {
        params = {
          ...this.queryParams,
          divisionCode: this.queryParams.divisionCode || this.userInfo.divisionCode,
        };
      }
      if (type === 3) {
        params = {
          divisionCode: this.userInfo.divisionCode,
          attribute: this.queryParams.attribute,
          logType: this.queryParams.logType,
        };
      }
      this.download(path, params, `${name}_${new Date().getTime()}.xlsx`);
    },
    success() {
      this.openSolider = this.openFamily = false;
      this.getList();
    },
    handleClick() {
      // this.queryParams.pageNum = 1;
      this.resetQuery();
      // this.getList();
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
  // justify-content: space-between;
  // flex-wrap: wrap;
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
  height: 530px;
  .table-title-box {
    display: flex;
    justify-content: space-between;
    .title-name {
      font-family: PingFangSC-Medium;
      font-weight: 600;
      font-size: 18px;
      color: #333333;
      display: flex;
      align-items: center;
      .el-alert {
        height: 25px;
        margin-left: 12px;
      }
    }
  }
}
.el-icon-location-information {
  font-size: 24px;
  margin: 5px 0 0 18px;
  cursor: pointer;
}
.tabs {
  display: flex;
  line-height: 40px;
  .draft {
    background: url('~@/assets/images/draft.png');
    width: 102px;
    height: 40px;
    cursor: pointer;
  }
  .el-tabs {
    margin: 0 20px 0 0;
  }
}
::v-deep .el-tabs__nav-wrap::after {
  height: 0px !important;
}
.info {
  .el-row {
    margin: 20px 0 0 0;
    display: flex;
    .el-col {
      display: flex;
      span {
        margin: 0 16px 0 0;
      }
    }
  }
  .el-image {
    margin: 0 16px 0 16px;
  }
}
</style>
