<template>
  <el-dialog title="修改专班工作" :visible.sync="open" width="1080px" append-to-body @close="cancel">
    <el-form ref="form" :model="form.expandContent" :rules="rules" label-width="140px">
      <el-row>
        <el-col :span="11">
          <el-form-item label="专班区领导" prop="areaLeader">
            <el-input v-model="form.expandContent.areaLeader" placeholder="请输入" /> </el-form-item
        ></el-col>
        <el-col :span="11">
          <el-form-item label="联系方式" prop="areaPhone">
            <el-input v-model="form.expandContent.areaPhone" placeholder="请输入" /> </el-form-item
        ></el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="专班镇街领导" prop="streetLeader">
            <el-input v-model="form.expandContent.streetLeader" placeholder="请输入" /> </el-form-item
        ></el-col>
        <el-col :span="11">
          <el-form-item label="联系方式" prop="streetPhone">
            <el-input v-model="form.expandContent.streetPhone" placeholder="请输入" /> </el-form-item
        ></el-col>
      </el-row>
      <div v-for="(item, index) in peopleList" :key="index" class="peopleList">
        <el-form-item label="其他人员" prop="specialPerson" class="item">
          <el-input v-model="item.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="联系方式" prop="specialPhone" class="item">
          <el-input v-model="item.phone" placeholder="请输入" />
        </el-form-item>
        <div v-if="peopleList.length > 1" class="icon">
          <i @click="deletePeople(index)" class="el-icon-remove-outline icon"></i>
        </div>
      </div>
      <el-row>
        <el-form-item label="" prop="">
          <el-button @click="addPeople" size="mini">添加专班人员</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getPersonExpandById, addPersonExpand, updatePersonExpand } from '@/api/worship/retiredSoldier';
export default {
  props: {
    propsId: '',
  },
  components: {},
  data() {
    return {
      open: true,
      form: {
        expandChildType: 'A1',
        expandParentType: 'A',
        expandContent: {
          areaLeader: '',
          areaPhone: '',
          streetLeader: '',
          streetPhone: '',
          specialPerson: '',
          specialPhone: '',
        },
      },
      peopleList: [
        {
          name: '',
          phone: '',
        },
      ],
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
          res.data.expandContent = JSON.parse(res.data.expandContent);
          this.form = res.data;
          this.peopleList = this.form.expandContent.specialPerson.split(',').map((item, index) => {
            return {
              name: item,
              phone: this.form.expandContent.specialPhone.split(',')[index],
            };
          });
        });
      }
    },
    submitForm() {
      this.$refs['form'].validate((val) => {
        if (val) {
          let formData = JSON.parse(JSON.stringify(this.form));
          formData.expandContent.specialPerson = this.peopleList.map((item) => item.name).join(',');
          formData.expandContent.specialPhone = this.peopleList.map((item) => item.phone).join(',');
          formData.expandContent = JSON.stringify(formData.expandContent);
          formData.personId = this.$route.params.id;
          console.log("🚀 ~ this.$refs['form'].validate ~ formData:", formData);
          if (this.propsId) {
            updatePersonExpand(formData).then((res) => {
              this.$message.success('修改成功');
              this.$emit('success');
              this.$emit('close');
            });
          } else {
            addPersonExpand(formData).then((res) => {
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
    addPeople() {
      this.peopleList.push({
        name: '',
        phone: '',
      });
      console.log(this.peopleList, 'this.peopleList');
    },
    deletePeople(index) {
      this.peopleList.splice(index, 1);
    },
  },
};
</script>

<style scoped lang="scss">
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
