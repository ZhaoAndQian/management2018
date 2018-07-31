<template>
<div style="width: 460px; height: 528px">
<el-form ref="form" :model="form" label-width="80px" :rules="rules">
  <el-form-item label="序列号" prop="serialNum">
    <el-input v-model="form.serialNum" style="width:218px"></el-input>
  </el-form-item>
  <el-form-item label="单位" prop="unitTableId">
    <el-select v-model="form.unitTableId" placeholder="请选择单位">
      <el-option v-for="item in unitData" :key="item.id" :label="item.unitName" :value="item.id"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="类型" prop="aircTypeTableId">
    <el-select v-model="form.aircTypeTableId" placeholder="请选择无人机类型">
      <el-option v-for="item in planeTypeData" :key="item.id" :label="item.aircTypeName" :value="item.id"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="载荷设备" prop="airLoadTableId">
    <el-select v-model="form.airLoadTableId" placeholder="请选择设备">
      <el-option v-for="item in loadData" :key="item.id" :label="item.equipName" :value="item.id"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="产商" prop="airFacTableId">
    <el-select v-model="form.airFacTableId" placeholder="请选择产商">
      <el-option v-for="item in venderData" :key="item.id" :label="item.facName" :value="item.id"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="注册日期">
    <el-date-picker type="date" placeholder="选择日期" v-model="form.regDate"></el-date-picker>
  </el-form-item>
  <el-form-item label="用途">
    <el-input v-model="form.usedDesc"></el-input>
  </el-form-item>
  <el-form-item label="描述">
    <el-input v-model="form.airDesc"></el-input>
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
    _this.getPlaneTypeData()
    _this.getVenderData()
    _this.getLoadData()
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
      venderData: [],
      loadData: [],
      unitData: [],
      planeTypeData: [],
      isAdd: false,
      rules: {
        unitTableId: [{required: true, message: '请选择单位', trigger: 'change'}],
        aircTypeTableId: [{required: true, message: '请选择无人机类型', trigger: 'change'}],
        airLoadTableId: [{required: true, message: '请选择无人机载荷设备', trigger: 'change'}],
        airFacTableId: [{required: true, message: '请选择无人机产商', trigger: 'change'}],
        serialNum: [{required: true, message: '请输入序列号', trigger: 'blur'}]
      },
      unitInfo: [],
      buttonText: '',
      form: {}
    }
  },
  methods: {
    getPlaneTypeData () {
      _this.axios.get('/AircType/selectall').then((response) => {
        let data = response.data
        if (data.state === '0') {
          _this.planeTypeData = data.table
        } else {
          _this.$message.error('获取无人机类型信息出错：' + data.msg)
        }
      })
    },
    getVenderData () {
      _this.axios.get('/AircFac/selectall').then((response) => {
        let data = response.data
        if (data.state === '0') {
          _this.venderData = data.table
        } else {
          _this.$message.error('获取产商信息出错：' + data.msg)
        }
      })
    },
    getLoadData () {
      _this.axios.get('/AirLoad/selectall').then((response) => {
        let data = response.data
        if (data.state === '0') {
          _this.loadData = data.table
        } else {
          _this.$message.error('获取设备信息出错：' + data.msg)
        }
      })
    },
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
    cancle () {
      _this.$router.push({name: 'PlaneInfo'})
    },
    createClick: () => {
      _this.axios.post('/Airc/addone', _this.form).then((response) => {
        let data = response.data
        if (data.state === '0') {
          _this.$message.success('创建无人机信息成功')
        } else {
          _this.$message.error('创建无人机信息失败：' + data.msg)
        }
      })
    },
    updateClick: () => {
      _this.axios.post('/Airc/UpdateList', [_this.form]).then((response) => {
        let data = response.data
        if (data.state === '0') {
          _this.$message.success('修改无人机信息成功')
        } else {
          _this.$message.error('修改无人机信息失败：' + data.msg)
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
