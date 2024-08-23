<template>
  <div class="v-table">
    <div class="profile-content__title">
      <div class="text">
        <span class="title">{{ title }} (<span v-if="total > -1">{{ total }}</span><span v-else>0</span>)</span>
        <slot name="desc"></slot>
      </div>
      <slot name="button"></slot>
    </div>
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
          <Dropdown v-model="filtersdata[i]" :options="ffilter.values" filter showClear :optionLabel="(ffilter.optionLabel) ? ffilter.optionLabel : 'name'" :optionValue="(ffilter.optionValue) ? ffilter.optionValue : 'id'" :placeholder="ffilter.placeholder" @change="setFilter"></Dropdown>
        </div>
        <div class="dart-form-group" v-if="ffilter.type == 'tree'">
          <TreeSelect v-model="filtersdata[i]" :options="ffilter.values" selectionMode="checkbox" :placeholder="ffilter.placeholder" class="w-full" @change="setFilter"/>
        </div>
        <div class="dart-form-group" v-if="ffilter.type == 'checkbox'">
          <div class="flex align-items-center">
            <Checkbox v-model="filtersdata[i]" :inputId="'input' + i" :name="i" value="1" @change="setFilter"/>
            <label :for="'input' + i" class="ml-2"> {{ ffilter.placeholder }} </label>
          </div>
        </div>
      </div>
    </div>
    <div class="profile-opts" v-if="total != 0">
      <div class="dart-row" v-if="total != -1">
        <div
        class="d-col-md-3 profile-opts__item-wrap"
        v-for="row in items_data"
        :key="row.id">
          <div class="profile-opts__item">
            <div class="profile-opts__item-image">
              <img :src="row.image" alt="">
            </div>
            <div class="profile-opts__item-text">
              <span class="title">{{ row.name }}</span>
              <div class="profile-opts__item-address" v-if="row.address">
                <span>Адрес: </span>
                <span>{{ row.address }}</span>
              </div>
              <div class="participation-block">
                <div class="participation participation-no" v-if="row.connection != 0">
                  <a href="#" class="dart-btn dart-btn-secondary dart-btn-block" @click.prevent="changeOpts(row.id, 0)">
                    <mdicon name="close" />
                    <span>Убрать из поставщиков</span>
                  </a>
                </div>
                <div class="participation participation-yes" v-else>
                  <a href="#" class="dart-btn dart-btn-primary-outline dart-btn-block" @click.prevent="changeOpts(row.id, 1)">
                    <mdicon name="check" />
                    <span>Добавить в поставщики</span>
                  </a>
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
import router from '@/router'
import Paginate from 'vuejs-paginate-next'
import TreeSelect from 'primevue/treeselect'
import Dropdown from 'primevue/dropdown'
import Checkbox from 'primevue/checkbox'
import Skeleton from 'primevue/skeleton'

export default ({
  name: 'v-opts',
  emits: ['update'],
  components: {
    Paginate,
    Skeleton,
    TreeSelect,
    Dropdown,
    Checkbox
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
      loading: [],
      sort: { },
      page: 1,
      per_page: this.pagination_items_per_page,
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
      'get_vendors_from_api',
      'toggle_opts'
    ]),
    changeOpts (id, action) {
      console.log(id + ' ' + action)
      const data = {
        id: id,
        action: action,
        store: router.currentRoute._value.params.id
      }
      this.toggle_opts(data).then(() => {
        this.$emit('update')
      })
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
    this.get_vendors_from_api(data).then(() => {
    })
  }
})
</script>

<style lang="scss">
  .profile-opts__item-wrap{
    margin-bottom: 24px;
  }
  .profile-opts__item{
    background: #FFFFFF;
    border: 1px solid rgba(0, 0, 0, 0.12);
    overflow: hidden;
    border-radius: 5px;
    margin-bottom: 24px;
    position: relative;
    height: 100%;
    &-image{
      position: relative;
      text-align: left;
      padding: 10px 10px;
      img{
        max-width: 100%;
        max-height: 52px;
        background: #FFF;
        border-radius: 50%;
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
      padding: 15px 15px 70px;
      .title{
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
      .profile-opts__item-address{
        display: block;
        font-style: normal;
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 1.3;
        letter-spacing: 0.25px;
        color: #A0A0A0;
      }
    }
    .participation-block{
      position: absolute;
      bottom: 15px;
      left: 15px;
      right: 15px;
      .participation{
        a{
          display: block;
        }
      }
    }
  }
</style>
