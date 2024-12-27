<template>
  <form @submit.prevent="formSubmit">
      <div class="profile-content__title sticky-element">
          <span class="maintitle">Настройка комплекта</span>
          <div class="buttons_container">
          <RouterLink :to="{ name: 'b2b', params: { id: $route.params.id }}" class="dart-btn dart-btn-secondary btn-padding">Отменить</RouterLink>
          <button type="submit" class="dart-btn dart-btn-primary btn-padding" :class="{ 'dart-btn-loading': loading }" :disabled="loading">Сохранить</button>
          </div>
      </div>
      <div>
          <div class="dart-form-group mb-4">
              <span class="ktitle">Наименование комплекта</span>
              <label for="name">Введите наименование, которое будет отражать смысл вашего комплекта.</label>
              <input v-model="this.form.name" type="text" name="name" placeholder="Укажите название комплекта" class="dart-form-control mt-2">
          </div>

          <div class="dart-form-group mt-2 mb-4">
            <span class="ktitle">Склад</span>
            <!-- <label for="name">Введите наименование, которое будет отражать смысл вашей акции</label> -->
            <!-- <input v-model="form.name" type="text" name="name" placeholder="Укажите склад акции" class="dart-form-control"> -->
             <!-- {{ this.form.store_id }} -->
            <Dropdown
              @change="updateProducts"
              v-model="this.form.store_id"
              :options="this.stores"
              optionLabel="label"
              optionValue="value"
              placeholder="Выберите склад"
            />
          </div>

          <!-- <div class="dart-form-group mb-4">
              <span class="ktitle">Даты проведения</span>
              <Calendar v-model="this.form.dates" selectionMode="range" placeholder="Выберите даты" :manualInput="false" showIcon/>
          </div> -->

          <div v-if="this.form.store_id" class="PickList mt-3">
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
                          <i class="pi pi-search"></i>
                      </div>
                  </div>
                  <div class="dart-form-group">
                      <TreeSelect v-model="this.filter.category" :options="this.get_catalog" selectionMode="checkbox" placeholder="Выберите категорию" class="w-full" @change="setFilter"/>
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

          <div v-if="this.form.store_id" class="table-kenost mt-4">
              <p class="table-kenost__title">Настройки комплекта</p>
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
                  </tr>
              </thead>
              <tbody v-for="item in this.selected" :key="item.id">
                  <tr>
                  <td class="table-kenost__checkbox">
                      <Checkbox v-model="this.kenost_table" inputId="kenost_table" :value="'select_' + item.id" />
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
                    {{this.selected_data[item.id] ?
                      Number(this.selected_data[item.id].discountInterest).toFixed(2).toLocaleString('ru')
                      :
                      Number(0.0).toFixed(2)
                    }}
                  </td>
                  <td>
                    {{ this.selected_data[item.id]?
                    Number(this.selected_data[item.id].finalPrice).toFixed(2).toLocaleString('ru')
                    :
                    item.price.toLocaleString('ru')
                    }} ₽
                      <p class="table-kenost__settings" @click="settings(item, true)" >Настроить</p>
                  </td>
                  <td class="flex justify-content-center" v-if="this.selected_data[item.id]">
                      <Counter class="margin-auto" @ElemCount="ElemCount" :item="item" :id="item.id"
                          :min="1" :value="this.selected_data[item.id].multiplicity"
                          :key="new Date().getMilliseconds() + item.id" />
                  </td>
                  <td class="flex justify-content-center" v-else>
                      <Counter class="margin-auto" @ElemCount="ElemCount" :item="item" :id="item.id"
                          :min="1" :value="1" />
                  </td>
                  <td>
                    {{
                      this.selected_data[item.id]
                          ? (Number(this.selected_data[item.id].finalPrice) *
                              this.selected_data[item.id].multiplicity).toFixed(2)
                          : item.price.toLocaleString('ru')
                    }} ₽
                  </td>
                  </tr>
              </tbody>
              </table>
          </div>

          <!-- <div class="dart-form-group mt-4">
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
              class="w-full md:w-20rem kenost-multiselect" />
              </div>
          </div>

          <div class="PickList" v-if="this.form.participantsType == '2'">
              <div class="PickList__product" :style="{ width: '40%' }">
              <b class="PickList__title">Добавление отдельных компаний</b>
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
                  <label for="product_filter_name" class="s-complex-input__label">Введите название компании</label>
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
                  <b>Добавленные компании</b>
              </div>
              <div class="PickList__products">
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
          </div> -->
      </div>
  </form>

  <Dialog v-model:visible="this.modals.price" :header="this.modals.headers[this.modals.price_step]" :style="{ width: '700px' }">
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
                <RadioButton v-model="this.modals.type_price" inputId="type_price-1" name="type_price" value="1" />
                <label for="type_price-1" class="ml-2 radioLabel">Задать вручную</label>
            </div>
            <div class="flex align-items-center gap-1 mt-3">
                <RadioButton v-model="this.modals.type_price" inputId="type_price-2" name="type_price" value="2" />
                <label for="type_price-2" class="ml-2 radioLabel">Тип цен</label>
            </div>
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
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import router from '../../../router'
// import Calendar from 'primevue/calendar'
import Dialog from 'primevue/dialog'
import InputNumber from 'primevue/inputnumber'
import TreeSelect from 'primevue/treeselect'
import RadioButton from 'primevue/radiobutton'
import Counter from '../../../components/opt/Counter.vue'
import Checkbox from 'primevue/checkbox'
import Dropdown from 'primevue/dropdown'
// import MultiSelect from 'primevue/multiselect'

export default {
  name: 'ComplectsAdd',
  data () {
    return {
      stores: [],
      filter: {
        name: '',
        category: {}
      },
      form: {
        name: '',
        dates: [],
        participantsType: '3',
        store_id: null
      },
      filter_organizations: {
        name: '',
        type: [1, 2]
      },
      saleValue: 0,
      selected: {},
      selected_data: {},
      products: [],
      all_organizations: [],
      all_organizations_selected: {},
      get_catalog: [],
      regions: [],
      regions_select: [],
      kenost_table_all: [],
      kenost_table: [],
      modals: {
        price: false,
        price_step: 0,
        type_price: '1',
        product_id: -1,
        headers: ['Метод редактирования цены', 'Задать вручную', 'Тип цен']
      },
      typePrice: [
        { name: 'Розничная', key: 0 }
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
    }
  },
  methods: {
    ...mapActions([
      'get_available_products_from_api',
      'get_all_organizations_from_api',
      'get_catalog_from_api',
      'get_regions_from_api',
      'opt_api',
      'opt_get_complects',
      'org_get_stores_from_api',
      'opt_get_remain_prices'
    ]),
    setFilter () {
      const data = { storeid: [this.form.store_id], filter: this.filter, filterselected: this.filter_table, selected: Object.keys(this.selected), pageselected: this.page_selected, page: this.page, perpage: this.per_page }
      this.get_available_products_from_api(data)
    },
    ElemCount (obj) {
      this.selected[obj.id].multiplicity = obj.value
    },
    closeDialogPrice () {
      if (this.modals.price_step === 0) {
        this.modals.price_step = Number(this.modals.type_price)
      } else {
        this.modals.price_step = 0
        this.modals.price = false
      }
    },
    updateProducts () {
      const data = {
        storeid: [this.form.store_id],
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

      this.get_available_products_from_api(data).then()
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
    settings(item, modal) {
      this.opt_get_remain_prices({
        action: 'get/product/prices',
        remain_id: item.id
      }).then((res) => {
        this.selected[item.id].prices = res.data.data;
      });

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
    setPrices (index, name, value) {
      switch (name) {
        case 'discountInterest':
          this.selected[index].discountInRubles = (Number(this.selected[index].price) / 100) * value
          this.selected[index].finalPrice = Number(this.selected[index].price) - this.selected[index].discountInRubles
          break
        case 'discountInRubles':
          this.selected[index].discountInterest = value / (Number(this.selected[index].price) / 100)
          this.selected[index].finalPrice = Number(this.selected[index].price) - this.selected[index].discountInRubles
          break
        case 'finalPrice':
          this.selected[index].discountInRubles = Number(this.selected[index].price) - value
          this.selected[index].discountInterest = this.selected[index].discountInRubles / (Number(this.selected[index].price) / 100)
          break
      }
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
    select (id) {
      const product = this.products.find(r => r.id === id)
      product.discountInterest = 0
      product.discountInRubles = 0
      product.multiplicity = 1
      product.finalPrice = Number(product.price)
      product.typeFormul = {}
      product.typePrice = ''

      this.selected[product.id] = product
      this.products = this.products.filter((r) => r.id !== id)
      const data = { storeid: [this.form.store_id], filter: this.filter, filterselected: this.filter_table, selected: Object.keys(this.selected), pageselected: this.page_selected, page: this.page, perpage: this.per_page }
      this.get_available_products_from_api(data)
      this.total_selected++
    },
    formSubmit (event) {
      if(router.currentRoute._value.params.complect_id){
        //Редактирование
        this.$load(async () => {
          await this.opt_api({
            action: 'complect/set',
            store_id: this.form.store_id,
            products:  Object.keys(this.selected),
            products_data: this.selected_data,
            org_id: this.$route.params.id,
            name: this.form.name,
            complect_id: router.currentRoute._value.params.complect_id
          })
            .then((result) => {
              this.loading = false
              router.push({ name: 'b2b', params: { id: router.currentRoute._value.params.id } })
            })
            .catch((result) => {
              console.log(result)
            })
        })
      } else {
        //Создание
        this.$load(async () => {
          await this.opt_api({
              action: 'complect/set',
              store_id: this.form.store_id,
              products:  Object.keys(this.selected),
              products_data: this.selected_data,
              org_id: this.$route.params.id,
              // dates: [this.form.dates[0].toDateString(), this.form.dates[1].toDateString()],
              name: this.form.name
          })
              .then((result) => {
                  this.loading = false;
                  router.push({ name: 'b2b', params: { id: router.currentRoute._value.params.id } });
              })
              .catch((result) => {
                  console.log(result);
              });
         });
      }
      
      this.loading = true
    // }
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
      const data = { storeid: [this.form.store_id], filter: this.filter, filterselected: this.filter_table, selected: Object.keys(this.selected), pageselected: this.page_selected, page: this.page, perpage: this.per_page }
      this.get_available_products_from_api(data)
      this.total_selected--
    },
    pagClickCallback (pageNum) {
      this.page = pageNum
      const data = { storeid: [this.form.store_id], filter: this.filter, filterselected: this.filter_table, selected: Object.keys(this.selected), pageselected: this.page_selected, page: this.page, perpage: this.per_page }
      this.get_available_products_from_api(data)
    }
  },
  mounted () {
    this.get_available_products_from_api({ storeid: [this.form.store_id], filter: '', selected: [], page: this.page }).then(
      this.products = this.available_products.products
    )
    this.get_catalog_from_api().then(
      this.get_catalog = this.getcatalog
    )
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
    this.org_get_stores_from_api({
      action: 'get/stores',
      id: this.$route.params.id
    })
    if(router.currentRoute._value.params.complect_id){
      this.opt_get_complects({
        action: 'complects/get',
        id: router.currentRoute._value.params.id,
        complect_id: router.currentRoute._value.params.complect_id
      })
    }
    
  },
  components: {
    // Calendar,
    Dialog,
    InputNumber,
    TreeSelect,
    RadioButton,
    Counter,
    Checkbox,
    Dropdown
  // MultiSelect
  },
  computed: {
    ...mapGetters([
      'available_products',
      'getcatalog',
      'allorganizations',
      'getregions',
      'optcomplects',
      'org_stores',
    ])
  },
  watch: {
    org_stores: function (newVal, oldVal) {
      this.stores = []
      for (let i = 0; i < newVal.items.length; i++) {
        this.stores.push({ label: newVal.items[i].name, value: newVal.items[i].id })
      }
    },
    available_products: function (newVal, oldVal) {
      if(newVal?.products){
        this.products = newVal.products
      }
      if(newVal.total >= 0){
        this.total_products = newVal.total
      }
    },
    getcatalog: function (newVal, oldVal) {
      this.get_catalog = newVal
    },
    allorganizations: function (newVal, oldVal) {
      this.all_organizations = newVal
    },
    getregions: function (newVal, oldVal) {
      this.regions = this.getregions
    },
    optcomplects: function (newVal, oldVal) {
      this.form.name = newVal.name
      this.form.store_id = (newVal.store_id)?.toString()
      // const dateto = new Date(newVal.date_to)
      // const datefrom = new Date(newVal.date_from)
      // this.form.dates = [datefrom, dateto]
      this.selected = newVal.products

      if(newVal.products_data){
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
      }

      const data = {
        storeid: [this.form.store_id],
        filter: this.filter,
        filterselected: this.filter_table,
        selected: Object.keys(newVal.products),
        pageselected: this.page_selected,
        page: this.page,
        perpage: this.per_page
      }

      this.get_available_products_from_api(data).then()
    }
  }
}
</script>

<style lang="scss">

</style>
