<template>
  <div class="copo">
    <div class="to__up">
      <router-link :to="{ name: 'organizations' }">
        <mdicon name="arrow-left" />
        <span>Назад к организациям</span>
      </router-link>
    </div>
    <div class="products">
      <v-table
        :items_data="report_copo_all.items"
        :total="report_copo_all.total"
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
        <template v-slot:widgets>
          <div class="row">
            <div class="d-col-md-4" v-if="report_copo_all.all_data">
              <div class="panel-widget panel-widget-summ">
                <span>Остатки</span>
                <span class="sum">{{ report_copo_all.all_data.all_summ }} ₽</span>
                <span class="num">{{ report_copo_all.all_data.all_count }} шт.</span>
              </div>
            </div>
            <div class="d-col-md-4" v-if="report_copo_all.all_data">
              <div class="panel-widget panel-widget-remains">
                <div class="panel-widget-remains__graph">
                  <Chart type="doughnut" :data="chartData" :options="chartOptions" class="w-full md:w-5rem" />
                  <span class="count">{{ report_copo_all.all_data.copo_percent }}%</span>
                  <span>сопоставленных<br/> товаров</span>
                </div>
                <div class="panel-widget-remains__stat">
                  <div class="panel-widget-remains__stat-item">
                    <div class="data">
                      <span>Товаров всего</span>
                      <span>{{ report_copo_all.all_data.all_count }}</span>
                    </div>
                    <div class="line">
                      <span style="width: 100%;"></span>
                    </div>
                  </div>
                  <div class="panel-widget-remains__stat-item">
                    <div class="data">
                      <span>Товаров сопоставлено</span>
                      <span>{{ report_copo_all.all_data.copo_count }}</span>
                    </div>
                    <div class="line">
                      <span :style="'width: ' + report_copo_all.all_data.copo_percent + '%;'"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="d-col-md-4" v-if="report_copo_all.all_data">
              <div class="panel-widget panel-widget-remains">
                <div class="panel-widget-remains__graph">
                  <Chart type="doughnut" :data="chartDataMoney" :options="chartOptions" class="w-full md:w-5rem" />
                  <span class="count">{{ report_copo_all.all_data.money_copo_percent }}%</span>
                  <span>сопоставленных<br/> товаров по стоимости</span>
                </div>
                <div class="panel-widget-remains__stat">
                  <div class="panel-widget-remains__stat-item">
                    <div class="data">
                      <span>Товаров всего</span>
                      <span>{{ report_copo_all.all_data.all_summ }}</span>
                    </div>
                    <div class="line">
                      <span style="width: 100%;"></span>
                    </div>
                  </div>
                  <div class="panel-widget-remains__stat-item">
                    <div class="data">
                      <span>Товаров сопоставлено</span>
                      <span>{{ report_copo_all.all_data.copo_summ }}</span>
                    </div>
                    <div class="line">
                      <span :style="'width: ' + report_copo_all.all_data.money_copo_percent + '%;'"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </v-table>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Chart from 'primevue/chart'
import vTable from '@/components/table/v-table'

export default {
  name: 'ReportCopoAll',
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
      chartData: null,
      chartDataMoney: null,
      chartOptions: {
        cutout: '60%'
      },
      filters: {
        name: {
          name: 'Наименование бренда',
          placeholder: 'Наименование бренда',
          type: 'text'
        },
        active: {
          name: 'Только активные точки',
          placeholder: 'Только активные точки',
          type: 'checkbox',
          values: 1
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
          link_to: 'report_copo_all_details',
          link_params: {
            vendor_id: 'id'
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
      'get_report_copo_all_from_api',
      'unset_report_copo_all'
    ]),
    filter (data) {
      this.page = 1
      this.unset_report_copo_all()
      this.get_report_copo_all_from_api(data)
    },
    paginate (data) {
      this.unset_report_copo_all()
      this.page = data.page
      this.get_report_copo_all_from_api(data)
    },
    setChartData () {
      // console.log(this.report_copo_all)
      if (this.report_copo_all.length) {
        return {
          datasets: [
            {
              data: [this.report_copo_all.all_data.copo_percent, this.report_copo_all.all_data.no_copo_percent],
              backgroundColor: ['#008FFF', '#EEEEEE'],
              hoverBackgroundColor: ['#008FFF', '#EEEEEE']
            }
          ]
        }
      } else {
        return {
          datasets: [
            {
              data: [0, 0],
              backgroundColor: ['#008FFF', '#EEEEEE'],
              hoverBackgroundColor: ['#008FFF', '#EEEEEE']
            }
          ]
        }
      }
    },
    setChartDataMoney () {
      if (this.report_copo_all.length) {
        return {
          datasets: [
            {
              data: [this.report_copo_all.all_data.money_copo_percent, this.report_copo_all.all_data.no_money_copo_percent],
              backgroundColor: ['#008FFF', '#EEEEEE'],
              hoverBackgroundColor: ['#008FFF', '#EEEEEE']
            }
          ]
        }
      } else {
        return {
          datasets: [
            {
              data: [0, 0],
              backgroundColor: ['#008FFF', '#EEEEEE'],
              hoverBackgroundColor: ['#008FFF', '#EEEEEE']
            }
          ]
        }
      }
    }
  },
  mounted () {
    this.get_report_copo_all_from_api({
      page: this.page,
      perpage: this.pagination_items_per_page
    }).then(() => {
      this.chartData = this.setChartData()
      this.chartDataMoney = this.setChartDataMoney()
    })
  },
  unmounted () {
    this.unset_report_copo_all()
  },
  components: { vTable, Chart },
  computed: {
    ...mapGetters([
      'report_copo_all'
    ])
  },
  watch: {
    report_copo_all: function () {
      this.setChartData()
      this.setChartDataMoney()
    }
  }
}
</script>

<style lang="scss">
</style>
