<template>
    <section class="notifications">
        <div class="notifications__header">
            <h1 class="notifications__title">Уведомления ({{ notifications.length ? '+' : '' }}{{ notifications.length }})</h1>
            <div class="notifications__header-actions">
                <button class="dart-btn dart-btn-primary notifications__button" @click="deleteAllNotifications">Прочитать все</button>
                <button class="button-none notifications__close">
                    <i class="std_icon std_icon-close"></i>
                </button>
            </div>
        </div>
        <div class="notifications__main">
            <div class="notifications__list">
                <Notification
                    v-for="(notification, index) in notifications"
                    :key="notification.id"
                    :data="notification"
                    type="big"
                    @delete="deleteNotification(index)" />
            </div>
        </div>
    </section>
</template>

<script>
import Notification from './Notification.vue';

export default {
    name: 'Notifications',
    data() {
        return {
            notifications: [
                {
                    id: 1,
                    date: '12.12.2024',
                    time: '12:00',
                    title: 'Заголовок',
                    description: 'Текст'
                },
                {
                    id: 2,
                    date: '12.12.2024',
                    time: '12:00',
                    title: 'Заголовок',
                    description: 'Текст'
                },
                {
                    id: 3,
                    date: '12.12.2024',
                    time: '12:00',
                    title: 'Заголовок',
                    description: 'Текст'
                }
            ]
        };
    },
    components: {
        Notification
    },
    methods: {
        deleteNotification(index) {
            this.notifications.splice(index, 1);
        },
        deleteAllNotifications() {
            this.notifications = [];
        }
    }
};
</script>

<style lang="scss"></style>
