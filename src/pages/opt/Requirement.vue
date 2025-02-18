<template>
  <div v-if="opt_vendors.selected_count > 0" class="dart-custom-grid purchases__wrapper" :class="{ loading: loading }">
    <!-- <CatalogMenu :items="opt_catalog" /> -->
    <div class="d-col-content purchases">
      <div class="dart-home dart-window">
          <!-- <Breadcrumbs/> -->
          <div class="profile-content__title">
            <span class="title-h1" v-if="header[1] == 'req'">{{this.opt_products.name}} №{{ header[0] }}</span>
            <span class="title-h1" v-if="header[1] == 'order'">Повтор Заказа №{{ header[0] }}</span>
            <div class="buttons_container">
              <button class="dart-btn dart-btn-primary btn-padding" @click.prevent="addToCart()"> 
                <i class="d_icon d_icon-busket"></i>
                <span>В корзину</span> 
              </button>
            </div>
          </div>
          <!--
          <div class="dart-alert dart-alert-info">В данном разделе перечислены только те товары Поставщиков, которые мы нашли согласно Потребности.</div>
          -->
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
import router from '../../router'
import Toast from 'primevue/toast'

export default {
  name: 'OptsSearch',
  props: {
  },
  data () {
    return {
      header: '',
      show_order: false,
      loading: false,
      reloading: false,
      opt_mainpage: {},
      opt_catalog: {},
      opt_vendors: {},
      opt_products: {},
      order_id: 0,
      page: 1,
      perpage: 25,
      vendorModal: false
    }
  },
  components: {
    CatalogMenu,
    Basket,
    Vendors,
    Breadcrumbs,
    TableCatalog,
    Paginate,
    Toast,
    OrderModal
  },
  mounted () {
    this.updatePage();
  },
  updated () {
    
  },
  unmounted () {
  },
  methods: {
    ...mapActions([
      'get_opt_mainpage_from_api',
      'get_opt_catalog_from_api',
      'get_opt_vendors_from_api',
      'get_opt_products_from_api',
      'opt_upload_products_file',
      'set_requirements_api',
      'busket_from_api'
    ]),
    addToCart(){
      this.loading = true;
      this.$load(async () => {
          await this.set_requirements_api({
              action: "cart/products",
              id: router.currentRoute._value.params.id,
              req: router.currentRoute._value.params.req,
              extended_name: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? 'offer' : 'cart',
          }).then((response) => {
              this.loading = false;
              if(response.data.success){
                this.$toast.add({ severity: 'success', summary: 'Товар добавлен в корзину!', detail: response.data.message, life: 3000 });
                this.busket_from_api({
                  action: 'basket/get',
                  extended_name: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? 'offer' : 'cart',
                  id: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? router.currentRoute._value.params.id_org_from : router.currentRoute._value.params.id,
                  warehouse: 'all'
                }).then((response) => {
                  if(!response?.data?.data?.success && response?.data?.data?.message){
                    this.$toast.add({ severity: 'error', summary: "Ошибка", detail: response?.data?.data?.message, life: 3000 });
                  }
                })
                this.busket_from_api({
                  action: 'basket/get',
                  extended_name: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? 'offer' : 'cart',
                  id: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? router.currentRoute._value.params.id_org_from : router.currentRoute._value.params.id,
                }).then((response) => {
                  if(!response?.data?.data?.success && response?.data?.data?.message){
                    this.$toast.add({ severity: 'error', summary: "Ошибка", detail: response?.data?.data?.message, life: 3000 });
                  }
                })
              }else{
                this.$toast.add({ severity: 'error', summary: 'Ошибка сохранения Поставщика', detail: response.data.message, life: 3000 });
              }
          })
      })
    },
    pagClickCallback (pageNum) {
      this.page = pageNum
      this.loading = true
      this.get_opt_products_from_api({
        page: this.page,
        perpage: this.perpage
      }).then(() => {
        this.loading = false
        this.opt_products = this.optproducts
      })
    },
    updatePage (order_id) {
      this.loading = true
      const page_data = router.currentRoute._value.params.req
      this.header = page_data.split('_', 2)
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
      // this.$refs.childComponent.updateBasket()
    },
    catalogUpdate () {
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
      console.log(newVal)
      this.opt_products = newVal
    },
    $route () {
      this.updatePage()
    }
  }
}
</script>
<style lang="scss">

</style>
