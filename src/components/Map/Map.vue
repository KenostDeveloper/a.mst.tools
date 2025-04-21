<template>
	<YandexMap ref="yandexMap" v-model="map" :settings="mapSettings" width="100%" height="100%">
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
import { ref, shallowRef, computed } from "vue";
import axios from "axios";
import MapMarker from './MapMarker.vue';

const props = defineProps({
	modelValue: Object,
});

const emit = defineEmits(["updateStoreData", "refreshStoreData", 'update:modelValue']);

const INITIAL_COORDS = [37.617644, 55.755819];
const INITIAL_ZOOM = 12;

const defaultMarker = shallowRef({
	coordinates: props.modelValue?.coords ?? INITIAL_COORDS
});
const map = shallowRef(null);
const address = ref(props.modelValue);
const currentZoom = ref(INITIAL_ZOOM);

const mapSettings = computed(() => ({
	location: {
		center: defaultMarker.value.coordinates,
		zoom: INITIAL_ZOOM
	},
	theme: "dark",
	showScaleInCopyrights: true
}));

// onMounted(async () => {
// 	map.value?.events.add("boundschange", (e) => {
// 		console.log(e);
// 		const oldZoom = e.get("oldZoom");
// 		const newZoom = e.get("newZoom");
// 		if (oldZoom !== newZoom) {
// 			currentZoom.value = newZoom;
// 		}
// 	});
// });

const onDragEnd = async (e) => {
	defaultMarker.value?.update({
		coordinates: e
	})
	await refreshGeo(e);
};

const onClick = async (object, event) => {
	const coords = event.coordinates;
	defaultMarker.value?.update({
		coordinates: coords,
	});
	await refreshGeo(coords);
};

const updateMarkerCoordinates = (coordinates) => {
	// TODO: убрать обновление координат маркера при его перетаскивании или при клике на карту
	// TODO: Значение зума не сохраняется
	defaultMarker.value?.update({
		coordinates: coordinates ?? defaultMarker.value?.coordinates ?? [37.617644, 55.755819],
	});
};

const refreshMapCenter = () => {
	const coords = defaultMarker.value?.coordinates ?? [37.617644, 55.755819];
	map.value?.update({
		location: {
			center: coords,
		}
	});
}

defineExpose({
	updateMarkerCoordinates,
	refreshMapCenter
});

const refreshGeo = async (coordinates) => {
	const response = await axios.get("https://geocode-maps.yandex.ru/1.x/", {
		params: {
			apikey: import.meta.env.VITE_YANDEX_API_KEY,
			geocode: coordinates.join(","),
			format: "json",
			results: 1,
		},
	});

	if (response.status !== 200) return;

	address.value.value =
		response.data.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.text;
	emit('update:modelValue', address.value);
};
</script>

<style lang="scss" scoped></style>
