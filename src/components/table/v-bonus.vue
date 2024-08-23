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
                    <img :alt="slotProps.option.name" :src="'https://mst.tools/' + slotProps.option.logo" :class="`image mr-2`" style="width: 30px" v-if="slotProps.option.logo"/>
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
    <div class="profile-bonuses" v-if="total != 0">
      <div class="dart-row" v-if="total != -1">
        <div
        class="d-col-md-3 profile-bonuses__item-wrap"
        v-for="row in items_data"
        :key="row.id"
        :row_data="row"
        :keys="table_data">
          <div class="profile-bonuses__item">
            <div class="profile-bonuses__item-image">
              <RouterLink :to="{ name: 'org_bonus_read', params: { id: $route.params.id, bonus_id: row.id }}">
                <img :src="'https://mst.tools' + row.banner" alt="">
              </RouterLink>
              <span class="brand" v-if="row.brand">
                <div v-if="row.brand_logo">
                  <img :src="'https://mst.tools/' + row.brand_logo" :alt="row.brand">
                </div>
                <span>{{ row.brand }}</span>
              </span>
            </div>
            <div class="profile-bonuses__item-text">
              <RouterLink :to="{ name: 'org_bonus_read', params: { id: $route.params.id, bonus_id: row.id }}" class="title">{{ row.name }}</RouterLink>
              <div class="profile-bonuses__item-dates">
                {{ row.date_from_e }} - {{ row.date_to_e }}
              </div>
              <div class="profile-bonuses__item-customer">
                <span>Поставщик: {{ row.store_name }}</span>
              </div>
              <div class="participation-block">
                <div class="participation participation-yes" v-if="row.connection">
                  <mdicon name="check" />
                  <span>Участие принято</span>
                </div>
                <div class="participation participation-no" v-else>
                  <span>Участие не принято</span>
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
import { mapActions, mapGetters } from 'vuex'
import Paginate from 'vuejs-paginate-next'
import Calendar from 'primevue/calendar'
import TreeSelect from 'primevue/treeselect'
import Dropdown from 'primevue/dropdown'
import AutoComplete from 'primevue/autocomplete'
import Skeleton from 'primevue/skeleton'

export default ({
  name: 'v-bonus',
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
      default: 1
    },
    pagination_offset: {
      type: Number,
      default: 0
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
      page: 1,
      per_page: this.pagination_items_per_page,
      loading: false,
      calendar: {
        maxDate: null
      },
      filteredVendor: null
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
    pagClickCallback (pageNum) {
      this.$emit('paginate', {
        filter: this.filter,
        filtersdata: toRaw(this.filtersdata),
        sort: this.sort,
        page: pageNum,
        perpage: this.pagination_items_per_page
      })
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
    }
  }
})
</script>

<style lang="scss">
  .profile-bonuses__item-wrap{
    margin-bottom: 24px;
  }
  .profile-bonuses__item{
    background: #FFFFFF;
    border: 1px solid rgba(0, 0, 0, 0.12);
    overflow: hidden;
    border-radius: 5px;
    margin-bottom: 24px;
    position: relative;
    height: 100%;
    &-image{
      position: relative;
      img{
        width: 100%;
      }
      .brand{
        display: inline-block;
        position: absolute;
        top: 15px;
        right: 15px;
        img{
          max-width: 50px;
          & + span{
            padding-left: 10px;
          }
        }
        span{
          display: inline-block;
          font-style: normal;
          font-weight: 400;
          font-size: 12px;
          line-height: 106%;
          letter-spacing: 0.25px;
          color: #FFFFFF;
        }
      }
      a{
        position: relative;
        display: block;
        &::before{
          content: '';
          display: block;
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(231.98deg, rgba(0, 0, 0, 0.35) 5.59%, rgba(0, 0, 0, 0) 71.94%);
        }
      }
    }
    &-text{
      padding: 15px 15px;
      a.title{
        display: block;
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 1.3;
        letter-spacing: 0.25px;
        color: #282828;
        text-decoration: none;
        & + *{
          margin-top: 15px;
        }
        &:hover{
          text-decoration: underline;
        }
      }
      .profile-bonuses__item-dates{
        display: block;
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 1.3;
        letter-spacing: 0.25px;
        color: #676767;
        & + *{
          margin-top: 15px;
        }
      }
      .profile-bonuses__item-customer{
        display: block;
        font-style: normal;
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 1.3;
        letter-spacing: 0.25px;
        color: #A0A0A0;
        & + *{
          margin-top: 15px;
        }
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
