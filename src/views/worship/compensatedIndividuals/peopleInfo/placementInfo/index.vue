<template>
  <div class="main">
    <div class="user-info">
      <div class="header">
        <peopleTitle>无军籍离退休退职职工安置情况</peopleTitle>
        <el-button @click="openDialog('D6')" size="mini">编 辑</el-button>
      </div>
      <peopleTable :tableData="expandChildTypes['D6'].tableData" :count="3" />
    </div>
    <UpdatePersonExpandDialog
      v-if="dialogOpen"
      :visible.sync="dialogOpen"
      ref="updateDialog"
      @submit="onSubmit"
      :formProps="{ labelWidth: '160px' }"
      v-bind="dialogProps"
    >
    </UpdatePersonExpandDialog>
  </div>
</template>

<script>
import peopleTable from '@/views/worship/peopleInfo/common/peopleTable/index';
import peopleTitle from '@/views/worship/peopleInfo/common/title/index';
import { personExpandPersonExpandList } from '@/api/worship/retiredSoldier';
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
      dialogOpen: false, //修改信息
      expandParentType: 'D', //拓展父类型 A:基本信息 B:组织生活信息 C:服役信息 D:安置信息 E:就业创业信息 F:教育培训信息 G:抚恤有待信息 H:褒扬激励信息 I:帮扶救援信息
      expandChildTypes: {
        D6: {
          type: 'D6',
          name: '无军籍离退休退职职工安置情况',
          tableLen: 1,
          tableData: [
            {
              name: '参加工作或入伍时间',
              prop: 'startWorkTime',
              value: '',
              type: 'text',
            },
            {
              name: '离退休时间',
              prop: 'retireTime',
              value: '',
              type: 'text',
            },
            {
              name: '离退休证件号码',
              prop: 'retireCredentialsNo',
              value: '',
              type: 'text',
            },
            {
              name: '原单位',
              prop: 'retirePlaceUnitName',
              value: '',
              type: 'text',
            },
            {
              name: '原职级',
              prop: 'retirePlacePositionLevel',
              value: '',
              type: 'text',
            },
            {
              name: '成为军队职工方式',
              prop: 'becomingArmyWay',
              value: '',
              type: 'text',
            },
            {
              name: '安置管理单位性质',
              prop: 'retirePlaceUnitNature',
              value: '',
              type: 'text',
            },
            {
              name: '安置地',
              prop: 'retirePlaceAddress',
              value: '',
              type: 'text',
            },
            {
              name: '安置计划批次',
              prop: 'retireBatch',
              value: '',
              type: 'text',
            },
            {
              name: '接收时间',
              prop: 'acceptTime',
              value: '',
              type: 'text',
            },
          ],
          data: {
            expandParentType: 'D',
            expandChildType: 'D6',
            personId: this.$route.params.id,
            expandContent: {},
          },
          formOptions: [
            {
              label: '参加工作或入伍时间',
              prop: 'startWorkTime',
              type: 'datePicker',
              $attrs: {
                'value-format': 'yyyy-MM-dd',
              },
            },
            {
              label: '离退休时间',
              prop: 'retireTime',
              type: 'datePicker',
              $attrs: {
                'value-format': 'yyyy-MM-dd',
              },
            },
            {
              label: '离退休证件号',
              prop: 'retireCredentialsNo',
              type: 'text',
              $attrs: {},
            },
            {
              label: '原单位',
              prop: 'retirePlaceUnitName',
              type: 'text',
              $attrs: {},
            },
            {
              label: '原职级',
              prop: 'retirePlacePositionLevel',
              type: 'select',
              options: [
                {
                  label: '基层',
                  value: '基层',
                },
                {
                  label: '中级',
                  value: '中级',
                },
                {
                  label: '高级',
                  value: '高级',
                },
              ],
              $attrs: {},
            },
            {
              label: '成为军队职工方式',
              prop: 'becomingArmyWay',
              type: 'radio',
              options: ['招工', '地方调入', '兵改工', '军转安置', '随军安置', '征地衣转工', '其他'],
              $attrs: {},
            },
            {
              label: '安置管理单位性质',
              prop: 'retirePlaceUnitNature',
              type: 'radio',
              options: ['政府管理', '军队管理'],
              $attrs: {},
            },
            {
              label: '安置地',
              prop: 'retirePlaceAddress',
              type: 'TreeSelectDivision',
              $attrs: {
                type: 'textarea',
                showWordLimit: true,
                maxlength: 500,
              },
            },
            {
              label: '安置计划批次',
              prop: 'retireBatch',
              type: 'radio',
              options: ['一批', '二批', '三批', '四批', '五批', '六批', '2015年度', '其他批次', '无'],
              $attrs: {},
            },
            {
              label: '接收时间',
              prop: 'acceptTime',
              type: 'datePicker',
              $attrs: {
                'value-format': 'yyyy-MM-dd',
              },
            },
          ],
        },
      },
      dialogProps: {
        expandChildType: '', //拓展信息子类型
        title: '编辑', //弹框标题
        colCount: 2,
        expandChildData: {}, //拓展信息表单内容
        formOptions: [], //拓展信息表单配置
        formRules: {},
      },
      itemId: {
        retireDateId: '',
        peopleTypeId: '',
        retirementFundAmountId: '',
        placementStatusReportId: '',
        militaryRetirementDateId: '',
        fileListId: '',
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
    async getAllExpandChildData() {
      let response = await personExpandPersonExpandList({
        expandParentType: 'D',
        personId: this.$route.params.id,
      });
      console.log(response);
      if (response.rows && response.rows.length > 0) {
        const expandDataList = response.rows.map((item) => {
          item.expandContent = JSON.parse(item.expandContent);
          return item;
        });
        console.log('personExpandPersonExpandList: 安置', expandDataList);
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
                // console.log(column);
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
      }
    },
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
      // .rectangle {
      //   width: 200px;
      //   height: 36px;
      //   background: linear-gradient(-45deg, transparent 52px, #1a70e8 0) bottom right,
      //     linear-gradient(-135deg, transparent 52px, #1a70e8 0) top right;
      //   background-size: 100% 100%;
      //   background-repeat: no-repeat;
      //   color: #fff;
      //   display: flex;
      //   align-items: center;
      //   padding: 0 0 0 16px;
      //   box-sizing: border-box;
      // }
      // .rectangle-plus {
      //   min-width: 300px;
      // }
    }
  }
}
/* 去除滚动条 */
::-webkit-scrollbar {
  display: none;
}
</style>
