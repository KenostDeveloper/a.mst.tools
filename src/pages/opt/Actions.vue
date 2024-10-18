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
        <paginate :page-count="pageCount" :click-handler="pagClickCallback"
          :prev-text="'Пред'" :next-text="'След'"
          :container-class="'pagination justify-content-center'" :initialPage="this.page"
          :forcePage="this.page">
        </paginate>
    </div>
  </template>
  <script>
  import { mapActions, mapGetters } from 'vuex'
  import router from "../../router";
  import Breadcrumbs from '../../components/Breadcrumbs.vue';
  import Paginate from 'vuejs-paginate-next';
  
  export default {
    name: 'OptsSearch',
    props: {
    },
    data () {
      return {
        page: 1,
        perpage: 24
      }
    },
    components: {
      Breadcrumbs,
      Paginate
    },
    mounted () {
      this.get_actions_buyer_to_api({
        action: 'get/all/actions/buyer',
        id: this.$route.params.id,
        page: this.page,
        perpage: this.perpage
      })
    },
    updated () { },
    unmounted () {
    },
    methods: {
      ...mapActions([
        'get_actions_buyer_to_api'
      ]),
      pagClickCallback(pageNum) {
        this.page = pageNum;
        this.get_actions_buyer_to_api({
          action: 'get/all/actions/buyer',
          id: this.$route.params.id,
          page: this.page,
          perpage: this.perpage
        })
      }
    },
    computed: {
      ...mapGetters([
        'action_buyer'
      ]),
      pageCount() {
        return Math.ceil(this.action_buyer.total / this.perpage);
      }
    },
    watch: {
    }
  }
  </script>
  <style lang="scss">
  
  </style>
  