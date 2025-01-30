<template>
    <div>
      <div class="analitics-widget">
        <!-- <Toast /> -->
        <h2 class="title mb-4 mt-5">{{ organization.name }}</h2>
        <div class="organization" >
          <div class="dart-row">
            <div class="d-col-md-3">
              <div class="panel-widget panel-widget-date">
                  <span class="date">{{ date }}</span>
                  <span class="month">{{ month }}</span>
                  <span class="day">{{ day }}</span>
              </div>
            </div>
            <div class="d-col-md-4" v-if="over_products.all && organization.type != 1">
              <div class="panel-widget panel-widget-summ">
                <span>Остатки</span>
                <span class="sum">{{ over_products.summ }} ₽</span>
                <span class="num">{{ over_products.count_all }} шт.</span>
              </div>
            </div>
            <div class="d-col-md-4" v-if="organization.type != 1">
              <div class="panel-widget panel-widget-summ">
                <span>Заказы за неделю</span>
                <span class="sum">{{ orders.summ }} ₽</span>
                <span class="num">{{ orders.count }} шт.</span>
              </div>
            </div>
            <div class="d-col-lg-6 d-col-md-6" v-if="over_products.all && organization.type != 1">
              <div class="panel-widget panel-widget-remains">
                  <div class="panel-widget-remains__graph">
                    <Chart type="doughnut" :data="chartData" :options="chartOptions" class="w-full md:w-5rem" />
                    <span class="count">{{ $filters.round(over_products.copo_percent) }}%</span>
                    <span>сопоставленных<br/> товаров</span>
                  </div>
                  <div class="panel-widget-remains__stat">
                    <div class="panel-widget-remains__stat-item">
                      <div class="data">
                        <span>Товаров всего</span>
                        <span>{{ over_products.all }}</span>
                      </div>
                      <div class="line">
                        <span style="width: 100%;"></span>
                      </div>
                    </div>
                    <div class="panel-widget-remains__stat-item">
                      <div class="data">
                        <span>Товаров сопоставлено</span>
                        <span>{{ over_products.copo }}</span>
                      </div>
                      <div class="line">
                        <span :style="'width: ' + over_products.copo_percent + '%;'"></span>
                      </div>
                    </div>
                  </div>
              </div>
            </div>
            <div class="d-col-md-3" v-if="organization.type != 1">
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
            <div class="d-col-md-3" v-if="organization.type == 3">
              <div class="panel-widget panel-widget-dilers">
                <span class="title">Дистрибьюторы</span>
                <div class="numbers">
                  <div class="item">
                    <span class="labels">Кол-во</span>
                    <div class="info">
                      <i class="d_icon d_icon-account-circle"></i>
                      <span>{{ distr.count }} шт.</span>
                    </div>
                  </div>
                  <div class="item">
                    <span class="labels">Сумма заказов за 7 дн.</span>
                    <div class="info">
                      <i class="d_icon">
                        <span>₽</span>
                      </i>
                      <span>{{ distr.summ }} ₽</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="d-col-md-8" v-if="shipment.total && organization.type != 1">
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
          <div class="dart-row" v-if="organization.type != 1">
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
            <div class="d-col-md-12" :class="{'loading': loading_products}">
              <div class="panel-widget panel-widget-top-nomoney">
                <v-table
                  :items_data="products.products"
                  :total="products.total"
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
                      <div class="d-col-md-3" v-if="avg_info?.remains">
                        <div class="panel-widget panel-widget-summ panel-widget-blue">
                          <span>Остатков всего</span>
                          <span class="sum">{{ avg_info?.remains }} шт</span>
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
  import { toRaw } from 'vue'
  import router from '../router'
  import { mapActions, mapGetters } from 'vuex'
  import Chart from 'primevue/chart'
  import vTable from '../components/table/v-table.vue'
  import Toast from 'primevue/toast'
  
  export default {
    name: 'ProfileOrganization',
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
      },
      step_minute: {
        type: Number,
        default: 15
      }
    },
    data () {
      return {
        chartData: null,
        loading_products: false,
        page: 1,
        chartOptions: {
          cutout: '60%'
        },
        avg_info: {
          remains: 0,
          no_money: 0,
          sales_speed: 0
        },
        over_products: {
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
          available: {
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
          remains_history: {
            label: 'Изменение остатков',
            type: 'gist',
            sort: false
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
          available: {
            label: 'Остаток сейчас',
            type: 'text',
            sort: false
          },
          forecast_all: {
            label: 'Прогноз остатков на завтра/7 дней',
            type: 'text',
            sort: false
          }
        },
        workdays_source: []
      }
    },
    methods: {
      ...mapActions([
        'get_organization_from_api',
        'get_data_from_api',
        'get_catalog_from_api',
        'get_vendors_from_api',
        'set_work_to_api',
        'delete_work_from_api'
      ]),
      setChartData () {
        return {
          datasets: [
            {
              data: [this.organization.products.copo_percent, this.organization.products.no_copo_percent],
              backgroundColor: ['#008FFF', '#EEEEEE'],
              hoverBackgroundColor: ['#008FFF', '#EEEEEE']
            }
          ]
        }
      },
      // чекнули дату, проверяем занята ли она
      checkDate (date) {
        // console.log(date)
        const source = toRaw(this.workdays_source)
        const dater = new Date(date)
        const month = Number(dater.getMonth()) + 1
        const searchDate = dater.getFullYear() + '-' + (month < 10 ? '0' : '') + month + '-' + (dater.getDate() < 10 ? '0' : '') + dater.getDate()
        // console.log(searchDate)
        source.forEach((element) => {
          if (element.date === searchDate) {
            // console.log(element)
            this.work_dates_input.delete = true
            const weekend = Number(element.weekend)
            this.work_dates_input.id = element.id
            if (weekend === 1) {
              this.work_dates_input.type = 'weekend'
            } else {
              this.work_dates_input.type = 'shortday'
              this.work_dates_input.start = new Date(element.timestamp_from * 1000)
              this.work_dates_input.end = new Date(element.timestamp_to * 1000)
            }
          }
        })
      },
      // обновление формы
      resetForm () {
        this.work_dates_input = {
          id: '',
          type: 'shortday',
          start: '',
          end: '',
          delete: false,
          date: new Date(),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
      },
      // добавляем дату в листинг
      addWorkDay () {
        let error = false
        this.work_calendar_loading = true
        if (this.work_dates_input.type === 'shortday') {
          if (!this.work_dates_input.start) {
            this.work_dates_input.start_error = true
            error = true
          }
          if (!this.work_dates_input.end) {
            this.work_dates_input.end_error = true
            error = true
          }
        }
        if (!error) {
          const data = toRaw(this.work_dates_input)
          const date = new Date(data.date)
          const dateFrom = new Date(data.start)
          const dateTo = new Date(data.end)
          data.date_record = Math.round(date.getTime() / 1000)
          date.setUTCHours(0, 0, 0, 0)
          data.condition_date_from = Math.round(date.getTime() / 1000)
          date.setUTCHours(23, 59, 59, 999)
          data.condition_date_to = Math.round(date.getTime() / 1000)
          data.time_start = Math.round(dateFrom.getTime() / 1000)
          data.time_end = Math.round(dateTo.getTime() / 1000)
          data.time_from = (dateFrom.getHours() < 10 ? '0' : '') + dateFrom.getHours() + ':' + (dateFrom.getMinutes() < 10 ? '0' : '') + dateFrom.getMinutes()
          data.time_to = (dateTo.getHours() < 10 ? '0' : '') + dateTo.getHours() + ':' + (dateTo.getMinutes() < 10 ? '0' : '') + dateTo.getMinutes()
          console.log(data)
          this.$load(async () => {
            await this.set_work_to_api({
              action: 'set',
              type: 'work_week_date',
              id: router.currentRoute._value.params.id,
              data: data
            })
              .then((result) => {
                this.work_calendar_loading = false
                this.showOperatingModeCalendarModal = false
                this.get_organization_from_api().then(() => {
                  this.$toast.add({ severity: 'info', summary: 'Время работы скорректировано', detail: 'Время работы организации успешно скорректировано. Проверьте корректность.', life: 3000 })
                })
              })
              .catch((result) => {
                console.log(result)
              })
          })
        } else {
          this.work_calendar_loading = false
        }
      },
      // удаляем дату из листинга
      deleteWorkDay () {
        if (this.work_dates_input.id) {
          this.showOperatingModeCalendarModal = false
          this.$load(async () => {
            await this.delete_work_from_api({
              action: 'delete',
              type: 'work_week_date',
              id: router.currentRoute._value.params.id,
              object_id: this.work_dates_input.id
            })
              .then((result) => {
                this.get_organization_from_api().then(() => {
                  this.$toast.add({ severity: 'info', summary: 'День сброшен', detail: 'Теперь Вы можете указать другой график работы', life: 3000 })
                })
              })
              .catch((result) => {
                console.log(result)
              })
          })
        }
      },
      clearWorkForm () {
        for (let i = 1; i <= Object.keys(this.work.days).length; i++) {
          this.work.days[i].active = false
        }
      },
      addWorkForm () {
        let error = false
        this.work_loading = true
        for (let i = 1; i <= Object.keys(this.work.days).length; i++) {
          const dateFrom = new Date(this.work.days[i].start)
          const dateTo = new Date(this.work.days[i].end)
          this.work.days[i].time_start = Math.round(dateFrom.getTime() / 1000)
          this.work.days[i].time_end = Math.round(dateTo.getTime() / 1000)
          if ((!this.work.days[i].weekend && this.work.days[i].start && this.work.days[i].end && (!this.work.days[i].weekend && this.work.days[i].time_start < this.work.days[i].time_end)) || this.work.days[i].weekend) {
            this.work.days[i].time_from = (dateFrom.getHours() < 10 ? '0' : '') + dateFrom.getHours() + ':' + (dateFrom.getMinutes() < 10 ? '0' : '') + dateFrom.getMinutes()
            this.work.days[i].time_to = (dateTo.getHours() < 10 ? '0' : '') + dateTo.getHours() + ':' + (dateTo.getMinutes() < 10 ? '0' : '') + dateTo.getMinutes()
            this.work.days[i].timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
          } else {
            this.work.days[i].error_start = true
            this.work.days[i].error_end = true
            error = true
          }
        }
        if (!error) {
          const dates = toRaw(this.work.days)
          this.$load(async () => {
            await this.set_work_to_api({
              action: 'set',
              type: 'work_week',
              id: router.currentRoute._value.params.id,
              dates: dates
            })
              .then((result) => {
                this.work_loading = false
                this.showOperatingModeModal = false
                this.$toast.add({ severity: 'info', summary: 'Время работы скорректировано', detail: 'Время работы организации успешно скорректировано. Проверьте корректность.', life: 3000 })
              })
              .catch((result) => {
                console.log(result)
              })
          })
        } else {
          this.work_loading = false
        }
      },
      filter (data) {
        this.page = 1
        this.loading_products = true
        this.get_data_from_api(data).then(() => {
          this.avg_info.remains = this.products.avg_info?.remains
          this.avg_info.no_money = this.products.avg_info.no_money
          this.avg_info.sales_speed = this.products.avg_info.sales_speed
          this.loading_products = false
        })
      },
      paginate (data) {
        this.page = data.page
        this.loading_products = true
        this.get_data_from_api(data).then(() => {
          this.avg_info.remains = this.products.avg_info?.remains
          this.avg_info.no_money = this.products.avg_info.no_money
          this.avg_info.sales_speed = this.products.avg_info.sales_speed
          this.loading_products = false
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
      this.get_organization_from_api().then(() => {
        this.get_data_from_api({
          page: this.page,
          perpage: this.pagination_items_per_page
        }).then(() => { })
      })
    },
    components: {
        Chart,
        vTable,
        Toast
    },
    computed: {
      ...mapGetters([
        'organization',
        'products',
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
    },
    watch: {
      products (newVal, oldVal) {
        if (typeof newVal === 'object') {
          this.avg_info.remains = newVal.avg_info?.remains
          if (Object.prototype.hasOwnProperty.call(newVal.avg_info, 'no_money')) {
            this.avg_info.no_money = newVal.avg_info.no_money
          } else {
            this.avg_info.no_money = 0
          }
          if (Object.prototype.hasOwnProperty.call(newVal.avg_info, 'sales_speed')) {
            this.avg_info.sales_speed = newVal.avg_info.sales_speed
          } else {
            this.avg_info.sales_speed = 0
          }
        } else {
          this.avg_info.remains = 0
          this.avg_info.no_money = 0
          this.avg_info.sales_speed = 0
        }
      },
      work_date (newVal, oldVal) {
        // console.log(newVal)
        // console.log(oldVal)
        if (newVal !== oldVal) {
          this.work_dates_input.date = newVal
          this.checkDate(newVal)
        }
      },
      organization (newVal, oldVal) {
        this.chartData = this.setChartData()
        const num = newVal.products.copo_percent
        this.over_products.copo_percent = num
        this.over_products.all = newVal.products.count
        this.over_products.copo = newVal.products.copo_count
        this.over_products.count_all = newVal.products.count_all
        this.over_products.summ = newVal.products.summ
        // orders.summ && orders.count
        // this.dilers.summ = newVal.dilers.summ
        // this.dilers.count = newVal.dilers.count
        // this.distr.summ = newVal.distr.summ
        // this.distr.count = newVal.distr.count
        this.orders.summ = newVal.orders.summ
        this.orders.count = newVal.orders.count
        // this.shipment.total = newVal.shipment.total
        // this.shipment.items = newVal.shipment.items
        this.no_money = newVal.no_money
        this.forecast = newVal.forecast
        /*
        this.work_dates = newVal.workdays
        this.workdays_source = newVal.workdays_source
        for (let i = 0; i < Object.keys(newVal.worktime).length; i++) {
          const ji = i + 1
          const weekend = Number(newVal.worktime[i].weekend)
          if (weekend === 1) {
            this.work.days[ji].weekend = true
            this.work.days[ji].active = false
          } else {
            this.work.days[ji].weekend = false
            this.work.days[ji].active = true
            this.work.days[ji].time_from = newVal.worktime[i].time_from
            this.work.days[ji].time_to = newVal.worktime[i].time_to
            this.work.days[ji].start = new Date(newVal.worktime[i].timestamp_from * 1000)
            this.work.days[ji].end = new Date(newVal.worktime[i].timestamp_to * 1000)
          }
        }
        */
      }
    }
  }
  </script>
  
  <style lang="scss">
    .panel-widget-shipping{
      position: relative;
      .shippings{
        margin-top: 40px;
        .item{
          position: relative;
          min-height: 60px;
          display: flex;
          flex-wrap: wrap;
          padding-bottom: 16px;
          & + .item{
            margin-top: 22px;
          }
          .date{
            position: relative;
            span{
              display: block;
              &.day{
                color: #282828;
                text-align: center;
                font-size: 30px;
                font-style: normal;
                font-weight: 400;
                line-height: normal;
              }
              &.month{
                color: #282828;
                text-align: center;
                font-size: 11px;
                font-style: normal;
                font-weight: 500;
                line-height: 106%; /* 11.66px */
                letter-spacing: 0.134px;
              }
            }
          }
          .info{
            display: flex;
            align-items: center;
            margin-left: 22px;
            padding-left: 22px;
            border-left: 1px solid #A8A8A8;
            span{
              color: #282828;
              font-size: 12px;
              font-style: normal;
              font-weight: 500;
              line-height: 1.3;
              letter-spacing: 0.25px;
            }
          }
          .more{
            display: block;
            position: absolute;
            bottom: 0;
            left: 80px;
            color: #828282;
            font-size: 12px;
            font-style: normal;
            font-weight: 400;
            line-height: 106%; /* 12.72px */
            letter-spacing: 0.25px;
            text-decoration: underline;
            &:hover{
              text-decoration: none;
            }
          }
        }
      }
    }
    .panel-widget-dilers{
      position: relative;
      .numbers{
        .item{
          & + .item{
            margin-top: 20px;
          }
          .labels{
            display: block;
            color: #A0A0A0;
            font-family: Roboto;
            font-size: 11px;
            font-style: normal;
            font-weight: 400;
            line-height: 1.3;
            letter-spacing: 0.25px;
            margin-bottom: 12px;
          }
          .info{
            display: flex;
            align-items: center;
            .d_icon-account-circle{
              color: #008FFF;
              font-size: 26px
            }
            .d_icon{
              span{
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: #FFD4C2;
                color: #FF6221;
                font-size: 18px;
                line-height: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                font-style: normal;
              }
            }
            & > span{
              padding-left: 15px;
              color: #282828;
              font-size: 16px;
              font-style: normal;
              font-weight: 500;
              line-height: 1.3;
              letter-spacing: 0.496px;
            }
          }
        }
      }
    }
    .panel-widget-remains{
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      .panel-widget-remains__graph{
        width: 33.3333333%;
        span{
          display: block;
          color: #676767;
          font-size: 14px;
          font-style: normal;
          font-weight: 400;
          line-height: 1.3;
          letter-spacing: 0.25px;
          &.count{
            color: #282828;
            font-size: 28px;
            font-style: normal;
            font-weight: 500;
            line-height: 1.3;
            letter-spacing: 0.496px;
            margin-bottom: 5px;
            margin-top: 15px;
          }
        }
      }
      .panel-widget-remains__stat{
        width: 66.6666666%;
        .panel-widget-remains__stat-item{
          position: relative;
          & + *{
            margin-top: 15px;
          }
          &:last-child .line span{
            background: #008FFF;
          }
          .data{
            display: flex;
            justify-content: space-between;
            span{
              color: #282828;
              font-size: 12px;
              font-style: normal;
              font-weight: 400;
              line-height: 1.3;
              letter-spacing: 0.25px;
              &:last-child{
                color: #ADADAD;
                text-align: right;
                font-size: 14px;
                font-style: normal;
                font-weight: 500;
                line-height: 1.3;
                letter-spacing: 0.25px;
              }
            }
          }
          .line{
            height: 8px;
            margin-top: 5px;
            border-radius: 4px;
            background: #EEE;
            position: relative;
            span{
              position: absolute;
              left: 0;
              top: 0;
              display: inline-block;
              height: 8px;
              border-radius: 4px;
              background: #FF6221;
            }
          }
        }
      }
    }
    
  
    .operating-mode-calend-modal{
      .vc-container{
        width: 100%;
        border: none;
      }
      .dart-form-control{
        text-align: center;
      }
      .vc-title-wrapper button{
        background-color: #FFF;
      }
  
      &__radio{
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 0 16px;
      }
  
      &__values{
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        width: 100%;
        padding: 0 16px;
        margin-top: 16px;
        .p-calendar{
          width: 100%;
        }
      }
  
      &__line{
        width: 12px;
        background: #000000;
        height: 1px;
      }
  
      &__buttons{
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 12px;
        padding: 0 16px;
        margin-top: 24px;
        button{
          width: calc(50% - 6px);
        }
      }
  
      .form_input_group{
        margin: 0;
        width: calc(50% - 14px);
        input{
          width: 100%;
          display: block;
        }
      }
    }
  
    .operating-mode-calend-modal,
    .operating-mode-modal{
      .form_input_group.input_pl .dart-form-control:not(:placeholder-shown){
        padding: 10px 15px;
      }
  
      .modal-content{
        max-width: 500px;
      }
  
      .modal__title{
        color: #282828;
        font-size: 20px;
        font-weight: 500;
      }
    }
  
    .operating-mode-change{
      display: flex;
      flex-direction: column;
      gap: 16px;
      &__buttons{
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 8px;
        button{
          width: calc(50% - 6px);
        }
      }
      &__el{
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-height: 39px;
  
        label{
          font-size: 14px;
        }
      }
      &__values{
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        max-width: 250px;
        width: 100%;
  
        p{
          margin: 0;
          color: #A0A0A0;
          font-size: 14px;
        }
      }
      &__line{
        width: 12px;
        background: #000000;
        height: 1px;
      }
  
      .form_input_group{
        margin: 0;
        max-width: 115px
      }
    }
  
    .operating-mode-calend{
      background: #FFF;
      border-radius: 5px;
      border: 1px solid #0000001F;
      .vc-container{
        width: 100%;
        border: none;
      }
      .vc-title-wrapper button{
        background-color: #FFF;
      }
      &__title{
        padding: 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        p{
          margin: 0;
          color: #676767;
          font-size: 16px;
          font-weight: 400;
          letter-spacing: 0.25px;
        }
        .d_icon{
          color: #a0a0a0;
          font-size: 24px;
          cursor: pointer;
        }
      }
    }
  
    .operating-mode{
      padding: 24px;
      background: #FFF;
      border-radius: 5px;
      border: 1px solid #0000001F;
  
      &__title{
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 30px;
        p{
          margin: 0;
          color: #676767;
          font-size: 16px;
          font-weight: 400;
          letter-spacing: 0.25px;
        }
        .d_icon{
          color: #a0a0a0;
          font-size: 24px;
          cursor: pointer;
        }
      }
      &__container{
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      &__el{
        display: flex;
        align-items: center;
        justify-content: space-between;
  
        p{
          margin: 0;
          color: #282828;
          font-size: 14px;
          font-weight: 400;
        }
  
        &.off{
          p{
            color: #A0A0A0;
          }
        }
      }
    }
  </style>
  