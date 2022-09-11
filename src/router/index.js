import VueRouter from 'vue-router';
import Vue from 'vue';
import routes from '@/router/routes';
Vue.use(VueRouter);
// 解决重复跳转到当前页面 失败
const originalPush = VueRouter.prototype.push;
//修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};
const router = new VueRouter({
  routes,
});

// 路由导航守卫
router.beforeEach((to, form, next) => {
  if (to.path == '/login') {
    next();
  } else {
    const token = window.sessionStorage.getItem('token');
    if (!token) {
      return next('/login'); //不加return 执行两个next
    }
    // console.log(123);
    next();
  }
});

export default router;
