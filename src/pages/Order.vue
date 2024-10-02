<template>
	<section class="clients order">
		<Breadcrumbs />

		<div class="order__header">
			<div class="std-title__container order__title-container">
				<h1 class="std-title">Заказ № {{ this.$route.params.order_id }} от {{ this.orderData?.createdon }}</h1>
				<div class="std-title__description" v-if="this.orderData?.status_name">
          <b>{{ this.orderData?.status_name }}</b>
					<!-- {{ this.orderData }} <br/>
					{{ this.organization }} -->
        </div>
			</div>
			<div class="order-confirm" v-if="this.orderData?.stores_available != 0 && this.organization?.store">
				<p class="order-confirm__text" v-if="this.orderData?.stage_description">{{ this.orderData?.stage_description }}</p>
				<button
					:disabled="isLoading == true" :class="{ 'dart-btn-loading': isLoading }" 
					@click="this.orderData?.stage_check_code? check_code() : change_ststatus()" 
					class="dart-btn dart-btn-primary order-confirm__button"
				>
					{{ this.orderData?.transition_anchor }}
				</button>
			</div>
		</div>

		<div class="order-info">
			<h2 class="order__title order-info__title">Информация о заказе</h2>

			<div class="order-info__text-container">
				<!-- <div class="order-info__col"> -->
					<article class="order-info__row">
						<span class="order-info__label">ФИО покупателя</span>
						<span class="order-info__value">{{ this.orderData?.customer }}</span>
					</article>
					<article v-if="this.orderData?.delivery !== 'Самовывоз'" class="order-info__row">
						<span class="order-info__label">Адрес доставки</span>
						<span class="order-info__value"
							>{{ this.orderData?.address || '???' }}
						</span>
					</article>
				<!-- </div> -->
				<!-- <div class="order-info__col"> -->
					<article class="order-info__row">
						<span class="order-info__label">Номер телефона</span>
						<span class="order-info__value">{{ this.orderData?.customer_phone }}</span>
					</article>
					<article class="order-info__row">
						<span class="order-info__label">Email</span>
						<span class="order-info__value">{{ this.orderData?.customer_email }}</span>
					</article>
				<!-- </div> -->
				<!-- <div class="order-info__col"> -->
					<article  v-if="this.orderData?.delivery !== 'Самовывоз'" class="order-info__row">
						<span class="order-info__label">Транспортная компания</span>
						<span class="order-info__value">{{ this.orderData?.delivery_company || '???' }}</span>
					</article>
					<article class="order-info__row">
						<span class="order-info__label">Тип доставки</span>
						<span class="order-info__value">{{ this.orderData?.delivery }}</span>
					</article>
				<!-- </div> -->
			</div>
		</div>

		<div class="order-structure">
			<h2 class="order__title order-structure__title">Состав заказа</h2>

			<table class="std-table">
				<thead class="std-table__head">
					<tr class="std-table__row">
						<th class="std-table__hcol">Фото</th>
						<th class="std-table__hcol">Наименование</th>
						<th class="std-table__hcol">Артикул</th>
						<th class="std-table__hcol">Кол-во</th>
						<th class="std-table__hcol">Цена</th>
						<th class="std-table__hcol">Сумма</th>
					</tr>
				</thead>
				<tbody class="std-table__body">
					<tr v-for="product in this.productsData" class="std-table__row">
						<td class="std-table__col">
							<img
								:src="product.image"
								:alt="product.name"
								class="order-structure__product-img"
							/>
						</td>
						<td class="std-table__col">{{ product.name }}</td>
						<td class="std-table__col">{{ product.article }}</td>
						<td class="std-table__col">{{ product.count }} шт</td>
						<td class="std-table__col">{{ product.price }} ₽</td>
						<td class="std-table__col">{{ product.cost }} ₽</td>
					</tr>
				</tbody>
			</table>
		</div>

		<Dialog
			v-model:visible="this.showShip"
			header="Секретный ключ"
			class="order-dialog"
			:style="{ width: '450px' }"
		>
			<form class="order-secret">
				<input v-model="this.code" type="text" name="key" id="key" class="order-secret__input" />
				<button type="button" class="dart-btn dart-btn-primary order-secret__button" @click="() => formSubmit()">Отправить</button>
			</form>
		</Dialog>

		<Dialog
			v-model:visible="this.showShip2"
			header="Секретный ключ"
			class="order-dialog order-dialog--no-close"
			:style="{ width: '450px' }"
		>
			<div class="order-secret">
				<h3 class="order-secret__title">Код принят</h3>
				<img src="../assets/images/icons/check.svg" alt="" class="order-secret__img" />
				<button class="dart-btn dart-btn-primary order-secret__button" @click="() => {this.showShip2 = false;}">Ок</button>
			</div>
		</Dialog>

		<Dialog
			v-model:visible="this.showShip3"
			header="Секретный ключ"
			class="order-dialog order-dialog--no-close"
			:style="{ width: '450px' }"
		>
			<div class="order-secret">
				<h3 class="order-secret__title">Код не принят</h3>
				<img src="../assets/images/icons/not-check.svg" alt="" class="order-secret__img" />
				<button class="dart-btn dart-btn-primary order-secret__button" @click="this.showShip3 = false">Ок</button>
			</div>
		</Dialog>
	</section>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Dropdown from "primevue/dropdown";
import Dialog from "primevue/dialog";
import router from '../router'
import Breadcrumbs from "../components/Breadcrumbs.vue";

export default {
	data() {
		return {
			orderData: {},
			storeData: {},
			productsData: [],
			code: null,
			isLoading: false,
			organization: [],
			
			showShip: false,
      showShip2: false,
      showShip3: false,
		};
	},
	methods: {
		...mapActions(["get_order_from_api", 'change_status', 'org_get_from_api']),
		formSubmit () {
			this.$load(async () => {
				const data = await this.$api.checkCode.get({
					code: this.code,
					type: 'code/check',
					id: router.currentRoute._value.params.id,
					order_id: router.currentRoute._value.params.order_id
				})
				this.response = data.data.data
				if (this.response.success) {
					this.change_ststatus()
					this.showShip = false;
          this.showShip2 = true;
				}else{
					this.showShip = false;
					this.showShip3 = true;
				}
			})
		},
		check_code () {
			this.showShip = true
		},
		change_ststatus () {
			this.isLoading = !false
			this.change_status().then(res => {
				this.isLoading = !true
			}).catch(error => {
				console.error(error)
			})
		}
	},
	mounted() {
		this.get_order_from_api();
	},
	computed: {
		...mapGetters(["order", "store", "order_products", 'orgs']),
	},
	components: { Dropdown, Dialog, Breadcrumbs },
	watch: {
		order: function (newVal, oldVal) {
			this.orderData = newVal;
		},
		store: function (newVal, oldVal) {
			this.storeData = newVal;
		},
		order_products: function (newVal, oldVal) {
			this.productsData = newVal;
		},
		orgs: function (newVal, oldVal) {
			if (newVal) {
				const org = newVal.find((el) => el.id === this.$route.params.id);
				if (org) {
					this.organization = org;
				}
			}
		},
	},
};
</script>

<style lang="scss" scoped></style>
