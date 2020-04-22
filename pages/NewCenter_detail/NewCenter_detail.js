// pages/NewCenter_detail/NewCenter_detail.js
import utils from '../../utils/index'
var util =require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    console.log(options.id)
     var data={
      id: options.id,
      tableName:'article'

    }
    util.showLoading("加载中...")
    utils.getmemodetail(data, (res) => {
     util.hideLoading()
     let content = res.data.objects[0].content;
         //重点是这句话 res.content是从后台获取的数据 进行正则匹配的
      res.data.objects[0].content = content.replace(/\<img/gi, '<img style="width:100%;height:auto" ')
      that.setData({
        detail:res.data.objects[0]
      })
      

    })


  },
  copy: function (e) {
    var that = this;
    var text = e.currentTarget.dataset.text;
    console.log(e);
    wx.setClipboardData({
      data: text,
      success: function (res) {
        // wx.hideToast();    //打开可不显示提示框
        wx.getClipboardData({
          success (res) {
            console.log(res.data) // data
          }
        })
      }
    });
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