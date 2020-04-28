// pages/user_memo/user_memo.js
//获取应用实例
import utils from '../../utils/index'
var util =require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    min: 0,
    max: 20,
    formats: {},
    readOnly: false,
    placeholder: '在这里尽情创作吧！',
    editorHeight: 400,
    keyboardHeight: 0,
    isIOS: false,
    editValue:'',
    isadd:false,
    id:1,
    objects:{}
  },
  readOnlyChange() {
    this.setData({
      readOnly: !this.data.readOnly
    })
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    console.log(options)
    if(options.id){
      that.setData({
        isadd:false,
        id:options.id
      })
    }else{
      that.setData({
        isadd:true
      }) 
    }

    const platform = wx.getSystemInfoSync().platform
    const isIOS = platform === 'ios'
    this.setData({ isIOS})
    
    this.updatePosition(0)
    let keyboardHeight = 0
    wx.onKeyboardHeightChange(res => {
      if (res.height === keyboardHeight) return
      const duration = res.height > 0 ? res.duration * 1000 : 0
      keyboardHeight = res.height
      setTimeout(() => {
        wx.pageScrollTo({
          scrollTop: 0,
          success() {
            that.updatePosition(keyboardHeight)
            that.editorCtx.scrollIntoView()
          }
        })
      }, duration)

    })

  },
  updatePosition(keyboardHeight) {
    const toolbarHeight = 50
    const { windowHeight, platform } = wx.getSystemInfoSync()
    let editorHeight = keyboardHeight > 0 ? (windowHeight - keyboardHeight - toolbarHeight) : windowHeight
    this.setData({ editorHeight, keyboardHeight })
  },
  calNavigationBarAndStatusBar() {
    const systemInfo = wx.getSystemInfoSync()
    const { statusBarHeight, platform } = systemInfo
    const isIOS = platform === 'ios'
    const navigationBarHeight = isIOS ? 44 : 48
    return statusBarHeight + navigationBarHeight
  },
  onEditorReady() {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context
      if(!that.data.isadd){
        that.loadData()
      }
     
    }).exec()
  },
  blur() {
    this.editorCtx.blur()
  },
  loadData(){
    var that=this
    console.log(that.data.id)
    var data={
      id: that.data.id,
      tableName:'memo'

    }
    util.showLoading("加载中...")
    utils.getmemodetail(data, (res) => {
     util.hideLoading()
      console.log(res)
      that.setData({
        objects:res.data.objects[0],
        editValue:res.data.objects[0].content
      })
      console.log(res.data.objects[0])
      //初始化富文本编辑器方法
      that.editorCtx.setContents({
        html: res.data.objects[0].content,
        success: function () {
          console.log('insert html success')
        }
      })

    })

    

  },

  format(e) {
    let { name, value } = e.target.dataset
    if (!name) return
    console.log('format', name, value)
    this.editorCtx.format(name, value)

  },
  onStatusChange(e) {
    const formats = e.detail
    this.setData({ formats })
  },
  insertDivider() {
    this.editorCtx.insertDivider({
      success: function () {
        console.log('insert divider success')
      }
    })
  },
  clear() {
    this.editorCtx.clear({
      success: function (res) {
        console.log("clear success")
      }
    })
  },
  removeFormat() {
    this.editorCtx.removeFormat()
  },
  insertDate() {
    const date = new Date()
    const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    this.editorCtx.insertText({
      text: formatDate
    })
  },
  insertImage() {
    const that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log(res.tempFilePaths[0])
        let MyFile = new wx.BaaS.File()
        let fileParams = {filePath: res.tempFilePaths[0]}
        let metaData = {categoryName: '便签'}

        MyFile.upload(fileParams, metaData).then(res => {
          // 上传成功
          let data = res.data.path  // res.data 为 Object 类型
          console.log(data)
          that.editorCtx.insertImage({
            src: data,
            data: {
              id: 'abcd',
              role: 'god'
            },
            width: '80%',
            success: function () {
              console.log('insert image success')
            }
          })
        }, err => {
          // HError 对象
        })
      }
    })
  },
  


  onEditValue(e){
    console.log(e.detail.html)
    this.setData({
      editValue:e.detail.html
    })
  },
  
  bindFormSubmit(){
    var that=this
    if(that.data.editValue == ''){
      wx.showToast({
        title: '标签内容不可以为空',
        icon: 'none',
        duration: 2000
      })
      return
    }
console.log(that.data.isadd)
    if(that.data.isadd){
      console.log("新便签")

      var data={
        content: that.data.editValue,
        tableName:'memo'

      }
      utils.addmemo(data, (res) => {
      
        console.log(res)
        if(res.statusCode == 201){
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 2000,
            success() {
              that.setData({
                isadd:false,
                id: res.data.id
              })

            }
          })
        }

      })
    }else{
      console.log("编辑")
      console.log(that.data.editValue)
      var data={
        content: that.data.editValue,
        tableName:'memo',
        id: that.data.id

      }
      utils.updateMemo(data, (res) => {
      
        console.log(res)
        if(res.statusCode == 200){
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 2000
          })
        }

      })



    }


    
    
  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})