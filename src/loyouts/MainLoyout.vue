<template>
    <Sitebar v-if="this.getUser" :active="this.sitebar" />
    <div class="content" :class="{ white: this.namePathIsNav == 'purchases' }">
        <div class="dart_container_wrap">
            <Nav v-if="namePathIsNav == 'purchases'" />
            <div class="dart_wrapper">
                <!-- <div class="std-notification__list"> -->
                <!-- <Notification
                        v-for="(notification, index) in notifications"
                        :key="notification.id"
                        :data="notification"
                        :lifetime="10000"
                        @delete="deleteNotification(index)" /> -->
                <!-- </div> -->

                <Toast>
                    <!-- <template #container="data">
                        <div class="std-notification">
                            <div class="std-notification__header">
                                <div class="std-notification__header-content">
                                    <i class="std_icon std_icon-notification std-notification__icon"></i>
                                    <span class="std-notification__span">{{ data?.date }}</span>
                                    <span class="std-notification__span">{{ data?.time }}</span>
                                </div>
                            </div>
                            <div class="std-notification__main">
                                <h6 class="std-notification__title">{{ data?.title }}</h6>
                                <p class="std-notification__text">{{ data?.description }}</p>
                                <span class="std-notification__span">
                                    Просмотреть детали заказа, нажав
                                    <router-link class="std-notification__link" to="/" @click.stop>здесь</router-link>
                                </span>
                            </div>
                        </div>
                    </template> -->
                </Toast>

                <router-link
                    v-if="this.$route.params.id"
                    :to="{ name: 'purchases_notifications', params: { id: this.$route.params.id } }"
                    class="std-notification-button absolute">
                    <i class="std_icon std_icon-notification"></i>
                    <div v-if="notifications.total > 0" class="std-notification-button__badge">+{{ notifications.total }}</div>
                </router-link>
                <router-view> </router-view>
            </div>
        </div>
    </div>
</template>

<script>
import Sitebar from '../components/Sitebar.vue';
import { mapGetters, mapActions } from 'vuex';
import Nav from '../components/opt/Nav.vue';
import router from '../router';
import Notification from '../components/opt/Notification.vue';
import Toast from 'primevue/toast';

export default {
    name: 'MainLoyout',
    data() {
        return {
            isUser: false,
            sitebar: false,
            namePathIsNav: null,
            notifications: [
                {
                    date: '12.12.2024',
                    time: '12:00',
                    title: 'Заголовок',
                    description: 'Текст'
                },
                {
                    date: '12.12.2024',
                    time: '12:00',
                    title: 'Заголовок',
                    description: 'Текст'
                },
                {
                    date: '12.12.2024',
                    time: '12:00',
                    title: 'Заголовок',
                    description: 'Текст'
                }
            ]
        };
    },
    components: { Sitebar, Nav, Notification, Toast },
    computed: {
        ...mapGetters({
            getUser: 'user/getUser',
            notifications: 'notifications'
        })
    },
    mounted() {
        this.setUser(JSON.parse(localStorage.getItem('user')));
        const sidebarCookie = Number(this.$cookies.get('sidebar_active'));
        if (sidebarCookie === 1) {
            this.sitebar = true;
        }

        this.namePathIsNav = router?.currentRoute?._value.matched[4]?.name;

        if (router.currentRoute?._value?.params?.id) {
            this.get_notification_api({
                action: 'get',
                id: router.currentRoute._value.params.id
            });
        }

        this.$toast.add({ severity: 'secondary', summary: 'Приветствую', detail: 'Добро пожаловать', life: 3000 });
    },
    updated() {
        // this.setUser(JSON.parse(localStorage.getItem('user')))
        this.namePathIsNav = router?.currentRoute?._value.matched[4]?.name;
    },
    methods: {
        ...mapActions({
            setUser: 'user/setUser',
            deleteUser: 'user/deleteUser',
            get_notification_api: 'get_notification_api'
        }),
        deleteNotification(index) {
            this.notifications.splice(index, 1);
        }
    }
};
</script>

<style scoped>
.dart_container_wrap {
    max-width: 1920px;
    width: 100%;
    padding-left: 12px;
    padding-right: 12px;
}
</style>
