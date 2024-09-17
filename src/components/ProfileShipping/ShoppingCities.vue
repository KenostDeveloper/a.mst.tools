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
					<div class="btn btn-close" @click="removeSelectedCity(index)">
						<img src="../../assets/images/icons/close.svg" alt="" />
					</div>
				</div>
					<p class="k-mini-text">Дата отгрузки</p>
					<CalendarVue v-model="citiesDates[item.value]" showIcon id="calendar-24h" />
			</li>
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
	}
};
</script>

<style lang="scss" scoped></style>
