<template>
  <div class="sitebar" :class="{'hide': this.sitebar}">
    <router-link
      :to="{ name: 'home' }"
      class="sitebar-logo"
    >
      <img src="/src/assets/images/logo_small.svg" alt="МСТ Аналитика">
      <span>МСТ Аналитика</span>
    </router-link>
    <div class="sitebar-toggler" @click="sidebarToggle">
      <i class="d_icon d_icon-arrow-right"></i>
    </div>
    <div class="sitebar-profile">
      <div class="sitebar-profile__icon">
        <img src="https://dev.mst.tools/assets/content/about-1.jpg" alt="">
      </div>
      <p class="sitebar-profile__name">МАРКЕТСОВИЧ</p>
      <div class="sitebar-profile__tags">
        <div class="sitebar-profile__tag">Маркетплейс</div>
        <div class="sitebar-profile__on"><span>Включен</span></div>
      </div>
    </div>
    <div class="sitebar-info">
      <span class="sitebar-text">Выбор роли:</span>
      <div class="sitebar-roles">
        <div class="sitebar-role">Закупщик</div>
        <div class="sitebar-role">Поставщик</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Sitebar',
  data () {
    return {
      sitebar: false
    }
  },
  mounted () {
    const sidebarCookie = Number(this.$cookies.get('sidebar_active'))
    if (sidebarCookie === 0 || sidebarCookie === 1) {
      this.sitebar = sidebarCookie
    }
  },
  methods: {
    sidebarToggle () {
      this.sitebar = !this.sitebar
      this.$cookies.set('sidebar_active', Number(this.sitebar))
    },
  }
}
</script>

<style scoped>

</style>
