<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">遵旨管理系统</div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="username">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="userMessage('ruleForm')">登录</el-button>
                </div>
                <p class="login-tips">Tips : 请填写正确的用户名密码</p>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        data: function(){
            return {
                ruleForm: {
                    username: '',
                    password: ''
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            userMessage(formName) {
                var res = this
                this.$axios({
                    url: 'http://39.99.137.77:8081/projects/loginForPC?username=' + res.ruleForm.username + '&password=' +
                        res.ruleForm.password,
                    method: 'get',
                    data: {
                        'username': res.ruleForm.username,
                        'password': res.ruleForm.password
                    }
                }).then(function(response) {
                    if (response.status <= 200) {
                        //console.log(res)
                        if (response.data.code == 0) {
                            localStorage.setItem('ms_username',res.ruleForm.username);
//                             document.cookie = "jurisdiction=" +JSON.stringify(response.data.info)
//                             document.cookie = "userid="+ response.data.user.id
                            //console.log(response.data)
                            res.$router.push('/index');
                        } else if (response.data.code == 1) {
                            alert("用户不存在")
                        } else {
                            alert("密码错误")
                        }
                    }
                }).catch(function(error) {
                    res.$message.error('系统错误: ' + error);
                    //console.log(error);
                });
         }
        }
        
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
        background-image: url(../../assets/img/login-bg.jpg);
        background-size: 100%;
    }
    .ms-title{
        width:100%;
        line-height: 50px;
        text-align: center;
        font-size:20px;
        color: #fff;
        border-bottom: 1px solid #ddd;
    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:350px;
        margin:-190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255,255,255, 0.3);
        overflow: hidden;
    }
    .ms-content{
        padding: 30px 30px;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
        margin-bottom: 10px;
    }
    .login-tips{
        font-size:12px;
        line-height:30px;
        color:#fff;
    }
</style>