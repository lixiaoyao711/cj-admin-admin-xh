import Vue from 'vue';

import Cookies from 'js-cookie';

import Element from 'element-ui';
import './assets/styles/element-variables.scss';

import '@/assets/styles/index.scss'; // global css
import '@/assets/styles/ruoyi.scss'; // ruoyi css
import App from './App';
import store from './store';
import router from './router';
import directive from './directive'; // directive
import plugins from './plugins'; // plugins
import { download } from '@/utils/request';

import './assets/icons'; // icon
import './permission'; // permission control
import { getDicts } from '@/api/system/dict/data';
import { getConfigKey, updateConfigByKey } from '@/api/system/config';
import { parseTime, resetForm, addDateRange, selectDictLabel, selectDictLabels, handleTree } from '@/utils/ruoyi';
import { filterDelData, treeselectChange, imgPathFilter } from '@/utils/filter';

//签名插件
import vueEsign from 'vue-esign';
// 页面导出为pdf
import htmlToPdf from '@/utils/htmlToPdf';
// 分页组件
import Pagination from '@/components/Pagination';
// 自定义表格工具组件
import RightToolbar from '@/components/RightToolbar';
// 富文本组件
import Editor from '@/components/Editor';
// 文件上传组件
import FileUpload from '@/components/FileUpload';
// 图片上传组件
import ImageUpload from '@/components/ImageUpload';
// 图片预览组件
import ImagePreview from '@/components/ImagePreview';
// 字典标签组件
import DictTag from '@/components/DictTag';
// 头部标签组件
import VueMeta from 'vue-meta';
// 字典数据组件
import DictData from '@/components/DictData';
//行政区划组件
import TreeSelectDivision from '@/components/TreeSelectDivision';
// 配置表格
import CrudTable from '@/components/CrudTable/CrudTable.vue';

// 全局方法挂载
Vue.prototype.getDicts = getDicts;
Vue.prototype.getConfigKey = getConfigKey;
Vue.prototype.updateConfigByKey = updateConfigByKey;
Vue.prototype.parseTime = parseTime;
Vue.prototype.resetForm = resetForm;
Vue.prototype.addDateRange = addDateRange;
Vue.prototype.selectDictLabel = selectDictLabel;
Vue.prototype.selectDictLabels = selectDictLabels;
Vue.prototype.download = download;
Vue.prototype.handleTree = handleTree;
// 自定义新增全局方法
Vue.prototype.filterDelData = filterDelData;
Vue.prototype.treeselectChange = treeselectChange;
Vue.prototype.imgPathFilter = imgPathFilter;

// 全局组件挂载
Vue.component('DictTag', DictTag);
Vue.component('Pagination', Pagination);
Vue.component('RightToolbar', RightToolbar);
Vue.component('Editor', Editor);
Vue.component('FileUpload', FileUpload);
Vue.component('ImageUpload', ImageUpload);
Vue.component('ImagePreview', ImagePreview);
Vue.component('TreeSelectDivision', TreeSelectDivision);
Vue.component('CrudTable', CrudTable);

Vue.use(vueEsign);
Vue.use(htmlToPdf);
Vue.use(directive);
Vue.use(plugins);
Vue.use(VueMeta);

DictData.install();

console.log('process.env.NODE_ENV', process.env.NODE_ENV);

window.dashboardUrl = process.env.VUE_APP_DASHBOARD_URL
console.log(window.dashboardUrl);

// oss下载地址，配合ossId使用
Vue.prototype.baseOss = process.env.VUE_APP_BASE_API + '/system/oss/download/';

// 修改 el-dialog 默认点击遮照为不关闭
Element.Dialog.props.closeOnClickModal.default = false;

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
});

// 本地环境打开调试工具
import Vconsole from 'vconsole';

if (process.env.NODE_ENV === 'development') {
  // const vConsole = new Vconsole();
}

Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App),
});
