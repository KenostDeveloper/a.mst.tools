<template>
  <!-- {{ this.is_warehouses }} -->
  <tr v-if="!this.is_warehouses" @click="this.active = !this.active" :class="{'active-el' : this.active, 'no-active-el' : !this.active}">
      <td><i class="pi pi-angle-up"></i></td>
      <td><span class="k-table__article">{{items.article}}</span></td>
      <td class="k-table__photo"><img class="k-table__image" :src="items.image" alt=""></td>
      <td class="k-table__title"><p>{{items.pagetitle}}</p></td>
      <td class="k-table__busket">
        <form class="k-table__form event-none" action="">
          <Counter :min="0" :max="100" :value="0"/>
          <button class="dart-btn dart-btn-primary"><i class="d_icon d_icon-busket"></i></button>
        </form>
      </td>
      <td>{{items.total_stores}}</td>
      <td>от {{Math.round(getMinPrice(items.stores)).toLocaleString('ru')}} ₽</td>
      <td></td>
      <td></td>
      <td></td>
      <td>от {{getMinDelivery(items.stores).delivery}} дн ({{new Date(getMinDelivery(items.stores).delivery_day).toLocaleString("ru", {month: 'long', day: 'numeric'})}})</td>
      <td></td>
      <td></td>
  </tr>
  <tr class="kenost-table-background" v-for="(item, index) in items.stores" v-bind:key="item.id" :class="{'active' : this.active || this.is_warehouses, 'no-active' : !this.active && !this.is_warehouses}">
      <td></td>
      <td><span class="k-table__article">{{items.article}}</span></td>
      <td class="k-table__photo"><img class="k-table__image" :src="items.image" alt=""></td>
      <td class="k-table__title" @click="openActions(item)"><p>{{item.name}}</p></td>
      <td class="k-table__busket">
        <!-- :class="{'basket-true' : item.basket.availability}" -->
        <form class="k-table__form" action="" :class="{'basket-true' : item.basket.availability}">
          <Counter :key="new Date().getMilliseconds() + item.id" @ElemCount="ElemCount" :min="1" :max="item.remains" :id="item.remain_id" :store_id="item.store_id" :index="index" :value="item.basket.count"/>
          <div @click="addBasket(item.remain_id, item.basket.count, item.store_id, index)" class="dart-btn dart-btn-primary"><i class="d_icon d_icon-busket"></i></div>
        </form>
      </td>
      <td :data-id="item.id">{{item.store_name}}</td>
      <td>{{Math.round(item.price).toLocaleString('ru')}} ₽</td>
      <td>{{item.old_price ? Math.round(item.old_price).toLocaleString('ru') : Math.round(item.price).toLocaleString('ru')}} ₽ / {{((item.old_price - item.price).toFixed(0)).toLocaleString('ru')}} ₽</td>
      <td>{{item.delay ? Number(item.delay).toFixed(1) + ' дн' : 'Нет'}}</td>
      <td>{{item.payer === '1' ? 'Поставщик' : 'Покупатель'}} </td>
      <td>от {{item.delivery}} дн ({{new Date(item.delivery_day).toLocaleString("ru", {month: 'long', day: 'numeric'})}})</td>
      <td>
        <div class="k-order__actions center">
          <div @click="openActions(item)" class="k-actions" v-for="(action, index) in item.actions" v-bind:key="action.id">
            <img :style="index > 2 ? { display: 'none' } : false" class="k-order__actions-el" :src="action.icon" >
            <!-- <div v-if="action.conflicts.items[action.action_id]?.length" :style="index > 2 ? { display: 'none' } : false" class="k-err-icon"><i class="pi pi-info"></i></div> -->
          </div>
          <div v-if="item?.actions?.length > 3" class="k-order__actions-el last">+{{ item?.actions?.length - 3 }}</div>
        </div>
        <span v-if="item?.actions[0]?.conflicts?.global" class="kenost-err-compatibility">* Несовместимость акций</span>
      </td>
      <td>{{item.remains}}</td>
  </tr>
  <!-- Вывод комплектов -->
  <tbody class="complect-button kenost-table-background kenost-table-background-complect" v-for="complect in items.complects" v-bind:key="complect.id" :class="{'active' : this.active || this.is_warehouses, 'no-active' : !this.active && !this.is_warehouses}">
    <tr v-for="(item, index) in complect" v-bind:key="item.id" :class="{'active' : this.active || this.is_warehouses, 'no-active' : !this.active && !this.is_warehouses}">
      <td></td>
      <td><span class="k-table__article">{{item.article}}</span></td>
      <td class="k-table__photo">
        <img class="k-table__image" :src="item.image" alt="">
        <div v-if="index < complect.length - 1" class="kenost-complect-icon">
                  <i class="mst-icon mst-icon-link"></i>
                </div>
      </td>
      <td class="k-table__title" @click="openActions(item)"><p>{{item.pagetitle}}</p></td>
      <td class="k-table__busket complect-button__td" :class="{'pointer-none' : index !== 0}">
        <form class="k-table__form complect-button__form" :class="{'basket-true' : item.basket.availability}" action="" v-if="index === 0">
          <Counter :key="new Date().getMilliseconds() + item.id" @ElemCount="ElemCountComplect" :min="1" :max="item.remain_complect" :id="item.complect_id" :store_id="item.store_id" :index="index" :value="item.basket.count"/>
          <div @click="addBasketComplect(item.complect_id, item.basket.count, item.store_id, index)" class="dart-btn dart-btn-primary"><i class="d_icon d_icon-busket"></i></div>
        </form>
      </td>
      <td class="td-center" :class="{'pointer-none' : index !== 0}"><span :style="'top:' +  (complect.length * 70) / 2 + 'px'" v-if="index === 0">{{item.store_name}}</span></td>
      <td>{{Math.round(Number(item.new_price)).toLocaleString('ru')}}₽ x {{ item.multiplicity }} шт.</td>
      <td>{{Math.round(Number(item.price) * Number(item.multiplicity)).toLocaleString('ru')}} ₽ / {{Math.round(Number(item.price) * Number(item.multiplicity) - Number(item.new_price) * Number(item.multiplicity)).toLocaleString('ru')}} ₽</td>
      <td class="td-center" :class="{'pointer-none' : index !== 0}"><span :style="'top:' +  (complect.length * 70) / 2 + 'px'" v-if="index === 0">{{item.action?.delay ? Number(item.action?.delay).toFixed(1) + ' дн' : 'Нет'}}</span></td>
      <td class="td-center" :class="{'pointer-none' : index !== 0}"><span :style="'top:' +  (complect.length * 70) / 2 + 'px'" v-if="index === 0">{{item.action?.payer === '1' ? 'Поставщик' : 'Покупатель'}}</span></td>
      <td class="td-center" :class="{'pointer-none' : index !== 0}"><span :style="'top:' +  (complect.length * 70) / 2 + 'px'" v-if="index === 0">от {{item.delivery}} дн ({{new Date(item.delivery_day).toLocaleString("ru", {month: 'long', day: 'numeric'})}})</span></td>
      <td>
        <div class="k-order__actions center">
          <div @click="openActions(item)" class="k-actions" v-for="(action, index) in item.actions" v-bind:key="action.id">
            <img :style="index > 2 ? { display: 'none' } : false" class="k-order__actions-el" :src="action.icon" >
            <!-- <div v-if="action.conflicts.items[action.action_id]?.length" :style="index > 2 ? { display: 'none' } : false" class="k-err-icon"><i class="pi pi-info"></i></div> -->
          </div>
          <!-- <div v-if="item.actions.length > 3" class="k-order__actions-el last">+{{ item.actions.length - 3 }}</div> -->
        </div>
        <!-- <span v-if="item?.actions[0]?.conflicts?.global" class="kenost-err-compatibility">* Несовместимость акций</span> -->
      </td>
      <td class="td-center" :class="{'pointer-none' : index !== 0}"><span :style="'top:' +  (complect.length * 70) / 2 + 'px'" v-if="index === 0">{{item.remain_complect}} шт</span></td>
    </tr>
  </tbody>
  <Dialog v-model:visible="this.modal_remain" header=" " :style="{ width: '340px' }">
      <div class="kenost-not-produc">
          <img src="../../../public/img/opt/not-products.png" alt="">
          <b>У нас нет столько товаров :(</b>
          <p>Извините, но количество данного товара ограничено</p>
          <div class="a-dart-btn a-dart-btn-primary" @click="this.modal_remain = false">Понятно</div>
      </div>
  </Dialog>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import Counter from './Counter.vue'
import router from '@/router'
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
      modal_remain: false
    }
  },
  methods: {
    ...mapActions([
      'busket_from_api'
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
    openActions (item) {
      this.$emit('ElemAction', item)
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
        console.log(this.modal_remain)
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
        console.log(this.modal_remain)
      } else {
      // eslint-disable-next-line vue/no-mutating-props
        this.items.stores[object.index].basket.count = object.value
        const data = { action: 'basket/update', id: router.currentRoute._value.params.id, id_complect: object.id, value: object.value, store_id: object.store_id }
        this.busket_from_api(data).then()
        this.$emit('updateBasket')
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

.k-table{
&__form{
  .k-quantity{
    display: none;
  }

  &.basket-true{
    .k-quantity{
      display: block;
    }

    .dart-btn-primary{
      display: none;
    }
  }
}
}

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
    position: absolute;
    width: 100px;
    top: 50%;
    transform: translate(0, -50%);
  }

  &__form{
    // position: absolute;
    // top: 100%;
    // transform: translate(0, -50%);
  }
}

.kenost-table-background:nth-child(2n){
background: #F4F4F4 !important;
}

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
