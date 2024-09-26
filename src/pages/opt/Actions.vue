<template>
    <div>
        <Breadcrumbs class="std-breadcrumbs--margin" />
        <h1 class="title-h1">Оптовые акции</h1>
        <div class="dart-row">
            <router-link :to="{ name: 'promotion', params: { id: this.$route.params.id, action: item.id } }" v-for="item in action_buyer.items" v-bind:key="item.id" class="d-col-lg-4 d-col-sm-6 d-col-12 link-no-style mb-3">
                <div class="kenost-action-opt">
                    <!-- <img class="kenost-action-opt__image" src="https://mst.tools/assets/images/templates/action-imge-base.png" alt=""> -->
                    <img class="kenost-action-opt__image" :src="item.image" alt="">
                    <div class="kenost-action-opt__name">{{ item.action_name }}</div>
                    <!-- {{ item }} -->
                    <div class="kenost-action-opt__params">
                        <div class="kenost-action-opt__param"><span>Действует до:</span>{{ new Date(item.date_to).toLocaleString("ru", {month: '2-digit', day: '2-digit', year: 'numeric'}) }}</div>
                        <div class="kenost-action-opt__param"><span>Склад:</span>{{ item.store_city }}</div>
                    </div>
                    <div class="kenost-action-opt__param mt-2"><span>Поставщик:</span><img :src="item.store_image" alt=""><div class="kenost-action-opt__name-store">{{ item.name_short }}</div></div>
                </div>
            </router-link>
        </div>
    </div>
  </template>
  <script>
  import { mapActions, mapGetters } from 'vuex'
  import router from "../../router";
import Breadcrumbs from '../../components/Breadcrumbs.vue';
  
  export default {
    name: 'OptsSearch',
    props: {
    },
    data () {
      return {
        
      }
    },
    components: {
      Breadcrumbs
    },
    mounted () {
      this.get_actions_buyer_to_api({
        action: 'get/all/actions/buyer',
        id: this.$route.params.id
      })
    },
    updated () { },
    unmounted () {
    },
    methods: {
      ...mapActions([
        'get_actions_buyer_to_api'
      ]),
      
    },
    computed: {
      ...mapGetters([
        'action_buyer'
      ]),
    },
    watch: {
    }
  }
  </script>
  <style lang="scss">
  
  </style>
  