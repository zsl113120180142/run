import Vue from 'vue'
import VueRouter from 'vue-router'
import Table from '../views/Table.vue'
import Four from '../views/Four.vue'
import Progress from '../views/Progress.vue'
import Admin from '../views/Admin.vue'
import Home from "../views/Home"
import Message from "element-ui/packages/message/src/main";

Vue.use(VueRouter);

const routes = [{
        path: '/',
        name: 'Login',
        component: resolve => require(['../views/Login.vue'], resolve),
    },
    {
        path: '/home',
        name: 'Home',
        component: Home,
        meta: {
            requireAuth: true, // 判断是否需要登录
        },
        redirect: '/progress', //默认子组件
        children: [{
                path: '/table/:id',
                name: 'Table',
                component: Table
            }, {
                path: '/setting',
                name: 'Setting',
                component: () =>
                    import ( /* webpackChunkName: "about" */ '../views/Setting.vue')
            },
            {
                path: '/progress',
                name: 'Progress',
                component: Progress
            },
            {
                path: '/admin',
                name: 'Admin',
                component: Admin
            },
        ]
    },
    {
        path: "/500",
        name: '500',
        component: resolve => require(['../views/500.vue'], resolve),
    }

];

const router = new VueRouter({
    // mode: 'history',
    // base: process.env.BASE_URL,
    routes
});

// 配置路由权限
router.beforeEach((to, from, next) => {
    let token = sessionStorage.getItem("token")

    if (to.matched.some(record => record.meta.requireAuth)) { // 判断该路由是否需要登录权限
        if (!token) {
            next('/')
        } else {
            next({
                query: { redirect: to.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
            })
        }
    } else {
        // 不需要权限即可直接访问
        next();
    }
})



export default router
