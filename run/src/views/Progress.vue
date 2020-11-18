<template>
    <div class="peogress">
        <!-- 选择对应周 -->
        <div style="width: 40%;margin: 20px">
            <el-cascader
                    placeholder="选择学期和周次"
                    :options="semesterBeans"
                    ref="cascader"
                    style="margin: 0 20px"
                    @change="getCheckedNodes"
                    filterable>
            </el-cascader>
            <el-cascader
                    placeholder="班级"
                    ref="classes"
                    :options="collegeBeanList"
                    @change="getCheckedClasses"
                    filterable>
            </el-cascader>
        </div>
        <!-- 环形进度条 -->
        <div class="percentagebox" style="margin-left:5%">
            <span class="percentagetxt">男生跑了零次:</span>
            <el-progress :percentage=allData[0] type="circle"></el-progress>
        </div>
        <div class="percentagebox">
            <span class="percentagetxt">男生跑了一次:</span>
            <el-progress :percentage=allData[1] type="circle"></el-progress>
        </div>
        <div class="percentagebox">
            <span class="percentagetxt">男生跑了两次:</span>
            <el-progress :percentage=allData[2] type="circle"></el-progress>
        </div>
        <div class="percentagebox">
            <span class="percentagetxt">女生跑了零次:</span>
            <el-progress :percentage=allData[3] type="circle"></el-progress>
        </div>
        <div class="percentagebox">
            <span class="percentagetxt">女生跑了一次:</span>
            <el-progress :percentage=allData[4] type="circle"></el-progress>
        </div>
        <div class="percentagebox">
            <span class="percentagetxt">女生跑了两次:</span>
            <el-progress :percentage=allData[5] type="circle"></el-progress>
        </div>
        <!-- 条形统计图 -->
        <div id="myChart"></div>
    </div>
</template>

<script>
    import home from "../http/api/home";
    export default {
        name: "Progress",
        data() {
            return {
                // 环形进度条的接收数据
                allData: [],
                // 选择学期
                semesterBeans:[],
                //选择班级
                collegeBeanList:[],
                requestInfo:{
                    cid: 0,
                    gid: 0,
                    clid: 0
                },
                boyRun:[],
                girlRun: []
            };
        },
        mounted() {
            this.getData();
            this.initData()
        },
        methods: {
            // 获取学期选择框
            getData() {
                home.getSemester().then((res) =>{
                    let data = res.extend.semesterBeans
                    let collegeData = res.extend.collegeBeanList
                    for (let i = 0; i<data.length;i++){
                        let obj = {
                            seid:data[i].seid,
                            value:data[i].sename,
                            label:data[i].sename
                        }
                        let children = []
                        if(data[i].weekBeanList != null){
                            for (let j=0;j <data[i].weekBeanList.length;j++){
                                let week ={
                                    wid:data[i].weekBeanList[j].wid,
                                    value: '第' + data[i].weekBeanList[j].wname + '周',
                                    label: '第' + data[i].weekBeanList[j].wname + '周'
                                }
                                children.push(week)
                            }
                        }
                        obj.children = children
                        this.semesterBeans.push(obj)
                    }
                    for (let i = 0; i < collegeData.length;i++){
                        let obj = {
                            cid: collegeData[i].cid,
                            value: collegeData[i].cname,
                            label: collegeData[i].cname
                        }
                        let children = []
                        if(collegeData[i].gradeBeanList != null){
                            for (let j=0; j < collegeData[i].gradeBeanList.length; j++){
                                let grade ={
                                    gid:collegeData[i].gradeBeanList[j].gid,
                                    value: collegeData[i].gradeBeanList[j].gname + '级',
                                    label: collegeData[i].gradeBeanList[j].gname + '级',
                                    children: []
                                }
                                for (let k = 0; k < collegeData[i].gradeBeanList[j].classesBeanList.length; k ++) {
                                    let classes = {
                                        clid:  collegeData[i].gradeBeanList[j].classesBeanList[k].clid,
                                        value:  collegeData[i].gradeBeanList[j].classesBeanList[k].clname,
                                        label:  collegeData[i].gradeBeanList[j].classesBeanList[k].clname
                                    }
                                    grade.children.push(classes)
                                }
                                children.push(grade)
                            }
                        }
                        obj.children = children
                        this.collegeBeanList.push(obj)
                    }
                })
            },
            // 获取图表数据
            initData(){
                home.getNow().then(res => {
                    this.requestInfo.wid = res.extend.weekBean.wid
                    this.requestInfo.seid = res.extend.semesterBean.seid
                })
                setTimeout(() => {
                    home.getPercentage(this.requestInfo).then(res=>{
                        this.allData.push(Number(res.extend.boyZeroTimes.replace("%","")))
                        this.allData.push(Number(res.extend.boyOnce.replace("%","")))
                        this.allData.push(Number(res.extend.boyTwice.replace("%","")))
                        this.allData.push(Number(res.extend.girlZeroTimes.replace("%","")))
                        this.allData.push(Number(res.extend.girlOnce.replace("%","")))
                        this.allData.push(Number(res.extend.girlTwice.replace("%","")))
                        this.boyRun.push(res.extend.b0)
                        this.boyRun.push(res.extend.b1)
                        this.boyRun.push(res.extend.b2)
                        this.girlRun.push(res.extend.g0)
                        this.girlRun.push(res.extend.g1)
                        this.girlRun.push(res.extend.g2)
                        this.draw()
                    })
                },500)

            },
            // 画图表
            draw() {
                const that = this
                // 实例化echarts对象
                let myChartDrawer = this.$echarts.init(
                    document.getElementById("myChart")
                );
                // 绘制条形图
                var option = {
                    // 表头
                    legend: {
                        data: ["男生", "女生"],
                        top: 30
                    },
                    // 数据提示
                    tooltip: {},
                    // X轴
                    xAxis: {
                        data: ["未跑", "一次", "两次"]
                    },
                    // Y轴
                    yAxis: {
                    },
                    // 数据
                    series: [
                        {
                            name: "男生",
                            type: "bar",
                            data: [0,0,0],
                            barWidth: 40,
                            itemStyle: {
                                normal: {
                                    color: "#409EFF"
                                }
                            },
                        },
                        {
                            name: "女生",
                            type: "bar",
                            data: [0,0,0],
                            barWidth: 40,
                            itemStyle: {
                                normal: {
                                    color: "#FF5757"
                                }
                            }
                        }
                    ]
                }
                option.series[0].data = that.boyRun
                option.series[1].data = that.girlRun
                myChartDrawer.setOption(option);
            },
            // 选择学期
            getCheckedNodes() {
                const checkNote = this.$refs['cascader'].getCheckedNodes()
                this.requestInfo.seid = checkNote[0].parent.data.seid
                this.requestInfo.wid = checkNote[0].data.wid
                this.initData()
            },
            // 选择班级
            getCheckedClasses(){
                const checkClasses = this.$refs['classes'].getCheckedNodes()
                this.requestInfo.cid = checkClasses[0].parent.parent.data.cid
                this.requestInfo.gid = checkClasses[0].parent.data.gid
                this.requestInfo.clid = checkClasses[0].data.clid
                this.initData()
            }
        }
    };
</script>

<style>
    /** 下拉框 */
    .selectbox{
        width: 12%;
        float:left;
    }
    /**环形进度条 */
    /*容器 */
    .percentagebox {
        width: 15%;
        float: left;
        /* border: 1px red solid; */
    }
    /*文本 */
    .percentagetxt {
        font-size: 16px;
        display: block;
        color: #303133;
    }
    /**条形统计图 */
    #myChart {
        width: 60%;
        min-height: 300px;
        clear: both;
        box-sizing: border-box;
        margin: 100px auto;
    }
    /* 选择框 */
    .home_select {
        float: left;
        display: block;
        width: 130px;
        margin-left: 50px;
        margin-top: 20px;
    }
</style>
