<template>
  <tr v-if="!this.is_warehouses && items.total_stores > 1" @click="this.active = !this.active" :class="{'active-el' : this.active, 'no-active-el' : !this.active}">
    <td class="hidden-mobile-l"><i class="pi pi-angle-up"></i></td>
    <td class="k-table__photo hidden-mobile-l"><img class="k-table__image" :src="items.image" alt=""></td>
    <td class="k-table__title"><p>{{items.pagetitle}}</p><b>Арт: {{items.article}}</b></td>
    <td class="k-table__busket hidden-mobile-l">
      <form class="k-table__form event-none" action="">
        <Counter :min="0" :max="100" :value="0"/>
        <button class="dart-btn dart-btn-primary"><i class="d_icon d_icon-busket"></i></button>
      </form>
    </td>
    <td>от {{Math.round(getMinPrice(items.stores)).toLocaleString('ru')}} ₽</td>
    <td class="hidden-mobile-l"></td>
    <td>от {{getMinDelivery(items.stores).delivery}} дн ({{new Date(getMinDelivery(items.stores).delivery_day).toLocaleString("ru", {month: 'long', day: 'numeric'})}})</td>
    <td class="hidden-mobile-l"></td>
    <td></td>
    <td class="hidden-mobile-l"></td>
  </tr>
  <tr class="kenost-table-background" v-for="(item, index) in items.stores" v-bind:key="item.id" :class="{'active' : this.active || this.is_warehouses || items.total_stores == 1, 'no-active' : !this.active && !this.is_warehouses && items.total_stores > 1, 'bg-white': items.total_stores == 1}">
    <td class="hidden-mobile-l"><i v-if="items.total_stores > 1" class="pi pi-minus"></i></td>
    <td class="k-table__photo hidden-mobile-l"><img class="k-table__image" :src="items.image" alt=""></td>
    <td class="k-table__title"><p>{{item.name}}</p><b>Арт: {{item.article}}</b></td>
    <td class="k-table__busket">
        <form class="k-table__form" action="" :class="{'basket-true' : item.basket.availability}">
          <Counter :key="new Date().getMilliseconds() + item.id" @ElemCount="ElemCount" :min="1" :max="item.remains" :id="item.remain_id" :store_id="item.store_id" :index="index" :value="item.basket.count"/>
          <div @click="addBasket(item.remain_id, item.basket.count, item.store_id, index)" class="dart-btn dart-btn-primary"><i class="d_icon d_icon-busket"></i></div>
        </form>
    </td>
    <td>{{Math.round(item.price).toLocaleString('ru')}} ₽ <br> {{item.delay ? Number(item.delay).toFixed(1) + ' дн' : 'Предоплата'}}</td>
    <td>
      <div class="table-actions">
        <!-- 'red': action?.conflicts?.items[action.action_id]?.sales_conflicts -->
        <div class="table-actions__action" :class="{'active': action.enabled, 'red': isConflict(action?.conflicts?.items, item.actions, action.action_id)}" v-for="(action, indexactions) in item.actions" v-bind:key="action.id">
          <div v-if="action.tags.length > 0" class="table-actions__container" @click="updateAction(item.id == 0? this.action.remain_id : item.remain_id, item.id == 0? this.action.store_id : item.store_id, action, index, indexactions)">
            <div class="table-actions__el" v-for="(tag, indextag) in action.tags" v-bind:key="tag.id">
              <img v-if="tag.type == 'multiplicity'" :src="action.enabled ? '/images/icons/action/gray/box.svg' : isConflict(action?.conflicts?.items, item.actions, action.action_id) ? '/images/icons/action/red/box.svg' : '/images/icons/action/black/box.svg'" alt="">
              <p  v-if="tag.type == 'multiplicity'">{{ tag.value }} шт.</p>

              <img v-if="tag.type == 'gift'" :src="action.enabled ? '/images/icons/action/gray/gift.svg' : isConflict(action?.conflicts?.items, item.actions, action.action_id) ? '/images/icons/action/red/gift.svg' : '/images/icons/action/black/gift.svg'" alt="">

              <img v-if="tag.type == 'delay'" :src="action.enabled ? '/images/icons/action/gray/time.svg' : isConflict(action?.conflicts?.items, item.actions, action.action_id) ? '/images/icons/action/red/time.svg' : '/images/icons/action/black/time.svg'" alt="">
              <p  v-if="tag.type == 'delay'">От-ка {{ tag.value }} дн.</p>

              <img v-if="tag.type == 'sale'" :src="action.enabled ? '/images/icons/action/gray/sale.svg' : isConflict(action?.conflicts?.items, item.actions, action.action_id) ? '/images/icons/action/red/sale.svg' : '/images/icons/action/black/sale.svg'" alt="">
              <p  v-if="tag.type == 'sale'">Скидка {{ Number(tag.value).toFixed(0) }}%</p>

              <img v-if="tag.type == 'free_delivery'" :src="action.enabled ? '/images/icons/action/gray/delivery.svg' : isConflict(action?.conflicts?.items, item.actions, action.action_id) ? '/images/icons/action/red/delivery.svg' : '/images/icons/action/black/delivery.svg'" alt="">

              <!-- TODO: Комплекты -->
            </div>
          
            <!-- <div class="table-actions__el">
              <img src="../../assets/images/icons/action/complect.svg" alt="">
              <p>Компл-т</p>
            </div> -->
          </div>
          <div v-if="action.tags.length > 0" class="table-actions__help">
            <p :class="{'active': action.enabled, 'red': isConflict(action?.conflicts?.items, item.actions, action.action_id)}">?</p>
            <div class="table-actions__content">
              <div class="table-actions__modal">
                <div class="table-actions__modal-elems">
                  <div class="table-actions__modal-el" v-for="(tag, index) in action.tags" v-bind:key="tag.id">
                    <img v-if="tag.type == 'min_sum'" src="../../assets/images/icons/action/basket.svg" alt="">
                    <p v-if="tag.type == 'min_sum'">Минимальна сумма покупки {{ Number(tag.value).toLocaleString('ru') }} ₽</p>

                    <img v-if="tag.type == 'free_delivery'" src="../../assets/images/icons/action/delivery.svg" alt="">
                    <p v-if="tag.type == 'free_delivery'"><span>Бесплатная доставка</span> <span v-if="tag.condition == '2'"> при покупке от {{ (tag.value).toLocaleString('ru') }} ₽</span> <span v-if="tag.condition == '3'"> при покупке от {{ (tag.value).toLocaleString('ru') }} шт.</span></p>

                    <img v-if="tag.type == 'gift'" src="../../assets/images/icons/action/gift.svg" alt="">
                    <p v-if="tag.type == 'gift'">Подарок</p>

                    <img v-if="tag.type == 'delay'" src="../../assets/images/icons/action/gift.svg" alt="">
                    <p v-if="tag.type == 'delay'">Отсрочка {{ tag.value }} дн.</p>

                    <img v-if="tag.type == 'multiplicity'" src="../../assets/images/icons/action/box.svg" alt="">
                    <p v-if="tag.type == 'multiplicity'">Краткость упаковки {{ (tag.value).toLocaleString('ru') }} шт.</p>

                    <img v-if="tag.type == 'sale'" src="../../assets/images/icons/action/sale.svg" alt="">
                    <p v-if="tag.type == 'sale'">Скидка {{ (tag.value).toLocaleString('ru') }}%</p>
                  </div>
                </div>
                <div class="table-actions__modal-btn-container">
                  <router-link v-if="action.action_id > 0" :to="{name: 'promotion', params: { id: this.$route.params.id, action: action.action_id }}" class="table-actions__modal-btn">Подробнее об акции</router-link>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </td>
    <td>{{item.payer === '1' ? 'Поставщик' : 'Покупатель'}} / <br> от {{getMinDelivery(items.stores).delivery}} дн ({{new Date(getMinDelivery(items.stores).delivery_day).toLocaleString("ru", {month: 'long', day: 'numeric'})}})</td>
    <td>{{item.remains}} шт.</td>
    <td>
      <span class="flex align-items-center justify-content-center gap-1 mb-1"><img :src="item.store_image" class="kenost-table-elem__logo" alt=""> {{ item.store_name }}</span>
      {{item.store_city}}
    </td>
    <td v-if="item.old_price > 0 && item.old_price != item.price">{{Math.round(item.old_price).toLocaleString('ru')}} ₽ <br> {{((item.old_price - item.price).toFixed(0)).toLocaleString('ru')}} ₽</td>
    <td v-else>{{Math.round(item.price).toLocaleString('ru')}} ₽</td>
  </tr>
  <tbody class="complect-button kenost-table-background kenost-table-background-complect" v-for="complect in items.complects" v-bind:key="complect.id" :class="{'active' : this.active || this.is_warehouses || items.total_stores == 1, 'no-active' : !this.active && !this.is_warehouses && items.total_stores > 1, 'bg-white': items.total_stores == 1}">
    <tr v-for="(item, index) in complect" v-bind:key="item.id" :class="{'active' : this.active || this.is_warehouses, 'no-active' : !this.active && !this.is_warehouses}">
      <td class="td-center" :class="{'pointer-none' : index !== 0}"><span :style="'top:' +  (complect.length * 74) / 2 + 'px'" v-if="index === 0"><i class="pi pi-minus"></i></span></td>
      <td class="k-table__photo"><img class="k-table__image" :src="item.image" alt=""></td>
      <td class="k-table__title"><p>{{item.pagetitle}}</p><b>Арт: {{item.article}}</b></td>
      <td class="k-table__busket complect-button__td" :class="{'pointer-none' : index !== 0}">
        <form class="k-table__form complect-button__form" :class="{'basket-true' : item.basket.availability}" :style="'top:' +  (complect.length * 74) / 2 + 'px'" action="" v-if="index === 0">
          <Counter :key="new Date().getMilliseconds() + item.id" @ElemCount="ElemCountComplect" :min="1" :max="item.remain_complect" :id="item.complect_id" :store_id="item.store_id" :index="index" :value="item.basket.count"/>
          <div @click="addBasketComplect(item.complect_id, item.basket.count, item.store_id, index)" class="dart-btn dart-btn-primary"><i class="d_icon d_icon-busket"></i></div>
        </form>
      </td>
      <td>{{Math.round(Number(item.new_price)).toLocaleString('ru')}}₽ x {{ item.multiplicity }} шт. <br> {{item.action?.delay ? Number(item.action?.delay).toFixed(1) + ' дн' : 'Предоплата'}}</td>
      <td>
        <div class="table-actions">
          <!-- 'red': action?.conflicts?.items[action.action_id]?.sales_conflicts -->
          <div class="table-actions__action" :class="{'active': action.enabled, 'red': action?.conflicts?.items[action.action_id]?.sales_conflicts}" v-for="(action, indexactions) in item.actions" v-bind:key="action.id">
            <div v-if="action.tags.length > 0" class="table-actions__container" @click="updateAction(item.id == 0? this.action.remain_id : item.remain_id, item.id == 0? this.action.store_id : item.store_id, action, index, indexactions)">
              <div class="table-actions__el" v-for="(tag, indextag) in action.tags" v-bind:key="tag.id">
                <img v-if="tag.type == 'multiplicity'" src="../../assets/images/icons/action/box.svg" alt="">
                <p  v-if="tag.type == 'multiplicity'">{{ tag.value }} шт.</p>

                <img v-if="tag.type == 'gift'" src="../../assets/images/icons/action/gift.svg" alt="">

                <img v-if="tag.type == 'delay'" src="../../assets/images/icons/action/time.svg" alt="">
                <p  v-if="tag.type == 'delay'">От-ка {{ tag.value }} дн.</p>

                <img v-if="tag.type == 'sale'" src="../../assets/images/icons/action/sale.svg" alt="">
                <p  v-if="tag.type == 'sale'">Скидка {{ Number(tag.value).toFixed(0) }}%</p>

                <img v-if="tag.type == 'free_delivery'" src="../../assets/images/icons/action/delivery.svg" alt="">

                <!-- TODO: Комплекты -->
              </div>
            
              <!-- <div class="table-actions__el">
                <img src="../../assets/images/icons/action/complect.svg" alt="">
                <p>Компл-т</p>
              </div> -->
            </div>
            <div v-if="action.tags.length > 0" class="table-actions__help">
              <p>?</p>
              <div class="table-actions__content">
                <div class="table-actions__modal">
                  <div class="table-actions__modal-elems">
                    <div class="table-actions__modal-el" v-for="(tag, index) in action.tags" v-bind:key="tag.id">
                      <img v-if="tag.type == 'min_sum'" src="../../assets/images/icons/action/basket.svg" alt="">
                      <p v-if="tag.type == 'min_sum'">Минимальна сумма покупки {{ Number(tag.value).toLocaleString('ru') }} ₽</p>

                      <img v-if="tag.type == 'free_delivery'" src="../../assets/images/icons/action/delivery.svg" alt="">
                      <p v-if="tag.type == 'free_delivery'"><span>Бесплатная доставка</span> <span v-if="tag.condition == '2'"> при покупке от {{ (tag.value).toLocaleString('ru') }} ₽</span> <span v-if="tag.condition == '3'"> при покупке от {{ (tag.value).toLocaleString('ru') }} шт.</span></p>

                      <img v-if="tag.type == 'gift'" src="../../assets/images/icons/action/gift.svg" alt="">
                      <p v-if="tag.type == 'gift'">Подарок</p>

                      <img v-if="tag.type == 'delay'" src="../../assets/images/icons/action/gift.svg" alt="">
                      <p v-if="tag.type == 'delay'">Отсрочка {{ tag.value }} дн.</p>

                      <img v-if="tag.type == 'multiplicity'" src="../../assets/images/icons/action/box.svg" alt="">
                      <p v-if="tag.type == 'multiplicity'">Краткость упаковки {{ (tag.value).toLocaleString('ru') }} шт.</p>

                      <img v-if="tag.type == 'sale'" src="../../assets/images/icons/action/sale.svg" alt="">
                      <p v-if="tag.type == 'sale'">Скидка {{ (tag.value).toLocaleString('ru') }}%</p>
                    </div>
                  </div>
                  <div class="table-actions__modal-btn-container">
                    <router-link v-if="action.action_id > 0" :to="{name: 'promotion', params: { id: this.$route.params.id, action: action.action_id }}" class="table-actions__modal-btn">Подробнее об акции</router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </td>
      <td class="td-center" :class="{'pointer-none' : index !== 0}"><span :style="'top:' +  (complect.length * 74) / 2 + 'px'" v-if="index === 0">{{item.action?.payer === '1' ? 'Поставщик' : 'Покупатель'}} / <br>от {{item.delivery}} дн ({{new Date(item.delivery_day).toLocaleString("ru", {month: 'long', day: 'numeric'})}})</span> </td>
      <td class="td-center" :class="{'pointer-none' : index !== 0}"><span :style="'top:' +  (complect.length * 74) / 2 + 'px'" v-if="index === 0">{{item.remain_complect}} шт.</span></td>
      <td>{{item.org_name}} <br> <span class="flex align-items-center justify-content-center gap-1"><img :src="item.store_image" class="kenost-table-elem__logo" alt=""> {{ item.store_city }}</span></td>
      <td v-if="item.price && item.price > item.new_price">{{item.price ? Math.round(item.price).toLocaleString('ru') : Math.round(item.new_price).toLocaleString('ru')}} ₽ <br> {{((item.price - item.new_price).toFixed(0)).toLocaleString('ru')}} ₽</td>
      <td v-else>{{Math.round(item.price).toLocaleString('ru')}} ₽</td>
    </tr>
  </tbody>
  <Dialog v-model:visible="this.modal_remain" header=" " :style="{ width: '340px' }">
      <div class="kenost-not-produc">
          <!-- <img src="../../../public/img/opt/not-products.png" alt=""> -->
          <b>У нас нет столько товаров :(</b>
          <p>Извините, но количество данного товара ограничено</p>
          <div class="a-dart-btn a-dart-btn-primary" @click="this.modal_remain = false">Понятно</div>
      </div>
  </Dialog>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import Counter from './Counter.vue'
import router from '../../router'
import Dialog from 'primevue/dialog'

export default {
  name: 'TableCatalogRow',
  emits: ['updateBasket', 'ElemAction'],
  props: {
    pagination_items_per_page: {
      type: Number,
      default: 25
    },
    pagination_offset: {
      type: Number,
      default: 0
    },
    items: {
      type: Array
    },
    is_warehouses: {
      type: Boolean
    }
  },
  data () {
    return {
      loading: true,
      active: false,
      value: 1,
      modal_remain: false,
    }
  },
  methods: {
    ...mapActions([
      'busket_from_api',
      'opt_api'
    ]),
    ...mapMutations([
      'SET_OPT_PRODUCT_TO_VUEX'
    ]),
    getMinPrice (stores) {
      let minPrice

      for (let i = 0; i < stores.length; i++) {
        if (i === 0) {
        // eslint-disable-next-line no-unused-vars
          minPrice = stores[i].price
        } else if (stores[i].price < minPrice) {
          minPrice = stores[i].price
        }
      }

      return minPrice
    },
    getMaxDelay(stores){
      let maxDelay
    },
    openActions (item) {
      this.$emit('ElemAction', item)
    },
    async updateAction (remainid, storeid, action, indexstore, indexaction) {
      // console.log("updateAction", remainid, storeid, action, index)
      // console.log(this.items.stores[index].actions)

      this.items.stores[indexstore].actions[indexaction].enabled = true

      // Выключаем конфликтные акции

      const conflicts = this.items.stores[indexstore].actions.find((act) => act.action_id === action.action_id)
      // console.log(conflicts)
      if (conflicts.conflicts.items[conflicts.action_id]) {
        if (conflicts.conflicts.items[conflicts.action_id].postponement_conflicts) {
          for (let i = 0; i < conflicts.conflicts.items[conflicts.action_id].postponement_conflicts.length; i++) {
            for (let j = 0; j < Object.keys(this.this.items.stores[indexstore].actions).length; j++) {
              if (conflicts.conflicts.items[conflicts.action_id].postponement_conflicts[i] === this.items.stores[indexstore].actions[j].action_id) {
                if (this.this.items.stores[indexstore].actions[j].enabled) {
                  // console.log('this.items.stores[indexstore].actions', this.this.items.stores[indexstore].actions[j])
                  this.items.stores[indexstore].actions[j].enabled = false
                  //this.items.stores[indexstore].actions[indexaction].enabled = false
                  const data = {
                    action: 'action/user/off/on',
                    remain_id: this.items.stores[indexstore].actions[j].remain_id ? this.items.stores[indexstore].actions[j].remain_id : conflicts.remain_id,
                    store_id: this.items.stores[indexstore].actions[j].store_id ? this.items.stores[indexstore].actions[j].store_id : conflicts.store_id,
                    action_id: this.items.stores[indexstore].actions[j].action_id,
                    status: false,
                    test: 'true2'
                  }
                  this.opt_api(data)
                }
              }
            }
          }
        }

        if (conflicts.conflicts.items[conflicts.action_id].sales_conflicts) {
          for (let i = 0; i < conflicts.conflicts.items[conflicts.action_id].sales_conflicts.length; i++) {
            for (let j = 0; j < Object.keys(this.items.stores[indexstore].actions).length; j++) {
              if (conflicts.conflicts.items[conflicts.action_id].sales_conflicts[i] === this.items.stores[indexstore].actions[j].action_id) {
                if (this.items.stores[indexstore].actions[j].enabled) {
                  // console.log('this.items.stores[indexstore].actions', this.items.stores[indexstore].actions[j])
                  this.items.stores[indexstore].actions[j].enabled = false
                  //this.items.stores[indexstore].actions[indexaction].enabled = false
                  //console.log(this.items.stores[indexstore].actions[indexaction])
                  const data = {
                    action: 'action/user/off/on',
                    remain_id: this.items.stores[indexstore].actions[j].remain_id ? this.items.stores[indexstore].actions[j].remain_id : conflicts.remain_id,
                    store_id: this.items.stores[indexstore].actions[j].store_id ? this.items.stores[indexstore].actions[j].store_id : conflicts.store_id,
                    action_id: this.items.stores[indexstore].actions[j].action_id,
                    status: false,
                    test: 'true2'
                  }
                  this.opt_api(data)
                }
              }
            }
          }
        }
      }
      const data = {
        action: 'action/user/off/on',
        remain_id: remainid,
        store_id: storeid,
        action_id: action.action_id,
        status: action.enabled,
        test: 'true3'
      }
      this.opt_api(data).then(() => {
        const dataUpdate = {
          action: 'get/info/product',
          store_id: storeid,
          remain_id: remainid,
          id: router.currentRoute._value.params.id,
          count: this.items.stores[indexstore].basket.count
        }

        this.opt_api(dataUpdate).then((response) => {
          // console.log("response", response)
          const data = {
            remain_id: remainid,
            store_id: storeid,
            data: response.data.data
          }
          this.$store.commit('SET_OPT_PRODUCT_TO_VUEX', data)
        })
      })

    },
    getMinDelivery (stores) {
      let minDelivery
      let minDeliveryDate

      for (let i = 0; i < stores.length; i++) {
        if (i === 0) {
        // eslint-disable-next-line no-unused-vars
          minDelivery = stores[i].delivery
          minDeliveryDate = stores[i].delivery_day
        } else if (stores[i].delivery < minDelivery) {
          minDelivery = stores[i].delivery
          minDeliveryDate = stores[i].delivery_day
        }
      }

      return {
        delivery: minDelivery,
        delivery_day: minDeliveryDate
      }
    },
    addBasket (id, value, storeid, index) {
      const data = { action: 'basket/add', id: router.currentRoute._value.params.id, id_remain: id, value, store_id: storeid }
      this.busket_from_api(data).then()
      // eslint-disable-next-line vue/no-mutating-props
      this.items.stores[index].basket.availability = true
      this.$emit('updateBasket')
    },
    addBasketComplect (complectid, value, storeid, index) {
      const data = { action: 'basket/add', id: router.currentRoute._value.params.id, id_complect: complectid, value, store_id: storeid }
      this.busket_from_api(data).then()
      // eslint-disable-next-line vue/no-mutating-props
      this.items.complects[index][0].basket.availability = true
      this.$emit('updateBasket')
    },
    ElemCount (object) {
      if (object.value >= Number(object.max)) {
        this.modal_remain = true
        // console.log(this.modal_remain)
      } else {
      // eslint-disable-next-line vue/no-mutating-props
        this.items.stores[object.index].basket.count = object.value
        const data = { action: 'basket/update', id: router.currentRoute._value.params.id, id_remain: object.id, value: object.value, store_id: object.store_id }
        this.busket_from_api(data).then()
        this.$emit('updateBasket')
      }
    },
    ElemCountComplect (object) {
      if (object.value >= Number(object.max)) {
        this.modal_remain = true
        // console.log(this.modal_remain)
      } else {
      // eslint-disable-next-line vue/no-mutating-props
        this.items.stores[object.index].basket.count = object.value
        const data = { action: 'basket/update', id: router.currentRoute._value.params.id, id_complect: object.id, value: object.value, store_id: object.store_id }
        this.busket_from_api(data).then()
        this.$emit('updateBasket')
      }
    },
    isConflict(conflicts, actions, action_id){
      if(actions.find((el) => el.action_id == action_id)?.enabled){
        return false
      } else {
        // Бежим по sales_conflicts
        for(let i = 0; i < conflicts[action_id]?.sales_conflicts.length; i++){
          if(actions.find((el) => el.action_id == conflicts[action_id].sales_conflicts[i])?.enabled){
            return true
          }
        }
      }
    }
  },
  mounted () {

  },
  components: {
    Counter,
    Dialog
  },
  computed: {
    ...mapGetters([
      'basket'
    ])
  }
}
</script>
<style lang="scss">


.kenost-complect-icon{
position: relative;

.mst-icon-link{
  position: absolute;
  font-size: 16px;
  top: 7px;
  left: calc(50% + 6px);
  transform: translate(-50%, 0);
  color: #ADADAD;
}
}

.td-center{
position: relative;

span{
  position: absolute;
  top: 100%;
  transform: translate(0, -50%);
  width: 100%;
  left: 0;
  text-align: center;
}
}

.complect-button{
  position: relative;
  &:hover{
    .complect-button__form{
      opacity: 1;
      pointer-events: all;
    }
  }

  &__td{
    position: relative;

  }

  &__form{
    position: absolute;
    width: 100%;
    top: 100%;
    transform: translate(0, -50%);
  }
}

// .kenost-table-background:nth-child(2n){
// background: #F4F4F4 !important;
// }

// .kenost-table-background-complect{
//   background: #d4d4d4 !important;
// }

.k-actions{
position: relative;
&:not(:first-child) {
  margin-left: -10px;
}
}

.kenost-err-compatibility{
color: #FB203A;
font-size: 10px;
}

.k-err-icon{
width: 12px;
height: 12px;
background: #FB203A;
rotate: 45deg;
position: absolute;
top: 0;
right: 5px;
display: flex;
align-items: center;
justify-content: center;

i{
  color: #FFF;
  font-size: 8px;
  rotate: 135deg;
  position: relative;

  &::before{
    position: relative;
    top: 1px;
  }
}
}
</style>
