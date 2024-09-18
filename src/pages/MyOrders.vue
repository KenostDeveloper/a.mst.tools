<template>
	<div class="shipping std-shipping">
		<div class="std-shipping__title-container hidden-tablet-l">
			<h1 class="table-kenost__title std-shipping__title">Мои заказы</h1>
		</div>

		<div class="std-shipping__title-container visible-tablet-l">
				<p class="table-kenost__title std-shipping__title">Отгрузки</p>
			</div>

			<div
				:class="`shipping-calendar std-calendar ${
					this.calendarIsExpanded ? 'std-calendar--active' : ''
				} visible-desktop-s`"
			>
				<div class="shipping-calendar__head std-calendar__head">
					<p>Календарь отгрузок</p>
					<div class="std-calendar__actions">
						<div
							class="std-calendar__expand-button hidden-tablet-l"
							@click="this.calendarIsExpanded = !this.calendarIsExpanded"
						>
							<i class="pi pi-angle-up"></i>
						</div>
						<div class="dart-btn dart-btn-primary std-plus-icon__wrapper" @click="this.showShip = true">
							<i class="pi pi-plus"></i>
						</div>
					</div>
				</div>
				<Calendar
					class="shipping-calendar-css std-calendar__content"
					is-expanded
					title-position="left"
					:attributes="attributes"
					:masks="{ weekdays: 'WW' }"
					:modelValue="checkDate"
					content="red"
					@dayclick="dayClicked"
				/>
				<div class="calendar-associations">
					<p class="calendar-associations__blue">— дни, в которые есть отгрузка</p>
				</div>
			</div>

			<!-- <v-table
				class="std-shipping__filters"
				:filters="this.filters"
				:items_data="shipping.shipment"
				:total="shipping.total"
				:pagination_items_per_page="this.pagination_items_per_page"
				:pagination_offset="this.pagination_offset"
				:page="this.page"
				:table_data="this.table_data"
				:editMode="this.editMode"
				title="Отгрузки"
				@filter="filter"
				@setAllCheck="setAll"
				@sort="filter"
				@paginate="paginate"
				@clickElem="clickElem"
				@checkElem="checkElem"
			>
				<template v-slot:button>
					<div>
						
					</div>
				</template>
			</v-table> -->

			<div class="std-table__wrapper">
				<table class="std-table">
					<thead class="std-table__head">
						<tr class="std-table__row">
							<th class="std-table__hcol">№</th>
							<th class="std-table__hcol">Дата создания</th>
							<th class="std-table__hcol">Сумма</th>
							<th class="std-table__hcol">Оплата доставки</th>
							<th class="std-table__hcol">Поставщик</th>
							<th class="std-table__hcol">Склад</th>
							<th class="std-table__hcol">Отсрочка</th>
							<!-- <th class="std-table__hcol">Объем товарво, кг</th>
							<th class="std-table__hcol">Кол-во товаров, шт</th>
							<th class="std-table__hcol">Статус</th> -->
						</tr>
					</thead>
					<tbody class="std-table__body">
						<tr class="std-table__row" v-for="item in my_orders.orders" v-bind:key="item.id" style="cursor: pointer" @click.prevent="$router.push({ name: 'my_orders_id', params: { id: this.$route.params.id, order_id: item.id } })">
							<td class="std-table__col">{{ item.id }}</td>
							<td class="std-table__col">{{ new Date(item.date).toLocaleString('ru', {year: '2-digit', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric'}) }}</td>
							<td class="std-table__col">{{ Number(item.cost).toLocaleString('ru') }} ₽</td>
							<td class="std-table__col">{{ item.payer === '1' ? 'Поставщик' : 'Покупатель'}}</td>
							<td class="std-table__col">{{ item.store_name }}</td>
							<td class="std-table__col">{{ item.seller_address }}</td>
							<td class="std-table__col">{{ Number(item.delay) == 0 ? "Предоплата" : item.delay + ' дн.' }}</td>
						</tr>
					</tbody>
				</table>
				<!-- {{ shipping.shipment }} -->

			</div>
	</div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
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
	name: "MyOrders",
	props: {
	},
	data() {
		return {
			
		};
	},
	methods: {
		...mapActions([
            'get_opt_my_order_api'
		]),
        filter_opt_my (data) {
            data.id = router.currentRoute._value.params.id
            data.action = 'get/orders/buyer'
            this.get_opt_my_order_api(data)
        },
        paginate_opt_my (data) {
            data.id = router.currentRoute._value.params.id
            data.action = 'get/orders/buyer'
            this.get_opt_my_order_api(data)
        }
	},
	mounted() {
		this.get_opt_my_order_api({
            action: 'get/orders/buyer',
            id: router.currentRoute._value.params.id,
            page: this.page_opt,
            perpage: this.pagination_items_per_page_opt
        })
	},
	components: {
		Dropdown,
		MultiSelect,
		AutoComplete,
		Calendar,
		DatePicker,
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
	gap: 10px;
	align-items: flex-start;
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
		gap: 12px;
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
