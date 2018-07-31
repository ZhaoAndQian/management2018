<template>
<div class="login_box" id="loginBox">
      <div class="login_l_img"><img src="../../static/images/login-img.png"></div>
      <div class="login">
          <div class="login_logo"><img src="../../static/images/login_logo.png"></div>
          <br>
          <br>
          <div style="margin-left: 0px">
            <el-form :model="ruleForm2" status-icon ref="ruleForm2" :rules="rules" label-width="80px" style="margin-left: 0px">
            <el-form-item label="账号" prop="userName">
                <el-input type="text" v-model="ruleForm2.userName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="ruleForm2.password" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm2')" id="login">登录</el-button>
                <el-button @click="resetForm('ruleForm2')">重置</el-button>
            </el-form-item>
            </el-form>
          </div>
      </div>
      <!-- <div class="copyright">某某有限公司 版权所有©2018-2020 技术支持电话：000-00000000</div> -->
</div>
</template>
<script>
import { setCookie, cookieTime, userInfoId, userInfoName, cookieAuth } from '../../static/js/common.js'
let _this
export default {
  mounted: function () {
    _this = this
    document.getElementById('loginBox').onkeydown = function (event) {
      var code = event.keyCode
      if (code === 13) {
        // 这是键盘的enter监听事件
        // 绑定焦点有可能不成功需要多试试一些标签
        document.getElementById('login').focus()
      }
    }
  },
  name: 'Login',
  data () {
    return {
      rules: {
        userName: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入登录密码', trigger: 'blur' }]
      },
      ruleForm2: {
        userName: '',
        password: ''
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.axios.post('/Authorize', _this.ruleForm2).then(function (response) {
            if (response.data.state === '-1') {
              _this.$message.error(response.data.msg)
            } else {
              // 保存用户 id
              setCookie(userInfoId, response.data.user.id, cookieTime, '/')
              // 保存用户姓名到 cookie
              setCookie(userInfoName, response.data.user.viewName, cookieTime, '/')
              setCookie(cookieAuth, 'bearer ' + response.data.token, cookieTime, '/')
              _this.$router.push({name: 'Main', query: {id: {viewName: response.data.user.viewName}}})
            }
          })
        } else {
          return false
        }
      })
    },
    resetForm (formName) {
      _this.ruleForm2.password = ''
      _this.ruleForm2.userName = ''
      _this.$refs[formName].resetFields()
    }
  }
}
</script>
<style>
</style>
