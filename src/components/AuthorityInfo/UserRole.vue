<template>
<div>
<el-form :inline="true">
  <el-form-item>
    <el-button type="primary" @click="saveClick">保 存</el-button>
  </el-form-item>
</el-form>
<el-row>
  <el-col :span="11">
    <el-table ref="roleTable"
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
    <el-transfer v-model="checkData" :data="userData" :titles="['可选用户', '已选用户']"></el-transfer>
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
    _this.getUsers()
  },
  methods: {
    saveClick () {
      let userRoles = []
      _this.checkData.forEach(item => {
        let obj = {}
        obj.roleTableId = _currentRow.id
        obj.userTableId = item
        userRoles.push(obj)
      })
      _this.axios.post('/UserRole/AddList', userRoles).then((response) => {
        let data = response.data
        if (data.state === '0') {
          _this.$message.success('保存成功')
        } else {
          _this.$message.error('保存失败：' + data.msg)
        }
      })
    },
    getUsers () {
      _this.axios.get('/user/selectall').then((response) => {
        let data = response.data
        if (data.state === '0') {
          data.table.forEach(item => {
            let obj = {key: item.id, label: item.loginName, disable: false}
            _this.userData.push(obj)
          })
          _this.axios.get('/Role/selectall').then((response) => {
            let data = response.data
            if (data.state === '0') {
              _this.roleData = data.table
              if (_this.userData.length > 0) {
                _this.rowClick(_this.roleData[0])
              }
            } else {
              _this.$message.error('获取角色信息出错：' + data.msg)
            }
          })
        } else {
          _this.$message.error('获取用户信息出错：' + data.msg)
        }
      })
    },
    rowClick: (row) => {
      _currentRow = row
      _this.axios.post('/UserRole/SelectCondition', { roleTableId: row.id }).then((response) => {
        let data = response.data
        if (data.state === '0') {
          _this.checkData = []
          data.table.forEach(item => {
            _this.checkData.push(item.userTableId)
          })
        } else {
          _this.$message.error('获取角色下用户信息出错：' + data.msg)
        }
      })
    }
  },
  data () {
    return {
      roleData: [],
      userData: [],
      form: {},
      checkData: []
    }
  }
}
</script>
