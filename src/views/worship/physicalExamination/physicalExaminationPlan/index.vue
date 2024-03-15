<template>
  <div class="physicalExaminationPlan">
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
      <el-form-item label="" prop="title">
        <el-input v-model="queryParams.title" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item class="search-right">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="table">
      <div class="table-title-box">
        <div class="title-name">体检计划列表</div>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['worship:physicalExamination:remove']"
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
              v-hasPermi="['worship:physicalExamination:add']"
              >新增</el-button
            >
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </div>
      <el-table
        v-loading="loading"
        :data="physicalExaminationList"
        @selection-change="handleSelectionChange"
        height="85%"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="标题" align="center" prop="title" />
        <el-table-column label="行政区划名称" align="center" prop="divisionName" />
        <el-table-column label="体检日期" align="center" prop="examinationTime" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.examinationTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="组织单位" align="center" prop="organizationalUnit" />
        <el-table-column label="体检医院" align="center" prop="examinationHospital" />
        <el-table-column label="体检地址" align="center" prop="examinationAddress" />
        <el-table-column label="确认人数 / 体检人数" align="center" prop="examinationAddress">
          <template slot-scope="scope">
            <span>{{ scope.row.confirmNum + ' / ' + scope.row.examinationNum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleDetail(scope.row)">详情</el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['worship:physicalExamination:edit']"
              >修改</el-button
            >
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.row)"
              v-hasPermi="['worship:physicalExamination:remove']"
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

    <!-- 添加或修改体检对话框 -->
    <el-dialog :title="title" :visible.sync="open" @close="handleDialogClose" width="50%" append-to-body>
      <template v-if="title === '体检详情'">
        <div class="examination-info">
          <p>标题：{{ form.title }}</p>
          <p>行政区划：{{ form.divisionName }}</p>
          <p>体检日期：{{ form.examinationTime }}</p>
          <p>体检医院：{{ form.examinationHospital }}</p>
          <p>体检地址：{{ form.examinationAddress }}</p>
        </div>
      </template>
      <template v-else>
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-form-item label="标题：" prop="title">
            <el-input v-model="form.title" placeholder="请输入标题" />
          </el-form-item>
          <el-form-item label="行政区划：" prop="divisionCode">
            <TreeSelectDivision
              v-model="form.divisionCode"
              @treeselectChange="(e) => treeselectChange(e, form)"
            ></TreeSelectDivision>
          </el-form-item>
          <el-form-item label="体检日期：" prop="examinationTime">
            <el-date-picker
              clearable
              v-model="form.examinationTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="请选择体检日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="体检医院：" prop="examinationHospital">
            <el-input v-model="form.examinationHospital" placeholder="请输入体检医院" />
          </el-form-item>
          <el-form-item label="体检地址：" prop="examinationAddress">
            <el-input v-model="form.examinationAddress" placeholder="请输入体检地址" />
          </el-form-item>
          <el-form-item label="组织单位：" prop="organizationalUnit">
            <el-input v-model="form.organizationalUnit" placeholder="请输入组织单位" />
          </el-form-item>
        </el-form>
      </template>
      <div class="person-table">
        <div class="rows">
          <p class="rows-title">体检人员</p>
          <span>
            <el-button v-if="title !== '体检详情'" size="small" plain @click="handleApplylicationPeo"
              >选择已申请人员</el-button
            >
            <el-button v-if="title !== '体检详情'" size="small" plain @click="handleFamilyPeo"
              >选择义务兵家属</el-button
            >
            <el-button v-if="title === '体检详情'" :disabled="multiple" size="small" plain @click="handleSendMes"
              >发送短信</el-button
            >
          </span>
        </div>
        <el-table
          :data="physicalExaminationPersonList"
          header-row-class-name="table-header"
          :header-cell-style="{ background: 'rgba(0, 0, 0, 0.02)' }"
          max-height="250"
          :border="false"
          size="medium"
          @selection-change="handleSelectionChange"
          style="width: 100%; height: 100%"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column prop="name" label="姓名" width=""></el-table-column>
          <el-table-column prop="idCard" label="身份证号" width="180"></el-table-column>
          <el-table-column prop="phonenumber" label="联系方式" width=""></el-table-column>
          <el-table-column prop="whetherExamination" label="是否体检" width="">
            <template slot-scope="scope">
              {{ scope.row.whetherExamination ? whetherExaminationList[scope.row.whetherExamination] : '未回应' }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button v-if="title !== '体检详情'" size="mini" type="text" @click="handleRemove(scope.row)"
                >移除</el-button
              >
              <span v-else>
                <el-button v-if="scope.row.whetherSms === '0'" size="mini" type="text" @click="handleSendMes(scope.row)"
                  >发送短信</el-button
                >
                <el-button v-else size="mini" type="text">
                  <el-button disabled size="mini" type="text">已发送</el-button>
                  <el-button size="mini" type="text" @click="handleSendMes(scope.row)">再次发送</el-button>
                </el-button>
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" v-if="title !== '体检详情'" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <People v-if="showPeople" :type="'conscriptFamily'" @close="showPeople = false" @success="peoSuccess" />
    <ApplyforList
      v-if="showApplyPeople"
      @close="showApplyPeople = false"
      :checkData="physicalExaminationPersonList"
      :type="'checkBox'"
      :url="'/parentsTestZlb/getPage'"
      @success="applyPeoSuccess"
    />
  </div>
</template>

<script>
import {
  listPhysicalExamination,
  getPhysicalExamination,
  delPhysicalExamination,
  addPhysicalExamination,
  updatePhysicalExamination,
  sendSms,
} from '@/api/worship/physicalExamination';
import People from '@/components/ChangePeoPle/people';
import ApplyforList from './applyforList';

export default {
  name: 'PhysicalExamination',
  components: { People, ApplyforList },
  data() {
    return {
      // 按钮loading
      buttonLoading: false,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      personIds: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 体检表格数据
      physicalExaminationList: [],
      physicalExaminationPersonList: [],
      applylicationList: [],
      whetherExaminationList: ['未回应', '是', '否'],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      showApplyPeople: false,
      showPeople: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: undefined,
      },
      // 表单参数
      form: {},
      personSourse: '',
      // 表单校验
      rules: {
        id: [{ required: true, message: '主键不能为空', trigger: 'blur' }],
        title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
        divisionCode: [{ required: true, message: '行政区划code不能为空', trigger: 'blur' }],
        divisionName: [{ required: true, message: '行政区划名称不能为空', trigger: 'blur' }],
        examinationTime: [{ required: true, message: '体检时间不能为空', trigger: 'blur' }],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询体检列表 */
    getList() {
      this.loading = true;
      listPhysicalExamination(this.queryParams).then((response) => {
        this.physicalExaminationList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    getApplication() {
      this.showApplyPeople = true;
      this.personSourse = '2';
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
        delFlag: undefined,
        title: undefined,
        divisionCode: undefined,
        divisionName: undefined,
        examinationTime: undefined,
        examinationHospital: undefined,
        examinationAddress: undefined,
        organizationalUnit: undefined,
      };
      this.resetForm('form');
      this.physicalExaminationPersonList = [];
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
      this.personIds = selection.map((item) => item?.personId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    handleDialogClose() {
      this.open = false;
      this.ids = '';
      this.multiple = true;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = '添加体检';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids;
      getPhysicalExamination(id).then((response) => {
        this.loading = false;
        this.form = response.data;
        this.physicalExaminationPersonList = response.data.personList;
        this.open = true;
        this.title = '修改体检';
      });
    },
    /** 详情按钮操作 */
    handleDetail(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids;
      getPhysicalExamination(id).then((response) => {
        this.loading = false;
        this.form = response.data;
        this.physicalExaminationPersonList = response.data.personList;
        this.open = true;
        this.title = '体检详情';
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        let list = this.physicalExaminationPersonList.map((e) => {
          return { personId: e.personId, examexaminationId: this.form.id || '', personSourse: e.personSourse };
        });
        let formData = Object.assign({}, this.form, {
          personList: list,
        });
        if (valid) {
          this.buttonLoading = true;
          if (formData.id != null) {
            updatePhysicalExamination(formData)
              .then((response) => {
                this.$modal.msgSuccess('修改成功');
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else {
            addPhysicalExamination(formData)
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
        .confirm('是否确认删除体检编号为"' + ids + '"的数据项？')
        .then(() => {
          this.loading = true;
          return delPhysicalExamination(ids);
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
    handleApplylicationPeo() {
      this.getApplication();
    },
    handleFamilyPeo() {
      this.personSourse = '1';
      this.showPeople = true;
    },
    handleSendMes(row) {
      const ids = row.personId || this.personIds.join(',');
      const data = {
        id: this.form.id,
        personIds: ids,
      };
      sendSms(data).then((res) => {
        this.$message.success('发送成功');
        this.handleDetail(this.form);
      });
    },
    handleRemove(row) {
      this.physicalExaminationPersonList = this.physicalExaminationPersonList.filter(
        (e) => e.personId !== row.personId
      );
    },
    peoSuccess(data) {
      console.log(data);
      data.forEach((e) => {
        e.personSourse = this.personSourse;
        e.personId = e.id;
        e.phonenumber = e.phone;
      });
      let list = [...this.physicalExaminationPersonList, ...data];
      const map = new Map();
      this.physicalExaminationPersonList = list.filter((item) => {
        return !map.has(item.id) && map.set(item.id, 1);
      });
      this.showPeople = false;
    },
    applyPeoSuccess(data) {
      this.applylicationList = data;
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
.person-table {
  border-top: 8px solid #f6f6f6;
}
.person-table .rows {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.person-table .rows .rows-title {
  font-size: 18px;
}
.examination-info {
  p {
    margin: 0 0 24px 0;
  }
  color: #333333;
  // font-size: 16px;
}
</style>
