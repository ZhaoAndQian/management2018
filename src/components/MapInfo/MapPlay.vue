<template>
<el-row style="margin:-20px">
  <el-col :span="24">
  <div id="map" :style="mapStyle">

  </div>
  </el-col>
</el-row>
</template>

<script>
import map from '../../../static/js/higisHelper.js'
let _this
export default {
  created: function () {
    let height = document.body.clientHeight - 62
    this.mapStyle = ' height: ' + height + 'px; width:100%'
  },
  mounted: function () {
    _this = this
    _this.currentMap = map.loadMap(_this, 'map', 999999, 5450, map.Point(110.8720, 28.3679))
  },
  name: 'Index',
  data () {
    return {
      mapStyle: '',
      currentMap: undefined
    }
  },
  methods: {
    load () {
      _this.currentMap = map.loadMap(_this, 'map', 999999, 5450, map.Point(110.8720, 28.3679))
    },
    cutArea (item) {
      let bound = [[item.minY, item.minX], [item.maxY, item.maxX]]
      map.changeArea(bound, _this.currentMap)
    },
    addMark (item) {
      let icon = map.MarkIcon()
      let marker = map.addMark(_this.currentMap, icon, 29.3044, 112.9449)
      marker.addEventListener('click', function () {
        let popup = map.Popup('<span>我是一个higis的弹窗.......................<br><br></span>', 100, 150, 29.4044, 112.9449)
        popup.addTo(_this.currentMap)
      })
    },
    addPolyline () {
      var points = [
        map.Point(104.06387329101562, 30.66331280120874),
        map.Point(106.54678344726562, 29.569873858372727), // 重庆
        map.Point(112.93121337890625, 28.234229675051058), // 长沙
        map.Point(114.30038452148439, 30.600093873550072), // 武汉
        map.Point(115.85494995117189, 28.688178255991442), // 南昌
        map.Point(117.22274780273439, 31.828565514766165), // 合肥
        map.Point(120.15335083007814, 30.274486436999464), // 杭州
        map.Point(118.78692626953126, 32.06511939104017), // 南京
        map.Point(121.46484375000001, 31.240985378021307)]
      map.addPolyline(_this.currentMap, points)
    }
  }
}
</script>
<style>

</style>
