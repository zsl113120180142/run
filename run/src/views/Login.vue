<template>
    <div class="login">
        <!-- 背景视频 -->
        <video autoplay id="video-bg" loop muted src="../../public/imgs/bg.mp4"></video>
        <!-- 登录框 -->
        <div class="login-container">
            <el-form :model="form" :rules="rules" class="login-box" label-width="80px" ref="loginForm">
                <h2 class="login-title">赣南医学院体育后台管理</h2>
                <el-form-item class="login_input" label="账号" prop="username" style="width: 91%;">
                    <el-input
                            @keyup.enter.native="onSubmit()"
                            autocomplete="off"
                            maxlength="12"
                            placeholder="请输入账号"
                            suffix-icon="el-icon-user-solid"
                            type="text"
                            v-model="form.username"
                    />
                </el-form-item>
                <el-form-item label="密码" prop="password" style="width: 91%;">
                    <el-input
                            @keyup.enter.native="onSubmit()"
                            maxlength="10"
                            placeholder="请输入密码"
                            show-password
                            type="password"
                            v-model="form.password"
                    />
                </el-form-item>
<!--                <el-button @click="dialogFormVisible = true" class="forgetpsd" type="text">忘记密码</el-button>-->
                <el-form-item>
                    <el-button style="width:88%;" type="primary" v-on:click="onSubmit()">登录</el-button>
                </el-form-item>
            </el-form>
            <!-- 忘记密码弹窗 -->
            <el-dialog :visible.sync="dialogFormVisible" title="忘记密码">
                <el-form :model="psdform" :rules="rules">
                    <el-form-item :label-width="formLabelWidth" label="请输入工号" prop="num">
                        <el-input @keyup.enter.native="forgetPsd" autocomplete="off" maxlength="12" name="num"
                                  v-model="psdform.username"></el-input>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth" label="请输入手机号" prop="phone">
                        <el-input @keyup.enter.native="forgetPsd" autocomplete="off" name="phone"
                                  v-model="psdform.phone"></el-input>
                    </el-form-item>
                </el-form>
                <div class="dialog-footer" slot="footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button
                            :disabled="!psdform.username||!psdform.phone"
                            @click="forgetPsd()"
                            type="primary"
                    >确 定
                    </el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import "../../public/css/login.css";
    import {validateNumber, validatePsdReg, validatePhone} from "../validator.js"
    import admin from '../http/api/admin'
    import axios from 'axios'
    export default {
        name: "Login",
        data() {
            return {
                //   用户名 密码
                form: {
                    username: "",
                    password: ""
                },
                // 表单验证，需要在 el-form-item 元素中增加 prop 属性
                rules: {
                    username: [
                        {required: true, message: "账号不可为空", trigger: "blur"},
                        {type: "string", min: 12, message: "账号是12位纯数字"},
                        {validator: validateNumber}
                    ],
                    password: [
                        {required: true, message: "密码不可为空", trigger: "blur"},
                        {type: "string", min: 6, message: "请输入6-10位字母、数字或者符号组合"},
                        {validator: validatePsdReg}
                    ],
                    phone: [
                        {required: true, message: "电话不可为空", trigger: "blur"},
                        {type: "string",},
                        {validator: validatePhone}
                    ]
                },
                // 对话框显示和隐藏
                dialogFormVisible: false,
                psdform: {
                    username: "",
                    phone: ""
                },
                formLabelWidth: "120px",
                // 返回的密码
                returnpsd: "",
                token: ''
            };
        },
        methods: {
            // 登录判断
            onSubmit() {
                let user = {
                    username: this.form.username,
                    password: this.form.password
                }
                let username
                admin.login(this.$qs.stringify(user)).then(res => {
                    if (res.code === 200) {
                        username = res.extend.username
                        sessionStorage.setItem("token",res.token)
                        sessionStorage.setItem("userId",res.extend.login.aid)
                        sessionStorage.setItem("identical",res.extend.login.iden)
                        sessionStorage.setItem("imgUrl",res.extend.login.apicture)
                        this.$router.push('/home')
                    }
                })
            },
            // 忘记密码
            forgetPsd() {
                const _this = this.psdform
                let params = new URLSearchParams();
                params.append('username', _this.username);
                params.append('phone', _this.phone);
                let user = {
                    username: _this.username,
                    phone: _this.phone
                }
                admin.forgetPsd(user).then((res) => {
                    this.returnpsd = res.extend.password
                    if (this.returnpsd) {
                        this.$notify({
                            title: "成功",
                            message: "您的密码是" + this.returnpsd,
                            type: "success"
                        });
                        this.psdform.username = "";
                        this.psdform.phone = "";
                        this.dialogFormVisible = false;
                    } else {
                        this.$message.error("工号与手机号不匹配");
                        this.psdform.username = "";
                        this.psdform.phone = "";
                        this.dialogFormVisible = false;
                    }
                })
            }
        }
    };
</script>
<style scoped>
    /* css通过外联引入 */
</style>
