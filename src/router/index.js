import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

/* Layout */
import Layout from '@/layout';

/**
 * Note: 路由配置项
 *
 * hidden: true                     // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true                 // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                  // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                  // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                  // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect             // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'               // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * query: '{"id": 1, "name": "ry"}' // 访问路由的默认传递参数
 * roles: ['admin', 'common']       // 访问路由的角色权限
 * permissions: ['a:a:a', 'b:b:b']  // 访问路由的菜单权限
 * meta : {
    noCache: true                   // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'                  // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'                // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false               // 如果设置为false，则不会在breadcrumb面包屑中显示
    activeMenu: '/system/user'      // 当路由设置了该属性，则会高亮相对应的侧边栏。
  }
 */

// 公共路由
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect'),
      },
    ],
  },
  {
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true,
  },
  {
    path: '/register',
    component: () => import('@/views/register'),
    hidden: true,
  },
  {
    path: '/404',
    component: () => import('@/views/error/404'),
    hidden: true,
  },
  {
    path: '/401',
    component: () => import('@/views/error/401'),
    hidden: true,
  },
  {
    path: '',
    component: Layout,
    redirect: 'index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/index'),
        name: 'Index',
        meta: { title: '首页', icon: 'dashboard', affix: true },
      },
    ],
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'profile',
        component: () => import('@/views/system/user/profile/index'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user' },
      },
    ],
  },
];

// 动态路由，基于用户权限动态去加载
export const dynamicRoutes = [
  {
    path: '/system/user-auth',
    component: Layout,
    hidden: true,
    permissions: ['system:user:edit'],
    children: [
      {
        path: 'role/:userId(\\d+)',
        component: () => import('@/views/system/user/authRole'),
        name: 'AuthRole',
        meta: { title: '分配角色', activeMenu: '/system/user' },
      },
    ],
  },
  {
    path: '/system/role-auth',
    component: Layout,
    hidden: true,
    permissions: ['system:role:edit'],
    children: [
      {
        path: 'user/:roleId(\\d+)',
        component: () => import('@/views/system/role/authUser'),
        name: 'AuthUser',
        meta: { title: '分配用户', activeMenu: '/system/role' },
      },
    ],
  },
  {
    path: '/system/dict-data',
    component: Layout,
    hidden: true,
    permissions: ['system:dict:list'],
    children: [
      {
        path: 'index/:dictId(\\d+)',
        component: () => import('@/views/system/dict/data'),
        name: 'Data',
        meta: { title: '字典数据', activeMenu: '/system/dict' },
      },
    ],
  },
  {
    path: '/system/oss-config',
    component: Layout,
    hidden: true,
    permissions: ['system:oss:list'],
    children: [
      {
        path: 'index',
        component: () => import('@/views/system/oss/config'),
        name: 'OssConfig',
        meta: { title: '配置管理', activeMenu: '/system/oss' },
      },
    ],
  },
  {
    path: '/tool/gen-edit',
    component: Layout,
    hidden: true,
    permissions: ['tool:gen:edit'],
    children: [
      {
        path: 'index/:tableId(\\d+)',
        component: () => import('@/views/tool/gen/editTable'),
        name: 'GenEdit',
        meta: { title: '修改生成配置', activeMenu: '/tool/gen' },
      },
    ],
  },
  {
    path: '/worship/people-info',
    component: Layout,
    hidden: false,
    permissions: ['worship:retiredSoldier:list'],
    children: [
      {
        path: 'info/:id(\\d+)',
        component: () => import('@/views/worship/peopleInfo/index'),
        name: 'peopleInfo',
        meta: { title: '人员详情', activeMenu: '/personnelManagement/retiredSoldier' },
      },
    ],
  },
  {
    path: '/worship/serviceFamily',
    component: Layout,
    hidden: true,
    permissions: ['worship:serviceFamily:list'],
    children: [
      {
        path: 'info/:id(\\d+)',
        component: () => import('@/views/worship/serviceFamilyInfo/index'),
        name: 'peopleInfo',
        meta: { title: '现役军人家属人员详情', activeMenu: '/personnelManagement/serviceFamily' },
      },
    ],
  },
  {
    path: '/worship/compensatedIndividuals',
    component: Layout,
    hidden: false,
    permissions: ['worship:compensatedIndividuals:list'],
    children: [
      {
        path: 'info/:id(\\d+)',
        component: () => import('@/views/worship/compensatedIndividuals/peopleInfo/index'),
        name: 'peopleInfo',
        meta: { title: '人员详情', activeMenu: '/personnelManagement/compensatedIndividuals' },
      },
    ],
  },
  {
    path: '/worship/externalPerson',
    component: Layout,
    hidden: false,
    permissions: ['worship:externalPerson:list'],
    children: [
      {
        path: 'info/:id(\\d+)',
        component: () => import('@/views/worship/compensatedIndividuals/peopleInfo/index'),
        name: 'peopleInfo',
        meta: { title: '人员详情', activeMenu: '/personnelManagement/externalPerson' },
      },
    ],
  },
  {
    path: '/worship/manageTask',
    component: Layout,
    hidden: true,
    permissions: ['worship:manageTask:list'],
    children: [
      {
        path: 'taskDetail/:id(\\d+)',
        component: () => import('@/views/worship/manageTask/taskDetail'),
        name: 'taskDetail',
        meta: { title: '任务详情', activeMenu: '/work/manageTask' },
      },
    ],
  },
  {
    path: '/worship/messageNotification',
    component: Layout,
    hidden: true,
    permissions: ['system:dict:list'],
    children: [
      {
        path: 'index',
        component: () => import('@/views/worship/messageNotification/index'),
        name: 'messageNotification',
        meta: { title: '消息通知' },
      },
    ],
  },
  {
    path: '/worship/messagePlatform',
    component: Layout,
    hidden: true,
    permissions: ['system:dict:list'],
    children: [
      {
        path: 'index',
        component: () => import('@/views/worship/messagePlatform/index'),
        name: 'messagePlatform',
        meta: { title: '短信平台' },
      },
    ],
  },
  {
    path: '/worship/permissionConfig',
    component: Layout,
    hidden: true,
    permissions: ['system:dict:list'],
    children: [
      {
        path: 'index',
        component: () => import('@/views/worship/permissionConfig/index'),
        name: 'permissionConfig',
        meta: { title: '权限配置' },
      },
    ],
  },
  {
    path: '/system/disposition',
    component: Layout,
    hidden: true,
    permissions: ['system:dict:list'],
    children: [
      {
        path: 'index',
        component: () => import('@/views/system/disposition/index'),
        name: 'disposition',
        meta: { title: '系统配置' },
      },
    ],
  },
  {
    path: '/system/operationLog',
    component: Layout,
    hidden: true,
    permissions: ['system:dict:list'],
    children: [
      {
        path: 'index',
        component: () => import('@/views/system/operationLog/index'),
        name: 'operationLog',
        meta: { title: '日志记录' },
      },
    ],
  },
  {
    path: '/worship/informationVerification',
    component: Layout,
    hidden: true,
    permissions: ['worship:manageTask:list'],
    children: [
      {
        path: 'index',
        component: () => import('@/views/worship/informationVerification/index'),
        name: 'informationVerification',
        meta: { title: '信息核查' },
      },
    ],
  },
  {
    path: '/petitionInfo/detail',
    component: Layout,
    hidden: true,
    permissions: ['worship:manageTask:list'],
    children: [
      {
        path: 'info/:id(\\d+)',
        component: () => import('@/views/worship/petitionInfo/detail/letterDetail'),
        name: 'letterDetail',
        meta: { title: '信访详情', activeMenu: '/petition/petitionInfo' },
      },
    ],
  },
  {
    path: '/petitionWarning/abnormalInfoDetail',
    component: Layout,
    hidden: true,
    permissions: ['worship:manageTask:list'],
    children: [
      {
        path: 'info/:id(\\d+)',
        component: () => import('@/views/worship/petitionWarning/abnormalInfoDetail'),
        name: 'abnormalInfoDetail',
        meta: { title: '异动信息详情', activeMenu: '/petition/petitionWarning' },
      },
    ],
  },
  {
    path: '/careFund/fundDetails',
    component: Layout,
    hidden: true,
    permissions: ['system:dict:list'],
    children: [
      {
        path: 'info/:id(\\d+)',
        component: () => import('@/views/worship/careFund/dialog/fundDetails'),
        name: 'fundDetails',
        meta: { title: '关爱基金详情', activeMenu: '/care/careFund' },
      },
    ],
  },
  {
    path: '/petitionInfo/registerToday',
    component: Layout,
    hidden: true,
    permissions: ['system:dict:list'],
    children: [
      {
        path: '',

        component: () => import('@/views/worship/petitionInfo/registerToday/registerToday'),
        name: 'fundDetails',
        meta: { title: '今日登记情况', activeMenu: '/petitionInfo/all' },
      },
    ],
  },
];

// 防止连续点击多次路由报错
let routerPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch((err) => err);
};

export default new Router({
  base: process.env.VUE_APP_CONTEXT_PATH,
  // mode: 'history', // 去掉url中的#
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes,
});
