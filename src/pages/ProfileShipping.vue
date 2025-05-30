<template>
	<div class="std-display-contents" :class="{loading: loading}">
		<ConfirmDialog />
		<!-- <Toast /> -->
		<div
			class="not-warehouse"
			v-if="this.organozation.warehouse == 0 && this.organozation.vendor == 0"
		>
			<img class="mb-2" src="/images/icons_milen/warehouse.png" alt="" />
			<p>Для создания отгрузок вам нужно иметь роль оптового поставщика!</p>
			<!-- <div class="a-dart-btn a-dart-btn-primary" @click="changeActive">Выбрать</div> -->
		</div>
		<div v-else class="shipping std-shipping">
			<div class="std-shipping__title-container hidden-tablet-l">
				<h1 class="table-kenost__title std-shipping__title">Мои отгрузки</h1>
				<button
					class="dart-btn dart-btn-primary std-shipping__button"
					type="submit"
					@click="this.showShip = true"
				>
					Добавить отгрузку
				</button>
			</div>

			<div class="shipping-table std-shipping__table">
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
							<button
								class="dart-btn dart-btn-primary std-plus-icon__wrapper"
								@click="this.showShip = true"
							>
								<i class="pi pi-plus"></i>
							</button>
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

				<v-table
					class="std-table__wrapper"
					:filters="this.filters"
					:items_data="shipping.shipment"
					:total="shipping.total"
					:pagination_items_per_page="this.pagination_items_per_page"
					:pagination_offset="this.pagination_offset"
					:page="this.page"
					:table_data="this.table_data"
					title="Отгрузки"
					@filter="filter"
					@setAllCheck="setAll"
					@sort="filter"
					@paginate="paginate"
					@clickElem="clickElem"
					@checkElem="checkElem"
					@editElem="editShipping"
					@deleteElem="deleteShipping"
					@viewElem="viewShipping"
				>
					<template v-slot:button>
						<div></div>
					</template>
				</v-table>
				<!--
				<div class="std-table__wrapper">
					<table class="std-table">
						<thead class="std-table__head">
							<tr v-if="this.windowWidth > 480" class="std-table__row">
								<th class="std-table__hcol">Номер отгрузки</th>
								<th class="std-table__hcol">Склад</th>
								<th class="std-table__hcol">Дата</th>
								<th class="std-table__hcol">Дата окончания<br />приема заказов</th>
								<th class="std-table__hcol">Город</th>
								<th class="std-table__hcol">Объем товаров, кг</th>
								<th class="std-table__hcol">Кол-во товаров, шт</th>
							</tr>
							<tr v-if="this.windowWidth <= 480" class="std-table__row">
								<th class="std-table__hcol">Отгрузка</th>
								<th class="std-table__hcol">Город</th>
								<th class="std-table__hcol">Конец приема</th>
								<th class="std-table__hcol">Статус</th>
							</tr>
						</thead>
						<tbody class="std-table__body">
							<tr
								v-if="this.windowWidth > 480"
								class="std-table__row"
								v-for="item in this.shipping.shipment"
								v-bind:key="item.id"
							>
								<td class="std-table__col">{{ item.id }}</td>
								<td class="std-table__col">{{ item.name_short }}</td>
								<td class="std-table__col">{{ item.date }}</td>
								<td class="std-table__col">
									{{
										new Date(item.date_to).toLocaleString("ru", {
											year: "numeric",
											month: "long",
											day: "numeric",
											hour: "numeric",
											minute: "numeric",
										})
									}}
								</td>
								<td class="std-table__col">{{ item.city_name }}</td>
								<td class="std-table__col">{{ item.weight }}</td>
								<td class="std-table__col">{{ item.count }}</td>
							</tr>
							<tr
								v-if="this.windowWidth <= 480"
								class="std-table__row"
								v-for="item in this.shipping.shipment"
								v-bind:key="item.id"
							>
								<td class="std-table__col">{{ item.id }}</td>
								<td class="std-table__col">{{ item.city_name }}</td>
								<td class="std-table__col">
									{{
										new Date(item.date_to).toLocaleString("ru", {
											year: "numeric",
											month: "long",
											day: "numeric",
											hour: "numeric",
											minute: "numeric",
										})
									}}
								</td>
							</tr>
						</tbody>
					</table>
				</div>-->
			</div>

			<Dialog
				v-model:visible="this.showShip"
				:header="this.dialogHeader"
				class="std-dialog"
				:style="{ width: '800px' }"
				@hide="formReset()"
			>
				<form action="#" @submit.prevent="formSubmit">
					<!-- <div class="shipping-form">
			<div class="dart-form-group" :class="{ error: v$.form.selectedStores.$errors.length }">
			<label for="">Выберите магазины</label>
			<AutoComplete
				v-model="form.selectedStores"
				:suggestions="form.filteredStores"
				:multiple="true"
				:dropdown="true"
				optionLabel="label"
				dataKey="value"
				placeholder='Начните вводить наименование магазина'
				@complete="searchStore($event)"
			/>
			<span class="error_desc" v-for="error of v$.form.selectedStores.$errors" :key="error.$uid">
				{{ error.$message }}
			</span>
			</div>
		</div> -->
					<div class="shopping-kenost std-shipping-create">
						<div class="std-display-contents">
							<!-- <p class="shopping-kenost__b std-dropdown__title">Дата</p> -->
							<!-- <div class="dart-alert dart-alert-info">
								Если Вы выберите повторение отгрузки, то смещение дат относительно
								самой отгрузки и датой окончания приемки заказов будет выставлено
								аналогичное тому, что вы укажете ниже.
							</div>-->
							<div class="shopping-kenost__dates">
								<div class="shopping-kenost__row">
									<div
										class="dart-form-group"
										:class="{
											error: v$.form.dateStart.$errors.length,
										}"
									>
										<p class="k-mini-text">Дата и время отгрузки</p>
										<CalendarVue
											showIcon
											showTime
      										hourFormat="24"
											id="calendar-24h"
											v-model="form.dateStart"
											:minDate="this.form.dateEnd"
										/>
										<span
											class="error_desc"
											v-for="error of v$.form.dateStart.$errors"
											:key="error.$uid"
										>
											{{ error.$message }}
										</span>
									</div>
								</div>
								<div class="shopping-kenost__row">
									<div
										class="dart-form-group"
										:class="{
											error: v$.form.dateEnd.$errors.length,
										}"
									>
										<p class="k-mini-text">Дата и время окончания приема заказов</p>
										<CalendarVue
											showIcon
											showTime
      										hourFormat="24"
											id="calendar-24h"
											v-model="form.dateEnd"
											:minDate="new Date()"
										/>
										<span
											class="error_desc"
											v-for="error of v$.form.dateEnd.$errors"
											:key="error.$uid"
										>
											{{ error.$message }}
										</span>
									</div>
								</div>
							</div>
							<div class="dart-row">
								<div class="d-col-md-12">
									<div
										class="dart-form-group"
										:class="{
											error: v$.form.store_id.$errors.length,
										}"
									>
										<label for="">Склад</label>
										<Dropdown
											v-model="this.form.store_id"
											:options="this.stores"
											optionLabel="label"
											optionValue="value"
											placeholder="Выберите склад"
										/>
										<span
											class="error_desc"
											v-for="error of v$.form.store_id.$errors"
											:key="error.$uid"
										>
											{{ error.$message }}
										</span>
									</div>
								</div>
							</div>
							<div class="dart-row mt-2">
								<div class="d-col-md-12">
									<div
										class="dart-form-group"
										:class="{
											error: v$.form.timeSelected.repeater.$errors.length,
										}"
									>
										<label for="">Повторять</label>
										<Dropdown
											v-model="form.timeSelected.repeater"
											:options="form.timeSelect.repeater"
											optionLabel="label"
											optionValue="value"
											placeholder="Выберите период повторения"
										/>
										<span
											class="error_desc"
											v-for="error of v$.form.timeSelected.repeater.$errors"
											:key="error.$uid"
										>
											{{ error.$message }}
										</span>
									</div>
								</div>
							</div>
							<div class="dart-row" v-if="form.timeSelected.repeater != 0">
								<div class="d-col-md-6" v-if="form.timeSelected.repeater == 'week'">
									<div class="dart-form-group">
										<label for="">В следующие дни</label>
										<MultiSelect
											v-model="form.timeSelected.days"
											:options="form.timeSelect.days"
											optionLabel="label"
											optionValue="value"
											placeholder="Выберите дни отгрузок"
										/>
									</div>
								</div>
								<div class="d-col-md-6" v-if="form.timeSelected.repeater == 'week'">
									<div class="dart-form-group">
										<label for="">Каждую ... неделю</label>
										<Dropdown
											v-model="form.timeSelected.weeks"
											:options="form.timeSelect.weeks"
											optionLabel="label"
											optionValue="value"
											placeholder="Выберите неделю"
										/>
									</div>
								</div>
							</div>
							<div
								class="dart-form-group-simple"
								v-if="
									form.timeSelected.repeater == 'day' ||
									form.timeSelected.repeater == 'week'
								"
							>
								<label for="">В период</label>
								<DatePicker
									v-model.range="form.timeSelected.range"
									:masks="{ weekdays: 'WW' }"
									mode="date"
									range
								>
									<template v-slot="{ inputValue, inputEvents, isDragging }">
										<div class="dart-row">
											<div class="d-col-md-6">
												<input
													class="dart-form-control"
													:class="
														isDragging
															? 'text-gray-600'
															: 'text-gray-900'
													"
													:value="inputValue.start"
													v-on="inputEvents.start"
												/>
											</div>
											<div class="d-col-md-6">
												<input
													class="dart-form-control"
													:class="
														isDragging
															? 'text-gray-600'
															: 'text-gray-900'
													"
													:value="inputValue.end"
													v-on="inputEvents.end"
												/>
											</div>
										</div>
									</template>
								</DatePicker>
							</div>
						</div>

						<div class="std-display-contents">
							<p class="shopping-kenost__b mt-2 mb-1 std-dropdown__title">Маршрут</p>
							<!-- <div class="dart-alert dart-alert-info">
								Выберите города маршрута и проставьте даты, когда транспорт будет
								разгружен (по умолчанию, дата будет совпадать с выбранной датой
								начала отгрузки). Если Вы выбрали повторение, то при генерации
								дальнейших отгрузок будет выбрано аналогичное смещение дат.
							</div> -->
							<div
								class="dart-form-group mt-1 mb-2"
								:class="{ error: v$.form.selectedCities.$errors.length }"
							>

								<div class="relative">
									<input
										ref="input"
										@focus="getData"
										@input="getData"
										v-model="this.searchAddress"
										@blur="this.isActive = false"
										type="text"
										class="dart-form-control"
										:placeholder="'Город, адрес или название магазина'"
										:required="false"
									/>
									<ul class="autocomplete__suggestions" :class="{ active: this.isActive }">
										<li v-for="suggestion in shipping_address_and_stores.stores" @click="this.addSelection(suggestion)" class="autocomplete__suggestion">
											{{ suggestion.org_name }}, {{ suggestion.address_short? suggestion.address_short : suggestion.address }}
										</li>
										<li v-for="suggestion in shipping_address_and_stores.dadata" @click="this.addSelection(suggestion)" class="autocomplete__suggestion">
											{{ suggestion.value }}
										</li>
									</ul>
								</div>

								<span
									class="error_desc"
									v-for="error of v$.form.selectedCities.$errors"
									:key="error.$uid"
								>
									{{ error.$message }}
								</span>
							</div>
							<ShoppingCities
								v-model:modelCities="form.selectedCities"
								v-model:modelCitiesDates="form.citiesDates"
								@removeSelectedCity="removeSelectedCity"
								:minDate="form.dateStart"
								:vDatesErrors="v$.form.citiesDates"
							/>
						</div>

						<div class="shopping-kenost__button">
							<div
								class="router-link-active dart-btn dart-btn-secondary btn-padding"
								@click="
									() => {
										this.formReset();
										this.showShip = false;
									}
								"
							>
								Отменить
							</div>
							<button
								type="submit"
								class="dart-btn dart-btn-primary btn-padding"
								:disabled="this.form.loading"
							>
								<i
									v-if="this.form.loading"
									class="pi pi-spin pi-spinner"
									style="font-size: 14px"
								></i>
								Сохранить
							</button>
						</div>
					</div>
				</form>
			</Dialog>

			<div
				:class="`shipping-calendar std-calendar ${
					this.calendarIsExpanded ? 'std-calendar--active' : ''
				} hidden-desktop-s`"
			>
				<div
					class="shipping-calendar__head std-calendar__head"
					@click="this.calendarIsExpanded = !this.calendarIsExpanded"
				>
					<p>Календарь отгрузок</p>
					<div class="std-calendar__actions">
						<div class="std-calendar__expand-button">
							<i class="pi pi-angle-up"></i>
						</div>
						<div
							class="dart-btn dart-btn-primary std-plus-icon__wrapper"
							@click="this.showShip = true"
						>
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
		</div>
	</div>
	<!-- <div class="block-header">
      <div class="dart-row dart-align-items-center">
        <div class="d-col-md-4">
          <span class="block-header__title">Отгрузки</span>
        </div>
        <div class="d-col-md-8">
          <div class="block-header__buttons">
            <a
              href="#"
              class="dart-btn dart-btn-primary-outline"
              @click.prevent="showShippingModal = true"
            >Добавить отгрузку</a>
            <teleport to="body">
              <custom-modal v-model="showShippingModal" @close="formReset">
                <template v-slot:title>Планирование отгрузки</template>
                <form action="#" @submit.prevent="formSubmit">
                  <div class="shipping-form">
                    <div class="dart-form-group" :class="{ error: v$.form.selectedStores.$errors.length }">
                      <label for="">Выберите магазины</label>
                      <AutoComplete
                        v-model="form.selectedStores"
                        :suggestions="form.filteredStores"
                        :multiple="true"
                        :dropdown="true"
                        optionLabel="label"
                        dataKey="value"
                        placeholder='Начните вводить наименование магазина'
                        @complete="searchStore($event)"
                      />
                      <span class="error_desc" v-for="error of v$.form.selectedStores.$errors" :key="error.$uid">
                        {{ error.$message }}
                      </span>
                    </div>
                    <div class="dart-row">
                      <div class="d-col-md-12">
                        <div class="dart-form-group"  :class="{ error: v$.form.timeSelected.repeater.$errors.length }">
                          <label for="">Повторять</label>
                          <Dropdown
                            v-model="form.timeSelected.repeater"
                            :options="form.timeSelect.repeater"
                            optionLabel="label"
                            optionValue="value"
                            placeholder="Выберите период повторения"
                          />
                          <span class="error_desc" v-for="error of v$.form.timeSelected.repeater.$errors" :key="error.$uid">
                            {{ error.$message }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="dart-row" v-if="form.timeSelected.repeater != 0">
                      <div class="d-col-md-6" v-if="form.timeSelected.repeater == 'week'">
                        <div class="dart-form-group">
                          <label for="">В следующие дни</label>
                          <MultiSelect
                            v-model="form.timeSelected.days"
                            :options="form.timeSelect.days"
                            optionLabel="label"
                            optionValue="value"
                            placeholder="Выберите дни отгрузок"
                          />
                        </div>
                      </div>
                      <div class="d-col-md-6" v-if="form.timeSelected.repeater == 'week'">
                        <div class="dart-form-group">
                          <label for="">Каждую ... неделю</label>
                          <Dropdown
                            v-model="form.timeSelected.weeks"
                            :options="form.timeSelect.weeks"
                            optionLabel="label"
                            optionValue="value"
                            placeholder="Выберите неделю"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="dart-form-group"  :class="{ error: v$.form.timeSelected.range.$errors.length }">
                      <label for="">В период</label>
                      <DatePicker
                        :modelValue="form.timeSelected.range"
                        :masks="{ weekdays: 'WW' }"
                        mode="date"
                        is-range
                      >
                        <template v-slot="{ inputValue, inputEvents, isDragging }">
                          <div class="dart-row">
                            <div class="d-col-md-6">
                              <input
                                class="dart-form-control"
                                :class="isDragging ? 'text-gray-600' : 'text-gray-900'"
                                :value="inputValue.start"
                                v-on="inputEvents.start"
                              />
                            </div>
                            <div class="d-col-md-6">
                              <input
                                class="dart-form-control"
                                :class="isDragging ? 'text-gray-600' : 'text-gray-900'"
                                :value="inputValue.end"
                                v-on="inputEvents.end"
                              />
                            </div>
                          </div>
                        </template>
                      </DatePicker>
                      <span class="error_desc" v-for="error of v$.form.timeSelected.range.$errors" :key="error.$uid">
                        {{ error.$message }}
                      </span>
                    </div>
                  </div>
                  <button class="dart-btn dart-btn-primary dart-btn-block dart-mt-1" type="submit">ДОБАВИТЬ ОТГРУЗКУ</button>
                </form>
              </custom-modal>
            </teleport>
          </div>
        </div>
      </div>
    </div> -->
	<!-- <teleport to="body">
      <custom-modal v-model="showShipModal" @close="closeShipModal" class="plan-modal">
        <template v-slot:title>Отгрузка товаров магазина {{ modal.store_name }} на {{ modal.store_date }}</template>
        <div>
          <v-table
            :items_data="getshipdata.items"
            :total="getshipdata.total"
            :pagination_items_per_page="this.pagination_items_per_page"
            :pagination_offset="this.pagination_offset"
            :page="this.ship_page"
            :table_data="this.table_modal_data"
            @paginate="paginateModal"
          />
        </div>
      </custom-modal>
    </teleport> -->
	<Dialog
		v-model:visible="this.viewShipModal"
		:header="'Отгрузка №' + viewShipData?.id"
		:style="{ width: '800px' }"
		class="kenost-shipping-modal"
	>
		<div class="kenost-shipping mt-3">
			<div class="kenost-shipping__title">Дата и время</div>
			<div class="kenost-shipping__cols-2">
				<div class="w-full">
					<div class="kenost-shipping__text-gray">Дата и время отгрузки</div>
					<div class="kenost-shipping__text-info">
						{{ new Date(viewShipData?.date_from).toLocaleString('ru-RU', {
							day: '2-digit',
							month: '2-digit',
							hour: '2-digit',
							minute: '2-digit',
							hour12: false
						}).replace(',', '') }}
					</div>
				</div>
				<div class="w-full">
					<div class="kenost-shipping__text-gray">Дата и время окончания приема заказов</div>
					<div class="kenost-shipping__text-info">
						{{ new Date(viewShipData?.date_to).toLocaleString('ru-RU', {
							day: '2-digit',
							month: '2-digit',
							hour: '2-digit',
							minute: '2-digit',
							hour12: false
						}).replace(',', '') }}
					</div>
				</div>
			</div>
			<div class="kenost-shipping__title mt-3">Маршрут</div>
			<div class="kenost-shipp" v-for="item in this.viewShipData?.ships" v-bind:key="item.id">
				<div class="kenost-shipp__city">
					<i class="std_icon std_icon-location"></i>
					<div class="" v-if="item.is_store == '1'">
						{{ item.org_name }}, {{ item.address_short || item.address }}
					</div>
					<div class="" v-else>{{ item.city }}</div>
				</div>
				<div class="kenost-shipp__content">
					<div class="kenost-shipping__text-gray mt-1">Дата отгрузки</div>
					<div class="kenost-shipping__text-info">
						{{ new Date(item?.date).toLocaleString('ru-RU', {
							day: '2-digit',
							month: '2-digit',
							year: '2-digit'
						}).replace(',', '') }}
					</div>
					<div v-if="item?.orders?.length">
						<div class="kenost-shipping__text-gray mt-3">Доставки</div>
						<div class="kenost-shipp_deliverys">
							<div v-for="order in item?.orders" v-bind:key="order.id" class="kenost-shipp_delivery">
								{{order?.properties?.sl?.point?.address}}
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="flex align-items-center mt-3 gap-2 justify-content-end">
				<div v-if="viewShipData.status != '5' && viewShipData.status != '4'" @click="this.deleteShipping(viewShipData, 5)" class="dart-btn dart-btn-secondary">
					Отменить отгрузку
				</div>
				<div v-if="viewShipData.status == '3'" @click="this.deleteShipping(viewShipData, 4)" class="dart-btn dart-btn-primary">
					Отгрузка выполнена
				</div>
			</div>
		</div>
	</Dialog>
</template>

<script>
import { ref } from "vue";
import { mapActions, mapGetters, mapMutations } from "vuex";
import { useVuelidate } from "@vuelidate/core";
//   import { required } from '@/utils/i18n-validators'
import { required } from "../utils/i18n-validators";
import router from "../router";
// import AutoComplete from "primevue/autocomplete";
import Dropdown from "primevue/dropdown";
import MultiSelect from "primevue/multiselect";
import ConfirmDialog from "primevue/confirmdialog";
import Toast from "primevue/toast";
import { Calendar, DatePicker } from "v-calendar";
import CalendarVue from "primevue/calendar";
// import customModal from '@/components/popup/CustomModal'
import vTable from "../components/table/v-table.vue";
import "v-calendar/style.css";
import Dialog from "primevue/dialog";
import Autocomplete from "../components/Autocomplete.vue";
import ShoppingCities from "../components/ProfileShipping/ShoppingCities.vue";
import Loading from "../components/Loading.vue";
import { helpers } from "@vuelidate/validators";
import { cloneDeep } from "lodash";
// import { date } from 'yup'
// import Checkbox from 'primevue/checkbox'
// import { Swiper, SwiperSlide } from 'swiper/vue'
// import 'swiper/css'

export default {
	name: "ProfileShipping",
	props: {
		pagination_items_per_page: {
			type: Number,
			default: 24,
		},
		pagination_offset: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {
			windowWidth: 1920,
			calendarIsExpanded: false,
			loading_page: true,
			loading: false,
			editWindow: false,
			showShipModal: false,
			showShip: false,
			viewShipModal: false,
			viewShipData: null,
			stores: [],
			isActive: false,
			organozation: [],
			inputTimer: null,
			searchAddress: "",
			locations: [],
			shipModa: {
				city: "",
				shops: {
					1: {
						name: "МастерТул",
						addres: "ул. Тверская, д. 15, стр. 2",
						image: "https://mst.tools/assets/content/images/shops_logo/spo-logo.png",
					},
					2: {
						name: "МастерТул",
						addres: "ул. Тверская, д. 15, стр. 2",
						image: "https://mst.tools/assets/content/images/shops_logo/spo-logo.png",
					},
					3: {
						name: "МастерТул",
						addres: "ул. Тверская, д. 15, стр. 2",
						image: "https://mst.tools/assets/content/images/shops_logo/spo-logo.png",
					},
					4: {
						name: "МастерТул",
						addres: "ул. Тверская, д. 15, стр. 2",
						image: "https://mst.tools/assets/content/images/shops_logo/spo-logo.png",
					},
					5: {
						name: "МастерТул",
						addres: "ул. Тверская, д. 15, стр. 2",
						image: "https://mst.tools/assets/content/images/shops_logo/spo-logo.png",
					},
					6: {
						name: "МастерТул",
						addres: "ул. Тверская, д. 15, стр. 2",
						image: "https://mst.tools/assets/content/images/shops_logo/spo-logo.png",
					},
				},
			},
			modal: {
				store_name: "",
				store_date: "",
			},
			checkDate: null,
			shipping_values: {},
			form: {
				id: 0,
				loading: false,
				selectedStores: null,
				filteredStores: null,
				selectedCities: [],
				citiesDates: {},
				citiesRadii: {},
				// filteredCities: null,
				dateStart: new Date(),
				dateEnd: new Date(),
				store_id: null,
				filter: "",
				timeSelect: {
					repeater: [
						{
							label: "Не повторять",
							value: 0,
						},
						{
							label: "Ежедневно",
							value: "day",
						},
						{
							label: "Еженедельно",
							value: "week",
						},
					],
					weeks: [
						{
							label: "1",
							value: 1,
						},
						{
							label: "2",
							value: 2,
						},
						{
							label: "3",
							value: 3,
						},
						{
							label: "4",
							value: 4,
						},
					],
					days: [
						{
							label: "Пн",
							value: 1,
						},
						{
							label: "Вт",
							value: 2,
						},
						{
							label: "Ср",
							value: 3,
						},
						{
							label: "Чт",
							value: 4,
						},
						{
							label: "Пт",
							value: 5,
						},
						{
							label: "Сб",
							value: 6,
						},
						{
							label: "Вс",
							value: 7,
						},
					],
				},
				timeSelected: {
					repeater: 0,
					weeks: null,
					days: null,
					range: ref(null),
				},
			},
			selectedDay: null,
			page: 1,
			ship_page: 1,
			table_modal_data: {
				image: {
					label: "",
					type: "image",
				},
				name: {
					label: "Товар",
					type: "text",
				},
				count: {
					label: "Кол-во",
					type: "text",
				},
				price: {
					label: "Цена",
					type: "text",
				},
			},
			table_data: {
				id: {
					label: "Номер отгрузки",
					type: "text",
					sort: true,
				},
				name_short: {
					label: "Склад",
					type: "text",
					sort: true,
				},
				date_from: {
					label: "Дата",
					type: "text",
					sort: true,
				},
				date_order_end: {
					label: "Дата окончания приема заказов",
					type: "clickevent",
					sort: true,
				},
				route: {
					label: "Маршрут",
					type: "text",
					sort: true,
				},
				orders_count: {
					label: "Заказы с маркетплейса",
					type: "text",
					sort: true,
				},
				status: {
					label: 'Статус',
					type: 'status'
				},
				// weight: {
				// 	label: "Объем товаров, кг",
				// 	type: "text",
				// 	sort: false,
				// },
				// count: {
				// 	label: "Кол-во товаров, шт",
				// 	type: "text",
				// 	sort: false,
				// },
				actions: {
					label: "Действия",
					type: "actions",
					sort: false,
					available: {
						view: {
							icon: "pi pi-eye",
							label: "Просмотреть",
						},
						// edit: {
						// 	icon: "pi pi-pencil",
						// 	label: "Редактировать",
						// },
						delete: {
							icon: "pi pi-times",
							label: "Отменить",
						},
					},
				},
			},
			filters: {
				range: {
					name: "Временной промежуток",
					placeholder: "Выберите даты",
					range: "all",
					type: "range",
				},
			},
			attributes: [
				{
					key: "today",
					highlight: "red",
					dates: new Date(),
				},
				// this.shipping.dates
			],
			showShippingModal: false,
		};
	},
	methods: {
		...mapActions([
			"get_shipping_from_api",
			"set_shipping_to_api",
			"get_regions_from_api",
			"get_shipping_statuses",
			"get_ship_data_api",
			"unset_ship_data",
			"org_get_stores_from_api",
			"org_get_from_api",
			"unset_shipping",
			"get_address_and_stores_shipping_to_api"
		]),
		...mapMutations(["SET_SHIPPING_CHECK", "SET_SHIPPING_CHECK_ONE"]),
		// deletePunkt(index) {
		// 	if (Object.prototype.hasOwnProperty.call(this.form.selectedCities, index)) {
		// 		// delete this.form.selectedCities[index]
		// 		const { [index]: _, ...newCities } = this.form.selectedCities;
		// 		this.form.selectedCities = newCities;
		// 	}
		// 	if (Object.prototype.hasOwnProperty.call(this.form.citiesDates, index)) {
		// 		// delete this.form.citiesDates[index]
		// 		const { [index]: _, ...newCitiesDates } = this.form.citiesDates;
		// 		this.form.citiesDates = newCitiesDates;
		// 	}
		// 	console.log(this.form);
		// },
		checkElem(data) {
			this.SET_SHIPPING_CHECK_ONE(data, { root: true });
		},
		toggleEditMode() {
			this.editMode = !this.editMode;
		},
		setAll(data) {
			this.SET_SHIPPING_CHECK(data, { root: true });
		},
		searchStore(event) {
			this.$load(async () => {
				const data = await this.$api.getStores.get({
					filter: event.query,
					stores: this.form.selectedStores,
					id: router.currentRoute._value.params.id,
					type: router.currentRoute._value.params.type,
				});
				this.form.filteredStores = data.data.data.stores;
			});
		},
		// setSelectedCities(cities) {
		// 	this.form.selectedCities = Array.from(cities);
		// },
		removeSelectedCity(index) {
			delete this.form.citiesDates[this.form.selectedCities[index].value];
			this.form.selectedCities.splice(index, 1);
		},
		sortSelectedCities() {
			const citiesDates = this.form.citiesDates;

			this.form.selectedCities.sort((city1, city2) => {
				return citiesDates[city1.value] - citiesDates[city2.value];
			});
		},
		async formSubmit(event) {
			// TODO Лоадер шестеренок при отправке формы
			const result = await this.v$.$validate();
			// const result = true;
			if (!result) {
				console.log(result);
			} else {
				this.$load(async () => {
					this.form.loading = true;
					this.unset_shipping();
					let data = cloneDeep(this.form);
					data.dateStart = data.dateStart.toDateString();
					data.dateEnd = data.dateEnd.toDateString();

					for(let i = 0; i < data.selectedCities.length; i++){
						data.selectedCities[i].date = (data.selectedCities[i].date).toDateString()
					}
					//Object.keys(data.citiesDates).forEach((key) => {
						//data.citiesDates[key] = data.citiesDates[key].toLocaleDateString();
					//});
					// console.log(data)
					await this.set_shipping_to_api({
						action: "set",
						id: router.currentRoute._value.params.id,
						data: data,
					});
					await this.get_shipping_from_api({ filter: [], page: this.page, perpage: this.pagination_items_per_page });
					this.attributes.push(this.shipping.dates);
					this.form.loading = false;
					this.formReset();
					this.showShip = false;
					this.v$.$reset();
				});
			}
		},
		clickElem(data) {
			console.log(data);
			this.get_ship_data_api({
				shipid: data.id,
				page: this.ship_page,
				perpage: this.pagination_items_per_page,
			});
			this.modal.store_name = data.dilers;
			this.modal.store_date = data.date;
			this.showShipModal = true;
		},
		addSelection(selection) {
			this.form.selectedCities.push(selection);
			this.isActive = false;
			this.searchAddress = '';
        },
		viewShipping(data){
			this.viewShipData = data
			this.viewShipModal = true
		},
		editShipping(data) {
			if (new Date(data.date_from) > new Date()) {
				this.editWindow = true;
				const timing = JSON.parse(data.timing);
				this.form.id = data.id;
				this.form.timeSelected.repeater = timing.repeater;
				this.form.timeSelected.weeks = timing.weeks;
				this.form.timeSelected.days = timing.days;
				this.form.timeSelected.range = timing.range;
				this.form.selectedStores = null;
				this.form.selectedCities = JSON.parse(data.properties);
				console.log(this.form.selectedCities)
				if(this.form.selectedCities){
					for (let i = 0; i < this.form.selectedCities.length; i++) {
						var sparts = this.form.selectedCities[i].date.date.split(" ");
						var parts = sparts[0].split("-");
						this.form.citiesDates[this.form.selectedCities[i].value] = new Date(
							parts[0],
							parts[1] - 1,
							parts[2]
						);
					}
				}
				this.form.store_id = data.warehouse_id;
				this.form.dateStart = new Date(data.date_from);
				var parts = data.date_order_end.split(".");
				this.form.dateEnd = new Date(parts[2], parts[1] - 1, parts[0]);
				this.showShip = true;
			} else{
				this.$toast.add({ severity: 'error', summary: "Ошибка", detail: "Эту отгрузку нельзя отредактировать!", life: 3000 });
			}
		},
		deleteShipping(data, status) {
			this.$confirm.require({
				message: "Вы уверены, что хотите изменить статус отгрузки №" + data.id + "?",
				header: "Подтверждение изменения статуса",
				icon: "pi pi-exclamation-triangle",
				accept: () => {
					this.loading = true;
					this.unset_shipping();
					this.$load(async () => {
						await this.set_shipping_to_api({
							action: "change/status",
							id: router.currentRoute._value.params.id,
							shipping: data,
							status: status || 5
						})
							.then((result) => {
								this.$toast.add({
									severity: "success",
									summary: "Статус изменен!",
									detail:
										"Изменение статуса у отгрузки №" + data.id + " произошло успешно!",
									life: 3000,
								});
								this.get_shipping_from_api(data).then((result) => {});
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
			this.viewShipModal = false
		},
		closeShipModal() {
			this.modal.store_name = "";
			this.modal.store_date = "";
			this.unset_ship_data();
		},
		formReset() {
			this.form.timeSelected.repeater = 0;
			this.form.timeSelected.weeks = null;
			this.form.timeSelected.days = null;
			this.form.timeSelected.range = null;
			this.form.selectedStores = null;
			this.form.selectedCities = [];
			this.form.citiesDates = {};
			this.form.store_id = null;
			this.form.dateStart = new Date();
			this.form.dateEnd = new Date();
			this.editWindow = false;
		},
		dayClicked(day) {
			this.form.timeSelected.range = {
				start: day,
				end: day,
			};
			this.showShippingModal = true;
		},
		async getData(){
			this.debounce(await this.getAdress, 500);
		},
		getAdress(){
			console.log('Отправка')
			this.get_address_and_stores_shipping_to_api({
				action: 'get/address/stores',
				search: this.searchAddress,
				id: this.$route.params.id,
			})
		},
		debounce(func, delay) {
            clearTimeout(this.inputTimer);
            this.inputTimer = setTimeout(func, delay);
        },
		filter(data) {
			// console.log(data)
			if (typeof data.filtersdata !== "undefined") {
				if (
					typeof data.filtersdata.range !== "undefined" &&
					data.filtersdata.range !== null
				) {
					data.filtersdata.dates = [];
					if (data.filtersdata.range[0]) {
						const d = data.filtersdata.range[0];
						data.filtersdata.dates.push(d.toDateString());
					}
					if (data.filtersdata.range[1]) {
						const d = data.filtersdata.range[1];
						data.filtersdata.dates.push(d.toDateString());
					}
				}
				if (
					typeof data.filtersdata.status === "undefined" &&
					data.filtersdata.status === null
				) {
					data.filtersdata.status = 0;
				}
			}
			// console.log(data)
			this.loading = true;
			this.get_shipping_from_api(data).then(
				(result) => {
					this.loading = false;
				},
				(error) => {
					// alert error
					console.log("Произошла ошибка" + error);
				}
			);
		},
		paginate(data) {
			this.loading = true;
			this.page = data.page;
			this.get_shipping_from_api(data).then(
				(result) => {
					this.loading = false;
				},
				(error) => {
					// alert error
					console.log("Произошла ошибка " + error);
				}
			);
		},
		paginateModal(data) {
			this.loading = true;
			this.ship_page = data.page;
			this.get_ship_data_api(data).then(
				(result) => {
					this.loading = false;
				},
				(error) => {
					// alert error
					console.log("Произошла ошибка " + error);
				}
			);
		},
	},
	mounted() {
		this.windowWidth = window.innerWidth;
		window.addEventListener("resize", () => {
			this.windowWidth = window.innerWidth;
		});

		this.org_get_from_api({
			action: "get/orgs",
		}).then(() => (this.loading_page = false));

		this.$load(async () => {
			await this.get_shipping_from_api({ filter: [], page: 1, perpage: this.pagination_items_per_page });
			this.attributes.push(this.shipping.dates);
		});
		this.$load(async () => {
			const cities = await this.$api.getCities.get({
				id: router.currentRoute._value.params.id,
			});
			this.form.filteredCities = cities.data.data.cities;
		});
		this.org_get_stores_from_api({
			action: "get/stores",
			id: this.$route.params.id,
		});
		this.get_shipping_statuses().then();
	},
	components: {
		Dropdown,
		MultiSelect,
		// AutoComplete,
		Calendar,
		DatePicker,
		// customModal,
		vTable,
		Dialog,
		CalendarVue,
		Loading,
		ConfirmDialog,
		// Checkbox,
		// Swiper,
		// SwiperSlide
		Toast,
		Autocomplete,
		ShoppingCities,
	},
	computed: {
		...mapGetters(["shipping", "shipping_statuses", "getshipdata", "org_stores", "orgs", "shipping_address_and_stores"]),
		dialogHeader() {
			if (this.editWindow) {
				return "Редактирование отгрузки";
			} else {
				return "Создание отгрузки";
			}
		},
	},
	setup() {
		return { v$: useVuelidate() };
	},
	validations() {
		return {
			form: {
				dateStart: {
					required,
				},
				dateEnd: {
					required,
				},
				timeSelected: {
					repeater: { required },
				},
				store_id: { required },
				selectedCities: {
					required: helpers.withMessage(
						"Выберите хотя бы один город",
						() => this.form.selectedCities.length
					),
				},
				citiesDates: {
					// required: helpers.withMessage(
					// 	"Заполните все даты отгрузок",
					// 	() => {
					// 		if(Object.keys(this.form.citiesDates).length !== this.form.selectedCities.length) return false

					// 		let result = true;
					// 		Object.keys(this.form.citiesDates).forEach(key => {
					// 			if(!this.form.citiesDates[key]) {
					// 				result = false;
					// 				return;
					// 			}
					// 		});
					// 		return result;
					// 	}
					// )
				},
			},
		};
	},
	watch: {
		shipping: function (newVal, oldVal) {
			this.shipping_values = newVal;
		},
		org_stores: function (newVal, oldVal) {
			this.stores = [];
			for (let i = 0; i < newVal.items.length; i++) {
				this.stores.push({ label: newVal.items[i].name, value: newVal.items[i].id });
			}
		},
		shipping_address_and_stores: function (newVal, oldVal) {
			if(newVal){
				if(newVal.dadata && newVal.stores){
					if (Object.keys(newVal.dadata).length || Object.keys(newVal.stores).length) {
						this.isActive = true;
						console.log(this.isActive)
					}
				}
				
			}
		},
		"form.citiesDates": {
			handler(newVal, oldVal) {
				this.sortSelectedCities();
			},
			deep: true,
		},
		"form.dateEnd": function (newVal, oldVal) {
			if (newVal > this.form.dateStart) {
				this.form.dateStart = newVal;
			}
		},
		"form.dateStart": function (newVal, oldVal) {
			Object.keys(this.form.citiesDates).forEach((key) => {
				if (newVal > this.form.citiesDates[key]) {
					this.form.citiesDates[key] = newVal;
				}
			});
		},
		orgs: function (newVal, oldVal) {
			this.organizations = newVal;
			if (newVal) {
				const org = newVal.find((el) => el.id === this.$route.params.id);
				if (org) {
					this.organozation = org;
				}
			}
		},
	},
};
</script>

<style lang="scss">
@import '../assets/styles/mixins.scss';
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

		&>*+*{
			margin-left: 8px;
		}
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
		.dart-form-control,
		.autocomplete {
			border: 1px solid #f00;
			border-radius: 6px;
			.p-inputtext {
				border: none;
			}
		}
		.kenost-dropzone{
			border-color: #f00 !important;
		}
		span.error_desc {
			color: #e24c4c;
			font-size: 12px;
			display: block;
			padding: 5px 0;
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

.autocomplete {
    @include flex($align: center, $gap: 15px);

    & {
        flex-wrap: wrap;
        max-width: 100%;

        background-color: #fff;
        border: 1px solid #e2e2e2;
        border-radius: 5px;

        color: #282828;
        font-size: 14px;
        font-weight: 400;
        line-height: 1.06;
        letter-spacing: 0.25px;
        width: 100%;
        padding: 10px 15px;

        position: relative;
    }

    &__selections,
    &__suggestions {
        margin: 0;
        padding: 0;
    }

    &__selections {
        @include flex($align: center, $gap: 8px);

        & {
            flex-wrap: wrap;
        }
    }

    &__selection {
        @include flex($justify: center, $align: center, $gap: 8px);

        & {
            background-color: #dee2e6;
            border-radius: 16px;
            color: #495057;

            padding: 6px 12px;
        }

        svg {
            cursor: pointer;
        }
    }

    &__input {
        flex-basis: 0;
        flex-grow: 1;

        border: none;
        outline: none;
        color: #495057;
        font-size: 16px;

        margin: 0;
        padding: 0;

        &::placeholder {
            color: #6c757d;
        }
    }

    &__suggestions {
        @include scrollbar;
        @include flex($direction: column);

        & {
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);

            width: 100%;
            max-height: 0px;

            overflow-y: auto;

            position: absolute;
            top: calc(100% + 2px);
            left: 0;
            transition-duration: 0.5s;
            z-index: 1110;
        }

        &.active {
            max-height: 200px;
            padding-top: 0;
        }
    }

    &__suggestion {
        @include flex($align: center);

        & {
            cursor: pointer;
            width: 100%;
            padding: 15px 20px;
            transition-duration: 0.3s;
        }

        &:hover {
            background-color: #e9ecef;
        }
    }
}
</style>
