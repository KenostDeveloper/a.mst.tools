<template>
<div>
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
    <div class="action-form">
      <div class="dart-form-group mb-4" :class="{
          error: v$.form.name.$errors.length
      }">
          <span class="ktitle">Наименование акции</span>
          <label for="name">Введите наименование, которое будет отражать смысл вашей акции.</label>
          <input v-model="this.form.name" type="text" name="name" placeholder="Укажите наименование Акции"
              class="dart-form-control mt-2" />
          <span class="error_desc" v-for="error of v$.form.name.$errors" :key="error.$uid">
              {{ error.$message }}
          </span>
      </div>

      <div class="dart-form-group mt-2 mb-4" :class="{ error: v$.form.store_id.$errors.length }">
          <span class="ktitle">Склад</span>
          <MultiSelect @change="this.set_deselected_products();this.updateStoreData()" v-model="this.form.store_id" :options="this.stores"
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
                <Checkbox v-model="this.form.adv.active" inputId="create-page-action"
                    name="create_page_action" value="true" />
                <label for="create-page-action" class="ml-2 mb-0"> Разместить рекламные баннеры </label>
            </div>
          </div>
          <div class="dart-form-group kenost-action-page pt-3"
              v-if="this.form.adv.active.length">
              <span class="ktitle">Место размещения баннера/товара</span>
              <MultiSelect v-model="this.form.adv.place" :options="this.place" optionLabel="name"
                  placeholder="Выберите один или несколько вариантов" class="w-full" />
          </div>
          <div class="dart-form-group kenost-action-page pt-3" v-if="this.form.adv.active.length">
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
                <img :src="this.form.adv.files?.max?.original_href" v-if="this.form.adv.files?.max?.original_href" />
            </div>
          </div>
          <div class="dart-form-group kenost-action-page pt-3" v-if="this.form.adv.active.length">
              <span class="ktitle">География показа</span>
              <Dropdown v-model="this.form.adv.geo" :options="this.geo" optionLabel="name"
                  placeholder="География показа" class="w-full md:w-14rem" />
          </div>
        </div>
        <div class="dart-form-group mb-4">
          <span class="ktitle">Описание</span>
          <Editor v-model="this.form.description" editorStyle="height: 320px" />
        </div>
        <div class="dart-form-group mb-3">
          <span class="ktitle">Совместимость скидок</span>
          <span class="field-desc">Выберите совместимость скидок. При выборе совместимости, Вам будет предложено выбрать режим совместимости.</span>
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
        <div class="dart-form-group mt-4"
          v-if="this.form.compatibilityDiscount == 3 || this.form.compatibilityDiscount == 4">
          <label>Выберите акции из списка</label>
          <MultiSelect :key="new Date().getMilliseconds()" filter v-model="this.form.actions"
              display="chip" :options="this.allAction" optionLabel="name" placeholder="Выберите из списка"
              class="w-full md:w-20rem" />
        </div>
        <div class="dart-form-group mt-4"
          v-if="this.form.compatibilityDiscount == 1 || this.form.compatibilityDiscount == 3 || this.form.compatibilityDiscount == 4">
          <label>Выберите режим совместимости</label>
          <Dropdown v-model="this.form.compabilityMode" :options="this.compabilityMode" optionLabel="name"
              placeholder="Режим совместимости" class="w-full md:w-14rem" />
        </div>
        <div @click="this.modals.view_actions = true" class="router-link-active dart-btn dart-btn-secondary btn-padding mb-4">Совместимость акций</div>
        <div class="dart-form-group mb-4" :class="{ error: v$.form.dates.$errors.length }">
          <span class="ktitle">Даты проведения</span>
          <span class="field-desc">Выберите период активности Акции.</span>
          <Calendar v-model="this.form.dates" selectionMode="range" placeholder="Выберите даты"
              :manualInput="false" showIcon />

          <span class="error_desc" v-for="error of v$.form.dates.$errors" :key="error.$uid">
              {{ error.$message }}
          </span>
        </div>
        <div class="dart-form-group mb-4">
          <span class="ktitle">Оплата доставки</span>
          <span class="field-desc">Выберите того, кто будет оплачивать доставку до Склада Покупателя.</span>
          <div class="kenost-wiget">
              <Dropdown v-model="this.form.paymentDelivery" :options="this.paymentDelivery" optionLabel="name"
                  placeholder="Оплата доставки" class="w-full md:w-14rem" />
          </div>
        </div>
        <div class="dart-form-group mb-4">
          <span class="ktitle">Отсрочка платежа</span>
          <span class="field-desc">Если отсрочка будет равна 0 дней, то для Пользователя выведется "Предоплата".</span>
          <div class="flex align-items-center gap-1 mt-2">
              <RadioButton v-model="this.form.typeDelay" inputId="typeDelay-1" name="typeDelay"
                  value="1" />
              <label for="typeDelay-1" class="ml-2 radioLabel">Отсрочка</label>
          </div>
          <div class="flex align-items-center gap-1 mt-2">
              <RadioButton v-model="this.form.typeDelay" inputId="typeDelay-2" name="typeDelay"
                  value="2" />
              <label for="typeDelay-2" class="ml-2 radioLabel">Под реализацию</label>
          </div>
          <div class="mt-3" v-if="this.form.typeDelay == '1'">
              <div class="postponement">
                  Срок отсрочки платежа: {{ this.form.postponementPeriod }} дней
                  <div class="postponement__settings" @click="this.modals.delay = !this.modals.delay">Настроить
                  </div>
              </div>
              
              <div class="postponement__graph">
                  <b>График платежей</b>
                  <p v-for="item in this.form.delay" :key="item.id">— {{ item.percent }}% через {{ item.day }}
                      дней после отгрузки</p>
              </div>
          </div>
          <div v-else>
              <div class="kenost-wiget mt-3">
                  <p>Количество дней реализации</p>
                  <InputNumber v-model="this.form.delayfix" inputId="horizontal-buttons-sum"
                      :step="1" min="1" incrementButtonIcon="pi pi-plus"
                      decrementButtonIcon="pi pi-minus" />
              </div>
          </div>
        </div>
        <div class="dart-form-group mb-4">
          <span class="ktitle">Условие акции</span>
          <div class="kenost-wiget">
              <Dropdown v-model="this.form.condition" :options="this.condition" optionLabel="name"
                  placeholder="Условие акции" class="w-full md:w-14rem" />
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
          <div class="dart-form-group mt-4">
            <div class="flex align-items-center gap-1">
              <Checkbox v-model="this.form.integration" :binary="true" inputId="integration"
                  name="integration" />
              <label for="integration" class="ml-2 mb-0">Интеграция с MachineStore</label>
            </div>
          </div>
          <div class="dart-form-group">
            <div class="flex align-items-center gap-1">
              <Checkbox v-model="this.form.hide_for_clients" :binary="true" inputId="hide_for_clients" name="hide_for_clients" />
              <label for="hide_for_clients" class="ml-2 mb-0"> Скрыть акцию у клиентов с Индивидуальными условиями </label>
            </div>
          </div>

          <div class="dart-form-group">
            <div class="flex align-items-center gap-1">
              <Checkbox v-model="this.form.negative" :binary="true" inputId="negative" name="negative" />
              <label for="negative" class="ml-2 mb-0"> Негативная акция </label>
            </div>
          </div>

          <div class="dart-form-group">
            <div class="flex align-items-center gap-1">
              <Checkbox v-model="this.form.offer" :binary="true" inputId="offer" name="offer" />
              <label for="offer" class="ml-2 mb-0"> Акция доступна только в предложениях</label>
            </div>
          </div>
        </div>
        <div class="dart-form-group">
          <span class="ktitle">Товары</span>
          <div class="dart-form-group mb-4" :class="{ loading: profuct_upload_loading }">
            <span class="field-desc">Вы можете загрузить список номенклатуры файлом XLSX. Настроить скидки Вы сможете с помощью таблицы, расположенной ниже.</span>
            <DropZone  v-if="!this.upload_product" class="kenost-dropzone" :maxFiles="Number(1)"
                url="/rest/file_upload.php?upload_products=xlsx" :uploadOnDrop="true" :multipleUpload="true"
                :acceptedFiles="['xlsx', 'xlsx']" :parallelUpload="1" @sending="parseFile" @removedFile="deselectProductAll" v-bind="args">
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
                  <p>Загружено товаров: {{ Object.keys(this.upload_selected).length }} шт</p>
                  <p>Всего товаров: {{ Object.keys(this.upload_selected).length + upload_error.length }} шт</p>
                  <div class="kenost-link-blue" v-if="upload_error.length" @click="this.modals.error_product = true">Список незагруженных
                      товаров</div>
              </div>
            </div>
            <a :href="site_url_prefix + '/assets/files/files/examples/ExampleLoadingProducts.xlsx'"
                class="kenost-link-blue mt-2" target="_blank">Скачать шаблон файла</a>
          </div>
        </div>
        <div class="mb-4">
          <span class="field-desc">Вы можете выбрать номенклатуру вручную. Здесь будут отражены в том числе товары добавленные файлом. Настроить скидки Вы сможете с помощью таблицы, расположенной ниже.</span>
          <Choicer
            :class="{ loading: product_loading }"
            title_available="Доступные товары"
            title_selected="Выбранные товары"
            :items_available="this.available_products.products"
            :total_available="this.available_products.total"
            :items_selected="this.selected_products.products"
            :total_selected="this.selected_products.total"
            :items_per_page="this.per_page"
            :page_available="this.product_available_page"
            :page_selected="this.product_selected_page"
            :filters="this.filters_available"
            :show_filter="true"
            @select="selectProduct"
            @deSelect="deselectProduct"
            @selectAll="selectProductAll"
            @deselectAll="deselectProductAll"
            @paginateAvailable="paginateAvailableProduct"
            @paginateSelected="paginateSelectedProduct"
            @filter="filterProduct"
          >
          <template #elem="{ image, name, article, color, store, price }">
            <img :src="image" alt="" />
            <div class="PickList__product-info">
                <div class="PickList__name">{{ name }}</div>
                <div class="PickList__article">
                    {{ article }} <span class="store-name-b2b"
                        :style="{ background: color }">{{ store }}</span>
                </div>
                <div class="PickList__price">{{ Number(price).toFixed(0) }} ₽</div>
            </div>
          </template>
        </Choicer>
        </div>

        <productTable
          :class="{ loading: product_loading }"
          title_available="Настройка выбранных товаров"
          :filters="this.filters_available"
          :show_filter="true"
          :page="this.product_selected_page"
          :items="this.selected_products.products"
          :total="this.selected_products.total"
          :items_per_page="this.per_page"
          @settings="settings"
          @paginate="paginateSelectedProduct"
          @filter="filterProductSelected"
          @changeMultiplicity="changeMultiplicity"
          @changeMinCount="changeMinCount"
          @deSelect="deselectProduct"
        ></productTable>
        <div class="dart-form-group mt-4 flex">
          <span class="ktitle">Коллекции</span>
          <span class="field-desc">Вы можете добавить в Акцию коллекцию товаров и задать на нее глобально настройки ценообразования.</span>
          <div>
            <button @click="this.modals.add_group = true" type="button" class="dart-btn dart-btn-primary  flex gap-2 align-items-center">
              <i class="pi pi-upload"></i><div>Добавить коллекцию</div>
            </button>
          </div>
          <div class="kenost-tab-container">
            <TabView class="tab-custom hidden-mobile-l mt-3 kenost-tab-custom" :scrollable="true">
                <TabPanel v-for="el in this.form.product_groups" :header="el.group.name + ' (' + el?.products?.total + ')'">
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
                                            this.modals.price = true
                                            this.modals.price_type = 'group'
                                            this.modals.price_group = el.group.id                                            
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
                            :page-count="(this.form.product_groups[el.group.id]?.products?.total / this.form.product_groups[el.group.id]?.perpage) > 0 ? Math.ceil(this.form.product_groups[el.group.id]?.products?.total / this.form.product_groups[el.group.id]?.perpage) : 1"
                            :click-handler="(page) => pagClickCallbackGroup(page, el.group.id)"
                            :prev-text="'Пред'"
                            :next-text="'След'"
                            :container-class="'pagination justify-content-center'"
                            :initialPage="this.page_selected"
                            :forcePage="el.page"
                        >
                        </paginate>
                    </div>
                </TabPanel>
            </TabView>
        </div>
        </div>
        <div class="mb-4">
          <span class="field-desc">Вы можете выбрать комплекты, участвующие в Акции.</span>
          <Choicer
            :class="{ loading: complect_loading }"
            title_available="Доступные комплекты"
            title_selected="Выбранные комплекты"
            :items_available="this.available_complects.complects"
            :total_available="this.available_complects.total"
            :items_selected="this.selected_complects.complects"
            :total_selected="this.selected_complects.total"
            :items_per_page="this.per_page"
            :page_available="this.complect_available_page"
            :page_selected="this.complect_selected_page"
            :filters="this.filters_available_complects"
            :show_filter="true"
            @select="selectComplect"
            @deSelect="deselectComplect"
            @selectAll="selectComplectAll"
            @deselectAll="deselectComplectAll"
            @paginateAvailable="paginateAvailableComplect"
            @paginateSelected="paginateSelectedComplect"
            @filter="filterComplect"
          >
            <template #elem="{ image, name, articles, cost }">
              <img :src="image" alt="" />
              <div class="PickList__product-info">
                  <div class="PickList__name">{{ name }}</div>
                  <div class="PickList__article">{{ articles }}</div>
                  <div class="PickList__price">{{ Number(cost).toFixed(0) }} ₽</div>
              </div>
            </template>
          </Choicer>
        </div>    
        <div class="dart-form-group mt-4">
          <span class="ktitle">Участники</span>
          <span class="field-desc">Вы можете задать как исключающие условия, так и настроить точечный показ Акции по географии.</span>
          <div class="flex align-items-center gap-1 mt-2">
              <RadioButton v-model="this.form.participantsType" inputId="participantsType-1"
                  name="participantsType" value="1" />
              <label for="participantsType-1" class="ml-2 radioLabel">Выбрать регион показа</label>
          </div>
          <div class="flex align-items-center gap-1 mt-3">
              <RadioButton v-model="this.form.participantsType" inputId="participantsType-4"
                  name="participantsType" value="2" />
              <label for="participantsType-4" class="ml-2 radioLabel">Исключить регион показа</label>
          </div>
          <div class="flex align-items-center gap-1 mt-3">
              <RadioButton v-model="this.form.participantsType" inputId="participantsType-3"
                  name="participantsType" value="3" />
              <label for="participantsType-3" class="ml-2 radioLabel">Неограниченный круг участников</label>
          </div>
      </div>
      <div class="dart-form-group" v-if="this.form.participantsType == '1' || this.form.participantsType == '2'" >
          <div class="kenost-select-reginos">
              <p class="kenost-select-reginos__title">Выбор участников по регионам</p>
              <div class="kenost-select-reginos__checkboxs">
                  <div class="flex align-items-center gap-1">
                      <Checkbox v-model="this.form.stores" inputId="access-1" name="access-1"
                          value="true" />
                      <label for="access-1" class="ml-2"> Розничные магазины </label>
                  </div>
                  <div class="flex align-items-center gap-1">
                      <Checkbox v-model="this.form.warehouses" inputId="access-2" name="access-2"
                          value="true" />
                      <label for="access-2" class="ml-2"> Оптовые компании </label>
                  </div>
                  <div class="flex align-items-center gap-1">
                      <Checkbox v-model="this.form.vendors" inputId="access-3" name="access-3"
                          value="true" />
                      <label for="access-3" class="ml-2"> Производители </label>
                  </div>
              </div>
              <MultiSelect filter v-model="this.form.regions" display="chip" :options="this.regions_all"
                  optionLabel="name" placeholder="Выберите регионы"
                  class="w-full md:w-20rem mt-2" />
          </div>
      </div>

      <div class="PickList" v-if="this.form.participantsType == '1' || this.form.participantsType == '2'">
          <div class="PickList__product" :style="{ width: '40%' }">
              <b class="PickList__title">Доступные Организации</b>
              <div class="PickList__filters">
                  <div class="form_input_group input_pl input-parent required">
                      <input type="text" id="filter_name" placeholder="Введите артикул или название"
                          class="dart-form-control" v-model="filter_organizations.name"
                          @input="setFilterOrganization('filter')" />
                      <label for="product_filter_name" class="s-complex-input__label">Введите название Организации</label>
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
                  <b>Выбранные Организации</b>
              </div>
              <div class="PickList__products PickList__products-selected">
                  <div class="PickList__el center" v-for="item in this.form.all_organizations_selected"
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
      </div>
    </div>
  </form>
  <Dialog v-model:visible="this.modal_checking" header=" " :style="{ width: '380px' }">
    <div class="kenost-not-produc">
        <img src="/images/icons_milen/action-status.png" alt="">
        <b class="text-center">Вы уверены, что хотите сохранить изменения?</b>
        <p>Обратите внимание, что <b>акция в настоящее время активна</b>, и после сохранения она вступит в силу, применив изменения ко всем добавленным товарам.</p>
        <div class="a-dart-btn a-dart-btn-primary" @click="formSubmit(event)">Сохранить</div>
    </div>
  </Dialog>
  <Dialog v-model:visible="this.modals.add_group" header="Добавить коллекцию" :style="{ width: '640px' }">
      <div>
          <Dropdown option-label="name" v-model="this.selected_group" :options="groups.items" optionLabel="long_name" class="w-full md:w-14rem mt-2" />
          <div class="w-full mt-3 justify-content-end flex">
              <button @click="addGroup()" type="button" class="dart-btn dart-btn-primary  flex gap-1 align-items-center">
                  <i class="pi pi-plus"></i><div>Добавить коллекцию</div>
              </button>
          </div>
      </div>
  </Dialog>
  <Dialog v-model:visible="this.modals.error_product" header="Список незагруженных товаров" :style="{ width: '640px' }">
    <div class="kenost-list-error">
      <table>
        <tr>
          <th class="text-left">№</th>
          <th class="text-left">Артикул</th>
        </tr>
        <tr v-for="(item, index) in this.upload_error" :key="item.id">
          <td>{{ index + 1 }}</td>
          <td>{{ item }}</td>
        </tr>
      </table>
    </div>
  </Dialog>
  <Dialog v-model:visible="this.modals.delay" header="Настройка отсрочки платежа" :style="{ width: '800px' }" :closable="false">
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
            <div class="kenost-add-button" @click="this.form.delay.push({ percent: 0, day: 0 });this.delayUpdate();"><i
                    class="pi pi-plus"></i> Добавить срок</div>
            <div class="kenost-add-button" @click="this.form.delay.pop();this.delayUpdate();" v-if="this.form.delay.length > 1"><i
              class="pi pi-minus"></i> Убрать</div>
            <div class="dart-btn dart-btn-primary"
                :class="{ 'kenots-button-stop': delayData.delayPercentSum > 100 || delayData.delayPercentSum < 100 }"
                @click="delayData.delayPercentSum == 100 ? (this.modals.delay = !this.modals.delay) : ''">
                Подтвердить
                <div class="kenots-button-stop__text">Сумма процентов должна составлять 100</div>
            </div>
        </div>
    </div>
  </Dialog>
  <Dialog v-model:visible="this.modals.price" :header="this.products_selected.length > 1 ? 'Массовые действия' : 'Настройка цены'" :style="{ width: '700px' }" @hide="resetDiscountFormula">
      <div class="kenost-modal-price">
          <div class="dart-alert dart-alert-info" v-if="this.modals.type_price != 3 && this.modals.price_step == 1">Если у товара не будет задан выбранный тип цен, скидка будет рассчитана от розничной цены.</div>
          <div class="product-kenost-card" v-if="this.products_selected.length == 1">
              <img :src="this.products_selected[0].image" />
              <div class="product-kenost-card__text">
                  <p>{{ this.products_selected[0].name }}</p>
                  <span>{{ this.products_selected[0].article }}</span>
              </div>
          </div>
          <div class="kenost-method-edit-flex" v-if="this.modals.price_step == 0">
            <div class="flex align-items-center gap-1 mt-3">
              <RadioButton v-model="this.modals.type_price" inputId="type_price-1" name="type_pricing" value="1" />
              <label for="type_price-1" class="ml-2 radioLabel">Задать вручную</label>
            </div>
            <div class="flex align-items-center gap-1 mt-3">
              <RadioButton v-model="this.modals.type_price" inputId="type_price-2" name="type_pricing" value="2" />
              <label for="type_price-2" class="ml-2 radioLabel">Тип цен</label>
            </div>
            <div class="flex align-items-center gap-1 mt-3" v-if="this.products_selected.length > 1">
              <RadioButton v-model="this.modals.type_price" inputId="type_price-3" name="type_pricing" value="3" />
              <label for="type_price-3" class="ml-2 radioLabel">Кратность</label>
            </div>
          </div>
          <div v-if="this.modals.price_step == 1 && this.modals.type_price == 1" class="two-colums mt-3">
              <div class="kenost-wiget">
                <p>Тип ценообразования</p>
                <Dropdown
                    @change="resetDiscount()"
                    v-model="this.products_selected_data.type_pricing"
                    :options="this.type_pricing" 
                    optionLabel="name"
                    class="w-full md:w-14rem" />
              </div>
              <div class="kenost-wiget" v-if="this.products_selected_data.type_pricing?.key != 3">
                <p>От типа цены</p>
                <Dropdown @change="updateFormula()"
                  v-model="this.products_selected_data.type_price"
                  :options="this.prices" 
                  optionLabel="name" 
                  class="w-full md:w-14rem" 
                />
              </div>
              <div class="kenost-wiget-two">
                  <div class="kenost-wiget">
                      <p>Значение</p>
                      <InputNumber v-model="this.products_selected_data.sale_value" inputId="horizontal-buttons" :step="0.1" min="0"
                          @update:modelValue="updateFormula()" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" />
                  </div>
                  <div class="kenost-wiget">
                      <p>&nbsp;</p>
                      <Dropdown 
                        @change="updateFormula()" 
                        :disabled="this.products_selected_data.type_pricing?.key == 3" 
                        v-model="this.products_selected_data.type_formula"
                        :options="this.type_formula" 
                        optionLabel="name" 
                        class="w-full md:w-14rem" 
                      />
                  </div>
              </div>
          </div>

          <div v-if="this.modals.price_step == 1 && this.modals.type_price == 2" class="two-colums mt-3">
            <div class="kenost-wiget">
              <p>Тип цены</p>
              <Dropdown @change="updateFormula()" 
                v-model="this.products_selected_data.type_price"
                :options="this.prices" 
                optionLabel="name"
                class="w-full md:w-14rem" 
              />
            </div>
          </div>

          <div v-if="this.modals.price_step == 1 && this.modals.type_price == 3" class="two-colums mt-3">
            <div class="kenost-wiget">
              <p>Кратность</p>
              <InputNumber 
                v-model="this.products_selected_data.multiplicity" 
                inputId="horizontal-buttons" 
                :step="1" 
                min="1" 
                incrementButtonIcon="pi pi-plus" 
                decrementButtonIcon="pi pi-minus" 
              />
            </div>
          </div>

          <div class="kenost-info-line" v-if="this.modals.price_step != 0 && this.products_selected.length == 1">
              <p>РРЦ: {{ this.products_selected[0].price ?? '—' }} ₽</p>
              <p>
                  Скидка от РРЦ:
                  {{ this.products_selected[0]?.save_data.sale }} %
              </p>
              <p>
                  Цена со скидой:
                  {{ this.products_selected[0]?.save_data.new_price ? this.products_selected[0]?.save_data.new_price : this.products_selected[0]?.price }} ₽
              </p>
          </div>

          <div v-if="this.products_selected_data.type_pricing?.key == 3 && this.modals.price_step != 0 && this.products_selected.length == 1">
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
</div>
</template>
<script>
import { useVuelidate } from '@vuelidate/core';
import { mapActions, mapGetters } from 'vuex';
import FileUpload from 'primevue/fileupload';
import Editor from 'primevue/editor';
import Calendar from 'primevue/calendar';
import RadioButton from 'primevue/radiobutton';
import Dropdown from 'primevue/dropdown';
import Dialog from 'primevue/dialog';
import InputNumber from 'primevue/inputnumber';
import TreeSelect from 'primevue/treeselect';
import DropZone from 'dropzone-vue';
import Checkbox from 'primevue/checkbox';
import Counter from '../components/opt/Counter.vue';
import MultiSelect from 'primevue/multiselect';
import router from '../router';
import Paginate from 'vuejs-paginate-next';
import { helpers, required } from '@vuelidate/validators';
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import Badge from 'primevue/badge';
import Choicer from '../components/Choicer.vue';
import productTable from '../components/table/product-table.vue';

export default {
    name: 'ProfileSalesAdd',
    props: {},
    data() {
      return {
        loading: false,
        product_loading: false,
        product_upload_loading: false,
        product_available_page: 1,
        product_selected_page: 1,
        complect_loading: false,
        complect_available_page: 1,
        complect_selected_page: 1,
        selected_group: {},
        // Фильтр по товарам
        filters_available: {
          name: {
            name: "Наименование, артикул",
            placeholder: "Наименование, артикул",
            type: "text",
          },
          catalog: {
            name: "Категория товара",
            placeholder: "Выберите категорию",
            type: "tree",
            values: this.getcatalog,
          }
        },
        // Фильтр по комплектам
        filters_available_complects: {
          name: {
            name: "Наименование, артикул",
            placeholder: "Наименование, артикул",
            type: "text",
          }
        },
        // Доступные товары
        products: [],
        products_selected: [],
        products_selected_data: {},
        total_products: 0,
        per_page: 24,
        // Флаги окон
        modals: {
          modal_checking: false,
          add_group: false,
          error_product: false,
          view_actions: false,
          delay: false,
          price: false,
          price_step: 0,
          price_type: ''
        },
        // Склады Организации
        stores: [],
        // Регионы
        regions: [],
        regions_all: [],
        // Организации
        all_organizations: [],
        // Места показа
        geo: [
            { name: 'Показывать всем', key: 0 },
            { name: 'По географии акции', key: 1 }
        ],
        // Рекламные места
        place: [],
        // Режим Совместимости Скидок
        compabilityMode: [
          { name: 'Применяется бóльшая', key: 0 },
          { name: 'Скидки складываются', key: 1 },
          { name: 'Скидки назначаются последовательно', key: 2 }
        ],
        // Плательщик Доставки
        paymentDelivery: [
          { name: 'Покупатель', key: 0 },
          { name: 'Поставщик', key: 1 }
        ],
        // Условия Акции
        condition: [
          { name: 'Без условий', key: 0 },
          { name: 'Задать условия', key: 1 }
        ],
        // Фильтр Организаций
        filter_organizations: {
          name: '',
          type: [1, 2]
        },
        // Данные отсрочки
        delayData: {
          delayPercentSum: 100,
          postponementPeriod: 0
        },
        type_formula: [
          { name: '₽', key: 0 },
          { name: '%', key: 1 }
        ],
        type_pricing: [
          {name: 'Наценка', key: 1},
          {name: 'Скидка', key: 2},
          {name: 'Фиксированая цена', key: 3}
        ],
        type_pricing_group: [
          {name: 'Наценка', key: 1},
          {name: 'Скидка', key: 2},
        ],
        prices: {},
        // Акции для выбора совместимости
        allAction: {},
        // Файлы
        upload_product: false,
        upload_selected: [],
        upload_error: [],
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
        // Форма с Данными
        form: {
          name: '',
          description: '',
          compatibilityDiscount: '1',
          actions: [],
          product_groups: {},
          compabilityMode: { name: 'Применяется бóльшая', key: 0 },
          paymentDelivery: { name: 'Покупатель', key: 0 },
          typeDelay: '1',
          delay: [
            {
              percent: 100,
              day: 0
            }
          ],
          postponementPeriod: 0,
          condition: { name: 'Скидка без условий', key: 0 },
          conditionMinSum: 0,
          conditionMinCount: 0,
          conditionMinGeneralCount: 0,
          hide_for_clients: 0,
          negative: 0,
          offer: 0,
          integration: 0,
          delayfix: 1,
          participantsType: '3',
          all_organizations_selected: {},
          regions: [],
          stores: [],
          warehouses: [],
          vendors: [],
          store_id: '',
          dates: [],
          adv: {
            active: false,
            place: '',
            geo: '',
            files: {}
          }
        }
      }
    },
    computed: {
      ...mapGetters([
        'org_stores',
        'actions',
        'adv_pages',
        'oprprices',
        'getregions',
        'allactions',
        'allorganizations',
        'available_products',
        'selected_products',
        'available_complects',
        'selected_complects',
        'getcatalog',
        'groups'
      ])
    },
    watch: {
      // Склады Организации
      org_stores: function (newVal, oldVal) {
          this.stores = [];
          for (let i = 0; i < newVal.items.length; i++) {
              this.stores.push({ label: newVal.items[i].name, value: newVal.items[i].id });
          }
      },
      // Акция (редактирование)
      actions: async function (newVal, oldVal) {
        if (router.currentRoute._value.params.sales_id) {
          
        }
      },
      allorganizations: function (newVal, oldVal) {
        this.all_organizations = newVal;
      },
      adv_pages: function (newVal, oldVal) {
        this.place = newVal;
      },
      getregions: function (newVal, oldVal) {
        this.regions = this.getregions;
      },
      allactions: function (newVal, oldVal) {
        this.allAction = [];
        this.allAction = newVal.items.map(function (el) {
            return { name: el.name, code: el.id };
        });
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
                  if (Array.isArray(newVal.selected) && newVal.selected.length == 0) {
                      this.selected = {};
                  } else if(newVal.selected){
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
      getcatalog(newVal, oldVal) {
        this.filters_available.catalog.values = newVal;
      },
      oprprices: function (newVal, oldVal) {
          this.prices = [];
          for (let i = 0; i < newVal.length; i++) {
              this.prices.push({ key: newVal[i].guid, name: newVal[i].name });
          }
      }
    },
    components: {
      Dropdown,
      MultiSelect,
      Checkbox,
      FileUpload,
      Editor,
      RadioButton,
      Calendar,
      InputNumber,
      Dialog,
      DropZone,
      Counter,
      Badge,
      TabPanel,
      TabView,
      TreeSelect,
      Paginate,
      Choicer,
      productTable
    },
    methods: {
      ...mapActions([
        'get_available_products_from_api',
        'set_selected_product_data',
        'set_selected_product',
        'set_deselected_product',
        'set_deselected_products',
        'set_selected_products',
        'get_available_complects_from_api',
        'set_selected_complect',
        'set_deselected_complect',
        'set_deselected_complects',
        'set_selected_complects',
        'org_get_stores_from_api',
        'upload_products_file',
        'get_sales_to_api',
        'get_regions_from_api',
        'get_sales_adv_pages_to_api',
        'get_all_sales_to_api',
        'get_all_organizations_from_api',
        'get_catalog_from_api',
        'opt_get_prices',
        'get_group_products',
        'get_group_api'
      ]),
      addGroup(){
        this.form.product_groups[this.selected_group.id] = {
          group: this.selected_group,
          page: 1,
          perpage: 20,
          search: "",
          typePricing: null,
          prices: null,
          price: 'key',
          saleValue: 0,
          typeFormul: null
        };
        this.updateGroups(this.selected_group.id)
        this.selected_group = {}
        this.modals.add_group = false
      },
      updateGroups(id){
        console.log('updateGroups', this.form.product_groups[id])          
        this.get_group_products({
          action: 'get/products',
          id: this.$route.params.id,
          group_id: id,
          page: this.form.product_groups[id].page,
          perpage: this.form.product_groups[id].perpage
        }).then((res) => {
          this.form.product_groups[id].products = res.data
        })
        // console.log(this.action_groups)
      },
      deleteGroup(id){
          this.form.groups = Object.fromEntries(
              Object.entries(this.product_groups)
                  .filter(([key]) => key !== id.toString())
          );
      },
      async formSubmit(event) {
        console.log('create')
        const validationResult = await this.v$.$validate();
        console.log(validationResult)
        if (!validationResult) {
            // console.log('validation failed');
            return;
        }
      },
      settings(items, type){
        // console.log(items)
        this.modals.price_type = type
        this.products_selected = items
        this.modals.price_step = 0        
        this.modals.price = true
        if(items.length == 1){
          // Если источник = Файл, устанавливаем фиксированную цену
          if(items[0].save_data.source == 2){
            this.modals.type_price = "1"
            this.modals.price_step = 1
            Object.entries(this.type_pricing).forEach((entry) => {
              const [key, value] = entry;
              if(value.key == 3){
                this.products_selected_data.type_pricing = value
              }
            });
            Object.entries(this.type_formula).forEach((entry) => {
              const [key, value] = entry;
              if(value.key == 0){
                this.products_selected_data.type_formula = value
              }
            });
            this.products_selected_data.sale_value = Number(items[0].save_data.new_price)
          }
        }
      },
      changeMultiplicity(item) {
        console.log(item)
        this.products_selected_data.multiplicity = item.value
        this.products_selected = []
        this.products_selected.push(item.item)
        const data = {
          type: "items",
          products: this.products_selected,
          data: this.products_selected_data
        }
        this.set_selected_product_data(data).then(() => {
          this.resetDiscountFormula()
        })
      },
      changeMinCount(item){
        console.log(item)
        this.products_selected_data.min_count = item.value
        this.products_selected = []
        this.products_selected.push(item.item)
        const data = {
          type: "items",
          products: this.products_selected,
          data: this.products_selected_data
        }
        this.set_selected_product_data(data).then(() => {
          this.resetDiscountFormula()
        })
      },
      closeDialogPrice(){
        if (this.modals.price_step === 0) {
          this.modals.price_step = 1;
        } else {
          this.modals.price_step = 0;
          this.modals.price = false;
          const data = {
            type: this.modals.price_type,
            products: this.products_selected,
            data: this.products_selected_data
          }
          this.set_selected_product_data(data).then(() => {
            this.resetDiscountFormula()
            this.updateStoreData()
          })
        }
      },
      onUpload(data) {
        if (data.xhr.response) {
          const response = JSON.parse(data.xhr.response);
          if (Object.prototype.hasOwnProperty.call(response.data, 'files')) {
            // перечень загруженных файлов
            if (response.data.files[0].type_banner === 'max') {
                this.form.adv.files.max = response.data.files[0];
            }
          }
        }
        this.$toast.add({ severity: 'info', summary: 'Файлы загружены', detail: 'Файл был успешно загружен', life: 3000 });
      },
      parseFile(files, xhr, formData) {
        this.product_upload_loading = true        
        const callback = (e) => {
          const res = JSON.parse(e);
          this.files.xlsx = res.data.files[0];
          const data = {
            id: router.currentRoute._value.params.id,
            action: 'upload/products/file',
            store_id: this.form.store_id,
            file: res.data.files[0].original,
            type: 'b2b'
          };
          this.upload_products_file(data).then((response) => {
            this.product_upload_loading = false
            this.upload_product = true
            this.upload_selected = []
            this.upload_error = []
            const productsList = response.data.data;
            for (let i = 1; i < Object.keys(productsList).length; i++) {
              const tempProduct = productsList[Object.keys(productsList)[i]];
              if (!tempProduct.error) {
                this.upload_selected.push(tempProduct.A);
              }else {
                this.upload_error.push(tempProduct.A);
              }
            }
            this.updateStoreData()
          });
        };
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                callback(xhr.response);
            }else{
              // alert("Произошла ошибка")
            }
        };
      },
      updateStoreData() {
        if(this.form.store_id){
          this.product_loading = true
          this.complect_loading = true
          this.product_available_page = 1
          this.product_selected_page = 1
          this.complect_available_page = 1
          this.complect_selected_page = 1
          this.opt_get_prices({
            action: 'get/type/prices',
            store_id: this.form.store_id
          });
          this.get_all_sales_to_api({
            id: router.currentRoute._value.params.id,
            action: 'get/all',
            store_id: this.form.store_id
          });
          this.get_available_products_from_api({ 
            store_id: this.form.store_id, 
            filter: '',
            page: this.product_available_page,
            perpage: this.per_page,
            type: 1
          }).then((res) => {
            this.get_available_products_from_api({ 
              store_id: this.form.store_id, 
              filter: '',
              page: this.product_selected_page,
              perpage: this.per_page,
              type: 2
            }).then((res) => {
              this.product_loading = false
            });
          });          
          this.get_available_complects_from_api({ 
            store_id: this.form.store_id, 
            filter: '',
            page: this.complect_available_page,
            perpage: this.per_page,
            type: 1
          }).then((res) => {
            this.get_available_complects_from_api({ 
              store_id: this.form.store_id, 
              filter: '',
              page: this.complect_selected_page,
              perpage: this.per_page,
              type: 2
            }).then((res) => {
              this.complect_loading = false
            });
          });   
          this.get_group_api({
            id: this.$route.params.id,
            store_id: this.form.store_id,
            action: "get"
          })       
        }
      },
      delayUpdate() {
        this.delayData.delayPercentSum = 0;
        this.delayData.postponementPeriod = 0;
        for (let i = 0; i < this.form.delay.length; i++) {
            if(this.form.delay[i].percent > 0){
              this.delayData.delayPercentSum += this.form.delay[i].percent;
            }else{
              this.delayData.delayPercentSum += 100;
            }            
            this.delayData.postponementPeriod = this.delayData.postponementPeriod + this.form.delay[i].day * (this.form.delay[i].percent / 100);
            this.form.postponementPeriod = this.delayData.postponementPeriod;
        }
      },
      selectOrganization(id) {
        const organization = this.all_organizations.find((r) => r.id === id);
        this.form.all_organizations_selected[organization.id] = organization;
        this.all_organizations = this.all_organizations.filter((r) => r.id !== id);
      },
      setFilterOrganization() {
        const data = { 
          filter: this.filter_organizations 
        };
        this.get_all_organizations_from_api(data).then((this.all_organizations = this.allorganizations));
      },
      deleteSelectOrganization(id) {
        this.all_organizations.unshift(this.form.all_organizations_selected[id]);
        // eslint-disable-next-line camelcase
        const new_all_organizations_selected = {};

        for (let i = 0; i < Object.keys(this.form.all_organizations_selected).length; i++) {
          if (this.form.all_organizations_selected[Object.keys(this.form.all_organizations_selected)[i]].id !== id) {
            new_all_organizations_selected[Object.keys(this.form.all_organizations_selected)[i]] =
                this.form.all_organizations_selected[Object.keys(this.form.all_organizations_selected)[i]];
          }
        }
        // eslint-disable-next-line camelcase
        this.form.all_organizations_selected = new_all_organizations_selected;
      },
      selectProduct(id){
        this.product_loading = true
        this.set_selected_product(id).then((res) => {
          this.updateStoreData();
        });        
      },
      selectComplect(id){
        this.complect_loading = true
        this.set_selected_complect(id).then((res) => {
          this.updateStoreData();
        });        
      },
      deselectProduct(id){
        this.product_loading = true
        this.set_deselected_product(id).then((res) => {
          this.updateStoreData();
        });
      },
      deselectComplect(id){
        this.complect_loading = true
        this.set_deselected_complect(id).then((res) => {
          this.updateStoreData();
        });
      },
      selectProductAll(data){
        this.product_loading = true
        this.set_selected_products({ 
          store_id: this.form.store_id, 
          filter: data.filter,
          filtersdata: data.filtersdata
        }).then((res) => {
          this.updateStoreData();
        });
      },
      selectComplectAll(data){
        this.product_loading = true
        this.set_selected_complects({ 
          store_id: this.form.store_id, 
          filter: data.filter
        }).then((res) => {
          this.updateStoreData();
        });
      },
      deselectProductAll(){
        this.product_loading = true
        this.set_deselected_products().then((res) => {
          this.updateStoreData();
        });
      },
      deselectComplectAll(){
        this.product_loading = true
        this.set_deselected_complects().then((res) => {
          this.updateStoreData();
        });
      },
      paginateAvailableProduct(data){
        this.product_loading = true
        this.product_available_page = data.page
        this.get_available_products_from_api({ 
          store_id: this.form.store_id, 
          filter: data.filter,
          filtersdata: data.filtersdata,
          page: data.page,
          perpage: this.per_page,
          type: 1
        }).then((res) => {
          this.product_loading = false
        });
      },
      paginateAvailableComplect(data){
        this.complect_loading = true
        this.complect_available_page = data.page
        this.get_available_complects_from_api({ 
          store_id: this.form.store_id, 
          filter: data.filter,
          page: data.page,
          perpage: this.per_page,
          type: 1
        }).then((res) => {
          this.complect_loading = false
        });
      },
      paginateSelectedProduct(data){
        this.product_selected_page = data.page
        this.get_available_products_from_api({ 
          store_id: this.form.store_id,
          page: data.page,
          perpage: this.per_page,
          type: 2
        }).then((res) => {
          this.product_loading = false
        });
      },
      paginateSelectedComplect(data){
        this.complect_loading = true
        this.complect_selected_page = data.page
        this.get_available_complects_from_api({ 
          store_id: this.form.store_id,
          page: data.page,
          perpage: this.per_page,
          type: 2
        }).then((res) => {
          this.complect_loading = false
        });
      },
      filterProduct(data){
        this.product_loading = true
        this.product_available_page = data.page
        this.get_available_products_from_api({ 
          store_id: this.form.store_id, 
          filter: data.filter,
          filtersdata: data.filtersdata,
          page: data.page,
          perpage: this.per_page,
          type: 1
        }).then((res) => {
          this.product_loading = false
        });
      },
      filterProductSelected(data){
        this.product_loading = true
        this.product_selected_page = data.page
        this.get_available_products_from_api({ 
          store_id: this.form.store_id, 
          filter: data.filter,
          filtersdata: data.filtersdata,
          page: data.page,
          perpage: this.per_page,
          type: 2
        }).then((res) => {
          this.product_loading = false
        });
      },
      filterComplect(data){
        this.complect_loading = true
        this.complect_available_page = data.page
        this.get_available_complects_from_api({ 
          store_id: this.form.store_id, 
          filter: data.filter,
          page: data.page,
          perpage: this.per_page,
          type: 1
        }).then((res) => {
          this.complect_loading = false
        });
      },
      resetDiscount(){
        // if(this.selected_products.length == 1){
          // Обнуляем на дефолтные значения
          this.products_selected_data.type_price = {}
          this.products_selected_data.type_formula = {}
          this.products_selected_data.sale_value = null
        // }
      },
      resetDiscountFormula(){
        // if(this.selected_products.length == 1){
          // Обнуляем на дефолтные значения
          this.modals.type_price == 1
          this.products_selected_data = {}
        // }
      },
      updateFormula(){
        if(this.products_selected.length == 1){
          var base_price = this.products_selected[0].price
          var rrc_price = this.products_selected[0].price
          // Если указан тип цены меняем базовую стоимость
          if(this.products_selected_data.type_price?.key){
            Object.entries(this.products_selected[0].save_data.prices).forEach((entry) => {
              const [key, value] = entry;
              if(value.guid == this.products_selected_data.type_price?.key){
                base_price = value.price
              }
            });
          }
          if(this.modals.type_price == 2){
            this.products_selected[0].save_data.new_price = base_price;
            if(base_price < rrc_price){
              this.products_selected[0].save_data.sale = ((rrc_price - this.products_selected[0].save_data.new_price) / rrc_price) * 100;
            }else{
              this.products_selected[0].save_data.sale = 0
            }            
          }
          if(this.modals.type_price == 1){
            if(this.products_selected_data.type_pricing && this.products_selected_data.sale_value && this.products_selected_data.type_formula){              
              // Наценка
              if(this.products_selected_data.type_pricing?.key == 1){
                // Рубли
                if(this.products_selected_data.type_formula?.key == 0){
                  this.products_selected[0].save_data.new_price = base_price + this.products_selected_data.sale_value;
                  this.products_selected[0].save_data.sale = ((rrc_price - this.products_selected[0].save_data.new_price) / rrc_price) * 100;
                }
                // Проценты
                if(this.products_selected_data.type_formula?.key == 1){
                  const koeff = (100 + Number(this.products_selected_data.sale_value)) * 0.01;
                  this.products_selected[0].save_data.new_price = Number(base_price * koeff).toFixed(2);
                  this.products_selected[0].save_data.sale = ((rrc_price - this.products_selected[0].save_data.new_price) / rrc_price) * 100;
                }
              }
              // Скидка
              if(this.products_selected_data.type_pricing?.key == 2){
                // Рубли
                if(this.products_selected_data.type_formula?.key == 0){
                  this.products_selected[0].save_data.new_price = base_price - this.products_selected_data.sale_value;
                  this.products_selected[0].save_data.sale = ((rrc_price - this.products_selected[0].save_data.new_price) / rrc_price) * 100;
                }
                // Проценты
                if(this.products_selected_data.type_formula?.key == 1){
                  const koeff = (100 - Number(this.products_selected_data.sale_value)) * 0.01;
                  this.products_selected[0].save_data.new_price = Number(base_price * koeff).toFixed(2);
                  this.products_selected[0].save_data.sale = ((rrc_price - this.products_selected[0].save_data.new_price) / rrc_price) * 100;
                }
              }
              // Фиксированная
              if(this.products_selected_data.type_pricing?.key == 3){
                this.products_selected[0].save_data.new_price = this.products_selected_data.sale_value;
                this.products_selected[0].save_data.sale = ((rrc_price - this.products_selected[0].save_data.new_price) / rrc_price) * 100;
              }
            }else{
              this.products_selected[0].save_data.new_price = base_price;
              this.products_selected[0].save_data.sale = 0;
            }
            this.products_selected[0].save_data.sale = Number(this.products_selected[0].save_data.sale).toFixed(2);
          }          
        }
      }
    },
    mounted() {
      // Убираем то, что было выбрано до этого
      this.set_deselected_products();
      this.set_deselected_complects();
      // Берем дерево Категорий
      this.get_catalog_from_api();
      // Берем Склады Организации
      this.org_get_stores_from_api({
        action: 'get/stores',
        id: this.$route.params.id
      });
      // Берем Акцию, если редактируем
      if(router.currentRoute._value.params.sales_id){
        // TODO: Оптимизировать
        this.get_sales_to_api({ 
          id: router.currentRoute._value.params.sales_id, 
          actionid: router.currentRoute._value.params.sales_id 
        }).then(() => {
          this.loading = false;
        });
      }
      // Берем географию
      this.get_regions_from_api().then(() => {
        this.regions = this.getregions;
        this.regions_all = this.regions.map(function (el) {
            return { name: el.label, code: el.key };
        });
      });
      // Доступные места рекламы
      this.get_sales_adv_pages_to_api({
        action: 'get/adv/pages',
        store_id: router.currentRoute._value.params.id,
        type: 1
      });
      const data = { filter: this.filter_organizations };
      this.get_all_organizations_from_api(data).then((this.all_organizations = this.allorganizations));
      if(this.form.store_id){
        this.get_all_sales_to_api({
          id: router.currentRoute._value.params.id,
          action: 'get/all',
          store_id: this.form.store_id
        });
        this.get_available_products_from_api({ 
          store_id: this.form.store_id, 
          filter: '',
          page: this.product_available_page,
          perpage: this.per_page,
          type: 1
        }).then((res) => {
        });
        this.get_available_products_from_api({ 
          store_id: this.form.store_id, 
          filter: '',
          page: this.product_selected_page,
          perpage: this.per_page,
          type: 2
        }).then((res) => {
        });
        this.get_available_complects_from_api({ 
          store_id: this.form.store_id, 
          filter: '',
          page: this.complect_available_page,
          perpage: this.per_page,
          type: 1
        }).then((res) => {
        });
        this.get_available_complects_from_api({ 
          store_id: this.form.store_id, 
          filter: '',
          page: this.complect_selected_page,
          perpage: this.per_page,
          type: 2
        }).then((res) => {
        });
        this.get_group_api({
          id: this.$route.params.id,
          store_id: this.form.store_id,
          action: "get"
        })
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
                dates: {
                    required: helpers.withMessage('Заполните даты проведения', () => this.form.dates?.length > 0)
                }
            }
        };
    }
}
</script>
<style lang="scss">
  .dropzone__box{
    z-index: 1;
  }
</style>