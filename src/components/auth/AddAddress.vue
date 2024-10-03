<template>
    <div class="std-auth__input-container">
        <Autocomplete
            v-model="this.address.value"
            placeholder="Адрес доставки"
            name="address"
            class="dart-form-control std-auth__input"
            :class="inputClasses"
            type="address"
            selectionType="single"
            required
            @setSelection="setSelection" />
        <Map ref="mapRef" class="std-auth__map" v-model="this.address.value" :coordinates="coordinates" @setMapAddress="mapAddress = $event" />
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
            type: Object,
            default: {}
        },
        inputClasses: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            address: this.modelValue,
            mapAddress: this.modelValue,
            coordindates: ''
        };
    },
    components: {
        Autocomplete,
        Map
    },
    methods: {
        setSelection(address) {
            this.$emit('update:modelValue', address);
            this.setCoordinates();
        },
        async setCoordinates() {
            if(!this.address?.value) return;

            const addressForSearch = this.address?.value?.split(' ').join('+');

            const response = await axios.get(
                `https://geocode-maps.yandex.ru/1.x/?apikey=9cc9371c-b0ef-422b-b0be-2b1d49e32386&geocode=${addressForSearch}&format=json`
            );

            if (response.status !== 200) return;

            this.coordinates = response.data?.response?.GeoObjectCollection?.featureMember[0]?.GeoObject?.Point?.pos?.split(' ');
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
        // mapAddress: {
        //     handler(newVal) {
        //         this.$emit('update:modelValue', { ...this.modelValue, value: newVal });
        //     },
        //     deep: true
        // }
    }
};
</script>

<style lang="scss" scoped></style>
