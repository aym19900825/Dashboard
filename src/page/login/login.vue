<template>
    <div id="login">
        <div style="height: 50px; width: 100%;"></div>
        <el-container>
            <el-main>
                <el-row type="flex" class="row-bg" justify="center">
                    <el-col :span="6">
                        <el-form ref="loginForm" :model="user" :rules="rules"  status-icon  label-width="80px" label-position="top"  class="login-container"> 
                            <h3>登录</h3>
                            <el-form-item label="用户名" prop="name">
                                <el-input  type="text" placeholder="用户名" v-model="user.name"></el-input>
                            </el-form-item>
                            <el-form-item label="密码" prop="pass">
                                <el-input type="password" placeholder="密码" v-model="user.pass"></el-input>
                            </el-form-item>
                            <el-form-item> 
                                <el-button type="primary" class="submitBtn" @click="login">登录</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
            </el-main>
        </el-container>
  </div>
</template>

<script>
    export default {
        name: 'login',
        methods: {
            login() {
                this.$refs.loginForm.validate((valid) => {
                    var url = '/api/system/login';
                    if (valid) {
                        this.$axios.post(url,{
                            name: this.user.name,
                            password: this.user.pass
                        }).then((res) => {
                            if(res.data.code==1){
                                this.$router.replace('/visualizeList');
                            }else{
                                this.$message({
                                    type: 'error',
                                    message: '用户名或者密码错误，请重试！',
                                    showClose: true
                                })
                            }
                        }).catch((err) => {
                            this.$message({
                                type: 'error',
                                message: '网络错误，请重试',
                                showClose: true
                            })
                        })
                    }
                    else {
                        return false
                    }
                })
            }
        },
        data () {
            return {
                user: {
                    name: '',
                    pass: ''
                },
                rules:  {
                    name:[
                        {
                            required: true,
                            message: '必填信息',
                            trigger: 'blur',
                        }
                    ],
                    pass:[
                        {
                            required: true,
                            message: '必填信息',
                            trigger: 'blur',
                        }
                    ]
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
@import './login';
</style>
