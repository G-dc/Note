const express = require('express')
const router = express.Router()
const models = require('../mysql_db/db')
const mysql = require('mysql')
const $ = require('../mysql_db/sqlMap')

// 连接数据库
const conn = mysql.createConnection(models.mysql)

conn.connect()

/**
 * 新增Note
 */
router.post('/addNote', (req, res) => {
  let params = req.body

  // 判断前端传过来的类别是否存在于数据库表中
  conn.query($.editNoteType.selectOne, [params.type], (err, result) => {
    if (err) {
      res.status = 500
    } else {
      // 若不存在，先将该类别添加至对应的数据库表，再执行新增Note操作
      if (result.length === 0) {
        conn.query($.editNoteType.add, [params.type], (err1, result1) => {
          if (err1) {
            res.status = 500
          } else {
            if (typeof result1 === 'undefined') {
              res.json({
                code: 416,
                msg: '新增失败，请稍后重试'
              })
            } else {
              conn.query($.editNote.add, [params.title, params.time, params.content, params.type], (err2, result2) => {
                if (err2) {
                  res.status = 500
                } else {
                  if (typeof result2 === 'undefined') {
                    res.json({
                      code: 416,
                      msg: '新增失败，请稍后重试'
                    })
                  } else {
                    res.json({
                      code: 200,
                      msg: '新增成功'
                    })
                  }
                }
              })
            }
          }
        })
      }
      // 若存在，则直接执行新增Note操作
      else {
        conn.query($.editNote.add, [params.title, params.time, params.content, params.type], (err1, result1) => {
          if (err1) {
            res.status = 500
          } else {
            if (typeof result1 === 'undefined') {
              res.json({
                code: 416,
                msg: '新增失败，请稍后再试'
              })
            } else {
              res.json({
                code: 200,
                msg: '新增成功'
              })
            }
          }
        })
      }
    }
  })
})

/**
 * 移动Note到回收站
 */
router.get('/moveToRecycleBin', (req, res) => {
  let params = req.query

  conn.query($.editDeleteNote.add, [params.time], (err, result) => {
    if (err) {
      res.status = 500
    } else {
      if (typeof result === 'undefined') {
        res.json({
          code: 416,
          msg: '移除失败，请稍后重试'
        })
      } else {
        // 从Note列表移除对应数据
        conn.query($.editNote.delete, [params.id], (err1, result1) => {
          if (err1) {
            res.status = 500
          } else {
            if (typeof result1 === 'undefined') {
              res.json({
                code: 416,
                msg: '移除失败，请稍后重试'
              })
            } else {
              res.json({
                code: 200,
                msg: '移除成功'
              })
            }
          }
        })
      }
    }
  })
})

/**
 * 获取Note列表
 */
router.get('/getNoteList', (req, res) => {
  let params = req.query
  let totalSize

  // 获取当前Note总数量
  conn.query($.editNote.getNum, (err, result) => {
    if (err) {
      res.status = 500
    } else {
      if (typeof result === 'undefined') {
        result.json({
          code: 416,
          msg: '查询出错，请稍后重试'
        })
      } else {
        totalSize = result[0]['count(1)']

        // 根据页码以及页数获取对应分页列表数据
        conn.query($.editNote.select, [(params.pageIndex - 1) * params.pageSize], (err1, result1) => {
          if (err1) {
            res.status = 500
          } else {
            if (typeof result1 === 'undefined') {
              res.json({
                code: 416,
                msg: '查询出错，请稍后重试'
              })
            } else {
              const _data = {
                content: [],
                totalSize: totalSize
              }

              if (result1 && result1.length) {
                _data.content.push(...result1)

                res.json({
                  code: 200,
                  msg: '查询成功',
                  data: _data
                })
              } else {
                res.json({
                  code: 410,
                  msg: '查询无结果',
                  data: {}
                })
              }
            }
          }
        })
      }
    }
  })
})

/**
 * 根据分类获取Note列表
 */
router.get('/getNoteListByType', (req, res) => {
  let params = req.query
  let totalSize

  // 按照分类获取相关类别的Note总数量
  conn.query($.editNote.selectByType, [params.type_id, (params.pageIndex - 1) * params.pageSize], (err, result) => {
    if (err) {
      res.status = 500
    } else {
      if (typeof result === 'undefined') {
        res.json({
          code: 416,
          msg: '查询出错，请稍后重试'
        })
      } else {
        const _data = {
          content: [],
          totalSize: totalSize
        }

        if (result && result.length) {
          _data.content.push(...result)

          res.json({
            code: 200,
            msg: '查询成功',
            data: _data
          })
        } else {
          res.json({
            code: 410,
            msg: '查询无结果',
            data: {}
          })
        }
      }
    }
  })
})

/**
 * Note列表移除数据
 */
router.get('/deleteNote', (req, res) => {
  let params = req.query

  conn.query($.editNote.delete, [params.id], (err, result) => {
    if (err) {
      res.status = 500
    } else {
      if (typeof result === 'undefined') {
        res.json({
          code: 416,
          msg: '移除失败，请稍后重试'
        })
      } else {
        res.json({
          code: 200,
          msg: '移除成功'
        })
      }
    }
  })
})

/**
 * 根据ID获取某条Note详细信息
 */
router.get('/getNoteOne', (req, res) => {
  let params = req.query

  conn.query($.editNote.selectOne, [params.id], (err, result) => {
    if (err) {
      res.status = 500
    } else {
      if (typeof result === 'undefined') {
        res.json({
          code: 416,
          msg: '获取出错，请稍后重试'
        })
      } else {
        res.json({
          code: 200,
          msg: '查询成功',
          data: result[0]
        })
      }
    }
  })
})

/**
 * 获取回收站的Note列表
 */
router.get('/getRecycleBinNoteList', (req, res) => {
  let params = req.query
  let totalSize

  // 获取当前回收站Note总数量
  conn.query($.editDeleteNote.getNum, (err, result) => {
    if (err) {
      res.status = 500
    } else {
      if (typeof result === 'undefined') {
        res.json({
          code: 416,
          msg: '查询出错，请稍后重试'
        })
      } else {
        totalSize = result[0]['count(1)']

        // 根据页码以及页数获取对应分页列表数据
        conn.query($.editDeleteNote.select, [(params.pageIndex - 1) * params.pageSize], (err1, result1) => {
          if (err1) {
            res.status = 500
          } else {
            if (typeof result1 === 'undefined') {
              res.json({
                code: 416,
                msg: '查询出错，请稍后重试'
              })
            } else {
              const _data = {
                content: [],
                totalSize: totalSize
              }

              if (result1 && result1.length) {
                _data.content.push(...result1)

                res.json({
                  code: 200,
                  msg: '查询成功',
                  data: _data
                })
              } else {
                res.json({
                  code: 410,
                  msg: '查询无结果',
                  data: {}
                })
              }
            }
          }
        })
      }
    }
  })
})

/**
 * 从回收站删除Note
 */
router.get('/deleteFromRecycleBin', (req, res) => {
  let params = req.query

  conn.query($.editDeleteNote.delete, [params.id], (err, result) => {
    if (err) {
      res.status = 500
    } else {
      if (typeof result === 'undefined') {
        res.json({
          code: 416,
          msg: '删除失败，请稍后重试'
        })
      } else {
        res.json({
          code: 200,
          msg: '删除成功'
        })
      }
    }
  })
})

/**
 * 还原回收站Note
 */
router.get('/moveFromRecycleBin', (req, res) => {
  let params = req.query

  conn.query($.editNote.addFromRecycleBin, [params.time], (err, result) => {
    if (err) {
      res.status = 500
    } else {
      if (typeof result == 'undefined') {
        res.json({
          code: 416,
          msg: '还原失败，请稍后重试'
        })
      } else {

        // 执行从回收站删除数据相关sql语句

        conn.query($.editDeleteNote.delete, [params.id], (err1, result1) => {
          if (err1) {
            res.status = 500
          } else {
            if (typeof result1 === 'undefined') {
              res.json({
                code: 416,
                msg: '还原失败，请稍后重试'
              })
            } else {
              res.json({
                code: 200,
                msg: '还原成功'
              })
            }
          }
        })
      }
    }
  })
})

/**
 * 更新当前Note信息
 */
router.post('/updateNoteInfo', (req, res) => {
  let params = req.body

  // 判断前端传过来的类别是否存在与数据库表中
  conn.query($.editNoteType.selectOne, [params.type], (err, result) => {
    if (err) {
      res.status = 500
    } else {
      // 若不存在，先将该类别添加至对应的数据库表，再执行更新Note操作
      if (result.length === 0) {
        conn.query($.editNoteType.add, [params.type], (err1, result1) => {
          if (err1) {
            res.status = 500
          } else {
            if (typeof result1 === 'undefined') {
              res.json({
                code: 416,
                msg: '更新失败，请稍后重试'
              })
            } else {
              conn.query($.editNote.update, [params.title, params.content, params.time, params.type, params.id], (err2, result2) => {
                if (err2) {
                  res.status = 500
                } else {
                  if (typeof result2 === 'undefined') {
                    res.json({
                      code: 416,
                      msg: '更新失败，请稍后重试'
                    })
                  } else {
                    res.json({
                      code: 200,
                      msg: '更新成功'
                    })
                  }
                }
              })
            }
          }
        })
      }
      // 若存在，则直接执行更新Note操作
      else {
        conn.query($.editNote.update, [parmas.title, params.content, params.time, params.type, params.id], (err1, result1) => {
          if (err1) {
            res.status = 500
          } else {
            if (typeof result1 === 'undefined') {
              res.json({
                code: 416,
                msg: '更新失败，请稍后重试'
              })
            } else {
              res.json({
                code: 200,
                msg: '更新成功'
              })
            }
          }
        })
      }
    }
  })
})

/**
 * 查询分类
 */
router.get('/getNoteTypeList', (req, res) => {
  conn.query($.editNoteType.select, (err, result) => {
    if (err) {
      res.status = 500
    } else {
      if (typeof result === 'undefined') {
        res.json({
          code: 416,
          msg: '查询笔记分类失败，请稍后重试'
        })
      } else {
        if (result && result.length) {
          const _data = {
            content: []
          }

          _data.content.push(...result)

          res.json({
            code: 200,
            msg: '查询成功',
            data: _data
          })
        } else {
          res.json({
            code: 410,
            msg: '查询无结果',
            data: {}
          })
        }
      }
    }
  })
})

module.exports = router;
