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
          <MultiSelect @change="updateStoreData" v-model="this.form.store_id" :options="this.stores"
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

export default {
    name: 'ProfileSalesAdd',
    props: {},
    data() {
      return {
        loading: false,
        // Флаги окон
        modals: {
          view_actions: false,
          delay: false
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
        // Акции для выбора совместимости
        allAction: {},
        // Форма с Данными
        form: {
          name: '',
          description: '',
          compatibilityDiscount: '1',
          actions: [],
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
        'getregions',
        'allactions',
        'allorganizations'
      ]),
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
      Dialog
    },
    methods: {
      ...mapActions([
        'org_get_stores_from_api',
        'get_sales_to_api',
        'get_regions_from_api',
        'get_sales_adv_pages_to_api',
        'get_all_sales_to_api',
        'get_all_organizations_from_api'
      ]),
      async formSubmit(event) {
        console.log('create')
        const validationResult = await this.v$.$validate();
        console.log(validationResult)
        if (!validationResult) {
            // console.log('validation failed');
            return;
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
      updateStoreData() {
        if(this.form.store_id){
          this.get_all_sales_to_api({
            id: router.currentRoute._value.params.id,
            action: 'get/all',
            store_id: this.form.store_id
          });
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
    },
    mounted() {
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

</style>