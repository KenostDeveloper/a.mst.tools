<template>
	<nav aria-label="breadcrumb">
		<ol class="breadcrumb" itemscope="" itemtype="http://schema.org/BreadcrumbList">
			<li
				v-for="(crumb, index) in breadcrumbs"
				class="breadcrumb-item"
				:class="{ active: index === breadcrumbs.length - 1 }"
				itemprop="itemListElement"
				itemscope=""
				itemtype="http://schema.org/ListItem"
			>
				<router-link itemprop="item" :href="crumb.path"
					><span itemprop="name">{{
						crumb.label || crumb.meta?.breadcrumb?.label
					}}</span></router-link
				><meta itemprop="position" :content="index" />
			</li>
		</ol>
	</nav>
</template>

<script>
export default {
	name: "Breadcrumbs",
	data() {
		return {};
	},
	computed: {
		breadcrumbs() {
			const routes = this.$route.matched;
			console.log(routes);
			return routes;
		},
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
	gap: 11px;

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

.breadcrumb-item + .breadcrumb-item {
	padding-left: 0;
	gap: 8px;
	display: flex;
}

.breadcrumb-item + .breadcrumb-item::before {
	padding: 0;
}
</style>
