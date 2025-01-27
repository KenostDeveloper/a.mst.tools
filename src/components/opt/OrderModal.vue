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
                            <h3 class="flex justify-content-space-between align-items-center">
                                <div>Адрес доставки: «{{ warehouse.store_data.name_short ? warehouse.store_data.name_short : warehouse.store_data.name }}», {{ warehouse.store_data.address_short  ? warehouse.store_data.address_short : warehouse.store_data.address }}</div>
                                <div>
                                    <button class="basketClear std-basket__clear-button" @click="() => {
                                        this.showClearBasketModal = true
                                        this.id_clear_org = org.org_data.id
                                    }"><span>Очистить</span> <i class="pi pi-times"></i></button>
                                </div>
                            </h3>
                            
                            <div class="k-order__shop mb-1">
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
                                            <p class="kenost-product-name" :data-id="item.id_remain">{{item.name}}</p>
                                            <div class="k-order__actions">
                                                <ActionModal :actions="item.action"/>
                                            </div>
                                            <div class="k-order__buttons">
                                                <b>{{(item.count * item.prices.price).toLocaleString('ru')}} ₽</b>
                                                <div class="k-order-count-change" @click="this.showChangedCount = true" v-if="(Number(item.available) - item.count) < 0">
                                                    <div class="k-order-count-change__cost">{{((Number(item.available) - item.count) * item.prices.price).toLocaleString('ru')}} ₽ ({{ Number(item.available) - item.count }} шт)</div>
                                                    <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M5.53125 0C8.56882 0 11.0312 2.46243 11.0312 5.5C11.0312 8.53757 8.56882 11 5.53125 11C2.49368 11 0.03125 8.53757 0.03125 5.5C0.03125 2.46243 2.49368 0 5.53125 0ZM5.53125 7.90625C5.24648 7.90625 5.01562 8.1371 5.01562 8.42188C5.01562 8.70665 5.24648 8.9375 5.53125 8.9375C5.81602 8.9375 6.04688 8.70665 6.04688 8.42188C6.04688 8.1371 5.81602 7.90625 5.53125 7.90625ZM5.53125 2.40625C4.58201 2.40625 3.8125 3.17576 3.8125 4.125C3.8125 4.31485 3.9664 4.46875 4.15625 4.46875C4.3461 4.46875 4.5 4.31485 4.5 4.125C4.5 3.55546 4.96171 3.09375 5.53125 3.09375C6.10079 3.09375 6.5625 3.55546 6.5625 4.125C6.5625 4.3789 6.47039 4.61712 6.30947 4.80182L6.23636 4.87759L6.15523 4.94614L5.98565 5.07288C5.89701 5.14242 5.81758 5.21345 5.74118 5.29487C5.38902 5.67014 5.1875 6.17922 5.1875 6.875C5.1875 7.06485 5.3414 7.21875 5.53125 7.21875C5.7211 7.21875 5.875 7.06485 5.875 6.875C5.875 6.35403 6.00993 6.01316 6.24251 5.76532L6.29439 5.71309L6.34982 5.66306L6.40999 5.6138L6.56021 5.50167L6.66652 5.41551C7.03333 5.09282 7.25 4.62659 7.25 4.125C7.25 3.17576 6.48049 2.40625 5.53125 2.40625Z" fill="#FF0000"/>
                                                    </svg>
                                                </div>
                                                <div :class="{'loading-counter': this.fetchIds.indexOf(item.key) != -1 }">
                                                    <Counter
                                                        @ElemCount="ElemCount"
                                                        :item="{basket, item}"
                                                        :min="0"
                                                        :max="item?.available"
                                                        :value="item?.count"
                                                        :id="item?.remain_id"
                                                        :step="item?.multiplicity ? item?.multiplicity : 1"
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
                                <div v-if="store?.complects" v-for="complect in store.complects" v-bind:key="complect.id" class="k-order__complects relative">
                                    <span class="complect-icon">Комплект</span>
                                    <button href="#" class="k-order__product-delete complect-delete" @click="clearBasketComplect(complect.products[0])">
                                        <img src="/images/icons/trash.svg" alt="">
                                    </button>
                                    
                                    <div class="k-order__complect-rows dart-align-items-center flex flex-col">
                                        <div class="k-order__complect" v-for="product in complect.products" v-bind:key="product.id">
                                            <!-- <pre>
                                                {{ product }}
                                            </pre> -->
                                            <div class="flex">
                                                <div class="">
                                                    <img class="k-order__product-img " :src="product.image" :alt="product.name">
                                                </div>
                                                <div class="">
                                                    <div class="k-order__product-info">
                                                        <div class="k-order__main-info">
                                                            <p>{{product.name}} </p>
                                                            <div class="k-order__actions center">
                                                                <!-- <div class="k-actions" v-for="(action, index) in product.actions" v-bind:key="action.id"> -->
                                                                <!-- <img :style="index > 2 ? { display: 'none' } : false" class="k-order__actions-el" :src="site_url_prefix + action.icon" > -->
                                                                <!-- <div v-if="action.conflicts.items[action.action_id]?.length" :style="index > 2 ? { display: 'none' } : false" class="k-err-icon"><i class="pi pi-info"></i></div> -->
                                                                <!-- </div> -->
                                                                <!-- <div v-if="item.actions.length > 3" class="k-order__actions-el last">+{{ item.actions.length - 3 }}</div> -->
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="k-order__product-data">
                                                        <span class="k-order__article">{{product.article}} x {{product.multiplicity * complect.count}} шт</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="k-order__complect-data">
                                                <div class="k-order__complect-data-items flex flex-col items-end">
                                                    <b>{{ (Number(product?.prices.price) * Number(product.multiplicity) * Number(complect?.count)).toLocaleString("ru") }} ₽</b>
                                                    <div :class="{'loading-counter': this.fetchIds.indexOf(product.key) != -1 }">
                                                        <Counter
                                                            @ElemCount="ElemComplectCount"
                                                            :item="product"
                                                            :min="0"
                                                            :step="Number(product.multiplicity)"
                                                            :max="complect?.remain * Number(product.multiplicity)"
                                                            :value="complect?.count * Number(product.multiplicity)"
                                                            :id="product?.id_remain"
                                                            :store_id="product?.store_id"
                                                        />
                                                    </div>
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
                                    <div class="a-dart-btn a-dart-btn-secondary" @click="generateXSLX(org.org_data.id, warehouse.store_data.id)">Скачать</div>
                                    <div class="a-dart-btn a-dart-btn-primary k-order__oplata" @click.prevent="() => {
                                        if (org?.cart_data?.not_available) {
                                            this.showChangedCount = true
                                            this.chowChangedId = org.org_data.id
                                        } else {
                                            orderSubmit(org.org_data.id);
                                        }
                                    }"><p>Отправить заказ</p> <p>{{ org.cart_data?.cost?.toLocaleString('ru') }} ₽</p></div>
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
                            <div @click="generateXSLXAll(this.basket.data[Object.keys(this.basket.data)[0]].store_data.id)" class="a-dart-btn a-dart-btn-secondary"><i class="pi pi-download"></i></div>
                            <div class="a-dart-btn a-dart-btn-primary k-order__oplata" @click.prevent="() => {
                                if (this.basket?.cart_data?.not_available) {
                                    this.showChangedCount = true;
                                    this.chowChangedId = 'all';
                                } else {
                                    orderSubmit('all');
                                }
                            }"><p>Отправить все заказы</p> <p>{{ this.basket?.cart_data?.cost?.toLocaleString('ru') }} ₽</p></div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    </div>

    <Dialog v-model:visible="this.showClearBasketModal" header="Вы точно хотите очистить корзину?" :style="{ width: '340px' }">
		<div class="std-clear-basket dart-mt-2">
			<!-- <img src="../../../public/img/opt/not-products.png" alt="" /> -->
			<button class="dart-btn dart-btn-primary" @click="() => {
				clearBasketOrg(this.id_clear_org)
				this.showClearBasketModal = false
				this.id_clear_org = null;
			}">Да</button>
			<button class="dart-btn dart-btn-secondary" @click="() => {
				this.showClearBasketModal = false
				this.id_clear_org = null;
			}">Нет</button>
		</div>
	</Dialog>

    <Dialog class="kenost-basket-change-modal" v-model:visible="this.showChangedCount" header=" " :style="{ width: '620px' }">
		<template #header>
            <div class="kenost-basket-change">
                <div class="kenost-basket-change__title">На складе не хватает товара</div>
            </div>
        </template>
        <div class="kenost-basket-change">
            <div class="kenost-basket-change__text">Пока вы формировали, заказ у поставщиков изменилось количество товаров на складе. Мы внесли изменения в ваш заказ в соответствии с остатками продукции на складах.</div>
            <div class="kenost-basket-change__alert">Вам нужно проверить заказ и занового его отправить.</div>
            <div class="kenost-basket-change__info">
                <div class="kenost-basket-change__h2">Нет на складе:</div>
                <div class="kenost-basket-change__products">
                    <div v-for="(warehouse, w_key) in this.basket.data" v-bind:key="warehouse.store_data.id">
                        <div v-for="(org, o_key) in warehouse.data" v-bind:key="org.org_data.id">
                            <div v-for="store in org.data" v-bind:key="store.warehouse_data.id">
                                <div v-for="(item, p_key) in store.data" v-bind:key="p_key">
                                    <div class="kenost-basket-change__product" v-if="(Number(item.available) - item.count) < 0">
                                        <div  class="kenost-basket-change__product-left">
                                            <img :src="item.image" alt="">
                                            <div class="kenost-basket-change__product-info">
                                                <div class="kenost-basket-change__product-name">{{item.name}}</div>
                                                <div class="kenost-basket-change__product-article">{{item.article}}</div>
                                            </div>
                                        </div>
                                        <div class="kenost-basket-change__product-right">
                                            Нет в наличии: <br>
                                            {{ item.available }} шт. <span>из {{ item.count }} шт</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="kenost-basket-change__buttons">
                    <div class="a-dart-btn a-dart-btn-primary a-dart-btn-primary-two" @click="this.showChangedCount = false">Проверить заказ</div>
                    <div class="a-dart-btn a-dart-btn-primary"  @click.prevent="() => {
                                orderSubmit(this.chowChangedId)
                                this.showChangedCount = false
                            }">Оформить с изменениями</div>
                </div>
            </div>
        </div>
	</Dialog>

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
      fetchIds: [],
      id_clear_org: null,
      showClearBasketModal: false,
      chowChangedId: 'all',
      showChangedCount: false
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
      this.loading = true
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
        }).then(() => this.loading = false)
      })
    },
    ElemCount(object) {
        if (!this.fetchIds.includes(object.item.item.key)) {
            this.fetchIds.push(object.item.item.key);
        }
        if (object.value == object.min) {
            this.clearBasketProduct(object.item.item.org_id, object.item.item.store_id, object.item.item.key, object.item.item)
            return;
        };
        if (object.value > Number(object.max)) {
            this.modal_remain = true;
            this.$emit("catalogUpdate");
            const data = {
                action: 'basket/update',
                id: router.currentRoute._value.params.id,
                org_id: object.item.item.org_id,
                store_id: object.item.item.store_id,
                id_remain: object.id,
                count: object.max,
                key: object.item.item.key,
                actions: object.item.item.actions
            };
            this.busket_from_api(data).then(() => {
                    this.busket_from_api({ 
                    action: 'basket/get',
                    id: router.currentRoute._value.params.id,
                    warehouse: 'all'
                }).then((res) => {
                    const index = this.fetchIds.indexOf(object.item.item.key);
                    if (index !== -1) {
                        this.fetchIds.splice(index, 1); // Удаляем один элемент по индексу
                    }
                });
            })
        } else {				
            this.$emit("catalogUpdate");
            const data = {
                action: 'basket/update',
                id: router.currentRoute._value.params.id,
                org_id: object.item.item.org_id,
                store_id: object.item.item.store_id,
                id_remain: object.id,
                count: object.value,
                key: object.item.item.key,
                actions: object.item.item.actions
            };
            this.busket_from_api(data).then((response) => {
                const datainfo = {
                    remain_id: object.id,
                    store_id: object.item.item.store_id,
                    count: object.value,
					key: object.item.item.key
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
                const index = this.fetchIds.indexOf(object.item.item.key);
                if (index !== -1) {
                    this.fetchIds.splice(index, 1); // Удаляем один элемент по индексу
                }
            });				
        }
    },
    ElemComplectCount(object) {
        if (!this.fetchIds.includes(object.item.key)) {
                this.fetchIds.push(object.item.key);
            }
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
						count: object.value / object.item.multiplicity,
						store_id: object.store_id,
						key: object.item.key,
						org_id: object.item.org_id,
						actions: object.item.actions
					}
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
					}).then((res) => {
						const index = this.fetchIds.indexOf(object.item.key);
						if (index !== -1) {
							this.fetchIds.splice(index, 1); // Удаляем один элемент по индексу
						}
					});	
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
        }).then(() => {
            const index = this.fetchIds.indexOf(product.key);
            if (index !== -1) {
                this.fetchIds.splice(index, 1); // Удаляем один элемент по индексу
            }
        })
    },
    clearBasketComplect(product) {
        this.$emit("catalogUpdate");
        this.$emit("actionUpdate");
        const data = {
            action: "basket/remove",
            id: router.currentRoute._value.params.id,
            key: product.key,
            store_id: product.store_id,
            org_id: product.org_id,
            id_complect: product.complect_id
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
            console.log('res file', res)
            var anchor = document.createElement('a');
            anchor.href = res.data.data;
            anchor.target="_blank";
            anchor.click();
        })
    },
    generateXSLXAll (warehouseId) {
        const data = {
            action: 'generate/xslx',
            id: router.currentRoute._value.params.id,
            warehouse_id: warehouseId
        }
      this.opt_api(data).then((res) => {
        var anchor = document.createElement('a');
        anchor.href = res.data.data;
        anchor.target="_blank";
        anchor.click();
      })
    },
    clearBasketOrg(id) {
        this.loading = true
        const data = {
            action: 'basket/clear',
            id: router.currentRoute._value.params.id,
            org_id: id
        }
        this.busket_from_api(data).then()
        this.busket_from_api({
            action: 'basket/get',
            id: router.currentRoute._value.params.id,
            warehouse: 'all'
        }).then(() => this.loading = false)
    },
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
    .kenost-product-name{
        width: 340px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        font-size: 14px;
        line-height: 18px;
    }

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
            // gap: 14px;
            
            &>*+*{
                margin-top: 14px;
            }
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
            overflow-x: hidden;
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
            &>*+*{
                margin-left: 12px;
            }
        }

        &__product-data{
            display: flex;
            align-items: center;
            &>*+*{
                margin-left: 16px !important;
            }
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
            padding: 35px 0 16px;
            border-bottom: 1px solid #E2E2E2;

            &>*+*{
                margin-left: 8px;
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
