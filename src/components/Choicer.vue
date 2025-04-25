<template>
  <div class="PickList mt-3">
    <div class="PickList__product" :style="{ width: '40%' }">
        <b class="PickList__title">{{ title_available }}</b>
        <div class="PickList__filters" v-if="show_filter">
          <div v-for="(ffilter, i) in filters" :key="i" class="choice_filter">
            <div class="form_input_group input_pl input-parent required" v-if="ffilter.type == 'text'">              
              <input
                type="text" 
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
            <div class="dart-form-group" v-if="ffilter.type == 'tree'">
              <TreeSelect 
                v-model="filtersdata[i]"
						    :options="ffilter.values"
						    selectionMode="checkbox"
						    :placeholder="ffilter.placeholder"
						    class="w-full"
						    @change="setFilter(0)"
              />
            </div>
          </div>          
        </div>
        <div class="PickList__products PickList__products-available">
            
            <div class="PickList__el" :data-id="item.id" v-for="item in this.items_available" :key="item.id">
              <slot name="elem" v-bind="item"></slot>
              <div @click="select(item.id)" class="PickList__select"><i class="pi pi-angle-right"></i></div>
            </div>
            <paginate 
              :page-count="pagesCountAvailable" 
              :click-handler="pagClickAvailable" 
              :prev-text="'Пред'"
              :next-text="'След'" 
              :container-class="'pagination justify-content-center'"
              :initialPage="this.page_available" 
              :forcePage="this.page_available"
            >
            </paginate>
        </div>
    </div>
    <div class="PickList__buttons">
        <div class="PickList__select" @click="setAll(true)"><i
                class="pi pi-angle-double-right"></i></div>
        <div class="PickList__select mt-2" @click="setAll(false)"><i
                class="pi pi-angle-double-left"></i></div>
    </div>    
    <div :style="{ width: '40%' }">
        <div class="PickList__selected">
            <div class="PickList__title mb-4">
                {{ title_selected }}
            </div>
            <div class="PickList__products PickList__products-selected">
                <div class="PickList__el" v-for="item in this.items_selected" :key="item.id">
                  <slot name="elem" v-bind="item"></slot>
                  <div @click="deSelect(item.id)" class="PickList__select"><i class="pi pi-times"></i></div>
                </div>
                <paginate 
                  :page-count="pagesCountSelected" 
                  :click-handler="pagClickSelected" 
                  :prev-text="'Пред'"
                  :next-text="'След'" 
                  :container-class="'pagination justify-content-center'"
                  :initialPage="this.page_selected" 
                  :forcePage="this.page_selected"
                >
                </paginate>
            </div>
        </div>
    </div>
  </div>
</template>
<script>
import { toRaw } from "vue";
import TreeSelect from 'primevue/treeselect';
import router from '../router';
import Paginate from 'vuejs-paginate-next';
export default {
  name: 'Choicer',
	emits: [
		"select",
		"deselect",
		"selectAll",
		"deselectAll",
		"paginateAvailable",
		"paginateSelected",
		"filter"
	],
  props: {
    title_available: {
      type: String,
			default: "Доступно",
    },
    title_selected: {
      type: String,
			default: "Выбрано",
    },
    items_available: {
      type: Object,
			default: () => {},
    },
    items_selected: {
      type: Object,
			default: () => {},
    },
		show_filter: {
			type: Boolean,
			default: false,
		},
		filters: {
			type: Object,
			default: () => {
				return {};
			},
		},
		total_available: {
			type: Number,
			default: -1,
		},
		total_selected: {
			type: Number,
			default: -1,
		},
		items_per_page: {
			type: Number,
			default: 25,
		},
		page_available: {
			type: Number,
			default: 1,
		},
		page_selected: {
			type: Number,
			default: 1,
		}
  },
  data() {
    return {
      loading: false,
      filter: '',
      filtersdata: {}
    }
  },
  computed: {
		pagesCountAvailable() {
			let pages = Math.ceil(this.total_available / this.items_per_page);
			if (pages === 0) {
				pages = 1;
			}
			return pages;
		},
		pagesCountSelected() {
			let pages = Math.ceil(this.total_selected / this.items_per_page);
			if (pages === 0) {
				pages = 1;
			}
			return pages;
		}
  },
	methods: {
    select(data){
      this.$emit("select", data);
    },
		deSelect(data) {
			this.$emit("deSelect", data);
		},
    setAll(flag){
      if(flag){
        // selectAll
        this.$emit("selectAll", {
          filter: this.filter,
          filtersdata: toRaw(this.filtersdata)
        });
      }else{
        // deselectAll
        this.$emit("deselectAll");
      }
      this.filter = ''
      this.filtersdata = {}
    },
    setFilter(type) {
			if (type === "filter") {
				if (this.filter.length >= 3 || this.filter.length === 0) {
					setTimeout(() => {
						this.$emit("filter", {
							filter: this.filter,
							filtersdata: toRaw(this.filtersdata),
							page: 1,
							perpage: this.items_per_page,
						});
					});
				}
			} else {
				this.$emit("filter", {
					filter: this.filter,
					filtersdata: toRaw(this.filtersdata),
					page: 1,
					perpage: this.items_per_page,
				});
			}
      const el = document.querySelector(".PickList__products-available");
			if (el) {
				el.scrollTop = 0;
			}
		},
    pagClickAvailable(pageNum) {
			this.$emit("paginateAvailable", {
				filter: this.filter,
				filtersdata: toRaw(this.filtersdata),
				page: pageNum,
				perpage: this.items_per_page,
			});

			const el = document.querySelector(".PickList__products-available");
			if (el) {
				el.scrollTop = 0;
			}
		},
    pagClickSelected(pageNum) {
			this.$emit("paginateSelected", {
				page: pageNum,
				perpage: this.items_per_page,
			});

			const el = document.querySelector(".PickList__products-selected");
			if (el) {
				el.scrollTop = 0;
			}
		}
  },
  components: {
    Paginate,
    TreeSelect
  }
}
</script>
<style>
</style>