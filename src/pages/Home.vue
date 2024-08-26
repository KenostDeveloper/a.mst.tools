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
        mounted () {
            console.log("----------------", this.getUser)
            this.setUser(JSON.parse(localStorage.getItem('user')))
            if(this.getUser){
                console.log("ПЕРЕБРОС НА ПЕРВУЮ ПОПАВШУЮСЯ ОРГАНИЗАЦИЮ")
                //TODO: ПЕРЕБРОС НА ПЕРВУЮ ПОПАВШУЮСЯ ОРГАНИЗАЦИЮ
                const data = {
                    action: 'get/orgs'
                }
                this.org_get_from_api(data).then((res) => {
                    if(res.data.data){
                        this.$router.push({ name: 'org', params: { id: res.data.data[0].id } })
                    }
                })
            }
        },
        updated () {
            console.log("----------------", this.getUser)
            if(this.getUser){
                console.log("ПЕРЕБРОС НА ПЕРВУЮ ПОПАВШУЮСЯ ОРГАНИЗАЦИЮ")
                //TODO: ПЕРЕБРОС НА ПЕРВУЮ ПОПАВШУЮСЯ ОРГАНИЗАЦИЮ
                const data = {
                    action: 'get/orgs'
                }
                this.org_get_from_api(data).then((res) => {
                    if(res.data.data){
                        this.$router.push({ name: 'org', params: { id: res.data.data[0].id } })
                    }
                })
            }
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
  