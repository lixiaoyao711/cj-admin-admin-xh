<template>
  <div class="itemInfo">
    <el-dialog title="更多资料" :visible.sync="dialogVisible" width="1000px" :before-close="handleClose">
      <div>
        <div class="upload">
          <div class="upload-item">
            <div class="upload-title">基本材料</div>
            <div class="img-list" v-for="(item, index) in basicsMap" :key="index">
              <div
                v-for="(img, index) in formData[index + 'Path']"
                class="demo-image__preview img-item"
                @click="viewBigImg(img)"
              >
                <el-image style="width: 100px; height: 100px" :src="img" :preview-src-list="srcList"> </el-image>
                <div class="img-title">{{ item }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="table">
          <peopleTitle>基础身份信息</peopleTitle>
          <peopleTable :tableData="basicInfo" :count="3" />
          <peopleTitle>家庭成员关系</peopleTitle>
          <peopleTable :tableData="familyRelationship" :tableProps="familyRelationshipProps" :count="2" />
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleClose">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import peopleTable from '@/views/worship/peopleInfo/common/peopleTable/index';
import peopleTitle from '@/views/worship/peopleInfo/common/title/index';
import { getAssistanceApplication } from '@/api/worship/careFund';
import { listByIds } from '@/api/system/oss';
import { getBasicPerson, personExpandPersonExpandList } from '@/api/worship/retiredSoldier';

export default {
  props: {
    propsData: Object,
  },
  components: {
    peopleTable,
    peopleTitle,
  },
  data() {
    return {
      dialogVisible: true,
      basicInfo: [],
      familyRelationship: [],
      familyRelationshipProps: [
        {
          label: '关系',
          prop: 'relationship',
        },
        {
          label: '姓名',
          prop: 'name',
        },
        {
          label: '联系电话',
          prop: 'phone',
        },
        {
          label: '工作单位',
          prop: 'workUnit',
        },
      ],

      basicsMap: {
        idCardUrl: '身份证或居住证',
        householdBookUrl: '户口簿或租房合同',
        medicalHistoryUrl: '病史诊断证明',
        basicMedicalInsuranceUrl: '近一年基本医疗保险查询单',
        retiredSoldierAssistanceUrl: '退役军人救助申请表',
      },
      fileMaps: {
        idCardUrl: '身份证或居住证',
        householdBookUrl: '户口簿或租房合同',
        medicalHistoryUrl: '病史诊断证明',
        basicMedicalInsuranceUrl: '近一年基本医疗保险查询单',
        retiredSoldierAssistanceUrl: '退役军人救助申请表',
        communityUrl: '社区公示书',
        paymentVoucher: '打款凭证',
        signatureLeaderUrl: '领导批示',
      },
      srcList: [],
      formData: {},
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.getData();
    this.getBasicPersonData();
    this.getList();
  },
  methods: {
    getData() {
      getAssistanceApplication(this.propsData.id).then(async (res) => {
        this.formData = res.data;
        for (const file in this.fileMaps) {
          console.log('this.formData[file]', this.formData[file]);
          if (this.formData[file]) {
            const url = await this.getImgList(this.formData[file]);
            this.$set(this.formData, file + 'Path', url);
          }
        }

        console.log('formData', this.formData);
      });
    },
    getList() {
      personExpandPersonExpandList({
        expandParentType: 'A',
        personId: this.propsData.beneficiariesId,
      }).then((response) => {
        const data = response.rows.map((item) => {
          item.expandContent = JSON.parse(item.expandContent);
          return item;
        });
        console.log('personExpandPersonExpandList', data);

        //家庭成员关系
        const familyRelationshipData = data.filter((item) => item.expandChildType === 'A2');
        if (familyRelationshipData) {
          console.log('familyRelationshipData', familyRelationshipData);
          this.familyRelationship = familyRelationshipData.map((item) => {
            return {
              ...item.expandContent,
              id: item.id,
              personId: item.personId,
            };
          });
          console.log('familyRelationship', this.familyRelationship);
        }
      });
    },
    getBasicPersonData() {
      getBasicPerson(this.propsData.beneficiariesId).then((response) => {
        const data = response.data;

        let idCardValidity = '';
        if (!data.idCardStartTime && !data.idCardEndTime) {
          idCardValidity = '';
        } else {
          let idCardStartTime = this.parseTime(data.idCardStartTime, '{y}-{m}-{d}');
          let idCardEndTime = this.parseTime(data.idCardEndTime, '{y}-{m}-{d}');
          idCardValidity = data.longTerm === '1' ? idCardStartTime : idCardStartTime + '--' + idCardEndTime;
        }
        this.basicInfo = [
          {
            name: '姓名',
            value: data.name,
            type: 'text',
          },
          {
            name: '身份证号码',
            value: data.idCard,
            type: 'text',
          },
          {
            name: '身份证有效期',
            value: idCardValidity,
            type: 'text',
          },
          {
            name: '身份证签发机关',
            value: data.idCardIssuing,
            type: 'text',
          },
          {
            name: '性别',
            value: data.sex,
            // dict: 'sys_user_sex',
            type: 'text',
          },
          {
            name: '出生日期',
            value: data.birthday,
            type: 'text',
          },
          {
            name: '年龄',
            value: data.age,
            type: 'text',
          },
          {
            name: '联系方式',
            value: data.phone,
            type: 'text',
          },
          {
            name: '民族',
            value: data.nation,
            // dict: 'sys_worship_ethnicgroup',
            type: 'text',
          },
          {
            name: '行政区划',
            value: data.divisionName,
            type: 'text',
          },
          {
            name: '政治面貌',
            value: data.politicalLandscape,
            // dict: 'sys_worship_facetype',
            type: 'text',
          },
          {
            name: '婚姻状况',
            value: data.maritalStatus,
            // dict: 'sys_worship_maritalstatus',
            type: 'text',
          },
          {
            name: '健康状况',
            value: data.health,
            // dict: 'sys_worship_physicalcondition',
            type: 'text',
          },
          {
            name: '户籍类别',
            value: data.registeredResidenceType,
            // dict: 'sys_worship_householdeegistration',
            type: 'text',
          },
          {
            name: '户籍管理单位',
            value: data.registeredResidenceUnit,
            type: 'text',
          },
          {
            name: '户籍地',
            value: data.registeredResidence,
            type: 'text',
          },
          {
            name: '户籍地详细地址',
            value: data.registeredResidenceAddress,
            type: 'text',
          },
          {
            name: '常住地',
            value: data.permanentResidence,
            type: 'text',
          },
          {
            name: '常住地详细地址',
            value: data.permanentResidenceAddress,
            type: 'text',
          },
          {
            name: '是否重点关注群体',
            value: data.whetherToFocusOnGroups ? '是' : '否',
            type: 'text',
          },
          {
            name: '重点类型',
            value: data.keyTypes,
            dict: 'sys_worship_focustype',
            type: 'dict',
          },
          {
            name: '人员标签',
            // value: ['标签1', '标签2'],
            value: data.personnelTags,
            dict: 'sys_worship_personneltag',

            type: 'dict',
          },
        ];
      });
    },
    handleClose() {
      this.$emit('close');
    },
    async getImgList(id) {
      const { data } = await listByIds(id);
      let list = data.map((e) => {
        return { name: e.originalName, url: e.url, ossId: e.ossId };
      });
      return list.map((e) => e.url);
    },
    viewBigImg(url) {
      console.log(url);
      this.$set(this.srcList, 0, url);
    },
  },
};
</script>

<style scoped lang="scss">
.itemInfo {
  .upload {
    color: #1890ff;
    .upload-item {
      display: flex;
      padding: 20px;
      box-sizing: border-box;
      align-items: center;
      flex-wrap: wrap;
      background: #f6f6f6;
      .upload-demo {
        margin: 0 0 0 40px;
      }

      .upload-title {
        width: 22px;
        height: 80px;
        color: #fff;
        background: #1890ff;
        border-radius: 3px;
        text-align: center;
      }
      .img-list {
        display: flex;
        .img-item {
          position: relative;
          margin: 0 20px 0 10px;
          display: flex;
          justify-content: center;
          flex-direction: column;
          width: 100%;
          align-items: center;
          img {
            width: 80px;
            height: 80px;
            object-fit: contain;
          }
          .image-delete {
            position: absolute;
            bottom: 18px;
            left: 0;
            height: 22%;
            width: 100%;
            background: rgba(0, 0, 0, 0.3);
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
          }
        }
      }
    }
  }
  .upload:hover {
    cursor: pointer;
  }
}
</style>
