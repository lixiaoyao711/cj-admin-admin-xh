<template>
  <div class="app-container">
    <div class="header">现役军人家属</div>
    <el-form
      class="search-form"
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="行政区划" prop="divisionCode">
        <TreeSelectDivision
          v-model="queryParams.divisionCode"
          @treeselectChange="(e) => treeselectChange(e, queryParams, 'divisionCode')"
        ></TreeSelectDivision>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="queryParams.sex" placeholder="请选择性别" clearable>
          <el-option
            v-for="dict in dict.type.sys_user_sex"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="政治面貌" prop="politicalLandscape">
        <el-select v-model="queryParams.politicalLandscape" placeholder="请选择政治面貌" clearable>
          <el-option
            v-for="dict in dict.type.sys_worship_facetype"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="民族" prop="nation">
        <el-select v-model="queryParams.nation" placeholder="请选择" clearable>
          <el-option
            v-for="dict in dict.type.sys_worship_ethnicgroup"
            :key="dict.value"
            :label="dict.label"
            :value="dict.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="婚姻状况" prop="maritalStatus">
        <el-select v-model="queryParams.maritalStatus" placeholder="请选择婚姻状况" clearable>
          <el-option
            v-for="dict in dict.type.sys_worship_maritalstatus"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="文化程度" prop="culturalStatus">
        <el-select v-model="queryParams.culturalStatus" placeholder="请选择文化程度" clearable>
          <el-option
            v-for="dict in dict.type.sys_worship_educationlevel"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="户籍类别" prop="registeredResidenceType">
        <el-select v-model="queryParams.registeredResidenceType" placeholder="请选择户籍类别" clearable>
          <el-option
            v-for="dict in dict.type.sys_worship_householdeegistration"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否随军" prop="accompanyingStatus">
        <el-select v-model="queryParams.accompanyingStatus" placeholder="请选择" clearable>
          <el-option v-for="dict in dict.type.sys_0_1" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否安置" prop="placementStatus">
        <el-select v-model="queryParams.placementStatus" placeholder="请选择" clearable>
          <el-option v-for="dict in dict.type.sys_0_1" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="人员标签" prop="personnelTags">
        <el-select v-model="queryParams.personnelTags" placeholder="请选择人员标签" clearable>
          <el-option
            v-for="dict in peoPleTagList"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="年龄" prop="searchAge">
        <input-number-range v-model="queryParams.searchAge"></input-number-range>
      </el-form-item>
      <el-form-item label="搜索" prop="keyWord">
        <el-input v-model="queryParams.keyWord" placeholder="姓名、身份证号、联系方式" clearable />
      </el-form-item>
      <el-form-item class="search-right">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <div class="table">
      <div class="table-title-box">
        <div class="title-name">现役军人家属列表</div>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
          </el-col>

          <el-col :span="1.5">
            <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="info" plain icon="el-icon-upload2" size="mini" @click="handleImport">导入</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              size="mini"
              :disabled="multiple"
              @click="handleExport('worship/basicPerson/export', 1, '现役军人家属列表')"
              v-hasPermi="['worship:serviceMen:export']"
              >导出所选</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              size="mini"
              @click="handleExport('worship/basicPerson/export', 2, '现役军人家属列表')"
              v-hasPermi="['worship:serviceMen:export']"
              >导出列表</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              size="mini"
              @click="handleExport('worship/basicPerson/export', 3, '现役军人家属列表')"
              v-hasPermi="['worship:serviceMen:export']"
              >导出全部</el-button
            >
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </div>
      <el-table v-loading="loading" :data="serviceFamilyList" @selection-change="handleSelectionChange" height="50vh">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="姓名" align="center" prop="name" />
        <el-table-column label="身份证" align="center" prop="idCard" />
        <el-table-column label="性别" align="center" prop="sex" />
        <el-table-column label="年龄" align="center" prop="age" />
        <el-table-column label="联系方式" align="center" prop="phone" />
        <el-table-column label="行政区划" align="center" prop="divisionName" />
        <el-table-column label="政治面貌" align="center" prop="politicalLandscape">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_worship_facetype" :value="scope.row.politicalLandscape" />
          </template>
        </el-table-column>
        <el-table-column label="户籍地" align="center" prop="registeredResidence" />
        <el-table-column label="是否随军" align="center" prop="accompanyingStatus">
          <template slot-scope="scope">
            <div>{{ scope.row.accompanyingStatus === '1' ? '是' : '否' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="是否安置" align="center" prop="placementStatus">
          <template slot-scope="scope">
            <div>{{ scope.row.placementStatus === '1' ? '是' : '否' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="人员标签" align="center" prop="personnelTags" width="160">
          <template slot-scope="scope">
            <div v-if="scope.row.personnelTags">
              <div v-for="(item, index) in scope.row.personnelTags.split(',')" :key="index">
                {{ peoPleTagList.find((tag) => tag.dictValue === item).dictLabel }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="text">
              <router-link :to="'/worship/serviceFamily/info/' + scope.row.id" class="link-type">
                <el-button size="mini" type="text">详情</el-button>
              </router-link>
            </el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['worship:serviceFamily:edit']"
              >修改</el-button
            >
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.row)"
              v-hasPermi="['worship:serviceFamily:remove']"
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

    <!-- 添加或修改现役军人家属对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1080px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="form.name" placeholder="请输入姓名" /> </el-form-item
          ></el-col>
          <el-col :span="8">
            <el-form-item label="身份证" prop="idCard">
              <el-input v-model="form.idCard" placeholder="请输入身份证" /> </el-form-item
          ></el-col>
          <el-col :span="8">
            <el-form-item label="身份证签发机关" prop="">
              <el-input v-model="form.idCardIssuing" placeholder="请输入身份证签发机关" /> </el-form-item
          ></el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="身份证有效期" prop="searchTime">
              <el-date-picker
                v-if="form.longTerm !== '1'"
                clearable
                v-model="form.searchTime"
                type="daterange"
                value-format="yyyy-MM-dd"
                placeholder="请选择身份证有效期结束时间"
              >
              </el-date-picker>
              <el-date-picker
                v-else
                clearable
                v-model="form.idCardStartTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择身份证有效期结束时间"
              >
              </el-date-picker>
              <el-checkbox class="longTerm" false-label="0" true-label="1" v-model="form.longTerm">长期</el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系方式" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入手机号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="民族" prop="">
              <el-select v-model="form.nation" placeholder="请选择">
                <el-option
                  v-for="dict in dict.type.sys_worship_ethnicgroup"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.label"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="行政区划" prop="divisionCode">
              <TreeSelectDivision
                v-model="form.divisionCode"
                @treeselectChange="(e) => treeselectChange(e, form)"
              ></TreeSelectDivision>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="政治面貌" prop="">
              <el-select v-model="form.politicalLandscape" placeholder="请选择政治面貌">
                <el-option
                  v-for="dict in dict.type.sys_worship_facetype"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="婚姻状况" prop="">
              <el-select v-model="form.maritalStatus" placeholder="请选择婚姻状况">
                <el-option
                  v-for="dict in dict.type.sys_worship_maritalstatus"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select> </el-form-item
          ></el-col>
          <el-col :span="8">
            <el-form-item label="健康状况" prop="">
              <el-select v-model="form.health" placeholder="请选择健康状况">
                <el-option
                  v-for="dict in dict.type.sys_worship_physicalcondition"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.label"
                ></el-option>
              </el-select> </el-form-item
          ></el-col>
          <el-col :span="8">
            <el-form-item label="文化程度" prop="culturalStatus">
              <el-select v-model="form.culturalStatus" placeholder="请选择文化程度">
                <el-option
                  v-for="dict in dict.type.sys_worship_educationlevel"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="户籍类别" prop="registeredResidenceType">
              <el-select v-model="form.registeredResidenceType" placeholder="请选择户籍类别">
                <el-option
                  v-for="dict in dict.type.sys_worship_householdeegistration"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select> </el-form-item
          ></el-col>
          <el-col :span="8">
            <el-form-item label="户籍管理单位" prop="registeredResidenceUnitCode">
              <TreeSelectDivision
                v-model="form.registeredResidenceUnitCode"
                @treeselectChange="
                  (e) => treeselectChange(e, form, 'registeredResidenceUnit', 'registeredResidenceUnitCode')
                "
              ></TreeSelectDivision>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="户籍地" prop="registeredResidence">
              <!-- <el-input v-model="form.registeredResidence" placeholder="请输入户籍地" />  -->
              <el-cascader
                v-model="registeredResidence"
                clearable
                ref="registeredResidence"
                :props="customProps"
                @change="handleChange('registeredResidence')"
                :options="mapList"
                :placeholder="form.registeredResidenceCode ? '请选择' : form.registeredResidence"
              ></el-cascader> </el-form-item
          ></el-col>
          <el-col :span="16">
            <el-form-item label="户籍地详细地址" prop="">
              <el-input v-model="form.registeredResidenceAddress" placeholder="请输入内容" /> </el-form-item
          ></el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="常住地" prop="permanentResidence">
              <el-cascader
                v-model="permanentResidence"
                clearable
                ref="permanentResidence"
                :props="customProps"
                @change="handleChange('permanentResidence')"
                :options="mapList"
                :placeholder="form.permanentResidenceCode ? '请选择' : form.permanentResidence"
              ></el-cascader> </el-form-item
          ></el-col>
          <el-col :span="16">
            <el-form-item label="常住地详细地址" prop="">
              <el-input v-model="form.permanentResidenceAddress" placeholder="请输入内容" /> </el-form-item
          ></el-col>
        </el-row>
        <el-form-item label="人员标签" prop="">
          <el-select multiple v-model="personTagsList" placeholder="请选择人员标签">
            <el-option
              v-for="dict in peoPleTagList"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item label="是否关注重点群体" prop="whetherToFocusOnGroups">
              <el-select v-model="form.whetherToFocusOnGroups" placeholder="请选择" clearable>
                <el-option
                  v-for="dict in dict.type.sys_0_1"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="重点类型" prop="keyTypes" v-if="form.whetherToFocusOnGroups === '1'">
              <el-select v-model="form.keyTypes" placeholder="请选择重点群体类型">
                <el-option
                  v-for="dict in dict.type.sys_worship_focustype"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select> </el-form-item
          ></el-col>
          <el-col :span="8">
            <el-form-item label="是否随军" prop="accompanyingStatus">
              <el-select v-model="form.accompanyingStatus" placeholder="请选择" clearable>
                <el-option
                  v-for="dict in dict.type.sys_0_1"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="是否安置" prop="placementStatus">
              <el-select v-model="form.placementStatus" placeholder="请选择" clearable>
                <el-option
                  v-for="dict in dict.type.sys_0_1"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="form.placementStatus === '1'">
            <el-form-item label="安置地" prop="placementResidence">
              <el-cascader
                v-model="placementResidence"
                clearable
                ref="placementResidence"
                :props="customProps"
                @change="handleChange('placementResidence')"
                :options="mapList"
                placeholder="请选择"
              ></el-cascader> </el-form-item
          ></el-col>
          <el-col :span="8" v-if="form.placementStatus === '1'">
            <el-form-item label="" prop="" label-width="20px">
              <el-input v-model="form.placementResidenceAddress" placeholder="请输入内容" /> </el-form-item
          ></el-col>
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
  </div>
</template>

<script>
import {
  listBasicPerson,
  getBasicPerson,
  delBasicPerson,
  addBasicPerson,
  updateBasicPerson,
} from '@/api/worship/retiredSoldier';
import { getToken } from '@/utils/auth';
import { testIdentity, checkPhone } from '@/utils/regular';
import inputNumberRange from '@/views/worship/components/inputNumberRange';

export default {
  name: 'ServiceFamily',
  components: {
    inputNumberRange,
  },
  dicts: [
    'sys_worship_householdeegistration',
    'sys_worship_personneltag',
    'sys_worship_facetype',
    'sys_user_sex',
    'sys_yes_no',
    'sys_worship_physicalcondition',
    'sys_worship_focustype',
    'sys_worship_educationlevel',
    'sys_worship_maritalstatus',
    'sys_worship_ethnicgroup',
    'sys_0_1',
  ],
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
      // 现役军人家属表格数据
      serviceFamilyList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        nation: undefined,
        divisionCode: undefined,
        politicalLandscape: undefined,
        maritalStatus: undefined,
        educationLevel: undefined,
        registeredType: undefined,
        personTags: undefined,
        accompanyingStatus: undefined,
        placementStatus: undefined,
        serviceMenId: undefined,
        age: undefined,
        personnelTags: undefined,
        keyWord: undefined,
        searchAge: undefined,
        attribute: 3,
      },
      // 表单参数
      form: {},
      longTermTag: false,
      datePickerOptions: {
        shortcuts: [
          {
            text: '5年',
            onClick(picker) {
              console.log(picker);
              const start = picker.minDate ? picker.minDate : new Date();
              const end = new Date();
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 365 * 5);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '10年',
            onClick(picker) {
              console.log(picker);
              const end = new Date();
              const start = picker.minDate ? picker.minDate : new Date();
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 365 * 10);
              console.log([start, end]);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '20年',
            onClick(picker) {
              console.log(picker);
              const end = new Date();
              const start = picker.minDate ? picker.minDate : new Date();
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 365 * 20);
              picker.$emit('pick', [start, end]);
            },
          },
        ],
      },
      permanentResidence: [],
      registeredResidence: [],
      placementResidence: [],
      personTagsList: [],
      // 表单校验
      rules: {
        id: [{ required: true, message: '主键不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        idCard: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('身份证不能为空'));
              } else if (!testIdentity(value)) {
                callback(new Error('请输入正确的身份证'));
              } else {
                callback();
              }
            },
          },
        ],
        idCardIssuing: [{ required: true, message: '身份证签发机关不能为空', trigger: 'blur' }],
        idCardStartTime: [{ required: true, message: '身份证有效期开始时间不能为空', trigger: 'blur' }],
        idCardEndTime: [{ required: true, message: '身份证有效期结束时间不能为空', trigger: 'blur' }],
        phone: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('手机号不能为空'));
              } else if (!checkPhone(value)) {
                callback(new Error('请输入正确的手机号'));
              } else {
                callback();
              }
            },
          },
        ],
        nation: [{ required: true, message: '民族不能为空', trigger: 'blur' }],
        divisionName: [{ required: true, message: '行政区划名称不能为空', trigger: 'blur' }],
        divisionCode: [{ required: true, message: '行政区划代码不能为空', trigger: 'blur' }],
        politicalLandscape: [{ required: true, message: '政治面貌不能为空', trigger: 'change' }],
        maritalStatus: [{ required: true, message: '婚姻状况不能为空', trigger: 'change' }],
        healthCondition: [{ required: true, message: '健康状况不能为空', trigger: 'change' }],
        educationLevel: [{ required: true, message: '文化程度不能为空', trigger: 'change' }],
        registeredResidenceType: [{ required: true, message: '户籍类别不能为空', trigger: 'change' }],
        registeredResidenceUnitCode: [{ required: true, message: '户籍管理单位不能为空', trigger: 'blur' }],
        registeredResidence: [{ required: true, message: '户籍地不能为空', trigger: 'blur' }],
        registeredResidenceAddress: [{ required: true, message: '户籍地详细地址不能为空', trigger: 'blur' }],
        permanentResidence: [{ required: true, message: '常住地不能为空', trigger: 'blur' }],
        permanentResidenceAddress: [{ required: true, message: '常住地详细地址不能为空', trigger: 'blur' }],
        personnelTags: [{ required: true, message: '人员标签不能为空', trigger: 'change' }],
        whetherToFocusOnGroups: [{ required: true, message: '是否重点群体不能为空', trigger: 'change' }],
        keyTypes: [{ required: true, message: '重点群体类型不能为空', trigger: 'change' }],
        accompanyingStatus: [{ required: true, message: '是否随军不能为空', trigger: 'change' }],
        placementStatus: [{ required: true, message: '是否安置不能为空', trigger: 'change' }],
        serviceMenId: [{ required: true, message: '关联现役军人id不能为空', trigger: 'blur' }],
        placementResidence: [{ required: true, message: '安置地不能为空', trigger: 'blur' }],
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
    };
  },
  computed: {
    mapList() {
      return this.$store.getters.mapList;
    },
    peoPleTagList() {
      return this.$store.state.user.peoPleTagList;
    },
    userInfo() {
      return this.$store.state.user;
    },
  },
  watch: {
    form(nv, ov) {
      console.log(nv);
    },
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询现役军人家属列表 */
    getList() {
      this.loading = true;
      this.queryParams.beginAge = this.queryParams.searchAge?.[0];
      this.queryParams.endAge = this.queryParams.searchAge?.[1];
      listBasicPerson(this.queryParams).then((response) => {
        this.serviceFamilyList = response.rows;
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
        name: undefined,
        idCard: undefined,
        idCardIssuing: undefined,
        idCardStartTime: undefined,
        idCardEndTime: undefined,
        phone: undefined,
        nation: undefined,
        divisionName: undefined,
        divisionCode: undefined,
        politicalLandscape: undefined,
        maritalStatus: undefined,
        healthCondition: undefined,
        educationLevel: undefined,
        registeredType: undefined,
        registeredUnit: undefined,
        registeredResidence: undefined,
        registeredResidenceAddress: undefined,
        permanentResidence: undefined,
        permanentResidenceAddress: undefined,
        personTags: undefined,
        whetherToFocusOnGroups: undefined,
        keyTypes: undefined,
        accompanyingStatus: undefined,
        placementStatus: undefined,
        serviceMenId: undefined,
        placementResidence: undefined,
        searchTime: [],
        longTerm: '0',
        attribute: '3',
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
    handleAdd() {
      // this.reset();
      this.$set(this.form, 'whetherToFocusOnGroups', '0');
      this.open = true;
      this.title = '添加现役军人家属';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids;
      this.registeredResidence = row.registeredResidenceCode ? row?.registeredResidenceCode?.split(',') : [];
      this.permanentResidence = row.permanentResidenceCode ? row?.permanentResidenceCode?.split(',') : [];
      this.placementResidence = row.placementResidenceCode ? row?.placementResidenceCode?.split(',') : [];
      this.personTagsList = row.personnelTags ? row.personnelTags.split(',') : [];
      getBasicPerson(id).then((response) => {
        let data = response.data;
        this.loading = false;
        this.form = response.data;
        if (this.form.idCardStartTime && this.form.idCardEndTime) {
          this.form.searchTime = [this.form.idCardStartTime, this.form.idCardEndTime];
        }
        this.open = true;
        this.title = '修改现役军人家属';
      });
    },

    handleChange(value) {
      let data = this.$refs[value]?.getCheckedNodes();
      this.form[`${value}Code`] = this[value].join(',');
      this.form[value] = data[0].pathLabels.join(',');
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          this.form.attribute = 3; //属性 1:退役军人 2:其他优抚对象 3:现役军人家属
          if (this.form.longTerm !== '1') {
            this.form.idCardStartTime = this.form?.searchTime?.[0] || null;
            this.form.idCardEndTime = this.form?.searchTime?.[1] || null;
          }
          this.form.personnelTags = this.personTagsList.join(',');
          if (this.form.id != null) {
            updateBasicPerson(this.form)
              .then((response) => {
                this.$modal.msgSuccess('修改成功');
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else {
            addBasicPerson(this.form)
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
      const name = row.name ?? this.filterDelData(this.ids, this.serviceFamilyList, 'name');

      this.$modal
        .confirm('是否确认删除现役军人家属姓名为"' + name + '"的数据项？')
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
        };
      }
      this.download(path, params, `${name}_${new Date().getTime()}.xlsx`);
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
::v-deep .el-cascader .el-input__inner::placeholder {
  color: #000; // 你想要的颜色
}
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
  height: 590px;

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

.longTerm {
  margin: 0 0 0 16px;
}
</style>
