<template>
  <div class="listOne" @mouseenter="mouseenter" @mouseleave="mouseleave">
    <div class="listOne-content" :class="currentId === data.Note_Id ? 'click-one' : ''">
      <div class="listOne-content-left" @click="chooseOne(data)">
        <p class="listOne-content-left-title">{{data.Note_Name}}</p>
      </div>
      <div class="listOne-content-right" v-if="showBtn || currentId === data.Note_Id">
        <img class="listOne-content-right-img" src="../../../static/images/icon-delete.png" @click="deleteOne(data)">
      </div>
      <div style="clear: both;"></div>
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
    },
    currentId: {
      type: Number,
      default: undefined
    }
  },
  data () {
    return {
      showBtn: false
    }
  },
  methods: {
    mouseenter () {
      this.showBtn = !this.showBtn
    },
    mouseleave () {
      this.showBtn = !this.showBtn
    },
    chooseOne (e) {
      this.$emit('chooseOne', e)
    },
    deleteOne (e) {
      this.$emit('deleteNote', e.Note_Id)
    }
  },
  filters: {
    time (val) {
      let _time = new Date(val)
      let year = _time.getFullYear()
      let month = _time.getMonth() + 1 > 9 ? _time.getMonth() + 1 : '0' + (_time.getMonth() + 1)
      let date = _time.getDate() > 9 ? _time.getDate() : '0' + _time.getDate()
      return year + '-' + month + '-' + date
    }
  }
}
</script>

<style lang="scss" scoped>
.listOne {
  width: 100%;
  height: auto;
  &-content {
    width: 100%;
    height: auto;
    box-sizing: border-box;
    margin: 0 0 20px 0;
    padding: 10px 15px;
    border: 1px solid rgba(147, 153, 159, 0.6);
    border-radius: 2px;
    &-left {
      display: inline-block;
      float: left;
      width: 90%;
      height: 3vh;
      cursor: pointer;
      &-title {
        width: 100%;
        height: 3vh;
        line-height: 3vh;
        font-size: 20px;
        color: burlywood;
      }
    }
    &-right {
      position: relative;
      display: inline-block;
      float: right;
      width: 10%;
      height: 3vh;
      &-img {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        width: 20px;
        height: 20px;
        margin: auto;
        cursor: pointer;
      }
    }
    &:hover {
      transform: scale(1.01);
      border: 1px solid deepskyblue;
      box-shadow: 0 0 5px dodgerblue;
    }
  }
}
.click-one {
  transform: scale(1.01);
  border: 1px solid deepskyblue;
  box-shadow: 0 0 5px dodgerblue;
}
</style>
