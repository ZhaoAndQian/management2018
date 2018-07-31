<template>
<div>
<!-- <el-upload
ref="upload"
:on-success="upSuccess"
:on-error="upError"
:headers="hearder"
  :action="fileUrl"
  list-type="picture-card"
  :before-remove="removeClick">
  <i class="el-icon-plus"></i>
</el-upload>
<br> -->
<el-row :gutter="20">
  <el-col :span="4">
    <el-card class="box-card" :style="cardStyle">
      <div slot="header">
        <span>视频列表</span>
      </div>
    <el-table
      :data="videos" @row-click="playVideo"
      style="width: 100%">
      <el-table-column
        prop="id"
        label="视频ID"
        width="180">
      </el-table-column>
    </el-table>
    </el-card>
  </el-col>
  <el-col :span="20">
    <el-card class="box-card" :style="cardStyle">
      <div slot="header">
        <span>播放器</span>
      </div>
      <video :src="currentUrl" autoplay controls width="100%" >
      </video>
    </el-card>
  </el-col>
</el-row>
</div>
</template>
<script>
import { videoServiceUrl, baseUrl } from '../../../static/js/common.js'
let _this
export default {
  created: function () {
    let height = document.body.clientHeight
    this.cardStyle = ('height:' + (height - 60 - 66) + 'px')
  },
  mounted () {
    _this = this
    let _id = this.$route.query.id
    _this.videoUrl = videoServiceUrl
    _this.eventId = _id.id
    _this.fileUrl = (baseUrl + '/EventVideo/Upload?id=' + _id.id)
    _this.hearder = {Authorization: _this.axios.defaults.headers.common['Authorization']}
    _this.eventId = _id.id
    _this.searchClick()
  },
  data () {
    return {
      currentUrl: '',
      hearder: {},
      cardStyle: '',
      fileUrl: '',
      videoUrl: '',
      videos: [],
      eventId: ''
    }
  },
  methods: {
    playVideo (row, event, column) {
      _this.currentUrl = videoServiceUrl + row.videoPath
    },
    searchClick () {
      _this.axios.get('/EventVideo/select/' + _this.eventId).then((response) => {
        let data = response.data
        if (data.state === '0') {
          _this.videos = data.table
        } else {
          _this.$message.error('获取视频数据出错：' + data.msg)
        }
      })
    },
    upSuccess (response, file, fileList) {
      if (response.state === '-1') {
        _this.$message.error('对不起，上传失败：' + response.msg)
      } else {
        _this.$message.success('上传成功')
        _this.videos.push({videoPath: response.path, id: response.id})
        file.videoId = response.id
      }
    },
    upError (er, file, fileList) {
      _this.$message.error('对不起，上传失败：' + er)
    },
    removeClick (file, fileList) {
      _this.axios.delete('/EventVideo/del/' + file.videoId).then((response) => {
        _this.$message.success('删除成功')
        let index = _this.videos.indexOf(file.videoId)
        alert(index)
        _this.videos.splice(index, 1)
      }).catch((err) => {
        _this.$message.error('对不起，删除失败：' + err)
      })
    }
  }
}
</script>

<style>

</style>
