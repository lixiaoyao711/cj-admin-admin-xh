<!-- 帮扶援助信息 -->
<template>
  <div class="main">
    <div class="user-info">
      <div class="header">
        <peopleTitle>政策保障情况</peopleTitle>
        <el-button size="mini" @click="openDialog('I1')">编 辑</el-button>
      </div>
      <peopleTable :tableData="expandChildTypes['I1'].tableData" :count="3" />
    </div>
    <div class="user-info">
      <div class="header">
        <peopleTitle>困难情况</peopleTitle>
        <!-- <el-button size="mini" @click="openDialog('I2')">编 辑</el-button> -->
      </div>
      <peopleTable :tableData="expandChildTypes['I2'].tableData" :count="3" />
    </div>
    <div class="user-info">
      <div class="header">
        <peopleTitle>困难走访</peopleTitle>
        <!-- <el-button @click="openDialog('I5', null, '新增困难走访')" size="mini">新 增</el-button> -->
      </div>
      <peopleTable
        :tableData="expandChildTypes['I5'].tableData"
        :tableProps="expandChildTypes['I5'].tableProps"
        :count="3"
      >
        <template slot-scope="{ row }" slot="post">
          <el-button @click="openDialog('I5', row, '编辑困难走访')" type="text">编辑</el-button>
          <el-button type="text">
            <el-popconfirm @confirm="delPersonExpandRow(row)" title="确定要删除吗?">
              <el-button slot="reference" type="text">删除</el-button>
            </el-popconfirm>
          </el-button>
        </template>
      </peopleTable>
    </div>
    <UpdatePersonExpandDialog
      v-if="dialogOpen"
      :visible.sync="dialogOpen"
      ref="updateDialog"
      v-bind="dialogProps"
      @submit="onSubmit"
    >
    </UpdatePersonExpandDialog>
  </div>
</template>

<script>
import {
  personExpandPersonExpandList,
  getPersonExpandById,
  addPersonExpand,
  updatePersonExpand,
  delPersonExpand,
} from '@/api/worship/retiredSoldier';
import peopleTable from '@/views/worship/peopleInfo/common/peopleTable/index';
import peopleTitle from '@/views/worship/peopleInfo/common/title/index';
// 拓展信息通用弹框
import UpdatePersonExpandDialog from '@/views/worship/serviceFamilyInfo/common/UpdatePersonExpandDialog.vue';

export default {
  props: {},
  components: {
    peopleTable,
    peopleTitle,
    UpdatePersonExpandDialog,
  },
  data() {
    return {
      expandParentType: 'I', //拓展父类型 A:基本信息 B:组织生活信息 C:服役信息 D:安置信息 E:就业创业信息 F:教育培训信息 G:抚恤有待信息 H:褒扬激励信息 I:帮扶救援信息
      expandChildTypes: {
        //拓展信息子类型
        I1: {
          type: 'I1',
          name: '政策保障情况',
          tableLen: 1,
          tableData: [
            {
              name: '享受政策情况',
              prop: 'policySituation',
              value: '',
              type: 'text',
            },
          ],
          data: {
            personId: this.$route.params.id,
            expandParentType: 'I',
            expandChildType: 'I1',
            expandContent: {
              policySituation: '低保',
            },
          },
          formOptions: [
            {
              label: '享受政策情况',
              prop: 'policySituation',
              type: 'radio',
              options: ['低保', '特困', '不享受政策保障情况'],
              $attrs: {
                size: 'mini',
              },
            },
          ],
        },
        I2: {
          type: 'I2',
          name: '困难情况',
          tableLen: 1,
          tableData: [
            // {
            //   name: '疑似困难入库时间',
            //   prop: 'warehousingTime',
            //   value: '',
            //   type: 'text',
            // },
            {
              name: '民政认定困难类型',
              prop: 'difficultyType',
              value: '',
              type: 'tag',
            },
            // {
            //   name: '转入困难时间',
            //   prop: 'transferTime',
            //   value: '',
            //   type: 'text',
            // },
            // {
            //   name: '核实困难类型',
            //   prop: 'verifyTypeDifficulty',
            //   value: '',
            //   type: 'text',
            // },
            {
              name: '困难情况说明',
              prop: 'explanationDifficulties',
              value: '',
              type: 'text',
            },
          ],
          data: {
            expandParentType: 'I',
            expandChildType: 'I2',
            personId: this.$route.params.id,
            expandContent: {
              // warehousingTime: '',
              difficultyType: [],
              // transferTime: '',
              // verifyTypeDifficulty: '',
              explanationDifficulties: '',
            },
          },
          formOptions: [
            // {
            //   label: '疑似困难入库时间',
            //   prop: 'warehousingTime',
            //   type: 'datePicker',
            //   $attrs: {
            //     'value-format': 'yyyy-MM-dd',
            //   },
            // },
            {
              label: '核实困难类型',
              prop: 'difficultyType',
              type: 'checkbox',
              $attrs: {
                options: [
                  '就业困难',
                  '医疗困难',
                  '养老困难',
                  '住房困难',
                  '教育困难',
                  '低保户',
                  '低边',
                  '特困户',
                  '无民政困难认定',
                  '其他困难(因灾害、事故、见义勇为等造成的困哪)',
                ],
              },
            },
            // {
            //   label: '转入困难时间',
            //   prop: 'transferTime',
            //   type: 'datePicker',
            //   $attrs: {
            //     'value-format': 'yyyy-MM-dd',
            //   },
            // },
            // {
            //   label: '核实困难类型',
            //   prop: 'verifyTypeDifficulty',
            //   type: 'text',
            //   $attrs: {},
            // },
            {
              label: '困难情况说明',
              prop: 'explanationDifficulties',
              type: 'text',
              $attrs: {
                type: 'textarea',
                showWordLimit: true,
                maxlength: 500,
              },
            },
          ],
        },
        I5: {
          type: 'I5',
          name: '困难走访',
          tableProps: [
            {
              label: '困难原因',
              prop: 'difficultReasons',
            },
            {
              label: '帮扶内容',
              prop: 'assistanceContent',
            },
            {
              label: '帮扶人',
              prop: 'helper',
            },
            {
              label: '帮扶人电话',
              prop: 'helperPhone',
            },
            {
              label: '帮扶时间',
              prop: 'assistanceTime',
            },
            {
              label: '操作',
              prop: 'post',
            },
          ],
          tableData: [],
          tableLen: 2,
          data: {
            expandParentType: 'I',
            expandChildType: 'I5',
            expandContent: {
              difficultReasons: '', //困难原因
              assistanceContent: '', //帮扶内容
              helper: '', //帮扶人
              helperPhone: '', //帮扶电话
              assistanceTime: '', //帮扶时间
            },
            personId: this.$route.params.id,
          },
          formOptions: [
            {
              label: '困难原因',
              prop: 'difficultReasons',
              type: 'text',
              $attrs: {
                type: 'textarea',
                showWordLimit: true,
                maxlength: 500,
              },
            },
            {
              label: '帮扶内容',
              prop: 'assistanceContent',
              type: 'text',
              $attrs: {},
            },
            {
              label: '帮扶人',
              prop: 'helper',
              type: 'text',
              $attrs: {},
            },
            {
              label: '帮扶人电话',
              prop: 'helperPhone',
              type: 'text',
              $attrs: {},
            },
            {
              label: '帮扶时间',
              prop: 'assistanceTime',
              type: 'datePicker',
              $attrs: {
                type: 'date',
                placeholder: '选择日期',
                'value-format': 'yyyy-MM-dd',
              },
            },
          ],
        },
        I4: {
          type: 'I4',
          name: '帮扶结果',
          tableLen: 1,
          data: null,
          tableData: [
            {
              name: '帮扶结果',
              prop: 'assistanceResults',
              value: '',
              type: 'text',
            },
          ],
          expandContent: {
            assistanceResults: '',
          },
          formOptions: [
            {
              label: '帮扶结果',
              prop: 'assistanceResults',
              value: '',
              type: 'text',
            },
          ],
        },
      },
      dialogOpen: false, //弹框打开
      resData: '', //帮扶结果
      dialogProps: {
        expandChildType: '', //拓展信息子类型
        title: '编辑', //弹框标题
        colCount: 2,
        expandChildData: {}, //拓展信息表单内容
        formOptions: [], //拓展信息表单配置
        formRules: {},
      },
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getAllExpandChildData();
  },
  mounted() {},
  methods: {
    expendChildDataByType(expendChildType, list, length = 1) {
      // console.log(expendChildType, length);
      //length = 1 表单扩展 ; length > 1 表示多行表格扩展
      //根据expendChildType获取拓展子类数据
      if (!length || length == 1) {
        return list.find((item) => {
          if (item.expandChildType === expendChildType) {
            return item;
          }
        });
      } else {
        let typeArr = list.filter((item) => item.expandChildType === expendChildType);
        typeArr.map((i) => {
          Object.assign(i, i.expandContent);
        });
        return typeArr;
      }
    },
    async getList() {
      let result = await personExpandPersonExpandList({
        expandParentType: 'I',
        personId: this.$route.params.id,
      });
      return result;
    },
    async getAllExpandChildData() {
      let response = await this.getList();
      console.log('getAllExpandChildData', response);
      const expandDataList = response.rows.map((item) => {
        item.expandContent = JSON.parse(item.expandContent);
        return item;
      });
      console.log('personExpandPersonExpandList: 帮扶援助信息', expandDataList);
      for (let key in this.expandChildTypes) {
        let itemData = this.expendChildDataByType(key, expandDataList, this.expandChildTypes[key].tableLen);
        console.log(key, itemData);
        if (itemData) {
          //该子类拓展信息有数据
          if (this.expandChildTypes[key].tableLen == 1) {
            let expandContent = itemData.expandContent;
            this.expandChildTypes[key].tableData.forEach((column) => {
              if (['tag'].includes(column.type) && typeof expandContent[column.prop] == 'string') {
                let arr = expandContent[column.prop].split(',').filter((item) => item);
                column.value = arr;
              } else {
                if (Array.isArray(expandContent[column.prop])) {
                  column.value = expandContent[column.prop].filter((item) => item);
                } else {
                  column.value = expandContent[column.prop];
                }
              }
              console.log(column);
            });
            this.expandChildTypes[key]['data'] = itemData;
          } else {
            this.expandChildTypes[key].tableData = [];
            this.expandChildTypes[key].tableData = itemData;
          }
        }
        console.log(key, this.expandChildTypes[key].tableData);
        console.log('所有子类拓展信息配置: expandChildTypes', this.expandChildTypes);
      }
    },
    initDialogContent(expandChildType, rowData) {
      this.dialogProps.expandChildType = expandChildType; //拓展子信息
      this.dialogProps.formOptions = this.expandChildTypes[expandChildType].formOptions;
      this.dialogProps.expandChildData = rowData
        ? rowData
        : JSON.parse(JSON.stringify(this.expandChildTypes[expandChildType]['data']));
    },
    openDialog(expandChildType, rowData, dialogTitle) {
      //编辑弹框
      this.initDialogContent(expandChildType, rowData);
      console.log('openDialog', this.expandChildTypes[expandChildType]);
      //编辑弹框标题
      this.dialogProps.title = dialogTitle || '编辑' + this.expandChildTypes[expandChildType].name;
      console.log(this.dialogProps, this.expandChildTypes);
      this.dialogOpen = true;
    },
    onSubmit(dialog, result) {
      console.log(dialog, result);
      if (result.code == 200) {
        this.$modal.msgSuccess('成功');
      } else {
        this.$modal.msgError(result.msg || '失败');
      }
      this.getAllExpandChildData();
      this.dialogOpen = false;
    },
    delPersonExpandRow(row) {
      delPersonExpand(row.id).then((res) => {
        if (res.code === 200) {
          this.$modal.msgSuccess('删除成功');
          this.getAllExpandChildData();
        } else {
          this.$modal.msgError(res.msg);
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.main {
  box-sizing: border-box;
  height: 80vh;
  overflow: scroll;

  .user-info {
    margin: 10px 0 0 0;
    padding: 10px;
    box-sizing: border-box;
    background: #fff;

    .header {
      display: flex;
      justify-content: space-between;
    }

    .title {
      margin: 10px 0 0 0;
    }
  }

  .res {
    padding: 10px;
    box-sizing: border-box;

    .el-button {
      margin: 0 0 0 10px;
    }
  }
}

/* 去除滚动条 */
::-webkit-scrollbar {
  display: none;
}
</style>
