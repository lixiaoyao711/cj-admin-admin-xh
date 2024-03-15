<template>
  <div class="visitTrends">
    <el-form
      class="search-form"
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="行政区划" prop="divisionCode">
        <TreeSelectDivision
          v-model="queryParams.divisionCode"
          @treeselectChange="(e) => treeselectChange(e, queryParams, 'divisionCode')"
        ></TreeSelectDivision>
      </el-form-item>
      <el-form-item label="走访方式" prop="visitMethod">
        <el-select v-model="queryParams.visitMethod" placeholder="请选择走访方式" clearable>
          <el-option
            v-for="dict in dict.type.sys_worship_visitingmethods"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="走访类型" prop="visitType">
        <el-select v-model="queryParams.visitType" placeholder="请选择走访类型" clearable>
          <el-option
            v-for="dict in dict.type.sys_worship_visittype"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="安置类别" prop="personCategory">
        <el-cascader v-model="personCategoryList" :options="anzhiType"> </el-cascader>
      </el-form-item>
      <el-form-item label="抚恤类别" prop="retirePreferentialCategory">
        <el-select v-model="queryParams.retirePreferentialCategory" placeholder="请选择抚恤类别" clearable>
          <el-option
            v-for="dict in dict.type.sys_worship_tuiyijunrenyoufuleibie"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="人员标签" prop="personTags">
        <el-select v-model="queryParams.personTags" placeholder="请选择人员标签" clearable>
          <el-option
            v-for="dict in peoPleTagList"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="走访日期" prop="visitTime">
        <el-date-picker
          clearable
          v-model="queryParams.searchTime"
          type="daterange"
          value-format="yyyy-MM-dd"
          placeholder="请选择"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="年龄" prop="searchAge">
        <input-number-range v-model="queryParams.searchAge"></input-number-range>
      </el-form-item>
      <el-form-item label="搜索" prop="keyWord">
        <el-input
          v-model="queryParams.keyWord"
          placeholder="姓名、身份证号、联系方式"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item class="search-right">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="table">
      <div class="table-title-box">
        <div class="title-name">走访动态列表</div>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['worship:visiting:add']"
              >新增</el-button
            >
          </el-col>

          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['worship:visiting:remove']"
              >删除</el-button
            >
          </el-col>

          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </div>

      <el-table v-loading="loading" :data="visitingList" @selection-change="handleSelectionChange" height="83%">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="行政区划" align="center" prop="divisionName" />
        <el-table-column label="被走访" align="center" prop="personName" />
        <el-table-column label="走访类型" align="center" prop="visitType">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_worship_visittype" :value="scope.row.visitType" />
          </template>
        </el-table-column>
        <el-table-column label="走访方式" align="center" prop="visitMethod">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_worship_visitingmethods" :value="scope.row.visitMethod" />
          </template>
        </el-table-column>
        <el-table-column label="走访内容" align="center" prop="content" />

        <el-table-column label="走访日期" align="center" prop="visitTime" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.visitTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="满意情况" align="center" prop="satisfactionStr" />

        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleUpdate(scope.row, 'infoOpen')">详情</el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleUpdate(scope.row, 'open')"
              v-hasPermi="['worship:visiting:edit']"
              >修改</el-button
            >
            <el-button size="mini" type="text" @click="handleDelete(scope.row)" v-hasPermi="['worship:visiting:remove']"
              >删除</el-button
            >
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

    <!-- 添加或修改走访信息标（走访慰问、困难走访、三色走访）对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="走访类型" prop="visitType">
          <el-radio-group v-model="form.visitType" @change="radioChange">
            <el-radio v-for="dict in dict.type.sys_worship_visittype" :key="dict.value" :label="parseInt(dict.value)">{{
              dict.label
            }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 走访类型为三色走访人员的时候，显示的表单 -->
        <div v-if="[5, 7].indexOf(form.visitType) > -1">
          <el-row>
            <el-col :span="12">
              <el-form-item v-if="form.visitType === 5" label="被帮扶人" prop="personName">
                <el-input @focus="openChangePeople" v-model="form.personName" placeholder="请输入被帮扶" />
              </el-form-item>
              <el-form-item v-else label="部队名称" prop="armyName">
                <el-input v-model="form.armyName" placeholder="请输入部队名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="行政区划" prop="divisionCode">
                <TreeSelectDivision
                  v-model="form.divisionCode"
                  :disabled="true"
                  @treeselectChange="(e) => treeselectChange(e, form)"
                ></TreeSelectDivision>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="走访地址" prop="address">
            <el-input v-model="form.address" placeholder="请输入走访地址">
              <el-button @click="openMap" slot="append" icon="el-icon-location-outline"></el-button>
            </el-input>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item :label="form.visitType === 5 ? '帮扶人' : '走访人'" prop="visitPersonName">
                <el-input v-model="form.visitPersonName" placeholder="请输入" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="form.visitType === 5 ? '帮扶联系方式' : '走访联系方式'"
                prop="visitPersonPhone"
                label-width="130px"
              >
                <el-input v-model="form.visitPersonPhone" placeholder="请输入联系方式" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="走访方式" prop="visitMethod">
                <el-select v-model="form.visitMethod" placeholder="请选择走访方式">
                  <el-option
                    v-for="dict in dict.type.sys_worship_visitingmethods"
                    :key="dict.value"
                    :label="dict.label"
                    :value="parseInt(dict.value)"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="走访日期" prop="visitTime">
                <el-date-picker
                  clearable
                  v-model="form.visitTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="请选择走访日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item v-if="form.visitType === 5" label="困难原因" prop="difficultReason">
            <el-input v-model="form.difficultReason" type="textarea" placeholder="请输入内容" />
          </el-form-item>
          <el-form-item v-if="form.visitType === 5" label="帮扶措施" prop="">
            <el-checkbox-group v-model="form.helpMethod">
              <el-checkbox
                v-for="dict in dict.type.sys_worship_assistancemeasures"
                :key="dict.value"
                :label="dict.value"
              >
                {{ dict.label }}</el-checkbox
              >
            </el-checkbox-group>
          </el-form-item>
          <!-- 选中给予物资基金显示 -->
          <el-form-item v-if="form.helpMethod.indexOf('1') != -1" label="给予资金金额：" prop="moneyAmount">
            <el-input type="number" placeholder="请输入内容" v-model="form.moneyAmount" show-word-limit> </el-input>
          </el-form-item>
          <!-- 选中给予事物援助 -->
          <el-form-item v-if="form.helpMethod.indexOf('2') != -1" label="实物价值金额：" prop="valueAmount">
            <el-input type="number" placeholder="请输入内容" v-model="form.valueAmount" show-word-limit> </el-input>
          </el-form-item>
          <el-form-item :label="form.visitType === 5 ? '帮扶内容' : '走访内容'" prop="content">
            <el-input v-model="form.content" type="textarea" placeholder="请输入内容" />
          </el-form-item>
          <el-form-item :label="form.visitType === 5 ? '帮扶反馈' : '走访反馈'" prop="feedback">
            <el-input v-model="form.feedback" type="textarea" placeholder="请输入内容" />
          </el-form-item>

          <el-form-item label="走访照片" prop="fileUrl">
            <image-upload v-model="form.fileUrl" />
          </el-form-item>
        </div>
        <!-- 走访类型为三色走访人员之外的时候，显示的表单 -->
        <div v-else>
          <el-row>
            <el-col :span="12">
              <el-form-item label="被走访人" prop="personName">
                <el-input :disabled="title==='修改走访信息'" @focus="openChangePeople" v-model="form.personName" placeholder="请选择被走访人" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="行政区划" prop="divisionCode">
                <TreeSelectDivision
                  v-model="form.divisionCode"
                  :disabled="true"
                  @treeselectChange="(e) => treeselectChange(e, form)"
                ></TreeSelectDivision>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="走访地址" prop="address">
            <el-input v-model="form.address" placeholder="请输入走访地址">
              <el-button @click="openMap" slot="append" icon="el-icon-location-outline"></el-button>
            </el-input>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="走访人" prop="visitPersonName">
                <el-input v-model="form.visitPersonName" placeholder="请输入帮扶人姓名" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="走访人电话" prop="personPhone" label-width="130px">
                <el-input v-model="form.visitPersonPhone" placeholder="请输入帮扶人电话" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="走访方式" prop="visitMethod">
                <el-select v-model="form.visitMethod" placeholder="请选择走访方式">
                  <el-option
                    v-for="dict in dict.type.sys_worship_visitingmethods"
                    :key="dict.value"
                    :label="dict.label"
                    :value="parseInt(dict.value)"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="走访日期" prop="visitTime">
                <el-date-picker
                  clearable
                  v-model="form.visitTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="请选择走访日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="走访内容" prop="content">
            <el-input v-model="form.content" type="textarea" placeholder="请输入内容" />
          </el-form-item>
          <el-form-item label="走访反馈" prop="feedback">
            <el-input v-model="form.feedback" type="textarea" placeholder="请输入内容" />
          </el-form-item>

          <el-form-item label="走访照片" prop="fileUrl">
            <image-upload v-model="form.fileUrl" />
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel('open')">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 详情对话框 -->
    <el-dialog class="info" title="走访详情" :visible.sync="infoOpen" width="800px" append-to-body>
      <el-row>
        <el-col :span="12">
          <span> 被走访:</span>
          <span>{{ form.personName }}</span>
        </el-col>
        <el-col :span="12">
          <span> 行政区划:</span>
          <span>{{ form.divisionName }}</span></el-col
        >
      </el-row>
      <el-row>
        <el-col :span="12">
          <span> 走访人:</span>
          <span>{{ form.visitPersonName }}</span>
        </el-col>
        <el-col :span="12">
          <span> 走访人联系方式:</span>
          <span>{{ form.visitPersonPhone }}</span></el-col
        >
      </el-row>
      <el-row>
        <el-col :span="12">
          <span> 走访方式:</span>
          <dict-tag :options="dict.type.sys_worship_visitingmethods" :value="form.visitMethod" />
        </el-col>
        <el-col :span="12">
          <span> 走访日期:</span>
          <span>{{ parseTime(form.visitTime, '{y}-{m}-{d}') }}</span>
        </el-col>
      </el-row>
      <el-row>
        <span> 走访地址:</span>
        <span>{{ form.address }}</span>
      </el-row>
      <el-row>
        <span> 走访内容:</span>
        <span>{{ form.content }}</span>
      </el-row>
      <el-row>
        <span> 走访反馈:</span>
        <span>{{ form.feedback }}</span>
      </el-row>
      <el-row>
        <span> 附件:</span>
        <el-image
          v-for="(item, index) in viewImgList"
          :key="index"
          style="width: 100px; height: 100px"
          :src="viewImgList[index]"
          :preview-src-list="viewImgList"
        >
        </el-image>
      </el-row>
      <el-row>
        <span> 走访满意度:</span>
        <el-rate disabled v-model="form.satisfactionStr" show-text> </el-rate>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('infoOpen')">取 消</el-button>
      </div>
    </el-dialog>
    <ChangePeoPle
      v-if="changePeoPleDialog"
      @close="changePeoPleDialog = false"
      @success="changePeoPleSuccess"
      :type="'petitionData'"
      :peopleList="peopleList"
      :isRadio="true"
    />
    <!-- 地图 -->
    <MapDialog
      @saveMap="saveMap"
      v-if="mapDialogVisible"
      @close="mapDialogVisible = false"
      :propCenter="propCenter"
      :propAddress="propAddress"
    />
  </div>
</template>

<script>
import { listVisiting, getVisiting, delVisiting, addVisiting, updateVisiting } from '@/api/worship/visiting';
import { listByIds } from '@/api/system/oss';
import ChangePeoPle from '@/components/ChangePeoPle/people';
import inputNumberRange from '@/views/worship/components/inputNumberRange';
import MapDialog from '@/components/Map/mapDialog';
export default {
  name: 'Visiting',
  dicts: [
    'sys_worship_visittype',
    'sys_worship_visitingmethods',
    'sys_worship_assistancemeasures',
    'sys_worship_personneltype',
    'sys_worship_personneltag',
    'sys_worship_tuiyijunrenyoufuleibie',
  ],
  components: {
    ChangePeoPle,
    inputNumberRange,
    MapDialog,
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
      // 走访信息标（走访慰问、困难走访、三色走访）表格数据
      visitingList: [],
      personCategoryList: [],

      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      infoOpen: false,
      changePeoPleDialog: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        divisionCode: undefined,
        visitType: undefined,
        visitMethod: undefined,
        visitTime: undefined,
        retirePersonCategory: undefined,
        otherPersonCategory: undefined,
        personTags: undefined,
        age: undefined,
        keyWord: undefined,
        searchAge: undefined,
        searchTime: [],
      },
      // 表单参数
      form: {
        helpMethod: [],
      },
      // 表单校验
      rules: {
        id: [{ required: true, message: '主键不能为空', trigger: 'blur' }],
        divisionCode: [{ required: true, message: '行政区划代码不能为空', trigger: 'blur' }],
        visitType: [{ required: true, message: '走访类型不能为空', trigger: 'change' }],
        armyName: [{ required: true, message: '部队名称不能为空', trigger: 'change' }],
        address: [{ required: true, message: '走访地址不能为空', trigger: 'change' }],
        personName: [{ required: true, message: '被帮扶人名称不能为空', trigger: 'change' }],
        visitPersonName: [{ required: true, message: '走访人姓名不能为空', trigger: 'blur' }],
        visitPersonPhone: [{ required: true, message: '走访人联系方式不能为空', trigger: 'blur' }],
        visitMethod: [{ required: true, message: '走访方式不能为空', trigger: 'change' }],
        visitTime: [{ required: true, message: '走访日期不能为空', trigger: 'blur' }],
        content: [{ required: true, message: '走访内容不能为空', trigger: 'blur' }],
        moneyAmount: [{ required: true, message: '给予资金金额不能为空', trigger: 'blur' }],
        valueAmount: [{ required: true, message: '实物价值金额不能为空', trigger: 'blur' }],
      },
      activeName: '1',
      checkList: [],
      viewImgList: [],
      peopleList: [],
      //地图相关
      // mapDialog
      mapDialogVisible: false,
      // map经纬度
      propCenter: [120.130203, 30.259324],
      // map地址
      propAddress: '',
    };
  },
  computed: {
    anzhiType() {
      return this.$store.getters.anzhiTypeDict;
    },
    userInfo() {
      return this.$store.state.user.user;
    },
    peoPleTagList() {
      return this.$store.state.user.peoPleTagList;
    },
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询走访信息标（走访慰问、困难走访、三色走访）列表 */
    getList() {
      this.loading = true;
      this.queryParams.beginTime = this.queryParams?.searchTime?.[0];
      this.queryParams.endTime = this.queryParams?.searchTime?.[1];
      this.queryParams.beginAge = this.queryParams.searchAge?.[0];
      this.queryParams.endAge = this.queryParams.searchAge?.[1];
      this.queryParams.personCategory = this.personCategoryList?.[1];

      listVisiting(this.queryParams).then((response) => {
        this.visitingList = response.rows;
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
        divisionCode: undefined,
        divisionName: undefined,
        personId: undefined,
        visitType: undefined,
        personName: undefined,
        visitPersonName: undefined,
        address: undefined,
        visitPersonPhone: undefined,
        visitMethod: undefined,
        visitTime: undefined,
        content: undefined,
        feedback: undefined,
        difficultReason: undefined,
        helpMethod: [],
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
      this.queryParams.searchTime = [];
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();

      const { nickName, phonenumber, divisionCode, divisionName } = this.userInfo;
      this.form.visitPersonName = nickName;
      this.form.visitPersonPhone = phonenumber;
      this.form.divisionCode = divisionCode;
      this.form.divisionName = divisionName;
      this.form.visitMethod = 2;
      this.form.visitTime = this.parseTime(new Date());
      this.open = true;
      this.title = '添加走访信息';
    },
    /** 修改按钮操作 */
    handleUpdate(row, key) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids;
      getVisiting(id).then(async (response) => {
        this.loading = false;
        const helpMethod = response.data.helpMethod?.split(',') || [];
        this.form = { ...response.data, helpMethod };
        console.log(this.form);
        this[key] = true;
        this.title = '修改走访信息';
        if (this.form.fileUrl) {
          const { data } = await listByIds(this.form.fileUrl);
          this.viewImgList = data.map((item) => item.url);
        }
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          let helpMethod = this.form.helpMethod.join(',');
          if (this.form.id != null) {
            updateVisiting({ ...this.form, helpMethod })
              .then((response) => {
                this.$modal.msgSuccess('修改成功');
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else {
            addVisiting({ ...this.form, helpMethod })
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
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除走访信息标（走访慰问、困难走访、三色走访）编号为"' + ids + '"的数据项？')
        .then(() => {
          this.loading = true;
          return delVisiting(ids);
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
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        'worship/visiting/export',
        {
          ...this.queryParams,
        },
        `visiting_${new Date().getTime()}.xlsx`
      );
    },
    handleClick() {},
    changePeoPleSuccess(people, type) {
      let data = null;
      if (!Array.isArray(people)) {
        data = [people];
      } else {
        data = people;
      }
      this.peopleList = data;
      this.form.personId = data.map((item) => item.id).join(',');
      this.form.personName = data.map((item) => item.name).join(',');
      this.form.divisionCode = data[0].divisionCode;
      this.form.divisionName = data[0].divisionName;
      this.changePeoPleDialog = false;
    },
    openChangePeople() {
      console.log(this.peopleList);
      this.changePeoPleDialog = true;
    },
    radioChange() {
      this.form.helpMethod = [];
    },

    // 地图相关
    // 打开地图
    openMap() {
      this.form.id ? (this.propCenter = [this.form.longitude || 120.130203, this.form.latitude || 30.259324]) : '';
      this.propAddress = this.form.location;
      this.mapDialogVisible = true;
    },
    // 点击地图保存回调
    saveMap(latLong, address) {
      let point = latLong.split(',');
      this.$set(this.form, 'address', address);
      this.$set(this.form, 'longitude', point[0]);
      this.$set(this.form, 'latitude', point[1]);
      this.$set(this.form, 'location', `${point[0]},${point[1]}`);

      this.propCenter = point;
      this.mapDialogVisible = false;
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
  height: 580px;
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
.tabs {
  display: flex;
  line-height: 40px;
  .draft {
    background: url('~@/assets/images/draft.png');
    width: 102px;
    height: 40px;
    cursor: pointer;
  }
  .el-tabs {
    margin: 0 20px 0 0;
  }
}
::v-deep .el-tabs__nav-wrap::after {
  height: 0px !important;
}
.info {
  .el-row {
    margin: 20px 0 0 0;
    display: flex;
    .el-col {
      display: flex;
      span {
        margin: 0 16px 0 0;
      }
    }
  }
  .el-image {
    margin: 0 16px 0 16px;
  }
}
</style>
