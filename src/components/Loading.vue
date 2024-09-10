<template>
	<div class="loading-page">
        <div class="loading-page__content">
            <div class="loading"></div>
            <p>{{ whois[0] }}</p>
        </div>
    </div>
</template>

<script>
export default {
    name: "Loading",
	props: {
	},
    data() {
        return {
            whois: ['Почти готово...', 'Подгружаем данные...', 'Идёт загрузка...']
        }
    },
	methods: {
		pollPerson(){
            const first = this.whois.shift();
            this.whois = this.whois.concat(first);
        }
	},
	watch: {
		
	},
    mounted() {
        window.setInterval(()=>{
            this.pollPerson();
        }, 2500);
    }
};
</script>

<style lang="scss" scoped>

</style>
