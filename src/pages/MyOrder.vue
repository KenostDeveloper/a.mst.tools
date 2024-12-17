<template>
	<div class="shipping std-shipping std-my-order">
        <Breadcrumbs />

		<div class="std-shipping__title-container hidden-tablet-l">
			<h1 class="table-kenost__title std-shipping__title">Заказ № {{ this.order?.id }}</h1>
			<button class="dart-btn dart-btn-primary std-shipping__button" @click="repeat_order">Повторить заказ</button>
		</div>

		<div class="w-full">
			<div class="kenost-table-line">
				<div><img src="../assets/images/icons/order.svg" alt=""></div>
				<span>О заказе</span>
			</div>
			<div class="w-full flex">
				<div class="w-full kenost-table-elem">
					<span>Номер заказа</span>
					<div class="kenost-table-elem__content">{{ this.order.id }}</div>
				</div>
				<div class="w-full kenost-table-elem">
					<span>Дата создания</span>
					<div class="kenost-table-elem__content">{{ new Date(this.order.date).toLocaleString('ru', {year: '2-digit', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric'}) }}</div>
				</div>
				<div class="w-full kenost-table-elem">
					<span>Сумма</span>
					<div class="kenost-table-elem__content">{{ Number(this.order.cost).toLocaleString('ru') }} ₽</div>
				</div>
				<div class="w-full kenost-table-elem">
					<span>Поставщик</span>
					<div class="kenost-table-elem__content"><img class="kenost-table-elem__logo" :src="this.order.seller_image">{{ this.order.name_short }}</div>
				</div>
				<div class="w-full kenost-table-elem">
					<span>Отсрочка</span>
					<div class="kenost-table-elem__content">{{ Number(this.order.delay) == 0 ? "Предоплата" : this.order.delay + ' дн.' }}</div>
				</div>
				<!--
				<div class="w-full kenost-table-elem">
					<span>Статус</span>
					<div class="kenost-table-elem__content">{{ this.order.status_name }}</div>
				</div>
				-->
			</div>
			<div class="kenost-table-line">
				<div><img src="../assets/images/icons/delivery.svg" alt=""></div>
				<span>Доставка</span>
			</div>
			<div class="w-full flex">
				<div class="w-full kenost-table-elem">
					<span>Оплата доставки</span>
					<div class="kenost-table-elem__content">{{ this.order.payer === '1' ? 'Поставщик' : 'Покупатель'}}</div>
				</div>
				<div class="w-full kenost-table-elem">
					<span>Срок доставки</span>
					<div class="kenost-table-elem__content">{{ this.order.day_delivery }} дн. ({{new Date(this.order.delivery_date).toLocaleString("ru", {month: '2-digit', day: '2-digit', year: '2-digit'})}})</div>
				</div>
				<div class="w-full kenost-table-elem">
					<span>Склад</span>
					<div class="kenost-table-elem__content">{{ this.order.seller_address }}</div>
				</div>
				<div class="w-full kenost-table-elem"></div>
				<div class="w-full kenost-table-elem"></div>
				<div class="w-full kenost-table-elem"></div>
			</div>
			<div class="kenost-table-line">
				<div><img src="../assets/images/icons/orders.svg" alt=""></div>
				<span>Состав заказа</span>
			</div>
			<table class="std-table">
				<thead class="std-table__head white">
					<tr class="std-table__row">
						<th class="std-table__hcol">Артикул</th>
						<th class="std-table__hcol">Фото</th>
						<th class="std-table__hcol">Название</th>
						<th class="std-table__hcol">Стоимость за единицу</th>
						<th class="std-table__hcol">Применённые акции</th>
						<th class="std-table__hcol">Количество</th>
						<th class="std-table__hcol">Сумма</th>
					</tr>
				</thead>
				<tbody class="std-table__body">
					<tr class="std-table__row" v-for="item in order.products" v-bind:key="item.id">
						<td class="std-table__col">{{ item.article }}</td>
						<td class="std-table__col">
							<img class="kenost-image-table" :src="item.image" alt="">
						</td>
						<td class="std-table__col">{{ item.name }}</td>
						<td class="std-table__col">{{ Number(item.price).toLocaleString('ru') }} ₽</td>
						<td class="std-table__col">
							<div class="table-actions__action active w-fit" v-for="(action, indexactions) in item.tags" v-bind:key="action.id">
								<div v-if="action.length > 0" class="table-actions__container">
									<div class="table-actions__el" v-for="(tag, indextag) in action" v-bind:key="tag.id">
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
								<div v-if="action.length > 0" class="table-actions__help">
									<p>?</p>
									<div class="table-actions__content">
										<div class="table-actions__modal">
											<div class="table-actions__modal-elems">
												<div class="table-actions__modal-el" v-for="(tag, index) in action" v-bind:key="tag.id">
												<img v-if="tag.type == 'min_sum'" src="/images/icons/action/red/basket.svg" alt="">
												<p v-if="tag.type == 'min_sum'">Минимальна сумма покупки {{ Number(tag.value).toLocaleString('ru') }} ₽</p>

												<img v-if="tag.type == 'free_delivery'" src="/images/icons/action/red/delivery.svg" alt="">
												<p v-if="tag.type == 'free_delivery'"><span>Бесплатная доставка</span> <span v-if="tag.condition == '2'"> при покупке от {{ (tag.value).toLocaleString('ru') }} ₽</span> <span v-if="tag.condition == '3'"> при покупке от {{ (tag.value).toLocaleString('ru') }} шт.</span></p>

												<img v-if="tag.type == 'gift'" src="/images/icons/action/red/gift.svg" alt="">
												<p v-if="tag.type == 'gift'">Подарок</p>

												<img v-if="tag.type == 'delay'" src="/images/icons/action/red/gift.svg" alt="">
												<p v-if="tag.type == 'delay'">Отсрочка {{ tag.value }} дн.</p>

												<img v-if="tag.type == 'multiplicity'" src="/images/icons/action/red/box.svg" alt="">
												<p v-if="tag.type == 'multiplicity'">Кратность упаковки {{ (tag.value).toLocaleString('ru') }} шт.</p>

												<img v-if="tag.type == 'sale' && tag.value > 0" src="/images/icons/action/red/sale.svg" alt="">
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
						</td>
						<td class="std-table__col">{{ item.count }}  шт.</td>
						<td class="std-table__col">{{ Number(item.price * item.count).toLocaleString('ru') }} ₽</td>
					</tr>
				</tbody>
			</table>
			<div class="kenost-table-line right">
				<b>Итого: {{Number(this.order.cost).toLocaleString('ru')}} ₽ </b>
			</div>
		</div>
	</div>
	<Basket @actionUpdate="actionUpdate" ref="childComponent" @toOrder="toOrder" />
	<OrderModal :show="show_order" @fromOrder="fromOrder" />

	<Dialog v-model:visible="this.modal_products" header="Список товаров, которых не хватает у продавца на складе"
        :style="{ width: '640px' }">
        <div class="kenost-list-error">
            <table>
                <tr>
                    <th>Артикул</th>
					<th>Наименование</th>
					<th>Необходимое количество</th>
					<th>Остаток у продавца</th>
                </tr>
                <tr v-for="(item, index) in this.list" :key="item.id">
                    <td class="text-center">{{ item.article }}</td>
					<td class="text-center">{{ item.name }}</td>
                    <td class="text-center">{{ item.value }}</td>
					<td class="text-center">{{ item.available }}</td>
                </tr>
            </table>
        </div>
    </Dialog>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
  import router from '../router'
import AutoComplete from "primevue/autocomplete";
import Dropdown from "primevue/dropdown";
import MultiSelect from "primevue/multiselect";
import { Calendar, DatePicker } from "v-calendar";
import CalendarVue from "primevue/calendar";
import vTable from "../components/table/v-table.vue";
import "v-calendar/style.css";
import Dialog from "primevue/dialog";
import Breadcrumbs from "../components/Breadcrumbs.vue";
import OrderModal from '../components/opt/OrderModal.vue';
import Basket from '../components/opt/Basket.vue';


export default {
	name: "MyOrders",
	props: {
	},
	data() {
		return {
			order: [],
			show_order: false,
			modal_products: false,
			list: []
		};
	},
	methods: {
		...mapActions([
            'get_opt_order_api',
			'opt_api',
			'busket_from_api'
		]),
		repeat_order(){
			this.opt_api({
				action: 'repeat/order',
				id: router.currentRoute._value.params.id,
				order_id: router.currentRoute._value.params.order_id,
			}).then((res) => {
				this.show_order = true
				if(res.data.data.list.length > 0){
					this.modal_products = true
					this.list = res.data.data.list
				}
				this.busket_from_api({
					action: 'basket/get',
					id: router.currentRoute._value.params.id,
					warehouse: 'all'
				})
				this.busket_from_api({
					action: 'basket/get',
					id: router.currentRoute._value.params.id,
				})
			})
		},
		// actionUpdate() {
        //     setTimeout(() => {
        //         this.get_sales_to_api({
        //             id: router.currentRoute._value.params.sales_id,
        //             actionid: router.currentRoute._value.params.action,
        //             page: this.page,
        //             perpage: this.perpage,
        //             isAction: true
        //         });
        //     }, 1000)
            
        // },
		toOrder() {
            this.show_order = true;
        },
		fromOrder() {
            this.show_order = false;
        },
	},
	mounted() {
		this.get_opt_order_api({
			action: 'get/orders/buyer',
			id: router.currentRoute._value.params.id,
			order_id: router.currentRoute._value.params.order_id
		})
	},
	components: {
		Dropdown,
		MultiSelect,
		AutoComplete,
		Calendar,
		DatePicker,
		// customModal,
		vTable,
		Dialog,
		CalendarVue,
		// Checkbox,
		// Swiper,
		// SwiperSlide
		OrderModal,
		Basket,
		Breadcrumbs
	},
	computed: {
		...mapGetters([
            'optorder'
        ]),
	},
	watch: {
		optorder: function (newVal, oldVal) {
			this.order = newVal.order
		}
	},
};
</script>

<style lang="scss">
</style>
