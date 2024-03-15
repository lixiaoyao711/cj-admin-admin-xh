<template>
  <el-dialog :visible.sync="visible" title="维护记录" width="50%" :modal="false" append-to-body @close="$emit('close')">
    <div class="btn">
      <el-button
        type="primary"
        plain
        icon="el-icon-plus"
        size="small"
        @click="handleAddRecords"
      >新增维护记录</el-button>
    </div>
    <el-table :data="recordsList" 
      header-row-class-name="table-header"
      :header-cell-style="{background:'rgba(0, 0, 0, 0.02)'}"
      max-height="500"
      :border="false"
      size="medium"
      style="width: 100%;height:100%">
      <el-table-column prop="content" label="维护内容" width=""></el-table-column>
      <el-table-column prop="fileUrl" label="照片" width="">
        <template slot-scope="scope">
          <image-preview :src="scope.row.file" :width="50" :height="50" />
        </template>
      </el-table-column>
      <el-table-column prop="maintenanceTime" label="维护时间" width="150">
        <template slot-scope="scope">
          {{ parseTime(scope.row.maintenanceTime, '{y}-{m}-{d}') }}
        </template>
      </el-table-column>
      <el-table-column prop="activityTime" label="操作" width="">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleUpdateRecords(scope.row)"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleDeleteRecords(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getRecordsList"
      />
    <el-dialog :title="recordsTitle" :visible.sync="addRecords" width="40%" append-to-body>
      <el-form ref="form" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="维护时间：" prop="maintenanceTime">
          <el-date-picker clearable
            v-model="formData.maintenanceTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择维护时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="维护内容：" prop="content">
          <el-input v-model="formData.content" type="textarea" row="3" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="设施照片：" prop="fileUrl">
          <image-upload v-model="formData.fileUrl"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script>
import { listMemorialFacilitiesMtLogs,updateMemorialFacilitiesMtLogs,addMemorialFacilitiesMtLogs,delMemorialFacilitiesMtLogs } from '@/api/worship/memorialFacilitiesMtLogs'
import { listByIds } from '@/api/system/oss';
export default {
  dicts: ['sys_worship_activity','sys_user_sex'],
  props: ['title','form','visible'],
  components: {},
  data() {
    return {
      dialogVisible: true,
      srcList:[],
      recordsList:[],
      addRecords:false,
      recordsTitle:'',
      total:0,
      buttonLoading:false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      formData:{},
      rules: {
        maintenanceTime: [
          { required: true, message: "维护时间不能为空", trigger: "blur" }
        ],
      }
    };
  },
  computed: {},
  watch: {
    form(nv,ov){
      if(nv.facilitiesId){
        this.getRecordsList()
      }
    }
  },
  mounted() {
    // this.getRecordsList()
  },
  methods: {
    getRecordsList() {
      let query = Object.assign({},this.queryParams,this.form)
      listMemorialFacilitiesMtLogs(query).then(async response => {
        this.recordsList = await Promise.all(response.rows.map(async item => {
          if(item.fileUrl){
            let url = await this.getImgList(item.fileUrl)
            item.file = url[0]
          }
          return item;
        }))
        this.total = response.total;
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
          this.formData.facilitiesId = this.form.facilitiesId
          if (this.formData.id != null) {
            updateMemorialFacilitiesMtLogs(this.formData).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.addRecords = false
              this.getRecordsList();
              this.formData = {}
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addMemorialFacilitiesMtLogs(this.formData).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.addRecords = false
              this.getRecordsList();
              this.formData = {}
            }).finally(() => {
              this.buttonLoading = false;
            });
          }
        }
      });
    },
    reset() {
      this.formData = {
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
    handleAddRecords() {
      this.reset();
      this.addRecords = true;
      this.recordsTitle = "新建维护记录";
    },
    handleUpdateRecords(row){
      this.reset();
      this.formData = row;
      this.addRecords = true;
      this.recordsTitle = "修改维护记录";
    },
    handleDeleteRecords(row){
      this.$modal.confirm('是否确认删除维护记录编号为"' + row.id + '"的数据项？').then(() => {
        return delMemorialFacilitiesMtLogs(row.id);
      }).then(() => {
        this.getRecordsList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      }).finally(() => {
      });
    },
    // 取消按钮
    cancel() {
      this.addRecords = false;
      this.form = {}
    }
  },
  
};
</script>

<style lang="scss" scoped>
.rows{
  .name{
    font-weight: 600;
    font-size: 24px;
    margin: 0 12px;
  }
  .attach{
    margin-right: 20px;
    white-space: nowrap;
    display: inline-block;
  }
  .el-col{
    margin-bottom: 24px;
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

.title{
  font-size: 16px;
  font-weight: 500;
  color: #000000;
  margin-bottom: 24px;
  &.lastTitle{
    margin-top: 24px;
  }
}
.btn{
  float: right;
  margin-bottom: 12px;
}
</style>
