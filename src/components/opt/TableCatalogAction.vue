<template>
    <div class="k-container">
        <table class="k-table" :style="{ marginLeft: this.marginValue + 'px' }">
            <thead>
                <tr>
                    <th class="k-table__name k-tablr-th-photo hidden-mobile-l">Фото</th>
                    <th class="k-table__name k-tablr-th-title">Наименование / Артикул</th>
                    <th class="k-table__name k-tablr-th-buttons hidden-mobile-l"><i class="d_icon d_icon-busket"></i></th>
                    <th class="k-table__name k-tablr-th-price">РРЦ</th>
                    <th class="k-table__name k-tablr-th-delivery hidden-mobile-l">Скидка %</th>
                    <th class="k-table__name k-tablr-th-action">Цена со скидкой за шт. (₽)</th>
                    <th class="k-table__name k-tablr-th-actions">Акции</th>
                    <th class="k-table__name k-tablr-th-remain hidden-mobile-l">Сумма (₽)</th>
                    <th class="k-table__name k-tablr-th-vendor">Кратность</th>
                    <th class="k-table__name k-tablr-th-retail hidden-mobile-l">Остатки на складе</th>
                </tr>
            </thead>
            <!-- Вывод комплектов -->
            <tbody
                class="complect-button kenost-table-background kenost-table-background-complect active bg-white"
                v-for="complect in items.complects"
                v-bind:key="complect.id"
                :class="{
                    active: this.active || this.is_warehouses || items.total_stores == 1,
                    'no-active': !this.active && !this.is_warehouses && items.total_stores > 1,
                    'bg-white': items.total_stores == 1
                }"
                v-if="complect?.remain?.min_count > 0">
                <!-- {{ complect.products }} -->
                <tr
                    v-for="(item, index) in complect.products"
                    v-bind:key="item.id" class="active">
                    <td class="k-table__photo">
                        <img class="k-table__image" :src="item.image" alt="" />
                    </td>
                    <td class="k-table__title">
                        <span class="complect-icon" v-if="index == 0">Комплект</span>
                        <p>{{ item.name }}</p>
                        <b>Арт: {{ item.article }}</b>
                    </td>
                    <td class="k-table__busket complect-button__td">
                        <!-- {{ item?.basket?.count }} -->
                        <form class="k-table__form" :class="{ 'basket-true': item?.basket?.availability }" action="">
                            <Counter @ElemCount="ElemCountComplect" :step="item.multiplicity" :min="1" :item="item" :max="item.remain.min_count * item.multiplicity" :id="item.complect_id" :store_id="complect.store_id" :index="index" :value="item?.basket?.count * item.multiplicity" />
                            <div @click="addBasketComplect(item.complect_id, item?.basket?.count, complect.store_id, index)" class="dart-btn dart-btn-primary">
                                <i class="d_icon d_icon-busket"></i>
                            </div>
                        </form>
                    </td>
                    <td >
                        {{ Math.round(Number(item.old_price)).toLocaleString('ru') }} ₽
                    </td>
                    <td >
                        {{ 
                            (Number(item.old_price) && Number(item.old_price) !== 0) 
                                ? ((Number(item.old_price) - Number(item.price)) / (Number(item.old_price) / 100)).toFixed(2).toLocaleString('ru') 
                                : '0'
                        }}
                    </td>
                    <td>
                        {{ Math.round(Number(item.price)).toLocaleString('ru') }} ₽
                    </td>
                    <td>
                        {{ item.actions }}
                    </td>
                    <td>
                        {{ Math.round(Number(item.price) * item.multiplicity).toLocaleString('ru') }} ₽
                    </td>
                    <td>
                        {{ Math.round(item.multiplicity).toLocaleString('ru') }} ₽
                    </td>
                    <td>
                        {{ Math.round(Number(item.remain.min_count * item.multiplicity)).toLocaleString('ru') }} шт
                    </td>
                    <!-- {{ console.log(complect.store_id) }}
                    {{console.log(item)}} -->
                </tr>
            </tbody>

            <tbody class="kenost-table-border-bottom" v-for="(product, index1) in items.products" v-bind:key="product.id">
                <!-- {{ console.log(item) }} -->
                <tr v-for="(item, index2) in product.stores" v-bind:key="item.id">
                    <td class="k-table__photo hidden-mobile-l">
                        <img class="k-table__image" :src="product.image" alt="" />
                    </td>
                    <td class="k-table__title">
                        <p>{{ item.name }}</p>
                        <b>Арт: {{ item.article }}</b>
                    </td>
                    <td class="k-table__busket">
                        <!-- <form class="k-table__form" action="" :class="{ 'basket-true': item?.basket?.availability }">
                            <Counter @ElemCount="ElemCount" :min="1" :max="item.max" :id="item.remain_id" :store_id="item.store_id" :item="item" :index="index" :value="Number(item?.basket?.count)" :step="item?.action?.multiplicity ? item?.action?.multiplicity : 1" />
                            <div @click="addBasket(item.remain_id, item?.action?.multiplicity > 1 ? item?.action?.multiplicity : item.basket.count, item.store_id, index, item)" class="dart-btn dart-btn-primary">
                                <i class="d_icon d_icon-busket"></i>
                            </div>
                        </form> -->
                        <form class="k-table__form" action="" :class="{ 'basket-true': item?.basket?.availability || this.add_basket.indexOf(item.key) != -1, 'loading-counter': this.fetchIds.indexOf(item.key) != -1 }">
                            <Counter
                                @ElemCount="ElemCount"
                                :min="product?.min_count ? product?.min_count : 1"
                                :max="product.max"
                                :id="product.remain_id"
                                :store_id="item.store_id"
                                :index="{index}"
                                :value="item?.basket?.count"
                                :step="product?.multiplicity ? product?.multiplicity : 1"
                                :item="{item: item, index1, index2}"
                            />
                            <div @click="addBasket(item, index1, index2)" class="dart-btn dart-btn-primary">
                                <i class="d_icon d_icon-busket"></i>
                            </div>
                        </form>
                    </td>
                    <td>
                        {{ Number(item.price) != 0 ? Math.round(Number(item.price)).toLocaleString('ru') : Math.round(Number(product.price)).toLocaleString('ru') }} ₽
                    </td>
                    <td>
                        {{ Number(item.price) != 0 ? Math.round((Number(product.price) - (Number(item.price))) / (Number(product.price) / 100)).toLocaleString('ru') : 0 }} %
                    </td>
                    <td>
                        {{ Math.round(item.price).toLocaleString('ru') }} ₽
                    </td>
                    <td>
                        <div class="table-actions">
                    <!-- 'red': action?.conflicts?.items[action.action_id]?.sales_conflicts -->
                    <div :data-test="action?.tags?.length != 0" class="table-actions__action" :class="{active: action.enabled}" v-for="(action, indexactions) in item.actions" v-bind:key="action.action_id" :data-id="action?.action_id">
                        <div v-if="action?.tags?.length != 0"  class="table-actions__container">
                            <!-- {{ action }} -->
                            <div class="table-actions__el" v-for="(tag, indextag) in action.tags" v-bind:key="tag.id">
                                <img v-if="tag.type == 'multiplicity'" :src="action.enabled
                                    ? '/images/icons/action/gray/box.svg' : '/images/icons/action/black/box.svg'
                                    " alt="" />
                                <p v-if="tag.type == 'multiplicity'">{{ tag.value }} шт.</p>

                                <img v-if="tag.type == 'min'" :src="action.enabled
                                    ? '/images/icons/action/gray/min.svg' : '/images/icons/action/black/min.svg'
                                    " alt="" />

                                <img v-if="tag.type == 'gift'" :src="action.enabled
                                    ? '/images/icons/action/gray/gift.svg' : '/images/icons/action/black/gift.svg'
                                    " alt="" />

                                <img v-if="tag.type == 'delay'" :src="action.enabled
                                    ? '/images/icons/action/gray/time.svg' : '/images/icons/action/black/time.svg'
                                    " alt="" />
                                <p v-if="tag.type == 'delay'">Отсроч. {{ tag.value }} дн.</p>

                                <img v-if="tag.type == 'sale' && tag.value > 0" :src="action.enabled
                                    ? '/images/icons/action/gray/sale.svg' : '/images/icons/action/black/sale.svg'
                                    " alt="" />
                                <p v-if="tag.type == 'sale' && tag.value > 0">Скидка {{ Number(tag.value).toFixed(0) }}%</p>

                                <img v-if="tag.type == 'free_delivery'" :src="action.enabled
                                    ? '/images/icons/action/gray/delivery.svg' : '/images/icons/action/black/delivery.svg'
                                    " alt="" />

                            </div>

                        </div>
                        <div v-if="action?.tags?.length > 0" class="table-actions__help" :data-id="action?.action_id">
                            <p :class="{
                                active: action.enabled
                            }">
                                ?
                            </p>
                            <ActionModal :action="action"/>
                        </div>
                    </div>
                </div>
                    </td>
                    <td>
                        {{ (Number(product.multiplicity) * Number(item.price)).toLocaleString('ru') }} ₽
                    </td>
                    <td>
                        {{ item.multiplicity }}
                    </td>
                    <td>{{ item.available }} шт.</td>
                </tr>
            </tbody>
            <!-- </tbody> -->
        </table>
    </div>
    <Dialog v-model:visible="this.modal_remain" header=" " :style="{ width: '340px' }">
        <div class="kenost-not-produc">
            <img src="/images/icons_milen/outOfStock2.png" alt="">
            <b>У нас нет столько товаров :(</b>
            <p>Извините, но количество данного товара ограничено</p>
            <div class="a-dart-btn a-dart-btn-primary" @click="this.modal_remain = false">Понятно</div>
        </div>
    </Dialog>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
// import TableCatalogActionRow from './TableCatalogActionRow.vue'
import Dialog from 'primevue/dialog'
// import InputSwitch from 'primevue/inputswitch'
import Counter from './Counter.vue';
import router from '../../router';
import ActionModal from '../../components/opt/ActionModal.vue'

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
    data() {
        return {
            loading: true,
            interval: null,
            marginValue: 1,
            modal_actions: false,
            actions_item: null,
            value: 1,
            modal_remain: false,
            timeOut: null,
            fetchIds: [],
            add_basket: [],
        };
    },
    methods: {
        ...mapActions(['opt_api', 'busket_from_api']),
        ...mapMutations(['SET_OPT_PRODUCT_TO_VUEX', 'SET_SALES_COMPLECT_MUTATION_TO_VUEX', 'SET_OPT_COMPLECT_MUTATION_TO_VUEX']),
        updateBasket() {
            this.$emit('updateBasket');
        },
        addBasket(item, index1, index2) {
            console.log('addBasket', item)
            if (!this.add_basket.includes(item.key)) {
                this.add_basket.push(item.key);
            }
            const data = {
                action: 'basket/add',
                id: router.currentRoute._value.params.id,
                org_id: item.org_id,
                store_id: item.store_id,
                id_remain: item.id,
                count: item.basket.count,
                actions: item.actions
            };
            this.busket_from_api(data).then(() => {
                this.busket_from_api({
                    action: 'basket/get',
                    id: router.currentRoute._value.params.id,
                    warehouse: 'all'
                }).then(() => {
                    setTimeout(() => {
                        const index = this.add_basket.indexOf(item.key);
                        if (index !== -1) {
                            this.add_basket.splice(index, 1); // Удаляем один элемент по индексу
                        }
                    }, 1000)
                });
            });

            // Убедитесь, что dataLayer существует
            window.dataLayer = window.dataLayer || [];

            // Отправка данных в dataLayer
            window.dataLayer.push({
            ecommerce: {
                currencyCode: "RUB",  // Валюта
                add: {
                products: [
                    {
                        id: item.id,  // ID товара
                        name: item.name,  // Название товара
                        price: item.price,  // Цена товара
                        category: item.catalog,  // Категория товара
                        quantity: item.basket.count,  // Количество товара
                    }
                ]
                }
            }
            });
            // eslint-disable-next-line vue/no-mutating-props
            this.items.products[index1].stores[index2].basket.availability = true;
            this.$emit('updateBasket');
        },
        addBasketComplect(complectid, value, storeid, index) {
			const data = {
				action: "basket/add",
				id: router.currentRoute._value.params.id,
				id_complect: complectid,
				value,
				store_id: storeid,
			};
			this.busket_from_api(data).then(() => {
				this.busket_from_api({
					action: "basket/get",
					id: router.currentRoute._value.params.id,
					warehouse: "all",
				});
			});
			// eslint-disable-next-line vue/no-mutating-props
            for(let i = 0; i < this.items.complects[complectid].products.length; i++){
                this.items.complects[complectid].products[i].basket.availability = true;
            }
			// this.items.complects[index][0].basket.availability = true;
			this.$emit("updateBasket");
		},
        getMinDelivery(stores) {
			// console.log(stores)

            let minDelivery;
            let minDeliveryDate;

            for (let i = 0; i < stores.length; i++) {
                if (i === 0) {
                    // eslint-disable-next-line no-unused-vars
                    minDelivery = stores[i].delivery;
                    minDeliveryDate = stores[i].delivery_day;
                } else if (stores[i].delivery < minDelivery) {
                    minDelivery = stores[i].delivery;
                    minDeliveryDate = stores[i].delivery_day;
                }
            }

            return {
                delivery: minDelivery,
                delivery_day: minDeliveryDate
            };
        },
        clearBasketProduct(org_id, store_id, key, product, index1, index2, mult) {
            console.log(org_id, store_id, key, product, index1, index2, mult)
			const data = {
				action: "basket/remove",
				id: router.currentRoute._value.params.id,
				org_id: org_id,
				store_id: store_id,
				key: key,
				product: product
			};
			this.busket_from_api(data).then((response) => {});
			window.dataLayer = window.dataLayer || [];
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

            this.items.products[index1].stores[index2].basket.availability = false;
            this.items.products[index1].stores[index2].basket.count = mult
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
        ElemCount(object) {
            // console.log(object)
            if (!this.fetchIds.includes(object.item.item.key)) {
                this.fetchIds.push(object.item.item.key);
            }
            if (object.value <= object.min) {
                this.clearBasketProduct(object.item.item.org_id, object.item.item.store_id, object.item.item.key, object.item.item, object.item.index1, object.item.index2, object.item.item.multiplicity)
                this.items.products[object.item.index1].stores[object.item.index2].basket.count = object.item.item.multiplicity;
                return;
            } else {
                this.items.products[object.item.index1].stores[object.item.index2].basket.count = object.value;
            }; 
            const data = {
                action: 'basket/update',
                id: router.currentRoute._value.params.id,
                org_id: object.item.item.org_id,
                store_id: object.item.item.store_id,
                remain_id: object.id,
                value: object.value,
                key: object.item.item.basket.key,
                actions: object.item.item.basket.ids_actions
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
            });
            if(Number(object.value) != object.old_value){
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                    ecommerce: {
                        currencyCode: "RUB",
                        add: {
                        products: [
                            {
                                id: object.item.item.id,
                                name: object.item.item.name,
                                price: object.item.item.price,
                                category: object.item.item.catalog,
                                quantity: object.value
                            }
                        ]
                        }
                    }
                });
            }        
            this.$emit('updateBasket');
        },
        ElemCountComplect(object) {
            // console.log(object)
            if (object.value == object.min) {
                this.clearBasketComplect(object.store_id, object.id)
                return;
            }

            if (object.value > Number(object.max)) {
                this.modal_remain = true;
                // console.log(this.modal_remain)
            } else {
                // eslint-disable-next-line vue/no-mutating-props

                if(this.timeOut){
                    clearTimeout(this.timeOut);
                }

                this.timeOut = setTimeout(() => {
                    // Ваш запрос на сервер
                    this.$emit("catalogUpdate");
                    const data = {
                        action: 'basket/update',
                        id: router.currentRoute._value.params.id,
                        id_complect: object.id,
                        value: object.value / Number(object.item.multiplicity),
                        store_id: object.store_id
                    };
                    // console.log(data)
                    this.busket_from_api(data).then((response) => {
                        const datainfo = {
                            complect_id: object.id,
                            store_id: object.store_id,
                            count: object.value / Number(object.item.multiplicity),
                        };
                        // this.$store.commit("SET_OPT_COMPLECT_MUTATION_TO_VUEX", datainfo);
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
        leftScroll(event) {
            clearInterval(this.interval);
            if (event === 'start') {
                this.interval = window.setInterval(() => {
                    if (this.marginValue < 0) {
                        this.marginValue = this.marginValue + 50;
                    } else {
                        this.marginValue = 0;
                    }
                }, 50);
            }
        },
        rigthScroll(event) {
            clearInterval(this.interval);
            if (event === 'start') {
                const widthTable = document.querySelector('.k-container').offsetWidth;
                this.interval = window.setInterval(() => {
                    if ((1500 - widthTable) * -1 < this.marginValue) {
                        this.marginValue = this.marginValue - 50;
                    } else {
                        this.marginValue = (1500 - widthTable) * -1;
                    }
                }, 50);
            }
        },
        ElemAction(obj) {
            this.actions_item = obj;
            // console.log(obj)
            this.modal_actions = true;
        }
    },
    mounted() {},
    components: { Counter, Dialog, ActionModal },
    computed: {
        ...mapGetters(['basket'])
    }
};
</script>
<style lang="scss">
.kenost-table-background:hover {
    .k-table__form {
        opacity: 1;
    }
}

.no-line {
    border-bottom: none !important;
}

.kenost-conflict {
    display: flex;
    align-items: center;
    gap: 16px;
    justify-content: flex-end;
    position: relative;

    &__icon {
        width: 20px;
        height: 20px;
        background: #fb203a;
        border-radius: 3px;
        rotate: 45deg;
        display: flex;
        align-items: center;
        justify-content: center;

        i {
            color: #fff;
            font-size: 12px;
            rotate: 135deg;
            position: relative;

            &::before {
                position: relative;
                top: 1px;
            }
        }

        &.none {
            visibility: hidden;
        }
    }

    &__container {
        &:hover {
            .kenost-conflict__message {
                opacity: 1;
                pointer-events: all;
            }
        }
    }

    &__message {
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

        &::before {
            width: 20px;
            height: 20px;
            border-radius: 5px;
            position: absolute;
            content: '';
            rotate: 45deg;
            top: -7px;
            right: 63px;
            background: #282828;
        }

        p {
            margin: 0;
            font-size: 12px;
            color: #fff;

            span {
                text-decoration: underline;
            }
        }
    }
}

.kenost-conflict {
    .p-inputswitch.p-highlight .p-inputswitch-slider {
        background: #ff0000 !important;

        &::before {
            left: 0.4rem !important;
        }
    }
}

.pointer-none {
    pointer-events: none;
}

.kenost-actions-modal {
    width: 1400px;

    &__actions {
        display: flex;
    }

    &__th {
        &-action {
            width: 390px;
        }
        &-desc {
            width: 350px;
        }
        &-info {
            width: 400px;
        }
    }

    &__center {
        text-align: center;
        padding: 16px 10px !important;
    }

    &__table {
        width: 100%;

        th {
            text-align: center;
            padding: 16px 0;
        }

        td {
            padding: 16px 0;
            border-top: 1px solid #e2e2e2;
        }
    }

    &__action {
        display: flex;

        img {
            width: 110px !important;
            height: 56px !important;
            object-fit: contain;
        }

        p {
            font-size: 14px;
            color: #282828;
        }
    }
}

.scrollLegt {
    height: 100%;
    width: 70px;
    background: transparent;
    position: absolute;
    z-index: 2;
}

.scrollRight {
    height: 100%;
    width: 70px;
    background: transparent;
    position: absolute;
    right: 0;
    z-index: 2;
}

// .k-container{
//   width: 100%;
//   overflow-x: auto;
//   position: relative;

//   &::-webkit-scrollbar {
//     width: 8px;
//     height: 8px;
//     background-color: #e0e0e0; /* blue */
//     border-radius: 9em;
//   }

//   &::-webkit-scrollbar-thumb {
//       background-color: #b4b4b4; /* green */
//       border-radius: 9em;
//   }
// }

.event-none {
    pointer-events: none;
}
</style>
