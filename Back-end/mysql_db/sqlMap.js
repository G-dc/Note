let sqlMap = {
  editNote: {
    // 添加新的Note
    add: 'insert into Note_List (Note_Name, Note_Time, Note_Content, Note_Type) values (?, ?, ?, ?)',

    // 从回收站回收Note
    addFromRecycleBin: 'insert into Note_List (Note_Name, Note_Time, Note_Content, Note_Type) select Note_Name, Note_Time, Note_Content, Note_Type from Note_Del_List where Note_Time = ?',

    // 查询Note列表
    select: 'select * from Note_List order by Note_Time desc limit 7 offset ?',

    // 通过Note_Id查询Note列表
    selectOne: 'select * from Note_List where Note_Id = ?',

    // 通过Note_Type查询Note列表
    selectByType: 'select * from Note_List where Note_Type = ? order by Note_Time desc limit 7 offset ?',

    // 通过Note_Id删除Note
    delete: 'delete from Note_List where Note_Id = ?',

    // 通过Note_Id更新Note内容
    update: 'update Note_List set Note_Name = ?, Note_Content = ?, Note_Time = ?, Note_Type = ? where Note_Id = ?'
  },
  editDeleteNote: {
    /// 从Note列表移动数据到回收站
    add: 'insert into Note_Del_List (Note_Name, Note_Time, Note_Content, Note_Type) select Note_Name, Note_Time, Note_Content, Note_Type from Note_List where Note_Time = ?',

    // 查询回收站Note列表
    select: 'select * from Note_Del_List',

    // 通过Note_Id删除Note
    delete: 'delete from Note_Del_List where Note_Id = ?'
  },
  editNoteType: {
    // 查询Note所有类型
    select: 'select * from Note_Type',

    // 通过Type_Name查询特定的Note类型
    selectOne: 'select * from Note_Type where Type_Name = ?',

    // 添加新的Note_Type
    add: 'insert into Note_Type (Type_Name) values (?)'
  }
}

module.exports = sqlMap
