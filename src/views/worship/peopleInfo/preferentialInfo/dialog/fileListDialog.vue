<template>
  <div class="workInfoEditDialog">
    <el-dialog :title="title" :visible.sync="open" width="1080px" append-to-body @close="cancel">
      <el-form ref="form" :model="form.expandContent" :rules="rules" label-width="140px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="残疾军人证" prop="">
              <imageUpload v-model="form.expandContent.disabledSoldierUrl" :fileSize="20"></imageUpload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="伤残民兵民工证" prop="">
              <imageUpload v-model="form.expandContent.disabledMilitiaUrl" :fileSize="20"></imageUpload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="因战因公伤残人员证" prop="">
              <imageUpload
                v-model="form.expandContent.disabledPersonDueWarUrl"
                :fileSize="20"
              ></imageUpload> </el-form-item
          ></el-col>
          <el-col :span="12">
            <el-form-item label="烈士证明书" prop="">
              <imageUpload
                v-model="form.expandContent.martyrsCertificateUrl"
                :fileSize="20"
              ></imageUpload> </el-form-item
          ></el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getPersonExpandById, addPersonExpand, updatePersonExpand } from '@/api/worship/retiredSoldier';
export default {
  props: {
    propsId: '',
    title: {
      type: String,
      default: '',
    },
  },
  dicts: [],
  components: {},
  data() {
    return {
      open: true,
      form: {
        expandChildType: 'G6',
        expandParentType: 'G',
        expandContent: {},
      },

      rules: {},
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      if (this.propsId) {
        getPersonExpandById(this.propsId).then((res) => {
          this.form = res.data;
          this.form.expandContent = JSON.parse(this.form.expandContent);
        });
      }
    },
    submitForm() {
      this.$refs['form'].validate((val) => {
        if (val) {
          this.form.expandContent = JSON.stringify(this.form.expandContent);
          this.form.personId = this.$route.params.id;

          if (this.propsId) {
            updatePersonExpand(this.form).then((res) => {
              this.$message.success('修改成功');
              this.$emit('success');
              this.$emit('close');
            });
          } else {
            addPersonExpand(this.form).then((res) => {
              this.$message.success('添加成功');
              this.$emit('success');
              this.$emit('close');
            });
          }
        }
      });
    },
    cancel() {
      this.$emit('close');
    },
  },
};
</script>

<style scoped lang="scss">
.workInfoEditDialog {
}
.icon {
  cursor: pointer;
  color: red;
  margin: 5px 0 0 16px;
  font-size: 20px;
}
.peopleList {
  display: flex;
  // justify-content: space-between;
  .item {
    // flex: 20%;
    width: 46%;
  }
}
</style>
