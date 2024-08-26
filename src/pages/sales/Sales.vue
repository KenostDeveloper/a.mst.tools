<template>
  <Toast />
  <ConfirmDialog></ConfirmDialog>
  <TabView class="tab-custom">
      <TabPanel header="Акции" v-if="organization.type != 1">
        <v-table
          :items_data="actions.items"
          :total="actions.total"
          :pagination_items_per_page="this.pagination_items_per_page"
          :pagination_offset="this.pagination_offset"
          :page="this.page"
          :table_data="this.table_data"
          :filters="this.filters"
          :title="'Мои акции'"
          @filter="filter"
          @sort="filter"
          @paginate="paginate"
          @editElem="editElem"
          @approveElem="approveElem"
          @deleteElem="deleteElem"
        >
          <template v-slot:button>
            <RouterLink :to="{ name: 'org_sales_add', params: { id: $route.params.id }}" class="dart-btn dart-btn-primary">Создать акцию</RouterLink>
          </template>
        </v-table>
      </TabPanel>
      <TabPanel header="Комплекты" v-if="organization.type != 1">
        <v-table
          :items_data="optcomplects.complects"
          :total="optcomplects.total"
          :pagination_items_per_page="this.pagination_items_per_page_complects"
          :pagination_offset="this.pagination_offset_complects"
          :page="this.page_complects"
          :table_data="this.table_data_complects"
          :filters="this.filters_complects"
          :title="'Мои комплекты'"
          @filter="filterComplects"
          @sort="filterComplects"
          @paginate="paginateComplects"
          @editElem="editComplects"
          @approveElem="approveComplects"
          @deleteElem="deleteComplects"
        >
          <template v-slot:button>
            <RouterLink :to="{ name: 'complect_add', params: { id: $route.params.id }}" class="dart-btn dart-btn-primary">Создать комлект</RouterLink>
          </template>
        </v-table>
      </TabPanel>
      <TabPanel header="Мои клиенты" v-if="organization.type == 3">
        <v-table
          :items_data="stores.items"
          :total="stores.total"
          :pagination_items_per_page="this.pagination_items_per_page_dilers"
          :pagination_offset="this.pagination_offset_dilers"
          :page="this.page_dilers"
          :table_data="this.table_data_dilers"
          title="Мои клиенты"
          @filter="filterDilers"
          @paginate="paginateDilers"
          @editElem="editDiler"
        />
      </TabPanel>
      <TabPanel header="Мои поставщики">
        <v-opts
            :items_data="warehouses.items"
            :total="warehouses.total"
            :pagination_items_per_page="this.pagination_items_per_page_dilers_opts"
            :pagination_offset="this.pagination_offset_dilers_opts"
            :page="this.optpage"
            :filters="this.optfilters"
            title="Доступные поставщики"
            @update="optUpdate"
            @filter="optfilter"
            @sort="optfilter"
            @paginate="optpaginate"
          >
            <template v-slot:desc>
              <span class="desc">Отметьте организации, которые являются вашими поставщиками.</span>
            </template>
          </v-opts>
      </TabPanel>
  </TabView>
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
import vTable from '../../components/table/v-table'
import { RouterLink } from 'vue-router'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Dialog from 'primevue/dialog'
import InputNumber from 'primevue/inputnumber'
import ConfirmDialog from 'primevue/confirmdialog'
import Toast from 'primevue/toast'
import vOpts from '@/components/table/v-opts'
import router from '@/router'

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
      warehouses: {
        items: [],
        total: -1
      },
      diler_loading: false,
      page: 1,
      page_complects: 1,
      page_dilers: 1,
      optpage: 1,
      optfilters: {
        filter: {
          name: 'Наименование, адрес',
          placeholder: 'Введите наименование или адрес',
          type: 'text'
        },
        region: {
          name: 'Регион',
          placeholder: 'Выберите регион',
          type: 'tree',
          values: this.getregions
        },
        our: {
          name: 'Мои поставщики',
          placeholder: 'Мои поставщики',
          type: 'checkbox',
          values: 1
        }
      },
      table_data_dilers: {
        name: {
          label: 'Наименование',
          type: 'link',
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
      filters: {
        name: {
          name: 'Название, бренд или артикул',
          placeholder: 'Название, бренд или артикул',
          type: 'text'
        }
      },
      filters_complects: {
        name: {
          name: 'Название, бренд или артикул',
          placeholder: 'Название, бренд или артикул',
          type: 'text'
        }
      },
      table_data: {
        image_inner: {
          label: 'Баннер',
          type: 'image',
          baseurl: false
        },
        name: {
          label: 'Наименование',
          type: 'link',
          link_to: 'promotion',
          link_params: {
            id: this.$route.params.id,
            action: 'id'
          },
          sort: true
        },
        store_name: {
          label: 'Склад',
          type: 'text'
        },
        date_from: {
          label: 'Действует с',
          type: 'text',
          sort: true
        },
        date_to: {
          label: 'Действует до',
          type: 'text',
          sort: true
        },
        active: {
          label: 'Активно',
          type: 'boolean'
        },
        actions: {
          label: 'Действия',
          type: 'actions',
          sort: false,
          available: {
            edit: {
              icon: 'pi pi-pencil',
              label: 'Редактировать'
            },
            approve: {
              icon: 'pi pi-power-off',
              label: 'Включить'
            },
            delete: {
              icon: 'pi pi-trash',
              label: 'Удалить'
            }
          }
        }
      },
      table_data_complects: {
        name: {
          label: 'Наименование',
          type: 'link',
          link_to: 'complect_edit',
          link_params: {
            id: this.$route.params.id,
            complect_id: 'id'
          },
          sort: true
        },
        active: {
          label: 'Активно',
          type: 'boolean'
        },
        actions: {
          label: 'Действия',
          type: 'actions',
          sort: false,
          available: {
            edit: {
              icon: 'pi pi-pencil',
              label: 'Редактировать'
            },
            approve: {
              icon: 'pi pi-power-off',
              label: 'Включить'
            },
            delete: {
              icon: 'pi pi-trash',
              label: 'Удалить'
            }
          }
        }
      }
    }
  },
  methods: {
    ...mapActions([
      'get_sales_to_api',
      'set_sales_to_api',
      'opt_get_complects',
      'opt_api',
      'get_dilers_from_api',
      'set_diler_to_api',
      'get_organization_from_api',
      'get_regions_from_api',
      'get_opts_from_api',
      'unset_opts'
    ]),
    filter (data) {
      data.type = 'b2b'
      this.get_sales_to_api(data)
    },
    filterComplects (data) {
      data.action = 'complects/get'
      data.store_id = router.currentRoute._value.params.id
      this.opt_get_complects(data)
    },
    filterDilers (data) {
      this.get_dilers_from_api(data)
    },
    paginateDilers (data) {
      this.get_dilers_from_api(data)
    },
    paginate (data) {
      this.page = data.page
      data.type = 'b2b'
      this.get_sales_to_api(data)
    },
    paginateComplects (data) {
      this.page_complects = data.page
      data.action = 'complects/get'
      data.store_id = router.currentRoute._value.params.id
      this.opt_get_complects(data)
    },
    editElem (value) {
      router.push({ name: 'org_sales_edit', params: { id: this.$route.params.id, sales_id: value.id } })
    },
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
    },
    editComplects (value) {
      router.push({ name: 'complect_edit', params: { id: this.$route.params.id, complect_id: value.id } })
    },
    approveElem (value) {
      this.$load(async () => {
        await this.set_sales_to_api({
          action: 'off/on',
          store_id: router.currentRoute._value.params.id,
          action_id: value.id
        })
          .then((result) => {
            this.get_sales_to_api({
              page: this.page,
              perpage: this.pagination_items_per_page,
              type: 'b2b'
            })
          })
          .catch((result) => {
            console.log(result)
          })
      })
    },
    approveComplects (value) {
      this.$load(async () => {
        await this.opt_api({
          action: 'complect/approve',
          store_id: router.currentRoute._value.params.id,
          complect_id: value.id
        })
          .then((result) => {
            this.page_complects = 1
            this.opt_get_complects({
              action: 'complects/get',
              page: this.page_complects,
              perpage: this.pagination_items_per_page_complects,
              store_id: router.currentRoute._value.params.id
            })
          })
          .catch((result) => {
            console.log(result)
          })
      })
    },
    deleteElem (value) {
      this.$load(async () => {
        await this.set_sales_to_api({
          action: 'delete',
          store_id: router.currentRoute._value.params.id,
          action_id: value.id
        })
          .then((result) => {
            this.get_sales_to_api({
              page: this.page,
              perpage: this.pagination_items_per_page,
              type: 'b2b'
            })
          })
          .catch((result) => {
            console.log(result)
          })
      })
    },
    deleteComplects (value) {
      this.$load(async () => {
        await this.opt_api({
          action: 'complect/delete',
          store_id: router.currentRoute._value.params.id,
          complect_id: value.id
        })
          .then((result) => {
            this.page_complects = 1
            this.opt_get_complects({
              action: 'complects/get',
              page: this.page_complects,
              perpage: this.pagination_items_per_page_complects,
              store_id: router.currentRoute._value.params.id
            })
          })
          .catch((result) => {
            console.log(result)
          })
      })
    },
    optfilter (data) {
      this.get_opts_from_api(data)
    },
    optpaginate (data) {
      this.get_opts_from_api(data)
    },
    optUpdate (data) {
      this.get_opts_from_api({
        page: this.optpage,
        perpage: this.pagination_items_per_page_dilers_opts
      })
    }
  },
  mounted () {
    this.get_organization_from_api().then(() => {
      this.get_regions_from_api().then(
        this.optfilters.region.values = this.getregions
      )
      this.get_opts_from_api({
        page: this.optpage,
        perpage: this.pagination_items_per_page_dilers_opts
      })
    })
    this.get_sales_to_api({
      page: this.page,
      perpage: this.pagination_items_per_page,
      type: 'b2b'
    })
    this.opt_get_complects({
      action: 'complects/get',
      page: this.page_complects,
      perpage: this.pagination_items_per_page_complects,
      store_id: router.currentRoute._value.params.id
    })
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
      'actions',
      'optcomplects',
      'dilers',
      'organization',
      'getregions',
      'opts'
    ])
  },
  watch: {
    getregions: function (newVal, oldVal) {
      this.optfilters.region.values = newVal
    },
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
    opts: function (newVal, oldVal) {
      if (typeof newVal === 'object') {
        if (Object.prototype.hasOwnProperty.call(newVal, 'items')) {
          this.warehouses.items = newVal.items
        } else {
          this.warehouses.items = []
        }
        if (Object.prototype.hasOwnProperty.call(newVal, 'total')) {
          this.warehouses.total = newVal.total
        } else {
          this.warehouses.total = 0
        }
      } else {
        this.warehouses.items = []
        this.warehouses.total = 0
      }
    }
  }
}
</script>

<style lang="scss">

.tab-custom{
  .p-tabview-nav{
    margin: 0 !important;
    border: 0 !important;
  }

  .p-tabview-header{
    padding: 0 !important;
  }

  .p-tabview-nav-link{
    border-color: #282828 !important;
    color: #282828 !important;
    text-decoration: none !important;
  }

  .p-tabview-ink-bar{
    height: 3px;
    padding: 0;
    background: #282828 !important;
  }
}
</style>
