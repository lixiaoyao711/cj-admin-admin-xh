<template>
  <div class="batchDifficult">
    <el-dialog title="选择信访人" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <template>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
          <el-table-column prop="name" label="困难类型">
            <template slot-scope="{ row }">
              <div>
                <el-popover
                  v-if="row.difficultType == null"
                  class="popover"
                  trigger="click"
                  popper-class="tri-popper"
                  :ref="`popover-${row.id}`"
                  :value="row.showPop"
                  @hide="checkList = []"
                >
                  <el-button class="tri-popper-color" type="primary" plain slot="reference">无,转困难</el-button>
                  <el-radio-group v-model="checkList">
                    <el-radio :label="1">医疗困难</el-radio><br />
                    <el-radio :label="5">就业困难</el-radio><br />
                    <el-radio :label="6">其他</el-radio><br />
                  </el-radio-group>
                  <div class="pop-btn">
                    <el-button :disabled="checkList.length === 0" size="mini" type="primary" @click="submit(row)"
                      >申请</el-button
                    >
                  </div>
                </el-popover>
                <div v-else>
                  {{ row.difficultType }}
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleClose">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    propsData: Array,
  },
  components: {},
  data() {
    return {
      dialogVisible: true,
      tableData: [],
      checkList: [],
      typeMap: {
        1: '医保困难',
        5: '就业困难',
        6: '其他',
      },
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.tableData = this.propsData;
  },
  methods: {
    handleClose() {
      this.$emit('close');
    },
    submit(row) {
      row.difficultType = this.checkList;
      axios({
        url: '/careDifficult/add',
        method: 'post',
        data: row,
      }).then((res) => {
        row.difficultType = this.typeMap[row.difficultType];
        this.$message.success('操作成功');
      });
    },
  },
};
</script>

<style scoped lang="scss">
.el-radio {
  margin: 20px 0 0 0;
}
.pop-btn {
  cursor: pointer;
  margin: 20px 0 0 0;
  .submit {
    color: #1890ff;
    margin-left: 20px;
  }
}
.batchDifficult {
}
</style>
