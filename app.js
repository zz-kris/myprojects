//app.js
App({
  onLaunch: function() {
    // 引入 BaaS SDK
    // require('./utils/sdk-wechat.2.0.8-a')
    wx.BaaS = requirePlugin('sdkPlugin')

    //让插件帮助完成登录、支付等功能
    wx.BaaS.wxExtend(wx.login,
     wx.getUserInfo,
     wx.requestPayment)

    let clientId = this.globalData.clientId
    wx.BaaS.init(clientId, {autoLogin: true})
  },

  globalData: {
    clientId: 'de3a2ed097ec80912192', // 从 BaaS 后台获取 ClientID
    tableName: 'bookshelf', // 从 https://cloud.minapp.com/dashboard/ 管理后台的数据表中获取
  }
})
