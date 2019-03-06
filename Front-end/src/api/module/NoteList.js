import ajx from '../request'

// 获取全部Note列表
export function getAllList (params) {
  return ajx.get('/vue-note/api/getNoteList', {
    params: {
      type_id: params.currentType,
      pageIndex: params.pageIndex,
      pageSize: params.pageSize
    }
  })
}

// 按类别获取Note列表
export function getSomeList (params) {
  return ajx.get('/vue-note/api/getNoteListByType', {
    params: {
      type_id: params.currentType,
      pageIndex: params.pageIndex,
      pageSize: params.pageSize
    }
  })
}

// 添加新的Note
export function addNote (params) {
  return ajx.post('/vue-note/api/addNote', params)
}

// 获取特定的Note信息
export function getOne (data) {
  return ajx.get('/vue-note/api/getNoteOne', {
    params: {
      id: data
    }
  })
}

// 移除特定的Note
export function deleteOne (data) {
  return ajx.get('/vue-note/api/deleteNote', {
    params: {
      id: data
    }
  })
}

// 移除特定的Note到回收站
export function moveToRecycleBin (data1, data2) {
  return ajx.get('/vue-note/api/moveToRecycleBin', {
    params: {
      time: data1,
      id: data2
    }
  })
}

// 获取回收站列表
export function getDeleteList (params) {
  return ajx.get('/vue-note/api/getRecycleBinNoteList', {
    params: {
      pageIndex: params.pageIndex,
      pageSize: params.pageSize
    }
  })
}

// 移除回收站Note
export function deleteRecycleBinOne (data) {
  return ajx.get('/vue-note/api/deleteFromRecycleBin', {
    params: {
      id: data
    }
  })
}

// 还原回收站Note
export function returnRecycleBinNote (data1, data2) {
  return ajx.get('/vue-note/api/moveFromRecycleBin', {
    params: {
      time: data1,
      id: data2
    }
  })
}

// 更新Note内容
export function updateNote (params) {
  return ajx.post('/vue-note/api/updateNoteInfo', params)
}

// 获取Note分类
export function getNoteTypeList () {
  return ajx.get('/vue-note/api/getNoteTypeList')
}
