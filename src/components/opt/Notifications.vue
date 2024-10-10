<template>
    <section class="notifications">
        <div class="notifications__header">
            <h1 class="notifications__title">Уведомления (+100)</h1>
            <div class="notifications__header-actions">
                <button class="dart-btn dart-btn-primary notifications__button">Прочитать все</button>
                <button class="button-none notifications__close">
                    <i class="std_icon std_icon-close"></i>
                </button>
            </div>
        </div>
        <div class="notifications__main">
            <ul class="notifications__list">
                <li class="std-notification std-notification--big" v-for="n in 10" v-bind:key="n">
                    <div class="std-notification__content">
                        <div class="std-notification__header">
                            <div class="std-notification__header-content">
                                <i class="std_icon std_icon-notification std-notification__icon"></i>
                                <span class="std-notification__span">12.12.2024</span>
                                <span class="std-notification__span">12:00</span>
                            </div>
                        </div>
                        <div class="std-notification__main">
                            <h6 class="std-notification__title">Изменение в заказе №2345</h6>
                            <p class="std-notification__text">Заказ №2345 задерживается на складе МСТ.</p>
                            <span class="std-notification__span">
                                Просмотреть детали заказа, нажав
                                <router-link class="std-notification__link" to="/">сюда</router-link>
                            </span>
                        </div>
                    </div>
                    <button class="button-none std-notification__delete">
                        <!-- <i class="std_icon std_icon-delete"></i> -->
                        <i class="std_icon std_icon-trash"></i>
                    </button>
                </li>
            </ul>
        </div>
    </section>
</template>

<script>
export default {
    name: 'Notification'
};
</script>

<style lang="scss"></style>
