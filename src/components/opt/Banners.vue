<template>
    <div class="kenost-banner" v-if="getCount > 0 || getRemainCount > 0">
        <div class="kenost-banner__section" v-for="n in getCount" :key="n">
            <div class="kenost-banner__container">
                <router-link :to="{ name: 'promotion', params: { action: items.items[n * 1 - 1].action_id } }" class="kenost-banner__image">
                    <img class="kenost-banner__image-big" :src="items.items[n * 1 - 1].image" alt="">
                </router-link>
            </div>

            <div class="kenost-banner__container">
                <router-link :to="{ name: 'promotion', params: { action: items.items[n * 2 - 1].action_id } }" class="kenost-banner__image">
                    <img class="kenost-banner__image-big" :src="items.items[n * 2 - 1].image_inner" alt="">
                </router-link>

                <router-link :to="{ name: 'promotion', params: { action: items.items[n * 3 - 1].action_id } }" class="kenost-banner__image">
                    <img class="kenost-banner__image-big" :src="items.items[n * 3 - 1].image_inner" alt="">
                </router-link>

                <router-link :to="{ name: 'promotion', params: { action: items.items[n * 4 - 1].action_id } }" class="kenost-banner__image">
                    <img class="kenost-banner__image-big" :src="items.items[n * 4 - 1].image_inner" alt="">
                </router-link>
            </div>

            <div class="kenost-banner__container">
                <router-link :to="{ name: 'promotion', params: { action: items.items[n * 5 - 1].action_id } }" class="kenost-banner__image">
                    <img class="kenost-banner__image-big" :src="items.items[n * 5 - 1].image_inner" alt="">
                </router-link>

                <router-link :to="{ name: 'promotion', params: { action: items.items[n * 6 - 1].action_id } }" class="kenost-banner__image">
                    <img class="kenost-banner__image-big" :src="items.items[n * 6 - 1].image_inner" alt="">
                </router-link>
            </div>

            <div class="kenost-banner__container">
                <router-link :to="{ name: 'promotion', params: { action: items.items[n * 7 - 1].action_id } }" class="kenost-banner__image">
                    <img class="kenost-banner__image-big" :src="items.items[n * 7 - 1].image_inner" alt="">
                </router-link>

                <router-link :to="{ name: 'promotion', params: { action: items.items[n * 8 - 1].action_id } }" class="kenost-banner__image">
                    <img class="kenost-banner__image-big" :src="items.items[n * 8 - 1].image_inner" alt="">
                </router-link>

                <router-link :to="{ name: 'promotion', params: { action: items.items[n * 9 - 1].action_id } }" class="kenost-banner__image">
                    <img class="kenost-banner__image-big" :src="items.items[n * 9 - 1].image_inner" alt="">
                </router-link>

                <router-link :to="{ name: 'promotion', params: { action: items.items[n * 10 - 1].action_id } }" class="kenost-banner__image">
                    <img class="kenost-banner__image-big" :src="items.items[n * 10 - 1].image_inner" alt="">
                </router-link>
            </div>
        </div>

        <div class="kenost-banner__section" v-if="getRemainCount > 0">
            <div class="kenost-banner__container" v-if="getRemainCount > 0 && getRemainCount != 2 && getRemainCount != 5">
                <router-link :to="{ name: 'promotion', params: { action: items.items[getCount * 10].action_id } }" class="kenost-banner__image">
                    <img class="kenost-banner__image-big" :src="items.items[getCount * 10].image" alt="">
                </router-link>
            </div>

            <div class="kenost-banner__container" v-if="getRemainCount == 2">
                <router-link :to="{ name: 'promotion', params: { action: items.items[getCount * 10].action_id } }" class="kenost-banner__image">
                    <img class="kenost-banner__image-big" :src="items.items[getCount * 10].image_inner" alt="">
                </router-link>

                <router-link :to="{ name: 'promotion', params: { action: items.items[getCount * 10 + 1].action_id } }" class="kenost-banner__image">
                    <img class="kenost-banner__image-big" :src="items.items[getCount * 10 + 1].image_inner" alt="">
                </router-link>
            </div>

            <div class="kenost-banner__container" v-if="getRemainCount == 3 || getRemainCount == 7">
                <router-link :to="{ name: 'promotion', params: { action: items.items[getCount * 10 + 1].action_id } }" class="kenost-banner__image">
                    <img class="kenost-banner__image-big" :src="items.items[getCount * 10 + 1].image_inner" alt="">
                </router-link>

                <router-link :to="{ name: 'promotion', params: { action: items.items[getCount * 10 + 2].action_id } }" class="kenost-banner__image">
                    <img class="kenost-banner__image-big" :src="items.items[getCount * 10 + 2].image_inner" alt="">
                </router-link>
            </div>

            <div class="kenost-banner__container" v-if="getRemainCount == 4 || getRemainCount == 6 || getRemainCount == 8">
                <router-link :to="{ name: 'promotion', params: { action: items.items[getCount * 10 + 1].action_id } }" class="kenost-banner__image">
                    <img class="kenost-banner__image-big" :src="items.items[getCount * 10 + 1].image_inner" alt="">
                </router-link>

                <router-link :to="{ name: 'promotion', params: { action: items.items[getCount * 10 + 2].action_id } }" class="kenost-banner__image">
                    <img class="kenost-banner__image-big" :src="items.items[getCount * 10 + 2].image_inner" alt="">
                </router-link>

                <router-link :to="{ name: 'promotion', params: { action: items.items[getCount * 10 + 3].action_id } }" class="kenost-banner__image">
                    <img class="kenost-banner__image-big" :src="items.items[getCount * 10 + 3].image_inner" alt="">
                </router-link>
            </div>

            <div class="kenost-banner__container" v-if="getRemainCount == 5">
                <router-link :to="{ name: 'promotion', params: { action: items.items[getCount * 10].action_id } }" class="kenost-banner__image">
                    <img class="kenost-banner__image-big" :src="items.items[getCount * 10].image_inner" alt="">
                </router-link>

                <router-link :to="{ name: 'promotion', params: { action: items.items[getCount * 10 + 1].action_id } }" class="kenost-banner__image">
                    <img class="kenost-banner__image-big" :src="items.items[getCount * 10 + 1].image_inner" alt="">
                </router-link>

                <router-link :to="{ name: 'promotion', params: { action: items.items[getCount * 10 + 2].action_id } }" class="kenost-banner__image">
                    <img class="kenost-banner__image-big" :src="items.items[getCount * 10 + 2].image_inner" alt="">
                </router-link>
            </div>

            <div class="kenost-banner__container" v-if="getRemainCount == 5">
                <router-link :to="{ name: 'promotion', params: { action: items.items[getCount * 10 + 3].action_id } }" class="kenost-banner__image">
                    <img class="kenost-banner__image-big" :src="items.items[getCount * 10 + 3].image_inner" alt="">
                </router-link>

                <router-link :to="{ name: 'promotion', params: { action: items.items[getCount * 10 + 4].action_id } }" class="kenost-banner__image">
                    <img class="kenost-banner__image-big" :src="items.items[getCount * 10 + 4].image_inner" alt="">
                </router-link>
            </div>

            <div class="kenost-banner__container" v-if="getRemainCount == 6">
                <router-link :to="{ name: 'promotion', params: { action: items.items[getCount * 10 + 4].action_id } }" class="kenost-banner__image">
                    <img class="kenost-banner__image-big" :src="items.items[getCount * 10 + 4].image_inner" alt="">
                </router-link>

                <router-link :to="{ name: 'promotion', params: { action: items.items[getCount * 10 + 5].action_id } }" class="kenost-banner__image">
                    <img class="kenost-banner__image-big" :src="items.items[getCount * 10 + 5].image_inner" alt="">
                </router-link>
            </div>

            <div class="kenost-banner__container" v-if="getRemainCount == 7">
                <router-link :to="{ name: 'promotion', params: { action: items.items[getCount * 10 + 3].action_id } }" class="kenost-banner__image">
                    <img class="kenost-banner__image-big" :src="items.items[getCount * 10 + 3].image_inner" alt="">
                </router-link>

                <router-link :to="{ name: 'promotion', params: { action: items.items[getCount * 10 + 4].action_id } }" class="kenost-banner__image">
                    <img class="kenost-banner__image-big" :src="items.items[getCount * 10 + 4].image_inner" alt="">
                </router-link>

                <router-link :to="{ name: 'promotion', params: { action: items.items[getCount * 10 + 5].action_id } }" class="kenost-banner__image">
                    <img class="kenost-banner__image-big" :src="items.items[getCount * 10 + 5].image_inner" alt="">
                </router-link>

                <router-link :to="{ name: 'promotion', params: { action: items.items[getCount * 10 + 6].action_id } }" class="kenost-banner__image">
                    <img class="kenost-banner__image-big" :src="items.items[getCount * 10 + 6].image_inner" alt="">
                </router-link>
            </div>

            <div class="kenost-banner__container" v-if="getRemainCount == 8">
                <router-link :to="{ name: 'promotion', params: { action: items.items[getCount * 10 + 4].action_id } }" class="kenost-banner__image">
                    <img class="kenost-banner__image-big" :src="items.items[getCount * 10 + 4].image_inner" alt="">
                </router-link>

                <router-link :to="{ name: 'promotion', params: { action: items.items[getCount * 10 + 5].action_id } }" class="kenost-banner__image">
                    <img class="kenost-banner__image-big" :src="items.items[getCount * 10 + 5].image_inner" alt="">
                </router-link>

                <router-link :to="{ name: 'promotion', params: { action: items.items[getCount * 10 + 6].action_id } }" class="kenost-banner__image">
                    <img class="kenost-banner__image-big" :src="items.items[getCount * 10 + 6].image_inner" alt="">
                </router-link>

                <router-link :to="{ name: 'promotion', params: { action: items.items[getCount * 10 + 7].action_id } }" class="kenost-banner__image">
                    <img class="kenost-banner__image-big" :src="items.items[getCount * 10 + 7].image_inner" alt="">
                </router-link>
            </div>

            <div class="kenost-banner__container" v-if="getRemainCount == 9">
                <router-link :to="{ name: 'promotion', params: { action: items.items[getCount * 10 + 1].action_id } }" class="kenost-banner__image">
                    <img class="kenost-banner__image-big" :src="items.items[getCount * 10 + 1].image_inner" alt="">
                </router-link>

                <router-link :to="{ name: 'promotion', params: { action: items.items[getCount * 10 + 2].action_id } }" class="kenost-banner__image">
                    <img class="kenost-banner__image-big" :src="items.items[getCount * 10 + 2].image_inner" alt="">
                </router-link>
            </div>

            <div class="kenost-banner__container" v-if="getRemainCount == 9">
                <router-link :to="{ name: 'promotion', params: { action: items.items[getCount * 10 + 3].action_id } }" class="kenost-banner__image">
                    <img class="kenost-banner__image-big" :src="items.items[getCount * 10 + 3].image_inner" alt="">
                </router-link>

                <router-link :to="{ name: 'promotion', params: { action: items.items[getCount * 10 + 4].action_id } }" class="kenost-banner__image">
                    <img class="kenost-banner__image-big" :src="items.items[getCount * 10 + 4].image_inner" alt="">
                </router-link>

                <router-link :to="{ name: 'promotion', params: { action: items.items[getCount * 10 + 5].action_id } }" class="kenost-banner__image">
                    <img class="kenost-banner__image-big" :src="items.items[getCount * 10 + 5].image_inner" alt="">
                </router-link>
            </div>

            <div class="kenost-banner__container" v-if="getRemainCount == 9">
                <router-link :to="{ name: 'promotion', params: { action: items.items[getCount * 10 + 6].action_id } }" class="kenost-banner__image">
                    <img class="kenost-banner__image-big" :src="items.items[getCount * 10 + 6].image_inner" alt="">
                </router-link>

                <router-link :to="{ name: 'promotion', params: { action: items.items[getCount * 10 + 7].action_id } }" class="kenost-banner__image">
                    <img class="kenost-banner__image-big" :src="items.items[getCount * 10 + 7].image_inner" alt="">
                </router-link>
            </div>
        </div>
    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
// import router from '@/router'

export default {
  name: 'Banners',
  props: {
    items: {
      type: Array
    }
  },
  data () {
    return {
    }
  },
  methods: {
    ...mapActions([
    ])
  },
  mounted () {
  },
  components: {
  },
  computed: {
    ...mapGetters([
    ]),
    getCount () {
      return this.items.count >= 10 ? Math.floor(this.items.count / 10) : 0
    },
    getRemainCount () {
      if (isNaN(this.items.count - 10 * (this.items.count >= 10 ? Math.floor(this.items.count / 10) : 0))) {
        return 0
      } else {
        return this.items.count - 10 * (this.items.count >= 10 ? Math.floor(this.items.count / 10) : 0)
      }
    }
  },
  watch: {
  }
}
</script>
<style lang="scss">
    .kenost-banner{
        display: flex;
        flex-direction: column;
        gap: 8px;

        &__section{
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        &__container{
            width: 100%;
            display: flex;
            gap: 8px;
        }

        &__image{
            width: 100%;

            img{
                width: 100%;
                border-radius: 5px;

                &-big{
                    height: 100%;
                }
            }
        }
    }
</style>
