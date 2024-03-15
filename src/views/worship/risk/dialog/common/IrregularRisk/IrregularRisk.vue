<template>
  <div class="index">
    <div class="toolbar">
      <el-form :model="query" ref="form" :inline="true">
        <div class="left">
          <el-form-item label="行政区划:" prop="divisionCode">
            <!-- length>1是社区权限角色,直接禁用,不能筛选 -->

            <TreeSelectDivision
              v-model="query.divisionCode"
              @treeselectChange="(e) => treeselectChange(e, query, 'divisionCode')"
            ></TreeSelectDivision>
          </el-form-item>
          <el-form-item label="选择日期:" prop="divisionCode">
            <el-date-picker
              v-model="query.searchTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
        </div>
        <div class="right">
          <el-button type="text">
            <el-upload
              class="upload"
              :action="uploadFileUrl"
              :show-file-list="false"
              :headers="headers"
              :on-success="uploadSuccess"
            >
              <el-button type="primary" slot="trigger">{{ uploadNameMap[query.type] }}</el-button>
            </el-upload>
          </el-button>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </el-form>
    </div>
    <div class="table">
      <el-tabs v-model="query.type" @tab-click="subTabClick">
        <el-tab-pane label="报告模板" name="0" v-if="userinfo.divisionLevel === '3'">
          <reportTemplate :propsQuery="query" ref="reportTemplate" />
        </el-tab-pane>
        <el-tab-pane label="报告列表" name="1">
          <reportList :propsQuery="query" ref="reportList" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { addRiskFile } from '@/api/worship/risk';
import reportTemplate from './reportTemplate.vue';
import reportList from './reportList.vue';
import { getToken } from '@/utils/auth';

export default {
  props: {},
  components: {
    reportList,
    reportTemplate,
  },
  data() {
    return {
      uploadFileUrl: process.env.VUE_APP_BASE_API + '/system/oss/upload', // 上传文件服务器地址

      query: {
        divisionCode: '',
        type: '0',
        searchTime: null,
      },
      subTab: '0',
      uploadNameMap: {
        0: '上传模板',
        1: '上传报告',
      },
      headers: {
        Authorization: 'Bearer ' + getToken(),
      },
    };
  },
  computed: {
    userinfo() {
      return this.$store.state.user;
    },
  },
  watch: {
    userinfo() {
      this.query.divisionCode = this.userinfo.divisionCode;
    },
  },
  created() {
    this.query.divisionCode = this.userinfo.divisionCode;
    this.query.type = this.$route.query.subTab || '1';
  },
  mounted() {},
  methods: {
    search() {
      if (this.query.type == '0') {
        this.$refs.reportTemplate.getList();
      }
      if (this.query.type == '1') {
        this.$refs.reportList.getList();
      }
    },
    reset() {
      this.query.searchTime = null;
      this.query.divisionCode = this.userinfo.divisionCode;
      setTimeout(() => {
        this.search();
      }, 200);
    },
    //导入
    uploadSuccess(data, file) {
      // let divisionCode = getFormDepartCode(this.userinfo.divisionCode).divisionCode;
      // let departName = getFormDepartCode(this.userinfo.divisionCode).departName;
      addRiskFile({
        ...this.query,
        filePath: data.data.ossId,
        fileName: file.name,
      }).then((res) => {
        this.$message.success('上传成功');
        if (this.query.type == '0') {
          this.$refs.reportTemplate.getList();
        }

        if (this.query.type == '1') {
          this.$refs.reportList.getList();
        }
      });
      // axios({
      //   url: '/riskFile/add',
      //   method: 'post',
      //   data: {
      //     ...this.query,
      //     filePath: data.data.url,
      //     fileName: file.name,
      //   },
      // }).then((res) => {
      //   this.$message.success('上传成功');
      //   if (this.query.type == '0') {
      //     this.$refs.reportTemplate.getList();
      //   }
      //   if (this.query.type == '1') {
      //     this.$refs.reportList.getList();
      //   }
      // });
    },
    subTabClick(vm) {
      this.$router.replace({
        name: '',
        query: {
          ...this.$route.query,
          subTab: vm.name,
        },
      });
    },
  },
};
</script>

<style scoped lang="scss">
.index {
  .toolbar {
    .el-form {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    display: flex;
    align-items: center;
    background: #fff;
    height: 60px;
    padding: 0 24px;
    ::v-deep .el-form {
      width: 100%;
      display: flex;
      justify-content: space-between;
      .el-form-item {
        margin-bottom: 0;
      }
      .el-input {
        width: 12vw;
      }
      .el-select {
        .el-input {
          width: 8vw;
        }
      }
    }
  }
  .table {
    height: 70vh;
    background: #fff;
    margin-top: 16px;
    padding: 6px 24px;
  }
}
</style>
