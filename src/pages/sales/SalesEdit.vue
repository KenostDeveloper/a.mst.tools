<template>
    <form @submit.prevent="formSubmit" :class="{ loading: loading }">
        <div class="profile-content__title sticky-element">
            <span class="maintitle">Настройка программы</span>
            <div class="buttons_container">
            <RouterLink :to="{ name: 'org_sales', params: { id: $route.params.id }}" class="dart-btn dart-btn-secondary btn-padding">Отменить</RouterLink>
            <button type="submit" class="dart-btn dart-btn-primary btn-padding" :class="{ 'dart-btn-loading': loading }" :disabled="loading">Сохранить изменения</button>
            </div>
        </div>
        <div>
            <div class="dart-form-group mb-4">
                <span class="ktitle">Наименование программы</span>
                <label for="name">Введите наименование, которое будет отражать смысл вашей программы.</label>
                <input v-model="this.form.name" type="text" name="name" placeholder="Укажите название программы" class="dart-form-control mt-2">
            </div>

            <div class="dart-form-group mt-2 mb-4">
              <span class="ktitle">Склад</span>
              <!-- <label for="name">Введите наименование, которое будет отражать смысл вашей акции</label> -->
              <!-- <input v-model="form.name" type="text" name="name" placeholder="Укажите склад акции" class="dart-form-control"> -->
              <Dropdown
                @change="updateProducts"
                v-model="this.form.store_id"
                :options="this.stores"
                optionLabel="label"
                optionValue="value"
                placeholder="Выберите склад"
              />
            </div>

            <div v-if="this.form.store_id">
              <div class="dart-form-group mb-0">
                <span class="ktitle">Реклама</span>
                <div class="flex align-items-center">
                    <Checkbox v-model="this.create_page_action" inputId="create-page-action" name="create_page_action" value="true" />
                    <label for="create-page-action" class="ml-2 mb-0"> Разместить рекламные баннеры </label>
                </div>
              </div>
              <div class="dart-form-group kenost-action-page pt-3" v-if="this.create_page_action.length != 0">
                <span class="ktitle">Место размещение баннера/товара</span>
                <MultiSelect v-model="this.place_action" :options="this.place" optionLabel="name" placeholder="Выберите один или несколько вариантов"
                  class="w-full" />
              </div>

              <div class="dart-form-group kenost-action-page pt-3" v-if="this.create_page_action.length != 0">
                  <div class="upload-banner">
                  <div class="upload-banner__text">
                      <span class="ktitle">Большой баннер</span>
                      <span>Загрузить изображение нужно размером не менее 1108х332, соблюдая пропорции. Чтобы не потерялось качество, желательно загружать изображение в два раза больше указанного размера.</span>
                  </div>
                  <!-- <div class="dart-btn dart-btn-secondary btn-padding">Загрузить</div> -->
                  <FileUpload class="kenost-upload-button" mode="basic" name="banner[]" :url="'/rest/file_upload.php?banner=max'" accept="image/*" :maxFileSize="2000000" @upload="onUpload" :auto="true" chooseLabel="Загрузить" />
                  </div>
                  <div class="upload-banner__image">
                    <img :src="files?.max?.original_href" v-if="files?.max?.original_href">
                  </div>
              </div>

              <div class="dart-form-group kenost-action-page pt-3" v-if="this.create_page_action.length != 0">
                  <div class="upload-banner">
                  <div class="upload-banner__text">
                      <span class="ktitle">Средний баннер</span>
                      <span>Загрузить изображение нужно размером не менее 532х264, соблюдая пропорции. Чтобы не потерялось качество, желательно загружать изображение в три раза больше указанного размера.</span>
                  </div>
                  <!-- <div class="dart-btn dart-btn-secondary btn-padding">Загрузить</div> -->
                  <FileUpload class="kenost-upload-button" mode="basic" name="banner_small[]" :url="'/rest/file_upload.php?banner=min'" accept="image/*" :maxFileSize="2000000" @upload="onUpload" :auto="true" chooseLabel="Загрузить" />
                  </div>
                  <div class="upload-banner__image">
                    <img :src="files?.min?.original_href" v-if="files?.min?.original_href">
                  </div>
              </div>

              <div class="dart-form-group kenost-action-page pt-3" v-if="this.create_page_action.length != 0">
                  <div class="upload-banner">
                  <div class="upload-banner__text">
                      <span class="ktitle">Малый баннер</span>
                      <span>Загрузить изображение нужно размером не менее 472х52, соблюдая пропорции. Чтобы не потерялось качество, желательно загружать изображение в три раза больше указанного размера.</span>
                  </div>
                  <!-- <div class="dart-btn dart-btn-secondary btn-padding">Загрузить</div> -->
                  <FileUpload class="kenost-upload-button" mode="basic" name="banner_small[]" :url="'/rest/file_upload.php?banner=min'" accept="image/*" :maxFileSize="2000000" @upload="onUpload" :auto="true" chooseLabel="Загрузить" />
                  </div>
                  <div class="upload-banner__image">
                    <img :src="files?.min?.original_href" v-if="files?.min?.original_href">
                  </div>
              </div>

              <div class="dart-form-group kenost-action-page pt-3" v-if="this.create_page_action.length != 0">
                <span class="ktitle">География показа</span>
                <Dropdown v-model="this.geo_action" :options="this.geo" optionLabel="name" placeholder="Массовое действие" class="w-full md:w-14rem" />
              </div>

              <div class="dart-form-group mb-4 mt-3">
                  <div class="upload-banner">
                  <div class="upload-banner__text">
                      <span class="ktitle">Иконка</span>
                      <span>Вы можете загрузить свое изображение или выбрать изображение из банка иконок</span>
                  </div>
                  <FileUpload class="kenost-upload-button" mode="basic" name="icon[]" :url="'/rest/file_upload.php?banner=icon'" accept="image/*" :maxFileSize="2000000" @upload="onUpload" :auto="true" chooseLabel="Загрузить" />
                  </div>
                  <div class="upload-icon__image">
                  <img :src="files?.icon?.original_href" v-if="files?.icon?.original_href">
                  </div>
              </div>

              <div class="dart-form-group mb-4">
                  <span class="ktitle">Описание</span>
                  <input v-model="this.form.description" type="text" name="description" placeholder="Укажите описание программы" class="dart-form-control">
              </div>

              <div class="dart-form-group mb-4">
                  <span class="ktitle">Вознаграждение</span>
                  <input v-model="this.form.award" type="text" name="award" placeholder="Укажите вознаграждение" class="dart-form-control">
              </div>

              <div class="dart-form-group mb-3">
                  <span class="ktitle">Совместимость скидок</span>
                  <span class="field-desc">Выберите совместимость скидок. При выборе совместимости, Вам будет предложено выбрать режим совместимости.</span>
                  <div class="flex align-items-center mt-3">
                    <RadioButton v-model="this.form.compatibilityDiscount" inputId="compatibilityDiscount-1" name="compatibilityDiscount" value="1"/>
                    <label for="compatibilityDiscount-1" class="ml-2 radioLabel">Совместима со всеми акциями</label>
                  </div>
                  <div class="flex align-items-center mt-3">
                    <RadioButton v-model="this.form.compatibilityDiscount" inputId="compatibilityDiscount-2" name="compatibilityDiscount" value="2"/>
                    <label for="compatibilityDiscount-2" class="ml-2 radioLabel">Не совместима со всеми акциями</label>
                  </div>
                  <div class="flex align-items-center mt-3">
                    <RadioButton v-model="this.form.compatibilityDiscount" inputId="compatibilityDiscount-3" name="compatibilityDiscount" value="3"/>
                    <label for="compatibilityDiscount-3" class="ml-2 radioLabel">Не совместима с выбранными акциями</label>
                    </div>
                  <div class="flex align-items-center mt-3">
                    <RadioButton v-model="this.form.compatibilityDiscount" inputId="compatibilityDiscount-4" name="compatibilityDiscount" value="4"/>
                    <label for="compatibilityDiscount-4" class="ml-2 radioLabel">Совместима с выбранными акциями</label>
                  </div>
              </div>
              <!--
              <div v-if="this.form.compatibilityDiscount == '1'" class="flex align-items-center kenost-gray-p mb-3">
                <Checkbox v-model="this.form.actionLast" inputId="actionLast-1" name="actionLast-1" value="true" />
                <label for="actionLast-1" class="ml-2 mb-0">Применяется последней (от стоимости товара по всем акциям)</label>
              </div>
              -->
              <div class="dart-form-group mt-4" v-if="this.form.compatibilityDiscount == 3 || this.form.compatibilityDiscount == 4">
                <label>Выберите акции из списка</label>
                <MultiSelect filter v-model="this.form.bigDiscount" display="chip" :options="this.allAction" optionLabel="name" placeholder="Выберите из списка" class="w-full md:w-20rem kenost-multiselect" />
              </div>
              <div class="dart-form-group mt-4" v-if="this.form.compatibilityDiscount == 1 || this.form.compatibilityDiscount == 3 || this.form.compatibilityDiscount == 4">
                <label>Выберите режим совместимости</label>
                <Dropdown v-model="this.form.compabilityMode" :options="this.compabilityMode" optionLabel="name" placeholder="Режим совместимости" class="w-full md:w-14rem" />
              </div>

              <div class="dart-form-group mb-4">
                  <span class="ktitle">Совместимость отсрочек</span>
                  <span class="field-desc">Выберите совместимость отсрочек. При выборе совместимости, Вам будет предложено выбрать режим совместимости.</span>
                  <div class="flex align-items-center mt-3">
                    <RadioButton v-model="this.form.compatibilityPost" inputId="compatibilityPost-1" name="compatibilityPost" value="1"/>
                    <label for="compatibilityPost-1" class="ml-2 radioLabel">Совместима со всеми акциями</label>
                  </div>
                  <div class="flex align-items-center mt-3">
                    <RadioButton v-model="this.form.compatibilityPost" inputId="compatibilityPost-2" name="compatibilityPost" value="2"/>
                    <label for="compatibilityPost-2" class="ml-2 radioLabel">Не совместима со всеми акциями</label>
                  </div>
                  <div class="flex align-items-center mt-3">
                    <RadioButton v-model="this.form.compatibilityPost" inputId="compatibilityPost-3" name="compatibilityPost" value="3"/>
                    <label for="compatibilityPost-3" class="ml-2 radioLabel">Не совместима с выбранными акциями</label>
                  </div>
                  <div class="flex align-items-center mt-3">
                    <RadioButton v-model="this.form.compatibilityPost" inputId="compatibilityPost-4" name="compatibilityPost" value="4"/>
                    <label for="compatibilityPost-4" class="ml-2 radioLabel">Совместима с выбранными акциями</label>
                  </div>
              </div>

              <div class="dart-form-group mt-4" v-if="this.form.compatibilityPost == 3 || this.form.compatibilityPost == 4">
                <label>Выберите акции из списка</label>
                <MultiSelect filter v-model="this.form.bigPost" display="chip" :options="this.allAction" optionLabel="name" placeholder="Выберите из списка" class="w-full md:w-20rem kenost-multiselect" />
              </div>

              <div class="dart-form-group mt-4" v-if="this.form.compatibilityPost == 1 || this.form.compatibilityPost == 3 || this.form.compatibilityPost == 4">
                <label>Выберите режим совместимости</label>
                <Dropdown v-model="this.form.compabilityModePost" :options="this.compabilityModePost" optionLabel="name" placeholder="Режим совместимости" class="w-full md:w-14rem" />
              </div>

              <div class="dart-form-group mb-4">
                  <span class="ktitle">Даты проведения</span>
                  <Calendar v-model="this.form.dates" selectionMode="range" placeholder="Выберите даты" :manualInput="false" showIcon/>
              </div>

              <div class="dart-form-group mb-4">
                  <span class="ktitle">Срок отгрузки товаров</span>
                  <div class="flex align-items-center mt-3">
                  <RadioButton v-model="this.form.typeShipment" inputId="typeShipment-1" name="typeShipment" value="1"/>
                  <label for="typeShipment-1" class="ml-2 radioLabel">Определяется данными из отгрузок</label>
                  </div>
                  <div class="flex align-items-center mt-3">
                    <RadioButton v-model="this.form.typeShipment" inputId="typeShipment-2" name="typeShipment" value="2"/>
                    <label for="typeShipment-2" class="ml-2 radioLabel">Определяется по расчету доставки ТК</label>
                  </div>
                  <div class="flex align-items-center mt-3">
                  <RadioButton v-model="this.form.typeShipment" inputId="typeShipment-3" name="typeShipment" value="3"/>
                  <label for="typeShipment-3" class="ml-2 radioLabel">Рассчитывается ТК от выбранной даты отгрузки</label>
                  </div>

                  <Calendar class="mt-3" v-if="this.form.typeShipment == 3" v-model="this.form.dateShipment" placeholder="Выберите ближайшую дату отгрузки" :manualInput="false" showIcon/>
              </div>

              <div class="dart-form-group mb-4">
                  <span class="ktitle">Условия отплаты доставки</span>
                  <div class="kenost-wiget">
                      <p>Плательщик</p>
                      <Dropdown v-model="this.form.paymentDelivery" :options="this.paymentDelivery" optionLabel="name" placeholder="Оплата доставки" class="w-full md:w-14rem" />
                  </div>
                  <div class="two-colums mt-2">
                      <div class="kenost-wiget">
                          <p>Выберите условие оплаты доставки</p>
                          <Dropdown v-model="this.form.conditionPaymentDelivery" :options="this.conditionPaymentDelivery" optionLabel="name" placeholder="Оплата доставки" class="w-full md:w-14rem" />
                      </div>
                      <div class="kenost-wiget">
                          <p v-if="this.form.conditionPaymentDelivery.key == 1">Минимальная общая сумма заказа в ₽</p>
                          <p v-if="this.form.conditionPaymentDelivery.key == 2">Минимальное количество товаров в шт</p>
                          <input v-if="this.form.conditionPaymentDelivery.key == 1 || this.form.conditionPaymentDelivery.key == 2" v-model="this.form.conditionPaymentDeliveryValue" type="text" name="description" class="dart-form-control">
                      </div>
                  </div>
              </div>

              <div class="dart-form-group mb-4">
                  <span class="ktitle">Отсрочка</span>
                  <div class="postponement">Срок отсрочки платежа: {{this.postponement_period}} дней <div class="postponement__settings" @click="this.modals.delay = !this.modals.delay">Настроить</div></div>
                  <div class="postponement__graph">
                      <b>График платежей</b>
                      <p v-for="item in this.form.delay" :key="item.id">— {{item.percent}}% через {{item.day}} дней после отгрузки</p>
                  </div>
                    <div class="two-colums mt-2">
                      <div class="kenost-wiget">
                          <p>Выберите условие отсрочки</p>
                          <Dropdown v-model="this.form.postponementConditions" :options="this.postponementConditions" optionLabel="name" placeholder="Оплата доставки" class="w-full md:w-14rem" />
                      </div>
                      <div class="kenost-wiget">
                          <p v-if="this.form.postponementConditions.key == 1">Минимальная общая сумма заказа в ₽</p>
                          <p v-if="this.form.postponementConditions.key == 2">Минимальное количество товаров в шт</p>
                          <input v-if="this.form.postponementConditions.key == 1 || this.form.postponementConditions.key == 2" v-model="this.form.postponementConditionsValue" type="text" name="description" class="dart-form-control">
                      </div>
                    </div>
              </div>

              <div class="dart-form-group mb-4">
                <span class="ktitle">Условие акции</span>
                <div class="kenost-wiget">
                    <Dropdown v-model="this.form.condition" :options="this.condition" optionLabel="name" placeholder="Оплата доставки" class="w-full md:w-14rem" />
                </div>
                <div class="two-colums mt-2" v-if="this.form.condition.key != 0">
                    <div class="kenost-wiget">
                      <p>Минимальная общая сумма</p>
                      <InputNumber
                        v-model="this.form.conditionMinSum"
                        inputId="horizontal-buttons"
                        :step="0.1"
                        min="0"
                        incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
                      />
                    </div>
                    <div class="kenost-wiget">
                      <p>Минимальное общее кол-во SKU</p>
                      <InputNumber
                        v-model="this.form.conditionMinCount"
                        inputId="horizontal-buttons"
                        :step="0.1"
                        min="0"
                        incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
                      />
                    </div>
                </div>
              </div>

              <div class="dart-form-group" v-if="this.form.condition.key == 2 || this.form.condition.key == 5">
                <span class="ktitle">Выбор подарков</span>
              </div>

              <div v-if="(this.form.condition.key == 2 || this.form.condition.key == 5)" class="PickList mt-1 mb-3 PickList__mini">
                    <div class="PickList__product" :style="{ width: '40%' }">
                        <b class="PickList__title">Доступные товары</b>
                        <div class="PickList__filters">
                        <div class="form_input_group input_pl input-parent required">
                            <input
                            type="text"
                            id="filter_name"
                            placeholder="Введите артикул или название"
                            class="dart-form-control"
                            v-model="filterGift.name"
                            @input="setFilterGift('filter')"
                            />
                            <label for="product_filter_name" class="s-complex-input__label">Введите артикул или название</label>
                            <div class="form_input_group__icon">
                                <i class="d_icon d_icon-search"></i>
                            </div>
                        </div>
                        <div class="dart-form-group">
                            <TreeSelect v-model="this.filterGift.category" :options="this.opt_catalog_tree" selectionMode="checkbox" placeholder="Выберите категорию" class="w-full" @change="setFilterGift"/>
                        </div>
                        </div>
                        <div class="PickList__products">
                        <div class="PickList__el" v-for="item in this.productsGift" :key="item.id">
                            <img :src="item.image" alt="">
                            <div class="PickList__product-info">
                              <div class="PickList__name">{{item.name}}</div>
                              <div class="PickList__article">{{item.article}}</div>
                              <div class="PickList__price">{{Number(item.price).toFixed(0)}} ₽</div>
                            </div>
                            <div @click="selectGift(item.id)" class="PickList__select"><i class="pi pi-angle-right"></i></div>
                        </div>
                        <paginate
                            :page-count="pagesCountGift"
                            :click-handler="pagClickCallbackGift"
                            :prev-text="'Пред'"
                            :next-text="'След'"
                            :container-class="'pagination justify-content-center'"
                            :initialPage="this.pageGift"
                            :forcePage="this.pageGift"
                        >
                        </paginate>
                        </div>
                    </div>

                    <div class="PickList__selected" :style="{ width: '40%' }">
                      <div class="PickList__title mb-4">
                        <b>Выбранные подарки</b>
                        <b style="margin-right: 63px;">Количество</b>
                      </div>
                      <div class="PickList__products PickList__products-selected">
                      <div class="PickList__el" v-for="(item) in this.selectedGift" :key="item.id">
                          <img :src="item.image" alt="">
                          <div class="PickList__info">
                            <div class="PickList__product-info off">
                              <div class="PickList__name">{{item.name}}</div>
                              <div class="PickList__article">{{item.article}}</div>
                              <div class="PickList__price">{{Number(item.price).toFixed(0)}} ₽</div>
                            </div>
                            <InputNumber
                              style="width: 100px;"
                              v-model="item.multiplicity"
                              inputId="horizontal-buttons"
                              :step="1"
                              min="0"
                              incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
                            />
                          </div>
                          <div @click="deleteSelectGift(item.id)" class="PickList__select"><i class="pi pi-times"></i></div>
                      </div>
                      </div>
                    </div>
                  </div>

              <div class="dart-form-group mb-4">
                <div class="flex align-items-center">
                  <Checkbox v-model="this.form.not_sale_client" inputId="not_sale_client-1" name="not_sale_client-1" value="true" />
                  <label for="not_sale_client-1" class="ml-2 mb-0">Не действует скидка клиента</label>
                </div>
              </div>

              <div class="dart-form-group picker-wrap">
                  <span class="ktitle">Добавление товаров</span>
                  <div class="flex align-items-center mt-2">
                    <RadioButton v-model="this.form.addProductType" inputId="addProductType-1" name="addProductType" value="1"/>
                    <label for="addProductType-1" class="ml-2 radioLabel">Добавить товары</label>
                  </div>
                  <div class="flex align-items-center mt-3">
                      <RadioButton v-model="this.form.addProductType" inputId="addProductType-2" name="addProductType" value="2"/>
                      <label for="addProductType-2" class="ml-2 radioLabel">Загрузить товары файлом</label>
                  </div>
                  <div class="flex align-items-center mt-3">
                      <RadioButton v-model="this.form.addProductType" inputId="addProductType-3" name="addProductType" value="3"/>
                      <label for="addProductType-3" class="ml-2 radioLabel">Добавить комплекты</label>
                  </div>
                </div>

                <div v-if="this.form.addProductType == '2'" class="dart-form-group mb-4">
                    <DropZone
                      v-if="!this.upload_product"
                      class="kenost-dropzone"
                      :maxFiles="Number(1)"
                      url="/rest/file_upload.php?upload_products=xlsx"
                      :uploadOnDrop="true"
                      :multipleUpload="true"
                      :acceptedFiles="['xlsx', 'xlsx']"
                      :parallelUpload="1"
                      @sending="parseFile"
                      v-bind="args"
                      >
                      <template v-slot:message>
                        <div class="kenost-dropzone__custom">
                          <i class="pi pi-cloud-upload"></i>
                          <b>Перетащите файл в эту область</b>
                          <p>Вы также можете загрузить файл, <span>нажав сюда</span></p>
                        </div>
                      </template>
                    </DropZone>

                    <div class="kenost-upload-xlsx" v-if="this.upload_product">
                      <div class="kenost-upload-xlsx__file">
                        <img src="../../../public/img/files/xls.png" alt="">
                        <a targer="_blank" :href="files?.xlsx?.original_href">{{ files?.xlsx?.name }}</a>
                      </div>
                      <div class="kenost-upload-xlsx__info">
                        <p>Загружено товаров: {{Object.keys(this.selected).length}} шт</p>
                        <p>Всего товаров: {{Object.keys(this.selected).length + error_product.length}} шт</p>
                        <div class="kenost-link-blue" @click="this.modals.error_product = true">Список незагруженных товаров</div>
                      </div>
                    </div>

                    <a :href="site_url_prefix + '/assets/files/files/examples/ExampleLoadingProducts.xlsx'" class="kenost-link-blue mt-2">Скачать шаблон файла</a>
                  </div>

                  <div v-if="this.form.addProductType == '1'" class="PickList mt-3">
                      <div class="PickList__product" :style="{ width: '40%' }">
                          <b class="PickList__title">Доступные товары</b>
                          <div class="PickList__filters">
                          <div class="form_input_group input_pl input-parent required">
                              <input
                              type="text"
                              id="filter_name"
                              placeholder="Введите артикул или название"
                              class="dart-form-control"
                              v-model="filter.name"
                              @input="setFilter('filter')"
                              />
                              <label for="product_filter_name" class="s-complex-input__label">Введите артикул или название</label>
                              <div class="form_input_group__icon">
                                  <i class="d_icon d_icon-search"></i>
                              </div>
                          </div>
                          <div class="dart-form-group">
                              <TreeSelect v-model="this.filter.category" :options="this.opt_catalog_tree" selectionMode="checkbox" placeholder="Выберите категорию" class="w-full" @change="setFilter"/>
                          </div>
                          </div>
                          <div class="PickList__products">
                          <div class="PickList__el" v-for="item in this.products" :key="item.id">
                              <img :src="item.image" alt="">
                              <div class="PickList__product-info">
                              <div class="PickList__name">{{item.name}}</div>
                              <div class="PickList__article">{{item.article}}</div>
                              <div class="PickList__price">{{Number(item.price).toFixed(0)}} ₽</div>
                              </div>
                              <div @click="select(item.id)" class="PickList__select"><i class="pi pi-angle-right"></i></div>
                          </div>
                          <paginate
                              :page-count="pagesCount"
                              :click-handler="pagClickCallback"
                              :prev-text="'Пред'"
                              :next-text="'След'"
                              :container-class="'pagination justify-content-center'"
                              :initialPage="this.page"
                              :forcePage="this.page"
                          >
                          </paginate>
                          </div>
                      </div>

                      <div class="PickList__buttons">
                        <div class="PickList__select" @click="setAllProducts(true)"><i class="pi pi-angle-double-right"></i></div>
                        <div class="PickList__select mt-2" @click="setAllProducts(false)"><i class="pi pi-angle-double-left"></i></div>
                      </div>

                      <div class="PickList__selected" :style="{ width: '40%' }">
                        <div class="PickList__title mb-4">
                        <b>Добавленные товары</b>
                        </div>
                        <div class="PickList__products PickList__products-selected">
                        <div class="PickList__el" v-for="(item) in this.selected" :key="item.id">
                            <img :src="item.image" alt="">
                            <div class="PickList__info">
                            <div class="PickList__product-info off">
                                <div class="PickList__name">{{item.name}}</div>
                                <div class="PickList__article">{{item.article}}</div>
                                <div class="PickList__price">{{Number(item.price).toFixed(0)}} ₽</div>
                            </div>
                            </div>
                            <div @click="deleteSelect(item.id)" class="PickList__select"><i class="pi pi-times"></i></div>
                        </div>
                        </div>
                      </div>
                  </div>

                  <div v-if="this.form.addProductType == '3'" class="PickList mt-3">
                      <div class="PickList__product" :style="{ width: '40%' }">
                          <b class="PickList__title">Ваши комплекты</b>
                          <div class="PickList__filters">
                          <div class="form_input_group input_pl input-parent required">
                              <input
                              type="text"
                              id="filter_name"
                              placeholder="Введите артикул или название"
                              class="dart-form-control"
                              v-model="this.filter_complects"
                              @input="setFilterComplects()"
                              />
                              <label for="product_filter_name" class="s-complex-input__label">Введите название</label>
                              <div class="form_input_group__icon">
                                  <i class="d_icon d_icon-search"></i>
                              </div>
                          </div>
                          </div>
                          <div class="PickList__products">
                            <div class="PickList__el" v-for="item in this.complects" :key="item.id">
                              <img :src="item.image" alt="">
                              <div class="PickList__product-info">
                                <div class="PickList__name">{{item.name}}</div>
                                <div class="PickList__article">{{item.articles}}</div>
                                <div class="PickList__price">{{Number(item.cost).toFixed(0)}} ₽</div>
                              </div>
                            <div @click="selectComplect(item.id)" class="PickList__select"><i class="pi pi-angle-right"></i></div>
                          </div>
                          <paginate
                              :page-count="pagesCount"
                              :click-handler="pagClickCallback"
                              :prev-text="'Пред'"
                              :next-text="'След'"
                              :container-class="'pagination justify-content-center'"
                              :initialPage="this.page"
                              :forcePage="this.page"
                          >
                          </paginate>
                          </div>
                      </div>

                      <div class="PickList__selected" :style="{ width: '40%' }">
                        <div class="PickList__title mb-4">
                        <b>Добавленные комплекты</b>
                        </div>
                        <div class="PickList__products">
                        <div class="PickList__el" v-for="(item) in this.selected_complects" :key="item.id">
                          <img :src="item.image" alt="">
                            <div class="PickList__info">
                            <div class="PickList__product-info off">
                              <div class="PickList__name">{{item.name}}</div>
                                <div class="PickList__article">{{item.articles}}</div>
                                <div class="PickList__price">{{Number(item.cost).toFixed(0)}} ₽</div>
                            </div>
                            </div>
                            <div @click="deleteSelectComplect(item.id)" class="PickList__select"><i class="pi pi-times"></i></div>
                        </div>
                        </div>
                      </div>
                  </div>

                  <div v-if="this.form.addProductType != '3'" class="table-kenost mt-4">
                    <p class="table-kenost__title">Таблица добавленных товаров</p>
                    <div class="table-kenost__filters">
                      <div class="table-kenost__filters-left">
                        <div class="form_input_group input_pl input-parent required">
                            <input
                            type="text"
                            id="filter_table"
                            placeholder="Введите артикул или название"
                            class="dart-form-control"
                            v-model="filter_table.name"
                            @input="setFilter('filter')"
                            />
                            <label for="product_filter_name" class="s-complex-input__label">Введите артикул или название</label>
                            <div class="form_input_group__icon">
                                <i class="d_icon d_icon-search"></i>
                            </div>
                        </div>
                        <div class="dart-form-group">
                          <TreeSelect label="name" v-model="this.filter_table.category" :options="this.opt_catalog_tree" selectionMode="checkbox" placeholder="Выберите категорию" class="w-full" @change="setFilter"/>
                        </div>
                      </div>
                      <!-- <div @click="createSet" class="dart-btn dart-btn-primary btn-padding">Создать комплект</div> -->
                    </div>
                    <table class="table-kenost__table">
                      <thead>
                          <tr>
                              <th class="table-kenost__name table-kenost__name-checkbox"><Checkbox @update:modelValue="kenostTableCheckedAll" v-model="this.kenost_table_all" inputId="kenost_table_all" value="1" /></th>
                              <th class="table-kenost__name table-kenost__name-product">Товар</th>
                              <th class="table-kenost__name">РРЦ (₽)</th>
                              <th class="table-kenost__name">Скидка %</th>
                              <th class="table-kenost__name">Цена со скидкой за шт.</th>
                              <th class="table-kenost__name">Кратность</th>
                              <th class="table-kenost__name">Сумма</th>
                              <th class="table-kenost__name">Действие</th>
                          </tr>
                      </thead>
                      <!-- Вывод комплектов -->
                      <tbody v-for="item in this.selected_visible" :key="item.id">
                        <tr v-if="this.complects_ids.indexOf(item.id) === -1">
                          <td class="table-kenost__checkbox">
                            <Checkbox @change="kenostTableCheckedAllCheck" v-model="this.kenost_table" inputId="kenost_table" :value="item.id" />
                          </td>
                          <td class="table-kenost__product">
                            <img :src="item.image">
                            <div class="table-kenost__product-text">
                              <p>{{ item.name }}</p>
                              <span>{{item.article}}</span>
                            </div>
                          </td>
                          <td>
                            {{(Number(item.price).toFixed(2)).toLocaleString('ru')}} ₽
                          </td>
                          <td>
                            {{ this.selected_data[item.id] ? (Number(this.selected_data[item.id].discountInterest).toFixed(2)).toLocaleString('ru') : Number(0.00).toFixed(2) }}
                          </td>
                          <td>
                            {{this.selected_data[item.id] ? (Number(this.selected_data[item.id].finalPrice).toFixed(2)).toLocaleString('ru') : item.price.toLocaleString('ru')}} ₽
                            <p class="table-kenost__settings" @click="settings(item)" >Настроить</p>
                          </td>
                          <td v-if="this.selected_data[item.id]">
                            <Counter class="margin-auto" @ElemCount="ElemCount" :id="item.id" :min="1" :value="this.selected_data[item.id].multiplicity" :key="new Date().getMilliseconds() + item.id"/>
                          </td>
                          <td v-else>
                            <Counter class="margin-auto" @ElemCount="ElemCount" :id="item.id" :min="1" :value="1"/>
                          </td>
                          <td>
                            {{ this.selected_data[item.id] ? (Number(this.selected_data[item.id].finalPrice) * this.selected_data[item.id].multiplicity).toFixed(2) : item.price.toLocaleString('ru') }} ₽
                          </td>
                          <td>
                            <div class="kenost-basker-delete">
                              <div class="kenost-basker-delete__button" @click="deleteSelect(item.id)">
                                <i class="pi pi-trash"></i>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <paginate
                      :page-count="pagesCountSelect"
                      :click-handler="pagClickCallbackSelect"
                      :prev-text="'Пред'"
                      :next-text="'След'"
                      :container-class="'pagination justify-content-center'"
                      :initialPage="this.page_selected"
                      :forcePage="this.page_selected"
                      >
                    </paginate>
                    <div class="table-kenost-help">
                      <div class="table-kenost-help__select"><span>Отмечено:</span> {{ this.kenost_table.length }} / {{ Object.keys(this.selected).length }}</div>
                      <div class="flex align-items-center">
                        <Checkbox @change="globalTable" v-model="this.form.global_kenost_table" inputId="global_kenost_table-1" name="global_kenost_table-1" value="true" />
                        <label for="global_kenost_table-1" class="ml-2 mb-0">Все</label>
                      </div>
                    </div>
                  </div>

                  <div class="kenost-all-table-activity" v-if="(this.form.addProductType == '1' || this.form.addProductType == '2')">
                    <div class="kenost-wiget">
                      <p>Массовое действие</p>
                      <Dropdown v-model="this.kenostActivityAll.type" :options="this.massAction" optionLabel="name" placeholder="Массовое действие" class="w-full md:w-14rem" />
                    </div>
                    <div class="kenost-wiget" v-if="this.kenostActivityAll.type.key == 0 || this.kenostActivityAll.type.key == 1">
                      <p>Тип цен</p>
                      <Dropdown v-model="this.kenostActivityAll.typePrice" :options="this.typePrice" optionLabel="name" placeholder="Тип цен" class="w-full md:w-14rem" />
                    </div>
                    <div class="kenost-wiget" v-if="this.kenostActivityAll.type.key == 0">
                      <p>Значение</p>
                      <InputNumber
                        v-model="this.kenostActivityAll.value"
                        inputId="horizontal-buttons"
                        :step="1"
                        min="0"
                        incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
                      />
                    </div>
                    <div class="kenost-wiget" v-if="this.kenostActivityAll.type.key == 0">
                      <p>&nbsp;</p>
                      <Dropdown v-model="kenostActivityAll.typeFormul" :options="this.typeFormul" optionLabel="name" class="w-full md:w-14rem" />
                    </div>

                    <div class="kenost-wiget" v-if="this.kenostActivityAll.type.key == 3">
                      <p>Значение</p>
                      <InputNumber
                        v-model="this.kenostActivityAll.multiplicity"
                        inputId="horizontal-buttons"
                        :step="1"
                        min="1"
                        incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
                      />
                    </div>

                    <div v-if="this.kenostActivityAll.type.key == 0 || this.kenostActivityAll.type.key == 1 || this.kenostActivityAll.type.key == 2 || this.kenostActivityAll.type.key == 3" @click="massActionTable" class="dart-btn dart-btn-primary mt-3"><i class="pi pi-check"></i></div>
                  </div>

                  <div class="dart-form-group mt-4">
                    <span class="ktitle">Участники</span>
                    <div class="flex align-items-center mt-2">
                      <RadioButton v-model="this.form.participantsType" inputId="participantsType-1" name="participantsType" value="1"/>
                      <label for="participantsType-1" class="ml-2 radioLabel">Выбрать регион</label>
                    </div>
                    <div class="flex align-items-center mt-3">
                      <RadioButton v-model="this.form.participantsType" inputId="participantsType-2" name="participantsType" value="2"/>
                      <label for="participantsType-2" class="ml-2 radioLabel">Выбрать отдельные компании</label>
                    </div>
                    <div class="flex align-items-center mt-3">
                      <RadioButton v-model="this.form.participantsType" inputId="participantsType-3" name="participantsType" value="3"/>
                      <label for="participantsType-3" class="ml-2 radioLabel">Неограниченный круг участников</label>
                    </div>
                  </div>

                  <div class="dart-form-group">
                    <div v-if="this.form.participantsType == '1'" class="kenost-select-reginos">
                      <p class="kenost-select-reginos__title">Выбор участников по регионам</p>
                      <p class="kenost-select-reginos__gray">Акция будет доступна в том числе для новых компаний из выбранного региона</p>
                      <div class="kenost-select-reginos__checkboxs">
                        <div class="flex align-items-center">
                          <Checkbox v-model="this.form.available_stores" inputId="access-1" name="access-1" value="true" />
                          <label for="access-1" class="ml-2"> Доступно для магазинов </label>
                        </div>
                        <div class="flex align-items-center">
                          <Checkbox v-model="this.form.available_opt" inputId="access-2" name="access-1" value="true" />
                          <label for="access-2" class="ml-2"> Доступно для оптовых компаний </label>
                        </div>
                        <div class="flex align-items-center">
                          <Checkbox v-model="this.form.available_vendors" inputId="access-3" name="access-1" value="true" />
                          <label for="access-3" class="ml-2"> Доступно для производителей </label>
                        </div>
                      </div>
                    <MultiSelect filter v-model="this.regions_select" display="chip" :options="this.regions_all" optionLabel="name" placeholder="Выберите регионы"
                    class="w-full md:w-20rem kenost-multiselect mt-2" />
                    </div>
                  </div>

                  <div class="PickList" v-if="this.form.participantsType == '2'">
                    <div class="PickList__product" :style="{ width: '40%' }">
                      <b class="PickList__title">Добавление отдельных организаций</b>
                      <div class="PickList__filters">
                        <div class="form_input_group input_pl input-parent required">
                          <input
                          type="text"
                          id="filter_name"
                          placeholder="Введите артикул или название"
                          class="dart-form-control"
                          v-model="filter_organizations.name"
                          @input="setFilterOrganization('filter')"
                          />
                          <label for="product_filter_name" class="s-complex-input__label">Введите название организации</label>
                          <div class="form_input_group__icon">
                              <i class="d_icon d_icon-search"></i>
                          </div>
                        </div>
                      </div>
                      <div class="PickList__products">
                        <div class="PickList__el center" v-for="item in this.all_organizations" :key="item.id">
                          <img :src="item.image" alt="">
                          <div class="PickList__product-info">
                            <div>{{item.name}}</div>
                          </div>
                          <div @click="selectOrganization(item.id)" class="PickList__select"><i class="pi pi-angle-right"></i></div>
                        </div>
                      </div>
                    </div>

                    <div class="PickList__selected" :style="{ width: '40%' }">
                      <div class="PickList__title mb-4">
                        <b>Добавленные организации</b>
                      </div>
                      <div class="PickList__products PickList__products-selected">
                        <div class="PickList__el center" v-for="(item) in this.all_organizations_selected" :key="item.id">
                          <img :src="item.image" alt="">
                            <div class="PickList__info">
                            <div class="PickList__product-info off">
                              <div>{{item.name}}</div>
                            </div>
                          </div>
                          <div @click="deleteSelectOrganization(item.id)" class="PickList__select"><i class="pi pi-times"></i></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="dart-form-group mt-4">
                    <span class="ktitle">Ограничения</span>
                    <div class="flex align-items-center mt-2">
                      <RadioButton v-model="this.form.limitations" inputId="limitations-1" name="limitations" value="1"/>
                      <label for="limitations-1" class="ml-2 radioLabel">Без ограничений</label>
                    </div>
                    <div class="flex align-items-center mt-3">
                      <RadioButton v-model="this.form.limitations" inputId="limitations-2" name="limitations" value="2"/>
                      <label for="limitations-2" class="ml-2 radioLabel">Ограничить по сумме</label>
                    </div>
                  </div>

                  <div class="kenost-wiget" v-if="this.form.limitations == '2'">
                    <p>Значение</p>
                    <InputNumber
                      v-model="this.form.limitationValue"
                      inputId="horizontal-buttons"
                      :step="0.1"
                      min="0"
                      incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
                    />
            </div>
          </div>
        </div>
    </form>
    <Dialog v-model:visible="this.modals.delay" header="Настройка отсрочки платежа" :style="{ width: '800px' }">
        <div class="kenost-modal-price">
            <div class="two-colums mt-2" v-for="(item, index) in this.form.delay" :key="item.id">
                <div class="kenost-wiget">
                    <p>Процент от суммы заказа</p>
                    <InputNumber
                        v-model="this.form.delay[index].percent"
                        inputId="horizontal-buttons"
                        :step="0.1"
                        min="0"
                        max="100"
                        suffix=" %"
                        @update:modelValue="delayUpdate"
                        incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
                    />
                </div>
                <div class="kenost-wiget">
                    <p>Срок отсрочки платежа в календарных днях</p>
                    <InputNumber
                        v-model="this.form.delay[index].day"
                        inputId="horizontal-buttons"
                        :step="0.1"
                        min="0"
                        @update:modelValue="delayUpdate"
                        incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
                    />
                </div>
            </div>
            <div class="kenost-modal-price__button kenost-modal-price__flex">
                <div class="kenost-add-button" @click="this.form.delay.push({percent: 0, day: 0})"><i class="pi pi-plus"></i> Добавить срок</div>
                <div class="dart-btn dart-btn-primary" :class="{ 'kenots-button-stop': delayPercentSum > 100 || delayPercentSum < 100 }" @click="delayPercentSum == 100 ? this.modals.delay = !this.modals.delay : ''">
                    Подтвердить
                    <div class="kenots-button-stop__text">Сумма процентов должна составлять 100</div>
                </div>
            </div>
        </div>
    </Dialog>

    <Dialog v-model:visible="this.modals.error_product" header="Список незагруженных товаров" :style="{ width: '640px' }">
        <div class="kenost-list-error">
          <table>
            <tr>
              <th>№</th>
              <th>Артикул</th>
            </tr>
            <tr v-for="item, index in this.error_product" :key="item.id">
              <td>{{index + 1}}</td>
              <td>{{item}}</td>
            </tr>
          </table>
        </div>
    </Dialog>

    <Dialog v-model:visible="this.modals.price" :header="this.modals.headers[this.modals.price_step]" :style="{ width: '600px' }">
        <div class="kenost-modal-price">
            <div class="product-kenost-card">
              <img :src="this.selected[this.modals.product_id]?.image">
              <div class="product-kenost-card__text">
                <p>{{ this.selected[this.modals.product_id]?.name }}</p>
                <span>{{this.selected[this.modals.product_id]?.article}}</span>
              </div>
            </div>
            <div class="kenost-method-edit-flex" v-if="this.modals.price_step == 0">
              <div class="flex align-items-center mt-3">
                <RadioButton v-model="this.modals.type_price" inputId="type_price-1" name="type_price" value="1"/>
                <label for="type_price-1" class="ml-2 radioLabel">Скидка по формуле</label>
              </div>
              <div class="flex align-items-center mt-3">
                <RadioButton v-model="this.modals.type_price" inputId="type_price-2" name="type_price" value="2"/>
                <label for="type_price-2" class="ml-2 radioLabel">Тип цен</label>
              </div>
              <div class="flex align-items-center mt-3">
                <RadioButton v-model="this.modals.type_price" inputId="type_price-3" name="type_price" value="3"/>
                <label for="type_price-3" class="ml-2 radioLabel">Задать вручную</label>
              </div>
            </div>

            <div v-if="this.modals.price_step == 1" class="two-colums mt-3">
              <div class="kenost-wiget">
                  <p>Тип цены</p>
                  <Dropdown @change="setDiscountFormul(this.selected_data[this.modals.product_id].typeFormul, this.saleValue, this.selected_data[this.modals.product_id].typePrice)" v-model="this.selected_data[this.modals.product_id].typePrice" :options="this.selected[this.modals.product_id].prices" optionLabel="name" class="w-full md:w-14rem" />
              </div>
              <div class="kenost-wiget-two">
                <div class="kenost-wiget">
                  <p>Значение</p>
                  <InputNumber
                    v-model="this.saleValue"
                    inputId="horizontal-buttons"
                    :step="0.1"
                    min="0"
                    @update:modelValue="setDiscountFormul(this.selected_data[this.modals.product_id].typeFormul, this.saleValue, this.selected_data[this.modals.product_id].typePrice)"
                    incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
                  />
                </div>
                <div class="kenost-wiget">
                  <p>&nbsp;</p>
                  <Dropdown @change="setDiscountFormul(this.selected_data[this.modals.product_id].typeFormul, this.saleValue, this.selected_data[this.modals.product_id].typePrice)" v-model="this.selected_data[this.modals.product_id].typeFormul" :options="this.typeFormul" optionLabel="name" class="w-full md:w-14rem" />
                </div>
              </div>
            </div>

            <div v-if="this.modals.price_step == 2" class="two-colums mt-3">
              <div class="kenost-wiget">
                  <p>Тип цены</p>
                  <Dropdown @change="setTypePrice()" v-model="this.selected_data[this.modals.product_id].typePrice" :options="this.selected[this.modals.product_id].prices" optionLabel="name" class="w-full md:w-14rem" />
              </div>
            </div>

            <div v-if="this.modals.price_step == 3" class="two-colums mt-3">
              <div class="kenost-wiget">
                <p>Скидка в %</p>
                <InputNumber
                    v-model="this.selected_data[this.modals.product_id].discountInterest"
                    inputId="horizontal-buttons"
                    :step="1"
                    min="0"
                    max="100"
                    suffix=" %"
                    @update:modelValue="setPrices(this.modals.product_id, 'discountInterest', this.selected_data[this.modals.product_id].discountInterest)"
                    incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
                />
              </div>
              <div class="kenost-wiget">
                <p>Скидка в ₽</p>
                <InputNumber
                    v-model="selected_data[this.modals.product_id].discountInRubles"
                    inputId="horizontal-buttons"
                    :step="1"
                    min="0"
                    :max="selected[this.modals.product_id].price"
                    mode="currency" currency="RUB"
                    @update:modelValue="setPrices(this.modals.product_id, 'discountInRubles', this.selected_data[this.modals.product_id].discountInRubles)"
                    incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
                />
              </div>
              <div class="kenost-wiget">
                <p>Цена со скидкой</p>
                <InputNumber
                    v-model="selected_data[this.modals.product_id].finalPrice"
                    inputId="horizontal-buttons"
                    :step="1"
                    :max="selected[this.modals.product_id].price"
                    mode="currency" currency="RUB"
                    min="0"
                    @update:modelValue="setPrices(this.modals.product_id, 'finalPrice', this.selected_data[this.modals.product_id].finalPrice)"
                    incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
                />
              </div>
            </div>

            <div class="kenost-info-line" v-if="this.modals.price_step != 0">
              <p>РРЦ: {{this.selected[this.modals.product_id]?.price}} ₽</p>
              <p>Скидка: {{ this.selected_data[this.modals.product_id] ? (Number(this.selected_data[this.modals.product_id].discountInterest).toFixed(2)).toLocaleString('ru') : 0 }} %</p>
              <p>Цена со скидой: {{this.selected_data[this.modals.product_id] ? this.selected_data[this.modals.product_id]?.finalPrice : this.selected[this.modals.product_id]?.price}} ₽</p>
            </div>

            <div class="kenost-modal-price__button kenost-modal-price__flex">
                <span v-if="this.modals.price_step == 0"></span>
                <div v-if="this.modals.price_step != 0" class="dart-btn dart-btn-secondary btn-padding" @click="this.modals.price_step = 0">
                  Назад
                </div>
                <div class="dart-btn dart-btn-primary btn-padding" @click="closeDialogPrice">
                  {{this.modals.price_step == 0? 'Далее' : 'Готово'}}
                </div>
            </div>
        </div>
    </Dialog>
</template>
<script>

import { mapActions, mapGetters } from 'vuex'
import FileUpload from 'primevue/fileupload'
import Calendar from 'primevue/calendar'
import RadioButton from 'primevue/radiobutton'
import Dropdown from 'primevue/dropdown'
import Dialog from 'primevue/dialog'
import InputNumber from 'primevue/inputnumber'
import TreeSelect from 'primevue/treeselect'
import DropZone from 'dropzone-vue'
import Checkbox from 'primevue/checkbox'
import Counter from '../../components/opt/Counter.vue'
import MultiSelect from 'primevue/multiselect'
import router from '@/router'
import Paginate from 'vuejs-paginate-next'

export default {
  name: 'ProfileSalesAdd',
  props: { },
  data () {
    return {
      page: 1,
      pageGift: 1,
      loading: true,
      filter: {
        name: '',
        category: {}
      },
      filterGift: {
        name: '',
        category: {}
      },
      filter_table: {
        name: '',
        category: {}
      },
      geo_action: { name: 'По географии акции', key: 1 },
      opt_catalog_tree: [],
      error_product: [],
      create_page_action: [],
      upload_product: false,
      page_complects: 1,
      per_complects: 25,
      filter_complects: '',
      complects: [],
      stores: [],
      selected_complects: {},
      postponement_period: 0,
      selected: {},
      selectedGift: {},
      selected_data: {},
      selected_visible: {},
      total_selected: -1,
      kenost_table_all: [],
      kenost_table: [],
      products: [],
      productsGift: [],
      total_products: 0,
      total_gift_products: 0,
      saleValue: 0,
      per_page: 25,
      filter_organizations: {
        name: '',
        type: [1, 2]
      },
      all_organizations: [],
      all_organizations_selected: {},
      page_selected: 1,
      regions: [],
      place_action: [],
      regions_all: [],
      regions_select: [],
      complects_ids: [],
      form: {
        actionLast: [],
        global_kenost_table: [],
        name: '',
        description: '',
        award: '',
        dates: [],
        compatibilityDiscount: '1',
        compatibilityPost: '1',
        typeShipment: '1',
        dateShipment: '',
        paymentDelivery: { name: 'Покупатель', key: 0 },
        conditionPaymentDelivery: { name: 'Без условий', key: 0 },
        compabilityMode: { name: 'Применяется бóльшая', key: 0 },
        compabilityModePost: { name: 'Применяется бóльшая', key: 0 },
        conditionPaymentDeliveryValue: 0,
        postponementConditions: { name: 'Без условий', key: 0 },
        postponementConditionsValue: 0,
        condition: { name: 'Скидка без условий', key: 0 },
        limitations: '1',
        limitationValue: 0,
        addProductType: '1',
        store_id: '',
        delay: [
          {
            percent: 100,
            day: 0
          }
        ],
        delayPercentSum: 0,
        participantsType: '3',
        available_stores: [],
        available_vendors: [],
        available_opt: [],
        conditionMinCount: 0,
        conditionMinSum: 0,
        bigDiscount: [],
        not_sale_client: []
      },
      listAction: {},
      kenostActivityAll: {
        type: {},
        typePrice: {},
        value: 0,
        typeFormul: {},
        discountInterest: 0,
        multiplicity: 1
      },
      modals: {
        delay: false,
        price: false,
        error_product: false,
        price_step: 0,
        type_price: '1',
        product_id: -1,
        headers: [
          'Метод редактирования цены',
          'Скидка по формуле',
          'Тип цен',
          'Скидка вручную'
        ]
      },
      files: {
        max: {
          original_href: ''
        },
        min: {
          original_href: ''
        },
        icon: {
          original_href: ''
        }
      },
      compabilityMode: [
        { name: 'Применяется бóльшая', key: 0 },
        { name: 'Скидки складываются', key: 1 }
      ],
      compabilityModePost: [
        { name: 'Применяется бóльшая', key: 0 },
        { name: 'Применяется меньшая', key: 1 }
      ],
      paymentDelivery: [
        { name: 'Покупатель', key: 0 },
        { name: 'Поставщик', key: 1 }
      ],
      conditionPaymentDelivery: [
        { name: 'Без условий', key: 0 },
        { name: 'Купи на Х рублей', key: 1 },
        { name: 'При покупке Х шт товара', key: 2 }
      ],
      postponementConditions: [
        { name: 'Без условий', key: 0 },
        { name: 'При покупке на Х рублей получи отсрочку', key: 1 },
        { name: 'При покупке Х товара получи отсрочку на него', key: 2 }
      ],
      condition: [
        { name: 'Скидка без условий', key: 0 },
        { name: 'Купи Х товаров по цене Y', key: 1 },
        { name: 'Получи подарок при покупке Х товаров', key: 2 },
        { name: 'Купи на X рублей и получи скидку Y', key: 3 }
      ],
      typeFormul: [
        { name: '₽', key: 0 },
        { name: '%', key: 1 }
      ],
      typePrice: [],
      massAction: [
        { name: 'Скидка по формуле', key: 0 },
        { name: 'Тип цен', key: 1 },
        { name: 'Кратность', key: 3 }
      ],
      place: [
        // { name: 'На главной', code: 0 },
        // { name: 'На странице огранизаций', code: 1 },
        // { name: 'В каталоге', code: 2 },
        // { name: 'При выборе поставщика', code: 3 },
        // { name: 'При офомлении заказа', code: 4 }
      ],
      geo: [
        { name: 'Показывать всем', key: 0 },
        { name: 'По географии акции', key: 1 }
      ]
    }
  },
  methods: {
    ...mapActions([
      'get_available_products_from_api',
      'get_all_organizations_from_api',
      'get_regions_from_api',
      'set_sales_to_api',
      'get_sales_to_api',
      'opt_get_complects',
      'opt_upload_products_file',
      'get_all_sales_to_api',
      'opt_get_prices',
      'opt_get_remain_prices',
      'get_opt_catalog_tree_from_api',
      'org_get_stores_from_api',
      'get_sales_adv_pages_to_api'
    ]),
    onUpload (data) {
      if (data.xhr.response) {
        const response = JSON.parse(data.xhr.response)
        if (Object.prototype.hasOwnProperty.call(response.data, 'files')) {
          // перечень загруженныйх файлов

          if (response.data.files[0].type_banner === 'max') {
            this.files.max = response.data.files[0]
          } else if (response.data.files[0].type_banner === 'min') {
            this.files.min = response.data.files[0]
          } else if (response.data.files[0].type_banner === 'icon') {
            this.files.icon = response.data.files[0]
          }
        }
      }
      this.$toast.add({ severity: 'info', summary: 'Файлы загружены', detail: 'Файл был успешно загружен', life: 3000 })
    },
    updateProducts () {
      const data = {
        storeid: this.form.store_id,
        filter: this.filter,
        filterselected: this.filter_table,
        selected: Object.keys(this.selected),
        pageselected: this.page_selected,
        page: this.page,
        perpage: this.per_page
      }

      this.selected = {}
      this.selected_data = {}
      this.selected_visible = {}
      this.products = []

      this.get_available_products_from_api(data).then(
        this.kenostTableCheckedAllCheck()
      )

      this.selectedGift = {}

      const dataGift = {
        storeid: this.form.store_id,
        filter: this.filterGift,
        filterselected: this.filter_table,
        selected: Object.keys(this.selected),
        pageselected: this.page_selected,
        page: this.page,
        perpage: this.per_page,
        type: 'gift'
      }

      this.get_available_products_from_api(dataGift).then()
    },
    delayUpdate () {
      this.delayPercentSum = 0
      this.postponement_period = 0
      for (let i = 0; i < this.form.delay.length; i++) {
        this.delayPercentSum += this.form.delay[i].percent
        this.postponement_period = this.postponement_period + (this.form.delay[i].day * (this.form.delay[i].percent / 100))
      }
    },
    settings (item) {
      this.modals.price = true
      this.modals.product_id = item.id
      if (!this.selected_data[item.id]) {
        const elem = {
          price: item.price,
          multiplicity: 1,
          finalPrice: item.price,
          discountInterest: 0,
          discountInRubles: 0
        }
        this.selected_data[item.id] = elem
      }
    },
    parseFile (files, xhr, formData) {
      const callback = (e) => {
        const res = JSON.parse(e)

        this.files.xlsx = res.data.files[0]

        const data = {
          action: 'upload/products/file',
          store_id: router.currentRoute._value.params.id,
          file: res.data.files[0].original,
          type: 'b2b'
        }
        this.opt_upload_products_file(data).then((response) => {
          const productsList = response.data.data.data
          // Бежим по всем элементам и добавляем их в select
          this.selected = {}
          for (let i = 1; i < Object.keys(productsList).length; i++) {
            const tempProduct = productsList[Object.keys(productsList)[i]]
            if (!tempProduct.error) {
              const product = {}
              product.article = tempProduct.A
              product.discountInRubles = tempProduct.E - tempProduct.D
              product.discountInterest = (tempProduct.E - tempProduct.D) / (tempProduct.E / 100)
              product.finalPrice = tempProduct.D
              product.price = tempProduct.E
              product.id = tempProduct.remain.id
              product.multiplicity = tempProduct.F
              product.image = tempProduct.remain.image
              product.name = tempProduct.remain.name
              product.typeFormul = {}
              product.typePrice = ''
              this.selected[tempProduct.remain.id] = product
              this.total_selected++

              const selectdata = {}
              if (tempProduct.E === 0 || tempProduct.E === null) {
                selectdata.discountInterest = 100
                selectdata.discountInRubles = '-'
              } else {
                selectdata.discountInRubles = tempProduct.E - tempProduct.D
                selectdata.discountInterest = (tempProduct.E - tempProduct.D) / (tempProduct.E / 100)
              }
              selectdata.finalPrice = tempProduct.D
              selectdata.price = tempProduct.E
              selectdata.multiplicity = tempProduct.F

              this.selected_data[tempProduct.remain.id] = selectdata
            } else {
              this.error_product.push(tempProduct.A)
            }
          }

          const data = {
            storeid: this.form.store_id,
            filter: this.filter,
            filterselected: this.filter_table,
            selected: Object.keys(this.selected),
            pageselected: this.page_selected,
            page: this.page,
            perpage: this.per_page
          }
          this.get_available_products_from_api(data).then((res) => {
            this.kenostTableCheckedAllCheck()
          })
          this.upload_product = true
        })
      }

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          callback(xhr.response)
        }
      }
    },
    globalTable () {
      if (this.form.global_kenost_table.length === 0) {
        this.kenost_table = []
      } else {
        this.kenost_table = Object.keys(this.selected)
      }
      this.kenostTableCheckedAllCheck()
    },
    massActionTable () {
      for (let i = 0; i < this.kenost_table.length; i++) {
        // console.log(this.kenostActivityAll.type.key)
        if (!this.selected_data[this.kenost_table[i]]) {
          const elem = {
            price: this.selected[this.kenost_table[i]].price,
            multiplicity: 1,
            finalPrice: this.selected[this.kenost_table[i]].price,
            discountInterest: 0,
            discountInRubles: 0
          }
          this.selected_data[this.kenost_table[i]] = elem
        }
        switch (this.kenostActivityAll.type.key) {
          case 0:
            this.selected_data[this.kenost_table[i]].typePrice = this.kenostActivityAll.typePrice
            if (this.kenostActivityAll.typeFormul.key === 0) {
              this.selected[this.kenost_table[i]].finalPrice = Number(this.selected_data[this.kenost_table[i]].price) - this.kenostActivityAll.value
              this.selected_data[this.kenost_table[i]].discountInRubles = this.kenostActivityAll.value
              this.selected_data[this.kenost_table[i]].discountInterest = this.kenostActivityAll.value / (Number(this.selected_data[this.kenost_table[i]].price) / 100)
            } else {
              this.selected_data[this.kenost_table[i]].finalPrice = Number(this.selected_data[this.kenost_table[i]].price) - ((Number(this.selected_data[this.kenost_table[i]].price) / 100) * this.kenostActivityAll.value)
              this.selected_data[this.kenost_table[i]].discountInRubles = this.selected_data[this.kenost_table[i]].finalPrice - Number(this.selected_data[this.kenost_table[i]].price)
              this.selected_data[this.kenost_table[i]].discountInterest = this.kenostActivityAll.value
            }
            break
          case 1:
            // console.log(this.selected)
            // eslint-disable-next-line no-case-declarations
            const isPrice = this.selected[this.kenost_table[i]].prices.find(r => r.guid === this.kenostActivityAll.typePrice.key)

            if (isPrice) {
              // console.log(this.selected[this.kenost_table[i]])
              this.selected_data[this.kenost_table[i]].typePrice = this.kenostActivityAll.typePrice
              this.selected_data[this.kenost_table[i]].finalPrice = isPrice.price
              this.selected_data[this.kenost_table[i]].discountInRubles = Number(this.selected_data[this.kenost_table[i]].price) - this.selected_data[this.kenost_table[i]].finalPrice
              this.selected_data[this.kenost_table[i]].discountInterest = isPrice.price / (Number(this.selected_data[this.kenost_table[i]].price) / 100)
            }
            break
          case 3:
            this.selected_data[this.kenost_table[i]].multiplicity = this.kenostActivityAll.multiplicity
            break
        }
        // console.log(this.selected[this.kenost_table[i]])
      }
    },
    setFilter () {
      this.page_selected = 1
      this.page = 1
      const data = {
        storeid: this.form.store_id,
        filter: this.filter,
        filterselected: this.filter_table,
        pageselected: this.page_selected,
        page: this.page,
        perpage: this.per_page,
        selected: Object.keys(this.selected)
      }
      this.get_available_products_from_api(data).then((res) => {
        this.kenostTableCheckedAllCheck()
      })
    },

    setFilterGift () {
      this.pageGift = 1
      const data = {
        storeid: this.form.store_id,
        filter: this.filterGift,
        filterselected: this.filter_table,
        pageselected: this.page_selected,
        page: this.pageGift,
        perpage: this.per_page,
        selected: Object.keys(this.selectedGift),
        type: 'gift'
      }
      this.get_available_products_from_api(data).then((res) => {
        this.kenostTableCheckedAllCheck()
      })
    },
    setAllProducts (is) {
      const data = {
        storeid: this.form.store_id,
        filter: this.filter,
        filterselected: this.filter_table,
        pageselected: this.page_selected,
        page: this.page,
        perpage: this.per_page,
        isallproducts: is ? 'all' : 'null'
      }
      if (is) {
        data.selected = Object.keys(this.selected)
      }
      this.get_available_products_from_api(data).then((res) => {
        this.kenostTableCheckedAllCheck()
      })
    },
    setFilterComplects () {
      const data = {
        action: 'complects/get',
        filter: this.filter_complects,
        page: this.page_complects,
        perpage: this.pagination_items_per_page_complects,
        store_id: router.currentRoute._value.params.id,
        selected: this.selected_complects
      }
      this.opt_get_complects(data)
    },
    formSubmit (event) {
      this.$load(async () => {
        if (router.currentRoute._value.params.sales_id) {
          await this.set_sales_to_api({
            action: 'set',
            type: 'b2b',
            id: router.currentRoute._value.params.id,
            store_id: this.form.store_id,
            gifts: this.selectedGift,
            name: this.form.name,
            files: this.files,
            description: this.form.description,
            award: this.form.award,
            compabilityMode: this.form.compabilityMode,
            compabilityModePost: this.form.compabilityModePost,
            compatibilityDiscount: this.form.compatibilityDiscount,
            compatibilityPost: this.form.compatibilityPost,
            dates: [this.form.dates[0].toDateString(), this.form.dates[1].toDateString()],
            shipment_type: this.form.typeShipment,
            shipment_date: this.form.dateShipment,
            payer: this.form.paymentDelivery.key,
            delivery_payment_terms: this.form.conditionPaymentDelivery.key,
            delivery_payment_value: this.form.conditionPaymentDeliveryValue,
            delay: this.postponement_period,
            delay_graph: this.form.delay,
            delay_condition: this.form.postponementConditions.key,
            delay_condition_value: this.form.postponementConditionsValue,
            condition_type: this.form.condition.key,
            condition_min_sum: this.form.conditionMinSum,
            condition_SKU: this.form.conditionMinCount,
            participants_type: this.form.participantsType,
            products: Object.keys(this.selected),
            products_data: this.selected_data,
            regions_select: this.regions_select,
            organizations: this.all_organizations_selected,
            method_adding_products: this.form.addProductType,
            available_stores: this.form.available_stores[0] === 'true',
            available_vendors: this.form.available_vendors[0] === 'true',
            available_opt: this.form.available_opt[0] === 'true',
            complects: this.selected_complects,
            action_id: router.currentRoute._value.params.sales_id,
            big_sale_actions: this.form.bigDiscount,
            big_post_actions: this.form.bigPost,
            not_sale_client: this.form.not_sale_client[0] === 'true',
            limit_sum: this.form.limitationValue,
            limit_type: this.form.limitations,
            actionLast: this.form.actionLast[0] === 'true',
            page_places: this.place_action.map(x => x.code),
            page_geo: this.geo_action?.key,
            page_place_position: this.position,
            page_create: this.create_page_action[0] === 'true'
          })
            .then((result) => {
              this.loading = false
              router.push({ name: 'org_sales', params: { id: router.currentRoute._value.params.id } })
            })
            .catch((result) => {
              // console.log(result)
            })
        } else {
          await this.set_sales_to_api({
            action: 'set',
            type: 'b2b',
            id: router.currentRoute._value.params.id,
            store_id: this.form.store_id,
            gifts: this.selectedGift,
            name: this.form.name,
            files: this.files,
            description: this.form.description,
            award: this.form.award,
            compabilityMode: this.form.compabilityMode,
            compabilityModePost: this.form.compabilityModePost,
            compatibilityDiscount: this.form.compatibilityDiscount,
            compatibilityPost: this.form.compatibilityPost,
            dates: [this.form.dates[0].toDateString(), this.form.dates[1].toDateString()],
            shipment_type: this.form.typeShipment,
            shipment_date: this.form.dateShipment,
            payer: this.form.paymentDelivery.key,
            delivery_payment_terms: this.form.conditionPaymentDelivery.key,
            delivery_payment_value: this.form.conditionPaymentDeliveryValue,
            delay: this.postponement_period,
            delay_graph: this.form.delay,
            delay_condition: this.form.postponementConditions.key,
            delay_condition_value: this.form.postponementConditionsValue,
            condition_type: this.form.condition.key,
            condition_min_sum: this.form.conditionMinSum,
            condition_SKU: this.form.conditionMinCount,
            participants_type: this.form.participantsType,
            products: Object.keys(this.selected),
            products_data: this.selected_data,
            regions_select: this.regions_select,
            organizations: this.all_organizations_selected,
            method_adding_products: this.form.addProductType,
            available_stores: this.form.available_stores[0] === 'true',
            available_vendors: this.form.available_vendors[0] === 'true',
            available_opt: this.form.available_opt[0] === 'true',
            complects: this.selected_complects,
            big_sale_actions: this.form.bigDiscount,
            big_post_actions: this.form.bigPost,
            not_sale_client: this.form.not_sale_client[0] === 'true',
            limit_sum: this.form.limitationValue,
            limit_type: this.form.limitations,
            actionLast: this.form.actionLast[0] === 'true',
            page_places: this.place_action.map(x => x.code),
            page_geo: this.geo_action?.key,
            page_place_position: this.position,
            page_create: this.create_page_action[0] === 'true'
          })
            .then((result) => {
              this.loading = false
              router.push({ name: 'org_sales', params: { id: router.currentRoute._value.params.id } })
            })
            .catch((result) => {
              // console.log(result)
            })
        }
      })
      this.loading = true
      // }
    },
    selectComplect (id) {
      const complect = this.complects.find(r => r.id === id)
      this.selected_complects[complect.id] = complect
      this.complects = this.complects.filter((r) => r.id !== id)
      const data = {
        action: 'complects/get',
        filter: this.filter_complects,
        page: this.page_complects,
        perpage: this.pagination_items_per_page_complects,
        store_id: router.currentRoute._value.params.id,
        selected: this.selected_complects
      }
      this.opt_get_complects(data)
      // this.total_selected++
    },
    deleteSelectComplect (id) {
      this.complects.push(this.selected_complects[id])

      // eslint-disable-next-line camelcase
      const new_selected = {}

      for (let i = 0; i < Object.keys(this.selected_complects).length; i++) {
        if (this.selected_complects[Object.keys(this.selected_complects)[i]].id !== id) {
          new_selected[Object.keys(this.selected_complects)[i]] = this.selected_complects[Object.keys(this.selected_complects)[i]]
        }
      }

      // eslint-disable-next-line camelcase
      this.selected_complects = new_selected

      const data = {
        action: 'complects/get',
        filter: this.filter_complects,
        page: this.page_complects,
        perpage: this.pagination_items_per_page_complects,
        store_id: router.currentRoute._value.params.id,
        selected: this.selected_complects
      }
      this.opt_get_complects(data)
    },
    select (id) {
      const product = this.products.find(r => r.id === id)
      product.discountInterest = 0
      product.discountInRubles = 0
      product.multiplicity = 1
      product.finalPrice = Number(product.price)
      product.typeFormul = {}
      product.typePrice = ''

      const dataProduct = {
        action: 'get/product/prices',
        remain_id: product.id
      }

      this.opt_get_remain_prices(dataProduct).then((res) => {
        product.prices = res.data.data

        this.selected[product.id] = product
        this.products = this.products.filter((r) => r.id !== id)
        const data = {
          storeid: this.form.store_id,
          filter: this.filter,
          filterselected: this.filter_table,
          selected: Object.keys(this.selected),
          pageselected: this.page_selected,
          page: this.page,
          perpage: this.per_page
        }
        this.get_available_products_from_api(data).then((res) => {
          this.kenostTableCheckedAllCheck()
        })
        this.total_selected++
      })
    },
    selectGift (id) {
      const product = this.productsGift.find(r => r.id === id)
      // console.log(product)
      // product.discountInterest = 0
      // product.discountInRubles = 0
      product.multiplicity = 1
      // product.finalPrice = Number(product.price)
      // product.typeFormul = {}
      // product.typePrice = ''

      this.selectedGift[product.id] = product
      // console.log(this.selectedGift)
      this.productsGift = this.productsGift.filter((r) => r.id !== id)
      const data = {
        storeid: this.form.store_id,
        filter: this.filterGift,
        filterselected: this.filter_table,
        selected: Object.keys(this.selectedGift),
        pageselected: this.page_selected,
        page: this.pageGift,
        perpage: this.per_page,
        type: 'gift'
      }
      this.get_available_products_from_api(data).then((res) => {
        this.kenostTableCheckedAllCheck()
      })
    },
    deleteSelectGift (id) {
      this.productsGift.push(this.selectedGift[id])

      // eslint-disable-next-line camelcase
      const new_selected = {}

      for (let i = 0; i < Object.keys(this.selectedGift).length; i++) {
        if (this.selectedGift[Object.keys(this.selectedGift)[i]].id !== id) {
          new_selected[Object.keys(this.selectedGift)[i]] = this.selectedGift[Object.keys(this.selectedGift)[i]]
        }
      }

      // eslint-disable-next-line camelcase
      this.selectedGift = new_selected

      // this.selected = this.selected.filter((r) => r.id !== id)
      const data = {
        storeid: this.form.store_id,
        filter: this.filterGift,
        filterselected: this.filter_table,
        selected: Object.keys(this.selected),
        pageselected: this.page_selected,
        page: this.page,
        perpage: this.per_page,
        type: 'gift'
      }
      this.get_available_products_from_api(data).then((res) => {
        this.kenostTableCheckedAllCheck()
      })
    },
    deleteSelect (id) {
      this.products.push(this.selected[id])

      // eslint-disable-next-line camelcase
      const new_selected = {}

      for (let i = 0; i < Object.keys(this.selected).length; i++) {
        if (this.selected[Object.keys(this.selected)[i]].id !== id) {
          new_selected[Object.keys(this.selected)[i]] = this.selected[Object.keys(this.selected)[i]]
        }
      }

      // eslint-disable-next-line camelcase
      this.selected = new_selected

      // this.selected = this.selected.filter((r) => r.id !== id)
      const data = {
        storeid: this.form.store_id,
        filter: this.filter,
        filterselected: this.filter_table,
        selected: Object.keys(this.selected),
        pageselected: this.page_selected,
        page: this.page,
        perpage: this.per_page
      }
      this.get_available_products_from_api(data).then((res) => {
        this.kenostTableCheckedAllCheck()
      })
      this.total_selected--
    },
    selectOrganization (id) {
      const organization = this.all_organizations.find(r => r.id === id)
      this.all_organizations_selected[organization.id] = organization
      this.all_organizations = this.all_organizations.filter((r) => r.id !== id)
    },
    setFilterOrganization () {
      const data = { filter: this.filter_organizations }
      this.get_all_organizations_from_api(data).then(
        this.all_organizations = this.allorganizations
      )
    },
    deleteSelectOrganization (id) {
      this.all_organizations.push(this.all_organizations_selected[id])
      // eslint-disable-next-line camelcase
      const new_all_organizations_selected = {}

      for (let i = 0; i < Object.keys(this.all_organizations_selected).length; i++) {
        if (this.all_organizations_selected[Object.keys(this.all_organizations_selected)[i]].id !== id) {
          new_all_organizations_selected[Object.keys(this.all_organizations_selected)[i]] = this.all_organizations_selected[Object.keys(this.all_organizations_selected)[i]]
        }
      }

      // eslint-disable-next-line camelcase
      this.all_organizations_selected = new_all_organizations_selected
    },
    pagClickCallback (pageNum) {
      this.page = pageNum
      const data = {
        storeid: this.form.store_id,
        filter: this.filter,
        filterselected: this.filter_table,
        selected: Object.keys(this.selected),
        pageselected: this.page_selected,
        page: this.page,
        perpage: this.per_page
      }
      this.get_available_products_from_api(data).then((res) => {
        this.kenostTableCheckedAllCheck()
      })
    },
    pagClickCallbackGift (pageNum) {
      this.pageGift = pageNum
      const data = {
        storeid: this.form.store_id,
        filter: this.filterGift,
        filterselected: this.filter_table,
        selected: Object.keys(this.selectedGift),
        pageselected: this.page_selected,
        page: this.pageGift,
        perpage: this.per_page,
        type: 'gift'
      }
      this.get_available_products_from_api(data).then((res) => {
        this.kenostTableCheckedAllCheck()
      })
    },
    pagClickCallbackSelect (pageNum) {
      this.page_selected = pageNum
      const data = {
        storeid: this.form.store_id,
        filter: this.filter,
        filterselected: this.filter_table,
        selected: Object.keys(this.selected),
        pageselected: this.page_selected,
        page: this.page,
        perpage: this.per_page
      }
      this.get_available_products_from_api(data).then((res) => {
        this.kenostTableCheckedAllCheck()
      })
    },
    kenostTableCheckedAllCheck () {
      let isPageSelect = false
      if (Object.keys(this.selected_visible).length === 0) {
        this.kenost_table_all = []
        // eslint-disable-next-line no-unused-vars
        isPageSelect = true
      }
      for (let i = 0; i < Object.keys(this.selected_visible).length; i++) {
        if (this.kenost_table.indexOf(this.selected_visible[Object.keys(this.selected_visible)[i]].id) === -1) {
          this.kenost_table_all = []
          // eslint-disable-next-line no-unused-vars
          isPageSelect = true
          break
        }
      }
      if (!isPageSelect) {
        this.kenost_table_all = ['1']
      }
      if (Object.keys(this.selected).length === this.kenost_table.length) {
        this.form.global_kenost_table = ['true']
      } else {
        this.form.global_kenost_table = []
      }
    },
    kenostTableCheckedAll () {
      if (this.kenost_table_all.length === 0) {
        for (let i = 0; i < Object.keys(this.selected_visible).length; i++) {
          this.kenost_table.push(this.selected_visible[Object.keys(this.selected_visible)[i]].id)
        }
      } else {
        for (let i = 0; i < Object.keys(this.selected_visible).length; i++) {
          this.kenost_table.filter((el) => el !== this.selected_visible[Object.keys(this.selected_visible)[i]].id)
        }
      }
    },
    ElemCount (obj) {
      if (!this.selected_data[obj.id]) {
        this.selected_data[obj.id] = []
        this.selected_data[obj.id].multiplicity = obj.value
        this.selected_data[obj.id].finalPrice = this.selected[obj.id].price
        this.selected_data[obj.id].discountInterest = 0
        this.selected_data[obj.id].discountInRubles = 0
      }
      this.selected_data[obj.id].multiplicity = obj.value
    },
    closeDialogPrice () {
      if (this.modals.price_step === 0) {
        this.modals.price_step = Number(this.modals.type_price)
      } else {
        this.modals.price_step = 0
        this.modals.price = false
      }
    },
    setPrices (index, name, value) {
      switch (name) {
        case 'discountInterest':
          this.selected_data[index].discountInRubles = (Number(this.selected_data[index].price) / 100) * value
          this.selected_data[index].finalPrice = Number(this.selected_data[index].price) - this.selected_data[index].discountInRubles
          break
        case 'discountInRubles':
          this.selected_data[index].discountInterest = value / (Number(this.selected_data[index].price) / 100)
          this.selected_data[index].finalPrice = Number(this.selected_data[index].price) - this.selected_data[index].discountInRubles
          break
        case 'finalPrice':
          this.selected_data[index].discountInRubles = Number(this.selected_data[index].price) - value
          this.selected_data[index].discountInterest = this.selected_data[index].discountInRubles / (Number(this.selected_data[index].price) / 100)
          break
      }
    },
    setTypePrice () {
      const getPrice = this.selected[this.modals.product_id].prices.find(r => r.guid === this.selected_data[this.modals.product_id].typePrice.guid).price
      this.selected_data[this.modals.product_id].finalPrice = Number(getPrice)
      this.selected_data[this.modals.product_id].discountInRubles = Number(this.selected_data[this.modals.product_id].price) - Number(getPrice)
      this.selected_data[this.modals.product_id].discountInterest = (Number(this.selected_data[this.modals.product_id].price) - Number(getPrice)) / (Number(this.selected_data[this.modals.product_id].price) / 100)
    },
    createSet () {
      // Создание комлпекта
      const tempComplect = {}
      for (let i = 0; i < this.kenost_table.length; i++) {
        tempComplect[i] = this.selected[this.kenost_table[i]]
        this.complects_ids.push(this.selected[this.kenost_table[i]].id)
      }
      this.complects.push(tempComplect)
      // console.log(this.complects_ids)
    },
    setDiscountFormul (type, value, typePrice) {
      if (type && value >= 0 && typePrice) {
        this.setTypePrice()
        value = Number(value)
        this.selected_data[this.modals.product_id].price = this.selected[this.modals.product_id].price
        let getPrice = Number(this.selected_data[this.modals.product_id].price)

        if (this.selected_data[this.modals.product_id].typePrice) {
          // eslint-disable-next-line no-unused-vars
          getPrice = Number(this.selected[this.modals.product_id].prices.find(r => r.guid === this.selected_data[this.modals.product_id].typePrice.guid).price)
        }
        if (type.key === 0) {
          this.selected_data[this.modals.product_id].discountInRubles = Number(this.selected_data[this.modals.product_id].price) - (getPrice - value)
          this.selected_data[this.modals.product_id].discountInterest = (Number(this.selected_data[this.modals.product_id].price) - (getPrice - value)) / (Number(this.selected_data[this.modals.product_id].price) / 100)
          this.selected_data[this.modals.product_id].finalPrice = getPrice - value
        } else if (type.key === 1) {
          this.selected_data[this.modals.product_id].discountInRubles = Number(this.selected_data[this.modals.product_id].price) - (getPrice - (value * (getPrice / 100)))
          this.selected_data[this.modals.product_id].discountInterest = (value * (getPrice / 100)) / (Number(this.selected_data[this.modals.product_id].price) / 100)
          this.selected_data[this.modals.product_id].finalPrice = getPrice - (value * (getPrice / 100))
        }
      }
    }
  },
  mounted () {
    this.get_available_products_from_api({ storeid: this.form.store_id, filter: '', selected: ['0'], page: this.page }).then((res) => {
      if (this.available_products) {
        this.products = this.available_products?.products
      }
    })
    const data = { filter: this.filter_organizations }
    this.get_all_organizations_from_api(data).then(
      this.all_organizations = this.allorganizations
    )
    this.get_regions_from_api().then(() => {
      this.regions = this.getregions
      this.regions_all = this.regions.map(function (el) {
        return { name: el.label, code: el.key }
      })
      // console.log(this.regions_all)
    })
    this.get_all_sales_to_api({
      id: router.currentRoute._value.params.id,
      action: 'get/all'
    })
    this.opt_get_complects({
      action: 'complects/get',
      page: this.page_complects,
      perpage: this.pagination_items_per_page_complects,
      store_id: router.currentRoute._value.params.id
    })
    this.get_sales_to_api({ id: router.currentRoute._value.params.sales_id, actionid: router.currentRoute._value.params.sales_id }).then(() => {
      this.loading = false
    })
    this.opt_get_prices({
      action: 'get/type/prices',
      store_id: router.currentRoute._value.params.id
    })
    this.get_opt_catalog_tree_from_api()
    this.org_get_stores_from_api({
      action: 'get/stores',
      id: this.$route.params.id
    })
    this.get_sales_adv_pages_to_api({
      action: 'get/adv/pages',
      store_id: router.currentRoute._value.params.id,
      type: 1
    })
  },
  components: {
    FileUpload,
    Calendar,
    RadioButton,
    Dropdown,
    Dialog,
    InputNumber,
    TreeSelect,
    DropZone,
    Checkbox,
    Counter,
    MultiSelect,
    Paginate
  },
  computed: {
    ...mapGetters([
      'available_products',
      'getcatalog',
      'allorganizations',
      'getregions',
      'actions',
      'optcomplects',
      'optproductsfile',
      'allactions',
      'oprprices',
      'oprpricesremain',
      'optcatalogtree',
      'org_stores',
      'adv_pages'
    ]),
    pagesCountSelect () {
      let pages = Math.round(this.total_selected / this.per_page)
      if (pages === 0) {
        pages = 1
      }
      return pages
    },
    pagesCount () {
      let pages = Math.round(this.total_products / this.per_page)
      if (pages === 0) {
        pages = 1
      }
      return pages
    },
    pagesCountGift () {
      let pages = Math.round(this.total_gift_products / this.per_page)
      if (pages === 0) {
        pages = 1
      }
      return pages
    }
  },
  watch: {
    org_stores: function (newVal, oldVal) {
      this.stores = []
      for (let i = 0; i < newVal.items.length; i++) {
        this.stores.push({ label: newVal.items[i].name, value: newVal.items[i].id })
      }
    },
    adv_pages: function (newVal, oldVal) {
      this.place = newVal
    },
    available_products: function (newVal, oldVal) {
      if (newVal) {
        if (newVal.type === 'gift') {
          this.productsGift = newVal.products
          // this.selected = newVal.selected
          if (newVal.selected) {
            this.selectedGift = newVal.selected
          }
          this.total_gift_products = newVal.total
        } else {
          this.products = newVal.products
          // this.selected = newVal.selected
          if (newVal.selected) {
            this.selected = newVal.selected
          }
          if (newVal.visible) {
            this.selected_visible = newVal.visible
          }
          this.total_products = newVal.total
          this.total_selected = newVal.total_selected
        }
      }
    },
    allorganizations: function (newVal, oldVal) {
      this.all_organizations = newVal
    },
    optcatalogtree: function (newVal, oldVal) {
      // for (let i = 0; i < newVal.length; i++) {

      // }
      this.opt_catalog_tree = newVal
    },
    getregions: function (newVal, oldVal) {
      this.regions = this.getregions
    },
    optcomplects: function (newVal, oldVal) {
      this.complects = newVal.complects
      this.total_complects = newVal.total
    },
    allactions: function (newVal, oldVal) {
      this.allAction = this.allactions.items.map(function (el) {
        return { name: el.name, code: el.id }
      })
    },
    oprprices: function (newVal, oldVal) {
      this.typePrice = []
      for (let i = 0; i < newVal.length; i++) {
        this.typePrice.push({ key: newVal[i].guid, name: newVal[i].name })
      }
      // console.log(this.typePrice)
    },
    actions: async function (newVal, oldVal) {
      if (router.currentRoute._value.params.sales_id) {
        this.form.name = newVal.name
        if (newVal.image) {
          this.files.max.original_href = this.site_url_prefix + newVal.image
        }
        if (newVal.image_inner) {
          this.files.min.original_href = this.site_url_prefix + newVal.image_inner
        }

        this.place_action = newVal.page_places
        this.geo_action = this.geo[newVal.page_geo]
        this.position = newVal.page_place_position

        if (newVal.page_create) {
          this.create_page_action = ['true']
        }

        if (newVal.gift) {
          this.selectedGift = newVal.gift
        }

        if (newVal.store_id) {
          this.form.store_id = newVal.store_id.toString()

          const data = {
            storeid: newVal.store_id.toString(),
            filter: this.filterGift,
            filterselected: this.filter_table,
            selected: Object.keys(this.selectedGift),
            pageselected: this.page_selected,
            page: this.pageGift,
            perpage: this.per_page,
            type: 'gift'
          }
          this.get_available_products_from_api(data).then()
        }

        if (newVal.icon) {
          this.files.icon.original_href = this.site_url_prefix + newVal.icon
        }
        this.selected_complects = newVal.complects
        this.form.description = newVal.description
        if (newVal.compatibility_discount) {
          this.form.compatibilityDiscount = newVal.compatibility_discount.toString()
        }

        if (newVal.compatibility_postponement) {
          this.form.compatibilityPost = newVal.compatibility_postponement.toString()
        }
        const dateto = new Date(newVal.date_to)
        const datefrom = new Date(newVal.date_from)
        this.form.dates = [datefrom, dateto]
        this.selected = newVal.products
        this.selected_data = newVal.products_data
        // let count = 0
        // for (let i = 0; i < Object.keys(newVal.products).length; i++) {
        //   if (count === 25) {
        //     break
        //   }
        //   count++
        //   console.log(newVal.products[Object.keys(newVal.products)[i]])
        //   // this.selectes[Object.keys(this.selected)[i]].hide = true
        // }
        this.total_selected = newVal.total_products
        this.all_organizations_selected = newVal.organization
        this.form.award = newVal.award
        if (newVal.shipment_type) {
          this.form.typeShipment = newVal.shipment_type.toString()
        }
        this.form.paymentDelivery = this.paymentDelivery[newVal.payer]
        this.form.conditionPaymentDelivery = this.conditionPaymentDelivery[newVal.delivery_payment_terms]
        this.form.conditionPaymentDeliveryValue = newVal.delivery_payment_value
        this.form.postponementConditions = this.postponementConditions[newVal.delay_condition]
        this.form.postponementConditionsValue = newVal.delay_condition_value
        this.postponement_period = newVal.delay
        this.form.condition = this.condition[newVal.condition_type]
        this.form.conditionMinSum = newVal.condition_min_sum
        this.form.conditionMinCount = newVal.condition_SKU
        if (newVal.method_adding_products) {
          this.form.addProductType = newVal.method_adding_products.toString()
        }
        if (newVal.participants_type) {
          this.form.participantsType = newVal.participants_type.toString()
        }
        if (newVal.available_stores) {
          this.form.available_stores = ['true']
        }
        if (newVal.available_vendors) {
          this.form.available_vendors = ['true']
        }
        if (newVal.available_opt) {
          this.form.available_opt = ['true']
        }

        if (newVal.not_sale_client) {
          this.form.not_sale_client = ['true']
        }

        if (newVal.action_last) {
          this.form.actionLast = ['true']
        }

        this.form.delay = newVal.delay_graph
        this.regions_select = newVal.regions
        this.all_organizations_selected = newVal.organization
        this.form.bigDiscount = newVal.big_sale_actions
        this.form.limitationValue = newVal.limit_sum

        if (newVal.limit_type) {
          this.form.limitations = newVal.limit_type.toString()
        }

        const dataorg = { filter: this.filter_organizations, selected: this.all_organizations_selected }
        this.get_all_organizations_from_api(dataorg).then(
          this.all_organizations = this.allorganizations
        )

        const data = {
          storeid: this.form.store_id,
          filter: this.filter,
          filterselected: this.filter_table,
          selected: Object.keys(this.selected),
          pageselected: this.page_selected,
          page: this.page,
          perpage: this.per_page
        }
        this.get_available_products_from_api(data).then((res) => {
          this.kenostTableCheckedAllCheck()
        })

        const dataComplect = {
          action: 'complects/get',
          filter: this.filter_complects,
          page: this.page_complects,
          perpage: this.pagination_items_per_page_complects,
          store_id: router.currentRoute._value.params.id,
          selected: this.selected_complects
        }
        this.opt_get_complects(dataComplect)
      }
    }
  }
}
</script>
<style lang="scss">

  .PickList__mini{
    .PickList__products{
      height: 250px;
    }

    .PickList__products-selected {
      height: 313px !important;
    }
  }

  .field-desc{
    display: block;
    margin-bottom: 5px;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 1.3;
    letter-spacing: 0.25px;
    color: #ADADAD;
  }
  .kenost-basker-delete{
    width: 100%;
    display: flex;
    justify-content: center;
    &__button{
      width: 34px;
      height: 34px;
      border: 1px solid transparent;
      cursor: pointer;
      background: #F8F8F8 !important;
      box-shadow: rgba(0, 0, 0, 0.14) 0px 2px 2px 0px;
      display: flex;
      border-radius: 5px;
      align-items: center;
      transition: all 0.4s;
      justify-content: center;

      &:hover{
        border: 1px solid #64748B;
      }

      .pi-trash{
        color: #64748B;
      }
    }
  }

  .table-kenost-help{
    display: flex;
    align-items: center;
    gap: 30px;
    &__select{
      color: #A0A0A0;
      font-size: 13px;

      span{
        font-size: 12px;
        color: #757474;
      }
    }

    label{
      color: #A0A0A0 !important;
    }
  }

  .sticky-element{
    position: sticky;
    top: 0;
    padding: 10px 0;
    z-index: 1;
    background: #FFF;
  }

  .p-multiselect-filter-icon{
    top: 50%;
    transform: translate(0, -50%);
  }

  .kenost-multiselect{
    // margin-top: 16px;
    width: 100%;
    .p-multiselect-label{
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .p-multiselect-trigger{
      display: flex;
      align-items: flex-start;
      padding-top: 12px;
    }
  }

  .kenost-select-reginos{
    border: 1px solid #E2E2E2;
    padding: 24px;
    border-radius: 5px;

    &__title{
      font-size: 14px;
      font-weight: 500;
      color: #282828;
      letter-spacing: 0.25px;
    }

    &__gray{
      color: #ADADAD;
      font-size: 14px;
      font-weight: 400px;
      margin: 8px 0 16px 0;
    }

    &__checkboxs{
      display: flex;
      flex-wrap: wrap;
      gap: 16px 100px;
    }
  }

  .kenost-link-blue{
    color: #1874CF;
    font-size: 14px;
    cursor: pointer;

    &:hover{
      color: #4d8dcc;
    }
  }

    .kenost-info-line{
      display: flex;
      padding: 12px 16px;
      background: #F8F7F5;
      justify-content: space-between;
      align-items: center;
      border-radius: 5px;
      margin-top: 8px;

      p{
        color: #A0A0A0;
        font-size: 12px;
        margin: 0;
      }
    }

    .kenost-wiget-two{
      display: flex;
      width: 100%;
      gap: 8px;
    }

    .margin-auto{
      margin: auto;
    }

    .kenost-method-edit-flex{
      display: flex;
      gap: 40px;
    }

    .product-kenost-card{
        max-width: 400px;
        display: flex;
        gap: 8px;
        img{
          width: 38px;
          height: 38px !important;
          object-fit: contain;
          border-radius: 5px;
          margin: 0;
        }

        &__text{
          display: flex;
          flex-direction: column;
          margin: 0;
          p{
            margin: 0;
            font-size: 14px;
            font-weight: 400;
            color: #282828;
            line-height: 1;
            text-align: left;
            margin-bottom: 8px;
            // display: -webkit-box;
            // -webkit-line-clamp: 2;
            // -webkit-box-orient: vertical;
            // overflow: hidden;
          }

          span{
            font-size: 14px;
            font-weight: 400;
            color: #ADADAD;
            line-height: 1;
            text-align: left;
          }
        }
    }

    .kenost-gray-p label{
      color: #ADADAD;
    }

    .upload-icon__image{
      background: #D9D9D9;
      width: 100px !important;
      height: 100px !important;
      border-radius: 50%;
      margin-top: 16px;
      overflow: hidden;
    }

    .kenost-all-table-activity{
      display: flex;
      gap: 8px;
      margin-top: 10px
    }

    .table-kenost{
      border: 1px solid #E2E2E2;
      border-radius: 5px;
      padding: 24px;

      &__complect{
        background: #F8F7F5;
      }

      &__title{
        color: #282828;
        font-size: 14px;
        font-weight: 500;
        line-height: 1.1;
        letter-spacing: 0.25px;
        margin-bottom: 24px;
      }

      &__filters{
        display: flex;
        align-items: center;
        justify-content: space-between;

        &-left{
          display: flex;
          align-items: center;
          width: 60%;
          gap: 12px;

          .input_pl{
            width: 50%;
          }

          .dart-form-group{
            width: 40%;
          }
        }
      }

      &__settings{
        color: #0070F4;
        font-size: 14px;
        margin: 0;
        cursor: pointer;
        opacity: 0;
        pointer-events: none;
        transition: all 0.4s;
      }

      &__product{
        display: flex;
        gap: 8px;
        img{
          width: 38px;
          height: 38px !important;
          object-fit: contain;
          border-radius: 5px;
          margin: 0;
        }

        &-text{
          display: flex;
          flex-direction: column;
          margin: 0;
          p{
            margin: 0;
            font-size: 14px;
            font-weight: 400;
            color: #282828;
            line-height: 1;
            text-align: left;
            margin-bottom: 8px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          span{
            font-size: 14px;
            font-weight: 400;
            color: #ADADAD;
            line-height: 1;
            text-align: left;
          }
        }
      }

      &__checkbox{
        text-align: left !important;
      }

      &__table{
        width: 100%;
        margin-top: 24px;

        tbody + tbody{
          border-top: 1px solid #E2E2E2
        }

        tr:hover{
          .table-kenost__settings{
            opacity: 1;
            pointer-events: all;
          }
        }

        td{
          text-align: center;
          padding: 16px 0;
        }

        th{
          padding: 12px;
          background: #F8F7F5;
        }

        td:first-child{
          padding: 0 0 0 12px;
        }

        td:last-child{
          padding: 0 12px 0 0;
        }

        th:first-child{
          border-radius: 5px 0 0 0;
        }

        th:last-child{
          border-radius: 0 5px 0 0;
        }
      }

      &__name{
        color: #5E5E5E;
        font-size: 14px;
        font-weight: 400;
        text-align: center;

        &-checkbox{
          width: 40px;
          text-align: left;
        }

        &-product{
          width: 300px;
          text-align: left;
        }
      }
    }

    .kenost-dropzone{
      border: 2px dashed  #E2E2E2 !important;
      margin-top: 10px
    }

    .kenost-wiget{
        p{
        color: #A0A0A0;
        font-weight: 400;
        font-size: 12px;
        margin: 0;
        }
    }

    .kenost-dropzone__custom{
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24px;

      i{
        font-size: 72px;
        color: #E2E2E2;
      }

      b{
        font-size: 14px;
        margin-top: 18px;
      }

      p{
        color: #A0A0A0;
        font-size: 14px;
        margin: 0;

        span{
          color: #1874CF;
          text-decoration: underline;
        }
      }
    }

    .PickList{
      &__products-selected{
        height: 412px !important;
      }
    }

    .kenots-button-stop{
        cursor: unset;
        position: relative;
        background: #ff000067 !important;
        border: none !important;
        transition: all 0.5s;
        overflow: unset;

        &__text{
            opacity: 0;
            pointer-events: none;
            display: block;
            position: absolute;
            padding: 12px;
            background: #282828;
            white-space: nowrap;
            font-size: 12px;
            font-weight: 400;
            right: 0;
            border-radius: 5px;
            letter-spacing: 0.7px;
            top: calc(-100% - 6px);

            &::before{
                width: 20px;
                height: 20px;
                content: "";
                border-radius: 5px;
                background: #282828;
                position: absolute;
                right: 40px;
                bottom: -8px;
                rotate: 45deg;
            }
            // display: none;
        }

        &:hover{
            .kenots-button-stop__text{
                opacity: 1;
                pointer-events: all;
            }
        }
    }

    .two-colums{
        display: flex;
        gap: 12px;

        .kenost-wiget{
            width: 100%;
        }

        .p-inputnumber{
            width: 100%;
        }
    }

    .kenost-modal-price__flex{
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 24px;
    }

    .kenost-add-button{
        display: flex;
        gap: 8px;
        color: #282828;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.4s;

        &:hover{
            color: #444444;
        }
    }

    .postponement{
        color: #282828;
        font-size: 14px;
        display: flex;
        gap: 12px;

        &__settings{
            color: #0070F4;
            cursor: pointer;
            transition: all 0.4s;

            &:hover{
                color: #3993fa
            }
        }

        &__graph{
            background: #F8F7F5;
            border-radius: 5px;
            padding: 16px;
            width: 370px;
            margin-top: 16px;

            b{
                color: #5E5E5E;
                font-size: 14px;
                line-height: 1.1;
            }

            p{
                color: #282828;
                margin-top: 16px;
                font-size: 14px;
                line-height: 1;
            }
        }
    }
</style>
