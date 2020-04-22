// pages/memo_detail/memo_detail.js
import utils from '../../utils/index';

 var util= require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ch: false,
    Width: '446',
    page:1,
    list:[],
    selectilall: false,
    select:[],
    del:false,
    userInfo:{}
   

  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
    this.fetchmemoList()
   
  },
  // 获取 memo 数据
  fetchmemoList() {
    var that=this
    utils.getmemos(this.data.userInfo.id, (res) => {
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
        var src= /\bsrc\b\s*=\s*[\'\"]?([^\'\"]*)[\'\"]?/i ;
         //获取图片地址
         var imgsrc=''
        if(item.content.match(src) !== null){
          var img=item.content.match(src)
          imgsrc=img[1]
        }else{
          imgsrc=''
        }
        array.push(
          Object.assign({}, item, { checked: false },{imgsrc:imgsrc})
        )
      });
      that.setData({
        list: array
      })
    })
  },
  //单选
  select: function (e) {
    let selectValue = e.currentTarget.dataset.name
    let index = e.currentTarget.dataset.index;
    let list = this.data.list

    let newli = 'list[' + index + '].checked';
    this.setData({
      [newli]: !this.data.list[index].checked
    })
    let li2 = this.data.list[index].checked
    if (li2 == false) {
      for (let i in this.data.select) {
        if (this.data.select[i] == selectValue) {
          this.data.select.splice(i, 1);
        }
      }
      this.setData({
        selectilall: false
      })
    } else {
      this.data.select.push(selectValue);
    }


    var arr = []
    var arrs = []
    for (var i in this.data.list) {
      arrs.push(i)
      if (this.data.list[i].checked == true) {
        this.setData({
          del: true
        })
      } else {
        arr.push(i)
      }
    }
    if (arrs.length == arr.length) {
      this.setData({
        del: false
      })
    }
    // console.log(this.data.select)

  },
  //全选，取消全选
  selectAll: function (e) {
    let list = this.data.list;
    let selectilall = this.data.selectilall;
    if (selectilall == false) {
      for (let i = 0; i < list.length; i++) {
        let newli = 'list[' + i + '].checked';
        this.data.select.push(list[i].id);
        this.setData({
          [newli]: true,
          selectilall: true
        })
      }
    } else {
      for (let i = 0; i < list.length; i++) {
        let newli = 'list[' + i + '].checked';
        this.setData({
          [newli]: false,
          selectilall: false,
          select:[]
        })
      }
    }

    var arr = []
    var arrs = []
    for (var i in this.data.list) {
      arrs.push(i)
      if (this.data.list[i].checked == true) {
        this.setData({
          del: true
        })
      } else {
        arr.push(i)
      }
    }
    if (arrs.length == arr.length) {
      this.setData({
        del: false
      })
    }
  },
  // 删除
  // goDel() {
  //   var that = this;

  //   var checkArr = [];
  //   for (var i in this.data.list) {
  //     if (this.data.list[i].checked == true) {
  //       checkArr.push(this.data.list[i].id)
  //     }
  //   }
  //   console.log(checkArr)
  //   var data={
  //     tableName:'memo',
  //     array: checkArr

  //   }
  //   utils.deleteMemoQ(data, (res) => {
    
  //     console.log(res)
  //     if(res.statusCode == 200){
  //       wx.showToast({
  //         title: '删除成功',
  //         icon: 'none',
  //         duration: 2000
  //       })
  //     }

  //     // this.fetchBookList()
  //   })

    
  // },

  hideModal: function () {
    this.ch = (!this.ch);
    if (this.ch == false) {
      this.setData({
        Width: '446'
      })
    } else {
      this.setData({
        Width: '386'
      })
    }
    this.setData({
      ch: this.ch
    })
  },

  goDetail(e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/user_memo/user_memo?id=' + e.currentTarget.dataset.id,
    })
  },
  getaddmemo(){
    wx.navigateTo({
      url: '/pages/user_memo/user_memo'
    })
  },
  // 删除
  getDelete(e){
    console.log(e.currentTarget.dataset.id)
    var that=this
    var data={
      tableName:'memo',
      id: e.currentTarget.dataset.id

    }
    util.showLoading("加载中")
    utils.deleteMemo(data, (res) => {
      console.log(res)
      util.hideLoading()
      if(res.statusCode == 204){
        wx.showToast({
          title: '删除成功',
          icon: 'none',
          duration: 2000,
          success:function(){
            that.fetchmemoList()
          }
        })
      }
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
    this.fetchmemoList()
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