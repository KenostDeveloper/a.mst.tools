<template>
    <h1 class="h1-mini">{{ store.name }}</h1>
    <Toast />
    <TabView class="tab-custom">
       <TabPanel header="Сопоставление товаров">
        <h1 class="h1-mini">Сопоставление товаров</h1>
        <div class="copo">
           <!-- <div class="dart-back-link">
             <router-link :to="{ name: 'organizations' }">
               <mdicon name="arrow-left" />
               <span>Назад к товарам</span>
             </router-link>
           </div> -->
           <p class="info-text mb-3">Для работы вам необходимо достигнуть и поддерживать уровень сопоставления товаров по стоимости не менее 80%.</p>
           <div class="analitics-widget">
             <div class="organization" >
               <div class="dart-row">
                 <div class="d-col-md-6" v-if="prods.all">
                   <div class="panel-widget panel-widget-remains">
                       <div class="panel-widget-remains__graph">
                         <Chart type="doughnut" :data="chartDataMoney" :options="chartOptions" class="w-full md:w-5rem graph-main" />
                         <span class="count">{{ $filters.round(prods.copo_money_percent) }}%</span>
                         <span>сопоставленных<br/> товаров по стоимости</span>
                       </div>
                       <div class="panel-widget-remains__stat">
                         <div class="panel-widget-remains__stat-item">
                           <div class="data">
                             <span>Товаров на сумму</span>
                             <span>{{ prods.summ }}</span>
                           </div>
                           <div class="line">
                             <span style="width: 100%;"></span>
                           </div>
                         </div>
                         <div class="panel-widget-remains__stat-item">
                           <div class="data">
                             <span>Товаров сопоставлено на сумму</span>
                             <span>{{ prods.summ_copo }}</span>
                           </div>
                           <div class="line">
                             <span :style="'width: ' + prods.copo_money_percent + '%;'"></span>
                           </div>
                         </div>
                       </div>
                       <div class="products_href">
                         <router-link :to="{ name: 'report_copo_store', params: { id: $route.params.id, store_id: $route.params.store_id } }">
                           Отчет по сопоставлению
                           <mdicon name="arrow-right" />
                         </router-link>
                       </div>
                   </div>
                 </div>
                 <div class="d-col-md-6" v-if="prods.all">
                   <div class="panel-widget panel-widget-remains">
                     <div class="panel-widget-remains__graph">
                       <Chart type="doughnut" :data="chartData" :options="chartOptions" class="w-full md:w-5rem graph-main" />
                       <span class="count">{{ $filters.round(prods.copo_percent) }}%</span>
                       <span>сопоставленных<br/> товаров</span>
                     </div>
                     <div class="panel-widget-remains__stat">
                       <div class="panel-widget-remains__stat-item">
                         <div class="data">
                           <span>Товаров всего</span>
                           <span>{{ prods.all }}</span>
                         </div>
                         <div class="line">
                           <span style="width: 100%;"></span>
                         </div>
                       </div>
                       <div class="panel-widget-remains__stat-item">
                         <div class="data">
                           <span>Товаров сопоставлено</span>
                           <span>{{ prods.copo }}</span>
                         </div>
                         <div class="line">
                           <span :style="'width: ' + prods.copo_percent + '%;'"></span>
                         </div>
                       </div>
                     </div>
                     <div class="products_href">
                         <router-link :to="{ name: 'report_copo_store', params: { id: $route.params.id, store_id: $route.params.store_id } }">
                           Отчет по сопоставлению
                           <mdicon name="arrow-right" />
                         </router-link>
                       </div>
                   </div>
                 </div>

                 <div class="d-col-xxl-3 d-col-lg-6" v-if="products.status">
                   <div class="dart-helper dart-helper-1">
                     <div class="dart-helper__nav">
                       <div class="dart-helper__left">
                         <p>Укажите цену</p>
                         <span>{{ (products.status[5]?.count)?.toLocaleString('ru') }}</span>
                       </div>
                       <div class="dart-helper__right">
                       </div>
                     </div>
                     <div class="dart-helper__body">
                       <Chart type="doughnut" :data="chartDataHelpOne" :options="chartOptions" class="w-full md:w-5rem dart-helper__graph" />
                       <div class="dart-helper__info">
                         <b>{{(this.products.status[5]?.count / (this.products.status.total / 100)).toFixed(2)}} %</b>
                         <p>от общего сопоставления</p>
                       </div>
                     </div>
                     <div class="dart-helper-footer" v-bind:class="{ show: helpers[0][0] }">
                       <div class="dart-helper-footer__text">
                         <p>Укажите цену в карточке</p>
                       </div>
                       <div class="dart-helper-footer__icon">
                         <i class="d_icon d_icon-arrow" @click="helpers[0][0] = !helpers[0][0]"></i>
                       </div>
                     </div>
                   </div>
                 </div>
                 <div class="d-col-xxl-3 d-col-lg-6" v-if="products.status">
                   <div class="dart-helper dart-helper-2">
                     <div class="dart-helper__nav">
                       <div class="dart-helper__left">
                         <p>Нет бренда</p>
                         <span>{{ (products.status[1]?.count)?.toLocaleString('ru') }}</span>
                       </div>
                       <div class="dart-helper__right">
                         <p>На сумму</p>
                         <span>{{ Number((products.status[1]?.sum))?.toLocaleString('ru') }} ₽</span>
                       </div>
                     </div>
                     <div class="dart-helper__body">
                       <Chart type="doughnut" :data="chartDataHelpTwo" :options="chartOptions" class="w-full md:w-5rem dart-helper__graph" />
                       <div class="dart-helper__info">
                         <b>{{(this.products.status[1]?.count / (this.products.status.total / 100)).toFixed(2)}} %</b>
                         <p>от общего сопоставления</p>
                       </div>
                     </div>
                     <div class="dart-helper-footer" v-bind:class="{ show: helpers[0][1] }">
                       <div class="dart-helper-footer__text">
                         <p>Укажите бренд в карточке</p>
                       </div>
                       <div class="dart-helper-footer__icon">
                         <i class="d_icon d_icon-arrow" @click="helpers[0][1] = !helpers[0][1]"></i>
                       </div>
                     </div>
                   </div>
                 </div>
                 <div class="d-col-xxl-3 d-col-lg-6" v-if="products.status">
                   <div class="dart-helper dart-helper-3">
                     <div class="dart-helper__nav">
                       <div class="dart-helper__left">
                         <p>Нет артикула</p>
                         <span>{{ (products.status[2]?.count)?.toLocaleString('ru') }}</span>
                       </div>
                       <div class="dart-helper__right">
                         <p>На сумму</p>
                         <span>{{ Number((products.status[2]?.sum))?.toLocaleString('ru') }} ₽</span>
                       </div>
                     </div>
                     <div class="dart-helper__body">
                       <Chart type="doughnut" :data="chartDataHelpThee" :options="chartOptions" class="w-full md:w-5rem dart-helper__graph" />
                       <div class="dart-helper__info">
                         <b>{{(this.products.status[2]?.count / (this.products.status.total / 100)).toFixed(2)}} %</b>
                         <p>от общего сопоставления</p>
                       </div>
                     </div>
                     <div class="dart-helper-footer" v-bind:class="{ show: helpers[0][2] }">
                       <div class="dart-helper-footer__text">
                         <p>Укажите артикул в карточке</p>
                       </div>
                       <div class="dart-helper-footer__icon">
                         <i class="d_icon d_icon-arrow" @click="helpers[0][2] = !helpers[0][2]"></i>
                       </div>
                     </div>
                   </div>
                 </div>
                 <div class="d-col-xxl-3 d-col-lg-6" v-if="products.status">
                   <div class="dart-helper dart-helper-4">
                     <div class="dart-helper__nav">
                       <div class="dart-helper__left">
                         <p>Нет карточки</p>
                         <span>{{ (products.status[4]?.count)?.toLocaleString('ru') }}</span>
                       </div>
                       <div class="dart-helper__right">
                         <p>На сумму</p>
                         <span>{{ Number((products.status[4]?.sum))?.toLocaleString('ru') }} ₽</span>
                       </div>
                     </div>
                     <div class="dart-helper__body">
                       <Chart type="doughnut" :data="chartDataHelpFour" :options="chartOptions" class="w-full md:w-5rem dart-helper__graph" />
                       <div class="dart-helper__info">
                         <b>{{(this.products.status[4]?.count / (this.products.status.total / 100)).toFixed(2)}} %</b>
                         <p>от общего сопоставления</p>
                       </div>
                     </div>
                     <div class="dart-helper-footer" v-bind:class="{ show: helpers[0][3] }">
                       <div class="dart-helper-footer__text">
                         <p>Проверьте правильность вашего артикула в нашем каталоге карточек</p>
                         <p>Запросите добавление карточек бренда</p>
                         <p>Запросите добавление карточки товара</p>
                       </div>
                       <div class="dart-helper-footer__icon">
                         <i class="d_icon d_icon-arrow" @click="helpers[0][3] = !helpers[0][3]"></i>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           </div>
           <div class="products">
                <TabView class="tab-custom">
                    <TabPanel header="По брендам">
                        <v-table
                        :items_data="report_copo.items"
                        :total="report_copo.total"
                        :pagination_items_per_page="this.pagination_items_per_page"
                        :pagination_offset="this.pagination_offset"
                        :page="this.page_brand"
                        :table_data="this.table_data_brand"
                        :filters="this.filtersbrand"
                        @filter="filterbrand"
                        @sort="filterbrand"
                        @paginate="paginatebrand"
                        >
                        </v-table>
                    </TabPanel>
                    <TabPanel header="По товарам">
                        <v-table
                            :items_data="products.products"
                            :total="products.total"
                            :pagination_items_per_page="this.pagination_items_per_page"
                            :pagination_offset="this.pagination_offset"
                            :page="this.page"
                            :table_data="this.table_data"
                            :filters="this.filters"
                            title="Сопоставление по товарам"
                            @filter="filter"
                            @sort="filter"
                            @paginate="paginate"
                        >
                            <template v-slot:button>
                            <button class="dart-btn dart-btn-primary" @click="modalToggle"><i class="d_icon d_icon-search"></i> Поиск по каталогу</button>
                            </template>
                        </v-table>
                    </TabPanel>
                </TabView>
           </div>
           <div class="search-for-catalog" v-bind:class="{ active: isModal }" @click="modalToggle">
               <div class="search-for-catalog__content" @click.stop="">
                   <div class="search-for-catalog__title">
                     <h2>Поиск по каталогу карточек</h2>
                     <i @click="modalToggle" class="d_icon d_icon-close"></i>
                   </div>
                   <div class="search-for-catalog__table">
                     <v-table
                       :items_data="msproducts.items"
                       :total="msproducts.total"
                       :pagination_items_per_page="this.pagination_items_per_page"
                       :pagination_offset="this.pagination_offset"
                       :page="this.page_modal"
                       :table_data="this.table_modal"
                       :filters="this.filters_modal"
                       title=""
                       @filter="filterModal"
                       @sort="filterModal"
                       @paginate="paginateModal"
                     >
                       <template v-slot:widgets>
                         <a class="search-for-catalog__get" @click="modalToggleBrand">Запросить добавление бренда</a>
                       </template>
                     </v-table>
                   </div>
               </div>
           </div>
           <div class="add-brand" v-bind:class="{ active: isModalBrand }" @click="modalToggleBrand">
               <div class="add-brand__content" @click.stop="">
                   <div class="add-brand__title">
                     <h2>Запрос на добавление бренда</h2>
                     <i @click="modalToggleBrand" class="d_icon d_icon-close"></i>
                   </div>
                   <form class="add-brand__body">
                     <p class="info-text mb-3">Прежде чем оставлять запрос, проверьте, не оставлял ли кто-то такой запрос до вас.</p>
                     <div class="dart-row">
                       <div class="d-col-md-6">
                         <div class="add-brand__el">
                           <b>Название бренда</b>
                           <div class="form_input_group input_pl input-parent required mb-4">
                             <input type="text" id="filter_name" placeholder="Наименование, артикул" name="name" class="dart-form-control">
                             <label for="product_filter_name" class="s-complex-input__label">Введите название бренда</label>
                           </div>
                         </div>
                       </div>
                       <div class="d-col-md-6">
                         <div class="add-brand__el">
                           <b>Ссылка на сайт</b>
                           <div class="form_input_group input_pl input-parent required mb-4">
                             <input type="text" id="filter_name" placeholder="Наименование, артикул" name="name" class="dart-form-control">
                             <label for="product_filter_name" class="s-complex-input__label">Вставьте URL</label>
                           </div>
                         </div>
                       </div>
                     </div>
                     <b>Можете ли вы помочь связаться с брендом?</b>
                     <div class="flex flex-wrap gap-3 mt-2">
                         <div class="flex align-items-center">
                           <RadioButton inputId="ingredient1" name="brand_connection" value="1" />
                           <label for="ingredient1" class="ml-2">Да</label>
                         </div>
                         <div class="flex align-items-center">
                           <RadioButton inputId="ingredient2" name="brand_connection" value="0" />
                           <label for="ingredient2" class="ml-2">Нет</label>
                         </div>
                     </div>
                     <div class="add-brand__button">
                       <button class="dart-btn dart-btn-primary">Запросить</button>
                     </div>
                   </form>
               </div>
           </div>
        </div>
       </TabPanel>
       <TabPanel header="Настройки">
        <div class="widgets-block">
          <div class="dart-row">
            <div class="d-col-lg-12 d-col-md-12">
              <form action="#" class="panel-widget" @submit.prevent="formChangeSettings">
                <div class="dart-row">
                  <div class="d-col-md-6" v-for="(group, index) in org_store?.settings?.groups" :key="index">
                    <div class="dart-form-block">
                      <span class="title">{{ group.label }}</span>
                      <div class="dart-form-block__content">
                        <div class="dart-form-group" v-for="(setting) in group.settings" :key="setting.id">
                          <FloatLabel class="w-full md:w-14rem" v-if="setting.type == 1">
                            <InputText :id="setting.key" v-model="this.settingsForm[setting.key]" />
                            <label :for="setting.key">{{ setting.label }}</label>
                          </FloatLabel>
                          <FloatLabel class="w-full md:w-14rem" v-if="setting.type == 2">
                            <label :for="setting.key">{{ setting.label }}</label>
                            <Dropdown :id="setting.key" v-model="this.settingsForm[setting.key]" :options="this.typePrice" optionLabel="name" class="w-full" />
                          </FloatLabel>
                          <div class="flex align-items-center" v-if="setting.type == 3">
                            <Checkbox :id="setting.key" v-model="this.settingsForm[setting.key]" :inputId="setting.key" :name="setting.key" binary />
                            <label :for="setting.key" class="ml-2"> {{ setting.label }} </label>
                          </div>
                          <FloatLabel class="w-full md:w-14rem" v-if="setting.type == 4">
                            <InputNumber :id="setting.key" v-model="this.settingsForm[setting.key]" class="w-full" />
                            <label :for="setting.key">{{ setting.label }}</label>
                          </FloatLabel>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form_input_group">
                  <button class="dart-btn dart-btn-primary dart-mt-1" type="submit">Сохранить</button>
                </div>
              </form>
            </div>
            <div class="d-col-lg-6 d-col-md-6">
              <div class="operating-mode">
                  <div class="operating-mode__title"><p>Режим работы</p><i class="pi pi-pencil" @click="this.showOperatingModeModal = !this.showOperatingModeModal"></i></div>
                  <div class="operating-mode__container">
                    <div class="operating-mode__el" :class="{ 'off': !work.days[1].active }">
                      <p>Понедельник</p>
                      <p v-if="!work.days[1].active">Выходной</p>
                      <p v-else>{{ work.days[1].time_from }} - {{ work.days[1].time_to }} </p>
                    </div>
                    <div class="operating-mode__el" :class="{ 'off': !work.days[2].active }">
                      <p>Вторник</p>
                      <p v-if="!work.days[2].active">Выходной</p>
                      <p v-else>{{ work.days[2].time_from }} - {{ work.days[2].time_to }} </p>
                    </div>
                    <div class="operating-mode__el" :class="{ 'off': !work.days[3].active }">
                      <p>Среда</p>
                      <p v-if="!work.days[3].active">Выходной</p>
                      <p v-else>{{ work.days[3].time_from }} - {{ work.days[3].time_to }} </p>
                    </div>
                    <div class="operating-mode__el" :class="{ 'off': !work.days[4].active }">
                      <p>Четверг</p>
                      <p v-if="!work.days[4].active">Выходной</p>
                      <p v-else>{{ work.days[4].time_from }} - {{ work.days[4].time_to }} </p>
                    </div>
                    <div class="operating-mode__el" :class="{ 'off': !work.days[5].active }">
                      <p>Пятница</p>
                      <p v-if="!work.days[5].active">Выходной</p>
                      <p v-else>{{ work.days[5].time_from }} - {{ work.days[5].time_to }} </p>
                    </div>
                    <div class="operating-mode__el" :class="{ 'off': !work.days[6].active }">
                      <p>Суббота</p>
                      <p v-if="!work.days[6].active">Выходной</p>
                      <p v-else>{{ work.days[6].time_from }} - {{ work.days[6].time_to }} </p>
                    </div>
                    <div class="operating-mode__el" :class="{ 'off': !work.days[7].active }">
                      <p>Воскресенье</p>
                      <p v-if="!work.days[7].active">Выходной</p>
                      <p v-else>{{ work.days[7].time_from }} - {{ work.days[7].time_to }} </p>
                    </div>
                  </div>
              </div>
            </div>
            <div class="d-col-lg-6 d-col-md-6">
              <div class="operating-mode-calend">
                <div class="operating-mode-calend__title"><p>Выходные и короткие дни</p><i class="pi pi-pencil" @click="this.showOperatingModeCalendarModal = !this.showOperatingModeCalendarModal"></i></div>
                <Calendar
                is-expanded
                title-position="left"
                :attributes="work_dates"
                :masks="{ weekdays: 'WW' }"/>
              </div>
            </div>
            <custom-modal class="operating-mode-modal" v-model="showOperatingModeModal">
              <template v-slot:title>Режим работы</template>
              <form class="operating-mode-change" action="">
                  <div class="operating-mode-change__el">
                    <div class="flex align-items-center gap-1">
                      <Checkbox v-model="work.days[1].active" :binary="true" inputId="workday_1"/>
                      <label for="workday_1" class="ml-2">Понедельник</label>
                    </div>
                    <div class="operating-mode-change__values" v-if="work.days[1].active">
                      <div class="form_input_group input_pl input-parent required">
                        <primeCalendar id="calendar-timeonly" v-model="work.days[1].start" timeOnly :stepMinute="step_minute" :invalid="work.days[1].error_start"/>
                      </div>
                      <div class="operating-mode-change__line"></div>
                      <div class="form_input_group input_pl input-parent required">
                        <primeCalendar id="calendar-timeonly" v-model="work.days[1].end" timeOnly :stepMinute="step_minute" :invalid="work.days[1].error_end"/>
                      </div>
                    </div>
                    <div class="operating-mode-change__values off" v-else>
                      <p>Выходной</p>
                    </div>
                  </div>
                  <div class="operating-mode-change__el">
                    <div class="flex align-items-center gap-1">
                      <Checkbox v-model="work.days[2].active" :binary="true" inputId="workday_2"/>
                      <label for="workday_2" class="ml-2">Вторник</label>
                    </div>
                    <div class="operating-mode-change__values" v-if="work.days[2].active">
                      <div class="form_input_group input_pl input-parent required">
                        <primeCalendar id="calendar-timeonly" v-model="work.days[2].start" timeOnly :stepMinute="step_minute" :invalid="work.days[2].error_start"/>
                      </div>
                      <div class="operating-mode-change__line"></div>
                      <div class="form_input_group input_pl input-parent required">
                        <primeCalendar id="calendar-timeonly" v-model="work.days[2].end" timeOnly :stepMinute="step_minute" :invalid="work.days[2].error_end"/>
                      </div>
                    </div>
                    <div class="operating-mode-change__values off" v-else>
                      <p>Выходной</p>
                    </div>
                  </div>
                  <div class="operating-mode-change__el">
                    <div class="flex align-items-center gap-1">
                      <Checkbox v-model="work.days[3].active" :binary="true" inputId="workday_3"/>
                      <label for="workday_3" class="ml-2">Среда</label>
                    </div>
                    <div class="operating-mode-change__values" v-if="work.days[3].active">
                      <div class="form_input_group input_pl input-parent required">
                        <primeCalendar id="calendar-timeonly" v-model="work.days[3].start" timeOnly :stepMinute="step_minute" :invalid="work.days[3].error_start"/>
                      </div>
                      <div class="operating-mode-change__line"></div>
                      <div class="form_input_group input_pl input-parent required">
                        <primeCalendar id="calendar-timeonly" v-model="work.days[3].end" timeOnly :stepMinute="step_minute" :invalid="work.days[3].error_end"/>
                      </div>
                    </div>
                    <div class="operating-mode-change__values off" v-else>
                      <p>Выходной</p>
                    </div>
                  </div>
                  <div class="operating-mode-change__el">
                    <div class="flex align-items-center gap-1">
                      <Checkbox v-model="work.days[4].active" :binary="true" inputId="workday_4"/>
                      <label for="workday_4" class="ml-2">Четверг</label>
                    </div>
                    <div class="operating-mode-change__values" v-if="work.days[4].active">
                      <div class="form_input_group input_pl input-parent required">
                        <primeCalendar id="calendar-timeonly" v-model="work.days[4].start" timeOnly :stepMinute="step_minute" :invalid="work.days[4].error_start"/>
                      </div>
                      <div class="operating-mode-change__line"></div>
                      <div class="form_input_group input_pl input-parent required">
                        <primeCalendar id="calendar-timeonly" v-model="work.days[4].end" timeOnly :stepMinute="step_minute" :invalid="work.days[4].error_end"/>
                      </div>
                    </div>
                    <div class="operating-mode-change__values off" v-else>
                      <p>Выходной</p>
                    </div>
                  </div>
                  <div class="operating-mode-change__el">
                    <div class="flex align-items-center gap-1">
                      <Checkbox v-model="work.days[5].active" :binary="true" inputId="workday_5"/>
                      <label for="workday_5" class="ml-2">Пятница</label>
                    </div>
                    <div class="operating-mode-change__values" v-if="work.days[5].active">
                      <div class="form_input_group input_pl input-parent required">
                        <primeCalendar id="calendar-timeonly" v-model="work.days[5].start" timeOnly :stepMinute="step_minute" :invalid="work.days[5].error_start"/>
                      </div>
                      <div class="operating-mode-change__line"></div>
                      <div class="form_input_group input_pl input-parent required">
                        <primeCalendar id="calendar-timeonly" v-model="work.days[5].end" timeOnly :stepMinute="step_minute" :invalid="work.days[5].error_end"/>
                      </div>
                    </div>
                    <div class="operating-mode-change__values off" v-else>
                      <p>Выходной</p>
                  </div>
                  </div>
                  <div class="operating-mode-change__el">
                    <div class="flex align-items-center gap-1">
                      <Checkbox v-model="work.days[6].active" :binary="true" inputId="workday_6"/>
                      <label for="workday_6" class="ml-2">Суббота</label>
                    </div>
                    <div class="operating-mode-change__values" v-if="work.days[6].active">
                      <div class="form_input_group input_pl input-parent required">
                        <primeCalendar id="calendar-timeonly" v-model="work.days[6].start" timeOnly :stepMinute="step_minute" :invalid="work.days[6].error_start"/>
                      </div>
                      <div class="operating-mode-change__line"></div>
                      <div class="form_input_group input_pl input-parent required">
                        <primeCalendar id="calendar-timeonly" v-model="work.days[6].end" timeOnly :stepMinute="step_minute" :invalid="work.days[6].error_end"/>
                      </div>
                    </div>
                    <div class="operating-mode-change__values off" v-else>
                      <p>Выходной</p>
                  </div>
                  </div>
                  <div class="operating-mode-change__el">
                    <div class="flex align-items-center gap-1">
                      <Checkbox v-model="work.days[7].active" :binary="true" inputId="workday_7"/>
                      <label for="workday_7" class="ml-2">Воскресенье</label>
                    </div>
                    <div class="operating-mode-change__values" v-if="work.days[7].active">
                      <div class="form_input_group input_pl input-parent required">
                        <primeCalendar v-model="work.days[7].start" timeOnly :stepMinute="step_minute" :invalid="work.days[7].error_start"/>
                      </div>
                      <div class="operating-mode-change__line"></div>
                      <div class="form_input_group input_pl input-parent required">
                        <primeCalendar v-model="work.days[7].end" timeOnly :stepMinute="step_minute" :invalid="work.days[7].error_end"/>
                      </div>
                    </div>
                    <div class="operating-mode-change__values off" v-else>
                        <p>Выходной</p>
                    </div>
                  </div>
                  <div class="operating-mode-change__buttons">
                    <button class="dart-btn dart-btn-secondary alert_change_btn" type="button" @click.prevent="clearWorkForm"><span>Сбросить</span></button>
                    <button class="dart-btn dart-btn-primary" @click.prevent="addWorkForm" :class="{ 'dart-btn-loading': work_loading }">Сохранить</button>
                  </div>
              </form>
            </custom-modal>
            <custom-modal class="operating-mode-calend-modal" v-model="showOperatingModeCalendarModal" @close="resetForm()">
              <template v-slot:title>Выходные и короткие дни</template>
              <div>
                <DatePicker
                :attributes="work_dates"
                :masks="{ weekdays: 'WW' }"
                v-model="work_date"
                :timezone="work_dates_input.timezone"/>
                <div class="operating-mode-calend-modal__radio">
                  <div class="flex align-items-center gap-1">
                    <RadioButton v-model="work_dates_input.type" inputId="work_dates_type_1" value="weekend" />
                    <label for="work_dates_type_1" class="ml-2">Выходной</label>
                  </div>
                  <div class="flex align-items-center gap-1">
                    <RadioButton v-model="work_dates_input.type" inputId="work_dates_type_2" value="shortday" />
                    <label for="work_dates_type_2" class="ml-2">Короткий день</label>
                  </div>
                </div>
                <div class="operating-mode-calend-modal__values" v-if="work_dates_input.type == 'shortday'">
                  <div class="form_input_group input_pl input-parent required">
                    <primeCalendar v-model="work_dates_input.start" timeOnly :stepMinute="step_minute" :invalid="work_dates_input.start_error"/>
                  </div>
                  <div class="operating-mode-calend-modal__line"></div>
                  <div class="form_input_group input_pl input-parent required">
                    <primeCalendar v-model="work_dates_input.end" timeOnly :stepMinute="step_minute" :invalid="work_dates_input.end_error"/>
                  </div>
                </div>
                <div class="operating-mode-calend-modal__buttons">
                  <button class="dart-btn dart-btn-secondary alert_change_btn" type="button" @click.prevent="deleteWorkDay" v-if="work_dates_input.delete"><span>Удалить</span></button>
                  <button class="dart-btn dart-btn-primary" @click.prevent="addWorkDay" :class="{ 'dart-btn-loading': work_calendar_loading }">Сохранить</button>
                </div>
              </div>
            </custom-modal>
          </div>
        </div>
      </TabPanel>
   </TabView>
</template>

<script>
import { toRaw } from 'vue'
import { mapActions, mapGetters } from 'vuex'
import vTable from '../components/table/v-table.vue'
import Chart from 'primevue/chart'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import RadioButton from 'primevue/radiobutton'
import router from '../router'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Checkbox from 'primevue/checkbox'
import { Calendar, DatePicker } from 'v-calendar'
import Toast from 'primevue/toast'
import primeCalendar from 'primevue/calendar'
import 'v-calendar/dist/style.css'
import customModal from '../components/CustomModal.vue'

export default {
  name: 'ProfileStoreProducts',
  props: {
    pagination_items_per_page: {
      type: Number,
      default: 25
    },
    pagination_offset: {
      type: Number,
      default: 0
    },
    org: {
      type: Array,
      default: () => {
        return []
      }
    },
    step_minute: {
      type: Number,
      default: 15
    }
  },
  data () {
    return {
      showOperatingModeModal: false,
      showOperatingModeCalendarModal: false,
      work_loading: false,
      work_calendar_loading: false,
      work_date: new Date(),
      work_dates_input: {
        id: '',
        type: 'shortday',
        start: '',
        end: '',
        delete: false,
        date: new Date(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      work_dates: [{
        dot: 'red',
        dates: []
      },
      {
        dot: 'blue',
        dates: []
      }],
      work: {
        days: {
          1: {
            active: 0,
            start: '',
            end: '',
            weekend: 1,
            error_start: false,
            error_end: false
          },
          2: {
            active: 0,
            start: '',
            end: '',
            weekend: 1,
            error_start: false,
            error_end: false
          },
          3: {
            active: 0,
            start: '',
            end: '',
            weekend: 1,
            error_start: false,
            error_end: false
          },
          4: {
            active: 0,
            start: '',
            end: '',
            weekend: 1,
            error_start: false,
            error_end: false
          },
          5: {
            active: 0,
            start: '',
            end: '',
            weekend: 1,
            error_start: false,
            error_end: false
          },
          6: {
            active: 0,
            start: '',
            end: '',
            weekend: 1,
            error_start: false,
            error_end: false
          },
          7: {
            active: 0,
            start: '',
            end: '',
            weekend: 1,
            error_start: false,
            error_end: false
          }
        }
      },
      workdays_source: [],
      chartData: null,
      chartDataMoney: null,
      chartDataHelpOne: null,
      chartDataHelpTwo: null,
      chartDataHelpThee: null,
      chartDataHelpFour: null,
      typePrice: [],
      settingsForm: { },
      isModal: false,
      isModalBrand: false,
      chartOptions: {
        cutout: '60%'
      },
      helpers: [{
        0: false,
        1: false,
        2: false,
        3: false
      }],
      store: [],
      prods: {
        copo_percent: 0,
        all: 0,
        copo: 0,
        count_all: 0,
        summ: 0
      },
      orders: {
        summ: 0,
        count: 0
      },
      dilers: {
        summ: 0,
        count: 0
      },
      distr: {
        summ: 0,
        count: 0
      },
      shipment: {
        total: 0,
        items: []
      },
      page: 1,
      page_brand: 1,
      page_modal: 1,
      filters: {
        name: {
          name: 'Наименование, артикул',
          placeholder: 'Наименование, артикул',
          type: 'text'
        },
        status: {
          name: 'Статус',
          placeholder: 'Статус',
          type: 'dropdown',
          values: this.getcardstatus
        }
      },
      filters_modal: {
        name: {
          name: 'Наименование, артикул',
          placeholder: 'Наименование, артикул',
          type: 'text'
        },
        vendor: {
          name: 'Выберите бренд',
          placeholder: 'Выберите бренд',
          type: 'dropdown',
          values: this.getvendors
        },
        parent_name: {
          name: 'Выберите категорию',
          placeholder: 'Выберите категорию',
          type: 'tree',
          values: this.getcatalog
        }
      },
      filtersbrand: {
        name: {
          name: 'Наименование товара, артикул',
          placeholder: 'Наименование товара, артикул',
          type: 'text'
        },
        instock: {
          name: 'В наличии',
          placeholder: 'В наличии',
          type: 'checkbox',
          values: 1
        }
      },
      table_data_brand: {
        name: {
          label: 'Наименование',
          type: 'link',
          link_to: 'report_copo_details_store',
          link_params: {
            id: this.$route.params.id,
            store_id: this.$route.params.store_id,
            brand_id: 'vendor_id'
          },
          sort: true
        },
        find: {
          label: 'Найдено',
          type: 'text',
          sort: true
        },
        identified: {
          label: 'Сопоставлено',
          type: 'text',
          sort: true
        },
        cards: {
          label: 'Карточек создано',
          type: 'text',
          sort: true
        },
        percent_identified: {
          label: '% сопоставления',
          type: 'text',
          sort: true
        },
        vendor_price: {
          label: 'Сумма товара, ₽',
          type: 'text',
          sort: true
        }
      },
      table_modal: {
        vendor_name: {
          label: 'Бренд',
          type: 'text',
          sort: true
        },
        image: {
          label: 'Фото',
          type: 'image'
        },
        vendor_article: {
          label: 'Артикул',
          type: 'text',
          sort: true
        },
        pagetitle: {
          label: 'Наименование',
          type: 'text',
          sort: true
        },
        parent_name: {
          label: 'Категория',
          type: 'text',
          sort: true
        }
      },
      table_data: {
        image: {
          label: 'Фото',
          type: 'image'
        },
        article: {
          label: 'Артикул',
          type: 'text',
          sort: true
        },
        name: {
          label: 'Наименование',
          type: 'link',
          link_to: 'org_product',
          link_params: {
            id: this.$route.params.id,
            store_id: this.$route.params.store_id,
            product_id: 'id'
          },
          description: {
            type: 'field',
            key: 'catalog'
          },
          sort: true
        },
        price: {
          label: 'Розничная цена',
          type: 'text',
          sort: true
        },
        remains: {
          label: 'Фактическое наличие',
          type: 'text',
          sort: true
        },
        reserved: {
          label: 'Резерв',
          type: 'text',
          sort: true
        },
        available: {
          label: 'Доступно для продажи',
          type: 'text',
          sort: true
        },
        sales: {
          label: 'Продаж за все время',
          type: 'text',
          sort: true
        },
        /*
         price_rrc: {
           label: 'Цена, РРЦ',
           type: 'text',
           sort: true
         },
         price_rrc_delta: {
           label: 'РРЦ дельта',
           type: 'text',
           sort: true
         },
         */
        summ: {
          label: 'Сумма товара, ₽',
          type: 'text',
          sort: true
        }
      }
    }
  },
  methods: {
    ...mapActions([
      'get_data_from_api',
      'get_org_store_from_api',
      'get_report_copo_from_api',
      'get_cardstatus_from_api',
      'get_vendors_from_api',
      'get_msproducts_from_api',
      'get_catalog_from_api',
      'opt_get_prices',
      'set_organization_settings',
      'set_work_to_api',
      'delete_work_from_api'
    ]),
    setChartData () {
      return {
        datasets: [
          {
            data: [this.store?.products?.copo_percent, this.store?.products?.no_copo_percent],
            backgroundColor: ['#008FFF', '#EEEEEE'],
            hoverBackgroundColor: ['#008FFF', '#EEEEEE']
          }
        ]
      }
    },
    setChartDataMoney () {
      return {
        datasets: [
          {
            data: [this.store?.products?.copo_money_percent, this.store?.products?.no_copo_money_percent],
            backgroundColor: ['#008FFF', '#EEEEEE'],
            hoverBackgroundColor: ['#008FFF', '#EEEEEE']
          }
        ]
      }
    },
    setChartDataHelpOne () {
      return {
        datasets: [
          {
            data: this.products?.status ? [(this.products?.status[5]?.count / (this.products.status.total / 100)).toFixed(2), 100 - (this.products?.status[5]?.count / (this.products.status.total / 100)).toFixed(2)] : [0, 0],
            backgroundColor: ['#008FFF', '#EEEEEE'],
            hoverBackgroundColor: ['#008FFF', '#EEEEEE']
          }
        ]
      }
    },
    setChartDataHelpTwo () {
      return {
        datasets: [
          {
            data: this.products?.status ? [(this.products?.status[1]?.count / (this.products.status.total / 100)).toFixed(2), 100 - (this.products?.status[1]?.count / (this.products.status.total / 100)).toFixed(2)] : [0, 0],
            backgroundColor: ['#F363E6', '#EEEEEE'],
            hoverBackgroundColor: ['#F363E6', '#EEEEEE']
          }
        ]
      }
    },
    setChartDataHelpTree () {
      return {
        datasets: [
          {
            data: this.products?.status ? [(this.products?.status[2]?.count / (this.products.status.total / 100)).toFixed(2), 100 - (this.products?.status[2]?.count / (this.products.status.total / 100)).toFixed(2)] : [0, 0],
            backgroundColor: ['#FF6221', '#EEEEEE'],
            hoverBackgroundColor: ['#FF6221', '#EEEEEE']
          }
        ]
      }
    },
    setChartDataHelpFour () {
      return {
        datasets: [
          {
            data: this.products?.status ? [(this.products?.status[4]?.count / (this.products.status.total / 100)).toFixed(2), 100 - (this.products?.status[4]?.count / (this.products.status.total / 100)).toFixed(2)] : [0, 0],
            backgroundColor: ['#FFD02C', '#EEEEEE'],
            hoverBackgroundColor: ['#FFD02C', '#EEEEEE']
          }
        ]
      }
    },
    formChangeSettings () {
      this.loading = true
      this.$load(async () => {
        await this.set_organization_settings({
          action: 'set',
          type: 'organization',
          id: router.currentRoute._value.params.store_id,
          settings: this.settingsForm
        })
          .then((result) => {
            this.loading = false
            this.$toast.add({ severity: 'info', summary: 'Данные изменены', detail: 'Данные были успешно изменены', life: 3000 })
            this.get_org_store_from_api()
          })
          .catch((result) => {
            console.log(result)
          })
      })
    },
    modalToggle () {
      this.isModal = !this.isModal
      if (this.isModal) {
        this.globalIsModal.push('-_-')
        document.body.style.overflow = 'hidden'
      } else if (!this.isModal && this.globalIsModal.length === 1) {
        this.globalIsModal.pop()
        document.body.style.overflow = 'auto'
      } else {
        this.globalIsModal.pop()
      }
    },
    modalToggleBrand () {
      this.isModalBrand = !this.isModalBrand
      if (this.isModalBrand) {
        this.globalIsModal.push('-_-')
        document.body.style.overflow = 'hidden'
      } else if (!this.isModalBrand && this.globalIsModal.length === 1) {
        this.globalIsModal.pop()
        document.body.style.overflow = 'auto'
      } else {
        this.globalIsModal.pop()
      }
    },
    filter (data) {
      this.products.total = -1
      this.get_data_from_api(data)
    },
    filterModal (data) {
      this.msproducts.total = -1
      this.get_msproducts_from_api(data)
    },
    filterbrand (data) {
      this.report_copo.total = -1
      this.get_report_copo_from_api(data)
    },
    paginateModal (data) {
      this.msproducts.total = -1
      this.page_modal = data.page
      this.get_msproducts_from_api(data)
    },
    paginate (data) {
      this.products.total = -1
      this.page = data.page
      this.get_data_from_api(data)
    },
    paginatebrand (data) {
      this.report_copo.total = -1
      this.page_brand = data.page
      this.get_report_copo_from_api(data)
    },
    // чекнули дату, проверяем занята ли она
    checkDate (date) {
      // console.log(date)
      const source = toRaw(this.workdays_source)
      const dater = new Date(date)
      const month = Number(dater.getMonth()) + 1
      const searchDate = dater.getFullYear() + '-' + (month < 10 ? '0' : '') + month + '-' + (dater.getDate() < 10 ? '0' : '') + dater.getDate()
      // console.log(searchDate)
      source.forEach((element) => {
        if (element.date === searchDate) {
          // console.log(element)
          this.work_dates_input.delete = true
          const weekend = Number(element.weekend)
          this.work_dates_input.id = element.id
          if (weekend === 1) {
            this.work_dates_input.type = 'weekend'
          } else {
            this.work_dates_input.type = 'shortday'
            this.work_dates_input.start = new Date(element.timestamp_from * 1000)
            this.work_dates_input.end = new Date(element.timestamp_to * 1000)
          }
        }
      })
    },
    // обновление формы
    resetForm () {
      this.work_dates_input = {
        id: '',
        type: 'shortday',
        start: '',
        end: '',
        delete: false,
        date: new Date(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    },
    // добавляем дату в листинг
    addWorkDay () {
      let error = false
      this.work_calendar_loading = true
      if (this.work_dates_input.type === 'shortday') {
        if (!this.work_dates_input.start) {
          this.work_dates_input.start_error = true
          error = true
        }
        if (!this.work_dates_input.end) {
          this.work_dates_input.end_error = true
          error = true
        }
      }
      if (!error) {
        const data = toRaw(this.work_dates_input)
        const date = new Date(data.date)
        const dateFrom = new Date(data.start)
        const dateTo = new Date(data.end)
        data.date_record = Math.round(date.getTime() / 1000)
        date.setUTCHours(0, 0, 0, 0)
        data.condition_date_from = Math.round(date.getTime() / 1000)
        date.setUTCHours(23, 59, 59, 999)
        data.condition_date_to = Math.round(date.getTime() / 1000)
        data.time_start = Math.round(dateFrom.getTime() / 1000)
        data.time_end = Math.round(dateTo.getTime() / 1000)
        data.time_from = (dateFrom.getHours() < 10 ? '0' : '') + dateFrom.getHours() + ':' + (dateFrom.getMinutes() < 10 ? '0' : '') + dateFrom.getMinutes()
        data.time_to = (dateTo.getHours() < 10 ? '0' : '') + dateTo.getHours() + ':' + (dateTo.getMinutes() < 10 ? '0' : '') + dateTo.getMinutes()
        console.log(data)
        this.$load(async () => {
          await this.set_work_to_api({
            action: 'set',
            type: 'work_week_date',
            id: router.currentRoute._value.params.store_id,
            data: data
          })
            .then((result) => {
              this.work_calendar_loading = false
              this.showOperatingModeCalendarModal = false
              this.get_org_store_from_api().then(() => {
                this.$toast.add({ severity: 'info', summary: 'Время работы скорректировано', detail: 'Время работы организации успешно скорректировано. Проверьте корректность.', life: 3000 })
              })
            })
            .catch((result) => {
              console.log(result)
            })
        })
      } else {
        this.work_calendar_loading = false
      }
    },
    // удаляем дату из листинга
    deleteWorkDay () {
      if (this.work_dates_input.id) {
        this.showOperatingModeCalendarModal = false
        this.$load(async () => {
          await this.delete_work_from_api({
            action: 'delete',
            type: 'work_week_date',
            id: router.currentRoute._value.params.store_id,
            object_id: this.work_dates_input.id
          })
            .then((result) => {
              this.get_org_store_from_api().then(() => {
                this.$toast.add({ severity: 'info', summary: 'День сброшен', detail: 'Теперь Вы можете указать другой график работы', life: 3000 })
              })
            })
            .catch((result) => {
              console.log(result)
            })
        })
      }
    },
    clearWorkForm () {
      for (let i = 1; i <= Object.keys(this.work.days).length; i++) {
        this.work.days[i].active = false
      }
    },
    addWorkForm () {
      let error = false
      this.work_loading = true
      for (let i = 1; i <= Object.keys(this.work.days).length; i++) {
        const dateFrom = new Date(this.work.days[i].start)
        const dateTo = new Date(this.work.days[i].end)
        this.work.days[i].time_start = Math.round(dateFrom.getTime() / 1000)
        this.work.days[i].time_end = Math.round(dateTo.getTime() / 1000)
        if ((!this.work.days[i].weekend && this.work.days[i].start && this.work.days[i].end && (!this.work.days[i].weekend && this.work.days[i].time_start < this.work.days[i].time_end)) || this.work.days[i].weekend) {
          this.work.days[i].time_from = (dateFrom.getHours() < 10 ? '0' : '') + dateFrom.getHours() + ':' + (dateFrom.getMinutes() < 10 ? '0' : '') + dateFrom.getMinutes()
          this.work.days[i].time_to = (dateTo.getHours() < 10 ? '0' : '') + dateTo.getHours() + ':' + (dateTo.getMinutes() < 10 ? '0' : '') + dateTo.getMinutes()
          this.work.days[i].timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
        } else {
          this.work.days[i].error_start = true
          this.work.days[i].error_end = true
          error = true
        }
      }
      if (!error) {
        const dates = toRaw(this.work.days)
        this.$load(async () => {
          await this.set_work_to_api({
            action: 'set',
            type: 'work_week',
            id: router.currentRoute._value.params.store_id,
            dates: dates
          })
            .then((result) => {
              this.work_loading = false
              this.showOperatingModeModal = false
              this.$toast.add({ severity: 'info', summary: 'Время работы скорректировано', detail: 'Время работы организации успешно скорректировано. Проверьте корректность.', life: 3000 })
            })
            .catch((result) => {
              console.log(result)
            })
        })
      } else {
        this.work_loading = false
      }
    }
  },
  mounted () {
    this.get_data_from_api({
      page: this.page,
      page_brand: this.page_brand,
      perpage: this.pagination_items_per_page
    })
    this.get_report_copo_from_api({
      tabledata: this.table_data,
      page: this.page,
      perpage: this.pagination_items_per_page
    })
    this.get_org_store_from_api().then(() => {
      this.chartDataHelpOne = this.setChartDataHelpOne()
      this.chartDataHelpTwo = this.setChartDataHelpTwo()
      this.chartDataHelpThee = this.setChartDataHelpTree()
      this.chartDataHelpFour = this.setChartDataHelpFour()
      // orders.summ && orders.count
      // this.dilers.summ = this.org_store.dilers.summ
      // this.dilers.count = this.org_store.dilers.count
      // this.distr.summ = this.org_store.distr.summ
      // this.distr.count = this.org_store.distr.count
      // this.shipment.total = this.org_store.shipment.total
      // this.shipment.items = this.org_store.shipment.items
      this.get_cardstatus_from_api()
      this.get_vendors_from_api()
      this.get_catalog_from_api()
      this.get_msproducts_from_api({
        tabledata: this.table_modal,
        page: this.page_modal,
        perpage: this.pagination_items_per_page
      })
      this.opt_get_prices({
        action: 'get/type/prices',
        store_id: router.currentRoute._value.params.store_id
      })
    })
  },
  components: {
    vTable,
    Chart,
    TabView,
    TabPanel,
    RadioButton,
    Dropdown,
    InputText,
    InputNumber,
    Checkbox,
    customModal,
    primeCalendar,
    Calendar,
    DatePicker,
    Toast
  },
  computed: {
    ...mapGetters([
      'products',
      'org_store',
      'report_copo',
      'getcardstatus',
      'getvendors',
      'msproducts',
      'getcatalog',
      'oprprices'
    ]),
    date () {
      const today = new Date()
      return today.getDate()
    },
    month () {
      const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
      ]
      const today = new Date()
      return monthNames[today.getMonth()]
    },
    day () {
      const dayNames = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']
      const today = new Date()
      return dayNames[today.getDay()]
    }
  },
  watch: {
    work_date (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.work_dates_input.date = newVal
        this.checkDate(newVal)
      }
    },
    org_store: function (newVal, oldVal) {
      this.store = newVal
      const num = this.store.products.copo_percent
      this.prods.copo_percent = num
      this.chartData = this.setChartData()
      this.chartDataMoney = this.setChartDataMoney()
      this.prods.all = this.org_store.products.count
      this.prods.copo = this.org_store.products.copo_count
      this.prods.count_all = this.org_store.products.count_all
      this.prods.summ = this.org_store.products.summ
      this.prods.copo_money_percent = this.org_store.products.copo_money_percent
      this.prods.no_copo_money_percent = this.org_store.products.no_copo_money_percent
      this.prods.summ_copo = this.org_store.products.summ_copo
      this.work_dates = newVal.workdays
      this.workdays_source = newVal.workdays_source
      for (let i = 0; i < Object.keys(newVal.worktime).length; i++) {
        const ji = i + 1
        const weekend = Number(newVal.worktime[i].weekend)
        if (weekend === 1) {
          this.work.days[ji].weekend = true
          this.work.days[ji].active = false
        } else {
          this.work.days[ji].weekend = false
          this.work.days[ji].active = true
          this.work.days[ji].time_from = newVal.worktime[i].time_from
          this.work.days[ji].time_to = newVal.worktime[i].time_to
          this.work.days[ji].start = new Date(newVal.worktime[i].timestamp_from * 1000)
          this.work.days[ji].end = new Date(newVal.worktime[i].timestamp_to * 1000)
        }
      }
      const settings = JSON.parse(JSON.stringify(newVal.settings))
      const groupKeys = Object.keys(settings.groups)
      for (let i = 0; i < groupKeys.length; i++) {
        const keys = Object.keys(settings.groups[groupKeys[i]].settings)
        for (let j = 0; j < keys.length; j++) {
          if (settings.groups[groupKeys[i]].settings[keys[j]].type === '2') {
            this.settingsForm[settings.groups[groupKeys[i]].settings[keys[j]].key] = settings.groups[groupKeys[i]].settings[keys[j]].value
          } if (settings.groups[groupKeys[i]].settings[keys[j]].type === '3') {
            if (settings.groups[groupKeys[i]].settings[keys[j]].value === '1') {
              this.settingsForm[settings.groups[groupKeys[i]].settings[keys[j]].key] = true
            } else {
              this.settingsForm[settings.groups[groupKeys[i]].settings[keys[j]].key] = false
            }
          } else {
            this.settingsForm[settings.groups[groupKeys[i]].settings[keys[j]].key] = settings.groups[groupKeys[i]].settings[keys[j]].value
          }
        }
      }
    },
    getcardstatus: function (newVal, oldVal) {
      this.filters.status.values = newVal
    },
    report_copo_details: function (newVal, oldVal) {
      this.vendor = newVal.vendor
    },
    getvendors: function (newVal, oldVal) {
      this.filters_modal.vendor.values = newVal
    },
    getcatalog: function (newVal, oldVal) {
      this.filters_modal.parent_name.values = newVal
    },
    oprprices: function (newVal, oldVal) {
      this.typePrice = []
      for (let i = 0; i < newVal.length; i++) {
        this.typePrice.push({ key: newVal[i].guid, name: newVal[i].name })
      }
    }
  }
}
</script>

<style lang="scss">
  .dart-form-block span.title {
    display: block;
    font-size: 18px;
    line-height: 1.3;
    font-weight: 500;
  }
 .add-brand{
   width: 100vw;
   position: fixed;
   top: 0;
   left: 0;
   height: 100vh;
   pointer-events: none;
   z-index: 100;
   background: rgba($color: #000000, $alpha: 0);
   transition: all 0.5s;
   display: flex;
   align-items: center;
   justify-content: center;

   &__button{
     width: 100%;
     display: flex;
     justify-content: flex-end;
   }

   &__el{
     display: flex;
     flex-direction: column;

     b{
       margin-bottom: 16px;
     }
   }

   &__title{
     display: flex;
     align-items: center;
     justify-content: space-between;
     padding-bottom: 10px;

     h2{
       margin: 0;
       font-size: 20px;
       font-weight: 500;
     }

     .d_icon{
       color: #C8C8C8;
       font-size: 14px;
       cursor: pointer;
     }
   }

   &__content{
     width: 800px;
     padding: 40px;
     max-height: 80dvh;
     background: #FFF;
     pointer-events: all;
     transition: all 0.4s;
     border: 1px solid #E2E2E2;
     opacity: 0;
     transition: all 0.3s;
     border-radius: 8px;
     pointer-events: none;
   }

   &.active{
     pointer-events: all !important;
     background: rgba($color: #000000, $alpha: 0.6);
     .add-brand{
       &__content{
         opacity: 1;
         pointer-events: all;
       }
     }
   }
 }

 .search-for-catalog{
   width: 100vw;
   position: fixed;
   top: 0;
   left: 0;
   height: 100vh;
   pointer-events: none;
   z-index: 100;

   &__get{
     width: 100%;
     text-align: right;
     display: block;
     margin-bottom: 24px;
     color: #ADADAD;
     cursor: pointer;
     transition: all 0.4s;

     &:hover{
       color: #929292;
     }
   }

   &__title{
     display: flex;
     align-items: center;
     justify-content: space-between;
     padding-bottom: 10px;

     h2{
       margin: 0;
       font-size: 20px;
       font-weight: 500;
     }

     .d_icon{
       color: #C8C8C8;
       font-size: 14px;
       cursor: pointer;
     }
   }

   &__content{
     width: 670px;
     padding: 50px 30px;
     height: 100dvh;
     background: #FFF;
     position: fixed;
     right: 0;
     top: 0;
     pointer-events: all;
     transform: translateX(100%);
     transition: all 0.4s;
     border-left: 1px solid #E2E2E2;
   }

   &.active{
     pointer-events: all !important;
     .search-for-catalog{
       &__content{
         transform: translateX(0);
       }
     }
   }

   &__table{
     overflow: auto;
     height: calc(100% - 30px);
     padding-right: 8px;

     .d-col-md-3{
       width: 100% !important;
     }

     &::-webkit-scrollbar {
       width: 8px;
       height: 8px;
       background-color: #e0e0e0; /* blue */
       border-radius: 9em;
     }

     &::-webkit-scrollbar-thumb {
         background-color: #b4b4b4; /* green */
         border-radius: 9em;
     }
   }
 }

 .analitics-widget{
   margin-bottom: 30px;
 }

 .dart-back-link{
   font-style: normal;
   font-weight: 500;
   font-size: 14px;
   line-height: 24px;
   letter-spacing: 1.25px;
 }

 .dart-back-link a{
   color: #ADADAD !important;
 }

 .h1-mini{
   font-size: 24px;
   font-weight: 400;
   margin-top: 16px;
   margin-bottom: 8px;
 }

 .info-text{
   color: #ADADAD;
   font-size: 14px;
   font-weight: 400;
 }

 .dart-helper{
   margin-bottom: 12px;
   border-radius: 8px;
   background: #FFF;
   border: 1px solid #0000001F;

   &__nav{
     display: flex;
     align-items: center;
     justify-content: space-between;
     padding: 16px 24px;
     border-bottom: 1px solid #0000001F;
   }

   p{
     margin: 0;
   }

   &__left{
     display: flex;
     align-items: center;
     p{
       color: #676767;
       font-size: 14px;
       margin-right: 16px;
     }

     span{
       padding: 0 5px;
       min-width: 25px;
       height: 25px;
       border-radius: 5px;
       color: #FFF;
       font-size: 14px;
       display: flex;
       align-items: center;
       justify-content: center;
     }
   }

   &__right{
     min-height: 39px;
     p{
       color: #676767;
       font-size: 11px;
     }

     span{
       font-size: 16px;
       font-weight: 500;
     }
   }

   &__body{
     display: flex;
     align-items: center;
     gap: 8px;
     padding: 16px 24px;
   }

   &__graph{
     max-height: 60px;
     max-width: 60px;
   }

   &__info{
     b{
       font-size: 28px;
       font-weight: 500;
     }

     p{
       color: #676767;
       font-size: 14px;
       font-weight: 400;
     }
   }
 }

 .dart-helper-footer{
   padding-bottom: 12px;
   &__icon{
     display: flex;
     justify-content: center;
     align-items: center;
     .d_icon{
       transform: rotate(0deg);
       font-size: 8px;
       cursor: pointer;
     }
   }
   &.show{
     .dart-helper-footer{
       &__text{
         max-height: 400px;
         transition: all 0.6s;
         padding: 16px 24px;
       }

       &__icon{
         .d_icon{
           transform: rotate(180deg);
         }
       }
     }
   }
   &__text{
     padding: 0 24px;
     transition: all 0.6s;
     max-height: 0;
     overflow: hidden;
     p{
       font-size: 12px;
       line-height: 1.1;
       font-weight: 400;
     }

     p + p{
       margin-top: 8px;
     }
   }
 }

 .dart-helper-1{
   border-top: 3px solid #008FFF;

   .dart-helper{
     &__left{
       span{
         background: #008FFF;
       }
     }
   }
 }

 .dart-helper-2{
   border-top: 3px solid #F363E6;
   .dart-helper{
     &__left{
       span{
         background: #F363E6;
       }
     }
   }
 }

 .dart-helper-3{
   border-top: 3px solid #FF6221;
   .dart-helper{
     &__left{
       span{
         background: #FF6221;
       }
     }
   }
 }

 .dart-helper-4{
   border-top: 3px solid #FFD02C;
   .dart-helper{
     &__left{
       span{
         background: #FFD02C;
       }
     }
   }
 }

 .p-dropdown .p-dropdown-clear-icon{
   position: absolute;
   top: 50%;
   transform: translate(0, -50%);
 }

 .tab-custom{
   .p-tabview-nav{
     margin: 0 !important;
     border: 0 !important;
   }

   .p-tabview-header{
     padding: 0 !important;
   }

   .p-tabview-nav-link{
     border-color: #282828 !important;
     color: #282828 !important;
     text-decoration: none !important;
   }

   .p-tabview-ink-bar{
     height: 3px;
     padding: 0;
     background: #282828 !important;
   }
 }

 .graph-main{
   max-width: 90px;
 }

 @media (max-width: 600px) {
   .search-for-catalog__content{
     width: 100%;
     padding: 30px 20px;
   }
 }

 </style>
