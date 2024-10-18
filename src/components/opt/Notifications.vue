<template>
    <section class="notifications">
        <div class="notifications__header">
            <h1 class="notifications__title">Уведомления ({{ this.notifications_all.total || 0 }})</h1>
            <div class="notifications__header-actions">
                <button class="dart-btn dart-btn-primary notifications__button" @click="readAllNotifications">Прочитать все</button>
                <button class="button-none notifications__close" @click="$router.go(-1)">
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
                    <div :data-id="item.id" :data-read="item.read" v-for="item in this.notifications_all.items" v-bind:key="item.id" class="std-notification std-notification--big" :class="{read: item.read == '1'}">
                        <div v-html="item.chunk"></div>
                        <button class="button-none std-notification__delete" @click="deleteNotificate(item.id)">
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
            tobserver: null,
            ids_read: [],
            timeOut: null,
            notifications_all: []
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
            id: this.$route.params.id,
        }).then(() => {
            const notifElems = document.querySelectorAll('.std-notification--big');
            this.tobserver = new IntersectionObserver(this.callback, {
                // root: document.querySelector('.notifications__list'),
                threshold: 1.0,
            });
            for(let i = 0; i < notifElems.length; i++){
                if(notifElems[i].dataset.read == '0'){
                    this.tobserver.observe(notifElems[i]);
                }
            }
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
        readAllNotifications() {
            this.get_notification_api({
                action: "read",
                id: this.$route.params.id,
                ids: 'all'
            })
        },
        deleteNotificate(id){
            this.get_notification_api({
                action: "delete",
                id: this.$route.params.id,
                notification_id: id
            })
        },
        deleteAllNotifications(){
            this.get_notification_api({
                action: "delete",
                id: this.$route.params.id
            })
        },
        callback (entries, observer, target) {
            // console.log('entries', entries)
            // console.log('observer', observer)
            // console.log('target', target)

            // console.log(this.tobserver)

            if(entries.length <= 5){
                for(let i = 0; i < entries.length; i++){
                    this.tobserver.unobserve(entries[i].target)
                    // console.log(entries[i].target.dataset.id)

                    this.ids_read.push(entries[i].target.dataset.id);

                    if(this.timeOut){
                        clearTimeout(this.timeOut);
                    }

                    this.timeOut = setTimeout(() => {
                        // Ваш запрос на сервер
                        this.get_notification_api({
                            action: "read",
                            id: this.$route.params.id,
                            ids: this.ids_read
                        })
                        this.ids_read = []
                    }, 2000);
                }
            }
            // for(let i = 0; i < entries.length; i++){
            //     this.tobserver.unobserve(entries[i].target)
            //     console.log(entries[0].target)
            // }

            // this.observe.unobserve(observer.target)
        }
    },
    watch: {
        notifications: function (newVal, oldVal) {
            this.notifications_all = newVal
        }
    }
};
</script>

<style lang="scss"></style>
