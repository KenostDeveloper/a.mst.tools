<template>
	<div class="copo std-statistics">
		<h1 class="title-mini">
			<img class="mst-image-org" :src="org_profile?.image" alt="" />{{ org_profile.name }}
		</h1>
		<!-- {{org_stores}} -->
		<v-table
			:items_data="org_stores.items"
			:total="org_stores.total"
			:pagination_items_per_page="this.pagination_items_per_page"
			:pagination_offset="this.pagination_offset"
			:page="this.page_modal"
			:table_data="this.table_stores"
			:filters="{}"
			:link_row="link_row"
			title="Склады"
			class="mb-5 std-statistics__warehouse-table"
		>
		</v-table>

		<!-- <div class="d-col-md-12" :class="{'loading': loading_products}"> -->
		<div class="panel-widget panel-widget-top-nomoney std-statistics__table-wrapper">
			<v-table
				:items_data="products.products"
				:total="products.total"
				:pagination_items_per_page="this.pagination_items_per_page"
				:pagination_offset="this.pagination_offset"
				:page="this.page"
				:table_data="tableData"
				:filters="this.products_filters"
				@filter="filter"
				@sort="filter"
				@paginate="paginate"
				title="Статистика"
				class="widget_table std-statistics__table std-statistics-table--align"
			>
				<template v-slot:desc>
					<div class="mst-alert mst-alert-info mb-2 mt-2">
						Параметр <b>«Дней с Out Of Stock»</b> расчитывается за последний календарный
						месяц.<br />Фильтры <b>«Категория товара»</b> и
						<b>«Производитель»</b> работает только с теми остатками, с которыми
						произошло сопоставление с карточками товаров из нашего справочника.
					</div>
				</template>
			</v-table>
			<!-- </div> -->
		</div>
	</div>

	<button class="std-statistics__up-button visible-mobile-l" @click="scrollToTop"></button>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import vTable from "../components/table/v-table.vue";
import Chart from "primevue/chart";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import RadioButton from "primevue/radiobutton";
import router from "../router";
import { sendMetrik } from '../utils/metrika'

export default {
	name: "ProfileProducts",
	props: {
		pagination_items_per_page: {
			type: Number,
			default: 25,
		},
		pagination_offset: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {
			windowWidth: 1920,

			page: 1,
			pagination_items_per_page: 25,
			avg_info: {
				remains: 0,
				no_money: 0,
				sales_speed: 0,
			},
			products_filters: {
				name: {
					name: "Наименование, артикул",
					placeholder: "Наименование, артикул",
					type: "text",
				},
				no_motion: {
					name: "Дней без движения",
					placeholder: "Дней без движения",
					type: "number",
					step: 10,
				},
				vendor: {
					name: "Производитель",
					placeholder: "Выберите производителя",
					type: "dropdown",
					values: this.getvendors,
				},
				catalog: {
					name: "Категория товара",
					placeholder: "Выберите категорию",
					type: "tree",
					values: this.getcatalog,
				},
				minuses: {
					name: "Только отрицательные значения",
					placeholder: "Только отрицательные значения",
					type: "checkbox",
				},
				instock: {
					name: "Только в наличии",
					placeholder: "Только в наличии",
					type: "checkbox",
				},
			},
			link_row: {
				link_to: "statistics_id",
				link_params: {
					id: this.$route.params.id,
					store_id: "id",
				},
			},
			table_stores: {
				image: {
					label: "Фото",
					type: "image",
					baseurl: true,
				},
				name_short: {
					label: "Название",
					type: "link",
					link_to: "statistics_id",
					link_params: {
						id: this.$route.params.id,
						store_id: "id",
					},
				},
				active: {
					label: "Активно",
					type: "boolean",
				},
				address_short: {
					label: "Адрес",
					type: "text",
				},
				// vendor_article: {
				//   label: 'Артикул',
				//   type: 'text',
				//   sort: true
				// },
				// pagetitle: {
				//   label: 'Наименование',
				//   type: 'text',
				//   sort: true
				// },
				// parent_name: {
				//   label: 'Категория',
				//   type: 'text',
				//   sort: true
				// }
			},
			product_table_data: {
				image: {
					label: "Фото",
					type: "image",
				},
				article: {
					label: "Артикул",
					type: "text",
					sort: true,
				},
				name: {
					label: "Наименование",
					type: "text",
					sort: true,
				},
				price: {
					label: "Цена товара",
					type: "text",
					sort: true,
				},
				available: {
					label: "Остаток сейчас",
					type: "text",
					sort: true,
				},
				sales_30: {
					label: "Продаж за 30 дней",
					type: "text",
					sort: true,
				},
				purchase_speed: {
					label: "Скорость продажи шт/день",
					type: "text",
					sort: true,
				},
				out_of_stock_days: {
					label: "Дней с Out Of Stock",
					type: "text",
					sort: true,
				},
				remains_history: {
					label: "Изменение остатков",
					type: "gist",
					sort: false,
				},
				no_money: {
					label: "Упущенная выручка",
					type: "text",
					sort: true,
				},
				forecast_all: {
					label: "Прогноз остатков на завтра / 7 дней",
					type: "text",
					sort: true,
				},
			},
		};
	},
	methods: {
		sendMetrik: sendMetrik,
		...mapActions([
			"org_get_stores_from_api",
			"org_profile_from_api",
			"get_data_from_api",
			"get_vendors_from_api",
			"get_catalog_from_api",
		]),
		filter(data) {
			this.page = 1;
			this.loading_products = true;
			this.get_data_from_api(data).then(() => {
				this.avg_info.remains = this.products.avg_info?.remains;
				this.avg_info.no_money = this.products.avg_info.no_money;
				this.avg_info.sales_speed = this.products.avg_info.sales_speed;
				this.loading_products = false;
			});
		},
		paginate(data) {
			this.page = data.page;
			this.loading_products = true;
			this.get_data_from_api(data).then(() => {
				this.avg_info.remains = this.products.avg_info?.remains;
				this.avg_info.no_money = this.products.avg_info.no_money;
				this.avg_info.sales_speed = this.products.avg_info.sales_speed;
				this.loading_products = false;
			});
		},

		setWindowWidth(value) {
			this.windowWidth = value;
		},
		scrollToTop() {
			window.scrollTo({
				top: 0,
				behavior: "smooth",
			});
		},
	},
	created() {
		this.setWindowWidth(window.innerWidth);
		window.addEventListener("resize", () => this.setWindowWidth(window.innerWidth));
	},
	mounted() {
		this.org_get_stores_from_api({
			action: "get/stores",
			id: this.$route.params.id,
		});
		this.org_profile_from_api({
			action: "get/org/profile",
			id: router.currentRoute._value.params.id,
		});
		this.get_data_from_api({
			page: this.page,
			perpage: this.pagination_items_per_page,
		}).then(() => {});
		this.get_vendors_from_api();
		this.get_catalog_from_api();
	},
	components: { vTable, Chart, TabView, TabPanel, RadioButton },
	computed: {
		...mapGetters(["org_stores", "org_profile", "products", "getvendors", "getcatalog"]),
		tableData() {
			if (this.windowWidth <= 480) {
				return {
					article: this.product_table_data.article,
					name: this.product_table_data.name,
					remains_history: this.product_table_data.remains_history,
				};
			}
			return this.product_table_data;
		},
	},
	watch: {
		products(newVal, oldVal) {
			if (typeof newVal === "object") {
				this.avg_info.remains = newVal.avg_info?.remains;
				if (Object.prototype.hasOwnProperty.call(newVal.avg_info, "no_money")) {
					this.avg_info.no_money = newVal.avg_info.no_money;
				} else {
					this.avg_info.no_money = 0;
				}
				if (Object.prototype.hasOwnProperty.call(newVal.avg_info, "sales_speed")) {
					this.avg_info.sales_speed = newVal.avg_info.sales_speed;
				} else {
					this.avg_info.sales_speed = 0;
				}
			} else {
				this.avg_info.remains = 0;
				this.avg_info.no_money = 0;
				this.avg_info.sales_speed = 0;
			}
		},
		getvendors(newVal, oldVal) {
			this.products_filters.vendor.values = newVal;
		},
		getcatalog(newVal, oldVal) {
			this.products_filters.catalog.values = newVal;
		},
	},
};
</script>

<style lang="scss"></style>
