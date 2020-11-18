/**
 * setting api
 */
import methods from '../http'

let setting = {
    get(params){
        return methods.get('/rule/Semester',params)
    },
    update(params){
        return methods.put('/rule/updateAll',params)
    }
}
export default setting
