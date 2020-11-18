<template>
    <div class="home">
        <el-container style="height:100%">
            <el-header>
                <!-- 后台logo(标题) -->
                <h1 class="tab_logo" style="color:#fff">赣医体育后台管理</h1>
                <!-- 面包屑导航 -->
                <el-breadcrumb
                        separator-class="el-icon-arrow-right"
                        style="display:inline-block;float:left;line-height:60px"
                >
                    <el-breadcrumb-item :to="{ path: '/progress'}">首页</el-breadcrumb-item>
                    <el-breadcrumb-item v-if="college">{{college}}</el-breadcrumb-item>
                    <el-breadcrumb-item v-if="classes">{{classes}}</el-breadcrumb-item>
                </el-breadcrumb>
                <!-- 管理员信息(退出登录和新增用户) -->
                <el-dropdown class="user">
                    <span class="el-dropdown-link" style="display:block">
                      欢迎您 admin !
                      <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu class="gooff" slot="dropdown">
                        <li @click="dialogFormVisible = true">修改密码</li>
                        <li @click="goOff()">退出登录</li>
                    </el-dropdown-menu>
                </el-dropdown>
                <!-- 忘记密码弹窗 -->
                <el-dialog :visible.sync="dialogFormVisible" title="修改密码">
                    <el-form :model="psdform" >
                        <el-form-item :label-width="formLabelWidth" label="请输入旧密码" prop="oldpassword">
                            <el-input @keyup.enter.native="forgetPsd" autocomplete="off" maxlength="12" name="oldpassword"
                                      v-model="psdform.oldPassword"></el-input>
                        </el-form-item>
                        <el-form-item :label-width="formLabelWidth" label="请输入新密码" prop="newpassword">
                            <el-input @keyup.enter.native="forgetPsd" autocomplete="off" name="newpassword"
                                      v-model="psdform.newPassword"></el-input>
                        </el-form-item>
                    </el-form>
                    <div class="dialog-footer" slot="footer">
                        <el-button @click="dialogFormVisible = false">取 消</el-button>
                        <el-button
                                :disabled="!psdform.oldPassword||!psdform.newPassword"
                                @click="updatePassword"
                                type="primary"
                        >确 定
                        </el-button>
                    </div>
                </el-dialog>
                <!-- 上传头像 -->
                <el-upload
                        class="avatar-uploader"
                        action="http://111.75.252.147:80/Running/file/upload"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                    <el-avatar v-else icon="el-icon-user-solid"></el-avatar>
                </el-upload>
            </el-header>
            <!-- 下方内容 -->
            <el-container style="height:92%;overflow:hidden;margin-bottom:-17px">
                <!-- 左侧导航栏 -->
                <el-aside width="230px" style="text-align: left">
                    <el-scrollbar style="height:100%">
                        <el-menu unique-opened="unique-opened" >
                            <el-submenu index="管理员管理" v-if="isAdmin">
                                <template slot="title">
                                    <i class="el-icon-user-solid"></i>管理员管理
                                </template>
                                <router-link
                                        :to="{name:'Admin',query:{classes:'管理员列表',college:'管理员管理'}}">
                                    <el-menu-item>管理员列表</el-menu-item>
                                </router-link>
                            </el-submenu>
                            <el-submenu index="学院管理">
                                <template slot="title">
                                    <i class="el-icon-menu"></i>学院管理
                                </template>
                                <el-submenu :index=college.cname :key="college.cid" v-for="college in allCollege" v-show="college.gradeBeanList.length==0?false:true">
                                    <template slot="title">
                                        <i class="el-icon-menu"></i>
                                        {{college.cname}}
                                    </template>
                                    <el-submenu :index=String(grade.gid) :key="grade.gid" v-for="grade in college.gradeBeanList" v-show="grade.classesBeanList.length==0?false:true">
                                        <template slot="title">{{grade.gname}}</template>
                                        <router-link v-for="classes in grade.classesBeanList" :key="classes.clid"
                                                :to="{path:'/table/'+classes.clid,query:{classes:classes.clname,college:college.cname}}">
                                            <el-menu-item :index="grade.clname">{{classes.clname}}</el-menu-item>
                                        </router-link>
                                    </el-submenu>
                                </el-submenu>
                            </el-submenu>
                            <router-link :to="{path: '/setting',query: {college: '设置'}}">
                                <el-menu-item style="padding-left: 35px;" index="setting" v-if="isAdmin">
                                    <i class="el-icon-setting"></i>
                                    <span slot="title">设置</span>
                                </el-menu-item>
                            </router-link>
                        </el-menu>
                    </el-scrollbar>
                </el-aside>
                <!-- 主体内容 -->
                <el-main>
                    <!-- 内容展示 -->
                    <el-scrollbar style="height: 100%">
                        <router-view/>
                    </el-scrollbar>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    import "../../public/css/home.css";
    import admin from "../http/api/admin";
    import home from "../http/api/home";
    export default {
        name: "Home",
        data() {
            return {
                college: this.$route.query.college,
                classes: this.$route.query.classes,
                // 后端请求学院班级信息
                allCollege: [],
                // 对话框显示和隐藏
                dialogFormVisible: false,
                psdform: {
                    oldPassword: "",
                    newPassword: ""
                },
                formLabelWidth: "120px",
                // 头像地址
                imageUrl: sessionStorage.imgUrl,
                isAdmin: false
            };
        },
        watch: {
            '$route' (newVal,oldVal) {
                this.classes = newVal.query.classes;
                this.college = newVal.query.college
            }
        },
        methods: {
            // 退出登录
            goOff() {
                // admin.logout()
                this.$router.push({path: '/'});
                localStorage.removeItem('token')
            },
            // 学院班级数据请求
            getCollegeData() {
                home.getCollegeData().then(res => {
                    this.allCollege = res.extend.Allcollege
                })
            },
            /**用户头像上传 */
            handleAvatarSuccess(res) {
                /*获取到的图片地址*/
                let imgPath = res.extend.filePath
                this.imageUrl = imgPath
                let updateForm = {
                    aid: sessionStorage.userId,
                    apicture: imgPath
                }
                sessionStorage.setItem("imgUrl", imgPath)
                admin.updateAdmin(updateForm).then(res => {
                    if (res.code == 200) {
                        this.$message({
                            message: '修改成功',
                            type: 'success'
                        });
                    } else {
                        this.$message({
                            message: '修改失败，请检查网络设置',
                            type: 'error'
                        });
                    }
                    this.dialogFormVisibleupdate = false;
                })
            },
            beforeAvatarUpload(file) {
                const isLt2M = file.size / 1024 / 1024 < 5;
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 5MB!');
                }
                return isLt2M;
            },
            // 修改密码
            updatePassword(){
                let params = {
                    aid: sessionStorage.userId,
                    oldpassword: this.psdform.oldPassword,
                    newpassword: this.psdform.newPassword
                }
                admin.updatePsd(this.$qs.stringify(params)).then(res =>{
                    if(res.code == 200){
                        this.dialogFormVisible = false
                        this.$message.success('修改成功')
                    }else {
                        this.$message.error('修改失败')
                    }
                })
            }
        },
        mounted() {
            this.getCollegeData();
            if (sessionStorage.identical === '超级管理员') {
                this.isAdmin = true
            }
        }
    };
</script>
<style>
    /* 布局 */
    .home {
        height: 100%;
    }
    .el-header {
        background: #fff;
        text-align: center;
    }
    .el-footer {
        background: #fff;
        text-align: center;
        line-height: 60px;
    }
    .nbar {
        margin-left: 220px;
        color: #ffffff;
        text-align: center;
        line-height: 60px;
    }
    .el-aside {
        background-color: #324158;
        color: white;
        text-align: center;
        line-height: 200px;
    }
    .el-main {
        height: 100%;
        padding: 0;
        line-height: 50px;
        margin: 0;
        background-color: #f0f2f5;
        color: #606266;
    }
    body > .el-container {
        margin-bottom: 40px;
    }
    .el-container:nth-child(5) .el-aside,
    .el-container:nth-child(6) .el-aside {
        line-height: 260px;
    }
    .el-container:nth-child(7) .el-aside {
        line-height: 320px;
    }
    /**用户头像上传 */
    .avatar-uploader .el-upload {
        margin-top: 10px;
        border-radius: 50%;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        margin-right: 10px;
        float: right;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409eff;
    }
    .avatar-uploader-icon {
        font-size: 20px;
        color: #8c939d;
        width: 40px;
        height: 40px;
        line-height: 40px;
        text-align: center;
    }
    .avatar {
        width: 40px;
        height: 40px;
        /* display: block; */
    }
    .el-breadcrumb__inner.is-link{
        font-weight: 700 !important;
        color: #303133 !important;
        cursor: pointer !important;
    }
    .el-breadcrumb__inner.is-link:hover{
        color: #409EFF !important;
        cursor: pointer !important;
    }
    .el-dialog{
        width: 600px;
    }
</style>
