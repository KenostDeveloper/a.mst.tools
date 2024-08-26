<template>
    <div class="k-order" :class="{ show: show }">
        <div class="overlay" @click.prevent="fromOrder"></div>
        <div class="k-order__content" :class="{ loading: loading, order: order }">
            <div class="k-order__title" v-if="order">
                <span class="title">Заказ #{{order.id}} оформлен!</span>
                <div class="k-order__close" @click.prevent="fromOrder">
                    <i class="pi pi-times"></i>
                </div>
            </div>
            <div class="k-order__title" v-else>
                <span class="title">Оформление заказа</span>
                <div class="k-order__close" @click.prevent="fromOrder">
                    <i class="pi pi-times"></i>
                </div>
            </div>
            <div class="k-order__orders" v-if="order">
                <p>В ближайшее время с Вами свяжутся наши менеджеры.</p>
                <img v-if="order" class="k-order-img" src="../../assets/img/order.png" alt="">
            </div>
            <div class="k-order__orders" v-else>
                <div class="k-order__order" v-for="store in this.basket?.stores" v-bind:key="store.id">
                    <h3>Заказ у поставщика «{{store.name}}»</h3>
                    <div class="k-order__shop">
                        <img src="../../assets/img/ava.png" alt="">
                        <p :style="{'background': store.color}">{{store.address}}</p>
                    </div>
                    <div class="k-order__product" v-for="product in store.products" v-bind:key="product.id">
                        <img class="k-order__product-img" :src="product.image" :alt="product.name">
                        <div class="k-order__product-info">
                            <div class="k-order__main-info">
                                <p>{{product.name}}</p>
                                <!-- <div class="k-order__actions">
                                    <img class="k-order__actions-el" src="https://mst.tools/assets/cache_image/products/7021/51158554_450x450_71b.jpg">
                                    <img class="k-order__actions-el" src="https://mst.tools/assets/cache_image/products/7021/51158554_450x450_71b.jpg">
                                    <img class="k-order__actions-el" src="https://mst.tools/assets/cache_image/products/7021/51158554_450x450_71b.jpg">
                                    <img class="k-order__actions-el" src="https://mst.tools/assets/cache_image/products/7021/51158554_450x450_71b.jpg">
                                    <img class="k-order__actions-el" src="https://mst.tools/assets/cache_image/products/7021/51158554_450x450_71b.jpg">
                                    <div class="k-order__actions-el last">+3</div>
                                </div> -->
                                <div class="k-order__actions center">
                                    <div class="k-actions" v-for="(action, index) in product.actions" v-bind:key="action.id">
                                    <img :style="index > 2 ? { display: 'none' } : false" class="k-order__actions-el" :src="site_url_prefix + action.icon" >
                                    <!-- <div v-if="action.conflicts.items[action.id]?.length" :style="index > 2 ? { display: 'none' } : false" class="k-err-icon"><i class="pi pi-info"></i></div> -->
                                    </div>
                                    <div v-if="product.actions.length > 3" class="k-order__actions-el last">+{{ product.actions.length - 3 }}</div>
                                </div>
                                <Counter :key="new Date().getMilliseconds() + product.id_remain" @ElemCount="ElemCount" :min="1" :max="product.remains" :value="product.info.count" :id="product.id_remain" :store_id="product.store_id"/>
                                <b>{{(product.info.count * product.info.price).toLocaleString('ru')}} ₽</b>
                            </div>
                            <div class="k-order__product-data">
                                <span class="k-order__article">{{product.article}}</span>
                                <p class="k-order__info">Отсрочка: <span>{{product.delay ? Number(product.delay).toFixed(1) + ' дн' : 'Нет'}}</span></p>
                                <p class="k-order__info">Оплата доставки: <span>{{product.payer === '1' ? 'Поставщик' : 'Покупатель'}}</span></p>
                            </div>
                        </div>
                    </div>
                    <div v-for="complect in store.complects" v-bind:key="complect.id" class="k-order__complect">
                        <div class="k-order__complect-title">
                            <p>Комплект</p>
                        </div>
                        <div class="k-order__complect-rows dart-row dart-align-items-center">
                            <div class="k-order__complect-products d-col-md-9">
                                <div class="k-order__product" v-for="product in complect.products" v-bind:key="product.id">
                                    <div class="dart-row">
                                        <div class="d-col-md-1">
                                            <img class="k-order__product-img " :src="product.image" :alt="product.name">
                                        </div>
                                        <div class="d-col-md-9">
                                            <div class="k-order__product-info">
                                                <div class="k-order__main-info">
                                                    <p>{{product.name}} </p>
                                                    <!-- <div class="k-order__actions">
                                                        <img class="k-order__actions-el" src="https://mst.tools/assets/cache_image/products/7021/51158554_450x450_71b.jpg">
                                                        <img class="k-order__actions-el" src="https://mst.tools/assets/cache_image/products/7021/51158554_450x450_71b.jpg">
                                                        <img class="k-order__actions-el" src="https://mst.tools/assets/cache_image/products/7021/51158554_450x450_71b.jpg">
                                                        <img class="k-order__actions-el" src="https://mst.tools/assets/cache_image/products/7021/51158554_450x450_71b.jpg">
                                                        <img class="k-order__actions-el" src="https://mst.tools/assets/cache_image/products/7021/51158554_450x450_71b.jpg">
                                                        <div class="k-order__actions-el last">+3</div>
                                                    </div> -->
                                                    <div class="k-order__actions center">
                                                        <div class="k-actions" v-for="(action, index) in product.actions" v-bind:key="action.id">
                                                        <img :style="index > 2 ? { display: 'none' } : false" class="k-order__actions-el" :src="site_url_prefix + action.icon" >
                                                        <!-- <div v-if="action.conflicts.items[action.action_id]?.length" :style="index > 2 ? { display: 'none' } : false" class="k-err-icon"><i class="pi pi-info"></i></div> -->
                                                        </div>
                                                        <!-- <div v-if="item.actions.length > 3" class="k-order__actions-el last">+{{ item.actions.length - 3 }}</div> -->
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="k-order__product-data">
                                                <span class="k-order__article">{{product.article}} x {{product.multiplicity * complect.info.count}} шт</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="k-order__complect-data d-col-md-3">
                                <div class="k-order__complect-data-items">
                                    <Counter :key="new Date().getMilliseconds() + complect.info.id" @ElemCount="ElemComplectCount" :min="1" :max="complect.info.complect_data?.min_count" :value="complect.info.count" :id="complect.info.id" :store_id="store.id"/>
                                    <b>{{(Number(complect.info.count) * complect.info.price).toLocaleString('ru')}} ₽</b>
                                </div>
                            </div>
                        </div>
                        <div class="k-order__product-data">
                            <!--
                                <p class="k-order__info">Отсрочка: <span>50 дн.</span></p>
                                <p class="k-order__info">Оплата доставки: <span>Покупатель</span></p>
                            -->
                        </div>
                    </div>
                    <div class="k-order__final">
                        <div class="k-order__final-info">
                            <!--
                            <div class="k-order__colums">
                                <p>Кол-во SKU с отсрочкой Х</p>
                                <p>0</p>
                            </div>
                            <div class="k-order__colums">
                                <p>Вес заказа (кг)</p>
                                <p>{{ Number(store?.weight).toFixed(2) }}</p>
                            </div>
                            <div class="k-order__colums">
                                <p>Кол-во SKU с отсрочкой Y</p>
                                <p>0</p>
                            </div>
                            <div class="k-order__colums">
                                <p>Объем заказа </p>
                                <p>{{(store?.volume / 1000000).toFixed(2) }}</p>
                            </div>
                            -->
                        </div>
                        <div class="k-order__final-button">
                            <div class="a-dart-btn a-dart-btn-secondary" @click="generateXSLX(store.id)">Скачать</div>
                            <div class="a-dart-btn a-dart-btn-primary k-order__oplata" @click.prevent="orderSubmit(store.id)"><p>Отправить заказ</p> <p>{{ store?.cost?.toLocaleString('ru') }} ₽</p></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="k-order__order" v-if="!order">
                <h3 class="k-order__line">Итого</h3>
                <div class="k-order__final">
                    <div class="k-order__final-info">
                        <!--
                        <div class="k-order__colums bold">
                            <p>Кол-во SKU с отсрочкой Х</p>
                            <p>0</p>
                        </div>
                        <div class="k-order__colums bold">
                            <p>Вес заказа (кг)</p>
                            <p>{{ Number(this.basket?.weight).toFixed(2) }}</p>
                        </div>
                        <div class="k-order__colums bold">
                            <p>Кол-во SKU с отсрочкой Y</p>
                            <p>0</p>
                        </div>
                        <div class="k-order__colums bold">
                            <p>Объем заказа</p>
                            <p>{{ (this.basket?.volume / 1000000).toFixed(2) }}</p>
                        </div>
                        -->
                    </div>
                    <div class="k-order__final-button">
                        <div @click="generateXSLXAll" class="a-dart-btn a-dart-btn-secondary"><i class="pi pi-download"></i></div>
                        <div class="a-dart-btn a-dart-btn-primary k-order__oplata" @click.prevent="orderSubmit('all')"><p>Отправить заказ</p> <p>{{ this.basket?.cost?.toLocaleString('ru') }} ₽</p></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import router from '@/router'
import Counter from './Counter.vue'

export default {
  name: 'Basket',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    pagination_items_per_page: {
      type: Number,
      default: 25
    },
    pagination_offset: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      loading: false,
      basket: {},
      order: false,
      value: 1
    }
  },
  emits: ['fromOrder', 'orderSubmit'],
  methods: {
    ...mapActions([
      'busket_from_api',
      'opt_order_api',
      'opt_api'
    ]),
    fromOrder () {
      this.order = false
      this.$emit('fromOrder')
    },
    orderSubmit ($storeId) {
      const data = { action: 'order/opt/submit', id: router.currentRoute._value.params.id, store_id: $storeId }
      this.opt_order_api(data).then((response) => {
        // console.log(response)
        this.order = response.data.data.data[0]
        this.$emit('orderSubmit')
        const data = { action: 'basket/get', id: router.currentRoute._value.params.id }
        this.busket_from_api(data).then(
          this.basket = this.optbasket
        )
      })
    },
    ElemCount (object) {
      const data = { action: 'basket/update', id: router.currentRoute._value.params.id, id_remain: object.id, value: object.value, store_id: object.store_id }
      this.busket_from_api(data).then()
    },
    ElemComplectCount (object) {
      // console.log(object)
      if (object.value > Number(object.max)) {
        this.modal_remain = true
        console.log(this.modal_remain)
      } else {
        const data = { action: 'basket/update', id: router.currentRoute._value.params.id, id_complect: object.id, value: object.value, store_id: object.store_id }
        this.busket_from_api(data).then()
      }
    },
    clearBasket () {
      const data = { action: 'basket/clear', id: router.currentRoute._value.params.id }
      this.busket_from_api(data).then()
    },
    clearBasketProduct (storeid, productid) {
      const data = { action: 'basket/clear', id: router.currentRoute._value.params.id, store_id: storeid, id_remain: productid }
      this.busket_from_api(data).then()
    },
    generateXSLX (storeId) {
      const data = { action: 'generate/xslx', id: router.currentRoute._value.params.id, store_id: storeId }
      this.opt_api(data).then((res) => {
        console.log(res)
        window.location.href = res.data.data
      })
    },
    generateXSLXAll () {
      const data = { action: 'generate/xslx', id: router.currentRoute._value.params.id }
      this.opt_api(data).then((res) => {
        console.log(res)
        window.location.href = res.data.data
      })
    }
  },
  mounted () {
    const data = { action: 'basket/get', id: router.currentRoute._value.params.id }
    this.busket_from_api(data).then(
      this.basket = this.optbasket
    )
  },
  components: { Counter },
  computed: {
    ...mapGetters([
      'optbasket'
    ])
  },
  watch: {
    optbasket: function (newVal, oldVal) {
      this.basket = newVal
    }
  }
}
</script>
<style lang="scss">
    .k-order{
        z-index: 10;
        width: 100vw;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        pointer-events: none;

        &__complect {
            padding: 16px 0;
            border-bottom: 1px solid #E2E2E2;
            .k-order__main-info p{
                max-width: 290px;
                width: auto;
            }
            &-title p{
                font-size: 14px;
                font-weight: 500;
            }
            &-rows{
                display: flex;
                .k-order__product {
                    border: none;
                    display: block;
                }
            }
            &-data-items {
                display: flex;
                align-items: center;
                gap: 16px;
            }
        }

        &__final-info{
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-auto-flow: row;
            gap: 8px 10px;
        }

        &__final{
            justify-content: space-between;
            display: flex;
            padding-top: 16px;
        }

        &__line{
            border-bottom: 1px solid #E2E2E2;
            padding-bottom: 16px;
        }

        &__orders{
            height: calc(100% - 200px);
            overflow-y: auto;

            &::-webkit-scrollbar {
                width: 5px;
                background-color: #e0e0e0; /* blue */
            }

            &::-webkit-scrollbar-thumb {
                background-color: #b4b4b4; /* green */
                border-radius: 9em;
            }
        }

        &__colums{
            display: flex;

            &.bold{
                p{
                    margin: 0;
                    color: #282828 !important;
                    font-size: 14px;
                    font-weight: 500 !important;
                }
            }

            p{
                margin: 0;
                color: #282828;
                font-size: 14px;
                font-weight: 500;
            }

            p:first-child{
                color: #ACABAB;
                font-size: 14px;
                font-weight: 400;
                margin-right: 17px;
            }
        }

        &__content{
            width: 950px;
            height: 100%;
            background: #FFF;
            right: 0;
            position: fixed;
            z-index: 2;
            transform: translateX(100%);
            transition: all 0.5s;
            padding: 60px 32px;

            &.order{
                width: 480px;
            }
        }

        &__oplata{
            display: flex;
            align-items: center;
            p{
                margin: 0;
                color: #FFFFFF;
                font-size: 16px;
                font-weight: 500;
            }
        }

        &__final-button{
            display: flex;
            align-items: center;
            gap: 12px;
        }

        &__product-data{
            display: flex;
            align-items: center;
            gap: 16px;
        }

        &__info{
            font-size: 12px;
            font-weight: 400;
            color: #ACABAB;
            margin: 0;

            span{
                color: #282828;
            }
        }

        &__article{
            font-weight: 400;
            font-size: 14px;
            margin: 0;
            color: #ACABAB;
        }

        &__actions{
            display: flex;

            &.center {
                justify-content: center;
            }

            &-el {
                min-width: 36px;
                width: 36px;
                height: 36px !important;
                object-fit: cover;
                border-radius: 50%;
                border: 1px solid #E8E8E8;
                overflow: hidden;

                &.last{
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #282828;
                    border: 1px solid #525252;
                    color: #fff;
                    font-size: 14px;
                }

                &.error{
                    position: relative;
                    &::before{
                        width: 13px;
                        height: 13px;
                        background-color: #FB203A;
                        border-radius: 3px;
                        rotate: 45deg;
                        content: "";
                        position: absolute;
                    }
                }
            }

        }

        &__title{
            display: flex;
            align-items: center;
            justify-content: space-between;
            span{
                font-size: 28px;
                font-weight: 500;
                color: #282828;
                margin: 0;
            }
        }

        &__product{
            display: flex;
            align-items: flex-start;
            gap: 8px;
            padding: 16px 0;
            border-bottom: 1px solid #E2E2E2;
        }

        &__main-info{
            width: 100%;
            display: flex;
            justify-content: space-between;

            p{
                width: 340px;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
                font-size: 14px;
                line-height: 18px;
            }
        }

        &__product-img{
            width: 40px;
        }

        &__order{
            border: 1px solid #E2E2E2;
            margin-top: 20px;
            border-radius: 5px;
            padding: 20px;

            h3{
                margin: 0;
                font-size: 20px;
                line-height: 24px;
                font-weight: 500;
                color: #282828;
            }
        }

        &__product-info{
            width: 100%;
        }

        &__close{
            width: 24px;
            height: 24px;
            background: #7878784A;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #FFF;
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.4s;

            &:hover{
                background: #4949494a;
            }

            i{
                font-size: 12px;
            }
        }

        &__shop{
            display: flex;
            align-items: center;
            gap: 8px;

            p{
                margin: 0;
                color: #FFFFFF;
                font-size: 14px;
                font-weight: 400;
                padding: 4px 8px;
                border-radius: 5px;
            }

            img{
                width: 40px;
                height: 40px;
                border-radius: 50%;
                border: 1px solid #E8E8E8;
            }
        }

        &.show{
            pointer-events: all;
            .k-order__content{
                transform: translateX(0%);
            }
            .overlay{
                width: 100%;
                height: 100%;
                display: block;
                top: 0;
                left: 0;
                z-index: 1;
                position: absolute;
                background: rgba($color: #000000, $alpha: 0.5);
            }
        }
    }
</style>
