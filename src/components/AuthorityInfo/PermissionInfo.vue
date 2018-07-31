<template>
<div>
  <el-row :gutter="20">
  <el-col :span="14">
    <el-table
        :data="tableData"
        border highlight-current-row @current-change="rowClick" :height="tableHeight"
        style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-table :data="props.row.childrens" @current-change="rowClick" ref="childrens" border>
                <el-table-column
                  prop="permissonName"
                  label="名称">
                </el-table-column>
                <el-table-column
                  prop="permissonSeq"
                  label="序 号">
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
        <el-table-column
        prop="permissonName"
        label="名称">
        </el-table-column>
        <el-table-column
        prop="permissonSeq"
        label="序 号">
        </el-table-column>
    </el-table>
  </el-col>
  <el-col :span="10">
    <el-form ref="form" :model="form" label-width="90px" :rules="rules">
    <el-form-item label="菜单名称" prop="permissonName">
        <el-input v-model="form.permissonName"></el-input>
    </el-form-item>
    <el-form-item label="路由名称" prop="routerName">
      <el-input v-model="form.routerName"></el-input>
    </el-form-item>
    <el-form-item label="icon图标" prop="icon">
      <el-select v-model="form.icon" placeholder="请选择图标">
        <el-option v-for="item in iconData" :key="item" :label="item" :value="item"><i :class="item"></i></el-option>
      </el-select>
      <i :class="form.icon"></i> <el-button size="small" type="warning" plain @click="clearIcon">清除</el-button>
    </el-form-item>
    <el-form-item label="父级菜单" prop="pId">
      <el-select v-model="form.pId" placeholder="请选择父级菜单">
        <el-option v-for="item in parentData" :key="item.id" :label="item.permissonName" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="序号" prop="permissonSeq">
        <el-input v-model="form.permissonSeq" min="1" max="19" maxlength="2" step="1" type="number"></el-input>
    </el-form-item>
    <el-form-item label="描述" prop="permissonDesc">
        <el-input v-model="form.permissonDesc"></el-input>
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
import {getIcons} from '../../../static/js/common.js'
let _this
export default {
  created: function () {
    let height = document.body.clientHeight
    this.tableHeight = (height - 205) + 'px'
  },
  mounted: function () {
    _this = this
    _this.searchClick()
    _this.iconData = getIcons()
  },
  methods: {
    clearIcon: () => {
      _this.form.icon = null
    },
    searchClick: () => {
      _this.axios.get('/Permisson/selectTree').then((response) => {
        let data = response.data
        if (data.state === '0') {
          _this.tableData = data.table
          _this.parentData.splice(0, _this.parentData.length)
          for (let menu of _this.tableData) {
            if (menu.pId === 0) {
              let _menu = {}
              Object.assign(_menu, menu)
              _this.parentData.push(_menu)
            }
          }
          _this.parentData.unshift({id: 0, pId: 0, permissonName: '根级菜单'})
        } else {
          _this.$message.error('获取菜单信息出错：' + data.msg)
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
          if (_this.form.pId === null) {
            _this.form.pId = 0
          }
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
      _this.axios.post('/Permisson/addone', _this.form).then((response) => {
        if (response.data.state === '0') {
          _this.$message.success('新增成功')
        } else {
          _this.$message.error('新增失败：' + response.msg)
        }
        _this.searchClick()
      })
    },
    updateClick: () => {
      _this.axios.post('/Permisson/UpdateList', [_this.form]).then((response) => {
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
        _this.axios.delete('/Permisson/del/' + _this.form.id).then((response) => {
          _this.$message.success('删除成功')
          _this.searchClick()
        })
      })
    }
  },
  data () {
    return {
      tableHeight: '',
      rules: {
        permissonName: [{required: true, message: '请输入菜单名称', trigger: 'blur'}],
        permissonUrl: [{required: true, message: '请输入菜单地址', trigger: 'blur'}]
      },
      iconData: [],
      parentData: [],
      tableData: [],
      form: {
        id: null,
        pId: null,
        icon: null,
        permissonName: null,
        permissonDesc: null,
        routerName: null,
        permissonSeq: 1
      }
    }
  }
}
</script>
<style>

</style>
