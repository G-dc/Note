<template>
  <div class="listAll">
    <list-one v-for="(item, index) in list" :key="index" :data="item" :currentId="$store.state.list.NoteId" @deleteNote="deleteNote" @chooseOne="chooseOne"/>
  </div>
</template>

<script>
import listOne from '../ListOne'
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
    listOne
  },
  methods: {
    deleteNote (e) {
      this.$emit('deleteNote', e)
    },
    chooseOne (e) {
      this.$emit('chooseOne', e)
    }
  }
}
</script>

<style lang="scss" scoped>
.listAll {
  width: 100%;
  height: auto;
}
</style>
