<template>
    <Toast>
        <template #message="slotProps">
            <div v-if="slotProps.message.severity === 'secondary'" class="std-notification">
                <div class="custom-toast">
                    <div class="std-notification__header">
                        <div class="std-notification__header-content">
                            <i class="std_icon std_icon-notification std-notification__icon"></i>
                            <span class="std-notification__span">
                                {{ new Date(slotProps.message.info.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }) }}
                            </span>
                            <span class="std-notification__span">
                                {{ new Date(slotProps.message.info.date).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) }}
                            </span>
                        </div>
                    </div>
                    <div class="std-notification__main">
                        <h6 class="std-notification__title">{{ slotProps.message.summary }}</h6>
                        <p v-if="slotProps.message.info.namespace == 2" class="std-notification__text">{{ slotProps.message.detail }} <router-link class="std-notification__link" :to="{ name: 'my_orders_opt_id', params: { id: slotProps.message.info.org_id, order_id: slotProps.message.info.link_id } }" @click.stop>здесь</router-link></p>
                        <p v-if="slotProps.message.info.namespace == 11" class="std-notification__text">{{ slotProps.message.detail }} <router-link class="std-notification__link" :to="{ name: 'my_offer_id', params: { id: slotProps.message.info.org_id, offer_id: slotProps.message.info.link_id } }" @click.stop>здесь</router-link></p>
                        <p v-if="slotProps.message.info.namespace == 12" class="std-notification__text">{{ slotProps.message.detail }} <router-link class="std-notification__link" :to="{ name: 'offer_view', params: { id: slotProps.message.info.org_id, offer_id: slotProps.message.info.link_id } }" @click.stop>здесь</router-link></p>
                        <p v-if="slotProps.message.info.namespace == 13" class="std-notification__text">{{ slotProps.message.detail }} <router-link class="std-notification__link" :to="{ name: 'offer_view', params: { id: slotProps.message.info.org_id, offer_id: slotProps.message.info.link_id } }" @click.stop>здесь</router-link></p>
                        
                        <!-- <span class="std-notification__span">
                            Просмотреть детали заказа, нажав
                            <router-link class="std-notification__link" to="/" @click.stop>здесь</router-link>
                        </span> -->
                    </div>
                </div>
            </div>

            <div v-else>
                <!-- <i class="pi pi-cloud-upload text-primary-500 text-2xl"></i> -->
                <div class="p-toast-message-text" data-pc-section="text">
                    <span class="p-toast-summary" data-pc-section="summary">{{ slotProps.message.summary }}</span>
                    <div class="p-toast-detail" data-pc-section="detail">{{ slotProps.message.detail }} 
                        <!-- <router-link class="std-notification__link" :to="{ name: 'my_orders_opt_id', params: { id: slotProps.message.info.id, order_id: slotProps.message.info.link_id } }" @click.stop>здесь</router-link> -->
                    </div>
                </div>
            </div>
        </template>
    </Toast>
    <div class="kenost-small-window">
        <div class="kenost-small-window__logo">
            <img src="../../public/images/logo_small.svg" alt="">
            <span>МСТ Закупки</span>
        </div>
        <div class="kenost-small-window__desc">Доступно только на ПК</div>
        <div class="kenost-small-window__buttons">
            <div class="kenost-small-window__role active">Закупщик</div>
            <div class="kenost-small-window__role">Маркетплейс</div>
            <div class="kenost-small-window__role">Поставщик</div>
        </div>
        <div>
            <img src="../../public/images/small-window.png" alt="">
        </div>
    </div>
    <Sitebar v-if="this.$route.params.id" :active="this.sitebar" />
    <div class="content" :class="{ white: this.namePathIsNav == 'purchases' || this.namePathIsNav == 'purchases_offer' }">
        <CookieConsent />
        <div class="dart_container_wrap">
            <Nav v-if="namePathIsNav == 'purchases' || namePathIsNav == 'purchases_offer'" />
            <div class="dart_wrapper">
                <NotificationButton v-if="this.$route.params.id && pageIsAvailable()" class="absolute" />
                <router-view > </router-view>
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
import NotificationButton from '../components/NotificationButton.vue';
import CookieConsent from '../components/CookieConsent.vue';

export default {
    name: 'MainLoyout',
    data() {
        return {
            isUser: false,
            sitebar: false,
            namePathIsNav: null,
            data_start: new Date(),
            notifications_all: [],
        };
    },
    components: { Sitebar, Nav, Notification, Toast, NotificationButton, CookieConsent },
    computed: {
        ...mapGetters({
            getUser: 'user/getUser',
            new_notifications: 'new_notifications',
            notifications: 'notifications'
        }),
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
                            case '11':
                                title = 'Вам отправлено предложение оформить заказ';
                                break;
                            case '12':
                                title = 'Ваше предложение было отклонено';
                                break;
                            case '13':
                                title = 'Ваше предложение было принято';
                                break;
                        }
                        console.log(title);
                        this.$toast.add({ severity: 'secondary', summary: title, detail: 'Чтобы узнать подробнее, нажмите ', info: res.data.data.items[i], life: 5000 });
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
        },
        pageIsAvailable() {
            const routeName = this.$route.name;
            console.log(routeName)
            if (routeName == 'shipments' || routeName == 'org_settings' || 
                routeName == 'org_action_add' || routeName == 'org_sales_add' ||
                routeName == 'discounts_edit' || routeName == 'org_sales_edit' ||
                routeName == 'org_action_edit' || routeName == 'complect_add' ||
                routeName == 'complect_edit' || this.namePathIsNav == 'purchases' ||
                routeName == 'purchases_notifications' || routeName == 'groups_edit' ||
                routeName == 'groups_edit_id' || routeName == 'purchases_home_offer' ||
                routeName == 'purchases_catalog_offer' || routeName == 'opt_search' ||
                routeName == 'purchases_catalog_warehouse_offer' || routeName == 'opt_search_offer'
            ) {
                return false;
            }
            return true;
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
