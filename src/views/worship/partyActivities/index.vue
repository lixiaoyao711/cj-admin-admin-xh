<template>
  <div class="app-container">
    <div class="header">志愿活动</div>
    <div class="tabs">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="志愿活动" name="1"></el-tab-pane>
        <el-tab-pane label="志愿小队" name="2"></el-tab-pane>
      </el-tabs>
    </div>
    <el-form class="search-form" :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="">
      <el-form-item label="行政区划：" prop="divisionCode">
        <TreeSelectDivision v-model="queryParams.divisionCode" @treeselectChange="(e) => treeselectChange(e, queryParams,'divisionCode')"></TreeSelectDivision>
      </el-form-item>
      <el-form-item v-if="activeName === '1'" label="搜索:" prop="activityTitle">
        <el-input
          v-model="queryParams.activityTitle"
          placeholder="请输入"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item v-else label="搜索:" prop="teamName">
        <el-input
          v-model="queryParams.teamName"
          placeholder="请输入"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item class="search-right">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="table" v-if="activeName === '1'">
      <div class="table-title-box">
        <div class="title-name">志愿活动</div>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </div>
      <el-table v-loading="loading" :data="partyActivitiesList" @selection-change="handleSelectionChange" height="85%">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="行政区划" align="center" prop="divisionName" />
        <el-table-column label="活动标题" align="center" prop="activityTitle" >
          <template slot-scope="scope">{{ scope.row.activityTitle}}</template>
        </el-table-column>
        <el-table-column label="参加人数" align="center" prop="numOfParticipants" >
          <template slot-scope="scope">
            <span>{{ scope.row.numOfParticipants}}人</span>
          </template>
        </el-table-column>
        <el-table-column label="活动日期" align="center" prop="activityTime" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.activityTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column  label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleDetail(scope.row)"
            >详情</el-button>
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
    <div class="table" v-if="activeName === '2'">
      <div class="table-title-box">
        <div class="title-name">志愿小队</div>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              plain
              size="mini"
              icon="el-icon-delete"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['worship:partyActivities:remove']"
            >删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-plus"
              plain
              size="mini"
              @click="handleAdd"
              v-hasPermi="['worship:partyActivities:add']"
            >新增</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </div>
      <el-table v-loading="loading" :data="partyActivitiesList" @selection-change="handleSelectionChange" height="85%">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="小队名称" align="center" prop="teamName" />
        <el-table-column label="小队规模" align="center" prop="teamSize" >
          <template slot-scope="scope">
            <span>{{ scope.row.teamSize}}人</span>
          </template>
        </el-table-column>
        <el-table-column label="小队负责人" align="center" prop="responsiblePerson" >
          <template slot-scope="scope">
            <span>{{ scope.row.responsiblePerson}}</span>
          </template>
        </el-table-column>
        <el-table-column label="行政区划" align="center" prop="divisionName" >
          <template slot-scope="scope">
            <span>{{ scope.row.divisionName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="活动次数" align="center" prop="numActivities" >
          <template slot-scope="scope">
            <span>{{ scope.row.numActivities}}次</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleDetail(scope.row)"
            >详情</el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['worship:volunteerTeam:edit']"
            >编辑</el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.row)"
              v-hasPermi="['worship:volunteerTeam:remove']"
            >删除</el-button>
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
    <!-- 新建志愿小队对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="小队名称：" prop="teamName">
              <el-input v-model="form.teamName" placeholder="请输入小队名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="行政区划：" prop="divisionCode">
              <TreeSelectDivision v-model="form.divisionCode" @treeselectChange="(e) => treeselectChange(e, form)"></TreeSelectDivision>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="负责人：" prop="responsiblePerson">
              <el-input v-model="form.responsiblePerson" placeholder="请输入负责人" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系方式：" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入联系方式" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="小队介绍：" prop="msg">
          <el-input v-model="form.msg" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="添加成员：" prop="participantsPersonId">
          <span :class="{'personRight': form.participantsPersonId}">{{ participantsPersonName }}</span>
          <el-button plain @click="handlePerson">{{form.participantsPersonId ? '修改成员' : '选择成员'}}</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <DetailDialog :visible="openDetail" :title="detailDialogTitle" :formData="form" @close="openDetail = false"/>
    <People v-if="showPeople" :type="'petitionData'" @close="showPeople = false" @success="peoSuccess"/>
  </div>
</template>

<script>
import { listPartyActivities, getPartyActivities, delPartyActivities, addPartyActivities, updatePartyActivities } from "@/api/worship/partyActivities";
import { listVolunteerTeam, getVolunteerTeam, addVolunteerTeam, updateVolunteerTeam, delVolunteerTeam } from "@/api/worship/volunteerTeam";
import DetailDialog from './dialog/detailDialog'
import People from "../../../components/ChangePeoPle/people.vue";
export default {
  name: "PartyActivities",
  components:{ DetailDialog,People },
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
      // 弹出层标题
      title: "",
      detailDialogTitle:'',
      // 是否显示弹出层
      open: false,
      openDetail:false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        teamName: undefined,
        divisionCode: undefined,
      },
      // 表单参数
      form: {},
      activeName: this.$route.query.tab || '1',
      showPeople:false,
      participantsPersonName:'',
      rules: {
        id: [
          { required: true, message: "主键不能为空", trigger: "blur" }
        ],
        teamName: [
          { required: true, message: "小队名称不能为空", trigger: "blur" }
        ],
        divisionCode: [
          { required: true, message: "行政区划不能为空", trigger: "change" }
        ],
        divisionName: [
          { required: true, message: "行政区划名称不能为空", trigger: "change" }
        ],
        responsiblePerson: [
          { required: true, message: "负责人不能为空", trigger: "change" }
        ],
        phone: [
          { required: true, message: "联系方式不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.handleClick();
  },
  methods: {
    /** 查询党建引领活动列表 */
    getList() {
      this.loading = true;
      let func = null
      if(this.activeName === '1'){
        this.queryParams.activityType = '3'
        func = listPartyActivities(this.queryParams)
      } else{
        func = listVolunteerTeam(this.queryParams)
      }
      func.then(response =>{
        this.partyActivitiesList = response.rows;
        this.total = response.total;
        this.loading = false;
      })
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
        activityTitle: undefined,
        divisionCode: undefined,
        divisionName: undefined,
        activityType: undefined,
        numOfParticipants: undefined,
        numOfOrganizations: undefined,
        activityTime: undefined,
        activityAddress: undefined,
        activityContent: undefined,
        activityFileUrl: undefined,
        activityMode: undefined
      };
      this.participantsPersonName = ''
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "新建志愿小队";
    },
    /** 详情按钮操作 */
    handleDetail(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids
      this.loading = false;
      this.form = Object.assign({},row) 
      this.openDetail = true;
      this.detailDialogTitle = this.activeName === '1' ? '活动详情' : '小队详情';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      console.log(row);
      this.loading = true;
      this.reset();
      const id = row.id || this.ids
      this.loading = false;
      this.form = Object.assign({},row) 
      this.participantsPersonName = this.form.teamMemberList.map(e => e.name).join(',')
      this.title = "修改志愿小队";
      this.open = true;
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateVolunteerTeam(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addVolunteerTeam(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除志愿小队编号为"' + ids + '"的数据项？').then(() => {
        this.loading = true;
        return delVolunteerTeam(ids);
      }).then(() => {
        this.loading = false;
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      }).finally(() => {
        this.loading = false;
      });
    },
    handleClick() {
      this.handleQuery()
    },
    handlePerson() {
      this.showPeople = true
    },
    peoSuccess(data){
      let ids = data.map(e => e.id)
      let names = data.map(e => e.name)
      this.form.participantsPersonId = ids.join(',')
      this.participantsPersonName = names.join(',')
      this.showPeople = false
    }
  }
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
.tabs {
  display: flex;
  line-height: 40px;
  .el-tabs {
    margin: 0 20px 0 0;
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
.personRight{
  margin-right: 12px;
}
::v-deep .el-tabs__nav-wrap::after {
  height: 0px !important;
}
</style>
