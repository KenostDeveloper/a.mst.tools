<template>
	<div class="v-table">
		<div class="profile-content__title">
			<div class="text std-title__container">
				<h1 v-if="title" class="title std-title">
					{{ title }} (<span v-if="total > -1">{{ total }}</span
					><span v-else>0</span>)
				</h1>
				<slot name="desc"></slot>
			</div>
			<slot name="button"></slot>
		</div>
    <div class="">
		<div class="dart-row dart-align-items-center" v-if="show_filter">
      <div class="d-col-xl-3 d-col-lg-4" v-for="(ffilter, i) in filters" :key="i">
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
						:name="i"
						:id="'filter_' + i"
						class="dart-form-control"
						v-model="filtersdata[i]"
						@change="setFilter"
					>
						<option v-for="(opt, opt_i) in ffilter.values" :key="opt_i" :value="opt">
							{{ opt_i }}
						</option>
					</select>
        </div>
        <div class="dart-form-group" v-if="ffilter.type == 'dropdown'">
          <Dropdown v-model="filtersdata[i]" :options="ffilter.values" filter showClear :optionLabel="(ffilter.optionLabel) ? ffilter.optionLabel : 'name'" :optionValue="(ffilter.optionValue) ? ffilter.optionValue : 'id'" :placeholder="ffilter.placeholder" @change="setFilter"></Dropdown>
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
    <div class="clients__card-container" v-if="total != 0">
      <div class="dart-row" v-if="total != -1">
        <div class="d-col-xxl-3 d-col-xl-4 d-col-md-6" v-for="item in items_data" :key="item.id">
          <div class="d-client-card" :class="{ 'd-client-card-with_button': !item.our }">
            <div class="d-client-card__content">
              <img :src="item.image" alt="" class="client-card__img" />
              <div class="d-client-card__info">
                <span class="d-client-card__title">«{{ item.name }}»</span>
                <div class="d-client-card__data">
                  <p class="d-client-card__item"><span class="d-client-card__data-label" v-if="item.req">Адрес:</span> {{ item.req?.fact_address}}</p>
                  <p class="d-client-card__item"><span class="d-client-card__data-label" v-if="item.req">ИНН:</span> {{ item.req?.inn }}</p>
                  <p class="d-client-card__item"><span class="d-client-card__data-label" v-if="item.phone">Телефон:</span> {{ item.phone }}</p>
                  <p class="d-client-card__item"><span class="d-client-card__data-label" v-if="item.email">Email:</span> {{ item.email }}</p>
                </div>
              </div>
            </div>
            <div class="d-client-card__buttons d-client-card__buttons-flex" v-if="item.owner_id > 0">
              <div class="flex">
                <span class="status status-green">Созданный поставщиком</span>
                <div class="d-client-card__actions">
                  <router-link :to="{ name: 'client_update', params: { id: $route.params.id, client_id: item.id } }" class="button-none std-icon__wrapper client-card__action-button">
                    <i class="std_icon std_icon-pen"></i>
                  </router-link>
                  <button class="button-none std-icon__wrapper client-card__action-button" @click.prevent="deleteClient(item)">
                    <i class="std_icon std_icon-trash"></i>
                  </button>
                </div>
              </div>
              <router-link :to="{ name: 'purchases_catalog_offer', params: { id: $route.params.id, id_org_from: item.id, category_id: 4 } }" class="link-no-style w-full">
                <button class="dart-btn dart-btn-primary">Создать предложение</button>
              </router-link>
            </div>
            <div class="d-client-card__buttons flex" v-else>
              <router-link :to="{ name: 'client_id', params: { id: $route.params.id, client_id: item.id } }" class="link-no-style">
                <button class="dart-btn dart-btn-primary">Посмотреть остатки</button>
              </router-link>
              <router-link :to="{ name: 'purchases_catalog_offer', params: { id: $route.params.id, id_org_from: item.id, category_id: 4 } }" class="link-no-style">
                <button class="dart-btn dart-btn-primary">Создать предложение</button>
              </router-link>
            </div>    			
          </div>
        </div>
      </div>
      <div class="dart-row" v-else>
				<div class="d-col-md-3 d-col-lg-4" v-for="n in 4" :key="n">
					<div class="image">
						<Skeleton width="100%" height="150px" class="mb-2"></Skeleton>
					</div>
					<div class="text">
						<Skeleton width="10rem" class="mb-2"></Skeleton>
					</div>
				</div>
			</div>
    </div>
    <div class="clients__card-container" v-else>
			<div class="dart-alert dart alert-info">Ничего не найдено</div>
		</div>
		<paginate
       v-if="total != 0"
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
</template>

<script>
import { toRaw } from "vue";
import { mapActions, mapGetters } from "vuex";
import Paginate from "vuejs-paginate-next";
import TreeSelect from "primevue/treeselect";
import Dropdown from "primevue/dropdown";
import Checkbox from "primevue/checkbox";
import Skeleton from "primevue/skeleton";

export default {
	name: "vClients",
	emits: ["delete","filter","sort","paginate","update"],
	components: {
		Paginate,
		Skeleton,
		TreeSelect,
		Dropdown,
		Checkbox,
	},
	props: {
		items_data: {
			type: Array,
			default: () => {
				return null;
			},
		},
		filters: {
			type: Object,
			default: () => {
				return {};
			},
		},
		table_data: {
			type: Object,
			default: () => {
				return {};
			},
		},
		title: {
			type: String,
			default: null,
		},
		total: {
			type: Number,
			default: -1,
		},
    page: {
      type: Number,
			default: 1
    },
		pagination_items_per_page: {
			type: Number,
			default: 24,
		},
		pagination_offset: {
			type: Number,
			default: 0,
		},
		show_filter: {
			type: Boolean,
			default: true,
		},
	},
	data() {
		return {
			filter: "",
			filtersdata: {},
			loading: [],
			sort: {},			
			calendar: {
				maxDate: null,
			},
			filteredVendor: null,
		};
	},
	computed: {
		...mapGetters(["getvendors"]),
		pagesCount() {
			let pages = Math.ceil(this.total / this.pagination_items_per_page);
			if (pages === 0) {
				pages = 1;
			}
			return pages;
		},
	},
	methods: {
		...mapActions(["get_vendors_from_api"]),
		setFilter(type = "0") {
			if (type === "filter") {
				if (this.filter.length > 3 || this.filter.length === 0) {
					setTimeout(() => {
						this.$emit("filter", {
							filter: this.filter,
							filtersdata: toRaw(this.filtersdata),
							sort: this.sort,
							page: 1,
							perpage: this.pagination_items_per_page,
						});
					});
				}
			} else {
				this.$emit("filter", {
					filter: this.filter,
					filtersdata: toRaw(this.filtersdata),
					sort: this.sort,
					page: 1,
					perpage: this.pagination_items_per_page,
				});
			}
		},
		pagClickCallback(pageNum) {
			this.$emit("paginate", {
				filter: this.filter,
				filtersdata: toRaw(this.filtersdata),
				sort: this.sort,
				page: pageNum,
				perpage: this.pagination_items_per_page,
			});
		},
		searchVendor(event) {
			if (!event.query.trim().length > 2) {
				this.filteredVendors = [...this.getvendors];
			} else {
				const data = {
					search: event.query.trim(),
				};
				this.filteredVendors = this.get_vendors_from_api(data);
			}
		},
		deleteClient(data) {
      this.$emit("delete", data);
		},
	},
	mounted() {
		const data = {
			search: "",
		};
		this.get_vendors_from_api(data).then(() => {});
	},
};
</script>

<style lang="scss">
  .profile-content__title {
    margin-bottom: 24px;
  }
  .clients__card-container{
    margin-top: 33px;
  }
  .status{
    display: inline-block;
    padding: 7px 26px;
    border-radius: 24px;
    border: 1px solid transparent;
    background: transparent;
    color: #525252;
    font-size: 15px;
    font-style: 1.3;
    font-weight: 600;
    line-height: 1.3;
    &.status-green{      
      border: 1px solid #00F619;
      background: rgba(0, 246, 25, 0.21);
    }
  }
  .d-client-card{
    position: relative;
    height: calc(100% - 24px);
    margin-bottom: 24px;
    border-radius: 4px;
    padding: 24px 24px;
    border: 1px solid #E0E0E0;
    &.d-client-card-with_button{
      padding-bottom: 126px;
    }
    &__content{
      position: relative;
      padding-left: 91px;
      & img{
        position: absolute;
        top: 0;
        left: 0;
        width: 70px;
        height: 70px;
        border-radius: 4px;
      }
      .d-client-card__title{
        display: block;
        color: #282828;
        font-size: 16px;
        font-style: normal;
        font-weight: 500;
        line-height: 1.3;
        margin-bottom: 6px;
      }
      .d-client-card__data{
        .d-client-card__item{
          color: #B4B4B4;
          font-size: 14px;
          font-style: normal;
          font-weight: 400;
          line-height: 1.3;
          margin-bottom: 0;
          & + .d-client-card__item{
            margin-top: 6px;
          }
          span{
            font-weight: 600;
          }
        }
      }
    }
    & .d-client-card__buttons{
      position: absolute;
      width: 100%;
      left: 0;
      flex-direction: column;
      padding: 0 20px;
      gap: 8px;
      bottom: 24px;
      // left: 24px;
      // right: 24px;
      // text-align: center;
      &.d-client-card__buttons-flex{
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: space-between;
        .d-client-card__actions{
          button{
            color: #666;
          }
          a{
            display: inline-block;
            text-decoration: none;
            color: #666;
          }
        }
      }
      .dart-btn{
        width: 100%;
        // max-width: 245px;
      }
    }
  }
</style>
