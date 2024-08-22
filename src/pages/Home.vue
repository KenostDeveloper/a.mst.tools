<template>
    <div>
        AUTH OR ORGANIZATIONS
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'

    export default {
        name: 'Home',
        data () {
            return { }
        },
        components: { },
        computed: {
            ...mapGetters({
                getUser: 'user/getUser'
            })
        },
        mounted () {
            this.setUser(JSON.parse(localStorage.getItem('user')))
            if (this.getUser) {
            this.$router.push({ name: 'organizations' })
            }
        },
        methods: {
            ...mapActions({
                setUser: 'user/setUser',
                deleteUser: 'user/deleteUser'
            })
        }
    }
</script>

<style lang="scss">
</style>
  