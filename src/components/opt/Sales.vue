<template>
  <div>
    <form @submit.prevent="formSubmit" :class="{ loading: loading }">
      <div class="profile-content__title sticky-element">
        <div v-if="this.type == 3">
          <span class="maintitle" v-if="actions.client_name">Настройка индивидуальных условий для {{actions.client_name}}</span>
          <span class="maintitle" v-else>Создание индивидуальных условий</span>
        </div>
        <div v-else>
          <span class="maintitle">Настройка акции</span>
        </div>        
        <div class="buttons_container">
            <RouterLink :to="{ name: 'b2b', params: { id: $route.params.id } }" class="dart-btn dart-btn-secondary btn-padding" v-if="this.type == 1">Отменить</RouterLink>
            <RouterLink :to="{ name: 'b2c', params: { id: $route.params.id } }" class="dart-btn dart-btn-secondary btn-padding" v-if="this.type == 2">Отменить</RouterLink>
            <RouterLink :to="{ name: 'discounts', params: { id: $route.params.id } }" class="dart-btn dart-btn-secondary btn-padding" v-if="this.type == 3">Отменить</RouterLink>
            <button @click="actions.active ? this.modals.modal_checking = true : formSubmit(event)" type="button" class="dart-btn dart-btn-primary btn-padding"
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
        <div class="dart-form-group mt-2 mb-4" v-if="this.type == 3">
            <span class="ktitle">Клиент</span>
            <Dropdown filter v-model="this.form.client_id" :options="dilers.items" optionValue="id" optionLabel="name"
                        placeholder="Выберите клиента" class="w-full md:w-14rem" />
        </div>
        <div v-if="this.form.store_id?.length">
          <div class="dart-form-group mb-4" v-if="this.type != 3">
            <div class="dart-form-group mb-0">
              <span class="ktitle">Реклама</span>
              <div class="flex align-items-center gap-1">
                  <Checkbox v-model="this.form.adv.active" inputId="create-page-action"
                      name="create_page_action" value="true" :binary="true"/>
                  <label for="create-page-action" class="ml-2 mb-0"> Разместить рекламные баннеры </label>
              </div>
            </div>
            <div class="dart-form-group kenost-action-page pt-3"
                v-if="this.form.adv.active">
                <span class="ktitle">Место размещения баннера/товара</span>
                <MultiSelect v-model="this.form.adv.place" :options="this.adv_pages" optionLabel="name"
                    placeholder="Выберите один или несколько вариантов" class="w-full" />
            </div>
            <div class="dart-form-group kenost-action-page pt-3" v-if="this.form.adv.active">
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

            <div class="dart-form-group kenost-action-page pt-3" v-if="this.form.adv.active && this.type == 2">
              <div class="upload-banner">
                <div class="upload-banner__text">
                  <span class="ktitle">Малый баннер</span>
                  <span>Загрузить изображение нужно размером не менее 324х161, соблюдая пропорции. Чтобы не потерялось качество, желательно загружать изображение в три раза больше указанного размера.</span>
                </div>
                <FileUpload class="kenost-upload-button" mode="basic" name="banner_small[]" :url="'/rest/file_upload.php?banner=min'" accept="image/*" :maxFileSize="2000000" @upload="onUpload" :auto="true" chooseLabel="Загрузить" />
              </div>
              <div class="upload-banner__image">
                <img :src="this.form.adv.files?.min?.original_href" v-if="this.form.adv.files?.min?.original_href">
              </div>
            </div>

            <div class="dart-form-group kenost-action-page pt-3" v-if="this.form.adv.active && this.type == 2">
              <div class="upload-banner">
                <div class="upload-banner__text">
                  <span class="ktitle">Квадратный баннер</span>
                  <span>Загрузить изображение нужно размером не менее 459х459, соблюдая пропорции. Чтобы не потерялось качество, желательно загружать изображение в три раза больше указанного размера.</span>
                </div>
                <FileUpload class="kenost-upload-button" mode="basic" name="small[]" :url="'/rest/file_upload.php?banner=small'" accept="image/*" :maxFileSize="2000000" @upload="onUpload" :auto="true" chooseLabel="Загрузить" />
              </div>
              <div class="upload-banner__image">
                <img :src="this.form.adv.files?.small?.original_href" v-if="this.form.adv.files?.small?.original_href">
              </div>
            </div>

            <div class="dart-form-group kenost-action-page pt-3" v-if="this.form.adv.active && this.type == 2">
                <div class="rules-container">
                    <div class="rules-container__text">
                        <span class="ktitle">Правила акции</span>
                        <p class="kgraytext">Загрузите файл с подробными правилами акции</p>
                        <a target="_blank" :href="this.form.adv.files?.file?.original_href" class="kenost-add-file" v-if="this.form.adv.files?.file?.original_href">
                            <!-- <img src="../../../public/img/files/pdf.png" alt=""> -->
                            <p>{{this.form.adv.files?.file?.name? this.form.adv.files?.file?.name : "Файл загружен!"}}</p>
                        </a>
                    </div>
                    <FileUpload class="kenost-upload-button" mode="basic" name="icon[]" :url="'/rest/file_upload.php?banner=file'" accept="application/pdf" :maxFileSize="20000000" @upload="onUpload" :auto="true" chooseLabel="Загрузить" />
                </div>
            </div>
            <!--
            <div class="dart-form-group kenost-action-page pt-3" v-if="this.form.adv.active && this.type == 2">
              <span class="ktitle">Позиция в карусели</span>
              <InputNumber
                v-model="this.form.adv.place_position"
                inputId="horizontal-buttons"
                :step="1"
                min="0"
                max="100"
                incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
              />
            </div>
            -->
            <!--
              <div class="dart-form-group kenost-action-page pt-3" v-if="this.form.adv.active">
                  <span class="ktitle">География показа</span>
                  <Dropdown v-model="this.form.adv.geo" :options="this.geo" optionLabel="name"
                      placeholder="География показа" class="w-full md:w-14rem" />
              </div>
            -->
            </div>
          <div class="dart-form-group mb-4">
            <span class="ktitle">Описание</span>
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
          </div>
          <div class="dart-form-group mb-3" v-if="this.type != 2">
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
            v-if="(this.form.compatibilityDiscount == 3 || this.form.compatibilityDiscount == 4) && this.type != 2">
            <label>Выберите акции из списка</label>
            <MultiSelect :key="new Date().getMilliseconds()" filter v-model="this.form.actions"
                display="chip" :options="this.allAction" optionLabel="name" placeholder="Выберите из списка"
                class="w-full md:w-20rem" />
          </div>
          <div class="dart-form-group mt-4"
            v-if="(this.form.compatibilityDiscount == 1 || this.form.compatibilityDiscount == 3 || this.form.compatibilityDiscount == 4) && this.type != 2">
            <label>Выберите режим совместимости</label>
            <Dropdown v-model="this.form.compabilityMode" :options="this.compabilityMode" optionLabel="name"
                placeholder="Режим совместимости" class="w-full md:w-14rem" />
          </div>
          <!--
          <div @click="this.modals.view_actions = true" class="router-link-active dart-btn dart-btn-secondary btn-padding mb-4">Совместимость акций</div>
          -->
          <div class="dart-form-group mb-4" :class="{ error: v$.form.dates.$errors.length }" v-if="this.type != 3">
            <span class="ktitle">Даты проведения</span>
            <span class="field-desc">Выберите период активности Акции.</span>
            <Calendar v-model="this.form.dates" selectionMode="range" placeholder="Выберите даты"
                :manualInput="false" showIcon />
  
            <span class="error_desc" v-for="error of v$.form.dates.$errors" :key="error.$uid">
                {{ error.$message }}
            </span>
          </div>
          <div class="dart-form-group mb-4" v-if="this.type == 2">
            <span class="ktitle">Условия оплаты</span>
            <span class="field-desc">Вы можете предложить покупателям возможность оплачивать товары в рассрочку, предоставляя дополнительную скидку для компенсации банковского процента.</span>
            <div class="flex align-items-center gap-1 mt-2">
                <RadioButton v-model="this.form.typePay" inputId="typePay-1" name="typePay"
                    value="1" />
                <label for="typePay-1" class="ml-2 radioLabel">Покупатель оплачивает товар при заказе</label>
            </div>
            <div class="flex align-items-center gap-1 mt-2">
                <RadioButton v-model="this.form.typePay" inputId="typePay-2" name="typePay"
                    value="2" />
                <label for="typePay-2" class="ml-2 radioLabel">Предоставление рассрочки на 6 месяцев покупателю, за счет поставщика</label>
            </div>
            <div class="mt-4" v-if="this.form.typePay == '2'">
              <label for="typeDelayPercent">Процент скидки от стоимости товара, который поставщик выделяет для компенсации рассрочки:</label>
              <InputNumber v-model="this.form.typePayPercent" id="typeDelayPercent" inputId="horizontal-buttons" :step="0.1"
                min="0" max="100" disabled suffix=" %" incrementButtonIcon="pi pi-plus"
                decrementButtonIcon="pi pi-minus" />
            </div>
          </div>
          <div class="dart-form-group mb-4" v-if="this.type == 2">
            <span class="ktitle">Условия доставки</span>
            <span class="field-desc">Вы можете предложить покупателям возможность получить бесплатную доставку или компенсировать часть её стоимости, предоставляя дополнительную скидку.</span>
            <div class="flex align-items-center gap-1 mt-2">
                <RadioButton v-model="this.form.typeDelivery" inputId="typeDelivery-1" name="typeDelivery"
                    value="1" />
                <label for="typeDelivery-1" class="ml-2 radioLabel">Покупатель оплачивает доставку</label>
            </div>
            <div class="flex align-items-center gap-1 mt-2">
                <RadioButton v-model="this.form.typeDelivery" inputId="typeDelivery-2" name="typeDelivery"
                    value="2" />
                <label for="typeDelivery-2" class="ml-2 radioLabel">Поставщик компенсирует доставку</label>
            </div>
            <div class="mt-4" v-if="this.form.typeDelivery == '2'">
              <label for="typeDelayPercent">Процент скидки от стоимости товара, который поставщик выделяет для компенсации рассрочки:</label>
              <InputNumber v-model="this.form.typeDeliveryPercent" id="typeDelayPercent" inputId="horizontal-buttons" :step="0.1"
                min="0" max="100" suffix=" %" incrementButtonIcon="pi pi-plus"
                decrementButtonIcon="pi pi-minus" />
            </div>
          </div>
          <div class="dart-form-group mb-4" v-if="this.type != 2">
            <span class="ktitle">Оплата доставки</span>
            <span class="field-desc">Выберите того, кто будет оплачивать доставку до Склада Покупателя.</span>
            <div class="kenost-wiget">
                <Dropdown v-model="this.form.paymentDelivery" :options="this.paymentDelivery" optionLabel="name"
                    placeholder="Оплата доставки" class="w-full md:w-14rem" />
            </div>
          </div>
          <div class="dart-form-group mb-4" v-if="this.type != 2">
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
          <div class="dart-form-group mb-4" v-if="this.type != 2">
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
            <div class="dart-form-group mt-4" v-if="this.type != 2 && this.type != 3">
              <div class="flex align-items-center gap-1">
                <Checkbox v-model="this.form.integration" :binary="true" inputId="integration"
                    name="integration" />
                <label for="integration" class="ml-2 mb-0">Интеграция с MachineStore</label>
              </div>
            </div>
            <div class="dart-form-group" v-if="this.type != 2 && this.type != 3">
              <div class="flex align-items-center gap-1">
                <Checkbox v-model="this.form.hide_for_clients" :binary="true" inputId="hide_for_clients" name="hide_for_clients" />
                <label for="hide_for_clients" class="ml-2 mb-0"> Скрыть акцию у клиентов с Индивидуальными условиями </label>
              </div>
            </div>
  
            <div class="dart-form-group" v-if="this.type != 2 && this.type != 3">
              <div class="flex align-items-center gap-1">
                <Checkbox v-model="this.form.negative" :binary="true" inputId="negative" name="negative" />
                <label for="negative" class="ml-2 mb-0"> Негативная акция </label>
              </div>
            </div>
  
            <div class="dart-form-group" v-if="this.type != 2 && this.type != 3">
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
            :cols="this.products_cols"
            :show_filter="true"
            :selectable="true"
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
          <div class="mt-4">
            <div class="dart-row">
              <div class="d-col-md-8">
                <span class="ktitle">Коллекции</span>
                <span class="field-desc">Вы можете добавить в Акцию коллекцию товаров и задать на нее глобально настройки ценообразования.</span>
              </div>
              <div class="d-col-md-4 text-right">
                <button @click="this.modals.add_group = true" type="button" class="dart-btn dart-btn-primary">
                  <i class="pi pi-upload"></i>
                  <span>Добавить коллекцию</span>
                </button>
              </div>
            </div>
            
            
            <div class="kenost-tab-container">
              <TabView class="tab-custom hidden-mobile-l mt-3 kenost-tab-custom" :scrollable="true">
                <TabPanel v-for="el in this.form.product_groups" :header="el.group.name + ' (' + el?.products?.total + ')'">
                  <productTable
                    :class="{ loading: product_loading }"
                    title="Товары коллекции"
                    :filters="this.filters_available_collections"
                    :cols="this.products_cols_collections"
                    :show_filter="true"
                    :selectable="false"
                    :object_id="el.group.id"
                    :filter_value="el.filter"
                    :page="el.page"
                    :items="el?.products?.items"
                    :total="el?.products?.total"
                    :items_per_page="this.per_page"
                    @settings="settings"
                    @paginate="paginateGroupProduct"
                    @filter="filterGroupProductSelected"
                  >
                    <template v-slot:button>
                      <button @click="deleteGroup(el.group.id)" type="button" class="dart-btn dart-btn-secondary btn-padding flex gap-2 align-items-center">
                        <i class="pi pi-trash"></i><div>Удалить коллекцию</div>
                      </button>
                    </template>
                  </productTable>
                </TabPanel>
            </TabView>
          </div>
          </div>
          <div class="mb-4" v-if="this.type != 2 && this.type != 3">
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
          <div class="dart-form-group mt-4" v-if="this.type != 3">
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
                <div class="kenost-select-reginos__checkboxs" v-if="this.type != 2">
                    <div class="flex align-items-center gap-1">
                        <Checkbox v-model="this.form.stores" inputId="access-1" name="access-1"
                            value="true" :binary="true"/>
                        <label for="access-1" class="ml-2"> Розничные магазины </label>
                    </div>
                    <div class="flex align-items-center gap-1">
                        <Checkbox v-model="this.form.warehouses" inputId="access-2" name="access-2"
                            value="true" :binary="true"/>
                        <label for="access-2" class="ml-2"> Оптовые компании </label>
                    </div>
                    <div class="flex align-items-center gap-1">
                        <Checkbox v-model="this.form.vendors" inputId="access-3" name="access-3"
                            value="true" :binary="true"/>
                        <label for="access-3" class="ml-2"> Производители </label>
                    </div>
                </div>
                <MultiSelect filter v-model="this.form.regions" display="chip" :options="this.regions_all"
                    optionLabel="name" placeholder="Выберите регионы"
                    class="w-full md:w-20rem mt-2" />
            </div>
        </div>
  
        <div class="PickList" v-if="(this.form.participantsType == '1' || this.form.participantsType == '2') && this.type != 2">
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
    <Dialog v-model:visible="this.modals.modal_checking" header=" " :style="{ width: '380px' }">
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
            <div class="product-kenost-card" v-if="this.products_selected.length == 1 && this.modals.price_type != 'group'">
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
                      optionDisabled="disabledkey"
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
  
            <div class="kenost-info-line" v-if="this.modals.price_step != 0 && this.products_selected.length == 1 && this.modals.price_type != 'group'">
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
      <div class="new-modal" :class="{'active': this.modals.view_actions}">
        <div class="new-modal__content">
            <div class="new-modal__title">
                <div>
                    <h2>Совместимость акций</h2>
                    <p>Таблица, в которой указывается совместимость создаваемой \ редактируемой акции, индивидуальной скидки, сбытовой политики:</p>
                </div>
                <i @click="this.modals.view_actions = false" class="pi pi-times"></i>
            </div>
            <div>
                <table class="new-modal__table">
                    <thead>
                        <tr>
                            <th style="width: 36%;">Название</th>
                            <th style="width: 32%;">Описание</th>
                            <th style="width: 23%;">Статус совместимости</th>
                            <th style="width: 9%;">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12.5 19H19M14.5312 7.57576L17.375 9.93939M7.21875 14.6667L15.2296 6.6273C16.0921 5.7909 17.4906 5.7909 18.3531 6.6273C19.2156 7.4637 19.2156 8.81977 18.3531 9.65617L10.0625 17.4242L6 18.6061L7.21875 14.6667Z" stroke="#EDEDED" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item of actions_active" :key="item.id">
                            <td>
                                <div>
                                    <p>
                                        <span v-if="item.type == 3">Индивидуальна скидка:</span>
                                        <span v-if="item.type == 1">Акция:</span>
                                        {{item.name}}</p>
                                </div>
                            </td>
                            <td>
                                <div>
                                    <p>
                                        {{item.description}}
                                    </p>
                                </div>
                            </td>
                            <td>
                                <div>
                                    <p v-if="item.compatibility_discount == 1" class="mb-4"><b>Совместима</b> со всеми акциями</p>
                                    <p v-if="item.compatibility_discount == 2" class="mb-4"><b>Не совместима</b> со всеми акциями</p>
                                    <p v-if="item.compatibility_discount == 3" class="mb-4"><b>Не совместима</b> с выбранными акциями</p>
                                    <p v-if="item.compatibility_discount == 4" class="mb-4"><b>Совместима</b> с выбранными акциями</p>
  
                                    <p v-if="item.compatibility_discount_mode == 0"><b>Режим совместивости:</b> применяется бóльшая</p>
                                    <p v-if="item.compatibility_discount_mode == 1"><b>Режим совместивости:</b> складываются</p>
                                    <p v-if="item.compatibility_discount_mode == 2"><b>Режим совместивости:</b> назначаются последовательно</p>
  
                                </div>
                            </td>
                            <td>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12.5 19H19M14.5312 7.57576L17.375 9.93939M7.21875 14.6667L15.2296 6.6273C16.0921 5.7909 17.4906 5.7909 18.3531 6.6273C19.2156 7.4637 19.2156 8.81977 18.3531 9.65617L10.0625 17.4242L6 18.6061L7.21875 14.6667Z" stroke="#282828" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  </div>
  </template>
  <script>
  import { useVuelidate } from '@vuelidate/core';
  import { mapActions, mapGetters } from 'vuex';
  import FileUpload from 'primevue/fileupload';
  import Editor from '@tinymce/tinymce-vue'
  import Calendar from 'primevue/calendar';
  import RadioButton from 'primevue/radiobutton';
  import Dropdown from 'primevue/dropdown';
  import Dialog from 'primevue/dialog';
  import InputNumber from 'primevue/inputnumber';
  import TreeSelect from 'primevue/treeselect';
  import DropZone from 'dropzone-vue';
  import Checkbox from 'primevue/checkbox';
  import Counter from './Counter.vue';
  import MultiSelect from 'primevue/multiselect';
  import router from '../../router'
  import Paginate from 'vuejs-paginate-next';
  import { helpers, required } from '@vuelidate/validators';
  import TabView from "primevue/tabview";
  import TabPanel from "primevue/tabpanel";
  import Badge from 'primevue/badge';
  import Choicer from '../Choicer.vue';
  import productTable from '../table/product-table.vue';
  
  export default {
      name: 'ProfileSalesAdd',
      props: {
        type: {
          type: Number,
          default: 2
        }
      },
      data() {
        return {
          loading: true,
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
          // Фильтр по товарам Коллекции
          filters_available_collections: {
            name: {
              name: "Наименование, артикул",
              placeholder: "Наименование, артикул",
              type: "text",
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
          products_cols: {
            product: {
              label: "Товар",
              type: "product",
              class: "table-kenost__name-product"
            },
            source_name: {
              label: "Источник",
              type: "text",
              properties: {
                save: true
              }
            },
            price: {
              label: "РРЦ, ₽",
              type: "number",
            },
            sale: {
              label: "Скидка, %",
              type: "number",
              properties: {
                save: true
              }
            },
            new_price: {
              label: "Цена со скидкой за шт.",
              type: "number",
              properties: {
                setting: true,
                save: true
              }
            },
            min_count: {
              label: "Минимальное количество, шт",
              type: "counter",
              properties: {
                save: true
              }
            },
            multiplicity: {
              label: "Кратность, шт",
              type: "counter",
              properties: {
                save: true
              }
            },
            summ: {
              label: "Сумма, ₽",
              type: "number",
              properties: {
                save: true
              }
            },
            actions: {
              label: 'Действия',
              type: 'actions',
              sort: false,
              available: {
                delete: {
                  icon: 'pi pi-trash',
                  label: 'Удалить'
                }
              }
            }
          },
          // Столбцы таблицы Коллекций
          products_cols_collections: {
            product: {
              label: "Товар",
              type: "product",
              class: "table-kenost__name-product"
            },
            brand: {
              label: "Бренд",
              type: "text"
            },
            price: {
              label: "РРЦ, ₽",
              type: "number",
            },
            sale: {
              label: "Скидка, %",
              type: "number",
              properties: {
                setting_global: true,
                save: true
              }
            },
            new_price: {
              label: "Цена со скидкой за шт.",
              type: "number",
              properties: {
                setting: false,
                save: true
              }
            }
          },
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
            {name: 'Наценка', key: 1, disabledkey: false},
            {name: 'Скидка', key: 2, disabledkey: false},
            {name: 'Фиксированая цена', key: 3, disabledkey: false}
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
          // Форма с Данными
          form: {
            name: '',
            description: '',
            client_id: 0,
            compatibilityDiscount: '1',
            actions: [],
            product_groups: {},
            compabilityMode: { name: 'Применяется бóльшая', key: 0 },
            paymentDelivery: { name: 'Покупатель', key: 0 },
            typePay: '1',
            typePayPercent: 10,
            typeDelivery: '1',
            typeDeliveryPercent: 5,
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
            stores: 0,
            warehouses: 0,
            vendors: 0,
            store_id: [],
            dates: [],
            adv: {
              active: false,
              place_position: '',
              geo: '',
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
              }
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
          'groups',
          'dilers',
          'actions_active'
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
            console.log(newVal)
            this.form.action_id = newVal.id
            this.form.name = newVal.name
            this.form.description = newVal.description
            this.form.store_id = newVal.store_ids
            this.form.client_id = String(newVal.client_id)
            if (newVal.image) {              
              this.form.adv.files.max.original_href = newVal.image.image;
            }
            if (newVal.image_inner) {              
              this.form.adv.files.min.original_href = newVal.image_inner.image;
            }
            if (newVal.image_small) {              
              this.form.adv.files.small.original_href = newVal.image_small.image;
            }
            if (newVal.file) {              
              this.form.adv.files.file.original_href = newVal.file.image;
            }
            // TODO: добавить
            if (newVal.page_create) {
              this.form.adv.active = true           
            }
            this.get_sales_adv_pages_to_api({
              action: 'get/adv/pages',
              store_id: router.currentRoute._value.params.id,
              type: this.type
            }).then(() => {
              this.form.adv.place = []
              console.log(this.place)
              console.log(newVal.page_places.split(','))
              const places = newVal.page_places.split(',');
              Object.entries(this.place).forEach((entry) => {
                const [key, value] = entry;
                places.forEach((pentry) => {
                  console.log(value.code +"=="+ pentry)
                  if(value.code == pentry){
                    this.form.adv.place.push(value)
                  }
                })                
              });
            });            
            const dateto = new Date(newVal.date_to);
            const datefrom = new Date(newVal.date_from);
            this.form.dates = [datefrom, dateto];
            this.form.geo_action = this.geo[newVal.page_geo];
            this.form.position = newVal.page_place_position;
            this.form.hide_for_clients = Boolean(newVal.hide_for_clients)
            this.form.negative = Boolean(newVal.negative)
            this.form.offer = Boolean(newVal.offer)
            this.form.integration = Boolean(newVal.integration)
            this.form.stores = Boolean(newVal.available_stores)
            this.form.warehouses = Boolean(newVal.available_vendors)
            this.form.vendors = Boolean(newVal.integration)
            this.form.typeDelay = String(newVal.delay_type)
            this.form.typePay = String(newVal.pay_type)
            this.form.typePayPercent = String(newVal.pay_type_percent)
            this.form.typeDelivery = String(newVal.delivery_type)
            this.form.typeDeliveryPercent = String(newVal.delivery_type_percent)
            this.form.delay = newVal.delay_graph
            this.form.conditionMinSum = newVal.condition_min_sum;
            this.form.regions = newVal.regions
            this.form.actions = newVal.big_sale_actions
            this.form.all_organizations_selected = newVal.organization
            this.form.postponementPeriod = newVal.delay
            this.form.participantsType = String(newVal.participants_type)
            this.form.compatibilityDiscount = String(newVal.compatibility_discount)
            if(newVal.condition_min_sum || newVal.condition_SKU || newVal.condition_min_count){
              Object.entries(this.condition).forEach((entry) => {
                const [key, value] = entry;
                if(value.key == 1){
                  this.form.condition = value
                }
              });
            }
            Object.entries(this.paymentDelivery).forEach((entry) => {
              const [key, value] = entry;
              if(value.key == newVal.payer){
                this.form.paymentDelivery = value
              }
            });
            Object.entries(this.compabilityMode).forEach((entry) => {
              const [key, value] = entry;
              if(value.key == newVal.compatibility_discount_mode){
                this.form.compabilityMode = value
              }
            });
            this.form.compatibilityDiscount = String(newVal.compatibility_discount)
            this.form.conditionMinSum = newVal.condition_min_sum;
            this.form.conditionMinCount = newVal.condition_SKU;
            this.form.conditionMinGeneralCount = newVal.condition_min_count;
            this.form.product_groups = newVal.product_groups
            this.updateStoreData()
            if(newVal.pg){
              this.updateGroups(newVal.pg)
            }            
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
          'get_group_api',
          'get_actions_active_api',
          'set_sales_to_api',
          'get_dilers_from_api',
          'unset_action_data'
        ]),
        addGroup(){
          if(this.selected_group.id){
            this.form.product_groups[this.selected_group.id] = {
              group: this.selected_group,
              page: 1,
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
          }
        },
        updateGroups(id){
          console.log('updateGroups', this.form.product_groups[id])          
          this.get_group_products({
            action: 'get/products',
            id: this.$route.params.id,
            group_id: id,
            filter: this.form.product_groups[id].filter,
            page: this.form.product_groups[id].page,
            perpage: this.per_page
          }).then((res) => {
            this.form.product_groups[id].products = res.data
          })
          // console.log(this.action_groups)
        },
        paginateGroupProduct(data){
          if(data.object_id){
            this.form.product_groups[data.object_id].page = data.page
            this.updateGroups(data.object_id)
          }
        },
        filterGroupProductSelected(data){
          console.log(data)
          if(data.object_id){
            this.form.product_groups[data.object_id].filter = data.filter
            this.form.product_groups[data.object_id].page = data.page
            this.updateGroups(data.object_id)
          }
        },
        deleteGroup(id){
          this.form.product_groups = Object.fromEntries(
            Object.entries(this.form.product_groups)
              .filter(([key]) => key !== id.toString())
          );
        },
        async formSubmit(event) {
          this.loading = true;
          console.log('create')
          const validationResult = await this.v$.$validate();
          console.log(validationResult)
          if (!validationResult) {
              // console.log('validation failed');
              return;
          }
          this.$load(async () => {
            const save_data = this.form;
            save_data.id = router.currentRoute._value.params.id;
            save_data.action = 'save';
            save_data.type = this.type;
            await this.set_sales_to_api(save_data)
              .then((result) => {
                  this.loading = false;
                  // Чекнуть тип Акции и редиректнуть куда нужно
                  if(this.type == 1){
                    router.push({ name: 'b2b', params: { id: router.currentRoute._value.params.id } });
                  } 
                  if(this.type == 2){
                    router.push({ name: 'b2c', params: { id: router.currentRoute._value.params.id } });
                  }  
                  if(this.type == 3){
                    router.push({ name: 'discounts', params: { id: router.currentRoute._value.params.id } });
                  }                 
              })
              .catch((result) => {
                  // console.log(result)
              });
          });
          
        },
        settings(items, type){
          // console.log(items)
          this.modals.price_type = type
          this.products_selected = items
          this.modals.price_step = 0      
          if(type == 'group'){
            Object.entries(this.type_pricing).forEach((entry) => {
              const [key, value] = entry;
              if(value.key == 3){
                this.type_pricing[key].disabledkey = true
              }
            });
          }  
          this.modals.price = true
          if(items.length == 1 && type != 'group'){
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
            Object.entries(this.type_pricing).forEach((entry) => {
              const [key, value] = entry;
              if(value.key == 3){
                this.type_pricing[key].disabledkey = false
              }
            });
            const data = {
              type: this.modals.price_type,
              products: this.products_selected,
              data: this.products_selected_data
            }
            this.set_selected_product_data(data).then(() => {
              this.resetDiscountFormula()
              this.updateStoreData()
              if(this.modals.price_type == 'group'){
                this.updateGroups(this.products_selected[0])
              }            
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
              if (response.data.files[0].type_banner === 'min') {
                this.form.adv.files.min = response.data.files[0]
              }
              if (response.data.files[0].type_banner === 'icon') {
                this.form.adv.files.icon = response.data.files[0]
              } 
              if (response.data.files[0].type_banner === 'small') {
                this.form.adv.files.small = response.data.files[0]
              }
              if (response.data.files[0].type_banner === 'file') {
                this.form.adv.files.file = response.data.files[0]
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
            Object.entries(this.type_pricing).forEach((entry) => {
              const [key, value] = entry;
              if(value.key == 3){
                this.type_pricing[key].disabledkey = false
              }
            });
          // }
        },
        updateFormula(){
          if(this.products_selected.length == 1 && this.modals.price_type != 'group'){
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
        this.unset_action_data().then(() => {
          // Берем дерево Категорий
          this.get_catalog_from_api();
          // Берем Склады Организации
          this.org_get_stores_from_api({
            action: 'get/stores',
            id: this.$route.params.id
          });
          // Если условия индивидуальны
          if(this.type == 3){
            this.get_dilers_from_api({
              type: 1,
              page: 1,
              perpage: 999
            })
          }
          // Берем Акцию, если редактируем
          if(router.currentRoute._value.params.sales_id){
            // TODO: Оптимизировать
            this.get_sales_to_api({ 
              id: router.currentRoute._value.params.sales_id, 
              actionid: router.currentRoute._value.params.sales_id 
            }).then(() => {
              this.loading = false;
            });
          }else{
            this.loading = false;
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
            type: this.type
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
            this.get_actions_active_api({
              id: this.$route.params.id,
              action: "get/actions/active"
            })
          }
        });
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