<template>
  <div class="copo">
    <div class="to__up" v-if="$route.params.store_id">
      <router-link class="link-back" :to="{ name: 'store', params: { id: $route.params.id, store_id: $route.params.store_id } }">
        <mdicon name="arrow-left" />
        <span>Назад к брендам</span>
      </router-link>
    </div>
    <div class="to__up" v-else>
      <router-link class="link-back" :to="{ name: 'stores', params: { id: $route.params.id } }">
        <mdicon name="arrow-left" />
        <span>Назад к брендам</span>
      </router-link>
    </div>
    <div class="products">
      <v-table
        :items_data="report_copo_details.items"
        :total="report_copo_details.total"
        :pagination_items_per_page="this.pagination_items_per_page"
        :pagination_offset="this.pagination_offset"
        :page="this.page"
        :table_data="this.table_data"
        :filters="this.filters"
        :title="'Сопоставление по бренду ' + vendor.name"
        @filter="filter"
        @sort="filter"
        @paginate="paginate"
      >
        <template v-slot:desc>
          <div class="dart-alert dart-alert-info dart-mt-1">
            <span>На данной странице представлены товары бренда, найденые в вашем каталоге и статус сопоставления.</span>
          </div>
        </template>
        <template v-slot:button>
          <a :href="report_copo_details.file" class="dart-btn dart-btn-text" v-if="report_copo_details.file" download>
            <img src="../../assets/images/xslx.svg" alt="">
            <span>Скачать файл</span>
          </a>
        </template>
      </v-table>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import vTable from '../../components/table/v-table.vue'

export default {
  name: 'ReportCopoDetails',
  props: {
    pagination_items_per_page: {
      type: Number,
      default: 25
    },
    pagination_offset: {
      type: Number,
      default: 0
    },
    org: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      page: 1,
      vendor: {
        name: ''
      },
      filters: {
        name: {
          name: 'Наименование товара, артикул',
          placeholder: 'Наименование товара, артикул',
          type: 'text'
        },
        status: {
          name: 'Статус',
          placeholder: 'Статус',
          type: 'dropdown',
          values: this.getcardstatus
        },
        instock: {
          name: 'В наличии',
          placeholder: 'В наличии',
          type: 'checkbox',
          values: 1
        }
      },
      table_data: {
        image: {
          label: 'Фото',
          type: 'image'
        },
        article: {
          label: 'Артикул',
          type: 'text',
          sort: true
        },
        name: {
          label: 'Наименование',
          type: 'text',
          description: {
            type: 'field',
            key: 'catalog'
          },
          sort: true
        },
        price: {
          label: 'Розничная цена',
          type: 'text',
          sort: true
        },
        remains: {
          label: 'Фактическое наличие',
          type: 'text',
          sort: true
        },
        reserved: {
          label: 'Резерв',
          type: 'text',
          sort: true
        },
        available: {
          label: 'Доступно для продажи',
          type: 'text',
          sort: true
        },
        sales: {
          label: 'Продаж за все время',
          type: 'text',
          sort: true
        },
        summ: {
          label: 'Сумма',
          type: 'text',
          sort: true
        },
        status: {
          label: 'Статус',
          type: 'status',
          sort: true
        }
      }
    }
  },
  methods: {
    ...mapActions([
      'get_report_copo_details_from_api',
      'unset_report_copo_details',
      'get_cardstatus_from_api'
    ]),
    filter (data) {
      data.tabledata = this.table_data
      this.get_report_copo_details_from_api(data)
    },
    paginate (data) {
      this.page = data.page
      data.tabledata = this.table_data
      this.get_report_copo_details_from_api(data)
    }
  },
  mounted () {
    this.get_report_copo_details_from_api({
      tabledata: this.table_data,
      page: this.page,
      perpage: this.pagination_items_per_page
    })
    this.get_cardstatus_from_api()
  },
  unmounted () {
    this.unset_report_copo_details()
  },
  components: { vTable },
  computed: {
    ...mapGetters([
      'report_copo_details',      
      'getcardstatus'
    ])
  },
  watch: {
    getcardstatus: function (newVal, oldVal) {
      this.filters.status.values = newVal
    },
    report_copo_details: function (newVal, oldVal) {
      this.vendor = newVal.vendor
    }
  }
}
</script>

<style lang="scss">
</style>
