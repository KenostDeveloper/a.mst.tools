<template>
	<draggable
		v-if="this.cities"
		v-model="this.cities"
		item-key="id"
		class="shopping-kenost__citys"
	>
		<template #item="{ element: item, index }">
			<div class="shopping-kenost__cityone">
				<div class="shopping-kenost__cityone-name" v-if="item">
					<!-- <p>{{ item.value }}</p> -->
					<p>{{ item }}</p>
					<div class="btn btn-close" @click="removeSelectedCity(index)">
						<!-- <i class="d_icon d_icon-close"></i> -->
						<img src="../../assets/images/icons/close.svg" alt="" />
					</div>
				</div>
				<div class="shopping-kenost__cityone-date mb-3" v-if="item">
					<p class="k-mini-text">Дата отгрузки</p>
					<CalendarVue
						v-model="citiesDates[item]"
						showIcon
						id="calendar-24h"
						showTime
						hourFormat="24"
					/>
				</div>
			</div>
		</template>
	</draggable>
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
	},
	emits: ["update:modelCities", "update:modelCitiesDates"],
	data() {
		return {
			cities: this.modelCities,
			citiesDates: {},
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
};
</script>

<style lang="scss" scoped></style>
