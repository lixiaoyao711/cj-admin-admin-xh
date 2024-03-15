<template>
  <div class="app-container">
    <div class="header">领导批示</div>
    <div class="tabs">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="我发出的" name="0"></el-tab-pane>
        <el-tab-pane label="我收到的" name="1"></el-tab-pane>
      </el-tabs>
    </div>
    <el-form
      class="search-form"
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width=""
    >
      <el-form-item label="任务状态：" prop="status">
        <el-select v-model="queryParams.status" @keyup.enter.native="handleQuery" clearable>
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in statusOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="search-right">
        <el-form-item prop="content">
          <el-input placeholder="请输入搜索关键字" v-model="queryParams.content" maxlength="100"></el-input>
        </el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="table">
      <div class="table-left">
        <div class="table-title-box">
          <div class="title-name">批示列表</div>
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button
                type="primary"
                plain
                icon="el-icon-plus"
                size="mini"
                @click="handleAdd"
                v-hasPermi="['worship:leaderInstruction:add']"
                >新增</el-button
              >
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
          </el-row>
        </div>
        <el-table
          v-loading="loading"
          :data="leaderInstructionList"
          border
          highlight-current-row
          row-key="id"
          height="calc(100% - 80px)"
          :current-row-key="currentRowKey"
          @row-click="handleDetail"
        >
          <el-table-column label="批示内容" align="center" prop="content" />
          <el-table-column label="接收单位" align="center" prop="receiveDepartment" />
          <el-table-column label="当前状态" align="center" prop="status" width="120">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status === '1' ? 'success' : 'danger'">
                <span>{{ scope.row.status ? statusOption[scope.row.status].label : '' }}</span>
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                @click="handleDetail(scope.row)"
                v-hasPermi="['worship:leaderInstruction:detail']"
                >详情</el-button
              >
              <el-button
                size="mini"
                type="text"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['worship:leaderInstruction:edit']"
                >修改</el-button
              >
              <el-button
                size="mini"
                type="text"
                @click="handleDeleteInstruction(scope.row)"
                v-hasPermi="['worship:leaderInstruction:remove']"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryParams.pageNum"
            :page-sizes="[10, 15, 30, 50, 100]"
            :page-size="queryParams.pageSize"
            layout="total, prev, pager, next"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>
      <div class="table-right">
        <div class="top">
          <div class="title">批示详情</div>
          <div class="state" v-if="activeRow.id">
            当前状态
            <el-tag :type="activeRow.status === '1' ? 'success' : 'danger'">
              {{ activeRow.status ? statusOption[activeRow.status].label : '' }}
            </el-tag>
          </div>
        </div>
        <div class="detail" v-if="activeRow.id">
          <div class="info">
            <div class="line">发送者：{{ activeRow.createBy }}</div>
            <div class="line">发送时间：{{ activeRow.createTime }}</div>
            <div class="line">批示内容：{{ activeRow.content }}</div>
          </div>
          <div class="title">
            反馈内容
            <span class="title-right" v-if="activeName === '0'">{{
              `已反馈${activeRow.feedbackCount}  未反馈 ${activeRow.noFeedbackCount}`
            }}</span>
          </div>
          <div class="content">
            <template v-if="activeRow.feedbackList.length > 0 && !editModel">
              <div
                v-for="item in activeRow.feedbackList"
                :key="item.id"
                :class="{ 'feedback-content': activeName === '0' }"
              >
                <div class="feedback">{{ item.content }}</div>
                <div class="imgs">
                  <el-image
                    v-for="(img, index) in item.urlList"
                    :key="index"
                    style="width: 100px; height: 100px"
                    :src="img"
                    :preview-src-list="[item.urlList]"
                  >
                  </el-image>
                </div>
                <p class="date">
                  <span v-if="activeName === '0'">{{ item.divisionName }}</span> {{ item.updateTime }}
                </p>
                <el-button v-if="activeName === '1'" @click="handleUpdateFeedback(item)">修改</el-button>
                <el-button v-if="activeName === '1'" @click="handleDelete(item)">删除</el-button>
              </div>
            </template>
            <template v-else-if="activeName === '1' && editModel">
              <div class="feedback">
                <el-input type="textarea" maxlength="500" v-model="feedbackData.content" rows="5"></el-input>
              </div>
              <div class="upload">
                <image-upload v-model="feedbackData.fileUrl" />
              </div>
              <el-button v-if="activeName === '1'" @click="handleSave">反馈</el-button>
            </template>
            <template v-else>
              <p>暂无反馈</p>
              <el-button v-if="activeName === '1'" @click="editModel = true">反馈</el-button>
            </template>
          </div>
        </div>
      </div>
    </div>
    <el-dialog :title="title" :visible.sync="open" width="40%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="批示内容：" prop="content">
          <el-input v-model="form.content" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="接收单位：" prop="divisionCode">
          <treeselect
            @select="treeselectChange"
            @input="treeChange"
            class="tree-select"
            v-model="form.divisionCode"
            :options="divisionMap"
            placeholder="请选择"
            :defaultExpandLevel="0"
            :normalizer="normalizer"
          />
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
import {
  listLeaderInstruction,
  getLeaderInstruction,
  delLeaderInstruction,
  addLeaderInstruction,
  updateLeaderInstruction,
} from '@/api/worship/leaderInstruction';
import {
  listLeaderInstructionFeedback,
  addLeaderInstructionFeedback,
  delLeaderInstructionFeedback,
  updateLeaderInstructionFeedback,
} from '@/api/worship/leaderInstructionFeedback';
import { listByIds } from '@/api/system/oss';
import Treeselect from '@riophae/vue-treeselect';
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
export default {
  name: 'LeaderInstruction',
  components: {
    Treeselect,
  },
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
      // 领导批示表格数据
      leaderInstructionList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      editModel: false,
      activeName: '0',
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        content: undefined,
        feedbackFileUrl: undefined,
        status: undefined,
      },
      activeRow: {},
      currentRowKey: '',
      fileList: [],
      // 表单参数
      form: {},
      statusOption: [
        {
          label: '未反馈',
          value: '0',
        },
        {
          label: '已反馈',
          value: '1',
        },
        {
          label: '部分反馈',
          value: '2',
        },
      ],
      divisionMap: [],
      feedbackData: {},
      normalizer(node) {
        if (node.level == 5) {
          delete node.children;
        }
        return {
          id: node.weight,
          children: node.children,
        };
      },
      rules: {
        content: [{ required: true, message: '批示内容不能为空', trigger: 'blur' }],
        divisionCode: [{ required: true, message: '接收单位不能为空', trigger: 'blur' }],
      },
    };
  },
  computed: {
    hasAuth() {
      return this.$store.state.user.divisionCode;
    },
  },
  created() {
    this.getList();
    this.handleMap();
  },
  methods: {
    /** 查询领导批示列表 */
    getList() {
      this.loading = true;
      this.fileList = [];
      let formData = Object.assign({}, this.queryParams, {
        queryType: this.activeName,
      });
      listLeaderInstruction(formData).then((response) => {
        this.leaderInstructionList = response.rows;
        this.total = response.total;
        this.loading = false;
        // 有数据默认显示第一条,无数据则清空
        if (!this.leaderInstructionList.length) {
          this.currentRowKey = '';
          this.activeRow = {};
          return;
        }
        let row = {
          id: this.currentRowKey || this.leaderInstructionList[0].id,
        };
        this.handleDetail(row);
        console.log('this.activeRow', this.activeRow);
      });
    },
    async getImgUrl(id) {
      let backData = [];
      backData = await listByIds(id).then((res) => {
        backData = this.fileList = res.data.map((oss) => oss.url);
        console.log('fileList', this.fileList);
        return this.fileList;
      });
      return backData;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = `新增批示`;
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
        divisionCode: undefined,
        divisionName: undefined,
        content: undefined,
        feedback: undefined,
        feedbackFileUrl: undefined,
        status: undefined,
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
    // 反馈内容上传
    handleSave() {
      let formData = Object.assign({}, this.feedbackData, {
        instId: this.activeRow.id,
        divisionCode: this.$store.state.user.divisionCode,
        receiveDepartment: this.activeRow.receiveDepartment,
        divisionName: this.$store.state.user.divisionName,
      });
      if (!formData.content) {
        this.$message.warning('请输入反馈内容');
        return;
      }
      formData.status = '1';
      console.log(formData);
      if (formData.id != null) {
        updateLeaderInstructionFeedback(formData)
          .then((response) => {
            this.$modal.msgSuccess('修改成功');
            this.editModel = false;
            this.handleDetail(this.activeRow);
            this.getList();
          })
          .finally(() => {
            this.buttonLoading = false;
          });
      } else {
        formData.status = '0';
        addLeaderInstructionFeedback(formData)
          .then((response) => {
            this.$modal.msgSuccess('新增成功');
            this.editModel = false;
            this.handleDetail(this.activeRow);
            this.getList();
          })
          .finally(() => {
            this.buttonLoading = false;
          });
      }
    },
    // 反馈内容删除
    handleDelete(item) {
      delLeaderInstructionFeedback(item.id).then((res) => {
        this.$message.success('删除成功');
        this.handleDetail(this.activeRow);
        this.getList();
        this.feedbackData = {};
        this.editModel = false;
      });
    },
    // 修改反馈内容
    handleUpdateFeedback(row) {
      this.feedbackData = row;
      this.editModel = true;
    },
    // tab
    handleClick() {
      this.resetQuery();
    },
    // 查看批示详情
    handleDetail(row) {
      this.currentRowKey = row.id;
      let query = {
        id: row.id,
        queryType: this.activeName,
      };
      getLeaderInstruction(query).then((response) => {
        this.activeRow = response.data;
        if (this.activeRow.feedbackList.length > 0) {
          this.activeRow.feedbackList.forEach(async (e) => {
            const url = await this.getImgUrl(e.fileUrl);
            console.log('url', url);
            e.urlList = url;
          });
          console.log('activeRow', this.activeRow);
        }
      });
    },
    currentChange(currentRow, oldCurrentRow) {
      this.currentRowKey = currentRow ? currentRow.id : '';
    },
    handleCurrentChange(val) {
      this.queryParams.pageNum = val;
      this.getList();
    },
    handleSizeChange(val) {
      this.queryParams.pageSize = val;
      this.getList();
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          let formData = Object.assign({}, this.form);
          if (formData.id != null) {
            updateLeaderInstruction(formData)
              .then((response) => {
                this.$modal.msgSuccess('修改成功');
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else {
            formData.status = '0';
            addLeaderInstruction(formData)
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
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      let query = {
        id: row.id,
        queryType: this.activeName,
      };
      getLeaderInstruction(query).then((response) => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = '修改批示';
      });
    },
    /** 批示删除按钮操作 */
    handleDeleteInstruction(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除批示编号为"' + ids + '"的数据项？')
        .then(() => {
          this.loading = true;
          return delLeaderInstruction(ids);
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
    treeselectChange(node) {
      this.form.receiveDepartment = node.name || node.label;
    },
    treeChange() {},
    handleMap() {
      let mapList = JSON.parse(JSON.stringify(this.$store.getters.divisionsTreeList[0].children));
      let level = this.$store.state.user.divisionLevel;
      let divisionName = this.$store.state.user.divisionName;
      let allStreetCode = mapList.map((e) => e.weight).join(',');
      this.divisionMap = mapList.map((e) => {
        if (e.label !== '全部街道本级') {
          e.children &&
            e.children.length > 0 &&
            e.children.forEach((f) => {
              f.name = e.label + '-' + f.label;
            });
          let code = e.children.map((e) => e.weight).join(',');
          e.children.unshift({
            label: '全部村社本级',
            level: 5,
            weight: code,
            name: e.label + '所有社区',
          });
        }
        return e;
      });
      if (level == 3) {
        this.divisionMap.unshift({
          label: '全部街道本级',
          level: 4,
          weight: allStreetCode,
          name: '所有镇街',
        });
      } else if (level == 4) {
        this.divisionMap.unshift({
          label: divisionName + '全部社区本级',
          level: 5,
          weight: allStreetCode,
          name: divisionName + '所有社区',
        });
      }
      console.log(this.divisionMap);
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
.tabs {
  display: flex;
  line-height: 40px;
  .el-tabs {
    margin: 0 20px 0 0;
  }
}
::v-deep .el-tabs__nav-wrap::after {
  height: 0px !important;
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
  margin: 16px 0 0 0;
  box-sizing: border-box;
  display: flex;
  height: 642px;
  width: 100%;
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
  }
  .title {
    font-size: 16px;
    font-weight: bold;
    .title-right {
      margin-left: 24px;
      font-size: 14px;
      font-weight: 400;
    }
  }
  .content {
    height: 400px;
    overflow-y: auto;
    .feedback-content {
      border-bottom: 1px solid #efefef;
      &:last-child {
        border: none;
      }
    }
  }
  .table-left {
    margin-right: 16px;
    flex: 4;
    .table-title-box {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      .title-name {
        font-family: PingFangSC-Medium;
        font-weight: 600;
        font-size: 18px;
        color: #333333;
      }
    }
  }
  .table-right {
    flex: 6;
    .line {
      line-height: 40px;
    }
  }
  .date {
    font-size: 12px;
    color: #777;
  }
  .imgs {
    img {
      width: 100px;
      height: 100px;
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }
}
.el-icon-location-information {
  font-size: 24px;
  margin: 5px 0 0 18px;
  cursor: pointer;
}
.table .table-left,
.table .table-right {
  background: #fff;
  padding: 16px 24px;
}
.table .feedback,
.table .upload,
.table .date {
  margin: 16px 0;
}
.pagination {
  text-align: center;
}
</style>
