<template>
  <div>
    <div class="table-kenost mt-4 mb-4">
      <div class="dart-row align-items-center">
        <div class="d-col-md-6">
          <p class="table-kenost__title">{{ title }}</p>
        </div>
        <div class="d-col-md-6">
          <div class="flex justify-content-end">
            <slot name="button"></slot>
          </div>          
        </div>
      </div>  
      
      <div class="table-kenost__filters">
          <div class="table-kenost__filters-left">
              <div v-for="(ffilter, i) in filters" :key="i">
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
      </div>
      <table class="table-kenost__table">
        <thead>
          <tr>
            <th class="table-kenost__name table-kenost__name-checkbox" v-if="this.selectable">
              <Checkbox @update:modelValue="checkAll" v-model="this.checked_all" :binary="true" inputId="checked_all" value="1" />
            </th>
            <th v-for="(col, index) in this.cols" :key="index" class="table-kenost__name" :class="col.class">
              {{ col.label }}
              <div v-if="col.properties?.setting_global" class="text-primary cursor-pointer" @click="settings(this.object_id, 'group')">Настроить</div>
            </th>
          </tr>
        </thead>
          <tbody v-for="item in this.items" :key="item.id">
              <tr>
                <td class="table-kenost__checkbox" v-if="this.selectable">
                  <Checkbox  
                    v-model="this.table"
                    :value="item.id" />
                </td>
                <td v-for="(col, index) in this.cols">
                  <div v-if="col.type == 'product'" class="table-kenost__product">
                    <img :src="item.image" />
                    <div class="table-kenost__product-text">
                        <p>{{ item.name }}</p>
                        <span>
                          {{ item.article }}
                          <span class="store-name-b2b" :style="{ background: item.color }">
                            {{ item.store }}
                          </span>
                        </span>
                    </div>
                  </div>
                  <div v-if="col.type == 'text'">
                    <div v-if="col.properties?.save">
                      {{ item.save_data[index] }}
                    </div>
                    <div v-else>
                      {{ item[index] }}
                    </div>    
                  </div>
                  <div v-if="col.type == 'number'">
                    <div v-if="col.properties?.save">
                      {{ Number(item.save_data[index]).toFixed(2).toLocaleString('ru') }}
                    </div>
                    <div v-else>
                      {{ Number(item[index]).toFixed(2).toLocaleString('ru') }}
                    </div>                    
                    <p v-if="col.properties?.setting" class="table-kenost__settings" @click="settings(item, 'items')">Настроить</p>
                  </div>
                  <div v-if="col.type == 'counter'" class="text-center">
                    <Counter
                      class="margin-auto"
                      @ElemCount="ElemCount"
                      :item="item"
                      :id="item.id"
                      :field="index"
                      :min="1"
                      :value="item.save_data[index]"
                      :key="new Date().getMilliseconds() + item.id"
                    />
                  </div>
                  <div v-if="col.type == 'actions'">
                    <div class="kenost-basker-delete" v-for="(action, ai) in col.available">
                      <div class="kenost-basker-delete__button" @click="deleteSelect(item.id)" v-if="ai == 'delete'">
                          <i class="pi pi-trash"></i>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
          </tbody>
      </table>
      <paginate 
        :page-count="pagesCount" 
        :click-handler="pageClick" 
        :prev-text="'Пред'"
        :next-text="'След'" 
        :container-class="'pagination justify-content-center'"
        :initialPage="this.page" 
        :forcePage="this.page">
      </paginate>
      <div class="table-kenost-help" v-if="this.selectable">
          <div class="table-kenost-help__select">
            <span>Всего / Отмечено:</span> {{ this.total }} / {{this.filter_table_global ? this.total : Object.keys(this.table).length}}
          </div>
          <div class="flex align-items-center gap-1">
              <Checkbox @change="globalTable" v-model="this.filter_table_global" :binary="true"
                  inputId="global_kenost_table-1" name="global_kenost_table-1" value="true" />
              <label for="global_kenost_table-1" class="ml-1 mb-0">Все</label>
          </div>
          <div>
            <a @click.prevent="massActions" href="#" class="dart-btn dart-btn-primary">Массовые действия</a>
          </div>
      </div>
  </div>
  </div>
</template>
<script>
import { toRaw } from "vue";
import { mapActions, mapGetters } from 'vuex';
import Dropdown from 'primevue/dropdown';
import Dialog from 'primevue/dialog';
import InputNumber from 'primevue/inputnumber';
import TreeSelect from 'primevue/treeselect';
import Checkbox from 'primevue/checkbox';
import Counter from '../opt/Counter.vue';
import router from '../../router';
import Paginate from 'vuejs-paginate-next';
import MultiSelect from 'primevue/multiselect';
import Badge from 'primevue/badge';

export default {
  name: 'ProductTable',
	emits: [
    "changeMultiplicity",
    "changeMinCount",
    "deSelect",
    "settings",
		"paginate",
		"filter"
	],
  props: {
    title: {
      type: String,
			default: "Таблица добавленных товаров",
    },
    filter_value: {
      type: String,
			default: "",
    },
    cols: {
      type: Array,
      default: []
    },
    items: {
      type: Array,
      default: []
    },
    object_id: {
			type: Number,
			default: 0,
		},
		items_per_page: {
			type: Number,
			default: 25,
		},
		page: {
			type: Number,
			default: 1,
		},
		total: {
			type: Number,
			default: -1,
		},
		show_filter: {
			type: Boolean,
			default: false,
		},
		selectable: {
			type: Boolean,
			default: true,
		},
		filters: {
			type: Object,
			default: () => {
				return {};
			},
		}
  },
  data() {
    return {
      loading: false,
      filter: '',
      filtersdata: {},
      selected: [],
      table: [],
      checked_all: false,
      filter_table_global: false,
      filter_table: false
    }
  },
  methods: {
    pageClick(pageNum){
      this.$emit("paginate", {
				filter: this.filter,
				filtersdata: toRaw(this.filtersdata),
				page: pageNum,
				perpage: this.items_per_page,
        object_id: this.object_id
			});
    },
    setFilter(type){
      this.filter_table_global = false
      this.table = []
      if (type === "filter") {
				if (this.filter.length >= 3 || this.filter.length === 0) {
					setTimeout(() => {
            console.log(this.filter)
						this.$emit("filter", {
							filter: this.filter,
							filtersdata: toRaw(this.filtersdata),
							page: 1,
							perpage: this.items_per_page,
              object_id: this.object_id
						});
            console.log(this.filter)
					}, 500);
				}
			} else {
				this.$emit("filter", {
					filter: this.filter,
					filtersdata: toRaw(this.filtersdata),
					page: 1,
					perpage: this.items_per_page,
          object_id: this.object_id
				});
			}
    },
    settings(item, type){
      this.selected = []
      this.selected.push(item)
      this.$emit("settings", this.selected, type);      
    },
    massActions(){
      this.selected = []
      var type = "items"
      if(this.filter_table_global){
        type = "all"
        this.selected.push(1)
        this.selected.push(2)
      }   
      Object.entries(this.table).forEach((entry) => {
        const [key, value] = entry;
        Object.entries(this.items).forEach((item) => {
          const [ikey, ivalue] = item;
          if(value == ivalue.id){
            this.selected.push(ivalue)
          }
        })        
      });
      this.$emit("settings", this.selected, type);
    },
    ElemCount(data){
      if(data.field == "min_count"){
        this.$emit("changeMinCount", data);
      }
      if(data.field == "multiplicity"){
        this.$emit("changeMultiplicity", data);
      }
    },
    deleteSelect(data){
      this.$emit("deSelect", data);
    },
    globalTable(){
      this.selected_all = this.total
    },
    checkAll() {
      if (!this.checked_all) {
        for (let i = 0; i < Object.keys(this.items).length; i++) {
          this.table.push(this.items[Object.keys(this.items)[i]].id);
        }
      } else {
        this.table = []
      }
    }
  },
  computed: {
		pagesCount() {
			let pages = Math.ceil(this.total / this.items_per_page);
			if (pages === 0) {
				pages = 1;
			}
			return pages;
		}
  },
  mounted () {
    if(this.filter_value){
      this.filter = this.filter_value
    }
  },
  components: {
      Dropdown,
      Dialog,
      InputNumber,
      TreeSelect,
      Checkbox,
      Counter,
      MultiSelect,
      Paginate,
      Badge
  },
  watch: {
    table: function (newVal, oldVal) {
        if(Object.keys(this.items).length != Object.keys(this.table).length){
          this.checked_all = false
        }
    },
    filter_table_global: function (newVal, oldVal) {
        if(newVal){
          this.table = []
        }
    },
  }
}
</script>
<style>
.text-center .k-quantity{
  margin: 0 auto;
}
</style>