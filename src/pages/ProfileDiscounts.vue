<template>
    <!-- <Toast /> -->
    <ConfirmDialog></ConfirmDialog>

    <div class="std-discounts">
      <Breadcrumbs class="std-breadcrumbs--margin" />

      <div class="title-h1 mb-4 std-discounts__title">Индивидуальные скидки</div>
      <v-table
          :items_data="individual_discount.items"
          :total="individual_discount.total"
          :pagination_items_per_page="this.pagination_items_per_page_dilers"
          :pagination_offset="this.pagination_offset_dilers"
          :page="this.page_dilers"
          :table_data="this.table_data_dilers"
          :filters="this.filters"
          @filter="filter"
          title=""
          @paginate="paginateDilers"
          @editElem="editDiler"
      />
    </div>

    <Dialog v-model:visible="this.modals.diler" header="Редактирование дилера" :style="{ width: '400px' }">
      <div class="kenost-modal-price">
          <span class="title">{{ form.diler.name }}</span>
          <div class="mt-2">
              <div class="kenost-wiget">
                  <p>Базовая скидка на товар, %</p>
                  <InputNumber
                      v-model="this.form.diler.base_sale"
                      inputId="horizontal-buttons"
                      :step="0.1"
                      min="0"
                      max="100"
                      suffix=" %"
                      @update:modelValue="delayUpdate"
                      incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
                  />
              </div>
          </div>
          <div class="kenost-modal-price__button kenost-modal-price__flex">
              <div class="dart-btn dart-btn-primary" @click.prevent="setSale" :class="{'dart-btn-loading': diler_loading}">
                  Подтвердить
              </div>
          </div>
      </div>
    </Dialog>
  </template>
  
  <script>
  import { mapActions, mapGetters } from 'vuex'
  import vTable from '../components/table/v-table.vue'
  import { RouterLink } from 'vue-router'
  import TabView from 'primevue/tabview'
  import TabPanel from 'primevue/tabpanel'
  import Dialog from 'primevue/dialog'
  import InputNumber from 'primevue/inputnumber'
  import ConfirmDialog from 'primevue/confirmdialog'
  import Toast from 'primevue/toast'
  import vOpts from '../components/table/v-opts.vue'
  import router from '../router'
import Breadcrumbs from '../components/Breadcrumbs.vue'
  
  export default {
    name: 'ProfileSales',
    props: {
      pagination_items_per_page: {
        type: Number,
        default: 25
      },
      pagination_offset: {
        type: Number,
        default: 0
      },
      pagination_items_per_page_complects: {
        type: Number,
        default: 25
      },
      pagination_offset_complects: {
        type: Number,
        default: 0
      },
      pagination_items_per_page_dilers: {
        type: Number,
        default: 25
      },
      pagination_offset_dilers: {
        type: Number,
        default: 0
      },
      pagination_items_per_page_dilers_opts: {
        type: Number,
        default: 25
      },
      pagination_offset_dilers_opts: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        modals: {
          diler: false
        },
        form: {
          diler: {
            name: '',
            address: '',
            base_sale: 0,
            id: 0
          }
        },
        stores: {
          items: [],
          total: -1
        },
        diler_loading: false,
        page: 1,
        page_complects: 1,
        page_dilers: 1,
        optpage: 1,
        filters: {
          name: {
            name: "Наименование",
            placeholder: "Наименование",
            type: "text",
          },
        },
        table_data_dilers: {
          image: {
            label: "Логотип",
            type: "image",
            baseurl: false,
          },
          warehouse: {
            label: 'Наименование',
            type: 'text',
            link_to: 'org_diler',
            link_params: {
              diler_id: 'id'
            }
          },
          address: {
            label: 'Адрес организации',
            type: 'text',
          },
          store_name: {
            label: 'Склад',
            type: 'text'
          },
          payer: {
            label: 'Оплата доставки',
            type: 'text'
          },
          condition_min_sum: {
            label: 'Минимальная сумма заказа',
            type: 'text'
          },
          delay: {
            label: 'Отсрочка',
            type: 'text'
          },
          sale: {
            label: 'Скидка',
            type: 'text'
          },
          actions: {
            label: 'Действия',
            type: 'actions',
            sort: false,
            available: {
              edit: {
                icon: 'pi pi-pencil',
                label: 'Редактировать'
              }
            }
          }
        },
      }
    },
    methods: {
      ...mapActions([
        'get_dilers_from_api',
        'org_get_discount_individual_api'
      ]),
      filter(data) {
          this.org_get_discount_individual_api({
            page: this.page_dilers,
            id: router.currentRoute._value.params.id,
            perpage: this.pagination_items_per_page_dilers,
            action: 'get/individual/discount',
            filter: data
          })
        // data.type = "b2b";
        // this.get_sales_to_api(data);
      },
      editDiler (value) {
        // this.form.diler.name = value.name
        // this.form.diler.warehouse_id = value.warehouse_id
        // this.form.diler.id = value.obj_id
        // this.form.diler.base_sale = value.base_sale
        // this.modals.diler = !this.modals.diler
        router.push({
          name: "discounts_edit",
          params: { id: this.$route.params.id, client_id: value.client_id, store_id: value.store_id },
        });
      },
      setSale () {
        this.diler_loading = true
        const data = this.form.diler
        data.action = 'diler/set'
        this.$load(async () => {
          await this.set_diler_to_api(data)
            .then((result) => {
              this.diler_loading = false
              this.modals.diler = false
              this.get_dilers_from_api({
                type: 1,
                page: this.page_dilers,
                perpage: this.pagination_items_per_page_dilers
              })
            })
            .catch((result) => {
              console.log(result)
            })
        })
      }
    },
    mounted () {
      // this.get_dilers_from_api({
      //   type: 1,
      //   page: this.page_dilers,
      //   perpage: this.pagination_items_per_page_dilers
      // }).then(() => {
      //   if (this.dilers) {
      //     if (Object.prototype.hasOwnProperty.call(this.dilers, 'items')) {
      //       this.stores.items = this.dilers.items
      //     } else {
      //       this.stores.items = []
      //     }
      //     if (Object.prototype.hasOwnProperty.call(this.dilers, 'total')) {
      //       this.stores.total = this.dilers.total
      //     } else {
      //       this.stores.total = 0
      //     }
      //   }
      // })
      this.org_get_discount_individual_api({
        page: this.page_dilers,
        id: router.currentRoute._value.params.id,
        perpage: this.pagination_items_per_page_dilers,
        action: 'get/individual/discount'
      })
    },
    components: { vTable, vOpts, Toast, ConfirmDialog, RouterLink, TabView, TabPanel, Dialog, InputNumber, Breadcrumbs },
    computed: {
      ...mapGetters([
        'individual_discount'
      ])
    },
    watch: {
      
    }
  }
  </script>
  
<style lang="scss">

</style>
  