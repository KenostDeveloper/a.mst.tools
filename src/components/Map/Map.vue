<template>
	<YandexMap ref="yandexMap" :settings="{
		location: {
			center: yandexMapCoords,
			zoom: 12
		},
		theme: 'dark',
		showScaleInCopyrights: true
	}" width="100%" height="100%">
		<YandexMapDefaultSchemeLayer />
		<YandexMapDefaultFeaturesLayer />

		<YandexMapMarker @click.stop v-model="defaultMarker" :settings="{
			draggable: true,
			coordinates: defaultMarker ? defaultMarker.coordinates : [37.617644, 55.755819],
			onDragEnd
		}">
			<MapMarker :text="address?.value" />
		</YandexMapMarker>

		<YandexMapListener :settings="{
			onClick
		}" />
	</YandexMap>
</template>

<script lang="js" setup>
import {
	YandexMap,
	YandexMapDefaultSchemeLayer,
	YandexMapDefaultFeaturesLayer,
	YandexMapListener,
	YandexMapMarker,
} from "vue-yandex-maps";
import { ref, shallowRef, triggerRef, watch } from "vue";
import axios from "axios";
import MapMarker from './MapMarker.vue';

const props = defineProps({
	modelValue: Object,
	companyIndex: Number,
	coordinates: Object,
});

const emit = defineEmits(["updateStoreData", "refreshStoreData", 'update:modelValue']);

const yandexMapCoords = ref([37.617644, 55.755819]);
const defaultMarker = shallowRef(null);

let address = ref(props.modelValue);
let timer = ref({});

watch(() => props.modelValue,
	async (newValue) => {
		// console.log("Map address: ", newValue)
		address.value = newValue;
	},
	{
		deep: true
	}
);

const onDragEnd = () => {
	triggerRef(defaultMarker);
	refreshGeo();
};

const onClick = (object, event) => {
	defaultMarker.value?.update({
		coordinates: event.coordinates,
	});
	refreshGeo();
};

const updateCoordinates = (coordinates) => {
	defaultMarker.value?.update({
		coordinates: coordinates
			? [
				+coordinates.response?.GeoObjectCollection?.featureMember?.[0]?.GeoObject?.Point?.pos?.split(
					" "
				)[0],
				+coordinates.response?.GeoObjectCollection?.featureMember?.[0]?.GeoObject?.Point?.pos?.split(
					" "
				)[1],
			]
			: [37.617644, 55.755819],
	});

	yandexMapCoords.value = defaultMarker.value?.coordinates;
	// refreshGeo();
};

defineExpose({
	updateCoordinates,
});

const refreshGeo = async () => {
	const response = await axios.get("https://geocode-maps.yandex.ru/1.x/", {
		params: {
			apikey: import.meta.env.VITE_YANDEX_API_KEY,
			geocode:
				defaultMarker.value?.coordinates[0].toString() +
				"," +
				defaultMarker.value?.coordinates[1].toString(),
			format: "json",
			results: 1,
		},
	});

	if (response.status !== 200) return;

	address.value.value =
		response.data.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.text;
	// console.log("Map data: ", address.value);
	emit('update:modelValue', address.value);
};

const debounce = (func, delay) => {
	clearTimeout(timer.value);
	timer.value = setTimeout(func, delay);
};
</script>

<style lang="scss" scoped></style>
