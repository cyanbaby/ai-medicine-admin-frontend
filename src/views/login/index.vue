<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on"
      label-position="left">

      <div class="title-container">
        <h3 class="title">Login Form</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input ref="username" v-model="loginForm.username" placeholder="Username" name="username" type="text"
          tabindex="1" autocomplete="on" />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input :key="passwordType" ref="password" v-model="loginForm.password" :type="passwordType"
            placeholder="Password" name="password" tabindex="2" autocomplete="on" @keyup="checkCapslock"
            @blur="capsTooltip = false" @keyup.enter="handleLogin" />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.prevent="handleLogin">
        登录</el-button>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" class="!ml-0"
        @click="showDialog = true">
        注册</el-button>
    </el-form>


    <el-dialog title="注册" v-model="showDialog" @close="resetForm">
      <el-form :model="registerForm" :rules="registerRules" ref="registerForm" calss="register-form" label-width="80px"
        label-position="left">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="registerForm.username" placeholder="请输入用户名" />
        </el-form-item>

        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model="registerForm.email" placeholder="请输入电子邮箱" />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="registerForm.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>

        <el-form-item label="确认密码" prop="password_confirm">
          <el-input v-model="registerForm.password_confirm" type="password" placeholder="请确认密码" show-password />
        </el-form-item>

        <div slot="footer" class="dialog-footer text-right">
          <el-button @click="showDialog = false">取消</el-button>
          <el-button type="primary" @click="handleRegister" :loading="loading">提交</el-button>
        </div>
      </el-form>
    </el-dialog>

  </div>
</template>

<script lang="ts">
// import { validUsername } from '@/utils/validate';
import { defineComponent } from 'vue';
import type { FormItemRule } from 'element-plus';
import type { IForm } from '@/types/element-plus';
import store from '@/store';
import { register, login } from '@/api/user';
import { ElMessage } from 'element-plus';
import { getUserProfileList } from '@/api/profile';

interface QueryType {
  // 自定义key 任意字符串
  [propname: string]: string
}

interface LoginForm {
  username: string;
  password: string;
}

interface RegisterForm {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
}


export default defineComponent({
  name: 'Login',
  data() {
    const validateUsername: FormItemRule['validator'] = (_rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入用户名'));
      } else {
        callback();
      }
    };
    const validatePassword: FormItemRule['validator'] = (_rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6个字符'));
      } else {
        callback();
      }
    };
    // 方法: 验证确认密码是否与密码一致
    const validatePasswordConfirm = (rule, value, callback) => {
      console.log(this.registerForm);
      if (value === '') {
        callback(new Error('确认密码不能为空'));
      } else if (value !== (this as any).registerForm.password) {
        callback(new Error('确认密码与密码不一致'));
      } else {
        callback();
      }
    }

    return {
      loginForm: {
        username: '',
        password: ''
      } as LoginForm,
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      registerForm: {
        username: '',
        email: '',
        password: '',
        password_confirm: ''
      } as RegisterForm,
      registerRules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '电子邮箱不能为空', trigger: 'blur' },
          { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, message: '密码不能少于6个字符', trigger: 'blur' }
        ],
        password_confirm: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' },
          { validator: validatePasswordConfirm, trigger: 'blur' }
        ],
      }
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.username === '') {
      (this.$refs.username as HTMLElement).focus();
    } else if (this.loginForm.password === '') {
      (this.$refs.password as HTMLElement).focus();
    }
  },
  unmounted() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    resetForm() {
      this.registerForm = {
        username: '',
        email: '',
        password: '',
        password_confirm: ''
      };
    },
    // 注册
    handleRegister() {
      (this.$refs.registerForm as IForm).validate(valid => {
        if (valid) {
          this.loading = true;
          register(this.registerForm).then(res => {

            const data = res.data;
            this.saveUserInfo(data)

            // 登录
            this.loginForm.username = data.user.username;
            this.loginForm.password = this.registerForm.password;

            this.showDialog = false;
            ElMessage.success('注册成功');
          }).catch(err => {
            console.log(err);
          })
            .finally(() => {
              this.loading = false;
            });
        }
      });
    },
    checkCapslock(e) {
      const { key } = e;
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z');
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = '';
      } else {
        this.passwordType = 'password';
      }
      this.$nextTick(() => {
        (this.$refs.password as HTMLElement).focus();
      });
    },
    handleLogin() {
      (this.$refs.loginForm as IForm).validate(valid => {
        if (valid) {
          this.loading = true;
          login(this.loginForm)
            .then((res) => {
              const data = res.data;
              this.saveUserInfo(data)

              // this.$router.push({ path: this.redirect || '/', query: this.otherQuery });
              this.$router.push({ path: '/dashboard' });
              this.loading = false;
            })
            .catch((err) => {
              console.log(err);
            }).finally(() => {
              this.loading = false;
            });
        } else {
          console.log('error submit!!');
        }
      });

      // getUserProfileList({
      //       page: 1,
      //       pageSize: 10
      //   }).then(res => {
      //       console.log(res);
      //   });


    },
    getOtherQuery(query: QueryType) {
      return Object.keys(query).reduce((acc: QueryType, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    },
    saveUserInfo(data) {
      // 保存token和用户信息
      localStorage.setItem('access_token', data.tokens.access);
      localStorage.setItem('user', JSON.stringify(data.user));
      // store.user().token = data.tokens.access;
      if (data.user.is_superuser) {
        store.user().roles = ['admin'];
      } else {
        store.user().roles = ['editor'];
      }
    }
  }
});
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-form .el-input input {
    color: $cursor;
  }
}

/* reset element-plus css */
.login-form {

  .el-input {
    height: 47px;
    width: 85%;

    .el-input__wrapper,
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      box-shadow: none;
    }

    input {
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
