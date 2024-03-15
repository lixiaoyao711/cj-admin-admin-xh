<template>
  <div class="leaderInfo">
    <el-dialog title="详情" top="5vh" :visible.sync="dialogVisible" width="800px" :before-close="handleClose">
      <div class="table">
        <div class="table-title">{{ `${propsData.name}信访事项工作开展情况` }}</div>
        <table border>
          <tbody>
            <tr>
              <td class="head">时间</td>
              <td class="td-address">{{ propsData.visitTime }}</td>
              <td class="td-address">会议地点</td>
              <td class="td-address">{{ propsData.visitAddress }}</td>
            </tr>
            <tr>
              <td>召集人</td>
              <td colspan="3" class="td-info">
                {{ propsData.convener }}
              </td>
            </tr>
            <tr>
              <td>参加人</td>
              <td colspan="3" class="td-info">
                {{ propsData.participants }}
              </td>
            </tr>
            <tr>
              <td>内容</td>
              <td colspan="3" class="td-info">
                {{ propsData.content }}
              </td>
            </tr>
            <tr>
              <td>照片</td>
              <td colspan="3" class="td-info">
                <img class="img" v-for="(item, index) in propsData.filePath" :key="index" :src="item.url" alt="" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    propsData: Object,
  },
  components: {},
  data() {
    return {
      dialogVisible: true,
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    console.log(this.propsData);
  },
  methods: {
    handleClose() {
      this.$emit('close');
    },
  },
};
</script>

<style scoped lang="scss">
.leaderInfo {
  .table {
    text-align: center;
    .table-title {
      font-size: 32px;
    }
    table {
      margin: 30px 0 0 0;
      border-collapse: collapse;
      width: 100%;
      font-size: 18px;
      .head {
        width: 100px;
      }
      .img {
        width: 200px;
        height: 200px;
        margin: 0 16px 0 0;
        object-fit: contain;
      }
    }
    .td-info {
      height: 150px;
      overflow: scroll;
    }
    .td-address {
      width: 160px;
    }

    td,
    th {
      border: 1px solid black;
    }
  }
}
</style>
