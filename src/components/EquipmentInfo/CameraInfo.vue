<template>
<div>
<el-form :inline="true">
  <el-form-item label="摄像头名称">
    <el-input  placeholder="" v-model="form.cameraName"></el-input>
  </el-form-item>
  <el-form-item label="摄像头类型">
    <el-select v-model="form.cameraTypeTableId" placeholder="" style="width:150px">
      <el-option v-for="item in cameraTypeData" :key="item.id" :label="item.cameraTypeName" :value="item.id"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="IP地址">
    <el-input  placeholder="" v-model="form.ipAddr"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="searchClick">查询</el-button>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="addClick">新增</el-button>
  </el-form-item>
</el-form>
  <el-table :data="tableData" ref="tableData" border style="width: 100%">
    <el-table-column
      prop="id"
      label="编号" width="50px">
    </el-table-column>
    <el-table-column
      prop="unitTableId"
      label="单位" :formatter="formatterUnit">
    </el-table-column>
    <el-table-column
      prop="cameraTypeTableId"
      label="摄像头类型" :formatter="formatterCamera">
    </el-table-column>
    <el-table-column
      prop="ipAddr"
      label="IP地址">
    </el-table-column>
    <el-table-column
      prop="cameraPort"
      label="端口" width="50px">
    </el-table-column>
    <el-table-column
      prop="cameraName"
      label="摄像头名称">
    </el-table-column>
    <el-table-column
      prop="cameraX"
      label="经度">
    </el-table-column>
    <el-table-column
      prop="cameraY"
      label="纬度">
    </el-table-column>
    <el-table-column
      prop="cameraZ" width="80px"
      label="高程">
    </el-table-column>
    <el-table-column
      prop="cameraAddr"
      label="相机地址">
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作">
      <template slot-scope="scope">
        <el-button @click="editClick(scope.row)" type="text" size="small">编辑</el-button>
        <el-button @click="delClick(scope.row)" type="text" size="small">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  </div>
</template>

<script>
let _this
export default {
  mounted: function () {
    _this = this
    _this.getUnitData()
    _this.getCameraTypeData()
    _this.searchClick()
  },
  methods: {
    formatterUnit (row, column, cellValue, index) {
      for (let unit of _this.unitData) {
        if (unit.id === cellValue) {
          return unit.unitName
        }
      }
    },
    formatterCamera (row, column, cellValue, index) {
      for (let camera of _this.cameraTypeData) {
        if (camera.id === cellValue) {
          return camera.cameraTypeName
        }
      }
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
    getCameraTypeData () {
      _this.axios.get('/CameraType/selectall').then((response) => {
        let data = response.data
        if (data.state === '0') {
          _this.cameraTypeData = data.table
          _this.cameraTypeData.unshift({id: null, cameraTypeName: '全部'})
        } else {
          _this.$message.error('获取摄像头类型出错：' + data.msg)
        }
      })
    },
    searchClick () {
      _this.axios.post('/Camera/SelectCondition', _this.form).then((response) => {
        let data = response.data
        if (data.state === '0') {
          _this.tableData = data.table
        } else {
          _this.$message.error('获取数据出错：' + data.msg)
        }
      })
    },
    addClick () {
      _this.$router.push({name: 'CameraEdit'})
    },
    editClick (row) {
      _this.$router.push({name: 'CameraEdit', query: {id: row}})
    },
    delClick (row) {
      _this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.axios.delete('/Camera/del/' + row.id).then((response) => {
          _this.$message.success('删除成功')
          _this.searchClick()
        })
      })
    }
  },
  data () {
    return {
      form: {cameraName: null, ipAddr: null, cameraTypeTableId: null},
      unitData: [],
      cameraTypeData: [],
      queryParams: {},
      tableData: []
    }
  }
}
</script>
