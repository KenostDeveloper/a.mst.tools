<template>
	<nav class="breadcrumbs" aria-label="breadcrumbs">
		<ul class="breadcrumb">
			<!-- {{ items }} -->
			<!-- <li class="breadcrumb-item">
				<span itemprop="name">МСТ</span>
			</li>
			<li
				class="breadcrumb-item breacrumb-item--separator"
			>
				/
			</li>
			<li class="breadcrumb-item">
				<span itemprop="name">Закупки</span>
			</li>
			<li
				class="breadcrumb-item breacrumb-item--separator"
			>
				/
			</li>
			<li v-if="name == 'org_opt_waregouse_category'" class="breadcrumb-item">
				<span itemprop="name">Каталог поставщиков</span>
			</li>
			<li
				v-if="name == 'org_opt_waregouse_category'"
				class="breadcrumb-item breacrumb-item--separator"
			>
				/
			</li> -->
			<!-- <li v-if="name == 'org_opt_waregouse_category'" class="breadcrumb-item">
				<span itemprop="name">МСТ Склад #53</span>
			</li>
			<li
				v-if="name == 'org_opt_waregouse_category'"
				class="breadcrumb-item breacrumb-item--separator"
			>
				/
			</li> -->
			<template v-for="(crumb, index) in items">
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
	name: "CatalogBreadcrumbs",
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
		};
	},
	computed: {
		...mapGetters([

		]),
	},
	methods: {
		...mapActions([
			
		]),
		
	},
	mounted() {

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
