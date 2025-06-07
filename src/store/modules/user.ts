import { defineStore } from 'pinia';
import { login as apiLogin, logout as apiLogout, getInfo as apiGetInfo } from '@/api/user';
import { getToken, setToken, removeToken } from '@/utils/auth';
import router, { resetRouter } from '@/router';
import tagsViewStore from './tagsView';
import permissionStore from './permission';

export interface IUserState {
  token: string;
  userId: string,
  name: string;
  avatar: string;
  introduction: string;
  roles: string[];
}

const roles = ['admin', 'editor']

export default defineStore({
  id: 'user',
  state: ():IUserState => ({
    token: getToken(),
    userId: '',
    name: '',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80',
    introduction: '',
    // roles: ['admin', 'editor']
    roles: []
  }),
  getters: {},
  actions: {
    // user login
    login(userInfo):Promise<void> {
      const { username, password } = userInfo;
      return new Promise((resolve, reject) => {
        apiLogin({ username: username.trim(), password: password }).then(response => {
          const { data } = response;
          this.token = data.token;
          setToken(data.token);
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },

    // get user info
    getInfo() {

      
      // return new Promise((resolve, reject) => {
      //   apiGetInfo(this.token).then(response => {
      //     const { data } = response;

      //     if (!data) {
      //       reject('Verification failed, please Login again.');
      //     }

      //     const { roles, name, avatar, introduction } = data;

      //     // roles must be a non-empty array
      //     if (!roles || roles.length <= 0) {
      //       reject('getInfo: roles must be a non-null array!');
      //     }

      //     this.roles = roles;
      //     this.name = name;
      //     this.avatar = avatar;
      //     this.introduction = introduction;
      //     resolve(data);
      //   }).catch(error => {
      //     reject(error);
      //   });
      // });
      this.roles = roles;
      return Promise.resolve({
        roles: roles,
        name: 'admin cyan'
      })
    },

    setRoles(roles) {
      this.roles = roles;
    },

    // user logout
    logout():Promise<void> {
      return new Promise((resolve, reject) => {
        apiLogout(this.token).then(() => {
          this.token = '';
          this.roles = [];
          removeToken();
          resetRouter();

          // reset visited views and cached views
          // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
          tagsViewStore().delAllViews();

          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },

    // remove token
    resetToken() {
      this.token = '';
      this.roles = [];
      removeToken();
    },

    // dynamically modify permissions
    async changeRoles(role) {
      // alert(1)
      const token = role + '-token';

      this.token = token;
      setToken(token);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const infoRes = await this.getInfo() as any;
      let roles = [];
      if (infoRes.roles) {
        roles = infoRes.roles;
      }

      resetRouter();

      // generate accessible routes map based on roles
      const accessRoutes = await permissionStore().generateRoutes(roles);
      // dynamically add accessible routes
      // router.addRoutes(accessRoutes);
      accessRoutes.forEach(item => {
        router.addRoute(item);
      });

      // reset visited views and cached views
      tagsViewStore().delAllViews();
    }
  }
});
