<template>
<div>
<el-form :inline="true">
  <el-form-item label="账号">
    <el-input  placeholder="" v-model="form.loginName"></el-input>
  </el-form-item>
  <el-form-item label="姓名">
    <el-input  placeholder="" v-model="form.realName"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="searchClick">查询</el-button>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="addClick">新增</el-button>
  </el-form-item>
</el-form>
  <el-table :data="userData" ref="userData" border style="width: 100%">
    <el-table-column
      prop="id"
      label="编号"
      width="50px">
    </el-table-column>
    <el-table-column
      prop="unitTableId"
      label="单位" :formatter="formatterUnit">
    </el-table-column>
    <el-table-column
      prop="loginName"
      label="账号">
    </el-table-column>
    <el-table-column
      prop="realName"
      label="姓名">
    </el-table-column>
    <el-table-column
      prop="gender"
      label="性别">
    </el-table-column>
    <el-table-column
      prop="birthday"
      label="生日">
    </el-table-column>
    <el-table-column
      prop="telephone"
      label="电话">
    </el-table-column>
    <el-table-column
      prop="email"
      label="邮箱">
    </el-table-column>
    <el-table-column
      prop="viewName"
      label="昵称">
    </el-table-column>
    <el-table-column
      prop="regTime"
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
    _this.searchClick()
    _this.getUnit()
  },
  methods: {
    formatterUnit (row, column, cellValue, index) {
      for (let unit of _this.unitInfo) {
        if (unit.id === cellValue) {
          return unit.unitName
        }
      }
    },
    getUnit () {
      _this.axios.get('/Unit/selectall').then((response) => {
        let data = response.data
        if (data.state === '0') {
          _this.unitInfo = data.table
        } else {
          _this.$message.error('获取单位信息出错：' + data.msg)
        }
      })
    },
    searchClick () {
      _this.axios.post('/user/SelectCondition', _this.form).then((response) => {
        let userInfo = response.data
        if (userInfo.state === '0') {
          _this.userData = userInfo.table
        } else {
          _this.$message.error('获取数据出错：' + userInfo.msg)
        }
      })
    },
    addClick () {
      _this.$router.push({name: 'UserEdit'})
    },
    editClick (row) {
      _this.$router.push({name: 'UserEdit', query: {id: row}})
    },
    delClick (row) {
      _this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.axios.delete('/user/del/' + row.id).then((response) => {
          _this.$message.success('删除成功')
          _this.searchClick()
        })
      })
    }
  },
  data () {
    return {
      form: {loginName: null, realName: null},
      userData: [],
      unitInfo: []
    }
  }
}
</script>
