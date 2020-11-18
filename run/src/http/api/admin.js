/**
 * admin api
 */
import methods from '../http'

let admin = {
    login(params) {
        return methods.post('/login/DoLogin',params)
    },
    loginSuccess(params) {
        return methods.get('/login/writeToSession',params)
    },
    forgetPsd(params){
        return methods.get('/login/GetPassword',params)
    },
    allAdmins(params){
        return methods.get('/login/searchAname',params)
    },
    add(params){
        return methods.post('/login/addAdmin',params)
    },
    updateAdmin(params){
        return methods.put('/login/updateAdmin',params)
    },
    updatePsd(params){
        return methods.put('/login/updatePassword',params)
    },
    delAdmin(params){
        return methods.delete('/login/deleteAdmin',params)
    },
    logout() {
        return methods.get('/login/quit')
    }
}

export default admin
