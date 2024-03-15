import { login, logout, getInfo } from '@/api/login';
import { listTag, getTodoSign } from '@/api/system/disposition';
import { getToken, setToken, removeToken } from '@/utils/auth';
import { getDivisionsTreeList } from '@/api/common';
import { checkRedirect } from '@/utils';

const user = {
  state: {
    token: getToken(),
    name: '',
    userId: '',
    divisionCode: '',
    divisionName: '',
    divisionLevel: '',
    avatar: '',
    roles: [],
    permissions: [],
    divisionsTreeList: [],
    allDivisionsTreeList: [],
    mapList: [],
    anzhiTypeDict: [],
    // 常用人员部门
    deptCommonDict: [],
    user: {},
    peoPleTagList: [],
    todoSingList: [],
  },

  mutations: {
    SET_USER: (state, user) => {
      state.user = user;
    },
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_NAME: (state, name) => {
      state.name = name;
    },
    SET_USERID: (state, userId) => {
      state.userId = userId;
    },
    SET_DIVISIONCODE: (state, divisionCode) => {
      state.divisionCode = divisionCode;
    },
    SET_DIVISIONNAME: (state, divisionName) => {
      state.divisionName = divisionName;
    },
    SET_DIVISIONLEVEL: (state, divisionLevel) => {
      state.divisionLevel = divisionLevel;
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions;
    },
    SET_DIVISIONSTREELIST: (state, divisionsTreeList) => {
      state.divisionsTreeList = divisionsTreeList;
    },
    SET_ALLDIVISIONSTREELIST: (state, data) => {
      state.allDivisionsTreeList = data;
    },
    SET_MAPLIST: (state, mapList) => {
      state.mapList = mapList;
    },
    SET_ANZHITYPEDICT: (state, dict) => {
      state.anzhiTypeDict = dict;
    },
    SET_DEPTTREESELECTDICT: (state, dict) => {
      state.deptCommonDict = dict;
    },
    SET_PEOPLETAGLIST: (state, dict) => {
      state.peoPleTagList = dict;
    },
    SET_TODOSINGLIST: (state, dict) => {
      state.todoSingList = dict;
    },
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim();
      const password = userInfo.password;
      const code = userInfo.code;
      const uuid = userInfo.uuid;
      return new Promise((resolve, reject) => {
        login(username, password, code, uuid)
          .then((res) => {
            setToken(res.data.token);
            commit('SET_TOKEN', res.data.token);
            checkRedirect();
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    async getDivisionsTreeData({ commit, state }, userInfo) {
      let sortData = [
        {
          children: [],
          id: '',
          label: '北山街道',
          level: '',
          parentId: '',
          remark: null,
          weight: '',
        },
        {
          children: [],
          id: '',
          label: '西溪街道',
          level: '',
          parentId: '',
          remark: null,
          weight: '',
        },
        {
          children: [],
          id: '',
          label: '灵隐街道',
          level: '',
          parentId: '',
          remark: null,
          weight: '',
        },
        {
          children: [],
          id: '',
          label: '翠苑街道',
          level: '',
          parentId: '',
          remark: null,
          weight: '',
        },
        {
          children: [],
          id: '',
          label: '文新街道',
          level: '',
          parentId: '',
          remark: null,
          weight: '',
        },
        {
          children: [],
          id: '',
          label: '古荡街道',
          level: '',
          parentId: '',
          remark: null,
          weight: '',
        },
        {
          children: [],
          id: '',
          label: '转塘街道',
          level: '',
          parentId: '',
          remark: null,
          weight: '',
        },
        {
          children: [],
          id: '',
          label: '留下街道',
          level: '',
          parentId: '',
          remark: null,
          weight: '',
        },
        {
          children: [],
          id: '',
          label: '蒋村街道',
          level: '',
          parentId: '',
          remark: null,
          weight: '',
        },
        {
          children: [],
          id: '',
          label: '三墩镇',
          level: '',
          parentId: '',
          remark: null,
          weight: '',
        },
        {
          children: [],
          id: '',
          label: '双浦镇',
          level: '',
          parentId: '',
          remark: null,
          weight: '',
        },
      ];
      const res = await getDivisionsTreeList();
      commit('SET_ALLDIVISIONSTREELIST', res.data);
      let divisionCode = state.divisionCode;
      let getDivsionName = function (data, result = []) {
        data.forEach((e, index) => {
          if (e.level > 3) {
            e.children &&
              e.children.forEach((f) => {
                f.parentLabel = e.parentLabel ? e.parentLabel + '/' + e.label : e.label;
                f.allLabel = e.parentLabel ? e.parentLabel + '/' + e.label + f.label : e.label + '/' + f.label;
              });
          }
          if (e.weight === divisionCode) {
            result.push(e);
            commit('SET_DIVISIONNAME', e.label);
          }
          e.children && getDivsionName(e.children, result);
        });
        return result;
      };
      let treeList = getDivsionName(res.data);
      console.log('treeList', treeList);
      commit('SET_DIVISIONSTREELIST', treeList);
      fetch(`${process.env.VUE_APP_CONTEXT_PATH}js/map.json`)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          commit('SET_MAPLIST', data);
        });
    },

    // 获取用户信息
    GetInfo({ commit, state, dispatch }) {
      return new Promise((resolve, reject) => {
        getInfo()
          .then((res) => {
            console.log('getInfo', res.data);
            const user = res.data.user;
            commit('SET_USER', user);

            const avatar =
              user.avatar == '' || user.avatar == null ? require('@/assets/images/profile.jpg') : user.avatar;

            if (res.data.roles && res.data.roles.length > 0) {
              // 验证返回的roles是否是一个非空数组
              commit('SET_ROLES', res.data.roles);
              commit('SET_PERMISSIONS', res.data.permissions);
            } else {
              commit('SET_ROLES', ['ROLE_DEFAULT']);
            }
            commit('SET_NAME', user.nickName);
            commit('SET_USERID', user.userId);
            commit('SET_DIVISIONCODE', user.divisionCode);
            commit('SET_DIVISIONLEVEL', user.divisionLevel);
            commit('SET_AVATAR', avatar);
            dispatch('getDivisionsTreeData');
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token)
          .then(() => {
            commit('SET_TOKEN', '');
            commit('SET_ROLES', []);
            commit('SET_PERMISSIONS', []);
            removeToken();
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 前端 登出
    FedLogOut({ commit, state }) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '');
        removeToken();
        resolve();
      });
    },

    async getPersonType({ commit, state }) {
      if (!getToken()) {
        return;
      }
      await listTag().then((res) => {
        let tagList = res.rows.filter((e) => {
          e.dictLabel = e.tagName;
          e.dictValue = e.id;
          return e.enablStatus === '1';
        });
        // let obj = {
        //   key: 'sys_worship_personneltag',
        //   value: tagList,
        // };
        console.log('SET_PEOPLETAGLIST', tagList);
        commit('SET_PEOPLETAGLIST', tagList);
      });
    },
    async getTodoSignData({ commit, state }) {
      if (!getToken()) {
        return;
      }
      await getTodoSign().then((res) => {
        commit('SET_TODOSINGLIST', res.data);
      });
    },
  },
};

export default user;
