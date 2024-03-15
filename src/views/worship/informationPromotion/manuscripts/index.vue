<template>
  <div class="manuscripts">
    <el-form class="search-form" :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="">
      <el-form-item label="媒体级别：" prop="mediaLevel">
        <el-select v-model="queryParams.mediaLevel" placeholder="请选择媒体级别" clearable>
          <el-option
            v-for="dict in dict.type.sys_worship_level"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="发表日期：" prop="searchTime">
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
        <div class="title-name">稿件列表</div>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['worship:informationPromotion:remove']"
            >删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['worship:informationPromotion:add']"
            >新增</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </div>
      <el-table v-loading="loading" :data="informationPromotionList" @selection-change="handleSelectionChange" height="85%">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="标题" align="center" prop="title" />
        <el-table-column label="媒体名称" align="center" prop="mediaName" width="180"/>
        <el-table-column label="媒体等级" align="center" prop="mediaLevel" width="100">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_worship_level" :value="scope.row.mediaLevel"/>
          </template>
        </el-table-column>
        <el-table-column label="投稿人" align="center" prop="submitPersonName" width="120"/>
        <el-table-column label="投稿时间" align="center" prop="submitTime" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.submitTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="稿件链接" prop="articleUrl" >
          <template slot-scope="scope">
            <div class="linkColor">
              <a target="_blank" :href="scope.row.articleUrl">{{ scope.row.articleUrl }}</a>
            </div>
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
              v-hasPermi="['worship:informationPromotion:edit']"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.row)"
              v-hasPermi="['worship:informationPromotion:remove']"
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

    <!-- 添加或修改信息宣传-稿件列对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="45%" append-to-body>
      <template v-if="title !== '稿件详情'">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-form-item label="标题：" prop="title">
            <el-input v-model="form.title" placeholder="请输入标题" />
          </el-form-item>
          <el-form-item label="媒体名称：" prop="mediaName">
            <el-input v-model="form.mediaName" placeholder="请输入媒体名称" />
          </el-form-item>
          <el-form-item label="媒体等级：" prop="mediaLevel">
            <el-select v-model="form.mediaLevel" placeholder="请选择媒体等级">
              <el-option
                v-for="dict in dict.type.sys_worship_level"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="投稿人：" prop="submitPersonName">
            <span :class="{ 'personRight': form.submitUserId }">{{ form.submitPersonName }}</span>
            <el-button plain @click="handlePerson">{{ form.submitUserId ? '重新选择' : '选择投稿人' }}</el-button>
          </el-form-item>
          <el-form-item label="投稿时间：" prop="submitTime">
            <el-date-picker clearable
              v-model="form.submitTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="请选择投稿时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="稿件链接：" prop="articleUrl">
            <el-input v-model="form.articleUrl" type="textarea" placeholder="请输入内容" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
      <template v-else>
        <el-row class="rows alignCenter">
          <el-col>
            <el-tag type="info" class="personRight">
              <dict-tag :options="dict.type.sys_worship_level" :value="form.mediaLevel"/>
            </el-tag>
            <div class="name">{{form.title}}</div>
          </el-col>
        </el-row>
        <el-row class="rows">
          <el-col :span="12">媒体名称：{{form.mediaName}}</el-col>
          <el-col :span="12">投稿时间：{{form.submitTime}}</el-col>
        </el-row>
        <el-row class="rows">
          <el-col>
            <div>投稿人：</div>
            <span class="personRight" v-for="(peo,index) in peoList" :key="index">
              {{ peo }}
            </span>
          </el-col>
        </el-row>
        <el-row class="rows">
          <el-col :span="24">
            <div>稿件链接：</div>
            <a class="linkColor" target="_blank" :href="form.articleUrl">{{ form.articleUrl }}</a>
          </el-col>
        </el-row>
      </template>
    </el-dialog>
    <OrgPeople v-if="showPeople" :isRadio="true" :isOrgChange="false" :isTable="true" @close="showPeople = false" @success="peoSuccess"/>
  </div>
</template>

<script>
import { listInformationPromotion, getInformationPromotion, delInformationPromotion, addInformationPromotion, updateInformationPromotion } from "@/api/worship/informationPromotion";
import OrgPeople from '@/components/ChangePeoPle/orgPeople'
import { testUrl } from '@/utils/regular'

export default {
  name: "InformationPromotion",
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
      // 信息宣传-稿件列表格数据
      informationPromotionList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        keyWord: undefined,
        mediaLevel: undefined,
        submitTime: undefined,
        searchTime: [],
      },
      // 表单参数
      form: {},
      showPeople:false,
      peoList:[],
      // 表单校验
      rules: {
        id: [
          { required: true, message: "主键不能为空", trigger: "blur" }
        ],
        title: [
          { required: true, message: "标题不能为空", trigger: "blur" }
        ],
        mediaName: [
          { required: true, message: "媒体名称不能为空", trigger: "blur" }
        ],
        mediaLevel: [
          { required: true, message: "媒体等级不能为空", trigger: "change" }
        ],
        // submitUserId: [
        //   { required: true, message: "投稿人id不能为空", trigger: "blur" }
        // ],
        // submitEmployeeCode: [
        //   { required: true, message: "投稿人employeeCode不能为空", trigger: "blur" }
        // ],
        // submitPersonName: [
        //   { required: true, message: "投稿人姓名不能为空", trigger: "blur" }
        // ],
        articleUrl: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!testUrl(value)) {
                callback(new Error('请输入正确的地址'));
              } else {
                callback();
              }
            },
          },
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询信息宣传-稿件列列表 */
    getList() {
      this.loading = true;
      let query = Object.assign({},this.queryParams,{
        beginTime: this.queryParams?.searchTime?.[0],
        endTime: this.queryParams?.searchTime?.[1],
      })
      listInformationPromotion(query).then(response => {
        this.informationPromotionList = response.rows;
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
        mediaName: undefined,
        mediaLevel: undefined,
        submitUserId: undefined,
        submitEmployeeCode: undefined,
        submitPersonName: undefined,
        submitTime: undefined,
        articleUrl: undefined,
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
      this.title = "添加稿件";
    },
    /** 详情按钮操作 */
    handleDetail(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids
      getInformationPromotion(id).then(response => {
        this.loading = false;
        this.form = response.data;
        this.form.submitPersonName ? this.peoList = this.form.submitPersonName.split(',') : ''
        this.open = true;
        this.title = "稿件详情";
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids
      getInformationPromotion(id).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改稿件";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateInformationPromotion(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addInformationPromotion(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除信息宣传-稿件列表编号为"' + ids + '"的数据项？').then(() => {
        this.loading = true;
        return delInformationPromotion(ids);
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
      this.form.submitUserId = data.userId
      this.form.submitPersonName = data.nickName
      this.form.submitEmployeeCode = data.openId
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
.personRight{
  margin-right: 12px;
}
.linkColor{
  color: #1890ff;
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
</style>
