<template>
	<Loading v-if="this.loading"/>
	<div class="shipping std-shipping">
		<Breadcrumbs />

		<div class="std-shipping__title-container hidden-tablet-l">
			<h1 class="table-kenost__title std-shipping__title">Заказ № {{ this.order?.id }}</h1>
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
					<div class="kenost-table-elem__content">{{ this.order.date }}</div>
				</div>
				<div class="w-full kenost-table-elem">
					<span>Сумма</span>
					<div class="kenost-table-elem__content">{{ this.order.cost }}</div>
				</div>
				<div class="w-full kenost-table-elem">
					<span>Клиент</span>
					<div class="kenost-table-elem__content gap-2"><img class="kenost-table-elem__logo" :src="this.order.buyer_image" v-if="this.order.buyer_image">{{ this.order.buyer }}</div>
				</div>
				<div class="w-full kenost-table-elem">
					<span>Отсрочка</span>
					<div class="kenost-table-elem__content">{{ this.order.delay }}</div>
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
					<div class="kenost-table-elem__content">{{ this.order.payer }}</div>
				</div>
				<div class="w-full kenost-table-elem">
					<span>Срок доставки</span>
					<div class="kenost-table-elem__content">{{ this.order.day_delivery }} дн. ({{ this.order.delivery_date }})</div>
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
						<td class="std-table__col table-actions">
							<div class="table-actions__action w-fit" v-for="(action, indexactions) in item.actions" v-bind:key="action.action_id" :class="{active: action.enabled}">
								<div v-if="action.tags.length > 0" class="table-actions__container">
									<div class="table-actions__el" v-for="(tag, indextag) in action.tags" v-bind:key="tag.id">
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
								<div v-if="action.tags.length > 0" class="table-actions__help">
									<p>?</p>
									<ActionModal :action="action"/>
								</div>
							</div>
						</td>
						<td class="std-table__col">{{ item.count }}  шт.</td>
						<td class="std-table__col">{{ Number(item.price * item.count).toLocaleString('ru') }} ₽</td>
					</tr>
				</tbody>
			</table>
			<div class="kenost-table-line right">
				<b>Итого: {{ this.order.cost }} </b>
			</div>
		</div>
	</div>
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
import ActionModal from '../components/opt/ActionModal.vue'
import Loading from "../components/Loading.vue";

export default {
	name: "MyOrders",
	props: {
	},
	data() {
		return {
			order: [],
			loading: true
		};
	},
	methods: {
		...mapActions([
            'get_opt_order_api'
		]),
	},
	mounted() {
		this.get_opt_order_api({
			action: 'get/orders/seller',
			id: router.currentRoute._value.params.id,
			order_id: router.currentRoute._value.params.order_id
		}).then(() => this.loading = false)
	},
	components: {
		Dropdown,
		MultiSelect,
		AutoComplete,
		Calendar,
		DatePicker,
		// customModal,
		ActionModal,
		vTable,
		Dialog,
		CalendarVue,
		// Checkbox,
		// Swiper,
		// SwiperSlide
		Breadcrumbs,
		Loading
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
