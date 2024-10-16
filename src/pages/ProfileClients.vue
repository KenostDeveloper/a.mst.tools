<template>
	<section class="clients">
		<Breadcrumbs class="std-breadcrumbs--margin" />
		<ConfirmDialog/>
		<!-- <Toast /> -->
		<v-clients
        :items_data="stores.items"
        :total="stores.total"
        :pagination_items_per_page="this.pagination_items_per_page"
        :pagination_offset="this.pagination_offset"
        :page="this.page"
        :filters="this.filters"
        :title="'Мои клиенты'"
        @delete="deleteClient"
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
import Toast from 'primevue/toast';
import Dropdown from 'primevue/dropdown'
import router from "../router"
import ConfirmDialog from "primevue/confirmdialog";
import Breadcrumbs from '../components/Breadcrumbs.vue'
import vClients from '../components/table/v-clients.vue'

export default {
	props: {
    pagination_items_per_page: {
      type: Number,
      default: 24
    },
    pagination_offset: {
      type: Number,
      default: 0
    }
  },
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
			stores_list: [],
			page: 1
		};
	},
	methods: {
		...mapActions([
			'get_dilers_from_api',
			'set_diler_to_api',
			'unset_dilers',
			'org_get_stores_from_api',
			'org_profile_set_from_api'
		]),
		filter (data) {
			this.unset_dilers()
			this.page = data.page
			this.get_dilers_from_api(data)
		},
		paginate (data) {
			this.unset_dilers()
			this.page = data.page
			this.get_dilers_from_api(data)
		},
		deleteClient(data) {
			this.$confirm.require({
				message: "Вы уверены, что хотите удалить организацию клиента с ID " + data.id + "?",
				header: "Подтверждение удаления",
				icon: "pi pi-exclamation-triangle",
				accept: () => {
					this.loading = true;
					this.unset_dilers()
					this.$load(async () => {
            const requestdata = {
              action: 'delete/org/virtual_profile',
              id: router.currentRoute._value.params.id,
              client_id: data.id,
            }
						await this.org_profile_set_from_api(requestdata)
							.then((result) => {
                if(result.data.data.success === false){
                  this.$toast.add({ severity: 'error', summary: 'Ошибка!', detail: result.data.data.message, life: 3000 });
									// страницу не меняем, остаемся тут же
									this.get_dilers_from_api(data)
                }else{
                  this.$toast.add({
                    severity: "success",
                    summary: "Организация удалена",
                    detail:
                      "Удаление организации клиента с ID " + data.id + " произошло успешно!",
                    life: 3000,
                  });
									// страницу не меняем, остаемся тут же
									this.get_dilers_from_api(data)
                }								
							})
							.catch((result) => {
								console.log(result);
							});
					});
					this.loading = false;
				},
				reject: () => {
					this.$toast.add({
						severity: "error",
						summary: "Удаление отгрузки",
						detail: "Удаление отгрузки отклонено",
						life: 3000,
					});
				},
			});
		},
	},
	mounted() {
		this.get_dilers_from_api({
			type: 1,
			page: this.page,
			perpage: this.pagination_items_per_page
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
	components: { Dropdown, Breadcrumbs, vClients, ConfirmDialog, Toast },
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
					this.stores.total = -1
				}
			} else {
				this.stores.items = []
				this.stores.total = -1
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
