<template>
    <div v-if="this.getUser">
    </div>
    <auth-form v-else/>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'
    import authForm from '../components/auth/v-auth.vue'

    export default {
        name: 'Home',
        data () {
            return {
                organizations: []
            }
        },
        components: { authForm },
        computed: {
            ...mapGetters({
                getUser: 'user/getUser',
                orgs: 'orgs'
            })
        },
        async mounted () {
            this.setUser(JSON.parse(localStorage.getItem('user')))
            if (this.getUser) {
                const orgs = await this.org_get_from_api({
                    action: 'get/orgs'
                })

                if(orgs){
                    // console.log(orgs.data.data)
                    let role = localStorage.getItem("role");
                    //const res = await this.$router.push({ name: 'org', params: { id: orgs.data.data[0].id } })

                    if(role == 1){
                        const res = await this.$router.push({ name: 'retail_orders', params: { id: orgs.data.data[0].id } })
                    }else if(role == 2){
                        const res = await this.$router.push({ name: 'statistics', params: { id: orgs.data.data[0].id } })
                    }else {
                        const res = await this.$router.push({ name: 'purchases', params: { id: orgs.data.data[0].id } })
                    }

                    location.reload();
                }
            }
        },
        updated () {
            this.setUser(JSON.parse(localStorage.getItem('user')))
        },
        methods: {
            ...mapActions({
                setUser: 'user/setUser',
                deleteUser: 'user/deleteUser',
                org_get_from_api: 'org_get_from_api'
            })
        },
        watch: {
            orgs: function (newVal, oldVal) {
                this.organizations = newVal
            }
        }
    }
</script>

<style lang="scss">
</style>
  