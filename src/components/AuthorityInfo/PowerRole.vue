<template>
<div>
<el-form :inline="true">
  <el-form-item>
    <el-button type="primary" @click="saveClick">保 存</el-button>
  </el-form-item>
</el-form>
<el-row>
  <el-col :span="11">
    <el-table
        :data="roleData"
        border highlight-current-row @current-change="rowClick"
        style="width: 100%">
        <el-table-column
        prop="roleName"
        label="角色名">
        </el-table-column>
    </el-table>
  </el-col>
  <el-col :span="1">
   <br>
  </el-col>
  <el-col :span="12">
    <el-transfer v-model="checkData" :data="powerData" :titles="['可选功能菜单', '已选功能菜单']"></el-transfer>
  </el-col>
</el-row>
</div>
</template>
<script>
let _this
let _currentRow
export default {
  mounted: function () {
    _this = this
    _this.getPower()
  },
  methods: {
    saveClick () {
      let rolePowers = []
      _this.checkData.forEach(item => {
        let obj = {}
        obj.roleTableId = _currentRow.id
        obj.permissonTableId = item
        rolePowers.push(obj)
      })
      _this.axios.post('/RolePermisson/AddList', rolePowers).then((response) => {
        let data = response.data
        if (data.state === '0') {
          _this.$message.success('保存成功')
        } else {
          _this.$message.error('保存失败：' + data.msg)
        }
      })
    },
    getPower () {
      _this.axios.get('/Permisson/selectall').then((response) => {
        let data = response.data
        if (data.state === '0') {
          data.table.forEach(item => {
            if (item.pId !== 0) {
              let obj = {key: item.id, label: item.permissonName, disable: false}
              _this.powerData.push(obj)
            }
          })
          _this.axios.get('/Role/selectall').then((response) => {
            let data = response.data
            if (data.state === '0') {
              _this.roleData = data.table
              if (_this.powerData.length > 0) {
                _this.rowClick(_this.roleData[0])
              }
            } else {
              _this.$message.error('获取角色信息出错：' + data.msg)
            }
          })
        } else {
          _this.$message.error('获取菜单信息出错：' + data.msg)
        }
      })
    },
    rowClick: (row) => {
      _currentRow = row
      _this.axios.post('/RolePermisson/SelectCondition', { roleTableId: row.id }).then((response) => {
        let data = response.data
        if (data.state === '0') {
          _this.checkData = []
          data.table.forEach(item => {
            _this.checkData.push(item.permissonTableId)
          })
        } else {
          _this.$message.error('获取角色下菜单信息出错：' + data.msg)
        }
      })
    }
  },
  data () {
    return {
      roleData: [],
      powerData: [],
      form: {},
      checkData: []
    }
  }
}
</script>
