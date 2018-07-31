<template>
<el-container v-bind:style="mainStyle">
  <el-header style="text-align: right; font-size: 12px; border: 1px solid #eee">
      <el-dropdown trigger="click" @command="dropItemClick">
        <i class="el-icon-setting" style="margin-right: 15px"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="upPwd">密码修改</el-dropdown-item>
          <el-dropdown-item command="loginOut">退出登录</el-dropdown-item>
      </el-dropdown-menu>
      </el-dropdown>
      <span>{{viewName}}</span>
    </el-header>
  <el-container>
    <el-aside width="220px;">
    <div style="margin-left: 23px;">
      <i v-bind:class="openClass" style="" @click="triggerOpen"></i>
    </div>
    <el-menu style="border: 0px" :collapse="isCollapse" router>
      <el-submenu :index="item.permissonSeq+''" v-for="item in menuData" :key="item.id">
        <template slot="title"><i :class="item.icon" v-if="item.icon"></i><span slot="title">{{item.permissonName}}</span></template>
          <el-menu-item :index="'/'+child.routerName" v-for="child in item.childrens" :key="child.id">{{child.permissonName}}</el-menu-item>
      </el-submenu>
    </el-menu>
  </el-aside>
    <el-main style="margin: 0px; border-left: 1px solid #eee">
      <router-view/>
    </el-main>
  </el-container>
  <!-- <el-footer style="background-color:red">Footer</el-footer> -->
</el-container>
</template>
<style>
.el-header {
  line-height: 60px;
}
</style>
<script>
import {getCookie, setCookie, userInfoId, userInfoName, cookieAuth} from '../../static/js/common.js'
let _this
export default {
  created: function () {
    let height = document.body.clientHeight
    this.mainStyle = 'height: ' + height + 'px; border: 1px solid #eee; background-color: #ffffff'
  },
  mounted: function () {
    _this = this
    let viewName = getCookie(userInfoName)
    this.viewName = viewName
    _this.searchMenu()
  },
  methods: {
    searchMenu: () => {
      _this.axios.post('/Permisson/getUserPermisson', {id: getCookie(userInfoId)}).then((response) => {
        let data = response.data
        if (data.state === '0') {
          _this.menuData = data.table
        } else {
          _this.$message.error('获取菜单信息出错：' + data.msg)
        }
      })
    },
    dropItemClick (command) {
      if (command === 'upPwd') {
        this.$router.push({name: 'UserPwd', query: {id: {id: 14}}})
      } else if (command === 'loginOut') {
        setCookie(userInfoId, '', -1)
        setCookie(userInfoName, '', -1)
        setCookie(cookieAuth, '', -1)
        this.$router.push({name: 'Login'})
      }
    },
    triggerOpen: function () {
      this.isCollapse = !this.isCollapse
      this.openClass = this.openClass === 'el-icon-d-arrow-right' ? 'el-icon-d-arrow-left' : 'el-icon-d-arrow-right'
    }
  },
  data () {
    return {
      menuData: [],
      viewName: '未登录',
      isCollapse: false,
      mainStyle: '',
      openClass: 'el-icon-d-arrow-right'
    }
  }
}
</script>
