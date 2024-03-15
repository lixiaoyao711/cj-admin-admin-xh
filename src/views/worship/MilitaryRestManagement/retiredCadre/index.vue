<template>
  <div class="app-retiredCadre">
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
          @treeselectChange="(e) => treeselectChange(e, queryParams)"
        ></TreeSelectDivision>
      </el-form-item>
      <el-form-item label="" prop="divisionName"></el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="queryParams.sex" placeholder="请选择性别">
          <el-option
            v-for="dict in dict.type.sys_user_sex"
            :key="dict.value"
            :label="dict.label"
            :value="dict.label"
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
        <el-select v-model="queryParams.nation" placeholder="请选择民族" clearable>
          <el-option
            v-for="dict in dict.type.sys_worship_ethnicgroup"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
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
      <el-form-item label="抚恤类别" prop="retirePreferentialCategory">
        <el-select v-model="queryParams.retirePreferentialCategory" placeholder="请选择抚恤类别" clearable>
          <el-option
            v-for="dict in dict.type.sys_worship_tuiyijunrenyoufuleibie"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="优待证" prop="isTreatment">
        <el-select v-model="queryParams.isTreatment" placeholder="请选择优待证" clearable>
          <el-option v-for="dict in dict.type.sys_0_1" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="建档立卡" prop="whetherRegisterArchives">
        <el-select v-model="queryParams.whetherRegisterArchives" placeholder="请选择建档立卡" clearable>
          <el-option v-for="dict in dict.type.sys_0_1" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="老兵码" prop="veteranCode">
        <el-select v-model="queryParams.veteranCode" placeholder="请选择老兵码" clearable>
          <el-option v-for="dict in dict.type.sys_0_1" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="人员标签" prop="personnelTags">
        <el-select v-model="queryParams.personnelTags" placeholder="请选择人员标签" clearable>
          <el-option
            v-for="dict in dict.type.sys_worship_personneltag"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
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
        <div class="title-name">军休干部列表</div>
      </div>
      <el-table v-loading="loading" :data="basicPersonList" @selection-change="handleSelectionChange" height="45vh">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="姓名" align="center" prop="name" />
        <el-table-column label="身份证" align="center" prop="idCard" />
        <el-table-column label="性别" align="center" prop="sex" />
        <el-table-column label="年龄" align="center" prop="age" />
        <el-table-column label="联系方式" align="center" prop="phone" />
        <el-table-column label="行政区划" align="center" prop="divisionName" />
        <el-table-column label="户籍地" align="center" prop="registeredResidence" />
        <el-table-column label="老兵码" align="center" prop="veteranCode" >
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_0_1" :value="scope.row.veteranCode" />
          </template>
        </el-table-column>
        <el-table-column label="优待证" align="center" prop="isTreatment">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_0_1" :value="scope.row.isTreatment" />
          </template>
        </el-table-column>
        <el-table-column label="建档立卡" align="center" prop="whetherRegisterArchives">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_0_1" :value="scope.row.whetherRegisterArchives" />
          </template>
        </el-table-column>
        <el-table-column label="人员标签" align="center" prop="personnelTags" width="160">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_worship_personneltag" :value="scope.row.personnelTags" />
          </template>
        </el-table-column>
        <el-table-column label="最近更新时间" align="center" prop="updateTime" width="">
          <template #default="scope">
            <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="text">
              <router-link :to="'/worship/people-info/info/' + scope.row.id" class="link-type">
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

import AddOrUpdate from '@/views/worship/retiredSoldier/dialog/addOrUpdate';
import inputNumberRange from '@/views/worship/components/inputNumberRange';

export default {
  name: 'BasicPerson',
  components: { AddOrUpdate, inputNumberRange },
  dicts: [
    'sys_worship_householdeegistration',
    'sys_worship_personneltag',
    'sys_worship_facetype',
    'sys_worship_physicalcondition',
    'sys_worship_focustype',
    'sys_worship_educationlevel',
    'sys_worship_ethnicgroup',
    'sys_worship_maritalstatus',
    'sys_user_sex',
    'sys_yes_no',
    'sys_worship_tuiyijunrenyoufuleibie',
    'sys_worship_tuiyijunrenanzhileibie',
    'sys_worship_alltuiyijunrenanzhileibie',
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
      // 人员基本信息表格数据
      basicPersonList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        sex: undefined,
        age: undefined,
        divisionCode: undefined,
        politicalLandscape: undefined,
        culturalStatus: undefined,
        nation: undefined,
        maritalStatus: undefined,
        registeredResidenceType: undefined,
        personnelTags: undefined,
        attribute: 1,
        searchAge: undefined,
        personCategory: '1-1',
        keyWord: undefined,
      },
      // 表单参数
      form: {},
    };
  },
  computed: {},
  created() {
    this.getList();
  },
  methods: {
    /** 查询人员基本信息列表 */
    getList() {
      this.loading = true;
      this.queryParams.beginAge = this.queryParams.searchAge?.[0];
      this.queryParams.endAge = this.queryParams.searchAge?.[1];
      listBasicPerson(this.queryParams).then((response) => {
        this.basicPersonList = response.rows;
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
        sex: undefined,
        age: undefined,
        phone: undefined,
        divisionCode: undefined,
        divisionName: undefined,
        politicalLandscape: undefined,
        health: undefined,
        culturalStatus: undefined,
        birthday: undefined,
        nation: undefined,
        maritalStatus: undefined,
        registeredResidenceType: undefined,
        registeredResidenceUnit: undefined,
        registeredResidence: undefined,
        permanentResidence: undefined,
        workUnit: undefined,
        whetherAccompanyArmy: undefined,
        placementOrNot: undefined,
        whetherToFocusOnGroups: undefined,
        keyTypes: undefined,
        personnelTags: undefined,
        attribute: undefined,
        searchTime: [],
        attribute: 1,
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
  height: 535px;
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
