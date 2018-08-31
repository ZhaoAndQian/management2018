import Map from 'ol/Map.js'
import View from 'ol/View.js'
import TileLayer from 'ol/layer/Tile.js'
import {fromLonLat} from 'ol/proj.js'
import {XYZ, OSM, Vector as VectorSource} from 'ol/source.js'
import {ScaleLine, Zoom, ZoomSlider, FullScreen} from 'ol/control'
import MousePosition from 'ol/control/MousePosition'
import {createStringXY} from 'ol/coordinate'
import {Circle as CircleStyle, Fill, Icon, Stroke, Style} from 'ol/style.js'
import {Vector as VectorLayer} from 'ol/layer.js'
import Feature from 'ol/Feature.js'
import Point from 'ol/geom/Point.js'
import {LineString, Polygon} from 'ol/geom.js'
import {Draw, Modify, Snap} from 'ol/interaction.js'
import {getArea, getLength} from 'ol/sphere.js'
import Overlay from 'ol/Overlay.js'
import {unByKey} from 'ol/Observable.js'

/**
 * 初始化地图
 * @param {*} param0 
 */
const initMap = ({url, container, controls = [new ScaleLine()], view = new View({center: fromLonLat([106.8374, 34.4228]), zoom: 10})}) => {
  let map = new Map({
    target: container,
    view: view,
    controls: controls,
    layers: [
      // 底图
      new TileLayer({
        // source: new OSM()
        source: new XYZ({
          url: 'http://t1.tianditu.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles'
        })
      }),
      new TileLayer({
        source: new XYZ({
          url: url
        })
      })
    ]
  })
  return map
}
/**
 * 增加缩放条控件
 * @param {*} map 
 */
const addZoomSlider = (map) => {
  map.addControl(new ZoomSlider())
}
/**
 * 增加缩放控件
 * @param {*} map 
 */
const addZoom = (map) => {
    map.addControl(new Zoom())
}
/**
 * 增加全屏显示控件
 * @param {*} map 
 */
const addFullScreen = (map) => {
  map.addControl(new FullScreen())
}
/**
 * 增加图层
 * @param {*} map 
 * @param {*} url 
 */
const addLayer = (map, url) => {
  map.addLayer(
    new TileLayer({
      source: new XYZ({
        url: url
      })
    })
  )
}

/**
 * 设置中心坐标
 * @param {*} map 
 * @param {*} lonLat 
 */
const setCenter = (map, lonLat) => {
  map.getView().setCenter(fromLonLat(lonLat))
}
/**
 * 添加左键单击事件
 * @param {*} map 
 * @param {*} callBack 
 */
const addSingleClick = (map, callBack) => {
  map.on('singleclick', function (event) {
    callBack(event)
  })
}

/**
 * 添加鼠标移动事件、控件
 * @param {*} param0 
 */
const addMoveingEvent = ({map, container, projection = 'EPSG:4326', callBack = undefined}) => {
  var mousePositionControl = new MousePosition({
    coordinateFormat: createStringXY(6),
    projection: projection,
    target: document.getElementById(container)
  })
  map.addControl(mousePositionControl)
  if(callBack !== undefined){
    callBack()
  }
}

let animating = false, speed, now

/**
 * 播放历史轨迹
 * @param {*} param0 
 */
const playHistory = ({map, points, speed, startEle}) => {
  var routeCoords = []
  for (var i = 0; i < points.length; i++) {
    routeCoords.push(fromLonLat(points[i]))
  }
  var route = new LineString(routeCoords)
  var routeFeature = new Feature({
    type: 'route',
    geometry: route
  })
  var geoMarker = new Feature({
    type: 'geoMarker',
    geometry: new Point(routeCoords[0])
  })
  var startMarker = new Feature({
    type: 'icon',
    geometry: new Point(routeCoords[0])
  })
  var endMarker = new Feature({
    type: 'icon',
    geometry: new Point(routeCoords[routeCoords.length - 1])
  })
  var styles = {
    'route': new Style({
      stroke: new Stroke({
        width: 10,
        color: [255, 0, 255, 0.5]
      })
    }),
    'geoMarker': new Style({
      image: new Icon({
        anchor: [0.5, 0.5],
        scale: 0.2,
        src: './static/images/airplane92.png'
      })
    })
  }
  var vectorLayer = new VectorLayer({
    source: new VectorSource({
      features: [routeFeature, geoMarker, startMarker, endMarker]
    }),
    style: function (feature) {
      if (animating && feature.get('type') === 'geoMarker') {
        return null
      }
      return styles[feature.get('type')]
    }
  })
  map.addLayer(vectorLayer)
  var moveFeature = function (event) {
    var vectorContext = event.vectorContext
    var frameState = event.frameState
    if (animating) {
      var elapsedTime = frameState.time - now
      var index = Math.round(speed * elapsedTime / 1000)
      if (index >= routeCoords.length) {
        stopAnimation(true)
        return
      }
      var currentPoint = new Point(routeCoords[index])
      // map.getView().setCenter(routeCoords[index])
      var feature = new Feature(currentPoint)
      vectorContext.drawFeature(feature, styles.geoMarker)
    }
    map.render()
  }
  function startAnimation () {
    if (animating) {
      stopAnimation(false)
    } else {
      animating = true
      now = new Date().getTime()
      speed = speed
      startEle.textContent = '停止'
      geoMarker.setStyle(null)
      map.on('postcompose', moveFeature)
      map.render()
    }
  }
  function stopAnimation (ended) {
    animating = false
    startEle.textContent = '开始'
    var coord = ended ? routeCoords[routeCoords.length - 1] : routeCoords[0]
    geoMarker.getGeometry().setCoordinates(coord)
    map.un('postcompose', moveFeature)
  }
  startEle.addEventListener('click', startAnimation, false)
}

/**
 * 获取量算之后的数据
 * @param {*} map
 * @param {*} draw
 * @param {*} triggerEle
 * @param {*} callBack
 */
const getMeasure = (map, draw, triggerEle, callBack) => {
  var source = new VectorSource()
  var vector = new VectorLayer({
    source: source,
    style: new Style({
      fill: new Fill({
        color: 'rgba(255, 255, 255, 0.2)'
      }),
      stroke: new Stroke({
        color: '#ffcc33',
        width: 2
      }),
      image: new CircleStyle({
        radius: 7,
        fill: new Fill({
          color: '#ffcc33'
        })
      })
    })
  })
  map.addLayer(vector)
  var pointerMoveHandler = function(evt) {
    if (evt.dragging) {
      return
    }
  }
  var formatArea = function(polygon) {
    var area = getArea(polygon)
    var output
    if (area > 10000) {
      output = (Math.round(area / 1000000 * 100) / 100) + ' ' + 'km²'
    } else {
      output = (Math.round(area * 100) / 100) + ' ' + 'm²'
    }
    return output
  }
  var formatLength = function(line) {
    var length = getLength(line)
    var output
    if (length > 100) {
      output = (Math.round(length / 1000 * 100) / 100) + ' ' + 'km'
    } else {
      output = (Math.round(length * 100) / 100) + ' ' + 'm'
    }
    return output
  }
  map.on('pointermove', pointerMoveHandler)
  var typeSelect = document.getElementById(triggerEle)
  function addInteraction(value) {
    if (value === 'None') {
      return
    }
    draw = new Draw({
      source: source,
      type: value
    })
    map.addInteraction(draw)
    var listener, measured
    draw.on('drawstart',
      function(evt) {
        listener = evt.feature.getGeometry().on('change', function(evt) {
          var geom = evt.target
          if (geom instanceof Polygon) {
            measured = formatArea(geom)
          } else if (geom instanceof LineString) {
            measured = formatLength(geom)
          }
        })
      }, this)
    draw.on('drawend', function(evt) {
      unByKey(listener)
      callBack(measured)
    }, this)
  }
  typeSelect.onchange = function(evt) {
    map.removeInteraction(draw)
    addInteraction(evt.target.defaultValue)
  }
  addInteraction('None')
}

/**
 * 绘制图形
 * @param {*} map 
 * @param {*} draw 
 * @param {*} triggerEle dom元素id
 */
const addDrawLayer = (map, draw, triggerEle) => {
  // 需要在一个新的图层进行操作
  var source = new VectorSource({wrapX: false})
  var vector = new VectorLayer({
    source: source,
    style: new Style({
      fill: new Fill({
        color: 'rgba(255, 255, 255, 0.2)'
      }),
      stroke: new Stroke({
        color: '#ffcc33',
        width: 3
      }),
      image: new CircleStyle({
        radius: 7,
        fill: new Fill({
          color: '#ffcc33'
        })
      })
    })
  })
  map.addLayer(vector)
  var typeSelect = document.getElementById(triggerEle)
  function addInteraction (value) {
    if (value !== 'None') {
      draw = new Draw({
        source: source,
        type: value,
        style: new Style({
          fill: new Fill({
            color: 'rgba(255, 255, 255, 0.2)'
          }),
          stroke: new Stroke({
            color: 'rgba(0, 0, 0, 0.5)',
            lineDash: [10, 10],
            width: 3
          }),
          image: new CircleStyle({
            radius: 5,
            stroke: new Stroke({
              color: 'rgba(0, 0, 0, 0.7)'
            }),
            fill: new Fill({
              color: 'rgba(255, 255, 255, 0.2)'
            })
          })
        })
      })
      map.addInteraction(draw)
    }
  }
  typeSelect.onchange = function (ev) {
    map.removeInteraction(draw)
    addInteraction(ev.target.defaultValue)
  }
  addInteraction('None')
  // 需要在一个新的图层进行操作
  var source = new VectorSource({wrapX: false})
  var vector = new VectorLayer({
    source: source,
    style: new Style({
      fill: new Fill({
        color: 'rgba(255, 255, 255, 0.2)'
      }),
      stroke: new Stroke({
        color: '#ffcc33',
        width: 3
      }),
      image: new CircleStyle({
        radius: 7,
        fill: new Fill({
          color: '#ffcc33'
        })
      })
    })
  })
  map.addLayer(vector)
  // var modify = new Modify({source: source})
  // map.addInteraction(modify)
  var typeSelect = document.getElementById(triggerEle)
  function addInteraction (value) {
    if (value !== 'None') {
      draw = new Draw({
        source: source,
        type: value
      })
      map.addInteraction(draw)
      // snap = new Snap({source: source})
      // map.addInteraction(snap)
    }
  }
  typeSelect.onchange = function (ev) {
    map.removeInteraction(draw)
    // map.removeInteraction(snap)
    addInteraction(ev.target.defaultValue)
  }
  addInteraction('None')
}

/**
 * 添加覆盖物
 * @param {*} map 
 * @param {*} eleId 
 * @param {*} lonLat 
 */
const addOverLayer = (map, eleId, lonLat) => {
  var marker = new Overlay({
    position: fromLonLat(lonLat),
    element: document.getElementById(eleId),
    stopEvent: true
  })
  map.addOverlay(marker)
}

/**
 * 
 * @param {*} map 
 * @param {*} layer
 * @param {*} lonLat 
 */
const addFires = (map, layer, lonLat) => {
  var circle = new Feature({
    geometry: new Point(fromLonLat(lonLat))
  })
  circle.setStyle(new Style({
    image: new CircleStyle({
      radius: 0,
      stroke: new Stroke({
        color: 'red',
        size: 3
      })
    })
  }))
  layer.getSource().addFeature(circle)
  var radius = 0
  map.on('postcompose', function(){
    radius++
    radius = radius % 10
    // 设置样式
    circle.setStyle(new Style({
      image: new CircleStyle({
        radius: radius,
        stroke: new Stroke({
          color: 'red',
          width: 3
        })
      })
    }))
  })
}

export default{
  initMap,
  setCenter,
  addZoom,
  addZoomSlider,
  addFullScreen,
  addLayer,
  addSingleClick,
  addMoveingEvent,
  playHistory,
  fromLonLat,
  addDrawLayer,
  getMeasure,
  addOverLayer,
  addFires
}