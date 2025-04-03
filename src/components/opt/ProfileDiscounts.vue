<template>
  <div class="std-discounts" :class="{loading: loading}">
    <div class="flex justify-content-space-between align-items-center mb-4">
      <div class="title-h1 mb-0 std-discounts__title">Индивидуальные скидки</div>
      <div class="flex align-items-center gap-2">
        <div
          @click="this.modal_discounts = true"
					class="dart-btn dart-btn-primary"
					>Создать индивидуальную скидку
        </div>
        <div
          @click="this.modal_discounts = true"
					class="dart-btn dart-btn-primary"
					>Добавить из 1с
        </div>
      </div>
    </div>
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

  <Dialog v-model:visible="this.modal_discounts" header="Выберите соглашение для создание из него индивидуальной скидки"
    :style="{ width: '940px' }">
    <!-- <div class="dart-alert dart-alert-info">Обратите внимание! Здесь отображаются только те потребности, которые привязаны к Складу доставки.</div> -->
    <v-table
      class="std-table__wrapper"
      :filters="this.filters_agreement"
      :items_data="agreement.items"
      :total="agreement.total"
      :pagination_items_per_page="this.pagination_items_per_page"
      :pagination_offset="this.pagination_offset"
      :page="this.requirements_page"
      :table_data="this.table_data_agreement"
      :title="''"
      @filter="filterAgreement"
      @sort="filterRequirements"
      @paginate="paginateAgreement"
      @viewElem="viewReq"
      @deleteElem="deleteReq"
    >
      <template v-slot:button>
        <a href="#" class="dart-btn dart-btn-primary" @click.prevent="() => {this.modal_requirement = !this.modal_requirement}">Создать</a>
      </template>
    </v-table>
  </Dialog>
</template>
  
<script>
  import { mapActions, mapGetters } from 'vuex'
  import vTable from '../table/v-table.vue'
  import { RouterLink } from 'vue-router'
  import vOpts from '../table/v-opts.vue'
  import router from '../../router'
  import Dialog from "primevue/dialog";
  
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
        modal_discounts: false,
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
        page_agreement: 1,
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
          name: {
            label: 'Наименование',
            type: 'text',
          },
          client_name: {
            label: 'Организация',
            type: 'text',
          },
          // store_name: {
          //   label: 'Склад',
          //   type: 'text'
          // },
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
        table_data_agreement: {
          name: {
            label: 'Название соглашения',
            type: 'text'
          },
          name_client: {
            label: 'Название клиента',
            type: 'text'
          },
          inn: {
            label: 'ИНН',
            type: 'text'
          },
          kpp: {
            label: 'КПП',
            type: 'text'
          },
          status: {
            label: 'Статус',
            type: 'status'
          },
          active: {
            label: "Активно",
            type: "boolean",
          },
          actions: {
            label: 'Действия',
            type: 'actions',
            sort: false,
            available: {
              edit: {
                icon: 'pi pi-caret-right',
                label: 'Создать индивидуальную скидку'
              }
            }
          }
        },
        filters_agreement: {
          name: {
            name: "Наименование",
            placeholder: "Наименование",
            type: "text",
          },
        },
      }
    },
    methods: {
      ...mapActions([
        'get_dilers_from_api',
        'org_get_discount_individual_api',
        'org_get_stores_from_api',
        'org_get_managers_from_api',
        'get_agreement_api'
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
      filterAgreement(data) {
        this.loading = true
        this.page = 1
        this.get_agreement_api({
          action: "get/agreement",
          id: router.currentRoute._value.params.id,
          page: this.page_agreement,
          perpage: this.pagination_items_per_page,
          filter: data
        }).then(() => {
          this.loading = false
        })
      },
      paginateAgreement(data) {
        this.loading = true
        this.page = 1
        this.get_agreement_api({
          action: "get/agreement",
          id: router.currentRoute._value.params.id,
          page: this.page_agreement,
          perpage: this.pagination_items_per_page,
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
          params: { id: this.$route.params.id, action_id: value.id },
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

      this.get_agreement_api({
        action: "get/agreement",
        id: router.currentRoute._value.params.id,
        page: this.page_agreement,
        perpage: this.pagination_items_per_page,
      })
    },
    components: { 
      vTable, 
      vOpts, 
      RouterLink,
      Dialog
    },
    computed: {
      ...mapGetters([
        'individual_discount',
        'org_stores',
        'org_managers',
        'agreement'
      ])
    },
    watch: {
      org_stores: function (newVal, oldVal) {
        // console.log(newVal)
        this.storesall = []
        for (let i = 0; i < newVal.items.length; i++) {
          this.storesall.push({ name: newVal.items[i].name, id: newVal.items[i].id })
        }
      },
      org_managers: function (newVal, oldVal) {
        this.filters.manager.values = newVal
      }
    }
  }
  </script>
  
<style lang="scss">

</style>
  