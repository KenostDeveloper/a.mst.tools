<template>
    <Sitebar v-if="this.getUser" :active="this.sitebar"/>
    <div class="content" :class='{"white": this.namePathIsNav == "purchases"}'>
        <div class="dart_container_wrap">
            <Nav v-if="namePathIsNav == 'purchases'" />
            <div class="dart_wrapper">
                <div class="std-notification__list">
                    <Notification
                        v-for="(notification, index) in notifications"
                        :key="notification.id"
                        :data="notification"
                        :lifetime="10000"
                        @delete="deleteNotification(index)" />
                </div>
                <router-link v-if="this.$route.params.id" :to="{ name: 'purchases_notifications', params: { id: this.$route.params.id, } }" class="std-notification-button absolute">
                    <i class="std_icon std_icon-notification"></i>
                    <div v-if="notifications.total > 0" class="std-notification-button__badge">+{{ notifications.total }}</div>
                </router-link>
                <router-view>

                </router-view>
            </div>
        </div>
    </div>
</template>
  
<script>
import Sitebar from '../components/Sitebar.vue';
import { mapGetters, mapActions } from 'vuex'
import Nav from '../components/opt/Nav.vue'
import router from '../router'
import Notification from '../components/opt/Notification.vue';

export default {
    name: 'MainLoyout',
    data () {
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
            ],
        }
    },
    components: { Sitebar, Nav, Notification },
    computed: {
        ...mapGetters({
            getUser: 'user/getUser',
            notifications: 'notifications'
        })
    },
    mounted () {
        this.setUser(JSON.parse(localStorage.getItem('user')))
        const sidebarCookie = Number(this.$cookies.get('sidebar_active'))
        if(sidebarCookie === 1){
            this.sitebar = true
        }

        this.namePathIsNav = router?.currentRoute?._value.matched[4]?.name

        if(router.currentRoute?._value?.params?.id){
            this.get_notification_api({
                action: "get",
                id: router.currentRoute._value.params.id,
            })
        }
    },
    updated () {
        // this.setUser(JSON.parse(localStorage.getItem('user')))
        this.namePathIsNav = router?.currentRoute?._value.matched[4]?.name
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
}

</script>
  
<style scoped>
    .dart_container_wrap{
        max-width: 1920px;
        width: 100%;
        padding-left: 12px;
        padding-right: 12px;
    }
</style>