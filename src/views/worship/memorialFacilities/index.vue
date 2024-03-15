<template>
  <div class="app-container">
    <div class="header">纪念设施</div>
    <el-form class="search-form" :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="">
      <el-form-item label="搜索:" prop="searchValue">
        <el-input
          v-model="queryParams.searchValue"
          placeholder="输入设施单名称或主体单位"
          clearable
        />
      </el-form-item>
      <el-form-item class="search-right">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="table">
      <div class="table-title-box">
        <div class="title-name">纪念设施列表</div>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['worship:memorialFacilities:remove']"
            >删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['worship:memorialFacilities:add']"
            >新增</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </div>
      <el-table v-loading="loading" :data="memorialFacilitiesList" @selection-change="handleSelectionChange" height="85%">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="设施名称" align="center" prop="facilitiesName" />
        <el-table-column label="主题单位" align="center" prop="unitName" />
        <el-table-column label="地址" align="center" prop="address" />
        <el-table-column label="介绍" align="center" prop="introduction" />
        <el-table-column label="最近维护时间" align="center" prop="introduction" >
          <template slot-scope="scope">
            <el-button  type="text" @click="handleRecords(scope.row)">
              {{ parseTime(scope.row.lastMaintenanceTime, '{y}月{m}月{d}日') || '新建维护记录' }}
            </el-button>
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
              v-hasPermi="['worship:memorialFacilities:edit']"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.row)"
              v-hasPermi="['worship:memorialFacilities:remove']"
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
    <!-- 添加或修改纪念设施对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="45%" append-to-body>
      <template v-if="title === '设施详情'">
        <el-row class="rows title">{{ form.facilitiesName }}</el-row>
        <el-row class="rows"><div>主体单位：</div>{{form.unitName}}</el-row>
        <el-row class="rows"><div>地址：</div>{{form.address}}</el-row>
        <el-row class="rows"><div>介绍：</div>{{form.introduction}}</el-row>
        <el-row class="rows">
          <div class="mr10"> 照片：</div>
          <el-image
            class="mr10"
            v-for="(item, index) in srcList"
            :key="index"
            style="width: 100px; height: 100px"
            :src="srcList[index]"
            :preview-src-list="srcList"
          >
          </el-image>
        </el-row>
      </template>
      <template v-else>
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-form-item label="设施名称：" prop="facilitiesName">
            <el-input v-model="form.facilitiesName" placeholder="请输入设施名称" />
          </el-form-item>
          <el-form-item label="主题单位：" prop="unitName">
            <el-input v-model="form.unitName" placeholder="请输入主题单位名称" />
          </el-form-item>
          <el-form-item label="地址：" prop="address">
            <el-input v-model="form.address" placeholder="请输入内容" />
          </el-form-item>
          <el-form-item label="介绍：" prop="introduction">
            <el-input v-model="form.introduction" type="textarea"  :autosize="{ minRows: 3, }" placeholder="请输入内容" />
          </el-form-item>
          <el-form-item label="设施照片：" prop="fileUrl">
            <image-upload v-model="form.fileUrl"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <RecordsDialog @close="recordsDialogClose" :visible="addRecords" :form="form"/>
  </div>
</template>

<script>
import { listMemorialFacilities, getMemorialFacilities, delMemorialFacilities, addMemorialFacilities, updateMemorialFacilities } from "@/api/worship/memorialFacilities";
import { listMemorialFacilitiesMtLogs,updateMemorialFacilitiesMtLogs,addMemorialFacilitiesMtLogs,delMemorialFacilitiesMtLogs } from '@/api/worship/memorialFacilitiesMtLogs'
import { listByIds } from '@/api/system/oss';
import RecordsDialog from './recordsDialog'
export default {
  name: "MemorialFacilities",
  components:{ RecordsDialog },
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
      // 纪念设施表格数据
      memorialFacilitiesList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        facilitiesName: undefined,
        searchValue: undefined
      },
      // 表单参数
      form: {},
      srcList:[],
      recordsList:[],
      addRecords:false,
      recordsTitle:'',
      // 表单校验
      rules: {
        facilitiesName: [
          { required: true, message: "设施名称不能为空", trigger: "blur" }
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询纪念设施列表 */
    getList() {
      this.loading = true;
      listMemorialFacilities(this.queryParams).then(response => {
        this.memorialFacilitiesList = response.rows;
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
        delFlag: undefined,
        facilitiesName: undefined,
        unitName: undefined,
        address: undefined,
        introduction: undefined,
        fileUrl: undefined
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
      this.title = "添加纪念设施";
    },
    /** 详情按钮操作 */
    handleDetail(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids
      getMemorialFacilities(id).then(async response => {
        this.loading = false;
        this.form = response.data;
        await this.getImgList()
        this.open = true;
        this.title = "设施详情";
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids
      getMemorialFacilities(id).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改纪念设施";
      });
    },
    async getImgList() {
      if(this.form.fileUrl){
        const { data } = await listByIds(this.form.fileUrl);
        this.srcList = data.map((item) => item.url);
      }
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateMemorialFacilities(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addMemorialFacilities(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除纪念设施编号为"' + ids + '"的数据项？').then(() => {
        this.loading = true;
        return delMemorialFacilities(ids);
      }).then(() => {
        this.loading = false;
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      }).finally(() => {
        this.loading = false;
      });
    },
    handleRecords(row){
      this.loading = true;
      this.reset();
      this.form = {
        facilitiesId: row.id
      }
      this.addRecords = true
      this.loading = false;
    },
    recordsDialogClose(){
      this.addRecords = false
      this.getList()
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

.table {
  background: #fff;
  margin: 16px 0 0 0;
  padding: 16px;
  box-sizing: border-box;
  height: 699px;
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
.rows{
  display: flex;
  margin-bottom: 24px;
  color: #333333;
  &.title{
    font-weight: 600;
    font-size: 24px;
  }
  & > div{
    white-space: nowrap;
    width: 80px;
    text-align: right;
  }
}
</style>
