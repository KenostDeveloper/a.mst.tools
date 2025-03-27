<template>
    <!-- <tbody class="kenost-table-border-bottom" v-for="(product, index1) in items.products" v-bind:key="product.id">
        <tr v-for="(item, index2) in product.stores" v-bind:key="item.id">
            <td>
            </td>
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
                <div v-if="item.check_remains != 1 && item.total_stores == 1">
                    <span class="info-badge" v-tooltip="{ value: 'Необходима интеграция для получения данных', showDelay: 0, hideDelay: 0 }">
                        <i class="pi pi-exclamation-circle"></i>
                    </span>
                </div>
                <Chart type="line" :data="item.remains_history" :options="chart_options" style="width: 200px;" v-else-if="item.total_stores == 1 && item.remains_history"/>
            </td>
            <td class="k-table__remain-speed">
                {{ item.our_available }} / {{ item.our_purchase_speed }}
            </td>
            <td v-if="item.our_forecast && item.our_forecast < 0" class="k-table__prognoz cursor-pointer">
                <span @click="addBasketForecast(item, index, Math.abs(item.our_forecast))">{{ item.our_forecast }}</span>
            </td>
            <td v-else class="k-table__prognoz">
                {{ item.our_forecast }}
            </td>
            <td class="k-table__busket">
                {{ this.fetchIds.indexOf(item.remain_id) != -1 ? "Загрузка..." : "" }}
                
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
                    <div :class="{'flex align-items-center justify-content-center flex-direction-column': item.min_price.price && item.actions}">
                        {{ Math.round(item.price).toLocaleString('ru') }} ₽ 
                        <div v-if="item.min_price.price && item.actions && item.min_price.price != item.price" class="kenost-min-price" v-tooltip="{ value: 'Минимальная цена при выполнении условий акций', showDelay: 0, hideDelay: 0 }">
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
        </tr>
    </tbody> -->
    <tbody :class="{ 'active-catalog-group': this.active, 'no-active-catalog-group': !this.active }">
        <tr v-if="!this.is_warehouses && items?.total_stores > 1" @click="this.active = !this.active"
            :class="{ 'active-el': this.active, 'no-active-el': !this.active }">
            <td class="hidden-mobile-l"><i class="pi pi-angle-up"></i></td>
            <td class="k-table__title">
                <p>{{ items.name }}</p>
                <b>Арт: {{ items.article }}</b>
            </td>
            <td class="k-table__сhange-remain">
                <div v-if="items.check_remains != 1">
                    <span class="info-badge" v-tooltip="{ value: 'Необходима интеграция для получения данных', showDelay: 0, hideDelay: 0 }">
                        <i class="pi pi-exclamation-circle"></i>
                    </span>
                </div>
                <Chart type="line" :data="items.remains_history" :options="chart_options" style="width: 200px;" v-else-if="items.total_stores > 1 && items.remains_history"/>
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
                <div v-if="items.check_remains != 1 && items.total_stores == 1">
                    <span class="info-badge" v-tooltip="{ value: 'Необходима интеграция для получения данных', showDelay: 0, hideDelay: 0 }">
                        <i class="pi pi-exclamation-circle"></i>
                    </span>
                </div>
                <Chart type="line" :data="items.remains_history" :options="chart_options" style="width: 200px;" v-else-if="items.total_stores == 1 && items.remains_history"/>
            </td>
            <td class="k-table__remain-speed">
                {{ items.our_available }} / {{ items.our_purchase_speed }}
            </td>
            <td v-if="items.our_forecast && items.our_forecast < 0" class="k-table__prognoz cursor-pointer">
                <span @click="addBasketForecast(item, index, Math.abs(items.our_forecast))">{{ items.our_forecast }}</span>
            </td>
            <td v-else class="k-table__prognoz">
                {{ items.our_forecast }}
            </td>
            <td class="k-table__busket">
                <!-- {{ item.min }} -->
                {{ this.fetchIds.indexOf(item.remain_id) != -1 ? "Загрузка..." : "" }}
                
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
                    <div :class="{'flex align-items-center justify-content-center flex-direction-column': item.min_price.price && item.actions}">
                        {{ Math.round(item.price).toLocaleString('ru') }} ₽ 
                        <div v-if="item.min_price.price && item.actions && item.min_price.price != item.price" class="kenost-min-price" v-tooltip="{ value: 'Минимальная цена при выполнении условий акций', showDelay: 0, hideDelay: 0 }">
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
    <tbody class="complect-button kenost-table-background kenost-table-background-complect active-catalog-group"
        v-for="complect in items.complects" v-bind:key="complect.id" :class="{
            active: this.active || this.is_warehouses || items.total_stores == 1,
            'no-active': !this.active && !this.is_warehouses && items.total_stores > 1,
            'bg-white': items.total_stores == 1
        }">

        <tr :class="{
            active: this.active || this.is_warehouses || items.total_stores == 1,
            'kenost-table-bg-complect': items.total_stores == 1,
            'no-active': !this.active && !this.is_warehouses && items.total_stores > 1
        }">
            <td>
                
            </td>
            <td class="k-table__title text-left">
                <p>Комплект <span class="text-bold">«{{ complect.name }}»</span></p>
            </td>
            <td>

            </td>
            <td>
            </td>
            <td>
            </td>
            <td>
                <form class="k-table__form" :class="{ 'basket-true': complect?.basket?.availability || this.add_basket.indexOf(complect.products[0].key) != -1, 'loading-counter': this.fetchIds.indexOf(complect.products[0].key) != -1 }" action="">
                    <Counter
                        @ElemCount="ElemCountComplect"
                        :step="1"
                        :min="0"
                        :item="{item: complect.products[0], basket: complect?.basket}"
                        :max="complect.products[0].remain"
                        :id="complect.products[0].complect_id"
                        :store_id="complect.products[0].store_id"
                        :index="index"
                        :value="complect?.basket?.count"
                    />
                    <div @click="addBasketComplect(complect.products[0], index, complect.action_id)"
                        class="dart-btn dart-btn-primary">
                        <i class="d_icon d_icon-busket"></i>
                    </div>
                </form>
            </td>
            <td>
                {{ Math.round(Number(complect.price.price)).toLocaleString('ru') }} ₽<br />
                {{ complect.products[0].action?.delay ? Number(complect.products[0].action?.delay).toFixed(1) + ' дн' : 'Предоплата' }}
            </td>
            <td>
            </td>
            <td class="td-center">
                {{ complect.products[0].action?.payer === '1' ? 'Поставщик' : 'Покупатель' }} / <br />~ {{ complect.products[0].delivery }} дней ({{
                    new Date(complect.products[0].delivery_day).toLocaleString('ru', {
                        month: '2-digit',
                        day: '2-digit',
                        year: '2-digit'
                    })
                }})
            </td>
            <td>
                <span>{{ complect.products[0].remain }} шт.</span>
            </td>
            <td class="td-center">
                <span style="position: relative; top: 0; transform: unset">{{ complect.products[0].org_name }}</span>
                <br />
                <span style="position: relative; top: 0; transform: unset"
                    class="flex align-items-center justify-content-center gap-1"><img :src="complect.products[0].store_image"
                        class="kenost-table-elem__logo" alt="" /> {{ complect.products[0].store_city }}</span>
            </td>
        </tr>

        <tr v-for="(item, index) in complect.products" v-bind:key="item.id" :class="{
            active: this.active || this.is_warehouses || items.total_stores == 1,
            'kenost-table-bg-complect': items.total_stores == 1,
            'no-active': !this.active && !this.is_warehouses && items.total_stores > 1
        }">
            <td class="td-center" :class="{ 'pointer-none': index !== 0 }">
                <!-- {{ Object.keys(complect.products, 1).length }} -->
                <span :style="'top:' + ((Object.keys(complect.products).length * 100) / 2 - 50).toString() + '%'" v-if="index === 0"><i class="pi pi-minus"></i></span>
            </td>
            <!-- <td class="k-table__photo">
                <img class="k-table__image" :src="item.image" alt="" />
                <div class="kenost-complect-icon" v-if="index < complect.length - 1">
                </div>
            </td> -->
            <td class="k-table__title">
                <!-- <span class="complect-icon" v-if="index == 0">Комплект</span> -->
                <p>{{ item.pagetitle }}</p>
                <b>Арт: {{ item.article }}</b>
            </td>
            <!-- <td class="k-table__busket complect-button__td">
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
            </td> -->
            <td>

            </td>
            <td>
                
            </td>
            <td>
                
            </td>
            <td>
                {{ complect?.basket?.count? complect?.basket?.count * item.multiplicity: item.multiplicity }}
            </td>
            <td>
                {{ Math.round(Number(item.price.price)).toLocaleString('ru') }} ₽<br />
                <!-- {{ item.action?.delay ? Number(item.action?.delay).toFixed(1) + ' дн' : 'Предоплата' }} -->
            </td>
            <td>
                
            </td>
            <td>
                
            </td>
            <td>
                
            </td>
            <td>
                
            </td>
            <!-- <td>
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
            </td> -->
            <!-- <td class="td-center">
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
                {{ (item.price.rrc - item.price.price).toLocaleString('ru') }} ₽</td> -->
        </tr>
    </tbody>
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
import Chart from 'primevue/chart'

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
            active: false,
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
        ...mapActions(['opt_api', 'busket_from_api']),
        ...mapMutations(['SET_OPT_PRODUCT_TO_VUEX', 'SET_SALES_COMPLECT_MUTATION_TO_VUEX', 'SET_OPT_COMPLECT_MUTATION_TO_VUEX']),
        updateBasket() {
            this.$emit('updateBasket');
        },
        addBasket(item, index1, index2) {
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
                    setTimeout(() => {
                        const index = this.add_basket.indexOf(item.key);
                        if (index !== -1) {
                            this.add_basket.splice(index, 1); // Удаляем один элемент по индексу
                        }
                    }, 2000)
                });
            })

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
            this.$emit('updateBasket');
        },
        addBasketComplect(item, index, action_id) {
            console.log(item, index)
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
            });
            // eslint-disable-next-line vue/no-mutating-props
            // this.items.complects[index][0].basket.availability = true;
            this.$emit('updateBasket');
        },
        // addBasketComplect(complectid, value, storeid, index) {
		// 	const data = {
		// 		action: "basket/add",
		// 		id: router.currentRoute._value.params.id,
		// 		id_complect: complectid,
		// 		value,
		// 		store_id: storeid,
		// 	};
		// 	this.busket_from_api(data).then(() => {
		// 		this.busket_from_api({
		// 			action: "basket/get",
		// 			id: router.currentRoute._value.params.id,
		// 			warehouse: "all",
		// 		});
		// 	});
		// 	// eslint-disable-next-line vue/no-mutating-props
        //     for(let i = 0; i < this.items.complects[complectid].products.length; i++){
        //         this.items.complects[complectid].products[i].basket.availability = true;
        //     }
		// 	// this.items.complects[index][0].basket.availability = true;
		// 	this.$emit("updateBasket");
		// },
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
            })

            this.items.products[index1].stores[index2].basket.availability = false;
            this.items.products[index1].stores[index2].basket.count = mult
        },
		clearBasketComplect(storeid, complectid) {
			this.$emit("catalogUpdate");
			this.$emit("actionUpdate");
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
		},
        getMinPrice(stores) {
            let minPrice = 0;
            for (let i = 0; i < stores?.length; i++) {
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
        ElemCount(object) {
            if (!this.fetchIds.includes(object.item.key)) {
                this.fetchIds.push(object.item.key);
            }
            console.log(object)
            if (object.value <= object.min) {
                this.clearBasketProduct(object.item.org_id, object.item.store_id, object.item.key, object.item, object.item.index1, object.item.index2, object.item.multiplicity)
                this.items.products[object.item.index1].stores[object.item.index2].basket.count = object.item.multiplicity;
                return;
            } else {
                this.items.stores[object.index].basket.count = object.value;
            }; 
            console.log(object)
            const data = {
                action: 'basket/update',
                extended_name: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? 'offer' : 'cart',
                id: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? router.currentRoute._value.params.id_org_from : router.currentRoute._value.params.id,
                org_id: object.item.org_id,
                store_id: object.item.store_id,
                id_remain: object.item.remain_id,
                count: object.value,
                key: object.item.basket.key,
                actions: object.item.basket.ids_actions
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
                    const index = this.fetchIds.indexOf(object.item.key);
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
            console.log(object)
			if (!this.fetchIds.includes(object.item.item.key)) {
                this.fetchIds.push(object.item.item.key);
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
						const index = this.fetchIds.indexOf(object.item.item.key);
						if (index !== -1) {
							this.fetchIds.splice(index, 1); // Удаляем один элемент по индексу
						}
					});
                    this.$emit('updateBasket');
                    this.$emit("catalogUpdate");
                }, 1000);
				
			}
		},
        // ElemCountComplect(object) {
        //     // console.log(object)
        //     if (object.value == object.min) {
        //         this.clearBasketComplect(object.store_id, object.id)
        //         return;
        //     }

        //     if (object.value > Number(object.max)) {
        //         this.modal_remain = true;
        //         // console.log(this.modal_remain)
        //     } else {
        //         // eslint-disable-next-line vue/no-mutating-props

        //         if(this.timeOut){
        //             clearTimeout(this.timeOut);
        //         }

        //         this.timeOut = setTimeout(() => {
        //             // Ваш запрос на сервер
        //             this.$emit("catalogUpdate");
        //             const data = {
        //                 action: 'basket/update',
        //                 id: router.currentRoute._value.params.id,
        //                 id_complect: object.id,
        //                 value: object.value / Number(object.item.multiplicity),
        //                 store_id: object.store_id
        //             };
        //             // console.log(data)
        //             this.busket_from_api(data).then((response) => {
        //                 const datainfo = {
        //                     complect_id: object.id,
        //                     store_id: object.store_id,
        //                     count: object.value / Number(object.item.multiplicity),
        //                 };
        //                 // this.$store.commit("SET_OPT_COMPLECT_MUTATION_TO_VUEX", datainfo);
        //                 this.$store.commit("SET_SALES_COMPLECT_MUTATION_TO_VUEX", datainfo);
        //             });
        //             this.busket_from_api({
        //                 action: 'basket/get',
        //                 id: router.currentRoute._value.params.id,
        //                 warehouse: 'all'
        //             })
        //         }, 1000);
                
        //     }
        // },
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
    components: { Counter, Dialog, ActionModal, Chart },
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
