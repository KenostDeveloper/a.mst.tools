<template>
	<section class="clients">
		<div class="std-title__container">
			<h1 class="std-title title-h1">Мои клиенты</h1>
			<p class="std-title__description">
				Доступные организации, которые являются вашими поставщиками
			</p>
		</div>

		<div class="flex dart-row">
			<div class="d-col-md-3">
				<div class="form_input_group input_pl input-parent required">
					<input
						type="text"
						id="filter_name"
						placeholder="Введите наименование"
						class="dart-form-control"
						v-model="filter.name"
						@input="setFilter('filter')"
					/>
					<label for="product_filter_name" class="s-complex-input__label">Введите наименование</label>
					<div class="form_input_group__icon">
						<i class="d_icon d_icon-search"></i>
					</div>
				</div>
			</div>
			<div class="d-col-md-3">
				<div class="dart-form-group ">
					<Dropdown optionLabel="label" optionValue="value" v-model="filter.store" :options="this.stores_list" filter showClear placeholder="Выберите склад" @change="setFilter" />
				</div>
			</div>

			
		</div>

		<div class="clients__card-container">
			<article class="clients__card client-card" v-for="item in this.stores.items" v-bind:key="item.id">
				<div class="client-card__content">
					<img :src="item.image" alt="" class="client-card__img" />
					<div class="client-card__info">
						<h2 class="client-card__title">«{{ item.name }}»</h2>
						<p class="client-card__address">Склад: {{ item.warehouse}}</p>
						<!-- <p class="client-card__address">Базовая скидка: {{ item.base_sale }}%</p> -->
					</div>
				</div>
				<router-link :to="{ name: 'client_id', params: { id: $route.params.id, client_id: item.id } }" class="link-no-style">
                    <button class="dart-btn dart-btn-primary client-card__button">Посмотреть остатки</button>
                </router-link>
				
			</article>
		</div>
	</section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Dropdown from 'primevue/dropdown'

export default {
	data() {
		return {
			stores: {
				items: [],
				total: -1
			},
			store_id: null,
			filter: {
				name: "",
				store: []
			},
			stores_list: []
		};
	},
	methods: {
		...mapActions([
			'get_dilers_from_api',
			'set_diler_to_api',
			'org_get_stores_from_api'
		]),
		setFilter() {
			this.get_dilers_from_api({
				type: 1,
				page: this.page_dilers,
				perpage: this.pagination_items_per_page_dilers,
				filter: this.filter
			})
		}
	},
	mounted() {
		this.get_dilers_from_api({
			type: 1,
			page: this.page_dilers,
			perpage: this.pagination_items_per_page_dilers
		}).then(() => {
			if (this.dilers) {
				if (Object.prototype.hasOwnProperty.call(this.dilers, 'items')) {
				this.stores.items = this.dilers.items
				} else {
				this.stores.items = []
				}
				if (Object.prototype.hasOwnProperty.call(this.dilers, 'total')) {
				this.stores.total = this.dilers.total
				} else {
				this.stores.total = 0
				}
			}
		})

		this.org_get_stores_from_api({
			action: 'get/stores',
			id: this.$route.params.id
		})
	},
	computed: {
		...mapGetters([
			'dilers',
			'org_stores'
		])
  	},
	components: { Dropdown },
	watch: {
		dilers: function (newVal, oldVal) {
			if (typeof newVal === 'object') {
				if (Object.prototype.hasOwnProperty.call(newVal, 'items')) {
				this.stores.items = newVal.items
				} else {
				this.stores.items = []
				}
				if (Object.prototype.hasOwnProperty.call(newVal, 'total')) {
				this.stores.total = newVal.total
				} else {
				this.stores.total = 0
				}
			} else {
				this.stores.items = []
				this.stores.total = 0
			}
		},
		org_stores: function (newVal, oldVal) {
			this.stores_list = []
			for (let i = 0; i < newVal.items.length; i++) {
				this.stores_list.push({ label: newVal.items[i].name, value: newVal.items[i].id })
			}
		},
	}
};
</script>

<style lang="scss" scoped></style>
