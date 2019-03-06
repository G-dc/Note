<template>
  <div class="list">
    <div class="list-left-list">
      <el-form>
        <el-form-item label="分类搜索：">
          <el-select v-model="getListTemp.currentType" @change="changeType">
            <el-option
              v-for="item in NoteTypeList"
              :key="item.Type_Id"
              :label="item.Type_Name"
              :value="item.Type_Name">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <list-all :list="NoteList" @deleteNote="deleteNote" @chooseOne="chooseOne"/>
      <el-pagination
        class="pagination"
        v-if="$store.state.pagination.total > 0"
        @current-change="changePage"
        layout="prev, pager, next"
        :page-size="5"
        :current-page="getListTemp.pageIndex"
        :total="$store.state.pagination.total">
      </el-pagination>
    </div>
    <div class="list-right-content" v-if="currentNoteDetail.Note_Content">
      <list-content :data="currentNoteDetail" @editOne="editOne"/>
    </div>
  </div>
</template>

<script>
import ListAll from '../../components/ListAll'
import ListContent from '../../components/ListContent'
export default {
  data () {
    return {
      NoteList: [],
      currentNoteDetail: {},
      NoteTypeList: [],
      currentType: '全部',
      getListTemp: {
        pageIndex: 1,
        pageSize: 7,
        currentType: '全部'
      }
    }
  },
  components: {
    ListAll,
    ListContent
  },
  methods: {
    // 获取Note分类列表
    async getNoteTypeList () {
      this.NoteTypeList = []

      try {
        const _data = await this.$api.NoteList.getNoteTypeList()

        this.NoteTypeList.push({ Type_Id: 0, Type_Name: '全部' })

        if (_data.code === 200) {
          this.NoteTypeList.push(..._data.data.content)
        }
      } catch (error) {}
    },

    // 根据分类获取Note列表
    async getData () {
      this.NoteList = []
      if (this.getListTemp.currentType === '全部') {
        try {
          const _data = await this.$api.NoteList.getAllList(this.getListTemp)

          if (_data.code === 200) {
            if (_data.data.content.length > 0) {
              this.NoteList.push(..._data.data.content)
              this.$store.commit('UPDATE_TOTAL_PAGE', _data.data.totalSize)
              this.setData()
            } else {
              this.$store.commit('UPDATE_TOTAL_PAGE', 0)
              this.setData()
            }
          } else {
            this.$message({
              message: _data.msg,
              type: 'info',
              duration: 1000
            })

            this.$store.commit('UPDATE_TOTAL_PAGE', 0)
            this.setData()
          }
        } catch (error) {}
      } else {
        const _data = await this.$api.NoteList.getSomeList(this.getListTemp)

        if (_data.code === 200) {
          if (_data.data.content.length > 0) {
            this.NoteList.push(..._data.data.content)
            this.$store.commit('UPDATE_TOTAL_PAGE', _data.data.totalSize)
            this.setData()
          } else {
            this.$store.commit('UPDATE_TOTAL_PAGE', 0)
            this.setData()
          }
        } else {
          this.$message({
            message: _data.msg,
            type: 'info',
            duration: 1000
          })

          this.$store.commit('UPDATE_TOTAL_PAGE', 0)
          this.setData()
        }
      }
    },
    setData () {
      if (this.NoteList.length > 0) {
        this.currentNoteDetail = this.NoteList[0]
        this.$store.commit('UPDATE_NOTE_ID', this.NoteList[0].Note_Id)
      } else {
        this.currentNoteDetail = {}
        this.$store.commit('UPDATE_NOTE_ID', undefined)
      }
    },

    // 选中单条Note
    async chooseOne (e) {
      try {
        const _data = await this.$api.NoteList.getOne(e.Note_Id)

        if (_data.code === 200) {
          this.$store.commit('UPDATE_NOTE_ID', _data.data.Note_Id)
          this.currentNoteDetail = _data.data
        }
      } catch (error) {}
    },

    // 移动Note至回收站
    deleteNote (e) {
      this.$confirm('是否确认删除该note，将之移动至回收站？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const _NoteOne = this.NoteList.find(value => {
          return value.Note_Id === e
        })

        try {
          const _data = await this.$api.NoteList.moveToRecycleBin(_NoteOne.Note_Time, _NoteOne.Note_Id)

          if (_data.code === 200) {
            this.$message({
              message: '删除成功，可以在回收站查看删除内容，当前页面数据将重新加载。',
              type: 'success',
              duration: 1000
            })

            setTimeout(() => {
              this.getData()
            }, 1500)
          }
        } catch (error) {}
      }).catch(() => {
        this.$message({
          message: '操作已取消',
          type: 'info',
          duration: 1000
        })
      })
    },

    // 切换当前分页
    changePage (val) {
      this.getListTemp.pageIndex = val
      this.getData()
    },

    // 编辑Note
    editOne (e) {
      this.$confirm('确认编辑该内容？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.push({
          path: '/add-note',
          query: {
            NoteId: e.Note_Id
          }
        })
      }).catch(() => {
        this.$message({
          message: '操作已取消',
          type: 'info',
          duration: 1000
        })
      })
    },

    // 修改分类
    changeType (val) {
      this.getListTemp.currentType = val
      this.currentNoteDetail = {}
      this.$store.commit('UPDATE_TOTAL_PAGE', 0)
      this.getData()
    }
  },
  created () {
    this.getData()
    this.getNoteTypeList()
  },
  beforeRouteLeave (to, from, next) {
    this.$store.commit('UPDATE_TOTAL_PAGE', 0)
    next()
  }
}
</script>

<style lang="scss" scoped>
.list {
  width: 100%;
  height: 100%;
  &-left-list {
    position: relative;
    display: inline-block;
    float: left;
    width: 35%;
    height: 80vh;
    margin-top: 50px;
    margin-left: 5%;
    p {
      margin-bottom: 10px;
    }
    .pagination {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      text-align: center;
    }
  }
  &-right-content {
    position: relative;
    display: inline-block;
    float: left;
    width: 40%;
    height: 80vh;
    margin-top: 50px;
    margin-left: 10%;
    border-radius: 10px;
    background-color: linen;
  }
}
</style>
