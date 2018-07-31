<template>
<div>
<el-form :inline="true">
  <el-form-item label="序列号">
    <el-input  placeholder="" v-model="form.serialNum"></el-input>
  </el-form-item>
  <el-form-item label="产商">
    <el-select v-model="form.airFacTableId" placeholder="">
      <el-option v-for="item in venderData" :key="item.id" :label="item.facName" :value="item.id"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="类型">
    <el-select v-model="form.aircTypeTableId" placeholder="">
      <el-option v-for="item in planeTypeData" :key="item.id" :label="item.aircTypeName" :value="item.id"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="searchClick">查询</el-button>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="addClick">新增</el-button>
  </el-form-item>
</el-form>
  <el-table
    :data="tableData"
    border
    style="width: 100%">
    <el-table-column
      prop="id"
      label="编号" width="50px">
    </el-table-column>
    <el-table-column
      prop="serialNum"
      label="序列号">
    </el-table-column>
    <el-table-column
      prop="unitTableId"
      label="单位" :formatter="formatterUnit">
    </el-table-column>
    <el-table-column
      prop="aircTypeTableId"
      label="类型" :formatter="formatterType">
    </el-table-column>
    <el-table-column
      prop="airLoadTableId"
      label="载荷设备" :formatter="formatterLoad">
    </el-table-column>
    <el-table-column
      prop="airFacTableId"
      label="产商" :formatter="formatterVender">
    </el-table-column>
    <el-table-column
      prop="usedDesc"
      label="用途">
    </el-table-column>
    <el-table-column
      prop="airDesc"
      label="描述">
    </el-table-column>
    <el-table-column
      prop="regDate"
      label="注册日期">
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
    _this.getPlaneTypeData()
    _this.getVenderData()
    _this.getLoadData()
    _this.searchClick()
  },
  methods: {
    formatterType (row, column, cellValue, index) {
      for (let planeType of _this.planeTypeData) {
        if (planeType.id === cellValue) {
          return planeType.aircTypeName
        }
      }
    },
    formatterVender (row, column, cellValue, index) {
      for (let vender of _this.venderData) {
        if (vender.id === cellValue) {
          return vender.facName
        }
      }
    },
    formatterLoad (row, column, cellValue, index) {
      for (let load of _this.loadData) {
        if (load.id === cellValue) {
          return load.equipName
        }
      }
    },
    formatterUnit (row, column, cellValue, index) {
      for (let unit of _this.unitData) {
        if (unit.id === cellValue) {
          return unit.unitName
        }
      }
    },
    getPlaneTypeData () {
      _this.axios.get('/AircType/selectall').then((response) => {
        let data = response.data
        if (data.state === '0') {
          _this.planeTypeData = data.table
          _this.planeTypeData.unshift({aircTypeName: '全部', id: null})
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
          _this.venderData.unshift({id: null, facName: '全部'})
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
    searchClick () {
      _this.axios.post('/Airc/selectCondition', _this.form).then((response) => {
        let data = response.data
        if (data.state === '0') {
          _this.tableData = data.table
        } else {
          _this.$message.error('获取数据出错：' + data.msg)
        }
      })
    },
    addClick () {
      _this.$router.push({name: 'PlaneEdit'})
    },
    editClick (row) {
      _this.$router.push({name: 'PlaneEdit', query: {id: row}})
    },
    delClick (row) {
      _this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.axios.delete('/Airc/del/' + row.id).then((response) => {
          _this.$message.success('删除成功')
          _this.searchClick()
        })
      })
    }
  },
  data () {
    return {
      form: {serialNum: null, airFacTableId: null, aircTypeTableId: null},
      venderData: [],
      loadData: [],
      unitData: [],
      planeTypeData: [],
      tableData: []
    }
  }
}
</script>
