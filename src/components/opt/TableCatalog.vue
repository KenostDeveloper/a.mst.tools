<template>
    <div class="k-container">
        <div class="scrollLegt" @mouseenter="leftScroll('start')" @mouseleave="leftScroll('stop')"></div>
        <div class="scrollRight" @mouseenter="rigthScroll('start')" @mouseleave="rigthScroll('stop')"></div>
        <table class="k-table" :style="{ marginLeft: this.marginValue + 'px' }">
            <thead>
                <tr>
                    <th class="k-table__name"></th>
                    <th class="k-table__name">Артикул</th>
                    <th class="k-table__name k-table__photo">Фото</th>
                    <th class="k-table__name k-table__th-title">Название</th>
                    <th class="k-table__name k-table__th-buttons"></th>
                    <th class="k-table__name">Поставщик</th>
                    <th class="k-table__name">Цена</th>
                    <th class="k-table__name">РЦ / Наценка</th>
                    <th class="k-table__name">Отсрочка</th>
                    <th class="k-table__name">Оплата доставки</th>
                    <th class="k-table__name">Срок доставки</th>
                    <th class="k-table__name k-table__th-actions">Акции</th>
                    <th class="k-table__name">Остатки на складе, шт</th>
                </tr>
            </thead>
            <!-- <tbody> -->
                <TableCatalogRow :is_warehouses="this.is_warehouses" @ElemAction="ElemAction" @updateBasket="updateBasket" v-for="item in items.items" v-bind:key="item.id" :items="item"/>
            <!-- </tbody> -->
        </table>
    </div>
    <Dialog v-if="this.actions_item !== null" v-model:visible="this.modal_actions" :header="'Акции товара ' + this.actions_item.name" class="kenost-actions-modal">
        <table class="kenost-actions-modal__table">
            <thead>
                <tr>
                    <th class="kenost-actions-modal__th-action">Акция</th>
                    <th class="kenost-actions-modal__th-desc">Описание</th>
                    <th class="kenost-actions-modal__th-info">Условие</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
              <tr v-for="(item) in this.actions_item.actions" v-bind:key="item.id" @click="this.active = !this.active" :class="{'active-el' : this.active, 'no-active-el' : !this.active}">
                <td class="kenost-actions-modal__action">
                  <img :src="item.icon" alt="">
                  <span v-if="item.id > 0">
                    <RouterLink :to="{ name: 'promotion', params: { action: item.action_id }}" class="kenost-actions-modal__link"><p>{{item.name}}</p> <i class="mst-icon mst-icon-open"></i></RouterLink>
                  </span>
                  <span v-else>
                    {{item.name}}
                  </span>
                </td>
                <td class="kenost-actions-modal__center">{{item.description}}</td>
                <td class="kenost-actions-modal__center">
                  <div v-if="item.action_id == 0">
                    Базовая скидка клиента в размере {{ item.base_sale }}%
                  </div>
                  <div v-else>
                    Скидка <span v-if="item.old_price != 0">{{(100 - (Number(item.new_price) / (item.old_price / 100))).toFixed(2)}}</span><span v-else>100</span>%, оплата доставки {{item.payer === '1' ? 'поставщиком' : 'покупателем'}}
                    <span v-if="item.delivery_payment_terms == '1'">при условии «Купи на {{ Number(item.delivery_payment_value).toLocaleString('ru') }} рублей»</span>
                    <span v-if="item.delivery_payment_terms == '2'">при условии «Купи {{ Number(item.delivery_payment_value).toLocaleString('ru') }} шт. товара»</span><span v-if="item.delay != 0">, отсрочка {{Number(item.delay).toLocaleString('ru')}} дней</span>
                    <span v-if="item.delay_condition == '1'">при покупке на {{ Number(item.delay_condition_value).toLocaleString('ru') }} рублей</span>
                    <span v-if="item.delay_condition == '2'">при покупке {{ Number(item.delay_condition_value).toLocaleString('ru') }} шт. товара</span>
                    <span v-if="item.delay != 0">(<span v-for="(delay, index) in item.delay_graph" v-bind:key="delay.id"><span v-if="index != 0">, </span>{{ Number(delay.day).toLocaleString('ru') }} дней – {{ delay.percent }}%</span>)</span>
                  </div>
                  </td>
                  <td>
                  <div class="kenost-conflict">
                    <!-- v-if="item.conflicts?.items[item.action_id]" -->
                    <div v-if="item.conflicts?.items[item.action_id] && !item.enabled" class="kenost-conflict__container">
                      <div class="kenost-conflict__icon">
                        <i class="pi pi-info"></i>
                      </div>
                      <div class="kenost-conflict__message">
                        <div v-for="(conf) in item.conflicts?.items[item.action_id]?.postponement_conflicts" v-bind:key="conf">
                          <p>Конфликт с акцией <span>{{ this.actions_item.actions.find(action => action.id === conf) ? this.actions_item.actions.find(action => action.id === conf).name : this.actions_item.actions.find(action => action.action_id === conf).name }}</span></p>
                        </div>
                        <!-- v-if="item.conflicts?.items[item.action_id]?.postponement_conflicts.indexOf(conf) == -1 && conf != item.action_id" -->
                        <div v-for="(conf) in item.conflicts?.items[item.action_id]?.sales_conflicts" v-bind:key="conf">
                          <p v-if="item.conflicts?.items[item.action_id]?.postponement_conflicts?.indexOf(conf) == -1 || !item.conflicts?.items[item.action_id]?.postponement_conflicts">Конфликт с акцией <span>{{ this.actions_item.actions.find(action => action.id === conf) ? this.actions_item.actions.find(action => action.id === conf).name : this.actions_item.actions.find(action => action.action_id === conf).name }}</span></p>
                        </div>
                      </div>
                    </div>
                    <InputSwitch @update:modelValue="updateAction(item.id == 0? this.actions_item.remain_id : item.remain_id, item.id == 0? this.actions_item.store_id : item.store_id, item.action_id, item.enabled)" class="kenost-input-switch" v-model="item.enabled" />
                  </div>
                </td>
            </tr>
            </tbody>
          </table>
    </Dialog>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import TableCatalogRow from './TableCatalogRow.vue'
import Dialog from 'primevue/dialog'
import InputSwitch from 'primevue/inputswitch'
// import { isNullOrUndef } from 'chart.js/dist/helpers/helpers.core'
import router from '@/router'

export default {
  name: 'TableCatalog',
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
    },
    is_warehouses: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      loading: true,
      interval: null,
      marginValue: 1,
      modal_actions: false,
      actions_item: null
    }
  },
  methods: {
    ...mapActions([
      'opt_api'
    ]),
    ...mapMutations([
      'SET_OPT_PRODUCT_TO_VUEX'
    ]),
    updateBasket () {
      this.$emit('updateBasket')
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
  components: { TableCatalogRow, Dialog, InputSwitch },
  computed: {
    ...mapGetters([
    ])
  }
}
</script>
<style lang="scss">

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
        z-index: 1;
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

.kenost-actions-modal{
  width: 1400px;

  &__link{
    display: flex;
    gap: 12px;
    text-decoration: none;
  }

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
      width: 56px !important;
      margin-right: 10px;
      height: 56px !important;
      object-fit: contain;
    }

    p{
      font-size: 14px;
      color: #282828;
      margin: 0;
    }

    i{
      color: #282828;
      &:hover{
        color: #282828;
      }
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

    tr.active-el td{
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
      border-top: 1px solid #0000001F;
    }

    .active-el{
      box-shadow: 0px 4px 12.5px 0px #0000001F;
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
      opacity: 1;
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

        &-buttons{
          width: 100px;
        }
    }
}
</style>
