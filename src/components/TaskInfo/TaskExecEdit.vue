<template>
<div style="width: 460px; height: 528px">
<el-form ref="form" :model="form" label-width="80px" :rules="rules">
  <el-form-item label="任务" prop="taskTableId">
    <el-select v-model="form.taskTableId" placeholder="请选择任务">
      <el-option v-for="item in taskData" :key="item.id" :label="item.taskName" :value="item.id"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="执行人" prop="userTableId">
    <el-select v-model="form.userTableId" placeholder="请选择执行人">
      <el-option v-for="item in userData" :key="item.id" :label="item.realName" :value="item.id"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="无人机">
    <el-select v-model="form.aircTableId" placeholder="请选择无人机">
      <el-option v-for="item in aircData" :key="item.id" :label="item.serialNum" :value="item.id"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="开始时间" prop="startTime">
    <el-date-picker
      v-model="form.startTime"
      type="datetime"
      placeholder="请选择开始时间">
    </el-date-picker>
  </el-form-item>
  <el-form-item label="结束时间" prop="endTime">
    <el-date-picker
      v-model="form.endTime"
      type="datetime"
      placeholder="选择结束时间">
    </el-date-picker>
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
    _this.getTaskInfo()
    _this.getUserData()
    _this.getAircData()
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
        taskTableId: [{required: true, message: '请选择所属任务', trigger: 'change'}],
        aircTableId: [{required: true, message: '请选择无人机', trigger: 'change'}],
        startTime: [{required: true, message: '请选择开始时间', trigger: 'change'}],
        userTableId: [{required: true, message: '请选择执行人', trigger: 'change'}],
        endTime: [{required: true, message: '请选择结束时间', trigger: 'change'}]
      },
      taskData: [],
      userData: [],
      aircData: [],
      buttonText: '',
      form: {}
    }
  },
  methods: {
    getTaskInfo () {
      _this.axios.get('/Task/selectall').then((response) => {
        let data = response.data
        if (data.state === '0') {
          _this.taskData = data.table
        } else {
          _this.$message.error('获取任务列表出错：' + data.msg)
        }
      })
    },
    getUserData () {
      _this.axios.get('/user/selectall').then((response) => {
        let data = response.data
        if (data.state === '0') {
          _this.userData = data.table
        } else {
          _this.$message.error('获取用户信息出错：' + data.msg)
        }
      })
    },
    getAircData () {
      _this.axios.get('/Airc/selectall').then((response) => {
        let data = response.data
        if (data.state === '0') {
          _this.aircData = data.table
        } else {
          _this.$message.error('获取无人机信息出错：' + data.msg)
        }
      })
    },
    cancle () {
      _this.$router.push({name: 'TaskExecute'})
    },
    createClick: () => {
      _this.axios.post('/ExecTask/addone', _this.form).then((response) => {
        let data = response.data
        if (data.state === '0') {
          _this.$message.success('创建成功')
        } else {
          _this.$message.error('创建失败：' + data.msg)
        }
      })
    },
    updateClick: () => {
      _this.axios.post('/ExecTask/UpdateList', [_this.form]).then((response) => {
        let data = response.data
        if (data.state === '0') {
          _this.$message.success('修改成功')
        } else {
          _this.$message.error('修改失败：' + data.msg)
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
