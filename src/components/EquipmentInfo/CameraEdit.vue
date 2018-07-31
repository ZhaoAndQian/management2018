<template>
<div style="width: 460px; height: 528px">
<el-form ref="form" :model="form" label-width="80px" :rules="rules">
  <el-form-item label="类型" prop="cameraTypeTableId">
    <el-select v-model="form.cameraTypeTableId" placeholder="请选择摄像头类型">
      <el-option v-for="item in cameraTypeData" :key="item.id" :label="item.cameraTypeName" :value="item.id"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="单位" prop="unitTableId">
    <el-select v-model="form.unitTableId" placeholder="请选择单位">
      <el-option v-for="item in unitData" :key="item.id" :label="item.unitName" :value="item.id"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="名称" prop="cameraName">
    <el-input v-model="form.cameraName"></el-input>
  </el-form-item>
  <el-form-item label="IP地址" prop="ipAddr">
    <el-input v-model="form.ipAddr"></el-input>
  </el-form-item>
  <el-form-item label="端口" prop="cameraPort">
    <el-input type="number" v-model="form.cameraPort"></el-input>
  </el-form-item>
  <el-form-item label="经度">
    <el-input type="number" v-model="form.cameraX"></el-input>
  </el-form-item>
  <el-form-item label="纬度">
    <el-input type="number"  v-model="form.cameraY"></el-input>
  </el-form-item>
  <el-form-item label="高程">
    <el-input type="number"  v-model="form.cameraZ"></el-input>
  </el-form-item>
  <el-form-item label="地址">
    <el-input v-model="form.cameraAddr"></el-input>
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
    _this.getUnitData()
    _this.getCameraTypeData()
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
        cameraTypeTableId: [{required: true, message: '请选择摄像头类型', trigger: 'change'}],
        cameraName: [{required: true, message: '请输入摄像头名称', trigger: 'blur'}],
        cameraPort: [{required: true, message: '请输入端口号', trigger: 'blur'}],
        ipAddr: [{required: true, message: '请输入ip地址', trigger: 'blur'}]
      },
      cameraTypeData: [],
      unitData: [],
      buttonText: '',
      form: {}
    }
  },
  methods: {
    getUnitData () {
      _this.axios.get('/Unit/selectall').then((response) => {
        let data = response.data
        if (data.state === '0') {
          _this.unitData = data.table
        } else {
          _this.$message.error('获取单位信息出错：' + data.msg)
        }
      })
    },
    getCameraTypeData () {
      _this.axios.get('/CameraType/selectall').then((response) => {
        let data = response.data
        if (data.state === '0') {
          _this.cameraTypeData = data.table
        } else {
          _this.$message.error('获取摄像头类型出错：' + data.msg)
        }
      })
    },
    cancle () {
      _this.$router.push({name: 'CameraInfo'})
    },
    createClick: () => {
      _this.axios.post('/Camera/addone', _this.form).then((response) => {
        let data = response.data
        if (data.state === '0') {
          _this.$message.success('创建摄像头成功')
        } else {
          _this.$message.error('创建摄像头失败：' + data.msg)
        }
      })
    },
    updateClick: () => {
      _this.axios.post('/Camera/UpdateList', [_this.form]).then((response) => {
        let data = response.data
        if (data.state === '0') {
          _this.$message.success('修改摄像头信息成功')
        } else {
          _this.$message.error('修改摄像头信息失败：' + data.msg)
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
