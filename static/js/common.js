//请求的url类型{0 后台数据接口，1 百度接口地址}
export const apiType = {server: 0, baidu: 1}

//绘制类型
export const drawTypes = [{name: '无', value:'None'}, {name: '点', value: 'Point'}, {name: '线', value: 'LineString'}, {name: '面', value: 'Polygon'}, {name: '圆', value: 'Circle'}]

/**
 * @summary 设置cookie
 * @param {string} name cookie名称
 * @param {string} value cookie值
 * @param {int} expires 保存时间(单位:小时)
 * @param {string} path
 */
export const setCookie = (name, value, expires = 12, path) => {
  let str = name + '=' + encodeURIComponent(value)
  if (expires > 0) {
    let date = new Date()
    date.setTime(date.getTime() + expires * 3600 * 1000)
    str += ';expires=' + date.toGMTString()
  }
  if (path) { str += ';path=' + path }
  document.cookie = str
}

/**
 * @summary 读取cookie
 * @param {string} name cookie名称
 * @retrun {string} value cookie值
 * @example
 */
export const getCookie = (name) => {
  let start = document.cookie.indexOf(name + '=')
  if ((!start) && (name !== document.cookie.substring(0, name.length))) { return '' }
  if (start === -1) { return '' }
  let len = start + name.length + 1
  let end = document.cookie.indexOf(';', len)
  if (end === -1) { end = document.cookie.length }
  return decodeURIComponent(document.cookie.substring(len, end))
}

export const baseUrl = 'http://119.23.74.200:8888'
export const imgServiceUrl = 'http://119.23.74.200:8888/upload'
export const videoServiceUrl = 'http://119.23.74.200:8888/upload'
/**
* 获取基础数据类型
*/
export const getBaseDataType = () => {
  let typeArray = [
    {name: '单位名称', path: '/unitInfo'},
    {path: '/permissionInfo', name: '系统菜单'},
    {path: '/roleInfo', name: '系统角色'},
    {name: '无人机类型', path: '/planeType'},
    {name: '无人机产商', path: '/planeVender'},
    {name: '无人机载荷', path: '/planeLoad'},
    {name: '摄像头产商', path: '/cameraVender'},
    {name: '摄像头类型', path: '/cameraType'},
    {name: '载荷产商', path: '/loadVender'},
    {name: '事件类型', path: '/eventType'},
    {name: '任务类型', path: '/taskType'},
    {name: '任务状态', path: '/taskState'}
  ]
  return typeArray
}

/**
 * 全部图标
 */
export const getIcons = () => {
  let icons = [
    'el-icon-info', 'el-icon-error', 'el-icon-success', 'el-icon-warning', 'el-icon-question', 'el-icon-back',
    'el-icon-remove', 'el-icon-circle-plus', 'el-icon-circle-close', 'el-icon-circle-check',
    'el-icon-sort', 'el-icon-tickets', 'el-icon-document', 'el-icon-goods', 'el-icon-sold-out', 'el-icon-news',
    'el-icon-message', 'el-icon-date', 'el-icon-printer', 'el-icon-time', 'el-icon-bell', 'el-icon-mobile-phone',
    'el-icon-service', 'el-icon-view', 'el-icon-menu', 'el-icon-more', 'el-icon-more-outline', 'el-icon-star-on',
    'el-icon-star-off', 'el-icon-location', 'el-icon-location-outline', 'el-icon-phone', 'el-icon-phone-outline',
    'el-icon-picture', 'el-icon-picture-outline', 'el-icon-delete', 'el-icon-search', 'el-icon-edit',
    'el-icon-edit-outline', 'el-icon-rank', 'el-icon-refresh',
    'el-icon-share', 'el-icon-setting', 'el-icon-upload'
  ]
  return icons
}

/**
 * 获取播放器
 * @param {*} param0 isLive 是否直播
 */
export const getPlayer = ({contains, width='800px', isLive=false, source}) => {
  if (!source) {
    source = 'http://push.gisge.com/AppName/StreamName2.m3u8?auth_key=1532673500-0-0-0577760a7a19b81d7e2c17f5682e3938'
  }
  let player = new Aliplayer({
    id: contains,
    width: width,
    isLive: isLive,
    source: source
    // source: 'rtmp://push.gisge.com/AppName/StreamName2?auth_key=1532668263-0-0-2d7beae784811244c4f20c6b42a5557c'
  }, function (player) {
  })
  return player
}

// cookie名
export const cookieAuth = 'management-Authorization'
export const userInfoId = 'management-userId'
export const userInfoName = 'management-username'
// cookie默认有效时间（小时）
export const cookieTime = 8

export default {
  getCookie,
  setCookie,
  cookieAuth,
  cookieTime,
  userInfoId,
  userInfoName,
  getBaseDataType,
  getIcons,
  baseUrl,
  imgServiceUrl,
  videoServiceUrl,
  getPlayer,
  apiType,
  drawTypes
}
