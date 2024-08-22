<template>
  <router-view v-slot="{ Component }">
    <transition name="scale" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script>
export default {
  name: 'app',
  created () {
    document.title = 'MST Аналитика'
  }
}
</script>

<style scoped>

</style>
