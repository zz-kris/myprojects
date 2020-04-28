// pages/user_praw/user_praw.js
var timer;//计时器
var searchArray = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arr:['哈','西瓜','黄焖鸡米饭','胡辣汤','煎饼果子',],
    testNum :true,
    a:'',
    searchTxt: '',
    button:'开始'

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
   
    if (wx.getStorageSync("arr")){
      that.setData({
        arr: wx.getStorageSync("arr").reverse(),
        isHide:true
      })
    }else{
      that.setData({
        arr:['哈','西瓜','黄焖鸡米饭','胡辣汤','煎饼果子'],
        isHide:false
      })
    }

  },
  // 开始&暂停
  getgo(){
    var that=this
    if(that.data.testNum){
        that.start();
        that.setData({
          testNum:false,
          button:'暂停'
        })
    }else{
        that.stop();
        that.setData({
          testNum:true,
          button:'开始'
        })
    }
  },
  start(){
    var that=this
      timer = setInterval(function(){
          var num = that.random(0,that.data.arr.length - 1);
          that.setData({
            a:that.data.arr[num]
          })
      },20)
  },
  stop(){
      clearInterval(timer);      
  },
  random(a,b){
      var randomNum = Math.round(Math.random() * (b - a) + a);
      return randomNum;
  },     
  clearInputEvent: function () {
    this.setData({
      searchTxt: ''
    })
  },
  input_txt: function(e) { //输入框输入事件
    var that = this;
    that.setData({
      searchTxt: e.detail.value.trim()
    })
  },
  btn_search: function() { //搜索确认事件
    var that = this;
    if (that.data.searchTxt == "") {
      wx.showToast({
        title: '添加内容不为空',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    that.buildHistory(that.data.searchTxt) //调用历史记录事件
    // this.onLoad()
      
  
  }, 
  //建立搜索记录
  buildHistory: function(e) {
    var that=this
    if (that.data.arr.length > 0 && that.data.arr.length < 50) { //小于指定数量之内
      let index = that.data.arr.indexOf(e)
      if (index < 0) { //数据不存在时直接追加
        searchArray = that.data.arr.concat(e)
        console.log(searchArray)
        that.setData({
          arr:searchArray
        })
        wx.setStorageSync("arr", that.data.arr)

      } else { //数据已存在时调到头部
        searchArray = that.data.arr
        searchArray.splice(index, 1)
        console.log(searchArray)
        searchArray = searchArray.concat(e);
        that.setData({
          arr:searchArray
        })
        wx.setStorageSync("arr", that.data.arr)
      }
    } else if (that.data.arr.length >= 50) { //大于指定数量
      let index1 = that.data.arr.indexOf(e)
      if (index1 > -1) { //数据已存在时掉到头部
        searchArray = that.data.arr
        searchArray.splice(index1, 1)
        searchArray = searchArray.concat(e);
        that.setData({
          arr:searchArray
        })
        wx.setStorageSync("arr", that.data.arr)
        return;
      }
      //数据不存在时删除第一个后追加
      searchArray = that.data.arr
      searchArray.splice(0, 1)
      searchArray = searchArray.concat(e);
      that.setData({
        arr:searchArray
      })
      wx.setStorageSync("arr", that.data.arr)
    } else { //无数据时候直接追加
      searchArray = searchArray.concat(e)
      that.setData({
        arr:searchArray
      })
      wx.setStorageSync("arr", that.data.arr)
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