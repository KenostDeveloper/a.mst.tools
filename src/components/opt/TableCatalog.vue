<template>
    <div class="k-container">
        <!-- <div class="scrollLegt" @mouseenter="leftScroll('start')" @mouseleave="leftScroll('stop')"></div>
        <div class="scrollRight" @mouseenter="rigthScroll('start')" @mouseleave="rigthScroll('stop')"></div> -->
        <table class="k-table" :style="{ marginLeft: this.marginValue + 'px' }">
            <thead>
                <tr>
                    <th class="k-table__name k-tablr-th-icon"></th>
                    <th class="k-table__name k-tablr-th-photo">Фото</th>
                    <th class="k-table__name k-tablr-th-title">Наименование / Артикул</th>
                    <th class="k-table__name k-tablr-th-buttons"></th>
                    <th class="k-table__name k-tablr-th-price">Цена /<br> отсрочка</th>
                    <th class="k-table__name k-tablr-th-action">Акции</th>
                    <th class="k-table__name k-tablr-th-delivery">Оплата доставки /<br> срок доставки</th>
                    <th class="k-table__name k-tablr-th-remain">Остаток</th>
                    <th class="k-table__name k-tablr-th-vendor">Поставщик / Склад</th>
                    <th class="k-table__name k-tablr-th-retail">РЦ / Наценка</th>
                </tr>
            </thead>
              <TableCatalogRow :is_warehouses="this.is_warehouses" @ElemAction="ElemAction" @updateBasket="updateBasket" v-for="item in items.items" v-bind:key="item.id" :items="item"/>
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
import router from '../../router'

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

</style>
