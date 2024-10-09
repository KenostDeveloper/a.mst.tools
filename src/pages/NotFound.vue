<template>
  <div class="not-found">
    <router-link to="/">
      МСТ Аналитика
    </router-link>
    <img src="/images/logo.svg" alt="" class="not-found__logo">
    <img src="/images/not-found/not-found-image.png" alt="" class="not-found__image">
  </div>
</template>

<script>
import router from "../router";

export default {
  name: 'notFound'
}
</script>

<style lang="scss" scoped>
  .not-found {
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: #282828;
    h1 {
      color: #ffffff;
      font-size: 70px;
      margin-bottom: 20px;
    }
  }
</style>
