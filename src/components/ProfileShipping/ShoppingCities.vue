<template>
	<div class="shopping-kenost__citys" v-if="this.cities">
		<div
			class="shopping-kenost__cityone"
			v-for="(item, index) in this.cities"
			:key="index"
		>
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
	</div>
</template>

<script>
import CalendarVue from "primevue/calendar";

export default {
	name: "ShoppingCities",
	props: {
		cities: {
			type: Array,
			default: [],
		},
		modelCitiesDates: {
			type: Object,
			default: {},
		},
	},
	emits: ["update:modelCitiesDates"],
	data() {
		return {
			citiesDates: {},
		};
	},
	components: {
		CalendarVue,
	},
	methods: {
		removeSelectedCity(index) {
			this.$emit("removeSelectedCity", index);
		},
	},
	watch: {
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
