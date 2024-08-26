<template>
  <article class="dropbutton__wrapper">
    <button
      class="dart-btn dart-btn-secondary dropbutton"
      @click="() => setIsActive(!isActive)"
    >
      Скачать документы
      <i :class="'d_icon d_icon-arrow dropbutton__arrow' + (isActive ? ' dropbutton__arrow--active' : '')"></i>
    </button>

    <ul
      :class="
        'dropbutton__list' + (isActive ? ' dropbutton__list--active' : '')
      "
    >
      <li class="dropbutton__item" @click="() => setIsActive(false)">Скачать</li>
      <li class="dropbutton__item" @click="() => setIsActive(false)">Загрузить</li>
    </ul>
  </article>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const isActive = ref(false)

    return {
      isActive
    }
  },
  methods: {
    setIsActive (state) {
      this.isActive = state
    }
  }
}
</script>

<style lang="scss" scoped>
.dropbutton {
  display: flex;
  justify-content: center;
  align-items: center;

  background-color: #fff;

  margin-block: 4px;
  padding-inline: 55px;
  width: max-content;

  transition-duration: 0.3s;

  &__arrow {
    display: flex;
    justify-content: center;
    align-items: center;

    margin-left: 13px;
    transition-duration: .3s;

    &--active {
        rotate: 180deg;
    }

    &::before {
      color: #b4b4b4;
      font-size: 8px;
    }
  }

  &:hover {
    background-color: #282828;

    .opt-order__button-arrow::before {
      color: #fff;
    }
  }

  &__wrapper {
    position: relative;
  }

  &__list {
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);

    position: absolute;
    top: 100%;

    width: 100%;

    height: 0;
    padding: 0;

    overflow: hidden;
    transition-duration: 0.3s;

    &--active {
      height: 100px;
      padding-block: 10px;
    }
  }

  &__item {
    cursor: pointer;

    display: flex;
    align-items: center;

    padding-inline: 15px;
    height: 40px;

    transition-duration: 0.3s;

    &:hover {
      background-color: #e1e1e1;
    }
  }
}
</style>
