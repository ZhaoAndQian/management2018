import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main'
import Login from '@/components/Login.vue'
import DataPlay from '@/components/DataPlay'
import CameraInfo from '@/components/EquipmentInfo/CameraInfo'
import CameraEdit from '@/components/EquipmentInfo/CameraEdit'
import PlaneInfo from '@/components/EquipmentInfo/PlaneInfo'
import PlaneEdit from '@/components/EquipmentInfo/PlaneEdit'
import TaskExecute from '@/components/TaskInfo/TaskExecute'
import TaskExecEdit from '@/components/TaskInfo/TaskExecEdit'
import TaskInfo from '@/components/TaskInfo/TaskInfo'
import TaskEdit from '@/components/TaskInfo/TaskEdit'
import PlaneLive from '@/components/VideoInfo/PlaneLive'
import CameraLive from '@/components/VideoInfo/CameraLive'
import UserInfo from '@/components/UserInfo/UserInfo'
import UserEdit from '@/components/UserInfo/UserEdit'
import BaseData from '@/components/DataInfo/BaseData'
import CameraType from '@/components/DataInfo/CameraType'
import CameraVender from '@/components/DataInfo/CameraVender'
import EventType from '@/components/DataInfo/EventType'
import LoadVender from '@/components/DataInfo/LoadVender'
import PlaneLoad from '@/components/DataInfo/PlaneLoad'
import PlaneType from '@/components/DataInfo/PlaneType'
import PlaneVender from '@/components/DataInfo/PlaneVender'
import TaskType from '@/components/DataInfo/TaskType'
import UnitInfo from '@/components/DataInfo/UnitInfo'
import TaskState from '@/components/DataInfo/TaskState'
import TaskEvent from '@/components/TaskInfo/TaskEvent'
import TaskEventEdit from '@/components/TaskInfo/TaskEventEdit'
import PermissionInfo from '@/components/AuthorityInfo/PermissionInfo'
import RoleInfo from '@/components/AuthorityInfo/RoleInfo'
import PowerRole from '@/components/AuthorityInfo/PowerRole'
import UserRole from '@/components/AuthorityInfo/UserRole'
import UserPwd from '@/components/UserInfo/UserPwd'
import EventImg from '@/components/TaskInfo/EventImg'
import EventVideo from '@/components/TaskInfo/EventVideo'
import MapPlay from '@/components/MapInfo/MapPlay'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/main',
      name: 'Main',
      component: Main,
      children: [
        {
          path: '/mapPlay',
          name: 'MapPlay',
          component: MapPlay
        },
        {
          path: '/eventVideo',
          name: 'EventVideo',
          component: EventVideo
        },
        {
          path: '/eventImg',
          name: 'EventImg',
          component: EventImg
        },
        {
          path: '/userPwd',
          name: 'UserPwd',
          component: UserPwd
        },
        {
          path: '/userRole',
          name: 'UserRole',
          component: UserRole
        },
        {
          path: '/powerRole',
          name: 'PowerRole',
          component: PowerRole
        },
        {
          path: '/dataPlay',
          name: 'DataPlay',
          component: DataPlay
        },
        {
          path: '/cameraInfo',
          name: 'CameraInfo',
          component: CameraInfo
        },
        {
          path: '/cameraEdit',
          name: 'CameraEdit',
          component: CameraEdit
        },
        {
          path: '/cameraLive',
          name: 'CameraLive',
          component: CameraLive
        },
        {
          path: '/planeLive',
          name: 'PlaneLive',
          component: PlaneLive
        },
        {
          path: '/planeInfo',
          name: 'PlaneInfo',
          component: PlaneInfo
        },
        {
          path: '/planeEdit',
          name: 'PlaneEdit',
          component: PlaneEdit
        },
        {
          path: '/taskInfo',
          name: 'TaskInfo',
          component: TaskInfo
        },
        {
          path: '/taskEdit',
          name: 'TaskEdit',
          component: TaskEdit
        },
        {
          path: '/taskExecute',
          name: 'TaskExecute',
          component: TaskExecute
        },
        {
          path: '/taskExecEdit',
          name: 'TaskExecEdit',
          component: TaskExecEdit
        },
        {
          path: '/taskEvent',
          name: 'TaskEvent',
          component: TaskEvent
        },
        {
          path: '/taskEventEdit',
          name: 'TaskEventEdit',
          component: TaskEventEdit
        },
        {
          path: '/userInfo',
          name: 'UserInfo',
          component: UserInfo
        },
        {
          path: '/userEdit',
          name: 'UserEdit',
          component: UserEdit
        },
        {
          path: '/baseData',
          name: 'BaseData',
          component: BaseData,
          children: [
            {
              path: '/permissionInfo',
              name: 'PermissionInfo',
              component: PermissionInfo
            },
            {
              path: '/roleInfo',
              name: 'RoleInfo',
              component: RoleInfo
            },
            {
              path: '/cameraType',
              name: 'CameraType',
              component: CameraType
            },
            {
              path: '/cameraVender',
              name: 'CameraVender',
              component: CameraVender
            },
            {
              path: '/eventType',
              name: 'EventType',
              component: EventType
            },
            {
              path: '/loadVender',
              name: 'LoadVender',
              component: LoadVender
            },
            {
              path: '/planeLoad',
              name: 'PlaneLoad',
              component: PlaneLoad
            },
            {
              path: '/planeVender',
              name: 'PlaneVender',
              component: PlaneVender
            },
            {
              path: '/planeType',
              name: 'PlaneType',
              component: PlaneType
            },
            {
              path: '/taskType',
              name: 'TaskType',
              component: TaskType
            },
            {
              path: '/unitInfo',
              name: 'UnitInfo',
              component: UnitInfo
            },
            {
              path: '/taskState',
              name: 'TaskState',
              component: TaskState
            }
          ]
        }
      ]
    }
  ]
})
