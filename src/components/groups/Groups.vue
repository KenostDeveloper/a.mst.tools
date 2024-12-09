<template>
	<div class="flex align-items-center justify-content-space-between mb-4">
        <div class="title-h1">Мои коллекции</div>
        <RouterLink
            :to="{ name: 'groups_edit', params: { id: $route.params.id } }"
            class="dart-btn dart-btn-primary"
            >Создать коллекцию</RouterLink
        >
    </div>
	<div class="dart-alert dart-alert-info">На данной странице Вы можете создать Коллекции товаров, которые будут сгруппированы по какому либо признаку. Таким образом, Вы сможете упростить создание Акций.</div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import router from "../../router";
import { RouterLink } from "vue-router";

export default {
	name: "Groups",
	props: {

	},
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
	components: {
		
	},
	computed: {
		...mapGetters([""]),
	},
	watch: {
	},
};
</script>

<style lang="scss">

</style>
