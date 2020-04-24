
Page({
  /**
   * 页面的初始数据
   */
  data: {
    coins:0, // 金币
    isLogin:false,
    isMobile: false,
    tankuang: false,
    userInfo: {},
    addressInfo: {},
    isAuth: false,
    dis: false,
    is_businesses: false,
    is_open:false,
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    var userInfo=wx.getStorageSync('userInfo')
    if(userInfo){
      that.setData({
        userInfo:userInfo,
        isLogin:true,
        tankuang:false
      })
    }else{
       that.setData({
        isLogin:false,
        tankuang:true
      })

    }
  //   wx.BaaS.auth.loginWithWechat().then(user => {
  //     // user 包含用户完整信息，详见下方描述
  //     console.log(user._attribute)
  //     that.setData({
  //       userInfo:user._attribute,
  //       isLogin:true
  //     })
  //     wx.setStorage({
  //       key: "userInfo",
  //       data: user._attribute
  //     })

  //   }, err => {
  //     console.log("错误")
  //     that.setData({
  //       isLogin:false,
  //       tankuang:true
  //     })
  //     // **err 有两种情况**：用户拒绝授权，HError 对象上会包含基本用户信息：id、openid、unionid；其他类型的错误，如网络断开、请求超时等，将返回 HError 对象（详情见下方注解）
  // })
		

   
    // console.log(wx.getStorageSync('userInfo'))

  },

  // 取消登录
  cancelLogin(){
    var that = this;
    that.setData({
      tankuang:false
    })
  },
  // 点击授权登录
  getAuth(){
    this.setData({
      tankuang:true
    })
  },
  userInfoHandler(data) {
    var that=this
    wx.BaaS.auth.loginWithWechat(data).then(user => {
        // user 包含用户完整信息，详见下方描述
        console.log(user._attribute)
        that.setData({
          userInfo:user._attribute,
          isLogin:true,
          tankuang:false
        })
        wx.setStorage({
          key: "userInfo",
          data: user._attribute
        })
        // that.onLoad()

      }, err => {
        console.log("错误")
        that.setData({
          isLogin:false,
          tankuang:false
        })
        // **err 有两种情况**：用户拒绝授权，HError 对象上会包含基本用户信息：id、openid、unionid；其他类型的错误，如网络断开、请求超时等，将返回 HError 对象（详情见下方注解）
    })
  },

  

  // 绑定手机号
  goBind() {
    wx.navigateTo({
      url: '/pages/mobileBind/mobileBind',
    })
  },
  
  // 我的便签
  getmemo: function() {
    if (this.data.isLogin == false) {
      this.setData({
        tankuang: true
      })
      return
    }
    else{
    wx.navigateTo({
      url: '/pages/memo_detail/memo_detail',
    })
    }
  },
  // 写便签
  getmemodetail(){
    if (this.data.isLogin == false) {
      this.setData({
        tankuang: true
      })
      return
    }
    else{
    wx.navigateTo({
      url: '/pages/user_memo/user_memo',
    })
    }

  },
  // 天气
  getweather(){
    if (this.data.isLogin == false) {
      this.setData({
        tankuang: true
      })
      return
    }
    else{
    wx.navigateTo({
      url: '/pages/weather/weather',
    })
    }

  },
  // 随机
  getpraw(){
    if (this.data.isLogin == false) {
      this.setData({
        tankuang: true
      })
      return
    }
    else{
    wx.navigateTo({
      url: '/pages/user_praw/user_praw',
    })
    }

  },


  // 地址信息
  add: function() {
    wx.navigateTo({
      url: '/pages/add/add',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
   
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})