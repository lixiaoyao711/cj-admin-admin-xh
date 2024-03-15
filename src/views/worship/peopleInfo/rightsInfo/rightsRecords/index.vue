<template>
  <div class="index">
    <header>
      <div class="tags">
        <!-- <div class="tag-item">
          <span>人员类型:</span>
          <el-tag type="info">人员类型</el-tag>
        </div> -->
        <div class="tag-item">
          <span>三色标记:</span>
          <dict-tag :options="dict.type.sys_worship_sslx" :value="formData.colorMark" />
        </div>
        <div class="tag-item">
          <span>重点类型:</span>
          <dict-tag :options="dict.type.sys_worship_focustype" :value="formData.keyTypes" />
        </div>
      </div>
    </header>
    <main>
      <div class="title">
        <span>权益维护记录</span>
        <div class="buttons">
          <!-- <el-button type="" size="mini">删 除</el-button> -->
          <!-- <el-button type="primary" size="mini">新 建</el-button> -->
        </div>
      </div>
      <div class="table">
        <el-table :data="tableData" border stripe height="90%">
          <el-table-column type="selection" label="" width=""></el-table-column>
          <el-table-column label="日期" align="center" prop="reportTime" />
          <el-table-column label="登记级别" align="center" prop="">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.sys_worship_djjb" :value="scope.row.infoRegisterLevel" />
            </template>
          </el-table-column>
          <el-table-column label="信访人" align="center" prop="petitionPersonName" />

          <el-table-column prop="" label="信访目的" width="">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.sys_worship_xfmd" :value="scope.row.infoObjective" />
            </template>
          </el-table-column>
          <el-table-column prop="" label="渠道">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.sys_worship_xfdjqd" :value="scope.row.infoChannel" />
            </template>
          </el-table-column>
          <el-table-column prop="petitionContent" label="诉求内容"></el-table-column>
          <el-table-column prop="divisionName" label="行政区划"></el-table-column>
          <el-table-column label="信息等级" align="center" prop="infoUrgencyLevel">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.sys_worship_jjcd" :value="scope.row.infoUrgencyLevel" />
            </template>
          </el-table-column>
          <el-table-column label="是否重复访" align="center" prop="divisionName">
            <template slot-scope="scope"> {{ scope.row.isRepeat == '1' ? '是' : '否' }} </template>
          </el-table-column>
          <el-table-column label="处理进度" align="center" prop="state">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.sys_worship_xfzt" :value="scope.row.state" />
            </template>
          </el-table-column>
          <el-table-column label="距办结时间" align="center" prop="divisionName">
            <template slot-scope="scope">
              <div>
                <dict-tag
                  v-if="typeof scope.row.lagState === 'number'"
                  :options="dict.type.sys_worship_wczt"
                  :value="scope.row.lagState"
                />
                <span v-else>{{ scope.row.lagState }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作" width="90">
            <template slot-scope="scope">
              <el-button size="mini" type="text">
                <router-link :to="`/petitionInfo/detail/info/${scope.row.id}`">
                  <el-button size="mini" type="text">详情</el-button>
                </router-link>
              </el-button>
              <el-button size="mini" type="text" class="del" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </div>
    </main>
  </div>
</template>

<script>
import {
  listPetitionInfo,
  queryPetitionInfoByPersonId,
  delPetitionInfo,
  getPersonById,
} from '@/api/worship/petitionInfo.js';
import { getBasicPerson } from '@/api/worship/retiredSoldier';
export default {
  props: {},
  components: {},
  dicts: [
    'sys_worship_xfzt', //信访状态
    'sys_worship_xfmd', //信访目的
    'sys_worship_djjb', //登记级别
    'sys_worship_jjcd', //紧急程度
    'sys_worship_xfdjqd', //信访登记渠道
    'sys_worship_xfmdlx', //信访目的类型
    'sys_worship_wczt', //完成状态
    'sys_worship_sslx', //三色类型
    'sys_worship_focustype', //重点类型
  ],
  data() {
    return {
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        personId: this.$route.params.id,
      },
      tableData: [],
      formData: {},
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getList();
    this.getDataByPerson(this.$route.params.id);
  },
  mounted() {},
  methods: {
    async getDataByPerson(personId) {
      const { data } = await getPersonById({ id: personId });
      this.formData = data;
      const { data1 } = await getBasicPerson(personId);
      this.formData = { ...this.formData, ...data1 };
    },
    async getList() {
      let data = await queryPetitionInfoByPersonId(this.queryParams);
      if (data.code === 200) {
        this.tableData = data.rows;
        this.total = data.total;
      }
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$modal
        .confirm('是否确认删除信访人为"' + row.petitionPersonName + '"的数据项？')
        .then(() => {
          return delPetitionInfo(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess('删除成功');
        })
        .catch(() => {})
        .finally(() => {});
    },
  },
};
</script>

<style scoped lang="scss">
.index {
  header {
    background: #fff;
    padding: 16px 10px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    .tags {
      display: flex;
      .tag-item {
        display: flex;
        align-items: center;
        margin-right: 20px;
        span {
          margin-right: 10px;
        }
      }
    }
  }
  main {
    background: #fff;
    padding: 16px 10px;
    box-sizing: border-box;
    margin: 10px 0 0 0;
    .title {
      display: flex;

      justify-content: space-between;
    }
  }
  .table {
    height: 52vh;
    margin: 10px 0 0 0;
  }
}
</style>
