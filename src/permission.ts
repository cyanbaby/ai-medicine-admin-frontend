import router from './router';
import userStore from './store/modules/user';
import permissionStore from './store/modules/permission';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
import { getToken } from '@/utils/auth'; // get token from cookie
import getPageTitle from '@/utils/get-page-title';

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ['/login', '/auth-redirect']; // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // console.log('router.beforeEach', to.path, from.path);
  // start progress bar
  NProgress.start();

  // set page title
  document.title = getPageTitle(to.meta.title);

  // determine whether the user has logged in
  const hasToken = getToken();

  // 有token
  if (hasToken) {
    // if (to.path === '/login') {
    //   // 如果已登录，重定向到主页
    //   NProgress.done(); // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
    //   next({ path: '/' });
    // } else {


    // }

    // next()

    // const accessRoutes = await permissionStore().generateRoutes(['admin']);
    // // console.log('accessRoutes=', accessRoutes)

    // // 动态添加可访问的路由
    // // router.addRoutes(accessRoutes);
    // accessRoutes.forEach(item => {
    //   router.addRoute(item);
    // });
    // console.log('next=', accessRoutes);

    // // hack方法来确保adroutes是完整的
    // // 设置replace: true，这样导航就不会留下历史记录
    // next({ ...to, replace: true });

    //*
    // 通过getInfo判断用户是否获得了权限角色
    const hasRoles = userStore().roles && userStore().roles.length > 0;

    if (hasRoles) {
      next();
    } else {
      try {
        // get user info
        // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        // const infoRes = await userStore().getInfo() as any;
        // let roles = [];
        let roles = ['admin', 'editor'];
        // if (infoRes.roles) {
        //   roles = infoRes.roles;
        // }
        // console.log('roles=', roles)

        // generate accessible routes map based on roles
        const accessRoutes = await permissionStore().generateRoutes(roles);
        console.group('accessRoutes')
        console.log(accessRoutes)
        console.groupEnd()

        // dynamically add accessible routes
        // router.addRoutes(accessRoutes);
        accessRoutes.forEach(item => {
          router.addRoute(item);
        });
        // console.log('next=', accessRoutes);

        // hack method to ensure that addRoutes is complete
        // set the replace: true, so the navigation will not leave a history record
        next({ ...to, replace: true });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        // remove token and go to login page to re-login
        await userStore().resetToken();
        ElMessage.error(error.message || 'Has Error');
        NProgress.done();
        next(`/login?redirect=${to.path}`);
      }
    }
    //*/
  } else {

    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {


      // 在免费登录白名单中，直接进入
      next();
    } else {
      // 其他没有访问权限的页面被重定向到登录页面。
      NProgress.done();
      next(`/login?redirect=${to.path}`);
    }
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
