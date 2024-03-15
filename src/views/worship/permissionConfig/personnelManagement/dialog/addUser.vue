<template>
  <el-dialog
    :title="info.userId ? '编辑人员' : '新增人员'"
    width="45%"
    :visible.sync="dialogVisible"
    @close="handleClose"
  >
    <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="form">
      <div class="sec">
        <el-col :span="12">
          <el-form-item label="登录名:" prop="userName">
            <el-input v-model="form.userName" maxlength="100"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="行政区划:" prop="divisionCode">
            <TreeSelectDivision
              v-model="form.divisionCode"
              @treeselectChange="(e) => treeselectChange(e, form)"
            ></TreeSelectDivision>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号:" prop="phonenumber">
            <el-input v-model="form.phonenumber" maxlength="100"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="姓名:" prop="nickName">
            <el-input v-model="form.nickName" maxlength="100"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="所属部门:" prop="deptId">
            <el-cascader
              v-model="form.deptId"
              :options="allDepartment"
              :props="{ checkStrictly: true, value: 'id' }"
              clearable
            ></el-cascader>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="角色:" prop="roleIds">
            <el-select v-model="form.roleIds" multiple>
              <el-option
                v-for="item in roleOptions"
                :key="item.roleId"
                :label="item.roleName"
                :value="item.roleId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleSave">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getUser, updateUser, deptTreeSelect, changeAreCommonlyUs, optionselect, addUser } from '@/api/system/user';
import { checkPhone } from '@/utils/regular';
export default {
  props: ['info', 'type'],
  components: {},
  data() {
    return {
      dialogVisible: true,
      form: {
        userName: '',
      },

      roleOptions: [],
      allDepartment: [],

      rules: {
        userName: [{ required: true, message: '请输入登录名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        passwordRepeat: [
          {
            required: true,
            trigger: 'blur',
            vm: this,
            validator: (rule, value, callback) => {
              let password = rule.vm.form.password;
              if (!password) {
                callback(new Error('请先输入密码'));
              } else if (!value) {
                callback(new Error('请再次输入密码'));
              } else if (password !== value) {
                callback(new Error('两次输入的密码不一致'));
              } else {
                callback();
              }
            },
          },
        ],
        divisionCode: [{ required: true, message: '请选择行政区划', trigger: 'change' }],
        roleIds: [{ required: true, message: '请选择权限', trigger: 'change' }],
        postIds: [{ required: true, message: '请选择岗位', trigger: 'change' }],
        deptId: [{ required: true, message: '请选择', trigger: 'change' }],
        phonenumber: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('请输入手机号'));
              } else if (!checkPhone(value)) {
                callback(new Error('请输入正确的手机号'));
              } else {
                callback();
              }
            },
          },
        ],
        nickName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        remark: [{ required: true, message: '请选择', trigger: 'blur' }],
      },
    };
  },
  computed: {},
  watch: {},
  created() {
    this.info.userId && this.getUserById();
    this.getRoleList();
    this.getTreeData();
  },
  methods: {
    getUserById() {
      getUser(this.info.userId).then((res) => {
        this.form = res.data.user;
        this.$set(this.form, 'roleIds', res.data.roleIds);
        this.$set(this.form, 'postIds', res.data.postIds);
      });
    },
    getRoleList() {
      optionselect().then((res) => {
        console.log(res);
        this.roleOptions = res.data;
      });
    },
    getTreeData() {
      deptTreeSelect({
        whetherStock: '1',
      }).then((res) => {
        console.log(res);
        this.allDepartment = res.data;
      });
    },
    handleSave() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.form.isStock = '1';
          console.log('deptId', this.form.deptId);
          this.form.deptIds = Array.isArray(this.form.deptId)
            ? this.form.deptId[this.form.deptId.length - 1]
            : this.form.deptId;

          delete this.form.deptId;
          if (this.form.userId) {
            updateUser(this.form).then((res) => {
              this.$message.success('编辑成功');
              this.$emit('success');
            });
          } else {
            addUser(this.form).then((res) => {
              this.$message.success('新增成功');
              this.$emit('success');
            });
          }
        }
      });
    },
    treeselectChange(e, form) {
      console.log(e);
      form.divisionCode = e.weight;
      form.divisionName = e.label;
      form.divisionLevel = e.level;
    },
    handleClose() {
      this.$emit('close');
    },
  },
};
</script>

<style scoped lang="scss">
.sec {
  width: 100%;
  margin-bottom: 20px;
  clear: both;
  &::after {
    content: '';
    display: table;
    clear: both;
  }
  .title {
    font-size: 16px;
    font-weight: bold;
    height: 30px;
    display: flex;
    align-items: center;
    .follow {
      flex: 1;
      margin-left: 20px;
      ::v-deep .el-select {
        width: 100%;
      }
    }
  }
}
.warn {
  color: #ffff00;
}
::v-deep .el-input,
.el-select,
.el-cascader {
  width: 100%;
}
::v-deep .deptCascader {
  .el-input__inner {
    &::placeholder {
      font-size: inherit;
      color: #606266 !important;
    }
  }
}
</style>
