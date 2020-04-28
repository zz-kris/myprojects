//index.js
//获取应用实例
import utils from '../../utils/index'
var app = getApp()

Page({
  data: {
    title: '我的书架',
    tableID: app.globalData.tableId,
    bookList: [],
    creatingBookName: '', // 当前正在创建的书名
    editingBookName: '', // 当前正在编辑的书名
  },

  onLoad(options) {
    wx.BaaS.auth.loginWithWechat().then(user => {
      this.setData({
        profile: user.toJSON()
      })
      this.fetchBookList()
    })
  },

  // 获取 bookList 数据
  fetchBookList() {
    console.log(this.data.profile)
    utils.getBooks(this.data.profile.id, (res) => {
      this.setData({
        bookList: res.data.objects // bookList array, mock data in mock/mock.js
      })
    })
  },

  // 绑定添加书目的输入框事件，设置添加的数目名称
  bindCreateBookNameInput(e) {
    let that = this
    let value = e.detail.value
    this.setData({
      creatingBookName: value
    })
  },

  // 绑定添加书目的提交按钮点击事件，向服务器发送数据
  createBook(e) {
    utils.addBook(this, (res) => {
      this.setData({
        createBookValue: '',
      })
      console.log(res)
      this.fetchBookList()
    })
  },

  // 绑定每一行书目的“编辑”按钮点击事件，控制输入框和文本显示
  editBookButtonClicked(e) {
    let that = this
    let activeIndex = e.currentTarget.dataset.index
    let bookList = this.data.bookList

    bookList.forEach((elem, idx) => {
      if (activeIndex == idx) {
       elem.isEditing = true
      } else {
        elem.isEditing = false
      }
    })

    that.setData({
      bookList
    })
  },

  // 绑定每一行书目的输入框事件，设定当前正在编辑的书名
  bindEditBookNameInput(e) {
    let bookName = e.detail.value
    this.setData({
      editingBookName: bookName,
    })
  },

  // 绑定修改书目的提交按钮点击事件，向服务器发送数据
  updateBook(e) {
    this.setData({
      curRecordId: e.target.dataset.bookId,
    })

    utils.updateBook(this, (res) => {
      this.fetchBookList()
      this.setData({curRecordId: ''})
    })
  },

  // 删除当前行的书目
  deleteBook(e) {
    this.setData({
      curRecordId: e.target.dataset.bookId,
    })
    utils.deleteBook(this, (res) => {
      this.fetchBookList()
      this.setData({curRecordId: ''})
    })
  },

})