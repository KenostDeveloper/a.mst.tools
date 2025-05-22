<template>
    <!-- <span class="title-h1 mb-4">Розничные акции</span> -->
    <Breadcrumbs class="std-breadcrumbs--margin" />
    <div class="flex align-items-center justify-content-space-between mb-4">

				<div class="title-h1">Розничные акции</div>
				<RouterLink
					:to="{ name: 'org_action_add', params: { id: $route.params.id } }"
					class="dart-btn dart-btn-primary"
					>Создать акцию</RouterLink
				>
			</div>
    <!-- <TabView class="tab-custom"> -->
        <!-- <TabPanel header="Акции"> -->
          <v-table
            :items_data="actions.items"
            :total="actions.total"
            :pagination_items_per_page="this.pagination_items_per_page"
            :pagination_offset="this.pagination_offset"
            :page="this.page"
            :table_data="this.table_data"
            :filters="this.filters"
            :title="''"
            @filter="filter"
            @sort="filter"
            @paginate="paginate"
            @editElem="editElem"
            @approveElem="approveElem"
            @deleteElem="deleteElem"
          >
            <template v-slot:button>
              <!-- <RouterLink :to="{ name: 'org_action_add', params: { id: $route.params.id }}" class="dart-btn dart-btn-primary">Создать подборку</RouterLink> -->
            </template>
          </v-table>
        <!-- </TabPanel> -->
    <!-- </TabView> -->

    <!-- <v-table
      :items_data="matrixs.items"
      :total="matrixs.total"
      :pagination_items_per_page="this.pagination_items_per_page"
      :pagination_offset="this.pagination_offset"
      :page="this.page"
      :table_data="this.table_data"
      :filters="this.filters"
      title="Ключевые матрицы"
      @filter="filter"
      @sort="filter"
      @paginate="paginate"
    >
      <template v-slot:button>
        <RouterLink :to="{ name: 'org_matrix_add', params: { id: $route.params.id }}" class="dart-btn dart-btn-primary">Добавить матрицу</RouterLink>
      </template>
    </v-table> -->

    <Dialog v-model:visible="this.modal_approve" header=" " :style="{ width: '340px' }">
        <div class="kenost-not-produc">
            <img src="/images/icons_milen/action-error.png" alt="">
            <b>Продлите сроки акции</b>
            <p>Для активации этой акции необходимо продлить ее сроки.</p>
            <div class="a-dart-btn a-dart-btn-primary" @click="this.modal_approve = false">Понятно</div>
        </div>
    </Dialog>
  </template>

<script>
import { mapActions, mapGetters } from 'vuex'
import vTable from '../../components/table/v-table.vue'
import { RouterLink } from 'vue-router'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import router from '../../router'
import Breadcrumbs from '../../components/Breadcrumbs.vue'
import Dialog from "primevue/dialog";

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
    }
  },
  data () {
    return {
      page: 1,
      modal_approve: false,
      filters: {
        name: {
          name: 'Наименование',
          placeholder: 'Наименование',
          type: 'text'
        }
      },
      table_data: {
        id: {
					label: "Номер",
					type: "text"
				},
        image_small: {
          label: 'Баннер',
          type: 'image',
          baseurl: true
        },
        name: {
          label: 'Наименование',
          type: 'link',
          link_to: 'org_action_edit',
          link_params: {
            id: this.$route.params.id,
            sales_id: 'id'
          },
          sort: true
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
        status: {
          label: 'Статус',
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
      }
    }
  },
  methods: {
    ...mapActions([
      'get_sales_to_api',
      'set_sales_to_api'
    ]),
    filter (data) {
      data.type = 2
      this.get_sales_to_api(data)
    },
    paginate (data) {
      data.type = 2
      this.get_sales_to_api(data)
    },
    editElem (value) {
      router.push({ name: 'org_action_edit', params: { id: this.$route.params.id, sales_id: value.id } })
    },
    approveElem (value) {
      this.$load(async () => {
        await this.set_sales_to_api({
          action: "off/on",
					// store_id: value.store_id,
					action_id: value.id,
					id: router.currentRoute._value.params.id,
        })
          .then((result) => {
            if(result.data.data.status){
							this.get_sales_to_api({
                page: this.page,
                perpage: this.pagination_items_per_page,
                type: 2
              })
						} else {
							this.modal_approve = true
						}
          })
          .catch((result) => {
            console.log(result)
          })
      })
    },
    deleteElem (value) {
      this.$load(async () => {
        await this.set_sales_to_api({
          action: "delete",
					id: router.currentRoute._value.params.id,
					action_id: value.id,
        })
          .then((result) => {
            this.get_sales_to_api({
              page: this.page,
              perpage: this.pagination_items_per_page,
              type: 2
            })
          })
          .catch((result) => {
            console.log(result)
          })
      })
    }
  },
  mounted () {
    this.get_sales_to_api({
      page: this.page,
      perpage: this.pagination_items_per_page,
      type: 2
    })
  },
  components: { vTable, RouterLink, TabView, TabPanel, Breadcrumbs, Dialog },
  computed: {
    ...mapGetters([
      'actions'
    ])
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
