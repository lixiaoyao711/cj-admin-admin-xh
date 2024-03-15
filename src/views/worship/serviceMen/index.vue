<template>
  <div class="app-container">
    <div class="header">{{ mainTitle }}</div>
    <el-form
      class="search-form"
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="80px"
    >
      <el-form-item label="行政区划" prop="divisionCode">
        <TreeSelectDivision
          v-model="queryParams.divisionCode"
          @treeselectChange="(e) => treeselectChange(e, queryParams)"
        ></TreeSelectDivision>
      </el-form-item>
      <el-form-item label="" prop="divisionName"></el-form-item>

      <el-form-item label="人员类别" prop="personnelCategory">
        <el-select v-model="queryParams.personnelCategory" placeholder="请选择人员类别" clearable>
          <el-option
            v-for="dict in dict.type.sys_worship_personneltype"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="人员标签" prop="personTags">
        <el-select v-model="queryParams.personTags" placeholder="请选择人员标签" clearable>
          <el-option
            v-for="dict in peoPleTagList"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="年龄" prop="searchAge">
        <input-number-range v-model="queryParams.searchAge"></input-number-range>
      </el-form-item>
      <el-form-item label="搜索" prop="keyWord">
        <el-input v-model="queryParams.keyWord" placeholder="姓名、身份证号、联系方式" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <div class="table">
      <div class="table-title-box">
        <div class="title-name">现役军人列表</div>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['worship:serviceMen:remove']"
              >删除所选</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              size="mini"
              :disabled="multiple"
              @click="handleExport('/worship/serviceMen/export', 1, '现役军人列表')"
              v-hasPermi="['worship:serviceMen:export']"
              >导出所选</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              size="mini"
              @click="handleExport('/worship/serviceMen/export', 2, '现役军人列表')"
              v-hasPermi="['worship:serviceMen:export']"
              >导出列表</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              size="mini"
              @click="handleExport('/worship/serviceMen/export', 3, '现役军人列表')"
              v-hasPermi="['worship:serviceMen:export']"
              >导出全部</el-button
            >
          </el-col>

          <el-col :span="1.5">
            <el-button type="info" plain size="mini" @click="handleImport" v-hasPermi="['worship:serviceMen:export']"
              >导入</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              plain
              size="mini"
              @click="handleExport('/worship/serviceMen/serviceMenTemplate', 3, '现役军人导入模板')"
              v-hasPermi="['worship:serviceMen:export']"
              >导入模板下载</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" plain size="mini" @click="handleAdd" v-hasPermi="['worship:serviceMen:add']"
              >新增</el-button
            >
          </el-col>

          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </div>

      <el-table v-loading="loading" :data="serviceMenList" @selection-change="handleSelectionChange" height="61vh">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="姓名" align="center" prop="name" />
        <el-table-column label="身份证" align="center" prop="idCard" />
        <el-table-column label="性别" align="center" prop="sex"></el-table-column>
        <el-table-column label="年龄" align="center" prop="age" />
        <el-table-column label="手机号" align="center" prop="phone" />
        <el-table-column label="人员类别" align="center" prop="personnelCategory">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_worship_personneltype" :value="scope.row.personnelCategory" />
          </template>
        </el-table-column>
        <el-table-column label="家属人数" align="center" prop="phone">
          <template slot-scope="scope">
            <span>{{ scope.row.familyList.length || 0 }}</span>
          </template>
        </el-table-column>

        <el-table-column label="行政区划" align="center" prop="divisionName" />
        <el-table-column label="军队驻地" align="center" prop="armyBase" />
        <el-table-column label="应征地" align="center" prop="landAcquisition" />
        <el-table-column label="家庭住址" align="center" prop="homeAddress" />
        <el-table-column label="军衔等级" align="center" prop="rankLevel">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_worship_militaryrank" :value="scope.row.rankLevel" />
          </template>
        </el-table-column>
        <el-table-column label="服役地区" align="center" prop="serviceArea">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_worship_servicearea" :value="scope.row.serviceArea" />
          </template>
        </el-table-column>
        <el-table-column label="入伍时间" align="center" prop="dateOfEnlistment" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.dateOfEnlistment, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="人员标签" align="center" prop="personTags" width="160">
          <template slot-scope="scope">
            <div v-if="scope.row.personTags">
              <div v-for="(item, index) in scope.row.personTags.split(',')" :key="index">
                {{ peoPleTagList.find((tag) => item == tag.id).dictLabel }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="160px" class-name="small-padding fixed-width" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleInfo(scope.row)">详情</el-button>
            <el-button size="mini" type="text" @click="handleTransfer(scope.row)">转退役军人</el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleUpdate(scope.row, '修改现役军人')"
              v-hasPermi="['worship:serviceMen:edit']"
              >修改</el-button
            >
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.row)"
              v-hasPermi="['worship:serviceMen:remove']"
              >删除</el-button
            >
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

    <!-- 添加或修改现役军人对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="900px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input :disabled="title === '现役军人详情'" v-model="form.name" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证号" prop="idCard">
              <el-input :disabled="title === '现役军人详情'" v-model="form.idCard" placeholder="身份证号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="行政区划" prop="divisionCode">
              <TreeSelectDivision
                v-model="form.divisionCode"
                :disabled="title === '现役军人详情'"
                @treeselectChange="(e) => treeselectChange(e, form)"
              ></TreeSelectDivision>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入伍时间" prop="">
              <el-date-picker
                :disabled="title === '现役军人详情'"
                v-model="form.dateOfEnlistment"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                clearable
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="服役军队代码" prop="">
              <el-input :disabled="title === '现役军人详情'" v-model="form.armyCode" placeholder="请输入服役军队代码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="人员类别" prop="">
              <el-select
                :disabled="title === '现役军人详情'"
                v-model="form.personnelCategory"
                placeholder="请选择人员类别"
              >
                <el-option
                  v-for="dict in dict.type.sys_worship_personneltype"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="服役地区" prop="serviceArea">
              <el-select
                :disabled="title === '现役军人详情'"
                v-model="form.serviceArea"
                placeholder="请选择服役地区"
                clearable
              >
                <el-option
                  v-for="dict in dict.type.sys_worship_servicearea"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select> </el-form-item
          ></el-col>
          <el-col :span="12">
            <el-form-item label="本人或家庭电话" prop="phone">
              <el-input
                :disabled="title === '现役军人详情'"
                v-model="form.phone"
                placeholder="请输入本人或家庭电话"
              /> </el-form-item
          ></el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="军衔等级" prop="">
              <el-select
                :disabled="title === '现役军人详情'"
                v-model="form.rankLevel"
                placeholder="请选择军衔等级"
                clearable
              >
                <el-option
                  v-for="dict in dict.type.sys_worship_militaryrank"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select> </el-form-item
          ></el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="军队驻地" prop="armyBase">
              <el-cascader
                :disabled="title === '现役军人详情'"
                v-model="armyBase"
                clearable
                ref="armyBase"
                :props="customProps"
                @change="handleChange('armyBase')"
                :options="mapList"
                placeholder="请选择"
              ></el-cascader> </el-form-item
          ></el-col>
          <el-col :span="12" v-if="armyBase.length">
            <el-form-item label="详细地址" prop="">
              <el-input
                :disabled="title === '现役军人详情'"
                v-model="form.armyBaseDetail"
                placeholder="请输入详细地址"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="应征地" prop="landAcquisition">
              <el-cascader
                :disabled="title === '现役军人详情'"
                v-model="landAcquisition"
                clearable
                ref="landAcquisition"
                :props="customProps"
                @change="handleChange('landAcquisition')"
                :options="mapList"
                placeholder="请选择"
              ></el-cascader> </el-form-item
          ></el-col>
          <el-col :span="12" v-if="landAcquisition.length">
            <el-form-item label="详细地址" prop="landAcquisitionDetail">
              <el-input
                :disabled="title === '现役军人详情'"
                v-model="form.landAcquisitionDetail"
                placeholder="请输入详细地址"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="家庭住址" prop="homeAddress">
              <el-cascader
                :disabled="title === '现役军人详情'"
                v-model="homeAddress"
                clearable
                ref="homeAddress"
                :props="customProps"
                @change="handleChange('homeAddress')"
                :options="mapList"
                placeholder="请选择"
              ></el-cascader> </el-form-item
          ></el-col>
          <el-col :span="12" v-if="homeAddress.length">
            <el-form-item label="详细地址" prop="">
              <el-input
                :disabled="title === '现役军人详情'"
                v-model="form.homeAddressDetail"
                placeholder="请输入详细地址"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="人员标签" prop="">
          <el-select
            :disabled="title === '现役军人详情'"
            v-model="form.personTags"
            multiple
            placeholder="请选择人员标签"
          >
            <el-option
              v-for="dict in peoPleTagList"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-row>
          <el-col :span="20">
            <span> 关联现役军人家属 </span>
          </el-col>
          <el-col :span="4">
            <el-button @click="showAddPeople = true" size="mini">选择家属</el-button>
          </el-col>
        </el-row>
        <el-row class="mt20">
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="name" label="姓名" width="100"> </el-table-column>
            <el-table-column prop="sex" label="性别" width="80"> </el-table-column>
            <el-table-column prop="idCard" label="身份证号" width="200"> </el-table-column>
            <el-table-column prop="phone" label="联系方式" width=""> </el-table-column>
            <el-table-column prop="age" label="年龄" width="80"> </el-table-column>
            <el-table-column prop="relationship" label="与现役军人关系" width="">
              <template slot-scope="scope">
                <el-popover trigger="click" popper-class="tri-popper">
                  <el-button class="tri-popper-color" type="info" plain slot="reference">
                    <dict-tag
                      v-if="scope.row.relationship"
                      :options="dict.type.sys_worship_xyjrjsgx"
                      :value="scope.row.relationship"
                    />
                    <span v-else>点击选择</span>
                  </el-button>
                  <div v-for="(item, index) in dict.type.sys_worship_xyjrjsgx" :key="index">
                    <el-button @click="chooseRelation(scope.row, item.label, item.value)" type="info" plain>{{
                      item.label
                    }}</el-button
                    ><br />
                  </div>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="操作">
              <template slot-scope="scope">
                <router-link
                  :to="'/worship/people-info/info/' + scope.row.id + '?tab=assistanceInfo'"
                  class="link-type"
                >
                  <el-button size="mini" type="text">详情</el-button>
                </router-link>
                <el-button size="mini" type="text" @click="handleFamilyDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel('open')">取 消</el-button>
      </div>
      <People v-if="showAddPeople" :type="'family'" @close="showAddPeople = false" @success="addPeopleSuccess" />
    </el-dialog>
    <!-- 现役军人详情 -->
    <el-dialog title="现役军人详情" :visible.sync="infoOpen" width="760px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名:" prop="">
              <span>{{ form.name }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证号:" prop="">
              <span>{{ form.idCard }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="行政区划:" prop="">
              <span>{{ form.divisionName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入伍时间:" prop="">
              <span>{{ form.dateOfEnlistment }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="服役军队代码:" prop="">
              <span>{{ form.armyCode }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="人员类别:" prop="">
              <dict-tag :options="dict.type.sys_worship_personneltype" :value="form.personnelCategory" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="服役地区:" prop="serviceArea">
              <dict-tag :options="dict.type.sys_worship_servicearea" :value="form.serviceArea" /> </el-form-item
          ></el-col>
          <el-col :span="12">
            <el-form-item label="本人或家庭电话:" prop="phone">
              <span>{{ form.phone }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="军队驻地:" prop="armyBase">
              <span>{{ form.armyBase }}</span>
            </el-form-item></el-col
          >
          <el-col :span="12" v-if="armyBase.length">
            <el-form-item label="详细地址:" prop="">
              <span>{{ form.armyBaseDetail }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="应征地:" prop="landAcquisition">
              <span>{{ form.landAcquisition }}</span>
            </el-form-item></el-col
          >
          <el-col :span="12" v-if="landAcquisition.length">
            <el-form-item label="详细地址:" prop="">
              <span>{{ form.landAcquisitionDetail }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="家庭住址:" prop="homeAddress">
              <span>{{ form.homeAddress }}</span>
            </el-form-item></el-col
          >
          <el-col :span="12" v-if="homeAddress.length">
            <el-form-item label="详细地址:" prop="">
              <span>{{ form.homeAddressDetail }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="人员标签:" prop="">
          <div class="tags">
            <div v-if="form.personTags">
              <div v-for="(item, index) in form.personTags" :key="index">
                {{ peoPleTagList.find((tag) => tag.dictValue === item).dictLabel }}
              </div>
            </div>
          </div>
        </el-form-item>
        <el-row>
          <el-col :span="20">
            <span> 关联现役军人家属 </span>
          </el-col>
          <el-col :span="4"> </el-col>
        </el-row>
        <el-row class="mt20">
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="name" label="姓名" width=""> </el-table-column>
            <el-table-column prop="sex" label="性别" width=""> </el-table-column>
            <el-table-column prop="idCard" label="身份证号" width=""> </el-table-column>
            <el-table-column prop="phone" label="联系方式" width=""> </el-table-column>
            <el-table-column prop="age" label="年龄" width=""> </el-table-column>
            <el-table-column prop="relationship" label="与现役军人关系" width="150">
              <template slot-scope="scope">
                <dict-tag
                  v-if="scope.row.relationship"
                  :options="dict.type.sys_worship_xyjrjsgx"
                  :value="scope.row.relationship"
                />
              </template>
            </el-table-column>
            <el-table-column prop="address" label="操作">
              <template slot-scope="scope">
                <router-link
                  :to="'/worship/people-info/info/' + scope.row.id + '?tab=assistanceInfo'"
                  class="link-type"
                >
                  <el-button size="mini" type="text">详情</el-button>
                </router-link>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('infoOpen')">取 消</el-button>
      </div>
      <People v-if="showAddPeople" :type="'family'" @close="showAddPeople = false" @success="addPeopleSuccess" />
    </el-dialog>
    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <div class="el-upload__tip" slot="tip">
            <el-checkbox v-model="upload.updateSupport" /> 是否更新已经存在的用户数据
          </div>
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link
            type="primary"
            :underline="false"
            style="font-size: 12px; vertical-align: baseline"
            @click="importTemplate"
            >下载模板</el-link
          >
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
    <AddOrUpdate
      :open="showTransferDialog"
      :title="title"
      :formData="transferForm"
      @cancel="showTransferDialog = false"
      @success="success"
    />
  </div>
</template>

<script>
import {
  listServiceMen,
  getServiceMen,
  delServiceMen,
  addServiceMen,
  updateServiceMen,
} from '@/api/worship/serviceMen';
import { addBasicPerson } from '@/api/worship/retiredSoldier';
import { getToken } from '@/utils/auth';
import AddOrUpdate from '@/views/worship/retiredSoldier/dialog/addOrUpdate';
import { testIdentity } from '@/utils/regular';
import People from '@/components/ChangePeoPle/people';
import inputNumberRange from '@/views/worship/components/inputNumberRange';

export default {
  name: 'ServiceMen',
  components: {
    AddOrUpdate,
    People,
    inputNumberRange,
  },
  dicts: [
    'sys_worship_personneltype',
    'sys_worship_militaryrank',
    'sys_worship_personneltag',
    'sys_worship_servicearea',
    'sys_user_sex',
    'sys_worship_xyjrjsgx',
  ],
  data() {
    return {
      // 按钮loading
      buttonLoading: false,
      showAddPeople: false,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 现役军人表格数据
      serviceMenList: [],
      tableData: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      infoOpen: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        idCard: undefined,
        sex: undefined,
        age: undefined,
        phone: undefined,
        personnelCategory: undefined,
        divisionCode: undefined,
        divisionName: undefined,
        armyBase: undefined,
        landAcquisition: undefined,
        homeAddress: undefined,
        rankLevel: undefined,
        serviceArea: undefined,
        dateOfEnlistment: undefined,
        personTags: undefined,
        keyWord: undefined,
        searchTime: [], //出生日期
        homeAddressList: [],
        landAcquisitionList: [],
        searchAge: undefined,
      },
      // 表单参数
      form: {},
      armyBase: [],
      landAcquisition: [],
      homeAddress: [],
      showTransferDialog: false,
      transferForm: {},
      // 表单校验
      rules: {
        id: [{ required: true, message: '主键不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        idCard: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('身份证不能为空'));
              } else if (!testIdentity(value)) {
                callback(new Error('请输入正确的身份证'));
              } else {
                callback();
              }
            },
          },
        ],
        sex: [{ required: true, message: '性别不能为空', trigger: 'change' }],
        age: [{ required: true, message: '年龄不能为空', trigger: 'blur' }],
        personnelCategory: [{ required: true, message: '人员类别不能为空', trigger: 'change' }],
        divisionCode: [{ required: true, message: '行政区划代码不能为空', trigger: 'blur' }],
        divisionName: [{ required: true, message: '行政区划名称不能为空', trigger: 'blur' }],
        rankLevel: [{ required: true, message: '军衔等级不能为空', trigger: 'change' }],
        dateOfEnlistment: [{ required: true, message: '入伍时间不能为空', trigger: 'blur' }],
        personTags: [{ required: true, message: '人员标签不能为空', trigger: 'change' }],
      },
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: '',
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: 'Bearer ' + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + '/worship/serviceMen/importData',
      },
      customProps: {
        emitPath: true,
        label: 'name',
        value: 'adcode',
      },
      mainTitle: '现役军人',
    };
  },
  computed: {
    mapList() {
      return this.$store.getters.mapList;
    },
    peoPleTagList() {
      return this.$store.state.user.peoPleTagList;
    },
    userInfo() {
      return this.$store.state.user;
    },
  },
  created() {
    this.getList();
    console.log('peoPleTagList', this.peoPleTagList);
  },
  methods: {
    /** 查询现役军人列表 */
    getList() {
      this.loading = true;
      console.log(this.$route);
      if (this.$route.query?.name) {
        this.queryParams.isTwoYearConscripts = this.$route.query?.name;
        this.mainTitle = '入伍满两年的义务兵';
      }

      this.queryParams.beginTime = this.queryParams?.searchTime?.[0];
      this.queryParams.endTime = this.queryParams?.searchTime?.[1];
      this.queryParams.landAcquisition = this.queryParams?.landAcquisitionList.join(',');
      this.queryParams.homeAddress = this.queryParams?.homeAddressList.join(',');
      this.queryParams.beginAge = this.queryParams.searchAge?.[0];
      this.queryParams.endAge = this.queryParams.searchAge?.[1];
      listServiceMen(this.queryParams).then((response) => {
        this.serviceMenList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel(type) {
      this[type] = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        createTime: undefined,
        createBy: undefined,
        updateTime: undefined,
        updateBy: undefined,
        delFlag: undefined,
        name: undefined,
        idCard: undefined,
        sex: undefined,
        age: undefined,
        phone: undefined,
        personnelCategory: undefined,
        divisionCode: undefined,
        divisionName: undefined,
        armyBase: undefined,
        landAcquisition: undefined,
        homeAddress: undefined,
        rankLevel: undefined,
        serviceArea: undefined,
        dateOfEnlistment: undefined,
        personTags: undefined,
        homeAddressList: [],
        landAcquisitionList: [],
      };
      this.armyBase = [];
      this.landAcquisition = [];
      this.homeAddress = [];
      this.tableData = [];
      this.resetForm('form');
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm');
      this.handleQuery();
      this.queryParams.searchTime = [];
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = '添加现役军人';
    },
    /** 详情操作 */
    handleInfo(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids;
      this.armyBase = row.armyBaseCode ? row?.armyBaseCode?.split(',') : [];
      this.landAcquisition = row.landAcquisitionCode ? row?.landAcquisitionCode?.split(',') : [];
      this.homeAddress = row.homeAddressCode ? row?.homeAddressCode?.split(',') : [];
      getServiceMen(id).then((response) => {
        this.loading = false;
        this.form = response.data;
        this.tableData = response.data.familyList;
        this.form.personTags = this.form.personTags ? this.form.personTags.split(',') : [];
        this.infoOpen = true;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row, title = '修改现役军人') {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids;
      this.armyBase = row.armyBaseCode ? row?.armyBaseCode?.split(',') : [];
      this.landAcquisition = row.landAcquisitionCode ? row?.landAcquisitionCode?.split(',') : [];
      this.homeAddress = row.homeAddressCode ? row?.homeAddressCode?.split(',') : [];
      getServiceMen(id).then((response) => {
        this.loading = false;
        this.form = response.data;
        this.tableData = response.data.familyList;
        this.form.personTags = this.form.personTags ? this.form.personTags.split(',') : [];
        this.open = true;
        this.title = title;
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          console.log(this.form.personTags);
          const personTags = this.form.personTags.join(',');
          if (this.form.id != null) {
            updateServiceMen({ ...this.form, personTags })
              .then((response) => {
                this.$modal.msgSuccess('修改成功');
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else {
            addServiceMen({ ...this.form, personTags })
              .then((response) => {
                this.$modal.msgSuccess('新增成功');
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      const name = row.name ?? this.filterDelData(this.ids, this.serviceMenList, 'name');

      this.$modal
        .confirm('是否确认删除现役军人姓名为"' + name + '"的数据项？')
        .then(() => {
          this.loading = true;
          return delServiceMen(ids);
        })
        .then(() => {
          this.loading = false;
          this.getList();
          this.$modal.msgSuccess('删除成功');
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false;
        });
    },
    /** 导出按钮操作 */
    handleExport(path, type, name) {
      let params = {};
      if (type === 1) {
        params = {
          ids: this.ids.join(','),
        };
      }
      if (type === 2) {
        params = {
          ...this.queryParams,
          divisionCode: this.queryParams.divisionCode || this.userInfo.divisionCode,
        };
      }
      if (type === 3) {
        params = {
          divisionCode: this.userInfo.divisionCode,
        };
      }
      this.download(path, params, `${name}_${new Date().getTime()}.xlsx`);
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = '用户导入';
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download('system/user/importTemplate', {}, `user_template_${new Date().getTime()}.xlsx`);
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(
        "<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" +
          response.msg +
          '</div>',
        '导入结果',
        { dangerouslyUseHTMLString: true }
      );
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
    handleChange(value) {
      let data = this.$refs[value]?.getCheckedNodes();
      this.form[`${value}Code`] = this[value].join(',');
      this.form[value] = data[0].pathLabels.join(',');
      console.log(this.form);
    },
    addPeopleSuccess(list) {
      this.showAddPeople = false;
      // this.tableData = list
      this.form.familyList = this.tableData = list;
    },
    handleFamilyDelete(row) {
      this.tableData = this.tableData.filter((e) => e.id !== row.id);
    },
    // 转退役军人
    handleTransfer(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids;
      if (row.id) {
        getServiceMen(id).then((response) => {
          // delServiceMen(id).then((res) => {});
          this.loading = false;
          this.transferForm = Object.assign({}, response.data);
          this.title = '转退役军人';
          this.showTransferDialog = true;
        });
      } else {
        this.serviceMenList.forEach((e) => {
          let formData = Object.assign({}, e, { id: null });
          addBasicPerson(formData).then((response) => {});
        });
        delServiceMen(id)
          .then((res) => {
            this.$modal.msgSuccess('转出成功');
          })
          .finally(() => {
            this.buttonLoading = false;
          });
      }
    },
    success() {
      this.showTransferDialog = false;
      this.getList();
    },
    chooseRelation(row, label, code) {
      row.relationship = code;
      return;
      this.$set(row, 'relationWithActiveText', label);
      this.$set(row, 'relationWithActive', code);
      let obj = Object.assign(
        {},
        {
          familyId: row.familyId,
          activeId: this.form.id,
          relationWithActive: code,
          id: row.id,
        }
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.header {
  height: 37.33px;
  font-family: PingFangSC-Medium;
  font-weight: 600;
  font-size: 26.67px;
  color: #000000d9;
  letter-spacing: 0;
  line-height: 37.33px;
  margin-bottom: 16px;
}
.search-form {
  background-color: #fff;
  padding: 20px 0 0 20px;
  box-sizing: border-box;
  .search-right {
    float: right;
  }
  ::v-deep {
    .el-select {
      width: 11vw;
    }
  }
}

.table {
  background: #fff;
  margin: 16px 0 0 0;
  padding: 16px;
  box-sizing: border-box;
  height: 690px;
  .table-title-box {
    display: flex;
    justify-content: space-between;
    .title-name {
      font-family: PingFangSC-Medium;
      font-weight: 600;
      font-size: 18px;
      color: #333333;
    }
  }
}
.el-icon-location-information {
  font-size: 24px;
  margin: 5px 0 0 18px;
  cursor: pointer;
}
.tags {
  display: flex;
  .tag-item {
    margin: 0 10px 0 0;
  }
}
.tri-popper {
  min-width: 0;
  width: 80px;
  .el-button {
    margin-bottom: 10px;
    width: 100%;
  }
}
</style>
