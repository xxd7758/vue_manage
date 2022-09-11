import Vue from 'vue';
import App from './App.vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from '@/router';
import axios from 'axios';
import TreeTable from 'vue-table-with-tree-grid';
Vue.component('tree-table', TreeTable);
// 导入全局样式
import '@/assets/css/global.css';
import '@/assets/fonts/iconfont.css';
Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.prototype.$http = axios;
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
// 请求拦截器
axios.interceptors.request.use((config) => {
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
});
new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
