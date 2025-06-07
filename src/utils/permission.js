import store from '@/store';

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function checkPermission(value) {
  // alert(1)
  if (value && value instanceof Array && value.length > 0) {
    const roles = store.user && store.user().roles;
    const permissionRoles = value;

    const hasPermission = roles.some(role => {
      return permissionRoles.includes(role);
    });

    if (!hasPermission) {
      return false;
    }
    return true;
  } else {
    console.error(`need roles! Like v-permission="['admin','editor']"`);
    return false;
  }
}
