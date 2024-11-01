<template>
	<div class="nav">
		<div class="nav__toggler">
			<i v-if="this.sitebar" class="pi pi-bars" @click="sidebarToggle"></i>
			<i v-else class="pi pi-times" @click="sidebarToggle"></i>
		</div>
		<router-link v-if="role == 0" :to="{ name: 'purchases_home' }" class="sitebar-logo">
			<img src="/src/assets/images/logo_small.svg" alt="МСТ Аналитика" />
			<span>МСТ Аналитика</span>
		</router-link>
		<router-link v-if="role == 1" :to="{ name: 'retail_orders' }" class="sitebar-logo">
			<img src="/src/assets/images/logo_small.svg" alt="МСТ Аналитика" />
			<span>МСТ Аналитика</span>
		</router-link>
		<router-link v-if="role == 2" :to="{ name: 'statistics' }" class="sitebar-logo">
			<img src="/src/assets/images/logo_small.svg" alt="МСТ Аналитика" />
			<span>МСТ Аналитика</span>
		</router-link>
	</div>
	<div class="sitebar" :class="{ hide: this.sitebar }">
		<div class="sitebar-content">
			<router-link v-if="role == 0" :to="{ name: 'purchases_home' }" class="sitebar-logo">
				<img src="/src/assets/images/logo_small.svg" alt="МСТ Аналитика" />
				<span>МСТ Аналитика</span>
			</router-link>
			<router-link v-if="role == 1" :to="{ name: 'retail_orders' }" class="sitebar-logo">
				<img src="/src/assets/images/logo_small.svg" alt="МСТ Аналитика" />
				<span>МСТ Аналитика</span>
			</router-link>
			<router-link v-if="role == 2" :to="{ name: 'statistics' }" class="sitebar-logo">
				<img src="/src/assets/images/logo_small.svg" alt="МСТ Аналитика" />
				<span>МСТ Аналитика</span>
			</router-link>
			<div class="sitebar-toggler" @click="sidebarToggle">
				<i class="pi pi-chevron-left"></i>
				<!-- <img src="/images/icons/array.svg" alt=""> -->
			</div>
			<div class="sitebar-profile">
				<div class="sitebar-org">
					<div class="sitebar-profile__icon">
						<img :src="this.organozation?.image" alt="" />
					</div>
					<button class="sitebar-profile__change" @click="this.changeOrgModal = true">
						<!-- <img src="../assets/images/icons/change.svg" /> -->
					</button>
				</div>
				<div class="sitebar-profile__name">{{ this.organozation?.name }}</div>
				<div class="sitebar-profile__address">
					<i class="std_icon std_icon-location"></i>
					{{ this.organozation?.description }}
				</div>
				<div class="sitebar-profile__tags">
					<button class="sitebar-profile__tag" v-if="this.role == 0">Закупщик</button>
					<button class="sitebar-profile__tag" v-if="this.role == 1">Маркетплейс</button>
					<button class="sitebar-profile__tag" v-if="this.role == 2">Поставщик</button>
					<button class="sitebar-profile__on">
						<span>Включен</span>
					</button>
				</div>
			</div>
			<div class="sitebar-info">
				<span
					class="sitebar-text"
					v-if="this.organozation.store == '1' || this.organozation.warehouse == '1'"
					>Выбор роли:</span
				>
				<div class="sitebar-roles">
					<!-- {{ this.organozation }} -->
					<button class="sitebar-role" @click="changeRole(0)" v-if="this.role != 0">
						Закупщик
					</button>
					<button
						class="sitebar-role"
						@click="changeRole(1)"
						v-if="this.role != 1 && this.organozation.store == '1'"
					>
						Маркетплейс
					</button>
					<button
						class="sitebar-role"
						@click="changeRole(2)"
						v-if="this.role != 2 && this.organozation.warehouse == '1'"
					>
						Поставщик
					</button>
				</div>
			</div>
			<div class="std-money" v-if="this.role == 1">
				<div class="std-money__text-container">
					<span class="std-money__label">Баланс</span>
					<span class="std-money__balance">{{ this.organozation.balance }} ₽</span>
				</div>
				<button class="dart-btn dart-btn-secondary std-money__button">
					Вывести средства
				</button>
			</div>
			<hr class="sitebar-hr" />
			<div class="sitebar-menu">
				<PanelMenu v-model:expandedKeys="expandedKeys" :model="getMenu">
					<template #item="{ item }">
						<router-link class="sitebar-menu__item" :to="item.to" style="color: #fff">
							<div class="sitebar-menu__name">
								<span class="sitebar-menu__image">
									<img :src="'/images/icons/' + item.icon" alt="" />
								</span>
								<span class="sitebar-menu__title">{{ item.label }}</span>
							</div>
							<div class="sitebar-menu__notification">
								<!-- Уведомления -->
							</div>
							<!-- <div class="sitebar-menu__hint">
						  {{ item.label }}
						</div> -->
						</router-link>
					</template>
				</PanelMenu>
			</div>
		</div>
		<div class="helpModal" @click="helpMenuToggle" :class="{'show': this.menuHelp}">
			<div class="helpModal__content" @click.stop="">
				<div class="helpModal__close" @click="helpMenuToggle">
				<i class="pi pi-times"></i>
				</div>
				<div class="helpModal__catalog-mobile" @click="this.menuHelpMobile = !this.menuHelpMobile">
				<i class="pi pi-align-right"></i>
				</div>
				<div class="helpModal__menu" :class="{'show': this.menuHelpMobile || !this.menuHelp}">
				<CatalogMenu :active1="this.index1" :active2="this.index2" @getMenuIndex="changeContentTraining" :items="training_catalog"/>
				</div>
				<div class="helpModal__text">
				<p class="helpModal__title">{{ this.index2 == null? training_catalog[this.index1]?.pagetitle : training_catalog[this.index1]?.children[this.index2]?.pagetitle}}</p>
				<div v-html="this.index2 == null? training_catalog[this.index1]?.content : training_catalog[this.index1]?.children[this.index2]?.content"></div>
				</div>
			</div>
		</div>
		<div class="sitebar-logout__container">
			<button @click="helpMenuToggle" class="button-none sitebar-logout__question">
				
			</button>
			<div class="sitebar-logout" @click="onAuthBtnClick">
				<span>Выйти</span>
				<i class="pi pi-sign-out"></i>
			</div>
		</div>
		<div class="sitebar-version" id="version" @click="copyVersion()">v. {{ version }}</div>
	</div>

	<!-- <Dialog
		v-model:visible="this.changeOrgModal"
		:header="'Выбор организации'"
		class="kenost-change-org"
	>
		<router-link
			@click="changeOrg"
			:to="{ name: 'org', params: { id: item.id } }"
			class="change-org-el"
			:class="{ active: $route.params.id == item.id }"
			v-for="item in this.organizations"
			v-bind:key="item.id"
		>
			<div class="icon"><img :src="item.image" alt="" /></div>
			<div class="change-org-el__text">
				<b>{{ item.name }}</b>
				<div v-if="item.active" class="dart-payment-status-org">
					<i class="d_icon d_icon-check"></i><span>Включен</span>
				</div>
				<div v-else class="dart-payment-status-org off">
					<i class="d_icon d_icon-focus"></i><span>Выключен</span>
				</div>
			</div>
		</router-link>
	</Dialog> -->

	<EmptyDialog :visible="this.changeOrgModal" @close="this.changeOrgModal = false">
		<div class="change-org-container">
			<div class="change-org__wrapper">
				<div class="change-org-el" :class="{ active: true }">
					<div class="icon"><img :src="this.activeOrganization?.image" alt="" /></div>
					<div class="change-org-el__text">
						<b>{{ this.activeOrganization?.name }}</b>
						<p>{{ this.activeOrganization?.description }}</p>
					</div>
				</div>
				<div v-if="this.activeOrganization?.active" class="dart-payment-status-org">
					<i class="d_icon d_icon-check"></i>
					<span>Включен</span>
				</div>
				<div v-else class="dart-payment-status-org off">
					<i class="d_icon d_icon-focus"></i><span>Выключен</span>
				</div>
			</div>

			<hr class="change-org__line" />

			<div class="change-org__links">
				<router-link
					v-for="item in this.organizations?.filter(
						(org) => org.id !== this.activeOrganization.id
					)"
					@click="changeOrg"
					:to="
						this.role == 0
							? { name: 'purchases_home', params: { id: item.id } }
							: this.role == 1
							? { name: 'retail_orders', params: { id: item.id } }
							: { name: 'statistics', params: { id: item.id } }
					"
					class="change-org-el"
					v-bind:key="item.id"
				>
					<div class="icon"><img :src="item.image" alt="" /></div>
					<div class="change-org-el__text">
						<b>{{ item.name }}</b>
						<p>{{ item.description }}</p>
					</div>
				</router-link>
			</div>
		</div>
	</EmptyDialog>

	<div class="video-kenost" v-if="this.video">
		<div class="video-kenost-container">
			<iframe :src="this.video" width="1280" height="720" allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;" frameborder="0" allowfullscreen></iframe>
			<i @click="closeVideo()" class="pi pi-times video-kenost-close"></i>
		</div>
		<!-- <div class="video-kenost-button">Больше не показывать</div> -->
	</div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import PanelMenu from "primevue/panelmenu";
import OverlayPanel from "primevue/overlaypanel";
import EmptyDialog from "./EmptyDialog.vue";
import router from "../router";
import CatalogMenu from './training/CatalogMenu.vue'
import Dialog from 'primevue/dialog';

export default {
	name: "Sitebar",
	props: {
		active: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			activeOrganization: {},
			sitebar: this.active,
			organizations: [],
			organozation: [],
			changeOrgModal: false,
			menuHelp: false,
      		menuHelpMobile: false,
			role: 0,
			index1: 0,
      		index2: null,
			training_catalog: {},
			is_video: true,
			video: ""
			//РОЛИ
			// 0 - Закупки
			// 1 - Маркетплейс
			// 2 - Поставщик
		};
	},
	components: {
		PanelMenu,
		Dialog,
		EmptyDialog,
		CatalogMenu,
	},
	computed: {
		...mapGetters({
			getUser: "user/getUser",
			orgs: "orgs",
			trainingcatalog: 'trainingcatalog'
		}),
		getMenu() {
			if (this.role == 0) {
				return [
					{
						label: "Закупки",
						icon: "orders.svg",
						to: { name: "purchases_home", params: { id: this.$route.params.id } },
					},
					{
						label: "Оптовые акции",
						icon: "ticket-discount.svg",
						to: { name: "opt_actions", params: { id: this.$route.params.id } },
					},
					{
						label: "Мои заказы",
						icon: "bag.svg",
						to: { name: "my_orders", params: { id: this.$route.params.id } },
					},
					{
						label: "Мои поставщики",
						icon: "star.svg",
						to: { name: "vendors", params: { id: this.$route.params.id } },
					},
					{
						label: "Товары",
						icon: "products.svg",
						to: { name: "statistics", params: { id: this.$route.params.id } },
					},
					{
						label: "Карточка компании",
						icon: "settings.svg",
						to: { name: "org_settings", params: { id: this.$route.params.id } },
					},
				];
			} else if (this.role == 1) {
				return [
					{
						label: "Розничные заказы",
						icon: "orders.svg",
						to: { name: "retail_orders", params: { id: this.$route.params.id } },
					},
					{
						label: "Баланс",
						icon: "bag.svg",
						to: { name: "org_balance", params: { id: this.$route.params.id } },
					},
					{
						label: "Розничные акции",
						icon: "star.svg",
						to: { name: "b2c", params: { id: this.$route.params.id } },
					},
					{
						label: "Товары",
						icon: "products.svg",
						to: { name: "stores", params: { id: this.$route.params.id } },
					},
					{
						label: "Карточка компании",
						icon: "settings.svg",
						to: { name: "org_settings", params: { id: this.$route.params.id } },
					},
				];
			} else if (this.role == 2) {
				return [
					{
						label: "Товары",
						icon: "products.svg",
						to: { name: "statistics", params: { id: this.$route.params.id } },
					},
					{
						label: "Оптовые заказы",
						icon: "orders.svg",
						to: { name: "opt_orders", params: { id: this.$route.params.id } },
					},
					{
						label: "Отгрузки",
						icon: "shipments.svg",
						to: { name: "shipments", params: { id: this.$route.params.id } },
					},
					{
						label: "Мои клиенты",
						icon: "clients.svg",
						to: { name: "clients", params: { id: this.$route.params.id } },
					},
					{
						label: "Индивидуальные скидки",
						icon: "star.svg",
						to: { name: "discounts", params: { id: this.$route.params.id } },
					},
					{
						label: "Мои оптовые акции",
						icon: "my_opt_action.svg",
						to: { name: "b2b", params: { id: this.$route.params.id } },
					},
					{
						label: "Карточка компании",
						icon: "settings.svg",
						to: { name: "org_settings", params: { id: this.$route.params.id } },
					},
				];
			}
		},
	},
	updated () {
		// this.get_training_catalog_from_api()
	},
	methods: {
		...mapActions({
			setUser: "user/setUser",
			deleteUser: "user/deleteUser",
			org_get_from_api: "org_get_from_api",
			get_opt_vendors_from_api: "get_opt_vendors_from_api",
			get_opt_warehouse_catalog_from_api: "get_opt_warehouse_catalog_from_api",
			get_opt_catalog_from_api: "get_opt_catalog_from_api",
			get_training_catalog_from_api: 'get_training_catalog_from_api',
			set_training_catalog_from_api: 'set_training_catalog_from_api'
		}),
		copyVersion(){
			var range = document.createRange();
			range.selectNode(document.getElementById("version"));
			window.getSelection().removeAllRanges(); // clear current selection
			window.getSelection().addRange(range); // to select text
			document.execCommand("copy");
			window.getSelection().removeAllRanges();// to deselect
		},
		closeVideo(){
			//Отправлять на сервер
			this.video = null
			this.set_training_catalog_from_api();
		},
		changeContentTraining (elem) {
			// console.log(elem)
			this.index1 = elem.index1
			this.index2 = elem.index2
		},
		helpMenuToggle () {
			this.menuHelp = !this.menuHelp
			// if(this.menuHelp){
			// 	document.body.style.overflow = 'auto'
			// } else {
			// 	document.body.style.overflow = 'hidden'
			// }
		},
		sidebarToggle() {
			this.sitebar = !this.sitebar;
			this.$cookies.set("sidebar_active", Number(this.sitebar));
		},
		onAuthBtnClick() {
			if (this.getUser) {
				this.$api.auth.logout();
				localStorage.removeItem("user");
				this.deleteUser();
				// console.log(this.$router)
				this.$router.push({ name: "main" });
			} else {
				this.$router.push({ name: "main" });
			}
		},
		changeRole(role) {
			//РОЛИ
			// 0 - Закупки
			// 1 - Маркетплейс
			// 2 - Поставщик

			localStorage.setItem("role", role);
			this.role = role;

			if (role == 0) {
				this.$router.push({ name: "purchases_home" });
			} else if (role == 1) {
				this.$router.push({ name: "retail_orders" });
			} else if (role == 2) {
				this.$router.push({ name: "statistics" });
			}
		},
		getRole() {
			if (localStorage.getItem("role")) {
				// console.log(localStorage.getItem("role"))
				let role = localStorage.getItem("role");
				if (role == 1) {
					if (this.organozation.store == "0") {
						role = 0;
						localStorage.setItem("role", role);
					}
				} else if (role == 2) {
					if (this.organozation.warehouse == "0") {
						role = 0;
						localStorage.setItem("role", role);
					}
				}
				this.role = role;
			}
		},
		changeOrg() {
			this.changeOrgModal = false;

			const data = {
				action: "get/orgs",
			};
			this.org_get_from_api(data);

			// TODO Нужно другое решение
			setTimeout(() => location.reload(), 100);

			// if(router?.currentRoute?._value.matched[0]?.name == 'home') {
			//   this.get_organization_from_api()
			// }
		},
	},
	mounted() {
		const data = {
			action: "get/orgs",
		};
		this.org_get_from_api(data).then((response) => {
			console.log(response)
			this.getRole()
		});

		this.get_training_catalog_from_api()
	},
	beforeRouteUpdate(to, from, next) {
		this.get_training_catalog_from_api();
		next();
	},
	watch: {
		orgs: function (newVal, oldVal) {
			this.organizations = newVal;
			if (newVal) {
				const org = newVal.find((el) => el.id === this.$route.params.id);
				if (org) {
					this.organozation = org;
				}
			}

			this.activeOrganization = this.organizations?.find(
				(org) => org.id === this.$route.params.id
			);
		},
		trainingcatalog: function (newVal, oldVal) {
			this.training_catalog = newVal.items

			if(newVal.index1){
				this.index1 = newVal.index1
			} else{
				this.index1 = 0
			}

			if(newVal.index2){
				this.index2 = newVal.index2
			} else{
				this.index2 = null
			}

			if(newVal.video){
				this.video = newVal.video
			} else{
				this.video = null
			}
		},
		'$route': {
			handler: function (newParams, oldParams) {
				if (newParams.fullPath !== oldParams.fullPath) {
					this.get_training_catalog_from_api();
				}
			},
 	 	}
	},
};
</script>

<style scoped>
.sitebar {
	padding-bottom: 15px;
	&.hide .sitebar-version {
		display: none;
	}
	.sitebar-version {
		position: absolute;
		bottom: 5px;
		left: 40px;
		color: transparent;
		font-size: 12px;
		&:hover {
			color: #646464;
		}
	}
}
</style>
