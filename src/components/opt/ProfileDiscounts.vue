<template>
  <div class="std-discounts" :class="{loading: loading}">
    <div class="title-h1 mb-4 std-discounts__title">Индивидуальные скидки</div>
    <v-table
      :items_data="individual_discount.items"
      :total="individual_discount.total"
      :pagination_items_per_page="this.pagination_items_per_page"
      :pagination_offset="this.pagination_offset"
      :page="this.page"
      :table_data="this.table_data"
      :filters="this.filters"
      @filter="filter"
      title=""
      @paginate="paginate"
      @editElem="editDiler"
    />
  </div>
</template>
  
<script>
  import { mapActions, mapGetters } from 'vuex'
  import vTable from '../table/v-table.vue'
  import { RouterLink } from 'vue-router'
  import vOpts from '../table/v-opts.vue'
  import router from '../../router'
  
  export default {
    name: 'ProfileSales',
    props: {
      pagination_items_per_page: {
        type: Number,
        default: 24
      },
      pagination_offset: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        storesall: [],
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
        loading: true,
        page: 1,
        filters: {
          name: {
            name: "Наименование",
            placeholder: "Наименование",
            type: "text",
          },
          manager: {
            name: "Менеджер",
            placeholder: "Выберите менеджера",
            type: "dropdown",
            values: []
          },
          store: {
            name: 'Склады',
            placeholder: 'Выберите склады',
            type: 'dropdown',
            values: this.storesall
          },
        },
        table_data: {
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
        'org_get_discount_individual_api',
        'org_get_stores_from_api',
        'org_get_managers_from_api'
      ]),
      filter(data) {
        this.loading = true
        this.page = 1
        this.org_get_discount_individual_api({
          page: this.page,
          id: router.currentRoute._value.params.id,
          perpage: this.pagination_items_per_page,
          action: 'get/individual/discount',
          filter: data
        }).then(() => {
          this.loading = false
        })
      },
      paginate(data) {
        this.loading = true
        this.page = data.page
        this.org_get_discount_individual_api({
          page: this.page,
          id: router.currentRoute._value.params.id,
          perpage: this.pagination_items_per_page,
          action: 'get/individual/discount',
          filter: data
        }).then(() => {
          this.loading = false
        })
      },
      editDiler (value) {
        router.push({
          name: "discounts_edit",
          params: { id: this.$route.params.id, client_id: value.org_client, store_id: value.store_id },
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
                perpage: this.pagination_items_per_page
              })
            })
            .catch((result) => {
              console.log(result)
            })
        })
      }
    },
    mounted () {
      this.org_get_stores_from_api({
          action: 'get/stores',
          id: this.$route.params.id
      })
      this.org_get_discount_individual_api({
        page: this.page,
        id: router.currentRoute._value.params.id,
        perpage: this.pagination_items_per_page,
        action: 'get/individual/discount'
      }).then(() => {
        this.loading = false
      })

      this.org_get_managers_from_api({
        action: "get/org/managers",
        id: router.currentRoute._value.params.id,
      });
    },
    components: { 
      vTable, 
      vOpts, 
      RouterLink 
    },
    computed: {
      ...mapGetters([
        'individual_discount',
        'org_stores',
        'org_managers'
      ])
    },
    watch: {
      org_stores: function (newVal, oldVal) {
        // console.log(newVal)
        this.storesall = []
        for (let i = 0; i < newVal.items.length; i++) {
          this.storesall.push({ name: newVal.items[i].name, id: newVal.items[i].id })
        }
        console.log(this.storesall)
      },
      org_managers: function (newVal, oldVal) {
        this.filters.manager.values = newVal
      }
    }
  }
  </script>
  
<style lang="scss">

</style>
  