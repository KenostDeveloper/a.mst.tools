<script>
import axios from 'axios';
import Autocomplete from '../Autocomplete.vue';
import Map from '../Map/Map.vue';
import { required, minLength } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import Modal from '../ui/Modal.vue';

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
            type: String,
            default: ''
        }
    },
    data() {
        return {
            address: this.modelValue || { value: '' },
            mapAddress: this.modelValue || { value: '' },
            coordinates: '',
            showModal: false,
            preAddress: '',
            preMapAddress: this.modelValue || { value: '' },
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
        Map,
        Modal,
    },
    methods: {
        setSelection(address) {
            this.$emit('update:modelValue', address);
            this.setCoordinates();
        },
        setPreSelection(address) {
            this.preMapAddress = address;
            this.preAddress = address?.value || '';
            this.setCoordinates(true);
        },
        acceptAddress() {
            this.address = this.preMapAddress;
            this.$emit('update:modelValue', this.preMapAddress);
            this.setCoordinates();
            this.showModal = false;
        },
        async setCoordinates(isPre = false) {
            if (!isPre && !this.address?.value) return;
            if (isPre && !this.preMapAddress?.value) return;

            const addressForSearch = isPre ? this.preMapAddress?.value?.split(' ').join('+') : this.address?.value?.split(' ').join('+');

            const response = await axios.get(
                `https://geocode-maps.yandex.ru/1.x/`,
                {
                    params: {
                        apikey: import.meta.env.VITE_YANDEX_API_KEY,
                        geocode: addressForSearch,
                        format: 'json'
                    }
                }
            );

            if (response.status !== 200) return;

            this.coordinates = response.data?.response?.GeoObjectCollection?.featureMember[0]?.GeoObject?.Point?.pos?.split(' ');
            this.updateCoordinates(response.data, isPre);
        },
        updateCoordinates(coordinates, isPre = false) {
            if (!isPre) {
                this.$refs.mapRef?.updateCoordinates(coordinates);
            } else {
                this.$refs.preMapRef?.updateCoordinates(coordinates);
            }
        },
        async getAddress(address) {
            const response = await axios.post(
                'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address',
                {
                    query: address?.value
                },
                {
                    headers: {
                        Authorization: `Token ${import.meta.env.DADATA_API_KEY}`
                    }
                }
            );

            const firstAddress = await response?.data?.suggestions[0];
            this.$emit('update:modelValue', firstAddress);
        }
    },
    watch: {
        mapAddress: {
            handler(newVal) {
                if (newVal) this.getAddress(newVal);
            }
        },
        modelValue: {
            handler(newVal) {
                this.address = newVal;
                this.setCoordinates();

                this.preMapAddress = newVal;
                this.setCoordinates(true);
            },
            deep: true,
        }
    }
};
</script>

<template>
    <div class="address-map__wrapper" :class="{ 'has-error': $v.address.value.$error }">
        <Autocomplete v-model="address.value" placeholder="Адрес доставки" name="address" type="address"
            selectionType="single" @setSelection="setSelection" />
        <div v-if="$v.address.value.$error" class="error-message">
            <span v-if="!$v.address.value.required">Пожалуйста, введите адрес.</span>
            <span v-else-if="$v.address.value.minLength">Пожалуйста, введите адрес.</span>
        </div>
        <div class="address-map">
            <Map ref="mapRef" v-model="address" :coordinates="coordinates" @setMapAddress="mapAddress = $event" />

            <button type="button" class="d-window-button address-map__button" @click="showModal = true">
                <i class="d-icon-window d-window-button__icon"></i>
            </button>
        </div>
    </div>

    <teleport to='body'>
        <Modal class="registration-address" :isActive="showModal" @close="showModal = false">
            <div class="registration-address__header">
                <i class="d-icon-location registration-address__icon"></i>
                <p class="d-modal__title">Выберите адрес доставки</p>
            </div>
            <div class="registration-address__map">
                <Map ref="preMapRef" v-model="preMapAddress" :coordinates="coordinates"
                    @setMapAddress="preMapAddress = $event" />
            </div>
            <Autocomplete v-model="preAddress" type="address" inputType="search" selectionType="single"
                placeholder="Адрес доставки" name="address" @setSelection="setPreSelection" />

            <p class="registration-address__address">{{ preMapAddress?.value }}</p>

            <div class="registration-address__buttons">
                <button type="button" class="d-button d-button-secondary d-button-secondary-small box-shadow-none"
                    @click="showModal = false">Отмена</button>
                <button type="button" class="d-button d-button-primary d-button-primary-small box-shadow-none"
                    @click="acceptAddress">Выбрать</button>
            </div>
        </Modal>
    </teleport>
</template>

<style lang="scss" scoped></style>
