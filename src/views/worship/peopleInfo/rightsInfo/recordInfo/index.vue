<template>
  <div class="index">
    <main>
      <div class="title">
        <span>接访列表</span>
        <div class="buttons">
          <!-- <el-button type="" size="mini">删 除</el-button> -->
        </div>
      </div>
      <div class="table">
        <el-table v-loading="loading" :data="tableData" @selection-change="handleSelectionChange" height="60vh">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="内容" align="center" prop="content" width="500" />
          <el-table-column label="被接访人" align="center" prop="intervieweeName" />
          <el-table-column label="召集人" align="center" prop="convener" />
          <el-table-column label="参加人" align="center" prop="participants" />
          <el-table-column label="接访时间" align="center" prop="dateVisit" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.dateVisit, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>

          <el-table-column label="接访地点" align="center" prop="visitingAddress" />
          <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="handleUpdate(scope.row, 'leaderInfoDialog')">详情</el-button>
              <el-button size="mini" type="text" @click="handleUpdate(scope.row, 'open')">修改</el-button>

              <el-button size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>
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
      <pagination
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </main>
    <!-- 添加或修改领导接访对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="900px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <!-- // 人员详情新建||编辑自动填充被接访人并且不可更改 -->
        <el-form-item label="被接访人：" prop="intervieweeName">
          <el-input v-model="form.intervieweeName" @focus="changePeopleDialog = true" readonly></el-input>
        </el-form-item>
        <el-row v-for="(item, index) in convenerList">
          <el-col :span="11">
            <el-form-item label="召集人:" required>
              <el-input v-model="item.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="职务:" required>
              <el-input v-model="item.work"></el-input>
            </el-form-item>
          </el-col>
          <i @click="removeConvener(index)" v-if="convenerList.length > 1" class="el-icon-remove-outline"></i>
        </el-row>
        <el-form-item>
          <el-tag @click="addConvener" type="info" effect="plain">添加召集人</el-tag>
        </el-form-item>
        <el-row v-for="(item, index) in participantsList">
          <el-col :span="11">
            <el-form-item label="参加人:" required>
              <el-input v-model="item.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="职务:" required>
              <el-input v-model="item.work"></el-input>
            </el-form-item>
          </el-col>
          <i @click="removeParticipants(index)" v-if="participantsList.length > 1" class="el-icon-remove-outline"></i>
        </el-row>
        <el-form-item>
          <el-tag @click="addParticipants" type="info" effect="plain">添加参加人</el-tag>
        </el-form-item>
        <div class="line"></div>

        <el-row>
          <el-col :span="12">
            <el-form-item label="接访日期：" prop="dateVisit">
              <el-date-picker v-model="form.dateVisit" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属镇街：" prop="divisionCode">
              <TreeSelectDivision
                v-model="form.divisionCode"
                @treeselectChange="(e) => treeselectChange(e, form)"
              ></TreeSelectDivision>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="接访地点：" prop="">
          <el-input v-model="form.visitingAddress"></el-input>
        </el-form-item>
        <el-form-item label="接访内容：" prop="">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 6 }"
            placeholder="请输入内容"
            v-model="form.content"
            resize="none"
          ></el-input>
        </el-form-item>
        <el-form-item label="上传照片：">
          <imageUpload v-model="form.fileUrl" :fileSize="500" :fileType="['jpg', 'png', 'avi', 'wmv', 'mpeg', 'mp4']" />
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
  listLeaderShip,
  getLeaderShip,
  delLeaderShip,
  addLeaderShip,
  updateLeaderShip,
} from '@/api/worship/leaderShip';

export default {
  props: {},
  components: {},
  data() {
    return {
      // 按钮loading
      buttonLoading: false,
      // 遮罩层
      loading: true,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        id: [{ required: true, message: '主键不能为空', trigger: 'blur' }],
        intervieweeName: [{ required: true, message: '被接访人姓名不能为空', trigger: 'change' }],
        intervieweeId: [{ required: true, message: '被接访人ID不能为空', trigger: 'blur' }],
        convener: [{ required: true, message: '召集人不能为空', trigger: 'blur' }],
        participants: [{ required: true, message: '参加人不能为空', trigger: 'blur' }],
        dateVisit: [{ required: true, message: '接访日期不能为空', trigger: 'blur' }],
        streetId: [{ required: true, message: '所属镇街id不能为空', trigger: 'blur' }],
        streetName: [{ required: true, message: '镇街名称不能为空', trigger: 'blur' }],
        visitingAddress: [{ required: true, message: '接访地址不能为空', trigger: 'blur' }],
        content: [{ required: true, message: '接访内容不能为空', trigger: 'blur' }],
        fileUrl: [{ required: true, message: '附件url不能为空', trigger: 'blur' }],
        divisionCode: [{ required: true, message: '所属镇街不能为空', trigger: 'blur' }],
      },
      tableData: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,
      title: '',
      open: false,
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getList();
  },
  mounted() {},
  methods: {
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
        intervieweeName: undefined,
        intervieweeId: undefined,
        convener: undefined,
        participants: undefined,
        dateVisit: undefined,
        streetId: undefined,
        streetName: undefined,
        visitingAddress: undefined,
        content: undefined,
        fileUrl: undefined,
      };
      this.convenerList = [
        {
          name: '',
          work: '',
        },
      ];
      this.participantsList = [
        {
          name: '',
          work: '',
        },
      ];
      this.resetForm('form');
    },
    /** 导出按钮操作 */
    handleExport(id = 0) {
      console.log(id);
      if (id !== 0) {
        this.download(
          '/worship/leaderShip/exportWord ',
          {
            id,
          },
          `leaderShip_${new Date().getTime()}.docx`
        );
        return;
      }
      this.download(
        'worship/leaderShip/export',
        {
          ...this.queryParams,
        },
        `leaderShip_${new Date().getTime()}.xlsx`
      );
    },
    /** 修改按钮操作 */
    handleUpdate(row, type) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids;
      getLeaderShip(id).then((response) => {
        this.loading = false;
        this.form = response.data;
        this.participantsList = this.form?.participants
          ?.split(';')
          .map((item) => {
            const arr = item.split(',');
            return {
              name: arr[0],
              work: arr[1],
            };
          })
          .filter((item) => item.name !== '');
        this.convenerList = this.form?.convener
          ?.split(';')
          .map((item) => {
            const arr = item.split(',');
            return {
              name: arr[0],
              work: arr[1],
            };
          })
          .filter((item) => item.name !== '');
        this[type] = true;
        this.title = '修改领导接访';
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.form.participants = '';
          this.form.convener = '';
          console.log(this.convenerList, this.participantsList);

          if (this.participantsList.some((item) => item.name === '' || item.work === '')) {
            this.$message.error(' 请检查参加人输入是否合法');
            return;
          }
          if (this.convenerList.some((item) => item.name === '' || item.work === '')) {
            this.$message.error('请检查召集人输入是否合法');
            return;
          }
          this.form.convener = this.convenerList.map((item) => `${item.name},${item.work}`).join(';');
          this.form.participants = this.participantsList.map((item) => `${item.name},${item.work}`).join(';');
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateLeaderShip(this.form)
              .then((response) => {
                this.$modal.msgSuccess('修改成功');
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else {
            addLeaderShip(this.form)
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
      const name = row.name ?? this.filterDelData(this.ids, this.tableData, 'intervieweeName');
      this.$modal
        .confirm('是否确认删除被接访人为"' + name + '"的数据项？')
        .then(() => {
          this.loading = true;
          return delLeaderShip(ids);
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    getList() {
      this.loading = true;
      let params = JSON.parse(JSON.stringify(this.queryParams));
      params['intervieweeId'] = this.$route.params.id;
      console.log(params);
      listLeaderShip(params).then((response) => {
        this.tableData = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
  },
};
</script>

<style scoped lang="scss">
.index {
  main {
    background: #fff;
    padding: 16px 10px;
    box-sizing: border-box;
    .title {
      display: flex;

      justify-content: space-between;
    }
  }
  .table {
    height: 52vh;
    margin: 10px 0 0 0;
  }
}
</style>
