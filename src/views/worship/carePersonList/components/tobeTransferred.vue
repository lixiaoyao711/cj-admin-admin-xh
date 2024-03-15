<template>
  <div class="tobeTransferred">
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
      <el-form-item label="困难类型：" prop="verifyTypeDifficulty">
        <el-select v-model="queryParams.verifyTypeDifficulty" placeholder="请选择" clearable>
          <el-option
            v-for="dict in dict.type.sys_worship_difficultytype"
            :key="dict.value"
            :label="dict.label"
            :value="dict.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="转出类型：" prop="transferType">
        <el-select v-model="queryParams.transferType" placeholder="请选择" clearable>
          <el-option
            v-for="dict in dict.type.sys_worship_transferout"
            :key="dict.value"
            :label="dict.label"
            :value="dict.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item class="search-right">
        <el-form-item label="" prop="searchValue">
          <el-input
            v-model="queryParams.searchValue"
            placeholder="输入关键字搜索"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="table">
      <div class="table-title-box">
        <div class="title-name">待转出</div>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              size="mini"
              @click="handleVerify"
              :disabled="multiple"
              v-hasPermi="['worship:tobeTransferred:verify']"
              >批量同意</el-button
            >
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </div>
      <el-table v-loading="loading" :data="tobeTransferredList" @selection-change="handleSelectionChange" height="85%">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="姓名" align="center" prop="name" width="100">
          <template slot-scope="scope">{{ scope.row.personInfo.name }}</template>
        </el-table-column>
        <el-table-column label="性别" align="center" prop="sex" width="80">
          <template slot-scope="scope">{{ scope.row.personInfo.sex }}</template>
        </el-table-column>
        <el-table-column label="联系方式" align="center" prop="phone" width="120">
          <template slot-scope="scope">{{ scope.row.personInfo.phone }}</template>
        </el-table-column>
        <el-table-column label="行政区划" align="center" prop="divisionName">
          <template slot-scope="scope">{{ scope.row.personInfo.divisionName }}</template>
        </el-table-column>
        <el-table-column label="困难类型" align="center" prop="verifyTypeDifficulty">
          <template slot-scope="scope">{{
            scope.row.difficultInfo.verifyTypeDifficulty === 'null'
              ? '无'
              : scope.row.difficultInfo.verifyTypeDifficulty
          }}</template>
        </el-table-column>
        <el-table-column label="转出类型" align="center" prop="transferType" width="100" />
        <el-table-column label="转出时间" align="center" prop="transferTime" width="120">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.transferTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="核实人员" align="center" prop="verifyPerson" width="100" />
        <el-table-column label="核实情况" align="center" prop="noDifficultReason" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <router-link :to="'/worship/people-info/info/' + scope.row.personId" class="link-type">
              <!-- <router-link :to="'/worship/people-info/info/' + scope.row.id + '?tab=assistanceInfo'" class="link-type"> -->
              <el-button class="btn" size="mini" type="text">详情</el-button>
            </router-link>
            <el-button
              size="mini"
              type="text"
              @click="handleReject(scope.row)"
              v-hasPermi="['worship:tobeTransferred:reject']"
              >驳回</el-button
            >
            <el-button
              size="mini"
              type="text"
              @click="handleVerify(scope.row)"
              v-hasPermi="['worship:tobeTransferred:verify']"
              >确认转出</el-button
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
  </div>
</template>

<script>
import { updateCareInfo, careInfoList, delCareInfo, addOutDifficult } from '@/api/worship/carePersonList';
import People from '@/components/ChangePeoPle/people';

export default {
  name: 'tobeTransferred',
  dicts: ['sys_worship_difficultytype', 'sys_worship_transferout'],
  components: { People },
  data() {
    return {
      // 按钮loading
      buttonLoading: false,
      // 遮罩层
      loading: true,
      // 选中数组
      selectList: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      tobeTransferredList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        searchValue: '',
        companyName: undefined,
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      this.queryParams.type = '4';
      careInfoList(this.queryParams).then((response) => {
        this.tobeTransferredList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
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
        companyName: undefined,
        industry: undefined,
        companyAddress: undefined,
        contacts: undefined,
        contactsPhone: undefined,
        companyIntroduction: undefined,
        activityNum: undefined,
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
      this.selectList = selection.map((e) => {
        return (e = {
          id: e.id,
          verifyTypeDifficulty: e.difficultInfo.verifyTypeDifficulty || '',
          personId: e.personId,
        });
      });
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    handleReject(row) {
      this.loading = true;
      this.reset();
      this.loading = false;
      this.form = {
        id: row.id,
        personId: row.personId,
        type: '1',
        whetherMessage: '1',
      };
      updateCareInfo(this.form)
        .then((response) => {
          this.$modal.msgSuccess('成功');
          this.getList();
          this.form = {};
          this.$emit('changeTag');
        })
        .finally(() => {
          this.buttonLoading = false;
        });
    },
    handleVerify(row) {
      this.loading = true;
      this.reset();
      this.loading = false;
      if (row.id) {
        this.selectList = [];
        this.selectList.push({
          personId: row.personId,
          verifyTypeDifficulty: row.difficultInfo.verifyTypeDifficulty || '',
        });
      }
      let ids = this.selectList.map((e) => e.id);
      const id = row.id || ids;
      delCareInfo(id).then((response) => {
        this.$emit('changeTag');
      });
      this.selectList.forEach((e) => {
        let data = {
          personId: e.personId,
          verifyTypeDifficulty: e.verifyTypeDifficulty,
        };
        addOutDifficult(data)
          .then((response) => {
            this.$modal.msgSuccess('成功');
            this.getList();
          })
          .finally(() => {
            this.buttonLoading = false;
          });
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
  .btn {
    margin-right: 8px;
  }
}
.rows {
  margin-bottom: 24px;
  .name {
    font-weight: 600;
    font-size: 24px;
  }
  .el-col {
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
</style>
