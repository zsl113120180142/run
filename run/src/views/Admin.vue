<template>
    <div class="admin">
        <!-- 搜索框 -->
        <el-input class="search_input" clearable placeholder="请输入内容" v-model="adminInput" @keyup.enter.native="getData" @clear="getData"></el-input>
        <el-button icon="el-icon-search" type="primary" @click="getData">搜索</el-button>
        <!-- 新增管理员 -->
        <el-button @click="dialogFormVisible = true" icon="el-icon-circle-plus-outline" type="success"
        >添加
        </el-button>
        <!--        添加管理员-->
        <el-dialog :visible.sync="dialogFormVisible" title="新增管理员">
            <el-form :model="form" :rules="rules">
                <el-form-item :label-width="formLabelWidth" label="姓名" prop="name">
                    <el-input autocomplete="off" name="name" v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth" label="工号" prop="username">
                    <el-input autocomplete="off" maxlength="12" name="username" v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth" label="电话" prop="phone">
                    <el-input autocomplete="off" name="phone" v-model="form.phone"></el-input>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth" label="密码" prop="password">
                    <el-input autocomplete="off" name="password" v-model="form.password"></el-input>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth" label="角色">
                    <el-input autocomplete="off" v-model="form.role"></el-input>
                </el-form-item>
            </el-form>
            <div class="dialog-footer" slot="footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button
                    :disabled="!form.name||!form.username||!form.phone||!form.password||!form.role"
                    @click="addUser"
                    type="primary"
                >确 定
                </el-button>
            </div>
        </el-dialog>
        <el-button @click="delAll" style="margin-left: 10px" type="danger">批量删除</el-button>
        <template>
            <el-table
                :data="tableData"
                @selection-change="handleSelectionChange"
                ref="multipleTable"
                style="width: 80%;margin: 0 auto;"
                tooltip-effect="dark">
                <el-table-column
                    type="selection"
                    width="80">
                </el-table-column>
                <el-table-column
                    label="序号"
                    type="index"
                    width="80">
                </el-table-column>
                <el-table-column
                    label="姓名"
                    prop="aname"
                    width="160">
                </el-table-column>
                <el-table-column
                    label="工号"
                    prop="username"
                    width="180">
                </el-table-column>
                <el-table-column
                    label="手机"
                    prop="phone"
                    width="180">
                </el-table-column>
                <el-table-column
                    label="角色"
                    prop="iden">
                </el-table-column>
                <el-table-column label="状态" width="120">
                    <template slot-scope="scope">
                        <el-switch
                            @click.native="state(scope.row)"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            v-model="scope.row.works">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120">
                    <template slot-scope="scope">
                        <i @click="updateDialog(scope.row)" class="el-icon-edit"></i>
                        <i @click="delUser(scope.row)" class="el-icon-delete"></i>
                    </template>
                </el-table-column>
            </el-table>
            <!--修改管理员-->
            <el-dialog :visible.sync="dialogFormVisibleupdate" title="修改管理员">
                <el-form :model="updateForm" :rules="rules">
                    <el-form-item :label-width="formLabelWidth" label="姓名" prop="aname">
                        <el-input autocomplete="off" name="aname" v-model="updateForm.aname"></el-input>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth" label="工号" prop="username">
                        <el-input autocomplete="off" maxlength="12" name="username"
                                  v-model="updateForm.username" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth" label="电话" prop="phone">
                        <el-input autocomplete="off" name="phone" v-model="updateForm.phone"></el-input>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth" label="角色">
                        <el-input autocomplete="off" v-model="updateForm.iden"></el-input>
                    </el-form-item>
                </el-form>
                <div class="dialog-footer" slot="footer">
                    <el-button @click="dialogFormVisibleupdate = false">取 消</el-button>
                    <el-button
                        :disabled="!updateForm.aname||!updateForm.username||!updateForm.phone||!updateForm.iden"
                        @click="updateUser"
                        type="primary"
                    >确 定
                    </el-button>
                </div>
            </el-dialog>
        </template>
        <el-pagination
            :page-count="pageNum"
            :page-size="pageSize"
            :total="total"
            @current-change="handleCurrentChange"
            background
            layout="total, prev, pager, next, jumper"
            style="height:30px;margin-top:10px;text-align: center"
        ></el-pagination>
    </div>
</template>

<script>
    import {validateName, validateNumber, validatePhone, validatePsdReg} from "../validator";
    import axios from 'axios'
    import admin from '../http/api/admin'

    export default {
        name: "Admin",
        data() {
            return {
                adminInput: '', // 搜索内容
                state_value: 0,// 状态
                dialogFormVisible: false, // 新增用户弹出框属性
                form: {  // 新增表格数据
                    name: '',
                    username: '',
                    phone: '',
                    password: '',
                    role: '管理员',
                },
                dialogFormVisibleupdate: false,  //修改框状态
                updateForm: '',  // 修改数据
                formLabelWidth: "100px",  //  弹出框的宽度
                tableData: [],  // 表格数据
                rowData: '', //当前行的数据
                multipleSelection: [], //勾选的id
                total: 1,  // 总条数
                pageSize: 10,
                pageNum: 1,
                rules: {  //  规则
                    name: [
                        {validator: validateName}
                    ],
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
            }
        },
        methods: {
            /*全选*/
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            getData() { // 获取初始数据
                admin.allAdmins({
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    aname: this.adminInput
                }).then((res) => {
                    this.tableData = res.extend.searchadmin.list
                    this.total = res.extend.searchadmin.total
                    this.pageSize = res.extend.searchadmin.pageSize
                })
            },
            // 页数的改变
            handleCurrentChange(val) {
                this.pageNum = val
                this.getData()
            },
            // 增加管理员
            addUser() {
                const _this = this.form
                let admins = {
                    username: _this.username,
                    password: _this.password,
                    phone: _this.phone,
                    aname: _this.name,
                    iden: _this.role,
                    works: true
                }
                admin.add(admins).then((res) => {
                    this.dialogFormVisible = false;
                    if (res.code == 200) {
                        this.$message({
                            message: '添加成功',
                            type: 'success'
                        })
                    } else {
                        this.$message({
                            type: "error",
                            message: "添加失败"
                        })
                    }
                })
            },
            // 修改管理员，将数据填入表单
            updateDialog(row) {
                this.dialogFormVisibleupdate = true;
                this.updateForm = {
                    aid: row.aid,
                    aname: row.aname,
                    username: row.username,
                    phone: row.phone,
                    iden: row.iden,
                    works: row.works
                }
            },
            updateUser() {
                admin.updateAdmin(this.updateForm).then(res => {
                    if (res.code == 200) {
                        this.$message({
                            message: '修改成功',
                            type: 'success'
                        });
                        this.getData()
                    } else {
                        this.$message({
                            message: '修改失败，请检查网络设置',
                            type: 'error'
                        });
                    }
                    this.dialogFormVisibleupdate = false;
                })
            },
            state(row) { // 管理员的禁用
                if (row.works == false) {
                    this.$confirm("禁用此管理员, 是否继续?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "error"
                    })
                        .then(() => {
                            let updateData = {
                                works: false,
                                aid: row.aid
                            }
                            admin.updateAdmin(updateData).then((res) => {
                                if (res.code == 200) {
                                    this.$message({
                                        message: '禁用成功！',
                                        type: 'success'
                                    });
                                    row.works = false
                                } else {
                                    this.$message({
                                        message: '禁用失败，请检查网络设置',
                                        type: 'error'
                                    });
                                }
                            })
                        })
                        .catch(() => {
                            this.$message({
                                type: "error",
                                message: "已取消禁用"
                            });
                            row.works = true
                        });
                } else {
                    this.$confirm("启用此管理员, 是否继续?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "success"
                    })
                        .then(() => {
                            let updateData = {
                                works: true,
                                aid: row.aid
                            }
                            admin.updateAdmin(updateData).then((res) => {
                                if (res.code == 200) {
                                    this.$message({
                                        message: '启用成功！',
                                        type: 'success'
                                    });
                                    row.works = true
                                } else {
                                    this.$message({
                                        message: '启用失败，请检查网络设置！',
                                        type: 'error'
                                    });
                                }
                            })
                        })
                        .catch(() => {
                            this.$message({
                                type: "error",
                                message: "已取消启用"
                            });
                            row.works = false
                        });
                }
            },
            delUser(row) {  // 删除管理员
                let delAids = {
                    aids: row.aid
                }
                this.$confirm("删除此管理员, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "error"
                })
                    .then(() => {
                        admin.delAdmin(delAids).then((res) => {
                            if (res.code == 200) {
                                this.$message({
                                    message: '删除成功！',
                                    type: 'success'
                                });
                                this.getData()
                            } else {
                                this.$message({
                                    message: '不好意思，删除失败',
                                    type: 'error'
                                });
                            }
                        })
                    })
                    .catch(() => {
                        this.$message({
                            type: "error",
                            message: "已取消删除"
                        });
                    });
            },

            delAll() {  // 批量删除
                if (this.multipleSelection.length == 0) {
                    this.$message({
                        type: "error",
                        message: "请先勾选需要删除的数据"
                    });
                } else {
                    this.$confirm("删除此管理员, 是否继续?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "error"
                    })
                        .then(() => {
                            const del = this.multipleSelection
                            let newArray = []
                            for (let i = 0; i < del.length; i++) {
                                const delId = del[i].aid
                                newArray.push(delId)
                            }
                            let delArray = {
                                aids: newArray.join("-")
                            }
                            admin.delAdmin(delArray).then((res) => {
                                if (res.code == 200) {
                                    this.$message({
                                        message: '删除成功！',
                                        type: 'success',
                                    });
                                    this.getData()
                                } else {
                                    this.$message({
                                        message: '删除失败',
                                        type: 'error'
                                    });
                                }
                            })
                        })
                        .catch(() => {
                            this.$message({
                                type: "error",
                                message: "已取消删除"
                            });
                        });
                }
            }
        },
        mounted() {
            this.getData()
        }
    }
</script>

<style scoped>
    @import "../../public/css/table.css";
</style>
