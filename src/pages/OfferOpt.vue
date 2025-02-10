<template>
	<Loading v-if="this.loading"/>
	<div class="shipping std-shipping">
		<Breadcrumbs />

		<div class="std-shipping__title-container hidden-tablet-l">
			<h1 class="table-kenost__title std-shipping__title">Предложение № {{ this.offer?.id }}</h1>
			<div class="flex gap-left-2">
				<div v-if="this?.offer?.status == 2" class="dart-btn dart-btn-primary" @click="changeStatus(1)">
					<span>Отправить</span>	
				</div>
				<div v-if="this?.offer?.status == 2" class="dart-btn dart-btn-secondary gap-left-2" @click="deleteOffer()">
					<span>Удалить</span>	
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
					<span>Сумма</span>
					<div class="kenost-table-elem__content">{{ this.offer?.cost }}</div>
				</div>
				<div class="w-full kenost-table-elem">
					<span>Покупатель</span>
					<div class="kenost-table-elem__content gap-2"><img class="kenost-table-elem__logo" :src="this.offer?.from_org_image?.image" v-if="this.offer?.from_org_image?.image">{{ this.offer?.from_org_name }}</div>
				</div>
				<div class="w-full kenost-table-elem">
					<span>Склад покупателя</span>
					<div class="kenost-table-elem__content gap-2">{{ this.offer?.store_name }}</div>
				</div>
				<!-- <div class="w-full kenost-table-elem">
					<span>Отсрочка</span>
					<div class="kenost-table-elem__content">{{ this.order?.delay }}</div>
				</div> -->
				
				<div class="w-full kenost-table-elem">
					<span>Статус</span>
					<div class="kenost-table-elem__content">{{ this.offer.status_name }}</div>
				</div>
			</div>
			
			
			<!-- <div class="kenost-table-line">
				<div><img src="../assets/images/icons/delivery.svg" alt=""></div>
				<span>Доставка</span>
			</div>
			<div class="w-full flex">
				<div class="w-full kenost-table-elem">
					<span>Оплата доставки</span>
					<div class="kenost-table-elem__content">{{ this.order?.payer }}</div>
				</div>
				<div class="w-full kenost-table-elem">
					<span>Срок доставки</span>
					<div class="kenost-table-elem__content">{{ this.order?.day_delivery }} дн. ({{ this.order?.delivery_date }})</div>
				</div>
				<div class="w-full kenost-table-elem">
					<span>Склад</span>
					<div class="kenost-table-elem__content">{{ this.order?.seller_address }}</div>
				</div>
				<div class="w-full kenost-table-elem d-none"></div>
				<div class="w-full kenost-table-elem d-none"></div>
				<div class="w-full kenost-table-elem d-none"></div>
			</div> -->
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
				<b>Итого: {{ Number(this.offer?.cost).toLocaleString('ru') }} ₽</b>
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
			offer: [],
			loading: true
		};
	},
	methods: {
		...mapActions([
            'get_offer_api',
			'offer_api'
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
		deleteOffer(){
			this.loading = true
			this.offer_api({
				action: 'delete',
				id: router.currentRoute._value.params.id,
				offer_id: router.currentRoute._value.params.offer_id,
			}).then(() => {
				router.push({
					name: "clients",
					params: { id: this.$route.params.id },
				});
			})
		}
	},
	mounted() {
		this.get_offer_api({
			action: 'get/offers/clients',
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
		// Checkbox,
		// Swiper,
		// SwiperSlide
		Breadcrumbs,
		Loading
	},
	computed: {
		...mapGetters([
            'offers'
        ]),
	},
	watch: {
		offers: function (newVal, oldVal) {
			this.offer = newVal
		}
	},
};
</script>

<style lang="scss">
</style>
