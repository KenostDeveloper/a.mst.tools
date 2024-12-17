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
                <div class="k-order__orders" v-if="Object.prototype.hasOwnProperty.call(this.basket, 'data')">
                    <div v-for="(warehouse, w_key) in this.basket.data" v-bind:key="warehouse.store_data.id">
                        <div v-for="(org, o_key) in warehouse.data" v-bind:key="org.org_data.id" class="k-order__order">
                            <h3>Адрес доставки: «{{ warehouse.store_data.name_short ? warehouse.store_data.name_short : warehouse.store_data.name }}», {{ warehouse.store_data.address_short  ? warehouse.store_data.address_short : warehouse.store_data.address }}</h3>
                            <div class="k-order__shop">
                                <!-- <img src="../../assets/img/ava.png" alt=""> -->
                                <p :style="{'background': org.org_data.color}">{{org.org_data.name}}</p>
                            </div>
                            <div v-for="store in org.data" v-bind:key="store.warehouse_data.id">
                                <div v-for="(item, p_key) in store.data" v-bind:key="p_key" class="k-order__product">
                                    <img class="k-order__product-img" :src="item.image" :alt="item.name">
                                    <div class="k-order__product-info">
                                        <button href="#" class="k-order__product-delete" @click="clearBasketProduct(org.org_data.id, store.warehouse_data.id, p_key, item)">
                                            <img src="/images/icons/trash.svg" alt="">
                                        </button>
                                        <div class="k-order__main-info">
                                            <p :data-id="item.id_remain">{{item.name}}</p>
                                            <div class="k-order__actions">
                                                <div class="table-actions">                                                    
                                                    <div class="table-actions__action" v-for="(action, indexactions) in item.action" v-bind:key="action.id" :class="{active: action.enabled}">                                                        
                                                        <div v-if="action.tags.length > 0" class="table-actions__container" >
                                                            <div class="table-actions__el" v-for="(tag, indextag) in action.tags" v-bind:key="indextag">                                                                
                                                                <img v-if="tag.type == 'multiplicity'" src="/images/icons/action/gray/box.svg" alt="">
                                                                <p class="w-fit" v-if="tag.type == 'multiplicity'">{{ tag.value }} шт.</p>

                                                                <img v-if="tag.type == 'min'" src="/images/icons/action/gray/min.svg" alt="">
    
                                                                <img v-if="tag.type == 'gift'" src="/images/icons/action/gray/gift.svg" alt="">
    
                                                                <img v-if="tag.type == 'delay'" src="/images/icons/action/gray/time.svg" alt="">
                                                                <p class="w-fit" v-if="tag.type == 'delay'">Отсроч. {{ tag.value }} дн.</p>
    
                                                                <img v-if="tag.type == 'sale' && tag.value > 0" src="/images/icons/action/gray/sale.svg" alt="">
                                                                <p class="w-fit" v-if="tag.type == 'sale'">Скидка {{ Number(tag.value).toFixed(0) }}%</p>
    
                                                                <img v-if="tag.type == 'free_delivery'" src="/images/icons/action/gray/delivery.svg" alt="">
    
                                                            </div>
                                                        </div>
                                                        <div class="table-actions__help">
                                                            <p>?</p>
                                                            <ActionModal :action="action"/>                                                          
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="k-order__buttons">
                                                <b>{{(item.count * item.price).toLocaleString('ru')}} ₽</b>
                                                <div :class="{'loading-counter': this.fetchIds.indexOf(item.remain_id) != -1 }">
                                                    <Counter
                                                        @ElemCount="ElemCount"
                                                        :item="{basket, item}"
                                                        :min="1"
                                                        :max="item?.available"
                                                        :value="item?.count"
                                                        :id="item?.remain_id"
                                                        :key="item?.key"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div class="k-order__product-data">
                                            <span class="k-order__article">{{item.article}}</span>
                                            <p class="k-order__info">Отсрочка: <span>{{item.delay ? Number(item.delay).toFixed(1) + ' дн' : 'Предоплата'}}</span></p>
                                            <p class="k-order__info">Оплата доставки: <span>{{item.payer === '1' ? 'Поставщик' : 'Покупатель'}}</span></p>
                                        </div>
                                    </div>
                                </div>
                            </div> 
                            <div class="k-order__final">
                                <div class="k-order__final-info">
                                    
                                    <!-- <div class="k-order__colums">
                                        <p>Кол-во SKU с отсрочкой Х</p>
                                        <p>0</p>
                                    </div> -->
                                    <!-- <div class="k-order__colums">
                                        <p>Вес заказа (кг)</p>
                                        <p>{{ Number(store?.weight).toFixed(2) }}</p>
                                    </div> -->
                                    <div class="k-order__colums">
                                        <!-- <p>Кол-во SKU с отсрочкой Y</p>
                                        <p>0</p> -->
                                    </div>
                                    <!-- <div class="k-order__colums">
                                        <p>Объем заказа </p>
                                        <p>{{store?.volume }}</p>
                                    </div> -->
                                   
                                </div>
                                <div class="k-order__final-button">
                                    <div class="a-dart-btn a-dart-btn-secondary" @click="generateXSLX(org.org_data.id, key)">Скачать</div>
                                    <div class="a-dart-btn a-dart-btn-primary k-order__oplata" @click.prevent="orderSubmit(org.org_data.id)"><p>Отправить заказ</p> <p>{{ org.cart_data?.cost?.toLocaleString('ru') }} ₽</p></div>
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
    
                <div class="k-order__order" v-if="!order && this.basket">
                    <h3 class="k-order__line">Итого</h3>
                    <div class="k-order__final">
                        <div class="k-order__final-info">
                            
                            <!-- <div class="k-order__colums bold">
                                <p>Кол-во SKU с отсрочкой Х</p>
                                <p>0</p>
                            </div> -->
                            <!-- <div class="k-order__colums bold">
                                <p>Вес заказа (кг)</p>
                                <p>{{ Number(this.basket?.weight).toFixed(2) }}</p>
                            </div> -->
                            <div class="k-order__colums bold">
                                <!-- <p>Кол-во SKU с отсрочкой Y</p>
                                <p>0</p> -->
                            </div>
                            <!-- <div class="k-order__colums bold">
                                <p>Объем заказа</p>
                                <p>{{ this.basket?.volume }}</p>
                            </div> -->
                           
                        </div>
                        <div class="k-order__final-button">
                            <div @click="generateXSLXAll" class="a-dart-btn a-dart-btn-secondary"><i class="pi pi-download"></i></div>
                            <div class="a-dart-btn a-dart-btn-primary k-order__oplata" @click.prevent="orderSubmit('all')"><p>Отправить все заказы</p> <p>{{ this.basket?.cart_data?.cost?.toLocaleString('ru') }} ₽</p></div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    </div>

    <Dialog v-model:visible="this.modal_remain" header=" " :style="{ width: '340px' }">
		<div class="kenost-not-produc">
			<img src="/images/icons_milen/outOfStock2.png" alt="" />
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
import ActionModal from './ActionModal.vue'

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
      order: '',
      value: 1,
      modal_remain: false,
      timeOut: null,
      fetchIds: []
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
    async orderSubmit ($orgId) {
      const data = { action: 'order/opt/submit', id: router.currentRoute._value.params.id, org_id: $orgId }
      let arr = [];
      await this.opt_order_api(data).then((response) => {
        console.log(response)
        let res = response.data?.data;
        let products = res.products;
        let nums = res.nums;
        console.log(res)
        for(var key in products){
            const product = products[key];
            arr.push({
                id: product.id_remain,
                name: product.name,
                price: product.price,
                quantity: product.count
            })
        }

        // Убедитесь, что dataLayer существует
        window.dataLayer = window.dataLayer || [];

        dataLayer.push({
            "ecommerce": {
                "currencyCode": "RUB",
                "purchase": {
                    "actionField": {
                        "id" : "TRX987"
                    },
                    "products": arr
                }
            }
        });
        this.$emit('orderSubmit', nums)
        this.order = nums
        const data = { action: 'basket/get', id: router.currentRoute._value.params.id }
        this.busket_from_api(data)
        this.busket_from_api({
            action: 'basket/get',
            id: router.currentRoute._value.params.id,
            warehouse: 'all'
        })
      })
    },
    ElemCount(object) {
        if (!this.fetchIds.includes(object.id)) {
            this.fetchIds.push(object.id);
        }
        if (object.value > Number(object.max)) {
            this.modal_remain = true;
        } else {				
            this.$emit("catalogUpdate");
            const data = {
                action: 'basket/update',
                id: router.currentRoute._value.params.id,
                org_id: object.item.item.org_id,
                store_id: object.item.item.store_id,
                remain_id: object.id,
                value: object.value,
                key: object.item.item.key,
                actions: object.item.item.actions
            };
            this.busket_from_api(data).then((response) => {
                const datainfo = {
                    remain_id: object.id,
                    store_id: object.store_id,
                    count: object.value,
                };
                this.$store.commit("SET_OPT_PRODUCTS_MUTATION_TO_VUEX", datainfo);
                this.$store.commit("SET_SALES_PRODUCTS_MUTATION_TO_VUEX", datainfo);
            });
            if(Number(object.value) != object.old_value){
                    window.dataLayer = window.dataLayer || [];
                    window.dataLayer.push({
                            ecommerce: {
                                    currencyCode: "RUB",  // Валюта
                                    add: {
                                    products: [
                                        {
                                            id: object.id,  // ID товара
                                            name: object.item.item.name,  // Название товара
                                            price: object.item.basket.price,  // Цена товара
                                            quantity: object.value,  // Количество товара
                                        }
                                    ]
                                    }
                            }
                    });
            }
            this.busket_from_api({
                action: 'basket/get',
                id: router.currentRoute._value.params.id,
                warehouse: 'all'
            }).then((res) => {
                const index = this.fetchIds.indexOf(object.id);
                if (index !== -1) {
                    this.fetchIds.splice(index, 1); // Удаляем один элемент по индексу
                }
            });				
        }
    },
    ElemComplectCount(object) {
        console.log(object)
        if (object.value > Number(object.max)) {
            this.modal_remain = true;
        } else {
            if(this.timeOut){
                clearTimeout(this.timeOut);
            }

            this.timeOut = setTimeout(() => {
                // Ваш запрос на сервер
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
            }, 1000);
            
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
    clearBasketProduct(org_id, store_id, key, product) {
        this.$emit("catalogUpdate");
        this.$emit("actionUpdate");
        const data = {
            action: "basket/remove",
            id: router.currentRoute._value.params.id,
            org_id: org_id,
            store_id: store_id,
            key: key,
            product: product
        };
        this.busket_from_api(data).then((response) => {});

        // Убедитесь, что dataLayer существует
        window.dataLayer = window.dataLayer || [];

        // Отправка данных в dataLayer
        window.dataLayer.push({
        ecommerce: {
            currencyCode: "RUB",  // Валюта
            remove: {
                products: [
                    {
                        id: product.remain_id,  // ID товара
                        name: product.name,  // Название товара
                        price: product.price,  // Цена товара
                        quantity: product.count,  // Количество товара
                    }
                ]
            }
        }
        });
        this.busket_from_api({
            action: 'basket/get',
            id: router.currentRoute._value.params.id,
            warehouse: 'all'
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
    const data = { action: "basket/get", id: router.currentRoute._value.params.id };
	this.busket_from_api(data);
  },
  components: { Counter, Dialog, ActionModal },
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
            &:last-child{
                border-bottom: none;
            }
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
