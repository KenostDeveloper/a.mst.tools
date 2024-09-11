<template>
    <div class="k-container std-catalog-table__wrapper">
        <!-- <div class="scrollLegt" @mouseenter="leftScroll('start')" @mouseleave="leftScroll('stop')"></div>
        <div class="scrollRight" @mouseenter="rigthScroll('start')" @mouseleave="rigthScroll('stop')"></div> -->
        <table class="k-table" :style="{ marginLeft: this.marginValue + 'px' }">
            <thead>
                <tr>
                    <th class="k-table__name k-tablr-th-icon hidden-mobile-l"></th>
                    <th class="k-table__name k-tablr-th-photo hidden-mobile-l">Фото</th>
                    <th class="k-table__name k-tablr-th-title">Наименование / Артикул</th>
                    <th class="k-table__name k-tablr-th-buttons hidden-mobile-l"><i class="d_icon d_icon-busket"></i></th>
                    <th class="k-table__name k-tablr-th-price">Цена /<br> отсрочка</th>
                    <th class="k-table__name k-tablr-th-action hidden-mobile-l">Акции</th>
                    <th class="k-table__name k-tablr-th-delivery">Оплата доставки /<br> срок доставки</th>
                    <th class="k-table__name k-tablr-th-remain hidden-mobile-l">Остаток</th>
                    <th class="k-table__name k-tablr-th-vendor">Поставщик / Склад</th>
                    <th class="k-table__name k-tablr-th-retail hidden-mobile-l">РЦ / Наценка</th>
                </tr>
            </thead>
              <TableCatalogRow :is_warehouses="this.is_warehouses" @ElemAction="ElemAction" @updateBasket="updateBasket" v-for="item in items.items" v-bind:key="item.id" :items="item"/>
        </table>
    </div>
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
