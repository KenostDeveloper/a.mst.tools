<template>
  <div v-if="opt_vendors.selected_count > 0" class="dart-custom-grid" :class="{ loading: loading }">
    <CatalogMenu :items="opt_catalog" />
    <div class="d-col-content">
      <div class="dart-home dart-window">
          <!-- <Breadcrumbs/> -->
          <div>
            <h1 class="h1-mini">Поиск по запросу "{{ $route.params.search }}"</h1>
            <div class="dart-alert dart-alert-info">В данном разделе перечислены все товары поставщиков, в том числе и не сопоставленные со справочником системы.</div>
          </div>
          <TableCatalog @updateBasket="updateBasket" v-if="opt_products.total !== 0" :items="opt_products"/>
          <div v-else>
            <div class="dart-alert dart-alert-warning">Ничего не найдено</div>
          </div>
          <paginate
              :page-count="pageCount"
              :click-handler="pagClickCallback"
              :prev-text="'Пред'"
              :next-text="'След'"
              :container-class="'pagination justify-content-center'"
              :initialPage="this.page"
              :forcePage="this.page"
              v-if="opt_products.total !== 0"
            >
          </paginate>
      </div>
    </div>
    <div class="d-col-map">
      <Vendors :items="this.opt_vendors"/>
      <Basket ref="childComponent" @toOrder="toOrder" @catalogUpdate="catalogUpdate"/>
    </div>
  </div>
  <div class="not-vendors" v-else>
    <img src="../../assets/img/not-vendors.png" alt="">
    <p>Пожалуйста, выберите хотя-бы 1 поставщика!</p>
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
      this.get_opt_catalog_from_api().then(
        this.opt_catalog = this.optcatalog
      )
      this.get_opt_vendors_from_api().then(
        this.opt_vendors = this.optvendors
      )
      this.get_opt_products_from_api({
        page: this.page,
        perpage: this.perpage
      }).then(() => {
        this.opt_products = this.optproducts
        this.loading = false
      }
      )
    },
    updateBasket () {
      this.$refs.childComponent.updateBasket()
    },
    catalogUpdate () {
      console.log('cart update')
      this.get_opt_products_from_api({
        page: this.page,
        perpage: this.perpage
      }).then(() => {
        this.opt_products = this.optproducts
        this.loading = false
      }
      )
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
      'mainpage',
      'optcatalog',
      'optvendors',
      'optproducts'
    ]),
    pageCount () {
      return Math.ceil(this.opt_products.total / this.perpage)
    }
  },
  watch: {
    optcatalog: function (newVal, oldVal) {
      this.opt_catalog = newVal
    },
    optvendors: function (newVal, oldVal) {
      this.opt_vendors = newVal
    },
    optproducts: function (newVal, oldVal) {
      this.opt_products = newVal
    },
    $route () {
      this.updatePage(this.$route.params.category_id)
    }
  }
}
</script>
<style lang="scss">

</style>
