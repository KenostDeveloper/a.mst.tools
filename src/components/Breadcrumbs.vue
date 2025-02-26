<template>
	<nav class="breadcrumbs" aria-label="breadcrumbs">
		<ul class="breadcrumb">
			<template v-for="(crumb, index) in breadcrumbs">
				<li
					v-if="crumb"
					class="breadcrumb-item"
					:class="{ active: index === breadcrumbs.length - 1 }"
				>
					<router-link itemprop="item" :to="crumb.path"
						><span itemprop="name">{{ crumb.name }}</span></router-link
					>
				</li>
				<li
					v-if="index !== breadcrumbs.length - 1 && crumb"
					class="breadcrumb-item breacrumb-item--separator"
				>
					/
				</li>
			</template>
			<template v-for="(crumb, index) in items" v-if="items && name == 'org_opt_waregouse_category'">
				<li
					v-if="crumb"
					class="breadcrumb-item"
					:class="{ active: index === items.length - 1 }"
				>
					<router-link v-if="name == 'purchases_catalog' && this.$route.params.category_id != crumb.id" itemprop="item" :to="{name: 'purchases_catalog', params: { id: this.$route.params.id, category_id: crumb.id } }"
						><span itemprop="name">{{ crumb.pagetitle }}</span></router-link
					>
					<router-link v-else-if="name == 'org_opt_waregouse_category' && this.$route.params.warehouse_cat_id != crumb.id" itemprop="item" :to="{name: 'org_opt_waregouse_category', params: { id: this.$route.params.id, org_w_id: this.$route.params.org_w_id, warehouse_id: this.$route.params.warehouse_id, warehouse_cat_id: crumb.id } }"
						><span itemprop="name">{{ crumb.pagetitle }}</span></router-link
					>
					<span v-else itemprop="name">{{ crumb.pagetitle }}</span>
				</li>
				<li
					v-if="index !== items.length - 1 && crumb"
					class="breadcrumb-item breacrumb-item--separator"
				>
					/
				</li>
			</template>
		</ul>
	</nav>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import router from "../router";

export default {
	name: "Breadcrumbs",
	props: {
        items: {
            type: Array,
            default: []
        },
		name: {
			type: String,
			default: 'purchases_catalog'
		}
	},
	data() {
		return {
			opt_catalog: {},
			opt_vendors: {},
			offer_org_info: {}
		};
	},
	computed: {
		...mapGetters([
			"optcatalog",
			"orgs",
			"order",
			"optorder",
			"org_store",
			"product",
			"actions",
			"org_profile",
			"optcatalogwarehouse",
			"org_info"
		]),

		breadcrumbs() {
			const currentRoute = router.currentRoute.value;
			const fullPath = currentRoute.matched[currentRoute.matched.length - 1].path;
			const pathRoutes = fullPath.split("/");
			const pathRoutesWithId = currentRoute.fullPath.split("/");

			const routeMatched = this.$route.matched;

			const breadcrumbs = pathRoutes.map((route, index) => {
				// console.log(route, index);
				// console.log(route)
				if (route == 'warehouses') {
					return {
						name: this.getRouteName(currentRoute, route),
						path: pathRoutesWithId.slice(0, index + 1).join("/"),
					};
				}
				if (route == 'offer') {
					return {
						name: this.getRouteName(currentRoute, route),
						path: pathRoutesWithId.slice(0, 2).join("/") + "/clients",
					};
				}
				if (
					route == "/" ||
					route == "" ||
					(!route.startsWith(":") &&
						!routeMatched.find(
							(matchedRoute) =>
								matchedRoute.path === pathRoutes.slice(0, index + 1).join("/")
						)?.meta.breadcrumb?.label)
				) {
					return;
				}
				if (route.startsWith(":")) {
					if(route == ":warehouse_id" && currentRoute.name == "org_opt_waregouse_category"){
						// console.log(pathRoutesWithId.slice(0, index + 2).join("/"))
						var arr = pathRoutesWithId.slice(0, index + 1);
						arr.push('all')
						return {
							name: this.getRouteName(currentRoute, route),
							path: arr.join("/"),
						};
					}
					return {
						name: this.getRouteName(currentRoute, route),
						path: pathRoutesWithId.slice(0, index + 1).join("/"),
					};
				}
				if (
					route == "orders" &&
					(pathRoutes[index + 1] == "my" || pathRoutes[index + 1] == "opt")
				) {
					return;
				}

				return {
					name: routeMatched.find(
						(matchedRoute) =>
							matchedRoute.path === pathRoutes.slice(0, index + 1).join("/")
					)?.meta.breadcrumb?.label,
					path: pathRoutesWithId.slice(0, index + 1).join("/"),
				};
			});

			if(pathRoutes[pathRoutes.length - 1] == ":warehouse_cat_id") {
				const parents = this.getWarehouseCatItemParents(currentRoute.params.warehouse_id, currentRoute.params.warehouse_cat_id);
				
				parents?.forEach(parent => {
					const newPathRoutesWithId = pathRoutesWithId.map(path => path);
					newPathRoutesWithId[newPathRoutesWithId.length - 1] = parent.id;

					breadcrumbs.splice(-1, 0, {
						name: parent?.pagetitle,
						path: newPathRoutesWithId.join("/")
					});
				})
			}
			if(pathRoutes[pathRoutes.length - 1] == ":category_id") {
				const parents = this.getCategoriesCatItemParents(4, currentRoute.params.category_id);

				parents?.forEach(parent => {
					const newPathRoutesWithId = pathRoutesWithId.map(path => path);
					newPathRoutesWithId[newPathRoutesWithId.length - 1] = parent.id;

					breadcrumbs.splice(-1, 0, {
						name: parent?.pagetitle,
						path: newPathRoutesWithId.join("/")
					});
				})
			}



			return breadcrumbs;
		},
	},
	methods: {
		...mapActions([
			"get_opt_catalog_from_api",
			"org_get_from_api",
			"get_org_store_from_api",
			"get_product_from_api",
			"org_profile_from_api",
			"org_get_info_api"
		]),
		getRouteName(currentRoute, param) {
			// console.log("Current route: ", currentRoute);
			// console.log("Current route param: ", param);
			switch (param) {
				case ":id": {
					return this.getOrgNameById(currentRoute.params[param.slice(1)]);
				}
				case ":category_id": {
					if (currentRoute.params.category_id == 4) return "Каталог";
					if (currentRoute.params.category_id == "search") return "Поиск";
					return this.getCatItem(currentRoute.params[param.slice(1)], this.optcatalog)?.pagetitle;
				}
				case ":order_id": {
					switch(currentRoute?.meta?.breadcrumb?.path) {
						case "order_id":
						case "opt_order_id":
							return `Заказ № ${this.optorder?.order?.id}`;
						case "retail_order_id":
						default:
							return `Заказ № ${this.order?.id || "-"}`;
					}
				}
				case ":search": {
					return currentRoute.params[param.slice(1)];
				}
				case ":store_id": {
					return `Склад ${this.getStoreName()}`;
				}
				case ":brand_id": {
					return "Бренд";
				}
				case ":product_id": {
					return this.getProductName();
				}
				case ":action": {
					return this.getActionName();
				}
				case ":client_id": {
					return this.org_profile?.name;
				}
				case ":warehouse_id": {
					if(currentRoute.name == "org_opt_waregouse_category"){
						return "Склад #" + currentRoute.params.warehouse_id;
					}
					return this.optcatalogwarehouse?.find(
						(catItem) => catItem.id == currentRoute.params[param.slice(1)]
					)?.name;
				}
				case "warehouses": {
					return "Каталоги поставщиков";
				}
				case ":org_w_id": {
					return this.getCatItem(currentRoute.params[param.slice(1)])?.pagetitle;
				}
				case "offer": {
					return "Предложение"
				}
				case ":id_org_from?":{
					console.log(this.getOrgInfoName())
					return this.getOrgInfoName();
				}
			}
		},
		getOrgNameById(id) {
			return this.orgs?.find((org) => org.id == id)?.name;
		},
		getStoreName() {
			return this.org_store?.name;
		},
		getProductName() {
			return this.product?.pagetitle;
		},
		getActionName() {
			return this.actions?.name;
		},
		getCatItem(id, catalog = this.optcatalogwarehouse) {
			for (let i = 0; i < catalog.length; i++) {
				if (catalog[i].id == id) {
					return catalog[i];
				} else {
					if (Array.isArray(catalog[i].children)) {
						let res = this.getCatItem(id, catalog[i].children);
						if (res) {
							return res;
						}
					}
				}
			}
		},
		getWarehouseCatItemParents(stopId, catItemId) {
			const catItem = this.getCatItem(catItemId);

			if(!catItem) return
			if(catItem?.parent == 0) return;

			let parents = this.getAllParents(stopId, catItem, [], this.optcatalogwarehouse);
			return parents;
		},
		getCategoriesCatItemParents(stopId, catItemId) {
			const catItem = this.getCatItem(catItemId, this.optcatalog);
			// console.log("Searched catItem", catItem);

			if(!catItem) return
			if(catItem?.parent == 0) return;

			let parents = this.getAllParents(stopId, catItem, [], this.optcatalog);
			return parents;
		},
		getAllParents(stopId, catItem, parents, catalog) {
			if(catItem.id == stopId) return parents;

            // console.log("Search parent data", catItem, catalog);
			let currParent = this.getCatItem(catItem?.parent, catalog);
			// console.log("Searched parent", currParent);
			if(currParent) {
                parents.unshift(currParent);
                this.getAllParents(stopId, currParent, parents, catalog);
            }
			return parents;
		},
		getOrgInfoName() {
			return this.offer_org_info?.name || "...";
		}
	},
	mounted() {
		if (this.$route.params.id_org_from) {
			this.org_get_info_api({
				action: "get/org/info",
				org_id: this.$route.params.id_org_from
			});
		}
	},
	watch: {
		org_info: function (newVal, oldVal) {
			this.offer_org_info = newVal;
		},
	},
};
</script>

<style lang="scss" scoped>
.breadcrumbs {
	// padding-top: 30px;
}

.breadcrumb-item {
	color: var(--text-color-dop) !important;
	margin-bottom: 20px !important;
	font-size: 14px;
}

.breadcrumb span {
	color: var(--text-color-dop) !important;
	font-size: 14px;
}

.breadcrumb {
	margin: 0 !important;
	display: flex;
	flex-wrap: nowrap;
	align-items: center;
	overflow-x: auto;
	width: 100%;
	padding: 0;
	gap: 4px;

	&::-webkit-scrollbar {
		width: 0px;
	}

	li {
		white-space: nowrap;
	}

	a {
		color: var(--bs-secondary-color);
		text-decoration: none;
		&:hover {
			color: var(--secondary-color);
		}
	}
}

.breadcrumb-item {
	color: rgba(180, 180, 180, 1) !important;
	font-size: 12px;
	font-weight: 400;
	line-height: 1.17;

	margin: 0 !important;
	transition-duration: 0.3s;

	a:hover {
		color: rgb(129, 129, 129) !important;
		text-decoration: underline;
	}

	/*
	&.active {
		color: rgb(104, 104, 104) !important;
	}
*/
}

.breadcrumb-item + .breadcrumb-item {
	padding-left: 0;
	gap: 8px;
	display: flex;
}

.breadcrumb-item + .breadcrumb-item::before {
	padding: 0;
}
</style>
