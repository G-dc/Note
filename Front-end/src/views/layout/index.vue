<template>
  <div class="layout">
    <div class="sideMenu">
      <side-menu :list="sideMenuList"/>
    </div>
    <router-view class="right-content"></router-view>
  </div>
</template>

<script>
import SideMenu from '../../components/SideMenu'
export default {
  data () {
    return {
      sideMenuList: [{
        id: 0,
        name: 'Note List'
      }, {
        id: 1,
        name: 'New Note'
      }, {
        id: 2,
        name: 'Note Del'
      }]
    }
  },
  components: {
    SideMenu
  }
}
</script>

<style lang="scss" scoped>
.layout {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: row;
  .sideMenu {
    width: 12%;
  }
  .right-content {
    flex: 1;
  }
}
</style>
