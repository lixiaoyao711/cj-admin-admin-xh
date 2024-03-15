<template>
  <div class="visitReminder">
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
        <el-select v-model="queryParams.verifyTypeDifficulty" placeholder="请选择">
          <el-option
            v-for="dict in dict.type.sys_worship_difficultytype"
            :key="dict.value"
            :label="dict.label"
            :value="dict.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="search-right">
        <el-form-item label="" prop="keyWord">
          <el-input
            v-model="queryParams.keyWord"
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
        <div class="title-name">走访提醒</div>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </div>
      <el-table v-loading="loading" :data="remindList" @selection-change="handleSelectionChange" height="85%">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="姓名" align="center" prop="name" />
        <el-table-column label="性别" align="center" prop="sex" />
        <el-table-column label="身份证号" align="center" prop="idCard" />
        <el-table-column label="联系方式" align="center" prop="phone" />
        <el-table-column label="行政区划" align="center" prop="divisionName" />
        <el-table-column label="困难类型" align="center" prop="difficultyType">
          <template slot-scope="scope">
            <span>{{
              scope.row.difficultInfo.verifyTypeDifficulty === 'null'
                ? '无'
                : scope.row.difficultInfo.verifyTypeDifficulty
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="上次走访日期" align="center" prop="lastVisitTime" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.lastVisitTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="距下次走访还有" align="center" prop="nextVisitTime" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="text">
              <router-link :to="'/worship/people-info/info/' + scope.row.personId" class="link-type">
                <el-button size="mini" type="text">详情</el-button>
              </router-link>
            </el-button>
            <el-button size="mini" type="text" @click="handleVisit(scope.row)">走访</el-button>
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
    <!-- 帮扶详情对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body @close="cancel">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="被帮扶人" prop="personName">
              <el-input v-model="form.personName" placeholder="请输入被帮扶人" />
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
            <el-checkbox v-for="dict in dict.type.sys_worship_assistancemeasures" :key="dict.value" :label="dict.value">
              {{ dict.label }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
        <!-- 选中给予物资基金显示 -->
        <el-form-item v-if="form.helpMethod.indexOf('1') != -1" label="给予资金金额：" prop="moneyAmount">
          <el-input type="number" placeholder="请输入内容" v-model="form.moneyAmount" show-word-limit> </el-input>
        </el-form-item>
        <!-- 选中给予事物援助 -->
        <el-form-item v-if="form.helpMethod.indexOf('2') != -1" label="实物价值金额：" prop="valueAmount">
          <el-input type="number" placeholder="请输入内容" v-model="form.valueAmount" show-word-limit> </el-input>
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listVisiting, getVisiting, delVisiting, addVisiting, updateVisiting } from '@/api/worship/visiting';
import { queryVisitRemindList } from '@/api/worship/visiting';
import { listByIds } from '@/api/system/oss';
export default {
  name: 'PartyStudyFile',
  dicts: [
    'sys_worship_visitingmethods',
    'sys_worship_assistancemeasures',
    'sys_worship_difficultytype',
    'sys_worship_difficultytype',
    'sys_worship_visittype',
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
      // 学习内容文件表格数据
      remindList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: undefined,
        keyWord: undefined,
      },
      // 表单参数
      form: {
        helpMethod: [],
      },
      activeName: '1',
      srcList: [],
      helpMethodStr: [],
      // 表单校验
      rules: {
        id: [{ required: true, message: '主键不能为空', trigger: 'blur' }],
        divisionCode: [{ required: true, message: '行政区划代码不能为空', trigger: 'blur' }],
        visitType: [{ required: true, message: '走访类型不能为空', trigger: 'change' }],
        personName: [{ required: true, message: '被帮扶人名称不能为空', trigger: 'change' }],
        visitPersonName: [{ required: true, message: '走访人姓名不能为空', trigger: 'blur' }],
        visitPersonPhone: [{ required: true, message: '走访人联系方式不能为空', trigger: 'blur' }],
        visitMethod: [{ required: true, message: '走访方式不能为空', trigger: 'change' }],
        visitTime: [{ required: true, message: '走访日期不能为空', trigger: 'blur' }],
        content: [{ required: true, message: '走访内容不能为空', trigger: 'blur' }],
        moneyAmount: [{ required: true, message: '给予资金金额不能为空', trigger: 'blur' }],
        valueAmount: [{ required: true, message: '实物价值金额不能为空', trigger: 'blur' }],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询学习内容文件列表 */
    getList() {
      this.loading = true;
      queryVisitRemindList(this.queryParams).then((response) => {
        this.remindList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      // this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        helpMethod: [],
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
    handleVisit(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids;
      this.loading = false;
      this.form = Object.assign(
        {},
        {
          personId: row.personId,
          divisionCode: row.divisionCode,
          divisionName: row.divisionName,
          personName: row.name,
          helpMethod: [],
          visitPersonName: this.$store.state.user.name,
        }
      );
      this.open = true;
      this.title = '走访';
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          let helpMethod = this.form.helpMethod.join(',');
          this.form.visitType = 5;
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
    async getImgList(id) {
      const { data } = await listByIds(id);
      let list = data.map((e) => {
        return { name: e.originalName, url: e.url, ossId: e.ossId };
      });
      return list;
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
  .borderTop {
    border-top: 1px solid #efefef;
    padding-top: 24px;
  }
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
}
</style>
