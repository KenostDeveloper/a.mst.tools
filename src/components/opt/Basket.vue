<template>
	<div :class="`std-basket ${this.isOpened ? 'std-basket--active' : ''}`">
		<div class="d-col-basket std-basket__inner">
			<div class="std-basket__header-wrapper">
				<div class="std-basket__header" @click.stop="this.isOpened = !this.isOpened">
					<div class="std-basket__title-container">
						<p class="d-col-basket__title std-basket__title"><span>Корзина</span></p>
						<!-- {{ this.basket }} -->
						<div class="std-cart-icon__wrapper">
							<span class="basket-count-all" v-if="this.basket?.count">{{
								this.basket?.count
							}}</span
							><span class="basket-count-all" v-else>0</span>
						</div>
					</div>
					<button class="std-basket__expand-button">
						<i class="pi pi-angle-down std-basket__expand-icon"></i>
					</button>
				</div>

				<div class="std-basket__warehouse-wrapper" v-if="this.basket?.warehouses?.length > 0">
					<span class="std-basket__warehouse-title">Склад для доставки заказа:</span>
					<div class="std-basket__warehouse-container">
						<div @click="setWarehouse(warehous.id)" v-for="warehous in this.basket?.warehouses" v-bind:key="warehous.id" class="std-basket__warehouse" :class="{'std-basket__warehouse--active' : warehouse_basket == warehous.id}">
							«{{warehous.name_short}}», {{ warehous.address_short }}
						</div>
					</div>
				</div>

				<div v-if="this.basket?.stores" class="std-basket__info-container">
					<button @click="this.showClearBasketModal = true" class="basketClear std-basket__clear-button">
						Очистить корзину
						<i class="pi pi-times"></i>
					</button>
				</div>
			</div>
			<div className="basket-empty" v-if="!this.basket?.stores">
				<div className="basket-empty__content">
					<img
						class="hidden-mobile-l"
						src="../../assets/images/icons/basket.svg"
						alt=""
					/>
					<img
						class="visible-mobile-l"
						src="../../assets/images/icons/basket-gray.svg"
						alt=""
					/>
					<h3>В вашей корзине пока пусто</h3>
				</div>
			</div>
			<div v-if="this.basket?.stores" class="basket-container">
				<div v-for="store in this.basket?.stores" v-bind:key="store.id">
					<div class="basket-container__adres" :style="{ background: store.color }">
						{{ store.name }}
					</div>
					<div
						class="kenost-product-basket"
						v-for="product in store.products"
						v-bind:key="product.id"
					>
						<div
							class="kenost-basket"
							v-for="basket in product.basket"
							v-bind:key="product.id"
						>
							<div
								@click="clearBasketProduct(store.id, product.id_remain)"
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
										<Counter
											:key="new Date().getMilliseconds() + product.id_remain"
											@ElemCount="ElemCount"
											:item="basket"
											:mini="true"
											:min="1"
											:max="product?.remains"
											:value="basket?.count"
											:id="product?.id_remain"
											:store_id="store.id"
										/>
										<b>{{ (basket?.cost).toLocaleString("ru") }} ₽</b>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div
						v-for="complect in store.complects"
						v-bind:key="complect.id"
						class="kenost-product-basket kenost-product-basket-complect"
					>
						<!-- {{ console.log(complect) }} -->
						<span class="complect-icon">Комплект</span>
						<div
							class="kenost-basket"
							v-for="(product, index) in complect.products"
							v-bind:key="product.id"
						>
						
							<div
								@click="clearBasketComplect(store.id, product.complect_id)"
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
										<Counter
											:key="new Date().getMilliseconds() + product.id_remain"
											@ElemCount="ElemComplectCount"
											:item="product"
											:mini="true"
											:min="1"
											:step="Number(product.multiplicity)"
											:max="complect?.info?.complect_data?.min_count * Number(product.multiplicity)"
											:value="complect?.info?.count * Number(product.multiplicity)"
											:id="product?.id_remain"
											:store_id="store.id"
										/>
										<b>{{ (Number(product?.new_price) * complect?.info?.complect_data?.min_count * Number(product.multiplicity)).toLocaleString("ru") }} ₽</b>
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
			
			<div v-if="this.basket?.stores" class="std-basket__footer">
				<div class="std-basket__total-container">
					<span class="std-basket__total-label">Итого на поставщика</span>
					<span class="std-basket__total-value">26 580 ₽</span>
				</div>

				<div class="basket-container__adres">
					Мегаснаб, ул. Гоголя, 16, этаж 1, офис 122
				</div>

				<a
					class="a-dart-btn a-dart-btn-primary btn-arrange button-basket"
					@click.prevent="toOrder"
					>Оформить заказ <span>{{ this.basket?.cost?.toLocaleString("ru") }} ₽</span></a
				>
			</div>
			
		</div>
	</div>
	<Dialog v-model:visible="this.modal_remain" header=" " :style="{ width: '340px' }">
		<div class="kenost-not-produc">
			<!-- <img src="../../../public/img/opt/not-products.png" alt="" /> -->
			<b>У нас нет столько товаров :(</b>
			<p>Извините, но количество данного товара ограничено</p>
			<div class="a-dart-btn a-dart-btn-primary" @click="this.modal_remain = false">
				Понятно
			</div>
		</div>
	</Dialog>

	<Dialog v-model:visible="this.showClearBasketModal" header="Вы точно хотите очистить корзину?" :style="{ width: '340px' }">
		<div class="std-clear-basket">
			<!-- <img src="../../../public/img/opt/not-products.png" alt="" /> -->
			<button class="dart-btn dart-btn-primary" @click="clearBasket">Да</button>
			<button class="dart-btn dart-btn-secondary" @click="this.showClearBasketModal = false">Нет</button>
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
			modal_remain: false,
		};
	},
	methods: {
		...mapActions(["busket_from_api", "opt_warehouse_basket"]),
		updateBasket() {
			//   const data = { action: 'basket/get', id: router.currentRoute._value.params.id }
			//   this.busket_from_api(data).then(
			//     this.basket = this.optbasket
			//   )
		},
		ElemComplectCount(object) {
			console.log(object)
			if (object.value > Number(object.max)) {
				this.modal_remain = true;
			} else {
				this.$emit("catalogUpdate");
				const data = {
					action: "basket/update",
					id: router.currentRoute._value.params.id,
					id_complect: object.item.complect_id,
					value: object.value / object.item.multiplicity,
					store_id: object.store_id,
				};
				this.busket_from_api(data).then((response) => {
					const datainfo = {
						complect_id: object.item.complect_id,
						store_id: object.store_id,
						count: object.value / object.item.multiplicity,
					};
					this.$store.commit("SET_OPT_COMPLECT_MUTATION_TO_VUEX", datainfo);
					this.$store.commit("SET_SALES_COMPLECT_MUTATION_TO_VUEX", datainfo);
				});
				this.busket_from_api({
					action: 'basket/get',
					id: router.currentRoute._value.params.id,
					warehouse: 'all'
				})
			}
		},
		ElemCount(object) {
			if (object.value > Number(object.max)) {
				this.modal_remain = true;
			} else {
				this.$emit("catalogUpdate");
				const data = {
					action: "basket/update",
					id: router.currentRoute._value.params.id,
					id_remain: object.id,
					value: object.value,
					store_id: object.store_id,
					actions: object.item.actions_ids,
				};
				this.busket_from_api(data).then((response) => {
					const datainfo = {
						remain_id: object.id,
						store_id: object.store_id,
						count: object.value,
					};
					this.$store.commit("SET_OPT_PRODUCTS_MUTATION_TO_VUEX", datainfo);
					this.$store.commit("SET_SALES_PRODUCTS_MUTATION_TO_VUEX", datainfo);
				});
				this.busket_from_api({
					action: 'basket/get',
					id: router.currentRoute._value.params.id,
					warehouse: 'all'
				})
			}
		},
		clearBasket() {
			this.$emit("catalogUpdate");
			this.$emit("actionUpdate");
			const data = {
				action: "basket/clear",
				id: router.currentRoute._value.params.id,
				// store_id: 'all',
			};
			this.busket_from_api(data).then((response) => {});
			this.busket_from_api({
				action: 'basket/get',
				id: router.currentRoute._value.params.id,
				warehouse: 'all'
			})

			this.showClearBasketModal = false;
		},
		clearBasketProduct(storeid, productid) {
			this.$emit("catalogUpdate");
			this.$emit("actionUpdate");
			const data = {
				action: "basket/clear",
				id: router.currentRoute._value.params.id,
				store_id: storeid,
				id_remain: productid,
			};
			this.busket_from_api(data).then((response) => {});
			this.busket_from_api({
				action: 'basket/get',
				id: router.currentRoute._value.params.id,
				warehouse: 'all'
			})
		},
		clearBasketComplect(storeid, complectid) {
			this.$emit("catalogUpdate");
			this.$emit("actionUpdate");
			const data = {
				action: "basket/clear",
				id: router.currentRoute._value.params.id,
				store_id: storeid,
				id_complect: complectid,
			};
			this.busket_from_api(data).then((response) => {});
			this.busket_from_api({
				action: 'basket/get',
				id: router.currentRoute._value.params.id,
				warehouse: 'all'
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
				const data = { action: "basket/get", id: router.currentRoute._value.params.id };
				this.busket_from_api(data);
				this.busket_from_api({
					action: 'basket/get',
					id: router.currentRoute._value.params.id,
					warehouse: 'all'
				})
			})
		}
	},
	mounted() {
		const data = { action: "basket/get", id: router.currentRoute._value.params.id };
		this.busket_from_api(data);

		this.opt_warehouse_basket({
			action: 'get/active/basket/warehouse',
			id: this.$route.params.id
		})
	},
	components: {
		Counter,
		Dialog,
	},
	computed: {
		...mapGetters(["optbasket", "warehouse_basket"]),
	},
	watch: {
		optbasket: function (newVal, oldVal) {
			this.basket = newVal;
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
	max-height: 700px;
	height: 70vh;
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
