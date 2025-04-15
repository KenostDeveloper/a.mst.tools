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
            console.log({ valid: result, message: error.message })
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
        InputText
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
            return phone.replace(/[^0-9]/g, ''); // Удалить все, кроме цифр
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
                    <div class="d-input__wrapper">
                        <div :class="`d-input ${v$.form.login.$error && 'd-input--error'}`">
                            <input type="text" placeholder="Логин" name="login" class="d-input__field"
                                data-input-id="login" required ref="loginInput" id="login" v-model="form.login"
                                autocomplete="off" />
                            <button type="button" class="d-close d-input__button" data-input="clear"
                                data-for-input="login">
                                <i class="d-icon-times d-close__icon"></i>
                            </button>
                        </div>

                        <div v-if="v$.form.login.$error" class="d-input-error">
                            <i class="d-icon-warning d-input-error__icon"></i>
                            <span v-if="!v$.form.login.required" class="d-input-error__text">
                                Пожалуйста, введите логин.
                            </span>
                            <span v-else-if="v$.form.login.minLength" class="d-input-error__text">
                                Логин должен содержать минимум 3 символа.
                            </span>
                            <span v-else-if="v$.form.login.maxLength" class="d-input-error__text">
                                Логин должен содержать максимум 30 символов.
                            </span>
                        </div>
                    </div>
                    <div class="d-input__wrapper">
                        <div :class="`d-input ${v$.form.password.$error && 'd-input--error'}`">
                            <input type="password" placeholder="Пароль" name="password" class="d-input__field"
                                data-input-id="new-password" required ref="passwordInput" v-model="form.password"
                                autocomplete="new-password" maxlength="128" />
                            <button type="button" class="d-show-alt d-input__button" data-input="show"
                                data-for-input="new-password">
                                <i class="d-icon-eye d-show-alt__icon"></i>
                            </button>
                            <div class="d-show__wrapper d-input__button" data-input="hide"
                                data-for-input="new-password">
                                <button type="button" class="d-show d-input__show">
                                    <i class="d-icon-eye d-show__icon"></i>
                                </button>
                            </div>
                        </div>

                        <div v-if="v$.form.password.$error" class="d-input-error">
                            <i class="d-icon-warning d-input-error__icon"></i>
                            <span v-if="!v$.form.password.required" class="d-input-error__text">
                                Пожалуйста, введите пароль.
                            </span>
                            <span v-else-if="v$.form.password.minLength" class="d-input-error__text">
                                Пароль должен содержать минимум 6 символов.
                            </span>
                        </div>
                    </div>
                    <div class="d-input__wrapper">
                        <div :class="`d-input ${v$.form.passwordConfirm.$error && 'd-input--error'}`">
                            <input type="password" placeholder="Повторите пароль" name="passwordConfirm"
                                class="d-input__field" data-input-id="passwordConfirm" required ref="passwordInput"
                                v-model="form.passwordConfirm" autocomplete="passwordConfirm" maxlength="128" />
                            <button type="button" class="d-show-alt d-input__button" data-input="show"
                                data-for-input="passwordConfirm">
                                <i class="d-icon-eye d-show-alt__icon"></i>
                            </button>
                            <div class="d-show__wrapper d-input__button" data-input="hide"
                                data-for-input="passwordConfirm">
                                <button type="button" class="d-show d-input__show">
                                    <i class="d-icon-eye d-show__icon"></i>
                                </button>
                            </div>
                        </div>

                        <div v-if="v$.form.passwordConfirm.$error" class="d-input-error">
                            <i class="d-icon-warning d-input-error__icon"></i>
                            <span class="d-input-error__text">
                                Пожалуйста, подтвердите пароль. Пароли должны совпадать.
                            </span>
                        </div>
                    </div>
                </div>

                <fieldset class="d-input__group">
                    <legend class="d-input__label">Данные контактного лица:</legend>
                    <div class="d-input__wrapper">
                        <div :class="`d-input ${v$.form.name.$error && 'd-input--error'}`">

                            <!-- TODO Переделать на Autocomplete -->
                            <input placeholder="ФИО контактного лица" class="d-input__field" data-input-id="name"
                                required ref="nameInput" name="name" id="name" type="fio" selectionType="single"
                                v-model="form.name" @setSelection="setName" autocomplete="off" />
                            <button type="button" class="d-close d-input__button" data-input="clear"
                                data-for-input="name">
                                <i class="d-icon-times d-close__icon"></i>
                            </button>
                        </div>

                        <div v-if="v$.form.name.$error" class="d-input-error">
                            <i class="d-icon-warning d-input-error__icon"></i>
                            <span v-if="!v$.form.name.required" class="d-input-error__text">
                                Пожалуйста, введите ФИО.
                            </span>
                            <span v-else-if="v$.form.name.minLength" class="d-input-error__text">
                                ФИО должно содержать минимум 3 символа.
                            </span>
                        </div>
                    </div>
                    <div class="d-input__wrapper">
                        <div :class="`d-input ${v$.form.telephone.$error && 'd-input--error'}`">
                            <input type="tel" placeholder="Телефон" name="phone" class="d-input__field"
                                data-input-id="phone" required v-imask="mask" id="telephone" v-model="form.telephone"
                                @input="form.telephone = normalizePhone(form.telephone)" autocomplete="off" />
                        </div>

                        <div v-if="v$.form.telephone.$error" class="d-input-error">
                            <i class="d-icon-warning d-input-error__icon"></i>
                            <span v-if="!v$.form.telephone.required" class="d-input-error__text">Пожалуйста, введите
                                номер телефона.</span>
                            <span v-else-if="v$.form.telephone.minLength" class="d-input-error__text">Введите корректный
                                номер телефона.</span>
                        </div>
                    </div>
                    <div class="d-input__wrapper">
                        <div :class="`d-input ${v$.form.email.$error && 'd-input--error'}`">
                            <input type="email" placeholder="Email" name="email" class="d-input__field"
                                data-input-id="email" required />
                            <button type="button" class="d-close d-input__button" data-input="clear"
                                data-for-input="email">
                                <i class="d-icon-times d-close__icon"></i>
                            </button>
                        </div>

                        <div v-if="v$.form.email.$error" class="d-input-error">
                            <i class="d-icon-warning d-input-error__icon"></i>
                            <span v-if="!v$.form.email.required" class="d-input-error__text">Пожалуйста, введите
                                email.</span>
                            <span v-else-if="v$.form.email.email" class="d-input-error__text">Введите корректный
                                email.</span>
                        </div>
                    </div>
                </fieldset>

                <fieldset class="d-input__group">
                    <legend class="d-input__label">Данные компании:</legend>
                    <div class="d-input__wrapper">
                        <div :class="{ 'd-input': true, 'd-input--error': v$.form.org.name.$error }">
                            <input type="text" placeholder="Наименование организации" name="org_name"
                                class="d-input__field" data-input-id="org_name" required id="org_name"
                                v-model="form.org.name" autocomplete="off" />
                            <button type="button" class="d-close d-input__button" data-input="clear"
                                data-for-input="org_name">
                                <i class="d-icon-angle-rounded d-close__icon"></i>
                            </button>

                            <ul class="d-input__suggestions">
                                <!-- <div class="d-input__suggestion d-input__suggestion--none">Нет данных результата</div> -->
                                <!-- <li class="d-input__suggestion d-input__suggestion--disable">
                                    ООО «МСТ» Технологический завод заводов
                                </li>
                                <li class="d-input__suggestion">
                                    ООО «МСТ» Технологический завод заводов
                                </li>
                                <li class="d-input__suggestion">
                                    ООО «МСТ» Технологический завод заводов
                                </li>
                                <li class="d-input__suggestion">
                                    ООО «МСТ» Технологический завод заводов
                                </li>
                                <li class="d-input__suggestion">
                                    ООО «МСТ» Технологический завод заводов
                                </li>
                                <li class="d-input__suggestion">
                                    ООО «МСТ» Технологический завод заводов
                                </li> -->
                            </ul>
                        </div>

                        <div v-if="v$.form.org.name.$error" class="d-input-error">
                            <i class="d-icon-warning d-input-error__icon"></i>
                            <span v-if="!v$.form.org.name.required" class="d-input-error__text">Пожалуйста, введите
                                наименование организации.</span>
                            <span v-else-if="v$.form.org.name.minLength" class="d-input-error__text">Наименование должно
                                содержать минимум 3 символа.</span>
                        </div>
                    </div>
                    <div class="d-input__wrapper">
                        <div
                            :class="{ 'd-input': true, 'd-input--error': v$.form.org.inn.validInn.$response != true && v$.form.org.inn.$dirty }">
                            <input placeholder="ИНН" class="d-input__field" data-input-id="inn" required ref="innInput"
                                name="inn" id="inn" type="company" selectionType="single" v-model="form.org.inn"
                                @setSelection="setCompany" />
                        </div>

                        <div v-if="v$.form.org.inn.validInn.$response != true && v$.form.org.inn.$dirty"
                            class="d-input-error">
                            <i class="d-icon-warning d-input-error__icon"></i>
                            <span class="d-input-error__text">
                                {{ v$.form.org.inn.validInn.$response || 'Некорректный ИНН' }}
                            </span>
                        </div>
                    </div>

                    <div class="address-map__wrapper">
                        <div class="d-input__wrapper">
                            <div class="d-input">
                                <input type="text" placeholder="Адрес доставки" name="address" class="d-input__field"
                                    data-input-id="address1" required />
                            </div>
                        </div>
                        <div class="address-map">
                            <div class="yandex-map" style="width: 100%; height: 100%" data-for-input="address1"></div>
                            <button type="button" class="d-window-button address-map__button">
                                <i class="d-icon-window d-window-button__icon"></i>
                            </button>
                        </div>
                    </div>
                </fieldset>

                <button class="d-button d-button-secondary registration__add-button">
                    <i class="d-icon-plus"></i>
                    Добавить адрес доставки
                </button>
            </div>
            <button v-if="!this.regIsSuccess" :disabled="this.loading"
                class="d-button d-button-primary box-shadow-none">
                <i v-if="this.loading" class="pi pi-spin pi-spinner" style="font-size: 14px"></i>
                Зарегистрироваться
            </button>
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

    <div class="d-modal__wrapper">
        <div class="d-modal registration-address">
            <button class="d-modal__close">
                <i class="d-icon-times d-modal__icon"></i>
            </button>
            <div class="d-modal__content">
                <div class="registration-address__header">
                    <i class="d-icon-location registration-address__icon"></i>
                    <p class="d-modal__title">Выберите адрес доставки</p>
                </div>
                <div class="registration-address__map">
                    <div class="yandex-map" data-for-input="address1" style="width: 100%; height: 100%;"></div>
                </div>
                <form class="d-search registration-address__search">
                    <i class="d-icon-search d-search__icon"></i>
                    <input type="text" placeholder="Найти адрес доставки" class="d-search__field" />
                    <button type="button"
                        class="d-button d-button-primary d-button-primary-small box-shadow-none d-search__button">
                        Найти
                    </button>

                    <ul class="d-search__suggestions">
                        <li class="d-search__suggestion">
                            Россия, Москва, Большой Предтеченский переулок, 13с4
                        </li>
                        <li class="d-search__suggestion">
                            Россия, Москва, Большой Предтеченский переулок, 13с4
                        </li>
                        <li class="d-search__suggestion">
                            Россия, Москва, Большой Предтеченский переулок, 13с4
                        </li>
                        <li class="d-search__suggestion">
                            Россия, Москва, Большой Предтеченский переулок, 13с4
                        </li>
                    </ul>
                </form>

                <p class="registration-address__address">
                    Россия, Москва, Большой Предтеченский переулок, 13с4
                </p>

                <div class="registration-address__buttons">
                    <button type="button" class="d-button d-button-secondary d-button-secondary-small box-shadow-none">
                        Отмена
                    </button>
                    <button type="button"
                        class="d-button d-button-primary d-button-primary-small box-shadow-none">Выбрать</button>
                </div>
            </div>
        </div>
    </div>
</template>
