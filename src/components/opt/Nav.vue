<template>
	<div :class="`navmain std-nav ${catalogIsOpened ? 'std-nav--active' : ''}`">
		<!-- Каталог -->
		<div
			:class="`std-catalog ${
				catalogIsOpened ? 'std-catalog--active' : ''
			} hidden-desktop-s-minus`"
		>
			<!-- <hr class="std-nav__line" /> -->

			<div class="std-catalog__primary-tabs-container">
				<div class="std-catalog__tabs">
					<button
						:class="`std-catalog__tab-item std-tab-item ${
							this.organizationsOrCategories === 'organizations'
								? 'std-tab-item--active'
								: ''
						}`"
						@click="setOrganizationsOrCategories('organizations')"
					>
						<div class="std-tab-item__img-container">
							<img src="../../assets/images/icons/org-catalog.svg" alt="" />
						</div>
						<span class="std-tab-item__text">Каталоги поставщиков</span>
					</button>
					<button
						:class="`std-catalog__tab-item std-tab-item ${
							this.organizationsOrCategories === 'categories'
								? 'std-tab-item--active'
								: ''
						}`"
						@click="setOrganizationsOrCategories('categories')"
					>
						<div class="std-tab-item__img-container">
							<img src="../../assets/images/icons/category.svg" alt="" />
						</div>
						<span class="std-tab-item__text">Категории</span>
					</button>
				</div>

				<hr class="std-catalog__line" />

				<div class="std-catalog__nav std-catalog__nav--primary">
					<!-- <div v-if="this.organizationsOrCategories === 'organizations'">
						<router-link
							:to="{
								name: 'purchases_catalog_warehouse',
								params: { id: this.$route.params.id, warehouse_id: level1.id },
							}"
							:key="level1"
							@mouseenter="
								() => {
									this.actualNav.secondLevel = level1.children;
									this.actualNav.thirdLevel = [];
									this.actualNav.warehouse_id = level1.id;
									this.actualImageSrc = '';
								}
							"
							@click="toggleCatalogVisibilityAd()"
							class="std-catalog__tab-item std-tab-item std-tab-item--alt"
							v-for="level1 in this.catalog_warehouse"
						>
							<div class="std-tab-item__img-container">
								<img :src="this.getImageSrc(level1.image)" />
							</div>
							<span class="std-tab-item__text">{{ level1.pagetitle }}</span>
							<i class="d_icon d_icon-arrow std-tab-item__icon"></i>
						</router-link>
					</div>
					<div v-else>
						<router-link
							:to="{
								name: 'purchases_catalog',
								params: { id: this.$route.params.id, category_id: level1.id },
							}"
							:key="level1"
							@mouseenter="
								() => {
									this.actualNav.secondLevel = level1.children;
									this.actualNav.thirdLevel = [];
									this.actualImageSrc = '';
								}
							"
							@click="toggleCatalogVisibilityAd()"
							class="std-catalog__tab-item std-tab-item std-tab-item--alt"
							v-for="level1 in this.catalog"
						>
							<div class="std-tab-item__img-container">
								<img :src="this.getImageSrc(level1.menu_image)" />
							</div>
							<span class="std-tab-item__text">{{ level1.pagetitle }}</span>
							<i class="d_icon d_icon-arrow std-tab-item__icon"></i>
						</router-link>
					</div> -->

					{{ console.log(this.catalog_warehouse, this.catalog) }}
					<div
						v-if="this.organizationsOrCategories === 'organizations'"
						v-for="level1 in this.catalog_warehouse"
						:key="level1"
						@mouseenter="setActualCatalog(level1)"
						class="std-catalog__tab-item std-tab-item std-tab-item--alt"
					>
						<div class="std-tab-item__img-container">
							<img :src="this.getImageSrc(level1.image)" />
						</div>
						<span class="std-tab-item__text">{{ level1.pagetitle }}</span>
						<i class="d_icon d_icon-arrow std-tab-item__icon"></i>
					</div>
					<div
						v-if="this.organizationsOrCategories === 'categories'"
						v-for="level1 in this.catalog"
						:key="level1"
						@mouseenter="setActualCatalog(level1)"
						class="std-catalog__tab-item std-tab-item std-tab-item--alt"
					>
						<div class="std-tab-item__img-container">
							<img :src="this.getImageSrc(level1.menu_image)" />
						</div>
						<span class="std-tab-item__text">{{ level1.pagetitle }}</span>
						<i class="d_icon d_icon-arrow std-tab-item__icon"></i>
					</div>
				</div>
			</div>

			<!-- <hr class="std-catalog__line" /> -->

			<div v-if="this.actualCatalog.children" class="std-catalog__secondary-tabs-container">
				<button class="std-catalog__back-button" @click="setPrevCatalog">
					<i class="d_icon d_icon-arrow std-tab-item__icon"></i>
					<span class="std-catalog__tab-title">{{ this.actualCatalog.pagetitle }}</span>
				</button>

				<div class="std-catalog__nav std-catalog__nav--secondary">
					<template
						v-if="this.organizationsOrCategories === 'organizations'"
						v-for="catItem in this.actualCatalog.children"
						:key="catItem"
					>
						<div
							v-if="catItem.children"
							class="std-catalog__tab-item std-tab-item std-tab-item--alt2"
							@click.stop="setActualCatalog(catItem)"
						>
							<span class="std-tab-item__text">{{ catItem.pagetitle }}</span>
							<i class="d_icon d_icon-arrow std-tab-item__icon"></i>
						</div>

						<router-link
							v-else
							:to="{
								name: 'org_opt_waregouse_category',
								params: {
									id: this.$route.params.id,
									warehouse_id: this.actualCatalog.id,
									warehouse_cat_id: catItem.id,
								},
							}"
							class="std-catalog__tab-item std-tab-item std-tab-item--alt2"
							@click="toggleCatalogVisibilityAd()"
						>
							<span class="std-tab-item__text">{{ catItem.pagetitle }}</span>
						</router-link>
					</template>
					<template
						v-if="this.organizationsOrCategories === 'categories'"
						v-for="catItem in this.actualCatalog.children"
						:key="catItem"
					>
						<div
							v-if="catItem.children"
							class="std-catalog__tab-item std-tab-item std-tab-item--alt2"
							@click.stop="setActualCatalog(catItem)"
						>
							<span class="std-tab-item__text">{{ catItem.pagetitle }}</span>
							<i class="d_icon d_icon-arrow std-tab-item__icon"></i>
						</div>
						<router-link
							v-else
							:to="{
								name: 'purchases_catalog',
								params: {
									id: this.$route.params.id,
									category_id: catItem.id,
								},
							}"
							class="std-catalog__tab-item std-tab-item std-tab-item--alt2"
							@click="toggleCatalogVisibilityAd()"
						>
							<span class="std-tab-item__text">{{ catItem.pagetitle }}</span>
						</router-link>
					</template>
				</div>
			</div>
		</div>

		<!-- Каталог -->
		<div
			:class="`std-catalog ${
				catalogIsOpened ? 'std-catalog--active' : ''
			} visible-desktop-s-minus`"
		>
			<!-- <hr class="std-nav__line" /> -->

			<div class="std-catalog__tabs">
				<button
					:class="`std-catalog__tab-item std-tab-item ${
						this.organizationsOrCategories === 'organizations'
							? 'std-tab-item--active'
							: ''
					}`"
					@click="setOrganizationsOrCategories('organizations')"
				>
					<div class="std-tab-item__img-container">
						<img src="../../assets/images/icons/org-catalog.svg" alt="" />
					</div>
					<span class="std-tab-item__text">Каталоги поставщиков</span>
				</button>
				<button
					:class="`std-catalog__tab-item std-tab-item ${
						this.organizationsOrCategories === 'categories'
							? 'std-tab-item--active'
							: ''
					}`"
					@click="setOrganizationsOrCategories('categories')"
				>
					<div class="std-tab-item__img-container">
						<img src="../../assets/images/icons/category.svg" alt="" />
					</div>
					<span class="std-tab-item__text">Категории</span>
				</button>
			</div>

			<hr class="std-catalog__line" />

			<!-- Mobile catalog -->
			<div class="std-catalog__content">
				<div
					class="std-catalog__nav std-catalog__nav--primary std-catalog__tabs std-catalo__tabs--vertical"
				>
					<template
						v-for="level1 in this.organizationsOrCategories === 'organizations'
							? this.catalog_warehouse
							: this.catalog"
						:key="level1.id"
					>
						<!-- If first link has subbed links -->
						<Accordion v-if="level1.children">
							<template v-slot:header>
								<div
									:key="level1.id"
									class="std-catalog__tab-item std-tab-item std-tab-item--alt"
								>
									<div class="std-tab-item__img-container">
										<img
											:src="
												this.getImageSrc(level1.image || level1.menu_image)
											"
										/>
									</div>
									<span class="std-tab-item__text">{{
										level1.name || level1.pagetitle
									}}</span>
									<i class="d_icon d_icon-arrow std-tab-item__icon"></i>
								</div>
							</template>

							<template v-slot:default>
								<div
									class="std-catalog__nav std-catalog__nav--primary std-catalog__tabs std-catalo__tabs--vertical"
								>
									<template v-for="level2 in level1.children">
										<!-- If second link has subbed links -->
										<Accordion v-if="level2.children">
											<template v-slot:header>
												<div
													:key="level2.id"
													class="std-catalog__tab-item std-tab-item std-tab-item--alt2"
												>
													<!-- <div class="std-tab-item__img-container">
														<img
															:src="getImageSrc(level2.image || level2.menu_image)"
														/>
													</div> -->
													<span class="std-tab-item__text">{{
														level2.name || level2.pagetitle
													}}</span>
													<i
														class="d_icon d_icon-arrow std-tab-item__icon"
													></i>
												</div>
											</template>

											<template v-slot:default>
												<div
													class="std-catalog__nav std-catalog__nav--primary std-catalog__tabs std-catalo__tabs--vertical"
												>
													<router-link
														v-for="level3 in level2.children"
														:to="{
															name: 'purchases_catalog',
															params: {
																id: this.$route.params.id,
																category_id: level3.id,
															},
														}"
														:key="level3"
														@click="toggleCatalogVisibilityAd()"
														class="std-catalog__tab-item std-tab-item std-tab-item--alt2 std-tab-item--alt3"
													>
														<!-- <div class="std-tab-item__img-container">
															<img
																:src="getImageSrc(level3.image || level3.menu_image)"
															/>
														</div> -->
														<span class="std-tab-item__text">{{
															level3.name || level3.pagetitle
														}}</span>
													</router-link>
												</div>
											</template>
										</Accordion>

										<!-- If second link has no subbed links -->
										<router-link
											v-else
											:to="{
												name: 'purchases_catalog',
												params: {
													id: this.$route.params.id,
													category_id: level2.id,
												},
											}"
											:key="level2"
											@click="toggleCatalogVisibilityAd()"
											class="std-catalog__tab-item std-tab-item std-tab-item--alt2"
										>
											<!-- <div class="std-tab-item__img-container">
												<img
													:src="getImageSrc(level2.image || level2.menu_image)"
												/>
											</div> -->
											<span class="std-tab-item__text">{{
												level2.name || level2.pagetitle
											}}</span>
										</router-link>
									</template>
								</div>
							</template>
						</Accordion>

						<!-- If first link has no subbed links -->
						<router-link
							v-else
							:to="{
								name: 'purchases_catalog',
								params: { id: this.$route.params.id, category_id: level1.id },
							}"
							:key="level1"
							@mouseenter="
								() => {
									this.actualNav.secondLevel = level1.children;
									this.actualNav.thirdLevel = [];
									this.actualImageSrc = '';
								}
							"
							@click="toggleCatalogVisibilityAd()"
							class="std-catalog__tab-item std-tab-item std-tab-item--alt"
							v-for="level1 in this.organizationsOrCategories === 'organizations'
								? this.catalog_warehouse
								: this.catalog"
						>
							<div class="std-tab-item__img-container">
								<img :src="getImageSrc(level1.image || level1.menu_image)" />
							</div>
							<span class="std-tab-item__text">{{
								level1.name || level1.pagetitle
							}}</span>
						</router-link>
					</template>
				</div>
			</div>
		</div>

		<button
			class="std-nav__button std-catalog-button"
			@click="() => toggleCatalogVisibilityAd(true)"
		>
			Каталог
			<!-- <i class="pi pi-bars std-catalog-button__icon hidden-mobile-l"></i> -->
			<!-- <i class="pi pi-angle-down std-catalog-button__icon visible-mobile-l"></i> -->
			<img src="/images/icons/menu.svg" alt="" class="hidden-tablet-l" />
			<img src="/images/icons/arrow-rounded.svg" alt="" class="visible-tablet-l" />
		</button>

		<button class="std-nav__address">
			<img class="std-nav__address-icon" src="/images/icons/map_marker.svg" />
			<span class="std-nav__address-text"
				>Склад доставки: Ростов на Дону, ул. Микухина Каланахлоя, 11 / 7 к 32 ЛИТ 898</span
			>
		</button>

		<div
			v-if="opt_vendors.selected_count > 0"
			class="navmain__search a-dart-input a-dart-input-search std-search-field__wrapper"
		>
			<form action="#" method="post" @submit.prevent="toSearch()">
				<div class="navmain__search_btn std-search-field">
					<div class="std-search-field__block">
						<!-- <i class="pi pi-search std-search-field__icon"></i> -->
						<img
							src="../../assets/images/icons/search.svg"
							alt=""
							class="std-search-field__icon"
						/>
						<input
							class="std-search-field__input"
							type="text"
							placeholder="Найти у выбранных поставщиков"
							v-model="search"
						/>
					</div>
					<button
						type="submit"
						class="navmain__dart_btn a-dart-btn a-dart-btn-primary std-search-field__button"
					>
						Найти
					</button>
				</div>
			</form>
		</div>
		<!-- </div> -->

		<button class="a-dart-btn a-dart-btn-secondary kenost-vendors" @click="changeActive">
			<!-- <i class="mst-icon mst-icon-my_vendors kenost-vendors__icon"></i> -->
			<span class="std-icon">
				<svg
					width="24"
					height="21"
					viewBox="0 0 24 21"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M21.4605 9.09682L14.3999 13.1721C14.3061 13.2263 14.2025 13.2613 14.095 13.2753C13.9876 13.2892 13.8785 13.2818 13.7739 13.2535C13.6694 13.2251 13.5715 13.1764 13.4858 13.1101C13.4002 13.0438 13.3284 12.9612 13.2748 12.8671L9.19447 5.81155C9.08625 5.62097 9.05758 5.39539 9.11469 5.1838C9.1718 4.97221 9.31008 4.7917 9.49949 4.68146L16.5601 0.606125C16.7499 0.498226 16.9747 0.469741 17.1854 0.526878C17.3962 0.584014 17.5758 0.722141 17.6852 0.91115L21.7605 7.96672C21.8151 8.0606 21.8506 8.16433 21.8651 8.27196C21.8795 8.37959 21.8727 8.48901 21.8448 8.59397C21.8169 8.69894 21.7686 8.79737 21.7027 8.88366C21.6367 8.96994 21.5544 9.04237 21.4605 9.09682Z"
						fill="#282828"
					/>
					<path
						d="M23.8579 9.71578C23.7173 9.47211 23.4855 9.2943 23.2138 9.22147C22.942 9.14864 22.6524 9.18675 22.4087 9.32742L13.5472 14.4438L5.61443 0.70349C5.52557 0.549621 5.39949 0.420528 5.24777 0.328056C5.09605 0.235583 4.92353 0.182691 4.74605 0.174232L1.10956 0.00111809C0.828791 -0.0117759 0.554383 0.0872713 0.346578 0.276514C0.138773 0.465756 0.0145568 0.729727 0.00119985 1.01047C-0.0121571 1.29121 0.0864374 1.56579 0.275337 1.7739C0.464237 1.98202 0.728002 2.10667 1.00872 2.12049L4.06647 2.266L11.6159 15.3424C12.1989 14.9012 12.9275 14.6975 13.6547 14.7725C14.3819 14.8476 15.0536 15.1957 15.5342 15.7466L23.4696 11.165C23.7132 11.0243 23.891 10.7926 23.9638 10.5208C24.0367 10.249 23.9986 9.95947 23.8579 9.71578Z"
						fill="#282828"
					/>
					<path
						d="M13.3541 20.093C14.6974 20.093 15.7864 19.0041 15.7864 17.6608C15.7864 16.3175 14.6974 15.2285 13.3541 15.2285C12.0108 15.2285 10.9219 16.3175 10.9219 17.6608C10.9219 19.0041 12.0108 20.093 13.3541 20.093Z"
						fill="#282828"
					/>
				</svg>
			</span>
			<span class="kenost-vendors__span"
				>{{ this.opt_vendors.selected_count }} из
				{{ this.opt_vendors.available_count }}</span
			>
			<i class="pi pi-angle-down"></i>
			<div class="kenost-vendors__list">
				<span>Выбранные поставщики</span>
				<div class="kenost-vendors__images">
					<div class="k-order__actions" v-if="this.opt_vendors.selected_count > 0">
						<div
							class="k-actions"
							v-for="action in this.opt_vendors.selected"
							v-bind:key="action.id"
						>
							<img class="k-order__actions-el" :src="action.image" />
						</div>
					</div>
					<div class="k-order__actions" v-if="this.opt_vendors.selected_count > 6">
						<div
							class="k-actions"
							v-for="(action, index) in opt_vendors.selected"
							v-bind:key="action.id"
						>
							<img
								v-if="index > 6 && index < 12"
								class="k-order__actions-el"
								:src="action.image"
							/>
						</div>
					</div>
					<div class="k-order__actions" v-if="this.opt_vendors.selected_count > 12">
						<div
							class="k-actions"
							v-for="(action, index) in opt_vendors.selected"
							v-bind:key="action.id"
						>
							<img
								v-if="index > 12 && index < 18"
								class="k-order__actions-el"
								:src="action.image"
							/>
						</div>
					</div>
				</div>
			</div>
		</button>
		<Vendors
			@changeActive="changeActive"
			@vendorCheck="vendorCheck"
			:vendorModal="this.vendorModal"
			:items="this.opt_vendors"
		/>

		<!-- <a href="#" class="navmain__components_desctop a-dart-btn">
            <i class="pi pi-sliders-h"></i>
            <b>Сравнение</b>
        </a> -->
	</div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import router from "../../router";
import Vendors from "./Vendors.vue";
import Accordion from "../Accordion.vue";
import { find } from "lodash";

export default {
	name: "Nav",
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
			catalog: [],
			loading: true,
			search: "",
			opt_vendors: [],
			vendorModal: false,
			catalog_warehouse: [],
			organizations: [],
			organizationsOrCategories: "categories",
			catalogIsOpened: false,
			actualCatalog: {},
			actualImageSrc: "",
		};
	},
	methods: {
		...mapActions([
			"get_opt_vendors_from_api",
			"get_salses_banners_to_api",
			"get_opt_catalog_from_api",
			"org_get_from_api",
			"get_opt_warehouse_catalog_from_api",
		]),
		toSearch() {
			router.push({ name: "opt_search", params: { search: this.search } });
		},
		changeActive() {
			this.vendorModal = !this.vendorModal;
		},
		vendorCheck() {
			const data = {
				action: "get/banners",
				id: router.currentRoute._value.params.id,
			};
			this.get_salses_banners_to_api(data);
		},
		toggleCatalogVisibilityAd() {
			this.catalogIsOpened = !this.catalogIsOpened;
			document.body.style.overflow = this.catalogIsOpened ? "hidden" : "auto";
		},
		toggleCatalogVisibility(state) {
			this.catalogIsOpened = state;
			document.body.style.overflow = this.catalogIsOpened ? "hidden" : "auto";
		},
		setOrganizationsOrCategories(state) {
			if (state !== this.organizationsOrCategories) {
				this.actualCatalog = {};
			}

			this.organizationsOrCategories = state;
		},

		getImageSrc(src) {
			// if (!src) return "";
			// return src.startsWith("https://dev.mst.tools") ? src : "https://dev.mst.tools/" + src;
			return src;
		},
		setActualCatalog(catalog) {
			this.actualCatalog = catalog;
		},
		setPrevCatalog() {
			if (this.organizationsOrCategories === "organizations") {
				this.actualCatalog = find(
					this.catalog_warehouse,
					(item) => item.id === this.actualCatalog.parent
				);
				return;
			}

			if (this.organizationsOrCategories === "categories") {
				this.actualCatalog = find(
					this.catalog,
					(item) => item.id === this.actualCatalog.parent
				);
				return;
			}
		},
	},
	mounted() {
		this.get_opt_warehouse_catalog_from_api();
		this.get_opt_catalog_from_api();
		this.get_opt_vendors_from_api().then((this.opt_vendors = this.optvendors));

		const getOrganizationss = async () => {
			this.organizations = (await this.org_get_from_api({ action: "get/orgs" })).data.data;
		};
		getOrganizationss();
		const elem = document.querySelector(".navmain");

		document.addEventListener("click", (e) => {
			if (!elem.contains(e.target)) {
				this.toggleCatalogVisibility(false);
			}
		});
	},
	components: { Vendors, Accordion },
	computed: {
		...mapGetters(["optvendors", "salesbanners", "optcatalog", "optcatalogwarehouse"]),
	},
	watch: {
		optvendors: function (newVal, oldVal) {
			this.opt_vendors = newVal;
		},
		optcatalog: function (newVal, oldVal) {
			this.catalog = newVal;
		},
		optcatalogwarehouse: function (newVal, oldVal) {
			this.catalog_warehouse = newVal;
		},
	},
};
</script>
<style lang="scss">
.kenost-vendors {
	position: relative;
	&__icon {
		font-size: 24px;
	}

	&:hover {
		.kenost-vendors__list {
			opacity: 1;
			pointer-events: all;
		}
	}

	&__list {
		position: absolute;
		width: 204px;
		padding: 12px;
		border-radius: 5px;
		box-shadow: 0px 0px 12px 0px rgba(51, 51, 51, 0.1490196078);
		top: 55px;
		z-index: 2;
		right: 0;
		background: #fff;
		opacity: 0;
		pointer-events: none;
		transition: all 0.7s;

		span {
			color: #acabab;
			font-size: 12px;
			font-weight: 400;
			width: 100%;
			display: block;
			text-align: left;
		}
	}

	&__images {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
}
.navmain {
	width: 100%;
	height: 80px;
	background: #fff;
	padding: 0 12px;
	display: flex;
	align-items: center;
	justify-content: space-between;

	&__logo {
		display: flex;
		align-items: center;
		text-decoration: none;

		img {
			margin-right: 16px;
			width: 210px;
			height: 80px;
			display: block;
		}
		span {
			color: #8a8a8a;
			font-size: 16px;
			font-weight: 400;
		}
	}

	&__hand {
		display: flex;
		align-items: center;
	}

	&__components_desctop {
		color: #282828;
	}
	&__search {
		display: flex;
		align-items: center;
		// min-width: 400px;
		margin-left: 32px;
		input {
			border-radius: 5px 0 0 5px;
			padding: 13px 44px;
			&:focus {
				border-right: 0px;
			}
		}

		.dart-btn-primary {
			position: relative;
			left: -5px;
		}
	}

	&__dart_btn {
		position: relative;
		left: -5px;
	}

	&__search_btn {
		display: flex;
		align-items: center;
		position: relative;
		width: 400px;
		transition: width 0.4s;
	}
}

.a-dart-btn {
	border-radius: 5px;
	padding: 15px 24px;
	text-decoration: none;
	font-size: 16px;
	font-style: normal;
	font-weight: 500;
	line-height: 19px;
	transition: all 0.3s;
	display: inline-flex;
	text-align: center;
	align-items: center;
	justify-content: center;
	gap: 8px;
	cursor: pointer;
	border: none;
	.d_icon {
		font-size: 18px;
	}
}

.a-d_icon-hover {
	color: var(--secondary-color);
	transition: all 0.3s;

	&:hover {
		color: var(--link-color-hover);
	}
}

.a-dart-btn-primary {
	background: var(--primary-color);
	color: var(--white-color);

	&:hover {
		background: var(--primary-hover);
		color: var(--white-color);
	}
}

.a-dart-btn-primary-mini {
	font-size: 14px;
	padding: 8px 16px;
	background: var(--primary-color);
	color: var(--white-color);

	&:hover {
		background: var(--primary-hover);
		color: var(--white-color);
	}
}

.a-dart-btn-secondary {
	background: var(--white-color);
	color: var(--secondary-color);
	border: 1px solid #e2e2e2;

	&:hover {
		background: var(--btn-secondary-color);
		color: var(--secondary-color);
	}
}

.a-dart-btn-secondary-mini {
	font-size: 14px;
	padding: 8px 16px;
	background: var(--white-color);
	color: var(--secondary-color);
	border: 1px solid #e2e2e2;

	&:hover {
		background: var(--btn-secondary-color);
		color: var(--secondary-color);
	}
}

.a-dart-btn-choice {
	background: var(--btn-secondary-outline-background);
	justify-content: space-between;

	p {
		color: var(--text-color-dop);
		font-weight: 400;
		font-size: 16px;
		line-height: 16px;
	}
	i {
		color: var(--secondary-color);
		font-size: 24px;
	}

	&:hover {
		background: var(--btn-secondary-outline-hover);
	}
}

.a-dart-btn-secondary-outline {
	background: var(--btn-secondary-outline-background);
	color: var(--btn-secondary-outline-color);

	&:hover {
		background: var(--btn-secondary-outline-hover);
		color: var(--btn-secondary-outline-color);
	}
}

.a-dart-btn-secondary-outline-mini {
	font-size: 14px;
	padding: 8px 16px;
	background: var(--btn-secondary-outline-background);
	color: var(--btn-secondary-outline-color);

	&:hover {
		background: var(--btn-secondary-outline-hover);
		color: var(--btn-secondary-outline-color);
	}

	.d_icon {
		font-size: 16px;
	}
}

.a-dart-btn-icon-list {
	color: var(--secondary-color);
	border: 1px solid var(--border-color);
	background: var(--white-color);
	display: inline-flex;
	align-items: center;
	gap: 8px;

	.d_icon-down-arrow {
		font-size: 12px;
		position: relative;
		top: 2px;
	}

	&:hover {
		color: var(--secondary-color);
		background-color: var(--btn-secondary-color);
	}
}

.a-dart-btn-radio {
	padding: 0;
	input {
		display: none;
	}

	label {
		background-color: var(--btn-secondary-outline-background);
		color: var(--secondary-color);
		cursor: pointer;
		padding: 15px 24px;
		border-radius: 5px;

		&:hover {
			background-color: var(--btn-secondary-outline-hover);
		}
	}

	input:checked + label {
		background-color: var(--secondary-color);
		color: var(--white-color);
	}
}

.a-dart-btn-radio-mini {
	padding: 0 !important;
	input {
		display: none;
	}

	label {
		background-color: var(--btn-secondary-outline-background);
		color: var(--secondary-color);
		cursor: pointer;
		font-size: 14px;
		padding: 8px 16px;
		border-radius: 5px;

		&:hover {
			background-color: var(--btn-secondary-outline-hover);
		}
	}

	input:checked + label {
		background-color: var(--secondary-color);
		color: var(--white-color);
	}
}

.a-dart-input input {
	outline: none;
	border-radius: 5px;
	background: var(--btn-secondary-outline-background);
	transition: all 0.3s;
	color: var(--secondary-color);
	font-size: 16px;
	font-style: normal;
	font-weight: 400;
	line-height: 16px;
	width: 100%;
}

.a-dart-input-search input {
	padding: 14px 44px;
	border: 1px solid transparent;

	&:focus {
		border: 1px solid var(--border-color);
	}
}

.a-dart-input-search {
	position: relative;
	&::before {
		content: "\e908";
		position: absolute;
		font-size: 18px;
		font-family: "primeicons" !important;
		top: 50%;
		transform: translate(0, -50%);
		left: 12px;
		z-index: 3;
		color: #282828;
	}
}

.a-dart-input-text input {
	padding: 16px 12px;
	border: 1px solid transparent;

	&:focus {
		border: 1px solid var(--border-color);
	}
}

.a-dart-btn-next {
	&:hover {
		background: var(--color-prev-hover);
		filter: drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.08));
		transition: all 0.3s;
	}
}

.a-dart-btn-prev {
	&:hover {
		background: var(--color-prev-hover);
		filter: drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.08));
		transition: all 0.3s;
	}
}

.a-dart-link-all {
	&:hover {
		color: var(--link-color-hover);
		transition: all 0.3s;
	}
}

.a-btn-close {
	cursor: pointer;
	background: var(--color-sitebar-text);
	opacity: 0.3;
	color: var(--white-color) !important;
	width: 24px !important;
	height: 24px !important;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	transition: all 0.3s;
	padding: 0;

	&:hover {
		background: var(--color-sitebar-text);
		opacity: 0.5;
		color: var(--white-color) !important;
	}

	.d_icon {
		font-size: 8px;
	}
}

.a-dart-textarea {
	width: 100%;
	background: var(--btn-secondary-outline-background);
	border-radius: 5px;
	padding: 16px 12px;
	transition: all 0.3s;
	color: var(--secondary-color);
	font-size: 16px;
	border: 1px solid transparent;
	outline: none;
	resize: none;

	&:focus {
		border: 1px solid var(--border-color);
	}
}
</style>
