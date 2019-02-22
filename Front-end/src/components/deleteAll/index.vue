<template>
  <div class="deleteAll">
    <delete-one v-for="(item, index) in list" :key="index" :data="item" @backData="backData" @deleteData="deleteData"/>
  </div>
</template>

<script>
import deleteOne from '../deleteOne'
export default {
  props: {
    list: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  components: {
    deleteOne
  },
  methods: {
    backData (e) {
      this.$emit('backData', e)
    },
    deleteData (e) {
      this.$emit('deleteData', e)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
