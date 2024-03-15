<template>
  <div class="changeDataExport">
    <el-dialog
      title="选择导出内容"
      :visible.sync="dialogVisible"
      :width="businessData.length > 0 ? '700px' : '400px'"
      :before-close="handleClose"
    >
      <div class="list-box">
        <div class="list">
          <div class="title">基本数据</div>
          <el-tree
            :data="basicData"
            show-checkbox
            default-expand-all
            node-key="id"
            ref="tree"
            highlight-current
            :props="defaultProps"
            @check="treeCheckChange"
          >
          </el-tree>
        </div>
        <div v-if="businessData.length > 0" class="list">
          <div class="title">业务数据</div>
          <el-tree
            :data="businessData"
            show-checkbox
            default-expand-all
            node-key="id"
            ref="tree"
            highlight-current
            :props="defaultProps"
            @check="treeCheckChange1"
          >
          </el-tree>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleExport">导 出</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    businessData: {
      type: Array,
      default: [],
    },
  },
  components: {},
  data() {
    return {
      dialogVisible: true,
      checked: false,
      defaultProps: {
        children: 'children',
        label: 'label',
      },
      checkList: [],
      treeCheck: [],
      treeCheck1: [],
      basicData: [
        {
          id: null,
          label: '全选',
          children: [
            {
              id: 'A',
              label: '基本信息',
            },
            {
              id: 'B',
              label: '组织生活、社会活动信息',
            },
            {
              id: 'C',
              label: '服役信息',
            },
            {
              id: 'D',
              label: '安置信息',
            },
            {
              id: 'E',
              label: '就业创业信息',
            },
            {
              id: 'F',
              label: '教育培训信息',
            },
            {
              id: 'G',
              label: '抚恤优待信息',
            },
            {
              id: 'H',
              label: '褒扬激励信息',
            },
            {
              id: 'I',
              label: '帮扶援助信息',
            },
          ],
        },
      ],
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    handleExport() {
      // 处理基本数据选择框的数据
      let moduleIds = this.treeCheck;
      // 拼接树结构的数据id
      this.treeCheck1.length > 0 ? (moduleIds += ',' + this.treeCheck1) : '';
      if (!moduleIds || moduleIds === ',') {
        this.$message.warning('请选择导出内容');
        return;
      }
      this.$emit('close', moduleIds);
    },
    checkChange(row) {
      console.log(row);
    },
    treeCheckChange(data, tree) {
      // 处理业务数据tree结构选中的数据
      this.treeCheck = tree.checkedKeys.filter((item) => item != null).join(',');
    },
    treeCheckChange1(data, tree) {
      // 处理业务数据tree结构选中的数据
      this.treeCheck1 = tree.checkedKeys.filter((item) => item != null).join(',');
    },
    handleClose() {
      this.$emit('close');
    },
  },
};
</script>

<style scoped lang="scss">
.changeDataExport {
  .list-box {
    display: flex;
  }
  .list {
    background: #f6f6f6;
    padding: 20px 16px;
    box-sizing: border-box;
    width: 100%;
    margin-right: 16px;
    .title {
      font-weight: 600;
    }
    .item {
      margin-top: 20px;
    }
  }
  .el-tree {
    background: none;
  }
  .checkbox {
    margin-left: 30px;
  }
}
</style>
