<template>
  <div class="keyTypeDialog">
    <el-dialog title="重点类型配置" :visible.sync="dialogVisible" width="420px" :before-close="handleClose">
      <div class="item" v-for="(item, index) in keyTypeList" :key="index">
        <div class="item-input" v-if="item.showInput">
          <el-input v-model="item.dictLabel" maxlength="20" show-word-limit></el-input>
          <div class="btns">
            <el-button @click="closeItem(item, index)">取 消</el-button>
            <el-button type="primary" @click="saveItem(item)">保 存</el-button>
          </div>
        </div>
        <div class="item-div" v-else>
          <span>
            {{ item.dictLabel }}
          </span>
          <div>
            <i class="el-icon-edit-outline" @click="editItem(item)"></i>
            <el-button type="text">
              <el-popconfirm title="确定删除吗？" @confirm="deleteItem(item)">
                <i class="el-icon-delete" slot="reference"></i>
              </el-popconfirm>
            </el-button>
          </div>
        </div>
      </div>
      <div class="add">
        <el-button class="button-new-tag" size="small" @click="addItem">新建重点类型</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleClose">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getDicts, addData, updateData, delData, removeDictData } from '@/api/system/dict/data';
export default {
  props: {},
  components: {},
  data() {
    return {
      dialogVisible: true,
      keyTypeList: [],
      dictMapKeyType: {},
    };
  },
  computed: {
    dictMap() {
      return this.$store.state.dict;
    },
  },
  watch: {
    dictMap() {
      this.dictMapKeyType = this.dictMap;
    },
    // dictMapKeyType() {
    //   this.keyTypeList = Object.values(this.dictMapKeyType.key_type).map((item) => {
    //     this.$set(item, 'showInput', false);
    //     // item.showInput = false;
    //     return item;
    //   });
    // },
  },
  created() {},
  mounted() {
    this.getDict();
  },
  methods: {
    getDict() {
      getDicts('sys_worship_focustype').then((res) => {
        this.keyTypeList = res.data.map((item) => {
          item.showInput = false;
          return item;
        });
      });
    },
    handleClose() {
      this.$emit('close');
    },
    editItem(row) {
      console.log(row);
      row.showInput = true;
    },
    saveItem(row) {
      if (row.createBy) {
        updateData(row).then((res) => {
          this.$message.success(`编辑字典成功`);
          row.showInput = false;
          this.getDict();
        });
        return;
      }
      // 给定字典类型和字典名称
      row.dictType = row.dictName = 'sys_worship_focustype';
      // 新增保证value的唯一性
      row.dictSort = row.dictValue =
        Number(
          this.keyTypeList.sort((a, b) => {
            return b.dictValue - a.dictValue;
          })[0].dictValue
        ) + 1 || 1;

      addData(row).then((res) => {
        this.$message.success(`新增字典成功`);
        row.showInput = false;
        this.getDict();
      });
      console.log('row',row);
      this.$store.dispatch('dict/setDict', { key: 'sys_worship_focustype', value: row })

    },
    deleteItem(row) {
      if (this.keyTypeList.length === 1) {
        this.$message.error('重点类型禁止全部删除');
        return;
      }
      removeDictData(row.dictCode).then((res) => {
        this.$message.success('删除字典成功');
        this.showInput = false;
        this.getDict();
      });
    },
    addItem() {
      let obj = {
        dictLabel: '',
        showInput: true,
      };
      this.keyTypeList.push(obj);
    },
    closeItem(row, index) {
      row.showInput = false;
      // 新增点击取消清空掉当前行数据
      row.dictCode || this.keyTypeList.splice(index, 1);
    },
  },
};
</script>

<style scoped lang="scss">
.keyTypeDialog {
  .item-div {
    display: flex;
    justify-content: space-between;
    .el-icon-edit-outline {
      font-size: 20px;
      margin-right: 6px;
      cursor: pointer;
    }
    .el-icon-delete {
      font-size: 20px;
      cursor: pointer;
      color: #000;
    }
  }
  .item-input {
    display: flex;
    justify-content: space-between;
    .el-button {
      margin-left: 16px;
    }
    .btns {
      display: flex;
    }
  }
}
.item {
  margin-top: 16px;
}
.add {
  margin-top: 12px;
}
</style>
