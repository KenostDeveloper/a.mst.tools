<template>
	<section class="clients retails">
        <!-- <div class="std-breadcrumbs">
            МАРКЕТСОВИЧ / Розничные заказы
        </div> -->

		<div class="std-title__container">
			<h1 class="std-title title-h1">Розничные заказы</h1>
		</div>

		<!-- <div class="flex dart-row">
			<div class="d-col-md-3 retails__input-wrapper">
				<div class="form_input_group input_pl input-parent required">
					<input
						type="text"
						id="filter_name"
						placeholder="Поиск по полям заказа"
						class="dart-form-control"
						v-model="filter.name"
						@input="setFilter('filter')"
					/>
					<label for="product_filter_name" class="s-complex-input__label"
						>Поиск по полям заказа</label
					>
					<div class="form_input_group__icon">
						<img src="../assets/images/icons/input-search.svg" alt="" />
					</div>
				</div>
			</div>
			<div class="d-col-md-3 retails__dropdown-wrapper">
				<div class="dart-form-group">
					<Dropdown
                        class="retails__dropdown"
						optionLabel="label"
						optionValue="value"
						v-model="filter.store"
						:options="[
							{
								label: 'Оплачен',
								value: '1',
							},
							{
								label: 'Не оплачен',
								value: '2',
							},
						]"
						filter
						showClear
						placeholder="Статус"
						@change="setFilter"
					/>
				</div>
			</div>
            <div class="d-col-md-3 retails__dropdown-wrapper">
				<div class="dart-form-group">
					<Dropdown
                        class="retails__dropdown"
						optionLabel="label"
						optionValue="value"
						v-model="filter.store"
						:options="[
							{
								label: '28.08.2024',
								value: '1',
							},
							{
								label: '29.08.2024',
								value: '2',
							},
                            {
                                label: '30.08.2024',
                                value: '3',
                            },
                            {
                                label: '31.08.2024',
                                value: '4',
                            }
						]"
						filter
						showClear
						placeholder="Дата"
						@change="setFilter"
					/>
				</div>
			</div>
		</div> -->

		<div class="retails__table-container">
            <table class="std-table">
                <thead class="std-table__head">
                    <tr class="std-table__row">
                        <th class="std-table__hcol">Номер</th>
                        <th class="std-table__hcol">Дата заказа</th>
                        <th class="std-table__hcol">Статус</th>
                        <th class="std-table__hcol">Дата доставки</th>
                        <th class="std-table__hcol">Магазин</th>
                    </tr>
                </thead>
                <tbody class="std-table__body">
                    <tr v-for="item in orders.orders" v-bind:key="item.id" class="std-table__row" style="cursor: pointer" @click.prevent="$router.push({ name: 'retail_orders_id', params: { id: this.$route.params.id, order_id: item.id } })">
                        <td class="std-table__col">
							<div class="retails__number">
								{{item.num}}
								<!-- <i class="pi pi-info-circle retails__number-icon"></i> -->
							</div>
                        </td>
                        <td class="std-table__col"><router-link class="link-no-style" :to="{ name: 'retail_orders_id', params: { id: this.$route.params.id, order_id: item.id } }">{{item.createdon}}</router-link></td>
                        <td class="std-table__col" :style="'color: #' + item.status_color"><router-link class="link-no-style" :to="{ name: 'retail_orders_id', params: { id: this.$route.params.id, order_id: item.id } }">{{item.status_name}}</router-link></td>
                        <td class="std-table__col"><router-link class="link-no-style" :to="{ name: 'retail_orders_id', params: { id: this.$route.params.id, order_id: item.id } }">???</router-link></td>
                        <td class="std-table__col"><router-link class="link-no-style" :to="{ name: 'retail_orders_id', params: { id: this.$route.params.id, order_id: item.id } }">{{ item.store }}</router-link></td>
                    </tr>
                </tbody>
            </table>

            <!-- TODO вставить пагинацию -->
        </div>
	</section>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Dropdown from "primevue/dropdown";

export default {
	data() {
		return {
			
		};
	},
	methods: {
		...mapActions(["get_orders_from_api"]),
		filter (data) {
			console.log(data)
			this.get_orders_from_api(data)
		},
		paginate (data) {
			console.log(data)
			this.get_orders_from_api(data)
		},
	},
	mounted() {
		this.get_orders_from_api({
			page: this.page,
			perpage: this.pagination_items_per_page
		})
	},
	computed: {
		...mapGetters(['orders']),
	},
	components: { Dropdown },
	watch: {
	},
};
</script>

<style lang="scss" scoped></style>
