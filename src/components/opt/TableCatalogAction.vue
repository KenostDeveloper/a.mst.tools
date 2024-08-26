<template>
  <div class="k-container">
      <div class="scrollLegt" @mouseenter="leftScroll('start')" @mouseleave="leftScroll('stop')"></div>
      <div class="scrollRight" @mouseenter="rigthScroll('start')" @mouseleave="rigthScroll('stop')"></div>
      <table class="k-table" :style="{ marginLeft: this.marginValue + 'px' }">
          <thead>
              <tr>
                  <th class="k-table__name">Артикул</th>
                  <th class="k-table__name k-table__photo">Фото</th>
                  <th class="k-table__name k-table__th-title">Название</th>
                  <th class="k-table__name k-table__th-buttons"></th>
                  <th class="k-table__name">РРЦ </th>
                  <th class="k-table__name">Скидка %</th>
                  <th class="k-table__name">Цена со скидкой за шт. (₽)</th>
                  <th class="k-table__name">Кратность</th>
                  <th class="k-table__name">Сумма (₽)</th>
                  <th class="k-table__name">Остатки на складе</th>
              </tr>
          </thead>
          <tbody class="complect-button kenost-table-background kenost-table-background-complect" v-for="complect in items.complects" v-bind:key="complect.id">
            <tr v-for="(item, index) in complect.products" v-bind:key="item.id" class="no-line">
              <td>
                <span class="k-table__article">{{item.article}}</span>
              </td>
              <td class="k-table__photo">
                <img class="k-table__image" :src="item.image" alt="">
                <div v-if="index < complect.products.length - 1" class="kenost-complect-icon">
                  <i class="mst-icon mst-icon-link"></i>
                </div>
              </td>
              <td class="k-table__title" @click="openActions(item)"><p>{{item.name}}</p></td>
              <td class="k-table__busket complect-button__td" :class="{'pointer-none' : index !== 0}">
                <form class="k-table__form complect-button__form" action="" v-if="index === 0" :class="{'basket-true' : item.basket.availability}">
                  <Counter :key="new Date().getMilliseconds() + item.id" @ElemCount="ElemCountComplect" :min="1" :id="item.complect_id" :store_id="items.store_id" :index="item.complect_id" :max="item.remain.min_count" :value="item.basket.count"/>
                  <div @click="addBasketComplect(item.complect_id, item.basket.count, items.store_id, index)" class="dart-btn dart-btn-primary"><i class="d_icon d_icon-busket"></i></div>
                </form>
              </td>
              <!-- <td>{{item.store_name}}</td> -->
              <td>{{Math.round(item.old_price).toLocaleString('ru')}} ₽</td>
              <td>{{(item.new_price / 100 == 0) ? '100.00' : ((item.old_price - item.new_price) / (item.old_price / 100)).toFixed(2)}}</td>
              <td>{{Math.round(item.new_price).toLocaleString('ru')}} ₽</td>
              <td>{{item.multiplicity}} </td>
              <td>{{(Math.round(item.new_price) * item.multiplicity * item.basket.count).toLocaleString('ru')}} ₽</td>
              <td class="td-center"><span v-if="index === 0" :style="'top:' +  (complect.products.length * 70) / 2 + 'px'">{{complect.remain.min_count}} шт</span></td>
            </tr>
          </tbody>
          <!-- <tbody> -->
              <!-- <TableCatalogActionRow @ElemAction="ElemAction" @updateBasket="updateBasket" v-for="item in items.products" v-bind:key="item.id" :items="item"/> -->
              <tr class="kenost-table-background" v-for="item in items.products" v-bind:key="item.id">
                  <td><span class="k-table__article">{{item.article}}</span></td>
                  <td class="k-table__photo"><img class="k-table__image" :src="item.image" alt=""></td>
                  <td class="k-table__title" @click="openActions(item)"><p>{{item.name}}</p></td>
                  <td class="k-table__busket">
                    <form class="k-table__form" action="" :class="{'basket-true' : item.basket.availability}">
                      <Counter :key="new Date().getMilliseconds() + item.id" @ElemCount="ElemCount" :min="1" :max="item.remains" :id="item.remain_id" :store_id="items.store_id" :index="index" :value="item.basket.count"/>
                      <div @click="addBasket(item.remain_id, item.basket.count, items.store_id, index)" class="dart-btn dart-btn-primary"><i class="d_icon d_icon-busket"></i></div>
                    </form>
                  </td>
                  <!-- <td>{{item.store_name}}</td> -->
                  <td>{{Math.round(item.price).toLocaleString('ru')}} ₽</td>
                  <td>{{((item.old_price - item.new_price) / (item.new_price / 100)).toFixed(2)}}</td>
                  <td>{{Math.round(item.new_price).toLocaleString('ru')}} ₽</td>
                  <td>{{item.multiplicity}} </td>
                  <td>{{(item.new_price * item.multiplicity).toLocaleString('ru')}} ₽</td>
                  <td>{{item.remain.remains}} шт</td>
                </tr>
          <!-- </tbody> -->
      </table>
  </div>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
// import TableCatalogActionRow from './TableCatalogActionRow.vue'
// import Dialog from 'primevue/dialog'
// import InputSwitch from 'primevue/inputswitch'
import Counter from './Counter.vue'
import router from '@/router'

export default {
  name: 'TableCatalogAction',
  emits: ['updateBasket', 'ElemAction', 'updateCatalog'],
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
    }
  },
  data () {
    return {
      loading: true,
      interval: null,
      marginValue: 1,
      modal_actions: false,
      actions_item: null,
      value: 1
    }
  },
  methods: {
    ...mapActions([
      'opt_api',
      'busket_from_api'
    ]),
    ...mapMutations([
      'SET_OPT_PRODUCT_TO_VUEX'
    ]),
    updateBasket () {
      this.$emit('updateBasket')
    },
    addBasket (id, value, storeid, index) {
      const data = { action: 'basket/add', id: router.currentRoute._value.params.id, id_remain: id, value, store_id: storeid }
      this.busket_from_api(data).then()
      console.log(this.items.products[id])
      // eslint-disable-next-line vue/no-mutating-props
      this.items.products[id].basket.availability = true
      this.$emit('updateBasket')
    },
    addBasketComplect (complectid, value, storeid, index) {
      const data = { action: 'basket/add', id: router.currentRoute._value.params.id, id_complect: complectid, value, store_id: storeid }
      this.busket_from_api(data).then()
      // eslint-disable-next-line vue/no-mutating-props
      this.items.complects[complectid].products[0].basket.availability = true
      this.$emit('updateBasket')
    },
    ElemCount (object) {
      if (object.value > Number(object.max)) {
        this.modal_remain = true
      } else {
      // eslint-disable-next-line vue/no-mutating-props
        this.items.products[object.id].basket.count = object.value
        const data = { action: 'basket/update', id: router.currentRoute._value.params.id, id_remain: object.id, value: object.value, store_id: object.store_id }
        this.busket_from_api(data).then()
        this.$emit('updateBasket')
      }
    },
    ElemCountComplect (object) {
      if (object.value > Number(object.max)) {
        this.modal_remain = true
        console.log(this.modal_remain)
      } else {
      // eslint-disable-next-line vue/no-mutating-props
        this.items.complects[object.id].products[0].basket.count = object.value
        const data = { action: 'basket/update', id: router.currentRoute._value.params.id, id_complect: object.id, value: object.value, store_id: object.store_id }
        this.busket_from_api(data).then()
        this.$emit('updateBasket')
      }
    },
    leftScroll (event) {
      clearInterval(this.interval)
      if (event === 'start') {
        this.interval = window.setInterval(() => {
          if (this.marginValue < 0) {
            this.marginValue = this.marginValue + 50
          } else {
            this.marginValue = 0
          }
        }, 50)
      }
    },
    rigthScroll (event) {
      clearInterval(this.interval)
      if (event === 'start') {
        const widthTable = document.querySelector('.k-container').offsetWidth
        this.interval = window.setInterval(() => {
          if ((1500 - widthTable) * -1 < this.marginValue) {
            this.marginValue = this.marginValue - 50
          } else {
            this.marginValue = (1500 - widthTable) * -1
          }
        }, 50)
      }
    },
    ElemAction (obj) {
      this.actions_item = obj
      // console.log(obj)
      this.modal_actions = true
    },
    async updateAction (remainid, storeid, actionid, status) {
      // Выключаем конфликтные акции
      const conflicts = this.actions_item.actions.find((action) => action.action_id === actionid)
      // console.log(conflicts)
      if (conflicts.conflicts.items[conflicts.action_id]) {
        if (conflicts.conflicts.items[conflicts.action_id].postponement_conflicts) {
          for (let i = 0; i < conflicts.conflicts.items[conflicts.action_id].postponement_conflicts.length; i++) {
            for (let j = 0; j < Object.keys(this.actions_item.actions).length; j++) {
              if (conflicts.conflicts.items[conflicts.action_id].postponement_conflicts[i] === this.actions_item.actions[j].action_id) {
                if (this.actions_item.actions[j].enabled) {
                  this.actions_item.actions[j].enabled = false
                  const data = {
                    action: 'action/user/off/on',
                    remain_id: this.actions_item.actions[j].remain_id ? this.actions_item.actions[j].remain_id : conflicts.remain_id,
                    store_id: this.actions_item.actions[j].store_id ? this.actions_item.actions[j].store_id : conflicts.store_id,
                    action_id: this.actions_item.actions[j].action_id,
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
            for (let j = 0; j < Object.keys(this.actions_item.actions).length; j++) {
              if (conflicts.conflicts.items[conflicts.action_id].sales_conflicts[i] === this.actions_item.actions[j].action_id) {
                if (this.actions_item.actions[j].enabled) {
                  this.actions_item.actions[j].enabled = false
                  const data = {
                    action: 'action/user/off/on',
                    remain_id: this.actions_item.actions[j].remain_id ? this.actions_item.actions[j].remain_id : conflicts.remain_id,
                    store_id: this.actions_item.actions[j].store_id ? this.actions_item.actions[j].store_id : conflicts.store_id,
                    action_id: this.actions_item.actions[j].action_id,
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
        action_id: actionid,
        status: !status,
        test: 'true3'
      }
      this.opt_api(data).then(() => {
        const dataUpdate = {
          action: 'get/info/product',
          store_id: storeid,
          remain_id: remainid,
          id: router.currentRoute._value.params.id
        }

        this.opt_api(dataUpdate).then((response) => {
          const data = {
            remain_id: remainid,
            store_id: storeid,
            data: response.data.data
          }
          this.$store.commit('SET_OPT_PRODUCT_TO_VUEX', data)
        })
      })
    }
  },
  mounted () {
  },
  components: { Counter },
  computed: {
    ...mapGetters([
      'basket'
    ])
  }
}
</script>
<style lang="scss">

.kenost-table-background:hover{
.k-table__form{
    opacity: 1;
}
}

.no-line{
border-bottom: none !important;
}

.kenost-conflict{
display: flex;
align-items: center;
gap: 16px;
justify-content: flex-end;
position: relative;

&__icon{
  width: 20px;
  height: 20px;
  background: #FB203A;
  border-radius: 3px;
  rotate: 45deg;
  display: flex;
  align-items: center;
  justify-content: center;

  i{
    color: #FFF;
    font-size: 12px;
    rotate: 135deg;
    position: relative;

    &::before{
      position: relative;
      top: 1px;
    }
  }

  &.none{
    visibility: hidden;
  }
}

&__container{
  &:hover{
    .kenost-conflict__message{
      opacity: 1;
      pointer-events: all;
    }
  }
}

&__message{
  transition: all 0.4s;
  opacity: 0;
  pointer-events: none;
  position: absolute;
  // rotate: -45deg;
  white-space: nowrap;
  top: 40px;
  right: 0;
  padding: 12px;
  border-radius: 5px;
  background: #282828;

  &::before{
    width: 20px;
    height: 20px;
    border-radius: 5px;
    position: absolute;
    content: "";
    rotate: 45deg;
    top: -7px;
    right: 63px;
    background: #282828;
  }

  p{
    margin: 0;
    font-size: 12px;
    color: #FFF;

    span{
      text-decoration: underline;
    }
  }
}
}

.kenost-conflict{
.p-inputswitch.p-highlight .p-inputswitch-slider{
  background: #FF0000 !important;

  &::before{
    left: 0.4rem !important;
  }
}
}

.pointer-none{
  pointer-events: none;
}

.kenost-actions-modal{
width: 1400px;

&__actions{
  display: flex;
}

&__th{
  &-action{
    width: 390px;
  }
  &-desc{
    width: 350px;
  }
  &-info{
    width: 400px;
  }
}

&__center{
  text-align: center;
  padding: 16px 10px !important;
}

&__table{
  width: 100%;

  th{
    text-align: center;
    padding: 16px 0;
  }

  td{
    padding: 16px 0;
    border-top: 1px solid #E2E2E2
  }
}

&__action{
  display: flex;

  img{
    width: 110px !important;
    height: 56px !important;
    object-fit: contain;
  }

  p{
    font-size: 14px;
    color: #282828;
  }
}
}

.scrollLegt{
  height: 100%;
  width: 70px;
  background: transparent;
  position: absolute;
  z-index: 2;
}

.scrollRight{
  height: 100%;
  width: 70px;
  background: transparent;
  position: absolute;
  right: 0;
  z-index: 2;
}

.k-container{
  width: 100%;
  overflow-x: auto;
  position: relative;

  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background-color: #e0e0e0; /* blue */
    border-radius: 9em;
  }

  &::-webkit-scrollbar-thumb {
      background-color: #b4b4b4; /* green */
      border-radius: 9em;
  }
}

.event-none{
  pointer-events: none;
}

.k-table{
  width: 1500px;
  transition: all 0.5s;

  td{
      text-align: center;
      padding: 16px 0;
      color: #282828;
      font-size: 14px;
  }

  tbody tr{
      padding: 0 20px;
  }

  tbody tr:not(.active){
      border-bottom: 1px solid #0000001F;
      transition: border-bottom 0.4s;
      cursor: pointer;
  }

  tbody tr.active-el{
      box-shadow: 0px 4px 12.5px 0px #0000001F;
  }

  tbody tr.active-el{
      border-bottom: 1px solid #FF000073
  }

  tr.no-active{
      display: none;
  }

  tr.no-active-el{
      .pi-angle-up{
          transform: rotate(180deg);
          transition: all 0.4s;
      }
  }

  .no-active-el, .active-el{
    border-bottom: 1px solid #0000001F;
  }

  .active-el{
    box-shadow: 0px 4px 12.5px 0px #0000001F;
  }

  .active-el .k-table__form,
  .no-active-el .k-table__form{
    opacity: 0;
    pointer-events: none;
  }

  tr.active-el{
      .pi-angle-up{
          transform: rotate(0deg);
          transition: all 0.4s;
      }
  }

  // td + td{
  //     border-top: 1px solid #0000001F;
  // }

  tr.active:hover{
      .k-table__form{
          opacity: 1;
      }
  }

  &__form{
      align-items: center;
      display: flex;
      gap: 12px;
      transition: all 0.4s;
      width: 100%;
      justify-content: center;
      z-index: 1;
  }

  &__header{
      display: flex;
      justify-content: space-between;
  }

  &__name{
      text-align: center;
      color: #282828;
      font-size: 14px;
      font-weight: 500px;
      padding: 8px 0 24px 0;
      border-bottom: 1px solid #0000001F;
  }

  &__photo{
    width: 50px;
    text-align: right !important;
  }

  &__article{
      font-size: 14px;
      color: #ADADAD;
      font-weight: 400;
      text-align: center;
  }

  &__image{
      width: 38px;
      height: 38px !important;
      border-radius: 5px;
      object-fit: contain;
      background: #FFF;
  }

  &__title{
    padding: 16px 0 0 0 !important;
    p{
      color: #282828;
      text-decoration: underline;
      font-size: 14px;
      font-weight: 400;
      line-height: 16px;
      cursor: pointer;

      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }

  &__th{
      &-title{
          width: 260px;
      }

      &-actions{
          width: 150px;

      }
  }
}
</style>
