<template>
	<div class="flex align-items-center justify-content-space-between mb-4">
        <div class="title-h1">Мои коллекции</div>
        <RouterLink
            :to="{ name: 'groups_edit', params: { id: $route.params.id } }"
            class="dart-btn dart-btn-primary"
            >Создать коллекцию</RouterLink
        >
    </div>
	<div class="dart-alert dart-alert-info">На данной странице Вы можете создать Коллекции товаров, которые будут сгруппированы по какому либо признаку. Таким образом, Вы сможете упростить создание Акций.</div>
	<v-table
		:items_data="groups.items"
		:total="groups.total"
		:pagination_items_per_page="this.perpage"
		:pagination_offset="this.pagination_offset"
		:page="this.page"
		:table_data="this.table_data"
		:filters="this.filters"
		:title="''"
		@filter="filter"
		@sort="filter"
		@paginate="paginate"
		@editElem="editElem"
		@deleteElem="deleteElem"
	>
	</v-table>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import router from "../../router";
import { RouterLink } from "vue-router";
import vTable from "../table/v-table.vue";


export default {
	name: "Groups",
	props: {

	},
	data() {
		return {
			page: 1,
			perpage: 20,
			filter: {
                name: ""
            },
			table_data: {
				id: {
					label: "Номер",
					type: "text"
				},
				name: {
					label: "Наименование",
					type: "link",
					// TODO
					link_to: "groups_edit_id",
					link_params: {
						id: this.$route.params.id,
						group_id: "id",
					},
					sort: true,
				},
				store_name: {
					label: "Склад",
					type: 'text'
				},
				description: {
					label: "Описание",
					type: 'text'
				},
				actions: {
					label: "Действия",
					type: "actions",
					sort: false,
					available: {
						edit: {
							icon: "pi pi-pencil",
							label: "Редактировать",
						},
						delete: {
							icon: "pi pi-trash",
							label: "Удалить",
						},
					},
				},
			},
		};
	},
	methods: {
		...mapActions([
			'get_group_api',
			'set_group_api'
		]),
		getGroup(){
			this.get_group_api({
				page: this.page,
				perpage: this.perpage,
				id: this.$route.params.id,
				action: "get"
			})
		},
		editElem(value) {
			router.push({
				name: "groups_edit_id",
				params: { id: this.$route.params.id, group_id: value.id },
			});
		},
		deleteElem(value) {
			this.set_group_api({
				id: this.$route.params.id,
				action: "delete",
				id_group: value.id
			}).then(() => this.getGroup());
		},
		paginate(data) {
			this.page = data.page;
			this.get_group_api({
				page: this.page,
				perpage: this.perpage,
				id: this.$route.params.id,
				action: "get"
			})
		},
		filter(){
			this.get_group_api({
				page: this.page,
				perpage: this.perpage,
				id: this.$route.params.id,
				action: "get"
			})
		}
	},
	mounted() {
		this.getGroup()
	},
	components: {
		vTable,
	},
	computed: {
		...mapGetters([
			'groups'
		]),
	},
	watch: {
	},
};
</script>

<style lang="scss">

</style>
