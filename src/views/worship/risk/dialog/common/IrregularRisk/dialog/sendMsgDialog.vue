<template>
  <div class="sendMsgDialog">
    <el-dialog :visible.sync="dialogVisible" width="400px" :before-close="handleClose">
      <div class="tree-box">
        <el-tree
          ref="tree"
          show-checkbox
          :data="treeData"
          :props="defaultProps"
          node-key="weight"
          @node-click="handleNodeClick"
          :check-strictly="true"
        ></el-tree>
      </div>
      <div class="msg-box">
        <div class="title">通知内容</div>
        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6 }" placeholder="请输入内容" v-model="msgData">
        </el-input>
      </div>
      <div slot="title">
        <el-button @click="setAll(treeData)">全选</el-button>
        <el-button @click="setStreet">仅选择镇街</el-button>
        <el-button @click="clearAll">取消选择</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveItem">发送通知</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { sendNotice } from '@/api/worship/risk';
import { listByIds } from '@/api/system/oss';
export default {
  props: {
    propsData: Object,
  },
  components: {},
  data() {
    return {
      data: [],
      defaultProps: {
        children: 'children',
        label: 'label',
      },
      msgData: '模板已更新,请下载最新的模板上传报告!',
      dialogVisible: true,
      keys: [],
      fileUrl: '',
    };
  },
  computed: {
    treeData() {
      let backData = this.$store.getters.divisionsTreeList || this.$store.getters.allDivisionsTreeList;
      return backData;
    },
  },
  watch: {},
  created() {},
  mounted() {
    console.log('treeData', this.treeData);
    this.getImgList(this.propsData.filePath).then((res) => {
      this.fileUrl = res;
    });
  },
  methods: {
    handleClose() {
      this.$emit('close');
    },
    async getImgList(id) {
      const { data } = await listByIds(id);
      let list = data.map((e) => {
        return { name: e?.originalName, url: e?.url, ossId: e?.ossId };
      });
      return list?.[0].url;
    },
    handleNodeClick() {},
    saveItem() {
      let divisionCode = this.$refs.tree.getCheckedKeys().join(',');

      if (divisionCode === '') {
        this.$message.error('请选择通知对象');
        return;
      }
      if (this.fileUrl === '') {
        this.$message.error('文件不存在,请重新上传文件');
        return;
      }
      sendNotice({
        divisionCode,
        content: `${this.msgData}请在PC端打开链接下载最新不定期风险报告模板。下载链接为:${this.fileUrl}`,
        fileId: this.propsData.id,
      }).then((res) => {
        this.$message.success('发送成功');
        this.$emit('success');
      });
    },
    setAll(list) {
      let keys = [];
      for (const item of list) {
        this.keys = [...this.keys, item.weight];
        if (item.children) {
          this.keys = [...this.keys, ...this.setAll(item.children)];
        }
        keys = [...keys, item.weight];
      }
      this.$refs.tree.setCheckedKeys(this.keys);

      return keys;
    },

    setStreet() {
      let keys = [];
      for (const item of this.treeData[0]?.children.filter((item) => item.level === 4)) {
        console.log(item);
        keys = [...keys, item.weight];
      }
      this.$refs.tree.setCheckedKeys(keys);
    },
    clearAll() {
      this.$refs.tree.setCheckedKeys([]);
    },
  },
};
</script>

<style scoped lang="scss">
.sendMsgDialog {
  .tree-box {
    padding: 10px;
    box-sizing: border-box;
    border-bottom: 1px solid #cdc3c3;
  }
  .msg-box {
    .title {
      margin: 10px 0;
    }
  }
}
</style>
