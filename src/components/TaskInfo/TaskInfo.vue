<template>
<div>
<el-form :inline="true">
  <el-form-item label="任务名称">
    <el-input  placeholder="" v-model="form.taskName"></el-input>
  </el-form-item>
  <el-form-item label="任务类型">
    <el-select v-model="form.taskTypeTableId" placeholder="">
      <el-option v-for="item in taskTypeData" :key="item.id" :label="item.taskTypeName" :value="item.id"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="searchClick">查询</el-button>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="addClick">新增</el-button>
  </el-form-item>
</el-form>
  <el-table :data="tableData" ref="tableData" border style="width: 100%" :row-class-name="taskRowClassName">
    <el-table-column type="expand">
      <template slot-scope="props">
          <el-table :data="props.row.listExec" border ref="listExec" :row-class-name="execRowClassName">
          <el-table-column type="expand">
            <template slot-scope="propss">
              <el-table :data="propss.row.listEvent" ref="listEvent" border>
                <el-table-column
                  prop="execTaskTableId"
                  label="执行编号" width="80px">
                </el-table-column>
                <el-table-column
                  prop="eventTypeTableId"
                  label="事件类型" :formatter="formatterEventType">
                </el-table-column>
                <el-table-column
                  prop="posX"
                  label="经度">
                </el-table-column>
                <el-table-column
                  prop="posY"
                  label="纬度">
                </el-table-column>
                <el-table-column
                  prop="posZ"
                  label="高程">
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
                    <el-button @click="imageClick(scope.row)" type="text" size="small">图片</el-button>
                    <el-button @click="videoClick(scope.row)" type="text" size="small">视频</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column
            prop="userTableId"
            label="执行人" :formatter="formatterUser">
          </el-table-column>
          <el-table-column
            prop="aircTableId"
            label="无人机" :formatter="formatterAirc">
          </el-table-column>
          <el-table-column
            prop="startTime"
            label="开始时间">
          </el-table-column>
          <el-table-column
            prop="endTime"
            label="结束时间">
          </el-table-column>
          <el-table-column
            prop="taskStateTableId" width="120px"
            label="执行状态" :formatter="formatterState">
          </el-table-column>
        </el-table>
      </template>
    </el-table-column>
    <el-table-column
      prop="id"
      label="编号" width="50px">
    </el-table-column>
    <el-table-column
      prop="taskName"
      label="任务名称">
    </el-table-column>
    <el-table-column
      prop="taskTypeTableId"
      label="任务类型" :formatter="formatterType">
    </el-table-column>
    <el-table-column
      prop="taskDesc"
      label="任务描述">
    </el-table-column>
    <el-table-column
      prop="userTableId"
      label="发布人" :formatter="formatterUser">
    </el-table-column>
    <el-table-column
      prop="pubTime"
      label="发布时间">
    </el-table-column>
    <el-table-column
      prop="endTime"
      label="截止时间">
    </el-table-column>
    <el-table-column
      label="操作">
      <template slot-scope="scope">
        <!-- <el-button @click="addDetailsClick(scope.row)" type="text" size="small">增加详细</el-button> -->
        <el-button @click="editClick(scope.row)" type="text" size="small">编辑</el-button>
        <el-button @click="delClick(scope.row)" type="text" size="small">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog title="图片展示" :visible.sync="dialogFormVisible">
    <el-carousel v-show="images.length>0" :autoplay="false" arrow="always" :height="carHeight">
      <el-carousel-item v-for="item in images" :key="item.id" style="height: 100%">
        <img :src="imgUrl+item.imgPath" alt="" style="width:auto;height:auto;max-width:100%;max-height:100%">
      </el-carousel-item>
    </el-carousel>
  </el-dialog>
  <el-dialog  :visible.sync="videoFormVisible">
    <el-row :gutter="10">
      <el-col :span="2">
        <el-table
          :data="videos" @row-click="playVideo"
          style="width: 100%">
          <el-table-column
            prop="id"
            label="编号">
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="22">
        <video :src="currentVideoUrl" autoplay controls width="100%" >
        </video>
      </el-col>
    </el-row>
  </el-dialog>
  </div>
</template>

<script>
import { imgServiceUrl, videoServiceUrl } from '../../../static/js/common.js'
let _this
export default {
  created: function () {
    let height = document.body.clientHeight
    this.carHeight = (height - 60 - 150 - 50) + 'px'
  },
  mounted: function () {
    _this = this
    _this.imgUrl = imgServiceUrl
    _this.getTaskTypeData()
    _this.getTaskStateData()
    _this.getUserData()
    _this.getAircData()
    _this.getEventTypeData()
    _this.searchClick()
  },
  methods: {
    playVideo (row, event, column) {
      _this.currentVideoUrl = videoServiceUrl + row.videoPath
    },
    taskRowClassName ({row, rowIndex}) {
      if (row.listExec.length > 0) {
        return 'success-row'
      }
      return ''
    },
    execRowClassName ({row, rowIndex}) {
      if (row.listEvent.length > 0) {
        return 'success-row'
      }
      return ''
    },
    imageClick (row) {
      _this.axios.get('/EventImg/select/' + row.id).then((response) => {
        let data = response.data
        if (data.state === '0') {
          _this.images = data.table
          if (_this.images.length > 0) {
            _this.dialogFormVisible = true
          } else {
            _this.$message('没有图片信息')
          }
        } else {
          _this.$message.error('获取图片数据出错：' + data.msg)
        }
      })
    },
    videoClick (row) {
      _this.axios.get('/EventVideo/select/' + row.id).then((response) => {
        let data = response.data
        if (data.state === '0') {
          _this.videos = data.table
          if (_this.videos.length > 0) {
            _this.videoFormVisible = true
          } else {
            _this.$message('没有视频信息')
          }
        } else {
          _this.$message.error('获取视频数据出错：' + data.msg)
        }
      })
    },
    formatterEventType (row, column, cellValue, index) {
      for (let exec of _this.eventTypeData) {
        if (exec.id === cellValue) {
          return exec.eventName
        }
      }
    },
    formatterType (row, column, cellValue, index) {
      for (let taskType of _this.taskTypeData) {
        if (taskType.id === cellValue) {
          return taskType.taskTypeName
        }
      }
    },
    formatterUser (row, column, cellValue, index) {
      for (let user of _this.userData) {
        if (user.id === cellValue) {
          return user.realName
        }
      }
    },
    formatterAirc (row, column, cellValue, index) {
      for (let airc of _this.aircData) {
        if (airc.id === cellValue) {
          return airc.serialNum
        }
      }
    },
    formatterState (row, column, cellValue, index) {
      for (let state of _this.taskStateData) {
        if (state.id === cellValue) {
          return state.stateName
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
    getUserData () {
      _this.axios.get('/user/selectall').then((response) => {
        let data = response.data
        if (data.state === '0') {
          _this.userData = data.table
        } else {
          _this.$message.error('获取用户信息出错：' + data.msg)
        }
      })
    },
    getAircData () {
      _this.axios.get('/Airc/selectall').then((response) => {
        let data = response.data
        if (data.state === '0') {
          _this.aircData = data.table
        } else {
          _this.$message.error('获取无人机信息出错：' + data.msg)
        }
      })
    },
    getTaskStateData () {
      _this.axios.get('/TaskState/selectall').then((response) => {
        let data = response.data
        if (data.state === '0') {
          _this.taskStateData = data.table
        } else {
          _this.$message.error('获取执行状态出错：' + data.msg)
        }
      })
    },
    getTaskTypeData () {
      _this.axios.get('/TaskType/selectall').then((response) => {
        let data = response.data
        if (data.state === '0') {
          _this.taskTypeData = data.table
          _this.taskTypeData.unshift({taskTypeName: '全部', id: null})
        } else {
          _this.$message.error('获取任务类型出错：' + data.msg)
        }
      })
    },
    searchClick () {
      _this.axios.post('/Task/selectCondition', _this.form).then((response) => {
        let data = response.data
        if (data.state === '0') {
          _this.tableData = data.table
        } else {
          _this.$message.error('获取数据出错：' + data.msg)
        }
      })
    },
    addClick () {
      _this.$router.push({name: 'TaskEdit'})
    },
    editClick (row) {
      _this.$router.push({name: 'TaskEdit', query: {id: row}})
    },
    delClick (row) {
      _this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.axios.delete('/Task/del/' + row.id).then((response) => {
          _this.$message.success('删除成功')
          _this.searchClick()
        })
      })
    }
  },
  data () {
    return {
      currentVideoUrl: '',
      videos: [],
      videoFormVisible: false,
      imgUrl: '',
      carHeight: '800px',
      images: [],
      dialogFormVisible: false,
      form: {taskName: null, taskTypeTableId: null},
      taskStateData: [],
      taskTypeData: [],
      eventTypeData: [],
      queryParams: {},
      userData: [],
      aircData: [],
      tableData: []
    }
  }
}
</script>
<style>
  .el-table .success-row {
    background: #f0f9eb;
  }
</style>
