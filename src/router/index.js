import MainLoyout from "../loyouts/MainLoyout.vue";
import ProfileOrganization from "../pages/ProfileOrganization.vue";
import ProfileProducts from "../pages/ProfileProducts.vue";
import ProfileStoreProducts from "../pages/ProfileStoreProducts.vue";
// import ReportCopoAll from '../pages/store/report_copo_all'
// import ReportCopoAllDetails from '../pages/store/report_copo_all_details'
import ReportCopo from "../pages/store/report_copo.vue";
import OrgProfile from "../pages/OrgProfile.vue";
import ProfileProduct from "../pages/ProfileProduct.vue";
import ReportCopoDetails from "../pages/store/report_copo_details.vue";
import Home from "../pages/Home.vue";
import notFound from "../pages/notFound.vue";
import { createRouter, createWebHistory } from "vue-router";
import ProfileShipping from "../pages/ProfileShipping.vue";
import Actions from "../pages/b2c/Actions.vue";
import ActionEdit from "../pages/b2c/ActionEdit.vue";
import Sales from "../pages/b2b/Sales.vue";
import SalesEdit from "../pages/b2b/SalesEdit.vue";
import ComplectEdit from "../pages/b2b/complects/ComplectEdit.vue";
import ProfilePurchases from "../pages/opt/ProfilePurchases.vue";
import PurchasesCatalog from "../pages/opt/PurchasesCatalog.vue";
import PurchasesSearch from "../pages/opt/Search.vue";
import Requirement from '../pages/opt/Requirement.vue'
import Promotion from "../pages/opt/Promotion/Promotion.vue";
import ProfileClients from "../pages/ProfileClients.vue";
import ProfileVendors from "../pages/ProfileVendors.vue";
import MyOrders from "../pages/MyOrders.vue";
import MyOrder from "../pages/MyOrder.vue";
import ProfileStatistics from "../pages/ProfileStatistics.vue";
import ProfileStoreStatistics from "../pages/ProfileStoreStatistics.vue";
import ProfileDiscounts from "../components/opt/ProfileDiscounts.vue";
import ProfileDiscountsEdit from "../pages/ProfileDiscountsEdit.vue";
import RetailOrders from "../pages/RetailOrders.vue";
import Order from "../pages/Order.vue";
import Balance from "../pages/store/balance.vue";
import ProfileClientStatistics from "../pages/ProfileClientStatistics.vue";
import PurchasesActions from "../pages/opt/Actions.vue";
import OrdersOpt from "../pages/OrdersOpt.vue";
import OrderOpt from "../pages/OrderOpt.vue";
import ProfileCreateClient from "../pages/ProfileCreateClient.vue";
import Notifications from "../components/opt/Notifications.vue";
import GroupEdit from "../pages/b2b/groups/GroupEdit.vue";
import Profile from '../pages/Profile.vue'
import ProfileHash from '../pages/ProfileHash.vue'
import OfferOpt from '../pages/OfferOpt.vue'
import MyOffer from '../pages/MyOfferOpt.vue'

const routes = [
	{
		path: "/",
		name: "home",
		component: MainLoyout,
		meta: {
			breadcrumb: {
				label: "Главная",
			},
		},
		props: true,
		name: "prehome",
		children: [
			{
				path: "",
				name: "hommy",
				meta: {
					breadcrumb: {
						label: "Главная",
					},
				},
				children: [
					{
						path: "",
						name: "main",
						props: true,
						label: "Главная",
						meta: {
							breadcrumb: {
								label: "Главная",
							},
						},
						component: Home,
					},
					{
						path: "",
						name: "profileHash",
						props: true,
						label: "Профиль",
						children: [
							{
								path: "profile",
								children: [
									{
										path: ":hash",
										name: "profileConfirmHash",
										props: true,
										label: "Организация",
										component: ProfileHash,
									}
								]
							}
						]
					},
					{
						path: "",
						name: "preenter",
						beforeEnter: (to, from, next) => {
							if (localStorage.getItem("user")) {
								next();
							} else {
								next({ name: "main" });
							}
						},
						children: [
							{
								path: ":id",
								children: [
									{
										path: "",
										name: "org",
										props: true,
										meta: {
											breadcrumb: {
												label: "Организация",
											},
										},
										label: "Организация",
										component: ProfileOrganization,
									},
									{
										path: "profile",
										name: "profile",
										props: true,
										label: "Профиль пользователя",
										meta: {
											breadcrumb: {
												label: "Профиль пользователя",
											},
										},
										component: Profile,
									},
									{
										path: "stores",
										meta: {
											breadcrumb: {
												label: "Товары",
											},
										},
										children: [
											{
												path: "",
												name: "stores",
												props: true,
												label: "Товары",
												meta: {
													breadcrumb: {
														label: "Товары",
													},
												},
												component: ProfileProducts,
											},
											{
												path: "",
												children: [
													{
														path: ":store_id",
														children: [
															{
																path: "",
																name: "store",
																props: true,
																label: "Товары на складе",
																meta: {
																	breadcrumb: {
																		label: "Товары на складе",
																	},
																},
																component: ProfileStoreProducts,
															},
															{
																path: "report",
																meta: {
																	breadcrumb: {
																		label: "Отчет",
																	},
																},
																children: [
																	{
																		path: "",
																		name: "report_copo_store",
																		props: true,
																		label: "Отчет по сопоставлению",
																		meta: {
																			breadcrumb: {
																				label: "Отчет по со лению",
																			},
																		},
																		component: ReportCopo,
																	},
																	{
																		path: ":brand_id",
																		name: "report_copo_details_store",
																		label: "Отчет по бренду",
																		meta: {
																			breadcrumb: {
																				label: "Отчет по бренду",
																			},
																		},
																		component:
																			ReportCopoDetails,
																	},
																],
															},
															{
																path: ":product_id",
																name: "org_product",
																props: true,
																label: "Товар",
																meta: {
																	breadcrumb: {
																		label: "Товар",
																	},
																},
																component: ProfileProduct,
															},
														],
													},
												],
											},
										],
									},
									{
										path: "report",
										meta: {
											breadcrumb: {
												label: "Отчет",
											},
										},
										children: [
											{
												path: "",
												name: "report_copo",
												props: true,
												label: "Отчет по сопоставлению",
												meta: {
													breadcrumb: {
														label: "Отчет по сопоставлению",
													},
												},
												component: ReportCopo,
											},
											{
												path: ":brand_id",
												name: "report_copo_details",
												label: "Отчет по бренду",
												meta: {
													breadcrumb: {
														label: "Отчет по бренду",
													},
												},
												component: ReportCopoDetails,
											},
										],
									},
									{
										path: "b2c",
										meta: {
											breadcrumb: {
												label: "Розничные акции",
											},
										},
										children: [
											{
												path: "",
												name: "b2c",
												props: true,
												label: "Акции",
												meta: {
													breadcrumb: {
														label: "Розничные акции",
													},
												},
												component: Actions,
											},
											{
												path: "add",
												name: "org_action_add",
												props: true,
												label: "Добавление розничной акции",
												meta: {
													breadcrumb: {
														label: "Добавление розничной акции",
													},
												},
												component: ActionEdit,
											},
											{
												path: ":action_id",
												name: "org_action_edit",
												props: true,
												label: "Редактирование акции",
												meta: {
													breadcrumb: {
														label: "Редактирование розничной акции",
													},
												},
												component: ActionEdit,
											},
										],
									},
									{
										path: "b2b",
										meta: {
											breadcrumb: {
												label: "Мои оптовые акции",
											},
										},
										children: [
											{
												path: "",
												name: "b2b",
												props: true,
												label: "Акции",
												meta: {
													breadcrumb: {
														label: "Мои оптовые акции",
													},
												},
												component: Sales,
											},
											{
												path: "add",
												name: "org_sales_add",
												props: true,
												label: "Добавление акции",
												meta: {
													breadcrumb: {
														label: "Добавление оптовой акции",
													},
												},
												component: SalesEdit,
											},
											{
												path: ":sales_id",
												name: "org_sales_edit",
												props: true,
												label: "Редактирование акции",
												meta: {
													breadcrumb: {
														label: "Редактирование оптовой акции",
													},
												},
												component: SalesEdit,
											},
										],
									},
									{
										path: "complects",
										meta: {
											breadcrumb: {
												label: "Комплекты",
											},
										},
										children: [
											{
												path: "create",
												name: "complect_add",
												props: true,
												label: "Добавление комлекта",
												meta: {
													breadcrumb: {
														label: "Добавление комплекта",
													},
												},
												component: ComplectEdit,
											},
											{
												path: ":complect_id",
												name: "complect_edit",
												props: true,
												label: "Редактирование комлекта",
												meta: {
													breadcrumb: {
														label: "Редактирование комплекта",
													},
												},
												component: ComplectEdit,
											},
										],
									},
									{
										path: "groups",
										meta: {
											breadcrumb: {
												label: "Коллекции",
											},
										},
										children: [
											{
												path: "edit",
												name: "groups_edit",
												props: true,
												label: "Добавление коллекции",
												meta: {
													breadcrumb: {
														label: "Добавление коллекции",
													},
												},
												component: GroupEdit,
											},
											{
												path: ":group_id",
												name: "groups_edit_id",
												props: true,
												label: "Редактирование коллекции",
												meta: {
													breadcrumb: {
														label: "Редактирование коллекции",
													},
												},
												component: GroupEdit,
											},
										],
									},
									{
										path: "opt",
										name: "purchases",
										props: true,
										label: "Закупки",
										meta: {
											breadcrumb: {
												label: "Закупки",
											},
										},
										children: [
											{
												path: "",
												name: "purchases_home",
												component: ProfilePurchases,
												label: "Закупки",
												meta: {
													breadcrumb: {
														label: "Закупки",
													},
												},
											},
											{
												path: ":category_id",
												name: "purchases_catalog",
												component: PurchasesCatalog,
												label: "Каталог",
												meta: {
													breadcrumb: {
														label: "",
													},
												},
												props: (route) => ({
													basket: route.query.basket === 'true' // Преобразуем query в boolean
												})
											},
											{
												path: "action",
												meta: {
													breadcrumb: {
														label: "Акции",
													},
												},
												children: [
													{
														path: ":action",
														name: "promotion",
														props: true,
														meta: {
															breadcrumb: {
																label: "Акция",
															},
														},
														component: Promotion,
													},
												],
											},
											{
												path: "warehouses/:org_w_id/:warehouse_id",
												children: [
													{
														path: "",
														name: "purchases_catalog_warehouse",
														component: PurchasesCatalog,
														label: "Каталог оптовика",
														meta: {
															breadcrumb: {
																label: "Каталог оптовика",
																link: "warehouse_id",
															},
														},
													},
													{
														path: ":warehouse_cat_id",
														children: [
															{
																path: "",
																name: "org_opt_waregouse_category",
																label: "Мой оптовик",
																component: PurchasesCatalog,
															},
														],
													},
												],
											},
											{
												path: "search",
												meta: {
													breadcrumb: {
														label: "Поиск",
													},
												},
												children: [
													{
														path: ":search",
														name: "opt_search",
														props: true,
														meta: {
															breadcrumb: {
																label: "Поиск"
															}
														},
														component: PurchasesSearch,
													},
												],
											},
											{
												path: "req",
												meta: {
													breadcrumb: {
														label: "Потребность",
													},
												},
												children: [
													{
														path: ":req",
														name: "opt_req",
														props: true,
														meta: {
															breadcrumb: {
																label: "Потребность"
															}
														},
														component: Requirement,
													},
												],
											}
										],
									},
									{
										path: "offer/:id_org_from?",
										name: "purchases_offer",
										props: true,
										label: "Закупки",
										meta: {
											breadcrumb: {
												label: "Закупки",
											},
										},
										children: [
											{
												path: "",
												name: "purchases_home_offer",
												component: ProfilePurchases,
												label: "Закупки",
												meta: {
													breadcrumb: {
														label: "Закупки",
													},
												},
											},
											{
												path: ":category_id",
												name: "purchases_catalog_offer",
												component: PurchasesCatalog,
												label: "Каталог",
												meta: {
													breadcrumb: {
														label: "Каталог",
													},
												},
											},
											{
												path: "action_offer",
												meta: {
													breadcrumb: {
														label: "Акции",
													},
												},
												children: [
													{
														path: ":action",
														name: "promotion_offer",
														props: true,
														meta: {
															breadcrumb: {
																label: "Акция",
															},
														},
														component: Promotion,
													},
												],
											},
											{
												path: "warehouses/:org_w_id/:warehouse_id",
												children: [
													{
														path: "",
														name: "purchases_catalog_warehouse_offer",
														component: PurchasesCatalog,
														label: "Каталог оптовика",
														meta: {
															breadcrumb: {
																label: "Каталог оптовика",
																link: "warehouse_id",
															},
														},
													},
													{
														path: ":warehouse_cat_id",
														children: [
															{
																path: "",
																name: "org_opt_warehouse_category_offer",
																label: "Мой оптовик",
																component: PurchasesCatalog,
															},
														],
													},
												],
											},
											{
												path: "search_offer",
												meta: {
													breadcrumb: {
														label: "Поиск",
													},
												},
												children: [
													{
														path: ":search",
														name: "opt_search_offer",
														props: true,
														meta: {
															breadcrumb: {
																label: "Поиск",
															},
														},
														component: PurchasesSearch,
													},
												],
											},
											{
												path: "req",
												meta: {
													breadcrumb: {
														label: "Потребность",
													},
												},
												children: [
													{
														path: ":req",
														name: "offer_req",
														props: true,
														meta: {
															breadcrumb: {
																label: "Потребность"
															}
														},
														component: Requirement,
													},
												],
											}
										],
									},									
									{
										path: "opt/actions",
										name: "opt_actions",
										meta: {
											breadcrumb: {
												label: "Оптовые акции",
											},
										},
										component: PurchasesActions,
									},
									{
										path: "notifications",
										name: "purchases_notifications",
										component: Notifications,
										label: "Уведомления",
										meta: {
											breadcrumb: {
												label: "Уведомления",
											},
										}
									},
									{
										path: "settings",
										name: "org_settings",
										meta: {
											breadcrumb: {
												label: "Настройки",
											},
										},
										component: OrgProfile,
									},
									{
										path: "shipments",
										name: "shipments",
										meta: {
											breadcrumb: {
												label: "Отгрузки",
											},
										},
										component: ProfileShipping,
									},
									{
										path: "discounts",
										meta: {
											breadcrumb: {
												label: "Индивидуальные скидки",
											},
										},
										children: [
											{
												path: "",
												children: [
													{
														path: "",
														name: "discounts",
														meta: {
															breadcrumb: {
																label: "Индивидуальные скидки",
															},
														},
														component: ProfileDiscounts,
													},
													{
														path: "add",
														name: "discounts_add",
														props: true,
														label: "Добавление скидки",
														meta: {
															breadcrumb: {
																label: "Добавление скидки",
															},
														},
														component: ProfileDiscountsEdit,
														props: (route) => ({
															agreement: route.query.agreement // Преобразуем query в boolean
														})
													},
													{
														path: ":action_id",
														name: "discounts_edit",
														meta: {
															breadcrumb: {
																label: "Редактиование скидки",
															},
														},
														component: ProfileDiscountsEdit,
													},
												],
											},
										],
									},
									{
										path: "statistics",
										meta: {
											breadcrumb: {
												label: "Статистика",
											},
										},
										children: [
											{
												path: "",
												name: "statistics",
												meta: {
													breadcrumb: {
														label: "Статистика",
													},
												},
												component: ProfileStatistics,
											},
											{
												path: ":store_id",
												name: "statistics_id",
												meta: {
													breadcrumb: {
														label: "Статистика",
													},
												},
												component: ProfileStoreStatistics,
											},
										],
									},
									{
										path: "offers/:offer_id",
										name: "my_offer_id",
										meta: {
											breadcrumb: {
												label: "Мои заказы",
											},
										},
										component: MyOffer,
									},
									{
										path: "orders",
										meta: {
											breadcrumb: {
												label: "Розничные заказы",
											},
										},
										children: [
											{
												path: "",
												children: [
													{
														path: "",
														name: "retail_orders",
														meta: {
															breadcrumb: {
																label: "Розничные заказы",
															},
														},
														component: RetailOrders,
													},
													{
														path: ":order_id",
														name: "retail_orders_id",
														meta: {
															breadcrumb: {
																label: "Розничный заказ",
																path: "retail_order_id",
															},
														},
														component: Order,
													},
												],
											},
											{
												path: "my",
												meta: {
													breadcrumb: {
														label: "Мои заказы",
													},
												},
												children: [
													{
														path: "",
														name: "my_orders",
														meta: {
															breadcrumb: {
																label: "Мои заказы",
															},
														},
														component: MyOrders,
													},
													{
														path: ":order_id",
														name: "my_orders_id",
														meta: {
															breadcrumb: {
																label: "Мой заказ",
																path: "order_id",
															},
														},
														component: MyOrder,
													},
												],
											},
											{
												path: "opt",
												meta: {
													breadcrumb: {
														label: "Оптовые заказы",
													},
												},
												children: [
													{
														path: "",
														name: "opt_orders",
														meta: {
															breadcrumb: {
																label: "Оптовые заказы",
															},
														},
														component: OrdersOpt,
													},
													{
														path: ":order_id",
														name: "my_orders_opt_id",
														meta: {
															breadcrumb: {
																label: "Мой оптовый заказ",
																path: "opt_order_id"
															},
														},
														component: OrderOpt,
													},
												],
											},
										],
									},
									{
										path: "vendors",
										name: "vendors",
										meta: {
											breadcrumb: {
												label: "Доступные поставщики",
											},
										},
										component: ProfileVendors,
									},
									{
										path: "clients",
										meta: {
											breadcrumb: {
												label: "Мои клиенты",
											},
										},
										children: [
											{
												path: "",
												name: "clients",
												meta: {
													breadcrumb: {
														label: "Мои клиенты",
													},
												},
												component: ProfileClients,
											},
											{
												path: ":client_id",
												name: "client_id",
												meta: {
													breadcrumb: {
														label: "Клиент",
													},
												},
												component: ProfileClientStatistics,
											},
											{
												path: "create",
												name: "client_create",
												meta: {
													breadcrumb: {
														label: "Создание клиента",
													},
												},
												component: ProfileCreateClient,
											},
											{
												path: "update/:client_id",
												name: "client_update",
												meta: {
													breadcrumb: {
														label: "Редактирование клиента",
													},
												},
												component: ProfileCreateClient,
											},
											{
												path: "offer",
												name: "clients_offer",
												children: [
													{
														path: ":offer_id",
														name: "offer_view",
														meta: {
															breadcrumb: {
																label: "Предложение",
															},
														},
														component: OfferOpt,
													}
												]
											}
										],
									},
									{
										path: "balance",
										name: "org_balance",
										meta: {
											breadcrumb: {
												label: "Баланс",
											},
										},
										component: Balance,
									},
								],
								// path: "/auth/register",
								// component: Register
							},
						],
					},
				],
			},
		],
	},
	{
		path: "/:pathMatch(.*)*",
		name: "404",
		component: notFound,
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
	scrollBehavior(to, from, savedPosition) {
	// Прокрутить страницу наверх при каждом переходе
	return { top: 0 };
	},
});

export default router;
