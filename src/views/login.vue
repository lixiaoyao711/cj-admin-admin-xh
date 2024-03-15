<template>
  <div class="login">
    <el-form v-show="isQr" ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="title">崇军指数后台管理系统</h3>
      <div class="qr-box">
        <iframe :src="qrSrc" alt=""></iframe>
      </div>
      <div class="scan" @click="isQr = !isQr"></div>
    </el-form>
    <el-form v-show="!isQr" ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="title">崇军指数后台管理系统</h3>
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号">
          <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter.native="handleLogin"
          show-password
        >
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="code" v-if="captchaEnabled">
        <el-input
          v-model="loginForm.code"
          auto-complete="off"
          placeholder="验证码"
          style="width: 63%"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode" class="login-code-img" />
        </div>
      </el-form-item>
      <el-checkbox v-model="loginForm.rememberMe" style="margin: 0px 0px 25px 0px">记住密码</el-checkbox>
      <el-form-item style="width: 100%">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width: 100%"
          @click.native.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
        <div style="float: right" v-if="register">
          <router-link class="link-type" :to="'/register'">立即注册</router-link>
        </div>
      </el-form-item>
      <div class="corner" @click="isQr = !isQr"></div>
    </el-form>
    <!--  底部  -->
    <div class="el-login-footer">
      <span></span>
    </div>
  </div>
</template>

<script>
import { getCodeImg, accessTokenLogin, zzdSsoLogin } from '@/api/login';
import Cookies from 'js-cookie';
import { encrypt, decrypt } from '@/utils/jsencrypt';
import { regMobile } from '@/utils/regular';
import dd from 'gdt-jsapi';
import { setToken } from '@/utils/auth';
import { doEncrypt } from '@/utils/sm2.js';

export default {
  name: 'Login',
  dicts: ['sys_worship_tuiyijunrenanzhileibie'],

  data() {
    return {
      codeUrl: '',
      loginForm: {
        username: process.env.NODE_ENV === 'development' ? 'admin' : '',
        password: process.env.NODE_ENV === 'development' ? 'Ab@14145794' : '',
        rememberMe: false,
        code: '',
        uuid: '',
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '请输入您的账号' }],
        password: [{ required: true, trigger: 'blur', message: '请输入您的密码' }],
        code: [{ required: true, trigger: 'change', message: '请输入验证码' }],
      },
      loading: false,
      // 验证码开关
      captchaEnabled: true,
      // 注册开关
      register: false,
      redirect: undefined,

      isQr: false,
      qrSrc: process.env.VUE_APP_API_DINGTALK_PATH,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  created() {
    // this.getCode();
    // this.getCookie();
    this.checkoutMobile();
  },
  mounted() {
    window.addEventListener('message', this.QRLogin);
  },
  methods: {
    checkoutMobile() {
      const isDD = regMobile('dingtalkWin');
      console.log('isDD', isDD);
      if (isDD) {
        dd.getAuthCode({ corpId: '' })
          .then((result) => {
            console.log('钉钉信息', result.auth_code);
            if (result) {
              zzdSsoLogin(result.auth_code).then((res) => {
                console.log('钉钉登录', res);
                setToken(res.data.systemToken);
                this.$store.commit('SET_TOKEN', res.data.systemToken);
                this.$router.push({ path: this.redirect || '/' }).catch(() => {});
                this.$store.dispatch('getPersonType');
              });
            }
          })
          .catch((err) => {
            console.log('钉钉catch', err);
          });
      } else {
        this.getCode();
        this.getCookie();
      }
    },
    getCode() {
      getCodeImg().then((res) => {
        this.captchaEnabled = res.data.captchaEnabled === undefined ? true : res.data.captchaEnabled;
        if (this.captchaEnabled) {
          this.codeUrl = 'data:image/gif;base64,' + res.data.img;
          this.loginForm.uuid = res.data.uuid;
        }
      });
    },
    getCookie() {
      const username = Cookies.get('username');
      const password = Cookies.get('password');
      const rememberMe = Cookies.get('rememberMe');
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
      };
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;

          if (this.loginForm.rememberMe) {
            Cookies.set('username', this.loginForm.username, { expires: 30 });
            Cookies.set('password', encrypt(this.loginForm.password), { expires: 30 });
            Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 });
          } else {
            Cookies.remove('username');
            Cookies.remove('password');
            Cookies.remove('rememberMe');
          }
          let password = doEncrypt(this.loginForm.password);
          this.$store
            .dispatch('Login', { ...this.loginForm, password })
            .then(() => {
              this.$router.push({ path: this.redirect || '/' }).catch(() => {});
              this.$store.dispatch('getPersonType');
            })
            .catch(() => {
              this.loading = false;
              if (this.captchaEnabled) {
                this.getCode();
              }
            });
          this.getAnZhiType();
        }
      });
    },
    QRLogin(event) {
      // console.log(event);
      if (event.data.code) {
        accessTokenLogin(event.data.code)
          .then((res) => {
            console.log('res', res);
            setToken(res.data.systemToken);
            this.$store.commit('SET_TOKEN', res.data.systemToken);
            this.$router.push({ path: this.redirect || '/' }).catch(() => {});
            this.$store.dispatch('getPersonType');
          })
          .catch(() => {
            this.loading = false;
            if (this.captchaEnabled) {
              this.getCode();
            }
          });
      }
    },
    getAnZhiType() {
      setTimeout(() => {
        let list = JSON.parse(JSON.stringify(this.dict.type.sys_worship_tuiyijunrenanzhileibie));
        let arr = [
          {
            label: '退役干部',
            value: '1',
            children: [],
          },
          {
            label: '退役士兵',
            value: '2',
            children: [],
          },
          {
            label: '复员军人',
            value: '3',
            children: [],
          },
        ];
        arr.forEach((e, index) => {
          let key = index + 1;
          e.children = list.filter((f) => f.value.indexOf(key) == 0);
        });
        console.log(arr);
        this.$store.commit('SET_ANZHITYPEDICT', arr);
      }, 2000);
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url('../assets/images/login-background.jpg');
  background-size: cover;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 60px 25px;
  position: absolute;
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 38px;
}
.qr-box {
  // height: 410px;
  width: 320px;
  overflow: hidden;
  // margin: 0 auto;
  display: flex;
  justify-content: center;
  iframe {
    border: none;
    height: 330px;
    margin: -30px 0 0 0;
  }
}
.corner {
  cursor: pointer;
  background: url('../assets/img/corner.png') no-repeat;
  width: 100px;
  height: 100px;
  position: absolute;
  right: -20px;
  bottom: -20px;
}
.scan {
  cursor: pointer;
  background: url('../assets/img/scan.png') no-repeat;
  width: 100px;
  height: 100px;
  position: absolute;
  right: -20px;
  bottom: -20px;
}
</style>
