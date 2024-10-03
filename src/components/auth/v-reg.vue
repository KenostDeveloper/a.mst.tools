<template>
    <div class="analytics_auth analytics_reg">
        <form class="form-signin form-signup" @submit.prevent="formSubmit">
            <Toast />
            <div class="logo text-center">
                <img src="../../assets/images/logo.svg" alt="" width="200" />
            </div>

            <div class="std-auth__input-container">
                <input type="text" name="username" class="dart-form-control std-auth__input" placeholder="Логин" required v-model="form.login" />
                <input
                    type="password"
                    name="password"
                    class="dart-form-control std-auth__input"
                    placeholder="Пароль"
                    required
                    v-model="form.password" />
                <input
                    type="password"
                    name="passwordConfirm"
                    class="dart-form-control std-auth__input"
                    placeholder="Подтвердите пароль"
                    required
                    v-model="form.passwordConfirm" />
            </div>

            <div class="std-auth__input-container-wrapper">
                <span class="std-auth__input-label">Данные контактного лица</span>

                <div class="std-auth__input-container">
                    <input
                        type="text"
                        name="login"
                        class="dart-form-control std-auth__input"
                        placeholder="ФИО контактного лица"
                        required
                        v-model="form.login" />
                    <input
                        v-imask="mask"
                        type="tel"
                        name="telephone"
                        class="dart-form-control std-auth__input"
                        placeholder="Телефон"
                        required
                        v-model="form.telephone" />
                    <input type="email" name="email" class="dart-form-control std-auth__input" placeholder="Email" required v-model="form.email" />
                </div>
            </div>

            <div class="std-auth__input-container-wrapper">
                <span class="std-auth__input-label">Данные компании</span>

                <div class="std-auth__input-container">
                    <input
                        type="text"
                        name="org_name"
                        class="dart-form-control std-auth__input"
                        placeholder="Наименование организации"
                        required
                        v-model="form.org.value" />
                    <!-- <input type="text" name="inn" class="dart-form-control std-auth__input" placeholder="ИНН" required v-model="form.inn" /> -->
                    <Autocomplete
                        name="inn"
                        class="dart-form-control std-auth__input"
                        type="company"
                        selectionType="single"
                        placeholder="ИНН"
                        required
                        v-model="form.inn"
                        @setSelection="setCompany" />
                    <AddAddress
                        v-for="(address, index) in form.delivery_addresses"
                        :key="address"
                        :index="index"
                        v-model="form.delivery_addresses[index]"
                    />
                    <button
                        class="dart-btn dart-btn-secondary dart-btn-block align-items-center flex justify-content-center std-auth__button std-auth__button--secondary"
                        :disabled="this.loading"
                        type="button"
                        @click="() => this.form.delivery_addresses.push({ value: '' })">
                        <i v-if="this.loading" class="pi pi-spin pi-spinner" style="font-size: 14px"></i>
                        <span>Добавить адрес</span>
                        <i class="pi pi-plus"></i>
                    </button>
                </div>
            </div>

            <div class="std-auth__button-container">
                <button
                    class="dart-btn dart-btn-primary dart-btn-block align-items-center flex justify-content-center std-auth__button"
                    :disabled="this.loading"
                    type="submit">
                    <i v-if="this.loading" class="pi pi-spin pi-spinner" style="font-size: 14px"></i>
                    <span>Зарегистрироваться</span>
                </button>
                <button
                    class="dart-btn dart-btn-secondary dart-btn-block align-items-center flex justify-content-center std-auth__button std-auth__button--secondary"
                    type="button"
                    @click="this.setRegForm">
                    <span>Войти</span>
                </button>
            </div>

            <div class="form-signin__copy">
                <span>© MST, {{ getYear }}.</span>
            </div>
        </form>
    </div>
</template>

<script>
import Autocomplete from '../Autocomplete.vue';
import AddAddress from './AddAddress.vue';
import { IMaskDirective } from 'vue-imask';

export default {
    name: 'reg-form',
    data() {
        return {
            form: {
                login: '',
                password: '',
                passwordConfirm: '',
                login: '',
                telephone: '',
                email: '',
                org: {},
                inn: '',
                delivery_addresses: [{ value: '' }]
            },
            mask: {
                mask: "+{7} (000) 000-00-00",
                lazy: false
            }
        };
    },
    components: {
        Autocomplete,
        AddAddress
    },
    methods: {
        formSubmit() {},
        setRegForm() {
            this.$emit('setRegForm', false);
        },
        setCompany(company) {
            this.form.org = company;
        },
        setDeliveryAddress(index, address) {
            this.form.delivery_addresses[index] = address;
        }
    },
    computed: {
        getYear() {
            return new Date().getFullYear();
        }
    },
    directives: {
        imask: IMaskDirective
    }
};
</script>
