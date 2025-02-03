<template>
    <div class="kenost-full-loading loading">

    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Breadcrumbs from '../components/Breadcrumbs.vue'
import Dialog from 'primevue/dialog';


export default {
	data() {
		return {

		};
	},
	methods: {
		...mapActions([
			
		]),
	},
	mounted() {
		
	},
	computed: {
		...mapGetters({
            getUser: "user/getUser",
        })
    },
	components: {
        Breadcrumbs,
        Dialog
    },
	watch: {
		getUser: function (newVal, oldVal) {
            this.login = newVal.username
        }
	}
};
</script>

<style lang="scss"></style>
