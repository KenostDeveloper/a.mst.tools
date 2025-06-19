<script>
import Autocomplete from '../Autocomplete.vue';
import InputText from 'primevue/inputtext';
import AddAddress from './AddAddress.vue';
import { IMaskDirective } from 'vue-imask';
import Toast from 'primevue/toast';
import { sendMetrik } from '../../utils/metrika';
import FloatLabel from '../FloatLabel.vue';
import { required, minLength, maxLength, helpers, email } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import Input from '../ui/Input.vue';
import Button from '../ui/Button.vue';

export default {
    name: 'reg-form',
    data() {


        return {
            showPassword1: false,
            showPassword2: false,
            regIsSuccess: false,
            loading: false,
            form: {
                login: null,
                password: '',
                passwordConfirm: '',
                telephone: '',
                email: '',
                org: {
                    name: '',
                    inn: '',
                    ogrn: '',
                    opf: ''
                },
                contact: {},
                delivery_addresses: [{ value: '' }]
            },
            mask: {
                mask: '+{7} (000) 000-00-00',
                lazy: false
            }
        };
    },
    setup() {
        return { v$: useVuelidate() };
    },
    validations() {
        // Функция валидации ИНН
        function validateInn(inn) {
            const error = { code: null, message: '' };
            let result = false;

            if (typeof inn === 'number') {
                inn = inn.toString();
            } else if (typeof inn !== 'string') {
                inn = '';
            }

            if (!inn.length) {
                error.code = 1;
                error.message = 'Пожалуйста, заполните ИНН';
            } else if (/[^0-9]/.test(inn)) {
                error.code = 2;
                error.message = 'ИНН может состоять только из цифр';
            } else if ([10, 12].indexOf(inn.length) === -1) {
                error.code = 3;
                error.message = 'ИНН может состоять только из 10 или 12 цифр';
            } else {
                const checkDigit = function (inn, coefficients) {
                    let n = 0;
                    for (let i in coefficients) {
                        n += coefficients[i] * inn[i];
                    }
                    return parseInt(n % 11 % 10);
                };

                switch (inn.length) {
                    case 10:
                        const n10 = checkDigit(inn, [2, 4, 10, 3, 5, 9, 4, 6, 8]);
                        if (n10 === parseInt(inn[9])) {
                            result = true;
                        }
                        break;
                    case 12:
                        const n11 = checkDigit(inn, [7, 2, 4, 10, 3, 5, 9, 4, 6, 8]);
                        const n12 = checkDigit(inn, [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8]);
                        if (n11 === parseInt(inn[10]) && n12 === parseInt(inn[11])) {
                            result = true;
                        }
                        break;
                }
            }
            // console.log({ valid: result, message: error.message })
            return { valid: result, message: error.message };
        }

        const validInn = helpers.withMessage(
            message => message || 'Некорректный ИНН',
            value => {
                const { valid, message } = validateInn(value);
                return valid || message;
            }
        );
        return {
            form: {
                login: {
                    required,
                    minLength: minLength(3),
                    maxLength: maxLength(30)
                },
                password: {
                    required,
                    minLength: minLength(6)
                },
                passwordConfirm: {
                    required
                },
                telephone: {
                    required,
                    minLength: minLength(11), // Длина с кодом +7 (XXX) XXX-XX-XX
                },
                email: {
                    required,
                    email
                },
                name: {
                    required,
                    minLength: minLength(3)
                },
                org: {
                    name: {
                        required,
                        minLength: minLength(3)
                    },
                    inn: {
                        required,
                        validInn
                    }
                },
                delivery_addresses: {
                    $each: {
                        value: {
                            required,
                            minLength: minLength(5) // Минимальная длина адреса (пример)
                        }
                    }
                }
            }
        };
    },
    components: {
        Autocomplete,
        AddAddress,
        Toast,
        FloatLabel,
        InputText,
        Input,
        Button,
    },
    methods: {
        sendMetrik: sendMetrik,
        formSubmit() {
            this.v$.$touch(); // Отмечаем все поля как проверенные
            if (this.v$.$invalid) {
                const errorMessage = this.getErrorMessages();
                this.$toast.add({
                    severity: 'error',
                    summary: 'Ошибка',
                    detail: errorMessage,
                    life: 3000
                });
                return;
            }
            if (this.form.password === this.form.passwordConfirm) {
                this.loading = true;
                this.$load(async () => {
                    const data = await this.$api.auth.register(this.form);
                    if (data) {
                        if (data === 'technical error') {
                            this.$toast.add({ severity: 'error', summary: 'Техническая ошибка', detail: 'Попробуйте позже.', life: 3000 });
                            this.loading = false;
                            return;
                        }
                        if (!data.data.success) {
                            this.$toast.add({ severity: 'error', summary: 'Ошибка!', detail: data.data.message, life: 3000 });
                            this.loading = false;
                            this.goToErrorInput(data.data.message);
                        } else {
                            this.sendMetrik('register');
                            this.regIsSuccess = true;
                        }
                        this.loading = false;
                    }
                });
            } else {
                this.$toast.add({ severity: 'error', summary: 'Ошибка!', detail: 'Пароли не совпадают. Пожалуйста, убедитесь, что вы ввели их правильно.', life: 3000 });
                this.goToErrorInput('пароль');
            }
        },
        normalizePhone(phone) {
            return phone.replace(/[^0-9]/g, '');
        },
        getErrorMessages() {
            if (this.v$.form.login.$error) {
                if (!this.v$.form.login.required) return 'Пожалуйста, введите логин.';
                if (this.v$.form.login.minLength) return 'Логин должен содержать минимум 3 символа.';
                if (this.v$.form.login.maxLength) return 'Логин должен содержать не более 30 символов.';
            }
            if (this.v$.form.password.$error) {
                if (!this.v$.form.password.required) return 'Пожалуйста, введите пароль.';
                if (this.v$.form.password.minLength) return 'Пароль должен содержать минимум 6 символов.';
            }
            if (this.v$.form.passwordConfirm.$error) {
                return 'Пожалуйста, подтвердите пароль. Пароли должны совпадать.';
            }
            if (this.v$.form.telephone.$error) {
                if (!this.v$.form.telephone.required) return 'Пожалуйста, введите номер телефона.';
                if (this.v$.form.telephone.minLength) return 'Введите корректный номер телефона.';
            }
            if (this.v$.form.email.$error) {
                if (!this.v$.form.email.required) return 'Пожалуйста, введите email.';
                if (this.v$.form.email.email) return 'Введите корректный email.';
            }
            if (this.v$.form.name.$error) {
                if (!this.v$.form.name.required) return 'Пожалуйста, введите ФИО.';
                if (this.v$.form.name.minLength) return 'ФИО должно содержать минимум 3 символа.';
            }
            if (this.v$.form.org.name.$error) {
                if (!this.v$.form.org.name.required) return 'Пожалуйста, введите наименование организации.';
                if (this.v$.form.org.name.minLength) return 'Наименование организации должно содержать минимум 3 символа.';
            }

            if (this.v$.form.org.inn.$error) {
                if (!this.v$.form.org.inn.required) return 'Пожалуйста, введите ИНН.';
                if (this.v$.form.org.inn.$params.innLength && !this.v$.form.org.inn.$params.innLength(value)) {
                    return 'ИНН должен содержать 10 или 12 символов.';
                }
            }
            if (this.v$.form.delivery_addresses.$error) {
                return 'Пожалуйста, заполните все адреса корректно.';
            }

            return ''; // Если ошибок нет, возвращаем пустую строку
        },
        togglePasswordVisibility1() {
            this.showPassword1 = !this.showPassword1;
        },
        togglePasswordVisibility2() {
            this.showPassword2 = !this.showPassword2;
        },
        setRegForm() {
            this.$emit('setRegForm', false);
        },
        setCompany(company) {
            this.form.org.name = company.data.name.short_with_opf;
            this.form.org.ogrn = company.data.ogrn;
            this.form.org.opf = company.data.opf.short;
        },
        setName(name) {
            this.form.name = name.value
            this.form.contact = name.data
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
        },
        setLoginForm() {
            this.$emit('setRegForm', false);
        },
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

<template>
    <section class="dart_wrapper auth registration">
        <form class="auth__form registration__form" @submit.prevent="formSubmit">
            <a class="d-back registration__back" @click.prevent="setLoginForm">
                <i class="d-icon-arrow d-back__icon"></i>
                <span class="d-back__text hidden-640">Назад</span>
            </a>
            <a href="/" class="auth__logo registration__logo">
                <picture>
                    <source media="(max-width: 1920px)" srcset="/icons/logo/logo-1920.svg" />
                    <source media="(max-width: 800px)" srcset="/icons/logo/logo-800.svg" />
                    <source media="(max-width: 640px)" srcset="/icons/logo/logo-640.svg" />
                    <source media="(max-width: 400px)" srcset="/icons/logo/logo-400.svg" />
                    <source media="(max-width: 320px)" srcset="/icons/logo/logo-320.svg" />
                    <img src="/icons/logo/logo-1920.svg" loading="lazy" width="368" height="79" />
                </picture>
            </a>

            <!-- <div class="auth__loading">
					<canvas class="d-loader" style="width: 60px; height: 60px"></canvas>
					<p class="text">Пожалуйста, подождите,<br>идет загрузка контента</p>
				</div> -->

            <div class="registration__fields">
                <div class="d-input__group">
                    <!-- Login input -->
                    <Input ref="loginInput" v-model="form.login" iconType="close" :errorText="v$.form.login.$error && (!v$.form.login.required ?
                        'Пожалуйста, введите логин.' : v$.form.login.minLength ?
                            'Логин должен содержать минимум 3 символа.' : v$.form.login.maxLength ?
                                'Логин должен содержать максимум 30 символов.' : '')" type="text" placeholder="Логин"
                        name="login" id="login" autocomplete="login" required />

                    <!-- Password input -->
                    <Input ref="passwordInput" v-model="form.password" iconType="password" :errorText="v$.form.password.$error && (!v$.form.password.required ?
                        'Пожалуйста, введите пароль.' : v$.form.password.minLength ?
                            'Пароль должен содержать минимум 6 символов.' : '')" type="password" placeholder="Пароль"
                        name="password" autocomplete="new-password" maxlength="128" required />

                    <!-- Password confirm input -->
                    <Input ref="passwordInput" v-model="form.passwordConfirm" iconType="password"
                        :errorText="v$.form.passwordConfirm.$error && 'Пожалуйста, подтвердите пароль. Пароли должны совпадать.'"
                        type="password" placeholder="Повторите пароль" name="passwordConfirm"
                        autocomplete="passwordConfirm" maxlength="128" required />
                </div>

                <fieldset class="d-input__group">
                    <legend class="d-input__label">Данные контактного лица:</legend>

                    <!-- Full name input -->
                    <Autocomplete ref="nameInput" v-model="form.name" selectionType="single" :errorText="v$.form.name.$error && (!v$.form.name.required ?
                        'Пожалуйста, введите ФИО.' : v$.form.name.minLength ?
                            'ФИО должно содержать минимум 3 символа.' : '')" iconType="close"
                        placeholder="ФИО контактного лица" name="name" id="name" type="fio" autocomplete="off"
                        @setSelection="setName" required />

                    <!-- Telephone input -->
                    <Input v-model="form.telephone" :mask="mask" :errorText="v$.form.telephone.$error && (!v$.form.telephone.required ?
                        'Пожалуйста, введите номер телефона.' : v$.form.telephone.minLength ?
                            'Введите корректный номер телефона.' : '')" type="tel" placeholder="Телефон" name="phone"
                        class="d-input__field" id="telephone" autocomplete="off" required
                        @input="form.telephone = normalizePhone(form.telephone)" />


                    <!-- Email input -->
                    <Input v-model="form.email" :errorText="v$.form.telephone.$error && (!v$.form.email.required ?
                        'Пожалуйста, введите email.' : v$.form.email.email ?
                            'Введите корректный email.' : '')" iconType="close" type="email" placeholder="Email"
                        name="email" class="d-input__field" required />
                </fieldset>

                <fieldset class="d-input__group">
                    <legend class="d-input__label">Данные компании:</legend>

                    <!-- INN input -->
                    <Autocomplete v-model="form.org.inn" selectionType="single" :errorText="v$.form.org.inn.$error && (!v$.form.org.inn.required ?
                        'Пожалуйста, введите ИНН.' : v$.form.org.inn.validInn.$response != true ?
                            'Некорректный ИНН' : '')" placeholder="ИНН" name="inn" id="inn" type="company"
                        autocomplete="off" @setSelection="setCompany" required />

                    <!-- Org name input -->
                    <Input v-model="form.org.name" :errorText="v$.form.org.name.$error && (!v$.form.org.name.required ?
                        'Пожалуйста, введите наименование организации.' : v$.form.org.name.minLength ?
                            'Наименование организации должно содержать минимум 3 символа.' : '')" type="text"
                        placeholder="Наименование организации" name="org_name" class="d-input__field" id="org_name"
                        autocomplete="off" required />

                    <!-- <div class="address-map__wrapper"> -->
                    <AddAddress v-for="(address, index) in form.delivery_addresses" :key="index" :index="index"
                        v-model="form.delivery_addresses[index]" />
                    <!-- </div> -->
                </fieldset>

                <Button variant="secondary" class="registration__add-button" type="button"
                    @click="() => this.form.delivery_addresses.push({ value: '' })">
                    <i class="d-icon-plus"></i>
                    Добавить адрес доставки
                </Button>
            </div>
            <Button v-if="!regIsSuccess" variant="primary" class="box-shadow-none" :isLoading="loading">
                Зарегистрироваться
            </Button>
        </form>

        <div class="auth__footer">
            <div class="feedback visible-800">
                <div class="feedback__content">
                    <p class="feedback__title">Не получается войти в ЛК?</p>
                    <p class="feedback__text">
                        Свяжитесь с нами через почту
                        <a href="mailto:client.ms@yandex.ru" class="inline-block link">client.ms@yandex.ru</a>
                        или по номеру телефона
                        <a href="tel:88003501519" class="inline-block link">+7 (800) 350-15-19</a>
                    </p>
                </div>
            </div>
            <div class="copyright visible-800">
                <span class="copyright__text">© МСТ, 2024</span>
            </div>
        </div>

        <div class="copyright hidden-800">
            <span class="copyright__text">© МСТ, 2024</span>
        </div>

        <div class="feedback hidden-800">
            <div class="feedback__content">
                <p class="feedback__title">Не получается войти в ЛК?</p>
                <p class="feedback__text">
                    Свяжитесь с нами через обратную связь, кликнув на кнопку, расположенную
                    справа.
                </p>
            </div>

            <div class="feedback__button-wrapper">
                <button type="button" class="d-button d-button-primary d-button-rounded">
                    <i class="d-icon-messages d-button-rounded__icon"></i>
                </button>
            </div>
        </div>
    </section>
</template>
