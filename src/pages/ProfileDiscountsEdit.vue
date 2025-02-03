<template>
    <Loading v-if="loading" />

    <form @submit.prevent="formSubmit" class="kenost-discounts">
        <div class="profile-content__title sticky-element">
            <span class="maintitle">Настройка индивидуальных условий для {{action_discount.client_name}}</span>
            <div class="buttons_container">
                <RouterLink :to="{ name: 'discounts', params: { id: $route.params.id } }"
                    class="dart-btn dart-btn-secondary btn-padding">Отменить</RouterLink>
                <button type="submit" class="dart-btn dart-btn-primary btn-padding"
                    :class="{ 'dart-btn-loading': loading }" :disabled="loading">Сохранить изменения</button>
            </div>
        </div>

        <div class="dart-form-group mt-2 mb-4">
            <span class="ktitle">Склад</span>
            <MultiSelect @change="updateProducts" v-model="this.form.store_id" :options="this.stores"
                optionLabel="label" optionValue="value" placeholder="Выберите склад" disabled />
        </div>

        <div v-if="this.form.store_id.length > 0">

            <div class="dart-form-group mb-4">
                <span class="ktitle">Комментарий</span>
                <!-- <label for="name">Введите наименование, которое будет отражать смысл вашей акции.</label> -->
                <input v-model="this.form.comment" type="text" name="name" placeholder="Укажите комментарий"
                    class="dart-form-control">
            </div>

            <div class="dart-form-group mb-4">
                <span class="ktitle">Условия отплаты доставки</span>
                <div class="kenost-wiget">
                    <p>Плательщик</p>
                    <Dropdown v-model="this.form.paymentDelivery" :options="this.paymentDelivery" optionLabel="name"
                        placeholder="Оплата доставки" class="w-full md:w-14rem" />
                </div>
            </div>

            <div class="dart-form-group mb-4">
                <span class="ktitle">Минимальная сумма заказа</span>
                <div class="two-colums">
                    <div class="kenost-wiget w-1/2">
                        <InputNumber v-model="this.form.min_amount" inputId="horizontal-buttons" :step="0.1" :min="0"
                            incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" suffix=" ₽" />
                    </div>
                </div>
            </div>

            <div class="dart-form-group mb-4">
                <span class="ktitle">Отсрочка</span>
                <div class="postponement">Срок отсрочки платежа: {{ this.postponement_period }} дней <div
                        class="postponement__settings" @click="this.modals.delay = !this.modals.delay">Настроить</div>
                </div>
                <div class="postponement__graph">
                    <b>График платежей</b>
                    <p v-for="item in this.form.delay" :key="item.id">— {{ item.percent }}% через {{ item.day }} дней после
                        отгрузки</p>
                </div>
            </div>

            <!-- <div class="dart-form-group mb-4">
                <span class="ktitle">Скидка на все товары</span>
                <div class="kenost-all-table-activity">
                    <div class="kenost-wiget">
                        <p>Массовое действие</p>
                        <Dropdown v-model="this.kenostActivity.type" :options="this.massActionAll" optionLabel="name"
                            placeholder="Массовое действие" class="w-full md:w-14rem" />
                    </div>
                    <div class="kenost-wiget"
                        v-if="this.kenostActivity.type.key == 0 || this.kenostActivity.type.key == 1">
                        <p>Тип цен</p>
                        <Dropdown v-model="this.kenostActivity.typePrice" :options="this.typePrice" optionLabel="name"
                            placeholder="Тип цен" class="w-full md:w-14rem" />
                    </div>
                    <div class="kenost-wiget" v-if="this.kenostActivity.type.key == 0">
                        <p>Значение</p>
                        <InputNumber v-model="this.kenostActivity.value" inputId="horizontal-buttons" :step="1" min="0"
                            incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" />
                    </div>
                    <div class="kenost-wiget" v-if="this.kenostActivity.type.key == 0">
                        <p>&nbsp;</p>
                        <Dropdown v-model="kenostActivity.typeFormul" :options="this.typeFormul" optionLabel="name"
                            class="w-full md:w-14rem" />
                    </div>

                    <div class="kenost-wiget" v-if="this.kenostActivity.type.key == 3">
                        <p>Значение</p>
                        <InputNumber v-model="this.kenostActivity.multiplicity" inputId="horizontal-buttons" :step="1"
                            min="1" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" />
                    </div>
                </div>
            </div> -->

            <div class="dart-form-group picker-wrap">
                <span class="ktitle">Скидки на группы товаров</span>
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
                            <img :src="item.image" alt="">
                            <div class="PickList__product-info">
                                <div class="PickList__name">{{ item.name }}</div>
                                <div class="PickList__article">{{ item.article }}</div>
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
                    <div class="PickList__select" @click="setAllProducts(true)"><i class="pi pi-angle-double-right"></i>
                    </div>
                    <div class="PickList__select mt-2" @click="setAllProducts(false)"><i
                            class="pi pi-angle-double-left"></i></div>
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
                                    <div class="PickList__name">{{ item.name }}</div>
                                    <div class="PickList__article">{{ item.article }}</div>
                                    <div class="PickList__price">{{ Number(item.price).toFixed(0) }} ₽</div>
                                </div>
                            </div>
                            <div @click="deleteSelect(item.id)" class="PickList__select"><i class="pi pi-times"></i>
                            </div>
                        </div>
                    </div>
                </div>
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
                            <img :src="item.image" alt="">
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
                        <div class="PickList__el" v-for="(item) in this.selected_complects" :key="item.id">
                            <img :src="item.image" alt="">
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
                                class="dart-form-control" v-model="filter_table.name" @input="setFilter('filter')" />
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
                            <th class="table-kenost__name">Минимальное <br> количество</th>
                            <th class="table-kenost__name">Кратность</th>
                            <th class="table-kenost__name">Сумма</th>
                            <th class="table-kenost__name">Действие</th>
                        </tr>
                    </thead>
                    <!-- Вывод комплектов -->
                    <tbody>
                        <tr v-for="item in this.selected_visible" :key="item?.id"
                            v-if="this.complects_ids.indexOf(item?.id) === -1">
                            <td class="table-kenost__checkbox">
                                <Checkbox @change="kenostTableCheckedAllCheck" v-model="this.kenost_table"
                                    inputId="kenost_table" :value="item.id" />
                            </td>
                            <td class="table-kenost__product">
                                <img :src="item.image">
                                <div class="table-kenost__product-text">
                                    <p>{{ item.name }}</p>
                                    <span>{{ item.article }}</span>
                                </div>
                            </td>
                            <td>
                                {{ (Number(item.price).toFixed(2)).toLocaleString('ru') }} ₽
                            </td>
                            <td>
                                {{ this.selected_data[item.id] ?
                                    (Number(this.selected_data[item.id].discountInterest).toFixed(2)).toLocaleString('ru') :
                                Number(0.00).toFixed(2) }}
                            </td>
                            <td>
                                {{ this.selected_data[item.id] ?
                                    (Number(this.selected_data[item.id].finalPrice).toFixed(2)).toLocaleString('ru') :
                                item.price.toLocaleString('ru')}} ₽
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
                                <Counter class="margin-auto" @ElemCount="ElemCount" :item="item" :id="item.id" :min="1"
                                    :value="this.selected_data[item.id].multiplicity"
                                    :key="new Date().getMilliseconds() + item.id" />
                            </td>
                            <td v-else>
                                <Counter class="margin-auto" @ElemCount="ElemCount" :item="item" :id="item.id" :min="1"
                                    :value="1" />
                            </td>
                            <td>
                                {{ this.selected_data[item.id] ? (Number(this.selected_data[item.id].finalPrice) *
                                    this.selected_data[item.id].multiplicity).toFixed(2) : item.price.toLocaleString('ru')
                                }} ₽
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
                    <div class="table-kenost-help__select"><span>Отмечено:</span> {{ this.kenost_table.length }} / {{
                        Object.keys(this.selected).length }}</div>
                    <div class="flex align-items-center gap-1">
                        <Checkbox @change="globalTable" v-model="this.form.global_kenost_table"
                            inputId="global_kenost_table-1" name="global_kenost_table-1" value="true" />
                        <label for="global_kenost_table-1" class="ml-2 mb-0">Все</label>
                    </div>
                    <div v-if="filter_table.name != ''" class="flex align-items-center gap-1">
                        <Checkbox @change="filterglobalTable" v-model="this.filter_kenost_table"
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
                                    {{ item.price > 0 && item.price > item.new_price ? ((Math.round(((item.price - item.new_price) / item.price) * 10000) / 100) + '%') : '0' }}
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
                    @click="delayPercentSum == 100 ? this.modals.delay = !this.modals.delay : ''">
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
                <tr v-for="item, index in this.error_product" :key="item.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item }}</td>
                </tr>
            </table>
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
import Loading from '../components/Loading.vue'
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import Badge from 'primevue/badge';

export default {
    name: 'ProfileDiscountsEdit',
    data() {
        return {
            loading: true,
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
            files: {
                xlsx: {}
            },
            filter_kenost_table: [],
            ids_visible: [],
            error_product: [],
            modals: {
                delay: false,
                price: false,
                error_product: false,
                add_group: false,
                price_group: false,
                group_id: -1,
                price_step: 0,
                type_price: '1',
                product_id: -1,
                headers: ['Метод редактирования цены', 'Задать вручную', 'Тип цен']
            },
            stores: [],
            paymentDelivery: [
                { name: 'Покупатель', key: 0 },
                { name: 'Поставщик', key: 1 }
            ],
            massAction: [
                { name: 'Задать вручную', key: 0 },
                { name: 'Тип цен', key: 1 },
                { name: 'Кратность', key: 3 }
            ],
            massActionAll: [
                { name: 'Скидка по формуле', key: 0 },
                { name: 'Тип цен', key: 1 },
            ],
            typePricingGroup: [
                {name: 'Наценка', key: 1},
                {name: 'Скидка', key: 2},
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
                typeFormul: { name: '%', key: 1 },
                discountInterest: 0,
                multiplicity: 1,
                typePricing: {name: 'Наценка', key: 1}
            },
            typeFormul: [
                { name: '₽', key: 0 },
                { name: '%', key: 1 }
            ],
            typePricing: [
                {name: 'Наценка', key: 1},
                {name: 'Скидка', key: 2},
                {name: 'Фиксированая цена', key: 3}
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
            add_group: {},
            action_groups: {},
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
        MultiSelect,
        Loading,
        TabView,
        TabPanel,
        Badge
    },
    computed: {
        ...mapGetters([
            'org_stores',
            'oprprices',
            'available_products',
            'optcomplects',
            'action_discount',
            'groups',
            'group_build'
        ]),
        pagesCountSelect() {
            let pages = Math.round(this.total_selected / this.per_page)
            if (pages === 0) {
                pages = 1
            }
            return pages
        },
        pagesCount() {
            let pages = Math.round(this.total_products / this.per_page)
            if (pages === 0) {
                pages = 1
            }
            return pages
        },
    },
    async mounted() {
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
            id: router.currentRoute._value.params.id
        })
        this.opt_get_prices({
            action: 'get/type/prices',
            store_id: [router.currentRoute._value.params.store_id]
        }).then(() => {
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
                    this.kenostTableCheckedAllCheck();
                    this.loading = false;
                })
            })
        })
        this.get_group_api({
            id: this.$route.params.id,
            action: "get"
        })
    },
    updated() {

    },
    methods: {
        ...mapActions([
            'org_get_stores_from_api',
            'opt_get_prices',
            'get_available_products_from_api',
            'opt_get_remain_prices',
            'opt_get_complects',
            'set_sales_to_api',
            'get_actions_discount_api',
            'opt_upload_products_file',
            'get_group_api',
            'build_group_api'
        ]),
        formSubmit(event) {
            let groups_data = this.action_groups
            // console.log(groups_data)
            for(let i = 0; i < Object.keys(groups_data).length; i++){
                // console.log(groups_data[Object.keys(groups_data)[i]])
                groups_data[Object.keys(groups_data)[i]].products = null
            }

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
                    groups: groups_data
                }).then(() => {
                    router.push({ name: 'discounts', params: { id: router.currentRoute._value.params.id } })
                })
            })
        },
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
        filterglobalTable() {
            if (this.filter_kenost_table.length === 0) {
                this.kenost_table = this.kenost_table.filter(id => !this.ids_visible.includes(id));
            } else {
                this.kenost_table = [...new Set([...this.kenost_table, ...this.ids_visible])];
            }
            this.kenostTableCheckedAllCheck();
        },
        updateGroups(id){
            // console.log(this.action_groups[id])
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
                typePricing: this.action_groups[id].typePricing?.key ? this.action_groups[id].typePricing?.key : 'key',
                filter: {
                    name: this.action_groups[id].search
                }
            }).then((res) => {
                this.action_groups[id].products = res.data
            })

            // console.log(this.action_groups)
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
        massActionTable() {
            for (let i = 0; i < this.kenost_table.length; i++) {
                if (!this.selected_data[this.kenost_table[i]]) {
                    const elem = {
                        price: Number(this.selected[this.kenost_table[i]].price),
                        multiplicity: 1,
                        min_count: 1,
                        finalPrice: Number(this.selected[this.kenost_table[i]].price),
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
        settings(item, modal) {
            console.log(this.selected_data[item.id])
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
        setGroupTypePrice(){
            this.action_groups[this.modals.group_id].typePricing = {name: 'Скидка', key: 2}
            this.updateGroups(this.modals.group_id)
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
        delayUpdate() {
            this.delayPercentSum = 0
            this.postponement_period = 0
            for (let i = 0; i < this.form.delay.length; i++) {
                this.delayPercentSum += this.form.delay[i].percent
                this.postponement_period = this.postponement_period + (this.form.delay[i].day * (this.form.delay[i].percent / 100))
            }
        },
        globalTable() {
            if (this.form.global_kenost_table.length === 0) {
                this.kenost_table = []
            } else {
                this.kenost_table = Object.keys(this.selected)
            }
            this.kenostTableCheckedAllCheck()
        },
        selectComplect(id) {
            const complect = this.complects.find(r => r.id === id)
            this.selected_complects[complect.id] = complect
            this.complects = this.complects.filter((r) => r.id !== id)
            const data = {
                action: 'complects/get',
                filter: this.filter_complects,
                page: this.page_complects,
                perpage: this.pagination_items_per_page_complects,
                id: router.currentRoute._value.params.id,
                selected: this.selected_complects
            }
            this.opt_get_complects(data)
            // this.total_selected++
        },
        deleteSelectComplect(id) {
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
                id: router.currentRoute._value.params.id,
                selected: this.selected_complects
            }
            this.opt_get_complects(data)
        },
        updateProducts() {
            this.selected = {}
            this.selected_data = {}
            this.selected_visible = {}
            this.products = []

            const data = {
                storeid: this.form.store_id,
                filter: this.filter,
                filterselected: this.filter_table,
                selected: Object.keys(this.selected),
                pageselected: this.page_selected,
                page: this.page,
                perpage: this.per_page
            }

            this.get_available_products_from_api(data).then(
                this.kenostTableCheckedAllCheck()
            )

            this.opt_get_prices({
                action: 'get/type/prices',
                store_id: this.form.store_id
            })
        },
        parseFile(files, xhr, formData) {
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
                    // this.selected = {}
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
        setFilter() {
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
        setAllProducts(is) {
            this.loading = true
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
                this.loading = false;
            });
        },
        select(id) {
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

                this.selected_data[product.id] = product
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
                this.total_selected++;
                this.loading = false;
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
        deleteSelect(id) {
            this.products.push(this.selected[id]);

            this.kenost_table = this.kenost_table.filter(el => el != id);
            delete this.selected[id];

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
            this.total_selected--;
        },
        pagClickCallback(pageNum) {
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
        pagClickCallbackSelect(pageNum) {
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
        kenostTableCheckedAllCheck() {
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

            let isPageSelectFilter = false;

            for (let i = 0; i < this.ids_visible?.length; i++) {
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
                    this.kenost_table.push(this.selected_visible[Object.keys(this.selected_visible)[i]].id)
                }
            } else {
                for (let i = 0; i < Object.keys(this.selected_visible).length; i++) {
                    this.kenost_table = this.kenost_table.filter((el) => el !== this.selected_visible[Object.keys(this.selected_visible)[i]].id)
                }
            }
        },
        ElemCount(obj) {
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
        ElemMinCount(obj) {
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
        setTypePrice() {
            const getPrice = this.selected[this.modals.product_id].prices.find(r => r.guid === this.selected_data[this.modals.product_id].typePrice.guid).price
            this.selected_data[this.modals.product_id].finalPrice = Number(getPrice)
            this.selected_data[this.modals.product_id].discountInRubles = Number(this.selected_data[this.modals.product_id].price) - Number(getPrice)
            this.selected_data[this.modals.product_id].discountInterest = (Number(this.selected_data[this.modals.product_id].price) - Number(getPrice)) / (Number(this.selected_data[this.modals.product_id].price) / 100)
        },
        createSet() {
            // Создание комлпекта
            const tempComplect = {}
            for (let i = 0; i < this.kenost_table.length; i++) {
                tempComplect[i] = this.selected[this.kenost_table[i]]
                this.complects_ids.push(this.selected[this.kenost_table[i]].id)
            }
            this.complects.push(tempComplect)
            // console.log(this.complects_ids)
        },
        setDiscountFormul(type, value, typePrice) {
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
    watch: {
        org_stores: function (newVal, oldVal) {
            this.stores = []
            for (let i = 0; i < newVal.items.length; i++) {
                this.stores.push({ label: newVal.items[i].name, value: newVal.items[i].id })

                if (newVal.items[i].id == router.currentRoute._value.params.store_id) {
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
            console.log(newVal != null)
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
                        if (newVal.isallproducts) {
                            this.selected = { ...this.selected, ...newVal.selected };
                        } else {
                            this.selected = newVal.selected
                        }
                    }
                    if (newVal.visible) {
                        this.selected_visible = newVal.visible
                        this.ids_visible = newVal.ids_selected;
                    }
                    else {
                        this.selected_visible = []
                        this.ids_visible = [];
                    }
                    this.total_products = newVal.total
                    this.total_selected = newVal.total_selected
                }
            }
        },
        action_discount: function (newVal, oldVal) {
            if (newVal.exists) {
                this.form.comment = newVal.comment
                this.form.paymentDelivery = this.paymentDelivery[newVal.payer]
                this.form.min_amount = newVal.condition_min_sum
                this.form.delay = newVal.delay_graph
                this.postponement_period = newVal.delay
                this.selected_complects = newVal.complects
                this.selected = newVal.products
                this.selected_data = newVal.products_data
                this.total_selected = newVal.total_products

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

                if (newVal.type_all_sale != null) {
                    this.kenostActivity = {
                        type: this.massActionAll[newVal.type_all_sale],
                        typePrice: this.typePrice.find(item => item.key === newVal.type_price),
                        value: newVal.all_sale_value,
                        typeFormul: this.typeFormul[newVal.type_all_sale_symbol]
                    }
                }

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

            }
        },
    }
}
</script>

<style lang="scss"></style>