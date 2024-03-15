<template>
  <el-dialog :visible.sync="visible" :title="title" width="50%" :modal="false" append-to-body @close="$emit('close')">
    <div class="trapezoid" v-if="title === '活动详情'">
      <div class="text">
        <p>活动时长</p>
        <p class="hours">{{ formData.activityDuration }}小时</p>
      </div>
    </div>
    <div v-if="title === '活动详情'">
      <el-row class="rows">
        <el-col :span="24" class="alignCenter">
          <el-tag type="info"><dict-tag :options="dict.type.sys_worship_activity" :value="formData.activityType"/></el-tag>
          <span class="name">{{ formData.activityTitle }}</span> 
        </el-col>
        <el-col :span="12">
          组织单位：{{ formData.divisionName }}
        </el-col>
        <el-col :span="12">参加人数：{{ formData.numOfParticipants }}人</el-col>
        <el-col :span="12">
          活动日期：{{ formData.activityTime }}
        </el-col>
        <el-col :span="24">
          <div>参与人：</div>
          <el-tag type="info" class="tag" v-for="(item,index) in participantsNameList" :key="index">{{ item }}</el-tag>
        </el-col>
        <el-col :span="24">
          <div>活动地址：</div>
          {{ formData.activityAddress }}
        </el-col>
        <el-col :span="24">
          <div>活动内容：</div>
          {{ formData.activityContent }}
        </el-col>
        <el-col :span="24">
          <span class="mr10"> 活动照片:</span>
          <el-image
            class="mr10"
            v-for="(item, index) in formData.fileList"
            :key="index"
            style="width: 100px; height: 100px"
            :src="item.url"
            :preview-src-list="formData.fileList[0].url"
          >
          </el-image>
        </el-col>
      </el-row>
    </div>
    <div v-if="title === '小队详情'">
      <el-row class="rows title">基本信息</el-row>
      <el-row class="rows">
        <el-col :span="8">小队名称：{{formData.teamName}}</el-col>
        <el-col :span="10">行政区划：{{formData.divisionName}}</el-col>
        <el-col :span="6">负责人：{{formData.responsiblePerson}}</el-col>
      </el-row>
      <el-row class="rows">
        <el-col :span="8">联系方式：{{formData.phone}}</el-col>
        <el-col :span="7">活动次数：{{formData.numActivities || 0}}次</el-col>
      </el-row>
      <el-row class="rows">
        <el-col :span="24"><div>小队介绍：</div>{{formData.msg}}</el-col>
      </el-row>
      <el-row class="title">成员信息（{{ formData.teamSize }}人）</el-row>
      <el-table :data="formData.teamMemberList" 
          header-row-class-name="table-header"
          :header-cell-style="{background:'rgba(0, 0, 0, 0.02)'}"
          max-height="250"
          :border="false"
          size="medium"
          style="width: 100%;height:100%">
          <el-table-column prop="name" label="姓名" width="100"></el-table-column>
          <el-table-column prop="sex" label="性别" width="100"></el-table-column>
          <el-table-column prop="phonenumber" label="联系方式" width="120"></el-table-column>
          <el-table-column prop="divisionName" label="行政区划" width=""></el-table-column>
          <el-table-column prop="activityDuration" label="服务时长" width="100">
              <template slot-scope="scope">
                  {{ scope.row.activityDuration || 0}}小时
              </template>
          </el-table-column>
          <el-table-column prop="supportTimes" label="志愿活动次数" width="110">
              <template slot-scope="scope">
                  {{ scope.row.activityCount}}次
              </template>
          </el-table-column>
      </el-table>
      <el-row class="title lastTitle">活动信息（{{formData.numActivities}}场）</el-row>
      <el-table :data="formData.activitiesList " 
        header-row-class-name="table-header"
        :header-cell-style="{background:'rgba(0, 0, 0, 0.02)'}"
        max-height="250"
        :border="false"
        size="medium"
        style="width: 100%;height:100%">
        <el-table-column prop="activityTitle" label="活动名称" width=""></el-table-column>
        <el-table-column prop="divisionName" label="组织单位" width=""></el-table-column>
        <el-table-column prop="activityDuration" label="活动时长" width="100">
            <template slot-scope="scope">
                {{ scope.row.activityDuration || 0}}小时
            </template>
        </el-table-column>
        <el-table-column prop="activityTime" label="时间" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.activityTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>

<script>
import { listByIds } from '@/api/system/oss';
export default {
  dicts: ['sys_worship_activity','sys_user_sex'],
  props: ['title', 'formData','visible'],
  components: {},
  data() {
    return {
      dialogVisible: true,
      tableData: [],
      total: 0,
      srcList:[],
      participantsNameList:[],
    };
  },
  computed: {},
  watch: {
    formData(nv,ov){
      if(this.formData.activityFileUrl){
        // this.getImgList()
      }
      if(this.formData.participantsName){
        this.participantsNameList = this.formData.participantsName.split(',')
      }
    }
  },
  mounted() {},
  methods: {
    async getImgList() {
      const { data } = await listByIds(this.formData.activityFileUrl);
      this.srcList = data.map((item) => item.url);
    },
  },
};
</script>

<style lang="scss" scoped>
.rows{
  .name{
    font-weight: 600;
    font-size: 24px;
    margin: 0 12px;
  }
  .attach{
    margin-right: 20px;
    white-space: nowrap;
    display: inline-block;
  }
  .el-col{
    margin-bottom: 24px;
    color: #333333;
    display: flex;
    & > div{
      white-space: nowrap;
    }
    &.alignCenter{
      align-items: center;
    }
  }
}

.title{
  font-size: 16px;
  font-weight: 500;
  color: #000000;
  margin-bottom: 24px;
  &.lastTitle{
    margin-top: 24px;
  }
}
.tag{
  margin-right: 8px;
}
.trapezoid {
  /* 梯形 */
  position: absolute;
  right: 20px;
  top: 54px;
  border-top: 48px solid #ff6e6e;
  border-left: 25px solid transparent;
  border-right: 25px solid transparent;
  height: 0;
  width: 120px;
  text-align: center;
  .text{
    position: absolute;
    text-align: center;
    top: -42px;
    left: 2px;
    .hours{
      font-size: 16px;
    }
  }
  p{
    margin: 0;
    color: #fff;
    white-space: nowrap;
  }
}
</style>
