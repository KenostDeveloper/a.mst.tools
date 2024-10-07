<template>
    <div class="analytics_auth analytics_reg">
        <form class="form-signup" @submit.prevent="formSubmit">
            <Toast />
            <div class="logo text-center">
                <img src="../../assets/images/logo.svg" alt="" width="200" />
            </div>

            <div class="std-auth__input-container">
                <input type="text" id="login" class="dart-form-control std-auth__input" placeholder="Логин" required v-model="form.login" autocomplete="off" />
                <input
                    type="password"
                    name="password"
                    class="dart-form-control std-auth__input"
                    placeholder="Пароль"
                    required
                    v-model="form.password"
                    autocomplete="off" />
                <input
                    type="password"
                    name="passwordConfirm"
                    class="dart-form-control std-auth__input"
                    placeholder="Подтверждение пароля"
                    required
                    v-model="form.passwordConfirm"
                    autocomplete="off" />
            </div>

            <div class="std-auth__input-container-wrapper">
                <span class="std-auth__input-label">Данные контактного лица</span>

                <div class="std-auth__input-container">
                    <input
                        type="text"
                        name="name"
                        class="dart-form-control std-auth__input"
                        placeholder="ФИО контактного лица"
                        required
                        v-model="form.name"
                        autocomplete="off" />
                    <input
                        ref="telephone"
                        v-imask="mask"
                        type="tel"
                        name="telephone"
                        class="dart-form-control std-auth__input"
                        placeholder="Телефон"
                        required
                        autocomplete="off"
                        @complete="(e) => { this.form.telephone = e.detail.unmaskedValue }" />
                    <input
                        type="email"
                        name="email"
                        class="dart-form-control std-auth__input"
                        placeholder="Email"
                        required
                        v-model="form.email"
                        autocomplete="off" />
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
                        v-model="form.org.name"
                        autocomplete="off" />
                    <!-- <input type="text" name="inn" class="dart-form-control std-auth__input" placeholder="ИНН" required v-model="form.inn" /> -->
                    <Autocomplete
                        name="inn"
                        class="dart-form-control std-auth__input"
                        type="company"
                        selectionType="single"
                        placeholder="ИНН"
                        required
                        v-model="form.org.inn"
                        @setSelection="setCompany" />
                    <AddAddress
                        v-for="(address, index) in form.delivery_addresses"
                        :key="address"
                        :index="index"
                        v-model="form.delivery_addresses[index]" />
                    <div class="std-auth__actions-container">
                        <button
                            v-if="form.delivery_addresses.length > 1"
                            class="dart-btn dart-btn-secondary dart-btn-block align-items-center flex justify-content-center std-auth__button std-auth__button--secondary"
                            type="button"
                            @click="() => this.form.delivery_addresses.pop()">
                            <span>Удалить</span>
                        </button>
                        <button
                            class="dart-btn dart-btn-secondary dart-btn-block align-items-center flex justify-content-center std-auth__button std-auth__button--secondary"
                            type="button"
                            @click="() => this.form.delivery_addresses.push({ value: '' })">
                            <span>Добавить адрес</span>
                            <i class="pi pi-plus"></i>
                        </button>
                    </div>
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
import InputText from 'primevue/inputtext';
import AddAddress from './AddAddress.vue';
import { IMaskDirective } from 'vue-imask';
import Toast from 'primevue/toast';
import { sendMetrik } from '../../utils/metrika';
import FloatLabel from 'primevue/floatlabel';

export default {
    name: 'reg-form',
    data() {
        return {
            loading: false,
            form: {
                login: '',
                password: '',
                passwordConfirm: '',
                login: '',
                telephone: '',
                email: '',
                org: {
                    name: '',
                    inn: ''
                },
                delivery_addresses: [{ value: '' }]
            },
            mask: {
                mask: '+{7} (000) 000-00-00',
                lazy: false
            }
        };
    },
    components: {
        Autocomplete,
        AddAddress,
        Toast,
        FloatLabel,
        InputText
    },
    methods: {
        sendMetrik: sendMetrik,
        formSubmit() {
            console.log(this.$refs.telephone);

            if (this.form.password === this.form.passwordConfirm) {
                // this.sendMetrik('register');
                // this.loading = true;
                this.$load(async () => {
                    const data = await this.$api.auth.register(this.form);
                    if (data) {
                        console.log(data);
                        if (data === 'technical error') {
                            this.$toast.add({ severity: 'error', summary: 'Техническая ошибка', detail: 'Попробуйте позже.', life: 3000 });
                        } else {
                            if (!data.success) {
                                this.$toast.add({ severity: 'error', summary: 'Ошибка!', detail: data.data.message, life: 3000 });
                            }
                        }
                        this.loading = false;
                    }
                });
            } else {
                this.$toast.add({ severity: 'info', summary: 'Пароли не совпадают', detail: 'Проверьте правильно ли введен пароль', life: 3000 });
            }
        },
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
