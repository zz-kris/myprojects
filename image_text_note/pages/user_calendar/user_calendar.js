// pages/user_calendar/user_calendar.js
Page({

  data: {
      date: '2020-04-28',
      week: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      lastMonth: 'lastMonth',
      nextMonth:'nextMonth',
      selectVal: ''
  },

  //组件监听事件
  select(e) {
      // console.log(e)
      this.setData({
          selectVal:e.detail
      })
  },

  toggleType(){
      this.selectComponent('#Calendar').toggleType();
  },
  onLoad(){
      var that=this
      if (wx.getStorageSync("date")){
        that.setData({
          date: wx.getStorageSync("date")
        })
      }
    // var kssj="1999-09-18 21:00:00"
    // var kssj="2020-04-28 17:00:00"
    // var jssj="2020-04-28 18:00:00"
    // var temp_kssj=new Date(kssj.replace(/-/g,"/"))
    // var temp_jssj=new Date(jssj.replace(/-/g,"/"))
    // var temp_jssj=new Date()
    // var day=parseInt((temp_jssj.getTime()-temp_kssj.getTime())/(1000*60*60*24))
    // console.log(day)
    // setInterval(function() {
    //     var t1 = new Date("2020/04/28 17:00:00")
    //     var t2 = new Date()
    //     var t = new Date(t2 - t1 + 16 * 3600 * 1000)
    //     that.setData({
    //         d: parseInt(t.getTime() / 1000 / 3600 / 24),
    //         h: t.getHours(),
    //         m: t.getMinutes(),
    //         s: t.getSeconds()
    //     })
    // }, 1000)
    that.getData()
  },
  getData(){
      var that=this
    setInterval(function() {
        var t1 = new Date(that.data.date.replace(/-/g,"/"))
        var t2 = new Date()
        var t = new Date(t2 - t1 + 16 * 3600 * 1000)
        that.setData({
            d: parseInt(t.getTime() / 1000 / 3600 / 24),
            h: t.getHours(),
            m: t.getMinutes(),
            s: t.getSeconds()
        })
    }, 1000)
  },
  // 出生日期
  bindDateChange: function(e) {
    var that = this
    console.log(e.detail.value)
    this.setData({
      date: e.detail.value
    })
    wx.setStorageSync("date", that.data.date)
    that.getData()
    

  },



})