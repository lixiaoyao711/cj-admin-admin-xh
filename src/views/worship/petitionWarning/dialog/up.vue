<template>
  <el-dialog
    :title="title"
    width="1000px"
    top="10vh"
    :visible.sync="dialogVisible"
    @close="$emit('close')"
    :close-on-click-modal="false"
  >
    <section class="tree-box">
      <!-- <OftenPeople :isRadio="true" @radioClick="handleSelectionChange" :getType="info.flowType" /> -->
    </section>

    <header>备注</header>
    <section class="remark">
      <textarea v-model="form.logContent" name="" id="" cols="30" rows="5" placeholder="请输入"></textarea>
      <el-upload
        class="upload"
        action="/common/upload"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :on-success="handleSuccess"
        :headers="headers"
        list-type="picture-card"
        multiple
        :file-list="fileList"
      >
        <i class="el-icon-plus"></i><br />
        上传文件
      </el-upload>
    </section>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button :loading="btnLoading" v-if="info.flowType === '2'" @click="handleSave">下 派</el-button>
      <el-button :loading="btnLoading" v-if="info.flowType === '1'" @click="handleSave">上 报</el-button>
      <el-button :loading="btnLoading" v-if="info.flowType === '9'" @click="handleSave">转 交</el-button>
      <el-button :loading="btnLoading" v-if="info.flowType === '5'" type="danger" @click="backItem" plain
        >退 回</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
// import OftenPeople from '@/components/oftenPeople';
export default {
  props: ['info'],
  components: {
    // OftenPeople,
  },
  data() {
    return {
      dialogVisible: true,
      treePath: [],
      peopleList: [],
      receivePeaple: [],
      btnLoading: false,
      fileList: [],
      accept: ['.jpg', '.png'],
      headers: {
        Authorization: sessionStorage.token,
      },
      title: '',
      form: {
        targetId: '',
        targetName: '',
        logContent: '',
      },
      sendTypeMap: {
        //flowType:1：上报 2：下派 3：反馈 4：办结 5：退回 6：驳回 7：审核通过 8：评价
        1: '上报',
        2: '下派',
        3: '反馈',
        4: '办结',
        5: '退回',
        6: '驳回',
        7: '审核通过',
        8: '评价',
        9: '转交',
      },
      props: {
        isLeaf: 'leaf',
        label: 'deptName',
        value: 'deptId',
      },
      allDepartment: [],
      checkData: [],
      editCheckId: '',
      tableData: [],
    };
  },
  computed: {
    // allDepartment () { return this.$store.state.allDepartment }
  },
  watch: {},
  created() {
    console.log(this.info, this.allDepartment);
    this.title = this.sendTypeMap[this.info.flowType || '0'];
    this.getTreeData();
  },
  methods: {
    getTreeData() {
      axios({
        url: '/system/dept/uacList',
        method: 'get',
        params: {
          uacDeptId: 'top',
        },
      }).then((res) => {
        console.log(res);
        this.allDepartment = res;
      });
    },
    filterNodeMethod(value, data) {
      return data.label !== value;
    },
    handleExpand(data) {
      console.log(123);
    },
    treeChange(data) {
      console.log(data);
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve(node.data);
      }
      axios({
        url: '/system/dept/uacList',
        method: 'get',
        params: {
          uacDeptId: node.data.uacDeptId,
        },
      }).then((res) => {
        // length为0代表到了最后的节点需要请求人员
        if (res.length !== 0) {
          node.data.children = res;
          resolve(res);
        } else {
          resolve([]);
        }
      });
    },
    handleSave() {
      console.log(this.checkData);
      if (this.checkData.length === 0) {
        this.$message.warning('请选择要发送的人员');
        return;
      }
      let logContent = '';
      this.form.logContent
        ? (logContent = `请${this.checkData.nickName || this.checkData.deptName}处理,` + this.form.logContent)
        : (logContent = `请${this.checkData.nickName || this.checkData.deptName}处理`);

      let formData = Object.assign({}, this.info, {
        // 选择人传递userID和userName,选择部门传递deptId和deptName!部门和人只能二选一
        targetId: this.checkData.userId || `D${this.checkData.deptId}`,
        targetName: this.checkData.userName || this.checkData.deptName,
        logContent,
      });
      formData.logFile = this.fileList.map((e) => {
        let { id, name, url } = e;
        return { id, name, url };
      });
      console.log(formData);
      if (this.title === '退回') {
        formData.permissionStatus = 0;
        formData.feedbackState = 0;
      }
      this.$confirm(`确定${this.title}吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.btnLoading = true;
        axios.post(`/petitionInfo/${this.info.id ? 'update' : 'add'}`, formData).then(() => {
          this.$message.success('操作成功');
          this.btnLoading = false;
          this.$emit('success');
        });
      });
    },
    handleNodeClick(data) {
      axios({
        url: '/system/dept/uacList',
        method: 'get',
        params: {
          uacDeptId: data.uacDeptId,
        },
      }).then((res) => {
        // length为0代表到了最后的节点需要请求人员
        if (res.length !== 0) {
          // data.children = res;
        } else {
          axios({
            url: '/admin/system/dept/getUserByDeptId',
            method: 'get',
            params: {
              deptId: data.deptId,
            },
          }).then((peo) => {
            this.tableData = peo;
          });
        }
      });
    },
    handleSelectionChange(data) {
      this.checkData = data;
    },
    handleChange(data, checked) {
      if (checked) {
        this.editCheckId = data.id;
        this.$refs.tree.setCheckedKeys([data.id]);
        this.form.logContent = `请${data.label}${this.info.flowType === '1' ? '批示' : '处理'}`;
      } else {
        if (this.editCheckId == data.id) {
          this.$refs.tree.setCheckedKeys([data.id]);
          this.form.logContent = `请${data.label}${this.info.flowType === '1' ? '批示' : '处理'}`;
        }
      }
    },
    handleSuccess(res, file, fileList) {
      console.log(res, file, fileList);
      this.fileList = fileList;
      file.url = res.data.url;
      console.log(this.fileList);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.fileList = fileList;
      this.deleteFile.push(file);
    },
    handlePreview(file) {
      console.log(file);
      window.open(file.url);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
  },
};
</script>

<style scoped lang="scss">
section {
  border: 1px solid #e5e5e5;
}
.tree-box {
  display: flex;
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
::v-deep .el-upload--picture-card {
  width: 80px;
  height: 80px;
  line-height: 1;
  i {
    margin-top: 15px;
  }
}
::v-deep .el-upload-list--picture-card {
  .el-upload-list__item {
    width: 80px;
    height: 80px;
  }
}
::v-deep {
  .el-tree {
    .el-tree-node {
      .is-leaf {
        & + .el-checkbox {
          .el-checkbox__inner {
            display: inline-block;
          }
        }
      }
      .el-checkbox {
        .el-checkbox__inner {
          display: none;
        }
      }
    }
  }
}
</style>
