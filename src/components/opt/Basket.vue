<template>
	<div :class="`std-basket ${this.isOpened ? 'std-basket--active' : ''}`">
		<div class="d-col-basket std-basket__inner" :class="{'loading': this.loadingClearBasket}">
			<div class="std-basket__header-wrapper">
				<div class="std-basket__header" @click.stop="this.isOpened = !this.isOpened">
					<div class="std-basket__title-container">
						<p class="d-col-basket__title std-basket__title"><span>{{namePathIsNav == 'purchases' ? "Корзина" : "Предложение"}}</span></p>
						<div class="std-cart-icon__wrapper">
							<span class="basket-count-all" v-if="this.basket?.cart_data?.sku_count">{{
								this.basket?.cart_data?.sku_count
							}}</span
							><span class="basket-count-all" v-else>0</span>
						</div>
					</div>
					<button class="std-basket__expand-button">
						<i class="pi pi-angle-down std-basket__expand-icon"></i>
					</button>
				</div>
				<div class="std-basket__warehouse-wrapper" v-if="this.cartLength && this.basket.length">
					<span class="std-basket__warehouse-title">Адрес доставки заказа:</span>
					<div class="std-basket__warehouse-container">
						<div @click="setWarehouse(whs.store_data.id)" v-for="whs in this.basket?.data" v-bind:key="whs.store_data.id" class="std-basket__warehouse" :class="{'std-basket__warehouse--active' : warehouse_basket == whs.store_data.id}">
							<span v-if="whs.store_data.name_short && whs.store_data.address_short">«{{whs.store_data.name_short}}», {{ whs.store_data.address_short }}</span>
							<span v-else>«{{whs.store_data.name}}», {{ whs.store_data.address }}</span>
						</div>
					</div>
				</div>

				<div v-if="this.cartLength" class="std-basket__info-container">
					<router-link class="std-basket__info-show-catalog" itemprop="item" :to="{ name: 'purchases_catalog', params: { id: this.$route.params.id, category_id: 4 }, query: {basket: true} }">
						Показать в каталоге
					</router-link>
					
					<button @click="this.showClearBasketModal = true" class="basketClear std-basket__clear-button">
						<span>Очистить корзину</span>
						<i class="pi pi-times"></i>
					</button>
				</div>
			</div>
			<div className="basket-empty" v-if="this.cartLength == 0">
				<div className="basket-empty__content">
					<img
						class="hidden-mobile-l"
						src="../../assets/images/icons/basket.svg"
						alt=""
					/>
					<h3>В вашей корзине пока пусто</h3>
				</div>
			</div>
			<!-- {{ this.warehouse_basket }} -->
			<div v-if="Object.prototype.hasOwnProperty.call(this.basket, 'data')" class="basket-container">
				<div v-if="Object.prototype.hasOwnProperty.call(this.basket.data, warehouse_basket)">
					<div v-for="org in this.basket.data[warehouse_basket].data" v-bind:key="org.org_data.id">
						<div class="basket-container__adres flex justify-content-space-between align-items-center" :style="{ background: org.org_data.color }">
							<div>{{ org.org_data.name }}</div>
							<i @click="() => {
								this.showClearBasketModal = true
								this.id_clear_org = org.org_data.id
							}" class="pi pi-times cursor-pointer"></i>
						</div>
						<div class="kenost-basket-product" v-for="warehouse in org.data" v-bind:key="warehouse.warehouse_data.id">							
							<div class="kenost-product-basket" v-for="(product, p_key) in warehouse.data" v-bind:key="product.remain_id">
								<!-- {{ console.log(product) }} -->
								<div
									class="kenost-basket"
								>
									<div
										@click="clearBasketProduct(org.org_data.id, warehouse.warehouse_data.id, p_key, product)"
										class="btn-close link-no-style"
									>
										<!-- <i class="d_icon d_icon-close"></i> -->
										<img src="../../assets/images/icons/close.svg" alt="" />
									</div>
									<div class="kenost-basket__product">
										<p class="kenost-basket__name" :title="product.name">
											{{ product.name }}
										</p>
										<div class="kenost-basket__info">
											<span>{{ product.article }}</span>
											<div class="kenost-basket__info-left">
												<div :class="{'loading-counter': this.fetchIds.indexOf(product.key) != -1 }">
													<Counter
														@ElemCount="ElemCount"
														:item="{basket, product}"
														:mini="true"
														:min="0"
														:max="product?.available"
														:value="product?.count"
														:step="product?.multiplicity ? product?.multiplicity : 1"
														:id="product?.remain_id"
														:key="product?.key"
													/>
												</div>
												<b>{{ (product?.cost).toLocaleString("ru") }} ₽</b>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div :class="{'kenost-basket-product': warehouse?.complects}" v-for="warehouse in org.data" v-bind:key="warehouse.warehouse_data.id">
							<div
								v-if="warehouse?.complects"
								v-for="complect in warehouse.complects"
								v-bind:key="complect.id"
								class="kenost-product-basket kenost-product-basket-complect"
							>
								<span class="complect-icon">Комплект</span>
								<div
									class="kenost-basket"
									v-for="(product, index) in complect.products"
									v-bind:key="product.id"
								>
									<!-- {{ product.test }} -->
									<div
										@click="clearBasketComplect(product)"
										class="btn-close link-no-style"
									>
										<img src="../../assets/images/icons/close.svg" alt="" />
									</div>
									<div class="kenost-basket__product">
										<p class="kenost-basket__name" :title="product.name">
											{{ product.name }}
										</p>
										<div class="kenost-basket__info">
											<span>{{ product.article }}</span>
											<div class="kenost-basket__info-left">
												<div :class="{'loading-counter': this.fetchIds.indexOf(product.key) != -1 }">
													<Counter
														@ElemCount="ElemComplectCount"
														:item="product"
														:mini="true"
														:min="0"
														:step="Number(product.multiplicity)"
														:max="complect?.remain * Number(product.multiplicity)"
														:value="complect?.count * Number(product.multiplicity)"
														:id="product?.id_remain"
														:store_id="product?.store_id"
													/>
												</div>
												<b>{{ (Number(product?.prices.price) * Number(product.multiplicity) * Number(complect?.count)).toLocaleString("ru") }} ₽</b>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
							
							
						
	
	
						<!-- ПОДАРОК -->
						<!-- <div
							v-for="complect in store.complects"
							v-bind:key="complect.id"
							class="kenost-basket__complect"
						>
							<div class="kenost-basket">
								<div
									@click="clearBasketComplect(store.id, complect.info.id)"
									class="btn-close link-no-style"
								>
									<img src="../../assets/images/icons/close.svg" alt="" />
								</div>
								<div class="kenost-basket__product">
									<p class="kenost-basket__name" :title="complect.products[0].name">
										{{ complect.products[0].name }}
									</p>
									<div class="kenost-basket__info">
										<span>{{ complect.products[0].article }}</span>
										<div class="kenost-basket__info-left">
											<Counter
												:key="new Date().getMilliseconds() + complect.info.id"
												@ElemCount="ElemComplectCount"
												:mini="true"
												:min="1"
												:max="complect.info.complect_data?.min_count"
												:value="complect.info.count"
												:id="complect.info.id"
												:store_id="store.id"
											/>
											<b
												>{{
													(
														complect.products[0].info.count *
														complect.products[0].info.price
													).toLocaleString("ru")
												}}
												₽</b
											>
										</div>
									</div>
									<div class="kenost-basket__hide" @click="showGift($event.target)">
										— Посмотреть подарок
									</div>
								</div>
							</div>
							<div class="kenost-basket-gift__container">
								<div
									v-for="(product, index) in complect.products"
									v-bind:key="product.id"
									class="kenost-basket-gift"
									:class="{ none: index === 0 }"
								>
									<p
										v-if="index !== 0"
										class="kenost-basket-gift__name"
										:title="product.name"
									>
										{{ product.name }}
									</p>
									<div v-if="index !== 0" class="kenost-basket-gift__info">
										<span>{{ product.article }}</span>
										<span
											>{{ product.info.count.toLocaleString("ru") }} х
											{{
												(
													Number(product.info.price) /
													Number(product.info.count)
												).toLocaleString("ru")
											}}
											₽</span
										>
									</div>
								</div>
							</div>
						</div> -->
						<!-- <div v-for="product in store.products" v-bind:key="product.id" class="basket-container__card basket-item">
													<img
															class="basket-container__img"
															:src="product.image"
															:alt="product.name"
													/>
													<div class="basket-container__info">
															<div class="basket-container__title">
																	<p>
																			{{product.name}}
																	</p>
																	<div @click="clearBasketProduct(store.id, product.id_remain)" class="btn-close link-no-style"
																			><i class="d_icon d_icon-close"></i
																	></div>
															</div>
															<p class="basket-container__article">{{product.article}}</p>
															<div class="basket-container__count">
																	<p>В наличии <span>{{ product.remains }} шт.</span></p>
															</div>
															<div class="basket-container__price">
																	<Counter :key="new Date().getMilliseconds() + product.id_remain" @ElemCount="ElemCount" :min="1" :max="product.remains" :value="product.info.count" :id="product.id_remain" :store_id="store.id"/>
																	<b>{{(product.info.count * product.info.price).toLocaleString('ru')}} ₽</b>
															</div>
													</div>
											</div>
											<div v-for="complect in store.complects" v-bind:key="complect.id" class="basket-item">
													<div class="basket-container__complect">
															<div @click="clearBasketComplect(store.id, complect.info.id)" class="btn-close link-no-style"
																	><i class="d_icon d_icon-close"></i
															></div>
															<div v-for="(product, index) in complect.products" v-bind:key="product.id">
																	<div class="basket-container__card">
																			<img
																					class="basket-container__img"
																					:src="product.image"
																					:alt="product.name"
																			/>
																			<div class="basket-container__info">
																					<div class="basket-container__title">
																							<p>
																									{{product.name}}
																							</p>
																					</div>
																					<div class="basket-container__article-container">
																							<p class="basket-container__article">{{product.article}} x {{product.multiplicity * complect.info.count}} шт</p>
																							<b v-if="index != 0">{{(Number(complect.info.count) * product.multiplicity * product.new_price).toLocaleString('ru')}} ₽</b>
																					</div>
																					<div v-if="index === 0" class="basket-container__price">
																							<Counter :key="new Date().getMilliseconds() + complect.info.id" @ElemCount="ElemComplectCount" :min="1" :max="complect.info.complect_data?.min_count" :value="complect.info.count" :id="complect.info.id" :store_id="store.id"/>
																							<b>{{(Number(complect.info.count) * product.multiplicity * product.new_price).toLocaleString('ru')}} ₽</b>
																					</div>
																					<div v-if="index === 0" class="basket-container__count">
																							<p>В наличии <span>{{ complect.info.complect_data?.min_count }} шт.</span></p>
																					</div>
																			</div>
																	</div>
																	<i v-if="index === 0" class="mst-icon mst-icon-link basket-container__link-complect"></i>
															</div>
													</div>
											</div> -->
					</div>
				</div>				
			</div>
			
			<div v-if="this.cartLength" class="std-basket__footer">
				<div class="std-basket__total-container">
					<span class="std-basket__total-label">Итого на поставщика</span>
					<span class="std-basket__total-value">26 580 ₽</span>
				</div>

				<div class="basket-container__adres">
					Мегаснаб, ул. Гоголя, 16, этаж 1, офис 122
				</div>

				<a
					v-if="Object.prototype.hasOwnProperty.call(this.basket, 'data')"
					class="a-dart-btn a-dart-btn-primary btn-arrange button-basket justify-content-space-between"
					@click.prevent="toOrder"
					>{{namePathIsNav == 'purchases' ? "Перейти к заказу" : "Перейти к предложению"}}<span>{{ this.basket.data[warehouse_basket]?.cart_data?.cost?.toLocaleString("ru") }} ₽</span></a
				>
			</div>
			
		</div>
	</div>
	<Dialog v-model:visible="this.modal_remain" header=" " :style="{ width: '340px' }">
		<div class="kenost-not-produc">
			<img src="/images/icons_milen/outOfStock2.png" alt="" />
			<b>У нас нет столько товаров :(</b>
			<p>Извините, но количество данного товара ограничено</p>
			<div class="a-dart-btn a-dart-btn-primary" @click="this.modal_remain = false">
				Понятно
			</div>
		</div>
	</Dialog>

	<Dialog v-model:visible="this.showClearBasketModal" header="Вы точно хотите очистить корзину?" :style="{ width: '340px' }">
		<div class="std-clear-basket dart-mt-2">
			<!-- <img src="../../../public/img/opt/not-products.png" alt="" /> -->
			<button class="dart-btn dart-btn-primary" @click="() => {
				if(this.id_clear_org){
					clearBasketOrg(this.id_clear_org)
				} else {
					clearBasket()
				}
				this.showClearBasketModal = false
				this.id_clear_org = null;
			}">Да</button>
			<button class="dart-btn dart-btn-secondary" @click="() => {
				this.showClearBasketModal = false
				this.id_clear_org = null;
			}">Нет</button>
		</div>
	</Dialog>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import router from "../../router";
import Counter from "./Counter.vue";
import Dialog from "primevue/dialog";

export default {
	name: "Basket",
	emits: ["catalogUpdate", "actionUpdate", "toOrder"],
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
			showClearBasketModal: false,
			isOpened: false,
			active_warehouse: [],
			loading: true,
			basket: {},
			cartLength: 0,
			modal_remain: false,
			timeOut: null,
			fetchIds: [],
			loadingClearBasket: false,
			id_clear_org: null,
			namePathIsNav: null
		};
	},
	methods: {
		...mapActions(["busket_from_api", "opt_warehouse_basket"]),
		ElemComplectCount(object) {
			if (!this.fetchIds.includes(object.item.key)) {
                this.fetchIds.push(object.item.key);
            }
			console.log(object)
			if (object.value == object.min) {
                this.clearBasketProductComplect(object.item)
                return;
            }
			if (object.value > Number(object.max)) {
				this.modal_remain = true;
			} else {
				if(this.timeOut){
                    clearTimeout(this.timeOut);
                }

                this.timeOut = setTimeout(() => {
                    // Ваш запрос на сервер
                    this.$emit("catalogUpdate");
					const data = {
						action: "basket/update",
						extended_name: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? 'offer' : 'cart',
						id: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? router.currentRoute._value.params.id_org_from : router.currentRoute._value.params.id,
						id_complect: object.item.complect_id,
						count: object.value / object.item.multiplicity,
						store_id: object.store_id,
						key: object.item.key,
						org_id: object.item.org_id,
						actions: object.item.actions

					}
					this.busket_from_api(data).then((response) => {
						this.$emit("catalogUpdate");
						this.$emit("actionUpdate");
						if(!response?.data?.data?.success && response?.data?.data?.message){
							this.$toast.add({ severity: 'error', summary: "Ошибка", detail: response?.data?.data?.message, life: 3000 });
						}
					});
					this.busket_from_api({
						action: 'basket/get',
						extended_name: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? 'offer' : 'cart',
						id: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? router.currentRoute._value.params.id_org_from : router.currentRoute._value.params.id,
						warehouse: 'all'
					}).then((response) => {
						if(!response?.data?.data?.success && response?.data?.data?.message){
							this.$toast.add({ severity: 'error', summary: "Ошибка", detail: response?.data?.data?.message, life: 3000 });
						}
						const index = this.fetchIds.indexOf(object.item.key);
						if (index !== -1) {
							this.fetchIds.splice(index, 1); // Удаляем один элемент по индексу
						}
					});	
                }, 1000);
				
			}
		},
		clearBasketProductComplect(product) {
			this.$emit("catalogUpdate");
			this.$emit("actionUpdate");
			const data = {
				action: "basket/remove",
				extended_name: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? 'offer' : 'cart',
				id: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? router.currentRoute._value.params.id_org_from : router.currentRoute._value.params.id,
				key: product.key,
				store_id: product.store_id,
				org_id: product.org_id,
				id_complect: product.complect_id
			};
			this.busket_from_api(data).then((response) => {
				if(!response?.data?.data?.success && response?.data?.data?.message){
					this.$toast.add({ severity: 'error', summary: "Ошибка", detail: response?.data?.data?.message, life: 3000 });
				}
			});
			this.busket_from_api({
				action: 'basket/get',
				extended_name: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? 'offer' : 'cart',
				id: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? router.currentRoute._value.params.id_org_from : router.currentRoute._value.params.id,
				warehouse: 'all'
			}).then((response) => {
				if(!response?.data?.data?.success && response?.data?.data?.message){
					this.$toast.add({ severity: 'error', summary: "Ошибка", detail: response?.data?.data?.message, life: 3000 });
				}
                const index = this.fetchIds.indexOf(product.key);
                if (index !== -1) {
                    this.fetchIds.splice(index, 1); // Удаляем один элемент по индексу
                }
			})
		},
		ElemCount(object) {
			if (!this.fetchIds.includes(object.item.product.key)) {
                this.fetchIds.push(object.item.product.key);
            }
			if (object.value == object.min) {
				this.clearBasketProduct(object.item.product.org_id, object.item.product.store_id, object.item.product.key, object.item.product)
				return;
			};
			if (object.value > Number(object.max)) {
				this.modal_remain = true;
				this.$emit("catalogUpdate");
				const data = {
					action: 'basket/update',
					extended_name: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? 'offer' : 'cart',
					id: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? router.currentRoute._value.params.id_org_from : router.currentRoute._value.params.id,
					org_id: object.item.product.org_id,
					store_id: object.item.product.store_id,
					id_remain: object.id,
					count: object.max,
					key: object.item.product.key,
					actions: object.item.product.actions
				};
				this.busket_from_api(data).then(() => {
					this.busket_from_api({
						action: 'basket/get',
						extended_name: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? 'offer' : 'cart',
						id: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? router.currentRoute._value.params.id_org_from : router.currentRoute._value.params.id,
						warehouse: 'all'
					}).then((response) => {
						if(!response?.data?.data?.success && response?.data?.data?.message){
							this.$toast.add({ severity: 'error', summary: "Ошибка", detail: response?.data?.data?.message, life: 3000 });
						}
						const index = this.fetchIds.indexOf(object.item.product.key);
						if (index !== -1) {
							this.fetchIds.splice(index, 1); // Удаляем один элемент по индексу
						}
					});
				})
			} else {				
				this.$emit("catalogUpdate");
				const data = {
					action: 'basket/update',
					extended_name: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? 'offer' : 'cart',
					id: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? router.currentRoute._value.params.id_org_from : router.currentRoute._value.params.id,
					org_id: object.item.product.org_id,
					store_id: object.item.product.store_id,
					id_remain: object.id,
					count: object.value,
					key: object.item.product.key,
					actions: object.item.product.actions
				};
				this.busket_from_api(data).then((response) => {
					// console.log(response)
					if(!response?.data?.data?.success && response?.data?.data?.message){
						this.$toast.add({ severity: 'error', summary: "Ошибка", detail: response?.data?.data?.message, life: 3000 });
					}
					const datainfo = {
						remain_id: object.id,
						store_id: object.item.product.store_id,
						count: object.value,
						key: object.item.product.key
					};
					// this.$store.commit("SET_OPT_PRODUCTS_MUTATION_TO_VUEX", datainfo);
					this.$emit("catalogUpdate");
					this.$emit("actionUpdate");
					this.$store.commit("SET_SALES_PRODUCTS_MUTATION_TO_VUEX", datainfo);
				});
				if(Number(object.value) != object.old_value){
						window.dataLayer = window.dataLayer || [];
						window.dataLayer.push({
								ecommerce: {
										currencyCode: "RUB",  // Валюта
										add: {
										products: [
											{
												id: object.id,  // ID товара
												name: object.item.product.name,  // Название товара
												price: object.item.basket.price,  // Цена товара
												quantity: object.value,  // Количество товара
											}
										]
										}
								}
						});
				}
				this.busket_from_api({
					action: 'basket/get',
					extended_name: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? 'offer' : 'cart',
					id: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? router.currentRoute._value.params.id_org_from : router.currentRoute._value.params.id,
					warehouse: 'all'
				}).then((response) => {
					if(!response?.data?.data?.success && response?.data?.data?.message){
						this.$toast.add({ severity: 'error', summary: "Ошибка", detail: response?.data?.data?.message, life: 3000 });
					}
                    const index = this.fetchIds.indexOf(object.item.product.key);
                    if (index !== -1) {
                        this.fetchIds.splice(index, 1); // Удаляем один элемент по индексу
                    }
                });				
			}
		},
		clearBasket() {
			this.loadingClearBasket = true
			this.$emit("catalogUpdate");
			this.$emit("actionUpdate");
			const data = {
				action: "basket/clear",
				extended_name: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? 'offer' : 'cart',
				id: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? router.currentRoute._value.params.id_org_from : router.currentRoute._value.params.id,
				// store_id: 'all',
			};
			this.busket_from_api(data).then((response) => {
				if(!response?.data?.data?.success && response?.data?.data?.message){
					this.$toast.add({ severity: 'error', summary: "Ошибка", detail: response?.data?.data?.message, life: 3000 });
				}
			});
			this.busket_from_api({
				action: 'basket/get',
				extended_name: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? 'offer' : 'cart',
				id: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? router.currentRoute._value.params.id_org_from : router.currentRoute._value.params.id,
				warehouse: 'all'
			}).then((response) => {
				if(!response?.data?.data?.success && response?.data?.data?.message){
					this.$toast.add({ severity: 'error', summary: "Ошибка", detail: response?.data?.data?.message, life: 3000 });
				}
				this.loadingClearBasket = false
			})
		},
		clearBasketOrg(id) {
			this.loadingClearBasket = true
			this.$emit("catalogUpdate");
			this.$emit("actionUpdate");
			const data = {
				action: "basket/clear",
				extended_name: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? 'offer' : 'cart',
				id: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? router.currentRoute._value.params.id_org_from : router.currentRoute._value.params.id,
				org_id: id
			};
			this.busket_from_api(data).then((response) => {
				if(!response?.data?.data?.success && response?.data?.data?.message){
					this.$toast.add({ severity: 'error', summary: "Ошибка", detail: response?.data?.data?.message, life: 3000 });
				}
			});
			this.busket_from_api({
				action: 'basket/get',
				extended_name: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? 'offer' : 'cart',
				id: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? router.currentRoute._value.params.id_org_from : router.currentRoute._value.params.id,
				warehouse: 'all'
			}).then((response) => {
				if(!response?.data?.data?.success && response?.data?.data?.message){
					this.$toast.add({ severity: 'error', summary: "Ошибка", detail: response?.data?.data?.message, life: 3000 });
				}
				this.loadingClearBasket = false
			})
		},
		clearBasketProduct(org_id, store_id, key, product) {
			this.$emit("catalogUpdate");
			this.$emit("actionUpdate");
			const data = {
				action: "basket/remove",
				extended_name: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? 'offer' : 'cart',
				id: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? router.currentRoute._value.params.id_org_from : router.currentRoute._value.params.id,
				org_id: org_id,
				store_id: store_id,
				key: key,
				product: product
			};
			this.busket_from_api(data).then((response) => {
				if(!response?.data?.data?.success && response?.data?.data?.message){
					this.$toast.add({ severity: 'error', summary: "Ошибка", detail: response?.data?.data?.message, life: 3000 });
				}
			});

			// Убедитесь, что dataLayer существует
			window.dataLayer = window.dataLayer || [];

			// Отправка данных в dataLayer
			window.dataLayer.push({
			ecommerce: {
				currencyCode: "RUB",  // Валюта
				remove: {
					products: [
						{
							id: product.remain_id,  // ID товара
							name: product.name,  // Название товара
							price: product.price,  // Цена товара
							quantity: product.count,  // Количество товара
						}
					]
				}
			}
			});

			this.busket_from_api({
				action: 'basket/get',
				extended_name: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? 'offer' : 'cart',
				id: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? router.currentRoute._value.params.id_org_from : router.currentRoute._value.params.id,
				warehouse: 'all'
			}).then((response) => {
				if(!response?.data?.data?.success && response?.data?.data?.message){
					this.$toast.add({ severity: 'error', summary: "Ошибка", detail: response?.data?.data?.message, life: 3000 });
				}
				const index = this.fetchIds.indexOf(product.key);
				if (index !== -1) {
					this.fetchIds.splice(index, 1); // Удаляем один элемент по индексу
				}
			})
		},
		clearBasketComplect(product) {
			this.$emit("catalogUpdate");
			this.$emit("actionUpdate");
			const data = {
				action: "basket/remove",
				extended_name: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? 'offer' : 'cart',
				id: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? router.currentRoute._value.params.id_org_from : router.currentRoute._value.params.id,
				key: product.key,
				store_id: product.store_id,
				org_id: product.org_id,
				id_complect: product.complect_id
			};
			this.busket_from_api(data).then((response) => {
				if(!response?.data?.data?.success && response?.data?.data?.message){
					this.$toast.add({ severity: 'error', summary: "Ошибка", detail: response?.data?.data?.message, life: 3000 });
				}
			});
			this.busket_from_api({
				action: 'basket/get',
				extended_name: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? 'offer' : 'cart',
				id: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? router.currentRoute._value.params.id_org_from : router.currentRoute._value.params.id,
				warehouse: 'all'
			}).then((response) => {
				if(!response?.data?.data?.success && response?.data?.data?.message){
					this.$toast.add({ severity: 'error', summary: "Ошибка", detail: response?.data?.data?.message, life: 3000 });
				}
			})
		},
		toOrder() {
			this.$emit("toOrder");
		},
		showGift(e) {
			const el = e.parentElement.parentElement.parentElement.querySelector(
				".kenost-basket-gift__container"
			);
			const text = e.parentElement.parentElement.querySelector(".kenost-basket__hide");
			if (el.style.maxHeight) {
				el.style.maxHeight = null;
				text.innerText = "— Посмотреть подарок";
			} else {
				el.style.maxHeight = el.scrollHeight + "px";
				text.innerText = "— Скрыть подарок";
			}
		},
		setWarehouse(id){
			this.opt_warehouse_basket({
				action: 'set/active/basket/warehouse',
				id: this.$route.params.id,
				id_warehouse: id
			}).then(() => {
				const data = {
					action: "basket/get",
					extended_name: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? 'offer' : 'cart',
					id: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? router.currentRoute._value.params.id_org_from : router.currentRoute._value.params.id,
				};
				this.busket_from_api(data);
				this.busket_from_api({
					action: 'basket/get',
					extended_name: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? 'offer' : 'cart',
					id: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? router.currentRoute._value.params.id_org_from : router.currentRoute._value.params.id,
					warehouse: 'all'
				}).then((response) => {
					if(!response?.data?.data?.success && response?.data?.data?.message){
						this.$toast.add({ severity: 'error', summary: "Ошибка", detail: response?.data?.data?.message, life: 3000 });
					}
				})
			})
		}
	},
	mounted() {
		const data = {
			action: "basket/get",
			extended_name: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? 'offer' : 'cart',
			id: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? router.currentRoute._value.params.id_org_from : router.currentRoute._value.params.id,
		};
		this.busket_from_api(data).then((response) => {
			if(!response?.data?.data?.success && response?.data?.data?.message){
				this.$toast.add({ severity: 'error', summary: "Ошибка", detail: response?.data?.data?.message, life: 3000 });
			}
		});

		this.opt_warehouse_basket({
			action: 'get/active/basket/warehouse',
			id: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? router.currentRoute._value.params.id_org_from : router.currentRoute._value.params.id,
		})

		this.namePathIsNav = router?.currentRoute?._value.matched[4]?.name;
	},
	updated(){
		this.namePathIsNav = router?.currentRoute?._value.matched[4]?.name;
	},
	components: {
		Counter,
		Dialog,
	},
	computed: {
		...mapGetters(["optbasket", "warehouse_basket"])
	},
	watch: {
		optbasket: function (newVal, oldVal) {
			// console.log(newVal)
			this.basket = newVal;
			if(Object.hasOwn(newVal, "data")){
				this.cartLength = Object.keys(newVal.data).length
			}else{
				this.cartLength = 0
			}			
			this.$emit("catalogUpdate");
		},
	},
};
</script>
<style lang="scss">
.basket-container {
	overflow-x: hidden;
}

.kenost-basket-gift {
	background: #f8f7f5;
	border-radius: 5px;
	padding: 12px;
	margin-top: 8px;
	&__name {
		line-height: 18px;
		font-size: 14px;
		white-space: nowrap;
		width: 100%;
		margin-bottom: 4px;
		overflow: hidden;
	}

	&__container {
		max-height: 0px;
		overflow: hidden;
		transition: all 0.5s;
	}

	&.none {
		display: none !important;
	}

	&__info {
		display: flex;
		align-items: center;
		justify-content: space-between;

		span {
			color: #acabab;
			font-size: 14px;
			line-height: 18px;
		}

		b {
			color: #282828;
			font-size: 14px;
			line-height: 18px;
			width: 77px;
			text-align: right;
		}

		&-left {
			display: flex;
			align-items: center;
			gap: 12px;
		}
	}
}

.kenost-basket + .kenost-basket {
	padding-top: 8px;
	margin-top: 8px;
	border-top: 1px solid #e2e2e2;
}

.kenost-basket {
	display: flex;
	gap: 4px;
	overflow: hidden;
	position: relative;

	&:hover {
		.btn-close {
			left: 0px;
		}

		.kenost-basket__product {
			padding-left: 30px;
		}
	}

	&__product {
		width: 100%;
		transition: all 0.4s;
	}

	.btn-close {
		position: absolute;
		top: 50%;
		transform: translate(0, -50%);
		left: -60px;
		transition: all 0.4s;
	}

	&__hide {
		color: #acabab;
		font-size: 14px;
		line-height: 18px;
		margin-top: 4px;
		cursor: pointer;
	}

	&.none {
		display: none !important;
	}

	&__name {
		line-height: 18px;
		font-size: 14px;
		white-space: nowrap;
		width: 100%;
		margin-bottom: 4px;
	}

	&__complect {
		padding-top: 8px;
		margin-top: 8px;
		border-top: 1px solid #e2e2e2;
	}

	&__info {
		display: flex;
		align-items: center;
		justify-content: space-between;

		span {
			color: #acabab;
			font-size: 14px;
			line-height: 18px;
		}

		b {
			color: #282828;
			font-size: 14px;
			line-height: 18px;
			width: 77px;
			text-align: right;
		}

		&-left {
			display: flex;
			align-items: center;
			gap: 12px;
		}
	}
}

.basket-item + .basket-item {
	border-top: 1px solid #e2e2e2;
	padding-top: 16px;
}

.basket-item {
	padding-bottom: 16px;
}

.p-dialog-mask {
	background: rgba(0, 0, 0, 0.3);
}

.kenost-not-produc {
	display: flex;
	flex-direction: column;
	align-items: center;

	.a-dart-btn {
		width: 100%;
	}

	b {
		margin: 24px 0 8px 0;
		font-size: 20px;
		font-style: normal;
		font-weight: 500;
		line-height: 24px;
	}

	p {
		text-align: center;
		max-width: 280px;
		margin-bottom: 24px;
	}
}

.basketClear {
	color: #acabab;
	font-size: 14px;
	font-weight: 400;
	cursor: pointer;
}

.button-basket {
	width: 100%;
	margin-top: 16px;
}

.d-col-basket {
	overflow: hidden;
	padding: 20px;
	// background: #a6fff0;
	border-radius: 5px;
	box-shadow: 0px 0px 18px 0px rgba(0, 0, 0, 0.06);
	max-height: 90vh;
	height: 90vh;
	background: #fff;

	.basket-empty {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;

		&__content {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;

			img {
				width: 130px;
				height: 130px !important;
				object-fit: cover;
			}

			h3 {
				margin-top: 24px;
				max-width: 200px;
				text-align: center;
				margin: 0;
			}
		}
	}

	&__title {
		font-size: 20px;
		font-style: normal;
		font-weight: 500;
		line-height: 24px;
		color: #282828;
		margin-bottom: 16px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	h3 {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 20px;
		span {
			font-size: 14px;
			font-weight: 400;
			color: var(--text-color-dop);
			cursor: pointer;
		}
	}

	.basket-container {
		height: calc(100% - 100px);
		overflow-y: auto;
		padding-bottom: 6px;

		&::-webkit-scrollbar {
			width: 0px;
			background-color: #f9f9fd;
		}

		&__article-container {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin: 8px 0 12px 0;
		}

		&__link-complect {
			color: #adadad;
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 16px 0;
		}

		&__complect {
			background: #f8f7f5;
			padding: 12px 8px;
			border-radius: 5px;
			// border-top: 1px solid #d5d5d5;
			padding-top: 15px;
			position: relative;
			& > .basket-container__info {
				p {
					font-size: 14px;
					font-weight: 500;
				}
			}
			.btn-close {
				position: absolute;
				right: 8px;
				top: 10px;
			}
			.basket-container__title {
				padding: 0;
				display: block;
			}
		}

		&__adres {
			padding: 4px 8px;
			color: #fff;
			font-size: 14px;
			border-radius: 5px;
			width: fit-content;
			margin-bottom: 8px;
		}

		&__title {
			display: flex;
			align-items: center;
			justify-content: space-around;

			a {
				text-decoration: none;
				line-height: 1.1;
				width: calc(100% - 24px);
				margin-bottom: 8px;
				font-size: 14px;
				font-style: normal;
				font-weight: 400;
				line-height: 18px;
				margin: 0;
			}

			p {
				font-size: 14px;
				width: auto;
				width: calc(100% - 24px);
				font-style: normal;
				font-weight: 400;
				line-height: 18px;
				margin: 0;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				overflow: hidden;
			}
		}

		&__article {
			font-size: 14px;
			font-style: normal;
			font-weight: 400;
			line-height: 18px;
			margin: 0;
			color: var(--text-color-dop);
		}

		&__card {
			display: flex;
			gap: 8px;
		}

		&__img {
			width: 40px;
			height: 40px !important;
			object-fit: contain;
		}

		&__count {
			display: flex;
			gap: 8px;

			p {
				font-size: 12px;
				font-style: normal;
				font-weight: 400;
				line-height: 16px;
				margin: 0;
				color: var(--text-color-dop);

				span {
					color: var(--secondary-color);
				}
			}
		}

		&__price {
			margin: 8px 0;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		&__info {
			width: calc(100% - 60px);
		}
	}
}
</style>
