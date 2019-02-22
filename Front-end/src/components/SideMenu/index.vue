<template>
    <div class="sideMenu">
      <p>Note</p>
      <ul>
        <li v-for="(item, index) in list" :key="index" @click="chooseOne(item)" :class="item.id === selectedId ? 'li-click' : ''">{{item.name}}</li>
      </ul>
    </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      selectedId: 0
    }
  },
  watch: {
    '$route.name': {
      handler (val) {
        let _currentVal = this.list.find((value, index, arr) => {
          return value.name === val
        })
        this.selectedId = _currentVal.id
      },
      immediate: true
    }
  },
  methods: {
    chooseOne (e) {
      switch (e.name) {
        case 'Note List': this.$router.push({
          path: '/note-list'
        })
          break
        case 'New Note': this.$router.push({
          path: '/add-note'
        })
          break
        case 'Note Del': this.$router.push({
          path: '/delete-note'
        })
          break
      }
      this.selectedId = e.id
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/public.scss';
.sideMenu {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background-color: $sideMenuTheme;
  p {
    width: 100%;
    height: 50px;
    margin: 80px 0 100px;
    text-align: center;
    line-height: 50px;
    font-size: 50px;
    font-weight: bold;
    color: burlywood;
  }
  ul {
    width: 100%;
    height: auto;
    li {
      width: 100%;
      height: 60px;
      margin-bottom: 10px;
      line-height: 60px;
      font-size: 25px;
      color: black;
      text-align: center;
      cursor: pointer;
      &:hover {
        background-color: burlywood;
        color: aqua;
      }
    }
    .li-click {
      background-color: burlywood;
      color: aqua;
    }
  }
}
</style>
