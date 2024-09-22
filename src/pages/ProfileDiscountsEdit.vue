<template>
    <form @submit.prevent="formSubmit" :class="{ loading: loading }">
        <div class="profile-content__title sticky-element">
            <span class="maintitle">Настройка индивидуальных условий</span>
            <div class="buttons_container">
            <RouterLink :to="{ name: 'discounts', params: { id: $route.params.id }}" class="dart-btn dart-btn-secondary btn-padding">Отменить</RouterLink>
            <button type="submit" class="dart-btn dart-btn-primary btn-padding" :class="{ 'dart-btn-loading': loading }" :disabled="loading">Сохранить изменения</button>
            </div>
        </div>

        <div class="dart-form-group mt-2 mb-4">
            <span class="ktitle">Склад</span>
            <MultiSelect
                @change="updateProducts"
                v-model="this.form.store_id"
                :options="this.stores"
                optionLabel="label"
                optionValue="value"
                placeholder="Выберите склад"
                disabled
            />
        </div>

        <div v-if="this.form.store_id.length > 0">

            <div class="dart-form-group mb-4">
                <span class="ktitle">Комментарий</span>
                <!-- <label for="name">Введите наименование, которое будет отражать смысл вашей акции.</label> -->
                <input v-model="this.form.comment" type="text" name="name" placeholder="Укажите комментарий" class="dart-form-control">
            </div>

            <div class="dart-form-group mb-4">
                <span class="ktitle">Условия отплаты доставки</span>
                <div class="kenost-wiget">
                    <p>Плательщик</p>
                    <Dropdown v-model="this.form.paymentDelivery" :options="this.paymentDelivery" optionLabel="name" placeholder="Оплата доставки" class="w-full md:w-14rem" />
                </div>
            </div>

            <div class="dart-form-group mb-4">
                <span class="ktitle">Минимальная сумма заказа</span>
                <div class="two-colums">
                    <div class="kenost-wiget w-1/2">
                        <InputNumber
                            v-model="this.form.min_amount"
                            inputId="horizontal-buttons"
                            :step="0.1"
                            :min="0"
                            incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
                            suffix=" ₽"
                        />
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
            </div>

            <div class="dart-form-group mb-4">
                <span class="ktitle">Скидка на все товары</span>
                <div class="kenost-all-table-activity">
                    <div class="kenost-wiget">
                      <p>Массовое действие</p>
                      <Dropdown v-model="this.kenostActivity.type" :options="this.massAction" optionLabel="name" placeholder="Массовое действие" class="w-full md:w-14rem" />
                    </div>
                    <div class="kenost-wiget" v-if="this.kenostActivity.type.key == 0 || this.kenostActivity.type.key == 1">
                      <p>Тип цен</p>
                      <Dropdown v-model="this.kenostActivity.typePrice" :options="this.typePrice" optionLabel="name" placeholder="Тип цен" class="w-full md:w-14rem" />
                    </div>
                    <div class="kenost-wiget" v-if="this.kenostActivity.type.key == 0">
                      <p>Значение</p>
                      <InputNumber
                        v-model="this.kenostActivity.value"
                        inputId="horizontal-buttons"
                        :step="1"
                        min="0"
                        incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
                      />
                    </div>
                    <div class="kenost-wiget" v-if="this.kenostActivity.type.key == 0">
                      <p>&nbsp;</p>
                      <Dropdown v-model="kenostActivity.typeFormul" :options="this.typeFormul" optionLabel="name" class="w-full md:w-14rem" />
                    </div>

                    <div class="kenost-wiget" v-if="this.kenostActivity.type.key == 3">
                      <p>Значение</p>
                      <InputNumber
                        v-model="this.kenostActivity.multiplicity"
                        inputId="horizontal-buttons"
                        :step="1"
                        min="1"
                        incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
                      />
                    </div>

                    <!-- <div class="kenost-wiget" v-if="this.kenostActivityAll.type.key == 0 || this.kenostActivityAll.type.key == 1 || this.kenostActivityAll.type.key == 2 || this.kenostActivityAll.type.key == 3">
                        <p>&nbsp;</p>
                        <div @click="massActionTable" class="dart-btn dart-btn-primary"><i class="pi pi-check"></i></div>
                    </div> -->

                </div>
            </div>
            
            <div class="dart-form-group picker-wrap">
                <span class="ktitle">Скидки на группы товаров</span>
                <div class="flex align-items-center gap-1 mt-2">
                    <RadioButton v-model="this.form.addProductType" inputId="addProductType-1" name="addProductType" value="1"/>
                    <label for="addProductType-1" class="ml-2 radioLabel">Добавить товары</label>
                </div>
                <div class="flex align-items-center gap-1 mt-3">
                    <RadioButton v-model="this.form.addProductType" inputId="addProductType-2" name="addProductType" value="2"/>
                    <label for="addProductType-2" class="ml-2 radioLabel">Загрузить товары файлом</label>
                </div>
                <div class="flex align-items-center gap-1 mt-3">
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
                    <!-- <img src="../../../public/img/files/xls.png" alt=""> -->
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
                        <th class="table-kenost__name">Минимальное <br> количество</th>
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
                    <p class="table-kenost__settings" @click="settings(item, true)" >Настроить</p>
                    </td>
                    <td v-if="this.selected_data[item.id]">
                        <Counter class="margin-auto" @ElemCount="ElemMinCount" :item="item" :id="item.id" :min="1" :value="this.selected_data[item.id].min_count" :key="new Date().getMilliseconds() + item.id"/>
                    </td>
                    <td v-else>
                        <Counter class="margin-auto" @ElemCount="ElemMinCount" :item="item" :id="item.id" :min="1" :value="1"/>
                    </td>
                    <td v-if="this.selected_data[item.id]">
                        <Counter class="margin-auto" @ElemCount="ElemCount" :item="item" :id="item.id" :min="1" :value="this.selected_data[item.id].multiplicity" :key="new Date().getMilliseconds() + item.id"/>
                    </td>
                    <td v-else>
                        <Counter class="margin-auto" @ElemCount="ElemCount" :item="item" :id="item.id" :min="1" :value="1"/>
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
                <div class="flex align-items-center gap-1">
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
              <div class="flex align-items-center gap-1 mt-3">
                <RadioButton v-model="this.modals.type_price" inputId="type_price-1" name="type_price" value="1"/>
                <label for="type_price-1" class="ml-2 radioLabel">Скидка по формуле</label>
              </div>
              <div class="flex align-items-center gap-1 mt-3">
                <RadioButton v-model="this.modals.type_price" inputId="type_price-2" name="type_price" value="2"/>
                <label for="type_price-2" class="ml-2 radioLabel">Тип цен</label>
              </div>
              <div class="flex align-items-center gap-1 mt-3">
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
    import { mapGetters, mapActions } from 'vuex'
    import Dropdown from 'primevue/dropdown'
    import InputNumber from 'primevue/inputnumber'
    import Dialog from 'primevue/dialog'
    import RadioButton from 'primevue/radiobutton'
    import DropZone from 'dropzone-vue'
    import TreeSelect from 'primevue/treeselect'
    import Counter from '../components/opt/Counter.vue'
    import Checkbox from 'primevue/checkbox'
    import router from '../router'
    import Paginate from 'vuejs-paginate-next'
    import MultiSelect from 'primevue/multiselect'

    export default {
        name: 'ProfileDiscountsEdit',
        data () {
            return {
                form: {
                    store_id: [],
                    comment: "",
                    paymentDelivery: { name: 'Покупатель', key: 0 },
                    min_amount: 0,
                    postponement_period: 0,
                    global_kenost_table: [],
                    delay: [
                        {
                            percent: 100,
                            day: 0
                        }
                    ],
                    addProductType: '1' 
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
                stores: [],
                paymentDelivery: [
                    { name: 'Покупатель', key: 0 },
                    { name: 'Поставщик', key: 1 }
                ],
                massAction: [
                    { name: 'Скидка по формуле', key: 0 },
                    { name: 'Тип цен', key: 1 },
                    { name: 'Кратность', key: 3 }
                ],
                kenostActivity: {
                    type: {},
                    typePrice: {},
                    value: 0,
                    typeFormul: {},
                    discountInterest: 0,
                    multiplicity: 1
                },
                kenostActivityAll: {
                    type: {},
                    typePrice: {},
                    value: 0,
                    typeFormul: {},
                    discountInterest: 0,
                    multiplicity: 1
                },
                typeFormul: [
                    { name: '₽', key: 0 },
                    { name: '%', key: 1 }
                ],
                typePrice: [],
                upload_product: false,
                filter: {
                    name: '',
                    category: {}
                },
                filter_table: {
                    name: '',
                    category: {}
                },
                products: [],
                total_products: 0,
                per_page: 25,
                page_selected: 1,
                selected: {},
                selectedGift: {},
                selected_data: {},
                selected_visible: {},
                total_selected: -1,
                kenost_table_all: [],
                kenost_table: [],
                complects: [],
                selected_complects: {},
                complects_ids: [],
            }
        },
        components: { 
            Dropdown,
            InputNumber,
            Dialog,
            RadioButton,
            DropZone,
            TreeSelect,
            Counter,
            Checkbox,
            Paginate,
            MultiSelect
        },
        computed: {
            ...mapGetters([
                'org_stores',
                'oprprices',
                'available_products',
                'optcomplects',
                'action_discount'
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
        },
        async mounted () {
            this.org_get_stores_from_api({
                action: 'get/stores',
                id: this.$route.params.id
            })
            this.get_available_products_from_api({ storeid: this.form.store_id, filter: '', selected: ['0'], page: this.page }).then((res) => {
                if (this.available_products) {
                    this.products = this.available_products?.products
                }
            })
            this.opt_get_complects({
                action: 'complects/get',
                page: this.page_complects,
                perpage: this.pagination_items_per_page_complects,
                store_id: router.currentRoute._value.params.id
            })
            this.get_actions_discount_api({
                action: 'get/individual',
                id: router.currentRoute._value.params.id,
                store_id: router.currentRoute._value.params.store_id,
                client_id: router.currentRoute._value.params.client_id
            }).then(() => {
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
            })
        },
        updated () {
            
        },
        methods: {
            ...mapActions([
                'org_get_stores_from_api',
                'opt_get_prices',
                'get_available_products_from_api',
                'opt_get_remain_prices',
                'opt_get_complects',
                'set_sales_to_api',
                'get_actions_discount_api'
            ]),
            formSubmit (event) {
                this.$load(async () => {
                    await this.set_sales_to_api({
                        type: 'discounts',
                        action: 'set',
                        store_id: this.form.store_id, //Склад
                        comment: this.form.comment, //Комментарий
                        payer: this.form.paymentDelivery.key, //Плательщик доставки
                        min_amount: this.form.min_amount, //Минимальная сумма заказа
                        delay: this.postponement_period, //Отсрочка
                        delay_graph: this.form.delay, //График отсрочки
                        sale_all: this.kenostActivity, //Скидка на все товары
                        products: Object.keys(this.selected), //Товары
                        products_data: this.selected_data,
                        complects: this.selected_complects,
                        method_adding_products: this.form.addProductType, //Метод добавления товаров
                        id: router.currentRoute._value.params.id,
                        id_client: router.currentRoute._value.params.client_id,
                    })
                })
            },
            massActionTable () {
                for (let i = 0; i < this.kenost_table.length; i++) {
                    // console.log(this.kenostActivityAll.type.key)
                    if (!this.selected_data[this.kenost_table[i]]) {
                    const elem = {
                        price: this.selected[this.kenost_table[i]].price,
                        multiplicity: 1,
                        min_count: 1,
                        finalPrice: this.selected[this.kenost_table[i]].price,
                        store_id: this.selected[this.kenost_table[i]].store_id,
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
            settings (item, modal) {
                this.modals.price = modal
                this.modals.product_id = item.id
                if (!this.selected_data[item.id]) {
                    const elem = {
                        store_id: item.store_id,
                        price: item.price,
                        multiplicity: 1,
                        min_count: 1,
                        finalPrice: item.price,
                        discountInterest: 0,
                        discountInRubles: 0
                    }
                    this.selected_data[item.id] = elem
                }
            },
            delayUpdate () {
                this.delayPercentSum = 0
                this.postponement_period = 0
                for (let i = 0; i < this.form.delay.length; i++) {
                    this.delayPercentSum += this.form.delay[i].percent
                    this.postponement_period = this.postponement_period + (this.form.delay[i].day * (this.form.delay[i].percent / 100))
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

                // this.selectedGift = {}

                // const dataGift = {
                //     storeid: this.form.store_id,
                //     filter: this.filterGift,
                //     filterselected: this.filter_table,
                //     selected: Object.keys(this.selected),
                //     pageselected: this.page_selected,
                //     page: this.page,
                //     perpage: this.per_page,
                //     type: 'gift'
                // }

                // this.get_available_products_from_api(dataGift).then()

                this.opt_get_prices({
                    action: 'get/type/prices',
                    store_id: this.form.store_id
                })
            },
            parseFile (files, xhr, formData) {
                const callback = (e) => {
                    const res = JSON.parse(e)

                    this.files.xlsx = res.data.files[0]

                    const data = {
                        action: 'upload/products/file',
                        store_id: this.form.store_id,
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
            // setFilterGift () {
            //     this.pageGift = 1
            //     const data = {
            //         storeid: this.form.store_id,
            //         filter: this.filterGift,
            //         filterselected: this.filter_table,
            //         pageselected: this.page_selected,
            //         page: this.pageGift,
            //         perpage: this.per_page,
            //         selected: Object.keys(this.selectedGift),
            //         type: 'gift'
            //     }
            //     this.get_available_products_from_api(data).then((res) => {
            //         this.kenostTableCheckedAllCheck()
            //     })
            //     },
            //     setAllProducts (is) {
            //     const data = {
            //         storeid: this.form.store_id,
            //         filter: this.filter,
            //         filterselected: this.filter_table,
            //         pageselected: this.page_selected,
            //         page: this.page,
            //         perpage: this.per_page,
            //         isallproducts: is ? 'all' : 'null'
            //     }
            //     if (is) {
            //         data.selected = Object.keys(this.selected)
            //     }
            //     this.get_available_products_from_api(data).then((res) => {
            //         this.kenostTableCheckedAllCheck()
            //     })
            // },
            select (id) {
                const product = this.products.find(r => r.id === id)
                product.discountInterest = 0
                product.discountInRubles = 0
                product.multiplicity = 1
                product.min_count = 1
                product.finalPrice = Number(product.price)
                product.typeFormul = {}
                product.typePrice = ''

                console.log(product)

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
            // selectGift (id) {
            //     const product = this.productsGift.find(r => r.id === id)
            //     // console.log(product)
            //     // product.discountInterest = 0
            //     // product.discountInRubles = 0
            //     product.multiplicity = 1
            //     // product.finalPrice = Number(product.price)
            //     // product.typeFormul = {}
            //     // product.typePrice = ''

            //     this.selectedGift[product.id] = product
            //     // console.log(this.selectedGift)
            //     this.productsGift = this.productsGift.filter((r) => r.id !== id)
            //     const data = {
            //         storeid: this.form.store_id,
            //         filter: this.filterGift,
            //         filterselected: this.filter_table,
            //         selected: Object.keys(this.selectedGift),
            //         pageselected: this.page_selected,
            //         page: this.pageGift,
            //         perpage: this.per_page,
            //         type: 'gift'
            //     }
            //     this.get_available_products_from_api(data).then((res) => {
            //         this.kenostTableCheckedAllCheck()
            //     })
            // },
            // deleteSelectGift (id) {
            //     this.productsGift.push(this.selectedGift[id])

            //     // eslint-disable-next-line camelcase
            //     const new_selected = {}

            //     for (let i = 0; i < Object.keys(this.selectedGift).length; i++) {
            //         if (this.selectedGift[Object.keys(this.selectedGift)[i]].id !== id) {
            //         new_selected[Object.keys(this.selectedGift)[i]] = this.selectedGift[Object.keys(this.selectedGift)[i]]
            //         }
            //     }

            //     // eslint-disable-next-line camelcase
            //     this.selectedGift = new_selected

            //     // this.selected = this.selected.filter((r) => r.id !== id)
            //     const data = {
            //         storeid: this.form.store_id,
            //         filter: this.filterGift,
            //         filterselected: this.filter_table,
            //         selected: Object.keys(this.selected),
            //         pageselected: this.page_selected,
            //         page: this.page,
            //         perpage: this.per_page,
            //         type: 'gift'
            //     }
            //     this.get_available_products_from_api(data).then((res) => {
            //         this.kenostTableCheckedAllCheck()
            //     })
            // },
            deleteSelect (id) {
                this.products.push(this.selected[id])

                // eslint-disable-next-line camelcase
                const new_selected = {}

                for (let i = 0; i < Object.keys(this.selected).length; i++) {
                    if ((this.selected[Object.keys(this.selected)[i]].id).toString() !== id.toString()) {
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
            // pagClickCallbackGift (pageNum) {
            //     this.pageGift = pageNum
            //     const data = {
            //         storeid: this.form.store_id,
            //         filter: this.filterGift,
            //         filterselected: this.filter_table,
            //         selected: Object.keys(this.selectedGift),
            //         pageselected: this.page_selected,
            //         page: this.pageGift,
            //         perpage: this.per_page,
            //         type: 'gift'
            //     }
            //     this.get_available_products_from_api(data).then((res) => {
            //         this.kenostTableCheckedAllCheck()
            //     })
            // },
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
                    this.kenost_table = this.kenost_table.filter((el) => el !== this.selected_visible[Object.keys(this.selected_visible)[i]].id)
                    }
                }
            },
            ElemCount (obj) {
                this.settings(obj.item, false)
                console.log(obj)
                if (!this.selected_data[obj.id]) {
                    this.selected_data[obj.id] = []
                    this.selected_data[obj.id].multiplicity = obj.value
                    this.selected_data[obj.id].finalPrice = this.selected[obj.id].price
                    this.selected_data[obj.id].discountInterest = 0
                    this.selected_data[obj.id].discountInRubles = 0
                    this.selected_data[obj.id].min_count = 1
                }
                this.selected_data[obj.id].multiplicity = obj.value
            },
            ElemMinCount (obj) {
                this.settings(obj.item, false)
                if (!this.selected_data[obj.id]) {
                    this.selected_data[obj.id] = []
                    this.selected_data[obj.id].multiplicity = 1
                    this.selected_data[obj.id].finalPrice = this.selected[obj.id].price
                    this.selected_data[obj.id].discountInterest = 0
                    this.selected_data[obj.id].discountInRubles = 0
                    this.selected_data[obj.id].min_count = 1
                }
                this.selected_data[obj.id].min_count = obj.value
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
        watch: {
            org_stores: function (newVal, oldVal) {
                this.stores = []
                for (let i = 0; i < newVal.items.length; i++) {
                    this.stores.push({ label: newVal.items[i].name, value: newVal.items[i].id })

                    if(newVal.items[i].id == router.currentRoute._value.params.store_id){
                        this.form.store_id.push(newVal.items[i].id);

                        this.updateProducts()
                    }
                }
            },
            oprprices: function (newVal, oldVal) {
                this.typePrice = []
                for (let i = 0; i < newVal.length; i++) {
                    this.typePrice.push({ key: newVal[i].guid, name: newVal[i].name })
                }
            },
            optcomplects: function (newVal, oldVal) {
                this.complects = newVal.complects
                this.total_complects = newVal.total
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
            action_discount: function (newVal, oldVal) {
                if(newVal){
                    this.form.comment = newVal.comment
                    this.form.paymentDelivery = this.paymentDelivery[newVal.payer]
                    this.form.min_amount = newVal.condition_min_sum
                    this.form.delay = newVal.delay_graph
                    this.postponement_period = newVal.delay
                    this.selected_complects = newVal.complects
                    this.selected = newVal.products
                    this.selected_data = newVal.products_data
                    this.total_selected = newVal.total_products

                    const data = {
                        storeid: this.form.store_id,
                        filter: this.filter,
                        filterselected: this.filter_table,
                        selected: Object.keys(newVal.products),
                        pageselected: this.page_selected,
                        page: this.page,
                        perpage: this.per_page
                    }
                    this.get_available_products_from_api(data).then((res) => {
                        this.kenostTableCheckedAllCheck()
                    })

                    // const dataComplect = {
                    //     action: 'complects/get',
                    //     filter: this.filter_complects,
                    //     page: this.page_complects,
                    //     perpage: this.pagination_items_per_page_complects,
                    //     store_id: router.currentRoute._value.params.id,
                    //     selected: this.selected_complects
                    // }
                    // this.opt_get_complects(dataComplect)
                }
            },
        }
    }
</script>

<style lang="scss">
</style>
  