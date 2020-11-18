/**
 *  home api
 */
import methods from '../http'
let home = {
    getCollegeData() {
        return methods.get('/home/HomePage')
    },
    getSemester(params){
        return methods.get('/home/getWeek',params)
    },
    getPercentage(params){
        return methods.get('/home/getSta',params)
    },
    getNow(){
        return methods.get('/home/NowSemesterAndWeek')
    }
}

export default home
