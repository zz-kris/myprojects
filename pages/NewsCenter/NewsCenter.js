// pages/NewsCenter/NewsCenter.js
import utils from '../../utils/index';

var util= require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: 1,
    page: 1,
    flag: true, //记录是否请求数据的状态
    scrolltop: null, //滚动位置
    hiddenLoading: false,
    news:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    this.fetchmemoList()
  },
  // 获取 memo 数据
  fetchmemoList() {
    var that=this
    utils.getarticle((res) => {
      
     
      var list=res.data.objects
      let array = [];

      for (var i = 0; i < list.length - 1; i++) {
          for (var j = i + 1; j < list.length; j++) {
              if (list[i].updated_at < list[j].updated_at) {
                  var p = list[i];
                  list[i] = list[j];
                  list[j] = p;
              }
          }
      }
      list.map((item, index) => {
        item.updated_at=util.formatData(item.updated_at,'Y年M月D日 h:m:s')
        
        array.push(
          Object.assign({}, item)
        )
      });
      that.setData({
        news: array
      })
      console.log(that.data.news)
    })
  },


  // 新闻详情
  getdetail(e){
    wx.navigateTo({
      url: '/pages/NewCenter_detail/NewCenter_detail?id=' + e.currentTarget.dataset.id,
    })
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
  scrollLoading: function(e) { //滚动加载
    //根据请求状态flag请求数据
    // if (this.data.flag) {
    //   this.getData();
    // }
  },
  scrollHandle: function(e) { //滚动事件
    // this.setData({
    //   scrolltop: e.detail.scrollTop
    // })
    // console.log(e)
    // 防抖，优化性能
    // 当滚动时，滚动条位置距离页面顶部小于设定值时，触发下拉刷新
    // 通过将设定值尽可能小，并且初始化scroll-view组件竖向滚动条位置为设定值。来实现下拉刷新功能，但没有官方的体验好
    // clearTimeout(this.timer)
    // if (e.detail.scrollTop < this.data.scrollTop) {
    //   this.timer = setTimeout(() => {
    //     this.getData()
    //   }, 350)
    // }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var that = this;
    // that.data.news = [];
    // wx.showLoading({
    //   title: '数据加载中...',
    // });
    // wx.showNavigationBarLoading() //在标题栏中显示加载
    // setTimeout(function() {
    //   that.data.page = 1;
    //   that.getData();
    //   // 隐藏导航栏loading
    //   wx.hideNavigationBarLoading()
    //   wx.hideLoading();
    //   //停止下拉刷新
    //   wx.stopPullDownRefresh()

    // }, 1500);
    wx.showNavigationBarLoading();
     setTimeout(function() {
      that.fetchmemoList()
      // 隐藏导航栏loading
      wx.hideNavigationBarLoading()
      wx.hideLoading();
      //停止下拉刷新
      wx.stopPullDownRefresh()

    }, 1500);
    
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