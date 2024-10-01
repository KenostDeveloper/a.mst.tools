<template>
    <div class="k-container">
        <table class="k-table" :style="{ marginLeft: this.marginValue + 'px' }">
            <thead>
                <tr>
                    <th class="k-table__name k-tablr-th-photo hidden-mobile-l">Фото</th>
                    <th class="k-table__name k-tablr-th-title">Наименование / Артикул</th>
                    <th class="k-table__name k-tablr-th-buttons hidden-mobile-l"><i class="d_icon d_icon-busket"></i></th>
                    <th class="k-table__name k-tablr-th-price">РЦЦ</th>
                    <th class="k-table__name k-tablr-th-delivery hidden-mobile-l">Скидка %</th>
                    <th class="k-table__name k-tablr-th-action">Цена со скидкой за шт. (₽)</th>
                    <th class="k-table__name k-tablr-th-remain hidden-mobile-l">Сумма (₽)</th>
                    <th class="k-table__name k-tablr-th-vendor">Кратность</th>
                    <th class="k-table__name k-tablr-th-retail hidden-mobile-l">Остатки на складе</th>
                </tr>
            </thead>
            <!-- Комплекты -->
            <!-- <tbody class="complect-button kenost-table-background kenost-table-background-complect" v-for="complect in items.complects" v-bind:key="complect.id">
                <tr v-for="(item, index) in complect.products" v-bind:key="item.id" class="no-line">
                    <td>
                        <span class="k-table__article">{{ item.article }}</span>
                    </td>
                    <td class="k-table__photo">
                        <img class="k-table__image" :src="item.image" alt="" />
                        <div v-if="index < complect.products.length - 1" class="kenost-complect-icon">
                            <i class="mst-icon mst-icon-link"></i>
                        </div>
                    </td>
                    <td class="k-table__title" @click="openActions(item)">
                        <p>{{ item.name }}</p>
                    </td>
                    <td class="k-table__busket complect-button__td" :class="{ 'pointer-none': index !== 0 }">
                        <form class="k-table__form complect-button__form" action="" v-if="index === 0" :class="{ 'basket-true': item.basket.availability }">
                            <Counter :key="new Date().getMilliseconds() + item.id" @ElemCount="ElemCountComplect" :min="1" :id="item.complect_id" :store_id="items.store_id" :index="item.complect_id" :max="item.remain.min_count" :value="item.basket.count" />
                            <div @click="addBasketComplect(item.complect_id, item.basket.count, items.store_id, index)" class="dart-btn dart-btn-primary">
                                <i class="d_icon d_icon-busket"></i>
                            </div>
                        </form>
                    </td>
                    <td>{{ Math.round(item.old_price).toLocaleString('ru') }} ₽</td>
                    <td>{{ item.new_price / 100 == 0 ? '100.00' : ((item.old_price - item.new_price) / (item.old_price / 100)).toFixed(2) }}</td>
                    <td>{{ Math.round(item.new_price).toLocaleString('ru') }} ₽</td>
                    <td>{{ item.multiplicity }}</td>
                    <td>{{ (Math.round(item.new_price) * item.multiplicity * item.basket.count).toLocaleString('ru') }} ₽</td>
                    <td class="td-center">
                        <span v-if="index === 0" :style="'top:' + (complect.products.length * 70) / 2 + 'px'">{{ complect.remain.min_count }} шт</span>
                    </td>
                </tr>
            </tbody> -->

            <tr class="kenost-table-background" v-for="item in items.products" v-bind:key="item.id">
                {{ console.log(item) }}
                <td class="k-table__photo hidden-mobile-l">
                    <img class="k-table__image" :src="item.image" alt="" />
                </td>
                <td class="k-table__title">
                    <p>{{ item.name }}</p>
                    <b>Арт: {{ item.article }}</b>
                </td>
                <td class="k-table__busket">
                    <form class="k-table__form" action="" :class="{ 'basket-true': item?.basket?.availability }">
                        <Counter :item="item" :key="new Date().getMilliseconds() + item.id" @ElemCount="ElemCount" :min="1" :max="item.max" :id="item.remain_id" :store_id="item.store_id" :index="index" :value="item?.basket?.count" :step="item?.action?.multiplicity ? item?.action?.multiplicity : 1" />
                        <div @click="addBasket(item.remain_id, item?.action?.multiplicity > 1 ? item?.action?.multiplicity : item.basket.count, item.store_id, index)" class="dart-btn dart-btn-primary">
                            <i class="d_icon d_icon-busket"></i>
                        </div>
                    </form>
                </td>
                <td>
                    {{ Math.round(item.price).toLocaleString('ru') }} ₽
                </td>
                <td>
                    {{ Math.round((Number(item.old_price) - (Number(item.new_price))) / (Number(item.old_price) / 100)).toLocaleString('ru') }} %
                </td>
                <td>
                    {{ Math.round(item.new_price).toLocaleString('ru') }} ₽
                </td>
                <td>
                    {{ (Number(item.multiplicity) * Number(item.new_price)).toLocaleString('ru') }} ₽
                </td>
                <td>
                    {{ item.multiplicity }}
                </td>
                <td>{{ item.remain.remains }} шт.</td>
                
            </tr>
            <!-- </tbody> -->
        </table>
    </div>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
// import TableCatalogActionRow from './TableCatalogActionRow.vue'
// import Dialog from 'primevue/dialog'
// import InputSwitch from 'primevue/inputswitch'
import Counter from './Counter.vue';
import router from '../../router';

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
            value: 1
        };
    },
    methods: {
        ...mapActions(['opt_api', 'busket_from_api']),
        ...mapMutations(['SET_OPT_PRODUCT_TO_VUEX']),
        updateBasket() {
            this.$emit('updateBasket');
        },
        addBasket(id, value, storeid, index) {
            const data = { action: 'basket/add', id: router.currentRoute._value.params.id, id_remain: id, value, store_id: storeid };
            this.busket_from_api(data).then();
            console.log(this.items.products[id]);
            // eslint-disable-next-line vue/no-mutating-props
            this.items.products[id].basket.availability = true;
            this.$emit('updateBasket');
            this.busket_from_api({
                action: 'basket/get',
                id: router.currentRoute._value.params.id,
                warehouse: 'all'
            });
        },
        getMinDelivery(stores) {
			console.log(stores)

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
        addBasketComplect(complectid, value, storeid, index) {
            const data = { action: 'basket/add', id: router.currentRoute._value.params.id, id_complect: complectid, value, store_id: storeid };
            this.busket_from_api(data).then();
            // eslint-disable-next-line vue/no-mutating-props
            this.items.complects[complectid].products[0].basket.availability = true;
            this.$emit('updateBasket');
            this.busket_from_api({
                action: 'basket/get',
                id: router.currentRoute._value.params.id,
                warehouse: 'all'
            });
        },
        ElemCount(object) {
            if (object.value > Number(object.max)) {
                this.modal_remain = true;
            } else {
                // eslint-disable-next-line vue/no-mutating-props
                this.items.products[object.id].basket.count = object.value;
                const data = {
                    action: 'basket/update',
                    id: router.currentRoute._value.params.id,
                    id_remain: object.id,
                    value: object.value,
                    store_id: object.store_id,
                    actions: object.item.actions_ids
                };
                this.busket_from_api(data).then();
                this.$emit('updateBasket');
            }
        },
        ElemCountComplect(object) {
            if (object.value > Number(object.max)) {
                this.modal_remain = true;
                console.log(this.modal_remain);
            } else {
                // eslint-disable-next-line vue/no-mutating-props
                this.items.complects[object.id].products[0].basket.count = object.value;
                const data = { action: 'basket/update', id: router.currentRoute._value.params.id, id_complect: object.id, value: object.value, store_id: object.store_id };
                this.busket_from_api(data).then();
                this.$emit('updateBasket');
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
        },
        async updateAction(remainid, storeid, action, indexstore, indexaction, conflicts) {
            // console.log("updateAction", remainid, storeid, action, index)
            // console.log(this.items.stores[index].actions)

            this.items.stores[indexstore].actions[indexaction].enabled = true;

            // console.log(conflicts)
            // Выключаем конфликтные акции

            // const conflicts = this.items.stores[indexstore].actions.find((act) => act.action_id === action.action_id)
            // console.log(conflicts)
            if (conflicts.items[action.action_id]) {
                if (conflicts.items[action.action_id]?.postponement_conflicts) {
                    for (let i = 0; i < conflicts.items[action.action_id].postponement_conflicts.length; i++) {
                        for (let j = 0; j < Object.keys(this.this.items.stores[indexstore].actions).length; j++) {
                            if (conflicts.items[action.action_id].postponement_conflicts[i] === this.items.stores[indexstore].actions[j].action_id) {
                                if (this.this.items.stores[indexstore].actions[j].enabled) {
                                    // console.log('this.items.stores[indexstore].actions', this.this.items.stores[indexstore].actions[j])
                                    this.items.stores[indexstore].actions[j].enabled = false;
                                    //this.items.stores[indexstore].actions[indexaction].enabled = false
                                    const data = {
                                        action: 'action/user/off/on',
                                        remain_id: this.items.stores[indexstore].actions[j].remain_id ? this.items.stores[indexstore].actions[j].remain_id : conflicts.remain_id,
                                        store_id: this.items.stores[indexstore].actions[j].store_id ? this.items.stores[indexstore].actions[j].store_id : conflicts.store_id,
                                        action_id: this.items.stores[indexstore].actions[j].action_id,
                                        status: false,
                                        test: 'true2'
                                    };
                                    this.opt_api(data);
                                }
                            }
                        }
                    }
                }

                if (conflicts.items[action.action_id].sales_conflicts) {
                    for (let i = 0; i < conflicts.items[action.action_id].sales_conflicts.length; i++) {
                        for (let j = 0; j < Object.keys(this.items.stores[indexstore].actions).length; j++) {
                            if (conflicts.items[action.action_id].sales_conflicts[i] === this.items.stores[indexstore].actions[j].action_id) {
                                if (this.items.stores[indexstore].actions[j].enabled) {
                                    // console.log('this.items.stores[indexstore].actions', this.items.stores[indexstore].actions[j])
                                    this.items.stores[indexstore].actions[j].enabled = false;
                                    //this.items.stores[indexstore].actions[indexaction].enabled = false
                                    //console.log(this.items.stores[indexstore].actions[indexaction])
                                    const data = {
                                        action: 'action/user/off/on',
                                        remain_id: this.items.stores[indexstore].actions[j].remain_id ? this.items.stores[indexstore].actions[j].remain_id : conflicts.remain_id,
                                        store_id: this.items.stores[indexstore].actions[j].store_id ? this.items.stores[indexstore].actions[j].store_id : conflicts.store_id,
                                        action_id: this.items.stores[indexstore].actions[j].action_id,
                                        status: false,
                                        test: 'true2'
                                    };
                                    this.opt_api(data);
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
                action_id: action.action_id,
                status: action.enabled,
                test: 'true3'
            };
            this.opt_api(data).then(() => {
                const dataUpdate = {
                    action: 'get/info/product',
                    store_id: storeid,
                    remain_id: remainid,
                    id: router.currentRoute._value.params.id,
                    count: this.items.stores[indexstore].basket.count
                };

                this.opt_api(dataUpdate).then((response) => {
                    // console.log("response", response)
                    const data = {
                        remain_id: remainid,
                        store_id: storeid,
                        data: response.data.data
                    };
                    this.$store.commit('SET_OPT_PRODUCT_TO_VUEX', data);
                });
            });
        }
    },
    mounted() {},
    components: { Counter },
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
