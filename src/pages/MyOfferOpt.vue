<template>
	<Loading v-if="this.loading"/>
	<div class="shipping std-shipping">
		<!-- <Breadcrumbs /> -->

		<div class="std-shipping__title-container mt-5">
			<h1 class="table-kenost__title std-shipping__title">Предложение № {{ this.offer?.id }}</h1>
			<div class="flex gap-left-2">
				<div v-if="this?.offer?.status == 1" class="dart-btn dart-btn-primary" @click="acceptOffer()">
					<span>Рассмотреть предложение</span>	
				</div>
				<!-- <div v-if="this?.offer?.status == 4" class="dart-btn dart-btn-primary" @click="acceptOffer()">
					<span>Повторить заказ</span>	
				</div> -->
				<div v-if="this?.offer?.status == 1" class="dart-btn dart-btn-secondary gap-left-2" @click="changeStatus(3)">
					<span>Отклонить предложение</span>
				</div>
			</div>
		</div>

		<div class="w-full">
			<div class="kenost-table-line">
				<div><img src="../assets/images/icons/order.svg" alt=""></div>
				<span>О предложении</span>
			</div>
			<div class="w-full flex">
				<!-- <div class="w-full kenost-table-elem">
					<span>Номер предложения</span>
					<div class="kenost-table-elem__content">{{ this.offer?.id }}</div>
				</div> -->
				<div class="w-full kenost-table-elem">
					<span>Дата создания</span>
					<div class="kenost-table-elem__content">{{ new Date(this.offer?.date).toLocaleString('ru', {
                            month: '2-digit',
                            day: '2-digit',
                            year: '2-digit'
                        }) }}</div>
				</div>
				<div class="w-full kenost-table-elem">
					<span>Дата окончания предложения</span>
					<div class="kenost-table-elem__content">{{ new Date(this.offer?.date_end).toLocaleString('ru', {
                            month: '2-digit',
                            day: '2-digit',
                            year: '2-digit'
                        }) }}</div>
				</div>
				<div class="w-full kenost-table-elem">
					<span>Инициатор</span>
					<div class="kenost-table-elem__content gap-2 flex-col"><div>{{ this.offer?.initiator_org_name }}</div><div v-if="this.offer?.initiator_user_name">{{ this.offer?.initiator_user_name }}</div></div>
				</div>
				<div class="w-full kenost-table-elem">
					<span>Сумма</span>
					<div class="kenost-table-elem__content">{{ this.offer?.cost }}</div>
				</div>
				<div class="w-full kenost-table-elem" v-if="this.order?.ur_persone">
					<span>Покупатель</span>
					<div class="kenost-table-elem__content gap-2 flex-col"><div>{{ this.order?.ur_persone?.name }}, ИНН:{{ this.order?.ur_persone?.inn }}</div></div>
				</div>
				<!-- <div class="w-full kenost-table-elem">
					<span>Покупатель</span>
					<div class="kenost-table-elem__content gap-2"><img class="kenost-table-elem__logo" :src="this.offer?.from_org_image?.image" v-if="this.offer?.from_org_image?.image">{{ this.offer?.from_org_name }}</div>
				</div> -->
				<!-- <div class="w-full kenost-table-elem">
					<span>Отсрочка</span>
					<div class="kenost-table-elem__content">{{ this.order?.delay }}</div>
				</div> -->
				<div class="w-full kenost-table-elem">
					<span>Отсрочка</span>
					<div class="kenost-table-elem__content">{{Number(this.offer?.delay) != 0 ? Number(this.offer?.delay).toFixed(1) + ' дн' : 'Предоплата'}}</div>
				</div>
				
				<div class="w-full kenost-table-elem">
					<span>Статус</span>
					<div class="kenost-table-elem__content">{{ this.offer?.status_name }}</div>
				</div>
			</div>
			
			
			<div class="kenost-table-line">
				<div><img src="../assets/images/icons/delivery.svg" alt=""></div>
				<span>Доставка</span>
			</div>
			<div class="w-full flex">
				<div class="w-full kenost-table-elem">
					<span>Оплата доставки</span>
					<div class="kenost-table-elem__content">{{ this.offer?.delivery_payer == 1 ? 'Поставщик' : 'Покупатель' }}</div>
				</div>
				<div class="w-full kenost-table-elem">
					<span>Срок доставки</span>
					<div class="kenost-table-elem__content">{{ this.offer?.day_delivery }} дн. ({{ this.offer?.delivery_date }})</div>
				</div>
				<div class="w-full kenost-table-elem">
					<span>Склад доставки</span>
					<div class="kenost-table-elem__content">{{ this.offer?.store_name }}</div>
				</div>

				<div class="w-full kenost-table-elem d-none"></div>
				<div class="w-full kenost-table-elem d-none"></div>
				<div class="w-full kenost-table-elem d-none"></div>
			</div>
			<div class="kenost-table-line">
				<div><img src="../assets/images/icons/orders.svg" alt=""></div>
				<span>Состав предложения</span>
			</div>
			<table class="std-table">
				<thead class="std-table__head white">
					<tr class="std-table__row">
						<th class="std-table__hcol">Артикул</th>
						<th class="std-table__hcol">Фото</th>
						<th class="std-table__hcol">Название</th>
						<th class="std-table__hcol">Поставщик</th>
						<th class="std-table__hcol">Стоимость за единицу</th>
						<th class="std-table__hcol">Применённые акции</th>
						<th class="std-table__hcol">Количество</th>
						<th class="std-table__hcol">Сумма</th>
					</tr>
				</thead>
				<tbody class="std-table__body">
					<tr class="std-table__row" v-for="item in offer?.products" v-bind:key="item.id">
						<td class="std-table__col">{{ item.article }}</td>
						<td class="std-table__col">
							<img class="kenost-image-table" :src="item.image" alt="">
						</td>
						<td class="std-table__col std-table__col-name">{{ item.name }}</td>
						<td class="std-table__col">{{ item.vendor_name }}</td>
						<td class="std-table__col">{{ Number(item.price).toLocaleString('ru') }} ₽</td>
						<td class="std-table__col table-actions">
							<ActionModal :actions="item.actions"/>
						</td>
						<td class="std-table__col">{{ item.count }}  шт.</td>
						<td class="std-table__col">{{ Number(item.price * item.count).toLocaleString('ru') }} ₽</td>
					</tr>
				</tbody>
			</table>
			<div class="kenost-table-line right mb-5">
				<b>Итого: {{ Number(this.offer?.cost).toLocaleString('ru') }} ₽</b>
			</div>
		</div>
	</div>
	<div class="d-col-map purchases__basket-wrapper">
		<Vendors :items="this.opt_vendors" @vendorCheck="vendorCheck" />
		<Basket ref="childComponent" @toOrder="toOrder" @catalogUpdate="catalogUpdate" />
	</div>
	<OrderModal
		:show="this.show_order"
		:order_id="this.order_id"
		@fromOrder="fromOrder"
		@orderSubmit="updatePage($event, num)"
	/>
	<Vendors
			@changeActive="changeActive"
			@vendorCheck="vendorCheck"
			:vendorModal="this.vendorModal"
			:items="this.opt_vendors"
		/>
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
import Basket from "../components/opt/Basket.vue";
import Vendors from "../components/opt/Vendors.vue";
import OrderModal from "../components/opt/OrderModal.vue";
import { join } from "lodash";


export default {
	name: "MyOrders",
	props: {
	},
	data() {
		return {
			offer: [],
			loading: true,
			show_order: false,
			opt_vendors: {},
			order_id: 0,
			vendorModal: false,
		};
	},
	methods: {
		...mapActions([
            'get_offer_api',
			'offer_api',
			'busket_from_api',
			"get_opt_catalog_from_api",
			"get_opt_vendors_from_api",
			"get_opt_products_from_api"
		]),
		changeStatus(id_status){
			this.loading = true
			this.offer_api({
				action: 'change/status',
				id: router.currentRoute._value.params.id,
				offer_id: router.currentRoute._value.params.offer_id,
				status: id_status
			}).then(() => {
				this.get_offer_api({
					action: 'get/offers/my',
					id: router.currentRoute._value.params.id,
					offer_id: router.currentRoute._value.params.offer_id
				}).then(() => this.loading = false)
			})
		},
		updatePage(order_id) {
			this.order_id = order_id
			this.page = 1
			// this.loading = true;
			// this.get_opt_catalog_from_api().then((this.opt_catalog = this.optcatalog));
			// this.get_opt_vendors_from_api().then((this.opt_vendors = this.optvendors));
			// this.get_opt_products_from_api({
			// 	page: this.page,
			// 	perpage: this.perpage,
			// }).then(() => {
			// 	this.opt_products = this.optproducts;
			// 	this.loading = false;
			// });
			// if (this.$route.params.warehouse_id) {
			// 	this.get_opt_warehouse().then((this.opt_warehouse = this.optwarehouse));
			// }
			this.get_offer_api({
				action: 'get/offers/my',
				id: router.currentRoute._value.params.id,
				offer_id: router.currentRoute._value.params.offer_id
			})
		},
		toOrder() {
			this.show_order = true;
		},
		fromOrder() {
			this.show_order = false;
		},
		acceptOffer(){
			// this.loading = true
			this.offer_api({
				action: 'accept',
				id: router.currentRoute._value.params.id,
				offer_id: router.currentRoute._value.params.offer_id
			}).then((res) => {
				this.get_offer_api({
					action: 'get/offers/my',
					id: router.currentRoute._value.params.id,
					offer_id: router.currentRoute._value.params.offer_id
				}).then(() => this.loading = false)
				this.busket_from_api({
                    action: 'basket/get',
                    extended_name: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? 'offer' : 'cart',
                    id: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? router.currentRoute._value.params.id_org_from : router.currentRoute._value.params.id,
                    warehouse: 'all'
                }).then((response) => {
                    if(!response?.data?.data?.success && response?.data?.data?.message){
                        this.$toast.add({ severity: 'error', summary: "Ошибка", detail: response?.data?.data?.message, life: 3000 });
                    }
                });
				let nums = res.data.data.nums;
        		this.order_id = nums.join(', ')
			})
			this.show_order = true
		}
	},
	mounted() {
		this.get_offer_api({
			action: 'get/offers/my',
			id: router.currentRoute._value.params.id,
			offer_id: router.currentRoute._value.params.offer_id
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
		Basket,
		Vendors,
		OrderModal,
		// SwiperSlide
		Breadcrumbs,
		Loading
	},
	computed: {
		...mapGetters([
            'offers',
        ]),
	},
	watch: {
		offers: function (newVal, oldVal) {
			console.log(newVal)
			this.offer = newVal
			console.log(this.offer)
		}
	},
};
</script>

<style lang="scss">
</style>
