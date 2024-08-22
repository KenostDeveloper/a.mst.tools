<template>
    <Sitebar />
    <div class="container">
        <div class="card">
            <h2>Card title</h2>
            <p>Card content</p>
        </div>
        <router-view>

        </router-view>
    </div>
</template>
  
<script>
import Sitebar from '../components/Sitebar.vue';

export default {
    name: 'MainLoyout',
    components: { Sitebar }
}

</script>
  
<style scoped>

</style>