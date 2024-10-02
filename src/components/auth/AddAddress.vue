<template>
    <div class="std-auth__input-container">
        <Autocomplete
            v-model="this.address.value"
            placeholder="Адрес доставки"
            name="address"
            class="dart-form-control std-auth__input"
            type="address"
            selectionType="single"
            required
            @setSelection="setSelection" />
        <Map ref="mapRef" class="std-auth__map" v-model="address" :coordinates="coordinates" />
    </div>
</template>

<script>
import axios from 'axios';
import Autocomplete from '../Autocomplete.vue';
import Map from '../Map/Map.vue';

export default {
    name: 'AddAddress',
    props: {
        deliveryAddress: {
            type: Object,
            default: {}
        }
    },
    data() {
        return {
            address: {},
            coordindates: ''
        };
    },
    components: {
        Autocomplete,
        Map
    },
    methods: {
        setSelection(address) {
            this.$emit('setDeliveryAddress', address);
            this.setCoordinates();
        },
        async setCoordinates() {
            const addressForSearch = this.deliveryAddress?.value?.split(' ').join('+');

            const response = await axios.get(
                `https://geocode-maps.yandex.ru/1.x/?apikey=9cc9371c-b0ef-422b-b0be-2b1d49e32386&geocode=${addressForSearch}&format=json`
            );

            if (response.status !== 200) return;

            this.coordinates = response.data;
            this.updateCoordinates(response.data);
        },
        updateCoordinates(coordinates) {
            this.$refs.mapRef?.updateCoordinates(coordinates);
        },
    },
    watch: {
        address: {
            handler(newVal) {
                this.$emit('setDeliveryAddress', newVal);
            },
            deep: true
        }
    }
};
</script>

<style lang="scss" scoped></style>
