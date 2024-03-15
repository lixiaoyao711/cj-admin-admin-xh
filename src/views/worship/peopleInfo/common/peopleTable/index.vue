<template>
  <div class="index">
    <table border style="table-layout: fixed; word-break: break-all; word-wrap: break-word">
      <tbody>
        <template v-if="tableProps.length">
          <tr>
            <td v-for="(prop, index) in tableProps" :key="index" class="t-name">{{ prop.label }}</td>
          </tr>
          <tr v-for="(item, indey) in tableData" :key="indey">
            <td v-for="(prop, index) in tableProps" :key="item.prop">
              <span v-if="prop.label !== '操作'"> {{ item[prop.prop] }}</span>
              <slot v-else name="post" :row="item"></slot>
            </td>
          </tr>
        </template>

        <template v-else>
          <tr v-for="(item, index) in filterData(tableData, count)" :key="index">
            <td v-for="(name, nIndex) in item" :key="nIndex" :class="nIndex % 2 === 0 ? 't-name' : ''">
              <span v-if="name.type === 'text'"> {{ name.key }}</span>
              <span v-if="name.type === 'dict'">
                <dict-tag :options="dict.type[name.dict]" :value="name.key" />
              </span>
              <span v-if="name.type === 'tag'">
                <el-tag v-for="(tag, index) in name.key" type="info">{{ tag }}</el-tag></span
              >
              <div @click="viewImg(name.file)" class="cur" v-if="name.type === 'file'">
                {{ name.key }}
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
    <el-image style="width: 100px; height: 100px" :src="url" :preview-src-list="srcList" ref="image"> </el-image>
  </div>
</template>

<script>
import { listByIds } from '@/api/system/oss';
export default {
  dicts: [
    'sys_worship_educationlevel',
    'sys_worship_academicdegree',
    'sys_worship_householdeegistration',
    'sys_worship_personneltag',
    'sys_worship_facetype',
    'sys_worship_physicalcondition',
    'sys_worship_focustype',
    'sys_worship_ethnicgroup',
    'sys_worship_maritalstatus',
    'sys_user_sex',
    'sys_yes_no',
  ],

  props: {
    tableData: {
      type: Array,
      default: () => [],
    },
    count: {
      type: Number,
      default: 3,
    },
    //判断是否是表格数据
    tableProps: {
      type: Array,
      default: () => [],
    },
  },
  components: {},
  data() {
    return {
      srcList: [],
      url: '',
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 过滤数据为table格式能渲染的格式
    filterData(data, value = 3) {
      let returnData = [];
      let countArray = [];
      for (let i = 0; i < data.length; i += value) {
        countArray = [];
        for (let j = i; j - i < value; j++) {
          if (data[j]) {
            let obj = [
              {
                key: data[j].name,
                type: 'text',
              },
              {
                key: data[j].value,
                type: data[j].type,
                file: data[j].file,
                dict: data[j].dict,
              },
            ];
            countArray.push(...obj);
          }
        }
        returnData.push(countArray);
      }
      return returnData;
    },
    async viewImg(path) {
      if (!path) {
        this.$message.error('暂无图片');
        return;
      }
      if (Array.isArray(path)) {
        // 有http的图片直接展示,没有的需要请求接口
        this.srcList = path.filter((item) => item.indexOf('http') > -1);
        const notPath = path.filter((item) => item.indexOf('http') === -1);
        let urlList;
        if (notPath.length) {
          const { data } = await listByIds(notPath.join(','));
          urlList = data;
          this.srcList = [...this.srcList, urlList && urlList.map((item) => item.url)];
        }
      } else {
        this.srcList = path.split(',');
      }
      this.$refs.image.showViewer = true;
    },
  },
};
</script>

<style scoped lang="scss">
.index {
  table {
    width: 100%;
    margin: 0 auto;
    border: 1px solid #dadada;
    border-collapse: collapse;
    margin: 10px 0 0 0;
  }

  th,
  td {
    border: 1px solid #dadada;
    text-align: center;
    height: 50px;
    font-size: 18px;
  }
  .t-name {
    width: 180px;
    background-color: #fafafd;
    font-weight: bold;
    font-size: 18px;
  }
  .el-tag {
    margin: 0 10px 0 0;
  }
}
.el-image {
  display: none;
}
</style>
