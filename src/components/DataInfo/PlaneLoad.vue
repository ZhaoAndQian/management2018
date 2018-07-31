<template>
<div>
  <el-row :gutter="20">
  <el-col :span="14">
    <el-table
        :data="tableData"
        border highlight-current-row @current-change="rowClick"
        style="width: 100%">
        <el-table-column
        prop="equipName"
        label="名称"
        width="180">
        </el-table-column>
        <el-table-column
        prop="equipFacTableId"
        label="产商" :formatter="venderFormatter"
        width="180">
        </el-table-column>
        <el-table-column
        prop="equipDesc"
        label="描述">
        </el-table-column>
    </el-table>
  </el-col>
  <el-col :span="10">
    <el-form ref="form" :model="form" label-width="90px" :rules="rules">
    <el-form-item label="名称" prop="equipName">
        <el-input v-model="form.equipName"></el-input>
    </el-form-item>
    <el-form-item label="产商" prop="equipFacTableId">
        <el-select v-model="form.equipFacTableId" placeholder="请选择产商">
        <el-option v-for="item in loadVenderData" :label="item.equipFacName" :value="item.id" :key="item.id"></el-option>
        </el-select>
    </el-form-item>
    <el-form-item label="描述">
        <el-input type="textarea" v-model="form.equipDesc"></el-input>
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
    _this.getPlaneVender()
    _this.searchClick()
  },
  methods: {
    venderFormatter: (row, column, cellValue, index) => {
      for (let vender of _this.loadVenderData) {
        if (vender.id === cellValue) {
          return vender.equipFacName
        }
      }
    },
    getPlaneVender () {
      _this.axios.get('/EquipFac/selectall').then((response) => {
        let data = response.data
        if (data.state === '0') {
          _this.loadVenderData = data.table
        } else {
          _this.$message.error('获取载荷产商信息出错：' + data.msg)
        }
      })
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
    searchClick: () => {
      _this.axios.get('/AirLoad/selectall').then((response) => {
        let data = response.data
        if (data.state === '0') {
          _this.tableData = data.table
        } else {
          _this.$message.error('获取无人机载荷信息出错：' + data.msg)
        }
      })
      _this.$refs['form'].resetFields()
    },
    rowClick: (row) => {
      Object.assign(_this.form, row)
    },
    createClick: () => {
      _this.form.id = 0
      _this.axios.post('/AirLoad/addone', _this.form).then((response) => {
        if (response.data.state === '0') {
          _this.$message.success('新增成功')
        } else {
          _this.$message.error('新增失败：' + response.msg)
        }
        _this.searchClick()
      })
    },
    updateClick: () => {
      _this.axios.post('/AirLoad/UpdateList', [_this.form]).then((response) => {
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
        _this.axios.delete('/AirLoad/del/' + _this.form.id).then((response) => {
          _this.$message.success('删除成功')
          _this.searchClick()
        })
      })
    }
  },
  data () {
    return {
      rules: {
        equipName: [{required: true, message: '请输入无人机载荷名称', trigger: 'blur'}],
        equipFacTableId: [{required: true, message: '请选择载荷产商', trigger: 'change'}]
      },
      loadVenderData: [],
      tableData: [
      ],
      form: {
        id: null,
        equipName: null,
        equipFacTableId: null,
        equipDesc: null
      }
    }
  }
}
</script>
<style>

</style>
