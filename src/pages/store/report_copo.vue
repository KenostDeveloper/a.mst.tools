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
        :items_data="report_copo.items"
        :total="report_copo.total"
        :pagination_items_per_page="this.pagination_items_per_page"
        :pagination_offset="this.pagination_offset"
        :page="this.page"
        :table_data="this.table_data"
        :filters="this.filters"
        title="Сопоставление по брендам"
        @filter="filter"
        @sort="filter"
        @paginate="paginate"
      >
        <template v-slot:desc>
          <div class="dart-alert dart-alert-info dart-mt-1">
            <span>На данной странице представлены бренды, найденые в вашем каталоге и статус сопоставления. Более подробный отчет по бренду вы можете посмотреть, кликнув на наименование бренда.</span>
          </div>
        </template>
        <template v-slot:button>
          <a :href="report_copo.file" class="dart-btn dart-btn-text" v-if="report_copo.file" download>
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
  name: 'ReportCopo',
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
      filters: {
        name: {
          name: 'Наименование бренда',
          placeholder: 'Наименование бренда',
          type: 'text'
        },
        instock: {
          name: 'В наличии',
          placeholder: 'В наличии',
          type: 'checkbox',
          values: 1
        }
      },
      table_data: {
        name: {
          label: 'Наименование',
          type: 'link',
          link_to: 'report_copo_details',
          link_params: {
            id: this.$route.params.id,
            brand_id: 'vendor_id'
          },
          sort: true
        },
        find: {
          label: 'Найдено',
          type: 'text',
          sort: true
        },
        identified: {
          label: 'Сопоставлено',
          type: 'text',
          sort: true
        },
        no_identified: {
          label: 'Не сопоставлено',
          type: 'text',
          sort: true
        },
        cards: {
          label: 'Карточек создано',
          type: 'text',
          sort: true
        },
        percent_identified: {
          label: '% сопоставления',
          type: 'text',
          sort: true
        },
        vendor_price: {
          label: 'Сумма товара, ₽',
          type: 'text',
          sort: true
        },
        percent_summ_identified: {
          label: '% сопоставления от суммы товара',
          type: 'text',
          sort: true
        }
      }
    }
  },
  methods: {
    ...mapActions([
      'get_report_copo_from_api'
    ]),
    filter (data) {
      data.tabledata = this.table_data
      this.get_report_copo_from_api(data)
    },
    paginate (data) {
      this.page = data.page
      data.tabledata = this.table_data
      this.get_report_copo_from_api(data)
    }
  },
  mounted () {
    this.get_report_copo_from_api({
      tabledata: this.table_data,
      page: this.page,
      perpage: this.pagination_items_per_page
    })
  },
  components: { vTable },
  computed: {
    ...mapGetters([
      'report_copo'
    ])
  }
}
</script>

<style lang="scss">
</style>
