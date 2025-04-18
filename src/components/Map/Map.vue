<template>
	<YandexMap ref="yandexMap" v-model="map" :settings="{
		location: {
			center: yandexMapCoords,
			zoom: 14
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
			onActionStart: createEvent('behavior', true),
			onActionEnd: createEvent('behavior', false),
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
import { ref, shallowRef, triggerRef, watch, reactive } from "vue";
import axios from "axios";
import MapMarker from './MapMarker.vue';

const props = defineProps({
	modelValue: Object,
	companyIndex: Number,
	coordinates: Object,
});

const emit = defineEmits(["updateStoreData", "refreshStoreData", 'update:modelValue']);

const BEHAVIOR = ['scrollZoom'];
const events = reactive({
	behavior: {
		scrollZoom: false,
	},
})

const yandexMapCoords = ref([37.617644, 55.755819]);
const currentZoom = ref(12);
const defaultMarker = shallowRef(null);
const map = shallowRef(null);

let address = ref(props.modelValue);

watch(() => props.modelValue,
	async (newValue) => {
		address.value = newValue;
		yandexMapCoords.value = defaultMarker.value?.coordinates;
		refreshCenter();
		// await refreshGeo();
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
	// TODO: убрать обновление координат маркера при его перетаскивании или при клике на карту
	// TODO: Значение зума не сохраняется
	defaultMarker.value?.update({
		coordinates: coordinates ?? defaultMarker.value?.coordinates ?? [37.617644, 55.755819],
	});
};

const refreshCenter = () => {
	yandexMapCoords.value = defaultMarker.value?.coordinates;
}

defineExpose({
	updateCoordinates,
	refreshCenter
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
	emit('update:modelValue', address.value);

	if (map.value) {
		map.value.setLocation({
			zoom: currentZoom.value,
			// center: defaultMarker.value?.coordinates
		})
	}
};

const createEvent = (category, type) => {
	const eventState = events[category];

	if (typeof type !== 'boolean') {
		const endEvent = debounce(() => {
			eventState[type] = false;
		}, 250);

		return (object, event) => {
			console.log(`${type} Object: `, object, `\n`, `${type} Event: `, event);

			eventState[type] = true;
			endEvent();
		};
	}
	return (object) => {
		// console.log(`${type ? 'actionStart' : 'actionEnd'} Object:`, object);
		if (!(object.type in events.behavior)) return;
		eventState[object.type] = type;

		currentZoom.value = object?.location?.zoom;
	};
};
</script>

<style lang="scss" scoped></style>
