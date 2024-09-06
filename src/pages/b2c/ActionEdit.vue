<template>
    <Toast />
    <form @submit.prevent="formSubmit">
      <div class="profile-content__title sticky-element">
          <span class="maintitle">Редактирование акции</span>
          <div class="buttons_container">
            <RouterLink :to="{ name: 'b2c', params: { id: $route.params.id }}" class="dart-btn dart-btn-secondary btn-padding">Отменить</RouterLink>
            <button type="submit" class="dart-btn dart-btn-primary btn-padding" :class="{ 'dart-btn-loading': loading }" :disabled="loading">Сохранить</button>
          </div>
      </div>
      <div>
        <div>
          <p class="kgraytext m-0" v-if="this.status">Статус: <span :class="{ 'status-moderation': this.status === 'Модерация', 'status-fatal': this.status === 'Отказ', 'status-planned': this.status === 'Запланирована', 'status-active': this.status === 'Активна' }">{{this.status}}</span></p>
          <p class="kgraytext" v-if="this.moderator_comment != '' && this.moderator_comment">Комментарий от модератора: {{ this.moderator_comment }}</p>
        </div>

        <div class="dart-form-group mt-2 mb-4">
          <span class="ktitle">Заголовок</span>
          <!-- <label for="name">Введите наименование, которое будет отражать смысл вашей акции</label> -->
          <input v-model="form.name" type="text" name="name" placeholder="Укажите название акции" class="dart-form-control" :class="{'kenost-error':this.validation.name.error}">
          <span v-if="this.validation.name.error" class="kenost-error-text">{{ this.validation.name.text }}</span>
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
            <span class="ktitle">Страница акции</span>
            <div class="flex align-items-center gap-1">
                <Checkbox v-model="this.create_page_action" inputId="create-page-action" name="create_page_action" value="true" />
                <label for="create-page-action" class="ml-2 mb-0"> Создавать страницу акции </label>
            </div>
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
                <span class="ktitle">Малый баннер</span>
                <span>Загрузить изображение нужно размером не менее 324х161, соблюдая пропорции. Чтобы не потерялось качество, желательно загружать изображение в три раза больше указанного размера.</span>
              </div>
              <FileUpload class="kenost-upload-button" mode="basic" name="banner_small[]" :url="'/rest/file_upload.php?banner=min'" accept="image/*" :maxFileSize="2000000" @upload="onUpload" :auto="true" chooseLabel="Загрузить" />
            </div>
            <div class="upload-banner__image">
              <img :src="files?.min?.original_href" v-if="files?.min?.original_href">
            </div>
          </div>

          <div class="dart-form-group kenost-action-page pt-3" v-if="this.create_page_action.length != 0">
            <div class="upload-banner">
              <div class="upload-banner__text">
                <span class="ktitle">Квадратный баннер</span>
                <span>Загрузить изображение нужно размером не менее 459х459, соблюдая пропорции. Чтобы не потерялось качество, желательно загружать изображение в три раза больше указанного размера.</span>
              </div>
              <FileUpload class="kenost-upload-button" mode="basic" name="small[]" :url="'/rest/file_upload.php?banner=small'" accept="image/*" :maxFileSize="2000000" @upload="onUpload" :auto="true" chooseLabel="Загрузить" />
            </div>
            <div class="upload-banner__image">
              <img :src="files?.small?.original_href" v-if="files?.small?.original_href">
            </div>
          </div>

          <div class="dart-form-group kenost-action-page pt-3" v-if="this.create_page_action.length != 0">
              <div class="rules-container">
                  <div class="rules-container__text">
                      <span class="ktitle">Правила акции</span>
                      <p class="kgraytext">Загрузите файл с подробными правилами акции</p>
                      <a target="_blank" :href="files?.file?.original_href" class="kenost-add-file" v-if="files?.file?.original_href">
                          <!-- <img src="../../../public/img/files/pdf.png" alt=""> -->
                          <p>{{files?.file?.name? files?.file?.name : "Файл загружен!"}}</p>
                      </a>
                  </div>
                  <FileUpload class="kenost-upload-button" mode="basic" name="icon[]" :url="'/rest/file_upload.php?banner=file'" accept="application/pdf" :maxFileSize="20000000" @upload="onUpload" :auto="true" chooseLabel="Загрузить" />
              </div>
          </div>

          <div class="dart-form-group kenost-action-page pt-3" v-if="this.create_page_action.length != 0">
            <span class="ktitle">Место размещение баннера/товара</span>
            <MultiSelect v-model="this.place_action" :options="this.place" optionLabel="name" placeholder="Выберите один или несколько вариантов"
              class="w-full" />
          </div>

          <div class="dart-form-group kenost-action-page pt-3" v-if="this.create_page_action.length != 0">
            <span class="ktitle">География показа</span>
            <Dropdown v-model="this.geo_action" :options="this.geo" optionLabel="name" placeholder="География показа" class="w-full md:w-14rem" />
          </div>

          <div class="dart-form-group kenost-action-page pt-3" v-if="this.create_page_action.length != 0">
            <span class="ktitle">Позиция в карусели</span>
            <InputNumber
              v-model="this.position"
              inputId="horizontal-buttons"
              :step="1"
              min="0"
              max="100"
              incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
            />
          </div>

          <div class="dart-form-group mb-4 mt-4">
            <span class="ktitle">Условия</span>
            <input v-model="form.conditions" type="text" name="conditions" placeholder="Укажите условия акции" class="dart-form-control" >
          <!-- :class="{'kenost-error':this.validation.conditions.error}" -->
            <!-- <span v-if="this.validation.conditions.error" class="kenost-error-text">{{ this.validation.conditions.text }}</span> -->
          </div>

          <div class="dart-form-group mb-4">
            <span class="ktitle">Описание</span>
            <!-- <Editor ref="editorRef" v-model="this.form.description" @load="updateEditorContent(this.form.description)" editorStyle="height: 320px" /> -->
            <Editor
              api-key="ctqgmxpl4dimvsnrt6lnhbyk2xb7eyrhvbbh9lch2kltngkh"
              language_url='../../../src/locales/tiny/ru.js'
              :language_load=true
              v-model="this.form.description"
              initial-value="<b>Подзаголовок акции</b>
              <br>
              <p><span style='text-decoration: underline'>Перечислить все выгодные условия:</span> скидки, подарки, бонусы, возможность выиграть приз и т.д.</p>
              <p><span style='text-decoration: underline'>Выделить ключевые преимущества:</span> чем ваша акция лучше, чем у конкурентов?</p>
              <p><span style='text-decoration: underline'>Указать, для кого она предназначена:</span> для всех, для определенной возрастной группы, для постоянных клиентов и т.д.</p>"
              :init="{
                plugins: [
                  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                  'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                  'insertdatetime', 'media', 'table', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | ' +
                'bold italic underline backcolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
                menu: {
                  file: { title: 'Файл', items: 'newdocument restoredraft | preview | importword exportpdf exportword | deleteallconversations' },
                  edit: { title: 'Редактировать', items: 'undo redo | cut copy paste pastetext | selectall | searchreplace' },
                  view: { title: 'View', items: '' },
                  insert: { title: 'Вставить', items: 'image link media addcomment pageembed codesample inserttable | math | charmap emoticons hr | pagebreak nonbreaking anchor tableofcontents | insertdatetime' },
                  format: { title: 'Форматирование', items: 'bold italic underline strikethrough superscript subscript | align lineheight | forecolor | language | removeformat' },
                  tools: { title: 'Tools', items: '' },
                  table: { title: 'Таблица', items: 'inserttable | cell row column | advtablesort | tableprops deletetable' },
                  help: { title: 'Help', items: '' }
                }
              }"
            />
            <!-- <input v-model="this.form.description" type="text" name="conditions" placeholder="Укажите описание акции" class="dart-form-control"> -->
          </div>

          <div class="dart-form-group mb-4">
            <span class="ktitle">Сроки проведения</span>
            <Calendar v-model="form.dates" selectionMode="range" placeholder="Выберите даты" :manualInput="false" showIcon :class="{'kenost-error':this.validation.dates.error}"/>
            <span v-if="this.validation.dates.error" class="kenost-error-text">{{ this.validation.dates.text }}</span>
          </div>

          <div class="dart-form-group mb-4">
            <span class="ktitle">Регион</span>
            <div class="flex align-items-center mb-3 gap-1">
                <Checkbox v-model="this.region_all" inputId="region_all" name="region_all" value="1" />
                <label for="region_all" class="ml-2 mb-0"> Доступна для всех регионов </label>
            </div>
            <MultiSelect :class="{'kenost-error':this.validation.region.error}" v-if="this.region_all.length == 0" filter v-model="this.select_regions" display="chip" :options="this.regions_all" optionLabel="name" placeholder="Выберите регионы" class="w-full md:w-20rem kenost-multiselect" />
            <!-- <TreeSelect :class="{'kenost-error':this.validation.region.error}" v-if="this.region_all.length == 0" v-model="this.select_regions" :options="this.regions" selectionMode="checkbox" :placeholder="'Зависит от выбранного ценового предложения'" class="w-full"/> -->
            <span v-if="this.validation.region.error" class="kenost-error-text">{{ this.validation.region.text }}</span>
          </div>

          <div class="dart-form-group picker-wrap">
            <span class="ktitle">Добавление товаров</span>
            <div class="flex align-items-center mt-2 gap-1">
              <RadioButton v-model="this.form.addProductType" inputId="addProductType-1" name="addProductType" value="1"/>
              <label for="addProductType-1" class="ml-2 radioLabel">Добавить товары</label>
            </div>
            <div class="flex align-items-center mt-3 gap-1">
                <RadioButton v-model="this.form.addProductType" inputId="addProductType-2" name="addProductType" value="2"/>
                <label for="addProductType-2" class="ml-2 radioLabel">Загрузить товары файлом</label>
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
              :acceptedFiles="['xls', 'xlsx']"
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
                <p>Всего товаров: {{Object.keys(this.selected).length + this.error_product.length}} шт</p>
                <div class="kenost-link-blue" @click="this.modals.error_product = true">Список незагруженных товаров</div>
              </div>
            </div>

            <a :href="site_url_prefix + '/assets/files/files/examples/ExampleLoadingProductsB2C.xlsx'" class="kenost-link-blue mt-2">Скачать шаблон файла</a>
          </div>

          <div class="dart-form-group picker-wrap">
            <!-- <span class="ktitle">Добавление товаров</span> -->
            <!-- <span v-if="this.validation.selected.error" class="kenost-error-text">{{ this.validation.selected.text }}</span> -->
            <div class="PickList">
              <div class="PickList__product" >
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
          </div>

          <!-- {{ this.selected_data }} -->

          <div class="table-kenost mt-4 table-b2c" :class="{ loading: this.table_products_loading }">
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
                      <th class="table-kenost__name">Действие</th>
                  </tr>
              </thead>
              <tbody v-for="item in this.selected_visible" :key="item.id">
                <tr>
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
                    {{(Number(item.price).toFixed(0)).toLocaleString('ru')}} ₽
                  </td>
                  <td>
                    {{ this.selected_data[item.id] ? (Number(this.selected_data[item.id].discountInterest).toFixed(2)).toLocaleString('ru') : Number(0.00).toFixed(2) }}
                  </td>
                  <td>
                    {{this.selected_data[item.id] ? (Number(this.selected_data[item.id].finalPrice).toFixed(2)).toLocaleString('ru') : item.price.toLocaleString('ru')}} ₽
                    <p class="table-kenost__settings" @click="settings(item)">Настроить</p>
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

          <div class="kenost-all-table-activity" v-if="this.form.addProductType == '1' || this.form.addProductType == '2'">
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
      </div>
    </form>

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
              <div class="flex align-items-center mt-3 gap-1">
                <RadioButton v-model="this.modals.type_price" inputId="type_price-1" name="type_price" value="1"/>
                <label for="type_price-1" class="ml-2 radioLabel">Скидка по формуле</label>
              </div>
              <div class="flex align-items-center mt-3 gap-1">
                <RadioButton v-model="this.modals.type_price" inputId="type_price-2" name="type_price" value="2"/>
                <label for="type_price-2" class="ml-2 radioLabel">Тип цен</label>
              </div>
              <div class="flex align-items-center mt-3 gap-1">
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
              <p>РРЦ: {{this.selected_data[this.modals.product_id]?.price}} ₽</p>
              <p>Скидка: {{(this.selected_data[this.modals.product_id]?.discountInterest).toFixed(2)}} %</p>
              <p>Цена со скидой: {{this.selected_data[this.modals.product_id]?.finalPrice}} ₽</p>
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
import router from '../../router'
import Calendar from 'primevue/calendar'
import TreeSelect from 'primevue/treeselect'
import Paginate from 'vuejs-paginate-next'
import FileUpload from 'primevue/fileupload'
import Toast from 'primevue/toast'
import InputNumber from 'primevue/inputnumber'
import Checkbox from 'primevue/checkbox'
import RadioButton from 'primevue/radiobutton'
import DropZone from 'dropzone-vue'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'
import MultiSelect from 'primevue/multiselect'
import Editor from '@tinymce/tinymce-vue'

export default {
  name: 'ProfileSalesAdd',
  props: { },
  data () {
    return {
      pagination_items_per_page_selected: 25,
      pagination_offset_selected: 0,
      page: 1,
      table_products_loading: false,
      page_selected: 1,
      total_selected: 0,
      loading: false,
      compatibilityDiscount: 0,
      compatibilityPost: 0,
      availability: [],
      regions: this.getregions,
      regions_all: [],
      place_action: [],
      geo_action: [],
      position: 0,
      filter_table: {
        name: '',
        category: {}
      },
      kenostActivityAll: {
        type: {},
        typePrice: {},
        value: 0,
        typeFormul: {},
        discountInterest: 0,
        multiplicity: 1
      },
      select_regions: [],
      validation: {
        name: {
          error: false,
          text: 'Пожалуйста, заполните наименование!'
        },
        // conditions: {
        //   error: false,
        //   text: 'Пожалуйста, заполните условия!'
        // },
        dates: {
          error: false,
          text: 'Пожалуйста, укажите даты проведения!'
        },
        selected: {
          error: false,
          text: 'Пожалуйста, добавьте хотя бы 1 товар!'
        },
        region: {
          error: false,
          text: 'Пожалуйста, укажите регион!'
        }
      },
      create_page_action: [],
      upload_product: false,
      region_all: [],
      opt_catalog_tree: [],
      files: {
        max: {
          original_href: ''
        },
        small: {
          original_href: ''
        },
        min: {
          original_href: ''
        },
        icon: {
          original_href: ''
        },
        file: {
          original_href: ''
        }
      },
      kenost_table_all: [],
      kenost_table: [],
      modals: {
        error_product: false,
        delay: false,
        price: false,
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
      error_product: [],
      filter: {
        name: '',
        category: {}
      },
      filter_organizations: {
        name: '',
        type: [1, 2]
      },
      selected: {},
      selected_visible: {},
      selected_data: {},
      products: [],
      total_products: 0,
      per_page: 25,
      stores: [],
      form: {
        date: null,
        addProductType: '1',
        description: '',
        global_kenost_table: [],
        store_id: ''
      },
      editMode: true,
      typeFormul: [
        { name: '₽', key: 0 },
        { name: '%', key: 1 }
      ],
      typePrice: [
        { name: 'Заданная', key: 0 }
      ],
      massAction: [
        { name: 'Скидка по формуле', key: 0 },
        { name: 'Тип цен', key: 1 }
      ],
      place: [
      ],
      geo: [
        { name: 'Только в своём магазине', key: 0 },
        { name: 'По географии акции', key: 1 }
      ]
    }
  },
  methods: {
    ...mapActions([
      'get_available_products_from_api',
      'set_sales_to_api',
      'get_regions_from_api',
      'get_sales_to_api',
      'opt_upload_products_file',
      'get_opt_catalog_tree_from_api',
      'opt_get_prices',
      'opt_get_remain_prices',
      'get_sales_adv_pages_to_api',
      'org_get_stores_from_api'
    ]),
    paginate (obj) {
      this.page_selected = obj.page
      const data = { storeid: this.form.store_id, filter: this.filter, selected: Object.keys(this.selected), pageselected: this.page_selected, page: this.page, perpage: this.per_page }
      this.get_available_products_from_api(data).then((res) => {
        this.kenostTableCheckedAllCheck()
      })
    },
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
          } else if (response.data.files[0].type_banner === 'small') {
            this.files.small = response.data.files[0]
          } else if (response.data.files[0].type_banner === 'file') {
            this.files.file = response.data.files[0]
          }
        }
      }
      this.$toast.add({ severity: 'info', summary: 'Файлы загружены', detail: 'Файл был успешно загружен', life: 3000 })
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
        }
        // console.log(this.selected[this.kenost_table[i]])
      }
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
    },
    setTypePrice () {
      const getPrice = this.selected[this.modals.product_id].prices.find(r => r.guid === this.selected_data[this.modals.product_id].typePrice.guid).price
      this.selected_data[this.modals.product_id].finalPrice = Number(getPrice)
      this.selected_data[this.modals.product_id].discountInRubles = Number(this.selected_data[this.modals.product_id].price) - Number(getPrice)
      this.selected_data[this.modals.product_id].discountInterest = (Number(this.selected_data[this.modals.product_id].price) - Number(getPrice)) / (Number(this.selected_data[this.modals.product_id].price) / 100)
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
    globalTable () {
      if (this.form.global_kenost_table.length === 0) {
        this.kenost_table = []
      } else {
        this.kenost_table = Object.keys(this.selected)
      }
      this.kenostTableCheckedAllCheck()
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
    closeDialogPrice () {
      if (this.modals.price_step === 0) {
        this.modals.price_step = Number(this.modals.type_price)
      } else {
        this.modals.price_step = 0
        this.modals.price = false
      }
    },
    parseFile (files, xhr, formData) {
      this.table_products_loading = true
      const callback = (e) => {
        const res = JSON.parse(e)
        this.files.xlsx = res.data.files[0]
        const data = {
          action: 'upload/products/file',
          store_id: router.currentRoute._value.params.id,
          file: res.data.files[0].original,
          type: 'b2c'
        }
        this.opt_upload_products_file(data).then((response) => {
          const productsList = response.data.data.data
          this.selected = {}
          // Бежим по всем элементам и добавляем их в select
          for (let i = 1; i < Object.keys(productsList).length; i++) {
            const tempProduct = productsList[Object.keys(productsList)[i]]
            if (!tempProduct.error) {
              const product = {}
              product.article = tempProduct.A
              if (tempProduct.E === 0 || tempProduct.E === null) {
                product.discountInterest = 100
                product.discountInRubles = '-'
              } else {
                product.discountInRubles = tempProduct.E - tempProduct.D
                product.discountInterest = (tempProduct.E - tempProduct.D) / (tempProduct.E / 100)
              }
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
              selectdata.multiplicity = 1

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
          this.table_products_loading = false
        })
      }

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          callback(xhr.response)
        }
      }
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
      this.opt_get_prices({
        action: 'get/type/prices',
        store_id: this.form.store_id
      })
    },
    select (id) {
      const product = this.products.find(r => r.id === id)
      product.discountInterest = 0
      product.discountInRubles = 0
      product.finalPrice = Number(product.price)
      console.log(product)
      // console.log(this.selected)
      // this.selected[product.id] = product
      // console.log(this.selected)
      // this.products = this.products.filter((r) => r.id !== id)
      // const data = { filter: this.filter, selected: this.selected, pageselected: this.page_selected, page: this.page, perpage: this.per_page }
      // this.get_available_products_from_api(data)
      // this.total_selected++

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

      // console.log('this.selected', this.selected)
      // console.log('selected_data', this.selected_data)
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
      const data = { storeid: this.form.store_id, filter: this.filter, filterselected: this.filter_table, selected: Object.keys(this.selected), pageselected: this.page_selected, page: this.page, perpage: this.per_page }
      this.get_available_products_from_api(data).then((res) => {
        this.kenostTableCheckedAllCheck()
      })
      this.total_selected--
    },
    pagClickCallback (pageNum) {
      this.page = pageNum
      const data = { storeid: this.form.store_id, filter: this.filter, selected: Object.keys(this.selected), pageselected: this.page_selected, page: this.page, perpage: this.per_page }
      this.get_available_products_from_api(data).then((res) => {
        this.kenostTableCheckedAllCheck()
      })
    },
    setFilter () {
      this.page = 1
      this.page_selected = 1
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
    saveData () {
      this.selected = this.available_products.products[1]
    },
    formSubmit (event) {
      let stop = false

      if (!this.form.name) {
        this.validation.name.error = true
        // eslint-disable-next-line no-unused-vars
        stop = true
      } else {
        this.validation.name.error = false
      }

      // if (!this.form.conditions) {
      //   this.validation.conditions.error = true
      //   // eslint-disable-next-line no-unused-vars
      //   stop = true
      // } else {
      //   this.validation.conditions.error = false
      // }

      if (!this.form.dates) {
        this.validation.dates.error = true
        // eslint-disable-next-line no-unused-vars
        stop = true
      } else {
        this.validation.dates.error = false
      }

      // if (this.total_selected === 0) {
      //   this.validation.selected.error = true
      //   stop = true
      // } else {
      //   this.validation.selected.error = false
      // }

      if (this.region_all.length === 0 && Object.keys(this.select_regions).length === 0) {
        this.validation.region.error = true
        stop = true
      } else {
        this.validation.region.error = false
      }

      if (this.form.description.length > 2040) {
        this.$toast.add({ severity: 'info', summary: 'Ошибка!', detail: `Описание должно содержать не больше 2040 символов, у вас ${this.form.description.length}`, life: 3000 })
        stop = true
      }

      if (!stop) {
        this.$load(async () => {
          let reginsall = false
          if (this.region_all.length > 0) {
            // eslint-disable-next-line no-unused-vars
            reginsall = true
          }

          if (router.currentRoute._value.params.action_id) {
            await this.set_sales_to_api({
              action: 'set',
              type: 'b2c',
              id: router.currentRoute._value.params.id,
              store_id: this.form.store_id,
              name: this.form.name,
              description: this.form.description,
              conditions: this.form.conditions,
              dates: [this.form.dates[0].toDateString(), this.form.dates[1].toDateString()],
              products: Object.keys(this.selected),
              products_data: this.selected_data,
              files: this.files,
              regins: this.select_regions,
              region_all: reginsall,
              page_places: this.place_action.map(x => x.code),
              page_geo: this.geo_action.key,
              page_place_position: this.position,
              page_create: this.create_page_action[0] === 'true',
              action_id: router.currentRoute._value.params.action_id
            })
              .then((result) => {
                this.loading = false
                router.push({ name: 'b2c', params: { id: router.currentRoute._value.params.id } })
              })
              .catch((result) => {
                console.log(result)
              })
          } else {
            await this.set_sales_to_api({
              action: 'set',
              type: 'b2c',
              id: router.currentRoute._value.params.id,
              store_id: this.form.store_id,
              name: this.form.name,
              description: this.form.description,
              conditions: this.form.conditions,
              dates: [this.form.dates[0].toDateString(), this.form.dates[1].toDateString()],
              products: Object.keys(this.selected),
              products_data: this.selected_data,
              files: this.files,
              regins: this.select_regions,
              page_places: this.place_action.map(x => x.code),
              page_geo: this.geo_action.key,
              page_place_position: this.position,
              page_create: this.create_page_action[0] === 'true',
              region_all: reginsall
            })
              .then((result) => {
                this.loading = false
                router.push({ name: 'b2c', params: { id: router.currentRoute._value.params.id } })
              })
              .catch((result) => {
                console.log(result)
              })
          }
        })
        this.loading = true
      }
    }
    // updateEditorContent (content) {
    //   if (this.$refs.editorRef.quill && content) {
    //     console.log('content', content)
    //     console.log('this.$refs.editorRef.quill', this.$refs.editorRef.quill)
    //     const editor = this.$refs.editorRef.quill
    //     // console.log(editor.setContents('rer'))
    //     const test = editor.setContents(editor.clipboard.convert({
    //       html: content
    //     }))
    //     console.log(test)
    //   }
    // }
  },
  mounted () {
    this.get_available_products_from_api({ storeid: this.form.store_id, filter: '', selected: ['0'], page: this.page }).then((res) => {
      if (this.available_products) {
        this.products = this.available_products?.products
      }
      // this.selected = this.available_products.selected
    })
    this.get_regions_from_api().then(
      this.regions = this.getregions
    )
    this.get_regions_from_api().then(() => {
      this.regions = this.getregions
      this.regions_all = this.regions.map(function (el) {
        return { name: el.label, code: el.key }
      })
    })
    if (router.currentRoute._value.params.action_id) {
      this.get_sales_to_api({ id: router.currentRoute._value.params.sales_id, actionid: router.currentRoute._value.params.action_id })
    }
    this.get_opt_catalog_tree_from_api()
    this.get_sales_adv_pages_to_api({
      action: 'get/adv/pages',
      store_id: router.currentRoute._value.params.id,
      type: 2
    })
    this.org_get_stores_from_api({
      action: 'get/stores',
      id: this.$route.params.id
    })
  },
  components: {
    Calendar,
    TreeSelect,
    Paginate,
    FileUpload,
    Toast,
    InputNumber,
    Checkbox,
    RadioButton,
    DropZone,
    Dialog,
    Dropdown,
    MultiSelect,
    Editor
  },
  computed: {
    ...mapGetters([
      'available_products',
      'getcatalog',
      'getregions',
      'actions',
      'optproductsfile',
      'optcatalogtree',
      'oprpricesremain',
      'oprprices',
      'adv_pages',
      'org_stores'
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
    }
  },
  watch: {
    org_stores: function (newVal, oldVal) {
      this.stores = []
      for (let i = 0; i < newVal.items.length; i++) {
        this.stores.push({ label: newVal.items[i].name, value: newVal.items[i].id })
      }
    },
    available_products: function (newVal, oldVal) {
      if (newVal) {
        this.products = newVal.products

        if (newVal.selected) {
          this.selected = newVal.selected
        }

        if (newVal.visible) {
          this.selected_visible = newVal.visible
        }
        this.total_products = newVal.total
        this.total_selected = newVal.total_selected
      }
    },
    adv_pages: function (newVal, oldVal) {
      this.place = newVal
    },
    optcatalogtree: function (newVal, oldVal) {
      this.opt_catalog_tree = newVal
    },
    getregions: function (newVal, oldVal) {
      this.regions = this.getregions
    },
    oprprices: function (newVal, oldVal) {
      this.typePrice = []
      for (let i = 0; i < newVal.length; i++) {
        this.typePrice.push({ key: newVal[i].guid, name: newVal[i].name })
      }
    },
    actions: async function (newVal, oldVal) {
      this.form.name = newVal.name
      if (newVal.image) {
        this.files.max.original_href = this.site_url_prefix + newVal.image
      }
      if (newVal.image_inner) {
        this.files.min.original_href = this.site_url_prefix + newVal.image_inner
      }
      if (newVal.icon) {
        this.files.icon.original_href = this.site_url_prefix + newVal.icon
      }
      if (newVal.image_small) {
        this.files.small.original_href = this.site_url_prefix + newVal.image_small
      }
      if (newVal.rules_file) {
        this.files.file.original_href = this.site_url_prefix + newVal.rules_file
      }

      if (newVal.products_data) {
        this.selected_data = newVal.products_data
      }

      if (newVal.store_id) {
        this.form.store_id = newVal.store_id.toString()

        const data = {
          storeid: newVal.store_id.toString(),
          filter: this.filter_organizations,
          filterselected: this.filter_table,
          selected: Object.keys(this.selected),
          pageselected: this.page_selected,
          page: this.page,
          perpage: this.per_page
        }
        this.get_available_products_from_api(data).then()
      }

      const dateto = new Date(newVal.date_to)
      const datefrom = new Date(newVal.date_from)
      this.form.dates = [datefrom, dateto]
      this.selected = newVal.products
      this.total_selected = newVal.total_products
      this.form.description = newVal.description
      this.form.conditions = newVal.conditions
      this.status = newVal.status
      this.moderator_comment = newVal.moderator_comment

      this.place_action = newVal.page_places
      this.geo_action = this.geo[newVal.page_geo]
      this.position = newVal.page_place_position

      if (newVal.page_create) {
        this.create_page_action = ['true']
      }

      if (newVal.global) {
        this.region_all = ['1']
      } else {
        this.select_regions = newVal.regions
        // this.select_regions = newVal.regions_and_sities
      }

      setTimeout(() => {
        const data = { storeid: this.form.store_id, filter: this.filter, selected: Object.keys(this.selected), pageselected: this.page_selected, page: this.page, perpage: this.per_page }
        this.get_available_products_from_api(data).then((res) => {
          this.kenostTableCheckedAllCheck()
        })
      }, 1000)
    }
  }
}
</script>

<style lang="scss">

.tox-statusbar__branding{
  display: none;
}

.kenost-upload-xlsx{
    &__file{
      border-radius: 5px;
      border: 1px solid #E2E2E2;
      display: flex;
      align-items: center;
      padding: 16px;
      gap: 20px;

      img{
        height: 45px !important;
      }

      a{
        margin: 0;
        font-size: 14px;
        text-decoration: none;
      }
    }

    &__info{
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 20px;

      p{
        margin: 0;
        color: #A0A0A0;
        font-size: 12px;
      }
    }
  }

  .kenost-all-table-activity{
    display: flex;
    gap: 8px;
    margin-top: 10px
  }

  .kenost-list-error{
    table{
      width: 100%;

      th{
        background-color: #F8F7F5;
        padding: 16px;
        color: #5E5E5E;
        font-weight: 400;
        font-size: 14px;
      }

      td{
        padding: 16px;
        color: #282828;
        font-weight: 400;
        font-size: 14px;
      }
    }
  }

  .status-moderation{
    color: #20c8fb;
  }

  .status-fatal{
    color: #FB203A;
  }

  .status-planned{
    color: #fbb620;
  }

  .status-active{
    color: #54e979;
  }

  .kenost-action-page{
    padding-left: 20px;
    border-left: 2px solid #E2E2E2;
    margin-left: 10px;
    margin-bottom: 0 !important;
    // padding-top: 40px;
  }

  .table-b2c{
    width: 1200px;
  }

  .ql-color,
  .ql-background,
  .ql-font{
    display: none !important;
  }

  .ql-header{
    display: none !important;
  }

  .PickList__products.selected{
    // height: 400px;
    gap: 0px;

    .PickList__el{
      padding: 12px 0;
    }
  }

    .none{
      display: none !important;
    }

    .kenost-upload-button{
      background: #F8F8F8 !important;
      border: 1px solid #F8F8F8 !important;
      color: #282828 !important;
      box-shadow: 0px 1px 5px 0px #00000033 !important;
      box-shadow: 0px 3px 1px 0px #0000001F !important;
      box-shadow: 0px 2px 2px 0px #00000024 !important;
    }

    .kenost-add-file{
        display: flex;
        align-items: center;
        text-decoration: none;
        p{
            margin: 0 0 0 10px;
        }
    }

    .rules-container{
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
    }

    .kenost-error{
      border: 1px solid #FF0000 !important;
    }

    .kenost-error-text{
      color: #FF0000;
      font-size: 14px;
      margin-top: 4px;
    }

    .kenost-checkbox-container{
      display: flex;
      gap: 16px;
    }

    .kgraytext{
      color: #ADADAD;
      font-size: 14px;
    }

    .radioLabel{
      margin-bottom: 0 !important;
      cursor: pointer;
    }

    .btn-padding{
      padding-left: 55px;
      padding-right: 55px;
    }

    .maintitle{
      font-size: 24px;
      font-weight: 400;
    }

    .ktitle{
      display: block;
      font-style: normal;
      font-weight: 500;
      font-size: 20px;
      line-height: 1.3;
      color: #282828;
      margin-bottom: 8px;
    }

    .upload-icon__image{
      background: #D9D9D9;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      margin-top: 16px;
      overflow: hidden;
    }

    .upload-banner{
      display: flex;
      align-items: flex-start;
      justify-content: space-between;

      &__text{
        max-width: 450px;

        span{
          color: #ADADAD;
          font-size: 14px;
        }

        span.ktitle{
          display: block;
          font-style: normal;
          font-weight: 500;
          font-size: 20px;
          line-height: 1.3;
          color: #282828;
          margin-bottom: 8px;
        }
      }

      &__image{
        width: 287px !important;
        height: 160px !important;
        background: #D9D9D9;
        margin-top: 16px;
        overflow: hidden;

        img{
          width: 100%;
          height: 100% !important;
          object-fit: cover;
        }
      }

      &__banner{
        width: 100%;
        height: 200px;
      }
    }

    .selectedProducts{
      .title{
        display: block;
        font-style: normal;
        font-weight: 500;
        font-size: 20px;
        line-height: 1.3;
        color: #282828;
        margin-top: 40px;
      }
    }
    .product-settings{
      margin: 0;
      .item{
        margin-bottom: 30px;
        .p-inputnumber{
          width: 100%;
        }
        input{
          width: 100%;
        }
      }
    }
    .source_list{
      position: relative;
      z-index: 3;
      .filter{
        position: absolute;
        bottom: -95px;
        left: 0;
        right: 15px;
      }
    }
    .p-picklist .p-picklist-list.p-picklist-source{
      padding-top: 75px !important;
    }
    .dart-form-group{
      max-width: 755px;
      &.picker-wrap{
        max-width: 100%;
      }
    }
    .profile-content__title{
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .buttons_container{
      display: flex;
      align-items: center;
      .dart-btn + .dart-btn {
          margin-left: 5px;
      }
    }

    .PickList{
      width: 100%;
      display: flex;
      gap: 20px;
      align-items: center;

      &__valuer-inputs{
        width: 302px;
        display: flex;
        gap: 16px;
      }

      &__button{
        display: flex;
        justify-content: flex-end;
        padding: 12px 24px 12px 0;
      }

      &__title{
        width: 100%;
        display: flex;
        padding: 16px 24px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.12);
        font-size: 14px;
        font-weight: 500;
        line-height: 15px;
        justify-content: space-between;
        align-items: center;
      }

      &__product{
        width: 40%;
        border-radius: 5px;
        border: 1px solid rgba(0, 0, 0, 0.12);
      }

      &__selected{
        width: 55%;
        border-radius: 5px;
        border: 1px solid rgba(0, 0, 0, 0.12);
      }

      &__products{
        height: 350px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 24px;
        padding: 0 24px 24px 24px;
      }

      &__el{
        display: flex;

        &.center{
          align-items: center
        }

        img{
          width: 85px;
          height: 50px !important;
          object-fit: contain;
        }
      }

      &__product-info{
        width: calc(100% - 85px);

        &.off{
          width: auto;
        }
      }

      &__title-left{
        display: flex;
        align-items: center;
        margin-right: 54px;
        gap: 16px;
        b{
          width: 90px;
          text-align: center;
        }
      }

      &__name{
        width: 80%;
        font-size: 14px;
        line-height: 16px;
        color: #282828;
        margin-bottom: 8px;
      }

      &__article{
        color: #ADADAD;
        font-size: 14px;
        line-height: 16px;
      }

      &__info{
        width: calc(100% - calc(85px + 54px));
        margin-right: 10px;
        display: flex;
        align-items: center;
        align-items: flex-start;
        justify-content: space-between;
      }

      &__values{
        display: flex;
        gap: 16px;
        .p-inputnumber{
          width: 90px;
        }
      }

      &__select{
        border-radius: 5px;
        width: 44px;
        height: 44px;
        background: #282828;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #FFF;
        cursor: pointer;
      }

      &__price{
        font-size: 14px;
        font-weight: 500;
        color: #282828;
        line-height: 16px;
        margin-top: 8px;
      }

      &__filters{
        padding: 16px 24px;
        display: flex;
        align-items: center;
        gap: 8px;

        .dart-form-group{
          width: 50%;
        }

        .form_input_group {
          width: 100%;
        }

        .form_input_group__icon{
          padding: 0;
          top: 55%;
          right: 10px;
        }
      }
    }
  </style>
