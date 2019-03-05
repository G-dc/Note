<template>
  <div class="delete">
    <delete-all :list="deleteList" @backData="backData" @deleteData="deleteData"/>
    <div style="clear: both;"></div>
    <el-pagination
      style="position: absolute; left: 0; bottom: 10vh; width: 100%; text-align: center;"
      layout="prev, pager, next"
      v-if="$store.state.pagination.total > 0"
      @current-change="changePage"
      :total="$store.state.pagination.total"
      :current-page="getDeleteListTemp.pageIndex"
      :page-size="8">
    </el-pagination>
  </div>
</template>

<script>
import DeleteAll from '../../components/deleteAll'
import api from '@/api/index'
export default {
  data () {
    return {
      deleteList: [],
      currentPage: 1,
      getDeleteListTemp: {
        pageIndex: 1,
        pageSize: 8
      }
    }
  },
  components: {
    DeleteAll
  },
  methods: {
    getList () {
      this.deleteList = []
      api.NoteList.getDeleteList(this.getDeleteListTemp).then(res => {
        if (res.code === 200) {
          this.deleteList.push(...res.data)
          this.$store.commit('UPDATE_TOTAL_PAGE', res.totalSize)
          // this.deleteList.push(...res.data.slice((this.currentPage - 1) * 8, this.currentPage * 8))
          // this.$store.commit('UPDATE_TOTAL_PAGE', this.deleteList.length)
        } else {
          this.$message({
            message: res.msg,
            type: 'info',
            duration: 1000
          })
        }
      })
    },
    backData (e) {
      this.$confirm('是否确认还原 ' + e.Note_Name + ' ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.NoteList.returnRecycleBinNote(e.Note_Time).then(res => {
          if (res.code === 200) {
            api.NoteList.deleteRecycleBinOne(e.Note_Id).then(res1 => {
              if (res.code === 200) {
                this.$message({
                  message: '已成功还原，当前页面数据将重新加载。',
                  type: 'success',
                  duration: 1000
                })

                setTimeout(() => {
                  this.getList()
                }, 1500)
              }
            })
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
    deleteData (e) {
      this.$confirm('是否确认完全删除 ' + e.Note_Name + ' ?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.NoteList.deleteRecycleBinOne(e.Note_Id).then(res => {
          if (res.code === 200) {
            this.$message({
              message: '已成功删除，当前页面数据将重新加载。',
              type: 'success',
              duration: 1000
            })

            setTimeout(() => {
              this.getList()
            }, 1500)
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
    changePage (val) {
      this.getDeleteListTemp.pageIndex = val
      this.currentPage = val
      this.getList()
    }
  },
  created () {
    this.getList()
  }
}
</script>

<style lang="scss" scoped>
.delete {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100vh;
}
</style>
