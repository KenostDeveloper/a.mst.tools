<template>
    <div v-if="opt_vendors.selected_count > 0" class="dart-custom-grid purchases__wrapper" :class="{ loading: loading }">
      <!-- <CatalogMenu :items="opt_catalog" /> -->
      <div class="d-col-content purchases">
        <div class="dart-home dart-window">
            <!-- <Breadcrumbs/> -->
            <div>
              <h1 class="h1-mini">Оптовые акции</h1>

              <div>
                
              </div>
            </div>
        </div>
      </div>
      <div class="d-col-map purchases__basket-wrapper">
        <Vendors :items="this.opt_vendors"/>
        <Basket ref="childComponent" @toOrder="toOrder" @catalogUpdate="catalogUpdate"/>
      </div>
    </div>
    <div class="not-vendors" v-else>
      <!-- <img src="../../assets/img/not-vendors.png" alt=""> -->
      <p>Для просмотра каталога необходимо выбрать поставщика!</p>
      <div class="a-dart-btn a-dart-btn-primary" @click="changeActive" >Выбрать</div>
    </div>
    <OrderModal :show="show_order" @fromOrder="fromOrder"/>
    <Vendors @changeActive="changeActive" @vendorCheck="vendorCheck" :vendorModal="this.vendorModal" :items="this.opt_vendors" />
  </template>
  <script>
  import { mapActions, mapGetters } from 'vuex'
  import CatalogMenu from '../../components/opt/CatalogMenu.vue'
  import Basket from '../../components/opt/Basket.vue'
  import Vendors from '../../components/opt/Vendors.vue'
  // import Breadcrumbs from '../../components/opt/Breadcrumbs.vue'
  import Paginate from 'vuejs-paginate-next'
  import TableCatalog from '../../components/opt/TableCatalog.vue'
  import OrderModal from '../../components/opt/OrderModal.vue'
  
  export default {
    name: 'OptsSearch',
    props: {
    },
    data () {
      return {
        show_order: false,
        loading: false,
        reloading: false,
        opt_mainpage: {},
        opt_catalog: {},
        opt_vendors: {},
        opt_products: {},
        page: 1,
        perpage: 25,
        vendorModal: false
      }
    },
    components: {
      CatalogMenu,
      Basket,
      Vendors,
      // Breadcrumbs,
      TableCatalog,
      Paginate,
      OrderModal
    },
    mounted () {
      this.get_opt_catalog_from_api().then(
        this.opt_catalog = this.optcatalog
      )
      this.get_opt_vendors_from_api().then(
        this.opt_vendors = this.optvendors
      )
      this.get_opt_products_from_api({
        page: this.page,
        perpage: this.perpage
      }).then(
        this.opt_products = this.optproducts
      )
    },
    updated () { },
    unmounted () {
    },
    methods: {
      ...mapActions([
        'get_opt_mainpage_from_api',
        'get_opt_catalog_from_api',
        'get_opt_vendors_from_api',
        'get_opt_products_from_api'
      ]),
      pagClickCallback (pageNum) {
        this.page = pageNum
        this.get_opt_products_from_api({
          page: this.page,
          perpage: this.perpage
        }).then(
          this.opt_products = this.optproducts
        )
      },
      updatePage (categoryId) {
        this.loading = true
        this.get_opt_vendors_from_api().then(
          this.opt_vendors = this.optvendors
        )
      },
      updateBasket () {
        this.$refs.childComponent.updateBasket()
      },
      toOrder () {
        this.show_order = true
      },
      fromOrder () {
        this.show_order = false
      },
      changeActive () {
        this.vendorModal = !this.vendorModal
      }
    },
    computed: {
      ...mapGetters([
        'optvendors',
      ]),
    },
    watch: {
      optvendors: function (newVal, oldVal) {
        this.opt_vendors = newVal
      },
    }
  }
  </script>
  <style lang="scss">
  
  </style>
  