<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" v-if="!topNav" />
    <top-nav id="topmenu-container" class="topmenu-container" v-if="topNav" />

    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <!-- <search id="header-search" class="right-menu-item" /> -->

        <!--        <el-tooltip content="源码地址" effect="dark" placement="bottom">-->
        <!--          <ruo-yi-git id="ruoyi-git" class="right-menu-item hover-effect" />-->
        <!--        </el-tooltip>-->

        <!--        <el-tooltip content="文档地址" effect="dark" placement="bottom">-->
        <!--          <ruo-yi-doc id="ruoyi-doc" class="right-menu-item hover-effect" />-->
        <!--        </el-tooltip>-->

        <!-- <screenfull id="screenfull" class="right-menu-item hover-effect" /> -->

        <!-- <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip> -->

        <div class="send-msg right-menu-item">
          <router-link to="/worship/messageNotification/index">
            <i class="el-icon-chat-dot-square"></i>
            <span>消息通知</span></router-link
          >
        </div>
      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <!-- <img :src="avatar" class="user-avatar" /> -->
          <div class="name">{{ $store.state.user.name }}</div>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/user/profile">
            <el-dropdown-item>
              <router-link to="/worship/permissionConfig/index"> <span>权限配置</span></router-link>
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item>
            <router-link to="/system/disposition/index"> <span>系统配置</span></router-link>
          </el-dropdown-item>
          <el-dropdown-item>
            <span>字典配置</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <router-link to="/system/operationLog/index"> <span>日志记录</span></router-link>
          </el-dropdown-item>
          <el-dropdown-item>
            <span>修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Breadcrumb from '@/components/Breadcrumb';
import TopNav from '@/components/TopNav';
import Hamburger from '@/components/Hamburger';
import Screenfull from '@/components/Screenfull';
import SizeSelect from '@/components/SizeSelect';
import Search from '@/components/HeaderSearch';
import RuoYiGit from '@/components/RuoYi/Git';
import RuoYiDoc from '@/components/RuoYi/Doc';

export default {
  components: {
    Breadcrumb,
    TopNav,
    Hamburger,
    Screenfull,
    SizeSelect,
    Search,
    RuoYiGit,
    RuoYiDoc,
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'device']),
    setting: {
      get() {
        return this.$store.state.settings.showSettings;
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'showSettings',
          value: val,
        });
      },
    },
    topNav: {
      get() {
        return this.$store.state.settings.topNav;
      },
    },
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar');
    },
    async logout() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$store.dispatch('LogOut').then(() => {
            location.href = process.env.VUE_APP_CONTEXT_PATH + 'index';
          });
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .topmenu-container {
    position: absolute;
    left: 50px;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    display: flex;
    align-items: center;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;
      cursor: pointer;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;
      display: flex;
      align-items: center;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        .name {
          height: 50px;
          line-height: 47px;
        }
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 20px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
