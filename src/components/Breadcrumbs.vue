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
				<li v-if="index !== breadcrumbs.length - 1 && crumb" class="breadcrumb-item">/</li>
			</template>
		</ul>
	</nav>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import router from "../router";

export default {
	name: "Breadcrumbs",
	data() {
		return {
			opt_catalog: {},
			opt_vendors: {},
		};
	},
	computed: {
		...mapGetters(["optcatalog", "optvendors"]),

		breadcrumbs() {
			const currentRoute = router.currentRoute.value;
			const fullPath = currentRoute.matched[currentRoute.matched.length - 1].path;
			const pathRoutes = fullPath.split("/");
			const pathRoutesWithId = currentRoute.fullPath.split("/");

			const routeMatched = this.$route.matched;

			console.log(currentRoute, pathRoutes);

			const breadcrumbs = pathRoutes.map((route, index) => {
				if (index == 0) {
					return {
						name: "Главная",
						path: "/",
					};
				}
				if (route.startsWith(":")) {
					return {
						name: this.getRouteName(currentRoute, route),
						path: pathRoutesWithId.slice(0, index + 1).join("/"),
					};
				}

				return {
					name: routeMatched.find(
						(matchedRoute) =>
							matchedRoute.path === pathRoutes.slice(0, index + 1).join("/")
					).meta.breadcrumb?.label,
					path: pathRoutesWithId.slice(0, index + 1).join("/"),
				};
			});

			return breadcrumbs;
		},
	},
	methods: {
		...mapActions(["get_opt_catalog_from_api", "get_opt_vendors_from_api"]),
		getRouteName(currentRoute, param) {
			switch (param) {
				case ":id": {
					return this.getVendorNameById(currentRoute.params[param.slice(1)]);
				}
				case ":category_id": {
					return this.getCatalogNameById(currentRoute.params[param.slice(1)]);
				}
			}
		},
		getCatalogNameById(id) {
			let categoryName = "";

			this.optcatalog.find((firstLevel) => {
				if (firstLevel.id == id) categoryName = firstLevel.pagetitle;

				if (firstLevel.children) {
					Object.values(firstLevel?.children)?.find((secondLevel) => {
						if (secondLevel.id == id) categoryName = secondLevel.pagetitle;

						if (secondLevel.children) {
							Object.values(secondLevel?.children)?.find((thirdLevel) => {
								if (thirdLevel.id == id) categoryName = thirdLevel.pagetitle;
							});
						}
					});
				}
			});

			return categoryName;
		},
		getVendorNameById(id) {
			let vendorName = "";

			this.optvendors.selected.find((vendor) => {
				if (vendor.id === id) vendorName = vendor.name_short;
			});

			return vendorName;
		},
	},
	mounted() {
		this.get_opt_catalog_from_api();
		this.get_opt_vendors_from_api();
	},
};
</script>

<style lang="scss" scoped>
.breadcrumbs {
	padding-top: 30px;
}

.breadcrumb-item {
	color: var(--text-color-dop) !important;
	margin-bottom: 20px !important;
	font-size: 14px;
}

.breadcrumb a {
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

	&:hover {
		color: rgb(129, 129, 129) !important;
		text-decoration: underline;
	}

	&.active {
		color: rgb(104, 104, 104) !important;
	}
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
