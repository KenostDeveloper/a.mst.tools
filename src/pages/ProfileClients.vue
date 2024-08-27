<template>
	<section class="clients">
		<div class="std-title__container">
			<h1 class="std-title">Мои клиенты</h1>
			<p class="std-title__description">
				Доступные организации, которые являются вашими поставщиками
			</p>
		</div>

		<div class="clients__card-container">
			<article class="clients__card client-card" v-for="item in this.stores.items" v-bind:key="item.id">
				<div class="client-card__content">
					<img :src="item.image" alt="" class="client-card__img" />
					<div class="client-card__info">
						<h2 class="client-card__title">«{{ item.name }}»</h2>
						<p class="client-card__address">Базовая скидка: {{ item.base_sale }}%</p>
					</div>
				</div>
				<button class="dart-btn dart-btn-primary client-card__button">Посмотреть остатки</button>
			</article>
		</div>
	</section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
	data() {
		return {
			stores: {
				items: [],
				total: -1
			},
		};
	},
	methods: {
		...mapActions([
			'get_dilers_from_api',
			'set_diler_to_api'
		]),
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
	},
	computed: {
		...mapGetters([
			'dilers'
		])
  	},
	watch: {
		dilers: function (newVal, oldVal) {
			console.log('dilers', newVal)
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
	}
};
</script>

<style lang="scss" scoped></style>
