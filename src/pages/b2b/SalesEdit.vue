<template>
    <form @submit.prevent="formSubmit" :class="{ loading: loading }">
        <div class="profile-content__title sticky-element">
            <span class="maintitle">Настройка акции</span>
            <div class="buttons_container">
                <RouterLink :to="{ name: 'b2b', params: { id: $route.params.id } }"
                    class="dart-btn dart-btn-secondary btn-padding">Отменить</RouterLink>
                <button @click="actions.active ? this.modal_checking = true : formSubmit(event)" type="button" class="dart-btn dart-btn-primary btn-padding"
                    :class="{ 'dart-btn-loading': loading }" :disabled="loading">
                    Сохранить изменения
                </button>
            </div>
        </div>
        <div>
            <div class="dart-form-group mb-4" :class="{
                error: v$.form.name.$errors.length
            }">
                <span class="ktitle">Наименование акции</span>
                <label for="name">Введите наименование, которое будет отражать смысл вашей акции.</label>
                <input v-model="this.form.name" type="text" name="name" placeholder="Укажите название акции"
                    class="dart-form-control mt-2" />

                <span class="error_desc" v-for="error of v$.form.name.$errors" :key="error.$uid">
                    {{ error.$message }}
                </span>
            </div>

            <div class="dart-form-group mt-2 mb-4" :class="{ error: v$.form.store_id.$errors.length }">
                <span class="ktitle">Склад</span>
                <!-- <label for="name">Введите наименование, которое будет отражать смысл вашей акции</label> -->
                <!-- <input v-model="form.name" type="text" name="name" placeholder="Укажите склад акции" class="dart-form-control"> -->
                <!-- <Dropdown
                @change="updateProducts"
                v-model="this.form.store_id"
                :options="this.stores"
                optionLabel="label"
                optionValue="value"
                placeholder="Выберите склад"
              /> -->
                <MultiSelect @change="updateProducts" v-model="this.form.store_id" :options="this.stores"
                    optionLabel="label" optionValue="value" placeholder="Выберите склад" />

                <span class="error_desc" v-for="error of v$.form.store_id.$errors" :key="error.$uid">
                    {{ error.$message }}
                </span>
            </div>

            <div v-if="this.form.store_id?.length">
                <div class="dart-form-group mb-4">
                    <div class="dart-form-group mb-0">
                        <span class="ktitle">Реклама</span>
                        <div class="flex align-items-center gap-1">
                            <Checkbox v-model="this.create_page_action" inputId="create-page-action"
                                name="create_page_action" value="true" />
                            <label for="create-page-action" class="ml-2 mb-0"> Разместить рекламные баннеры </label>
                        </div>
                    </div>
                    <div class="dart-form-group kenost-action-page pt-3"
                        v-if="this.create_page_action.length != 0">
                        <span class="ktitle">Место размещения баннера/товара</span>
                        <MultiSelect v-model="this.place_action" :options="this.place" optionLabel="name"
                            placeholder="Выберите один или несколько вариантов" class="w-full" />
                    </div>
                    <div class="dart-form-group kenost-action-page pt-3" v-if="this.create_page_action.length != 0">
                        <div class="upload-banner">
                            <div class="upload-banner__text">
                                <span class="ktitle">Баннер</span>
                                <span>Загрузить изображение нужно размером не менее 6824х1996, соблюдая пропорции. Чтобы не
                                    потерялось качество, желательно
                                    загружать изображение в два раза больше указанного размера.</span>
                            </div>
                            <!-- <div class="dart-btn dart-btn-secondary btn-padding">Загрузить</div> -->
                            <FileUpload class="kenost-upload-button" mode="basic" name="banner[]"
                                :url="'/rest/file_upload.php?banner=max'" accept="image/*" :maxFileSize="10000000"
                                @upload="onUpload" :auto="true" chooseLabel="Загрузить" />
                        </div>
                        <div class="upload-banner__image">
                            <img :src="files?.max?.original_href" v-if="files?.max?.original_href" />
                        </div>
                    </div>
                    <!-- <div class="dart-form-group kenost-action-page pt-3" v-if="this.create_page_action.length != 0">
                        <div class="upload-banner">
                            <div class="upload-banner__text">
                                <span class="ktitle">Средний баннер</span>
                                <span>Загрузить изображение нужно размером не менее 532х264, соблюдая пропорции. Чтобы не
                                    потерялось качество, желательно
                                    загружать изображение в три раза больше указанного размера.</span>
                            </div>
                            <FileUpload class="kenost-upload-button" mode="basic" name="banner_small[]"
                                :url="'/rest/file_upload.php?banner=min'" accept="image/*" :maxFileSize="2000000"
                                @upload="onUpload" :auto="true" chooseLabel="Загрузить" />
                        </div>
                        <div class="upload-banner__image">
                            <img :src="files?.min?.original_href" v-if="files?.min?.original_href" />
                        </div>
                    </div>
                    <div class="dart-form-group kenost-action-page pt-3" v-if="this.create_page_action.length != 0">
                        <div class="upload-banner">
                            <div class="upload-banner__text">
                                <span class="ktitle">Малый баннер</span>
                                <span>Загрузить изображение нужно размером не менее 472х52, соблюдая пропорции. Чтобы не
                                    потерялось качество, желательно
                                    загружать изображение в три раза больше указанного размера.</span>
                            </div>
                            <FileUpload class="kenost-upload-button" mode="basic" name="small[]"
                                :url="'/rest/file_upload.php?banner=small'" accept="image/*" :maxFileSize="2000000"
                                @upload="onUpload" :auto="true" chooseLabel="Загрузить" />
                        </div>
                        <div class="upload-banner__image">
                            <img :src="files?.small?.original_href" v-if="files?.small?.original_href" />
                        </div>
                    </div> -->
                    <div class="dart-form-group kenost-action-page pt-3" v-if="this.create_page_action.length != 0">
                        <span class="ktitle">География показа</span>
                        <Dropdown v-model="this.geo_action" :options="this.geo" optionLabel="name"
                            placeholder="География показа" class="w-full md:w-14rem" />
                    </div>
                </div>

                <!-- <div class="dart-form-group mb-4 mt-3">
                    <div class="upload-banner">
                        <div class="upload-banner__text">
                            <span class="ktitle">Иконка</span>
                            <span>Вы можете загрузить свое изображение или выбрать изображение из банка иконок</span>
                        </div>
                        <FileUpload
                            class="kenost-upload-button"
                            mode="basic"
                            name="icon[]"
                            :url="'/rest/file_upload.php?banner=icon'"
                            accept="image/*"
                            :maxFileSize="2000000"
                            @upload="onUpload"
                            :auto="true"
                            chooseLabel="Загрузить" />
                    </div>
                    <div class="upload-icon__image">
                        <img :src="files?.icon?.original_href" v-if="files?.icon?.original_href" />
                    </div>
                </div> -->

                <div class="dart-form-group mb-4">
                    <span class="ktitle">Описание</span>
                    <input v-model="this.form.description" type="text" name="description"
                        placeholder="Укажите описание акции" class="dart-form-control" />
                </div>

                <div class="dart-form-group mb-4">
                    <span class="ktitle">Вознаграждение</span>
                    <input v-model="this.form.award" type="text" name="award" placeholder="Укажите вознаграждение"
                        class="dart-form-control" />
                </div>

                <div class="dart-form-group mb-3">
                    <span class="ktitle">Совместимость скидок</span>
                    <span class="field-desc">Выберите совместимость скидок. При выборе совместимости, Вам будет
                        предложено выбрать режим совместимости.</span>
                    <div class="flex align-items-center gap-1 mt-3">
                        <RadioButton v-model="this.form.compatibilityDiscount" inputId="compatibilityDiscount-1"
                            name="compatibilityDiscount" value="1" />
                        <label for="compatibilityDiscount-1" class="ml-2 radioLabel">Совместима со всеми акциями</label>
                    </div>
                    <div class="flex align-items-center gap-1 mt-3">
                        <RadioButton v-model="this.form.compatibilityDiscount" inputId="compatibilityDiscount-2"
                            name="compatibilityDiscount" value="2" />
                        <label for="compatibilityDiscount-2" class="ml-2 radioLabel">Не совместима со всеми
                            акциями</label>
                    </div>
                    <div class="flex align-items-center gap-1 mt-3">
                        <RadioButton v-model="this.form.compatibilityDiscount" inputId="compatibilityDiscount-3"
                            name="compatibilityDiscount" value="3" />
                        <label for="compatibilityDiscount-3" class="ml-2 radioLabel">Не совместима с выбранными
                            акциями</label>
                    </div>
                    <div class="flex align-items-center gap-1 mt-3">
                        <RadioButton v-model="this.form.compatibilityDiscount" inputId="compatibilityDiscount-4"
                            name="compatibilityDiscount" value="4" />
                        <label for="compatibilityDiscount-4" class="ml-2 radioLabel">Совместима с выбранными
                            акциями</label>
                    </div>
                </div>
                <!--
              <div v-if="this.form.compatibilityDiscount == '1'" class="flex align-items-center kenost-gray-p mb-3">
                <Checkbox v-model="this.form.actionLast" inputId="actionLast-1" name="actionLast-1" value="true" />
                <label for="actionLast-1" class="ml-2 mb-0">Применяется последней (от стоимости товара по всем акциям)</label>
              </div>
              -->
                <div class="dart-form-group mt-4"
                    v-if="this.form.compatibilityDiscount == 3 || this.form.compatibilityDiscount == 4">
                    <label>Выберите акции из списка</label>
                    <MultiSelect :key="new Date().getMilliseconds()" filter v-model="this.form.bigDiscount"
                        display="chip" :options="this.allAction" optionLabel="name" placeholder="Выберите из списка"
                        class="w-full md:w-20rem kenost-multiselect" />
                </div>
                <div class="dart-form-group mt-4"
                    v-if="this.form.compatibilityDiscount == 1 || this.form.compatibilityDiscount == 3 || this.form.compatibilityDiscount == 4">
                    <label>Выберите режим совместимости</label>
                    <Dropdown v-model="this.form.compabilityMode" :options="this.compabilityMode" optionLabel="name"
                        placeholder="Режим совместимости" class="w-full md:w-14rem" />
                </div>

                <div class="dart-form-group mb-4">
                    <span class="ktitle">Совместимость отсрочек</span>
                    <span class="field-desc">Выберите совместимость отсрочек. При выборе совместимости, Вам будет
                        предложено выбрать режим совместимости.</span>
                    <div class="flex align-items-center gap-1 mt-3">
                        <RadioButton v-model="this.form.compatibilityPost" inputId="compatibilityPost-1"
                            name="compatibilityPost" value="1" />
                        <label for="compatibilityPost-1" class="ml-2 radioLabel">Совместима со всеми акциями</label>
                    </div>
                    <div class="flex align-items-center gap-1 mt-3">
                        <RadioButton v-model="this.form.compatibilityPost" inputId="compatibilityPost-2"
                            name="compatibilityPost" value="2" />
                        <label for="compatibilityPost-2" class="ml-2 radioLabel">Не совместима со всеми акциями</label>
                    </div>
                    <div class="flex align-items-center gap-1 mt-3">
                        <RadioButton v-model="this.form.compatibilityPost" inputId="compatibilityPost-3"
                            name="compatibilityPost" value="3" />
                        <label for="compatibilityPost-3" class="ml-2 radioLabel">Не совместима с выбранными
                            акциями</label>
                    </div>
                    <div class="flex align-items-center gap-1 mt-3">
                        <RadioButton v-model="this.form.compatibilityPost" inputId="compatibilityPost-4"
                            name="compatibilityPost" value="4" />
                        <label for="compatibilityPost-4" class="ml-2 radioLabel">Совместима с выбранными акциями</label>
                    </div>
                </div>

                <div class="dart-form-group mt-4"
                    v-if="this.form.compatibilityPost == 3 || this.form.compatibilityPost == 4">
                    <label>Выберите акции из списка</label>
                    <MultiSelect filter v-model="this.form.bigPost" display="chip" :options="this.allAction"
                        optionLabel="name" placeholder="Выберите из списка"
                        class="w-full md:w-20rem kenost-multiselect" />
                </div>

                <div class="dart-form-group mt-4"
                    v-if="this.form.compatibilityPost == 1 || this.form.compatibilityPost == 3 || this.form.compatibilityPost == 4">
                    <label>Выберите режим совместимости</label>
                    <Dropdown v-model="this.form.compabilityModePost" :options="this.compabilityModePost"
                        optionLabel="name" placeholder="Режим совместимости" class="w-full md:w-14rem" />
                </div>

                <div class="dart-form-group mb-4" :class="{ error: v$.form.dates.$errors.length }">
                    <span class="ktitle">Даты проведения</span>
                    <Calendar v-model="this.form.dates" selectionMode="range" placeholder="Выберите даты"
                        :manualInput="false" showIcon />

                    <span class="error_desc" v-for="error of v$.form.dates.$errors" :key="error.$uid">
                        {{ error.$message }}
                    </span>
                </div>

                <div class="dart-form-group mb-4">
                    <span class="ktitle">Срок отгрузки товаров</span>
                    <div class="flex align-items-center gap-1 mt-3">
                        <RadioButton v-model="this.form.typeShipment" inputId="typeShipment-1" name="typeShipment"
                            value="1" />
                        <label for="typeShipment-1" class="ml-2 radioLabel">Определяется данными из отгрузок</label>
                    </div>
                    <div class="flex align-items-center gap-1 mt-3">
                        <RadioButton v-model="this.form.typeShipment" inputId="typeShipment-2" name="typeShipment"
                            value="2" />
                        <label for="typeShipment-2" class="ml-2 radioLabel">Определяется по расчету доставки ТК</label>
                    </div>
                    <div class="flex align-items-center gap-1 mt-3">
                        <RadioButton v-model="this.form.typeShipment" inputId="typeShipment-3" name="typeShipment"
                            value="3" />
                        <label for="typeShipment-3" class="ml-2 radioLabel">Рассчитывается ТК от выбранной даты
                            отгрузки</label>
                    </div>

                    <Calendar class="mt-3" v-if="this.form.typeShipment == 3" v-model="this.form.dateShipment"
                        placeholder="Выберите ближайшую дату отгрузки" :manualInput="false" showIcon />
                </div>

                <div class="dart-form-group mb-4">
                    <span class="ktitle">Условия оплаты доставки</span>
                    <div class="kenost-wiget">
                        <p>Плательщик</p>
                        <Dropdown v-model="this.form.paymentDelivery" :options="this.paymentDelivery" optionLabel="name"
                            placeholder="Оплата доставки" class="w-full md:w-14rem" />
                    </div>
                    <div class="two-colums mt-2">
                        <div class="kenost-wiget">
                            <p>Выберите условие оплаты доставки</p>
                            <Dropdown v-model="this.form.conditionPaymentDelivery"
                                :options="this.conditionPaymentDelivery" optionLabel="name"
                                placeholder="Оплата доставки" class="w-full md:w-14rem" />
                        </div>
                        <div class="kenost-wiget">
                            <p v-if="this.form.conditionPaymentDelivery.key == 1">Минимальная общая сумма заказа в ₽</p>
                            <p v-if="this.form.conditionPaymentDelivery.key == 2">Минимальное количество товаров в шт
                            </p>
                            <!-- <input
                                v-if="this.form.conditionPaymentDelivery.key == 1 || this.form.conditionPaymentDelivery.key == 2"
                                v-model="this.form.conditionPaymentDeliveryValue" type="text" name="description"
                                class="dart-form-control" /> -->

                            <InputNumber 
                                v-if="this.form.conditionPaymentDelivery.key == 1 || this.form.conditionPaymentDelivery.key == 2"
                                v-model="this.form.conditionPaymentDeliveryValue" inputId="horizontal-buttons" :step="0.1"
                                min="0" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" />
                        </div>
                    </div>
                </div>

                <div class="dart-form-group mb-4">
                    <span class="ktitle">Отсрочка</span>
                    <div class="postponement">
                        Срок отсрочки платежа: {{ this.postponement_period }} дней
                        <div class="postponement__settings" @click="this.modals.delay = !this.modals.delay">Настроить
                        </div>
                    </div>
                    <div class="postponement__graph">
                        <b>График платежей</b>
                        <p v-for="item in this.form.delay" :key="item.id">— {{ item.percent }}% через {{ item.day }}
                            дней после отгрузки</p>
                    </div>
                    <div class="two-colums mt-2">
                        <div class="kenost-wiget">
                            <p>Выберите условие отсрочки</p>
                            <Dropdown v-model="this.form.postponementConditions" :options="this.postponementConditions"
                                optionLabel="name" placeholder="Оплата доставки" class="w-full md:w-14rem" />
                        </div>
                        <div class="kenost-wiget">
                            <p v-if="this.form.postponementConditions.key == 1">Минимальная общая сумма заказа в ₽</p>
                            <p v-if="this.form.postponementConditions.key == 2">Минимальное количество товаров в шт</p>
                            <!-- <input
                                v-if="this.form.postponementConditions.key == 1 || this.form.postponementConditions.key == 2"
                                v-model="this.form.postponementConditionsValue" type="text" name="description"
                                class="dart-form-control" /> -->
                            <InputNumber 
                                v-if="this.form.postponementConditions.key == 1 || this.form.postponementConditions.key == 2"
                                v-model="this.form.postponementConditionsValue" inputId="horizontal-buttons" :step="0.1"
                                min="0" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" />
                        </div>
                    </div>
                </div>

                <div class="dart-form-group mb-4">
                    <span class="ktitle">Условие акции</span>
                    <div class="kenost-wiget">
                        <Dropdown v-model="this.form.condition" :options="this.condition" optionLabel="name"
                            placeholder="Оплата доставки" class="w-full md:w-14rem" />
                    </div>
                    <div class="two-colums mt-2" v-if="this.form.condition.key != 0">
                        <div class="kenost-wiget">
                            <p>Минимальная общая сумма</p>
                            <InputNumber v-model="this.form.conditionMinSum" inputId="horizontal-buttons-sum"
                                :step="0.1" min="0" incrementButtonIcon="pi pi-plus"
                                decrementButtonIcon="pi pi-minus" />
                        </div>
                        <div class="kenost-wiget">
                            <p>Минимальное общее кол-во SKU</p>
                            <InputNumber v-model="this.form.conditionMinCount" inputId="horizontal-buttons" :step="0.1"
                                min="0" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" />
                        </div>
                        <div class="kenost-wiget">
                            <p>Минимальное общее кол-во товаров</p>
                            <InputNumber v-model="this.form.conditionMinGeneralCount" inputId="horizontal-buttons" :step="0.1"
                                min="0" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" />
                        </div>
                    </div>
                </div>

                <div class="dart-form-group" v-if="this.form.condition.key == 2 || this.form.condition.key == 5">
                    <span class="ktitle">Выбор подарков</span>
                </div>

                <div v-if="this.form.condition.key == 2 || this.form.condition.key == 5"
                    class="PickList mt-1 mb-3 PickList__mini">
                    <div class="PickList__product" :style="{ width: '40%' }">
                        <b class="PickList__title">Доступные товары</b>
                        <div class="PickList__filters">
                            <div class="form_input_group input_pl input-parent required">
                                <input type="text" id="filter_name" placeholder="Введите артикул или название"
                                    class="dart-form-control" v-model="filterGift.name"
                                    @input="setFilterGift('filter')" />
                                <label for="product_filter_name" class="s-complex-input__label">Введите артикул или
                                    название</label>
                                <div class="form_input_group__icon">
                                    <i class="d_icon d_icon-search"></i>
                                </div>
                            </div>
                            <div class="dart-form-group">
                                <TreeSelect v-model="this.filterGift.category" :options="this.opt_catalog_tree"
                                    selectionMode="checkbox" placeholder="Выберите категорию" class="w-full"
                                    @change="setFilterGift" />
                            </div>
                        </div>
                        <div class="PickList__products">
                            <div class="PickList__el" v-for="item in this.productsGift" :key="item.id">
                                <img :src="item.image" alt="" />
                                <div class="PickList__product-info">
                                    <div class="PickList__name">{{ item.name }}</div>
                                    <div class="PickList__article">{{ item.article }}</div>
                                    <div class="PickList__price">{{ Number(item.price).toFixed(0) }} ₽</div>
                                </div>
                                <div @click="selectGift(item.id)" class="PickList__select"><i
                                        class="pi pi-angle-right"></i></div>
                            </div>
                            <paginate :page-count="pagesCountGift" :click-handler="pagClickCallbackGift"
                                :prev-text="'Пред'" :next-text="'След'"
                                :container-class="'pagination justify-content-center'" :initialPage="this.pageGift"
                                :forcePage="this.pageGift">
                            </paginate>
                        </div>
                    </div>

                    <div class="PickList__selected" :style="{ width: '40%' }">
                        <div class="PickList__title mb-4">
                            <b>Выбранные подарки</b>
                            <b style="margin-right: 63px">Количество</b>
                        </div>
                        <div class="PickList__products PickList__products-selected">
                            <div class="PickList__el" v-for="item in this.selectedGift" :key="item.id">
                                <img :src="item.image" alt="" />
                                <div class="PickList__info">
                                    <div class="PickList__product-info off">
                                        <div class="PickList__name">{{ item.name }}</div>
                                        <div class="PickList__article">{{ item.article }}</div>
                                        <div class="PickList__price">{{ Number(item.price).toFixed(0) }} ₽</div>
                                    </div>
                                    <InputNumber style="width: 100px" v-model="item.multiplicity"
                                        inputId="horizontal-buttons" :step="1" min="0" incrementButtonIcon="pi pi-plus"
                                        decrementButtonIcon="pi pi-minus" />
                                </div>
                                <div @click="deleteSelectGift(item.id)" class="PickList__select"><i
                                        class="pi pi-times"></i></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- <div class="dart-form-group mb-4">
                <div class="flex align-items-center gap-1">
                  <Checkbox v-model="this.form.not_sale_client" inputId="not_sale_client-1" name="not_sale_client-1" value="true" />
                  <label for="not_sale_client-1" class="ml-2 mb-0">Не действует скидка клиента</label>
                </div>
              </div> -->

                <div class="dart-form-group picker-wrap">
                    <span class="ktitle">Добавление товаров</span>
                    <div class="flex align-items-center gap-1 mt-2">
                        <RadioButton v-model="this.form.addProductType" inputId="addProductType-1" name="addProductType"
                            value="1" />
                        <label for="addProductType-1" class="ml-2 radioLabel">Добавить товары</label>
                    </div>
                    <div class="flex align-items-center gap-1 mt-3">
                        <RadioButton v-model="this.form.addProductType" inputId="addProductType-2" name="addProductType"
                            value="2" />
                        <label for="addProductType-2" class="ml-2 radioLabel">Загрузить товары файлом</label>
                    </div>
                    <div class="flex align-items-center gap-1 mt-3">
                        <RadioButton v-model="this.form.addProductType" inputId="addProductType-3" name="addProductType"
                            value="3" />
                        <label for="addProductType-3" class="ml-2 radioLabel">Добавить комплекты</label>
                    </div>
                </div>

                <div v-if="this.form.addProductType == '1'" class="PickList mt-3">
                    <div class="PickList__product" :style="{ width: '40%' }">
                        <b class="PickList__title">Доступные товары</b>
                        <div class="PickList__filters">
                            <div class="form_input_group input_pl input-parent required">
                                <input type="text" id="filter_name" placeholder="Введите артикул или название"
                                    class="dart-form-control" v-model="filter.name" @input="setFilter('filter')" />
                                <label for="product_filter_name" class="s-complex-input__label">Введите артикул или
                                    название</label>
                                <div class="form_input_group__icon">
                                    <i class="d_icon d_icon-search"></i>
                                </div>
                            </div>
                            <div class="dart-form-group">
                                <TreeSelect v-model="this.filter.category" :options="this.opt_catalog_tree"
                                    selectionMode="checkbox" placeholder="Выберите категорию" class="w-full"
                                    @change="setFilter" />
                            </div>
                        </div>
                        <div class="PickList__products">
                            <div class="PickList__el" v-for="item in this.products" :key="item.id">
                                <img :src="item.image" alt="" />
                                <div class="PickList__product-info">
                                    <div class="PickList__name">{{ item.name }}</div>
                                    <div class="PickList__article">
                                        {{ item.article }} <span class="store-name-b2b"
                                            :style="{ background: item.color }">{{ item.store }}</span>
                                    </div>
                                    <div class="PickList__price">{{ Number(item.price).toFixed(0) }} ₽</div>
                                </div>
                                <div @click="select(item.id)" class="PickList__select"><i class="pi pi-angle-right"></i>
                                </div>
                            </div>
                            <paginate :page-count="pagesCount" :click-handler="pagClickCallback" :prev-text="'Пред'"
                                :next-text="'След'" :container-class="'pagination justify-content-center'"
                                :initialPage="this.page" :forcePage="this.page">
                            </paginate>
                        </div>
                    </div>

                    <div class="PickList__buttons">
                        <div class="PickList__select" @click="setAllProducts(true)"><i
                                class="pi pi-angle-double-right"></i></div>
                        <div class="PickList__select mt-2" @click="setAllProducts(false)"><i
                                class="pi pi-angle-double-left"></i></div>
                    </div>

                    <div :style="{ width: '40%' }">
                        <div class="PickList__selected">
                            <div class="PickList__title mb-4">
                                <b>Добавленные товары</b>
                            </div>
                            <div class="PickList__products PickList__products-selected">
                                <div class="PickList__el" v-for="item in this.selected" :key="item.id">
                                    <img :src="item.image" alt="" />
                                    <div class="PickList__info">
                                        <div class="PickList__product-info off">
                                            <div class="PickList__name">{{ item.name }}</div>
                                            <div class="PickList__article">
                                                {{ item.article }}
                                                <span class="store-name-b2b" :style="{ background: item.color }">{{
                                                    item.store }}</span>
                                            </div>
                                            <div class="PickList__price">{{ Number(item.price).toFixed(0) }} ₽</div>
                                        </div>
                                    </div>
                                    <div @click="deleteSelect(item.id)" class="PickList__select"><i
                                            class="pi pi-times"></i></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="this.form.addProductType == '2'" class="dart-form-group mb-4">
                    <DropZone v-if="!this.upload_product" class="kenost-dropzone" :maxFiles="Number(1)"
                        url="/rest/file_upload.php?upload_products=xlsx" :uploadOnDrop="true" :multipleUpload="true"
                        :acceptedFiles="['xlsx', 'xlsx']" :parallelUpload="1" @sending="parseFile" v-bind="args">
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
                            <!-- <img src="../../../public/img/files/xls.png" alt=""> -->
                            <a targer="_blank" :href="files?.xlsx?.original_href">{{ files?.xlsx?.name }}</a>
                        </div>
                        <div class="kenost-upload-xlsx__info">
                            <p>Загружено товаров: {{ Object.keys(this.selected).length }} шт</p>
                            <p>Всего товаров: {{ Object.keys(this.selected).length + error_product.length }} шт</p>
                            <div class="kenost-link-blue" @click="this.modals.error_product = true">Список незагруженных
                                товаров</div>
                        </div>
                    </div>

                    <a :href="site_url_prefix + '/assets/files/files/examples/ExampleLoadingProducts.xlsx'"
                        class="kenost-link-blue mt-2" target="_blank">Скачать шаблон файла</a>
                </div>

                <div v-if="this.form.addProductType == '3'" class="PickList mt-3">
                    <div class="PickList__product" :style="{ width: '40%' }">
                        <b class="PickList__title">Ваши комплекты</b>
                        <div class="PickList__filters">
                            <div class="form_input_group input_pl input-parent required">
                                <input type="text" id="filter_name" placeholder="Введите артикул или название"
                                    class="dart-form-control" v-model="this.filter_complects"
                                    @input="setFilterComplects()" />
                                <label for="product_filter_name" class="s-complex-input__label">Введите название</label>
                                <div class="form_input_group__icon">
                                    <i class="d_icon d_icon-search"></i>
                                </div>
                            </div>
                        </div>
                        <div class="PickList__products">
                            <div class="PickList__el" v-for="item in this.complects" :key="item.id">
                                <img :src="item.image" alt="" />
                                <div class="PickList__product-info">
                                    <div class="PickList__name">{{ item.name }}</div>
                                    <div class="PickList__article">{{ item.articles }}</div>
                                    <div class="PickList__price">{{ Number(item.cost).toFixed(0) }} ₽</div>
                                </div>
                                <div @click="selectComplect(item.id)" class="PickList__select"><i
                                        class="pi pi-angle-right"></i></div>
                            </div>
                            <!-- <paginate
                              :page-count="pagesCount"
                              :click-handler="pagClickCallback"
                              :prev-text="'Пред'"
                              :next-text="'След'"
                              :container-class="'pagination justify-content-center'"
                              :initialPage="this.page"
                              :forcePage="this.page"
                          >
                          </paginate> -->
                        </div>
                    </div>

                    <div class="PickList__selected" :style="{ width: '40%' }">
                        <div class="PickList__title mb-4">
                            <b>Добавленные комплекты</b>
                        </div>
                        <div class="PickList__products PickList__products-selected">
                            <div class="PickList__el" v-for="(item, index) in this.selected_complects" :key="item.id">
                                <img :src="item.image" alt="" />
                                <div class="PickList__info">
                                    <div class="PickList__product-info off">
                                        <div class="PickList__name">{{ item.name }}</div>
                                        <div class="PickList__article">{{ item.articles }}</div>
                                        <div class="PickList__price">{{ Number(item.cost).toFixed(0) }} ₽</div>
                                    </div>
                                </div>
                                <div @click="deleteSelectComplect(item.id)" class="PickList__select"><i
                                        class="pi pi-times"></i></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="this.form.addProductType != '3'" class="table-kenost mt-4">
                    <p class="table-kenost__title">Таблица добавленных товаров</p>
                    <div class="table-kenost__filters">
                        <div class="table-kenost__filters-left">
                            <div class="form_input_group input_pl input-parent required">
                                <input type="text" id="filter_table" placeholder="Введите артикул или название"
                                    class="dart-form-control" v-model="filter_table.name"
                                    @input="setFilter('filter')" />
                                <label for="product_filter_name" class="s-complex-input__label">Введите артикул или
                                    название</label>
                                <div class="form_input_group__icon">
                                    <i class="d_icon d_icon-search"></i>
                                </div>
                            </div>
                            <div class="dart-form-group">
                                <TreeSelect label="name" v-model="this.filter_table.category"
                                    :options="this.opt_catalog_tree" selectionMode="checkbox"
                                    placeholder="Выберите категорию" class="w-full" @change="setFilter" />
                            </div>
                        </div>
                        <!-- <div @click="createSet" class="dart-btn dart-btn-primary btn-padding">Создать комплект</div> -->
                    </div>
                    <table class="table-kenost__table">
                        <thead>
                            <tr>
                                <th class="table-kenost__name table-kenost__name-checkbox">
                                    <Checkbox @update:modelValue="kenostTableCheckedAll" v-model="this.kenost_table_all"
                                        inputId="kenost_table_all" value="1" />
                                </th>
                                <th class="table-kenost__name table-kenost__name-product">Товар</th>
                                <th class="table-kenost__name">РРЦ (₽)</th>
                                <th class="table-kenost__name">Скидка %</th>
                                <th class="table-kenost__name">Цена со скидкой за шт.</th>
                                <th class="table-kenost__name">
                                    Минимальное <br />
                                    количество
                                </th>
                                <th class="table-kenost__name">Кратность</th>
                                <th class="table-kenost__name">Сумма</th>
                                <th class="table-kenost__name">Действие</th>
                            </tr>
                        </thead>
                        <!-- Вывод комплектов -->
                        <tbody v-for="item in this.selected_visible" :key="item.id">
                            <tr v-if="this.complects_ids.indexOf(item.id) === -1">
                                <td class="table-kenost__checkbox">
                                    <Checkbox @change="kenostTableCheckedAllCheck" v-model="this.kenost_table"
                                        inputId="kenost_table" :value="item.id" />
                                </td>
                                <td class="table-kenost__product">
                                    <img :src="item.image" />
                                    <div class="table-kenost__product-text">
                                        <p>{{ item.name }}</p>
                                        <span>{{ item.article }}
                                            <span class="store-name-b2b" :style="{ background: item.color }">{{
                                                item.store
                                                }}</span></span>
                                    </div>
                                </td>
                                <td>{{ Number(item.price).toFixed(2).toLocaleString('ru') }} ₽</td>
                                <td>
                                    {{ Number(this.selected_data[item.id]?.finalPrice) > Number(item.price) ? 
                                        this.selected_data[item.id]? (Number(this.selected_data[item.id].discountInterest) * -1).toFixed(2).toLocaleString('ru') : Number(0.0).toFixed(2)
                                        :
                                        this.selected_data[item.id]? Number(this.selected_data[item.id].discountInterest).toFixed(2).toLocaleString('ru') : Number(0.0).toFixed(2)
                                    }}
                                </td>
                                <td>
                                    {{
                                        this.selected_data[item.id]
                                            ? Number(this.selected_data[item.id]?.finalPrice).toFixed(2).toLocaleString('ru')
                                            : item.price.toLocaleString('ru')
                                    }}
                                    ₽
                                    <p class="table-kenost__settings" @click="settings(item, true)">Настроить</p>
                                </td>
                                <td v-if="this.selected_data[item.id]">
                                    <Counter class="margin-auto" @ElemCount="ElemMinCount" :item="item" :id="item.id"
                                        :min="1" :value="this.selected_data[item.id].min_count"
                                        :key="new Date().getMilliseconds() + item.id" />
                                </td>
                                <td v-else>
                                    <Counter class="margin-auto" @ElemCount="ElemMinCount" :item="item" :id="item.id"
                                        :min="1" :value="1" />
                                </td>
                                <td v-if="this.selected_data[item.id]">
                                    <Counter class="margin-auto" @ElemCount="ElemCount" :item="item" :id="item.id"
                                        :min="1" :value="this.selected_data[item.id].multiplicity"
                                        :key="new Date().getMilliseconds() + item.id" />
                                </td>
                                <td v-else>
                                    <Counter class="margin-auto" @ElemCount="ElemCount" :item="item" :id="item.id"
                                        :min="1" :value="1" />
                                </td>
                                <td>
                                    {{
                                        this.selected_data[item.id]
                                            ? (Number(this.selected_data[item.id].finalPrice) *
                                                this.selected_data[item.id].multiplicity).toFixed(2)
                                            : item.price.toLocaleString('ru')
                                    }}
                                    ₽
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
                    <paginate :page-count="pagesCountSelect" :click-handler="pagClickCallbackSelect" :prev-text="'Пред'"
                        :next-text="'След'" :container-class="'pagination justify-content-center'"
                        :initialPage="this.page_selected" :forcePage="this.page_selected">
                    </paginate>
                    <div class="table-kenost-help">
                        <div class="table-kenost-help__select">
                            <span>Отмечено:</span> {{ this.kenost_table.length }} / {{ Object.keys(this.selected).length}}
                        </div>
                        <div class="flex align-items-center gap-1">
                            <Checkbox @change="globalTable" v-model="this.form.global_kenost_table"
                                inputId="global_kenost_table-1" name="global_kenost_table-1" value="true" />
                            <label for="global_kenost_table-1" class="ml-1 mb-0">Все</label>
                        </div>
                        <div v-if="filter_table.name != ''" class="flex align-items-center gap-1">
                            <Checkbox @change="filterglobalTable" v-model="this.form.filter_kenost_table"
                                inputId="global_kenost_table-2" name="global_kenost_table-2" value="true" />
                            <label for="global_kenost_table-2" class="ml-1 mb-0">Отметить подходящие по фильтру</label>
                        </div>
                    </div>
                </div>

                <div class="kenost-all-table-activity"
                    v-if="this.form.addProductType == '1' || this.form.addProductType == '2'">
                    <div class="kenost-wiget">
                        <p>Массовое действие</p>
                        <Dropdown v-model="this.kenostActivityAll.type" :options="this.massAction" optionLabel="name"
                            placeholder="Массовое действие" class="w-full md:w-14rem" />
                    </div>

                    <div class="kenost-wiget" v-if="this.kenostActivityAll.type.key == 0">
                        <p>Тип ценообразования</p>
                        <Dropdown
                            @change="setDiscountFormulMas()"
                            v-model="this.kenostActivityAll.typePricing"
                            :options="this.typePricing" optionLabel="name"
                            class="w-full md:w-14rem" />
                    </div>

                    <div class="kenost-wiget"
                        v-if="(this.kenostActivityAll.type.key == 0 && this.kenostActivityAll?.typePricing?.key !=2) || this.kenostActivityAll.type.key == 1">
                        <p>Тип цен</p>
                        <Dropdown v-model="this.kenostActivityAll.typePrice" :options="this.typePrice"
                            optionLabel="name" placeholder="Тип цен" class="w-full md:w-14rem" />
                    </div>
                    <div class="kenost-wiget"
                        v-if="this.kenostActivityAll.type.key == 0">
                        <p>Значение</p>
                        <InputNumber v-model="this.kenostActivityAll.value" inputId="horizontal-buttons" :step="1"
                            min="0" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" />
                    </div>
                    <div class="kenost-wiget"
                        v-if="this.kenostActivityAll.type.key == 0">
                        <p>&nbsp;</p>
                        <Dropdown :disabled="this.kenostActivityAll?.typePricing?.key != 2" v-model="kenostActivityAll.typeFormul" :options="this.typeFormul" optionLabel="name"
                            class="w-full md:w-14rem" />
                    </div>

                    <div class="kenost-wiget"
                        v-if="this.kenostActivityAll.type.key == 3">
                        <p>Значение</p>
                        <InputNumber v-model="this.kenostActivityAll.multiplicity" inputId="horizontal-buttons"
                            :step="1" min="1" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" />
                    </div>

                    <div v-if="
                        this.kenostActivityAll.type.key == 0 ||
                        this.kenostActivityAll.type.key == 1 ||
                        this.kenostActivityAll.type.key == 2 ||
                        this.kenostActivityAll.type.key == 3
                    " @click="massActionTable" class="dart-btn dart-btn-primary mt-3">
                        <i class="pi pi-check"></i>
                    </div>
                </div>

                <div class="dart-form-group mt-4 flex">
                    <span class="ktitle">Коллекции</span>
                    <div>
                        <button @click="this.modals.add_group = true" type="button" class="dart-btn dart-btn-primary  flex gap-2 align-items-center">
                            <i class="pi pi-upload"></i><div>Добавить коллекцию</div>
                        </button>
                    </div>
                </div>
                <TabView class="tab-custom hidden-mobile-l mt-3 kenost-tab-custom">
                    <TabPanel v-for="el in this.action_groups">
                        <template #header>
                            {{ el.group.name }}
                            <Badge class="ml-2" :value="el?.products?.total"></Badge>
                        </template>
                        <div class="table-kenost mt-4">
                            <div class="flex align-items-center justify-between">
                                <p class="table-kenost__title">Товары коллекции «{{ el.group.name }}»</p>
                                <button @click="deleteGroup(el.group.id)" type="button" class="dart-btn dart-btn-secondary btn-padding flex gap-2 align-items-center">
                                    <i class="pi pi-trash"></i><div>Удалить коллекцию</div>
                                </button>
                            </div>
                            <div class="table-kenost__filters">
                                <div class="table-kenost__filters-left">
                                    <div class="form_input_group input_pl input-parent required">
                                        <input type="text" id="filter_table" placeholder="Введите артикул или название"
                                            class="dart-form-control" v-model="el.search"
                                            @input="setFilterGroup(el.group.id)" />
                                        <label for="product_filter_name" class="s-complex-input__label">Введите артикул или
                                            название</label>
                                        <div class="form_input_group__icon">
                                            <i class="d_icon d_icon-search"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <table class="table-kenost__table mt-0">
                                <thead>
                                    <tr>
                                        <th class="table-kenost__name table-kenost__name-checkbox hidden">
                                            <Checkbox @update:modelValue="kenostTableCheckedAll" v-model="this.kenost_table_all"
                                                inputId="kenost_table_all" value="1" />
                                        </th>
                                        <th class="table-kenost__name table-kenost__name-product">Товар</th>
                                        <th class="table-kenost__name">Тип добавления</th>
                                        <th class="table-kenost__name">Бренд</th>
                                        <th class="table-kenost__name">РРЦ</th>
                                        <th class="table-kenost__name">
                                            Скидка \ Наценка </br> <div class="text-primary cursor-pointer" @click="() => {
                                                this.modals.price_group = true
                                                this.modals.group_id = el.group.id
                                                
                                            }">Настроить</div>
                                        </th>
                                        <th class="table-kenost__name">Тип ценообразования</th>
                                        <th class="table-kenost__name">Цена со скидкой за шт.</th>
                                    </tr>
                                </thead>
                                <!-- Вывод комплектов -->
                                <tbody v-for="item in el?.products?.items" :key="item.id">
                                    <tr>
                                        <td class="table-kenost__checkbox hidden">
                                            <Checkbox @change="kenostTableCheckedAllCheck" v-model="this.kenost_table"
                                                inputId="kenost_table" :value="item.id" />
                                        </td>
                                        <td class="table-kenost__product">
                                            <img :src="item.image" />
                                            <div class="table-kenost__product-text">
                                                <p>{{ item.name }}</p>
                                                <span>{{ item.article }}
                                                    <span class="store-name-b2b" :style="{ background: item.color }">{{item.store}}</span></span>
                                            </div>
                                        </td>
                                        <td>
                                            {{ item.type }}
                                        </td>
                                        <td>
                                            {{ item.brand }}
                                        </td>
                                        <td>
                                            {{ item.price }}
                                        </td>
                                        <td>
                                            {{ item.price > 0 ? ((Math.round(((item.price - item.new_price) / item.price) * 10000) / 100) + '%') : '0' }}
                                        </td>
                                        <td>
                                            {{ el.typePricing?.name }}
                                        </td>
                                        <td>
                                            {{(Number(item.new_price)).toFixed(2)}}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <paginate
                                :page-count="(this.action_groups[el.group.id]?.products?.total / this.action_groups[el.group.id]?.perpage) > 0 ? Math.ceil(this.action_groups[el.group.id]?.products?.total / this.action_groups[el.group.id]?.perpage) : 1"
                                :click-handler="(page) => pagClickCallbackGroup(page, el.group.id)"
                                :prev-text="'Пред'"
                                :next-text="'След'"
                                :container-class="'pagination justify-content-center'"
                                :initialPage="this.page_selected"
                                :forcePage="el.page"
                            >
                            </paginate>
                            <!-- <div class="table-kenost-help">
                                <div class="table-kenost-help__select">
                                    <span>Отмечено:</span> {{ this.kenost_table.length }} / {{ Object.keys(this.selected).length}}
                                </div>
                                <div class="flex align-items-center gap-1">
                                    <Checkbox @change="globalTable" v-model="this.form.global_kenost_table"
                                        inputId="global_kenost_table-1" name="global_kenost_table-1" value="true" />
                                    <label for="global_kenost_table-1" class="ml-1 mb-0">Все</label>
                                </div>
                                <div v-if="filter_table.name != ''" class="flex align-items-center gap-1">
                                    <Checkbox @change="filterglobalTable" v-model="this.form.filter_kenost_table"
                                        inputId="global_kenost_table-2" name="global_kenost_table-2" value="true" />
                                    <label for="global_kenost_table-2" class="ml-1 mb-0">Отметить подходящие по фильтру</label>
                                </div>
                            </div> -->
                        </div>
                    </TabPanel>
                </TabView>
                

                <div class="dart-form-group mt-4">
                    <span class="ktitle">Участники</span>
                    <div class="flex align-items-center gap-1 mt-2">
                        <RadioButton v-model="this.form.participantsType" inputId="participantsType-1"
                            name="participantsType" value="1" />
                        <label for="participantsType-1" class="ml-2 radioLabel">Выбрать регион</label>
                    </div>
                    <div class="flex align-items-center gap-1 mt-3">
                        <RadioButton v-model="this.form.participantsType" inputId="participantsType-2"
                            name="participantsType" value="2" />
                        <label for="participantsType-2" class="ml-2 radioLabel">Выбрать отдельные компании</label>
                    </div>
                    <div class="flex align-items-center gap-1 mt-3">
                        <RadioButton v-model="this.form.participantsType" inputId="participantsType-4"
                            name="participantsType" value="4" />
                        <label for="participantsType-4" class="ml-2 radioLabel">Исключить регионы</label>
                    </div>
                    <div class="flex align-items-center gap-1 mt-3">
                        <RadioButton v-model="this.form.participantsType" inputId="participantsType-5"
                            name="participantsType" value="5" />
                        <label for="participantsType-5" class="ml-2 radioLabel">Исключить отдельные компании</label>
                    </div>
                    <div class="flex align-items-center gap-1 mt-3">
                        <RadioButton v-model="this.form.participantsType" inputId="participantsType-3"
                            name="participantsType" value="3" />
                        <label for="participantsType-3" class="ml-2 radioLabel">Неограниченный круг участников</label>
                    </div>
                </div>
                <div class="dart-form-group">
                    <div v-if="this.form.participantsType == '1' || this.form.participantsType == '4'" class="kenost-select-reginos">
                        <p class="kenost-select-reginos__title" v-if="this.form.participantsType == '1'">Выбор участников по регионам</p>
                        <p class="kenost-select-reginos__title" v-else>Выбор исключения по регионам</p>
                        <p class="kenost-select-reginos__gray">Акция не будет доступна в том числе для новых компаний из
                            выбранных регионов
                        </p>
                        <div class="kenost-select-reginos__checkboxs" v-if="this.form.participantsType == '1'">
                            <div class="flex align-items-center gap-1">
                                <Checkbox v-model="this.form.available_stores" inputId="access-1" name="access-1"
                                    value="true" />
                                <label for="access-1" class="ml-2"> Доступно для магазинов </label>
                            </div>
                            <div class="flex align-items-center gap-1">
                                <Checkbox v-model="this.form.available_opt" inputId="access-2" name="access-1"
                                    value="true" />
                                <label for="access-2" class="ml-2"> Доступно для оптовых компаний </label>
                            </div>
                            <div class="flex align-items-center gap-1">
                                <Checkbox v-model="this.form.available_vendors" inputId="access-3" name="access-1"
                                    value="true" />
                                <label for="access-3" class="ml-2"> Доступно для производителей </label>
                            </div>
                        </div>

                        <div class="kenost-select-reginos__checkboxs" v-else>
                            <div class="flex align-items-center gap-1">
                                <Checkbox v-model="this.form.available_stores" inputId="access-1" name="access-1"
                                    value="true" />
                                <label for="access-1" class="ml-2"> Исключить магазины </label>
                            </div>
                            <div class="flex align-items-center gap-1">
                                <Checkbox v-model="this.form.available_opt" inputId="access-2" name="access-1"
                                    value="true" />
                                <label for="access-2" class="ml-2"> Исключить оптовые компании </label>
                            </div>
                            <div class="flex align-items-center gap-1">
                                <Checkbox v-model="this.form.available_vendors" inputId="access-3" name="access-1"
                                    value="true" />
                                <label for="access-3" class="ml-2"> Исключить производителей </label>
                            </div>
                        </div>
                        <MultiSelect filter v-model="this.regions_select" display="chip" :options="this.regions_all"
                            optionLabel="name" placeholder="Выберите регионы"
                            class="w-full md:w-20rem kenost-multiselect mt-2" />
                    </div>
                </div>

                <div class="PickList" v-if="this.form.participantsType == '2' || this.form.participantsType == '5'">
                    <div class="PickList__product" :style="{ width: '40%' }">
                        <b class="PickList__title" v-if="this.form.participantsType == '2'">Добавление отдельных организаций</b>
                        <b class="PickList__title" v-else>Исключение отдельных организаций</b>
                        <div class="PickList__filters">
                            <div class="form_input_group input_pl input-parent required">
                                <input type="text" id="filter_name" placeholder="Введите артикул или название"
                                    class="dart-form-control" v-model="filter_organizations.name"
                                    @input="setFilterOrganization('filter')" />
                                <label for="product_filter_name" class="s-complex-input__label">Введите название
                                    организации</label>
                                <div class="form_input_group__icon">
                                    <i class="d_icon d_icon-search"></i>
                                </div>
                            </div>
                        </div>
                        <div class="PickList__products">
                            <div class="PickList__el center" v-for="item in this.all_organizations" :key="item.id">
                                <img :src="item.image" alt="" />
                                <div class="PickList__product-info">
                                    <div>{{ item.name }}</div>
                                </div>
                                <div @click="selectOrganization(item.id)" class="PickList__select"><i
                                        class="pi pi-angle-right"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="PickList__selected"
                        :style="{ width: '40%' }">
                        <div class="PickList__title mb-4">
                            <b v-if="this.form.participantsType == '2'">Добавленные организации</b>
                            <b v-else>Исключенные организации</b>
                        </div>
                        <div class="PickList__products PickList__products-selected">
                            <div class="PickList__el center" v-for="item in this.all_organizations_selected"
                                :key="item.id">
                                <img :src="item.image" alt="" />
                                <div class="PickList__info">
                                    <div class="PickList__product-info off">
                                        <div>{{ item.name }}</div>
                                    </div>
                                </div>
                                <div @click="deleteSelectOrganization(item.id)" class="PickList__select"><i
                                        class="pi pi-times"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="kenost-wiget" v-if="this.form.limitations == '2'">
                    <p>Значение</p>
                    <InputNumber v-model="this.form.limitationValue" inputId="horizontal-buttons" :step="0.1" min="0"
                        incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" />
                </div>
                <div class="dart-form-group">
                    <div class="flex align-items-center gap-1">
                        <Checkbox v-model="this.form.hide_for_clients" :binary="true" inputId="hide_for_clients"
                            name="hide_for_clients" />
                        <label for="hide_for_clients" class="ml-2 mb-0"> Скрыть акцию у клиентов с Индивидуальными условиями </label>
                    </div>
                </div>

                <div class="dart-form-group">
                    <div class="flex align-items-center gap-1">
                        <Checkbox v-model="this.form.negative" :binary="true" inputId="negative"
                            name="negative" />
                        <label for="negative" class="ml-2 mb-0"> Негативная акция </label>
                    </div>
                </div>

                <div class="dart-form-group">
                    <div class="flex align-items-center gap-1">
                        <Checkbox v-model="this.form.offer" :binary="true" inputId="offer"
                            name="offer" />
                        <label for="offer" class="ml-2 mb-0"> Акция доступна только в предложениях </label>
                    </div>
                </div>
            </div>
        </div>

        <Dialog v-model:visible="this.modal_checking" header=" " :style="{ width: '380px' }">
            <div class="kenost-not-produc">
                <img src="/images/icons_milen/action-status.png" alt="">
                <b class="text-center">Вы уверены, что хотите сохранить изменения?</b>
                <p>Обратите внимание, что <b>акция в настоящее время активна</b>, и после сохранения она вступит в силу, применив изменения ко всем добавленным товарам.</p>
                <div class="a-dart-btn a-dart-btn-primary" @click="formSubmit(event)">Сохранить</div>
            </div>
        </Dialog>
    </form>
    <Dialog v-model:visible="this.modals.delay" header="Настройка отсрочки платежа" :style="{ width: '800px' }">
        <div class="kenost-modal-price">
            <div class="two-colums mt-2" v-for="(item, index) in this.form.delay" :key="item.id">
                <div class="kenost-wiget">
                    <p>Процент от суммы заказа</p>
                    <InputNumber v-model="this.form.delay[index].percent" inputId="horizontal-buttons" :step="0.1"
                        min="0" max="100" suffix=" %" @update:modelValue="delayUpdate" incrementButtonIcon="pi pi-plus"
                        decrementButtonIcon="pi pi-minus" />
                </div>
                <div class="kenost-wiget">
                    <p>Срок отсрочки платежа в календарных днях</p>
                    <InputNumber v-model="this.form.delay[index].day" inputId="horizontal-buttons" :step="0.1" min="0"
                        @update:modelValue="delayUpdate" incrementButtonIcon="pi pi-plus"
                        decrementButtonIcon="pi pi-minus" />
                </div>
            </div>
            <div class="kenost-modal-price__button kenost-modal-price__flex">
                <div class="kenost-add-button" @click="this.form.delay.push({ percent: 0, day: 0 })"><i
                        class="pi pi-plus"></i> Добавить срок</div>
                <div class="dart-btn dart-btn-primary"
                    :class="{ 'kenots-button-stop': delayPercentSum > 100 || delayPercentSum < 100 }"
                    @click="delayPercentSum == 100 ? (this.modals.delay = !this.modals.delay) : ''">
                    Подтвердить
                    <div class="kenots-button-stop__text">Сумма процентов должна составлять 100</div>
                </div>
            </div>
        </div>
    </Dialog>

    <Dialog v-model:visible="this.modals.error_product" header="Список незагруженных товаров"
        :style="{ width: '640px' }">
        <div class="kenost-list-error">
            <table>
                <tr>
                    <th>№</th>
                    <th>Артикул</th>
                </tr>
                <tr v-for="(item, index) in this.error_product" :key="item.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item }}</td>
                </tr>
            </table>
        </div>
    </Dialog>

    <Dialog v-model:visible="this.modals.add_group" header="Добавить коллекцию"
        :style="{ width: '640px' }">
        <div>
            <!-- {{this.groups?.items}} -->
            <Dropdown option-label="name" v-model="this.add_group" :options="groups.items" optionLabel="name" class="w-full md:w-14rem mt-2" />
            <div class="w-full mt-3 justify-content-end flex">
                <button @click="addGroup()" type="button" class="dart-btn dart-btn-primary  flex gap-1 align-items-center">
                    <i class="pi pi-plus"></i><div>Добавить коллекцию</div>
                </button>
            </div>
        </div>
    </Dialog>

    <Dialog v-model:visible="this.modals.price" :header="this.modals.headers[this.modals.price_step]"
        :style="{ width: '700px' }">
        <div class="kenost-modal-price">
            <div class="product-kenost-card">
                <img :src="this.selected[this.modals.product_id]?.image" />
                <div class="product-kenost-card__text">
                    <p>{{ this.selected[this.modals.product_id]?.name }}</p>
                    <span>{{ this.selected[this.modals.product_id]?.article }}</span>
                </div>
            </div>
            <div class="kenost-method-edit-flex" v-if="this.modals.price_step == 0">
                <div class="flex align-items-center gap-1 mt-3">
                    <RadioButton v-model="this.modals.type_price" inputId="type_price-1" name="type_price" value="1" />
                    <label for="type_price-1" class="ml-2 radioLabel">Задать вручную</label>
                </div>
                <div class="flex align-items-center gap-1 mt-3">
                    <RadioButton v-model="this.modals.type_price" inputId="type_price-2" name="type_price" value="2" />
                    <label for="type_price-2" class="ml-2 radioLabel">Тип цен</label>
                </div>
                <!-- <div class="flex align-items-center gap-1 mt-3">
                    <RadioButton v-model="this.modals.type_price" inputId="type_price-3" name="type_price" value="3" />
                    <label for="type_price-3" class="ml-2 radioLabel">Задать вручную</label>
                </div> -->
            </div>

            <div v-if="this.modals.price_step == 1" class="two-colums mt-3">
                <div class="kenost-wiget">
                    <p>Тип ценообразования</p>
                    <Dropdown
                        @change="setDiscountFormul()"
                        v-model="this.selected_data[this.modals.product_id].typePricing"
                        :options="this.typePricing" optionLabel="name"
                        class="w-full md:w-14rem" />
                </div>
                <div class="kenost-wiget" v-if="this.selected_data[this.modals.product_id]?.typePricing?.key != 2">
                    <p>Тип цены</p>
                    <Dropdown @change="setDiscountFormul()"
                        v-model="this.selected_data[this.modals.product_id].typePrice"
                        :options="this.selected[this.modals.product_id].prices" optionLabel="name" 
                        class="w-full md:w-14rem" />
                </div>
                <div class="kenost-wiget-two">
                    <div class="kenost-wiget">
                        <p>Значение</p>
                        <InputNumber v-model="this.saleValue" inputId="horizontal-buttons" :step="0.1" min="0"
                            @update:modelValue="setDiscountFormul()" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" />
                    </div>
                    <div class="kenost-wiget">
                        <p>&nbsp;</p>
                        <Dropdown @change="setDiscountFormul()" :disabled="this.selected_data[this.modals.product_id]?.typePricing?.key != 2" v-model="this.selected_data[this.modals.product_id].typeFormul"
                            :options="this.typeFormul" optionLabel="name" class="w-full md:w-14rem" />
                    </div>
                </div>
            </div>

            <div v-if="this.modals.price_step == 2" class="two-colums mt-3">
                <div class="kenost-wiget">
                    <p>Тип цены</p>
                    <Dropdown @change="setTypePrice()" v-model="this.selected_data[this.modals.product_id].typePrice"
                        :options="this.selected[this.modals.product_id].prices" optionLabel="name"
                        class="w-full md:w-14rem" />
                </div>
            </div>

            <!-- <div v-if="this.modals.price_step == 3" class="two-colums mt-3">
                <div class="kenost-wiget">
                    <p>Скидка в %</p>
                    <InputNumber v-model="this.selected_data[this.modals.product_id].discountInterest"
                        inputId="horizontal-buttons" :step="1" min="0" max="100" suffix=" %" @update:modelValue="
                            setPrices(this.modals.product_id, 'discountInterest', this.selected_data[this.modals.product_id].discountInterest)
                            " incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" />
                </div>
                <div class="kenost-wiget">
                    <p>Скидка в ₽</p>
                    <InputNumber v-model="selected_data[this.modals.product_id].discountInRubles"
                        inputId="horizontal-buttons" :step="1" min="0" :max="selected[this.modals.product_id].price"
                        mode="currency" currency="RUB" @update:modelValue="
                            setPrices(this.modals.product_id, 'discountInRubles', this.selected_data[this.modals.product_id].discountInRubles)
                            " incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" />
                </div>
                <div class="kenost-wiget">
                    <p>Цена со скидкой</p>
                    <InputNumber v-model="selected_data[this.modals.product_id].finalPrice" inputId="horizontal-buttons"
                        :step="1" :max="selected[this.modals.product_id].price" mode="currency" currency="RUB" min="0"
                        @update:modelValue="setPrices(this.modals.product_id, 'finalPrice', this.selected_data[this.modals.product_id].finalPrice)"
                        incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" />
                </div>
            </div> -->

            <div class="kenost-info-line" v-if="this.modals.price_step != 0">
                <p>РРЦ: {{ this.selected[this.modals.product_id]?.price ?? '—' }} ₽</p>
                <p>
                    Скидка от РРЦ:
                    {{
                        this.selected_data[this.modals.product_id]
                        ? Number(this.selected_data[this.modals.product_id].discountInterest)
                            .toFixed(2)
                            .toLocaleString('ru')
                        : '0'
                    }}
                    %
                </p>
                <p>
                    Цена со скидой:
                    {{
                        this.selected_data[this.modals.product_id]?.finalPrice ? this.selected_data[this.modals.product_id]?.finalPrice : this.selected_data[this.modals.product_id]?.price
                    }}
                    ₽
                </p>
            </div>

            <div v-if="this.selected_data[this.modals.product_id]?.typePricing?.key == 2 && this.modals.price_step != 0">
                <div class="dart-alert dart-alert-info mt-2">
                    Цена будет всегда оставаться неизменной, даже при изменении типов цен, РРЦ и любых других параметров товара.
                </div>
            </div>

            <div class="kenost-modal-price__button kenost-modal-price__flex">
                <span v-if="this.modals.price_step == 0"></span>
                <div v-if="this.modals.price_step != 0" class="dart-btn dart-btn-secondary btn-padding"
                    @click="this.modals.price_step = 0">
                    Назад
                </div>
                <div class="dart-btn dart-btn-primary btn-padding" @click="closeDialogPrice">
                    {{ this.modals.price_step == 0 ? 'Далее' : 'Готово' }}
                </div>
            </div>
        </div>
    </Dialog>

    <Dialog v-model:visible="this.modals.price_group" :header="this.modals.headers[this.modals.price_step]"
        :style="{ width: '700px' }">
        <div class="kenost-modal-price">
            <div class="kenost-method-edit-flex" v-if="this.modals.price_step == 0">
                <div class="flex align-items-center gap-1 mt-3">
                    <RadioButton v-model="this.modals.type_price" inputId="type_price-1" name="type_price" value="1" />
                    <label for="type_price-1" class="ml-2 radioLabel">Задать вручную</label>
                </div>
                <div class="flex align-items-center gap-1 mt-3">
                    <RadioButton v-model="this.modals.type_price" inputId="type_price-2" name="type_price" value="2" />
                    <label for="type_price-2" class="ml-2 radioLabel">Тип цен</label>
                </div>
                <!-- <div class="flex align-items-center gap-1 mt-3">
                    <RadioButton v-model="this.modals.type_price" inputId="type_price-3" name="type_price" value="3" />
                    <label for="type_price-3" class="ml-2 radioLabel">Задать вручную</label>
                </div> -->
            </div>

            <div v-if="this.modals.price_step == 1" class="two-colums mt-3">
                <div class="kenost-wiget">
                    <p>Тип ценообразования</p>
                    <Dropdown
                        @change="setDiscountFormulGroup()"
                        v-model="this.action_groups[this.modals.group_id].typePricing"
                        :options="this.typePricingGroup" optionLabel="name"
                        class="w-full md:w-14rem" />
                </div>
                <div class="kenost-wiget" v-if="this.action_groups[this.modals.group_id]?.typePricing?.key != 2">
                    <p>Тип цены</p>
                    <Dropdown @change="setDiscountFormulGroup()"
                        v-model="this.action_groups[this.modals.group_id].price"
                        :options="this.typePrice" optionLabel="name" optionValue="key"
                        class="w-full md:w-14rem" />
                </div>
                <div class="kenost-wiget-two">
                    <div class="kenost-wiget">
                        <p>Значение</p>
                        <InputNumber v-model="this.action_groups[this.modals.group_id].saleValue" inputId="horizontal-buttons" :step="0.1" min="0"
                            @update:modelValue="setDiscountFormulGroup()" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" />
                    </div>
                    <div class="kenost-wiget">
                        <p>&nbsp;</p>
                        <Dropdown @change="setDiscountFormulGroup()" :disabled="this.action_groups[this.modals.group_id]?.typePricing?.key != 2" v-model="this.action_groups[this.modals.group_id].typeFormul"
                            :options="this.typeFormul" optionLabel="name" class="w-full md:w-14rem" />
                    </div>
                </div>
            </div>

            <div v-if="this.modals.price_step == 2" class="two-colums mt-3">
                <div class="kenost-wiget">
                    <p>Тип цены</p>
                    <Dropdown @change="setGroupTypePrice()" v-model="this.action_groups[this.modals.group_id].price"
                        :options="this.typePrice" optionLabel="name" optionValue="key"
                        class="w-full md:w-14rem" />
                </div>
            </div>

            <div class="kenost-modal-price__button kenost-modal-price__flex">
                <span v-if="this.modals.price_step == 0"></span>
                <div v-if="this.modals.price_step != 0" class="dart-btn dart-btn-secondary btn-padding"
                    @click="this.modals.price_step = 0">
                    Назад
                </div>
                <div class="dart-btn dart-btn-primary btn-padding" @click="closeDialogPrice">
                    {{ this.modals.price_step == 0 ? 'Далее' : 'Готово' }}
                </div>
            </div>
        </div>
    </Dialog>
</template>
<script>
import { useVuelidate } from '@vuelidate/core';
import { mapActions, mapGetters } from 'vuex';
import FileUpload from 'primevue/fileupload';
import Calendar from 'primevue/calendar';
import RadioButton from 'primevue/radiobutton';
import Dropdown from 'primevue/dropdown';
import Dialog from 'primevue/dialog';
import InputNumber from 'primevue/inputnumber';
import TreeSelect from 'primevue/treeselect';
import DropZone from 'dropzone-vue';
import Checkbox from 'primevue/checkbox';
import Counter from '../../components/opt/Counter.vue';
import MultiSelect from 'primevue/multiselect';
import router from '../../router';
import Paginate from 'vuejs-paginate-next';
import { helpers, required } from '@vuelidate/validators';
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import Badge from 'primevue/badge';

export default {
    name: 'ProfileSalesAdd',
    props: {},
    data() {
        return {
            page: 1,
            pageGift: 1,
            loading: true,
            modal_checking: false,
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
            ids_visible: [],
            form: {
                actionLast: [],
                global_kenost_table: [],
                filter_kenost_table: [],
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
                conditionMinGeneralCount: 0,
                bigDiscount: [],
                not_sale_client: [],
                negative: false,
                hide_for_clients: false,
                offer: false
            },
            listAction: {},
            kenostActivityAll: {
                type: {},
                typePrice: {},
                value: 0,
                typeFormul: { name: '%', key: 1 },
                discountInterest: 0,
                multiplicity: 1,
                typePricing: {name: 'Наценка', key: 1}
            },
            modals: {
                delay: false,
                price: false,
                error_product: false,
                add_group: false,
                price_group: false,
                price_step: 0,
                type_price: '1',
                product_id: -1,
                group_id: -1,
                headers: ['Метод редактирования цены', 'Задать вручную', 'Тип цен']
            },
            add_group: {},
            action_groups: {},
            files: {
                max: {
                    original_href: ''
                },
                min: {
                    original_href: ''
                },
                icon: {
                    original_href: ''
                },
                small: {
                    original_href: ''
                }
            },
            compabilityMode: [
                { name: 'Применяется бóльшая', key: 0 },
                { name: 'Скидки складываются', key: 1 },
                { name: 'Скидки назначаются последовательно', key: 2 }
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
            typePricing: [
                {name: 'Наценка', key: 1},
                {name: 'Скидка', key: 2},
                {name: 'Фиксированая цена', key: 3}
            ],
            typePricingGroup: [
                {name: 'Наценка', key: 1},
                {name: 'Скидка', key: 2},
            ],
            typePrice: [],
            massAction: [
                { name: 'Задать вручную', key: 0 },
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
        };
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
            'get_sales_adv_pages_to_api',
            'get_group_api',
            'build_group_api'
        ]),
        addGroup(){
            this.action_groups[this.add_group.id] = {
                group: this.add_group,
                page: 1,
                perpage: 20,
                search: "",
                typePricing: null,
                prices: null,
                price: 'key',
                saleValue: 0,
                typeFormul: null
            };
            this.updateGroups(this.add_group.id)
            this.add_group = {}
            this.modals.add_group = false
        },
        deleteGroup(id){
            this.action_groups = Object.fromEntries(
                Object.entries(this.action_groups)  // Преобразуем объект в массив [ключ, значение]
                    .filter(([key]) => key !== id.toString())    // Фильтруем, исключая ключ, который равен id
            );
        },
        onUpload(data) {
            if (data.xhr.response) {
                const response = JSON.parse(data.xhr.response);
                if (Object.prototype.hasOwnProperty.call(response.data, 'files')) {
                    // перечень загруженныйх файлов

                    if (response.data.files[0].type_banner === 'max') {
                        this.files.max = response.data.files[0];
                    } else if (response.data.files[0].type_banner === 'min') {
                        this.files.min = response.data.files[0];
                    } else if (response.data.files[0].type_banner === 'icon') {
                        this.files.icon = response.data.files[0];
                    } else if (response.data.files[0].type_banner === 'small') {
                        this.files.small = response.data.files[0];
                    }
                }
            }
            this.$toast.add({ severity: 'info', summary: 'Файлы загружены', detail: 'Файл был успешно загружен', life: 3000 });
        },
        updateGroups(id){
            console.log('updateGroups', this.action_groups[id])
            this.build_group_api({
                action: 'build',
                id: this.$route.params.id,
                store_id: this.form.store_id[0],
                terms: this.action_groups[id].group?.properties?.terms ? this.action_groups[id].group?.properties?.terms : [],
                black_list: this.action_groups[id].group?.properties?.black_list ? this.action_groups[id].group?.properties?.black_list : [],
                type: this.action_groups[id].group.type,
                file: this.action_groups[id].group.file,
                page: this.action_groups[id].page,
                perpage: this.action_groups[id].perpage,
                price: this.action_groups[id].price ? this.action_groups[id].price : 'key',
                saleValue: this.action_groups[id].saleValue,
                typeFormul: this.action_groups[id].typeFormul?.key,
                typePricing: this.action_groups[id].typePricing?.key,
                filter: {
                    name: this.action_groups[id].search
                }
            }).then((res) => {
                this.action_groups[id].products = res.data
            })

            // console.log(this.action_groups)
        },
        updateProducts() {
            const data = {
                storeid: this.form.store_id,
                filter: this.filter,
                filterselected: this.filter_table,
                selected: Object.keys(this.selected),
                pageselected: this.page_selected,
                page: this.page,
                perpage: this.per_page
            };

            this.selected = {};
            this.selected_data = {};
            this.selected_visible = {};
            this.products = [];

            this.get_available_products_from_api(data).then(this.kenostTableCheckedAllCheck());

            this.selectedGift = {};

            const dataGift = {
                storeid: this.form.store_id,
                filter: this.filterGift,
                filterselected: this.filter_table,
                selected: Object.keys(this.selected),
                pageselected: this.page_selected,
                page: this.page,
                perpage: this.per_page,
                type: 'gift'
            };

            this.get_available_products_from_api(dataGift).then();

            this.opt_get_prices({
                action: 'get/type/prices',
                store_id: this.form.store_id
            });

            this.get_all_sales_to_api({
                id: router.currentRoute._value.params.id,
                action: 'get/all',
                store_id: this.form.store_id
            });
            this.form.bigDiscount = [];
        },
        delayUpdate() {
            this.delayPercentSum = 0;
            this.postponement_period = 0;
            for (let i = 0; i < this.form.delay.length; i++) {
                this.delayPercentSum += this.form.delay[i].percent;
                this.postponement_period = this.postponement_period + this.form.delay[i].day * (this.form.delay[i].percent / 100);
            }
        },
        settings(item, modal) {
            this.modals.price = modal;
            this.modals.product_id = item.id;
            if (!this.selected_data[item.id]) {
                const elem = {
                    price: item.price,
                    multiplicity: 1,
                    min_count: 1,
                    finalPrice: item.price,
                    discountInterest: 0,
                    discountInRubles: 0
                };
                this.selected_data[item.id] = elem;
            }else{
                if(this.selected_data[item.id].typePricing?.key == 3){
                    this.saleValue = this.selected_data[item.id].finalPrice
                } else if(this.selected_data[item.id].typePricing?.key == 2 && this.selected_data[item.id].typeFormul?.key == 0){
                    this.saleValue = this.selected_data[item.id].price - this.selected_data[item.id].finalPrice
                } else if(this.selected_data[item.id].percent){
                    this.saleValue = this.selected_data[item.id].percent
                }
            }
        },
        parseFile(files, xhr, formData) {
            const callback = (e) => {
                const res = JSON.parse(e);

                this.files.xlsx = res.data.files[0];

                const data = {
                    action: 'upload/products/file',
                    store_id: this.form.store_id,
                    file: res.data.files[0].original,
                    type: 'b2b'
                };
                this.opt_upload_products_file(data).then((response) => {
                    const productsList = response.data.data.data;
                    // Бежим по всем элементам и добавляем их в select
                    this.selected = {};
                    for (let i = 1; i < Object.keys(productsList).length; i++) {
                        const tempProduct = productsList[Object.keys(productsList)[i]];
                        if (!tempProduct.error) {
                            const product = {};
                            product.article = tempProduct.A;
                            product.discountInRubles = tempProduct.E - tempProduct.D;
                            product.discountInterest = (tempProduct.E - tempProduct.D) / (tempProduct.E / 100);
                            product.finalPrice = tempProduct.D;
                            product.price = tempProduct.E;
                            product.id = tempProduct.remain.id;
                            product.multiplicity = tempProduct.F;
                            product.image = tempProduct.remain.image;
                            product.name = tempProduct.remain.name;
                            product.typeFormul = {};
                            product.typePrice = '';

                            this.selected[tempProduct.remain.id] = product;
                            this.total_selected++;

                            const selectdata = {};
                            if (tempProduct.E === 0 || tempProduct.E === null) {
                                selectdata.discountInterest = 100;
                                selectdata.discountInRubles = '-';
                            } else {
                                selectdata.discountInRubles = tempProduct.E - tempProduct.D;
                                selectdata.discountInterest = (tempProduct.E - tempProduct.D) / (tempProduct.E / 100);
                            }
                            selectdata.finalPrice = tempProduct.D;
                            selectdata.price = tempProduct.E;
                            selectdata.multiplicity = tempProduct.F;

                            this.selected_data[tempProduct.remain.id] = selectdata;
                        } else {
                            this.error_product.push(tempProduct.A);
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
                    };
                    this.get_available_products_from_api(data).then((res) => {
                        this.kenostTableCheckedAllCheck();
                    });
                    this.upload_product = true;
                });
            };

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    callback(xhr.response);
                }
            };
        },
        filterglobalTable() {
            if (this.form.filter_kenost_table.length === 0) {
                // this.kenost_table = [];
                this.kenost_table = this.kenost_table.filter(id => !this.ids_visible.includes(id));
            } else {
                this.kenost_table = [...new Set([...this.kenost_table, ...this.ids_visible])];
            }
            this.kenostTableCheckedAllCheck();
        },
        globalTable() {
            if (this.form.global_kenost_table.length === 0) {
                this.kenost_table = [];
            } else {
                this.kenost_table = Object.keys(this.selected);
            }
            this.kenostTableCheckedAllCheck();

            // if (this.form.filter_kenost_table.length === 0) {
            //     // this.kenost_table = [];
            //     this.kenost_table = kenost_table.filter(id => !ids_visible.includes(id));
            // } else {
            //     this.kenost_table = [...new Set([...this.kenost_table, ...this.ids_visible])];
            // }
            // this.kenostTableCheckedAllCheck();
        },
        massActionTable() {
            for (let i = 0; i < this.kenost_table.length; i++) {
                if (!this.selected_data[this.kenost_table[i]]) {
                    const elem = {
                        price: this.selected[this.kenost_table[i]].price,
                        multiplicity: 1,
                        min_count: 1,
                        finalPrice: this.selected[this.kenost_table[i]].price,
                        discountInterest: 0,
                        discountInRubles: 0
                    };
                    this.selected_data[this.kenost_table[i]] = elem;
                }
                this.selected_data[this.kenost_table[i]].typeFormul = this.kenostActivityAll.typeFormul
                switch (this.kenostActivityAll.type.key) {
                    case 0:
                        let sale = 0;

                        const isTypePrice = this.selected[this.kenost_table[i]].prices.find((r) => r.guid === this.kenostActivityAll.typePrice.key);
                        if(isTypePrice){
                            this.selected_data[this.kenost_table[i]].typePrice = this.kenostActivityAll.typePrice;
                            sale = Number(this.selected_data[this.kenost_table[i]].price) - Number(isTypePrice.price)
                        }
                        
                        this.selected_data[this.kenost_table[i]].typePricing = this.kenostActivityAll.typePricing;
                        switch(this.kenostActivityAll.typePricing.key){
                            case 1:
                                if(this.kenostActivityAll.value){
                                    let salePercent = (100 - ((Number(this.selected_data[this.kenost_table[i]].price) - sale) * (1.5 + (1.7 - 1.5) * (this.kenostActivityAll.value - 50) / (70 - 50))) * 100 / (Number(this.selected_data[this.kenost_table[i]].price)))
                                    sale = Number(this.selected_data[this.kenost_table[i]].price) - Number(this.selected_data[this.kenost_table[i]].price) * (1 - salePercent / 100)
                                    this.selected_data[this.kenost_table[i]].percent = this.kenostActivityAll.value
                                }
                                break;
                            case 2:
                                sale = 0;
                                this.selected_data[this.kenost_table[i]].typePrice = ""
                                if(this.kenostActivityAll.value && this.kenostActivityAll.typeFormul){
                                    if(this.kenostActivityAll.value && this.kenostActivityAll?.typeFormul?.key == 1){
                                        let salePrice = (Number(this.selected_data[this.kenost_table[i]].price) - sale)*(1-this.kenostActivityAll.value/100)
                                        sale = Number(this.selected_data[this.kenost_table[i]].price) - salePrice
                                        this.selected_data[this.kenost_table[i]].percent = this.kenostActivityAll.value
                                    } else {
                                        let salePrice = Number(this.selected_data[this.kenost_table[i]].price) - sale - this.kenostActivityAll.value
                                        sale = Number(this.selected_data[this.kenost_table[i]].price) - salePrice
                                        this.selected_data[this.kenost_table[i]].percent = 0;
                                    }
                                }
                                break;
                            case 3:
                                // console.log(this.selected_data[this.modals.product_id])
                                if(this.kenostActivityAll.value){
                                    sale = Number(this.selected_data[this.kenost_table[i]].price) - this.kenostActivityAll.value
                                    this.selected_data[this.kenost_table[i]].percent = 0;
                                }
                                break;
                        }


                        if(isNaN(sale)){
                            this.selected_data[this.kenost_table[i]].discountInRubles = 0
                            this.selected_data[this.kenost_table[i]].finalPrice = Number(this.selected_data[this.kenost_table[i]].price)
                            this.selected_data[this.kenost_table[i]].discountInterest = 0
                        } else {
                            //Устанавливаем цену со скидкой
                            this.selected_data[this.kenost_table[i]].discountInRubles = sale
                            this.selected_data[this.kenost_table[i]].finalPrice = Number(this.selected_data[this.kenost_table[i]].price) - sale
                            //Расчет % скидки от РРЦ
                            this.selected_data[this.kenost_table[i]].discountInterest = Number(this.selected_data[this.kenost_table[i]].discountInRubles) / (Number(this.selected_data[this.kenost_table[i]].price) / 100)
                        }
                        break;
                    case 1:
                        // console.log(this.selected)
                        // eslint-disable-next-line no-case-declarations
                        const isPrice = this.selected[this.kenost_table[i]].prices.find((r) => r.guid === this.kenostActivityAll.typePrice.key);

                        if (isPrice) {
                            // console.log(this.selected[this.kenost_table[i]])
                            this.selected_data[this.kenost_table[i]].typePrice = this.kenostActivityAll.typePrice;
                            this.selected_data[this.kenost_table[i]].finalPrice = isPrice.price;
                            this.selected_data[this.kenost_table[i]].discountInRubles =
                                Number(this.selected_data[this.kenost_table[i]].price) - this.selected_data[this.kenost_table[i]].finalPrice;
                            // this.selected_data[this.kenost_table[i]].discountInterest =
                            //     100 - (isPrice.price / (Number(this.selected_data[this.kenost_table[i]].price) / 100));

                            const price = Number(this.selected_data[this.kenost_table[i]].price);

                            // Проверка на 0 или NaN
                            if (price === 0 || isNaN(price)) {
                            // Обработка случая, если цена некорректна (например, возврат 0 или другого значения по умолчанию)
                            this.selected_data[this.kenost_table[i]].discountInterest = 0; // или любое другое значение
                            } else {
                            this.selected_data[this.kenost_table[i]].discountInterest = 
                                100 - (isPrice.price / (price / 100));
                            }

                            this.selected_data[this.kenost_table[i]].typePricing = {}
                            this.selected_data[this.kenost_table[i]].typeFormul = {}
                            this.selected_data[this.kenost_table[i]].percent = 0
                        }
                        break;
                    case 3:
                        this.selected_data[this.kenost_table[i]].multiplicity = this.kenostActivityAll.multiplicity;
                        break;
                }
            }
        },
        setFilter() {
            this.page_selected = 1;
            this.page = 1;
            const data = {
                storeid: this.form.store_id,
                filter: this.filter,
                filterselected: this.filter_table,
                pageselected: this.page_selected,
                page: this.page,
                perpage: this.per_page,
                selected: Object.keys(this.selected)
            };
            this.get_available_products_from_api(data).then((res) => {
                this.kenostTableCheckedAllCheck();
            });
        },

        setFilterGift() {
            this.pageGift = 1;
            const data = {
                storeid: this.form.store_id,
                filter: this.filterGift,
                filterselected: this.filter_table,
                pageselected: this.page_selected,
                page: this.pageGift,
                perpage: this.per_page,
                selected: Object.keys(this.selectedGift),
                type: 'gift'
            };
            this.get_available_products_from_api(data).then((res) => {
                this.kenostTableCheckedAllCheck();
            });
        },
        setAllProducts(is) {
            const data = {
                storeid: this.form.store_id,
                filter: this.filter,
                filterselected: this.filter_table,
                pageselected: this.page_selected,
                page: this.page,
                perpage: this.per_page,
                isallproducts: is ? 'all' : 'null'
            };
            if (is) {
                data.selected = Object.keys(this.selected);
            }
            this.get_available_products_from_api(data).then((res) => {
                this.kenostTableCheckedAllCheck();
            });
        },
        setFilterComplects() {
            const data = {
                action: 'complects/get',
                filter: this.filter_complects,
                page: this.page_complects,
                perpage: this.pagination_items_per_page_complects,
                id: router.currentRoute._value.params.id,
                selected: this.selected_complects
            };
            this.opt_get_complects(data);
        },
        async formSubmit(event) {
            console.log('create')
            const validationResult = await this.v$.$validate();
            console.log(validationResult)
            if (!validationResult) {
                // console.log('validation failed');
                return;
            }

            let groups_data = this.action_groups
            // console.log(groups_data)
            for(let i = 0; i < Object.keys(groups_data).length; i++){
                // console.log(groups_data[Object.keys(groups_data)[i]])
                groups_data[Object.keys(groups_data)[i]].products = null
            }
            console.log('create')

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
                        condition_min_count: this.form.conditionMinGeneralCount,
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
                        negative: this.form.negative,
                        offer: this.form.offer,
                        limit_sum: this.form.limitationValue,
                        limit_type: this.form.limitations,
                        actionLast: this.form.actionLast[0] === 'true',
                        page_places: this.place_action.map((x) => x.code),
                        page_geo: this.geo_action?.key,
                        page_place_position: this.position,
                        page_create: this.create_page_action[0] === 'true',
                        hide_for_clients: this.form.hide_for_clients,
                        groups: groups_data
                    })
                        .then((result) => {
                            this.loading = false;
                            router.push({ name: 'b2b', params: { id: router.currentRoute._value.params.id } });
                        })
                        .catch((result) => {
                            // console.log(result)
                        });
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
                        condition_min_count: this.form.conditionMinGeneralCount,
                        condition_SKU: this.form.conditionMinCount,
                        participants_type: this.form.participantsType,
                        products: Object.keys(this.selected),
                        products_data: this.selected_data,
                        regions_select: this.regions_select,
                        organizations: this.all_organizations_selected,
                        method_adding_products: this.form.addProductType,
                        available_stores: this.form.available_stores[0] === 'true',
                        available_vendors: this.form.available_vendors[0] === 'true',
                        negative: this.form.negative,
                        offer: this.form.offer,
                        available_opt: this.form.available_opt[0] === 'true',
                        complects: this.selected_complects,
                        big_sale_actions: this.form.bigDiscount,
                        big_post_actions: this.form.bigPost,
                        not_sale_client: this.form.not_sale_client[0] === 'true',
                        limit_sum: this.form.limitationValue,
                        limit_type: this.form.limitations,
                        actionLast: this.form.actionLast[0] === 'true',
                        page_places: this.place_action.map((x) => x.code),
                        page_geo: this.geo_action?.key,
                        page_place_position: this.position,
                        page_create: this.create_page_action[0] === 'true',
                        hide_for_clients: this.form.hide_for_clients,
                        groups: groups_data
                    })
                        .then((result) => {
                            this.loading = false;
                            router.push({ name: 'b2b', params: { id: router.currentRoute._value.params.id } });
                        })
                        .catch((result) => {
                            // console.log(result)
                        });
                }
            });
            this.loading = true;
        },
        selectComplect(id) {
            // console.log(id);
            const complect = this.complects.find((r) => r.id === id);
            // console.log(complect);
            this.selected_complects[complect.id] = complect;
            // console.log(this.selected_complects);
            this.complects = this.complects.filter((r) => r.id !== id);
            // console.log(this.selected_complects);
            const data = {
                action: 'complects/get',
                filter: this.filter_complects,
                page: this.page_complects,
                perpage: this.pagination_items_per_page_complects,
                id: router.currentRoute._value.params.id,
                selected: this.selected_complects
            };
            // console.log(data);
            this.opt_get_complects(data);
            // this.total_selected++
        },
        deleteSelectComplect(id) {
            this.complects.push(this.selected_complects[id]);

            // eslint-disable-next-line camelcase
            const new_selected = {};

            for (let i = 0; i < Object.keys(this.selected_complects).length; i++) {
                if (this.selected_complects[Object.keys(this.selected_complects)[i]].id !== id) {
                    new_selected[Object.keys(this.selected_complects)[i]] = this.selected_complects[Object.keys(this.selected_complects)[i]];
                }
            }

            // eslint-disable-next-line camelcase
            this.selected_complects = new_selected;

            const data = {
                action: 'complects/get',
                filter: this.filter_complects,
                page: this.page_complects,
                perpage: this.pagination_items_per_page_complects,
                id: router.currentRoute._value.params.id,
                selected: this.selected_complects
            };
            this.opt_get_complects(data);
        },
        select(id) {
            const product = this.products.find((r) => r.id === id);
            product.discountInterest = 0;
            product.discountInRubles = 0;
            product.multiplicity = 1;
            product.min_count = 1;
            product.finalPrice = Number(product.price);
            product.typeFormul = {};
            product.typePrice = '';

            // console.log(product);

            const dataProduct = {
                action: 'get/product/prices',
                remain_id: product.id
            };

            this.opt_get_remain_prices(dataProduct).then((res) => {
                product.prices = res.data.data;

                this.selected[product.id] = product;
                this.products = this.products.filter((r) => r.id !== id);
                const data = {
                    storeid: this.form.store_id,
                    filter: this.filter,
                    filterselected: this.filter_table,
                    selected: Object.keys(this.selected),
                    pageselected: this.page_selected,
                    page: this.page,
                    perpage: this.per_page
                };
                this.get_available_products_from_api(data).then((res) => {
                    this.kenostTableCheckedAllCheck();
                });
                this.total_selected++;
            });
        },
        selectGift(id) {
            const product = this.productsGift.find((r) => r.id === id);
            // console.log(product)
            // product.discountInterest = 0
            // product.discountInRubles = 0
            product.multiplicity = 1;
            // product.finalPrice = Number(product.price)
            // product.typeFormul = {}
            // product.typePrice = ''

            this.selectedGift[product.id] = product;
            // console.log(this.selectedGift)
            this.productsGift = this.productsGift.filter((r) => r.id !== id);
            const data = {
                storeid: this.form.store_id,
                filter: this.filterGift,
                filterselected: this.filter_table,
                selected: Object.keys(this.selectedGift),
                pageselected: this.page_selected,
                page: this.pageGift,
                perpage: this.per_page,
                type: 'gift'
            };
            this.get_available_products_from_api(data).then((res) => {
                this.kenostTableCheckedAllCheck();
            });
        },
        deleteSelectGift(id) {
            this.productsGift.push(this.selectedGift[id]);

            // eslint-disable-next-line camelcase
            const new_selected = {};

            for (let i = 0; i < Object.keys(this.selectedGift).length; i++) {
                if (this.selectedGift[Object.keys(this.selectedGift)[i]].id !== id) {
                    new_selected[Object.keys(this.selectedGift)[i]] = this.selectedGift[Object.keys(this.selectedGift)[i]];
                }
            }

            // eslint-disable-next-line camelcase
            this.selectedGift = new_selected;

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
            };
            this.get_available_products_from_api(data).then((res) => {
                this.kenostTableCheckedAllCheck();
            });
        },
        deleteSelect(id) {
            this.products.push(this.selected[id]);

            // eslint-disable-next-line camelcase
            const new_selected = {};

            for (let i = 0; i < Object.keys(this.selected).length; i++) {
                if (this.selected[Object.keys(this.selected)[i]].id.toString() !== id.toString()) {
                    new_selected[Object.keys(this.selected)[i]] = this.selected[Object.keys(this.selected)[i]];
                }
            }

            // eslint-disable-next-line camelcase
            this.selected = new_selected;

            // this.selected = this.selected.filter((r) => r.id !== id)
            const data = {
                storeid: this.form.store_id,
                filter: this.filter,
                filterselected: this.filter_table,
                selected: Object.keys(this.selected),
                pageselected: this.page_selected,
                page: this.page,
                perpage: this.per_page
            };
            this.get_available_products_from_api(data).then((res) => {
                this.kenostTableCheckedAllCheck();
            });
            this.total_selected--;
        },
        selectOrganization(id) {
            const organization = this.all_organizations.find((r) => r.id === id);
            this.all_organizations_selected[organization.id] = organization;
            this.all_organizations = this.all_organizations.filter((r) => r.id !== id);
        },
        setFilterOrganization() {
            const data = { filter: this.filter_organizations };
            this.get_all_organizations_from_api(data).then((this.all_organizations = this.allorganizations));
        },
        deleteSelectOrganization(id) {
            this.all_organizations.push(this.all_organizations_selected[id]);
            // eslint-disable-next-line camelcase
            const new_all_organizations_selected = {};

            for (let i = 0; i < Object.keys(this.all_organizations_selected).length; i++) {
                if (this.all_organizations_selected[Object.keys(this.all_organizations_selected)[i]].id !== id) {
                    new_all_organizations_selected[Object.keys(this.all_organizations_selected)[i]] =
                        this.all_organizations_selected[Object.keys(this.all_organizations_selected)[i]];
                }
            }

            // eslint-disable-next-line camelcase
            this.all_organizations_selected = new_all_organizations_selected;
        },
        pagClickCallback(pageNum) {
            this.page = pageNum;
            const data = {
                storeid: this.form.store_id,
                filter: this.filter,
                filterselected: this.filter_table,
                selected: Object.keys(this.selected),
                pageselected: this.page_selected,
                page: this.page,
                perpage: this.per_page
            };
            this.get_available_products_from_api(data).then((res) => {
                this.kenostTableCheckedAllCheck();
            });
        },
        pagClickCallbackGift(pageNum) {
            this.pageGift = pageNum;
            const data = {
                storeid: this.form.store_id,
                filter: this.filterGift,
                filterselected: this.filter_table,
                selected: Object.keys(this.selectedGift),
                pageselected: this.page_selected,
                page: this.pageGift,
                perpage: this.per_page,
                type: 'gift'
            };
            this.get_available_products_from_api(data).then((res) => {
                this.kenostTableCheckedAllCheck();
            });
        },
        pagClickCallbackSelect(pageNum) {
            this.page_selected = pageNum;
            const data = {
                storeid: this.form.store_id,
                filter: this.filter,
                filterselected: this.filter_table,
                selected: Object.keys(this.selected),
                pageselected: this.page_selected,
                page: this.page,
                perpage: this.per_page
            };
            this.get_available_products_from_api(data).then((res) => {
                this.kenostTableCheckedAllCheck();
            });
        },
        pagClickCallbackGroup(pageNum, id){
            this.action_groups[id].page = pageNum
            this.updateGroups(id)
        },
        setFilterGroup(id){
            this.updateGroups(id)
        },
        kenostTableCheckedAllCheck() {
            let isPageSelect = false;
            if (Object.keys(this.selected_visible).length === 0) {
                this.kenost_table_all = [];
                // eslint-disable-next-line no-unused-vars
                isPageSelect = true;
            }
            for (let i = 0; i < Object.keys(this.selected_visible).length; i++) {
                if (this.kenost_table.indexOf(this.selected_visible[Object.keys(this.selected_visible)[i]].id) === -1) {
                    this.kenost_table_all = [];
                    // eslint-disable-next-line no-unused-vars
                    isPageSelect = true;
                    break;
                }
            }
            if (!isPageSelect) {
                this.kenost_table_all = ['1'];
            }
            if (Object.keys(this.selected).length === this.kenost_table.length) {
                this.form.global_kenost_table = ['true'];
            } else {
                this.form.global_kenost_table = [];
            }

            let isPageSelectFilter = false;

            for (let i = 0; i < this.ids_visible.length; i++) {
                if (this.kenost_table.indexOf(this.ids_visible[i]) == -1) {
                    isPageSelectFilter = true;
                    break
                }
            }

            if (!isPageSelectFilter) {
                this.form.filter_kenost_table = ['true'];
            } else {
                this.form.filter_kenost_table = [];
            }
        },
        kenostTableCheckedAll() {
            if (this.kenost_table_all.length === 0) {
                for (let i = 0; i < Object.keys(this.selected_visible).length; i++) {
                    this.kenost_table.push(this.selected_visible[Object.keys(this.selected_visible)[i]].id);
                }
            } else {
                for (let i = 0; i < Object.keys(this.selected_visible).length; i++) {
                    this.kenost_table = this.kenost_table.filter((el) => el !== this.selected_visible[Object.keys(this.selected_visible)[i]].id);
                }
            }
        },
        ElemCount(obj) {
            this.settings(obj.item, false);
            if (!this.selected_data[obj.id]) {
                this.selected_data[obj.id] = [];
                this.selected_data[obj.id].multiplicity = obj.value;
                this.selected_data[obj.id].finalPrice = this.selected[obj.id].price;
                this.selected_data[obj.id].discountInterest = 0;
                this.selected_data[obj.id].discountInRubles = 0;
                this.selected_data[obj.id].min_count = 1;
                this.selected_data[obj.id].typeFormul = null;
            }
            this.selected_data[obj.id].multiplicity = obj.value;
        },
        ElemMinCount(obj) {
            this.settings(obj.item, false);
            if (!this.selected_data[obj.id]) {
                this.selected_data[obj.id] = [];
                this.selected_data[obj.id].multiplicity = 1;
                this.selected_data[obj.id].finalPrice = this.selected[obj.id].price;
                this.selected_data[obj.id].discountInterest = 0;
                this.selected_data[obj.id].discountInRubles = 0;
                this.selected_data[obj.id].min_count = 1;
                this.selected_data[obj.id].typeFormul = null;
            }
            this.selected_data[obj.id].min_count = obj.value;
        },
        closeDialogPrice() {
            if (this.modals.price_step === 0) {
                this.modals.price_step = Number(this.modals.type_price);
            } else {
                this.modals.price_step = 0;
                this.modals.price = false;
                this.modals.price_group = false;
            }
        },
        setPrices(index, name, value) {
            switch (name) {
                case 'discountInterest':
                    this.selected_data[index].discountInRubles = (Number(this.selected_data[index].price) / 100) * value;
                    this.selected_data[index].finalPrice = Number(this.selected_data[index].price) - this.selected_data[index].discountInRubles;
                    break;
                case 'discountInRubles':
                    this.selected_data[index].discountInterest = value / (Number(this.selected_data[index].price) / 100);
                    this.selected_data[index].finalPrice = Number(this.selected_data[index].price) - this.selected_data[index].discountInRubles;
                    break;
                case 'finalPrice':
                    this.selected_data[index].discountInRubles = Number(this.selected_data[index].price) - value;
                    this.selected_data[index].discountInterest =
                        this.selected_data[index].discountInRubles / (Number(this.selected_data[index].price) / 100);
                    break;
            }
        },
        setTypePrice() {
            const getPrice = this.selected[this.modals.product_id].prices.find(
                (r) => r.guid === this.selected_data[this.modals.product_id].typePrice.guid
            ).price;
            this.selected_data[this.modals.product_id].finalPrice = Number(getPrice);
            this.selected_data[this.modals.product_id].discountInRubles = Number(this.selected_data[this.modals.product_id].price) - Number(getPrice);
            this.selected_data[this.modals.product_id].discountInterest =
                (Number(this.selected_data[this.modals.product_id].price) - Number(getPrice)) /
                (Number(this.selected_data[this.modals.product_id].price) / 100);
        },
        setGroupTypePrice(){
            console.log('setGroupTypePrice')
            this.action_groups[this.modals.group_id].saleValue = 0;
            this.action_groups[this.modals.group_id].typeFormul = null;
            this.action_groups[this.modals.group_id].typePricing= {name: 'Тип цен', key: 0};
            this.action_groups[this.modals.group_id].percent = 0;
            console.log(this.action_groups)
            this.updateGroups(this.modals.group_id)
        },
        createSet() {
            // Создание комлпекта
            const tempComplect = {};
            for (let i = 0; i < this.kenost_table.length; i++) {
                tempComplect[i] = this.selected[this.kenost_table[i]];
                this.complects_ids.push(this.selected[this.kenost_table[i]].id);
            }
            this.complects.push(tempComplect);
            // console.log(this.complects_ids)
        },
        setDiscountFormulGroup(){
            if(this.action_groups[this.modals.group_id].typePricing){
                // console.log(this.action_groups[this.modals.group_id].typePricing.key)
                switch(this.action_groups[this.modals.group_id].typePricing.key){
                    case 1:
                        // console.log({ name: '%', key: 1 })
                        this.action_groups[this.modals.group_id].typeFormul = { name: '%', key: 1 }
                        break;
                    case 2:
                        if(this.action_groups[this.modals.group_id].saleValue && this.action_groups[this.modals.group_id].typeFormul){
                            this.action_groups[this.modals.group_id].price = 'key'
                        }
                        break;
                }
            }
            this.updateGroups(this.modals.group_id)
        },
        setDiscountFormulMas(){
            if(this.kenostActivityAll.typePricing){
                switch(this.kenostActivityAll.typePricing.key){
                    case 1:
                        this.kenostActivityAll.typeFormul = { name: '%', key: 1 }
                        break;
                    case 3:
                    this.kenostActivityAll.typeFormul = {key: 0, name: "₽"}
                        break;
                }
            }
        },
        setDiscountFormul() {
            let sale = 0;
            if(this.selected_data[this.modals.product_id].typePrice){
                //Скидка от Типа цены
                sale = Number(this.selected_data[this.modals.product_id].price) - Number(this.selected_data[this.modals.product_id].typePrice.price)
            }
            if(this.selected_data[this.modals.product_id].typePricing){
                switch(this.selected_data[this.modals.product_id].typePricing.key){
                    case 1:
                        this.selected_data[this.modals.product_id].typeFormul = { name: '%', key: 1 }
                        if(this.saleValue){
                            //ФОРМУЛА 100-1500*100/2000
                            //Например: Товар с РРЦ 2000, Типом цен "Опт1", Цена "Опт1" = 1000, Значение наценки: 50 => Цена товара со скидкой: 1000*1,5 = 1500, Скидка = 100-1500*100/2000  = 25%
                            //console.log(`100 - ${((Number(this.selected_data[this.modals.product_id].price) - sale) * (1.5 + (1.7 - 1.5) * (this.saleValue - 50) / (70 - 50)))} * 100 / ${Number(this.selected_data[this.modals.product_id].price)}`)
                            //console.log((1.5 + (1.7 - 1.5) * (this.saleValue - 50) / (70 - 50)))
                            let salePercent = (100 - ((Number(this.selected_data[this.modals.product_id].price) - sale) * (1.5 + (1.7 - 1.5) * (this.saleValue - 50) / (70 - 50))) * 100 / (Number(this.selected_data[this.modals.product_id].price)))
                            sale = Number(this.selected_data[this.modals.product_id].price) - Number(this.selected_data[this.modals.product_id].price) * (1 - salePercent / 100)
                            this.selected_data[this.modals.product_id].percent = this.saleValue
                        }
                        break;
                    case 2:
                        sale = 0;
                        this.selected_data[this.modals.product_id].typePrice = ""

                        if(this.saleValue && this.selected_data[this.modals.product_id].typeFormul){
                            if(this.saleValue && this.selected_data[this.modals.product_id]?.typeFormul?.key == 1){
                                let salePrice = (Number(this.selected_data[this.modals.product_id].price) - sale)*(1-this.saleValue/100)
                                sale = Number(this.selected_data[this.modals.product_id].price) - salePrice
                                this.selected_data[this.modals.product_id].percent = this.saleValue
                            } else {
                                let salePrice = Number(this.selected_data[this.modals.product_id].price) - sale - this.saleValue
                                sale = Number(this.selected_data[this.modals.product_id].price) - salePrice
                                this.selected_data[this.modals.product_id].percent = 0;
                            }
                            
                        }
                        break;
                    case 3:
                        // console.log(this.selected_data[this.modals.product_id])
                        this.selected_data[this.modals.product_id].typeFormul = {key: 0, name: "₽"}
                        if(this.saleValue){
                            sale = Number(this.selected_data[this.modals.product_id].price) - this.saleValue
                            this.selected_data[this.modals.product_id].percent = 0
                        }
                }
            }

            //Устанавливаем цену со скидкой
            this.selected_data[this.modals.product_id].discountInRubles = sale
            this.selected_data[this.modals.product_id].finalPrice = Number(this.selected_data[this.modals.product_id].price) - sale
            //Расчет % скидки от РРЦ
            this.selected_data[this.modals.product_id].discountInterest = Number(this.selected_data[this.modals.product_id].discountInRubles) / (Number(this.selected_data[this.modals.product_id].price) / 100)
        }
    },
    mounted() {
        this.get_available_products_from_api({ storeid: this.form.store_id, filter: '', selected: ['0'], page: this.page }).then((res) => {
            if (this.available_products) {
                this.products = this.available_products?.products;
            }
        });
        const data = { filter: this.filter_organizations };
        this.get_all_organizations_from_api(data).then((this.all_organizations = this.allorganizations));
        this.get_regions_from_api().then(() => {
            this.regions = this.getregions;
            this.regions_all = this.regions.map(function (el) {
                return { name: el.label, code: el.key };
            });
            // console.log(this.regions_all)
        });
        this.opt_get_complects({
            action: 'complects/get',
            page: this.page_complects,
            perpage: this.pagination_items_per_page_complects,
            id: router.currentRoute._value.params.id
        });
        this.get_sales_to_api({ id: router.currentRoute._value.params.sales_id, actionid: router.currentRoute._value.params.sales_id }).then(() => {
            this.loading = false;
        });
        this.get_opt_catalog_tree_from_api();
        this.org_get_stores_from_api({
            action: 'get/stores',
            id: this.$route.params.id
        });
        this.get_sales_adv_pages_to_api({
            action: 'get/adv/pages',
            store_id: router.currentRoute._value.params.id,
            type: 1
        });
        this.get_group_api({
            id: this.$route.params.id,
            action: "get"
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
        Paginate,
        TabView,
        TabPanel,
        Badge
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
            'adv_pages',
            'groups',
            'group_build'
        ]),
        pagesCountSelect() {
            let pages = Math.round(this.total_selected / this.per_page);
            if (pages === 0) {
                pages = 1;
            }
            return pages;
        },
        pagesCount() {
            let pages = Math.round(this.total_products / this.per_page);
            if (pages === 0) {
                pages = 1;
            }
            return pages;
        },
        pagesCountGift() {
            let pages = Math.round(this.total_gift_products / this.per_page);
            if (pages === 0) {
                pages = 1;
            }
            return pages;
        }
    },
    watch: {
        org_stores: function (newVal, oldVal) {
            this.stores = [];
            for (let i = 0; i < newVal.items.length; i++) {
                this.stores.push({ label: newVal.items[i].name, value: newVal.items[i].id });
            }
        },
        adv_pages: function (newVal, oldVal) {
            this.place = newVal;
        },
        available_products: function (newVal, oldVal) {
            if (newVal) {
                if (newVal.type === 'gift') {
                    this.productsGift = newVal.products;
                    // this.selected = newVal.selected
                    if (newVal.selected) {
                        this.selectedGift = newVal.selected;
                    }
                    this.total_gift_products = newVal.total;
                } else {
                    this.products = newVal.products;
                    // this.selected = newVal.selected
                    if (newVal.selected) {
                        this.selected = newVal.selected;
                    }
                    if (newVal.visible) {
                        this.selected_visible = newVal.visible;
                        // console.log(this.selected_visible)
                        this.ids_visible = newVal.ids_selected;
                    }
                    this.total_products = newVal.total;
                    this.total_selected = newVal.total_selected;
                }
            }
        },
        allorganizations: function (newVal, oldVal) {
            this.all_organizations = newVal;
        },
        optcatalogtree: function (newVal, oldVal) {
            // for (let i = 0; i < newVal.length; i++) {

            // }
            this.opt_catalog_tree = newVal;
        },
        getregions: function (newVal, oldVal) {
            this.regions = this.getregions;
        },
        optcomplects: function (newVal, oldVal) {
            this.complects = newVal.complects;
            this.total_complects = newVal.total;
        },
        allactions: function (newVal, oldVal) {
            this.allAction = [];
            this.allAction = newVal.items.map(function (el) {
                return { name: el.name, code: el.id };
            });
        },
        oprprices: function (newVal, oldVal) {
            this.typePrice = [];
            for (let i = 0; i < newVal.length; i++) {
                this.typePrice.push({ key: newVal[i].guid, name: newVal[i].name });
            }
            // console.log(this.typePrice)
        },
        actions: async function (newVal, oldVal) {
            if (router.currentRoute._value.params.sales_id) {
                // console.log(newVal)
                this.form.name = newVal.name;
                if (newVal.image) {
                    this.files.max.original_href = newVal.image.image;
                }
                this.form.hide_for_clients = newVal.hide_for_clients;
                // if (newVal.image_inner) {
                //     this.files.min.original_href = this.site_url_prefix + newVal.image_inner;
                // }

                // if (newVal.image_small) {
                //     this.files.small.original_href = this.site_url_prefix + newVal.image_small;
                // }

                if (newVal.page_create) {
                    this.create_page_action = ['true'];
                    this.place_action = newVal.page_places;
                }

                this.geo_action = this.geo[newVal.page_geo];
                this.position = newVal.page_place_position;

                if (newVal.gift) {
                    this.selectedGift = newVal.gift;
                }

                if (newVal.big_post_actions) {
                    this.form.bigPost = newVal.big_post_actions
                }

                if (newVal.compatibility_discount_mode) {
                    this.form.compabilityMode = this.compabilityMode[newVal.compatibility_discount_mode];
                }

                if (newVal.store_id) {
                    this.form.store_id = newVal.store_id;

                    this.opt_get_prices({
                        action: 'get/type/prices',
                        store_id: newVal.store_id
                    });

                    const data = {
                        storeid: [newVal.store_id.toString()],
                        filter: this.filterGift,
                        filterselected: this.filter_table,
                        selected: Object.keys(this.selectedGift),
                        pageselected: this.page_selected,
                        page: this.pageGift,
                        perpage: this.per_page,
                        type: 'gift'
                    };
                    this.get_available_products_from_api(data).then();

                    if(newVal.groups){
                        for(let i = 0; i < newVal.groups.length; i++){
                            this.action_groups[newVal.groups[i].group.id] = {
                                group: newVal.groups[i].group,
                                page: 1,
                                perpage: 20,
                                search: "",
                                typePricing: this.typePricingGroup[Number(newVal.groups[i].pricing_type) - 1],
                                prices: null,
                                price: newVal.groups[i].type_price ? newVal.groups[i].type_price : 'key',
                                saleValue: Number(newVal.groups[i].percent),
                                typeFormul: this.typeFormul[Number(newVal.groups[i].pricing_formula)]
                            };
                            this.updateGroups(newVal.groups[i].group.id)
                        }
                    }
                }

                if (newVal.icon) {
                    this.files.icon.original_href = this.site_url_prefix + newVal.icon;
                }

                if (Object.keys(newVal.complects).length > 0) {
                    // console.log(newVal.complects)
                    this.selected_complects = newVal.complects;
                }
                this.form.description = newVal.description;
                if (newVal.compatibility_discount) {
                    this.form.compatibilityDiscount = newVal.compatibility_discount.toString();
                }

                if (newVal.compatibility_postponement) {
                    this.form.compatibilityPost = newVal.compatibility_postponement.toString();
                }
                const dateto = new Date(newVal.date_to);
                const datefrom = new Date(newVal.date_from);
                this.form.dates = [datefrom, dateto];
                this.selected = newVal.products;
                this.selected_data = newVal.products_data;
                for (var key in this.selected_data) {
                    if(this.selected_data[key].pricing_type !== undefined && this.selected_data[key].pricing_type !== null ){
                        for (var k_pricing in this.typePricing) {
                            if(this.typePricing[k_pricing].key == this.selected_data[key].pricing_type){
                                this.selected_data[key].typePricing = this.typePricing[k_pricing]
                            }
                        }
                    }
                    if(this.selected_data[key].pricing_formula !== undefined && this.selected_data[key].pricing_formula !== null){
                        for (var k_formula in this.typeFormul) {
                            if(this.typeFormul[k_formula].key == this.selected_data[key].pricing_formula){
                                this.selected_data[key].typeFormul = this.typeFormul[k_formula]
                            }
                        }
                    }
                    if(this.selected_data[key].type_price !== undefined && this.selected_data[key].type_price !== null){
                        for (var k_price in this.selected[key].prices) {
                            if(this.selected[key].prices[k_price].guid == this.selected_data[key].type_price){
                                this.selected_data[key].typePrice = this.selected[key].prices[k_price]
                            }
                        }
                    }
                    if(this.selected_data[key].percent !== undefined && this.selected_data[key].percent !== null){
                        this.selected_data[key].discountInterest = this.selected_data[key].percent
                    }
                }
                // let count = 0
                // for (let i = 0; i < Object.keys(newVal.products).length; i++) {
                //   if (count === 25) {
                //     break
                //   }
                //   count++
                //   console.log(newVal.products[Object.keys(newVal.products)[i]])
                //   // this.selectes[Object.keys(this.selected)[i]].hide = true
                // }
                this.total_selected = newVal.total_products;
                this.all_organizations_selected = newVal.organization;
                this.form.award = newVal.award;
                if (newVal.shipment_type) {
                    this.form.typeShipment = newVal.shipment_type.toString();
                }
                this.form.paymentDelivery = this.paymentDelivery[newVal.payer];
                this.form.conditionPaymentDelivery = this.conditionPaymentDelivery[newVal.delivery_payment_terms];
                this.form.conditionPaymentDeliveryValue = newVal.delivery_payment_value;
                this.form.postponementConditions = this.postponementConditions[newVal.delay_condition];
                this.form.postponementConditionsValue = newVal.delay_condition_value;
                this.postponement_period = newVal.delay;
                this.form.condition = this.condition[newVal.condition_type];
                this.form.conditionMinSum = newVal.condition_min_sum;
                this.form.conditionMinCount = newVal.condition_SKU;
                this.form.conditionMinGeneralCount = newVal.condition_min_count;
                if (newVal.method_adding_products) {
                    this.form.addProductType = newVal.method_adding_products.toString();
                }
                if (newVal.participants_type) {
                    this.form.participantsType = newVal.participants_type.toString();
                }
                if (newVal.available_stores) {
                    this.form.available_stores = ['true'];
                }
                if (newVal.available_vendors) {
                    this.form.available_vendors = ['true'];
                }
                if (newVal.negative) {
                    this.form.negative = true;
                }

                if (newVal.offer) {
                    this.form.offer = true;
                }

                if (newVal.available_opt) {
                    this.form.available_opt = ['true'];
                }

                if (newVal.not_sale_client) {
                    this.form.not_sale_client = ['true'];
                }

                if (newVal.action_last) {
                    this.form.actionLast = ['true'];
                }

                this.form.delay = newVal.delay_graph;
                this.regions_select = newVal.regions;
                this.all_organizations_selected = newVal.organization;
                this.form.bigDiscount = newVal.big_sale_actions;
                this.form.limitationValue = newVal.limit_sum;

                if (newVal.limit_type) {
                    this.form.limitations = newVal.limit_type.toString();
                }

                const dataorg = { filter: this.filter_organizations, selected: this.all_organizations_selected };
                this.get_all_organizations_from_api(dataorg).then((this.all_organizations = this.allorganizations));

                this.get_all_sales_to_api({
                    id: router.currentRoute._value.params.id,
                    action: 'get/all',
                    store_id: this.form.store_id
                });

                const data = {
                    storeid: this.form.store_id,
                    filter: this.filter,
                    filterselected: this.filter_table,
                    selected: Object.keys(this.selected),
                    pageselected: this.page_selected,
                    page: this.page,
                    perpage: this.per_page
                };
                this.get_available_products_from_api(data).then((res) => {
                    this.kenostTableCheckedAllCheck();
                });

                const dataComplect = {
                    action: 'complects/get',
                    filter: this.filter_complects,
                    page: this.page_complects,
                    perpage: this.pagination_items_per_page_complects,
                    id: router.currentRoute._value.params.id,
                    selected: this.selected_complects
                };
                this.opt_get_complects(dataComplect);
            }
        }
    },
    setup() {
        return { v$: useVuelidate() };
    },
    validations() {
        return {
            form: {
                name: {
                    required: helpers.withMessage('Заполните наименование', required)
                },
                store_id: {
                    required: helpers.withMessage('Выберите склад', () => this.form.store_id?.length > 0)
                },
                // description: {
                //   required: helpers.withMessage("Заполните описание", required),
                // },
                // award: {
                //   required: helpers.withMessage("Заполните награду", required),
                // },
                // bigDiscount: {
                //     required: helpers.withMessage('Выберите акции', () => {
                //         if (this.form.compatibilityDiscount != 3 && this.form.compatibilityPost != 4) return true;
                //         return this.form.bigDiscount?.length > 0;
                //     })
                // },
                // bigPost: {
                //     required: helpers.withMessage('Выберите отсрочки', () => {
                //         if (this.form.compatibilityPost != 3 && this.form.compatibilityPost != 4) return true;
                //         return this.form.bigPost?.length > 0;
                //     })
                // },
                dates: {
                    required: helpers.withMessage('Заполните даты проведения', () => this.form.dates?.length > 0)
                },
                // dateShipment: {
                //     required: helpers.withMessage('Заполните дату отгрузки', () => {
                //         if (this.form.typeShipment != 3) return true;
                //         return required(this.form.dateShipment);
                //     })
                // }
            },
            place_action: {
                // required: helpers.withMessage('Выберите хотя бы одно место размещения баннера/товара', () => {
                //     if (this.create_page_action?.length < 1) return true;
                //     return this.place_action?.length > 0;
                // })
            },
            // selected: {
            //     required: helpers.withMessage('Выберите хотя бы один товар', () => {
            //         if (this.form.addProductType != 1 && this.form.addProductType != 2) return true;
            //         return Object.keys(this.selected).length > 0;
            //     })
            // },
            // selected_complects: {
            //     required: helpers.withMessage('Выберите хотя бы один комплект', () => {
            //         if (this.form.addProductType != 3) return true;
            //         return Object.keys(this.selected_complects).length > 0;
            //     })
            // },
            kenostActivityAll: {
                // type: {
                //     required: helpers.withMessage('Выберите тип массового действия', () => {
                //         if (this.form.addProductType != 1 && this.form.addProductType != 2) return true;
                //         return this.kenostActivityAll?.type?.name;
                //     })
                // },
                // typePrice: {
                //     required: helpers.withMessage('Выберите тип цен', () => {
                //         if (this.kenostActivityAll?.type?.key != 0 && this.kenostActivityAll?.type?.key != 1) return true;
                //         return this.kenostActivityAll?.typePrice?.name;
                //     })
                // },
                // value: {
                //     required: helpers.withMessage('Заполните значение', () => {
                //         if (this.kenostActivityAll?.type?.key != 0) return true;
                //         return this.kenostActivityAll?.value;
                //     })
                // },
                // typeFormul: {
                //     required: helpers.withMessage('Выберите единицу измерения', () => {
                //         if (this.kenostActivityAll?.type?.key != 0) return true;
                //         return this.kenostActivityAll?.typeFormul?.name;
                //     })
                // },
                // multiplicity: {
                //     required: helpers.withMessage('Заполните кратность', () => {
                //         if (this.kenostActivityAll?.type?.key != 3) return true;
                //         return this.kenostActivityAll?.multiplicity;
                //     })
                // }
            },
            // regions_select: {
            //     required: helpers.withMessage('Выберите хотя бы один регион', () => {
            //         if (this.form.participantsType != 1) return true;
            //         return this.regions_select?.length > 0
            //     })
            // },
            // all_organizations_selected: {
            //     required: helpers.withMessage('Выберите хотя бы одну организацию', () => {
            //         if (this.form.participantsType != 2) return true;
            //         return Object.keys(this.all_organizations_selected).length > 0
            //     })
            // }
        };
    }
};
</script>
<style lang="scss">

</style>
