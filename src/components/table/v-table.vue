<template>
  <div class="v-table">
    <div class="profile-content__title" v-if="title">
        <div class="text">
          <span class="title">{{ title }} (<span v-if="total > -1">{{ total }}</span><span v-else>0</span>)</span>
          <slot name="desc"></slot>
        </div>
        <slot name="button"></slot>
    </div>
    <!--
    <v-table-filter
      :filters="this.filters"
      @filter="setFilter"
    />
    -->
    <div class="dart-row dart-align-items-center" v-if="show_filter">
        <div class="d-col-md-3" v-for="(ffilter, i) in filters" :key="i">
          <div class="form_input_group input_pl input-parent required" v-if="ffilter.type == 'text'">
            <input
            type="text"
            id="filter_name"
            :placeholder="ffilter.placeholder"
            :name="i"
            class="dart-form-control"
            v-model="filter"
            @input="setFilter('filter')"
            />
            <label for="product_filter_name" class="s-complex-input__label">{{ ffilter.placeholder }}</label>
            <div class="form_input_group__icon">
                <!-- <i class="d_icon d_icon-search"></i> -->
                <img src="../../assets/images/icons/input-search.svg" alt="">
            </div>
          </div>
          <div class="dart-form-group" v-if="ffilter.type == 'select'">
            <!-- <label>{{ ffilter.name }}</label> -->
            <select
              :name=i
              :id="'filter_' + i"
              class="dart-form-control"
              v-model="filtersdata[i]"
              @change="setFilter"
              >
              <option v-for="(opt, opt_i) in ffilter.values" :key="opt_i" :value=opt>{{ opt_i }}</option>
            </select>
          </div>
          <div class="dart-form-group" v-if="ffilter.type == 'dropdown'">
            <Dropdown v-model="filtersdata[i]" :options="ffilter.values" filter showClear :optionLabel="(ffilter.optionLabel) ? ffilter.optionLabel : 'name'" :optionValue="(ffilter.optionValue) ? ffilter.optionValue : 'id'" :placeholder="ffilter.placeholder" @change="setFilter"></Dropdown>
          </div>
          <div class="dart-form-group" v-if="ffilter.type == 'number'">
            <InputNumber  v-model="filtersdata[i]" :min="0" :max="100" showButtons buttonLayout="horizontal" :step="ffilter.step ? ffilter.step : 1" :optionLabel="(ffilter.optionLabel) ? ffilter.optionLabel : 'name'" :optionValue="(ffilter.optionValue) ? ffilter.optionValue : 'id'" :placeholder="ffilter.placeholder" @update:modelValue="setFilter"/>
          </div>
          <div class="dart-form-group" v-if="ffilter.type == 'vv'">
            <AutoComplete v-model="filtersdata[i]" placeholder="Производитель" optionLabel="name" dataKey="id" :suggestions="filteredVendor" @complete="searchVendor" @change="setFilter">
              <template #option="slotProps">
                <div class="flex align-options-center">
                    <img :alt="slotProps.option.name" :src="site_url_prefix + slotProps.option.logo" :class="`image mr-2`" style="width: 30px" />
                    <div>{{ slotProps.option.name }}</div>
                </div>
              </template>
            </AutoComplete>
          </div>
          <div class="dart-form-group" v-if="ffilter.type == 'range'">
            <Calendar v-model="filtersdata[i]" selectionMode="range" placeholder="Выберите диапазон дат" :manualInput="false" :maxDate="calendar.maxDate" showIcon @update:modelValue="setFilter"/>
          </div>
          <div class="dart-form-group" v-if="ffilter.type == 'months_range'">
            <Calendar v-model="filtersdata[i]" selectionMode="range" placeholder="Выберите диапазон дат" view="month" :manualInput="false" :maxDate="calendar.maxDate" showIcon @update:modelValue="setFilter"/>
          </div>
          <div class="dart-form-group" v-if="ffilter.type == 'tree'">
            <TreeSelect v-model="filtersdata[i]" :options="ffilter.values" selectionMode="checkbox" :placeholder="ffilter.placeholder" class="w-full" @change="setFilter"/>
          </div>
          <div class="dart-form-group" v-if="ffilter.type == 'checkbox'">
            <div class="flex align-items-center gap-1">
              <Checkbox v-model="filtersdata[i]" :inputId="'input' + i" :name="i" value="1" @change="setFilter"/>
              <label :for="'input' + i" class="ml-2 mb-0"> {{ ffilter.placeholder }} </label>
            </div>
          </div>
        </div>
    </div>
    <div class="v-table__widgets">
      <slot name="widgets"></slot>
    </div>
    <div class="profile-products__products" v-if="total != 0">
        <table class="profile-table">
            <thead class="text-center">
                <tr>
                    <th
                    v-for="(row, index) in table_data"
                    :key="index"
                    >
                      <div v-if="row.type == 'editmode' && this.editMode">
                        <Checkbox v-model="all_check" :value="true" @input="setAllCheck"/>
                      </div>
                      <div v-else>
                        <a class="sort" :class="sort[index]" v-if="row.sort" @click="sorting(index)">
                          {{ row.label }}
                        </a>
                        <span v-else>
                          {{ row.label }}
                        </span>
                      </div>
                    </th>
                </tr>
            </thead>
            
            <tbody v-if="total != -1">
                <v-table-row
                    v-for="row in items_data"
                    :key="row.id"
                    :row_data="row"
                    :keys="table_data"
                    :editMode="editMode"
                    @deleteElem="deleteElem"
                    @updateElem="updateElem"
                    @editElem="editElem"
                    @clickElem="clickElem"
                    @checkElem="checkElem"
                    @approveElem="approveElem"
                    @disapproveElem="disapproveElem"
                    @editNumber="editNumber"
                />
            </tbody>
            <tbody v-else>
              <tr v-for="n in 10" :key="n">
                <td
                v-for="(row, index) in table_data"
                :key="index"
                >
                  <Skeleton class="mb-2"></Skeleton>
                </td>
              </tr>
            </tbody>
        </table>
        <div v-if="pagesCount > 1">
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
    <div class="profile-products__products" v-else>
      <div class="dart-alert dart alert-info">Ничего не найдено</div>
    </div>
  </div>
</template>

<script>
import { toRaw } from 'vue'
import { mapActions, mapGetters } from 'vuex'
import vTableRow from './v-table-row.vue'
// import vTableFilter from './v-table-filter'
import Paginate from 'vuejs-paginate-next'
import Calendar from 'primevue/calendar'
import TreeSelect from 'primevue/treeselect'
import Dropdown from 'primevue/dropdown'
import AutoComplete from 'primevue/autocomplete'
import Checkbox from 'primevue/checkbox'
import InputNumber from 'primevue/inputnumber'
import Skeleton from 'primevue/skeleton'

export default {
  name: 'v-table',
  emits: ['deleteElem', 'updateElem', 'editElem', 'clickElem', 'filter', 'sort', 'paginate', 'setAllCheck', 'checkElem', 'approveElem', 'disapproveElem', 'editNumber'],
  components: {
    vTableRow,
    // vTableFilter,
    Paginate,
    TreeSelect,
    Calendar,
    AutoComplete,
    Dropdown,
    InputNumber,
    Skeleton,
    Checkbox
  },
  props: {
    editMode: {
      type: Boolean,
      default: false
    },
    items_data: {
      type: Array,
      default: () => {
        return null
      }
    },
    filters: {
      type: Object,
      default: () => {
        return {}
      }
    },
    table_data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    title: {
      type: String,
      default: null
    },
    total: {
      type: Number,
      default: -1
    },
    pagination_items_per_page: {
      type: Number,
      default: 5
    },
    pagination_offset: {
      type: Number,
      default: 0
    },
    page: {
      type: Number,
      default: 1
    },
    show_filter: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      filter: '',
      filtersdata: { },
      sort: { },
      per_page: this.pagination_items_per_page,
      loading: false,
      calendar: {
        maxDate: null
      },
      filteredVendor: null,
      all_check: 0
    }
  },
  computed: {
    ...mapGetters([
      'getvendors'
    ]),
    pagesCount () {
      let pages = Math.round(this.total / this.per_page)
      if (pages === 0) {
        pages = 1
      }
      return pages
    }
  },
  methods: {
    ...mapActions([
      'get_vendors_from_api'
    ]),
    checkElem (data) {
      this.$emit('checkElem', data)
    },
    setAllCheck (event) {
      this.$emit('setAllCheck', event)
    },
    deleteElem (data) {
      this.$emit('deleteElem', data)
    },
    clickElem (data) {
      console.log(data)
      this.$emit('clickElem', data)
    },
    updateElem (data) {
      this.$emit('updateElem', data)
    },
    editElem (data) {
      this.$emit('editElem', data)
    },
    approveElem (data) {
      this.$emit('approveElem', data)
    },
    disapproveElem (data) {
      this.$emit('disapproveElem', data)
    },
    editNumber (object) {
      this.$emit('editNumber', object)
    },
    setFilter (type = '0') {
      if (type === 'filter') {
        if (this.filter.length >= 3 || this.filter.length === 0) {
          setTimeout(() => {
            this.$emit('filter', {
              filter: this.filter,
              filtersdata: toRaw(this.filtersdata),
              sort: this.sort,
              page: 1,
              perpage: this.pagination_items_per_page
            })
          })
        }
      } else {
        this.$emit('filter', {
          filter: this.filter,
          filtersdata: toRaw(this.filtersdata),
          sort: this.sort,
          page: 1,
          perpage: this.pagination_items_per_page
        })
      }
    },
    sorting (key) {
      if (Object.prototype.hasOwnProperty.call(this.sort, key)) {
        if (this.sort[key].dir === 'ASC') {
          this.sort[key] = {
            dir: 'DESC',
            sort_desc: true,
            active: true
          }
        } else {
          this.sort = { }
        }
      } else {
        this.sort = { }
        this.sort[key] = {
          dir: 'ASC',
          sort_asc: true,
          active: true
        }
      }
      this.$emit('sort', {
        filter: this.filter,
        filtersdata: toRaw(this.filtersdata),
        sort: toRaw(this.sort),
        page: 1,
        perpage: this.pagination_items_per_page
      })
    },
    pagClickCallback (pageNum) {
      this.$emit('paginate', {
        filter: this.filter,
        filtersdata: toRaw(this.filtersdata),
        sort: this.sort,
        page: pageNum,
        perpage: this.pagination_items_per_page
      })

      const el = document.querySelector('.profile-table tbody')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    },
    searchVendor (event) {
      if (!event.query.trim().length > 2) {
        this.filteredVendors = [...this.getvendors]
      } else {
        const data = {
          search: event.query.trim()
        }
        this.filteredVendors = this.get_vendors_from_api(data)
      }
    }
  },
  mounted () {
    const data = {
      search: ''
    }
    this.get_vendors_from_api(data).then(
      this.filteredVendor = this.getvendors
    )
  },
  created () {
    // console.log(this.filters)
    if (typeof this.filters.range !== 'undefined') {
      if (this.filters.range.range !== 'all') {
        const currDate = Date.now()
        // console.log('Unix time stamp of current date', currDate)
        this.calendar.maxDate = new Date(currDate)
        // console.log(this.calendar.maxDate.getFullYear())
      }
    }
  },
  watch: {
    getvendors: function (newVal, oldVal) {
      // console.log(newVal)
      this.filteredVendor = toRaw(newVal)
      // console.log(this.filteredVendor)
    },
    editMode: function (newVal, oldVal) {
      if (!newVal) {
        this.all_check = false
        this.$emit('setAllCheck', [this.all_check])
      }
    }
  }
}
</script>

<style lang="scss">

  .profile-table{
    thead{
      position: sticky;
      top: 0;
      z-index: 1;
    }
  }
  .p-inputnumber-buttons-horizontal{
    .p-inputtext{
      border-radius: 0;
    }
    .p-inputnumber-button-up{
      border-radius: 0 6px 6px 0;
    }
    .p-inputnumber-button-down{
      border-radius: 6px 0 0 6px;
    }
  }
  .v-table .profile-content__title{
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
  }
  .v-table .profile-content__title .desc{
    color: #ADADAD;
    display: block;
    width: 100%;
    margin-top: 5px;
    display: block;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 1.3;
    letter-spacing: 0.25px;
    flex: 0 0 100%;
    .dart-alert{
      width: 100%;
    }
  }
  .p-inputtext,
  .p-treeselect{
    width: 100%;
  }
  .page-item .page-link{
    cursor: pointer;
  }
  .sort{
    cursor: pointer;
    position: relative;
    display: inline-block !important;
    padding-right: 15px;
    &.active{
      color: #ff0000;
    }
    &::after{
      content: '\e923';
      display: inline-block;
      font-family: 'icomoon' !important;
      font-size: 14px;
      color: #282828;
      position: absolute;
      right: 0;
      top: 50%;
      width: 11px;
      text-align: center;
      transform: translate(0, -50%);
    }
    &_asc{
      position: relative;
      &::after{
        content: '🠕';
        display: inline-block;
        font-family: sans-serif;
        color: #282828;
      }
    }
    &_desc{
      position: relative;
      &::after{
        content: '🠗';
        display: inline-block;
        font-family: sans-serif;
        color: #282828;
      }
    }
  }
</style>
