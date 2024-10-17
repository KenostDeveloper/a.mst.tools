<template>
    <router-link v-if="this.$route.params.id && pageIsAvailable()"
        :to="{ name: 'purchases_notifications', params: { id: this.$route.params.id } }"
        class="std-notification-button">
        <i class="std_icon std_icon-notification"></i>
        <div v-if="this.notifications_all.no_read > 0" class="std-notification-button__badge">
            +{{ this.notifications_all.no_read }}</div>
        <!-- {{ this.$route.params }} -->
    </router-link>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    name: 'NotificationButton',
    data() {
        return {
            notifications_all: []
        }
    },
    methods: {
        ...mapActions({
            get_notification_api: 'get_notification_api'
        }),
        pageIsAvailable() {
            const routeName = this.$route.name;
            if (routeName == 'shipments' || routeName == 'org_settings' || 
                routeName == 'org_action_add' || routeName == 'org_sales_add' ||
                routeName == 'discounts_edit' || routeName == 'org_sales_edit' ||
                routeName == 'org_action_edit' || routeName == 'complect_add' ||
                routeName == 'complect_edit') {
                return false;
            }
            return true;
        }
    },
    computed: {
        ...mapGetters({
            notifications: 'notifications'
        })
    },
    mounted() {
        if (this.$route.params.id) {
            this.get_notification_api({
                action: 'get',
                id: this.$route.params.id
            });
        }
    },
    watch: {
        notifications: function (newVal, oldVal) {
            this.notifications_all = newVal;
        }
    }
}
</script>

<style lang="scss" scoped></style>