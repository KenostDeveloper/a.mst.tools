<template>
    <tbody :class="{ 'active-catalog-group': this.active, 'no-active-catalog-group': !this.active }">
        <tr v-if="!this.is_warehouses && items?.total_stores > 1" @click="this.active = !this.active"
            :class="{ 'active-el': this.active, 'no-active-el': !this.active }">
            <td class="hidden-mobile-l"><i class="pi pi-angle-up"></i></td>
            <td class="k-table__title">
                <p>{{ items.pagetitle }}</p>
                <b>Арт: {{ items.article }}</b>
            </td>
            <td class="k-table__сhange-remain">
                <Chart type="line" :data="items.remains_history" :options="chart_options" style="width: 200px;" v-if="items.total_stores > 1 && items.remains_history"/>
            </td>
            <td class="k-table__remain-speed">
                {{ items.our_available }} / {{ items.our_purchase_speed }}
            </td>
            <td class="k-table__prognoz">
                {{ items.our_forecast }}
            </td>
            <td class="k-table__busket hidden-mobile-l">
                <form class="k-table__form event-none" action="">
                    <Counter :min="0" :max="100" :value="0" />
                    <button class="dart-btn dart-btn-primary">
                        <i class="d_icon d_icon-busket"></i>
                    </button>
                </form>
            </td>
            <td>
                <div class="" v-if="Math.round(getMinPrice(items.stores)) > 0">
                    от
                    {{ Math.round(getMinPrice(items.stores)).toLocaleString('ru') }} ₽
                </div>            
            </td>
            <td class="hidden-mobile-l"></td>
            <td>
                <div v-if="Math.round(getMinPrice(items.stores)) > 0">
                    ~ {{ getMinDelivery(items.stores).delivery }} дней ({{
                        new Date(getMinDelivery(items.stores).delivery_day).toLocaleString('ru', {
                            month: '2-digit',
                            day: '2-digit',
                            year: '2-digit'
                        })
                    }})
                </div>
                </td>
            <td class="hidden-mobile-l"></td>
            <td>{{ items.total_stores }}</td>
            <!-- <td class="hidden-mobile-l"></td> -->
        </tr>
        <tr :data-info="JSON.stringify({id: item.remain_id, name: item.name, price: item.price, category: item.catalog, list: 'Catalog'})" :data-product="item.remain_id" class="kenost-product-item kenost-table-background" v-for="(item, index) in items.stores"
            v-bind:key="item.id" :class="{
                active: this.active || this.is_warehouses || items.total_stores == 1,
                notavailable: item.available == 0 || item.price == 0,
                'no-active': !this.active && !this.is_warehouses && items.total_stores > 1,
                'bg-white': items.total_stores == 1
            }">
            <td class="hidden-mobile-l">
                <i v-if="items.total_stores > 1" class="pi pi-minus"></i>
            </td>
            <!-- <td class="k-table__photo hidden-mobile-l">
                <img class="k-table__image" :src="items.image" alt="" />
            </td> -->
            <td class="k-table__title" @click="() => {
                if(items.our_id != 0){
                    this.modal_info = true
                    this.modal_info_data = items
                }
            }">
                <p class="cursor-pointer">{{ item.name }}</p>
                <b class="cursor-pointer">Арт: {{ item.article }}</b>
            </td>
            <td class="k-table__сhange-remain">
                <Chart type="line" :data="items.remains_history" :options="chart_options" style="width: 200px;" v-if="items.total_stores == 1 && items.remains_history"/>
            </td>
            <td class="k-table__remain-speed">
                {{ items.our_available }} / {{ items.our_purchase_speed }}
            </td>
            <td class="k-table__prognoz">
                {{ items.our_forecast }}
            </td>
            <td class="k-table__busket">
                <!-- {{ item.min }} -->
                <!-- {{ this.fetchIds.indexOf(item.remain_id) != -1 ? "Загрузка..." : "" }} -->
                <form class="k-table__form" action="" :class="{ 'basket-true': item?.basket?.availability || this.add_basket.indexOf(item.key) != -1, 'loading-counter': this.fetchIds.indexOf(item.key) != -1 }">
                    <Counter
                        @ElemCount="ElemCount"
                        :min="0"
                        :max="item.max"
                        :id="item.remain_id"
                        :store_id="item.store_id"
                        :index="index"
                        :value="item?.basket?.count"
                        :step="item?.multiplicity ? item?.multiplicity : 1"
                        :item="item"
                    />
                    <div @click="addBasket(item, index)" class="dart-btn dart-btn-primary">
                        <i class="d_icon d_icon-busket"></i>
                    </div>
                </form>
            </td>
            <td>
                <div class="kenost-product-item__price-info">
                    <div :class="{'flex align-items-center justify-content-center gap-1': item.min_price.price && item.actions}">
                        {{ Math.round(item.price).toLocaleString('ru') }} ₽ 
                        <div v-if="item.min_price.price && item.actions" class="kenost-min-price" v-tooltip="{ value: 'Минимальная цена при выполнении условий акций', showDelay: 0, hideDelay: 0 }">
                            {{ Math.round(item.min_price.price).toLocaleString('ru') }} ₽
                        </div>
                    </div>
                    {{ item.delay ? Number(item.delay).toFixed(1) + ' дн' : 'Предоплата' }}
                </div>
            </td>
            <td>
                <ActionModal :actions="item.actions"/>
            </td>
            <td>
                <div class="kenost-product-item__delivery">
                    {{ item.payer === '1' ? 'Поставщик' : 'Покупатель' }} / <br />
                    ~ {{ item.delivery }} дней ({{
                        new Date(item.delivery_day).toLocaleString('ru', {
                            month: '2-digit',
                            day: '2-digit',
                            year: '2-digit'
                        })
                    }})
                </div>
            </td>
            <td>
                <div v-if="item.available > 0">
                    <div v-if="item.price > 0">
                        <span v-if="item.remains_abstract != item.available">
                            {{ item.remains_abstract }}
                        </span>
                        <span v-else>
                            {{ item.available }} шт.
                        </span>                        
                        <div v-if="item.requirement">
                            <div v-if="Number(item.requirement.count) > Number(item.available)" class="kenost-table-elem__adding_info">
                                <span class="kenost-err-min">Не хватает {{ Number(item.requirement.count) - Number(item.available) }} шт.</span>
                                <span>{{this.namePathIsNav == 'purchases_offer'? 'Матрица' : 'Потребность'}} {{ Number(item.requirement.count) }} шт.</span>
                            </div>
                            <div v-else class="kenost-table-elem__adding_info">
                                <span>{{this.namePathIsNav == 'purchases_offer'? 'Матрица' : 'Потребность'}} {{ Number(item.requirement.count) }} шт.</span>
                            </div>
                        </div>
                    </div>
                    <div v-else class="kenost-err-min">Некорректно указана цена у Поставщика</div>           
                </div>
                <div v-else>
                    <span class="kenost-err-min">Нет в наличии</span>
                </div>
            </td>
            <td>
                <span class="flex align-items-center justify-content-center gap-1 mb-1"><img :src="item.store_image"
                        class="kenost-table-elem__logo" alt="" /> {{ item.store_name }}</span>
                {{ item.store_city }}
            </td>
            <!-- <td>
                <div class="kenost-product-item__profit_info" v-if="item.prices.rrc > 0 && item.prices.rrc != item.price">
                    {{ Math.round(item.prices.rrc).toLocaleString('ru') }} ₽ <br />
                    {{ (item.prices.rrc - item.price).toFixed(0).toLocaleString('ru') }}
                    ₽
                </div>
                <div class="kenost-product-item__profit_info" v-else>
                    {{ Math.round(item.price).toLocaleString('ru') }} ₽
                </div>
            </td> -->
        </tr>
    </tbody>
    <!-- Вывод комплектов -->
    <!-- <tbody class="complect-button kenost-table-background kenost-table-background-complect active-catalog-group"
        v-for="complect in items.complects" v-bind:key="complect.id" :class="{
            active: this.active || this.is_warehouses || items.total_stores == 1,
            'no-active': !this.active && !this.is_warehouses && items.total_stores > 1,
            'bg-white': items.total_stores == 1
        }">

        <tr v-for="(item, index) in complect.products" v-bind:key="item.id" :class="{
            active: this.active || this.is_warehouses || items.total_stores == 1,
            'kenost-table-bg-complect': items.total_stores == 1,
            'no-active': !this.active && !this.is_warehouses && items.total_stores > 1
        }">
            <td class="td-center" :class="{ 'pointer-none': index !== 0 }">
                <span :style="'top:' + (complect.length * 74) / 2 + 'px'" v-if="index === 0"><i class="pi pi-minus"></i></span>
            </td>
            <td class="k-table__photo">
                <img class="k-table__image" :src="item.image" alt="" />
                <div class="kenost-complect-icon" v-if="index < complect.length - 1">
                </div>
            </td>
            <td class="k-table__title">
                <span class="complect-icon" v-if="index == 0">Комплект</span>
                <p>{{ item.pagetitle }}</p>
                <b>Арт: {{ item.article }}</b>
            </td>
            <td class="k-table__busket complect-button__td">
                <form class="k-table__form" :class="{ 'basket-true': complect?.basket?.availability || this.add_basket.indexOf(item.key) != -1, 'loading-counter': this.fetchIds.indexOf(item.key) != -1 }" action="">
                    <Counter
                        @ElemCount="ElemCountComplect"
                        :step="item.multiplicity"
                        :min="0"
                        :item="{item: item, basket: complect?.basket}"
                        :max="item.remain * item.multiplicity"
                        :id="item.complect_id"
                        :store_id="item.store_id"
                        :index="index"
                        :value="complect?.basket?.count * item.multiplicity"
                    />
                    <div @click="addBasketComplect(item, index, complect.action_id)"
                        class="dart-btn dart-btn-primary">
                        <i class="d_icon d_icon-busket"></i>
                    </div>
                </form>
            </td>
            <td>
                {{ Math.round(Number(item.price.price)).toLocaleString('ru') }} ₽<br />
                {{ item.action?.delay ? Number(item.action?.delay).toFixed(1) + ' дн' : 'Предоплата' }}
            </td>
            <td>
                <div class="table-actions">
                    <div class="table-actions__action" :class="{
                        active: action.enabled,
                        red: action?.conflicts?.items[action.action_id]?.sales_conflicts
                    }" v-for="(action, indexactions) in item.actions" v-bind:key="action.id">
                        <div v-if="action?.tags?.length > 0" class="table-actions__container">
                            <div class="table-actions__el" v-for="(tag, indextag) in action.tags" v-bind:key="tag.id">
                                <img v-if="tag.type == 'multiplicity'" src="../../assets/images/icons/action/box.svg"
                                    alt="" />
                                <p v-if="tag.type == 'multiplicity'">{{ tag.value }} шт.</p>

                                <img v-if="tag.type == 'gift'" src="../../assets/images/icons/action/gift.svg" alt="" />

                                <img v-if="tag.type == 'delay'" src="../../assets/images/icons/action/time.svg"
                                    alt="" />
                                <p v-if="tag.type == 'delay'">Отсроч. {{ tag.value }} дн.</p>

                                <img v-if="tag.type == 'sale'" src="../../assets/images/icons/action/sale.svg" alt="" />
                                <p v-if="tag.type == 'sale'">Скидка {{ Number(tag.value).toFixed(0) }}%</p>

                                <img v-if="tag.type == 'free_delivery'"
                                    src="../../assets/images/icons/action/delivery.svg" alt="" />
                            </div>
                        </div>
                        <div v-if="action?.tags?.length > 0" class="table-actions__help">
                            <p>?</p>
                            <div class="table-actions__content">
                                <div class="table-actions__modal">
                                    <div class="table-actions__modal-elems">
                                        <div class="table-actions__modal-el" v-for="(tag, index) in action.tags"
                                            v-bind:key="tag.id">
                                            <img v-if="tag.type == 'min_sum'"
                                                src="../../assets/images/icons/action/basket.svg" alt="" />
                                            <p v-if="tag.type == 'min_sum'">
                                                Минимальна сумма покупки
                                                {{ Number(tag.value).toLocaleString('ru') }}
                                                ₽
                                            </p>

                                            <img v-if="tag.type == 'free_delivery'"
                                                src="../../assets/images/icons/action/delivery.svg" alt="" />
                                            <p v-if="tag.type == 'free_delivery'">
                                                <span>Бесплатная доставка</span>
                                                <span v-if="tag.condition == '2'">
                                                    при покупке от
                                                    {{ tag.value.toLocaleString('ru') }}
                                                    ₽</span>
                                                <span v-if="tag.condition == '3'">
                                                    при покупке от
                                                    {{ tag.value.toLocaleString('ru') }}
                                                    шт.</span>
                                            </p>

                                            <img v-if="tag.type == 'gift'"
                                                src="../../assets/images/icons/action/gift.svg" alt="" />
                                            <p v-if="tag.type == 'gift'">Подарок</p>

                                            <img v-if="tag.type == 'delay'"
                                                src="../../assets/images/icons/action/gift.svg" alt="" />
                                            <p v-if="tag.type == 'delay'">Отсрочка {{ tag.value }} дн.</p>

                                            <img v-if="tag.type == 'multiplicity'"
                                                src="../../assets/images/icons/action/box.svg" alt="" />
                                            <p v-if="tag.type == 'multiplicity'">
                                                Кратность упаковки
                                                {{ tag.value.toLocaleString('ru') }}
                                                шт.
                                            </p>

                                            <img v-if="tag.type == 'sale' && tag.value > 0"
                                                src="../../assets/images/icons/action/sale.svg" alt="" />
                                            <p v-if="tag.type == 'sale'">
                                                Скидка
                                                {{ tag.value.toLocaleString('ru') }}%
                                            </p>
                                        </div>
                                    </div>
                                    <div class="table-actions__modal-btn-container">
                                        <router-link v-if="action.action_id > 0" :to="{
                                            name: 'promotion',
                                            params: {
                                                id: this.$route.params.id,
                                                action: action.action_id
                                            }
                                        }" class="table-actions__modal-btn">Подробнее об акции</router-link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </td>
            <td class="td-center">
                {{ item.action?.payer === '1' ? 'Поставщик' : 'Покупатель' }} / <br />~ {{ item.delivery }} дней ({{
                    new Date(item.delivery_day).toLocaleString('ru', {
                        month: '2-digit',
                        day: '2-digit',
                        year: '2-digit'
                    })
                }})
            </td>
            <td class="td-center" :class="{ 'pointer-none': index !== 0 }">
                <span :style="'top:' + (complect.length * 74) / 2 + 'px'" v-if="index === 0">{{ item.remain }}
                    шт.</span>
            </td>
            <td class="td-center">
                <span style="position: relative; top: 0; transform: unset">{{ item.org_name }}</span>
                <br />
                <span style="position: relative; top: 0; transform: unset"
                    class="flex align-items-center justify-content-center gap-1"><img :src="item.store_image"
                        class="kenost-table-elem__logo" alt="" /> {{ item.store_city }}</span>
            </td>
            <td>{{ Math.round(item.price.price).toLocaleString('ru') }} ₽ <br />
                {{ (item.price.rrc - item.price.price).toLocaleString('ru') }} ₽</td>
        </tr>
    </tbody> -->
    <Dialog v-model:visible="this.modal_remain" header=" " :style="{ width: '340px' }">
        <div class="kenost-not-produc">
            <img src="/images/icons_milen/outOfStock2.png" alt="">
            <b>У нас нет столько товаров :(</b>
            <p>Извините, но количество данного товара ограничено</p>
            <div class="a-dart-btn a-dart-btn-primary" @click="this.modal_remain = false">Понятно</div>
        </div>
    </Dialog>

    <Dialog v-model:visible="this.modal_info" header=" " :style="{ width: '640px' }">
        <!-- <div>{{ this.modal_info_data }}</div> -->
        <div class="kenost-product-info">
            <div class="kenost-product-info__product">
                <div class="kenost-product-info__image">
                    <img :src="this.modal_info_data.image" alt="">
                </div>
                <div class="kenost-product-info__name">
                    <div class="kenost-product-info__pagetitle">{{ this.modal_info_data.name }}</div>
                    <b class="kenost-product-info__article">{{ this.modal_info_data.article }}</b>
                </div>
            </div>
            <div class="kenost-product-info__tabs mt-3">
                <div class="kenost-product-info__tab">
                    <p>Остаток, шт</p>
                    <b>{{ this.modal_info_data.our_available }}</b>
                </div>
                <div class="kenost-product-info__tab">
                    <p>Скорость продаж за 30 дней, шт/день</p>
                    <b>{{ this.modal_info_data.our_purchase_speed }}</b>
                </div>
                <div class="kenost-product-info__tab">
                    <p>Прогноз остатков, шт</p>
                    <b>{{ this.modal_info_data.our_forecast }}</b>
                </div>
            </div>
            <div class="kenost-product-info__chart" v-if="items.remains_history">
                <div class="kenost-product-info__pagetitle mb-2" v-if="items.remains_history">История изменений остатков</div>
                <Chart type="line" :data="this.modal_info_data.remains_history" :options="chart_options" class="w-full"/>
            </div>
        </div>
    </Dialog>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import Counter from './Counter.vue';
import router from '../../router';
import Dialog from 'primevue/dialog';
import debounce from '../../utils/debounce';
import ActionModal from './ActionModal.vue';
import Chart from 'primevue/chart'

export default {
    name: 'TableCatalogRow',
    emits: ['updateBasket', 'ElemAction'],
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
            type: Boolean
        }
    },
    data() {
        return {
            loading: true,
            active: false,
            value: 1,
            modal_remain: false,
            timeOut: null,
            fetchIds: [],
            add_basket: [],
            namePathIsNav: null,
            modal_info: false,
            modal_info_data: null,
            chart_options: {
                responsive: true,
                plugins: {
                legend: {
                    position: 'top',
                    display: false
                },
                title: {
                    display: false,
                    text: 'График'
                }
                }
            }
        };
    },
    methods: {
        ...mapActions(['busket_from_api', 'opt_api']),
        ...mapMutations(['SET_OPT_PRODUCT_TO_VUEX']),
        getMinPrice(stores) {
            let minPrice = 0;
            for (let i = 0; i < stores.length; i++) {
                if (i === 0) {
                    if(stores[i].available > 0){
                        minPrice = stores[i].price;
                    }
                } else if (stores[i].price < minPrice) {
                    if(stores[i].available > 0){
                        minPrice = stores[i].price;
                    }
                }
            }

            return minPrice;
        },
        getMaxDelay(stores) {
            let maxDelay;
        },
        openActions(item) {
            this.$emit('ElemAction', item);
        },
        async updateAction(remainid, storeid, action, indexstore, indexaction, conflicts) {
            // console.log('updateAction', remainid, storeid, action, indexstore, indexaction, conflicts);
            // console.log(this.items.stores[index].actions)

            this.items.stores[indexstore].actions[indexaction].enabled = !this.items.stores[indexstore].actions[indexaction].enabled;

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
                                    // console.log(conflicts.store_id);
                                    const data = {
                                        action: 'action/user/off/on',
                                        remain_id: this.items.stores[indexstore].actions[j].remain_id
                                            ? this.items.stores[indexstore].actions[j].remain_id
                                            : conflicts.remain_id,
                                        // store_id: this.items.stores[indexstore].actions[j].store_id ? this.items.stores[indexstore].actions[j].store_id : conflicts.store_id,
                                        id: router.currentRoute._value.params.id,
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
                                        remain_id: this.items.stores[indexstore].actions[j].remain_id
                                            ? this.items.stores[indexstore].actions[j].remain_id
                                            : conflicts.remain_id,
                                        // store_id: this.items.stores[indexstore].actions[j].store_id ? this.items.stores[indexstore].actions[j].store_id : conflicts.store_id,
                                        id: router.currentRoute._value.params.id,
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
                // store_id: storeid,
                id: router.currentRoute._value.params.id,
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
                    const data = {
                        remain_id: remainid,
                        store_id: storeid,
                        data: response.data.data
                    };
                    // console.log("SET_OPT_PRODUCT_TO_VUEX", data)
                    this.$store.commit('SET_OPT_PRODUCT_TO_VUEX', data);
                });
            });
        },
        getMinDelivery(stores) {
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
        addBasket(item, index) {
            if (!this.add_basket.includes(item.key)) {
                this.add_basket.push(item.key);
            }
            const data = {
                action: 'basket/add',
                extended_name: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? 'offer' : 'cart',
                id: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? router.currentRoute._value.params.id_org_from : router.currentRoute._value.params.id,
                org_id: item.org_id,
                store_id: item.store_id,
                id_remain: item.id,
                count: item.basket.count,
                actions: item.actions
            };
            this.busket_from_api(data).then(() => {
                this.busket_from_api({
                    action: 'basket/get',
                    extended_name: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? 'offer' : 'cart',
                    id: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? router.currentRoute._value.params.id_org_from : router.currentRoute._value.params.id,
                    warehouse: 'all'
                }).then((response) => {
                    if(!response?.data?.data?.success && response?.data?.data?.message){
                        this.$toast.add({ severity: 'error', summary: "Ошибка", detail: response?.data?.data?.message, life: 3000 });
                    }
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
            this.items.stores[index].basket.availability = true;
            this.$emit('updateBasket');
        },

        addBasketComplect(item, index, action_id) {
            if (!this.add_basket.includes(item.key)) {
                this.add_basket.push(item.key);
            }
            const data = {
                action: 'basket/add',
                extended_name: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? 'offer' : 'cart',
                id: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? router.currentRoute._value.params.id_org_from : router.currentRoute._value.params.id,
                org_id: item.org_id,
                store_id: item.store_id,
                id_complect: item.complect_id,
                count: 1,
                actions: [action_id]
            };
            // this.busket_from_api(data)
            this.busket_from_api(data).then((response) => {
                if(!response?.data?.data?.success && response?.data?.data?.message){
					this.$toast.add({ severity: 'error', summary: "Ошибка", detail: response?.data?.data?.message, life: 3000 });
				}
                this.busket_from_api({
                    action: 'basket/get',
                    extended_name: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? 'offer' : 'cart',
                    id: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? router.currentRoute._value.params.id_org_from : router.currentRoute._value.params.id,
                    warehouse: 'all'
                });
                setTimeout(() => {
                    const index = this.add_basket.indexOf(item.key);
                    if (index !== -1) {
                        this.add_basket.splice(index, 1); // Удаляем один элемент по индексу
                    }
                }, 1000)
            });
            // eslint-disable-next-line vue/no-mutating-props
            // this.items.complects[index][0].basket.availability = true;
            this.$emit('updateBasket');
        },
        clearBasketProduct(org_id, store_id, key, product) {
			const data = {
				action: "basket/remove",
                extended_name: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? 'offer' : 'cart',
				id: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? router.currentRoute._value.params.id_org_from : router.currentRoute._value.params.id,
				org_id: org_id,
				store_id: store_id,
				key: key,
				product: product
			};
			this.busket_from_api(data).then((response) => {
                if(!response?.data?.data?.success && response?.data?.data?.message){
					this.$toast.add({ severity: 'error', summary: "Ошибка", detail: response?.data?.data?.message, life: 3000 });
				}
            });
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
                extended_name: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? 'offer' : 'cart',
				id: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? router.currentRoute._value.params.id_org_from : router.currentRoute._value.params.id,
				warehouse: 'all'
			}).then((response) => {
                if(!response?.data?.data?.success && response?.data?.data?.message){
					this.$toast.add({ severity: 'error', summary: "Ошибка", detail: response?.data?.data?.message, life: 3000 });
				}
                const index = this.fetchIds.indexOf(product.key);
                if (index !== -1) {
                    this.fetchIds.splice(index, 1); // Удаляем один элемент по индексу
                }
                setTimeout(() => {
                    const index = this.add_basket.indexOf(item.key);
                    if (index !== -1) {
                        this.add_basket.splice(index, 1); // Удаляем один элемент по индексу
                    }
                }, 1000)
            })
        },
        clearBasketComplect(storeid, complectid) {
            const data = {
                action: "basket/clear",
                extended_name: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? 'offer' : 'cart',
                id: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? router.currentRoute._value.params.id_org_from : router.currentRoute._value.params.id,
                store_id: storeid,
                id_complect: complectid,
            };
            this.busket_from_api(data).then((response) => {
                if(!response?.data?.data?.success && response?.data?.data?.message){
					this.$toast.add({ severity: 'error', summary: "Ошибка", detail: response?.data?.data?.message, life: 3000 });
				}
            });
            this.busket_from_api({
                action: 'basket/get',
                extended_name: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? 'offer' : 'cart',
                id: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? router.currentRoute._value.params.id_org_from : router.currentRoute._value.params.id,
                warehouse: 'all'
            }).then((response) => {
                if(!response?.data?.data?.success && response?.data?.data?.message){
					this.$toast.add({ severity: 'error', summary: "Ошибка", detail: response?.data?.data?.message, life: 3000 });
				}
            })
            this.$emit("catalogUpdate");
            this.$emit("actionUpdate");
        },
        ElemCount(object) {
            if (!this.fetchIds.includes(object.item.key)) {
                this.fetchIds.push(object.item.key);
            }
            if (object.value > Number(object.max)) {
                this.modal_remain = true;
				this.$emit("catalogUpdate");
                const data = {
                    action: 'basket/update',
                    extended_name: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? 'offer' : 'cart',
                    id: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? router.currentRoute._value.params.id_org_from : router.currentRoute._value.params.id,
                    org_id: object.item.org_id,
                    store_id: object.item.store_id,
                    id_remain: object.id,
                    count: object.max,
                    key: object.item.basket.key,
                    actions: object.item.basket.ids_actions
                };
				this.busket_from_api(data).then((response) => {
                    if(!response?.data?.data?.success && response?.data?.data?.message){
                        this.$toast.add({ severity: 'error', summary: "Ошибка", detail: response?.data?.data?.message, life: 3000 });
                    }

					this.busket_from_api({
						action: 'basket/get',
                        extended_name: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? 'offer' : 'cart',
						id: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? router.currentRoute._value.params.id_org_from : router.currentRoute._value.params.id,
						warehouse: 'all'
					}).then((response) => {
                        if(!response?.data?.data?.success && response?.data?.data?.message){
							this.$toast.add({ severity: 'error', summary: "Ошибка", detail: response?.data?.data?.message, life: 3000 });
						}
						const index = this.fetchIds.indexOf(object.item.key);
						if (index !== -1) {
							this.fetchIds.splice(index, 1); // Удаляем один элемент по индексу
						}
					});
				})
                return
			}
            if (object.value == object.min) {
                this.clearBasketProduct(object.item.org_id, object.item.store_id, object.item.basket.key, object.item)
                return;
            };            
            this.items.stores[object.index].basket.count = object.value;                
            const data = {
                action: 'basket/update',
                extended_name: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? 'offer' : 'cart',
                id: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? router.currentRoute._value.params.id_org_from : router.currentRoute._value.params.id,
                org_id: object.item.org_id,
                store_id: object.item.store_id,
                id_remain: object.id,
                count: object.value,
                key: object.item.basket.key,
                actions: object.item.basket.ids_actions
            };
            this.busket_from_api(data).then((response) => {
                if(!response?.data?.data?.success && response?.data?.data?.message){
                    if(response?.data?.data?.message == "Нет достаточного количества товара на Складе"){
                        this.modal_remain = true;
                    } else{
                        this.$toast.add({ severity: 'error', summary: "Ошибка", detail: response?.data?.data?.message, life: 3000 });
                    }
				}
                this.busket_from_api({
                    action: 'basket/get',
                    extended_name: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? 'offer' : 'cart',
                    id: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? router.currentRoute._value.params.id_org_from : router.currentRoute._value.params.id,
                    warehouse: 'all'
                }).then((response) => {
                    if(!response?.data?.data?.success && response?.data?.data?.message){
                        this.$toast.add({ severity: 'error', summary: "Ошибка", detail: response?.data?.data?.message, life: 3000 });
                    }
                    const index = this.fetchIds.indexOf(object.item.key);
                    if (index !== -1) {
                        this.fetchIds.splice(index, 1); // Удаляем один элемент по индексу
                    }
                });
            })
            if(Number(object.value) != object.old_value){
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                    ecommerce: {
                        currencyCode: "RUB",
                        add: {
                        products: [
                            {
                                id: object.item.id,
                                name: object.item.name,
                                price: object.item.price,
                                category: object.item.catalog,
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
			if (!this.fetchIds.includes(object.item.basket.key)) {
                this.fetchIds.push(object.item.basket.key);
            }
            if (object.value == object.min) {
                object.item.item.key = object.item.basket.key
                this.clearBasketProductComplect(object.item.item)
                return;
            }
			if (object.value > Number(object.max)) {
				this.modal_remain = true;
			} else {
				if(this.timeOut){
                    clearTimeout(this.timeOut);
                }

                this.timeOut = setTimeout(() => {
                    // Ваш запрос на сервер
					const data = {
						action: "basket/update",
                        extended_name: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? 'offer' : 'cart',
						id: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? router.currentRoute._value.params.id_org_from : router.currentRoute._value.params.id,
						id_complect: object.item.item.complect_id,
						count: object.value / object.item.item.multiplicity,
						store_id: object.store_id,
						key: object.item.basket.key,
						org_id: object.item.item.org_id,
						actions: object.item.basket.ids_actions
					}
                    this.busket_from_api(data).then((response) => {
                        if(!response?.data?.data?.success && response?.data?.data?.message){
							this.$toast.add({ severity: 'error', summary: "Ошибка", detail: response?.data?.data?.message, life: 3000 });
						}
                    });
					this.busket_from_api({
						action: 'basket/get',
                        extended_name: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? 'offer' : 'cart',
						id: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? router.currentRoute._value.params.id_org_from : router.currentRoute._value.params.id,
						warehouse: 'all'
					}).then((response) => {
                        if(!response?.data?.data?.success && response?.data?.data?.message){
							this.$toast.add({ severity: 'error', summary: "Ошибка", detail: response?.data?.data?.message, life: 3000 });
						}
						const index = this.fetchIds.indexOf(object.item.key);
						if (index !== -1) {
							this.fetchIds.splice(index, 1); // Удаляем один элемент по индексу
						}
					});
                    this.$emit('updateBasket');
                    this.$emit("catalogUpdate");
                }, 1000);
				
			}
            
		},
        clearBasketProductComplect(product) {
			this.$emit("catalogUpdate");
			this.$emit("actionUpdate");
			const data = {
				action: "basket/remove",
				extended_name: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? 'offer' : 'cart',
				id: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? router.currentRoute._value.params.id_org_from : router.currentRoute._value.params.id,
				key: product.key,
				store_id: product.store_id,
				org_id: product.org_id,
				id_complect: product.complect_id
			};
			this.busket_from_api(data).then((response) => {
				if(!response?.data?.data?.success && response?.data?.data?.message){
					this.$toast.add({ severity: 'error', summary: "Ошибка", detail: response?.data?.data?.message, life: 3000 });
				}
			});
			this.busket_from_api({
				action: 'basket/get',
				extended_name: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? 'offer' : 'cart',
				id: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? router.currentRoute._value.params.id_org_from : router.currentRoute._value.params.id,
				warehouse: 'all'
			}).then((response) => {
				if(!response?.data?.data?.success && response?.data?.data?.message){
					this.$toast.add({ severity: 'error', summary: "Ошибка", detail: response?.data?.data?.message, life: 3000 });
				}
                const index = this.fetchIds.indexOf(product.key);
                if (index !== -1) {
                    this.fetchIds.splice(index, 1); // Удаляем один элемент по индексу
                }
			})
		},
    },
    mounted() {
        this.namePathIsNav = router?.currentRoute?._value.matched[4]?.name;
    },
    updated(){
        this.namePathIsNav = router?.currentRoute?._value.matched[4]?.name;
    },
    components: {
        Counter,
        Dialog,
        ActionModal,
        Chart
    },
    computed: {
        ...mapGetters(['basket'])
    }
};
</script>
<style lang="scss">
.k-table__сhange-remain{
    max-width: 200px;
}
.kenost-complect-icon {
    position: relative;

    .mst-icon-link {
        position: absolute;
        font-size: 16px;
        top: 7px;
        left: calc(50% + 6px);
        transform: translate(-50%, 0);
        color: #adadad;
    }
}

.td-center {
    position: relative;

    span {
        position: absolute;
        top: 100%;
        transform: translate(0, -50%);
        width: 100%;
        left: 0;
        text-align: center;
    }
}

.complect-button {
    position: relative;

    &:hover {
        .complect-button__form {
            opacity: 1;
            pointer-events: all;
        }
    }

    &__td {
        position: relative;
    }

    &__form {
        position: absolute;
        width: 100%;
        top: 100%;
        transform: translate(0, -50%);
    }
}

// .kenost-table-background:nth-child(2n){
// background: #F4F4F4 !important;
// }

// .kenost-table-background-complect{
//   background: #d4d4d4 !important;
// }

.k-actions {
    position: relative;

    &:not(:first-child) {
        margin-left: -10px;
    }
}

.kenost-err-compatibility {
    color: #fb203a;
    font-size: 10px;
}

.k-err-icon {
    width: 12px;
    height: 12px;
    background: #fb203a;
    rotate: 45deg;
    position: absolute;
    top: 0;
    right: 5px;
    display: flex;
    align-items: center;
    justify-content: center;

    i {
        color: #fff;
        font-size: 8px;
        rotate: 135deg;
        position: relative;

        &::before {
            position: relative;
            top: 1px;
        }
    }
}
.kenost-product-item.notavailable{
    opacity: .6;
    .k-table__busket *,
    .table-actions,
    .kenost-product-item__delivery,
    .kenost-product-item__profit_info,
    .kenost-product-item__price-info{
        display: none;
    }
}
.kenost-table-elem__adding_info{
    span{
        color: #afafaf;
        display: block;
        font-size: 12px;
        line-height: 1.3;
        &.kenost-err-min{
            color: #F00;
        }
    }
}
</style>
