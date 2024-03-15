<template>
  <div class="app-container">
    <div class="header">送喜报</div>
    <el-form
      class="search-form"
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width=""
    >
      <el-form-item label="行政区划：" prop="divisionCode">
        <TreeSelectDivision
          v-model="queryParams.divisionCode"
          @treeselectChange="(e) => treeselectChange(e, queryParams, 'divisionCode')"
        ></TreeSelectDivision>
      </el-form-item>
      <el-form-item label="喜报类型：" prop="goodNewsType">
        <el-select v-model="queryParams.goodNewsType" placeholder="请选择喜报类型" clearable>
          <el-option
            v-for="dict in dict.type.sys_worship_goodnewstype"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="嘉奖类型：" prop="commendationType">
        <el-select v-model="queryParams.commendationType" placeholder="请选择嘉奖类型" clearable>
          <el-option
            v-for="dict in dict.type.sys_worship_awardtype"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item class="search-right">
        <el-form-item label="" prop="personName">
          <el-input v-model="queryParams.personName" placeholder="输入关键字搜索" clearable />
        </el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="table">
      <div class="table-title-box">
        <div class="title-name">送喜报列表</div>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['worship:sendGoodNews:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['worship:sendGoodNews:add']"
              >新增</el-button
            >
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </div>
      <el-table v-loading="loading" :data="sendGoodNewsList" @selection-change="handleSelectionChange" height="85%">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="立功授奖人员" align="center" prop="personName" />
        <el-table-column label="喜报类型" align="center" prop="goodNewsType">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_worship_goodnewstype" :value="scope.row.goodNewsType" />
          </template>
        </el-table-column>
        <el-table-column label="嘉奖类型" align="center" prop="commendationType">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_worship_awardtype" :value="scope.row.commendationType" />
          </template>
        </el-table-column>
        <el-table-column label="所属部队" align="center" prop="armyName" />
        <el-table-column label="行政区划" align="center" prop="divisionName" />
        <el-table-column label="计划送达时间" align="center" prop="sendDeadlineTime" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.sendDeadlineTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="喜报状态" align="center" prop="status" width="180">
          <template slot-scope="scope">
            <span v-if="scope.row.status === '2'" class="item-personName">
              <el-tag :type="statusOption[scope.row.status].tag">{{ statusOption[scope.row.status].label }}</el-tag>
              <el-button size="mini" type="text" @click="handleStatusChange(scope.row, '2')">修改内容</el-button>
            </span>
            <el-popover v-else placement="bottom" width="80" trigger="click">
              <el-tag
                v-for="item in statusOption"
                :key="item.value"
                @click="handleStatusChange(scope.row, item.value)"
                :type="statusOption[item.value].tag"
                >{{ statusOption[item.value].label }}</el-tag
              >
              <el-tag slot="reference" :type="statusOption[scope.row.status].tag">{{
                statusOption[scope.row.status].label
              }}</el-tag>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleDetail(scope.row)">详情</el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['worship:sendGoodNews:edit']"
              >修改</el-button
            >
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.row)"
              v-hasPermi="['worship:sendGoodNews:remove']"
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
    <!-- 添加或修改送喜报对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="45%" append-to-body>
      <template v-if="title === '喜报详情'">
        <el-row class="rows">
          <el-col :span="12"><span>立功受奖人员：</span>{{ form.personName }}</el-col>
          <el-col :span="12">
            <span>喜报类型：</span>
            <dict-tag :options="dict.type.sys_worship_goodnewstype" :value="form.goodNewsType" />
          </el-col>
          <el-col :span="12">
            <span>嘉奖类别：</span>
            <dict-tag :options="dict.type.sys_worship_awardtype" :value="form.commendationType" />
          </el-col>
          <el-col :span="12"><span>所属部队：</span>{{ form.armyName }}</el-col>
          <el-col :span="12"><span>接收人：</span>{{ form.receivePersonName }}</el-col>
          <el-col :span="12"><span>接收人电话：</span>{{ form.receivePersonPhonenumber }}</el-col>
          <el-col :span="12"><span>计划送达：</span>{{ form.sendDeadlineTime }}</el-col>
          <el-col :span="12"><span>行政区划：</span>{{ form.divisionName }}</el-col>
          <el-col :span="24"><span>送喜地址：</span>{{ form.sendAddress }}</el-col>
          <el-col :span="24"><span>备注：</span>{{ form.remark }}</el-col>
          <el-col :span="24">
            <span>当前状态：</span>
            <el-tag :type="statusOption[form.status].tag">{{ statusOption[form.status].label }}</el-tag>
          </el-col>
        </el-row>
        <el-row class="rows borderTop">
          <el-col :span="12"><span>送喜人：</span>{{ form.sendPersonName }}</el-col>
          <el-col :span="12"><span>送喜时间：</span>{{ form.sendTime }}</el-col>
          <el-col :span="24"><span>送喜反馈：</span>{{ form.sendFeedback }}</el-col>
          <el-col :span="24">
            <span class="mr10"> 活动照片:</span>
            <el-image
              class="mr10"
              v-for="(item, index) in srcList"
              :key="index"
              style="width: 100px; height: 100px"
              :src="srcList[index]"
              :preview-src-list="srcList"
            >
            </el-image>
          </el-col>
        </el-row>
      </template>
      <template v-else>
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <template v-if="title === '喜报送达'">
            <el-row>
              <el-col :span="12">
                <el-form-item label="送喜人：" prop="sendPersonName">
                  <el-input v-model="form.sendPersonName" placeholder="请输入" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="送喜时间：" prop="sendTime">
                  <el-date-picker
                    clearable
                    v-model="form.sendTime"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="请选择送喜时间"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="送喜反馈：" prop="sendFeedback">
              <el-input
                v-model="form.sendFeedback"
                type="textarea"
                :autosize="{ minRows: 2 }"
                placeholder="请输入内容"
              />
            </el-form-item>
            <el-form-item label="照片：" prop="fileUrl">
              <image-upload v-model="form.fileUrl" />
            </el-form-item>
          </template>
          <template v-else>
            <el-row>
              <el-col :span="24">
                <el-form-item label="立功受奖人员：" prop="personName" class="item-personName">
                  <el-input v-model="form.personName" readonly placeholder="请输入立功受奖人员" />
                  <el-button plain @click="showPeople = true">{{ form.personName ? '重新选择' : '选择' }}</el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="喜报类型：" prop="goodNewsType">
                  <el-select v-model="form.goodNewsType" placeholder="请选择喜报类型">
                    <el-option
                      v-for="dict in dict.type.sys_worship_goodnewstype"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="嘉奖类型：" prop="commendationType">
                  <el-select v-model="form.commendationType" placeholder="请选择嘉奖类型">
                    <el-option
                      v-for="dict in dict.type.sys_worship_awardtype"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="所属部队：" prop="armyName">
                  <el-input v-model="form.armyName" placeholder="请输入所属部队" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="行政区划：" prop="divisionCode">
                  <TreeSelectDivision
                    :disabled="true"
                    v-model="form.divisionCode"
                    @treeselectChange="(e) => treeselectChange(e, form)"
                  ></TreeSelectDivision>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="接收人：" prop="receivePersonName">
                  <el-input v-model="form.receivePersonName" placeholder="请输入接收人" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="接收人电话：" prop="receivePersonPhonenumber">
                  <el-input v-model="form.receivePersonPhonenumber" placeholder="请输入接收人电话" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="送达期限：" prop="sendDeadlineTime">
                  <el-date-picker
                    clearable
                    v-model="form.sendDeadlineTime"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="请选择送达期限"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="送达地址：" prop="sendAddress">
              <el-input
                v-model="form.sendAddress"
                type="textarea"
                :autosize="{ minRows: 2 }"
                placeholder="请输入内容"
              />
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
              <el-input v-model="form.remark" type="textarea" :autosize="{ minRows: 2 }" placeholder="请输入内容" />
            </el-form-item>
          </template>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <People v-if="showPeople" :isRadio="true" :type="'happy'" @close="showPeople = false" @success="peoSuccess" />
  </div>
</template>

<script>
import {
  listSendGoodNews,
  getSendGoodNews,
  delSendGoodNews,
  addSendGoodNews,
  updateSendGoodNews,
} from '@/api/worship/sendGoodNews';
import { listByIds } from '@/api/system/oss';
import People from '@/components/ChangePeoPle/people';
export default {
  name: 'SendGoodNews',
  dicts: ['sys_worship_goodnewstype', 'sys_worship_awardtype'],
  components: { People },
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
      // 送喜报表格数据
      sendGoodNewsList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        personName: undefined,
        goodNewsType: undefined,
        commendationType: undefined,
      },
      // 表单参数
      form: {},
      srcList: [],
      showPeople: false,
      statusOption: [
        {
          label: '待镇街领取',
          value: '0',
          tag: 'warning',
        },
        {
          label: '待镇街送达',
          value: '1',
          tag: '',
        },
        {
          label: '已送达',
          value: '2',
          tag: 'success',
        },
      ],
      // 表单校验
      rules: {
        id: [{ required: true, message: '主键不能为空', trigger: 'blur' }],
        personId: [{ required: true, message: '关联人员id不能为空', trigger: 'blur' }],
        personName: [{ required: true, message: '人员姓名不能为空', trigger: 'blur' }],
        goodNewsType: [{ required: true, message: '喜报类型不能为空', trigger: 'change' }],
        commendationType: [{ required: true, message: '嘉奖类型不能为空', trigger: 'change' }],
        sendPersonName: [{ required: true, message: '送喜人姓名不能为空', trigger: 'blur' }],
        sendTime: [{ required: true, message: '送喜时间不能为空', trigger: 'change' }],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询送喜报列表 */
    getList() {
      this.loading = true;
      listSendGoodNews(this.queryParams).then((response) => {
        this.sendGoodNewsList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    async getImgList() {
      if (this.form.fileUrl) {
        const { data } = await listByIds(this.form.fileUrl);
        this.srcList = data.map((item) => item.url);
      }
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
      this.getList();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        createTime: undefined,
        createBy: undefined,
        updateTime: undefined,
        updateBy: undefined,
        createId: undefined,
        updateId: undefined,
        delFlag: undefined,
        personId: undefined,
        personName: undefined,
        goodNewsType: undefined,
        commendationType: undefined,
        armyName: undefined,
        divisionCode: undefined,
        divisionName: undefined,
        receivePersonName: undefined,
        receivePersonPhonenumber: undefined,
        sendDeadlineTime: undefined,
        sendAddress: undefined,
        remark: undefined,
        status: undefined,
        sendPersonName: undefined,
        sendTime: undefined,
        sendFeedback: undefined,
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = '添加送喜报';
    },
    /** 详情按钮操作 */
    handleDetail(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids;
      getSendGoodNews(id).then(async (response) => {
        this.loading = false;
        this.form = response.data;
        await this.getImgList();
        this.open = true;
        this.title = '喜报详情';
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids;
      getSendGoodNews(id).then((response) => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = '修改送喜报';
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateSendGoodNews(this.form)
              .then((response) => {
                this.$modal.msgSuccess('修改成功');
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else {
            addSendGoodNews(this.form)
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
        .confirm('是否确认删除送喜报编号为"' + ids + '"的数据项？')
        .then(() => {
          this.loading = true;
          return delSendGoodNews(ids);
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
    handleStatusChange(row, status) {
      row.status = status;
      if (status === '2') {
        this.loading = true;
        this.reset();
        getSendGoodNews(row.id).then((response) => {
          this.loading = false;
          this.form = row;
          this.open = true;
          this.title = '喜报送达';
        });
      } else {
        updateSendGoodNews(row)
          .then((response) => {
            this.$modal.msgSuccess('修改成功');
            this.getList();
          })
          .finally(() => {
            this.buttonLoading = false;
          });
      }
    },
    peoSuccess(data) {
      this.form.personId = data.id;
      this.form.personName = data.name;
      this.form.divisionCode = data.divisionCode;
      this.form.divisionName = data.divisionName;
      this.showPeople = false;
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
  ::v-deep.el-tag {
    cursor: pointer;
  }
}
.el-popover {
  text-align: center !important;
  .el-tag {
    cursor: pointer;
    margin-bottom: 12px;
  }
}
.item-personName {
  ::v-deep.el-form-item__content {
    display: flex;
    justify-content: center;
  }
  .el-button {
    margin-left: 12px;
  }
}
.rows {
  .el-col {
    color: #333333;
    display: flex;
    margin-bottom: 24px;
    & > span {
      white-space: nowrap;
    }
  }
  &.borderTop {
    border-top: 1px solid #efefef;
    padding-top: 24px;
  }
}
</style>
