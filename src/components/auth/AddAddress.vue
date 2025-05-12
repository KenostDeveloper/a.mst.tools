<template>
    <div class="std-auth__input-container" :class="{ 'has-error': $v.address.value.$error }">
        <Autocomplete
            v-model="address.value"
            placeholder="Адрес доставки"
            name="address"
            class="dart-form-control std-auth__input"
            type="address"
            selectionType="single"
            @setSelection="setSelection" />
        <div v-if="$v.address.value.$error" class="error-message">
            <span v-if="!$v.address.value.required">Пожалуйста, введите адрес.</span>
            <span v-else-if="$v.address.value.minLength">Пожалуйста, введите адрес.</span>
        </div>
        <Map ref="mapRef" class="std-auth__map" v-model="address.value" :coordinates="coordinates" @setMapAddress="mapAddress = $event" />
    </div>
</template>

<script>
import axios from 'axios';
import Autocomplete from '../Autocomplete.vue';
import Map from '../Map/Map.vue';
import { required, minLength } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';

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
        },
        value: {

        }
    },
    data() {
        return {
            address: this.modelValue || { value: '' }, // Инициализация, если modelValue отсутствует
            mapAddress: this.modelValue || { value: '' },
            coordinates: ''
        };
    },
    setup() {
        return { $v: useVuelidate() };
    },
    validations() {
        return {
            address: {
                value: {
                    required,
                    minLength: minLength(5)
                }
            }
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
        async getAddress(address) {
            const response = await axios.post(
                'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address',
                {
                    query: address?.value
                },
                {
                    headers: {
                        Authorization: 'Token 57e34da6a00a320cbf9cb7b3f9fe2d51bdcbf9e5'
                    }
                }
            );

            const firstAddress = await response?.data?.suggestions[0];
            this.$emit('update:modelValue', firstAddress);
        }
    },
    mounted() {
        setTimeout(() => this.setCoordinates(), 500)        
    },
    watch: {
        mapAddress: {
            handler(newVal) {
                if (newVal) this.getAddress(newVal);
            }
        }
    }
};
</script>

<style lang="scss" scoped></style>
