<template>
<div style="width: 460px; height: 528px">
<el-form ref="form" :model="form" label-width="80px" :rules="rules">
  <el-form-item label="任务名称" prop="taskName">
    <el-input v-model="form.taskName" style="width:218px"></el-input>
  </el-form-item>
  <el-form-item label="任务类型" prop="taskTypeTableId">
    <el-select v-model="form.taskTypeTableId" placeholder="请选择任务类型">
      <el-option v-for="item in taskTypeData" :key="item.id" :label="item.taskTypeName" :value="item.id"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="发布时间" prop="pubTime">
    <el-date-picker
      v-model="form.pubTime"
      type="datetime"
      placeholder="选发布时间">
    </el-date-picker>
  </el-form-item>
  <el-form-item label="截止时间" prop="endTime">
    <el-date-picker
      v-model="form.endTime"
      type="datetime"
      placeholder="选择截止时间">
    </el-date-picker>
  </el-form-item>
  <el-form-item label="任务描述">
    <el-input type="textarea"  v-model="form.taskDesc"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="onSubmit">{{buttonText}}</el-button>
    <el-button @click="cancle">返 回</el-button>
  </el-form-item>
</el-form>
</div>
</template>
<script>
import {getCookie, userInfoId} from '../../../static/js/common.js'
let _this
export default {
  mounted: function () {
    let _id = this.$route.query.id
    _this = this
    _this.getTaskTypeData()
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
        taskTypeTableId: [{required: true, message: '请选择任务类型', trigger: 'change'}],
        pubTime: [{required: true, message: '请选择发布时间', trigger: 'change'}],
        taskName: [{required: true, message: '请输入任务名称', trigger: 'blur'}],
        userTableId: [{required: true, message: '请输入发布人', trigger: 'blur'}],
        endTime: [{required: true, message: '请选择截止时间', trigger: 'change'}]
      },
      taskTypeData: [],
      // taskStateData: [],
      buttonText: '',
      form: {}
    }
  },
  methods: {
    getTaskTypeData () {
      _this.axios.get('/TaskType/selectall').then((response) => {
        let data = response.data
        if (data.state === '0') {
          _this.taskTypeData = data.table
        } else {
          _this.$message.error('获取任务类型出错：' + data.msg)
        }
      })
    },
    cancle () {
      _this.$router.push({name: 'TaskInfo'})
    },
    createClick: () => {
      _this.form.userTableId = getCookie(userInfoId)
      _this.axios.post('/Task/addone', _this.form).then((response) => {
        let data = response.data
        if (data.state === '0') {
          _this.$message.success('创建任务成功')
        } else {
          _this.$message.error('创建任务失败：' + data.msg)
        }
      })
    },
    updateClick: () => {
      _this.form.userTableId = getCookie(userInfoId)
      _this.axios.post('/Task/UpdateList', [_this.form]).then((response) => {
        let data = response.data
        if (data.state === '0') {
          _this.$message.success('修改任务信息成功')
        } else {
          _this.$message.error('修改任务信息失败：' + data.msg)
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
