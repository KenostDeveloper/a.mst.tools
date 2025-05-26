<template>
	<draggable v-if="cities" v-model="cities" v-bind="dragOptions" class="shopping-kenost__citys">
		<template #item="{ element, index }">
			<li class="shopping-kenost__cityone">
				<div class="shopping-kenost__cityone-name" v-if="element">
					<p v-if="element.isStore">{{ element.org_name }}, {{ element.address_short || element.address }}</p>
					<p v-else>{{ element.value }}</p>
					<div class="btn btn-close" @click="removeSelectedCity(index)">
						<img src="../../assets/images/icons/close.svg" alt="" />
					</div>
				</div>
				<div class="flex align-items-center gap-2">
					<div class="w-full">
						<p class="k-mini-text">Дата отгрузки</p>
						<div class="dart-form-group std-display-contents w-full" :class="{ error: !citiesDates[element.value] }">
							<CalendarVue class="w-full max-w-full" v-model="element.date" showIcon id="calendar-24h" :minDate="minDate" />
						</div>
					</div>
					<div v-if="element.isStore" class="w-full flex gap-2 align-items-center">
						<div>
							<p class="k-mini-text"></p>
							<InputNumber v-model="element.radius"  :min="0" :max="1000" class="w-full" suffix=" км" />
						</div>
						<div class="w-full text-sm text-sm-12">Укажите радиус от выбранного магазина, куда вы сможете заехать для доставки розничных заказов с маркетплейса.</div>
					</div>
					<div v-else class="w-full"></div>
				</div>
			</li>
		</template>
	</draggable>
	<span class="error_desc" v-for="error of vDatesErrors.$errors" :key="error.$uid">
		{{ error.$message }}
	</span>
</template>

<script>
import CalendarVue from "primevue/calendar";
import draggable from "vuedraggable";
import InputNumber from 'primevue/inputnumber';

export default {
	name: "ShoppingCities",
	props: {
		modelCities: {
			type: Array,
			default: [],
		},
		modelCitiesDates: {
			type: Object,
			default: {},
		},
		minDate: {
			type: Date,
			required: true,
		},
		vDatesErrors: {
			type: Object,
		},
		modelCitiesRadii: {
			type: Object,
			default: () => ({})
		}
	},
	emits: ["update:modelCities", "update:modelCitiesDates", "update:modelCitiesRadii"],
	data() {
		return {
			drag: false,
			cities: this.modelCities,
			citiesDates: this.modelCitiesDates,
		};
	},
	components: {
		CalendarVue,
		draggable,
		InputNumber
	},
	methods: {
		removeSelectedCity(index) {
			this.$emit("removeSelectedCity", index);
		},
	},
	computed: {
		dragOptions() {
			return {
				animation: 200,
				disabled: false,
				ghostClass: "ghost"
			};
		}
	},
	watch: {
		cities: {
			handler(newVal) {
				this.$emit("update:modelCities", newVal);
			},
			deep: true,
		},
		citiesDates: {
			handler(newVal) {
				this.$emit("update:modelCitiesDates", newVal);
			},
			deep: true,
		},
	},
};
</script>

<style lang="scss" scoped>
.button {
	margin-top: 35px;
}

.ghost {
	opacity: 0.5;
}

.list-group {
	min-height: 20px;
}

.list-group-item {
	transition: all .3s ease;
}
</style>
