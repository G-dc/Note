<template>
  <div class="content" style="position: relative;">
    <div class="listContent">
      <p class="listContent-title">{{data.title}}</p>
      <div class="listContent-content ql-editor" v-html="data.content"></div>
      <el-button class="btn" type="primary" circle  icon="el-icon-edit" @click="editOne"></el-button>
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
  methods: {
    editOne () {
      this.$emit('editOne', this.data)
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  position: relative;
  width: 100%;
  height: 100%;
  .listContent {
    width: 100%;
    height: 100%;
    overflow: hidden;
    overflow-y: auto;
    &-title {
      width: 100%;
      height: auto;
      padding-top: 10px;
      text-align: center;
      line-height: 60px;
      font-size: 40px;
      color: burlywood;
    }
    &-content {
      width: 100%;
      height: auto;
      box-sizing: border-box;
      margin-top: 10px;
      margin-bottom: 10px;
      padding: 0 5%;
    }
    .btn {
      position: absolute;
      right: 50px;
      bottom: 50px;
      z-index: 999;
    }
  }
}
::-webkit-scrollbar {
  width: 0;
}
</style>
