<template>
  <div v-if="opt_vendors.selected_count > 0" class="dart-custom-grid purchases__wrapper" :class="{ loading: loading }">
    <!-- <CatalogMenu :items="opt_catalog" /> -->
    <div class="d-col-content purchases">
      <div class="dart-home dart-window">
          <Breadcrumbs/>
          <div>
            <div class="flex justify-content-space-between align-items-center mb-4">
              <h1 class="h1-mini">Поиск по запросу "{{ $route.params.search }}"</h1>
              <div @click="this.show_filters = !this.show_filters" class="flex justify-content-space-between align-items-center gap-2 cursor-pointer"><i class="pi pi-sliders-h"></i><div>Фильтры</div></div>
            </div>
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
  <OrderModal
    :show="show_order"
    :order_id="order_id"
    @fromOrder="fromOrder"
    @orderSubmit="updatePage($event, num)"
  />
  <Filters
			:show="show_filters"
			:filters="filter"
			@setShow="setShow"
			@setFilters="setFilters"
		/>
  <Vendors @changeActive="changeActive" @vendorCheck="vendorCheck" :vendorModal="this.vendorModal" :items="this.opt_vendors" />
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import CatalogMenu from '../../components/opt/CatalogMenu.vue'
import Basket from '../../components/opt/Basket.vue'
import Vendors from '../../components/opt/Vendors.vue'
import Breadcrumbs from '../../components/Breadcrumbs.vue'
import Paginate from 'vuejs-paginate-next'
import TableCatalog from '../../components/opt/TableCatalog.vue'
import OrderModal from '../../components/opt/OrderModal.vue'
import Filters from "../../components/opt/Filters.vue";

export default {
  name: 'OptsSearch',
  props: {
  },
  data () {
    return {
      show_order: false,
      show_filters: false,
      filters: {},
      loading: false,
      reloading: false,
      opt_mainpage: {},
      opt_catalog: {},
      opt_vendors: {},
      opt_products: {},
      order_id: 0,
      page: 1,
      perpage: 25,
      vendorModal: false,
      filter: [
				{ type: 'checkbox', key: 'negative', label: 'Отрицательный прогноз остатков', value: false },
				{ type: 'number', key: 'days_forecast', label: 'Кол-во дней для прогноза остатков', value: 5, min: 1, max: 30 },
				// { type: 'number', key: 'days', label: 'Кол-во дней для расчета', value: 30, min: 1, max: 90 },
				{ type: 'checkbox', key: 'only_warehouse', label: 'Только товары склада покупателя', value: false },
				{ type: 'checkbox', key: 'only_purchases', label: 'Только товары с продажами', value: false }
			]
    }
  },
  components: {
    CatalogMenu,
    Basket,
    Vendors,
    Breadcrumbs,
    TableCatalog,
    Paginate,
    OrderModal,
		Filters
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
      perpage: this.perpage,
      filters: this.filters
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
      this.loading = true
      this.get_opt_products_from_api({
        page: this.page,
        perpage: this.perpage,
        filters: this.filters
      }).then(() => {
        this.loading = false
        this.opt_products = this.optproducts
      })
    },
    updatePage (order_id) {
      this.page = 1
			this.order_id = order_id
      this.loading = true
      this.get_opt_catalog_from_api().then(
        this.opt_catalog = this.optcatalog
      )
      this.get_opt_vendors_from_api().then(
        this.opt_vendors = this.optvendors
      )
      this.get_opt_products_from_api({
        page: this.page,
        perpage: this.perpage,
        filters: this.filters
      }).then(() => {
        this.opt_products = this.optproducts
        this.loading = false
      }
      )
    },
    updateBasket () {
      // this.$refs.childComponent.updateBasket()
    },
    setFilters(filters){
			this.filters = filters;
			this.loading = true;
			this.page = 1
			this.get_opt_products_from_api({
				page: 1,
				perpage: this.perpage,
				filters: filters
			}).then(() => {
				this.opt_products = this.optproducts;
				this.loading = false;
				this.show_filters = false;
			});
		},
    catalogUpdate () {
      console.log('cart update')
      this.get_opt_products_from_api({
        page: this.page,
        perpage: this.perpage,
        filters: this.filters
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
