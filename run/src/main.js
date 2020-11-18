import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
import router from './router'
import store from './store'
import '../public/css/reset.css'
import echarts from 'echarts'
import axios from 'axios'
import qs from 'qs'


Vue.prototype.$echarts = echarts;

Vue.prototype.$qs = qs
// axios.defaults.baseURL = 'http://39.101.143.158:8082/Running'
Vue.prototype.$https = axios
Vue.use(ElementUI);
Vue.config.productionTip = false;

// 路由判断登录 根据路由配置文件的参数
// router.beforeEach((to, from, next) => {
//     if (to.matched.some(record => record.meta.requireAuth)) { // 判断该路由是否需要登录权限
//         if (sessionStorage.token) { // 判断当前的token是否存在 ； 登录存入的token
//             next();
//         } else {
//             next({
//                 path: '/',
//                 query: { redirect: to.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
//             })
//         }
//     } else {
//         next();
//     }
// });

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
