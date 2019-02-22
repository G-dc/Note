<template>
  <div class="deleteOne">
    <div class="deleteOne-one">
      <div class="deleteOne-one-content">
        <p class="deleteOne-one-content-title">{{data.title}}</p>
        <p class="deleteOne-one-content-type">Type：<span>{{data.type}}</span></p>
        <p class="deleteOne-one-content-time">Date：<span>{{data.time | formatTime}}</span></p>
        <p class="deleteOne-one-content-content">Content：<span>{{data.content}}</span></p>
      </div>
      <div class="deleteOne-one-btnGroup">
        <el-tooltip effect="dark" content="还原此条Note" placement="top">
          <el-button icon="el-icon-refresh" circle @click="backData(data)"></el-button>
        </el-tooltip>
        <el-tooltip effect="dark" content="删除此条Note" placement="top">
          <el-button icon="el-icon-delete" circle @click="deleteData(data)"></el-button>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  watch: {
    data: {
      handler (val) {
        this.changeContent(val)
      },
      immediate: true
    }
  },
  methods: {
    backData (e) {
      this.$emit('backData', e)
    },
    deleteData (e) {
      this.$emit('deleteData', e)
    },

    // 截取文本
    changeContent (e) {
      let _content = e.content.split('</p>')[0]
      // 匹配标签
      _content = _content.replace(/<[^<>]+>/g, '')
      e.content = _content
    }
  },
  filters: {
    formatTime (val) {
      let _time = new Date(val)
      const _year = _time.getFullYear()
      const _month = _time.getMonth() + 1 > 9 ? _time.getMonth() + 1 : '0' + (_time.getMonth() + 1)
      const _date = _time.getDate() > 9 ? _time.getDate() : '0' + _time.getDate()
      return _year + '-' + _month + '-' + _date
    }
  }
}
</script>

<style lang="scss" scoped>
.deleteOne {
  width: 100%;
  height: 100%;
  margin-top: 100px;
  &-one {
    display: inline-block;
    float: left;
    width: 20%;
    height: 150px;
    margin-bottom: 25px;
    margin-left: 4%;
    &-content {
      width: 100%;
      height: 100%;
      overflow: hidden;
      border: 1px solid rgba(147, 153, 159, 0.6);
      border-radius: 6px;
      cursor: pointer;
      &-title {
        width: 100%;
        height: 30px;
        margin-top: 10px;
        text-align: center;
        line-height: 30px;
        font-size: 20px;
        font-weight: bold;
        color: burlywood;
      }
      &-type, &-time, &-content {
        width: 100%;
        height: 20px;
        box-sizing: border-box;
        padding: 0 5%;
        margin-top: 10px;
        margin-bottom: 10px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        line-height: 20px;
        font-size: 15px;
        font-weight: bold;
        color: burlywood;
        span {
          color: darkgrey;
          font-weight: normal;
        }
      }
      &:hover {
        transform: scale(1.01);
        border: 1px solid deepskyblue;
        box-shadow: 0 0 5px rgba(0, 191, 255, 0.7);
      }
    }
    &-btnGroup {
      padding: 10px 0;
      text-align: right;
    }
  }
}
</style>
