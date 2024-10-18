<template>
	<draggable v-if="cities" v-model="cities" v-bind="dragOptions" class="shopping-kenost__citys">
		<template #item="{ element, index }">
			<li class="shopping-kenost__cityone">
				<div class="shopping-kenost__cityone-name" v-if="element">
					<p>{{ element.value }}</p>
					<div class="btn btn-close" @click="removeSelectedCity(index)">
						<img src="../../assets/images/icons/close.svg" alt="" />
					</div>
				</div>
				<p class="k-mini-text">Дата отгрузки</p>
				<div class="dart-form-group std-display-contents" :class="{ error: !citiesDates[element.value] }">
					<CalendarVue v-model="citiesDates[element.value]" showIcon id="calendar-24h" :minDate="minDate" />
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
	},
	emits: ["update:modelCities", "update:modelCitiesDates"],
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
