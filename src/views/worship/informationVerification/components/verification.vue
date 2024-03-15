<template>
  <div class="verification">
    <el-form
      class="search-form"
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width=""
    >
      <el-form-item label="行政区划" prop="divisionCode">
        <TreeSelectDivision v-model="queryParams.divisionCode" @treeselectChange="(e) => treeselectChange(e, queryParams,'divisionCode')"></TreeSelectDivision>
      </el-form-item>
      <el-form-item label="人员类别" v-if="!queryParams.attribute" prop="personnelCategory">
        <el-select v-model="queryParams.personnelCategory" placeholder="请选择人员类别">
          <el-option
            v-for="dict in dict.type.sys_worship_personneltype"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          ></el-option>
        </el-select> 
      </el-form-item>
      <el-form-item label="安置类别" v-else prop="personCategory">
        <el-cascader
          v-model="personCategoryList"
          :options="anzhiType"
        >
        </el-cascader>
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
      <el-form-item label="搜索" prop="keyWord">
        <el-input
          v-model="queryParams.keyWord"
          placeholder="请输入姓名、身份证"
          clearable
        />
      </el-form-item>
      <el-form-item class="search-right">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="table mt10" >
      <div class="table-header">
        <div class="table-title">人员列表</div>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              >导出Excel</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-if="$route.query.name === 'deceasedPerson'"
              >添加人员</el-button
            >
          </el-col>
        </el-row>
      </div>
      <el-table v-loading="loading" :data="tableList" @selection-change="handleSelectionChange" height="56vh">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="姓名" align="center" prop="name" />
        <el-table-column label="身份证" align="center" prop="idCard" />
        <el-table-column label="性别" align="center" prop="sex" />
        <el-table-column label="年龄" align="center" prop="age" />
        <el-table-column label="手机号" align="center" prop="phone" />
        <el-table-column label="行政区划" align="center" prop="divisionName" />
        <el-table-column label="家庭地址" align="center" prop="permanentResidenceAddress" />
        <el-table-column v-if="$route.query.name === 'deceasedPerson'" label="去世时间" align="center" prop="deathTime" />
        <el-table-column  label="人员类别" align="center" prop="personCategory" >
          <template slot-scope="scope">
            <span v-if="!queryParams.attribute">
              <dict-tag :options="dict.type.sys_worship_personneltype" :value="scope.row.personnelCategory" />
            </span>
            <span v-else>
              <dict-tag :options="dict.type.sys_worship_tuiyijunrenanzhileibie" :value="scope.row.personCategory" />
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="text" v-if="queryParams.attribute == '1'">
              <router-link :to="'/worship/people-info/info/' + scope.row.id" class="link-type">
                <el-button size="mini" type="text">详情</el-button>
              </router-link>
            </el-button>
            <el-button size="mini" type="text" v-else-if="queryParams.attribute == '2'">
              <router-link :to="'/worship/externalPerson/info/' + scope.row.id" class="link-type">
                <el-button size="mini" type="text">详情</el-button>
              </router-link>
            </el-button>
            <el-button type="text" v-else>
              <router-link :to="'/worship/serviceFamily/info/' + scope.row.id" class="link-type">
                <el-button size="mini" type="text">详情</el-button>
              </router-link>
            </el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleUpdate(scope.row)"
              >修改</el-button
            >
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.row)"
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
    <!-- 去世人员编辑去世时间弹框 -->
    <el-dialog title="已选择去世人员" :visible.sync="dialogTableVisible">
      <el-table :data="deceasedPersonData">
        <el-table-column property="name" align="center" label="姓名" width="100"></el-table-column>
        <el-table-column property="idCard" align="center" label="身份证" width=""></el-table-column>
        <el-table-column property="phone" align="center" label="联系方式"></el-table-column>
        <el-table-column label="去世时间" align="center" prop="deathTime" >
          <template slot-scope="scope">
            <span v-if="scope.row.deathTime">{{ scope.row.deathTime }}</span>
            <!-- <span v-if="!scope.row.showDatePicker">
              <el-button
                size="mini"
                type="text"
                @click="scope.row.showDatePicker = true"
                >编辑</el-button
              >
            </span> -->
            <template v-if="!scope.row.deathTime">
              <el-date-picker
                v-model="scope.row.deathTime"
                value-format="yyyy-MM-dd"
                type="date"
                :picker-options="pickerOptions"
                size="small"
                style="width: 200px"
                placeholder="选择去世时间">
              </el-date-picker>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="dialogTableVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 退役军人及其他优抚对象弹窗 -->
    <RetiredSoldier :open="openSolider" :title="title" :formData="form" @cancel="openSolider = false" @success="success" />
    <!-- 现役军人家属弹窗 -->
    <ServiceFamily :open="openFamily" :title="title" :formData="form" @cancel="openFamily = false" @success="success" />
    <!-- 添加人员 -->
    <People v-if="showPeople" :type="peopleType" @close="showPeople = false" @success="peoSuccess"/>
  </div>
</template>

<script>
import {
  listServiceFamily,
  getServiceFamily,
  delServiceFamily,
  updateServiceFamily
} from '@/api/worship/serviceFamily';
import {
  listBasicPerson,
  getBasicPerson,
  delBasicPerson,
  updateBasicPerson,
} from '@/api/worship/retiredSoldier';
import RetiredSoldier from '@/views/worship/retiredSoldier/dialog/addOrUpdate';
import ServiceFamily from '@/views/worship/serviceFamily/dialog/addOrUpdate';
import People from "@/components/ChangePeoPle/people";
export default {
  name: 'verification',
  dicts: [
  'sys_worship_facetype',
  'sys_worship_personneltag',
  'sys_worship_ethnicgroup',
  'sys_user_sex',
  'sys_worship_personneltype',
  'sys_worship_maritalstatus',
  'sys_worship_tuiyijunrenanzhileibie',
  ],
  components: {
    RetiredSoldier,
    ServiceFamily,
    People
  },
  props:['query'],
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
      // 适龄人员表格数据
      tableList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      openSolider: false,
      openFamily: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        personnelCategory: undefined,
        maritalStatus: undefined,
        divisionCode: this.$store.state.user.divisionCode,
        keyWord: undefined,
      },
      // 表单参数
      form: {},
      showPeople: false,
      peopleType:'retireStatus',
      dialogTableVisible:false,
      deceasedPersonData:[],
      personCategoryList:[],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      }
    };
  },
  computed: {
    anzhiType() {
      return this.$store.getters.anzhiTypeDict;
    },
   
  },
  watch:{
    query(nv) {
      if(nv){
        this.resetQuery()
      }
    }
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询适龄人员列表 */
    getList() {
      this.loading = true;
      delete this.query['divisionCode']
      this.queryParams = Object.assign({},this.queryParams,this.query)
      this.queryParams.personCategory = this.personCategoryList?.[1]
      listBasicPerson(this.queryParams).then((response) => {
        this.tableList = response.rows;
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
        name: undefined,
        idCard: undefined,
        sex: undefined,
        age: undefined,
        phone: undefined,
        divisionCode: undefined,
        divisionName: undefined,
        politicalLandscape: undefined,
        searchTime: [],
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
      this.personCategoryList = []
      this.resetForm('queryForm');
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        personnelCategory: undefined,
        maritalStatus: undefined,
        divisionCode: this.$store.state.user.divisionCode,
        keyWord: undefined,
      }
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids;
      getBasicPerson(id).then((response) => {
        this.loading = false;
        this.form = response.data;
        this.queryParams.attribute == '3' ? this.openFamily = true : this.openSolider = true
        this.title = '修改';
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
    handleExport() {
      let url = !this.queryParams.attribute ? 'worship/serviceFamily/export' : 'worship/basicPerson/export'
      this.download(
        'worship/basicPerson/export',
        {
          ...this.queryParams,
        },
        `person_${new Date().getTime()}.xlsx`
      );
    },
    handleAdd(){
      this.showPeople = true
      let types = ['retireStatus','otherObjects','family']
      this.peopleType = !this.queryParams.attribute ? types[2] : types[Number(this.queryParams.attribute) - 1]
    },
    peoSuccess(data){
      this.deceasedPersonData = data.map(e =>{
        e.showDatePicker = false
        return e
      })
      this.dialogTableVisible = true
      this.showPeople = false
    },
    submitForm(){
      if(this.deceasedPersonData.some(e => !e.deathTime)){
        this.$modal.msgError("请填写去世时间！");
        return
      }
      this.deceasedPersonData.forEach(e =>{
        e.deathStatus = '1'
        updateBasicPerson(e).then(res =>{
          this.$modal.msgSuccess("新增成功");
          this.dialogTableVisible = false
          this.getList()
        })
      })
    },
    success() {
      this.openSolider = this.openFamily = false;
      this.getList();
    },
  },
};
</script>
<style lang="scss" scoped>
.header {
  height: 34.33px;
  font-family: PingFangSC-Medium;
  font-weight: 600;
  font-size: 26.67px;
  color: #000000d9;
  letter-spacing: 0;
  line-height: 37.33px;
  margin-bottom: 16px;
  .back{
    font-weight: 400;
    font-size: 16px;
    margin-right: 20px;
    cursor: pointer;
  }
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
  padding: 10px 20px;
  box-sizing: border-box;
  height: 69vh;
  .table-header {
    display: flex;
    justify-content: space-between;
  }
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
</style>
