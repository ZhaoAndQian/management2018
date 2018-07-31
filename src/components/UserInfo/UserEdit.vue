<template>
<div style="width: 460px; height: 528px">
<el-form ref="form" :model="form" label-width="80px" :rules="rules">
  <el-form-item label="账号" prop="loginName">
    <el-input v-model="form.loginName"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="loginPwd">
    <el-input type="password" v-model="form.loginPwd"></el-input>
  </el-form-item>
  <el-form-item label="姓名" prop="realName">
    <el-input v-model="form.realName"></el-input>
  </el-form-item>
  <el-form-item label="昵称" prop="viewName">
    <el-input v-model="form.viewName"></el-input>
  </el-form-item>
  <el-form-item label="性别" prop="gender">
    <el-radio-group v-model="form.gender">
      <el-radio label="男"></el-radio>
      <el-radio label="女"></el-radio>
    </el-radio-group>
  </el-form-item>
  <el-form-item label="生日">
    <el-date-picker type="date" placeholder="选择日期" v-model="form.birthday"></el-date-picker>
  </el-form-item>
  <el-form-item label="电话">
    <el-input type="tel" v-model="form.telephone"></el-input>
  </el-form-item>
  <el-form-item label="邮箱">
    <el-input v-model="form.email"></el-input>
  </el-form-item>
  <el-form-item label="单位" prop="unitTableId">
    <el-select v-model="form.unitTableId" placeholder="请选择单位">
      <el-option v-for="item in unitInfo" :key="item.id" :label="item.unitName" :value="item.id"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="onSubmit">{{buttonText}}</el-button>
    <el-button @click="cancle">返 回</el-button>
  </el-form-item>
</el-form>
</div>
</template>
<script>
let _this
export default {
  mounted: function () {
    let _id = this.$route.query.id
    _this = this
    _this.axios.get('/Unit/selectall').then((response) => {
      let data = response.data
      if (data.state === '0') {
        _this.unitInfo = data.table
      } else {
        _this.$message.error('获取单位信息出错：' + data.msg)
      }
    })
    if (_id === undefined) {
      _this.isAdd = true
      _this.buttonText = '创 建'
    } else {
      _this.form = _id
      _this.buttonText = '修 改'
    }
  },
  data () {
    return {
      isAdd: false,
      rules: {
        unitTableId: [{required: true, message: '请选择单位', trigger: 'change'}],
        gender: [{required: true, message: '请选择性别', trigger: 'change'}],
        realName: [{required: true, message: '请输入姓名', trigger: 'blur'}],
        loginPwd: [{required: true, message: '请输入密码', trigger: 'blur'}],
        loginName: [{required: true, message: '请输入账号', trigger: 'blur'}],
        viewName: [{required: true, message: '请输入昵称', trigger: 'blur'}]
      },
      unitInfo: [],
      buttonText: '',
      form: {}
    }
  },
  methods: {
    cancle () {
      _this.$router.push({name: 'UserInfo'})
    },
    createClick: () => {
      _this.axios.post('/user/addone', _this.form).then((response) => {
        let data = response.data
        if (data.state === '0') {
          _this.$message.success('创建用户成功')
        } else {
          _this.$message.error('创建用户信息失败：' + data.msg)
        }
      })
    },
    updateClick: () => {
      _this.axios.post('/user/UpdateList', [_this.form]).then((response) => {
        let data = response.data
        if (data.state === '0') {
          _this.$message.success('修改用户信息成功')
        } else {
          _this.$message.error('修改用户信息失败：' + data.msg)
        }
      })
    },
    onSubmit () {
      _this.$refs['form'].validate((valid) => {
        if (valid) {
          if (_this.isAdd) {
            _this.createClick()
          } else {
            _this.updateClick()
          }
        }
      })
    }
  }
}
</script>
