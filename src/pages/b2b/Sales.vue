<template>
	<!-- <Toast /> -->
	<ConfirmDialog></ConfirmDialog>
	<Breadcrumbs class="std-breadcrumbs--margin" />
	<TabView 
		v-if="organization.type != 1"
		v-model:activeIndex="tab"
		:lazy="true"
		:scrollable="true"
		class="tab-custom"
		@tab-change="updateTab">
		<TabPanel header="Акции">
			<div class="flex align-items-center justify-content-space-between mb-4">
				<div class="title-h1">Оптовые акции</div>
				<RouterLink
					:to="{ name: 'org_sales_add', params: { id: $route.params.id } }"
					class="dart-btn dart-btn-primary"
					>Создать акцию</RouterLink
				>
			</div>
			<v-table
				:items_data="actions.items"
				:total="actions.total"
				:pagination_items_per_page="this.pagination_items_per_page"
				:pagination_offset="this.pagination_offset"
				:page="this.page"
				:table_data="getTableData"
				:filters="this.filters"
				:title="''"
				@filter="filter"
				@sort="filter"
				@paginate="paginate"
				@editElem="editElem"
				@approveElem="approveElem"
				@deleteElem="deleteElem"
			>
			</v-table>
		</TabPanel>
		<TabPanel header="Индивидуальные скидки">
			<profileDiscounts></profileDiscounts>
		</TabPanel>
		<TabPanel header="Комплекты товаров">
			<div class="flex align-items-center justify-content-space-between mb-4">
				<div class="title-h1">Мои комплекты</div>
				<RouterLink
					:to="{ name: 'complect_add', params: { id: $route.params.id } }"
					class="dart-btn dart-btn-primary"
					>Создать комлект</RouterLink
				>
			</div>
			<v-table
				:items_data="optcomplects.complects"
				:total="optcomplects.total"
				:pagination_items_per_page="this.pagination_items_per_page_complects"
				:pagination_offset="this.pagination_offset_complects"
				:page="this.page_complects"
				:table_data="this.table_data_complects"
				:filters="this.filters_complects"
				:title="''"
				@filter="filterComplects"
				@sort="filterComplects"
				@paginate="paginateComplects"
				@editElem="editComplects"
				@approveElem="approveComplects"
				@deleteElem="deleteComplects"
			>
			</v-table>
		</TabPanel>
		<TabPanel header="Коллекции товаров">
			<div>
				<Groups />
			</div>
		</TabPanel>
	</TabView>

	<Dialog
		v-model:visible="this.modals.diler"
		header="Редактирование дилера"
		:style="{ width: '400px' }"
	>
		<div class="kenost-modal-price">
			<span class="title">{{ form.diler.name }}</span>
			<div class="mt-2">
				<div class="kenost-wiget">
					<p>Базовая скидка на товар, %</p>
					<InputNumber
						v-model="this.form.diler.base_sale"
						inputId="horizontal-buttons"
						:step="0.1"
						min="0"
						max="100"
						suffix=" %"
						@update:modelValue="delayUpdate"
						incrementButtonIcon="pi pi-plus"
						decrementButtonIcon="pi pi-minus"
					/>
				</div>
			</div>
			<div class="kenost-modal-price__button kenost-modal-price__flex">
				<div
					class="dart-btn dart-btn-primary"
					@click.prevent="setSale"
					:class="{ 'dart-btn-loading': diler_loading }"
				>
					Подтвердить
				</div>
			</div>
		</div>
	</Dialog>

	<Dialog v-model:visible="this.modal_approve" header=" " :style="{ width: '340px' }">
        <div class="kenost-not-produc">
            <img src="/images/icons_milen/action-error.png" alt="">
            <b>Продлите сроки акции</b>
            <p>Для активации этой акции необходимо продлить ее сроки.</p>
            <div class="a-dart-btn a-dart-btn-primary" @click="this.modal_approve = false">Понятно</div>
        </div>
    </Dialog>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import vTable from "../../components/table/v-table.vue";
import { RouterLink } from "vue-router";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import Dialog from "primevue/dialog";
import InputNumber from "primevue/inputnumber";
import ConfirmDialog from "primevue/confirmdialog";
import Toast from "primevue/toast";
import router from "../../router";
import Breadcrumbs from "../../components/Breadcrumbs.vue";
import Groups from '../../components/groups/Groups.vue'
import ProfileDiscounts from "../../components/opt/ProfileDiscounts.vue";

export default {
	name: "ProfileSales",
	props: {
		pagination_items_per_page: {
			type: Number,
			default: 25,
		},
		pagination_offset: {
			type: Number,
			default: 0,
		},
		pagination_items_per_page_complects: {
			type: Number,
			default: 25,
		},
		pagination_offset_complects: {
			type: Number,
			default: 0,
		},
		pagination_items_per_page_dilers: {
			type: Number,
			default: 25,
		},
		pagination_offset_dilers: {
			type: Number,
			default: 0,
		},
		pagination_items_per_page_dilers_opts: {
			type: Number,
			default: 25,
		},
		pagination_offset_dilers_opts: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {
			windowWidth: 1920,
			tab: 0,
			modals: {
				diler: false,
			},
			form: {
				diler: {
					name: "",
					address: "",
					base_sale: 0,
					id: 0,
				},
			},
			stores: {
				items: [],
				total: -1,
			},
			warehouses: {
				items: [],
				total: -1,
			},
			modal_approve: false,
			diler_loading: false,
			modal_discounts: false,
			page: 1,
			page_complects: 1,
			page_dilers: 1,
			optpage: 1,
			optfilters: {
				filter: {
					name: "Наименование, адрес",
					placeholder: "Введите наименование или адрес",
					type: "text",
				},
				region: {
					name: "Регион",
					placeholder: "Выберите регион",
					type: "tree",
					values: this.getregions,
				},
				our: {
					name: "Мои поставщики",
					placeholder: "Мои поставщики",
					type: "checkbox",
					values: 1,
				},
			},
			table_data_dilers: {
				name: {
					label: "Наименование",
					type: "link",
					//TODO
					// link_to: 'org_diler',
					// link_params: {
					//   diler_id: 'id'
					// }
				},
				warehouse: {
					label: "Склад",
					type: "text",
				},
				base_sale: {
					label: "Базовая скидка, %",
					type: "text",
				},
				actions: {
					label: "Действия",
					type: "actions",
					sort: false,
					available: {
						edit: {
							icon: "pi pi-pencil",
							label: "Редактировать",
						},
					},
				},
			},
			filters: {
				name: {
					name: "Наименование",
					placeholder: "Наименование",
					type: "text",
				},
			},
			filters_complects: {
				name: {
					name: "Наименование",
					placeholder: "Наименование",
					type: "text",
				},
			},
			table_data: {
				id: {
					label: "Номер",
					type: "text"
				},
				image: {
					label: "Баннер",
					type: "image",
					baseurl: false,
				},
				name: {
					label: "Наименование",
					type: "link",
					// TODO
					link_to: "promotion",
					link_params: {
						id: this.$route.params.id,
						action: "id",
					},
					sort: true,
				},
				store_name: {
					label: "Склад",
					type: "text",
				},
				date_from: {
					label: "Действует с",
					type: "text",
					sort: true,
				},
				date_to: {
					label: "Действует до",
					type: "text",
					sort: true,
				},
				active: {
					label: "Активно",
					type: "boolean",
				},
				actions: {
					label: "Действия",
					type: "actions",
					sort: false,
					available: {
						edit: {
							icon: "pi pi-pencil",
							label: "Редактировать",
						},
						approve: {
							icon: "pi pi-power-off",
							label: "Включить",
						},
						delete: {
							icon: "pi pi-trash",
							label: "Удалить",
						},
					},
				},
			},
			table_data_complects: {
				name: {
					label: "Наименование",
					type: "link",
					link_to: "complect_edit",
					link_params: {
						id: this.$route.params.id,
						complect_id: "id",
					},
					sort: true,
				},
				active: {
					label: "Активно",
					type: "boolean",
				},
				actions: {
					label: "Действия",
					type: "actions",
					sort: false,
					available: {
						edit: {
							icon: "pi pi-pencil",
							label: "Редактировать",
						},
						// approve: {
						// 	icon: "pi pi-power-off",
						// 	label: "Включить",
						// },
						delete: {
							icon: "pi pi-trash",
							label: "Удалить",
						},
					},
				},
			},
		};
	},
	methods: {
		...mapActions([
			"get_sales_to_api",
			"set_sales_to_api",
			"opt_get_complects",
			"opt_api",
			"get_dilers_from_api",
			"set_diler_to_api",
			"get_organization_from_api",
			"get_regions_from_api",
			"get_opts_from_api",
			"unset_opts",
		]),
		updateTab(e){
			const tab = localStorage.getItem('sales.tabs');
			if(tab != e.index){
				localStorage.setItem('sales.tabs', e.index);
			}			
		},
		filter(data) {
			data.type = 1;
			this.get_sales_to_api(data);
		},
		filterComplects(data) {
			data.action = "complects/get";
			data.id = router.currentRoute._value.params.id;
			this.opt_get_complects(data);
		},
		filterDilers(data) {
			this.get_dilers_from_api(data);
		},
		paginateDilers(data) {
			this.get_dilers_from_api(data);
		},
		paginate(data) {
			this.page = data.page;
			data.type = 1;
			this.get_sales_to_api(data);
		},
		paginateComplects(data) {
			this.page_complects = data.page;
			data.action = "complects/get";
			data.id = router.currentRoute._value.params.id;
			this.opt_get_complects(data);
		},
		editElem(value) {
			router.push({
				name: "org_sales_edit",
				params: { id: this.$route.params.id, sales_id: value.id },
			});
		},
		editDiler(value) {
			this.form.diler.name = value.name;
			this.form.diler.warehouse_id = value.warehouse_id;
			this.form.diler.id = value.obj_id;
			this.form.diler.base_sale = value.base_sale;
			this.modals.diler = !this.modals.diler;
		},
		setSale() {
			this.diler_loading = true;
			const data = this.form.diler;
			data.action = "diler/set";
			this.$load(async () => {
				await this.set_diler_to_api(data)
					.then((result) => {
						this.diler_loading = false;
						this.modals.diler = false;
						this.get_dilers_from_api({
							type: 1,
							page: this.page_dilers,
							perpage: this.pagination_items_per_page_dilers,
						});
					})
					.catch((result) => {
						console.log(result);
					});
			});
		},
		editComplects(value) {
			router.push({
				name: "complect_edit",
				params: { id: this.$route.params.id, complect_id: value.id },
			});
		},
		approveElem(value) {
			this.$load(async () => {
				await this.set_sales_to_api({
					action: "off/on",
					store_id: value.store_id,
					action_id: value.id,
					id: router.currentRoute._value.params.id,
				})
					.then((result) => {
						if(result.data.data.status){
							this.get_sales_to_api({
								page: this.page,
								perpage: this.pagination_items_per_page,
								type: 1,
							});
						} else {
							this.modal_approve = true
						}
						
					})
					.catch((result) => {
						console.log(result);
					});
			});
		},
		approveComplects(value) {
			this.$load(async () => {
				await this.opt_api({
					action: "complect/approve",
					store_id: router.currentRoute._value.params.id,
					complect_id: value.id,
				})
					.then((result) => {
						this.page_complects = 1;
						this.opt_get_complects({
							action: "complects/get",
							page: this.page_complects,
							perpage: this.pagination_items_per_page_complects,
							id: router.currentRoute._value.params.id,
						});
					})
					.catch((result) => {
						console.log(result);
					});
			});
		},
		deleteElem(value) {
			this.$load(async () => {
				await this.set_sales_to_api({
					action: "delete",
					id: router.currentRoute._value.params.id,
					action_id: value.id,
				})
					.then((result) => {
						this.get_sales_to_api({
							page: this.page,
							perpage: this.pagination_items_per_page,
							type: 1,
						});
					})
					.catch((result) => {
						console.log(result);
					});
			});
		},
		deleteComplects(value) {
			this.$load(async () => {
				await this.opt_api({
					action: "complect/delete",
					store_id: router.currentRoute._value.params.id,
					complect_id: value.id,
				})
					.then((result) => {
						this.page_complects = 1;
						this.opt_get_complects({
							action: "complects/get",
							page: this.page_complects,
							perpage: this.pagination_items_per_page_complects,
							id: router.currentRoute._value.params.id,
						});
					})
					.catch((result) => {
						console.log(result);
					});
			});
		},
		optfilter(data) {
			this.get_opts_from_api(data);
		},
		optpaginate(data) {
			this.get_opts_from_api(data);
		},
		optUpdate(data) {
			this.get_opts_from_api({
				page: this.optpage,
				perpage: this.pagination_items_per_page_dilers_opts,
			});
		},
	},
	mounted() {
		this.windowWidth = window.innerWidth;
		window.addEventListener("resize", () => {
			this.windowWidth = window.innerWidth;
		});
		this.get_organization_from_api().then(() => {
			this.get_regions_from_api().then((this.optfilters.region.values = this.getregions));
			this.get_opts_from_api({
				page: this.optpage,
				perpage: this.pagination_items_per_page_dilers_opts,
			});
		});
		this.get_sales_to_api({
			page: this.page,
			perpage: this.pagination_items_per_page,
			type: 1,
		});
		this.opt_get_complects({
			action: "complects/get",
			page: this.page_complects,
			perpage: this.pagination_items_per_page_complects,
			id: router.currentRoute._value.params.id,
		});
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
		setTimeout(() => {
			const tab = localStorage.getItem('sales.tabs');
			if(tab){
				this.tab = Number(tab)
			}else{
				this.tab = 0
			}
		}, 500);
	},
	components: {
		vTable,
		Toast,
		ConfirmDialog,
		RouterLink,
		TabView,
		TabPanel,
		Dialog,
		InputNumber,
		Breadcrumbs,
		Groups,
		ProfileDiscounts
	},
	computed: {
		...mapGetters(["actions", "optcomplects", "dilers", "organization", "getregions", "opts"]),
		getTableData() {
			if (this.windowWidth <= 480) {
				return {
					name: this.table_data.name,
					store_name: this.table_data.store_name,
					active: this.table_data.active,
					actions: this.table_data.actions,
				};
			}

			return this.table_data;
		},
	},
	watch: {
		getregions: function (newVal, oldVal) {
			this.optfilters.region.values = newVal;
		},
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
		opts: function (newVal, oldVal) {
			if (typeof newVal === "object") {
				if (Object.prototype.hasOwnProperty.call(newVal, "items")) {
					this.warehouses.items = newVal.items;
				} else {
					this.warehouses.items = [];
				}
				if (Object.prototype.hasOwnProperty.call(newVal, "total")) {
					this.warehouses.total = newVal.total;
				} else {
					this.warehouses.total = 0;
				}
			} else {
				this.warehouses.items = [];
				this.warehouses.total = 0;
			}
		},
	},
};
</script>

<style lang="scss">
.tab-custom {
	.p-tabview-nav {
		margin: 0 !important;
		border: 0 !important;
	}

	.p-tabview-header {
		padding: 0 !important;
	}

	.p-tabview-nav-link {
		border-color: #282828 !important;
		color: #282828 !important;
		text-decoration: none !important;
	}

	.p-tabview-ink-bar {
		height: 3px;
		padding: 0;
		background: #282828 !important;
	}
}
</style>
