<template>
  <div class="">
    <el-dialog
      :title="`${info.id ? '编辑' : '新增'}异动事件`"
      width="48%"
      :visible.sync="dialogVisible"
      @close="$emit('close')"
    >
      <el-form :model="form" :rules="rules" ref="form" class="form" label-width="100px" :inline="false">
        <el-col :span="24">
          <el-form-item label="预警人:">
            <div class="name-line">
              <span class="name">{{ form.personNames }}</span>
              <el-button v-if="!people.fromSelf" @click="showLetterPeople = true">重新选择</el-button>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="登记人:" prop="reportUser">
            <el-input v-model="form.reportUser" maxlength="100"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="登记人电话:" prop="reportPhone">
            <el-input v-model="form.reportPhone" maxlength="100"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="诉求类别:" prop="infoClassify">
            <el-select v-model="form.infoClassify" @change="infoTypeChange">
              <el-option
                v-for="item in dictMap.info_classify"
                :key="item.dictCode"
                :label="item.dictLabel"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="登记单位:" prop="departCode">
            <el-cascader
              v-model="form.departCode"
              :props="{ checkStrictly: true }"
              :options="dictMap.addDistrict"
            ></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="登记级别:" prop="infoSource">
            <el-select @change="infoSourceChange" v-model="form.infoSource">
              <el-option
                v-for="item in dictMap.info_source"
                :key="item.dictCode"
                :label="item.dictLabel"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="信息渠道:" prop="infoChannel">
            <el-select no-data-text="请先选择登记级别" v-model="form.infoChannel">
              <el-option
                v-for="item in info_channelOptions"
                :key="item.dictCode"
                :label="item.dictLabel"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="预警等级:" prop="infoLevel">
            <el-select v-model="form.infoLevel" @change="updateDeadline">
              <el-option
                v-for="item in dictMap.info_level"
                :key="item.dictCode"
                :label="item.dictLabel"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="登记日期:" prop="petitionDate">
            <el-date-picker
              v-model="form.petitionDate"
              type="date"
              @change="updateDeadline"
              value-format="yyyy-MM-dd"
              :picker-options="startPickerOptions"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="截止日期:" prop="deadline">
            <el-date-picker
              v-model="form.deadline"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期"
              :picker-options="endPickerOptions"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="contentLabel" prop="content">
            <el-input type="textarea" v-model="form.content" maxlength="1000"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="附件:">
            <div class="upload">
              <el-upload
                action="/common/upload"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                :before-remove="beforeRemove"
                :headers="headers"
                multiple
                :accept="accept.join(',')"
                :file-list="fileList"
              >
                <el-button size="small" type=""><i class="el-icon-upload2"></i> 上传文件</el-button>
                <div slot="tip" class="el-upload__tip">只能上传{{ accept.join(',') }}的文件</div>
              </el-upload>
            </div>
          </el-form-item>
        </el-col>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>

        <el-button type="primary" @click="handleSave">保 存</el-button>
      </span>
    </el-dialog>
    <!-- <AddLetterPeople
      :isShowAll="false"
      v-if="showLetterPeople"
      @close="showLetterPeople = false"
      @success="addPeopleSuccess"
    ></AddLetterPeople> -->
  </div>
</template>

<script>
// import AddLetterPeople from '../addLetterPeople.vue';
export default {
  props: ['info', 'people'],
  components: {
    // AddLetterPeople,
  },
  data() {
    return {
      dialogVisible: true,
      showAddOut: false,
      showLetterPeople: false,
      showUp: false,
      tableData: [],
      activeInfo: {},
      contentLabel: '诉求内容',
      accept: ['.doc', '.docx', '.xls', '.xlsx', '.pdf', '.ppt', '.pptx', '.jpg', '.png'],
      form: {
        petitionDate: '',
        deadline: '',
      },
      startPickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      rules: {
        reportUser: [{ required: true, message: '请输入登记人', trigger: 'blur' }],
        reportPhone: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入电话',
          },
        ],
        infoClassify: [{ required: true, message: '请选择诉求类别', trigger: 'change' }],
        infoSource: [{ required: true, message: '请选择登记级别', trigger: 'change' }],
        infoType: [{ required: true, message: '请选择信访目的', trigger: 'change' }],
        departCode: [{ required: true, message: '请选择登记单位', trigger: 'blur' }],
        infoChannel: [{ required: true, message: '请选择信息渠道', trigger: 'change' }],
        infoLevel: [{ required: true, message: '请选择信息等级', trigger: 'change' }],
        petitionDate: [{ required: true, message: '请选择登记日期', trigger: 'change' }],
        deadline: [{ required: true, message: '请选择截止日期', trigger: 'change' }],
        content: [{ required: true, message: '请输入诉求内容', trigger: 'blur' }],
      },
      headers: {
        Authorization: sessionStorage.token,
      },
      info_channelOptions: [],
      fileList: [],
      deleteFile: [],
    };
  },
  computed: {
    userinfo() {
      return this.$store.state.userinfo;
    },
    dictMap() {
      return this.$store.state.dictMap;
    },
    endPickerOptions() {
      let form = this.form;
      return {
        disabledDate(time) {
          return time.getTime() < Date.parse(new Date(form.petitionDate)) - 86400000;
        },
      };
    },
  },
  watch: {
    userinfo: {
      handler(user) {
        this.form.reportUser = user.nickName;
        this.form.reportPhone = user.phoneNumber;
        this.form.departCode = user.departCode;
      },
    },
  },
  created() {
    console.log(this.info, this.people);
    // this.initForm()
    if (this.info.id) {
      this.getDetail();
      console.log('this.dictMap.info_channel', this.dictMap.info_channel);
      this.info_channelOptions = Object.values(this.dictMap.info_channel);
      // 下拉框时间放在获取详情给form赋值之后再执行
      // this.infoTypeChange(this.info.infoType)
    } else {
      // 自动填充默认数据
      this.initForm();
      this.form.infoLevel = '3';
      // 自动填充登记人和登记人电话和登记单位
      this.$set(this.form, 'reportUser', this.userinfo.nickName);
      this.$set(this.form, 'reportPhone', this.userinfo.phoneNumber);
      this.$set(this.form, 'departCode', this.userinfo.departCode);
      console.log(this.form);
      this.updateDeadline();
    }
  },
  mounted() {
    console.log('userinfo', this.userinfo);
  },
  methods: {
    getDetail() {
      axios({
        methods: 'get',
        url: '/petitionWarning/getById',
        params: { id: this.info.id },
      }).then((res) => {
        console.log('detailId', res);
        this.form = res;
        this.fileList = res.filePath;
      });
    },
    initForm() {
      this.form = Object.assign(this.form, this.info);
      if (this.people.length) {
        console.log(this.people);
        this.form.personNames = this.people.map((e) => e.name).join(',');
        this.form.infoDepartCode = this.people[0].departCode;
        this.form.infoDepartName = this.people[0].departName;
        this.form.retireIds = this.people
          .filter((e) => e.isOut === 0)
          .map((e) => e.id)
          .join(',');
        this.form.retireOutIds = this.people
          .filter((e) => e.isOut === 1)
          .map((e) => e.id)
          .join(',');
        console.log(this.form);
      } else if (this.people.id) {
        this.form.personNames = this.people.name;
        this.form.retireIds = this.people.id;
        this.form.infoDepartCode = this.people.departCode;
        this.form.infoDepartName = this.people.departName;
      }

      // this.form.departCode = setFormDepartCode(this.form.departCode);
      this.form.petitionDate = this.form.petitionDate || new Date().dateFormat('yyyy-MM-dd');
    },
    upSuccess() {
      this.showUp = false;
      this.dialogVisible = false;
    },
    addPeopleSuccess(selection) {
      console.log(selection);
      this.showLetterPeople = false;
      this.form.personNames = selection.map((e) => e.name).join(',');
      this.form.infoDepartCode = selection[0].departCode;
      this.form.infoDepartName = selection[0].departName;

      let retireIds = selection.map((item) => item.id).join(',');
      let retireOutIds = selection.filter((e) => e.isOut === 1).map((e) => e.id);

      this.form = Object.assign(this.form, {
        retireIds,
        retireOutIds: retireOutIds.join(','),
      });
      console.log(this.form);
    },
    updateDeadline() {
      if (!this.form.petitionDate || !this.form.infoLevel) {
        return;
      }
      // 截止日期根据紧急程度自动计算
      let stamp = Date.parse(new Date(this.form.petitionDate));
      let deadlineMap = {
        1: 86400000, // 1天
        2: 172800000, // 2天
        3: 259200000, // 3天
      };
      this.form.deadline = new Date(stamp + deadlineMap[1]).dateFormat('yyyy-MM-dd HH:mm:ss');
    },
    validate(type) {
      // type =0 保存   type =1 上报或下派
      // 当type=1时候flowType 也要传 flowType:1：上报 2：下派 3：反馈 4：办结 5：退回 6：驳回 7：审核通过 8：评价
      return new Promise((resolve, reject) => {
        this.$refs['form'].validate((valid) => {
          if (!valid) {
            return reject();
          }
          // let depart = getFormDepartCode(this.form.departCode);
          let formData = Object.assign({}, this.form);
          resolve(formData);
        });
      });
    },
    sendTo(flowType) {
      this.validate(flowType).then((formData) => {
        this.showUp = true;
        formData.type = 1;
        formData.flowType = flowType;
        this.activeInfo = formData;
      });
    },
    handleSave(type) {
      this.validate(type).then((formData) => {
        if (!!this.info.disposeFlag) {
          formData.type = 1;
          formData.flowType = '4';
          formData.state = 2;
        } else {
          formData.type = 0;
          formData.flowType = '0';
        }
        formData.filePath = this.fileList.map((e) => {
          let { id, name, url } = e;
          return { id, name, url };
        });
        formData.infoDepartCode = this.form.infoDepartCode;
        formData.infoDepartName = this.form.infoDepartName;
        formData.delFileId = this.deleteFile.map((e) => e.id).join(',');
        console.log(this.fileList, formData);
        axios.post(`/petitionWarning/${this.info.id ? 'update' : 'add'}`, formData).then(() => {
          this.$message.success('操作成功');
          this.$emit('success');
        });
      });
    },
    handleSuccess(res, file, fileList) {
      console.log(res, file, fileList);
      this.fileList = fileList;
      file.url = res.data.url;
      console.log(this.fileList);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.fileList = fileList;
      this.deleteFile.push(file);
    },
    handlePreview(file) {
      console.log(file);
      window.open(file.url);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },

    // 登记级别改变
    infoSourceChange(val) {
      console.log(this.dictMap.info_channel, this.form);
      this.info_channelOptions = [];
      this.form.infoChannel ? (this.form.infoChannel = '') : '';
      console.log(val);
      // 国家级显示对应的选项
      if (val == 1) {
        this.info_channelOptions = Object.values(this.dictMap.info_channel).slice(0, 2);
        this.info_channelOptions.push(Object.values(this.dictMap.info_channel)[5]);
        this.info_channelOptions.push(Object.values(this.dictMap.info_channel)[3]);
        this.info_channelOptions.push(Object.values(this.dictMap.info_channel)[6]);
        // 只有当信访目的为预警信息的时候才push
        if (this.form.infoType == 5) {
          this.info_channelOptions.push(this.dictMap.info_channel[8]);
          this.$set(this.form, 'infoChannel', '8');
        }
        return;
      }
      // 市级显示对应的选项
      if (val == 3) {
        this.info_channelOptions = Object.values(this.dictMap.info_channel).slice(0, 3);
        this.info_channelOptions.push(Object.values(this.dictMap.info_channel)[4]);
        this.info_channelOptions.push(Object.values(this.dictMap.info_channel)[3]);
        this.info_channelOptions.push(Object.values(this.dictMap.info_channel)[6]);
        if (this.form.infoType == 5) {
          this.info_channelOptions.push(this.dictMap.info_channel[8]);
          this.$set(this.form, 'infoChannel', '8');
        }
        return;
      }
      // 其他显示
      this.info_channelOptions = Object.values(this.dictMap.info_channel).slice(0, 4);
      this.info_channelOptions.push(Object.values(this.dictMap.info_channel)[6]);
      if (this.form.infoType == 5) {
        this.info_channelOptions.push(this.dictMap.info_channel[8]);
        this.$set(this.form, 'infoChannel', '8');
      }
    },
    // 信访目的下拉框值改变
    infoTypeChange(val) {
      if (val == 5) {
        this.contentLabel = '预警内容';
        // 值改变为预警时判断此时登记级别，再手动触发信息渠道下拉框
        if (this.form.infoSource) {
          this.infoSourceChange(this.form.infoSource);
        }
      } else {
        this.contentLabel = '诉求内容';
        for (let i in this.info_channelOptions) {
          if (this.info_channelOptions[i].remark === '预警') {
            this.$set(this.form, 'infoChannel', '');
            this.infoSourceChange(this.form.infoSource);
          }
        }
      }
    },
  },
};
</script>

<style scoped lang="scss">
.main-tab {
  margin-bottom: 16px;
}
.form {
  width: 100%;
  margin-bottom: 20px;
  .name {
    font-size: 24px;
    font-weight: bold;
    margin-right: 10px;
    vertical-align: middle;
  }
  &::after {
    content: '';
    display: table;
    clear: both;
  }
}
.el-cascader-panel {
  .el-radio {
    width: 100%;
    height: 100%;
    z-index: 10;
    position: absolute;
    top: 10px;
    right: 10px;
  }
  .el-radio__input {
    visibility: hidden;
  }
  .el-cascader-node__postfix {
    top: 10px;
  }
}

::v-deep.el-form-item__content {
  width: calc(100% - 100px);
}
::v-deep.el-col-24 {
  .el-form-item {
    display: block;
  }
}
::v-deep.el-input,
.el-select,
.el-cascader {
  width: 100%;
}
</style>
