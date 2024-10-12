<template>
    <Teleport to="body">
        <Toast>
            <template #message="slotProps">
                <div v-if="slotProps.message.severity === 'secondary'" class="std-notification">
                    <div class="custom-toast">
                        <div class="std-notification__header">
                            <div class="std-notification__header-content">
                                <i class="std_icon std_icon-notification std-notification__icon"></i>
                                <span class="std-notification__span">12.10.2024</span>
                                <span class="std-notification__span">12:00</span>
                            </div>
                        </div>
                        <div class="std-notification__main">
                            <h6 class="std-notification__title">{{ slotProps.message.summary }}</h6>
                            <p class="std-notification__text">{{ slotProps.message.detail }}</p>
                            <span class="std-notification__span">
                                Просмотреть детали заказа, нажав
                                <router-link class="std-notification__link" to="/" @click.stop>здесь</router-link>
                            </span>
                        </div>
                    </div>
                </div>
    
                <div v-else>
                    <!-- <i class="pi pi-cloud-upload text-primary-500 text-2xl"></i> -->
                    <div class="p-toast-message-text" data-pc-section="text">
                        <span class="p-toast-summary" data-pc-section="summary">{{ slotProps.message.summary }}</span>
                        <div class="p-toast-detail" data-pc-section="detail">{{ slotProps.message.detail }}</div>
                    </div>
                </div>
            </template>
        </Toast>
    </Teleport>

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

                <router-link
                    v-if="this.$route.params.id"
                    :to="{ name: 'purchases_notifications', params: { id: this.$route.params.id } }"
                    class="std-notification-button absolute">
                    <i class="std_icon std_icon-notification"></i>
                    <div v-if="this.notifications_all.no_read > 0" class="std-notification-button__badge">+{{ this.notifications_all.no_read }}</div>
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
import { Teleport } from 'vue';

export default {
    name: 'MainLoyout',
    data() {
        return {
            isUser: false,
            sitebar: false,
            namePathIsNav: null,
            data_start: new Date(),
            notifications_all: []
        };
    },
    components: { Sitebar, Nav, Notification, Toast, Teleport },
    computed: {
        ...mapGetters({
            getUser: 'user/getUser',
            new_notifications: 'new_notifications',
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

        if (this.$route.params.id) {
            this.get_notification_api({
                action: 'get',
                id: this.$route.params.id
            });
        }

        if (this.$route.params.id) {
            this.intervalId = setInterval(() => {
                this.fetchNotification();
            }, 40000);

            this.fetchNotification();
        }

        this.$toast.add({
            severity: 'secondary',
            summary: 'Добро пожаловать!',
            detail: 'Вы вошли в панель управления',
            life: 1000000,
            styleClass: 'std-toast'
        });
        this.$toast.add({
            severity: 'secondary',
            summary: 'Добро пожаловать!',
            detail: 'Вы вошли в панель управления',
            life: 1000000,
            styleClass: 'std-toast'
        });
        this.$toast.add({
            severity: 'secondary',
            summary: 'Добро пожаловать!',
            detail: 'Вы вошли в панель управления',
            life: 1000000,
            styleClass: 'std-toast'
        });
    },
    updated() {
        // this.setUser(JSON.parse(localStorage.getItem('user')))
        this.namePathIsNav = router?.currentRoute?._value.matched[4]?.name;
    },
    methods: {
        ...mapActions({
            setUser: 'user/setUser',
            deleteUser: 'user/deleteUser',
            get_new_notification_api: 'get_new_notification_api',
            get_notification_api: 'get_notification_api'
        }),
        deleteNotification(index) {
            this.notifications.splice(index, 1);
        },
        fetchNotification() {
            this.get_new_notification_api({
                action: 'get',
                id: this.$route.params.id,
                data_start: this.data_start
            }).then((res) => {
                for (let i = 0; i < res.data.data?.total; i++) {
                    setTimeout(() => {
                        let title = '';
                        switch (res.data.data.items[i].namespace) {
                            case '1':
                                title = 'Изменение статуса заказа в маркетплейсе';
                                break;
                            case '2':
                                title = 'Поступил новый оптовый заказ';
                                break;
                            case '3':
                                title = 'Ваша компания отключена';
                                break;
                            case '4':
                                title = 'Ваша компания подключена';
                                break;
                            case '5':
                                title = 'Появился новый поставщик';
                                break;
                            case '6':
                                title = 'Появился новый поставщик';
                                break;
                            case '7':
                                title = 'Вас добавили в поставщики';
                                break;
                            case '8':
                                title = 'Вас удалили из поставщиков';
                                break;
                            case '9':
                                title = 'Ваш склад отключен';
                                break;
                            case '10':
                                title = 'Ваш склад подключен';
                                break;
                        }
                        console.log(title);
                        this.$toast.add({ severity: 'secondary', summary: title, detail: 'Нажмите, чтобы узнать подробнее', life: 5000 });
                    }, i * 500);
                }
                if (res.data.data.items.length > 0) {
                    if (this.$route.params.id) {
                        this.get_notification_api({
                            action: 'get',
                            id: this.$route.params.id
                        });
                    }
                }
            });
            this.data_start = new Date();
        }
    },
    watch: {
        notifications: function (newVal, oldVal) {
            this.notifications_all = newVal;
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
