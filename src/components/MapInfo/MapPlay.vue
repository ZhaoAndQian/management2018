<template>
<el-row style="margin:-20px">
  <el-col :span="24">
  <div id="map" :style="mapStyle">
    <div id="coordinate" class="custom-mouse-position">
    </div>
    <div style="position: absolute;top: 10px;left: 10px;z-index: 1001;opacity: 0.5">
      <el-popover trigger="hover" placement="top-start">
        <div>
          <el-row>
            <el-button size="small" round @click="addOverLayer">添加覆盖物</el-button>
            <el-button size="small" id="play" round>播放轨迹</el-button>
            <el-button size="small" round @click="getHistory">获取轨迹</el-button>
            <el-button size="small" round @click="clearSoruce">重新绘制</el-button>
          </el-row>
          <hr>
          <el-row>
            <el-button size="small" round @click="getHistoryFire">历史火情点</el-button>
          </el-row>
          <hr>
          <el-row>
            绘图：
              <el-radio-group v-model="drawType" id="draw">
                <el-radio v-for="item in drawTypes" :label="item.value" :key="item.value">{{item.name}}</el-radio>
              </el-radio-group>
          </el-row>
          <el-row>
            量算：
              <el-radio-group v-model="measureType" id="measure">
                <el-radio label="None" >无</el-radio>
                <el-radio label="Polygon" >面积</el-radio>
                <el-radio label="LineString" >距离</el-radio>
              </el-radio-group>
          </el-row>
        </div>
        <el-button slot="reference">悬浮菜单</el-button>
      </el-popover>
    </div>
  </div>
  <div style="display:none">
    <img src="../../../static/images/27.gif" alt="" id="overLayer">
  </div>
  </el-col>
</el-row>
</template>

<script>
import map from '../../../static/js/mapCommon.js'
import {apiType, drawTypes} from '../../../static/js/common.js'
let thisMap, _this, draw
let drawMeasure
export default {
  created: function () {
    let height = document.body.clientHeight - 62
    this.mapStyle = ' height: ' + height + 'px; width:100%'
  },
  mounted: function () {
    _this = this
    this.loadMap()
    map.addDrawLayer(thisMap, draw, 'draw')
    map.getMeasure(thisMap, drawMeasure, 'measure', this.getMeasure)
  },
  name: 'MapPlay',
  data () {
    return {
      drawType: 'none',
      mapStyle: '',
      currentMap: undefined,
      drawTypes,
      measureType: 'none'
    }
  },
  methods: {
    loadMap () {
      thisMap = map.initMap({
        url: 'http://www.higis.org.cn:8082/hiart/5450/{z}/{x}/{y}.png',
        container: 'map'
      })
      // map.addZoom(thisMap)
      // map.addZoomSlider(thisMap)
      map.addFullScreen(thisMap)
      map.addMoveingEvent({map: thisMap, container: 'coordinate'})
    },
    getHistoryFire () {
      map.addFires(thisMap, thisMap.getLayers().item(3), [111.8658, 29.6920])
      map.addFires(thisMap, thisMap.getLayers().item(3), [110.8658, 27.6920])
      map.addFires(thisMap, thisMap.getLayers().item(3), [112.8658, 26.6920])
    },
    addOverLayer () {
      map.addOverLayer(thisMap, 'overLayer', [110.8658, 30.6920])
      map.setCenter(thisMap, [110.8658, 30.6920])
    },
    getMeasure (measure) {
      alert(measure)
    },
    clearSoruce () {
      console.log(thisMap.getLayers())
      thisMap.getLayers().getArray()[3].getSource().clear()
      thisMap.getLayers().getArray()[2].getSource().clear()
    },
    addPoints () {
      // _this.axios.apiType = apiType.baidu
      // for (let i = 0; i < 500; i++) {
      //   let point = {
      //     ak: 'O69tUBWGaQCTEwOnRsoyXFj3hlmxrcRO',
      //     service_id: '159708',
      //     entity_name: '10',
      //     longitude: 113.0159 + (0.005 * i),
      //     latitude: 29.2156 + (0.001 * i),
      //     loc_time: 1534838900 + i,
      //     coord_type_input: 'wgs84'
      //   }
      //   _this.axios({
      //     url: '/addpoint',
      //     method: 'post',
      //     data: point,
      //     transformRequest: [function (data) {
      //       let ret = ''
      //       for (let it in data) {
      //         ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      //       }
      //       return ret
      //     }],
      //     headers: {
      //       'Content-Type': 'application/x-www-form-urlencoded'
      //     }
      //   }).then(function (response) {
      //     _this.axios.apiType = apiType.server
      //   })
      // }
    },
    getHistory () {
      _this.axios.apiType = apiType.baidu
      let url = '/getpoints?ak=O69tUBWGaQCTEwOnRsoyXFj3hlmxrcRO&service_id=159708&entity_name=10&page_size=4888'
      _this.axios.all([_this.axios.get(url + '&start_time=1534838400&end_time=1534838900'), _this.axios.get(url + '&start_time=1534838900&end_time=1534839400')])
        .then(_this.axios.spread(function (response1, response2) {
          // 两个请求现在都执行完成
          _this.axios.apiType = apiType.server
          let routeCoords = []
          for (let item of response1.data.points) {
            routeCoords.push([item.longitude, item.latitude])
          }
          for (let item of response2.data.points) {
            routeCoords.push([item.longitude, item.latitude])
          }
          let play = document.getElementById('play')
          thisMap.getView().setCenter(map.fromLonLat(routeCoords[0]))
          map.playHistory({map: thisMap, points: routeCoords, speed: 20, startEle: play})
        }))
      // _this.axios.get()
      //   .then(function (response) {
      //     _this.axios.apiType = apiType.server
      //     let routeCoords = []
      //     for (let item of response.data.points) {
      //       routeCoords.push([item.longitude, item.latitude])
      //     }
      //     console.log(routeCoords)
      //     let play = document.getElementById('play')
      //     thisMap.getView().setCenter(map.fromLonLat(routeCoords[0]))
      //     map.playHistory({map: thisMap, points: routeCoords, speed: 20, startEle: play})
      //   })
    }
  }
}
</script>
<style>
  @import 'https://openlayers.org/en/v5.1.3/css/ol.css';
  #coordinate {
    position: absolute;
    bottom: 19px;
    left: 100px;
    width: 220px;
    height: 20px;
    /* 将z-index设置为显示在地图上层 */
    z-index: 1000;
  }
  /* 显示鼠标信息的自定义样式设置 */
  .custom-mouse-position {
    color: white;
    font-size: 16px;
    font-family: "微软雅黑";
  }
</style>
