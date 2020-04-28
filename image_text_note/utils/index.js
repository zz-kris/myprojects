// 书本列表
let getarticle = (cb) => {
  let tableName = 'article',
    Books = new wx.BaaS.TableObject(tableName),
    query = new wx.BaaS.Query()

  // query.compare('created_by', '=', uid)
  Books.find()
    .then(res => cb(res))
    .catch(err => console.dir(err))
}
// 便签列表
let getmemos = (uid, cb) => {
  let tableName = 'memo',
    Books = new wx.BaaS.TableObject(tableName),
    query = new wx.BaaS.Query()

  query.compare('created_by', '=', uid)
  Books.setQuery(query).find()
    .then(res => cb(res))
    .catch(err => console.dir(err))
}
// 便签详情
let getmemodetail = (data, cb) => {
  console.log(data)
  let tableName = data.tableName,
    Books = new wx.BaaS.TableObject(tableName),
    query = new wx.BaaS.Query()

  query.compare('id', '=', data.id)
  Books.setQuery(query).find()
    .then(res => cb(res))
    .catch(err => console.dir(err))
}
// 创建书签
let addBook = (ctx, cb) => {
console.log(ctx)
  let tableName = getApp().globalData.tableName,
    Books = new wx.BaaS.TableObject(tableName),
    Book = Books.create(),
    bookName = ctx.data.creatingBookName

  let data = {
    bookName,
  }

  Book.set(data)
    .save()
    .then(res => cb(res))
    .catch(err => console.dir(err))

}
// 创建便签
let addmemo = (ctx, cb) => {
  console.log(ctx)
    let tableName = ctx.tableName,
      Books = new wx.BaaS.TableObject(tableName),
      Book = Books.create(),
      content = ctx.content

  
    let data = {
      content,
    }
  
    Book.set(data)
      .save()
      .then(res => cb(res))
      .catch(err => console.dir(err))
  
}
// 修改书签
let updateBook = (ctx, cb) => {
  console.log(ctx)
  let tableName = getApp().globalData.tableName,
    recordId = ctx.data.curRecordId,
    bookName = ctx.data.editingBookName

  let Books = new wx.BaaS.TableObject(tableName),
    Book = Books.getWithoutData(recordId)

  let data = {
    bookName
  }

  Book.set(data)
    .update()
    .then(res => cb(res))
    .catch(err => console.dir(err))
}
// 修改便签
let updateMemo = (ctx, cb) => {
  console.log(ctx)
  let tableName = ctx.tableName,
    recordId = ctx.id,
    content = ctx.content

  let Books = new wx.BaaS.TableObject(tableName),
    Book = Books.getWithoutData(recordId)

  let data = {
    content
  }

  Book.set(data)
    .update()
    .then(res => cb(res))
    .catch(err => console.dir(err))
}

let deleteBook = (ctx, cb) => {
  let tableName = getApp().globalData.tableName,
    recordId = ctx.data.curRecordId

  let Books = new wx.BaaS.TableObject(tableName)

  Books.delete(recordId)
    .then(res => cb(res))
    .catch(err => console.dir(err))
}
// let deleteMemoQ = (ctx, cb) => {

//   let tableName = ctx.tableName,
//     query = new wx.BaaS.Query()

//     // query.compare(id, '=', ctx.array)
//     query.in(id,  ctx.array)
//   let Books = new wx.BaaS.TableObject(tableName)
//   Books.delete(query).then(res => {
//     console.log(res)
//   }, err => {
//     console.log(err)
//   })

// }
let deleteMemo = (ctx, cb) => {

  let tableName = ctx.tableName,
  recordId = ctx.id

let Books = new wx.BaaS.TableObject(tableName)

Books.delete(recordId)
  .then(res => cb(res))
  .catch(err => console.dir(err))

}

module.exports = {
  getarticle,     //书本列表
  getmemos,    //便签列表
  addBook,    //创建书本
  addmemo,    //创建便签
  updateBook, //修改书本名
  deleteBook,
  getmemodetail, //便签详情
  updateMemo, //修改便签
  deleteMemo,
  // deleteMemoQ
}