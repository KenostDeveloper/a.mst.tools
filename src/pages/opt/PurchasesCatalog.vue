<template>
	<Loading v-if="this.loading" />
	<div v-else class="std-display-contents">
		<div
			v-if="opt_vendors.selected_count > 0 || this.namePathIsNav == 'purchases_offer'"
			class="dart-custom-grid purchases__wrapper"
			:class="{ loading: loading }"
		>
			<!-- <CatalogMenu :items="opt_catalog" /> -->
			<div class="d-col-content purchases">
				<div class="dart-home dart-window">
					<Breadcrumbs class="std-breadcrumbs--margin" :items="opt_products?.breadcrumbs" :name="!$route.params.warehouse_cat_id? 'purchases_catalog' : 'org_opt_waregouse_category'"/>
					<!-- {{ opt_products?.breadcrumbs }} -->
					<!-- <CatalogBreadcrumbs v-if="opt_products?.breadcrumbs" :name="!$route.params.warehouse_cat_id? 'purchases_catalog' : 'org_opt_waregouse_category'" :items="opt_products?.breadcrumbs" /> -->
					<div v-if="$route.params.warehouse_id && !$route.params.warehouse_cat_id">
						<h1 class="h1-mini">Все товары</h1>
						<div class="dart-alert dart-alert-info">
							В данном разделе перечислены все товары поставщика, в том числе и не
							сопоставленные со справочником системы.
						</div>
					</div>
					<div v-else class="flex justify-content-space-between align-items-center mb-4">
						<h1 class="h1-mini mb-0">{{ opt_products?.page?.pagetitle }}</h1>
						<div @click="this.show_filters = !this.show_filters" class="flex justify-content-space-between align-items-center gap-2 cursor-pointer"><i class="pi pi-sliders-h"></i><div>Фильтры</div></div>
					</div>
					<div v-if="opt_products?.categories?.length" class="categories">
						<template :key="cat.id" v-for="cat in opt_products?.categories">
							<RouterLink
								:to="{
									name: namePathIsNav == 'purchases' ? 'org_opt_waregouse_category' : 'purchases_catalog_warehouse_offer',
									params: { warehouse_cat_id: cat.id },
								}"
								v-if="$route.params.warehouse_id"
								class="category-item"
							>
								<span class="title">{{ cat.pagetitle }}</span>
								<!-- <img :src="cat.image" :alt="cat.pagetitle" v-if="cat.image" /> -->
							</RouterLink>
							<RouterLink
								:to="{ name: namePathIsNav == 'purchases' ? 'purchases_catalog' : 'purchases_catalog_offer', params: { category_id: cat.id } }"
								v-else
								class="category-item"
							>
								<span class="title">{{ cat.pagetitle }}</span>
								<!-- <img :src="cat.image" :alt="cat.pagetitle" v-if="cat.image" /> -->
							</RouterLink>
						</template>
					</div>
					<TableCatalog
						:is_warehouses="false"
						@updateBasket="updateBasket"
						v-if="
							opt_products.total !== 0 &&
							$route.params.warehouse_id &&
							!$route.params.warehouse_cat_id
						"
						:items="opt_products"
					/>
					<TableCatalog
						:is_warehouses="false"
						@updateBasket="updateBasket"
						v-else-if="opt_products.total !== 0"
						:items="opt_products"
					/>
					<paginate
						v-if="opt_products.total !== 0"
						:page-count="pageCount"
						:click-handler="pagClickCallback"
						:prev-text="'Пред'"
						:next-text="'След'"
						:container-class="'pagination justify-content-center'"
						:initialPage="this.page"
						:forcePage="this.page"
					>
					</paginate>
				</div>
			</div>
			<div class="d-col-map purchases__basket-wrapper">
				<Vendors :items="this.opt_vendors" @vendorCheck="vendorCheck" />
				<Basket ref="childComponent" @toOrder="toOrder" @catalogUpdate="catalogUpdate" />
			</div>
		</div>
		<div class="not-vendors" v-else>
			<!-- <img src="../../assets/img/not-vendors.png" alt=""> -->
			<p>Для просмотра каталога необходимо выбрать склады поставщиков!</p>
			<div class="a-dart-btn a-dart-btn-primary" @click="changeActive">Выбрать</div>
		</div>
		<OrderModal
			:show="show_order"
			:order_id="order_id"
			@fromOrder="fromOrder"
			@orderSubmit="updatePage($event, num)"
		/>
		<Vendors
			@changeActive="changeActive"
			@vendorCheck="vendorCheck"
			:vendorModal="this.vendorModal"
			:items="this.opt_vendors"
		/>
		<Filters
			:show="show_filters"
			@setShow="setShow"
			@setFilters="setFilters"
		/>
	</div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import CatalogMenu from "../../components/opt/CatalogMenu.vue";
import Basket from "../../components/opt/Basket.vue";
import Vendors from "../../components/opt/Vendors.vue";
// import Breadcrumbs from '../../components/opt/Breadcrumbs.vue'
import Paginate from "vuejs-paginate-next";
import TableCatalog from "../../components/opt/TableCatalog.vue";
import OrderModal from "../../components/opt/OrderModal.vue";
import Loading from "../../components/Loading.vue";
// import AmBreadcrumbs from 'vue-3-breadcrumbs'
// import Breadcrumbs from "../../components/Breadcrumbs.vue";
import router from "../../router";
import Breadcrumbs from "../../components/Breadcrumbs.vue";
import Filters from "../../components/opt/Filters.vue";
import CatalogBreadcrumbs from '../../components/CatalogBreadcrumbs.vue'

export default {
	name: "OptsCatalog",
	props: {},
	data() {
		return {
			filters: {},
			show_order: false,
			show_filters: false,
			loading: true,
			loading_elems: [],
			reloading: false,
			opt_mainpage: {},
			opt_catalog: {},
			opt_vendors: {},
			opt_products: {},
			order_id: 0,
			page: 1,
			perpage: 25,
			vendorModal: false,
			namePathIsNav: null
		};
	},
	components: {
		CatalogMenu,
		Basket,
		Vendors,
		TableCatalog,
		Paginate,
		OrderModal,
		Loading,
		Breadcrumbs,
		CatalogBreadcrumbs,
		Filters
	},
	mounted() {
		this.get_opt_catalog_from_api().then(() => {
			this.opt_catalog = this.optcatalog;
			this.loading_elems.push("load");
			this.loadingCheack(3);
		});
		this.get_opt_vendors_from_api().then(() => {
			this.opt_vendors = this.optvendors;
			this.loading_elems.push("load");
			this.loadingCheack(3);
		});
		this.get_opt_products_from_api({
			page: this.page,
			perpage: this.perpage,
		}).then(() => {
			this.opt_products = this.optproducts;
			this.loading_elems.push("load");
			this.loadingCheack(3);
		});
		if (this.$route.params.warehouse_id) {
			this.get_opt_warehouse().then(() => {
				this.opt_warehouse = this.optwarehouse;
				this.loading_elems.push("load");
				this.loadingCheack(3);
			});
		}
		this.namePathIsNav = router?.currentRoute?._value.matched[4]?.name;
	},
	updated() {
		this.namePathIsNav = router?.currentRoute?._value.matched[4]?.name;
	},
	unmounted() {},
	methods: {
		...mapActions([
			"get_opt_warehouse",
			"get_opt_mainpage_from_api",
			"get_opt_catalog_from_api",
			"get_opt_vendors_from_api",
			"get_opt_products_from_api"
		]),
		pagClickCallback(pageNum) {
			this.page = pageNum;
			this.loading = true
			this.get_opt_products_from_api({
				page: this.page,
				perpage: this.perpage,
				filters: this.filters
			}).then(() => {
				this.opt_products = this.optproducts
				this.loading = false
			});
		},
		loadingCheack(num) {
			if (this.loading_elems.length == num) {
				this.loading = false;
			}
		},
		updatePage(order_id) {
			this.order_id = order_id
			this.page = 1
			this.loading = true;
			this.get_opt_catalog_from_api().then((this.opt_catalog = this.optcatalog));
			this.get_opt_vendors_from_api().then((this.opt_vendors = this.optvendors));
			this.get_opt_products_from_api({
				page: this.page,
				perpage: this.perpage,
				filters: this.filters
			}).then(() => {
				this.opt_products = this.optproducts;
				this.loading = false;
			});
			if (this.$route.params.warehouse_id) {
				this.get_opt_warehouse().then((this.opt_warehouse = this.optwarehouse));
			}
		},
		catalogUpdate() {
			this.get_opt_products_from_api({
				page: this.page,
				perpage: this.perpage,
				filters: this.filters
			}).then(() => {
				this.opt_products = this.optproducts;
				this.loading = false;
			});
		},
		setFilters(filters){
			this.filters = filters;
			this.loading = true;
			this.page = 1
			this.get_opt_products_from_api({
				page: 1,
				perpage: this.perpage,
				filters: filters
			}).then(() => {
				this.opt_products = this.optproducts;
				this.loading = false;
				this.show_filters = false;
			});
		},
		vendorCheck() {
			this.updatePage(this.$route.params.category_id);
		},
		updateBasket() {
			// this.$refs.childComponent.updateBasket();
		},
		toOrder() {
			this.show_order = true;
		},
		fromOrder() {
			this.show_order = false;
		},
		setShow(){
			this.show_filters = false;
		},
		changeActive() {
			this.vendorModal = !this.vendorModal;
		}
	},
	computed: {
		...mapGetters(["mainpage", "optcatalog", "optvendors", "optproducts", "optwarehouse"]),
		pageCount() {
			return Math.ceil(this.opt_products.total / this.perpage);
		},
	},
	watch: {
		mainpage: function (newVal, oldVal) {
			this.opt_mainpage = newVal;
		},
		optcatalog: function (newVal, oldVal) {
			this.opt_catalog = newVal;
		},
		optvendors: function (newVal, oldVal) {
			this.opt_vendors = newVal;
		},
		optproducts: function (newVal, oldVal) {
			this.opt_products = newVal;
		},
		$route() {
			this.updatePage();
			if (this.$route.params.warehouse_id) {
				this.get_opt_warehouse().then((this.opt_warehouse = this.optwarehouse));
			}
		},
	},
};
</script>
<style lang="scss">
.categories {
	display: -ms-grid;
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-auto-flow: row;
	margin-bottom: 35px;
	width: 100%;
	.category {
		width: 100%;
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-orient: vertical;
		-webkit-box-direction: normal;
		-ms-flex-direction: column;
		flex-direction: column;
		-webkit-box-pack: justify;
		-ms-flex-pack: justify;
		justify-content: space-between;
		background: #f8f7f5;
		-webkit-transition: all 0.4s;
		transition: all 0.4s;
		-webkit-box-align: start;
		-ms-flex-align: start;
		align-items: flex-start;
		border-radius: 5px;
		a {
			text-decoration: none;
			display: block;
			width: 100%;
		}
		.title {
			padding: 16px 12px 0 12px;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			overflow: hidden;
		}
		img {
			width: auto;
			max-width: 100%;
			height: auto !important;
			margin-left: auto;
			max-height: 97px !important;
			-o-object-fit: contain;
			object-fit: contain;
			float: right;
			padding: 0 4px 8px 0;
		}
	}
}
// .kenost-table-background {
// 	background-color: #f4f4f4;
// }
</style>
