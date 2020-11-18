<template>
    <div class="setbox">
        <div style="width: 60%;margin: 50px auto">
            <el-form :model="setForm" label-position="right" :label-width="formLabelWidth">
                <el-form-item :label-width="formLabelWidth" label="当前学期">
                    <!--获取当前学期作为默认-->
                    <el-select placeholder="请选择" v-model="value" style="width: 180px;margin-left: 40px" @change="getCheckedNodes">
                        <el-option :key="item.seid" :label="item.label" :value="item.sename" v-for="item in setForm.semesterBeans"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth" label="当前周">
                    <el-input-number :min="0" v-model="nowWeek.wname" style="margin-left: 40px"></el-input-number>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth" label="App版本">
                    <el-input-number :min="0" v-model="appVersion" :precision="2" :step="0.01" style="margin-left: 40px"></el-input-number>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth" label="分数设定">
                    <span class="form-span">次数:</span>
                    <el-input
                            :key="num.id"
                            autocomplete="off"
                            style="width:12%"
                            v-for="num in setForm.resultBeanList"
                            v-model="num.minresult"
                    ></el-input>
                    <br/>
                    <span class="form-span">分数:</span>
                    <el-input
                            :key="grade.id"
                            autocomplete="off"
                            style="width:12%"
                            v-for="grade in setForm.resultBeanList"
                            v-model="grade.rresult"
                    ></el-input>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth" label="单次跑步距离(km为单位)" >
                    <div>
                        <div v-for="item in setForm.ruleBeanList" :key="item.id" style="float: left">
                            <span class="form-span">{{item.sex}}: </span>
                            <el-input-number
                                    :max="10"
                                    :min="0"
                                    :precision="1"
                                    :step="0.1"
                                    size="mini"
                                    v-model="item.rkm"
                            ></el-input-number>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth" label="每周跑步次数">
                    <div>
                        <div  v-for="item in setForm.ruleBeanList" :key="item.id" style="float: left">
                            <span class="form-span">{{item.sex}}: </span>
                            <el-input-number :max="10" :min="0" size="mini" v-model="item.rweek"></el-input-number>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" class="commit-btn" @click="updateSetting">提交</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import setting from "../http/api/setting";
    import home from "../http/api/home";

    export default {
        name: "Setting",
        data() {
            return {
                setForm: {
                    ruleBeanList:[], // 跑步次数和公里
                    resultBeanList:[], //成绩标准
                    // 选择学期
                    semesterBeans: [],
                },
                /*当前学期*/
                value: '',
                updateSeid: 0,
                /*当前周*/
                nowWeek: {},
                appVersion:'1.1',
                formLabelWidth:"110px",

            }
        },
        methods: {
            getSetting(){
                home.getNow().then(res => {
                    this.value = res.extend.semesterBean.sename
                    this.nowWeek.wid = res.extend.weekBean.wid
                    this.nowWeek.seid = res.extend.weekBean.seid
                    this.nowWeek.wname = res.extend.weekBean.wname
                })
                setting.get().then((res) =>{
                    this.setForm.resultBeanList = res.extend.resultBeanList
                    this.setForm.semesterBeans = res.extend.semesterBeans
                    this.setForm.ruleBeanList = res.extend.ruleBeanList
                })
            },
            /*获取选择器中当前学期*/
            getCheckedNodes(val) {
                for (let i = 0 ; i < this.setForm.semesterBeans.length; i ++) {
                    if (val == this.setForm.semesterBeans[i].sename) {
                        this.updateSeid = this.setForm.semesterBeans[i].seid
                    }
                }
            },
            //修改
            updateSetting(){
                let arr = {ruleBeanList: []}
                arr.resultBeanList = this.setForm.resultBeanList
                arr.ruleBeanList = this.setForm.ruleBeanList
                if (this.updateSeid == 0){
                    arr.weekBean = {
                        seid: this.nowWeek.seid,
                        wname: this.nowWeek.wname
                    }
                }else {
                    arr.weekBean = {
                        seid: this.updateSeid,
                        wname: this.nowWeek.wname
                    }
                }
                setting.update(arr).then(res =>{
                    if (res.code === 200){
                        this.$message({
                            message:'修改成功',
                            type:"success"
                        })
                    }else {
                        this.$message({
                            message:'修改失败',
                            type:"error"
                        })
                    }
                })
            }
        },
        mounted() {
            this.getSetting();
            console.log(typeof this.appVersion)
        }
    }
</script>

<style scoped>
.setbox{
    width: 60%;
    margin: 50px auto;
    padding: 20px 0;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0px 2px 5px 2px rgb(212, 211, 215);
}
    .commit-btn{
        width: 150px;
        margin-top: 20px;
        margin-left: 40px;
    }
    .form-span {
        display: inline-block;
        width: 40px;
        text-align: center;
    }
</style>
