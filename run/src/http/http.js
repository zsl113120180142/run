import axios from './request'

let methods = {
    get(url,params) {
        return new Promise((resolve,reject) => {
            axios.get(url, {
                params: params
            })
            .then(res => {
                resolve(res.data)
            })
            .catch(err => {
                reject(err.data)
            })
        })
    },
    post(url,params) {
        return new Promise((resolve,reject) => {
            axios.post(url, params)
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data)
            })
        })
    },
    put(url,params) {
        return new Promise((resolve,reject) => {
            axios.put(url, params)
                .then(res => {
                    resolve(res.data);
                })
                .catch(err => {
                    reject(err.data)
                })
        })
    },
    delete(url,params) {
        return new Promise((resolve,reject) => {
            axios.delete(url, {
                params: params
            })
                .then(res => {
                    resolve(res.data);
                })
                .catch(err => {
                    reject(err.data)
                })
        })
    },
}
export default methods
