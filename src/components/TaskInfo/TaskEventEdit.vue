<template>
<div style="width: 460px; height: 528px">
<el-form ref="form" :model="form" label-width="80px" :rules="rules">
  <el-form-item label="执行编号" prop="execTaskTableId">
    <el-select v-model="form.execTaskTableId" placeholder="请选择执行任务编号">
      <el-option v-for="item in executeData" :key="item.id" :label="item.id" :value="item.id"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="事件类型" prop="eventTypeTableId">
    <el-select v-model="form.eventTypeTableId" placeholder="请选择事件类型">
      <el-option v-for="item in eventTypeData" :key="item.id" :label="item.eventName" :value="item.id"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="发生时间" prop="eventTime">
    <el-date-picker
      v-model="form.eventTime"
      type="datetime"
      placeholder="请选择发生时间">
    </el-date-picker>
  </el-form-item>
  <el-form-item label="经度" prop="posX">
    <el-input v-model="form.posX"></el-input>
  </el-form-item>
    <el-form-item label="纬度" prop="posY">
    <el-input v-model="form.posY"></el-input>
  </el-form-item>
    <el-form-item label="高程" prop="posZ">
    <el-input v-model="form.posZ"></el-input>
  </el-form-item>
  <el-form-item label="描述">
    <el-input type="textarea" v-model="form.eventDesc"></el-input>
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
    _this.getExecuteData()
    _this.getEventTypeData()
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
        execTaskTableId: [{required: true, message: '请选择执行任务编号', trigger: 'change'}],
        eventTypeTableId: [{required: true, message: '请选择事件类型', trigger: 'change'}],
        eventTime: [{required: true, message: '请选择发生时间', trigger: 'change'}],
        posX: [{required: true, message: '请输入经度', trigger: 'blur'}],
        posY: [{required: true, message: '请输入纬度', trigger: 'blur'}],
        posZ: [{required: true, message: '请输入高程', trigger: 'blur'}]
      },
      executeData: [],
      eventTypeData: [],
      buttonText: '',
      form: {}
    }
  },
  methods: {
    getExecuteData () {
      _this.axios.get('/ExecTask/selectall').then((response) => {
        let data = response.data
        if (data.state === '0') {
          _this.executeData = data.table
        } else {
          _this.$message.error('获取任务安排信息出错：' + data.msg)
        }
      })
    },
    getEventTypeData () {
      _this.axios.get('/EventType/selectall').then((response) => {
        let data = response.data
        if (data.state === '0') {
          _this.eventTypeData = data.table
        } else {
          _this.$message.error('获取事件类型出错：' + data.msg)
        }
      })
    },
    cancle () {
      _this.$router.push({name: 'TaskEvent'})
    },
    createClick: () => {
      _this.axios.post('/Event/addone', _this.form).then((response) => {
        let data = response.data
        if (data.state === '0') {
          _this.$message.success('创建成功')
        } else {
          _this.$message.error('创建失败：' + data.msg)
        }
      })
    },
    updateClick: () => {
      _this.axios.post('/Event/UpdateList', [_this.form]).then((response) => {
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
