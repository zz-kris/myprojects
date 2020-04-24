// pages/user_praw/user_praw.js
var timer;//计时器
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arr:['哈','你好','开心','美丽'],
    testNum :true,
    a:''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  getgo(){
    var that=this
    if(that.data.testNum){
        console.log(1);
        that.start();
        that.setData({
          testNum:false
        })
    }
    else{
        console.log(0);
        that.stop();
        that.setData({
          testNum:true
        })
    }

  },
  start(){
    var that=this
      timer = setInterval(function(){
          var num = that.random(0,that.data.arr.length - 1);
          console.log(num)
          that.setData({
            a:that.data.arr[num]
          })
      },50)
  },
  stop(){
      clearInterval(timer);      
  },
  random(a,b){
      var randomNum = Math.round(Math.random() * (b - a) + a);
      return randomNum;
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