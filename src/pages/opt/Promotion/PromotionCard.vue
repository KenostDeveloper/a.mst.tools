<template>
  <div class="card">
    <h6 class="card__title">{{ title }}</h6>
    <div class="card__content">
      <p class="card__text">{{ text }}</p>
      <div class="card__img-container">
        <img
          v-for="image in getImages"
          :key="image"
          src="../../../assets/img/gallery/1.jpg"
          alt=""
          class="card__img"
        />
        <div v-if="images?.length > 4" class="card__img card__img--empty">+{{ images?.length - 4 }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  setup () {
    return {}
  },
  props: {
    title: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: false
    },
    images: {
      type: Array,
      required: false,
      default: () => {
        return []
      }
    }
  },
  methods: {
    getImageSource (src) {
      return `../../../assets/img/cats/${src}`
    }
  },
  computed: {
    getImages () {
      return this.images?.slice(0, 4)
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  border: 1px solid #e2e2e2;
  border-radius: 5px;

  padding: 26px 24px 16px;
  min-height: 158px;
  width: 100%;

  &__title,
  &__text {
    font-size: 14px;
    line-height: 1.1;
    padding: 0;
    margin: 0;
  }
  &__title {
    font-size: 14px;
    font-weight: 500;
    line-height: 1.1;
  }
  &__content {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 16px;

    height: 100%;
  }
  &__text {
    font-weight: 400;
  }
  &__img-container {
    display: flex;
    align-items: center;
    position: relative;
  }
  &__img {
    width: 47px;
    aspect-ratio: 1;
    object-fit: cover;

    border: 1px solid white;
    border-radius: 50%;

    &--empty {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-shrink: 0;

        border: 1px solid #525252;
        background-color: #282828;

        color: white;
    }

    &:nth-child(2n) {
        translate: -25% 0;
    }
    &:nth-child(3n) {
        translate: -50% 0;
    }
    &:nth-child(4n) {
        translate: -75% 0;
    }
    &:nth-child(5n) {
        translate: -100% 0;
    }
  }
}
</style>
