<template>
<div>
<el-upload
ref="upload"
:on-success="upSuccess"
:on-error="upError"
:headers="hearder"
  :action="fileUrl"
  list-type="picture-card"
  :on-preview="getImgClick"
  :before-remove="removeClick">
  <i class="el-icon-plus"></i>
</el-upload>

<el-dialog :visible.sync="dialogVisible">
  <img width="100%" :src="dialogImageUrl" alt="">
</el-dialog>
  <el-carousel v-show="images.length>0" class="fl" :autoplay="false" arrow="always" :height="carHeight">
    <el-carousel-item v-for="item in images" :key="item.id" style="height: 100%">
      <img :src="imgUrl+item.imgPath" alt="" style="width:auto;height:auto;max-width:100%;max-height:100%">
    </el-carousel-item>
  </el-carousel>
</div>
</template>
<script>
import { imgServiceUrl, baseUrl } from '../../../static/js/common.js'
let _this
export default {
  created: function () {
    let height = document.body.clientHeight
    this.carHeight = (height - 60 - 150 - 50) + 'px'
  },
  mounted () {
    _this = this
    let _id = this.$route.query.id
    _this.imgUrl = imgServiceUrl
    _this.eventId = _id.id
    _this.fileUrl = (baseUrl + '/EventImg/Upload?id=' + _id.id)
    _this.hearder = {Authorization: _this.axios.defaults.headers.common['Authorization']}
    _this.eventId = _id.id
    _this.searchClick()
  },
  data () {
    return {
      carHeight: '',
      fileUrl: '',
      imgUrl: '',
      hearder: {},
      dialogImageUrl: '',
      dialogVisible: false,
      images: [],
      eventId: ''
    }
  },
  methods: {
    searchClick () {
      _this.axios.get('/EventImg/select/' + _this.eventId).then((response) => {
        let data = response.data
        if (data.state === '0') {
          _this.images = data.table
        } else {
          _this.$message.error('获取图片数据出错：' + data.msg)
        }
      })
    },
    upSuccess (response, file, fileList) {
      if (response.state === '-1') {
        _this.$message.error('对不起，上传失败：' + response.msg)
      } else {
        _this.$message.success('上传成功')
        _this.images.push({imgPath: response.path, id: response.id})
        file.imgId = response.id
      }
    },
    upError (er, file, fileList) {
      _this.$message.error('对不起，上传失败：' + er)
    },
    removeClick (file, fileList) {
      _this.axios.delete('/EventImg/del/' + file.imgId).then((response) => {
        _this.$message.success('删除成功')
        let index = _this.images.indexOf(file.imgId)
        _this.images.splice(index, 1)
      }).catch((err) => {
        _this.$message.error('对不起，删除失败：' + err)
      })
    },
    getImgClick (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }
  }
}
</script>

<style>
.fl{
  text-align: center;
  margin: auto;
  margin-top: 10px;
}
</style>
