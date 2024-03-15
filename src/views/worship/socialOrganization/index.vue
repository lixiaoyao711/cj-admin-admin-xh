<template>
  <div class="app-container">
    <div class="header">社会化组织</div>
    <el-form class="search-form" :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="搜索:" prop="organizationName">
        <el-input
          v-model="queryParams.organizationName"
          placeholder="请输入"
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
        <div class="title-name">组织列表</div>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['worship:socialOrganization:remove']"
            >删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['worship:socialOrganization:add']"
            >新增</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </div>
      <el-table v-loading="loading" :data="socialOrganizationList" @selection-change="handleSelectionChange" style="height: 85%;">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="组织名称" align="center" prop="organizationName" />
        <el-table-column label="组织地址" align="center" prop="organizationAddress" />
        <el-table-column label="组织介绍" align="center" prop="organizationIntroduction" />
        <el-table-column label="组织活动次数" align="center" prop="activitiesNum" >
          <template slot-scope="scope">
             <el-button type="text" size="mini" @click="getActivityList(scope.row.id)">{{ scope.row.activitiesNum }}</el-button>
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
              v-hasPermi="['worship:socialOrganization:edit']"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.row)"
              v-hasPermi="['worship:socialOrganization:remove']"
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
    <!-- 添加或修改社会化组织对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="45%" append-to-body>
      <template v-if="title === '组织详情'">
        <el-row class="rows">
          <el-col :span="24" class="name">{{ form.organizationName }}</el-col>
          <el-col :span="24"><div>组织地址：</div> {{ form.organizationAddress }}</el-col>
          <el-col :span="24"><div>组织介绍：</div> {{ form.organizationIntroduction }}</el-col>
          <el-col :span="24">
            <span class="mr10">活动照片:</span>
            <el-image
              class="mr10"
              v-for="(item, index) in fileList"
              :key="index"
              style="width: 100px; height: 100px"
              :src="fileList[index]"
              :preview-src-list="fileList"
            >
            </el-image>
          </el-col>
        </el-row>
      </template>
      <template v-else>
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-form-item label="组织名称：" prop="organizationName">
            <el-input v-model="form.organizationName" placeholder="请输入组织名称" />
          </el-form-item>
          <el-form-item label="组织地址：" prop="organizationAddress">
            <el-input v-model="form.organizationAddress" placeholder="请输入组织地址" />
          </el-form-item>
          <el-form-item label="组织介绍：" prop="organizationIntroduction">
            <el-input v-model="form.organizationIntroduction" type="textarea" placeholder="请输入内容" />
          </el-form-item>
          <el-form-item label="组织照片：" prop="fileUrl">
            <image-upload v-model="form.fileUrl" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog title="活动记录" :visible.sync="openTable" width="55%" append-to-body @close="getList">
      <el-table v-loading="loading" :data="activityList" @selection-change="handleSelectionChange" style="height: 85%;">
        <el-table-column label="活动标题" align="center" prop="activityTitle" />
        <el-table-column label="活动内容" align="center" prop="activityContent" />
        <el-table-column label="活动地址" align="center" prop="activityAddress" />
        <el-table-column label="活动时间" align="center" prop="activityTime" >
          <template slot-scope="scope">
            {{ parseTime(scope.row.activityTime, '{y}-{m}-{d}') }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleActivityDetail(scope.row)"
            >详情</el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleActivityDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :total="activityTotal"
        :page.sync="query.pageNum"
        :limit.sync="query.pageSize"
        @pagination="getActivityList"
      />
    </el-dialog>
    <!-- 活动详情 -->
    <el-dialog title="活动详情" :visible.sync="infoOpen" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row class="df">
          <el-tag type="info">
            <dict-tag :options="dict.type.sys_worship_activity_fy" :value="form.activityType" />
          </el-tag>
          <span class="info-title">{{ form.activityTitle }}</span>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="组织单位" prop="">
              <span>{{ form.divisionName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="参与人数" prop="">
              <span>{{ form.numOfParticipants }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="活动日期" prop="">
              <span>{{ parseTime(form.activityTime, '{y}-{m}-{d}') }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="活动地址" prop="">
          <span>{{ form.activityAddress }}</span>
        </el-form-item>
        <el-form-item label="活动内容" prop="">
          <span>{{ form.activityContent }}</span>
        </el-form-item>
        <el-row>
          <el-form-item label="活动照片" prop="">
            <el-image
              class="mr10"
              v-for="(item, index) in viewImgList"
              :key="index"
              style="width: 100px; height: 100px"
              :src="viewImgList[index]"
              :preview-src-list="viewImgList"
            >
            </el-image>
        </el-form-item>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { listSocialOrganization, getSocialOrganization, delSocialOrganization, addSocialOrganization, updateSocialOrganization } from "@/api/worship/socialOrganization";
import { listByIds } from '@/api/system/oss';
import {
  listPartyActivities,
  getPartyActivities,
  delPartyActivities,
} from '@/api/worship/cjEvent';
export default {
  name: "SocialOrganization",
  dicts: ['sys_worship_activity','sys_worship_activity_fy'],
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
      // 社会化组织表格数据
      socialOrganizationList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        organizationName: undefined,
      },
      // 表单参数
      form: {},
      fileList:[],
      openTable:false,
      activityList:[],
      activityTotal:0,
      query:{
        pageNum: 1,
        pageSize: 10,
      },
      viewImgList: [],
      infoOpen:false,
      orgId:'',
      // 表单校验
      rules: {
        id: [
          { required: true, message: "主键不能为空", trigger: "blur" }
        ],
        organizationName: [
          { required: true, message: "组织名称不能为空", trigger: "blur" }
        ],
        organizationAddress: [
          { required: true, message: "组织地址不能为空", trigger: "blur" }
        ],
        organizationIntroduction: [
          { required: true, message: "组织介绍不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询社会化组织列表 */
    getList() {
      this.loading = true;
      listSocialOrganization(this.queryParams).then(response => {
        this.socialOrganizationList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    getActivityList(id){
      const ids = id || this.orgId
      this.openTable = true
      this.query['socialOrganizationId'] = this.orgId = ids
      listPartyActivities(this.query).then(response => {
        this.activityList = response.rows;
        this.activityTotal = response.total;
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
        createId: undefined,
        updateId: undefined,
        organizationName: undefined,
        organizationAddress: undefined,
        organizationIntroduction: undefined,
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
      this.title = "添加社会化组织";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids
      getSocialOrganization(id).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改社会化组织";
      });
    },
     /** 详情按钮操作 */
    handleDetail(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids
      getSocialOrganization(id).then(async response => {
        this.loading = false;
        this.form = response.data;
        if(this.form.fileUrl){
          this.fileList = await this.getImgList(this.form.fileUrl)
        }
        this.open = true;
        this.title = "组织详情";
      });
    },
    handleActivityDetail(row){
      this.reset();
      const id = row.id || this.ids
      getPartyActivities(id).then(async response => {
        this.form = response.data;
        if(this.form.activityFileUrl){
          this.viewImgList = await this.getImgList(this.form.activityFileUrl)
        }
        this.infoOpen = true;
      });
    },
    async getImgList(id) {
      const { data } = await listByIds(id);
      let list = data.map((item) => item.url);
      return list
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateSocialOrganization(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addSocialOrganization(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除社会化组织编号为"' + ids + '"的数据项？').then(() => {
        this.loading = true;
        return delSocialOrganization(ids);
      }).then(() => {
        this.loading = false;
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      }).finally(() => {
        this.loading = false;
      });
    },
    /** 删除按钮操作 */
    handleActivityDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除活动编号为"' + ids + '"的数据项？')
        .then(() => {
          return delPartyActivities(ids);
        })
        .then(() => {
          this.getActivityList();
          this.$modal.msgSuccess('删除成功');
        })
        .catch(() => {})
        .finally(() => {
        });
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
  height: 696px;
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
  .name {
    font-weight: 600;
    font-size: 28px;
    margin-right: 12px;
  }
}
.info-title {
  font-size: 18px;
  font-weight: 600;
  color: #333333;
  margin-left: 10px;
}
</style>
