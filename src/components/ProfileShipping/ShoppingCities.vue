<template>
	<draggable
		v-if="this.cities"
		v-model="this.cities"
		tag="transition-group"
		:component-data="{ tag: 'ul', type: 'transition-group', name: 'flip-list' }"
		item-key="id"
		class="shopping-kenost__citys"
	>
		<template #item="{ element: item, index }">
			<li class="shopping-kenost__cityone">
				<div class="shopping-kenost__cityone-name" v-if="item">
					<p>{{ item.value }}</p>
					<!-- <p>{{ item }}</p> -->
					<div class="btn btn-close" @click="removeSelectedCity(index)">
						<!-- <i class="d_icon d_icon-close"></i> -->
						<img src="../../assets/images/icons/close.svg" alt="" />
					</div>
				</div>
				<!-- <div
					class="shopping-kenost__cityone-date mb-3"
					:class="{
						error: v$.citiesDates.$errors.length,
					}"
					v-if="item"
				> -->
					<p class="k-mini-text">Дата отгрузки</p>
					<CalendarVue v-model="citiesDates[item.value]" showIcon id="calendar-24h" />

					<!-- <span class="error_desc" v-for="error of v$.citiesDates.$errors" :key="error.$uid">
						{{ error.$message }}
					</span> -->
				<!-- </div> -->

			</li>
		</template>
	</draggable>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { helpers } from "@vuelidate/validators";
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
	},
	emits: ["update:modelCities", "update:modelCitiesDates"],
	data() {
		return {
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
	setup() {
		return {
			v$: useVuelidate(),
		};
	},
	validations() {
		return {
			citiesDates: {
				required: helpers.withMessage("Выберите дату отгрузки", () => {
					let result = true;
					Object.keys(this.citiesDates).forEach((key) => {
						if (!this.citiesDates[key]) {
							result = false;
							return;
						}
					});
					console.log(result);
					return result;
				}),
			},
		};
	},
};
</script>

<style lang="scss" scoped></style>
