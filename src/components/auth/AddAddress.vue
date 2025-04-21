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
            address: '',
            mapAddress: this.modelValue || { value: '' },
            coordinates: '',
            showModal: false,
            preAddress: '',
            preMapAddress: this.modelValue || { value: '' },
            preCoordinates: '',
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
        async setSelection(address) {
            console.log("Selected address: ", address);
            this.mapAddress = address;
            this.address = address?.value || '';
            this.$emit('update:modelValue', address);
            await this.setCoordinates();
            this.$refs.mapRef?.refreshMapCenter();
        },
        async setPreSelection(address) {
            this.preMapAddress = address;
            this.preAddress = address?.value || '';
            await this.setCoordinates(true);
            this.$refs.preMapRef?.refreshMapCenter();
        },
        acceptAddress() {
            this.address = this.preMapAddress?.value;
            this.mapAddress = this.preMapAddress;
            this.$emit('update:modelValue', this.preMapAddress);
            this.setCoordinates();
            this.$refs.mapRef?.refreshMapCenter();
            this.showModal = false;
        },
        async setCoordinates(isPre = false) {
            if (!isPre && !this.mapAddress?.value) return;
            if (isPre && !this.preMapAddress?.value) return;

            const addressForSearch = isPre ? this.preMapAddress?.value?.split(' ').join('+') : this.mapAddress?.value?.split(' ').join('+');

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

            if (!isPre) this.coordinates = response.data?.response?.GeoObjectCollection?.featureMember[0]?.GeoObject?.Point?.pos?.split(' ');
            else this.preCoordinates = response.data?.response?.GeoObjectCollection?.featureMember[0]?.GeoObject?.Point?.pos?.split(' ');

            this.updateCoordinates(isPre);
        },
        updateCoordinates(isPre = false) {
            if (!isPre) {
                this.$refs.mapRef?.updateMarkerCoordinates(this.coordinates);
            } else {
                this.$refs.preMapRef?.updateMarkerCoordinates(this.preCoordinates);
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
                        Authorization: `Token ${import.meta.env.VITE_DADATA_API_KEY}`
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
                this.address = newVal?.value;
            },
            deep: true
        },
        modelValue: {
            handler(newVal) {
                this.address = newVal?.value;
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
        <Autocomplete v-model="address"
            :errorText="$v.address.value.$error && (!$v.address.value.required ? 'Пожалуйста, введите адрес.' : $v.address.value.minLength ? 'Пожалуйста, введите адрес.' : '')"
            placeholder="Адрес доставки" name="address" type="address" selectionType="single"
            @setSelection="setSelection" />
        <div class="address-map">
            <Map ref="mapRef" v-model="mapAddress" :coordinates="coordinates" />

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
                <Map ref="preMapRef" v-model="preMapAddress" :coordinates="preCoordinates" />
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
