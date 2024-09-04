<template>
    <Toast />
    <ConfirmDialog></ConfirmDialog>
    <div class="title-h1 mb-4">Индивидуальные скидки</div>
    <v-table
        :items_data="stores.items"
        :total="stores.total"
        :pagination_items_per_page="this.pagination_items_per_page_dilers"
        :pagination_offset="this.pagination_offset_dilers"
        :page="this.page_dilers"
        :table_data="this.table_data_dilers"
        title=""
        @filter="filterDilers"
        @paginate="paginateDilers"
        @editElem="editDiler"
    />
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
        table_data_dilers: {
          name: {
            label: 'Наименование',
            type: 'text',
            link_to: 'org_diler',
            link_params: {
              diler_id: 'id'
            }
          },
          warehouse: {
            label: 'Склад',
            type: 'text'
          },
          base_sale: {
            label: 'Базовая скидка, %',
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
        'set_diler_to_api',
      ]),
      editDiler (value) {
        this.form.diler.name = value.name
        this.form.diler.warehouse_id = value.warehouse_id
        this.form.diler.id = value.obj_id
        this.form.diler.base_sale = value.base_sale
        this.modals.diler = !this.modals.diler
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
      this.get_dilers_from_api({
        type: 1,
        page: this.page_dilers,
        perpage: this.pagination_items_per_page_dilers
      }).then(() => {
        if (this.dilers) {
          if (Object.prototype.hasOwnProperty.call(this.dilers, 'items')) {
            this.stores.items = this.dilers.items
          } else {
            this.stores.items = []
          }
          if (Object.prototype.hasOwnProperty.call(this.dilers, 'total')) {
            this.stores.total = this.dilers.total
          } else {
            this.stores.total = 0
          }
        }
      })
    },
    components: { vTable, vOpts, Toast, ConfirmDialog, RouterLink, TabView, TabPanel, Dialog, InputNumber },
    computed: {
      ...mapGetters([
        'dilers',
      ])
    },
    watch: {
      dilers: function (newVal, oldVal) {
        if (typeof newVal === 'object') {
          if (Object.prototype.hasOwnProperty.call(newVal, 'items')) {
            this.stores.items = newVal.items
          } else {
            this.stores.items = []
          }
          if (Object.prototype.hasOwnProperty.call(newVal, 'total')) {
            this.stores.total = newVal.total
          } else {
            this.stores.total = 0
          }
        } else {
          this.stores.items = []
          this.stores.total = 0
        }
      },
    }
  }
  </script>
  
<style lang="scss">

</style>
  