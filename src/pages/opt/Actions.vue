<template>
    <div>
        <Breadcrumbs class="std-breadcrumbs--margin" />
        <h1 class="title-h1">Оптовые акции</h1>
        <div class="dart-row">
            <router-link :to="{ name: 'promotion', params: { id: this.$route.params.id, action: item.action_id } }" v-for="item in action_buyer.items" v-bind:key="item.id" class="d-col-xl-4 d-col-lg-6 d-col-12 link-no-style mb-3">
                <div class="kenost-action-opt">
                    <!-- <img class="kenost-action-opt__image" src="https://mst.tools/assets/images/templates/action-imge-base.png" alt=""> -->
                    <img class="kenost-action-opt__image" :src="item?.image?.thumb_medium" :srcset="item?.image?.thumb_medium +' 2x, ' + item?.image?.thumb_small + ' 1x'" :alt="item.action_name">
                    <div class="kenost-action-opt__name">{{ item.action_name }}</div>
                    <!-- {{ item }} -->
                    <div class="kenost-action-opt__params">
                        <div class="kenost-action-opt__param"><span>Действует до:</span><span>{{ new Date(item.date_to).toLocaleString("ru", {month: '2-digit', day: '2-digit', year: 'numeric'}) }}</span></div>
                        <div class="kenost-action-opt__param"><span>Склад:</span><span>{{ item.store_city }}</span></div>
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
        extended_name: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? 'offer' : 'cart',
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
        'get_actions_buyer_to_api',
        'unset_actions_buyer'
      ]),
      pagClickCallback(pageNum) {
        this.page = pageNum;
        this.get_actions_buyer_to_api({
          action: 'get/all/actions/buyer',
          extended_name: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? 'offer' : 'cart',
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
  