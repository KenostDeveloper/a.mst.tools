<template>
    <div class="std-auth__input-container">
        <Autocomplete
            v-model="address"
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
        modelValue: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            address: this.modelValue,
            coordindates: ''
        };
    },
    components: {
        Autocomplete,
        Map
    },
    methods: {
        setSelection(address) {
            this.$emit('update:modelValue', address?.value);
            this.setCoordinates();
        },
        async setCoordinates() {
            console.log(this.address);
            if(!this.address) return;

            const addressForSearch = this.address?.split(' ').join('+');

            const response = await axios.get(
                `https://geocode-maps.yandex.ru/1.x/?apikey=9cc9371c-b0ef-422b-b0be-2b1d49e32386&geocode=${addressForSearch}&format=json`
            );

            console.log("Response", response.data, response.data?.response?.GeoObjectCollection?.featureMember[0]?.GeoObject?.Point?.pos);

            if (response.status !== 200) return;

            this.coordinates = response.data?.response?.GeoObjectCollection?.featureMember[0]?.GeoObject?.Point?.pos;
            this.updateCoordinates(response.data);
        },
        updateCoordinates(coordinates) {
            this.$refs.mapRef?.updateCoordinates(coordinates);
        },
    },
    mounted() {
        this.setCoordinates();
    },
    watch: {
        modelValue: {
            handler(newVal) {
                this.address = newVal;
            },
            deep: true
        },
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
