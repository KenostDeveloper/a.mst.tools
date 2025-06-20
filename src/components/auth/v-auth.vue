<script>
import { mapActions } from 'vuex';
import customModal from '../CustomModal.vue';
import vForgot from './v-forgot.vue';
import Toast from 'primevue/toast';
import { sendMetrik } from '../../utils/metrika';
import Input from '../ui/Input.vue';
import Button from '../ui/Button.vue';
import { required } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';

export default {
    name: 'auth-form',
    components: {
        customModal,
        vForgot,
        Toast,
        Input,
        Button,
    },
    data() {
        return {
            mode: 'signIn',
            loading: false,
            showForgotModal: false,
            form: {
                login: '',
                password: ''
            },
            errors: []
        };
    },
    computed: {
        getYear() {
            return new Date().getFullYear();
        }
    },
    methods: {
        sendMetrik: sendMetrik,
        ...mapActions({
            org_get_from_api: 'org_get_from_api',
            getSessionUser: 'user/getSessionUser',
            deleteUser: 'deleteUser'
        }),
        formSubmit() {
            this.signIn();
        },
        signIn() {
            this.v$.$touch(); // Отмечаем все поля как проверенные
            if (this.v$.$invalid) {
                return;
            }
            this.loading = true;
            this.$load(async () => {
                const data = await this.$api.auth.signIn({
                    username: this.form.login,
                    password: this.form.password
                });
                if (data.data.success) {
                    this.getSessionUser()
                    localStorage.setItem('user', JSON.stringify(data.data.data));
                    this.$store.dispatch('user/setUser', data.data);
                    // this.$router.push({ name: 'home' })

                    // this.$router.push({ name: 'org', params: { id: '48' } })

                    const orgs = await this.org_get_from_api({
                        action: 'get/orgs'
                    });

                    if (orgs != undefined) {
                        // console.log(orgs.data.data)
                        let role = localStorage.getItem('role');
                        this.sendMetrik('auth');
                        if (role == 1) {
                            const res = await this.$router.push({ name: 'retail_orders', params: { id: orgs.data.data[0].id } });
                        } else if (role == 2) {
                            const res = await this.$router.push({ name: 'statistics', params: { id: orgs.data.data[0].id } });
                        } else {
                            const res = await this.$router.push({ name: 'purchases_home', params: { id: orgs.data.data[0].id } });
                        }
                    } else {
                        this.deleteUser();
                        this.$router.push({ name: 'home' })
                    }
                } else {
                    this.$toast.add({ severity: 'error', summary: 'Вход запрещен', detail: data.data.message, life: 3000 });
                    this.loading = false;
                }
            });
        },
        cancel(close) {
            close();
        },
        setRegForm() {
            this.$emit('setRegForm', true);
        }
    },
    setup() {
        return { v$: useVuelidate() };
    },
    validations() {
        return {
            form: {
                login: { required },
                password: { required },
            }
        }
    },
}
</script>

<template>
    <section class="dart_wrapper auth">
        <form class="auth__form" @submit.prevent="formSubmit">
            <a href="/" class="auth__logo">
                <picture>
                    <source media="(max-width: 1920px)" srcset="/icons/logo/logo-1920.svg" />
                    <source media="(max-width: 800px)" srcset="/icons/logo/logo-800.svg" />
                    <source media="(max-width: 640px)" srcset="/icons/logo/logo-640.svg" />
                    <source media="(max-width: 400px)" srcset="/icons/logo/logo-400.svg" />
                    <source media="(max-width: 320px)" srcset="/icons/logo/logo-320.svg" />
                    <img src="/icons/logo/logo-1920.svg" loading="lazy" width="368" height="79" />
                </picture>
            </a>

            <!-- При загрузке -->
            <!-- <div class="auth__loading">
                <canvas class="d-loader" style="width: 60px; height: 60px"></canvas>
                <p class="text">Пожалуйста, подождите,<br>идет загрузка контента</p>
            </div> -->

            <div class="d-input__group auth__fields">
                <!-- Login input -->
                <Input v-model="form.login" :errorText="v$?.form?.login?.$error && 'Заполните поле'" iconType="close" type="text"
                    placeholder="Введите логин" name="username" class="d-input__field" />

                <!-- Password input -->
                <Input v-model="form.password" :errorText="v$?.form?.password?.$error && 'Заполните поле'" iconType="password"
                    type="password" placeholder="Введите пароль" name="password" class="d-input__field" />
            </div>

            <div class="auth__buttons">
                <Button type="submit" variant="primary" :isLoading="loading">Войти</Button>
                <Button type="button" variant="secondary" @click="setRegForm">Зарегистрироваться</Button>
                <Button type="button" variant="link" @click.prevent="showForgotModal = true">Забыли пароль?</Button>
            </div>
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

    <!-- Информативное сообщение -->
    <!-- <div class="d-notion">
        <div class="d-notion__left">
            <i class="d-error"></i>

            <span class="d-notion__category-name hidden-640">Ошибка</span>
            <p class="d-notion__title hidden-640">
                Отутствие подключение к интернету. Проверьте подключение к интернету и
                перезагрузите страницу.
            </p>
        </div>

        <div class="d-notion__middle visible-640">
            <span class="d-notion__category-name">Ошибка</span>
            <p class="d-notion__title">
                Отутствие подключение к интернету. Проверьте подключение к интернету и
                перезагрузите страницу.
            </p>
        </div>

        <div class="d-notion__right">
            <button type="button"
                class="d-button d-button-primary d-button-primary-small d-notion__button hidden-640">Обновить</button>
            <button type="button" class="d-close">
                <i class="d-icon-times d-close__icon"></i>
            </button>
        </div>
    </div> -->

    <teleport to="body">
        <custom-modal v-model="showForgotModal" @cancel="cancel">
            <template v-slot:title>Восстановление пароля</template>
            <v-forgot />
        </custom-modal>
    </teleport>
</template>

<style lang="scss"></style>
