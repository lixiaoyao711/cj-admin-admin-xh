<template>
  <div class="index">
    <treeselect
      @select="treeselectChange"
      @input="treeChange"
      class="tree-select"
      v-model="treeCode"
      :options="treeOptions"
      placeholder="请选择"
      :defaultExpandLevel="1"
      :normalizer="normalizer"
      :disabled="disabled"
    >
      <div slot="value-label" slot-scope="{ node }">{{ currentLabel || node.label }}</div>
    </treeselect>
  </div>
</template>

<script>
// import the component
import Treeselect from '@riophae/vue-treeselect';
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import store from '@/store';
export default {
  props: {
    divisionCode: {
      type: String,
      default: undefined,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    // 是否只显示当前用户所在行政区划
    isUser: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    Treeselect,
  },
  model: {
    prop: 'divisionCode',
    event: 'treeChange',
  },
  data() {
    return {
      treeCode: undefined,
      currentLabel: '',
      // treeselect配置项
      normalizer(node) {
        if (node.level == 5) {
          delete node.children;
        }
        return {
          id: node.weight,
          children: node.children,
        };
      },
    };
  },
  computed: {
    treeOptions() {
      let backData = this.isUser ? this.$store.getters.divisionsTreeList : this.$store.getters.allDivisionsTreeList;
      return backData;
    },
  },
  watch: {
    divisionCode: {
      handler(newVal, oldVal) {
        this.treeCode = newVal;
        this.getNodeByCode();
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    let element = document.getElementsByClassName('el-dialog__wrapper');
    let elL = [];
    for (let i of element) {
      if (i.style['display'] !== 'none') {
        elL.push(i);
      }
    }
    if (store.state.user.divisionCode !== '330106' && elL.length < 1) {
      this.treeCode = store.state.user.divisionCode;
    }
  },
  mounted() {},
  methods: {
    treeselectChange(node) {
      this.currentLabel = node.allLabel || node.label;
      this.$emit('treeselectChange', node);
    },
    treeChange(value, instanceId) {
      this.$emit('treeChange', this.treeCode);
    },
    getNodeByCode() {
      this.currentLabel = '';
      let that = this;
      let getAllLabel = function (data) {
        data.forEach((e) => {
          if (that.treeCode === e.weight) {
            that.currentLabel = e.allLabel;
            return;
          }
          e.children && getAllLabel(e.children);
        });
      };
      getAllLabel(this.treeOptions);
    },
  },
};
</script>

<style scoped lang="scss">
.index {
}
</style>
