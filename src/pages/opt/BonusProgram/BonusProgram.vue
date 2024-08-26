<template>
  <div class="" :class="{ loading: loading }">
    <div class="">
      <div class="dart-home dart-window">
        <!-- <Breadcrumbs/> -->
        <div>
          <section class="bonus">
            <h2 class="bonus__title">Бонусная программа</h2>
            <div class="bonus__progress bonus-progress">
              <h3 class="bonus-progress__title">Продажи а вашем магазне</h3>
              <header class="bonus-progress__header">
                <div class="bonus-progress__statistics">
                  <div class="bonus-progress__percent">
                    <div class="bonus-progress__img-container">
                      <img
                        src="../../../assets/img/icons/BonusProgram/progress.svg"
                      />
                    </div>
                    <p class="bonus-progress__title">{{this.get_bonus?.info?.percent}}%</p>
                  </div>
                  <div class="bonus-progress__sales">
                    <div class="bonus-progress__text-container">
                      <p class="bonus-progress__text">продаж всего</p>
                      <p class="bonus-progress__title">
                        {{this.get_bonus?.info?.sales}} <span class="bonus-progress__span">шт</span>
                      </p>
                    </div>
                    <div class="bonus-progress__text-container">
                      <p class="bonus-progress__text">
                        продаж с регистрацией в бонусной программе
                      </p>
                      <p class="bonus-progress__title">
                        {{this.get_bonus?.info?.sales_bonus}}
                        <span class="bonus-progress__span">шт</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div class="bonus-progress__filter bonus-progress-filter">
                  <Dropdown @change="updatePeriod" v-model="this.time_filter_selected" :options="this.time_filter" optionLabel="name" placeholder="Выберите промежуток времени" class="w-full md:w-14rem" />
                </div>
              </header>
              <main class="bonus-progress__main">
                <Chart
                  type="bar"
                  :data="barData"
                  :options="barOptions"
                  class="bonus-progress__chart"
                />
              </main>
            </div>
            <div class="bonus__targets targets">
              <header class="targets__header">
                <h3 class="targets__title">
                  Цели по регистрации покупателей в бонусной программе
                </h3>
                <div class="targets__filters">
                  <!-- <TreeSelect
                    placeholder="Время проведения"
                    class="targets__select"
                  />
                  <TreeSelect placeholder="Тип цели" class="targets__select" /> -->
                </div>
              </header>
              <main class="targets__main">
                <TargetCard
                  v-for="item in this.get_bonus_targets" :key="item.id"
                  :target="{
                    image: item.image,
                    title: item.name,
                    text: item.description,
                    gift: item.gift,
                    status: item.status,
                    date: `${new Date(item.date_from).toLocaleString('ru', {year: 'numeric', month: 'long', day: 'numeric',})} - ${new Date(item.date_to).toLocaleString('ru', {year: 'numeric', month: 'long', day: 'numeric',})}`,
                    image_gift: item.gift.image,
                    chart: {
                      datasets: [
                        {
                          data: [item.info.sales, item.info.sales_bonus],
                          backgroundColor: ['#eeeeee', '#008fff']
                        }
                      ]
                    },
                    chart_percent: item.info.percent,
                    percent: item.percent
                  }"
                />
                <!-- <TargetCard
                  :target="{
                    image: '../../../assets/img/gallery/1.jpg',
                    title:
                      'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
                    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit lorem ipsum dolor sit amet, consectetur adipiscing elit',
                    status: 'received',
                    date: '10.10.2021',
                  }"
                />
                <TargetCard
                  :target="{
                    image: '../../../assets/img/gallery/1.jpg',
                    title:
                      'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
                    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit lorem ipsum dolor sit amet, consectetur adipiscing elit',
                    status: 'completed',
                    date: '10.10.2021',
                  }"
                /> -->
              </main>
            </div>
            <div class="bonus__advantages advantages">
              <section class="section">
                  <h4 class="section__title">Для продавца</h4>
                  <div :class="`section__card-container section__card-container--large`">
                      <article class="section__card card">
                        <img src="../../../assets/img/icons/BonusProgram/telephone.svg" class="card__img">
                        <p class="card__text">При продаже в магазине спросите у покупателя его номер телефона для начисления бонусов</p>
                      </article>
                      <article class="section__card card">
                        <img src="../../../assets/img/icons/BonusProgram/edit.svg" class="card__img">
                        <p class="card__text">При оформлении заказа внесите номер в поле «Спросить у Равиля»</p>
                      </article>
                      <article class="section__card card">
                        <img src="../../../assets/img/icons/BonusProgram/target.svg" class="card__img">
                        <p class="card__text">Выполняйте цели по регистрации покупателей в бонусной программе - получайте вознаграждение от MachineStore</p>
                      </article>
                  </div>
              </section>
              <div class="advantages__horizontal">
                <section class="section">
                  <h4 class="section__title">Для розничных покупателей (вариант 1)</h4>
                  <div :class="`section__card-container section__card-container--small`">
                      <article class="section__card card">
                        <img src="../../../assets/img/icons/BonusProgram/store-discount1.svg" class="card__img">
                        <p class="card__text">Клиент, покупая в вашем магазине офлайн, получает 1% от суммы покупки бонусами</p>
                      </article>
                      <article class="section__card card">
                        <img src="../../../assets/img/icons/BonusProgram/telephone-small.svg" class="card__img">
                        <p class="card__text">Для начисления бонусов клиент должен предоставить номер телефона</p>
                      </article>
                      <article class="section__card card">
                        <img src="../../../assets/img/icons/BonusProgram/bonus.svg" class="card__img">
                        <p class="card__text">При регистрации на сайте MachineStore клиент получит все бонусы, заработанные за покупки в вашем магазине</p>
                      </article>
                      <article class="section__card card">
                        <img src="../../../assets/img/icons/BonusProgram/bonus-payment.svg" class="card__img">
                        <p class="card__text">Клиент может полностью или частично  оплачивать бонусами покупки на сайте MachineStore</p>
                      </article>
                  </div>
                </section>
                <section class="section">
                    <h4 class="section__title">Для розничных покупателей (вариант 2)</h4>
                    <div :class="`section__card-container section__card-container--small`">
                        <article class="section__card card">
                          <img src="../../../assets/img/icons/BonusProgram/store-discount2.svg" class="card__img">
                          <p class="card__text">Клиент, покупая в вашем магазине онлайн, получает 2% от суммы покупки бонусами</p>
                        </article>
                        <article class="section__card card">
                          <img src="../../../assets/img/icons/BonusProgram/bonus-payment.svg" class="card__img">
                          <p class="card__text">Клиент может полностью или частично  оплачивать бонусами покупки на сайте MachineStore</p>
                        </article>
                    </div>
                </section>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TargetCard from './TargetCard.vue'
import Dropdown from 'primevue/dropdown'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
// import TreeSelect from 'primevue/treeselect'
import Chart from 'primevue/chart'
import { mapActions, mapGetters } from 'vuex'
import router from '@/router'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export default {
  name: 'BonusProgram',
  setup () {
    const barOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        tooltips: {
          mode: 'index',
          intersect: false
        }
      },
      scales: {
        x: {
          stacked: true
        },
        y: {
          stacked: true
        }
      }
    }

    return {
      barOptions
    }
  },
  data () {
    return {
      time_filter_selected: { name: 'Текущий месяц', code: 'month' },
      time_filter: [
        { name: 'Текущие 3 месяца', code: '3month' },
        { name: 'Текущий месяц', code: 'month' },
        { name: 'Текущая неделя', code: 'week' },
        { name: 'Текущай день', code: 'day' }
      ],
      get_bonus: {},
      get_bonus_targets: {},
      barData: null
    }
  },
  components: {
    TargetCard,
    Dropdown,
    // TreeSelect,
    Chart
  },
  methods: {
    ...mapActions([
      'bonus_api',
      'bonus_targets_api'
    ]),
    updatePeriod () {
      this.bonus_api({
        action: 'get/sales/bonus',
        id: router.currentRoute._value.params.id,
        period: this.time_filter_selected.code
      })
    },
    setChartData (newVal) {
      return {
        labels: newVal?.chart?.dates,
        datasets: [
          {
            type: 'bar',
            label: 'С бонусами',
            data: newVal?.chart?.sales_bonus,
            backgroundColor: '#ff6221',
            borderRadius: 5
          },
          {
            type: 'bar',
            label: 'Всего',
            data: newVal?.chart?.sales,
            backgroundColor: '#dedede',
            borderRadius: 5
          }
        ]
      }
    }
  },
  mounted () {
    this.bonus_api({
      action: 'get/sales/bonus',
      id: router.currentRoute._value.params.id,
      period: this.time_filter_selected.code
    })
    this.bonus_targets_api({
      action: 'get/sales/targets',
      id: router.currentRoute._value.params.id
    })
  },
  computed: {
    ...mapGetters([
      'bonuses',
      'bonus_targets'
    ])
  },
  watch: {
    bonuses: function (newVal, oldVal) {
      console.log('bonuses')
      this.get_bonus = newVal
      this.barData = this.setChartData(newVal)
    },
    bonus_targets: function (newVal, oldVal) {
      this.get_bonus_targets = newVal
    }
  }
}
</script>

<style lang="scss" scoped>
.section {
    display: flex;
    flex-direction: column;
    gap: 16px;

    border: 1px solid rgba(226, 226, 226, 1);
    border-radius: 5px;

    padding: 24px;

    &__title {
        background-color: rgba(248, 247, 245, 1);
        color: rgba(40, 40, 40, 1);

        font-size: 14px;
        font-weight: 500;

        padding: 12px 16px;
        width: fit-content;
    }

    &__card-container {
        display: grid;
        justify-content: space-around;
        gap: 40px;

        &--large {
            grid-template: auto / repeat(3, 1fr);

            .card {
                gap: 10px;

                &__img {
                    width: 95px;
                    aspect-ratio: 1;
                }
            }
        }

        &--small {
            grid-template: auto / repeat(2, 1fr);

            .card {
                gap: 6px;

                &__img {
                    width: 55px;
                    aspect-ratio: 1;
                }
            }
        }
    }

    &__card,
    .card {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        border: none;

        &__img {
            object-fit: contain;
        }

        &__text {
            font-size: 14px;
            text-align: center;
        }
    }
}
.bonus {
  display: flex;
  flex-direction: column;
  gap: 12px;

  h3,
  p {
    margin: 0;
    line-height: 1.05;
  }

  &__title {
    font-size: 24px;
    margin-bottom: 12px;
  }

  &__progress,
  .bonus-progress {
    display: flex;
    flex-direction: column;
    gap: 16px;

    border: 1px solid rgba(226, 226, 226, 1);
    border-radius: 5px;

    padding: 24px;

    &__title {
      font-size: 20px;
      font-weight: 500;
    }

    &__text {
      color: rgba(173, 173, 173, 1);
      font-size: 12px;
    }

    &__span {
      font-size: 12px;
      color: rgba(94, 94, 94, 1);
    }

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 100px;
    }

    &__statistics {
      display: flex;
      align-items: center;
      gap: 100px;
    }

    &__percent {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    &__img-container {
      display: flex;
      justify-content: center;
      align-items: center;

      background-color: rgba(248, 247, 245, 1);
      border-radius: 10px;

      padding: 8px;
    }

    &__sales {
      display: flex;
      align-items: center;
      gap: 75px;
    }

    &__text-container {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    &__filter,
    .bonus-progress-filter {
      display: flex;
      align-items: center;
      gap: 4px;

      cursor: pointer;

      &__arrow {
        padding: 8px 6px;
        rotate: -90deg;
      }
    }

    &__main {
    }

    &__chart {
      max-height: 184px;
    }
  }

  &__targets,
  .targets {
    display: flex;
    flex-direction: column;
    gap: 60px;

    border: 1px solid rgba(226, 226, 226, 1);
    border-radius: 5px;

    padding: 24px;

    &__header {
      display: flex;
      justify-content: space-between;
      gap: 10px;
    }

    &__filters {
      display: flex;
      gap: 12px;
    }

    &__select {
      min-width: 220px;
    }

    &__main{
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
  }

  &__advantages,
  .advantages {
    display: flex;
    flex-direction: column;
    gap: 12px;

    &__horizontal {
      display: flex;
      gap: 13px;
    }
  }
}
</style>
