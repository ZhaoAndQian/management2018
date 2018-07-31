<template>
<div>
  <el-form :inline="true">
  <el-form-item label="执行编号">
    <el-input  placeholder="" v-model="form.execTaskTableId"></el-input>
  </el-form-item>
  <el-form-item label="事件类型">
    <el-select v-model="form.eventTypeTableId" placeholder="">
      <el-option v-for="item in eventTypeData" :key="item.id" :label="item.eventName" :value="item.id"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="searchClick">查询</el-button>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="addClick">新增</el-button>
  </el-form-item>
</el-form>
<el-row :gutter="20">
  <el-col :span="24">
  <el-table :data="tableData" ref="tableData" border style="width: 100%">
    <el-table-column
      prop="execTaskTableId"
      label="执行编号" width="80px">
    </el-table-column>
    <el-table-column
      prop="eventTypeTableId" width="85px"
      label="事件类型" :formatter="formatterEventType">
    </el-table-column>
    <el-table-column
      prop="posX"
      label="经度" width="100px">
    </el-table-column>
    <el-table-column
      prop="posY"
      label="纬度" width="100px">
    </el-table-column>
    <el-table-column
      prop="posZ"
      label="高程" width="100px">
    </el-table-column>
    <el-table-column
      prop="eventTime"
      label="发生时间">
    </el-table-column>
    <el-table-column
      prop="eventDesc"
      label="事件描述">
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作">
      <template slot-scope="scope">
        <el-button @click="editClick(scope.row)" type="text" size="small">编辑</el-button>
        <el-button @click="imageClick(scope.row)" type="text" size="small">图片</el-button>
        <el-button @click="videoClick(scope.row)" type="text" size="small">视频</el-button>
        <el-button @click="delClick(scope.row)" type="text" size="small">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  </el-col>
</el-row>
</div>
</template>
<script>
let _this
export default {
  mounted: function () {
    _this = this
    _this.getEventTypeData()
    _this.searchClick()
  },
  methods: {
    imageClick (row) {
      _this.$router.push({name: 'EventImg', query: {id: row}})
    },
    videoClick (row) {
      _this.$router.push({name: 'EventVideo', query: {id: row}})
    },
    formatterEventType (row, column, cellValue, index) {
      for (let exec of _this.eventTypeData) {
        if (exec.id === cellValue) {
          return exec.eventName
        }
      }
    },
    getEventTypeData () {
      _this.axios.get('/EventType/selectall').then((response) => {
        let data = response.data
        if (data.state === '0') {
          _this.eventTypeData = data.table
          _this.eventTypeData.unshift({id: null, eventName: '全部'})
        } else {
          _this.$message.error('获取事件类型出错：' + data.msg)
        }
      })
    },
    searchClick () {
      _this.axios.post('/Event/selectCondition', _this.form).then((response) => {
        let data = response.data
        if (data.state === '0') {
          _this.tableData = data.table
        } else {
          _this.$message.error('获取数据出错：' + data.msg)
        }
      })
    },
    addClick () {
      _this.$router.push({name: 'TaskEventEdit'})
    },
    editClick (row) {
      _this.$router.push({name: 'TaskEventEdit', query: {id: row}})
    },
    delClick (row) {
      _this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.axios.delete('/Event/del/' + row.id).then((response) => {
          _this.$message.success('删除成功')
          _this.searchClick()
        })
      })
    }
  },
  data () {
    return {
      form: {execTaskTableId: null, eventTypeTableId: null},
      eventTypeData: [],
      executeData: [],
      tableData: [],
      taskExecData: []
    }
  }
}
</script>
