<template>
	<div class="clients retails">
		<Breadcrumbs />
		<div class="std-title__container">
			<h1 class="std-title title-h1">Оптовые заказы</h1>
		</div>
		<v-table
			:items_data="my_orders.orders"
			:total="my_orders.total"
			:pagination_items_per_page="this.pagination_items_per_page"
			:pagination_offset="this.pagination_offset"
			:page="this.page"
			:table_data="this.table_data"
			@filter="filter"
			@sort="filter"
			@paginate="paginate"
			:link_row="{
				link_to: 'my_orders_opt_id',
				link_params: {
					id: this.$route.params.id,
					order_id: 'id',
				},
			}"
		>
		</v-table>
	</div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import Breadcrumbs from "../components/Breadcrumbs.vue";
import router from '../router'
import AutoComplete from "primevue/autocomplete";
import Dropdown from "primevue/dropdown";
import MultiSelect from "primevue/multiselect";
import { Calendar, DatePicker } from "v-calendar";
import CalendarVue from "primevue/calendar";
import vTable from "../components/table/v-table.vue";
import "v-calendar/style.css";
import Dialog from "primevue/dialog";

export default {
	name: "OrdersOpt",
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
			page: 1,
			filters: {
				name: {
					name: "Наименование Организации",
					placeholder: "Наименование Организации",
					type: "text",
				}
			},
			table_data: {
        id: {
          label: 'Номер',
          type: 'text',
          sort: true
        },
        buyer: {
          label: 'Покупатель',
          type: 'text',
          sort: true
        },
        date: {
          label: 'Дата',
          type: 'text',
          sort: true
        },
        cost: {
          label: 'Сумма',
          type: 'text',
          sort: true
        },
		initiator: {
			label: "Инициатор",
			type: "text",
			sort: true,
		},
		ur_persone_name: {
			label: "Покупатель",
			type: "text",
			sort: true,
		},
		seller_w_name: {
          label: 'Магазин/Склад',
          type: 'text',
          sort: true
        }
      }
		};
	},
	methods: {
		...mapActions([
      'get_opt_my_order_api'
		]),
		filter (data) {
			data.id = router.currentRoute._value.params.id
			data.action = 'get/orders/seller'
			this.get_opt_my_order_api(data)
		},
		paginate (data) {
			this.page = data.page
			data.id = router.currentRoute._value.params.id
			data.action = 'get/orders/seller'
			this.get_opt_my_order_api(data)
		}
	},
	mounted() {
		this.get_opt_my_order_api({
				action: 'get/orders/seller',
				id: router.currentRoute._value.params.id,
				page: this.page,
				perpage: this.pagination_items_per_page
		})
	},
	components: {
		Dropdown,
		MultiSelect,
		AutoComplete,
		Calendar,
		DatePicker,
		Breadcrumbs,
		// customModal,
		vTable,
		Dialog,
		CalendarVue,
		// Checkbox,
		// Swiper,
		// SwiperSlide
	},
	computed: {
		...mapGetters([
			"my_orders",
		]),
	},
	watch: {
	},
};
</script>

<style lang="scss">
.p-autocomplete .p-autocomplete-multiple-container {
	border-radius: 6px 0 0 6px;
	margin-bottom: 0;
	& + .p-autocomplete-dropdown,
	& + .p-autocomplete-dropdown:focus,
	& + .p-autocomplete-dropdown:active {
		border-radius: 0 6px 6px 0;
		padding: 10px 10px;
	}
}
.shipping {
	display: flex;
	align-items: flex-start;
	&>*+*{
		margin-top: 10px;
	}	
}

.calendar-associations {
	padding: 0 24px;
	margin-bottom: 8px;
	&__blue {
		position: relative;
		margin-bottom: 0;
		padding-left: 20px;
		font-size: 12px;
		font-weight: 400;
		line-height: 14.06px;
		color: #5e5e5e;

		&::before {
			width: 13px;
			height: 13px;
			background: #008fff;
			content: "";
			position: absolute;
			border-radius: 50%;
			left: 0px;
			top: 50%;
			transform: translate(0, -50%);
		}
	}
}

.shipping-calendar-css {
	width: 100%;
	border: none !important;
	border-radius: none !important;

	.vc-title {
		background: unset !important;
	}

	.vc-focus {
		background: unset !important;
	}

	.vc-header {
		margin-bottom: 8px;
	}
}

.shipping-calendar {
	background: #fff;
	width: 450px;
	border: 1px solid #e2e2e2;
	border-radius: 5px;

	&__head {
		padding: 24px 24px 10px 24px;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.dart-btn-primary {
			padding: 7px;
			display: flex;
		}

		.pi {
			font-size: 12px;
		}

		p {
			margin: 0;
			font-size: 14px;
			font-weight: 500;
			line-height: 14.84px;
			letter-spacing: 0.25px;
			text-align: left;
		}
	}
}

.shipping-table {
	background: #fff;
	width: calc(100% - 460px);
	padding: 24px;
	border: 1px solid #e2e2e2;
	border-radius: 5px;
	tr + tr {
		border-top: 1px solid #e2e2e2;
	}

	&__text {
		color: #5e5e5e;
		font-size: 14px;
	}
}

.shopping-kenost-swiper {
	width: 100%;
	padding: 16px 0;
}

.shopping-kenost {
	&__dates {
		display: flex;
	}

	&__button {
		display: flex;
		gap: 12px;
		margin-top: 20px;

		.dart-btn {
			width: 100%;
		}
	}

	&__slide {
		width: 280px;
		box-shadow: 0px 0px 18px 0px #0000000f;
		border-radius: 5px;
		padding: 20px 16px;
		display: flex;
		gap: 12px;

		img {
			width: 50px;
			height: 50px;
			border-radius: 50%;
			border: 1px solid #e8e8e8;
			object-fit: cover;
		}

		&-info {
			p {
				font-size: 14px;
				font-weight: 400;
				line-height: 14.84px;
				letter-spacing: 0.25px;
				margin-bottom: 12px;
			}

			span {
				font-size: 14px;
				font-weight: 400;
				line-height: 14.84px;
				letter-spacing: 0.25px;
				color: #a0a0a0;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				overflow: hidden;
			}
		}
	}

	&__b {
		color: #282828;
		font-size: 14px;
		font-weight: 500;
		margin-bottom: 12px;
	}

	&__city {
		display: flex;
		gap: 12px;
	}

	&__row {
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	&__checkbox {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-top: 16px;
	}

	&__citys {
		margin-top: 25px;
		padding-left: 28px;
	}

	&__cityone:not(:last-child) {
		&::before {
			width: 1px;
			height: 100%;
			background: #008fff;
			content: "";
			position: absolute;
			left: -19px;
			top: 5px;
			transform: translate(-50%, 0);
		}
	}

	&__cityone {
		display: flex;
		flex-direction: column;
		position: relative;

		&-checkbox {
			display: flex;
			align-items: center;
		}

		&-date {
			width: 50%;

			.p-calendar {
				width: 100%;
			}
		}

		&-name {
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 100%;
			margin-bottom: 8px;

			p {
				color: #282828;
				font-size: 14px;
				font-weight: 500;
				position: relative;
				margin: 0;

				&::before {
					width: 16px;
					height: 16px;
					border: 2px solid #008fff;
					background-color: #fff;
					content: "";
					position: absolute;
					border-radius: 50%;
					left: -19px;
					transform: translate(-50%, 0);
				}
			}
		}
	}
}

.k-mini-text {
	color: #a0a0a0;
	font-size: 12px;
	font-weight: 400;
	margin-bottom: 4px;
}

.vc-container {
	border: 1px solid rgba(0, 0, 0, 0.12);
	border-radius: 5px;
}
.shipping-form {
	overflow: hidden;
}
.dart-form-group-simple {
	label {
		display: block;
		margin-bottom: 5px;
		font-style: normal;
		font-weight: 400;
		font-size: 14px;
		line-height: 1.3;
		letter-spacing: 0.25px;
		color: #adadad;
	}
	&.error {
		.p-inputwrapper,
		.dart-form-control {
			border: 1px solid #f00;
			border-radius: 6px;
			.p-inputtext {
				border: none;
			}
		}
		.kenost-dropzone{
			border-color: #f00;
		}
		span.error_desc {
			color: #e24c4c;
			font-size: 12px;
		}
	}
}
.dart-form-group {
	display: flex;
	flex-wrap: wrap;
	&.error {
		.p-inputwrapper,
		.dart-form-control {
			border: 1px solid #f00;
			border-radius: 6px;
			.p-inputtext {
				border: none;
			}
		}
		.kenost-dropzone{
			border-color: #f00;
		}
		span.error_desc {
			color: #e24c4c;
			font-size: 12px;
		}
	}
	& > * {
		width: 100%;
	}
	.p-autocomplete {
		flex: 0 0 100%;
	}
	label {
		display: block;
		margin-bottom: 5px;
		font-style: normal;
		font-weight: 400;
		font-size: 14px;
		line-height: 1.3;
		letter-spacing: 0.25px;
		color: #adadad;
	}
}
.p-autocomplete {
	width: 100%;
	display: flex;
}
.p-dropdown {
	width: 100%;
}
.p-multiselect .p-multiselect-label,
.p-inputtext,
.p-autocomplete .p-autocomplete-multiple-container {
	padding: 10px 15px !important;
}
.p-autocomplete .p-autocomplete-multiple-container .p-autocomplete-input-token {
	padding: 0 !important;
}
.p-autocomplete .p-autocomplete-multiple-container {
	width: 100%;
}
.p-component {
	font-size: 14px !important;
	line-height: 106%;
}
.profile-content {
	margin-bottom: 30px;
}
</style>
