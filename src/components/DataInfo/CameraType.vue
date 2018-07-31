<template>
<div>
  <el-row :gutter="20">
  <el-col :span="14">
    <el-table
        :data="tableData"
        border highlight-current-row @current-change="rowClick"
        style="width: 100%">
        <el-table-column
        prop="cameraTypeName"
        label="名称">
        </el-table-column>
        <el-table-column
        prop="cameraFacTableId"
        label="产商" :formatter="venderFormatter"
        >
        </el-table-column>
    </el-table>
  </el-col>
  <el-col :span="10">
    <el-form ref="form" :model="form" label-width="90px" :rules="rules">
    <el-form-item label="名称" prop="cameraTypeName">
        <el-input v-model="form.cameraTypeName"></el-input>
    </el-form-item>
    <el-form-item label="产商" prop="cameraFacTableId">
        <el-select v-model="form.cameraFacTableId" placeholder="请选择摄像头产商">
        <el-option v-for="item in cameraVenderData" :label="item.cameraFacName" :value="item.id" :key="item.id"></el-option>
        </el-select>
    </el-form-item>
    <el-form-item>
        <el-button type="primary" @click="modifyClick(true)">创建</el-button>
        <el-button type="primary" @click="modifyClick(false)">修改</el-button>
        <el-button type="primary" @click="delClick">删除</el-button>
    </el-form-item>
    </el-form>
  </el-col>
  </el-row>
</div>
</template>
<script>
let _this
export default {
  mounted: function () {
    _this = this
    _this.getCameraVender()
    _this.searchClick()
  },
  methods: {
    venderFormatter: (row, column, cellValue, index) => {
      for (let vender of _this.cameraVenderData) {
        if (vender.id === cellValue) {
          return vender.cameraFacName
        }
      }
    },
    getCameraVender: () => {
      _this.axios.get('/CameraFac/selectall').then((response) => {
        let data = response.data
        if (data.state === '0') {
          _this.cameraVenderData = data.table
        } else {
          _this.$message.error('获取摄像头产商出错：' + data.msg)
        }
      })
    },
    searchClick: () => {
      _this.axios.get('/CameraType/selectall').then((response) => {
        let data = response.data
        if (data.state === '0') {
          _this.tableData = data.table
        } else {
          _this.$message.error('获取摄像头类型信息出错：' + data.msg)
        }
      })
      _this.$refs['form'].resetFields()
    },
    rowClick: (row) => {
      Object.assign(_this.form, row)
    },
    modifyClick: (flag) => {
      _this.$refs['form'].validate((valid) => {
        if (valid) {
          if (flag) {
            _this.createClick()
          } else {
            _this.updateClick()
          }
        }
      })
    },
    createClick: () => {
      _this.form.id = 0
      _this.axios.post('/CameraType/addone', _this.form).then((response) => {
        if (response.data.state === '0') {
          _this.$message.success('新增成功')
        } else {
          _this.$message.error('新增失败：' + response.msg)
        }
        _this.searchClick()
      })
    },
    updateClick: () => {
      _this.axios.post('/CameraType/UpdateList', [_this.form]).then((response) => {
        if (response.data.state === '0') {
          _this.$message.success('修改成功')
        } else {
          _this.$message.error('修改失败：' + response.msg)
        }
        _this.searchClick()
      })
    },
    delClick: () => {
      _this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.axios.delete('/CameraType/del/' + _this.form.id).then((response) => {
          _this.$message({
            message: '删除成功',
            type: 'success'
          })
          _this.searchClick()
        })
      })
    }
  },
  data () {
    return {
      rules: {
        cameraTypeName: [
          { required: true, message: '请输入摄像头类型', trigger: 'blur' }
        ],
        cameraFacTableId: [
          { required: true, message: '请选择摄像头产商', trigger: 'change' }
        ]
      },
      cameraVenderData: [],
      tableData: [
      ],
      form: {
        id: '',
        cameraTypeName: '',
        cameraFacTableId: ''
      }
    }
  }
}
</script>
<style>

</style>
