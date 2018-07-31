<template>
<el-form :model="form" status-icon :rules="rules" ref="ruleForm2" style="width:400px" label-width="100px" class="demo-ruleForm">
  <el-form-item label="原密码" prop="pwd">
    <el-input type="password" v-model="form.pwd" auto-complete="off"></el-input>
  </el-form-item>
  <el-form-item label="新密码" prop="newpwd">
    <el-input type="password" v-model="form.newpwd" auto-complete="off"></el-input>
  </el-form-item>
  <el-form-item label="确认密码" prop="surePwd">
    <el-input type="password" v-model="form.surePwd" auto-complete="off"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="onSubmit">提交</el-button>
    <el-button @click="resetForm">重置</el-button>
  </el-form-item>
</el-form>
</template>
<script>
let _this
export default {
  mounted: function () {
    // let _id = this.$route.query.id
    _this = this
  },
  data () {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (_this.form.surePwd !== '') {
          _this.$refs.ruleForm2.validateField('surePwd')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== _this.form.newpwd) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    return {
      rules: {
        pwd: [{required: true, message: '请输入原密码', trigger: 'blur'}],
        newpwd: [{validator: validatePass, trigger: 'blur'}],
        surePwd: [{validator: validatePass2, trigger: 'blur'}]
      },
      form: {newpwd: '', pwd: '', surePwd: ''}
    }
  },
  methods: {
    resetForm () {
      _this.form.newpwd = ''
      _this.form.pwd = ''
      _this.form.surePwd = ''
      _this.$refs['ruleForm2'].resetFields()
    },
    updateClick: () => {
      let objKey = 'id=' + 14 + '&pwd=' + _this.form.pwd + '&newpwd=' + _this.form.newpwd
      _this.axios.put('/user/changpwd?' + objKey).then((response) => {
        let data = response.data
        if (data.state === '0') {
          _this.$message.success('修改密码成功，请重新登录')
          _this.$router.push({name: 'Login'})
        } else {
          _this.$message.error('修改密码失败：' + data.msg)
        }
      })
    },
    onSubmit () {
      _this.$refs['ruleForm2'].validate((valid) => {
        if (valid) {
          _this.updateClick()
        }
      })
    }
  }
}
</script>
