<template>
	<Breadcrumbs class="std-breadcrumbs--margin" />
	<TabView class="tab-custom">
		<TabPanel header="Мои клиенты">
			<section class="clients">
				<ConfirmDialog/>
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
		</TabPanel>
		<TabPanel header="Мои предложения">
			<section class="clients">
				<v-table
					:items_data="offers.items"
					:total="offers.total"
					:pagination_items_per_page="this.offer.pagination_items_per_page"
					:pagination_offset="this.offer.pagination_offset"
					:page="this.offer.page"
					:table_data="this.offer.table_data"
					:filters="this.offer.filters"
					@filter="this.offer.filter"
					title=""
					@paginate="paginate"
					@clickElem="clickElem"
					@editElem="view"
					@deleteElem="deleteOffer"
				/>
			</section>
		</TabPanel>
	</TabView>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Toast from 'primevue/toast';
import Dropdown from 'primevue/dropdown'
import router from "../router"
import ConfirmDialog from "primevue/confirmdialog";
import Breadcrumbs from '../components/Breadcrumbs.vue'
import vClients from '../components/table/v-clients.vue'
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import vTable from '../components/table/v-table.vue'

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
				manager: {
					name: "Менеджер",
					placeholder: "Выберите менеджера",
					type: "dropdown",
					values: []
				},
				our: {
					name: 'Созданные поставщиком',
					placeholder: 'Созданные поставщиком',
					type: 'checkbox',
					values: 1
				},
			},
			stores_list: [],
			page: 1,
			offer:{
				page: 1,
				pagination_offset: 0,
				pagination_items_per_page: 25,
				filter: {},
				table_data: {
					id: {
						label: "№",
						type: "text",
					},
					date: {
						label: 'Дата создания',
						type: 'text',
					},
					date_end: {
						label: 'Дата окончания предложения',
						type: 'text',
					},
					from_org_name: {
						label: 'Клиент',
						type: 'text',
					},
					store_name: {
						label: 'Склад клиента',
						type: 'text',
					},
					initiator: {
						label: 'Инициатор',
						type: 'text',
					},
					cost: {
						label: 'Сумма',
						type: 'text',
					},
					status_name: {
						label: 'Статус',
						type: 'text'
					},
					actions: {
						label: 'Действия',
						type: 'actions',
						sort: false,
						available: {
							edit: {
								icon: 'pi pi-eye',
								label: 'Подробнее'
							},
							click: {
								icon: 'pi pi-clone',
								label: 'Копировать'
							},
							delete: {
								icon: 'pi pi-trash',
								label: 'Удалить'
							}
						}
					}
				},
			}
		};
	},
	methods: {
		...mapActions([
			'get_dilers_from_api',
			'set_diler_to_api',
			'unset_dilers',
			'org_get_stores_from_api',
			'org_profile_set_from_api',
			'org_get_managers_from_api',
			'get_offer_api',
			'offer_api'
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
		deleteOffer(value){
			this.loading = true
			this.offer_api({
				action: 'delete',
				id: router.currentRoute._value.params.id,
				offer_id: value.id,
			}).then(() => {
				this.get_offer_api({
					action: 'get/offers/clients',
					id: this.$route.params.id
				})
				this.loading = false
			})
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
		view(value) {
			console.log('view', value)
			router.push({
				name: "offer_view",
				params: { id: this.$route.params.id, offer_id: value.id },
			});
		},
		clickElem(value){
			this.loading = true
			this.get_offer_api({
				action: 'copy',
				id: router.currentRoute._value.params.id,
				offer_id: value.id
			}).then(() => {
				this.get_offer_api({
					action: 'get/offers/clients',
					id: this.$route.params.id
				})
				this.loading = false
			})
		}
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
		this.org_get_managers_from_api({
			action: "get/org/managers",
			id: router.currentRoute._value.params.id,
		});
		this.org_get_stores_from_api({
			action: 'get/stores',
			id: this.$route.params.id
		})
		this.get_offer_api({
			action: 'get/offers/clients',
			id: this.$route.params.id
		})
	},
	computed: {
		...mapGetters([
			'dilers',
			'org_stores',
			'org_managers',
			'offers'
		])
  },
	components: {
		Dropdown,
		Breadcrumbs,
		vClients,
		ConfirmDialog,
		Toast,
		TabView,
		TabPanel,
		vTable
	},
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
		org_managers: function (newVal, oldVal) {
			this.filters.manager.values = newVal
		}
	}
};
</script>

<style lang="scss"></style>
