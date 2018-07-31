<template>
<div>
<div>
  <el-tag type="success" @click.native="show" v-for="item in cameraData" :key="item.id" style="margin-right:5px;cursor:pointer">
    {{item.cameraName}}
  </el-tag>
</div>
<div class="prism-player" id="live" :style="liveStyle" style="margin-top:10px"></div>
</div>
</template>
<script>
import {getPlayer} from '../../../static/js/common.js'
let _this
export default {
  created: function () {
    let height = document.body.clientHeight - 150
    this.liveStyle = 'position: absolute; height: ' + height + 'px'
  },
  mounted: function () {
    _this = this
    let liveWidth = (document.body.clientWidth - 260) + 'px'
    getPlayer({
      contains: 'live',
      width: liveWidth,
      isLive: true
    })
    this.getCameraData()
  },
  methods: {
    show () {
      alert(123213)
    },
    getCameraData () {
      _this.axios.get('/Camera/selectall').then((response) => {
        let data = response.data
        if (data.state === '0') {
          _this.cameraData = data.table
        } else {
          _this.$message.error('获取摄像头信息出错：' + data.msg)
        }
      })
    }
  },
  data () {
    return {
      cameraData: [],
      liveStyle: ''
    }
  }
}
</script>
<style>

</style>
