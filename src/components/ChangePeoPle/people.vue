<template>
  <div class="box">
    <el-dialog
      :title="typeData[type].title"
      width="1000px"
      top="5vh"
      :visible.sync="dialogVisible"
      @close="$emit('close')"
      :close-on-click-modal="false"
      append-to-body
      v-if="['retireStatus', 'family', 'conscriptFamily', 'otherObjects', 'difficulty'].includes(type)"
    >
      <section class="tree-box">
        <div class="table">
          <div class="right">
            <TreeSelectDivision
              v-model="queryParams.divisionCode"
              @treeselectChange="(e) => treeselectChange(e, queryParams)"
            ></TreeSelectDivision>
            <el-input class="search" placeholder="请输入搜索关键字" v-model="queryParams.keyWord"></el-input>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </div>
          <el-table
            height="40vh"
            :data="tableData"
            @selection-change="handleSelectionChange"
            @current-change="currentChangeionChange"
            row-key="id"
            ref="table"
          >
            <el-table-column v-if="isRadio" label="选择" width="55">
              <template slot-scope="{ row }">
                <el-radio v-model="checkData" :disabled="checkedKeys.length !== 0" :label="row"><i></i></el-radio>
              </template>
            </el-table-column>
            <el-table-column v-else :selectable="selectable" type="selection" width="55" reserve-selection>
            </el-table-column>
            <el-table-column prop="name" label="姓名" width=""> </el-table-column>
            <el-table-column prop="idCard" label="身份证号码" width=""> </el-table-column>
            <el-table-column prop="phone" label="联系方式" width=""> </el-table-column>
            <el-table-column prop="divisionName" label="行政区划" width=""> </el-table-column>
          </el-table>
          <pagination
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
          />
        </div>
      </section>
      <!-- 多选框选中数据用tag展示,单选不需要 -->
      <div v-if="isRadio === false" class="tag-box">
        <header>已选人员</header>
        <div class="change-tag">
          <el-tag
            class="mr5"
            v-for="item in checkData"
            :key="item.deptId"
            closable
            @close="tagClose(item)"
            type="info"
            size="mini"
          >
            {{ item.name }}
          </el-tag>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="$emit('close')">取 消</el-button>
        <el-button type="primary" @click="handleSave">下一步</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="选择人员"
      width="1000px"
      top="10vh"
      :visible.sync="dialogVisible"
      @close="$emit('close')"
      :close-on-click-modal="false"
      append-to-body
      v-if="type === 'petitionData' || type === 'petitionDynamics' || type === 'happy'"
    >
      <section class="tree-box">
        <div class="table">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane
              :disabled="item.disabled"
              v-for="(item, index) in tabs"
              :key="index"
              :label="item.label"
              :name="item.name"
            ></el-tab-pane>
          </el-tabs>
          <div class="right">
            <TreeSelectDivision
              v-model="queryParams.divisionCode"
              @treeselectChange="(e) => treeselectChange(e, queryParams, 'divisionCode')"
            ></TreeSelectDivision>
            <el-input class="search" placeholder="请输入搜索关键字" v-model="queryParams.keyWord"></el-input>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </div>
          <el-table
            height="40vh"
            :data="tableData"
            @selection-change="handleSelectionChange"
            @current-change="currentChangeionChange"
            ref="table"
            row-key="id"
          >
            <el-table-column v-if="isRadio" label="选择" width="55">
              <template slot-scope="{ row }">
                <el-radio v-model="checkData" :disabled="checkedKeys.length !== 0" :label="row"><i></i></el-radio>
              </template>
            </el-table-column>
            <el-table-column v-else :selectable="selectable" type="selection" width="55" reserve-selection>
            </el-table-column>
            <el-table-column prop="name" label="姓名" width=""> </el-table-column>
            <el-table-column prop="idCard" label="身份证号码" width=""> </el-table-column>
            <el-table-column prop="phone" label="联系方式" width=""> </el-table-column>
            <el-table-column prop="divisionName" label="行政区划" width=""> </el-table-column>
          </el-table>
          <pagination
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
          />
        </div>
      </section>
      <!-- 多选框选中数据用tag展示,单选不需要 -->
      <div v-if="isRadio === false" class="tag-box">
        <header>已选人员</header>
        <div class="change-tag">
          <el-tag
            class="mr5"
            v-for="item in checkData"
            :key="item.deptId"
            closable
            @close="tagClose(item)"
            type="info"
            size="mini"
          >
            {{ item.name }}
          </el-tag>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="$emit('close')">取 消</el-button>
        <el-button type="primary" @click="handleSave">下一步</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { listBasicPerson, conscriptsParentList } from '@/api/worship/basicPerson';
import { listServiceFamily } from '@/api/worship/serviceFamily';
import { careInfoList } from '@/api/worship/carePersonList';
import { listOutdoorsPerson } from '@/api/worship/peopleList';
import { listServiceMen } from '@/api/worship/serviceMen';
export default {
  props: {
    // 'retireStatus':退役军人 'happy':送喜报   'conscriptFamily':'义务兵家属'  'petitionData':信访  'family':现役军人家属  'otherObjects':其他优抚对象 'difficulty':困难人员  'petitionDynamics':'信访咨询动态'
    type: {
      type: String,
      default: 'retireStatus',
    },
    // 是否单选
    isRadio: {
      type: Boolean,
      default: false,
    },
    peopleList: {
      type: Array,
      default: () => [],
    },
  },
  components: {},
  data() {
    return {
      dialogVisible: true,
      treePath: [],
      receivePeaple: [],
      fileList: [],
      accept: ['.jpg', '.png'],
      form: {
        targetId: '',
        targetName: '',
        logContent: '',
        searchValue: '',
      },
      props: {
        isLeaf: 'leaf',
        value: 'id',
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        keyWord: '',
        // divisionCode: '',
      },
      activeName: 'retireStatus',
      tabs: [
        {
          label: '退役军人',
          name: 'retireStatus',
          disabled: false,
        },
        {
          label: '其他优抚对象',
          name: 'otherObjects',
          disabled: false,
        },
        {
          label: '现役军人家属',
          name: 'activeDuty',
          disabled: false,
        },
      ],

      typeData: {
        retireStatus: {
          title: '选择退役军人',
        },
        happy: {
          title: '选择送喜人',
        },
        otherObjects: {
          title: '选择其他优抚对象',
        },
        petitionData: {
          title: '选择信访人员',
        },
        family: {
          title: '选择现役人员家属',
        },
        conscriptFamily: {
          title: '选择义务兵人员家属',
        },
        difficulty: {
          title: '选择困难人员',
        },
      },
      allDepartment: [],
      ///存表格选择的数据
      checkData: [],
      editCheckId: '',
      tableData: [],
      checkedKeys: [],
      deptId: 0,
      total: 0,
      listData: this.peopleList,
    };
  },
  computed: {},
  watch: {
    // peopleList() {
    //   this.listData = this.peopleList;
    // },
  },
  created() {
    this.getList();
  },
  mounted() {
    if (this.type === 'petitionDynamics') {
      this.tabs.push({
        label: '户外人员',
        name: 'outdoor',
        disabled: false,
      });
    }
  },
  methods: {
    // 获取人员列表数据
    getList() {
      console.log(this.checkData);
      console.log(this.type);
      if (this.type === 'petitionData' || this.type === 'petitionDynamics' || this.type === 'happy') {
        if (this.activeName === 'retireStatus') {
          this.getListBasicPerson(1);
        }
        if (this.activeName === 'otherObjects') {
          this.getListBasicPerson(2);
        }
        if (this.activeName === 'activeDuty') {
          this.getListBasicPerson(3);
        }
        if (this.activeName === 'outdoor') {
          this.getListPetitionPerson();
        }
        if (this.activeName === 'serviceMen') {
          this.getListServiceMenData();
        }
      }
      if (this.type === 'retireStatus') {
        this.getListBasicPerson(1);
      }
      if (this.type === 'conscriptFamily') {
        this.getConscriptsParentList();
      }

      if (this.type === 'family') {
        this.getListBasicPerson(3);
      }
      if (this.type === 'otherObjects') {
        this.getListBasicPerson(2);
      }
      if (this.type === 'difficulty') {
        this.getDifficultyPerson();
      }
      if (this.type === 'happy') {
        this.tabs = [
          {
            label: '退役军人',
            name: 'retireStatus',
            disabled: false,
          },
          {
            label: '现役军人',
            name: 'serviceMen',
            disabled: false,
          },
        ];
      }
    },

    getConscriptsParentList() {
      conscriptsParentList(this.queryParams).then((peo) => {
        this.total = peo.total;
        this.tableData = peo.rows;
        if (this.listData.length) {
          this.checkData = JSON.parse(JSON.stringify(this.listData));
          this.checkData.map((item) => this.$refs.table.toggleRowSelection(item));
          this.listData = [];
        }
      });
    },
    getListBasicPerson(type) {
      this.queryParams.attribute = type;
      listBasicPerson(this.queryParams).then((peo) => {
        this.total = peo.total;
        this.tableData = peo.rows;
        if (this.listData.length) {
          this.checkData = JSON.parse(JSON.stringify(this.listData));
          this.checkData.map((item) => this.$refs.table.toggleRowSelection(item));
          this.listData = [];
        }
      });
    },
    /** 查询户外人员列表数据 */
    getListPetitionPerson() {
      listOutdoorsPerson({
        ...this.queryParams,
        attribute: null,
        type: 1,
      }).then((peo) => {
        this.total = peo.total;
        this.tableData = peo.rows.map((item) => {
          item.name = item.outName;
          item.idCard = item.outIdCard;
          item.phone = item.outPhone;
          item.divisionName = item.outDivisionName;
          item.divisionCode = item.outDivisionCode;
          return item;
        });
        if (this.listData.length) {
          this.checkData = JSON.parse(JSON.stringify(this.listData));
          this.checkData.map((item) => this.$refs.table.toggleRowSelection(item));
          this.listData = [];
        }
      });
    },
    getListServiceMenData() {
      listServiceMen(this.queryParams).then((peo) => {
        this.total = peo.total;
        this.tableData = peo.rows;
      });
    },
    getDifficultyPerson() {
      this.queryParams.type = 1;
      careInfoList(this.queryParams).then((peo) => {
        this.total = peo.total;
        this.tableData = peo.rows.map((item) => {
          item.name = item.personInfo.name;
          item.id = item.personInfo.id;
          item.idCard = item.personInfo.idCard;
          item.phone = item.personInfo.phone;
          item.divisionName = item.personInfo.divisionName;
          item.divisionCode = item.personInfo.divisionCode;
          return item;
        });

        if (this.listData.length) {
          this.checkData = JSON.parse(JSON.stringify(this.listData));
          this.checkData.map((item) => this.$refs.table.toggleRowSelection(item));
          this.listData = [];
        }
      });
    },
    getListServiceFamily() {
      this.queryParams.attribute = null;
      listServiceFamily(this.queryParams).then((peo) => {
        this.total = peo.total;
        this.tableData = peo.rows;
      });
    },
    search() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    reset() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        deptId: undefined,
        whetherStock: this.type,
        keyWord: '',
      };
      this.getList();
    },

    handleSave() {
      if (
        (Array.isArray(this.checkData) && this.checkData.length === 0) ||
        (!Array.isArray(this.checkData) && !this.checkData.id)
      ) {
        this.$message.warning('请选择人员');
        return;
      }
      const petitionDynamicsType = this.activeName === 'outdoor' ? 1 : 0;
      this.$emit('success', this.checkData, petitionDynamicsType);
    },

    handleSelectionChange(data) {
      this.checkData = data;
      if (this.type === 'petitionDynamics') {
        if (this.activeName === 'outdoor' && this.checkData.length > 0) {
          this.tabs[0].disabled = true;
          this.tabs[1].disabled = true;
          this.tabs[2].disabled = true;
        } else {
          this.tabs[0].disabled = false;
          this.tabs[1].disabled = false;
          this.tabs[2].disabled = false;
        }
        if (this.activeName !== 'outdoor' && this.checkData.length > 0) {
          this.tabs[3].disabled = true;
        } else {
          this.tabs[3].disabled = false;
        }
      }

      this.$emit('checkClick', data);
    },
    currentChangeionChange(data) {
      this.$emit('radioClick', data);
    },

    selectable() {
      return this.checkedKeys.length === 0;
    },

    // tag关闭
    tagClose(row) {
      this.checkData = JSON.parse(JSON.stringify(this.checkData.filter((item) => item.id !== row.id)));
      this.$refs.table.toggleRowSelection(row);
    },
    handleClick() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
  },
};
</script>
<style lang="scss">
.el-table .DisableSelection .cell .el-checkbox__inner {
  display: none !important;
}
.search {
  width: 300px;
}
</style>

<style scoped lang="scss">
.right {
  display: flex;
  margin: 6px 0;
  .el-input {
    margin: 0 16px 0 16px;
  }
}
.box {
  width: 100%;
}
section {
  border: 1px solid #e5e5e5;
}
.tree-box {
  display: flex;
  .table {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    // height: 40vh;
  }

  .title {
    background: #f6f6f6;
    border-bottom: 1px solid #e5e5e5;
    line-height: 40px;
    padding: 0 16px;
  }
  .tree {
    padding: 16px;
    height: 58vh;
    width: 100%;
    overflow-y: auto;
  }
}
.change-tag {
  height: 100px;
  overflow: scroll;
  border: 1px solid #e5e5e5;
  padding: 6px;
  box-sizing: border-box;
  margin: 10px 0 0 0;
}
header {
  line-height: 40px;
}
.remark {
  padding: 16px;
  textarea {
    border: none;
    outline: none;
    width: 100%;
  }
}
::v-deep .el-upload--picture-card {
  width: 80px;
  height: 80px;
  line-height: 1;
  i {
    margin-top: 15px;
  }
}
::v-deep .el-upload-list--picture-card {
  .el-upload-list__item {
    width: 80px;
    height: 80px;
  }
}
::v-deep.el-tree {
  .el-tree-node {
    .is-leaf {
      & + .el-checkbox {
        .el-checkbox__inner {
          display: inline-block;
        }
      }
    }
  }
}
::v-deep {
  .el-tree {
    .el-tree-node {
      .el-checkbox {
        .el-checkbox__inner {
          display: none;
        }
      }
    }
  }
}
/* 去除滚动条 */
::-webkit-scrollbar {
  display: none;
}
</style>
