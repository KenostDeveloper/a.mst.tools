<template>
  <div class="nav">
    <div>
      <i v-if="this.sitebar" class="pi pi-bars" @click="sidebarToggle"></i>
      <i v-else class="pi pi-times" @click="sidebarToggle"></i>
    </div>
    <router-link
      :to="{ name: 'home' }"
      class="sitebar-logo"
    >
      <img src="/src/assets/images/logo_small.svg" alt="МСТ Аналитика">
      <span>МСТ Аналитика</span>
    </router-link>
  </div>
  <div class="sitebar" :class="{'hide': this.sitebar}">
    <router-link
      :to="{ name: 'home' }"
      class="sitebar-logo"
    >
      <img src="/src/assets/images/logo_small.svg" alt="МСТ Аналитика">
      <span>МСТ Аналитика</span>
    </router-link>
    <div class="sitebar-toggler" @click="sidebarToggle">
      <i class="pi pi-chevron-left"></i>
    </div>
    <div class="sitebar-profile">
      <div
        class="sitebar-org"
      >
      <div class="sitebar-profile__icon">
        <img :src="this.organozation?.image" alt="">
      </div>
      <p class="sitebar-profile__name">{{this.organozation?.name}}<span @click="this.changeOrgModal = true">Сменить <i class="pi pi-angle-right"></i></span></p>
      </div>
      <div class="sitebar-profile__tags">
        <div class="sitebar-profile__tag">Маркетплейс</div>
        <div class="sitebar-profile__on"><img src="/src/assets/images/icons/on.svg" alt=""><span>Включен</span></div>
      </div>
    </div>
    <div class="sitebar-info">
      <span class="sitebar-text">Выбор роли:</span>
      <div class="sitebar-roles">
        <div class="sitebar-role">Закупщик</div>
        <div class="sitebar-role">Поставщик</div>
      </div>
    </div>
    <hr class="sitebar-hr">
    <div class="sitebar-menu">
      <PanelMenu v-model:expandedKeys="expandedKeys" :model="getMenu">
        <template #item="{ item }">
          <router-link class="sitebar-menu__item" :to="item.to" style="color: #fff;">
            <div class="sitebar-menu__name">
              <img :src="'/src/assets/images/icons/' + item.icon" alt="">
              <span class="sitebar-menu__title">{{ item.label }}</span>
            </div>
            <div class="sitebar-menu__notification">
              <!-- Уведомления -->
            </div>
            <!-- <div class="sitebar-menu__hint">
              {{ item.label }}
            </div> -->
          </router-link>
        </template>
      </PanelMenu>
    </div>
    <div class="sitebar-logout" @click="onAuthBtnClick">
      <span>Выйти</span>
      <i class="pi pi-sign-out"></i>
    </div>
  </div>

  <Dialog v-model:visible="this.changeOrgModal" :header="'Выбор организации'" class="kenost-change-org">
    <router-link @click="this.changeOrgModal = false" :to="{ name: 'org', params: { id: item.id }}" class="change-org-el" :class="{'active': $route.params.id == item.id}" v-for="item in this.organizations" v-bind:key="item.id">
      <div class="icon"><img :src="item.image" alt=""></div>
      <div class="change-org-el__text">
        <b>{{ item.name }}</b>
        <!-- <p>{{ item.active }}</p> -->
        <div v-if="item.active" class="dart-payment-status-org"><i class="d_icon d_icon-check"></i><span>Включен</span></div>
        <div v-else class="dart-payment-status-org off"><i class="d_icon d_icon-focus"></i><span>Выключен</span></div>
      </div>
    </router-link>
  </Dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import PanelMenu from 'primevue/panelmenu'
import OverlayPanel from 'primevue/overlaypanel';
import Dialog from 'primevue/dialog'
import router from '../router'

export default {
  name: 'Sitebar',
  props: {
    active: {
      type: Boolean,
      default: false
    },
  },
  data () {
    return {
      sitebar: this.active,
      organizations: [],
      organozation: [],
      changeOrgModal: false,
    }
  },
  components: {
    PanelMenu,
    Dialog
  },
  mounted () {
    
  },
  computed: {
    ...mapGetters({
      getUser: 'user/getUser',
      orgs: 'orgs'
    }),
    getMenu () {
      return [{
        label: 'Товары',
        icon: 'products.svg',
        to: { name: 'stores', params: { id: this.$route.params.id } }
      },
      {
        label: 'Отгрузки',
        icon: 'shipments.svg',
        to: { name: 'home', params: { id: this.$route.params.id } }
      },
      {
        label: 'Мои клиенты',
        icon: 'clients.svg',
        to: { name: 'home', params: { id: this.$route.params.id } }
      },
      {
        label: 'Индивидуальные скидки',
        icon: 'star.svg',
        to: { name: 'b2c', params: { id: this.$route.params.id } }
      },
      {
        label: 'Оптовые акции',
        icon: 'adv.svg',
        to: { name: 'home', params: { id: this.$route.params.id } }
      },
      {
        label: 'Карточка компании',
        icon: 'settings.svg',
        to: { name: 'org_settings', params: { id: this.$route.params.id } }
      }]
    }
  },
  methods: {
    ...mapActions({
      setUser: 'user/setUser',
      deleteUser: 'user/deleteUser',
      org_get_from_api: 'org_get_from_api'
    }),
    sidebarToggle () {
      this.sitebar = !this.sitebar
      this.$cookies.set('sidebar_active', Number(this.sitebar))
    },
    onAuthBtnClick () {
      if (this.getUser) {
        this.$api.auth.logout()
        localStorage.removeItem('user')
        this.deleteUser()
        console.log(this.$router)
        this.$router.push({ name: 'main' })
      } else {
        this.$router.push({ name: 'main' })
      }
    }
  },
  mounted() {
    const data = {
      action: 'get/orgs'
    }
    this.org_get_from_api(data)
  },
  watch: {
    orgs: function (newVal, oldVal) {
      this.organizations = newVal
      console.log(newVal)
      if(newVal){
        const org = newVal.find(el => el.id === this.$route.params.id)
        console.log(org)
        if(org){
          this.organozation = org
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
