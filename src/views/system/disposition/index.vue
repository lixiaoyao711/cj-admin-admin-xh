<template>
  <div class="app-container system">
    <header>
      <div class="title">系统配置</div>
    </header>
    <el-tabs v-model="mainTab" class="main-tab" @tab-click="mainTabChange">
      <el-tab-pane label="走访配置" name="1"></el-tab-pane>
      <el-tab-pane label="困难人员配置" name="2"></el-tab-pane>
      <el-tab-pane label="标签配置" name="3"></el-tab-pane>
      <el-tab-pane label="风险排查表配置" name="4"></el-tab-pane>
      <el-tab-pane label="通知配置" name="5"></el-tab-pane>
    </el-tabs>
    <div class="config-box" v-if="mainTab === '1'">
      <div class="config-item">
        <div class="title">权益维护走访配置</div>
        <div class="line" v-for="(item, index) in qywhMap" :key="index">
          <span class="label">{{ item.label }}</span>
          <span
            >每
            <el-input v-if="item.editModel" type="frequency" v-model="item.timeUnit"></el-input>
            <span v-else>{{ item.timeUnit }}</span> 天
          </span>
          <span
            >走访
            <el-input v-if="item.editModel" type="frequency" v-model="item.visitNum"></el-input>
            <span v-else>{{ item.visitNum }}</span> 次
          </span>
          <span class="btns">
            <el-button type="primary" @click="handleSave(index)" v-if="item.editModel">保 存</el-button>
            <el-button type="" @click="item.editModel = false" v-if="item.editModel">取 消</el-button>
            <el-button type="" @click="item.editModel = true" v-if="!item.editModel">编 辑</el-button>
          </span>
        </div>
      </div>
      <div class="config-item">
        <div class="title">关爱帮扶走访配置</div>
        <div class="line">
          <span class="label">困难人员</span>
          <span
            >每
            <el-input
              v-if="stateMap['difficultFrequency'].editModel"
              type="frequency"
              v-model="stateMap['difficultFrequency'].timeUnit"
            ></el-input>
            <span v-else>{{ stateMap['difficultFrequency'].timeUnit }}</span> 天
          </span>
          <span
            >走访
            <el-input
              v-if="stateMap['difficultFrequency'].editModel"
              type="frequency"
              v-model="stateMap['difficultFrequency'].visitNum"
            ></el-input>
            <span v-else>{{ stateMap['difficultFrequency'].visitNum }}</span> 次
          </span>
          <span class="btns">
            <el-button
              type="primary"
              @click="handleSave('difficultFrequency')"
              v-if="stateMap['difficultFrequency'].editModel"
              >保 存</el-button
            >
            <el-button
              type=""
              @click="stateMap['difficultFrequency'].editModel = false"
              v-if="stateMap['difficultFrequency'].editModel"
              >取 消</el-button
            >
            <el-button
              type=""
              @click="stateMap['difficultFrequency'].editModel = true"
              v-if="!stateMap['difficultFrequency'].editModel"
              >编 辑</el-button
            >
          </span>
        </div>
      </div>
      <div class="config-item table">
        <div class="title">走访时段配置</div>
        <div class="line">
          <el-alert title="配置后可主动提醒制表人填表" type="warning" :closable="false" show-icon></el-alert>
          <el-table :data="stateMap.visitTimeList" style="width: 100%; height: 100%" height="20vh">
            <el-table-column prop="visitTimeName" label="名称"> </el-table-column>
            <el-table-column prop="visitTimeName" label="时间段">
              <template slot-scope="scope"> {{ scope.row.visitBeginTime }} -- {{ scope.row.visitEndTime }} </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="handleUpdate(scope)">修改</el-button>
                <el-button size="mini" type="text" @click="handleDelete(scope)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button plain @click="handleAdd('新增通知时段')" icon="el-icon-plus">新增通知时段</el-button>
        </div>
        <el-dialog :title="title" :visible="dialogFormVisible" @close="dialogFormVisible = false">
          <el-form :model="form" label-width="80px">
            <el-form-item label="时段名称" prop="visitTimeName">
              <el-input v-model="form.visitTimeName"></el-input>
            </el-form-item>
            <el-form-item label="周期" prop="searchTime">
              <el-date-picker
                v-model="form.searchTime"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                clearable
              >
              </el-date-picker>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitForm">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
    <div class="config-box" v-if="mainTab === '2'">
      <div class="title">医疗困难筛选配置</div>
      <div class="warning"><i class="el-icon-warning-outline"></i> 配置成为医疗困难人员，医保自负自理花费的额度</div>
      <div class="config-item">
        <div class="line">
          <span class="label">单次自理花费超</span>
          <span>
            <el-input
              v-if="stateMap['medicalDifficultiesSingleTime'].editModel"
              type="frequency"
              v-model="stateMap['medicalDifficultiesSingleTime'].money"
            ></el-input>
            <span v-else>{{ stateMap['medicalDifficultiesSingleTime'].money }}</span> 元
          </span>
          <span class="btns">
            <el-button
              type="primary"
              @click="handleSave('medicalDifficultiesSingleTime')"
              v-if="stateMap['medicalDifficultiesSingleTime'].editModel"
              >保 存</el-button
            >
            <el-button
              type=""
              @click="stateMap['medicalDifficultiesSingleTime'].editModel = false"
              v-if="stateMap['medicalDifficultiesSingleTime'].editModel"
              >取 消</el-button
            >
            <el-button
              type=""
              @click="stateMap['medicalDifficultiesSingleTime'].editModel = true"
              v-if="!stateMap['medicalDifficultiesSingleTime'].editModel"
              >编 辑</el-button
            >
          </span>
        </div>
        <div class="line">
          <span class="label">每年自理花费金额</span>
          <span>
            <el-input
              v-if="stateMap['medicalDifficultiesAnnually'].editModel"
              type="frequency"
              v-model="stateMap['medicalDifficultiesAnnually'].money"
            ></el-input>
            <span v-else>{{ stateMap['medicalDifficultiesAnnually'].money }}</span> 元
          </span>
          <span class="btns">
            <el-button
              type="primary"
              @click="handleSave('medicalDifficultiesAnnually')"
              v-if="stateMap['medicalDifficultiesAnnually'].editModel"
              >保 存</el-button
            >
            <el-button
              type=""
              @click="stateMap['medicalDifficultiesAnnually'].editModel = false"
              v-if="stateMap['medicalDifficultiesAnnually'].editModel"
              >取 消</el-button
            >
            <el-button
              type=""
              @click="stateMap['medicalDifficultiesAnnually'].editModel = true"
              v-if="!stateMap['medicalDifficultiesAnnually'].editModel"
              >编 辑</el-button
            >
          </span>
        </div>
      </div>
    </div>
    <div class="config-box" v-if="mainTab === '3'">
      <div class="config-item table-tag">
        <div class="line">
          <div class="tool"><el-button plain @click="handleAdd('新增标签')">新 增</el-button></div>
          <el-table :data="tagList" style="width: 100%; height: 100%" height="62vh">
            <el-table-column prop="tagName" label="标签名称"> </el-table-column>
            <el-table-column prop="tagNum" label="已关联人员">
              <template #default="scope">
                <span>{{ scope.row.tagNum }}人</span>
              </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime" width="180">
              <template #default="scope">
                <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="handleUpdateTag(scope.row)" v-if="scope.row.hasEditOrDelAuth"
                  >修改</el-button
                >
                <el-button
                  size="mini"
                  type="text"
                  v-if="scope.row.hasAuditStatusAuth"
                  @click="handleUpdateStatus(scope.row, 'auditStatus', '1')"
                  >设为公标</el-button
                >
                <el-button
                  size="mini"
                  type="text"
                  v-else-if="scope.row.hasEnablStatusAuth"
                  @click="handleUpdateStatus(scope.row, 'enablStatus', '1')"
                  >启用</el-button
                >
                <el-button size="mini" type="text" v-else @click="handleUpdateStatus(scope.row, 'enablStatus', '0')"
                  >禁用</el-button
                >
                <el-button size="mini" type="text" v-if="scope.row.hasEditOrDelAuth" @click="handleDeleteTag(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <pagination
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getTagList"
          />
          <el-dialog v-loading="loading" :title="title" :visible="dialogFormVisible" @close="dialogFormVisible = false">
            <el-form :model="form" ref="form" :rules="rules" label-width="80px">
              <el-form-item label="标签名称" prop="tagName">
                <el-input v-model="form.tagName" type="text" maxlength="10" show-word-limit></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" :loading="buttonLoading" @click="submitForm">确 定</el-button>
            </div>
          </el-dialog>
        </div>
      </div>
    </div>
    <!-- 风险排查表配置 -->
    <div class="tree-box" v-if="mainTab === '4'">
      <div class="list">
        <div class="item">
          <span>签字配置</span>
          <div class="df">
            <span>选择镇街村社：</span>
            <!-- <el-cascader
              @change="getByDepartCode"
              :disabled="userinfo.departCode.length > 1"
              :props="{ checkStrictly: true }"
              v-model="query.departCode"
              :options="dictMap.userDistrict"
            ></el-cascader> -->
            <TreeSelectDivision
              v-model="queryParams.divisionCode"
              @treeChange="treeChange"
              @treeselectChange="(e) => treeselectChange(e, queryParams, 'divisionCode')"
            ></TreeSelectDivision>
          </div>
        </div>
        <div class="item">
          <div class="maring"><i class="el-icon-warning"></i> 配置完成后，相关人员可在浙政钉进行签字</div>
        </div>
        <div class="item">
          <span>制表人</span>
          <div>
            <span class="name">{{ configPeople.signaturePreparerName }}</span>
            <el-button
              :disabled="!queryParams.divisionCode"
              @click="showAddDialog('signaturePreparerId', 'signaturePreparerName')"
              >编 辑</el-button
            >
          </div>
        </div>
        <div class="item">
          <span>退役军人服务站站长</span>
          <div>
            <span class="name">{{ configPeople.serviceStationName }}</span>
            <el-button
              :disabled="!queryParams.divisionCode"
              @click="showAddDialog('serviceStationId', 'serviceStationName')"
              >编 辑</el-button
            >
          </div>
        </div>
        <div class="item">
          <span>分管领导</span>
          <div>
            <span class="name">{{ configPeople.leaderName }}</span>
            <el-button :disabled="!queryParams.divisionCode" @click="showAddDialog('leaderId', 'leaderName')"
              >编 辑</el-button
            >
          </div>
        </div>
        <div class="item">
          <div class="maring"><i class="el-icon-warning"></i> 配置后可主动提醒制表人填表</div>
        </div>
        <div class="item">
          <div class="title">每月不稳定风险排查表推送通知配置</div>
        </div>
        <div class="item" v-for="(item, index) in msgList" :key="item.id">
          <span>{{ item.name }}</span>
          <div>
            <el-switch @change="switchChange(item)" v-model="item.disableFlag" active-value="1" inactive-value="0">
            </el-switch>
            <el-button @click="openAdd(item, '1')">编 辑</el-button>
          </div>
        </div>
        <div class="item">
          <el-button v-if="msgList.length === 0" @click="addItem('1')"> + 新增通知时间段</el-button>
        </div>
        <div class="item">
          <div class="title">每日零报推送通知配置</div>
        </div>
        <div class="item" v-for="(item, index) in msgListData" :key="item.id">
          <span>{{ item.name }}</span>
          <div class="df">
            <el-switch @change="switchChange(item)" v-model="item.disableFlag" active-value="1" inactive-value="0">
            </el-switch>
            <el-button @click="openAdd(item, '2')">编 辑</el-button>
            <el-button type="text">
              <el-popconfirm title="确定删除吗？" @confirm="delItem(item.id)">
                <el-button slot="reference" type="danger">删 除</el-button>
              </el-popconfirm>
            </el-button>
          </div>
        </div>
        <div class="item">
          <el-button v-if="msgListData.length < 10" @click="addItem('2')"> + 新增通知时间段</el-button>
        </div>
      </div>
    </div>
    <div class="config-box" v-if="mainTab === '5'">
      <div class="config-item">
        <div class="title">权益维护走访区级通知配置</div>
        <div class="tag-box">
          <el-tag
            v-for="(item, index) in stateMap.petitionVisitDistrictNoticeConfig"
            :key="item.employeeCode"
            type="info"
            closable
            @close="tagClose(index, 'petitionVisitDistrictNoticeConfig')"
            >{{ item.name }}</el-tag
          >
          <el-button size="mini" @click="addConfig('petitionVisitDistrictNoticeConfig')">配 置</el-button>
        </div>
      </div>
      <div class="config-item">
        <div class="title">关爱帮扶走访区级通知配置</div>
        <div class="tag-box">
          <el-tag
            v-for="(item, index) in stateMap.careVisitDistrictNoticeConfig"
            :key="item.employeeCode"
            type="info"
            closable
            @close="tagClose(index, 'careVisitDistrictNoticeConfig')"
            >{{ item.name }}</el-tag
          >
          <el-button size="mini" @click="addConfig('careVisitDistrictNoticeConfig')">配 置</el-button>
        </div>
      </div>
      <div class="config-item">
        <div class="title">关爱基金区级审核人</div>
        <div class="tag-box">
          <el-tag
            v-for="(item, index) in stateMap.careFundDistrictApprovalConfig"
            :key="item.employeeCode"
            type="info"
            closable
            @close="tagClose(index, 'careFundDistrictApprovalConfig')"
            >{{ item.name }}</el-tag
          >
          <el-button size="mini" @click="addConfig('careFundDistrictApprovalConfig')">配 置</el-button>
        </div>
      </div>
    </div>
    <OrgPeople
      v-if="showPeople"
      :isOrgChange="false"
      :isTable="true"
      @close="showPeople = false"
      @success="peoSuccess"
    />
    <AddPartyConstructionPerson
      v-if="showAddPeople"
      @close="showAddPeople = false"
      :divisionCode="queryParams.divisionCode"
      :type="checkType"
      @success="addPeopleSuccess"
    />
    <ChangeTime
      v-if="changeTimeDialog"
      :propsData="changeTimeData"
      @close="changeTimeClose"
      :type="subMianTab"
    ></ChangeTime>
  </div>
</template>

<script>
import {
  insertOrUpdate,
  queryByConfigType,
  listTag,
  getTag,
  addTag,
  updateTag,
  delTag,
  getByDivisionCode,
  riskSignConfigInsertOrUpdate,
  riskNoticeConfigList,
  updateRiskNoticeConfig,
  deleteRiskNoticeConfig,
} from '@/api/system/disposition';
import OrgPeople from '@/components/ChangePeoPle/orgPeople';
import AddPartyConstructionPerson from './dialog/addPartyConstructionPerson.vue';
import ChangeTime from './dialog/changeTime.vue';
export default {
  props: {},
  components: {
    OrgPeople,
    AddPartyConstructionPerson,
    ChangeTime,
  },
  data() {
    return {
      mainTab: '1',
      subMianTab: '1',
      configData: {},
      title: '',
      dialogFormVisible: false,
      showAddPeople: false,
      changeTimeDialog: false,
      currentTableIndex: 0,
      currentTag: null,
      showPeople: false,
      total: 0,
      tagList: [],
      loading: false,
      buttonLoading: false,
      form: {
        searchTime: [],
      },
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        divisionCode: undefined,
      },
      stateMap: {
        activeFrequency: { label: '活跃人员', timeUnit: '2', visitNum: '1', editModel: false },
        stableFrequency: { label: '稳定人员', timeUnit: '2', visitNum: '1', editModel: false },
        resolveFrequency: { label: '化解人员', timeUnit: '2', visitNum: '1', editModel: false },
        medicalDifficultiesSingleTime: { label: '单次自理花费超', money: 10000, editModel: false },
        medicalDifficultiesAnnually: { label: '每年自理花费超', money: 10000, editModel: false },
        difficultFrequency: { label: '化解人员', timeUnit: '2', visitNum: '1', editModel: false },
        visitTimeList: [],
        petitionVisitDistrictNoticeConfig: [],
        careVisitDistrictNoticeConfig: [],
        careFundDistrictApprovalConfig: [],
      },
      rules: {
        tagName: [{ required: true, message: '标签名称不能为空', trigger: 'blur' }],
      },
      checkType: '',
      configPeople: {},
      changeTimeData: {},
      msgList: [],
      msgListData: [],
      query: {
        divisionCode: undefined,
      },
      // 保存领导id字段和name字段
      addKey: [],
    };
  },
  computed: {
    qywhMap() {
      let result = {};
      let keys = ['activeFrequency', 'stableFrequency', 'resolveFrequency'];
      Object.keys(this.stateMap).forEach((e, i) => {
        if (keys.includes(e)) {
          result[e] = this.stateMap[e];
        }
      });
      return result;
    },
  },
  watch: {},
  created() {
    this.mainTab = this.$route.query.tab || '1';
  },
  mounted() {
    this.getConfig();
    this.getTagList();
    this.mainTabChange({ name: this.mainTab });
    // this.getByDepartCode();
  },
  methods: {
    getConfig() {
      queryByConfigType('fuyang').then((res) => {
        let data = res.data.systemConfig;
        for (let i in this.stateMap) {
          if (data[i]) {
            if (['medicalDifficultiesSingleTime', 'medicalDifficultiesAnnually'].indexOf(i) > -1) {
              this.stateMap[i].money = data[i] || 10000;
            } else {
              this.stateMap[i] = Array.isArray(this.stateMap[i])
                ? data[i]
                : Object.assign({}, this.stateMap[i], data[i]);
            }
          }
        }
        this.configData = res.data;
      });
    },
    getTagList() {
      listTag(this.queryParams).then((res) => {
        this.tagList = res.rows.map((e) => {
          e.hasAuditStatusAuth = e.hasEditOrDelAuth = e.hasEnablStatusAuth = false;
          if ([1, e.createId].indexOf(this.$store.state.user.userId) > -1) {
            e.hasEditOrDelAuth = true;
            if (e.auditStatus !== '1') {
              e.hasAuditStatusAuth = true;
            } else if (e.enablStatus !== '1') {
              e.hasEnablStatusAuth = true;
            }
          }
          return e;
        });
        this.$store.dispatch('getPersonType');

        this.total = res.total;
        console.log(this.tagList);
      });
    },
    saveConfig() {
      let configData = Object.assign({}, this.configData, {
        systemConfig: Object.assign({}, this.stateMap, {
          medicalDifficultiesSingleTime: this.stateMap['medicalDifficultiesSingleTime'].money,
          medicalDifficultiesAnnually: this.stateMap['medicalDifficultiesAnnually'].money,
        }),
      });
      insertOrUpdate(configData).then((res) => {
        this.$modal.msgSuccess('保存成功');
        this.getConfig();
      });
    },
    /** 新增按钮操作 */
    handleAdd(title) {
      this.form = {};
      this.dialogFormVisible = true;
      this.title = title;
    },
    /** 修改按钮操作 */
    handleUpdate(scope) {
      this.form = scope.row;
      this.form.searchTime = [scope.row.visitBeginTime, scope.row.visitEndTime];
      this.currentTableIndex = scope.$index;
      this.dialogFormVisible = true;
      this.title = '修改通知时段';
    },
    handleDelete(scope) {
      this.stateMap.visitTimeList.splice(scope.$index, 1);
      this.saveConfig();
    },
    handleSave(index) {
      this.stateMap[index].editModel = false;
      this.saveConfig();
    },
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateTag(this.form)
              .then((response) => {
                this.$modal.msgSuccess('修改成功');
                this.dialogFormVisible = false;
                this.getTagList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else {
            addTag(this.form)
              .then((response) => {
                this.$modal.msgSuccess('新增成功');
                this.dialogFormVisible = false;
                this.getTagList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          }
        }
      });
    },
    addConfig(key) {
      this.showPeople = true;
      this.currentTag = key;
    },
    peoSuccess(data) {
      if (data.length < 1) {
        return;
      }
      this.stateMap[this.currentTag] = data.map((e) => {
        return { employeeCode: e.openId, phonenumber: e.phonenumber, name: e.nickName };
      });
      this.saveConfig();
      this.showPeople = false;
      this.currentTag = '';
    },
    tagClose(index, key) {
      this.stateMap[key].splice(index, 1);
      this.saveConfig();
    },
    handleUpdateTag(row) {
      this.form = row;
      this.dialogFormVisible = true;
      this.title = '修改标签';
    },
    handleUpdateStatus(row, key, status) {
      this.buttonLoading = true;
      row[key] = status;
      updateTag(row)
        .then((response) => {
          this.$modal.msgSuccess('成功');
          this.getTagList();
        })
        .finally(() => {
          this.buttonLoading = false;
        });
    },
    handleDeleteTag(row) {
      this.$modal
        .confirm('是否确认删除标签编号为"' + row.id + '"的数据项？')
        .then(() => {
          this.loading = true;
          return delTag(row.id);
        })
        .then(() => {
          this.loading = false;
          this.getTagList();
          this.$modal.msgSuccess('删除成功');
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false;
        });
    },
    mainTabChange(vm) {
      this.form.page = 1;
      this.$router.replace({
        query: {
          tab: vm.name,
        },
      });
      if (vm.name === '4') {
        this.getByDepartCode();
        this.riskNoticeConfig();
      }
      if (vm.name === '3') {
        this.getTagList();
      } else {
        this.getConfig();
      }
    },
    switchChange(row) {
      updateRiskNoticeConfig(row).then((res) => {
        this.$message.success('操作成功');
        this.riskNoticeConfig();
      });
    },
    showAddDialog(id, name) {
      this.checkType = 'radio';
      this.showAddPeople = true;
      this.addKey = [id, name];
    },
    // 根据行政区划获取风险排查表人员配置
    async getByDepartCode() {
      const { data } = await getByDivisionCode(this.queryParams.divisionCode);
      this.configPeople = data;
    },

    treeChange(code) {
      this.queryParams.divisionCode = code;
      if (!code) {
        this.configPeople = {};
        return;
      }
      this.getByDepartCode();
    },
    addPeopleSuccess(row) {
      this.configPeople[this.addKey[0]] = row.openId;
      this.configPeople[this.addKey[1]] = row.nickName;
      riskSignConfigInsertOrUpdate(this.configPeople).then((res) => {
        this.$message.success('操作成功');
        this.getByDepartCode();
        this.showAddPeople = false;
      });
    },
    addItem(value) {
      this.subMianTab = value;
      this.changeTimeDialog = true;
    },
    openAdd(row, value) {
      this.subMianTab = value;
      this.changeTimeData = JSON.parse(JSON.stringify(row));
      this.changeTimeDialog = true;
    },
    changeTimeClose() {
      this.riskNoticeConfig();
      this.changeTimeData = {};
      this.changeTimeDialog = false;
    },
    delItem(id) {
      deleteRiskNoticeConfig(id).then((res) => {
        this.$message.success('删除成功');
        this.riskNoticeConfig();
      });
    },
    //分页查询数据定时提醒
    riskNoticeConfig() {
      riskNoticeConfigList({ type: 1 }).then((res) => {
        this.msgList = res.rows;
      });
      riskNoticeConfigList({ type: 2 }).then((res) => {
        this.msgListData = res.rows;
      });
    },
  },
};
</script>

<style scoped lang="scss">
.system {
  height: 100%;
  position: relative;
  .title {
    font-size: 20px;
    height: 100%;
    font-weight: bold;
    height: 40px;
    line-height: 40px;
    margin: 12px 0 0;
    text-align: left;
    color: #000;
  }
  .warning {
    font-size: 14px;
    margin-top: 6px;
    font-weight: 400;
    color: #aaa;
  }
  .config-box {
    width: 100%;
    background: #fff;
    padding: 8px 24px;
    .config-item {
      .line {
        margin-top: 20px;
        .label {
          margin-right: 20px;
        }
        .tool {
          float: right;
          margin-bottom: 12px;
        }
      }
      .tag-box {
        .el-tag {
          margin: 8px 8px 0 0;
        }
      }
    }
  }
  .table {
    height: 372px;
    .line {
      width: 50%;
    }
  }
  .table-tag {
    height: 692px;
  }
  .table,
  .table-tag {
    background: #fff;
    box-sizing: border-box;
    .el-select,
    .el-input {
      width: 350px;
    }
  }
}
.el-table {
  margin: 16px 0;
}
.el-btn {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
.el-select,
.el-input {
  width: 100px;
}
::v-deep .el-alert__title {
  color: #606266;
}
::v-deep .el-tabs__nav-wrap::after {
  height: 0px !important;
}
.tree-box {
  height: 74vh;
  background: #fff;
  overflow: scroll;
  padding: 20px;
  box-sizing: border-box;
  .list {
    width: 30%;
    .item {
      margin-top: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .name {
        margin-right: 20px;
      }
    }
    .maring {
      // margin-top: 16px;
      width: 100%;
      padding: 8px;
      box-sizing: border-box;
      background: #fffbe6;
      border: 1px solid yellow;
      .el-icon-warning {
        color: #faad14;
      }
    }
  }
  .el-switch {
    margin-right: 10px;
  }
  .df {
    align-items: center;
  }
}
</style>
