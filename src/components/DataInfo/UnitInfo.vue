<template>
<div>
  <el-row :gutter="20">
  <el-col :span="14">
    <el-table
        :data="tableData"
        border highlight-current-row @current-change="rowClick"
        style="width: 100%">
        <el-table-column
        prop="unitName"
        label="单位名称"
        width="180">
        </el-table-column>
        <el-table-column
        prop="unitPhone"
        label="电话"
        width="180">
        </el-table-column>
        <el-table-column
        prop="unitAddr"
        label="地址">
        </el-table-column>
    </el-table>
  </el-col>
  <el-col :span="10">
    <el-form ref="form" :model="form" label-width="90px" :rules="rules">
    <el-form-item label="名称" prop="unitName">
        <el-input v-model="form.unitName"></el-input>
    </el-form-item>
    <el-form-item label="电话" prop="unitPhone">
        <el-input v-model="form.unitPhone"></el-input>
    </el-form-item>
    <el-form-item label="地址" prop="unitAddr">
        <el-input v-model="form.unitAddr"></el-input>
    </el-form-item>
    <el-form-item label="服务器编号">
        <el-input v-model="form.streamVideoServerTableId"></el-input>
    </el-form-item>
    <el-form-item label="行政区划" prop="divisionTableId">
        <el-select v-model="form.divisionTableId" placeholder="请选择行政区划">
        <el-option v-for="item in disivionData" :label="item.divisionName" :value="item.id" :key="item.id"></el-option>
        </el-select>
    </el-form-item>
    <el-form-item label="单位描述">
        <el-input type="textarea" v-model="form.unitDesc"></el-input>
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
    _this.getDivision()
    _this.searchClick()
  },
  methods: {
    getDivision: () => {
      _this.axios.get('/Division/selectsub/430000000000').then((response) => {
        let data = response.data
        if (data.state === '0') {
          _this.disivionData = data.table
        } else {
          _this.$message.error('获取行政区划信息出错：' + data.msg)
        }
      })
    },
    searchClick: () => {
      _this.axios.get('/Unit/selectall').then((response) => {
        let data = response.data
        if (data.state === '0') {
          _this.tableData = data.table
        } else {
          _this.$message.error('获取单位信息出错：' + data.msg)
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
      _this.axios.post('/Unit/addone', _this.form).then((response) => {
        if (response.data.state === '0') {
          _this.$message.success('新增成功')
        } else {
          _this.$message.error('新增失败：' + response.msg)
        }
        _this.searchClick()
      })
    },
    updateClick: () => {
      _this.axios.post('/Unit/UpdateList', [_this.form]).then((response) => {
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
        _this.axios.delete('/Unit/del/' + _this.form.id).then((response) => {
          _this.$message.success('删除成功')
          _this.searchClick()
        })
      })
    }
  },
  data () {
    return {
      rules: {
        unitName: [{required: true, message: '请输入单位名称', trigger: 'blur'}],
        divisionTableId: [{required: true, message: '请选择行政区划', trigger: 'change'}],
        unitPhone: [{required: true, message: '请输入联系电话', trigger: 'blur'}],
        unitAddr: [{required: true, message: '请输入单位地址', trigger: 'blur'}]
      },
      disivionData: [],
      tableData: [],
      form: {
        id: null,
        unitName: null,
        divisionTableId: null,
        unitAddr: null,
        unitPhone: null,
        unitDesc: null,
        streamVideoServerTableId: null
      }
    }
  }
}
</script>
<style>

</style>
