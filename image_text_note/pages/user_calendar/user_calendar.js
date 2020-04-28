// pages/user_calendar/user_calendar.js
Page({

  data: {
      value: '2018-11-11',
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
  }


})