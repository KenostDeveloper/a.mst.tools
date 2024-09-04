<template>
	<div class="shipping std-shipping">
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
						<tr v-if="this.windowWidth > 480" class="std-table__row">
							<th class="std-table__hcol">Номер отгрузки</th>
							<th class="std-table__hcol">Склад</th>
							<th class="std-table__hcol">Дата</th>
							<th class="std-table__hcol">Дата окончания<br />приема заказов</th>
							<th class="std-table__hcol">Город</th>
							<th class="std-table__hcol">Объем товарво, кг</th>
							<th class="std-table__hcol">Кол-во товаров, шт</th>
							<th class="std-table__hcol">Статус</th>
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
							<td class="std-table__col">{{ item.status_name }}</td>
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
							<td class="std-table__col">{{ item.status_name }}</td>
						</tr>
					</tbody>
				</table>
				<!-- {{ shipping.shipment }} -->
			</div>
		</div>

		<Dialog
			v-model:visible="this.showShip"
			header="Создание отгрузки"
			class="std-dialog"
			:style="{ width: '800px' }"
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
					<div class="std-display-contents hidden-tablet-l">
						<p class="shopping-kenost__b std-dropdown__title">Дата и время</p>
						<div class="dart-alert dart-alert-info">
							Если Вы выберите повторение отгрузки, то смещение дат относительно самой
							отгрузки и датой окончания приемки заказов будет выставлено аналогичное
							тому, что вы укажете ниже.
						</div>
						<div class="shopping-kenost__dates">
							<div class="shopping-kenost__row">
								<p class="k-mini-text">Дата и время отгрузки</p>
								<CalendarVue
									showIcon
									id="calendar-24h"
									v-model="form.dateStart"
									showTime
									hourFormat="24"
								/>
							</div>
							<div class="shopping-kenost__row">
								<p class="k-mini-text">Дата и время окончания приема заказов</p>
								<CalendarVue
									showIcon
									id="calendar-24h"
									v-model="form.dateEnd"
									showTime
									hourFormat="24"
								/>
							</div>
						</div>
						<div class="dart-row mt-2">
							<div class="d-col-md-12">
								<div
									class="dart-form-group"
									:class="{ error: v$.form.timeSelected.repeater.$errors.length }"
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
						<div class="dart-row">
							<div class="d-col-md-12">
								<div
									class="dart-form-group"
									:class="{ error: v$.form.timeSelected.repeater.$errors.length }"
								>
									<label for="">Склад</label>
									<Dropdown
										v-model="this.form.store_id"
										:options="this.stores"
										optionLabel="label"
										optionValue="value"
										placeholder="Выберите склад"
									/>
									<!-- <span class="error_desc" v-for="error of v$.form.timeSelected.repeater.$errors" :key="error.$uid">
											{{ error.$message }}
										  </span> -->
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
							:class="{ error: v$.form.timeSelected.range.$errors.length }"
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
													isDragging ? 'text-gray-600' : 'text-gray-900'
												"
												:value="inputValue.start"
												v-on="inputEvents.start"
											/>
										</div>
										<div class="d-col-md-6">
											<input
												class="dart-form-control"
												:class="
													isDragging ? 'text-gray-600' : 'text-gray-900'
												"
												:value="inputValue.end"
												v-on="inputEvents.end"
											/>
										</div>
									</div>
								</template>
							</DatePicker>
							<span
								class="error_desc"
								v-for="error of v$.form.timeSelected.range.$errors"
								:key="error.$uid"
							>
								{{ error.$message }}
							</span>
						</div>
					</div>
					<div class="std-display-contents hidden-tablet-l">
						<p class="shopping-kenost__b mt-2 mb-1 std-dropdown__title">Маршрут</p>
						<div class="dart-alert dart-alert-info">
							Выберите города маршрута и проставьте даты, когда транспорт будет
							разгружен (по умолчанию, дата будет совпадать с выбранной датой начала
							отгрузки). Если Вы выбрали повторение, то при генерации дальнейших
							отгрузок будет выбрано аналогичное смещение дат.
						</div>
						<div
							class="dart-form-group mt-1 mb-2"
							:class="{ error: v$.form.selectedCities.$errors.length }"
						>
							<AutoComplete
								v-model="form.selectedCities"
								:suggestions="form.filteredCities"
								:multiple="true"
								:dropdown="true"
								optionLabel="label"
								dataKey="value"
								placeholder="Начните вводить наименование города"
								@complete="searchCity($event)"
							/>
							<span
								class="error_desc"
								v-for="error of v$.form.selectedCities.$errors"
								:key="error.$uid"
							>
								{{ error.$message }}
							</span>
						</div>
						<div class="shopping-kenost__citys" v-if="this.form.selectedCities">
							<div
								class="shopping-kenost__cityone"
								v-for="(item, index) in this.form.selectedCities"
								:key="index"
							>
								<div class="shopping-kenost__cityone-name" v-if="item">
									<p>{{ item.label }}</p>
									<div class="btn btn-close" @click="deletePunkt(index)">
										<i class="d_icon d_icon-close"></i>
									</div>
								</div>
								<div class="shopping-kenost__cityone-date mb-3" v-if="item">
									<p class="k-mini-text">Дата и время окончания приема заказов</p>
									<CalendarVue
										showIcon
										id="calendar-24h"
										v-model="this.form.citiesDates[index]"
										showTime
										hourFormat="24"
									/>
								</div>
							</div>
						</div>
					</div>

					<details class="std-dropdown visible-tablet-l">
						<summary class="std-dropdown__header">
							<p class="shopping-kenost__b std-dropdown__title">Дата и время</p>
							<i class="d_icon d_icon-arrow std-dropdown__button"></i>
						</summary>
						<div class="std-dropdown__content">
							<div class="dart-alert dart-alert-info">
								Если Вы выберите повторение отгрузки, то смещение дат относительно
								самой отгрузки и датой окончания приемки заказов будет выставлено
								аналогичное тому, что вы укажете ниже.
							</div>
							<div class="shopping-kenost__dates">
								<div class="shopping-kenost__row">
									<p class="k-mini-text">Дата и время отгрузки</p>
									<CalendarVue
										showIcon
										id="calendar-24h"
										v-model="form.dateStart"
										showTime
										hourFormat="24"
									/>
								</div>
								<div class="shopping-kenost__row">
									<p class="k-mini-text">Дата и время окончания приема заказов</p>
									<CalendarVue
										showIcon
										id="calendar-24h"
										v-model="form.dateEnd"
										showTime
										hourFormat="24"
									/>
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
							<div class="dart-row">
								<div class="d-col-md-12">
									<div
										class="dart-form-group"
										:class="{
											error: v$.form.timeSelected.repeater.$errors.length,
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
										<!-- <span class="error_desc" v-for="error of v$.form.timeSelected.repeater.$errors" :key="error.$uid">
											{{ error.$message }}
										  </span> -->
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
								:class="{ error: v$.form.timeSelected.range.$errors.length }"
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
								<span
									class="error_desc"
									v-for="error of v$.form.timeSelected.range.$errors"
									:key="error.$uid"
								>
									{{ error.$message }}
								</span>
							</div>
						</div>
					</details>
					<details class="std-dropdown visible-tablet-l">
						<summary class="std-dropdown__header">
							<p class="shopping-kenost__b mt-2 mb-1 std-dropdown__title">Маршрут</p>
							<i class="d_icon d_icon-arrow std-dropdown__button"></i>
						</summary>
						<div class="std-dropdown__content">
							<div class="dart-alert dart-alert-info">
								Выберите города маршрута и проставьте даты, когда транспорт будет
								разгружен (по умолчанию, дата будет совпадать с выбранной датой
								начала отгрузки). Если Вы выбрали повторение, то при генерации
								дальнейших отгрузок будет выбрано аналогичное смещение дат.
							</div>
							<div
								class="dart-form-group mt-1 mb-2"
								:class="{ error: v$.form.selectedCities.$errors.length }"
							>
								<AutoComplete
									v-model="form.selectedCities"
									:suggestions="form.filteredCities"
									:multiple="true"
									:dropdown="true"
									optionLabel="label"
									dataKey="value"
									placeholder="Начните вводить наименование города"
									@complete="searchCity($event)"
								/>
								<span
									class="error_desc"
									v-for="error of v$.form.selectedCities.$errors"
									:key="error.$uid"
								>
									{{ error.$message }}
								</span>
							</div>
							<div class="shopping-kenost__citys" v-if="this.form.selectedCities">
								<div
									class="shopping-kenost__cityone"
									v-for="(item, index) in this.form.selectedCities"
									:key="index"
								>
									<div class="shopping-kenost__cityone-name" v-if="item">
										<p>{{ item.label }}</p>
										<div class="btn btn-close" @click="deletePunkt(index)">
											<i class="d_icon d_icon-close"></i>
										</div>
									</div>
									<div class="shopping-kenost__cityone-date mb-3" v-if="item">
										<p class="k-mini-text">
											Дата и время окончания приема заказов
										</p>
										<CalendarVue
											showIcon
											id="calendar-24h"
											v-model="this.form.citiesDates[index]"
											showTime
											hourFormat="24"
										/>
									</div>
								</div>
							</div>
						</div>
					</details>

					<div class="shopping-kenost__button">
						<div
							class="router-link-active dart-btn dart-btn-secondary btn-padding"
							@click="this.showShip = false"
						>
							Отменить
						</div>
						<button type="submit" class="dart-btn dart-btn-primary btn-padding">
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
</template>

<script>
import { ref } from "vue";
import { mapActions, mapGetters, mapMutations } from "vuex";
import { useVuelidate } from "@vuelidate/core";
//   import { required } from '@/utils/i18n-validators'
import { required } from "../utils/i18n-validators";
import router from "../router";
import AutoComplete from "primevue/autocomplete";
import Dropdown from "primevue/dropdown";
import MultiSelect from "primevue/multiselect";
import { Calendar, DatePicker } from "v-calendar";
import CalendarVue from "primevue/calendar";
// import customModal from '@/components/popup/CustomModal'
import vTable from "../components/table/v-table.vue";
import "v-calendar/style.css";
import Dialog from "primevue/dialog";
// import { date } from 'yup'
// import Checkbox from 'primevue/checkbox'
// import { Swiper, SwiperSlide } from 'swiper/vue'
// import 'swiper/css'

export default {
	name: "ProfileShipping",
	props: {
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
			windowWidth: 1920,
			calendarIsExpanded: false,

			editMode: false,
			showShipModal: false,
			showShip: false,
			stores: [],
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
				loading: false,
				selectedStores: null,
				filteredStores: null,
				selectedCities: null,
				filteredCities: null,
				dateStart: new Date(),
				dateEnd: new Date(),
				store_id: "",
				citiesDates: [],
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
				check: {
					label: "",
					checked: false,
					type: "editmode",
				},
				ship_id: {
					label: "Номер отгрузки",
					type: "text",
				},
				name_short: {
					label: "Склад",
					type: "text",
				},
				date: {
					label: "Дата",
					type: "text",
				},
				date_order_end: {
					label: "Дата окончания приема заказов",
					type: "clickevent",
				},
				city_name: {
					label: "Город",
					type: "text",
				},
				weight: {
					label: "Объем товаров, кг",
					type: "text",
				},
				count: {
					label: "Кол-во товаров, шт",
					type: "text",
				},
				status: {
					label: "Статус",
					type: "status",
				},
			},
			filters: {
				region: {
					name: "Регион",
					placeholder: "Выберите регион",
					type: "tree",
					values: this.getregions,
				},
				range: {
					name: "Временной промежуток",
					placeholder: "Выберите даты",
					range: "all",
					type: "range",
				},
				status: {
					name: "Статус",
					type: "dropdown",
					optionLabel: "name",
					optionValue: "id",
					placeholder: "Статус",
					values: this.shipping_statuses,
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
		]),
		...mapMutations(["SET_SHIPPING_CHECK", "SET_SHIPPING_CHECK_ONE"]),
		deletePunkt(index) {
			if (Object.prototype.hasOwnProperty.call(this.form.selectedCities, index)) {
				// delete this.form.selectedCities[index]
				const { [index]: _, ...newCities } = this.form.selectedCities;
				this.form.selectedCities = newCities;
			}
			if (Object.prototype.hasOwnProperty.call(this.form.citiesDates, index)) {
				// delete this.form.citiesDates[index]
				const { [index]: _, ...newCitiesDates } = this.form.citiesDates;
				this.form.citiesDates = newCitiesDates;
			}
			console.log(this.form);
		},
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
		searchCity(event) {
			this.$load(async () => {
				const data = await this.$api.getCities.get({
					filter: event.query,
					cities: this.form.selectedCities,
					id: router.currentRoute._value.params.id,
				});
				this.form.filteredCities = data.data.data.cities;
			});
		},
		async formSubmit(event) {
			// const result = await this.v$.$validate()
			const result = true;
			if (!result) {
				console.log(result);
			} else {
				this.$load(async () => {
					let data = this.form;
					data.dateStart = data.dateStart.toDateString();
					data.dateEnd = data.dateEnd.toDateString();
					for (let i = 0; i < data.citiesDates.length; i++) {
						data.citiesDates[i] = data.citiesDates[i].toDateString();
					}
					await this.set_shipping_to_api({
						action: "set",
						id: router.currentRoute._value.params.id,
						data: data,
					});
					await this.get_shipping_from_api({ filter: [] });
					this.attributes.push(this.shipping.dates);
					// this.attributes.pop()
					// this.attributes.push(this.shipping.dates)
					this.showShip = false;
					this.formReset();
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
			this.form.selectedCities = null;
			this.form.dateStart = new Date();
			this.form.dateEnd = new Date();
		},
		dayClicked(day) {
			this.form.timeSelected.range = {
				start: day,
				end: day,
			};
			this.showShippingModal = true;
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

		this.$load(async () => {
			await this.get_shipping_from_api({ filter: [] });
			this.attributes.push(this.shipping.dates);
		});
		this.$load(async () => {
			const data = await this.$api.getStores.get({
				id: router.currentRoute._value.params.id,
			});
			this.form.filteredStores = data.data.data.stores;
			this.filters.store.values = data.data.data.stores;
			const cities = await this.$api.getCities.get({
				id: router.currentRoute._value.params.id,
			});
			this.form.filteredCities = cities.data.data.cities;
		});
		this.org_get_stores_from_api({
			action: "get/stores",
			id: this.$route.params.id,
		});
		this.get_regions_from_api()
			.then
			// this.filters.region.values = this.getregions
			();
		this.get_shipping_statuses()
			.then
			// this.filters.status.values = this.shipping_statuses
			();
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
		...mapGetters(["shipping", "getregions", "shipping_statuses", "getshipdata", "org_stores"]),
	},
	setup() {
		return { v$: useVuelidate() };
	},
	validations() {
		return {
			form: {
				timeSelected: {
					range: { required },
					repeater: { required },
				},
				selectedStores: { required },
				selectedCities: { required },
			},
		};
	},
	watch: {
		getregions: function (newVal, oldVal) {
			this.filters.region.values = newVal;
		},
		shipping_statuses: function (newVal, oldVal) {
			this.filters.status.values = newVal;
		},
		shipping: function (newVal, oldVal) {
			this.shipping_values = newVal;
		},
		org_stores: function (newVal, oldVal) {
			// this.stores = newVal
			console.log(newVal);
			this.stores = [];
			for (let i = 0; i < newVal.items.length; i++) {
				this.stores.push({ label: newVal.items[i].name, value: newVal.items[i].id });
			}
			console.log(this.stores);
			// { name: 'New York', code: 'NY' },
		},
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
