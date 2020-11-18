/**
 *  student api
 */
import methods from '../http'

let student = {
    add(params){
        return methods.post('/stu/addStu',params)
    },
    getSearch(params){
        return methods.get('/stu/searchSname',params)
    },
    update(params){
        return methods.put('/stu/updateStu',params)
    },
    del(params){
        return methods.put('/home/deleteclasses',params)
    },
    get(params){
        return methods.get('/stu/getStuByclid',params)
    },
}
export default student
