<template>
  <article :class="`target target--${target.status}`">
    <div class="target__info info">
      <img :src="target.image" alt="" class="info__img" />
      <div class="info__content">
        <h3 class="info__title">{{ target.title }}</h3>
        <p class="info__text">{{ target.text }}</p>
        <p class="info__text"><b>Необходимый % для выполнения цели: </b>{{ target.percent }}</p>
        <p class="info__text">{{ target.date }}</p>
      </div>
    </div>
    <div class="target__content content">
      <div class="content__button-container">
        <button class="content__button">Вознаграждение</button>
        <span
          v-if="target.status != 'not_completed'"
          :class="`content__status content__status--${target.status}`"
        >
          <img
            v-if="target.status == 'received'"
            src="../../../assets/img/icons/BonusProgram/check-mark.svg"
          />
          {{
            target.status === "done"
              ? "Выполнено"
              : target.status === "expectation"
              ? "Выполняется"
              : "Не выполнено"
          }}
        </span>
      </div>
      <p class="content__text">{{ target.description_gifts }}</p>
      <swiper
        class="SwiperGift"
        :slides-per-view="4"
        :space-between="8"
        loop
        navigation
        :pagination="{ clickable: true }"
        :scrollbar="{ draggable: true }"
      >
        <swiper-slide v-for="item, index in target.gift" v-bind:key="index" class="promoSwiper__slide">
          <img :src="item.image">
        </swiper-slide>
      </swiper>
    </div>
    <div class="target__progress target-progress">
      <div class="target-progress__diagram">
        <Doughnut
          :data="target.chart"
          :options="chartOptions"
          class="target-progress__chart"
        />
        <p class="target-progress__progress">{{target.chart_percent}}%</p>
      </div>
      <p class="target-progress__text">
        {{
          target.status === "done"
              ? "Выполнено"
              : target.status === "expectation"
              ? "Выполняется"
              : "Не выполнено"
        }}
      </p>
    </div>
  </article>
</template>

<script>
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

// import function to register Swiper custom elements
import { register } from 'swiper/element/bundle'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules'
import 'swiper/css'

ChartJS.register(ArcElement, Tooltip, Legend)
register()

export default {
  setup () {
    const chartOptions = {
      responsive: true
    }

    return {
      chartOptions,
      modules: [Navigation, Pagination, Scrollbar, A11y]
    }
  },
  props: {
    target: {
      type: Object,
      required: true
    }
  },
  components: {
    Doughnut,
    Swiper,
    SwiperSlide
  }
}
</script>

<style lang="scss" scoped>

.SwiperGift{
  height: 70px;
  width: 100%;

  img{
    height: 100% !important;
  }
}

.content__container-img{
  height: 70px;

  img{
    height: 100% !important;
  }
}

.target {
  display: flex;
  gap: 167px;

  &--completed,
  &--not_completed {
    opacity: 0.5;
  }

  h3,
  p {
    margin: 0;
    line-height: 1.05;
  }

  &__title {
    color: rgba(40, 40, 40, 1);
    font-size: 24px;
  }

  &__info,
  .info {
    display: flex;
    gap: 24px;

    width: 100%;

    &__img {
      border-radius: 5px;

      max-width: 119px;
      height: 87px !important;
      object-fit: cover;
    }

    &__content {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    &__title {
      font-size: 20px;
      font-weight: 500;
    }

    &__text {
    }
  }

  &__content,
  .content {
    display: flex;
    flex-direction: column;
    gap: 12px;

    width: 100%;
    // max-width: 450px;
    overflow: hidden;

    &__button-container {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    &__button {
      background-color: rgba(248, 247, 245, 1);
      border: none;
      border-radius: 5px;
      color: rgba(94, 94, 94, 1);

      height: 48px;
      padding-inline: 12px;
    }

    &__status {
      display: flex;
      align-items: center;
      gap: 8px;

      &--completed {
        color: rgba(0, 207, 21, 1);
      }
    }

    &__text {
      color: rgba(40, 40, 40, 1);
    }

    &__swiper {
      height: 68px;
    }

    &__img {
      border-radius: 5px;

      height: 68px;
      object-fit: contain;
    }
  }

  &__progress,
  .target-progress {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 12px;
    width: 100%;

    &__diagram {
      position: relative;
    }

    &__chart {
      height: 170px;
      aspect-ratio: 1;
    }

    &__text {
      color: rgba(94, 94, 94, 1);
    }

    &__progress {
      color: rgba(40, 40, 40, 1);
      font-size: 20px;
      font-weight: 500;

      position: absolute;
      top: 50%;
      left: 50%;
      translate: -50% -25%;
    }
  }
}
</style>
