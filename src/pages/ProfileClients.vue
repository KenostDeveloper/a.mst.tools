<template>
	<section class="clients">
		<Breadcrumbs />
		<v-clients
        :items_data="stores.items"
        :total="stores.total"
        :pagination_items_per_page="this.pagination_items_per_page"
        :pagination_offset="this.pagination_offset"
        :page="this.page"
        :filters="this.filters"
        :title="'Мои клиенты'"
        @update="optUpdate"
        @filter="filter"
        @sort="filter"
        @paginate="paginate"
        >
        <template v-slot:desc>
            <span class="desc">Доступные организации, которые являются вашими клиентами</span>
        </template>
				<template v-slot:button>
					<router-link :to="{ name: 'client_create', params: { id: $route.params.id } }" class="dart-btn dart-btn-primary dart-btn-long">Создать нового клиента</router-link>
				</template>
    </v-clients>
	</section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Dropdown from 'primevue/dropdown'
import Breadcrumbs from '../components/Breadcrumbs.vue'
import vClients from '../components/table/v-clients.vue'

export default {
	data() {
		return {
			stores: {
				items: [],
				total: -1
			},
			store_id: null,
			filters: {
				filter: {
          name: 'Введите название организации',
          placeholder: 'Введите название организации',
          type: 'text'
        },
        our: {
          name: 'Созданные поставщиком',
          placeholder: 'Созданные поставщиком',
          type: 'checkbox',
          values: 1
        }
			},
			stores_list: []
		};
	},
	methods: {
		...mapActions([
			'get_dilers_from_api',
			'set_diler_to_api',
			'org_get_stores_from_api'
		]),
		filter (data) {
			console.log(data)
			this.get_dilers_from_api(data)
		},
		paginate (data) {
			this.get_dilers_from_api(data)
		}
	},
	mounted() {
		this.get_dilers_from_api({
			type: 1,
			page: this.page_dilers,
			perpage: this.pagination_items_per_page_dilers
		}).then(() => {
			if (this.dilers) {
				if (Object.prototype.hasOwnProperty.call(this.dilers, 'items')) {
				this.stores.items = this.dilers.items
				} else {
				this.stores.items = []
				}
				if (Object.prototype.hasOwnProperty.call(this.dilers, 'total')) {
				this.stores.total = this.dilers.total
				} else {
				this.stores.total = 0
				}
			}
		})

		this.org_get_stores_from_api({
			action: 'get/stores',
			id: this.$route.params.id
		})
	},
	computed: {
		...mapGetters([
			'dilers',
			'org_stores'
		])
  	},
	components: { Dropdown, Breadcrumbs, vClients },
	watch: {
		dilers: function (newVal, oldVal) {
			if (typeof newVal === 'object') {
				if (Object.prototype.hasOwnProperty.call(newVal, 'items')) {
				this.stores.items = newVal.items
				} else {
				this.stores.items = []
				}
				if (Object.prototype.hasOwnProperty.call(newVal, 'total')) {
				this.stores.total = newVal.total
				} else {
				this.stores.total = 0
				}
			} else {
				this.stores.items = []
				this.stores.total = 0
			}
		},
		org_stores: function (newVal, oldVal) {
			this.stores_list = []
			for (let i = 0; i < newVal.items.length; i++) {
				this.stores_list.push({ label: newVal.items[i].name, value: newVal.items[i].id })
			}
		},
	}
};
</script>

<style lang="scss"></style>
