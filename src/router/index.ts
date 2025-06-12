import { markRaw } from 'vue';
import { createRouter, createWebHistory } from 'vue-router'; // createWebHashHistory, createWebHistory
import type { Router, RouteRecordRaw, RouteComponent } from 'vue-router';
import { Help as IconHelp } from '@element-plus/icons-vue';

/* Layout */
const Layout = (): RouteComponent => import('@/layout/index.vue');

/* Router Modules */
// import componentsRouter from './modules/components';
// import chartsRouter from './modules/charts';
// import nestedRouter from './modules/nested';
// import tableRouter from './modules/table';

/**
 * constantRoutes/常规路由
 * 没有权限要求的基页
 * 所有角色都可以访问
 *
 * 注意：hidden、alwaysShow 属性配置移动到了meta中！！！
 */
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/redirect',
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: { hidden: true }
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect.vue'),
    meta: { hidden: true }
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404.vue'),
    meta: { hidden: true }
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401.vue'),
    meta: { hidden: true }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'component', affix: true }
      }
    ]
  },
  // #region 用户管理
  {
    path: '/user-profile',
    component: Layout,
    redirect: '/user-profile/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/user-profile/index.vue'),
        name: 'UserProfile',
        meta: { title: '用户资料管理', icon: 'component', affix: true }
      }
    ]
  },
  {
    path: '/points-management',
    component: Layout,
    redirect: '/points-management/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/points-management/index.vue'),
        name: 'PointsManagement',
        meta: { title: '积分管理', icon: 'component', affix: true }
      }
    ]
  },
  {
    path: '/system-config',
    component: Layout,
    redirect: '/system-config/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/system-config/index.vue'),
        name: 'SystemConfig',
        meta: { title: '系统配置管理', icon: 'component', affix: true }
      }
    ]
  },

  {
    path: '/admin-models',
    component: Layout,
    redirect: '/admin-models/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/admin-models/index.vue'),
        name: 'AdminModels',
        meta: { title: '模型管理', icon: 'component', affix: true }
      }
    ]
  },
  // 对话线程管理
  {
    path: '/threads',
    component: Layout,
    redirect: '/threads/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/threads/index.vue'),
        name: 'Threads',
        meta: { title: '对话线程管理', icon: 'component', affix: true }
      }
    ]
  },

  // 用户配置管理
  {
    path: '/user-configs',
    component: Layout,
    redirect: '/user-configs/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/user-config/index.vue'),
        name: 'UserConfigs',
        meta: { title: '用户配置管理', icon: 'component', affix: true }
      }
    ]
  },
  // #endregion

  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    meta: { hidden: true },
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index.vue'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user', noCache: true }
      }
    ]
  }
];

/**
 * asyncRoutes/动态路由
 * 需要根据用户角色动态加载的路由
 *
 * 注意：hidden、alwaysShow 属性配置移动到了meta中！！！
 */
export const asyncRoutes: RouteRecordRaw[] = [
  // {
  //   path: '/permission',
  //   component: Layout,
  //   redirect: '/permission/page',
  //   name: 'Permission',
  //   meta: {
  //     alwaysShow: true, // will always show the root menu
  //     title: '权限测试页',
  //     icon: 'lock',
  //     roles: ['admin', 'editor'] // you can set roles in root nav
  //   },
  //   children: [
  //     {
  //       path: 'page',
  //       component: () => import('@/views/permission/page.vue'),
  //       name: 'PagePermission',
  //       meta: {
  //         title: '页面权限',
  //         roles: ['admin'] // or you can only set roles in sub nav
  //       }
  //     },
  //     {
  //       path: 'directive',
  //       component: () => import('@/views/permission/directive.vue'),
  //       name: 'DirectivePermission',
  //       meta: {
  //         title: '指令权限'
  //         // if do not set roles, means: this page does not require permission
  //       }
  //     },
  //     {
  //       path: 'role',
  //       component: () => import('@/views/permission/role.vue'),
  //       name: 'RolePermission',
  //       meta: {
  //         title: '角色权限',
  //         roles: ['admin']
  //       }
  //     }
  //   ]
  // },

  // #region 图标
  // {
  //   path: '/icon',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/icons/index.vue'),
  //       name: 'Icons',
  //       meta: { title: '图标', icon: 'icon', noCache: true }
  //     }
  //   ]
  // },
  // #endregion

  // /** when your routing map is too long, you can split it into small modules **/
  // componentsRouter,
  // chartsRouter,
  // nestedRouter,
  // tableRouter,

  // #region 综合示例
  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/list',
  //   name: 'Example',
  //   meta: {
  //     title: '综合示例',
  //     icon: markRaw(IconHelp)
  //   },
  //   children: [
  //     {
  //       path: 'create',
  //       component: () => import('@/views/example/create.vue'),
  //       name: 'CreateArticle',
  //       meta: { title: '创建文章', icon: 'edit' }
  //     },
  //     {
  //       path: 'edit/:id(\\d+)',
  //       component: () => import('@/views/example/edit.vue'),
  //       name: 'EditArticle',
  //       meta: { hidden: true, title: '编辑文章', noCache: true, activeMenu: '/example/list' }
  //     },
  //     {
  //       path: 'list',
  //       component: () => import('@/views/example/list.vue'),
  //       name: 'ArticleList',
  //       meta: { title: '文章列表', icon: 'list' }
  //     }
  //   ]
  // },
  // #endregion

  // {
  //   path: '/error',
  //   component: Layout,
  //   redirect: 'noRedirect',
  //   name: 'ErrorPages',
  //   meta: {
  //     title: '错误页面',
  //     icon: '404'
  //   },
  //   children: [
  //     {
  //       path: '401',
  //       component: () => import('@/views/error-page/401.vue'),
  //       name: 'Page401',
  //       meta: { title: '401', noCache: true }
  //     },
  //     {
  //       path: '404',
  //       component: () => import('@/views/error-page/404.vue'),
  //       name: 'Page404',
  //       meta: { title: '404', noCache: true }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '/:pathMatch(.*)*', redirect: '/404', meta: { hidden: true } }
];

console.log('BASE_URL=', import.meta.env);

const createTheRouter = (): Router =>
  createRouter({
    // history: createWebHashHistory(import.meta.env.BASE_URL),
    // 注意，如果要配置 HTML5 模式，则需要修改nginx配置，参考资料：
    // https://router.vuejs.org/zh/guide/essentials/history-mode.html
    history: createWebHistory(import.meta.env.BASE_URL),
    scrollBehavior: () => ({ top: 0 }),
    routes: constantRoutes
  });

interface RouterPro extends Router {
  matcher: unknown;
}

const router = createTheRouter() as RouterPro;

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  // router.clearRoutes(); RangeError: Maximum call stack size exceeded
  const newRouter = createTheRouter() as RouterPro;
  router.matcher = newRouter.matcher; // reset router
}

export default router;
