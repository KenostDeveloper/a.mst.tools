<template>
    <div class="k-order" :class="{ show: show }">
        <div class="overlay" @click.prevent="fromOrder"></div>
        <div class="k-order__content" :class="{ loading: loading, order: order }">
            <div class="k-order__title" v-if="order">
                <span class="title">Заказ #{{order}} оформлен!</span>
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
                <img v-if="order" class="k-order-img" src="../../assets/images/order.png" alt="">
            </div>
            <div v-else class="h-full">
                <div class="k-order__orders" v-if="this.basket.basket">
                    <div v-for="(warehouse, key) in this.basket.basket" v-bind:key="warehouse.id">
                        <div class="k-order__order" v-for="store in warehouse.stores" v-bind:key="store.id">
                            <h3>Адрес доставки: «{{ this.basket.warehouses.find((el) => el.id == key).name_short }}», {{ this.basket.warehouses.find((el) => el.id == key).address_short }}</h3>
                            <div class="k-order__shop">
                                <!-- <img src="../../assets/img/ava.png" alt=""> -->
                                <p :style="{'background': store.color}">{{store.name}}</p>
                            </div>
                            <div v-for="item in store.products" v-bind:key="item.id">
                                <div class="k-order__product" v-for="product in item.basket" v-bind:key="product.id">
                                    <img class="k-order__product-img" :src="item.image" :alt="product.name">
                                    <div class="k-order__product-info">
                                        <button href="#" class="k-order__product-delete" @click="clearBasketProduct(store.id, item.id_remain)">
                                            <img src="/images/icons/trash.svg" alt="">
                                        </button>
                                        <div class="k-order__main-info">
                                            <p :data-id="item.id_remain">{{item.name}}</p>
                                            <div class="k-order__actions">
                                                <div class="table-actions">
                                                    <!-- 'red': action?.conflicts?.items[action.action_id]?.sales_conflicts -->
                                                    <div class="table-actions__action active" v-for="(action, indexactions) in product.tags" v-bind:key="action.id">
                                                        <div v-if="action.length > 0" class="table-actions__container" >
                                                            <div class="table-actions__el" v-for="(tag, indextag) in action" v-bind:key="tag.id">
                                                                <img v-if="tag.type == 'multiplicity'" src="/images/icons/action/gray/box.svg" alt="">
                                                                <p class="w-fit" v-if="tag.type == 'multiplicity'">{{ tag.value }} шт.</p>

                                                                <img v-if="tag.type == 'min'" src="/images/icons/action/gray/min.svg" alt="">
    
                                                                <img v-if="tag.type == 'gift'" src="/images/icons/action/gray/gift.svg" alt="">
    
                                                                <img v-if="tag.type == 'delay'" src="/images/icons/action/gray/time.svg" alt="">
                                                                <p class="w-fit" v-if="tag.type == 'delay'">Отсроч. {{ tag.value }} дн.</p>
    
                                                                <img v-if="tag.type == 'sale'" src="/images/icons/action/gray/sale.svg" alt="">
                                                                <p class="w-fit" v-if="tag.type == 'sale'">Скидка {{ Number(tag.value).toFixed(0) }}%</p>
    
                                                                <img v-if="tag.type == 'free_delivery'" src="/images/icons/action/gray/delivery.svg" alt="">
    
                                                                <!-- TODO: Комплекты -->
                                                            </div>
                                                        </div>
                                                        <div v-if="action.length > 0" class="table-actions__help">
                                                            <p>?</p>
                                                            <div class="table-actions__content">
                                                                <div class="table-actions__modal">
                                                                    <div class="table-actions__modal-elems">
                                                                        <div class="table-actions__modal-el" v-for="(tag, index) in action" v-bind:key="tag.id">
                                                                        <img v-if="tag.type == 'min_sum'" src="../../assets/images/icons/action/basket.svg" alt="">
                                                                        <p v-if="tag.type == 'min_sum'">Минимальна сумма покупки {{ Number(tag.value).toLocaleString('ru') }} ₽</p>
    
                                                                        <img v-if="tag.type == 'free_delivery'" src="../../assets/images/icons/action/delivery.svg" alt="">
                                                                        <p v-if="tag.type == 'free_delivery'"><span>Бесплатная доставка</span> <span v-if="tag.condition == '2'"> при покупке от {{ (tag.value).toLocaleString('ru') }} ₽</span> <span v-if="tag.condition == '3'"> при покупке от {{ (tag.value).toLocaleString('ru') }} шт.</span></p>
    
                                                                        <img v-if="tag.type == 'gift'" src="../../assets/images/icons/action/gift.svg" alt="">
                                                                        <p v-if="tag.type == 'gift'">Подарок</p>
    
                                                                        <img v-if="tag.type == 'delay'" src="../../assets/images/icons/action/gift.svg" alt="">
                                                                        <p v-if="tag.type == 'delay'">Отсрочка {{ tag.value }} дн.</p>
    
                                                                        <img v-if="tag.type == 'multiplicity'" src="../../assets/images/icons/action/box.svg" alt="">
                                                                        <p v-if="tag.type == 'multiplicity'">Кратность упаковки {{ (tag.value).toLocaleString('ru') }} шт.</p>
    
                                                                        <img v-if="tag.type == 'sale'" src="../../assets/images/icons/action/sale.svg" alt="">
                                                                        <p v-if="tag.type == 'sale'">
                                                                            Скидка {{ (tag.value).toLocaleString('ru') }}%
                                                                            <span v-if="tag.min_count > 1">
                                                                                при покупке от
                                                                                {{ tag.min_count.toLocaleString("ru") }} шт.</span
                                                                            >
                                                                        </p> 
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
                                                <!-- {{ product.tags }} -->
                                                <!-- {{ product.tags }} -->
                                                
                                                <!-- <div class="k-actions" v-for="(action, index) in product?.actions" v-bind:key="action.id">
                                                <img :style="index > 2 ? { display: 'none' } : false" class="k-order__actions-el" :src="site_url_prefix + action.icon" >
                                                </div>
                                                <div v-if="product?.actions?.length > 3" class="k-order__actions-el last">+{{ product?.actions?.length - 3 }}</div> -->
                                            </div>
                                            <div class="k-order__buttons">
                                                <b>{{(product.count * product.price).toLocaleString('ru')}} ₽</b>
                                                <Counter :item="{product: product, warehouse_id: this.basket.warehouses.find((el) => el.id == key)}" :key="new Date().getMilliseconds() + product.id_remain" @ElemCount="ElemCount" :min="1" :max="item.remains" :value="product.count" :id="item.id_remain" :store_id="item.store_id"/>
                                            </div>
                                        </div>
                                        <div class="k-order__product-data">
                                            <span class="k-order__article">{{item.article}}</span>
                                            <p class="k-order__info">Отсрочка: <span>{{product.delay ? Number(product.delay).toFixed(1) + ' дн' : 'Предоплата'}}</span></p>
                                            <p class="k-order__info">Оплата доставки: <span>{{product.payer === '1' ? 'Поставщик' : 'Покупатель'}}</span></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-for="complect in store.complects" v-bind:key="complect.id" class="k-order__complects relative">
                                <!-- <div class="k-order__complect-title">
                                    <p>Комплект</p>
                                </div> -->
                                <span class="complect-icon">Комплект</span>
                                <button href="#" class="k-order__product-delete complect-delete" @click="clearBasketComplect(store.id, complect.products[0].complect_id)">
                                    <img src="/images/icons/trash.svg" alt="">
                                </button>
                                <div class="k-order__complect-rows dart-align-items-center flex flex-col">
                                    <div class="k-order__complect" v-for="product in complect.products" v-bind:key="product.id">
                                        <div class="flex">
                                            <div class="">
                                                <img class="k-order__product-img " :src="product.image" :alt="product.name">
                                            </div>
                                            <div class="">
                                                <div class="k-order__product-info">
                                                    <div class="k-order__main-info">
                                                        <p>{{product.name}} </p>
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
                                        <div class="k-order__complect-data">
                                            <div class="k-order__complect-data-items flex flex-col items-end">
                                                <b>{{(Number(complect.info.count) * complect.info.price).toLocaleString('ru')}} ₽</b>
                                                <Counter
                                                    :key="new Date().getMilliseconds() + product.id_remain"
                                                    @ElemCount="ElemComplectCount"
                                                    :item="product"
                                                    :mini="true"
                                                    :min="1"
                                                    :step="Number(product.multiplicity)"
                                                    :max="complect?.info?.complect_data?.min_count * Number(product.multiplicity)"
                                                    :value="complect?.info?.count * Number(product.multiplicity)"
                                                    :id="complect.info.id"
                                                    :store_id="store.id"
                                                />
                                                <!-- <Counter :item="{warehouse_id: this.basket.warehouses.find((el) => el.id == key)}" :key="new Date().getMilliseconds() + complect.info.id" @ElemCount="ElemComplectCount" :min="1" :max="complect.info.complect_data?.min_count" :value="complect.info.count" :id="complect.info.id" :store_id="store.id"/> -->
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="k-order__product-data">
                                    <!-- <p class="k-order__info">Отсрочка: <span>50 дн.</span></p>
                                    <p class="k-order__info">Оплата доставки: <span>Покупатель</span></p> -->
                                    <!-- {{ store }} -->
                                    <p class="k-order__info">Отсрочка: <span>{{complect.products[0].delay ? Number(complect.products[0].delay).toFixed(1) + ' дн' : 'Предоплата'}}</span></p>
                                    <p class="k-order__info">Оплата доставки: <span>{{complect.products[0].payer === '1' ? 'Поставщик' : 'Покупатель'}}</span></p>
                                </div>
                            </div>
                            <div class="k-order__final">
                                <div class="k-order__final-info">
                                    
                                    <!-- <div class="k-order__colums">
                                        <p>Кол-во SKU с отсрочкой Х</p>
                                        <p>0</p>
                                    </div> -->
                                    <div class="k-order__colums">
                                        <p>Вес заказа (кг)</p>
                                        <p>{{ Number(store?.weight).toFixed(2) }}</p>
                                    </div>
                                    <div class="k-order__colums">
                                        <!-- <p>Кол-во SKU с отсрочкой Y</p>
                                        <p>0</p> -->
                                    </div>
                                    <div class="k-order__colums">
                                        <p>Объем заказа </p>
                                        <p>{{store?.volume }}</p>
                                    </div>
                                   
                                </div>
                                <div class="k-order__final-button">
                                    <div class="a-dart-btn a-dart-btn-secondary" @click="generateXSLX(store.id, key)">Скачать</div>
                                    <div class="a-dart-btn a-dart-btn-primary k-order__oplata" @click.prevent="orderSubmit(store.id)"><p>Отправить заказ</p> <p>{{ store?.cost?.toLocaleString('ru') }} ₽</p></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="d-col-basket" v-else>
                    <div class="basket-empty__content">
                        <img class="hidden-mobile-l" src="/src/assets/images/icons/basket.svg" alt="">
                        <img class="visible-mobile-l" src="/src/assets/images/icons/basket-gray.svg" alt="">
                        <h3>В вашей корзине пока пусто</h3>
                    </div>
                </div>
    
                <div class="k-order__order" v-if="!order && this.basket.basket">
                    <h3 class="k-order__line">Итого</h3>
                    <div class="k-order__final">
                        <div class="k-order__final-info">
                            
                            <!-- <div class="k-order__colums bold">
                                <p>Кол-во SKU с отсрочкой Х</p>
                                <p>0</p>
                            </div> -->
                            <div class="k-order__colums bold">
                                <p>Вес заказа (кг)</p>
                                <p>{{ Number(this.basket?.weight).toFixed(2) }}</p>
                            </div>
                            <div class="k-order__colums bold">
                                <!-- <p>Кол-во SKU с отсрочкой Y</p>
                                <p>0</p> -->
                            </div>
                            <div class="k-order__colums bold">
                                <p>Объем заказа</p>
                                <p>{{ this.basket?.volume }}</p>
                            </div>
                           
                        </div>
                        <div class="k-order__final-button">
                            <div @click="generateXSLXAll" class="a-dart-btn a-dart-btn-secondary"><i class="pi pi-download"></i></div>
                            <div class="a-dart-btn a-dart-btn-primary k-order__oplata" @click.prevent="orderSubmit('all')"><p>Отправить все заказы</p> <p>{{ this.basket?.cost?.toLocaleString('ru') }} ₽</p></div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    </div>

    <Dialog v-model:visible="this.modal_remain" header=" " :style="{ width: '340px' }">
		<div class="kenost-not-produc">
			<!-- <img src="../../../public/img/opt/not-products.png" alt="" /> -->
			<b>У нас нет столько товаров :(</b>
			<p>Извините, но количество данного товара ограничено</p>
			<div class="a-dart-btn a-dart-btn-primary" @click="this.modal_remain = false">
				Понятно
			</div>
		</div>
	</Dialog>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { toRaw } from 'vue'
import router from '../../router'
import Counter from './Counter.vue'
import Dialog from "primevue/dialog";

export default {
  name: 'OrderForm',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    order_id: {
      type: Number,
      default: 0
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
      order: 0,
      value: 1,
      modal_remain: false
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
    async orderSubmit ($storeId) {
      const data = { action: 'order/opt/submit', id: router.currentRoute._value.params.id, store_id: $storeId }
      this.order = await this.opt_order_api(data).then((response) => {
        this.$emit('orderSubmit', response.data?.data?.data[0]?.id)

        
        const data = { action: 'basket/get', id: router.currentRoute._value.params.id }
        this.busket_from_api(data)

        this.busket_from_api({
            action: 'basket/get',
            id: router.currentRoute._value.params.id,
            warehouse: 'all'
        })
      })
    },
    ElemCount (object) {
      const data = {
        action: 'basket/update',
        id: router.currentRoute._value.params.id,
        id_remain: object.id,
        value: object.value,
        store_id: object.store_id,
        actions: object.item.product.actions_ids,
        id_warehouse: object.item.warehouse_id.id
    }
      this.busket_from_api(data).then(() => {
        this.busket_from_api({
            action: 'basket/get',
            id: router.currentRoute._value.params.id,
            warehouse: 'all'
        })
      })
      
    },
    ElemComplectCount(object) {
        console.log(object)
        if (object.value > Number(object.max)) {
            this.modal_remain = true;
        } else {
            this.$emit("catalogUpdate");
            const data = {
                action: "basket/update",
                id: router.currentRoute._value.params.id,
                id_complect: object.item.complect_id,
                value: object.value / object.item.multiplicity,
                store_id: object.store_id,
            };
            this.busket_from_api(data).then((response) => {
                const datainfo = {
                    complect_id: object.item.complect_id,
                    store_id: object.store_id,
                    count: object.value / object.item.multiplicity,
                };
                this.$store.commit("SET_OPT_COMPLECT_MUTATION_TO_VUEX", datainfo);
                this.$store.commit("SET_SALES_COMPLECT_MUTATION_TO_VUEX", datainfo);
            });
            this.busket_from_api({
                action: 'basket/get',
                id: router.currentRoute._value.params.id,
                warehouse: 'all'
            })
        }
    },
    clearBasket () {
      const data = { action: 'basket/clear', id: router.currentRoute._value.params.id }
      this.busket_from_api(data).then()
      this.busket_from_api({
        action: 'basket/get',
        id: router.currentRoute._value.params.id,
        warehouse: 'all'
      })
    },
    clearBasketProduct (storeid, productid) {
      const data = { 
        action: 'basket/clear', 
        id: router.currentRoute._value.params.id, 
        store_id: storeid, 
        id_remain: productid 
      }
      this.busket_from_api(data).then(() => {
        // console.log("бабадумс")
        this.busket_from_api({
            action: 'basket/get',
            id: router.currentRoute._value.params.id,
            warehouse: 'all'
        }).then(() => {
            // console.log("бабадумс 2")
        })
      })      
    },
    clearBasketComplect(storeid, complectid) {
			this.$emit("catalogUpdate");
			this.$emit("actionUpdate");
			const data = {
				action: "basket/clear",
				id: router.currentRoute._value.params.id,
				store_id: storeid,
				id_complect: complectid,
			};
			this.busket_from_api(data).then((response) => {});
			this.busket_from_api({
				action: 'basket/get',
				id: router.currentRoute._value.params.id,
				warehouse: 'all'
			})
		},
    generateXSLX (storeId, warehouseId) {
        const data = {
            action: 'generate/xslx',
            id: router.currentRoute._value.params.id,
            store_id: storeId,
            warehouse_id: warehouseId
        }
        this.opt_api(data).then((res) => {
            var anchor = document.createElement('a');
            anchor.href = res.data.data;
            anchor.target="_blank";
            anchor.click();
        })
    },
    generateXSLXAll () {
      const data = { action: 'generate/xslx', id: router.currentRoute._value.params.id }
      this.opt_api(data).then((res) => {
        var anchor = document.createElement('a');
        anchor.href = res.data.data;
        anchor.target="_blank";
        anchor.click();
      })
    }
  },
  mounted () {
    if(this.order_id){
        this.order = this.order_id
    }
    this.busket_from_api({
        action: 'basket/get',
        id: router.currentRoute._value.params.id,
        warehouse: 'all'
    })
  },
  components: { Counter, Dialog },
  computed: {
    ...mapGetters([
      'optbasketall'
    ])
  },
  watch: {
    optbasketall: function (newVal, oldVal) {
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

        &__buttons{
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 14px;  
        }

        &__complects{
            padding: 12px 16px;
            border-radius: 5px;
            border: 1px solid #A7A7A7;
        }

        &__complect {
            padding: 16px 0;
            // border-bottom: 1px solid #E2E2E2;
            width: 100%;
            display: flex;
            justify-content: space-between;

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
            margin: 20px 0;

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

            .d-col-basket{
                box-shadow: none;
                padding: 30px 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
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
            position: relative;
            gap: 8px;
            padding: 35px 0 16px;
            border-bottom: 1px solid #E2E2E2;
            &-delete{
                position: absolute;
                cursor: pointer;
                top: 8px;
                right: 0;
                padding: 0;
                margin: 0;
                border: none;
                background: transparent;
            }
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
