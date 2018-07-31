<template>
<div>
  <el-row :gutter="20">
  <el-col :span="14">
    <el-table
        :data="tableData"
        border highlight-current-row @current-change="rowClick"
        style="width: 100%">
        <el-table-column
        prop="facName"
        label="单位名称">
        </el-table-column>
        <el-table-column
        prop="telephone"
        label="电话">
        </el-table-column>
        <el-table-column
        prop="linkMan"
        label="联系人">
        </el-table-column>
        <el-table-column
        prop="facAddr"
        label="地址">
        </el-table-column>
    </el-table>
  </el-col>
  <el-col :span="10">
    <el-form ref="form" :model="form" label-width="90px" :rules="rules">
    <el-form-item label="名称" prop="facName">
        <el-input v-model="form.facName"></el-input>
    </el-form-item>
    <el-form-item label="电话">
        <el-input v-model="form.telephone"></el-input>
    </el-form-item>
    <el-form-item label="地址">
        <el-input v-model="form.facAddr"></el-input>
    </el-form-item>
    <el-form-item label="联系人">
        <el-input v-model="form.linkMan"></el-input>
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
    _this.searchClick()
  },
  methods: {
    searchClick: () => {
      _this.axios.get('/AircFac/selectall').then((response) => {
        let data = response.data
        if (data.state === '0') {
          _this.tableData = data.table
        } else {
          _this.$message.error('获取无人机产商信息出错：' + data.msg)
        }
      })
      _this.$refs['form'].resetFields()
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
    rowClick: (row) => {
      Object.assign(_this.form, row)
    },
    createClick: () => {
      _this.form.id = 0
      _this.axios.post('/AircFac/addone', _this.form).then((response) => {
        if (response.data.state === '0') {
          _this.$message.success('新增成功')
        } else {
          _this.$message.error('新增失败：' + response.msg)
        }
        _this.searchClick()
      })
    },
    updateClick: () => {
      _this.axios.post('/AircFac/UpdateList', [_this.form]).then((response) => {
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
        _this.axios.delete('/AircFac/del/' + _this.form.id).then((response) => {
          _this.$message.success('删除成功')
          _this.searchClick()
        })
      })
    }
  },
  data () {
    return {
      rules: {
        facName: [{required: true, message: '请输入无人机产商名称', trigger: 'blur'}]
      },
      tableData: [
      ],
      form: {
        id: null,
        facName: null,
        facAddr: null,
        telephone: null,
        linkMan: null
      }
    }
  }
}
</script>
<style>

</style>
