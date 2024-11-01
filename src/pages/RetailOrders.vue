<template>
	<section class="clients retails">
    <Breadcrumbs />
		<div class="std-title__container">
			<h1 class="std-title title-h1">Розничные заказы</h1>
		</div>

		<div class="products">
			<v-table
				:items_data="orders.orders"
				:total="orders.total"
				:pagination_items_per_page="this.pagination_items_per_page"
				:pagination_offset="this.pagination_offset"
				:page="this.page"
				:table_data="this.table_data"
				:filters="this.filters"
				@filter="filter"
				@sort="filter"
				@paginate="paginate"
			/>
		</div>
	</section>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Dropdown from "primevue/dropdown";
import Breadcrumbs from "../components/Breadcrumbs.vue";
import vTable from "../components/table/v-table.vue";

export default {
	props: {
    pagination_items_per_page: {
      type: Number,
      default: 25
    },
    pagination_offset: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      page: 1,
      filters: {
        name: {
          name: 'Наименование, артикул',
          placeholder: 'Наименование, артикул',
          type: 'text'
        }
      },
      table_data: {
        num: {
          label: 'Номер',
          type: 'link',
          link_to: 'retail_orders_id',
          link_params: {
            id: this.$route.params.id,
            order_id: 'id'
          },
          sort: true
        },
        customer: {
          label: 'Покупатель',
          type: 'link',
          link_to: 'retail_orders_id',
          link_params: {
            id: this.$route.params.id,
            order_id: 'id'
          }
        },
        createdon: {
          label: 'Дата',
          type: 'link',
          link_to: 'retail_orders_id',
          link_params: {
            id: this.$route.params.id,
            order_id: 'id'
          },
          sort: true
        },
        status: {
          label: 'Статус',
          type: 'status'
        },
        cost: {
          label: 'Сумма',
          type: 'link',
          link_to: 'retail_orders_id',
          link_params: {
            id: this.$route.params.id,
            order_id: 'id'
          },
          sort: true
        },
        delivery: {
          label: 'Доставка',
          type: 'link',
          link_to: 'retail_orders_id',
          link_params: {
            id: this.$route.params.id,
            order_id: 'id'
          }
        },
        payment: {
          label: 'Оплата',
          type: 'link',
          link_to: 'retail_orders_id',
          link_params: {
            id: this.$route.params.id,
            order_id: 'id'
          }
        },
				store: {
          label: 'Магазин/Склад',
          type: 'link',
          link_to: 'retail_orders_id',
          link_params: {
            id: this.$route.params.id,
            order_id: 'id'
          }
        }
      }
    }
  },
	methods: {
		...mapActions(["get_orders_from_api"]),
		filter (data) {
			this.get_orders_from_api(data)
		},
		paginate (data) {
			console.log(data)
			this.get_orders_from_api(data)
		},
	},
	mounted() {
		this.get_orders_from_api({
			page: this.page,
			perpage: this.pagination_items_per_page
		})
	},
	computed: {
		...mapGetters(['orders']),
	},
	components: { Dropdown, Breadcrumbs, vTable },
	watch: {
	},
};
</script>

<style lang="scss" scoped></style>
