<template>
  <el-dialog
    title="选择部队"
    width="1000px"
    top="10vh"
    :visible.sync="dialogVisible"
    @close="$emit('close')"
    :close-on-click-modal="false"
    append-to-body
  >
    <section>
      <div class="tree">
        <div class="title">组织机构</div>
        <el-tree
          ref="tree"
          :data="deptCommonDict"
          node-key="id"
          @check-change="handleChange"
          @node-click="handleNodeClick"
          :filter-node-method="filterNodeMethod"
          :props="props"
        ></el-tree>
      </div>
    </section>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="saveItem">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { postSupportTask } from '@/api/worship/supportTask';
export default {
  props: [],
  components: {},
  data() {
    return {
      dialogVisible: true,
      treePath: [],
      peopleList: [],
      receivePeaple: [],
      fileList: [],
      title: '',
      form: {
        targetId: '',
        targetName: '',
        logContent: '',
      },
      props: {
        value: 'id',
      },
      allDepartment: [],
      tableData: [],
      checkData: [],
    };
  },
  computed: {
    deptCommonDict() {
      return this.$store.state.user.deptCommonDict;
    },
  },
  watch: {},
  created() {},
  methods: {
    handleClose() {
      this.$emit('close');
    },
    filterNodeMethod(value, data) {
      return data.label !== value;
    },
    saveItem() {
      console.log(this.checkData.childNodes);
      if (this.checkData.childNodes.length !== 0) {
        this.$message.warning('请选择最后一级要发送的部门/部队');
        return;
      }

      this.$emit('close', this.checkData.data);
    },
    handleChange(data) {
      // this.$nextTick(() => {
      //     this.form.logContent = `请${data.label}${this.info.flowType === '1' ? '批示' : '处理'}`;
      //     this.$refs['tree'].setCheckedKeys([data.id]);
      // });
    },
    handlePreview() {},
    handleRemove() {},
    beforeRemove() {},
    handleExceed() {},
    handleSelectionChange(data) {
      this.checkData = data;
    },

    handleNodeClick(data, node, tree) {
      // console.log(data, node, tree);
      this.checkData = node;
    },
  },
};
</script>

<style scoped lang="scss">
section {
  border: 1px solid #e5e5e5;
  display: flex;
  justify-content: space-between;
  .table {
    width: 20%;
  }
  .title {
    background: #f6f6f6;
    border-bottom: 1px solid #e5e5e5;
    line-height: 40px;
    padding: 0 16px;
  }
  .tree {
    padding: 16px;
    height: 30vh;
    width: 100%;
    overflow-y: auto;
  }
}
header {
  line-height: 40px;
}
.remark {
  padding: 16px;
  textarea {
    border: none;
    outline: none;
    width: 100%;
  }
}
v-deep {
  &.el-upload--picture-card {
    width: 80px;
    height: 80px;
    line-height: 1;
    i {
      margin-top: 15px;
    }
  }
  &.el-upload-list--picture-card {
    .el-upload-list__item {
      width: 80px;
      height: 80px;
    }
  }
}
</style>
