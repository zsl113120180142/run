<template>
    <div class="table">
        <!-- 搜索框 -->
        <el-input class="search_input" clearable placeholder="请输入内容" v-model="studentName" @keyup.enter.native="getData" @clear="getData"></el-input>
        <el-button icon="el-icon-search" type="primary" @click="getData">搜索</el-button>
        <!-- 新增学生 -->
        <el-button
                @click="dialogFormVisible = true"
                icon="el-icon-circle-plus-outline"
                type="primary"
        >添加
        </el-button>
<!--        <div style="width: 100px;float: right;margin-right: 360px">-->
            <el-upload
                    class="upload-demo"
                    action="http://111.75.252.147:80/Running/file/importExc"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :before-remove="beforeRemove"
                    multiple
                    name="excelFile"
                    :limit="1"
                    :on-exceed="handleExceed"
                    :file-list="fileList">
                <el-button  type="primary" >点击上传</el-button>
            </el-upload>
<!--        </div>-->

        <el-button @click="downloadExcel" type="success" style="margin-left:10px">导出</el-button>
        <el-button type="warning" @click="delClass">删除班级</el-button>
        <el-dialog :visible.sync="dialogFormVisible" title="新增用户">
            <el-form :model="form">
                <el-form-item :label-width="formLabelWidth" label="姓名">
                    <el-input autocomplete="off" v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth" label="性别">
                    <el-input autocomplete="off" v-model="form.sex"></el-input>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth" label="学号">
                    <el-input autocomplete="off" v-model="form.num"></el-input>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth" label="课内成绩">
                    <el-input autocomplete="off" v-model="form.inclass"></el-input>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth" label="体测成绩">
                    <el-input autocomplete="off" v-model="form.spe"></el-input>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth" label="跑步成绩">
                    <el-input autocomplete="off" v-model="form.srun"></el-input>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth" label="总分">
                    <el-input autocomplete="off" v-model="form.sresult"></el-input>
                </el-form-item>
            </el-form>
            <div class="dialog-footer" slot="footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button
                        :disabled="!form.name||!form.sex||!form.inclass||!form.num"
                        @click="addStudent"
                        type="primary"
                >确 定
                </el-button>
            </div>
        </el-dialog>
        <!-- 展示表格 -->
        <el-table
                :data="tableData"
                id="out-table"
                ref="multipleTable"
                style="width:80%;margin:0 auto;"
                tooltip-effect="dark"
        >
            <el-table-column label="序号" type="index" width="70"></el-table-column>
            <el-table-column label="姓名" prop="sname" width="110"></el-table-column>
            <el-table-column label="性别" prop="sex" width="70"></el-table-column>
            <el-table-column label="班级" prop="classesBean.clname"></el-table-column>
            <el-table-column label="学号" prop="snum" style="mso-number-format:'\@';"
                             width="150"></el-table-column>
            <el-table-column label="课内成绩" prop="inclass" width="110"></el-table-column>
            <el-table-column label="体测成绩" prop="spe" width="110"></el-table-column>
            <el-table-column label="跑步成绩" prop="srun" width="110"></el-table-column>
            <el-table-column label="总分" prop="sresult"  width="110"></el-table-column>
<!--            <el-table-column label="合格状态" prop="(sdelete == 1)?'合格':'不合格'" width="100"></el-table-column>-->
            <el-table-column label="合格状态" width="150">
                <template slot-scope="scope">
                    <el-button :class="scope.row.sresult>59? 'run-btn-primary' : 'run-btn-danger'"
                               class="table-btn-size" size="small">
                        {{scope.row.sresult>59 ? "合格" : "不合格" }}
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column label="编辑" width="80">
                <template slot-scope="scope">
                <i @click="updateDialog(scope.row)" class="el-icon-edit"></i>
                </template>
            </el-table-column>
        </el-table>
        <!-- 修改成绩弹窗 -->
        <el-dialog :visible.sync="dialogFormVisibleUpdate" title="修改用户">
            <el-form :model="updateForm">
                <el-form-item :label-width="formLabelWidth" label="课内成绩">
                    <el-input autocomplete="off" v-model="updateForm.inclass"></el-input>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth" label="体测成绩">
                    <el-input autocomplete="off" v-model="updateForm.spe" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth" label="跑步成绩">
                    <el-input autocomplete="off" v-model="updateForm.srun"></el-input>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth" label="总分">
                    <el-input autocomplete="off" v-model="updateForm.sresult"></el-input>
                </el-form-item>
            </el-form>
            <div class="dialog-footer" slot="footer">
                <el-button @click="dialogFormVisibleUpdate = false">取消</el-button>
                <el-button

                        @click="updateStudent"
                        type="primary"
                >确 定
                </el-button>
            </div>
        </el-dialog>
        <!-- 分页 -->
        <el-pagination
                :page-size="pageSize"
                :page-count="pageNum"
                :total="total"
                background
                @current-change="handleCurrentChange"
                layout="total, prev, pager, next, jumper"
                style="height:30px;margin-top:10px;text-align: center"
        ></el-pagination>

    </div>
</template>

<script>
    // @ is an alias to /src
    import "../../public/css/table.css";
    import FileSaver from "file-saver";
    import XLSX from "xlsx";
    import student from "../http/api/student";

    export default {
        name: "Table",
        data() {
            return {
                clid:this.$route.params.id,
                excel: this.$route.query.classes,
                //  新增学生
                dialogFormVisible: false,
                form: {
                    name: "",
                    sex: "",
                    inclass: "",
                    spe: "",
                    srun:'',
                    sresult:'',
                    num: ""
                },
                formLabelWidth: "100px",
                // 修改学生成绩
                dialogFormVisibleUpdate: false,
                updateForm:'',
                // 展示表格内容
                tableData: [],
                multipleSelection: [],
                // 输入框内容
                studentName: '',
                // 分页总条数
                total: 1,
                pageNum:1,
                pageSize:10,
                fileList: []
            };
        },
        methods: {
            // 表格全选
            handleSelectionChange(val) {
              this.multipleSelection = val;
            },
            // 增加学生
            addStudent() {
                this.dialogFormVisible = false;
                const _this = this.form;
                let addStudent = {
                    sname: _this.name,
                    sex: _this.sex,
                    snum: _this.num,
                    sdelete:"1",
                    clid:this.clid,
                    inclass:_this.inclass,
                    spe:_this.spe,
                    srun:_this.srun,
                    sresult:_this.sresult
                }
                student.add(addStudent).then((res) =>{
                    this.dialogFormVisible = false;
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
                })
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview(file) {
                console.log(file);
            },
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            beforeRemove(file, fileList) {
                return this.$confirm(`确定移除 ${ file.name }？`);
            },
            // 修改学生成绩
            updateDialog(row) {
                this.dialogFormVisibleUpdate = true
                this.updateForm = {
                    sid: row.sid,
                    inclass: row.inclass,
                    spe: row.spe,
                    srun: row.srun,
                    sresult: row.sresult,
                }
            },
            updateStudent() {
                student.update(this.updateForm).then(res => {
                    if (res.code == 200) {
                        this.$message({
                            message: '修改成功',
                            type: 'success'
                        });
                        this.dialogFormVisibleUpdate = false
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
            delClass() {
                let arr ={
                    clid:this.clid
                }
                student.del(this.$qs.stringify(arr)).then(res =>{
                    if (res.code == 200) {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.$router.push('/progress')
                    } else {
                        this.$message({
                            message: '删除失败，请检查网络设置',
                            type: 'error'
                        });
                    }
                })
            },

            getData() {
                let params = {
                    clid:this.clid,
                    pageNum:this.pageNum,
                    pageSize: this.pageSize,
                    sname:this.studentName
                }
                if (this.studentName == ''){
                    student.get(params).then(res => {
                        this.tableData = res.extend.student.list;
                        this.total = res.extend.student.total;
                    })
                }else {
                    student.getSearch(params).then(res => {
                        this.tableData = res.extend.search.list;
                        this.total = res.extend.search.total;
                    })
                }

            },
            // 页数的改变
            handleCurrentChange(val) {
                this.pageNum = val
                this.getData()
            },
            //导出excel
            downloadExcel(){
                let arr ={
                    clid:this.clid
                }
                window.location.href = 'http://111.75.252.147:80/Running/file/excel?clid='+this.clid
            }
        },
        mounted() {
            this.getData();
        },
        watch:{
            '$route'(newVal){
                this.clid = newVal.params.id
                this.getData();
            },
        }
    };
</script>

<style scoped>
    /*绿色实心按钮*/
    .run-btn-primary {
        color: #FFFFFF !important;
        border-color: #1E9FFF !important;
        background: #1E9FFF !important;
        font-size: 14px;
    }

    /*红色实心按钮*/
    .run-btn-danger {
        color: #FFFFFF !important;
        border-color: #ff2700 !important;
        background: #ff2700 !important;
        font-size: 12px;
    }
    .upload-demo {
        display: inline-block;
        margin-left: 10px;
    }
</style>
