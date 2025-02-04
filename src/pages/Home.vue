<template>
    <auth-form v-if="!this.getUser && !this.isRegForm" @setRegForm="setRegForm" />
    <reg-form v-if="this.isRegForm" @setRegForm="setRegForm" />
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import authForm from '../components/auth/v-auth.vue';
import regForm from '../components/auth/v-reg.vue';

export default {
    name: 'Home',
    data() {
        return {
            organizations: [],
            isRegForm: false
        };
    },
    components: { authForm, regForm },
    computed: {
        ...mapGetters({
            getUser: 'user/getUser',
            orgs: 'orgs'
        })
    },
    async mounted() {
        // console.log(localStorage.getItem("user"))
        if (localStorage.getItem("user") !== null && localStorage.getItem("user") != 0) {
            this.setUser(JSON.parse(localStorage.getItem('user')));
        }else{
            // TODO: сделать запрос на проверку сессии
            const user = await this.getSessionUser();
            localStorage.setItem('user', JSON.stringify(user));
            this.$store.dispatch('user/setUser', user);
        }
        if (this.getUser) {
            const orgs = await this.org_get_from_api({
                action: 'get/orgs'
            });
            if (orgs !== undefined) {
                console.log(orgs.data.data)
                let role = localStorage.getItem('role');
                console.log(role)
                //const res = await this.$router.push({ name: 'org', params: { id: orgs.data.data[0].id } })

                if (role == 1) {
                    const res = await this.$router.push({ name: 'retail_orders', params: { id: orgs.data.data[0].id } });
                } else if (role == 2) {
                    const res = await this.$router.push({ name: 'statistics', params: { id: orgs.data.data[0].id } });
                } else {
                    const res = await this.$router.push({ name: 'purchases_home', params: { id: orgs.data.data[0].id } });
                }

                // location.reload();
            }else{
                this.deleteUser();
            }
        }
    },
    updated() {
        //if (localStorage.getItem("user") !== null) {
        //    this.setUser(JSON.parse(localStorage.getItem('user')));
        //}
    },
    methods: {
        ...mapActions({
            setUser: 'user/setUser',
            deleteUser: 'user/deleteUser',
            getSessionUser: 'user/getSessionUser',
            org_get_from_api: 'org_get_from_api'
        }),

        setRegForm(state) {
            this.isRegForm = state;
        }
    },
    watch: {
        orgs: function (newVal, oldVal) {
            this.organizations = newVal;
        }
    }
};
</script>

<style lang="scss"></style>
