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
export default {
  data () {
    return {
      deleteList: [],
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
    // 获取回收站Note列表
    async getList () {
      this.deleteList = []

      try {
        const _data = await this.$api.NoteList.getDeleteList(this.getDeleteListTemp)

        if (_data.code === 200) {
          this.deleteList.push(..._data.data.content)
          this.$store.commit('UPDATE_TOTAL_PAGE', _data.data.totalSize)
        } else {
          this.$message({
            message: _data.msg,
            type: 'info',
            duration: 1000
          })

          this.$store.commit('UPDATE_TOTAL_PAGE', 0)
        }
      } catch (error) {}
    },

    // 还原选中数据
    backData (e) {
      this.$confirm('是否确认还原 ' + e.Note_Name + ' ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const _data = await this.$api.NoteList.returnRecycleBinNote(e.Note_Time, e.Note_Id)

        if (_data.code === 200) {
          this.$message({
            message: '已成功还原，当前页面数据将重新加载。',
            type: 'success',
            duration: 1000
          })

          setTimeout(() => {
            this.getList()
          }, 1500)
        }
      }).catch(() => {
        this.$message({
          message: '操作已取消',
          type: 'info',
          duration: 1000
        })
      })
    },

    // 删除选中Note
    deleteData (e) {
      this.$confirm('是否确认完全删除 ' + e.Note_Name + ' ?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const _data = await this.$api.NoteList.deleteRecycleBinOne(e.Note_Id)

        if (_data.code === 200) {
          this.$message({
            message: '已成功删除，当前页面数据将重新加载。',
            type: 'success',
            duration: 1000
          })

          setTimeout(() => {
            this.getList()
          }, 1500)
        }
      }).catch(() => {
        this.$message({
          message: '操作已取消',
          type: 'info',
          duration: 1000
        })
      })
    },

    // 修改当前页
    changePage (val) {
      this.getDeleteListTemp.pageIndex = val
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
