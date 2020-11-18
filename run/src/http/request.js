/**axios封装
 * 请求拦截、相应拦截、错误统一处理
 */
import axios from 'axios'
import {Message} from "element-ui";
import router from "../router";

axios.defaults.baseURL = 'http://111.75.252.147:80/Running'
// axios.defaults.baseURL = 'http://192.168.43.11:8082/Running'
// axios.defaults.baseURL = 'http://localhost:8083/Running'

// 请求超时时间
axios.defaults.timeout = 10000;

// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

// 请求拦截器
axios.interceptors.request.use(
    config => {
        /*请求头中加入Token*/
        let token = localStorage.getItem("token")
        config.headers.Token = token
        return config;
    },
    error => {
        return Promise.error(error);
    }
)

// 响应拦截器
axios.interceptors.response.use(
    response => {
        const headers = response.headers
        //console.log(headers['content-type'])  将打印的值，也将后台返回的相应头设置成相同的，我的就是'application/octet-stream;charset=UTF-8',然后返回response
        // if (headers['content-type'] == 'application/octet-stream;charset=UTF-8') {
            if (response.data.code != 200) {
                Message({
                    type: "error",
                    showClose: true,
                    message: response.data.extend.err
                })
            }
            // return response;
        // }
        return response;
    },
    /**
     * 服务器状态码不是200的情况
     * @param error
     * @returns {Promise<never>}
     */
    error => {
        console.log(error)
        if (error.status != 200) {
            Message({
                type: "error",
                showClose: true,
                message: '服务器错误，请联系后端管理员'
            })
            router.push('/500')
        }
        return Promise.reject(error.response);
    }
)

export default axios
