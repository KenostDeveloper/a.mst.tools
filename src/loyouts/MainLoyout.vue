<template>
    <Sitebar v-if="this.getUser" :active="this.sitebar"/>
    <div class="content dart_container">
        <div class="dart_wrapper">
            <router-view>

            </router-view>
        </div>
    </div>
</template>
  
<script>
import Sitebar from '../components/Sitebar.vue';
import { mapGetters, mapActions } from 'vuex'

export default {
    name: 'MainLoyout',
    data () {
        return {
            isUser: false,
            sitebar: false
        }
    },
    components: { Sitebar },
    computed: {
        ...mapGetters({
            getUser: 'user/getUser'
        })
    },
    mounted () {
        this.setUser(JSON.parse(localStorage.getItem('user')))
        const sidebarCookie = Number(this.$cookies.get('sidebar_active'))
        if(sidebarCookie === 1){
            this.sitebar = true
        }
    },
    updated() {
    },
    methods: {
        ...mapActions({
            setUser: 'user/setUser',
            deleteUser: 'user/deleteUser'
        })
    }
}

</script>
  
<style scoped>

</style>