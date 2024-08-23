<template>
  <div class="v-table">
    <div class="profile-content__title">
        <span class="title">{{ title }} (<span v-if="total > -1">{{ total }}</span><span v-else>0</span>)</span>
        <slot name="button"></slot>
    </div>
    <!--
    <v-table-filter
      :filters="this.filters"
      @filter="setFilter"
    />
    -->
    <div class="dart-row dart-align-items-center" v-if="show_filter">
        <div class="d-col-md-6" v-for="(ffilter, i) in filters" :key="i">
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
                <i class="d_icon d_icon-search"></i>
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
            <Dropdown v-model="filtersdata[i]" :options="ffilter.values" filter showClear optionLabel="name" optionValue="id" :placeholder="ffilter.placeholder" @change="setFilter"></Dropdown>
          </div>
          <div class="dart-form-group" v-if="ffilter.type == 'vv'">
            <AutoComplete v-model="filtersdata[i]" placeholder="Производитель" optionLabel="name" dataKey="id" :suggestions="filteredVendor" @complete="searchVendor" @change="setFilter">
              <template #option="slotProps">
                <div class="flex align-options-center">
                    <img :alt="slotProps.option.name" :src="'https://mst.tools/' + slotProps.option.logo" :class="`image mr-2`" style="width: 30px" />
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
        </div>
    </div>
    <div class="profile-docs" v-if="total != 0">
      <div class="dart-row" v-if="total != -1">
        <div
        class="d-col-md-3"
        v-for="row in items_data"
        :key="row.id"
        :row_data="row"
        :keys="table_data">
          <div class="profile-docs__item" :class="{ 'has-action': row.has_action, 'has-submit': row.has_submit }">
            <div class="profile-docs__item-wrap">
              <div class="profile-docs__item-image">
                <div>
                  <img :src="'/img/files/' + row.file_type + '.png'" alt="">
                </div>
                <div class="profile-docs__item-text">
                    <a :href="row.file">{{ row.name }}</a><br/>
                    <span class="type">{{ row.description }}</span>
                </div>
              </div>
              <div class="profile-docs__item-meta">
                <div class="status" :class="{ 'has-action': row.has_action, 'has-submit': row.has_submit }">
                    {{ row.status_name }}
                </div>
                <div class="date">
                  <span>Дата изменения:<br/>{{ row.date }}</span>
                </div>
                <div class="submit_area" v-if="row.has_submit">
                  <a href="#" class="dart-btn dart-btn-primary" @click="submit(row.id)">Подтвердить</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="dart-row" v-else>
        <div class="d-col-md-3" v-for="n in 4" :key="n">
          <div class="image">
            <Skeleton width="100%" height="150px" class="mb-2"></Skeleton>
          </div>
          <div class="text">
            <Skeleton width="10rem" class="mb-2"></Skeleton>
          </div>
        </div>
      </div>
    </div>
    <div class="profile-products__products" v-else>
      <div class="dart-alert dart alert-info">Ничего не найдено</div>
    </div>
    <paginate
      :page-count="pagesCount"
      :click-handler="pagClickCallback"
      :prev-text="'Пред'"
      :next-text="'След'"
      :container-class="'pagination justify-content-center'"
    >
    </paginate>
  </div>
</template>

<script>
import { toRaw } from 'vue'
import Paginate from 'vuejs-paginate-next'
import Calendar from 'primevue/calendar'
import TreeSelect from 'primevue/treeselect'
import Dropdown from 'primevue/dropdown'
import AutoComplete from 'primevue/autocomplete'
import Skeleton from 'primevue/skeleton'

export default ({
  name: 'v-docs',
  components: {
    Paginate,
    TreeSelect,
    Calendar,
    AutoComplete,
    Dropdown,
    Skeleton
  },
  props: {
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
      filteredVendor: null
    }
  },
  computed: {
    pagesCount () {
      let pages = Math.round(this.total / this.per_page)
      if (pages === 0) {
        pages = 1
      }
      return pages
    }
  },
  methods: {
    deleteElem (data) {
      this.$emit('deleteElem', data)
    },
    setFilter (type = '0') {
      if (type === 'filter') {
        if (this.filter.length > 3 || this.filter.length === 0) {
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
    submit (type) {
      this.$emit('submit', type)
    },
    pagClickCallback (pageNum) {
      this.$emit('paginate', {
        filter: this.filter,
        filtersdata: toRaw(this.filtersdata),
        sort: this.sort,
        page: pageNum,
        perpage: this.pagination_items_per_page
      })
    }
  },
  mounted () {
  },
  created () {
    // console.log(this.filters)
  },
  watch: {
  }
})
</script>

<style lang="scss">
  .profile-docs__item{
    background: #FFFFFF;
    border: 1px solid rgba(0, 0, 0, 0.12);
    padding: 24px 24px;
    border-radius: 5px;
    position: relative;
    height: 100%;
    &.has-submit:hover,
    &.has-submit.active{
      border: none;
      .profile-docs__item-wrap{
        position: absolute;
        background: #FFFFFF;
        border: 1px solid rgba(0, 0, 0, 0.12);
        border-radius: 5px;
        overflow: hidden;
        padding: 24px 24px;
        left: 0;
        top: 0;
        right: 0;
        z-index: 99;
      }
      .profile-docs__item-meta .submit_area{
        display: block;
      }
    }
    &-image{
      position: relative;
      display: flex;
      align-items: center;
    }
    &-text{
      padding-left: 15px;
      a{
        color: #282828;
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        letter-spacing: 0.15px;
        text-decoration: none;
      }
      span{
        display: inline-block;
        padding-top: 8px;
        color: #ADADAD;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 106%; /* 14.84px */
        letter-spacing: 0.25px;
      }
    }
    &-meta{
      display: flex;
      flex-wrap: wrap;
      margin-top: 16px;
      border-top: 1px solid #ADADAD;
      padding-top: 16px;
      .submit_area{
        width: 100%;
        padding-top: 12px;
        display: none;
        & .dart-btn{
          display: block;
        }
      }
      .status{
        width: 50%;
        color: #A0A0A0;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 1.3;
        letter-spacing: 0.25px;
        &.has-action{
          color: #282828;
        }
        &.has-submit{
          color: #F90;
        }
      }
      .date{
        width: 50%;
        text-align: right;
        padding-left: 5px;
      }
      span{
        display: block;
        color: #A0A0A0;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 1.3;
        letter-spacing: 0.25px;
      }
    }
  }
  .v-table .profile-content__title{
    display: flex;
    align-items: center;
    justify-content: space-between;
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
