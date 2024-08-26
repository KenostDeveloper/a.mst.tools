<template>
  <div>
    <div class="to__up" v-if="diler.type == 1">
      <router-link :to="{ name: 'org_dilers', params: { id: $route.params.id } }">
        <mdicon name="arrow-left" />
        <span>Назад к магазинам</span>
      </router-link>
    </div>
    <div class="to__up" v-if="diler.type == 2">
      <router-link :to="{ name: 'org_opts', params: { id: $route.params.id } }">
        <mdicon name="arrow-left" />
        <span>Назад к оптовикам</span>
      </router-link>
    </div>
    <div class="analitics-widget">
      <h2 class="title">{{ diler.name }}</h2>
      <div class="organization" >
        <div class="dart-row">
          <div class="d-col-md-3">
            <div class="panel-widget panel-widget-date">
                <span class="date">{{ date }}</span>
                <span class="month">{{ month }}</span>
                <span class="day">{{ day }}</span>
            </div>
          </div>
          <div class="d-col-md-4" v-if="products.all">
            <div class="panel-widget panel-widget-summ">
              <span>Остатки</span>
              <span class="sum">{{ products.summ }} ₽</span>
              <span class="num">{{ products.count_all }} шт.</span>
            </div>
          </div>
          <div class="d-col-md-4">
            <div class="panel-widget panel-widget-summ">
              <span>Заказы за неделю</span>
              <span class="sum">{{ orders.summ }} ₽</span>
              <span class="num">{{ orders.count }} шт.</span>
            </div>
          </div>
          <div class="d-col-md-4" v-if="products.all">
            <div class="panel-widget panel-widget-remains">
                <div class="panel-widget-remains__graph">
                  <Chart type="doughnut" :data="chartData" :options="chartOptions" class="w-full md:w-5rem" />
                  <span class="count">{{ $filters.round(products.copo_money_percent) }}%</span>
                  <span>сопоставленных<br/> товаров по стоимости</span>
                </div>
                <div class="panel-widget-remains__stat">
                  <div class="panel-widget-remains__stat-item">
                    <div class="data">
                      <span>Товаров на сумму</span>
                      <span>{{ products.summ }}</span>
                    </div>
                    <div class="line">
                      <span style="width: 100%;"></span>
                    </div>
                  </div>
                  <div class="panel-widget-remains__stat-item">
                    <div class="data">
                      <span>Товаров сопоставлено на сумму</span>
                      <span>{{ products.summ_copo }}</span>
                    </div>
                    <div class="line">
                      <span :style="'width: ' + products.copo_money_percent + '%;'"></span>
                    </div>
                  </div>
                </div>
                <div class="products_href">
                  <router-link :to="{ name: 'org_diler_products', params: { id: $route.params.diler_id } }">
                    Товары организации
                    <mdicon name="arrow-right" />
                  </router-link>
                </div>
            </div>
          </div>
          <div class="d-col-md-4" v-if="products.all">
            <div class="panel-widget panel-widget-remains">
                <div class="panel-widget-remains__graph">
                  <Chart type="doughnut" :data="chartData" :options="chartOptions" class="w-full md:w-5rem" />
                  <span class="count">{{ $filters.round(products.copo_percent) }}%</span>
                  <span>сопоставленных<br/> товаров</span>
                </div>
                <div class="panel-widget-remains__stat">
                  <div class="panel-widget-remains__stat-item">
                    <div class="data">
                      <span>Товаров всего</span>
                      <span>{{ products.all }}</span>
                    </div>
                    <div class="line">
                      <span style="width: 100%;"></span>
                    </div>
                  </div>
                  <div class="panel-widget-remains__stat-item">
                    <div class="data">
                      <span>Товаров сопоставлено</span>
                      <span>{{ products.copo }}</span>
                    </div>
                    <div class="line">
                      <span :style="'width: ' + products.copo_percent + '%;'"></span>
                    </div>
                  </div>
                </div>
                <div class="products_href">
                  <router-link :to="{ name: 'org_diler_products', params: { id: $route.params.diler_id } }">
                    Товары организации
                    <mdicon name="arrow-right" />
                  </router-link>
                </div>
            </div>
          </div>
          <div class="d-col-md-2" v-for="item in diler.brands" :key="item.id">
            <div class="panel-widget panel-widget-summ">
              <span> {{ item.name }} </span>
              <span class="sum">{{ item.count }} шт.</span>
              <span class="num">Кол-во сопоставленных товаров по бренду {{ item.name }}</span>
            </div>
          </div>
          <div class="d-col-md-3" v-if="diler.type != 1">
            <div class="panel-widget panel-widget-dilers">
              <span class="title">Дилеры</span>
              <div class="numbers">
                <div class="item">
                  <span class="labels">Кол-во</span>
                  <div class="info">
                    <i class="d_icon d_icon-account-circle"></i>
                    <span>{{ dilers.count }} шт.</span>
                  </div>
                </div>
                <div class="item">
                  <span class="labels">Сумма заказов за 7 дн.</span>
                  <div class="info">
                    <i class="d_icon">
                      <span>₽</span>
                    </i>
                    <span>{{ dilers.summ }} ₽</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="d-col-md-8" v-if="shipment.total">
            <div class="panel-widget panel-widget-shipping">
              <span class="title">Ближайшие отгрузки</span>
              <div class="shippings">
                <div class="item" v-for="ship in shipment.items" v-bind:key="ship.id">
                  <div class="date">
                    <span class="day">{{ ship.day }}</span>
                    <span class="month">{{ ship.month }}</span>
                  </div>
                  <div class="info">
                    <span>{{ ship.dilers }}</span>
                  </div>
                  <a href="#" class="more">Подробнее</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="dart-row">
          <div class="d-col-md-6" v-if="no_money.top">
            <div class="panel-widget panel-widget-top-nomoney">
              <v-table
                :items_data="no_money.top"
                :total="5"
                :pagination_items_per_page="this.pagination_items_per_page"
                :pagination_offset="this.pagination_offset"
                :page="this.page"
                :table_data="this.top_data"
                title="ТОП-5 товаров по прогнозу упущенной выручки"
                class="widget_table"
              >
              </v-table>
            </div>
          </div>
          <div class="d-col-md-6" v-if="forecast.top">
            <div class="panel-widget panel-widget-top-nomoney">
              <v-table
                :items_data="forecast.top"
                :total="5"
                :pagination_items_per_page="this.pagination_items_per_page"
                :pagination_offset="this.pagination_offset"
                :page="this.page"
                :table_data="this.forecast_data"
                title="ТОП-5 товаров по прогнозу меньшего кол-ва остатков"
                class="widget_table"
              >
              </v-table>
            </div>
          </div>
          <div class="d-col-md-12">
            <div class="panel-widget panel-widget-top-nomoney">
              <v-table
                :items_data="diler_products.products"
                :total="diler_products.total"
                :pagination_items_per_page="this.pagination_items_per_page"
                :pagination_offset="this.pagination_offset"
                :page="this.page"
                :table_data="this.product_table_data"
                :filters="this.products_filters"
                @filter="filter"
                @sort="filter"
                @paginate="paginate"
                title="Статистика"
                class="widget_table"
              >
                <template v-slot:desc>
                  <div class="dart-alert dart-alert-info">Параметр <b>"Дней с Out Of Stock"</b> расчитывается за последний календарный месяц.<br/>Фильтры <b>"Категория товара"</b> и <b>"Производитель"</b> работает только с теми остатками, с которыми произошло сопоставление с карточками товаров из нашего справочника.</div>
                </template>
                <template v-slot:widgets>
                  <div class="dart-row">
                    <div class="d-col-md-3" v-if="avg_info.remains">
                      <div class="panel-widget panel-widget-summ panel-widget-blue">
                        <span>Остатков всего</span>
                        <span class="sum">{{ avg_info.remains }} шт</span>
                        <span class="num">шт</span>
                      </div>
                    </div>
                    <div class="d-col-md-3" v-if="avg_info.no_money">
                      <div class="panel-widget panel-widget-summ panel-widget-red">
                        <span>Упущенная выручка</span>
                        <span class="sum">{{ avg_info.no_money }}</span>
                        <span class="num">₽</span>
                      </div>
                    </div>
                    <div class="d-col-md-3" v-if="avg_info.sales_speed">
                      <div class="panel-widget panel-widget-summ  panel-widget-green">
                        <span>Средняя скорость продаж</span>
                        <span class="sum">{{ avg_info.sales_speed }}</span>
                        <span class="num">шт/день</span>
                      </div>
                    </div>
                  </div>
                </template>
              </v-table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Chart from 'primevue/chart'
import vTable from '@/components/table/v-table'

export default {
  name: 'ProfileDiler',
  props: {
    org: {
      type: Array,
      default: () => {
        return []
      }
    },
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
      chartData: null,
      chartDataMoney: null,
      chartOptions: {
        cutout: '60%'
      },
      avg_info: {
        remains: 0,
        no_money: 0,
        sales_speed: 0
      },
      products: {
        copo_percent: 0,
        all: 0,
        copo: 0,
        count_all: 0,
        summ: 0
      },
      orders: {
        summ: 0,
        count: 0
      },
      dilers: {
        summ: 0,
        count: 0
      },
      distr: {
        summ: 0,
        count: 0
      },
      shipment: {
        total: 0,
        items: []
      },
      no_money: {

      },
      forecast: {

      },
      products_filters: {
        name: {
          name: 'Наименование, артикул',
          placeholder: 'Наименование, артикул',
          type: 'text'
        },
        no_motion: {
          name: 'Дней без движения',
          placeholder: 'Дней без движения',
          type: 'number',
          step: 10
        },
        vendor: {
          name: 'Производитель',
          placeholder: 'Выберите производителя',
          type: 'dropdown',
          values: this.getvendors
        },
        catalog: {
          name: 'Категория товара',
          placeholder: 'Выберите категорию',
          type: 'tree',
          values: this.getcatalog
        },
        minuses: {
          name: 'Только отрицательные значения',
          placeholder: 'Только отрицательные значения',
          type: 'checkbox'
        },
        instock: {
          name: 'Только в наличии',
          placeholder: 'Только в наличии',
          type: 'checkbox'
        }
      },
      product_table_data: {
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
          sort: true
        },
        price: {
          label: 'Цена товара',
          type: 'text',
          sort: true
        },
        remains: {
          label: 'Остаток сейчас',
          type: 'text',
          sort: true
        },
        sales_30: {
          label: 'Продаж за 30 дней',
          type: 'text',
          sort: true
        },
        purchase_speed: {
          label: 'Скорость продажи шт/день',
          type: 'text',
          sort: true
        },
        out_of_stock_days: {
          label: 'Дней с Out Of Stock',
          type: 'text',
          sort: true
        },
        no_money: {
          label: 'Упущенная выручка',
          type: 'text',
          sort: true
        },
        forecast_all: {
          label: 'Прогноз остатков на завтра / 7 дней',
          type: 'text',
          sort: true
        }
      },
      top_data: {
        name: {
          label: 'Наименование',
          type: 'text',
          sort: false
        },
        article: {
          label: 'Артикул',
          type: 'text',
          sort: false
        },
        out_of_stock_days: {
          label: 'Дней с Out Of Stock',
          type: 'text',
          sort: false
        },
        no_money: {
          label: 'Упущенная выручка',
          type: 'text',
          sort: false
        }
      },
      forecast_data: {
        name: {
          label: 'Наименование',
          type: 'text',
          sort: false
        },
        article: {
          label: 'Артикул',
          type: 'text',
          sort: false
        },
        remains: {
          label: 'Остаток сейчас',
          type: 'text',
          sort: false
        },
        forecast_all: {
          label: 'Прогноз остатков на завтра/7 дней',
          type: 'text',
          sort: false
        }
      }
    }
  },
  methods: {
    ...mapActions([
      'get_diler_from_api',
      'get_diler_products_from_api',
      'get_catalog_from_api',
      'get_vendors_from_api'
    ]),
    setChartData () {
      return {
        datasets: [
          {
            data: [this.diler.products.copo_percent, this.diler.products.no_copo_percent],
            backgroundColor: ['#008FFF', '#EEEEEE'],
            hoverBackgroundColor: ['#008FFF', '#EEEEEE']
          }
        ]
      }
    },
    setChartDataMoney () {
      return {
        datasets: [
          {
            data: [this.diler.products.copo_money_percent, this.diler.products.no_copo_money_percent],
            backgroundColor: ['#008FFF', '#EEEEEE'],
            hoverBackgroundColor: ['#008FFF', '#EEEEEE']
          }
        ]
      }
    },
    filter (data) {
      this.get_diler_products_from_api(data).then(() => {
        this.avg_info.remains = this.diler_products.avg_info.remains
        this.avg_info.no_money = this.diler_products.avg_info.no_money
        this.avg_info.sales_speed = this.diler_products.avg_info.sales_speed
      })
    },
    paginate (data) {
      this.page = data.page
      this.get_diler_products_from_api(data).then(() => {
        this.avg_info.remains = this.diler_products.avg_info.remains
        this.avg_info.no_money = this.diler_products.avg_info.no_money
        this.avg_info.sales_speed = this.diler_products.avg_info.sales_speed
      })
    }
  },
  mounted () {
    this.get_catalog_from_api().then(
      this.products_filters.catalog.values = this.getcatalog
    )
    this.get_vendors_from_api().then(
      this.products_filters.vendor.values = this.getvendors
    )
    this.get_diler_from_api().then(() => {
      this.chartData = this.setChartData()
      this.chartDataMoney = this.setChartDataMoney()
      const num = this.diler.products.copo_percent
      this.products.copo_percent = num
      this.products.all = this.diler.products.count
      this.products.copo = this.diler.products.copo_count
      this.products.count_all = this.diler.products.count_all
      this.products.copo_money_percent = this.diler.products.copo_money_percent
      this.products.no_copo_money_percent = this.diler.products.no_copo_money_percent
      this.products.summ_copo = this.diler.products.summ_copo
      this.products.summ = this.diler.products.summ
      // orders.summ && orders.count
      this.dilers.summ = this.diler.dilers.summ
      this.dilers.count = this.diler.dilers.count
      this.distr.summ = this.diler.distr.summ
      this.distr.count = this.diler.distr.count
      this.shipment.total = this.diler.shipment.total
      this.shipment.items = this.diler.shipment.items
      this.no_money = this.diler.no_money
      this.forecast = this.diler.forecast
      this.get_diler_products_from_api({
        page: this.page,
        perpage: this.pagination_items_per_page
      }).then(() => {
        this.avg_info.remains = this.diler_products.avg_info.remains
        this.avg_info.no_money = this.diler_products.avg_info.no_money
        this.avg_info.sales_speed = this.diler_products.avg_info.sales_speed
      })
    })
  },
  components: { Chart, vTable },
  computed: {
    ...mapGetters([
      'diler',
      'diler_products',
      'getcatalog',
      'getvendors'
    ]),
    date () {
      const today = new Date()
      return today.getDate()
    },
    month () {
      const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
      ]
      const today = new Date()
      return monthNames[today.getMonth()]
    },
    day () {
      const dayNames = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']
      const today = new Date()
      return dayNames[today.getDay()]
    }
  }
}
</script>

<style lang="scss">
  .products_href{
    position: absolute;
    right: 15px;
    bottom: 15px;
    font-size: 14px;
    a{
      text-decoration: none;
    }
  }
  .v-table.widget_table{
    .title{
      display: block;
      color: #282828;
      font-size: 20px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
    }
    thead{
      tr{
        border-radius: 5px;
        overflow: hidden;
        border-bottom: none;
        th{
          color: #FFF;
          height: 74px;
          vertical-align: middle;
          font-size: 14px;
          font-style: normal;
          font-weight: 500;
          line-height: 106%; /* 14.84px */
          letter-spacing: 0.25px;
          background: #282828;
          &:first-child{
            text-align: left;
            border-top-left-radius: 5px;
            border-bottom-left-radius: 5px;
          }
          &:last-child{
            border-top-right-radius: 5px;
            border-bottom-right-radius: 5px;
          }
          a{
            color: #FFF;
            &.sort::after{
              color: #fff;
            }
          }
        }
      }
    }
    tbody{
      tr{
        td{
          &:first-child{
            text-align: left;
          }
        }
      }
    }
  }
</style>
