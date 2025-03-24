<template>
    <div class="table-actions">
        <div :data-test="action?.tags?.length != 0" class="table-actions__action" :class="{active: action.enabled, hidden: action?.tags?.length == 0}" v-for="(action, indexactions) in actions" v-bind:key="action.action_id" :data-id="action?.action_id">
            <div v-if="action?.tags?.length != 0"  class="table-actions__container">
                <div class="table-actions__el" v-for="(tag, indextag) in action.tags" v-bind:key="tag.id">
                    <!-- <img v-if="tag.type == 'multiplicity'" :src="action.enabled
                        ? '/images/icons/action/gray/box.svg'
                            : '/images/icons/action/black/box.svg'
                        " alt="" /> -->
                    <p v-if="tag.type == 'multiplicity'">Крат. {{ tag.value }} шт.</p>

                    <!-- <img v-if="tag.type == 'min'" :src="action.enabled
                        ? '/images/icons/action/gray/min.svg'
                            : '/images/icons/action/black/min.svg'
                        " alt="" /> -->

                    <!-- <img v-if="tag.type == 'gift'" :src="action.enabled
                        ? '/images/icons/action/gray/gift.svg'
                            : '/images/icons/action/black/gift.svg'
                        " alt="" /> -->

                    <!-- <img v-if="tag.type == 'delay'" :src="action.enabled
                        ? '/images/icons/action/gray/time.svg'
                            : '/images/icons/action/black/time.svg'
                        " alt="" /> -->
                    <p v-if="tag.type == 'delay'">{{tag.type_delay == 1? 'Отсроч.' : 'Под реал.'}} {{ tag.value }}  дн.</p>

                    <!-- <img v-if="tag.type == 'sale' && tag.value > 0" :src="action.enabled
                        ? '/images/icons/action/gray/sale.svg'
                            : '/images/icons/action/black/sale.svg'
                        " alt="" /> -->
                    <p v-if="tag.type == 'sale' && tag.value > 0">Скидка {{ Number(tag.value).toFixed(0) }}%</p>
                    <p v-if="tag.type == 'sale' && tag.value < 0">Наценка {{ (Number(tag.value) * -1).toFixed(0) }}%</p>
                    <p v-if="tag.type == 'min' && tag.value > 0">от {{ Number(tag.value).toFixed(0) }} шт.</p>


                    <!-- <img v-if="tag.type == 'free_delivery'" :src="action.enabled
                        ? '/images/icons/action/gray/delivery.svg'
                            : '/images/icons/action/black/delivery.svg'
                        " alt="" /> -->
                    <p v-if="tag.type == 'free_delivery'">Беспл. доставка</p>
                    <span v-if="(indextag != action.tags.length - 1 && (tag.type == 'multiplicity' || tag.type == 'delay' || tag.type == 'sale' ||  tag.type == 'free_delivery'))"> | </span>
                </div>

            </div>
            <div v-if="action?.tags?.length > 0" class="table-actions__help" :data-id="action?.action_id">
                <p :class="{
                    active: action.enabled
                }">
                    ?
                </p>
                <div class="table-actions__content">
                    <div class="table-actions__modal" :class="{'pt-3': (!action?.image.image || action?.type == 3 || !action?.image.thumb_medium) && !action.image}">
                        <img v-if="action?.image.image && action?.type != 3 && action?.image.thumb_medium" :src="action?.image.thumb_medium"
                            :srcset="action?.image.image +' 2x, ' + action?.image.thumb_medium + ' 1x'" :alt="action?.name" class="table-actions__modal-img">
                        <img v-else-if="action.image && action?.type != 3" :src="action.image" :alt="action?.name" class="table-actions__modal-img">
                        <img v-else-if="action?.type == 3" src="/images/action_discount.jpg" :alt="action?.name" class="table-actions__modal-img">

                        <p class="table-actions__modal-title mt-3">{{ action?.type == 3 ? "Индивидуальная акция" : action?.name }}</p>

                        <div class="kenost-action-modal">
                            <div class="kenost-action-modal__item" :class="{'none': tag?.type == 'min'}" v-for="(tag, index) in action.tags.slice(0, !(action.tags.length % 2)?  action.tags.length - Math.floor(action.tags.length / 2) + 1:action.tags.length - Math.floor(action.tags.length / 2))" v-bind:key="tag.id">
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
                                <p v-if="tag.type == 'sale' && tag.value < 0">
                                    Наценка
                                    {{ (Number(tag.value) * -1).toLocaleString('ru') }}%
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
            </div>
        </div>
    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'ActionModal',
  props: {
    actions: {
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
