<template>
    <Sitebar v-if="this.getUser" :active="this.sitebar"/>
    <div class="content" :class='{"white": this.namePathIsNav == "purchases"}'>
        <div class="dart_container_wrap">
            <Nav v-if="namePathIsNav == 'purchases'" />
            <div class="dart_wrapper">
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

export default {
    name: 'MainLoyout',
    data () {
        return {
            isUser: false,
            sitebar: false,
            namePathIsNav: null
        }
    },
    components: { Sitebar, Nav },
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

        this.namePathIsNav = router?.currentRoute?._value.matched[4]?.name
    },
    updated () {
        // this.setUser(JSON.parse(localStorage.getItem('user')))
        this.namePathIsNav = router?.currentRoute?._value.matched[4]?.name
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
    .dart_container_wrap{
        max-width: 1920px;
        width: 100%;
        padding-left: 12px;
        padding-right: 12px;
    }
</style>