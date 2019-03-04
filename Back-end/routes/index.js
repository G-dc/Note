let express = require('express')
let router = express.Router()
let models = require('../mysql_db/db')
let mysql = require('mysql')
let $ = require('../mysql_db/sqlMap')

// 连接数据库
let conn = mysql.createConnection(models.mysql)

conn.connect()

let jsonShow = (res, ret, options) => {
  if (typeof ret === 'undefined') {
    res.json({
      code: 416,
      msg: '操作失败'
    })
  } else {
    if (options) {
      if (options === 'getNoteList' || options === 'getRecycleBinNoteList' || options === 'getNoteListByType') {
        let _arr = []
        let _tmp = {}
        if (ret && ret.length) {
          ret.forEach((item, index) => {
            _tmp.id = item.Note_Id
            _tmp.title = item.Note_Name
            _tmp.content = item.Note_Content
            _tmp.time = item.Note_Time
            _tmp.type = item.Note_Type
            _arr.push(_tmp)
            _tmp = {}
          })
          res.json({
            code: 200,
            msg: '操作成功',
            data: _arr
          })
        } else {
          res.json({
            code: 410,
            msg: '查询无结果',
            data: {}
          })
        }
      } else if (options === 'getNoteOne') {
        let _tmp = {}
        if (ret && ret.length) {
          ret.forEach(item => {
            _tmp.id = item.Note_Id
            _tmp.title = item.Note_Name
            _tmp.content = item.Note_Content
            _tmp.time = item.Note_Time
            _tmp.type = item.Note_Type
          })
          res.json({
            code: 200,
            msg: '操作成功',
            data: _tmp
          })
        } else {
          res.json({
            code: 410,
            msg: '查询无结果',
            data: {}
          })
        }
      } else if (options === 'getNoteTypeList') {
        let _arr = []
        let _tmp = {}
        if (ret && ret.length) {
          ret.forEach(item => {
            _tmp.id = item.Type_Id
            _tmp.name = item.Type_Name
            _arr.push(_tmp)
            _tmp = {}
          })
          res.json({
            code: 200,
            msg: '操作成功',
            data: _arr
          })
        } else {
          res.json({
            code: 410,
            msg: '查询无结果',
            data: {}
          })
        }
      } else {
        res.json({
          code: 200,
          msg: '操作成功',
          data: ret
        })
      }
    } else {
      res.json({
        code: 200,
        msg: '操作成功',
        data: ret
      })
    }
  }
}


// 新增Note
router.post('/addNote', (req, res) => {
  let addTypeSql = $.editNoteType.add
  let typeSql = $.editNoteType.selectOne
  let addNoteSql = $.editNote.add
  let params = req.body

  conn.query(typeSql, [params.type], (err, result) => {
    if (err) {
      console.log(err)
    } else {
      if (result.length === 0) {
        conn.query(addTypeSql, [params.type], (err1, result1) => {
          if (err1) {
            console.log(err1)
          } else {
            conn.query(addNoteSql, [params.title, params.time, params.content, params.type], (err2, result2) => {
              if (err2) {
                console.log(err2)
              } else {
                jsonShow(res, result2)
              }
            })
          }
        })
      } else {
        conn.query(addNoteSql, [params.title, params.time, params.content, params.type], (err1, result1) => {
          if (err1) {
            console.log(err1)
          } else {
            jsonShow(res, result1)
          }
        })
      }
    }
  })
})

// 移动Note到回收站
router.get('/moveToRecycleBin', (req, res) => {
  let sql = $.editDeleteNote.add
  let params = req.query
  conn.query(sql, [params.time], (err, result) => {
    if (err) {
      console.log(err)
    } else {
      jsonShow(res, result)
    }
  })
})

//  获取Note列表
router.get('/getNoteList', (req, res) => {
  let sql = $.editNote.select
  let params = req.query
  conn.query(sql, [(params.pageIndex - 1) * params.pageSize], (err, result) => {
    if (err) {
      console.log(err)
    } else {
      jsonShow(res, result, 'getNoteList')
    }
  })
})

// 根据分类获取Note列表
router.get('/getNoteListByType', (req, res) => {
  let sql = $.editNote.selectByType
  let params = req.query
  conn.query(sql, [params.type_id, (params.pageIndex - 1) * params.pageSize], (err, result) => {
    if (err) {
      console.log(err)
    } else {
      jsonShow(res, result, 'getNoteListByType')
    }
  })
})

// Note列表移除数据
router.get('/deleteNote', (req, res) => {
  let sql = $.editNote.delete
  let params = req.query
  conn.query(sql, [params.id], (err, result) => {
    if (err) {
      console.log(err)
    } else {
      jsonShow(res, result)
    }
  })
})

// 获取某条Note
router.get('/getNoteOne', (req, res) => {
  let sql = $.editNote.selectOne
  let params = req.query
  conn.query(sql, [params.id], (err, result) => {
    if (err) {
      console.log(err)
    } else {
      jsonShow(res, result, 'getNoteOne')
    }
  })
})

// 获取回收站的Note列表
router.get('/getRecycleBinNoteList', (req, res) => {
  let sql = $.editDeleteNote.select
  conn.query(sql, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      jsonShow(res, result, 'getRecycleBinNoteList')
    }
  })
})

// 从回收站删除Note
router.get('/deleteFromRecycleBin', (req, res) => {
  let sql = $.editDeleteNote.delete
  let params = req.query
  conn.query(sql, [params.id], (err, result) => {
    if (err) {
      console.log(err)
    } else {
      jsonShow(res, result)
    }
  })
})

// 还原回收站Note
router.get('/moveFromRecycleBin', (req, res) => {
  let sql = $.editNote.addFromRecycleBin
  let params = req.query
  conn.query(sql, [params.time], (err, result) => {
    if (err) {
      console.log(err)
    } else {
      jsonShow(res, result)
    }
  })
})

// 更新Note
router.post('/updateNoteInfo', (req, res) => {
  let sql = $.editNote.update
  let params = req.body
  conn.query(sql, [params.title, params.content, params.time, params.type, params.id], (err, result) => {
    if (err) {
      console.log(err)
    } else {
      jsonShow(res, result)
    }
  })
})

// 查询分类
router.get('/getNoteTypeList', (req, res) => {
  let sql = $.editNoteType.select
  conn.query(sql, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      jsonShow(res, result, 'getNoteTypeList')
    }
  })
})

module.exports = router;
