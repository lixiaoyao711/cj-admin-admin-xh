<template>
  <div class="helpingDynamics" @click="hideMaskPopup">
    <div class="content">
      <div class="list mt10" v-for="(item, index) in supportList" :key="index">
        <div class="item">
          <div class="item-value">
            <span>申请人:</span>
            <span>{{ item.beneficiariesName }}</span>
          </div>
          <div class="item-value">
            <span>行政区划：</span>
            <span>{{ item.beneficiariesDivisionName }}</span>
          </div>
          <div class="item-value">
            <span>申请金额:</span>
            <span>{{ item.applicationAmount }}</span>
          </div>
          <div class="item-value">
            <span>申请时间:</span>
            <span>{{ item.createTime }}</span>
          </div>
          <div class="item-value">
            <span>所属项目： </span>
            <span>{{ item.entryName }}</span>
          </div>
          <div class="item-value">
            <span>登记人：</span>
            <span>{{ item.createName }}</span>
          </div>
          <div class="item-value" v-if="item.currentLink != 4">
            <span>审批内容：</span>
            <span @click="openView(item)" class="view">查看基本材料</span>
          </div>
          <div class="item-value" v-else>
            <span>审批内容：</span>
            <span @click="openView(item, 'communityUrl')" class="view">查看公示书</span>
          </div>
          <div class="item-value">
            <span>审批记录：</span>
            <span @click.stop="showLine(item, index)" class="view"> 查看</span>
            <transitionRecord :propsData="item" />
          </div>
        </div>
        <div class="btn-box df">
          <template v-if="item.currentLink == 3">
            <el-upload
              class="upload-demo mr10"
              :action="uploadFileUrl"
              :on-preview="handlePreview"
              :on-remove="(e, b) => handleRemove(item, e, b)"
              :before-remove="beforeRemove"
              :file-list="fileList"
              multiple
              :limit="3"
              :headers="headers"
              :on-exceed="handleExceed"
              :on-success="(e, b, c) => handleSuccess(item, e, b, c)"
            >
              <el-button size="mini" type="primary">上传公示书</el-button>
            </el-upload>
            <el-button @click="passItem(item, 1)" type="primary" size="mini">通过</el-button>
            <el-button @click="openInfo(item)" class="mr10" size="mini">详情</el-button>
          </template>
          <template v-else>
            <el-button @click="passItem(item, 1)" type="primary" size="mini">通过</el-button>
            <el-button @click="passItem(item, 0)" type="primary" size="mini">不通过</el-button>
            <el-button @click="openInfo(item)" class="mr10" size="mini">详情</el-button>
          </template>
        </div>
      </div>
    </div>
    <pagination
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <!-- 添加或修改测试单表对话框 -->
    <el-dialog title="资料详情" :visible.sync="open" width="900px" append-to-body>
      <div class="dialog-content">
        <div class="dialog-title">{{ form.beneficiariesName }}</div>
        <div class="image-box" v-if="form.currentLink != 4">
          <div class="image-title">基本材料</div>
          <div class="image-list">
            <div class="image-item" v-for="(item, index) in urlMap" :key="index">
              <ImagePreview v-if="form[index + 'Path']" :width="100" :height="100" :src="form[index + 'Path']" />
              <div class="image-name">{{ item }}</div>
            </div>
          </div>
        </div>
        <div class="image-box" v-else>
          <div class="image-title">公示书</div>
          <div class="image-list">
            <div v-if="form.communityUrl">
              <ImagePreview v-if="form.communityUrlPath" :width="100" :height="100" :src="form.communityUrlPath" />
              <div class="image-name">公示书</div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('open')">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 通过核实意见 -->
    <el-dialog title="通过核实意见" :visible.sync="passOpen" width="600px" append-to-body>
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="申请金额" prop="">
          <el-input v-model="form.applicationAmount"></el-input>
        </el-form-item>
        <el-form-item label="" prop="">
          <el-input v-model="form.handlingOpinions" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>

        <el-button @click="cancel('passOpen')">取 消</el-button>
      </div>
    </el-dialog>
    <itemInfo v-if="itemInfoOpen" :propsData="propsData" @close="itemInfoOpen = false" />
  </div>
</template>

<script>
import {
  assistancePendingList,
  changeAssistanceApplication,
  updateAssistanceApplication,
} from '@/api/worship/careFund';
import { listByIds } from '@/api/system/oss';
import itemInfo from '../dialog/itemInfo.vue';
import transitionRecord from '../dialog/transitionRecord.vue';
import { getToken } from '@/utils/auth';

export default {
  name: 'PartyStudyFile',
  dicts: [
    'sys_worship_visitingmethods',
    'sys_worship_assistancemeasures',
    'sys_worship_difficultytype',
    'sys_worship_difficultytype',
  ],
  components: {
    itemInfo,
    transitionRecord,
  },
  data() {
    return {
      uploadFileUrl: process.env.VUE_APP_BASE_API + '/system/oss/upload', // 上传文件服务器地址

      url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      srcList: [
        'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
        'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg',
      ],
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
      // 学习内容文件表格数据
      supportList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      passOpen: false,
      itemInfoOpen: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      headers: {
        Authorization: 'Bearer ' + getToken(),
      },
      // 表单参数
      form: {},
      propsData: {},
      activeName: '1',
      srcList: [],
      helpMethodStr: [],
      fileMap: {
        idCardUrl: '身份证或居住证',
        householdBookUrl: '户口薄或租房合同',
        medicalHistoryUrl: '病历或诊断证明',
        basicMedicalInsuranceUrl: '基本医疗保险查询单',
        retiredSoldierAssistanceUrl: '退役士兵证或退役证',
        communityUrl: '社区公示书',
      },
      urlMap: {
        idCardUrl: '身份证或居住证',
        householdBookUrl: '户口薄或租房合同',
        medicalHistoryUrl: '病历或诊断证明',
        basicMedicalInsuranceUrl: '基本医疗保险查询单',
        retiredSoldierAssistanceUrl: '退役士兵证或退役证',
      },
      isShowLineIndex: '0',
      fileList: [],
    };
  },
  created() {
    this.getList();
  },
  computed: {},
  methods: {
    /** 查询学习内容文件列表 */
    getList() {
      this.loading = true;
      assistancePendingList(this.queryParams).then(async (response) => {
        this.supportList = response.rows;
        for await (const item of this.supportList) {
          this.$set(item, 'isShowLine', false);

          for (const key in this.fileMap) {
            console.log(item[key], 'item');
            if (item[key] && item[key] != '') {
              item[key + 'Path'] = await this.getImgList(item[key]);
            }
          }
        }
        console.log(this.supportList, 'supportList');
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel(key) {
      this[key] = false;
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
        title: undefined,
        content: undefined,
        fileUrl: undefined,
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
    passItem(row, index) {
      if (row.currentLink == 3 && (row.communityUrl == '' || !row.communityUrl)) {
        this.$message.warning('请先上传公示书');
        return;
      }
      if (!index) {
        this.form.applicationProcessId = row.applicationProcessId;
        this.form.operationType = 0;
        const { applicationProcessId, operationType } = this.form;
        this.$modal
          .confirm('是否不通过!')
          .then(() => {
            return changeAssistanceApplication({ applicationProcessId, operationType });
          })
          .then(() => {
            // this.loading = false;
            this.getList();
            this.$modal.msgSuccess('操作成功');
          });
        return;
      }
      this.form = JSON.parse(JSON.stringify(row));
      this.passOpen = true;
    },
    /** 提交按钮 */
    submitForm() {
      this.form.applicationProcessId = this.form.applicationProcessId;
      this.form.operationType = 1;
      const { handlingOpinions, applicationProcessId, operationType } = this.form;
      this.$refs['form'].validate((valid) => {
        if (valid) {
          changeAssistanceApplication({ handlingOpinions, applicationProcessId, operationType }).then((response) => {
            this.$modal.msgSuccess('操作成功');
            this.passOpen = false;
            this.getList();
          });
        }
      });
    },
    openPath(url) {
      window.open(url);
    },
    openView(row, fileKey) {
      if (fileKey === 'communityUrl' && (!row[fileKey] || row[fileKey] == '')) {
        this.$message.warning('暂无公示书');
        return;
      }
      this.open = true;
      this.form = JSON.parse(JSON.stringify(row));
    },
    openInfo(row) {
      this.propsData = JSON.parse(JSON.stringify(row));
      this.itemInfoOpen = true;
    },
    showLine(row, index) {
      if (!row.applicationProcessVoList || row.applicationProcessVoList?.length === 0) {
        this.$message.warning('暂无审批记录');
        return;
      }
      if (this.isShowLineIndex !== '0') {
        this.supportList[this.isShowLineIndex].isShowLine = false;
      }
      row.isShowLine = true;
      this.isShowLineIndex = index;
    },
    hideMaskPopup(e) {
      let dom = document.querySelector('.helpingDynamics');
      console.log(this.isShowLineIndex);
      this.supportList[this.isShowLineIndex].isShowLine = false;
    },
    async getImgList(id) {
      const { data } = await listByIds(id);
      let list = data.map((e) => {
        return { name: e?.originalName, url: e?.url, ossId: e?.ossId };
      });
      return list?.[0].url;
    },
    //upload
    async handleRemove(row, file, fileList) {
      this.fileList = fileList.map((item) => item.response.data.ossId);
      row.communityUrl = this.fileList.join(',');
      await updateAssistanceApplication(row);
      this.getList();
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    async handleSuccess(row, response, file, fileList) {
      this.fileList = fileList.map((item) => item.response.data.ossId);
      row.communityUrl = this.fileList.join(',');
      await updateAssistanceApplication(row);
      this.getList();
    },
  },
};
</script>
<style lang="scss" scoped>
.fileUpload {
  margin: 4px 10px 0 0;
}
.helpingDynamics {
  .content {
    height: 70vh;
    overflow: scroll;
  }
  .view {
    color: #1890ff;
    cursor: pointer;
  }
  .list {
    background: #fff;
    display: flex;
    align-items: center;
    .item {
      height: 104px;
      width: 84%;
      display: flex;
      padding: 16px;
      box-sizing: border-box;
      flex-wrap: wrap;
      .item-value {
        width: 20%;
        position: relative;
      }
    }
  }
}
.dialog-content {
  .dialog-title {
    font-size: 20px;
    font-weight: bold;
    color: #333333;
  }
}
.image-box {
  margin-top: 20px;
  display: flex;
  .image-title {
    text-align: center;
    display: flex;
    align-items: center;
    padding: 6px 0;
    box-sizing: border-box;
    height: 100px;
    width: 30px;
    font-size: 16px;
    font-weight: bold;
    border-radius: 4px;
    color: #fff;
    background: #1890ff;
    margin: 0 20px 0 0;
  }
  .image-list {
    display: flex;
    .image-item {
      margin: 0 16px 0 0;
    }
  }
}
</style>
