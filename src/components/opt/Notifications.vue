<template>
    <section class="notifications">
        <div class="notifications__header">
            <h1 class="notifications__title">Уведомления ({{ notifications.total }})</h1>
            <div class="notifications__header-actions">
                <button class="dart-btn dart-btn-primary notifications__button" @click="deleteAllNotifications">Прочитать все</button>
                <button class="button-none notifications__close">
                    <i class="std_icon std_icon-close"></i>
                </button>
            </div>
        </div>
        <div class="notifications__main">
            <div class="notifications__list">
                <!-- <Notification
                    v-for="(notification, index) in notifications"
                    :key="notification.id"
                    :data="notification"
                    type="big"
                    @delete="deleteNotification(index)" /> -->
                    <div v-for="item in notifications.items" v-bind:key="item.id" class="std-notification std-notification--big" :class="{read: item.read == '1'}">
                        <div v-html="item.chunk"></div>
                        <button class="button-none std-notification__delete" @click="$emit('delete')">
                            <!-- <i class="std_icon std_icon-delete"></i> -->
                            <i class="std_icon std_icon-trash"></i>
                        </button>
                    </div>

            </div>
        </div>
    </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Notification from './Notification.vue';
import router from '../../router';

export default {
    name: 'Notifications',
    data() {
        return {
            // notifications: [
            //     {
            //         id: 1,
            //         date: '12.12.2024',
            //         time: '12:00',
            //         title: 'Заголовок',
            //         description: 'Текст'
            //     },
            //     {
            //         id: 2,
            //         date: '12.12.2024',
            //         time: '12:00',
            //         title: 'Заголовок',
            //         description: 'Текст'
            //     },
            //     {
            //         id: 3,
            //         date: '12.12.2024',
            //         time: '12:00',
            //         title: 'Заголовок',
            //         description: 'Текст'
            //     }
            // ]
        };
    },
    mounted() {
        this.get_notification_api({
            action: "get",
            id: router.currentRoute._value.params.id,
        })
    },
    computed: {
        ...mapGetters(['notifications']),
        pageCount() {
            return Math.ceil(this.opt_products.total / this.perpage);
        }
    },
    components: {
        Notification
    },
    methods: {
        ...mapActions(['get_notification_api']),
        // deleteNotification(index) {
        //     this.notifications.splice(index, 1);
        // },
        // deleteAllNotifications() {
        //     this.notifications = [];
        // }
    }
};
</script>

<style lang="scss"></style>
