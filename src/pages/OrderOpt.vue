<template>
	<Loading v-if="this.loading"/>
	<div class="shipping std-shipping">
		<Breadcrumbs />

		<div class="std-shipping__title-container hidden-tablet-l">
			<h1 class="table-kenost__title std-shipping__title">Заказ № {{ this.order?.id }}</h1>
			<div class="dart-btn dart-btn-secondary gap-2" @click="generateXSLX()">
				<i class="pi pi-download"></i>
				<span>Скачать заказ</span>
			</div>
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
				<div class="w-full kenost-table-elem" v-if="this.order?.ur_persone">
					<span>Покупатель</span>
					<div class="kenost-table-elem__content gap-2 flex-col"><div>{{ this.order?.ur_persone?.name }}, ИНН:{{ this.order?.ur_persone?.inn }}</div></div>
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
				<div class="w-full kenost-table-elem d-none"></div>
				<div class="w-full kenost-table-elem d-none"></div>
				<div class="w-full kenost-table-elem d-none"></div>
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
						<td class="std-table__col std-table__col-name">{{ item.name }}</td>
						<td class="std-table__col">{{ Number(item.price).toLocaleString('ru') }} ₽</td>
						<td class="std-table__col table-actions">
							<ActionModal :actions="item.actions"/>
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
            'get_opt_order_api',
			'opt_api'
		]),
		generateXSLX () {
			this.opt_api({
				action: 'save/orders/seller',
				id: router.currentRoute._value.params.id,
				order_id: router.currentRoute._value.params.order_id
			}).then((res) => {
				// console.log('res file', res)
				var anchor = document.createElement('a');
				anchor.href = res.data.data;
				anchor.target="_blank";
				anchor.click();
			})
		}
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
