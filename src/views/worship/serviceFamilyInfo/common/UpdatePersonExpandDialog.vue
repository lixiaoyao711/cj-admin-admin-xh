<!-- 人员扩展信息编辑弹框 -->
<template>
  <el-dialog
    append-to-body
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :visible.sync="dialogVisible"
    width="900px"
    v-bind="$props"
  >
    <el-form v-if="form" ref="form" :model="form" v-bind="$props.formProps">
      <el-form-item v-for="col in formOptions" :prop="col.prop" :label="col.label">
        <template v-if="col.type == 'text'">
          <el-input v-model="form[col.prop]" v-bind="col.$attrs || {}" clearable></el-input>
        </template>
        <template v-else-if="col.type == 'radio'">
          <el-radio-group v-model="form[col.prop]" v-bind="col.$attrs || {}">
            <el-radio v-for="(item, index) in col.options" :key="index" :label="item" v-bind="col.$attrs"></el-radio>
          </el-radio-group>
        </template>
        <template v-else-if="col.type === 'datePicker'">
          <el-date-picker v-model="form[col.prop]" v-bind="col.$attrs || {}"> </el-date-picker>
        </template>
        <template v-else-if="col.type === 'select'">
          <el-select v-model="form[col.prop]" v-bind="col.$attrs">
            <el-option v-for="item in col.options" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </template>
        <template v-else-if="col.type === 'checkbox'">
          <el-checkbox-group v-model="form[col.prop]">
            <el-checkbox v-for="checkbox in col.$attrs.options" :label="checkbox"></el-checkbox>
          </el-checkbox-group>
        </template>
        <template v-else-if="col.type === 'TreeSelectDivision'">
          <!-- 已经全局挂载 -->
          <TreeSelectDivision
            v-model="form[col.prop]"
            @treeselectChange="(e) => treeselectChange(e, form[col.prop], [col.prop], `${[col.prop]}Code`)"
          ></TreeSelectDivision>
        </template>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onSubmit">确 定</el-button>
      <el-button @click="onCancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getPersonExpandById, addPersonExpand, updatePersonExpand } from '@/api/worship/retiredSoldier';
export default {
  name: 'UpdatePersonExpandDialog',
  components: {},
  props: {
    expandChildType: {
      type: String, //拓展子类型
      required: true,
    },
    title: {
      type: String,
      default: '编辑',
    },
    expandChildData: {
      type: Object, //人员扩展子类信息
    },
    formOptions: {
      type: [Array, Object],
    },
    formRules: {
      type: Object,
      default: () => {
        return {};
      },
    },
    colCount: {
      type: Number,
      default: 1,
    },
    visible: {
      type: Boolean,
      default: false,
    },
    formProps: {
      type: Object,
      default: () => {
        return {
          'label-suffix': '',
          'label-position': 'left',
          'label-width': '150px',
        };
      },
    },
    submitAble: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      form: null,
    };
  },
  computed: {
    dialogVisible: {
      set: function (nv) {
        this.$emit('update:visible', false);
        return nv;
      },
      get: function (ov) {
        return this.visible;
      },
    },
  },
  watch: {},
  methods: {
    initFormData() {
      if (this.expandChildData && this.expandChildData.expandContent) {
        this.formOptions.forEach((i) => {
          if (i.type == 'checkbox') {
            if (typeof this.expandChildData.expandContent[i.prop] == 'string') {
              if (this.expandChildData.expandContent[i.prop].length > 0) {
                //字符串 转成 数组
                this.expandChildData.expandContent[i.prop] = this.expandChildData.expandContent[i.prop].split(',');
              } else {
                //空字符串 转成 空数组
                this.expandChildData.expandContent[i.prop] = [];
              }
            }
          }
        });

        this.form = JSON.parse(JSON.stringify(this.expandChildData.expandContent));
        console.log('initFormData', this.expandChildData.expandContent, this.form);
      }
    },
    open() {
      this.$emit('update:visible', true);
    },
    close() {
      this.$emit('update:visible', false);
    },
    onSubmit() {
      this.$refs.form.validate().then((res) => {
        if (res) {
          let { personId, expandChildType, expandParentType, id } = this.expandChildData;
          //校验成功
          let formData = JSON.stringify(this.form);
          let submitData = {
            personId: personId,
            expandChildType: expandChildType,
            expandParentType: expandParentType,
            expandContent: formData,
          };
          this.expandChildData['expandContent'] = formData;
          if (id) {
            submitData['id'] = id;
            console.log('onSubmit', id, submitData);
            this.submitAble &&
              updatePersonExpand(submitData).then((res) => {
                console.log('update', submitData, res);
                this.$emit('submit', this, res);
              });
          } else {
            console.log('onSubmit', id, submitData);
            this.submitAble &&
              addPersonExpand(submitData).then((res) => {
                console.log('add', submitData, res);
                this.$emit('submit', this, res);
              });
          }
        }
      });
    },
    onCancel() {
      this.close();
    },
  },
  created() {
    this.initFormData();
  },
  mounted() {},
  updated() {},
  destroyed() {},
};
</script>
<style lang="scss" scoped></style>
