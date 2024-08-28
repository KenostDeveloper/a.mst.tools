<template>
	<section class="clients retails">
        <div class="std-breadcrumbs">
            МАРКЕТСОВИЧ / Розничные заказы
        </div>

		<div class="std-title__container">
			<h1 class="std-title">Розничные заказы</h1>
		</div>

		<div class="flex dart-row">
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
						<!-- <i class="d_icon d_icon-search"></i> -->
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
		</div>

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
                    <tr class="std-table__row">
                        <td class="std-table__col">
                            <div class="retails__number">
                                123/45678
                                <i class="pi pi-info-circle retails__number-icon"></i>
                            </div>
                        </td>
                        <td class="std-table__col">04.03.2022</td>
                        <td class="std-table__col retails__status--paid">Оплачен</td>
                        <td class="std-table__col">04.03.2022</td>
                        <td class="std-table__col">ООО “Уралспецмаш"</td>
                    </tr>
                    <tr class="std-table__row">
                        <td class="std-table__col">
                            <div class="retails__number">
                                123/45678
                                <!-- <i class="pi pi-info-circle retails__number-icon"></i> -->
                            </div>
                        </td>
                        <td class="std-table__col">04.03.2022</td>
                        <td class="std-table__col retails__status--paid">Оплачен</td>
                        <td class="std-table__col">04.03.2022</td>
                        <td class="std-table__col">ООО “Уралспецмаш"</td>
                    </tr>
                    <tr class="std-table__row">
                        <td class="std-table__col">
                            <div class="retails__number">
                                123/45678
                                <!-- <i class="pi pi-info-circle retails__number-icon"></i> -->
                            </div>
                        </td>
                        <td class="std-table__col">04.03.2022</td>
                        <td class="std-table__col retails__status--paid">Оплачен</td>
                        <td class="std-table__col">04.03.2022</td>
                        <td class="std-table__col">ООО “Уралспецмаш"</td>
                    </tr>
                    <tr class="std-table__row">
                        <td class="std-table__col">
                            <div class="retails__number">
                                123/45678
                                <i class="pi pi-info-circle retails__number-icon"></i>
                            </div>
                        </td>
                        <td class="std-table__col">04.03.2022</td>
                        <td class="std-table__col retails__status--paid">Оплачен</td>
                        <td class="std-table__col">04.03.2022</td>
                        <td class="std-table__col">ООО “Уралспецмаш"</td>
                    </tr>
                    <tr class="std-table__row">
                        <td class="std-table__col">
                            <div class="retails__number">
                                123/45678
                                <!-- <i class="pi pi-info-circle retails__number-icon"></i> -->
                            </div>
                        </td>
                        <td class="std-table__col">04.03.2022</td>
                        <td class="std-table__col retails__status--paid">Оплачен</td>
                        <td class="std-table__col">04.03.2022</td>
                        <td class="std-table__col">ООО “Уралспецмаш"</td>
                    </tr>
                    <tr class="std-table__row">
                        <td class="std-table__col">
                            <div class="retails__number">
                                123/45678
                                <i class="pi pi-info-circle retails__number-icon"></i>
                            </div>
                        </td>
                        <td class="std-table__col">04.03.2022</td>
                        <td class="std-table__col retails__status--paid">Оплачен</td>
                        <td class="std-table__col">04.03.2022</td>
                        <td class="std-table__col">ООО “Уралспецмаш"</td>
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
			stores: {
				items: [],
				total: -1,
			},
			store_id: null,
			filter: {
				name: "",
				store: [],
			},
			stores_list: [],
		};
	},
	methods: {
		...mapActions(["get_dilers_from_api", "set_diler_to_api", "org_get_stores_from_api"]),
		setFilter() {
			this.get_dilers_from_api({
				type: 1,
				page: this.page_dilers,
				perpage: this.pagination_items_per_page_dilers,
				filter: this.filter,
			});
		},
	},
	mounted() {
		this.get_dilers_from_api({
			type: 1,
			page: this.page_dilers,
			perpage: this.pagination_items_per_page_dilers,
		}).then(() => {
			if (this.dilers) {
				if (Object.prototype.hasOwnProperty.call(this.dilers, "items")) {
					this.stores.items = this.dilers.items;
				} else {
					this.stores.items = [];
				}
				if (Object.prototype.hasOwnProperty.call(this.dilers, "total")) {
					this.stores.total = this.dilers.total;
				} else {
					this.stores.total = 0;
				}
			}
		});

		this.org_get_stores_from_api({
			action: "get/stores",
			id: this.$route.params.id,
		});
	},
	computed: {
		...mapGetters(["dilers", "org_stores"]),
	},
	components: { Dropdown },
	watch: {
		dilers: function (newVal, oldVal) {
			if (typeof newVal === "object") {
				if (Object.prototype.hasOwnProperty.call(newVal, "items")) {
					this.stores.items = newVal.items;
				} else {
					this.stores.items = [];
				}
				if (Object.prototype.hasOwnProperty.call(newVal, "total")) {
					this.stores.total = newVal.total;
				} else {
					this.stores.total = 0;
				}
			} else {
				this.stores.items = [];
				this.stores.total = 0;
			}
		},
		org_stores: function (newVal, oldVal) {
			this.stores_list = [];
			for (let i = 0; i < newVal.items.length; i++) {
				this.stores_list.push({ label: newVal.items[i].name, value: newVal.items[i].id });
			}
		},
	},
};
</script>

<style lang="scss" scoped></style>
