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
            <el-select v-model="form.infoClassify" placeholder="请选择">
              <el-option
                v-for="dict in dict.type.sys_worship_xfmdlx"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="登记单位:" prop="departCode">
            <TreeSelectDivision
              v-model="form.departCode"
              @treeselectChange="(e) => treeselectChange(e, form, 'departName', 'departCode')"
            ></TreeSelectDivision>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="登记级别:" prop="infoSource">
            <el-select v-model="form.infoSource" placeholder="请选择" clearable>
              <el-option
                v-for="dict in dict.type.sys_worship_djjb"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="信息渠道:" prop="infoChannel">
            <el-select v-model="form.infoChannel" placeholder="请选择">
              <el-option
                v-for="dict in dict.type.sys_worship_xfdjqd"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="预警等级:" prop="infoLevel">
            <el-select v-model="form.infoLevel" placeholder="请选择">
              <el-option
                v-for="dict in dict.type.sys_worship_jjcd"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
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
              <fileUpload v-model="form.fileUrl"></fileUpload>
            </div>
          </el-form-item>
        </el-col>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>

        <el-button type="primary" @click="handleSave">保 存</el-button>
      </span>
    </el-dialog>
    <AddLetterPeople
      :isShowAll="false"
      v-if="showLetterPeople"
      @close="showLetterPeople = false"
      @success="addPeopleSuccess"
    ></AddLetterPeople>

    <ChangePeoPle
      v-if="showLetterPeople"
      @close="showLetterPeople = false"
      type="petitionDynamics"
      @success="addPeopleSuccess"
      :peopleList="peopleList"
    />
  </div>
</template>

<script>
import AddLetterPeople from '../addLetterPeople.vue';
import ChangePeoPle from '@/components/ChangePeoPle/people.vue';
import { parseTime } from '@/utils/ruoyi';
import { addPetitionWarning, updatePetitionWarning, getPetitionWarning } from '@/api/worship/petitionWarning';
export default {
  props: ['info', 'people', 'type'],
  dicts: ['sys_worship_djjb', 'sys_worship_jjcd', 'sys_worship_xfdjqd', 'sys_worship_xfmd', 'sys_worship_xfmdlx'],

  components: {
    AddLetterPeople,
    ChangePeoPle,
  },
  data() {
    return {
      dialogVisible: true,
      showAddOut: false,
      showLetterPeople: false,
      showUp: false,
      tableData: [],
      peopleList: [],
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
      return this.$store.state.user.user;
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
        this.form.reportPhone = user.phonenumber;
        this.form.departCode = user.divisionCode;
      },
    },
  },
  created() {
    console.log(this.info, this.people);
    console.log('userinfo', this.userinfo);
    // this.initForm()
    if (this.info.id) {
      this.getDetail();
      console.log('this.dictMap.info_channel', this.dictMap.info_channel);
      // this.info_channelOptions = Object.values(this.dictMap.info_channel);
      // 下拉框时间放在获取详情给form赋值之后再执行
      // this.infoTypeChange(this.info.infoType)
    } else {
      // 自动填充默认数据
      this.initForm();
      this.form.infoLevel = '2';
      // 自动填充登记人和登记人电话和登记单位
      this.$set(this.form, 'reportUser', this.userinfo.nickName);
      this.$set(this.form, 'reportPhone', this.userinfo.phonenumber);
      this.$set(this.form, 'departCode', this.userinfo.divisionCode);
      console.log(this.form);
      this.updateDeadline();
    }
  },
  mounted() {
    console.log('userinfo', this.userinfo);
  },
  methods: {
    getDetail() {
      getPetitionWarning(this.info.id).then((res) => {
        this.form = res.data;
        // this.fileList = res.filePath;
      });
    },
    initForm() {
      this.form = Object.assign(this.form, this.info);
      if (this.people.length) {
        console.log(this.people);
        this.form.personNames = this.people.map((e) => e.name).join(',');
        this.form.personIds = this.people.map((e) => e.id).join(',');

        this.form.departCode = this.people[0].divisionCode;
        this.form.departName = this.people[0].divisionName;

        console.log(this.form);
      } else if (this.people.userId) {
        this.form.personNames = this.people.name;
        this.form.personIds = this.people.id;
        this.form.departCode = this.people.departCode;
        this.form.departName = this.people.departName;
      }

      // this.form.departCode = setFormDepartCode(this.form.departCode);
      this.form.petitionDate = this.form.petitionDate || parseTime(new Date());
    },
    upSuccess() {
      this.showUp = false;
      this.dialogVisible = false;
    },
    addPeopleSuccess(selection) {
      console.log('selection', selection);
      this.showLetterPeople = false;
      this.form.personNames = selection.map((e) => e.name).join(',');
      this.form.departCode = selection[0].departCode;
      this.form.departName = selection[0].departName;

      let personIds = selection.map((item) => item.id).join(',');

      this.form = Object.assign(this.form, {
        personIds,
      });
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
      this.form.deadline = parseTime(new Date(stamp + deadlineMap[1]));
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

        formData.delFileId = this.deleteFile.map((e) => e.id).join(',');
        formData.associatedPersonType = this.type;
        console.log(this.fileList, formData);
        if (this.form.id != null) {
          updatePetitionWarning(formData).then((res) => {
            this.$message.success('操作成功');
            this.$emit('success');
          });
        } else {
          addPetitionWarning(formData).then((res) => {
            this.$message.success('操作成功');
            this.$emit('success');
          });
        }
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
</style>
<style lang="scss" scoped>
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
