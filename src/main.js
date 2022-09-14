import Vue from 'vue';
import App from './App.vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from '@/router';
import axios from 'axios';
import TreeTable from 'vue-table-with-tree-grid';
Vue.component('tree-table', TreeTable);
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor';
// require styles
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
Vue.use(VueQuillEditor);
// 进度条
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
// 导入全局样式
import '@/assets/css/global.css';
import '@/assets/fonts/iconfont.css';
Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.prototype.$http = axios;
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
// 请求拦截器
axios.interceptors.request.use((config) => {
  NProgress.start();
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
});
axios.interceptors.response.use((config) => {
  NProgress.done();
  return config;
});
// 时间 格式转化 过滤器
Vue.filter('dataFormat', function (originVal) {
  const dt = new Date(originVal * 1000);
  const yyyy = dt.getFullYear();
  const MM = (dt.getMonth() + 1 + '').padStart(2, '0');
  const dd = (dt.getDate() + 1 + '').padStart(2, '0');
  const HH = (dt.getHours() + 1 + '').padStart(2, '0');
  const mm = (dt.getMinutes() + 1 + '').padStart(2, '0');
  const ss = (dt.getSeconds() + 1 + '').padStart(2, '0');
  return `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}`;
});
new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
