<template>
	<div class="shopping-kenost__citys" v-if="this.cities">
		<div class="shopping-kenost__cityone" v-for="(item, index) in this.cities" :key="index">
			<div class="shopping-kenost__cityone-name" v-if="item">
				<p>{{ item }}</p>
				<div class="btn btn-close" @click="removeSelectedCity(index)">
					<!-- <i class="d_icon d_icon-close"></i> -->
					<img src="../../assets/images/icons/close.svg" alt="" />
				</div>
			</div>
			<div class="shopping-kenost__cityone-date mb-3" v-if="item">
				<p class="k-mini-text">Дата и время окончания приема заказов</p>
				<CalendarVue
					v-model="citiesDates[index]"
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
			type: Array,
			default: [],
		},
	},
	data() {
		return {
			citiesDates: [],
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
