<template>
	<div class="v-table">
		<div class="profile-content__title" v-if="title">
			<div class="text">
				<span class="title"
					>{{ title }} (<span v-if="total > -1">{{ total }}</span
					><span v-else>0</span>)</span
				>
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
			<div class="d-col-xl-3 d-col-md-4" v-for="(ffilter, i) in filters" :key="i">
				<div
					class="form_input_group input_pl input-parent required"
					v-if="ffilter.type == 'text'"
				>
					<input
						type="text"
						id="filter_name"
						:placeholder="ffilter.placeholder"
						:name="i"
						class="dart-form-control"
						v-model="filter"
						@input="setFilter('filter')"
					/>
					<label for="product_filter_name" class="s-complex-input__label">{{
						ffilter.placeholder
					}}</label>
					<div class="form_input_group__icon">
						<!-- <i class="d_icon d_icon-search"></i> -->
						<img src="../../assets/images/icons/input-search.svg" alt="" />
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
					<Dropdown
						v-model="filtersdata[i]"
						:options="ffilter.values"
						filter
						showClear
						:optionLabel="ffilter.optionLabel ? ffilter.optionLabel : 'name'"
						:optionValue="ffilter.optionValue ? ffilter.optionValue : 'id'"
						:placeholder="ffilter.placeholder"
						@change="setFilter"
					></Dropdown>
				</div>
				<div class="dart-form-group" v-if="ffilter.type == 'number'">
					<InputNumber
						v-model="filtersdata[i]"
						:min="0"
						:max="100"
						showButtons
						buttonLayout="horizontal"
						:step="ffilter.step ? ffilter.step : 1"
						:optionLabel="ffilter.optionLabel ? ffilter.optionLabel : 'name'"
						:optionValue="ffilter.optionValue ? ffilter.optionValue : 'id'"
						:placeholder="ffilter.placeholder"
						@update:modelValue="setFilter"
					/>
				</div>
				<div class="dart-form-group" v-if="ffilter.type == 'vv'">
					<AutoComplete
						v-model="filtersdata[i]"
						placeholder="Производитель"
						optionLabel="name"
						dataKey="id"
						:suggestions="filteredVendor"
						@complete="searchVendor"
						@change="setFilter"
					>
						<template #option="slotProps">
							<div class="flex align-options-center">
								<img
									:alt="slotProps.option.name"
									:src="site_url_prefix + slotProps.option.logo"
									:class="`image mr-2`"
									style="width: 30px"
								/>
								<div>{{ slotProps.option.name }}</div>
							</div>
						</template>
					</AutoComplete>
				</div>
				<div class="dart-form-group" v-if="ffilter.type == 'range'">
					<Calendar
						v-model="filtersdata[i]"
						selectionMode="range"
						placeholder="Выберите диапазон дат"
						:manualInput="true"
						:maxDate="calendar.maxDate"
						showIcon
						@update:modelValue="setFilter"
					/>
				</div>
				<div class="dart-form-group" v-if="ffilter.type == 'months_range'">
					<Calendar
						v-model="filtersdata[i]"
						selectionMode="range"
						placeholder="Выберите диапазон дат"
						view="month"
						:manualInput="true"
						:maxDate="calendar.maxDate"
						showIcon
						@update:modelValue="setFilter"
					/>
				</div>
				<div class="dart-form-group" v-if="ffilter.type == 'tree'">
					<TreeSelect
						v-model="filtersdata[i]"
						:options="ffilter.values"
						selectionMode="checkbox"
						:placeholder="ffilter.placeholder"
						class="w-full"
						@change="setFilter"
					/>
				</div>
				<div class="dart-form-group" v-if="ffilter.type == 'checkbox'">
					<div class="flex align-items-center gap-1">
						<Checkbox
							v-model="filtersdata[i]"
							:inputId="'input' + i"
							:name="i"
							value="1"
							@change="setFilter"
						/>
						<label :for="'input' + i" class="ml-2 mb-0">
							{{ ffilter.placeholder }}
						</label>
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
						<th v-for="(row, index) in table_data" :key="index">
							<div v-if="row.type == 'editmode' && this.editMode">
								<!-- <Checkbox v-model="all_check" :binary="true" /> -->
								<!-- <Checkbox :modelValue="all_check" @update:modelValue="all_check = $event" :binary="true" /> -->
								<Checkbox :modelValue="all_check" @update:modelValue="val => all_check = val" :binary="true" />

							</div>
							<div v-else>
								<a
									class="sort"
									:class="sort[index]"
									v-if="row.sort"
									@click="sorting(index)"
								>
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
					<!-- v-for="row in items_data" -->
					<v-table-row
						v-for="row in localItems"
						:key="row.id"
						:row_data="row"
						:keys="table_data"
						:editMode="editMode"
						@deleteElem="deleteElem"
						@updateElem="updateElem"
						@viewElem="viewElem"
						@editElem="editElem"
						@clickElem="clickElem"
						@checkElem="checkElem"
						@approveElem="approveElem"
						@disapproveElem="disapproveElem"
						@editNumber="editNumber"
						:link_row="link_row"
					/>
				</tbody>
				<tbody v-else>
					<tr v-for="n in 10" :key="n">
						<td v-for="(row, index) in table_data" :key="index">
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
			<div class="dart-alert dart-alert-info">Ничего не найдено</div>
		</div>
	</div>
</template>

<script>
import { toRaw } from "vue";
import { mapActions, mapGetters } from "vuex";
import vTableRow from "./v-table-row.vue";
// import vTableFilter from './v-table-filter'
import Paginate from "vuejs-paginate-next";
import Calendar from "primevue/calendar";
import TreeSelect from "primevue/treeselect";
import Dropdown from "primevue/dropdown";
import AutoComplete from "primevue/autocomplete";
import Checkbox from "primevue/checkbox";
import InputNumber from "primevue/inputnumber";
import Skeleton from "primevue/skeleton";

export default {
	name: "v-table",
	emits: [
		"deleteElem",
		"viewElem",
		"updateElem",
		"editElem",
		"clickElem",
		"filter",
		"sort",
		"paginate",
		"setAllCheck",
		"checkElem",
		"approveElem",
		"disapproveElem",
		"editNumber",
	],
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
		Checkbox,
	},
	props: {
		editMode: {
			type: Boolean,
			default: false,
		},
		items_data: {
			type: Array,
			default: () => [],
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
		pagination_items_per_page: {
			type: Number,
			default: 5,
		},
		pagination_offset: {
			type: Number,
			default: 0,
		},
		page: {
			type: Number,
			default: 1,
		},
		show_filter: {
			type: Boolean,
			default: true,
		},
		link_row: {
			type: Object,
			default: {},
		},
	},
	data() {
		return {
			selectedItems: [],
			localItems: [], // копия items_data
			filter: "",
			filtersdata: {},
			sort: {},
			per_page: this.pagination_items_per_page,
			loading: false,
			calendar: {
				maxDate: null,
			},
			filteredVendor: null,
			all_check: false,
		};
	},
	computed: {
		...mapGetters(["getvendors"]),
		pagesCount() {
			let pages = Math.ceil(this.total / this.per_page);
			if (pages === 0) {
				pages = 1;
			}
			return pages;
		},
		all_check: {
			get() {
			// Просто считаем, отмечены ли все
			return this.localItems.length > 0 && this.localItems.every(item => item.checked === true);
			},
			set(val) {
			// Чтобы не зациклить: если текущее значение уже равно — ничего не делаем
			const alreadyAll = this.localItems.every(item => item.checked === val);
			if (alreadyAll) return;

			this.localItems = this.localItems.map(item => ({
				...item,
				checked: val
			}));

			this.selectedItems = val ? [...this.localItems] : [];
			this.$emit("checkElem", this.selectedItems.map(item => item.id));
			}
		}
	},
	methods: {
		...mapActions(["get_vendors_from_api", 'org_get_stores_from_api']),
		checkElem(data) {
		const exists = this.selectedItems.find(item => item.id === data.id)
		if (data.checked && !exists) {
			this.selectedItems.push(data)
		} else if (!data.checked && exists) {
			this.selectedItems = this.selectedItems.filter(item => item.id !== data.id)
		}

		// если нужно — эмитим наружу
		this.$emit("checkElem", this.selectedItems.map(item => item.id))

		// можно логировать для проверки
		// console.log("✅ Selected IDs:", this.selectedItems.map(item => item.id))
		},
		viewElem (data) {
			this.$emit('viewElem', data)
		},
		// setAllCheck(event) {
		// 	this.$emit("setAllCheck", event);
		// },
		setAllCheck(event) {
			// this.all_check = event;

			if (!Array.isArray(this.items_data)) return;

			this.items_data.forEach(item => {
				item.checked = this.all_check;
			});

			this.selectedItems = this.all_check
				? this.items_data.map(item => ({ ...item }))
				: [];

			this.$emit("checkElem", this.selectedItems.map(item => item.id));

			// this.selectedItems = !this.all_check
			// 	? this.items_data.map(item => ({ ...item }))
			// 	: [];
			// console.log(this.selectedItems)
			// this.$emit("checkElem", this.selectedItems.map(item => item.id));
		},
		deleteElem(data) {
			this.$emit("deleteElem", data);
		},
		clickElem(data) {
			this.$emit("clickElem", data);
		},
		updateElem(data) {
			this.$emit("updateElem", data);
		},
		editElem(data) {
			this.$emit("editElem", data);
		},
		approveElem(data) {
			this.$emit("approveElem", data);
		},
		disapproveElem(data) {
			this.$emit("disapproveElem", data);
		},
		editNumber(object) {
			this.$emit("editNumber", object);
			console.log('edit', object)
		},
		setFilter(type = "0") {
      	console.log(type);
			if (type === "filter") {
				if (this.filter.length >= 3 || this.filter.length === 0) {
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
		sorting(key) {
			if (Object.prototype.hasOwnProperty.call(this.sort, key)) {
				if (this.sort[key].dir === "ASC") {
					this.sort[key] = {
						dir: "DESC",
						sort_desc: true,
						active: true,
					};
				} else {
					this.sort = {};
				}
			} else {
				this.sort = {};
				this.sort[key] = {
					dir: "ASC",
					sort_asc: true,
					active: true,
				};
			}
			this.$emit("sort", {
				filter: this.filter,
				filtersdata: toRaw(this.filtersdata),
				sort: toRaw(this.sort),
				page: 1,
				perpage: this.pagination_items_per_page,
			});
		},
		pagClickCallback(pageNum) {
			this.$emit("paginate", {
				filter: this.filter,
				filtersdata: toRaw(this.filtersdata),
				sort: this.sort,
				page: pageNum,
				perpage: this.pagination_items_per_page,
			});

			const el = document.querySelector(".profile-table tbody");
			if (el) {
				el.scrollIntoView({ behavior: "smooth" });
			}
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
	},
	mounted() {
		const data = {
			search: "",
		};
		this.get_vendors_from_api(data).then((this.filteredVendor = this.getvendors));
		if (Array.isArray(this.items_data)) {
			this.items_data.forEach(item => {
				if (typeof item.checked === 'undefined') {
					item.checked = false;
				}
			});
		}
	},
	created() {
		// console.log(this.filters)
		if (typeof this.filters.range !== "undefined") {
			if (this.filters.range.range !== "all") {
				const currDate = Date.now();
				// console.log('Unix time stamp of current date', currDate)
				this.calendar.maxDate = new Date(currDate);
				// console.log(this.calendar.maxDate.getFullYear())
			}
		}
	},
	watch: {
		getvendors: function (newVal, oldVal) {
			// console.log(newVal)
			this.filteredVendor = toRaw(newVal);
			// console.log(this.filteredVendor)
		},
		editMode: function (newVal, oldVal) {
			if (!newVal) {
				this.all_check = false;
				this.$emit("setAllCheck", [this.all_check]);
			}
		},
		items_data: {
			handler(val) {
				this.localItems = val.map(item => ({ ...item, checked: !!item.checked }));
			},
			immediate: true,
		},
		all_check(val) {
			if (!Array.isArray(this.localItems)) return;

			this.localItems.forEach(item => {
				if (item.checked !== val) item.checked = val;
			});

			this.selectedItems = val ? [...this.localItems] : [];
			this.$emit("checkElem", this.selectedItems.map(item => item.id));
		},
		filters: {
			handler(newVal, oldVal) {
				// console.log('Filters updated:', newVal, oldVal);
				if(newVal.store && newVal.store.values == undefined){
					this.org_get_stores_from_api({
						action: 'get/stores',
						id: this.$route.params.id
					}).then((res) => {
						const stores = res.data.data;

						let storesall = []
						for (let i = 0; i < stores?.items?.length; i++) {
							storesall.push({ name: stores.items[i].name, id: stores.items[i].id })
						}
						
						this.filters.store.values = storesall
					})
				}
				if (newVal !== oldVal) {
					// Выполните нужные действия
				}
			},
			deep: true,
			immediate: true, // Сразу выполнить при создании компонента
		}
	},
};
</script>

<style lang="scss">
.profile-table {
	thead {
		position: sticky;
		top: 0;
		z-index: 1;
		background: #282828;
		th {
			a,
			span {
				color: #fff;
			}
		}
	}
}
.p-inputnumber-buttons-horizontal {
	.p-inputtext {
		border-radius: 0;
	}
	.p-inputnumber-button-up {
		border-radius: 0 6px 6px 0;
	}
	.p-inputnumber-button-down {
		border-radius: 6px 0 0 6px;
	}
}
.v-table .profile-content__title {
	display: flex;
	width: 100%;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
}
.v-table .profile-content__title .desc {
	color: #adadad;
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
	.dart-alert {
		width: 100%;
	}
}
.p-inputtext,
.p-treeselect {
	width: 100%;
}
.page-item .page-link {
	cursor: pointer;
}
.sort {
	cursor: pointer;
	position: relative;
	display: inline-block !important;
	padding-right: 15px;
	&.active {
		color: #ff0000;
	}
	&::after {
		content: "\e923";
		display: inline-block;
		font-family: "icomoon" !important;
		font-size: 14px;
		color: #fff !important;
		position: absolute;
		right: 0;
		top: 50%;
		width: 11px;
		text-align: center;
		transform: translate(0, -50%);
	}
	&_asc {
		position: relative;
		&::after {
			content: "🠕";
			display: inline-block;
			font-family: sans-serif;
			color: #fff !important;
		}
	}
	&_desc {
		position: relative;
		&::after {
			content: "🠗";
			display: inline-block;
			font-family: sans-serif;
			color: #282828;
		}
	}
}
</style>
