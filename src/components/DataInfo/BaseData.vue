<template>
<el-row :gutter="20">
  <el-col :span="4">
    <el-card class="box-card" :style="cardStyle">
      <div slot="header">
        <span> <strong>基础数据分类</strong></span>
      </div>
      <div v-for="item in baseDataType" :key="item.name" class="text item">
        <router-link :to="item.path" @click.native="typeClick(item.name)">{{ item.name }}</router-link>
      </div>
    </el-card>
  </el-col>
  <el-col :span="20">
    <el-card class="box-card" :style="cardStyle">
      <div slot="header">
        <span><strong> {{ currentType }} </strong> </span>
      </div>
      <router-view/>
    </el-card>
  </el-col>
</el-row>
</template>
<script>
import { getBaseDataType } from '../../../static/js/common.js'
let _this
export default {
  methods: {
    typeClick (name) {
      _this.currentType = name
    }
  },
  mounted: function () {
    _this = this
  },
  created: function () {
    this.baseDataType = getBaseDataType()
    let height = document.body.clientHeight
    this.cardStyle = 'height: ' + (height - 105) + 'px; overflow: auto;'
    this.currentType = this.baseDataType[0].name
    this.$router.push(this.baseDataType[0].path)
  },
  date () {
    return {
      currentType: '',
      cardStyle: '',
      baseDataType: undefined
    }
  }
}
</script>
<style>
.text {
  font-size: 14px;
}
.item {
  margin-bottom: 18px;
}
a{
  text-decoration: none;
  color: #333
}
</style>
