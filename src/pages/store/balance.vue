<template>
	<section class="balance">
		<teleport to="body">
			<!-- <custom-modal v-model="show_request_modal" @close="formReset">
				<template v-slot:title>Создание заявки</template>
				<form action="#" @submit.prevent="formSubmit">
					<div class="balance-request-form">
						<div class="dart-form-group" :class="{ error: v$.form.name.$errors.length }">
							<div class="flex flex-column gap-2">
								<label for="balance-request-name">Ваше имя</label>
								<InputText
									id="balance-request-name"
									v-model="form.name"
									aria-describedby="balance-request-name-help"
								/>
								<small id="balance-request-name-help">Укажите имя контактного лица.</small>
								<span class="error_desc" v-for="error of v$.form.name.$errors" :key="error.$uid">
									{{ error.$message }}
								</span>
							</div>
						</div>
						<div class="dart-form-group" :class="{ error: v$.form.phone.$errors.length }">
							<div class="flex flex-column gap-2">
								<label for="balance-request-name">Ваш телефон</label>
								<InputText
									id="balance-request-name"
									v-model="form.phone"
									aria-describedby="balance-request-name-help"
								/>
								<small id="balance-request-name-help">Укажите телефон контактного лица.</small>
								<span class="error_desc" v-for="error of v$.form.phone.$errors" :key="error.$uid">
									{{ error.$message }}
								</span>
							</div>
						</div>
						<div class="dart-form-group">
							<div class="flex flex-column gap-2">
								<label for="balance-request-name">Комментарий</label>
								<Textarea
									id="balance-request-name"
									v-model="form.description"
									aria-describedby="balance-request-name-help"
								/>
								<small id="balance-request-name-help"
									>Укажите комментарий к заявке. Например, удобный промежуток времени для
									звонка.</small
								>
							</div>
						</div>
					</div>
					<div class="dart-form-info-block">
						<div class="dart-form-info-block__item">
							<span>Сумма для вывода</span>
							<span class="value">{{ organization.balance }} ₽ </span>
						</div>
					</div>
					<button
						class="dart-btn dart-btn-primary dart-btn-block dart-mt-1"
						type="submit"
						:class="{ 'dart-btn-loading': loading }"
						:disabled="loading"
					>
						Создать заявку
					</button>
				</form>
			</custom-modal> -->
		</teleport>

		<Dialog
			class="balance-form__modal"
			v-model:visible="this.modalIsOpened"
			header="Создание заявки"
			:style="{ width: '440px' }"
		>
			<form action="#" @submit.prevent="formSubmit" class="balance-form">
				<div class="balance-form__data-container">
					<div class="balance-form__input-container">
						<span class="balance-form__label">Сумма для вывода</span>
						<input v-model="costEntered" type="text" class="balance-form__input" />
					</div>
					<div class="balance-form__input-container">
						<span class="balance-form__label">Доступная сумма для вывода</span>
						<span class="balance-form__value">{{ organization.balance }} ₽</span>
					</div>
				</div>

				<button
					class="dart-btn dart-btn-primary balance-form__button"
					type="submit"
					:class="{ 'dart-btn-loading': loading }"
					:disabled="loading"
				>
					Создать заявку
				</button>
			</form>
		</Dialog>

		<Dialog
			class="balance-form__modal order-table__modal"
			v-model:visible="this.orderModalIsOpened"
			header="Заказ № 12345678910"
			:style="{ width: '700px' }"
		>
			<v-table
				class="order-table"
				:items_data="balance.items"
				:total="balance.total"
				:pagination_items_per_page="this.pagination_items_per_page"
				:pagination_offset="this.pagination_offset"
				:page="this.page_balance"
				:table_data="this.balance_table_data"
			>
			</v-table>
		</Dialog>

		<div class="balance__header">
			<!-- TODO Сделать хлебные крошки -->

			<h1 class="std-title title-h1 mt-3">Баланс</h1>

			<div class="balance-info__container">
				<ul class="balance-info">
					<li class="balance-info__item">
						<span class="balance-info__index">01.</span>
						<p class="balance-info__text">Создайте заявку на вывод средств.</p>
					</li>
					<li class="balance-info__item">
						<span class="balance-info__index">02.</span>
						<p class="balance-info__text">
							Получите и подпишите в ЭДО отчет комитенту и акт оказания услуг
							комиссионера.
						</p>
					</li>
					<li class="balance-info__item">
						<span class="balance-info__index">03.</span>
						<p class="balance-info__text">
							Получите в течение 3-х рабочих дней выплату средств за реализованные
							товары за вычетом комиссии.
						</p>
					</li>
				</ul>

				<div class="balance-info__button-wrapper">
					<div class="balance-info__value-container">
						<span class="balance-info__label">Баланс</span>
						<span class="balance-info__value">{{ organization.balance }} ₽</span>
					</div>

					<hr class="balance-info__line" />

					<button
						type="button"
						href="#"
						class="dart-btn dart-btn-primary-outline balance-info__button"
						@click="this.modalIsOpened = true"
					>
						Заявка на вывод средств
					</button>
				</div>
			</div>
		</div>
		<div class="dart-row balance__main">
			<div class="d-col-xxl-6 d-col-lg-12">
				<div class="panel-widget">
					<v-table
						:items_data="balance_requests.items"
						:total="balance_requests.total"
						:pagination_items_per_page="this.pagination_items_per_page"
						:pagination_offset="this.pagination_offset"
						:page="this.page_balance_requests"
						:table_data="this.balance_request_table_data"
						title="История заявок"
					>
					</v-table>
				</div>
			</div>
			<div class="d-col-xxl-6 d-col-lg-12">
				<div class="panel-widget">
					<v-table
						:items_data="balance.items"
						:total="balance.total"
						:pagination_items_per_page="this.pagination_items_per_page"
						:pagination_offset="this.pagination_offset"
						:page="this.page_balance"
						:table_data="this.balance_table_data"
						title="История заказов"
					>
					</v-table>
				</div>
			</div>

			<Accordion title="История заявок" class="balance__table-accordion visible-mobile-l">
				<div class="d-col-md-6">
					<div class="panel-widget">
						<v-table
							:items_data="balance_requests.items"
							:total="balance_requests.total"
							:pagination_items_per_page="this.pagination_items_per_page"
							:pagination_offset="this.pagination_offset"
							:page="this.page_balance_requests"
							:table_data="this.balance_request_table_data"
						>
						</v-table>
					</div>
				</div>
			</Accordion>
			<Accordion title="История заказов" class="balance__table-accordion visible-mobile-l">
				<div class="d-col-md-6">
					<div class="panel-widget">
						<v-table
							:items_data="balance.items"
							:total="balance.total"
							:pagination_items_per_page="this.pagination_items_per_page"
							:pagination_offset="this.pagination_offset"
							:page="this.page_balance"
							:table_data="this.balance_table_data"
						>
						</v-table>
					</div>
				</div>
			</Accordion>
		</div>
	</section>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import router from "../../router";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import vTable from "../../components/table/v-table.vue";
import { useVuelidate } from "@vuelidate/core";
import { required } from "../../utils/i18n-validators";
// import customModal from '../../components/popup/CustomModal'
import Dialog from "primevue/dialog";
import organization from "../../store/organization";
import Accordion from "../../components/Accordion.vue";

export default {
	name: "ProfileBalance",
	props: {
		org: {
			type: Array,
			default: () => {
				return [];
			},
		},
		pagination_items_per_page: {
			type: Number,
			default: 25,
		},
		pagination_offset: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {
			modalIsOpened: false,
			orderModalIsOpened: false,

			costEntered: null,

			loading: false,
			show_request_modal: false,
			page_balance: 1,
			page_balance_requests: 1,
			balance_table_data: {
				date: {
					label: "Дата",
					type: "text",
				},
				type: {
					label: "Тип операции",
					type: "text",
				},
				value: {
					label: "Сумма",
					type: "text",
				},
				description: {
					label: "Основание",
					type: "text",
				},
			},
			balance_request_table_data: {
				date: {
					label: "Дата",
					type: "text",
				},
				id: {
					label: "Номер заявки",
					type: "text",
				},
				value: {
					label: "Сумма к получению",
					type: "text",
				},
				status: {
					label: "Статус",
					type: "status",
				},
			},
		};
	},
	methods: {
		...mapActions([
			"set_balance_request_to_api",
			"get_organization_from_api",
			"get_balance_from_api",
			"get_balance_requests_from_api",
		]),
		paginate_balance(data) {
			this.page_balance = data.page;
			this.get_balance_from_api(data);
		},
		paginate_balance_requests(data) {
			this.page_balance_requests = data.page;
			this.get_balance_requests_from_api(data);
		},
		async formSubmit(event) {
			// const result = await this.v$.$validate();
			const result = !isNaN(this.costEntered) && this.costEntered > 0;

			console.log('this.costEntered > organization.balance', Number(this.costEntered) > Number(this.organization.balance))
			console.log(Number(this.costEntered), Number(this.organization.balance))

			if(Number(this.costEntered) > Number(this.organization.balance)){
				this.$toast.add({ severity: 'error', summary: 'Ошибка', detail: "Вы ввели не корректную сумму для вывода!", life: 3000 });
				return;
			}

			if (!result) {
				console.log(result);
				return;
			}

			this.$load(async () => {
				this.loading = true;
				await this.set_balance_request_to_api({
					action: "set",
					type: "balance_request",
					id: router.currentRoute._value.params.id,
					value: this.costEntered,
				}).then((data) => {
					console.log(data);
					this.modalIsOpened = false;
					this.loading = false;
					this.get_balance_requests_from_api({
						page: 1,
						perpage: this.pagination_items_per_page,
					});
					this.formReset();
				});
			});
		},
		formReset() {
			this.costEntered = null;
		},
	},
	mounted() {
		this.get_organization_from_api();
		this.get_balance_from_api({
			page: this.page_balance,
			perpage: this.pagination_items_per_page,
		});
		this.get_balance_requests_from_api({
			page: this.page_balance_requests,
			perpage: this.pagination_items_per_page,
		});
	},
	components: {
		InputText,
		vTable,
		Textarea,
		Dialog,
		// customModal
		Accordion,
	},
	setup() {
		return { v$: useVuelidate() };
	},
	validations() {
		return {
			// costEntered: { required }
		};
	},
	computed: {
		...mapGetters(["organization", "balance", "balance_requests"]),
	},
};
</script>

<style lang="scss">
.dart-form-info-block {
	border-top: 1px solid #c5c5c5;
	padding-top: 12px;
	margin-bottom: 24px;
	&__item {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		justify-content: space-between;
		span {
			color: #282828;
			font-size: 16px;
			font-style: normal;
			font-weight: 400;
			line-height: 130%;
			letter-spacing: 0.5px;
			&.value {
				font-size: 20px;
				font-weight: 500;
				letter-spacing: 0;
			}
		}
	}
}
</style>
