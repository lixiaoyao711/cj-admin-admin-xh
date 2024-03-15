<template>
  <div class="infomationStreet">
    <el-form class="search-form" :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="">
      <el-form-item label="行政区划：" prop="divisionCode">
        <TreeSelectDivision :disabled="divisionData.level > 3" v-model="queryParams.divisionCode" @treeselectChange="(e) => treeselectChange(e, queryParams)"></TreeSelectDivision>
      </el-form-item>
      <el-form-item label="" prop="divisionName"></el-form-item>
      <el-form-item label="投稿状态：" prop="submissionStatus">
        <el-select v-model="queryParams.submissionStatus" placeholder="请选择投稿状态" clearable>
          <el-option
            v-for="dict in dict.type.sys_worship_submissionstatus"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="投稿日期：" prop="searchTime">
        <el-date-picker
          clearable
          v-model="queryParams.searchTime"
          type="daterange"
          value-format="yyyy-MM-dd"
          placeholder="请选择"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item class="search-right">
        <el-form-item label="" prop="title">
          <el-input
            v-model="queryParams.title"
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
        <div class="title-name">稿件列表</div>
        <el-row :gutter="10" class="mb8">
          <!-- <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['worship:infomationStreet:remove']"
            >删除</el-button>
          </el-col> -->
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['worship:infomationStreet:add']"
            >新增</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </div>
      <el-table v-loading="loading" :data="infomationStreetList" @selection-change="handleSelectionChange" height="85%">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="标题" align="center" prop="title" />
        <el-table-column label="投稿人" align="center" prop="createNickname" />
        <el-table-column label="行政区划" align="center" prop="divisionName" />
        <el-table-column label="投稿日期" align="center" prop="createTime" />
        <el-table-column label="投稿状态" align="center" prop="submissionStatus" >
          <template slot-scope="scope">
            <el-tag :type="scope.row.submissionStatus">
              <dict-tag :options="dict.type.sys_worship_submissionstatus" :value="scope.row.submissionStatus"/>
            </el-tag>
            <template v-if="['2','3'].indexOf(scope.row.submissionStatus) > -1">
              <el-popover
                placement="top"
                width="200"
                trigger="click"
                :content="scope.row.submissionStatus === '2' ? scope.row.preReason : scope.row.returnReason">
                <i slot="reference" class="el-icon-warning-outline"></i>
              </el-popover>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <div>
              <el-button size="mini" v-for="(item, index) in buttonMap[scope.row.buttonStatus]" :key="index" type="text">
                <div @click="clickbtn(scope.row, item)">
                  {{ item }}
                </div>
              </el-button>
            </div>
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
    <!-- 添加或修改信息宣传-镇街投稿对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="45%" append-to-body>
      <template v-if="title === '详情'">
        <el-row class="rows alignCenter">
          <el-col>
            <el-tag class="tag" :type="form.submissionStatus">
              <dict-tag :options="dict.type.sys_worship_submissionstatus" :value="form.submissionStatus"/>
            </el-tag>
            <div class="name">{{form.title}}</div>
          </el-col>
        </el-row>
        <el-row class="rows">
          <el-col :span="12">投稿人：{{form.createNickname}}</el-col>
          <el-col :span="12">行政区划：{{form.divisionName}}</el-col>
        </el-row>
        <el-row class="rows">
          <el-col>
            <div>内容：</div>{{ form.content }}
          </el-col>
        </el-row>
        <el-row class="rows">
          <el-col :span="24">
            <div>照片：</div>
            <el-image
              class="mr10"
              v-for="(item, index) in srcList"
              :key="index"
              style="width: 100px; height: 100px"
              :src="srcList[index]"
              :preview-src-list="srcList"
            >
            </el-image>
          </el-col>
        </el-row>
      </template>
      <template v-else>
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-form-item v-if="title === '预录取'" label-width="10px" label="" prop="preReason">
            <div>请输入修改建议</div>
            <el-input v-model="form.preReason" type="textarea" autosize :row="3" placeholder="请输入内容" />
          </el-form-item>
          <el-form-item v-else-if="title === '退回'" label="" label-width="10px" prop="returnReason">
            <div>请输入退回理由</div>
            <el-input v-model="form.returnReason" type="textarea" autosize :row="3" placeholder="请输入内容" />
          </el-form-item>
          <template v-else>
            <div class="alert"><i class="el-icon-warning"></i>  内容不少于300字，图片不少于3张</div>
            <el-form-item label="标题：" prop="title">
              <el-input v-model="form.title" placeholder="请输入标题" />
            </el-form-item>
            <el-form-item label="内容：" prop="content">
              <el-input v-model="form.content" type="textarea" minlength="300" autosize placeholder="请输入内容" />
            </el-form-item>
            <el-form-item label="上传图片：" prop="fileUrl">
              <imageUpload v-model="form.fileUrl" />
            </el-form-item>
          </template>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { listInfomationStreet, getInfomationStreet, delInfomationStreet, addInfomationStreet, updateInfomationStreet } from "@/api/worship/infomationStreet";
import { getDivisionsByCode } from '@/api/common'
import { listByIds } from '@/api/system/oss';
export default {
  name: "InfomationStreet",
  dicts: ['sys_worship_submissionstatus'],
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
      // 信息宣传-镇街投稿表格数据
      infomationStreetList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: undefined,
        divisionCode: undefined,
        submissionStatus: undefined,
        searchTime:[],
      },
      // 表单参数
      form: {},
      stateList:['info','','danger','success'],
      srcList:[],
      divisionData:{
        divisionCode:'',
        divisionName:'',
        level:3,
      },
      buttonMap: {
        1: ['详情', '编辑'], //已投稿,镇街
        2: ['详情', '预录取', '录取', '退回'], //已投稿,区级
        3: ['详情', '重新编辑', '删除'], //预录取,镇街
        4: ['详情'], //预录取,区级
        5: ['详情', '删除'], //退回,镇街
        6: ['详情'], //退回,区级
        7: ['详情'], //已录取,镇街
        8: ['详情', '删除'], //已录取,区级
      },
      // 表单校验
      rules: {
        id: [
          { required: true, message: "主键不能为空", trigger: "blur" }
        ],
        title: [
          { required: true, message: "标题不能为空", trigger: "blur" }
        ],
        content: [
          { required: true, message: "内容不能为空", trigger: "change" }
        ],
        content: [
          {
            required: true,
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('请输入内容'));
              } else if(value.length < 300) {
                callback(new Error('内容不少于300字'));
              } else {
                callback();
              }
            },
          },
        ],
        fileUrl: [
          {
            required: true,
            trigger: 'change',
            validator: (rule, value, callback) => {
              let length = value.split(',').length
              if (!value) {
                callback(new Error('请上传图片'));
              } else if(length < 3) {
                callback(new Error('图片不少于3张'));
              } else {
                callback();
              }
            },
          },
        ]
      }
    };
  },
  created() {
    this.getDeptName()
    // this.getList();
  },
  methods: {
    getDeptName() {
      let code = this.$store.state.user.divisionCode
      this.divisionData.divisionCode = code
      getDivisionsByCode(code).then(res =>{
        let { name, level } = res.data
        this.divisionData.divisionName = name
        this.divisionData.level = level
        if(level > 2){
          this.getList()
        }
      })
    },
    /** 查询信息宣传-镇街投稿列表 */
    getList() {
      this.loading = true;
      this.divisionData.level > 3 ? this.queryParams.divisionCode = this.divisionData.divisionCode : ''
      let query = Object.assign({},this.queryParams,{
        beginTime: this.queryParams?.searchTime?.[0],
        endTime: this.queryParams?.searchTime?.[1],
        divisionCode: this.divisionData.level > 3 ? this.divisionData.divisionCode : '',
      })
      listInfomationStreet(query).then(response => {
        this.infomationStreetList = response.rows.map(item => {
          switch(item.submissionStatus){
            case '1':
              item.buttonStatus = this.divisionData.level === 3 ? 2 : 1
              break;
            case '2':
              item.buttonStatus = this.divisionData.level === 3 ? 4 : 3
              break;
            case '3':
              item.buttonStatus = this.divisionData.level === 3 ? 6 : 5
              break;
            case '4':
              item.buttonStatus = this.divisionData.level === 3 ? 8 : 7
              break;
            default:
              item.buttonStatus = 6
              break;
          }
          return item;
        });
        console.log(this.infomationStreetList);
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
        createId: undefined,
        updateId: undefined,
        title: undefined,
        divisionCode: undefined,
        divisionName: undefined,
        submitUserId: undefined,
        submitEmployeeCode: undefined,
        submitPersonName: undefined,
        submissionStatus: undefined,
        preReason: undefined,
        returnReason: undefined,
        delFlag: undefined
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
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加投稿";
    },
    /** 详情按钮操作 */
    handleDetail(row){
      this.loading = true;
      this.reset();
      const id = row.id || this.ids
      getInfomationStreet(id).then(response => {
        this.loading = false;
        this.form = response.data;
        this.getImgList()
        this.open = true;
        this.title = '详情';
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row,btn,submissionStatus) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids
      getInfomationStreet(id).then(response => {
        this.loading = false;
        this.form = response.data;
        this.form.submissionStatus = submissionStatus
        this.open = true;
        this.title = btn;
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateInfomationStreet(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            let formData = Object.assign({},this.form,this.divisionData)
            formData.submissionStatus = '1'
            addInfomationStreet(formData).then(response => {
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
      this.$modal.confirm('是否确认删除信息宣传-镇街投稿编号为"' + ids + '"的数据项？').then(() => {
        this.loading = true;
        return delInfomationStreet(ids);
      }).then(() => {
        this.loading = false;
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      }).finally(() => {
        this.loading = false;
      });
    },
    /** 录取按钮操作 */
    handleEnroll(row) {
      const ids = row.id;
      this.$modal.confirm('是否确认录取信息宣传-镇街投稿编号为"' + ids + '"的数据项？').then(() => {
        this.loading = true;
      }).then(() => {
        row.submissionStatus = '4'
        updateInfomationStreet(row).then(response => {
          this.$modal.msgSuccess("录取成功");
          this.getList();
        }).finally(() => {
          this.buttonLoading = false;
        });
      }).catch(() => {
      }).finally(() => {
        this.loading = false;
      });
    },
    clickbtn(row,btn){
      console.log(row,btn);
      switch(btn){
        case '详情':
          this.handleDetail(row)
          break;
        case '编辑':
          this.handleUpdate(row,btn,row.submissionStatus)
          break;
        case '重新编辑':
          this.handleUpdate(row,btn,'1')
          break;
        case '删除':
          this.handleDelete(row)
          break;
        case '录取':
          this.handleEnroll(row)
          break;
        case '预录取':
          this.handleUpdate(row,btn,'2')
          break;
        case '退回':
          this.handleUpdate(row,btn,'3')
          break;
        default:
          break;
      }
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('worship/infomationStreet/export', {
        ...this.queryParams
      }, `infomationStreet_${new Date().getTime()}.xlsx`)
    },
    async getImgList() {
      if(this.form.fileUrl){
        const { data } = await listByIds(this.form.fileUrl);
        this.srcList = data.map((item) => item.url);
      }
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
.alert{
  height: 36px;
  line-height: 36px;
  border: 1px solid #91d5ff;
  background: rgba($color: #91d5ff, $alpha: 0.3);
  color: #51575a;
  padding: 0 20px;
  border-radius: 4px;
  margin-bottom: 12px;
  i{
    color: #1890ff;
  }
}
.rows{
  margin-bottom: 24px;
  .name{
    font-weight: 600;
    font-size: 24px;
  }
  &.title{
    font-weight: 600;
    font-size: 18px;
    padding-top: 12px;
    border-top: 10px solid #efefef;
  }
  .tag{
    margin-right: 12px;
  }
  .el-col{
    color: #333333;
    display: flex;
    & > div{
      white-space: nowrap;
    }
    &.alignCenter{
      align-items: center;
    }
  }
}
.el-icon-warning-outline{
  font-size: 18px;
  margin-left: 6px;
  vertical-align: -3px;
}
</style>
