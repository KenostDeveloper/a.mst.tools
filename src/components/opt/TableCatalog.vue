<template>
  <div class="k-container std-catalog-table__wrapper">
    <table class="k-table" :style="{ marginLeft: this.marginValue + 'px' }">
      <thead>
        <tr>
          <!-- <th class="k-table__name k-tablr-th-icon hidden-mobile-l"></th>
          <th class="k-table__name k-tablr-th-photo hidden-mobile-l">Фото</th>
          <th class="k-table__name k-tablr-th-title">Наименование / Артикул</th>
          <th class="k-table__name k-tablr-th-buttons hidden-mobile-l"><i class="d_icon d_icon-busket"></i></th>
          <th class="k-table__name k-tablr-th-price">Цена /<br> отсрочка</th>
          <th class="k-table__name k-tablr-th-action hidden-mobile-l">Акции</th>
          <th class="k-table__name k-tablr-th-delivery">Оплата доставки /<br> срок доставки</th>
          <th class="k-table__name k-tablr-th-remain hidden-mobile-l">Остаток</th>
          <th class="k-table__name k-tablr-th-vendor">Поставщик / Склад</th>
          <th class="k-table__name k-tablr-th-retail hidden-mobile-l">РЦ / Наценка</th> -->

          <th class="k-table__name k-tablr-th-icon"></th>
          <th class="k-table__name k-tablr-th-title">Наименование / Артикул</th>
          <th class="k-table__name k-tablr-th-change-remain">Изменение остатков</th>
          <th class="k-table__name k-tablr-th-remain-speed">Остаток<small>, шт</small> / Скорость продаж <small>, шт./день.</small></th>
          <th class="k-table__name k-tablr-th-prognoz">Прогноз остатков</th>
          <th class="k-table__name k-tablr-th-buttons"><i class="d_icon d_icon-busket"></i></th>
          <th class="k-table__name k-tablr-th-price">Цена /<br> отсрочка</th>
          <th class="k-table__name k-tablr-th-action">Акции</th>
          <th class="k-table__name k-tablr-th-delivery">Оплата доставки /<br> срок доставки</th>
          <th class="k-table__name k-tablr-th-remain">Остаток поставщика</th>
          <th class="k-table__name k-tablr-th-vendor">Поставщик / Склад</th>
        </tr>
      </thead>
      <!-- <tbody> -->
        <TableCatalogRow
          v-for="item in items.items"
          :key="item.id"
          :items="item"
          @ElemAction="ElemAction"
          @updateBasket="updateBasket"
          :is_warehouses="is_warehouses"
        />
      <!-- </tbody> -->
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
      actions_item: null,
      visibleItems: [],
      sendItems: [],
      tobserver: null,
      timeOut: null
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
    initializeIntersectionObserver() {
      // Если уже есть старый наблюдатель, останавливаем его
      if (this.tobserver) {
        this.tobserver.disconnect();
      }

      // Создаем новый IntersectionObserver
      this.tobserver = new IntersectionObserver(this.callback, {
        threshold: 0.5, // Срабатывает, когда хотя бы 50% элемента видно
      });

      // Получаем все элементы товара и начинаем отслеживание
      const productItems = document.querySelectorAll('.kenost-product-item');
      productItems.forEach((item) => {
        this.tobserver.observe(item);
      });
    },

    callback(entries, observer) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const itemData = JSON.parse(entry.target.dataset.info);
          if (!this.visibleItems.some(item => item.id === itemData.id)) {
            this.visibleItems.push(itemData); // Добавляем весь объект товара
          }
        }
      });

      if(this.timeOut){
        clearTimeout(this.timeOut);
      }

      this.timeOut = setTimeout(() => {
        const productsVisible = this.visibleItems.filter(item => !this.sendItems.includes(item));
        for(let i = 0; i < productsVisible.length; i++){
          this.sendItems.push(productsVisible[i]);
        }
        if(productsVisible.length){
          // Убедитесь, что dataLayer существует
          window.dataLayer = window.dataLayer || [];

          // Ваш запрос на сервер
          dataLayer.push({
              "ecommerce": {
                "currencyCode": "RUB",
                "impressions": productsVisible
              }
          });

        }
      }, 2000);
    },
    // leftScroll (event) {
    //   clearInterval(this.interval)
    //   if (event === 'start') {
    //     this.interval = window.setInterval(() => {
    //       if (this.marginValue < 0) {
    //         this.marginValue = this.marginValue + 50
    //       } else {
    //         this.marginValue = 0
    //       }
    //     }, 50)
    //   }
    // },
    // rigthScroll (event) {
    //   clearInterval(this.interval)
    //   if (event === 'start') {
    //     const widthTable = document.querySelector('.k-container').offsetWidth
    //     this.interval = window.setInterval(() => {
    //       if ((1500 - widthTable) * -1 < this.marginValue) {
    //         this.marginValue = this.marginValue - 50
    //       } else {
    //         this.marginValue = (1500 - widthTable) * -1
    //       }
    //     }, 50)
    //   }
    // },
    ElemAction (obj) {
      this.actions_item = obj
      this.modal_actions = true
    },
    async updateAction (remainid, storeid, actionid, status) {
      // Выключаем конфликтные акции

      const conflicts = this.actions_item.actions.find((action) => action.action_id === actionid)
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
    // this.initializeIntersectionObserver();
  },
  components: { TableCatalogRow, Dialog, InputSwitch },
  computed: {
    ...mapGetters([
    ])
  },
  watch: {
    items: function (oldVal, newVal) {
      // Обновление товара при изменении данных
      if (newVal && oldVal != newVal) {
        setTimeout(() => this.initializeIntersectionObserver(), 3000)
      }
    }
  }
}
</script>
<style lang="scss">

</style>
