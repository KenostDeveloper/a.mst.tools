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
		...mapActions({
			setUser: 'user/setUser',
			deleteUser: 'user/deleteUser',
			getSessionUser: 'user/getSessionUser',
			org_get_from_api: 'org_get_from_api'
		}),
		...mapActions('user', ['edit_profile'])
	},
	async mounted() {
		console.log("Hash из параметров маршрута:", this.$route.params.hash);

		if (this.$route.params.hash) {
			try {
				const res = await this.edit_profile({
					action: 'profile/edit/confirm',
					hash: this.$route.params.hash
				});

				if (!res.data.data.success) {
					this.$router.push({ name: "main" });
				}

				if (this.getUser) {
					const orgs = await this.org_get_from_api({
						action: 'get/orgs'
					});

					if (orgs !== undefined) {
						await this.$router.push({ 
							name: 'profile', 
							params: { id: orgs.data.data[0].id }, 
							query: { update: 'true' } 
						});
					} else {
						this.$router.push({ name: "main" });
					}
				}
			} catch (error) {
				this.$router.push({ name: "main" });
			}
		} else {
			this.$router.push({ name: "main" });
		}
	},
	computed: {
		...mapGetters({
            getUser: 'user/getUser',
            orgs: 'orgs'
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
