<template>
    <div class="table-actions__content">
        <div class="table-actions__modal" :class="{'pt-3': (!action?.image.image || action?.type == 3 || !action?.image.thumb_medium) && !action.image}">
            <img v-if="action?.image.image && action?.type != 3 && action?.image.thumb_medium" :src="action?.image.thumb_medium"
                :srcset="action?.image.image +' 2x, ' + action?.image.thumb_medium + ' 1x'" :alt="action?.name" class="table-actions__modal-img">
            <img v-else-if="action.image && action?.type != 3" :src="site_url_prefix + 'assets/content/' + action.image" :alt="action?.name" class="table-actions__modal-img">

            <p class="table-actions__modal-title mt-3">{{ action?.type == 3 ? "Индивидуальная акция" : action?.name }}</p>

            <div class="kenost-action-modal">
                <div class="kenost-action-modal__item" :class="{'none': tag?.type != 'min'}" v-for="(tag, index) in action.tags.slice(0, !(action.tags.length % 2)?  action.tags.length - Math.floor(action.tags.length / 2) + 1:action.tags.length - Math.floor(action.tags.length / 2))" v-bind:key="tag.id">
                    <img v-if="tag.type == 'min_sum'"
                        src="../../assets/images/icons/action/basket.svg" alt="" />
                    <p v-if="tag.type == 'min_sum'">
                        Минимальна сумма покупки
                        {{ Number(tag.value).toLocaleString('ru') }}
                        ₽
                    </p>
                    <img v-if="tag.type == 'free_delivery'"
                        src="../../assets/images/icons/action/delivery.svg" alt="" />
                    <p v-if="tag.type == 'free_delivery'">
                        <span>Бесплатная доставка</span>
                        <span v-if="tag.condition == '2'">
                            при покупке от
                            {{ tag.value.toLocaleString('ru') }}
                            ₽</span>
                        <span v-if="tag.condition == '3'">
                            при покупке от
                            {{ tag.value.toLocaleString('ru') }}
                            шт.</span>
                    </p>
                    <img v-if="tag.type == 'gift'"
                        src="../../assets/images/icons/action/gift.svg" alt="" />
                    <p v-if="tag.type == 'gift'">Подарок</p>
                    <img v-if="tag.type == 'delay'"
                        src="../../assets/images/icons/action/time.svg" alt="" />
                    <p v-if="tag.type == 'delay'">Отсрочка {{ tag.value }} дн.</p>
                    <img v-if="tag.type == 'multiplicity'"
                        src="../../assets/images/icons/action/box.svg" alt="" />
                    <p v-if="tag.type == 'multiplicity'">
                        Кратность упаковки
                        {{ tag.value.toLocaleString('ru') }}
                        шт.
                    </p>
                    <img v-if="tag.type == 'sale' && tag.value > 0"
                        src="../../assets/images/icons/action/sale.svg" alt="" />
                    <p v-if="tag.type == 'sale' && tag.value > 0">
                        Скидка
                        {{ tag.value.toLocaleString('ru') }}%
                        <span v-if="tag.min_count > 1 && tag.value > 0">
                            при покупке от
                            {{ tag.min_count.toLocaleString('ru') }}
                            шт.</span>
                    </p>
                </div>
            </div>

            <div class="table-actions__modal-btn-container">
                <router-link v-if="action.type != 3" :to="{
                    name: 'promotion',
                    params: {
                        id: this.$route.params.id,
                        action: action.action_id
                    }
                }" class="table-actions__modal-btn">Подробнее об акции</router-link>
            </div>
        </div>
    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'ActionModal',
  props: {
    action: {
      type: Array
    }
  },
  data () {
    return {
      
    }
  },
  methods: {
    
  },
  mounted () {
  },
  components: { },
  computed: {
    
  }
}
</script>
<style lang="scss">

</style>
