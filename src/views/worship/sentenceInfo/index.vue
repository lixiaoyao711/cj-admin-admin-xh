<template>
  <div class="app-container">
    <div class="header">
      <div>
        <span class="back" @click="$router.push('/index')"> <i class="el-icon-back"> </i> 返回 </span>
        被判刑人员列表
      </div>
      <div class="btns">
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button plain size="mini" @click="handleImport">导入</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button plain size="mini" @click="handleExport('/worship/sentenceInfo/sentenceTemplate', {}, '导入模板')"
              >导入模板下载</el-button
            >
          </el-col>
          <!-- <el-col :span="1.5">
            <el-button plain size="mini" @click="handleExport('/worship/petitionInfo/export', '信访咨询动态')"
              >导出</el-button
            >
          </el-col> -->
        </el-row>
      </div>
    </div>
    <div class="tabs">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="(item, index) in tabsMap" :key="item.name" :name="item.name">
          <span slot="label"
            >{{ item.label }}<span class="num">({{ item.count }})</span></span
          ></el-tab-pane
        >
      </el-tabs>
    </div>
    <component :is="activeName" @getList="getCount"></component>

    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="700px" append-to-body>
      <div class="dialog-box">
        <div class="upload-box">
          <el-upload
            ref="upload"
            :limit="1"
            accept=".xlsx, .xls"
            :headers="upload.headers"
            :action="upload.url"
            :disabled="upload.isUploading"
            :on-progress="handleFileUploadProgress"
            :on-success="handleFileSuccess"
            drag
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip text-center" slot="tip"></div>
          </el-upload>
          <div class="view-table">
            <div class="table-left">
              <span>查询人数:{{ importData.importRows }}人</span>
              <span>查到被判刑人员:{{ importData.sentenceRows }}人</span>
            </div>
            <div class="table-right">
              再次查询会清空当前结果
              <el-button
                :disabled="!tableData.length"
                plain
                size="mini"
                @click="handleExport('/worship/sentenceInfo/export', queryParams, '判刑人员')"
                >导出</el-button
              >
            </div>
          </div>
          <el-table :data="tableData" height="300px" class="mt10">
            <el-table-column label="姓名" align="center" prop="name" />
            <el-table-column label="身份证号" align="center" prop="idCard" />
            <el-table-column label="手机号" align="center" prop="phone" />
            <el-table-column label="判刑次数" align="center" prop="sentenceCount">
              <template slot-scope="scope">
                <el-button @click="openCount(scope.row)" size="mini" type="text">
                  {{ scope.row.sentenceCount }}
                </el-button>
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
      </div>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button type="primary" @click="submitFileForm">确 定</el-button> -->
        <el-button @click="uploadCancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 添加或修改现役军人家属对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-table :data="formTable" height="56vh">
        <el-table-column label="判刑内容" align="center" prop="judgmentResult" />
        <el-table-column label="判刑时间" align="center" prop="judgmentTime" />
      </el-table>
      <pagination
        :total="formTotal"
        :page.sync="formQuery.pageNum"
        :limit.sync="formQuery.pageSize"
        @pagination="openCount(form)"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancel('open')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryBasicInfoPageList, listSentenceInfo } from '@/api/worship/sentenceInfo.js';
import { getToken } from '@/utils/auth';

import retired from './retired';
import other from './other';
import active from './active';
export default {
  components: {
    retired,
    other,
    active,
  },
  data() {
    return {
      tabsMap: [
        {
          label: '退役军人',
          name: 'retired',
          count: 0,
        },
        {
          label: '其他优抚对象',
          name: 'other',
          count: 0,
        },
        {
          label: '现役军人家属',
          name: 'active',
          count: 0,
        },
      ],
      activeName: 'retired',
      tableData: [],
      formTable: [],
      importData: {
        importRows: 0,
        sentenceIdCards: '',
        sentenceRows: 0,
      },
      queryParams: {
        pageNum: 1,
        pageSize: 5,
        sentenceIdCard: '',
      },
      formQuery: {
        pageNum: 1,
        pageSize: 10,
      },
      title: '',
      total: 0,
      formTotal: 0,
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: '',
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: 'Bearer ' + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + '/worship/sentenceInfo/importData',
      },
      open: false,
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.user;
    },
  },
  watch: {},
  created() {
    this.activeName = this.$route.query.tab || 'retired';
  },
  mounted() {
    this.getCount(this.userInfo.divisionCode);
  },
  methods: {
    getList() {
      queryBasicInfoPageList(this.queryParams).then((res) => {
        this.tableData = res.rows;
        this.total = res.total;
      });
    },
    getCount(divisionCode) {
      console.log('divisionCode', divisionCode);
      this.tabsMap.forEach((item, index) => {
        queryBasicInfoPageList({
          divisionCode,
          attribute: index + 1,
        }).then((res) => {
          item.count = res.total;
        });
      });
    },
    /**查看判刑记录 */
    openCount(row) {
      this.formQuery.personId = row.id;
      listSentenceInfo(this.formQuery).then((response) => {
        this.formTable = response.rows;
        this.formTotal = response.total;
        this.open = true;
        this.title = '判刑记录';
      });
    },
    handleClick(vm) {
      this.$router.replace({
        path: '',
        query: {
          tab: vm.name,
        },
      });
    },
    /** 导出按钮操作 */
    handleExport(path, query, name) {
      this.download(path, query, `${name}_${new Date().getTime()}.xlsx`);
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = '用户导入';
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download('system/user/importTemplate', {}, `user_template_${new Date().getTime()}.xlsx`);
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      // this.upload.open = false;
      console.log('response', response);
      this.importData = response.data;
      this.queryParams.sentenceIdCard = response.data.sentenceIdCards;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.getList();
      // this.$alert(
      //   "<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" +
      //     response.msg +
      //     '</div>',
      //   '导入结果',
      //   { dangerouslyUseHTMLString: true }
      // );
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
    cancel(key) {
      this[key] = false;
    },
    uploadCancel() {
      this.upload.open = false;
      this.tableData = [];
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  .back {
    font-weight: 400;
    font-size: 16px;
    margin-right: 20px;
    margin-top: 2px;
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
  margin: 16px 0 0 0;
  padding: 16px;
  box-sizing: border-box;
  // height: 544px;

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

.el-icon-location-information {
  font-size: 24px;
  margin: 5px 0 0 18px;
  cursor: pointer;
}
.df {
  display: flex;
  align-items: center;
  .el-icon-setting {
    font-size: 20px;
    cursor: pointer;
  }
}

.longTerm {
  margin: 0 0 0 16px;
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
.dialog-box {
  display: flex;
  justify-content: center;
  .upload-box {
    width: 600px;
    text-align: center;
  }
  .view-table {
    display: flex;
    justify-content: space-between;
    .table-right {
      color: red;
    }
  }
}
</style>
