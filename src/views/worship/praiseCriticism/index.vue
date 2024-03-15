<template>
  <div class="app-container">
    <div class="header">褒扬批评</div>
    <div class="table">
      <div class="group" v-for="item in tabList" :key="item.value">
        <div class="table-left">
          <div class="table-title-box">
              <div class="title-name">{{ item.label }}</div>
              <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                  <el-button
                    type="danger"
                    plain
                    icon="el-icon-delete"
                    size="mini"
                    :disabled="multiple"
                    @click="handleDelete"
                    v-hasPermi="['worship:praiseCriticism:remove']"
                  >删除</el-button>
                </el-col>
                <el-col :span="1.5">
                  <el-button
                    type="primary"
                    plain
                    icon="el-icon-plus"
                    size="mini"
                    @click="handleAdd(item)"
                    v-hasPermi="['worship:praiseCriticism:add']"
                  >新增</el-button>
                </el-col>
              </el-row>
            </div>
        </div>
        <el-table v-loading="loading" :data="item.list" @selection-change="handleSelectionChange" height="87%">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="人员" align="center" prop="personName" width="100"/>
          <el-table-column label="内容" align="center" prop="content" />
          <el-table-column label="日期" align="center" prop="obtainTime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.obtainTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['worship:praiseCriticism:edit']"
              >修改</el-button>
              <el-button
                size="mini"
                type="text"
                @click="handleDelete(scope.row)"
                v-hasPermi="['worship:praiseCriticism:remove']"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          :total="item.total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </div>
    </div>
    <!-- 添加或修改褒扬批评对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="人员：" prop="">
          <span :class="{'name':form.personName}">{{ form.personName }}</span>
          <el-button plain @click="handlePerson">{{form.personUserId ? '重新选择' : '选择成员'}}</el-button>
        </el-form-item>
        <el-form-item label="级别：" prop="grade">
          <el-select v-model="form.grade" placeholder="请选择级别">
            <el-option
              v-for="dict in dict.type.sys_worship_level"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="获得时间：" prop="obtainTime">
          <el-date-picker clearable
            v-model="form.obtainTime"
            :picker-options="pickerOptions"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择获得时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="内容：" prop="content">
          <el-input v-model="form.content" type="textarea" maxlength="500"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <OrgPeople v-if="showPeople" :isOrgChange="false" @close="showPeople = false" @success="peoSuccess"/>
  </div>
</template>

<script>
import { listPraiseCriticism, getPraiseCriticism, delPraiseCriticism, addPraiseCriticism, updatePraiseCriticism } from "@/api/worship/praiseCriticism";
import OrgPeople from "../../../components/ChangePeoPle/orgPeople.vue";

export default {
  name: "PraiseCriticism",
  dicts: ['sys_worship_level'],
  components: { OrgPeople },
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
      // 褒扬批评表格数据
      praiseCriticismList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        personName: undefined,
      },
      tabList:[
        {
          label:'争先创优',
          value:'0',
          list:[],
          total:0,
        },
        {
          label:'通报批评',
          value:'1',
          list:[],
          total:0,
        },
      ],
      // 表单参数
      form: {},
      showPeople:false,
      // 表单校验
      rules: {
        id: [
          { required: true, message: "主键不能为空", trigger: "blur" }
        ],
        personUserId: [
          { required: true, message: "人员id不能为空", trigger: "blur" }
        ],
        personEmployeeCode: [
          { required: true, message: "人员employeeCode不能为空", trigger: "blur" }
        ],
        personName: [
          { required: true, message: "人员姓名不能为空", trigger: "blur" }
        ],
        obtainTime: [
          { required: true, message: "获得时间不能为空", trigger: "blur" }
        ],
        content: [
          { required: true, message: "内容不能为空", trigger: "blur" }
        ],
      },
      // 只能筛今天之前的日期
      pickerOptions: {
        // 限制时间
        disabledDate(time) {
            // 今天之后都禁用
            return time.getTime() > new Date();
        },
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询褒扬批评列表 */
    getList() {
      this.loading = true;
      this.tabList.forEach(e =>{
        let query = Object.assign({},this.queryParams,{
          dataType:e.value
        })
        listPraiseCriticism(query).then(response => {
          e.list = response.rows;
          e.total = response.total;
          this.loading = false;
        });
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
        createId: undefined,
        updateId: undefined,
        personUserId: undefined,
        personEmployeeCode: undefined,
        personName: undefined,
        grade: undefined,
        obtainTime: undefined,
        content: undefined,
        dataType: undefined
      };
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
    handleAdd(item) {
      this.reset();
      this.form = {
        dataType:item.value,
      }
      this.open = true;
      this.title = `添加${item.label}`;
      console.log(this.form);
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids
      let text = row.dataType === '1' ? '通报批评' : '争先创优'
      getPraiseCriticism(id).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = `修改${text}`;
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updatePraiseCriticism(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addPraiseCriticism(this.form).then(response => {
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
      let text = row.dataType === '1' ? '通报批评' : '争先创优'
      this.$modal.confirm('是否确认删除"' + text + '"编号为"' + ids + '"的数据项？').then(() => {
        this.loading = true;
        return delPraiseCriticism(ids);
      }).then(() => {
        this.loading = false;
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      }).finally(() => {
        this.loading = false;
      });
    },
    handlePerson(){
      this.showPeople = true
    },
    peoSuccess(data){
      console.log(data);
      if(data.length < 1) {
        return
      }
      let ids = data.map(e => e.userId)
      let names = data.map(e => e.nickName)
      let employeeCodes = data.map(e => e.userName)
      this.form.personUserId = ids.join(',') 
      this.form.personName = names.join(',')
      this.form.personEmployeeCode = employeeCodes.join(',')
      this.showPeople = false
    },
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
  display: flex;
  .search-right {
    width: 14%;
  }
}

.table {
  margin: 16px 0 0 0;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  height: 786px;
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
  .group{
    width: 49.5%;
    background: #fff;
    padding: 16px;
  }
}
.pagination-container {
  text-align: center;
  
}
::v-deep .el-pagination{
  position: static;
}
.name{
  margin-right: 12px;
}
</style>
