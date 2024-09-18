<template>
	<Loading v-if="this.loading" />
	<div v-else>
		<ChangeVendorsModal :items="this.opt_vendors" />
		<Vendors
			@changeActive="changeActive"
			@vendorCheck="vendorCheck"
			:vendorModal="this.vendorModal"
			:items="this.opt_vendors"
		/>
		<!-- {{ this.sales_banners }} -->
		<div v-if="this.opt_vendors.selected_count > 0" class="dart-custom-grid purchases__wrapper">
			<!-- <CatalogMenu :items="opt_catalog" /> -->
			<div class="d-col-content purchases">
				<div class="dart-home dart-window">
					<span class="h2 mb-4">Акции</span>
					<Banners :key="new Date().getMilliseconds() + this.sales_banners?.count" :items="this.sales_banners" />
				</div>
			</div>
			<div class="d-col-map purchases__basket-wrapper">
				<Vendors @vendorCheck="vendorCheck" :items="this.opt_vendors" />
				<Basket ref="childComponent" @toOrder="toOrder" />
			</div>
		</div>
		<div class="not-vendors" v-else>
			<!-- <img src="../../assets/img/not-vendors.png" alt="" /> -->
			<p>Для просмотра каталога необходимо выбрать поставщика!</p>
			<div class="a-dart-btn a-dart-btn-primary" @click="changeActive">Выбрать</div>
		</div>
		<OrderModal :show="show_order" @fromOrder="fromOrder" />
	</div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
// import HomeSwiper from '../../components/swipers/HomeSwiper.vue'
import CatalogMenu from "../../components/opt/CatalogMenu.vue";
// import HomeMinSwiper from '../../components/swipers/HomeMinSwiper.vue'
// import SeasonSwiper from '../../components/swipers/SeasonSwiper.vue'
import Banners from "../../components/opt/Banners.vue";
import Basket from "../../components/opt/Basket.vue";
// import Vendors from '../../components/opt/Vendors.vue'
import ChangeVendorsModal from "../../components/opt/ChangeVendorsModal.vue";
import OrderModal from "../../components/opt/OrderModal.vue";
import router from "../../router";
import Vendors from "../../components/opt/Vendors.vue";
import Loading from "../../components/Loading.vue";

export default {
	name: "OptsMain",
	props: {},
	data() {
		return {
			show_order: false,
			loading: true,
			loading_elems: [],
			reloading: false,
			opt_mainpage: {},
			opt_catalog: {},
			opt_vendors: {},
			sales_banners: {},
			vendorModal: false,
		};
	},
	components: {
		// HomeSwiper,
		CatalogMenu,
		// HomeMinSwiper,
		// SeasonSwiper,
		// NewSwiper,
		Basket,
		Banners,
		// Vendors,
		ChangeVendorsModal,
		OrderModal,
		Vendors,
		Loading
	},
	methods: {
		...mapActions([
			"get_opt_mainpage_from_api",
			"get_opt_catalog_from_api",
			"get_opt_vendors_from_api",
			"get_salses_banners_to_api"
		]),
		toOrder() {
			this.show_order = true;
		},
		fromOrder() {
			this.show_order = false;
		},
		loadingCheack(num) {
			if (this.loading_elems.length == num) {
				this.loading = false;
			}
		},
		vendorCheck() {
			this.get_salses_banners_to_api({
				action: "get/banners",
				id: router.currentRoute._value.params.id,
			});
		},
		changeActive() {
			this.vendorModal = !this.vendorModal;
		},
	},
	mounted() {
		this.get_opt_vendors_from_api().then((this.opt_vendors = this.optvendors)).then(() => {
			this.loading_elems.push("load");
			this.loadingCheack(1);
		});
		this.get_salses_banners_to_api({
			action: "get/banners",
			id: router.currentRoute._value.params.id,
		}).then(() => {
			this.loading_elems.push("load");
			this.loadingCheack(1);
		});
	},
	computed: {
		...mapGetters(["optvendors", "salesbanners"]),
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
		salesbanners: function (newVal, oldVal) {
			console.log(newVal)
			this.sales_banners = newVal;
		}
	},
};
</script>
<style lang="scss">
.not-vendors {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: calc(100vh - 195px);

	p {
		font-size: 16px;
		margin: 10px 0;
	}
}

.dart-window {
	background: #fff;
	padding: 24px;
	border-radius: 5px;
}

.dart-home {
	&__title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		.dart-link-all {
			margin: 0;
		}
	}
}

.dart-custom-grid {
	display: flex;
}

.d-col-content {
	max-width: calc(100% - calc(287px + 350px));
	min-width: calc(100% - calc(287px + 350px));
	padding: 0 24px;
	transition: all 0.4s;
}

.d-col-map {
	width: 350px;
	height: 100%;
	top: 8px;
	position: sticky;
}

.main_content.white {
	background: #f5f5f5;
}

h1,
.h1 {
	display: block;
	font-style: normal;
	font-weight: 400;
	font-size: 48px;
	line-height: 1.3;
	color: #282828;
	margin-bottom: 32px;
}

.h1-mini {
	font-size: 28px;
	font-weight: 500;
	line-height: 1;
	margin-bottom: 20px;
	margin-top: 0;
}

h2,
.h2 {
	display: block;
	color: #282828;
	font-size: 28px;
	font-style: normal;
	font-weight: 500;
	line-height: 30px;
}

h3,
.h3 {
	font-size: 20px;
	font-style: normal;
	font-weight: 500;
	line-height: 24px;
	color: #282828;

	& + * {
		margin-top: 8px;
	}
}

h4,
.h4 {
	color: #282828;
	font-size: 16px;
	font-style: normal;
	font-weight: 500;
	line-height: 16px;

	& + * {
		margin-top: 8px;
	}
}
</style>
