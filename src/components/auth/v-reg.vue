<template>
    <div class="analytics_auth analytics_reg">
        <form class="form-signup" @submit.prevent="formSubmit">
            <Toast />
            <div class="logo text-center">
                <img src="../../assets/images/logo.svg" alt="" width="200" />
            </div>

            <div v-if="!this.regIsSuccess" class="std-auth__input-container">
                <FloatLabel>
                    <input
                        ref="loginInput"
                        type="text"
                        id="login"
                        placeholder="Логин"
                        class="dart-form-control std-auth__input"
                        required
                        v-model="form.login"
                        autocomplete="off" />
                    <!-- <label for="login" class="std-auth__input-label">Логин</label> -->
                </FloatLabel>
                <FloatLabel>
                    <input
                        ref="passwordInput"
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Пароль"
                        class="dart-form-control std-auth__input"
                        required
                        v-model="form.password"
                        autocomplete="off" />
                    <!-- <label for="password" class="std-auth__input-label">Пароль</label> -->
                </FloatLabel>
                <FloatLabel>
                    <input
                        type="password"
                        name="passwordConfirm"
                        id="passwordConfirm"
                        placeholder="Подтверждение пароля"
                        class="dart-form-control std-auth__input"
                        required
                        v-model="form.passwordConfirm"
                        autocomplete="off" />
                    <!-- <label for="passwordConfirm" class="std-auth__input-label">Подтверждение пароля</label> -->
                </FloatLabel>
            </div>

            <div v-if="!this.regIsSuccess" class="std-auth__input-container-wrapper">
                <span class="std-auth__input-label">Данные контактного лица</span>

                <div class="std-auth__input-container">
                    <!-- <FloatLabel> -->
                    <input
                        type="text"
                        id="name"
                        placeholder="ФИО контактного лица"
                        class="dart-form-control std-auth__input"
                        required
                        v-model="form.name"
                        autocomplete="off" />
                    <!-- <label for="name" class="std-auth__input-label">ФИО контактного лица</label> -->
                    <!-- </FloatLabel> -->
                    <input
                        v-imask="mask"
                        type="tel"
                        name="telephone"
                        id="telephone"
                        placeholder="Телефон"
                        class="dart-form-control std-auth__input"
                        required
                        autocomplete="off"
                        @complete="
                            (e) => {
                                this.form.telephone = e.detail.unmaskedValue;
                            }
                        " />
                    <!-- <FloatLabel> -->
                    <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Email"
                        class="dart-form-control std-auth__input"
                        required
                        v-model="form.email"
                        autocomplete="off" />
                    <!-- <label for="email" class="std-auth__input-label">Email</label> -->
                    <!-- </FloatLabel> -->
                </div>
            </div>

            <div v-if="!this.regIsSuccess" class="std-auth__input-container-wrapper">
                <span class="std-auth__input-label">Данные компании</span>

                <div class="std-auth__input-container">
                    <!-- <FloatLabel> -->
                    <input
                        type="text"
                        name="org_name"
                        id="org_name"
                        placeholder="Наименование организации"
                        class="dart-form-control std-auth__input"
                        required
                        v-model="form.org.name"
                        autocomplete="off" />
                    <!-- <label for="org_name" class="std-auth__input-label">Наименование организации</label> -->
                    <!-- </FloatLabel> -->
                    <FloatLabel>
                        <Autocomplete
                            ref="innInput"
                            name="inn"
                            id="inn"
                            placeholder="ИНН"
                            class="dart-form-control std-auth__input"
                            type="company"
                            selectionType="single"
                            required
                            v-model="form.org.inn"
                            @setSelection="setCompany" />
                        <!-- <label for="inn" class="std-auth__input-label">ИНН</label> -->
                    </FloatLabel>
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
                    v-if="!this.regIsSuccess"
                    class="dart-btn dart-btn-primary dart-btn-block align-items-center flex justify-content-center std-auth__button"
                    :disabled="this.loading"
                    type="submit">
                    <i v-if="this.loading" class="pi pi-spin pi-spinner" style="font-size: 14px"></i>
                    <span>Зарегистрироваться</span>
                </button>
                <span v-if="this.regIsSuccess" class="std-auth__span">Регистрация прошла успешно!</span>
                <button
                    class="dart-btn dart-btn-secondary dart-btn-block align-items-center flex justify-content-center std-auth__button std-auth__button--secondary"
                    type="button"
                    @click="
                        () => {
                            this.setRegForm();
                            this.regIsSuccess = false;
                        }
                    ">
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
import FloatLabel from '../FloatLabel.vue';

export default {
    name: 'reg-form',
    data() {
        return {
            regIsSuccess: false,
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
            if (this.form.password === this.form.passwordConfirm) {
                this.loading = true;
                this.$load(async () => {
                    const data = (await this.$api.auth.register(this.form));
                    if (data) {
                        if (data === 'technical error') {
                            this.$toast.add({ severity: 'error', summary: 'Техническая ошибка', detail: 'Попробуйте позже.', life: 3000 });
                            return;
                        }

                        if(!data.data.success){
                            this.$toast.add({ severity: 'error', summary: 'Ошибка!', detail: data.data.message, life: 3000 });
                            this.goToErroInput(data.message);
                        }else{
                            this.sendMetrik('register');
                            this.regIsSuccess = true;
                            this.loading = false;
                        }                        
                    }
                });
            } else {
                this.$toast.add({ severity: 'info', summary: 'Пароли не совпадают', detail: 'Проверьте правильно ли введен пароль', life: 3000 });
                this.goToErrorInput('пароль');
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
        },
        goToErrorInput(errorMessage) {
            if (errorMessage.includes('ИНН')) {
                this.$refs.innInput.focus();
                this.$refs.innInput.$el.parentElement.classList.add('error');
            } else if (errorMessage.includes('логин')) {
                this.$refs.loginInput.focus();
                this.$refs.loginInput.parentElement.classList.add('error');
            } else if (errorMessage.includes('пароль')) {
                this.$refs.passwordInput.focus();
                this.$refs.passwordInput.parentElement.classList.add('error');
            }
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
