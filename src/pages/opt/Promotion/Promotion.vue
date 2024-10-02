<template>
    <Loading v-if="this.loading" />
    <div v-else class="dart-custom-grid" :class="{ loading: loading }">
        <!-- <CatalogMenu :items="opt_catalog" /> -->
        <div class="d-col-content promotion__wrapper">
            <div class="dart-home dart-window">
                <div>
                    <section class="promotion">
                        <header class="promotion__header promotion-header">
                            <button class="promotion__back-button" @click="$router.go(-1)">
                                <i class="pi pi-angle-left"></i>
                                Назад
                            </button>
                            <div class="promotion-header__content">
                                <img :src="site_url_prefix + actions?.image" class="promotion-header__img" />
                            </div>
                        </header>
                        <main class="promotion__main promotion-main">
                            <div class="promotion-main__content">
                                <div class="promotion__title-container">
                                    <h2 class="promotion__title">{{ actions?.name }}</h2>
                                    <!-- <p class="promotion__span">
										дополнительная скидка <b>6%</b> на всю линейку Интерскол! (test data)
									</p> -->
                                    <p class="promotion__description">
                                        {{ actions?.description }}
                                    </p>
                                </div>
                                <div class="promotion-main__card-container">
                                    <div class="promotion-main__card-container promotion-main__card-container--horizontal">
                                        <PromotionCard class="w-max f-basis-auto" title="Даты проведения" :text="new Date(actions?.date_from).toLocaleString('ru', this.options) + ' - ' + new Date(actions?.date_to).toLocaleString('ru', this.options)" />

                                        <PromotionCard v-if="actions?.award != ''" class="w-fit" title="Вознаграждение" :text="actions?.award" />
                                    </div>
                                    <div class="promotion-main__card-container promotion-main__card-container--horizontal">
                                        <PromotionCard title="Совместимость скидок" :text="actions?.compatibility_discount === 1 ? 'Совместим со всеми акциями' : actions?.compatibility_discount === 2 ? 'Не совместим со всеми акциями' : actions?.compatibility_discount === 3 ? 'Применяется большая скидка' : 'Складывается с выбранными акциями'" />
                                        <PromotionCard title="Совместимость отсрочек" :text="actions?.compatibility_postponement === 1 ? 'Совместим со всеми отсрочками' : actions?.compatibility_postponement === 2 ? 'Не совместим со всеми отсрочками' : 'Применяется большая отсрочка'" />
                                    </div>
                                </div>
                            </div>

                            <TableCatalogAction @updateBasket="updateBasket" v-if="actions" :items="actions" />
                        </main>
                    </section>
                </div>
            </div>
        </div>
        <!-- <div class="d-col-map"> -->
			<!-- <Vendors :items="this.opt_vendors" /> -->
			<Basket @actionUpdate="actionUpdate" ref="childComponent" @toOrder="toOrder" />
		<!-- </div> -->
    </div>
    <Toast />
    <!-- <OrderModal :show="show_order" @fromOrder="fromOrder" /> -->
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import CatalogMenu from '../../../components/opt/CatalogMenu.vue';
import Basket from '../../../components/opt/Basket.vue';
import Vendors from '../../../components/opt/Vendors.vue';
import OrderModal from '../../../components/opt/OrderModal.vue';
import PromotionCard from './PromotionCard.vue';
import router from '../../../router';
import TableCatalogAction from '../../../components/opt/TableCatalogAction.vue';
import Toast from 'primevue/toast';
import Loading from '../../../components/Loading.vue';
import Breadcrumbs from '../../../components/Breadcrumbs.vue';

export default {
    name: 'Promotion',
    props: {},
    data() {
        return {
            show_order: false,
            loading: true,
            loading_elems: [],
            reloading: false,
            opt_mainpage: {},
            opt_catalog: {},
            opt_vendors: {},
            opt_products: {},
            page: 1,
            perpage: 25,
            options: {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }
        };
    },
    components: {
        CatalogMenu,
        Basket,
        Vendors,
        OrderModal,
        PromotionCard,
        TableCatalogAction,
        Toast,
        Loading,
        Breadcrumbs
    },
    mounted() {
        this.get_opt_catalog_from_api().then(() => {
            this.opt_catalog = this.optcatalog;
            this.loading_elems.push('load');
            this.loadingCheack(3);
        });
        this.get_opt_vendors_from_api().then(() => {
            this.opt_vendors = this.optvendors;
            this.loading_elems.push('load');
            this.loadingCheack(3);
        });
        this.get_sales_to_api({
            id: router.currentRoute._value.params.sales_id,
            actionid: router.currentRoute._value.params.action
        }).then((res) => {
            if (!res.data.success) {
                this.$toast.add({
                    severity: 'info',
                    summary: 'Ошибка',
                    detail: res.data.data.message,
                    life: 3000
                });
                setTimeout(() => {
                    this.$router.go(-1);
                }, 1000);
            }
            this.loading_elems.push('load');
            this.loadingCheack(3);
        });
    },
    updated() {
        // this.get_opt_catalog_from_api().then((this.opt_catalog = this.optcatalog))
        // this.get_opt_vendors_from_api().then((this.opt_vendors = this.optvendors))
        // this.get_sales_to_api({
        //   id: router.currentRoute._value.params.sales_id,
        //   actionid: router.currentRoute._value.params.action
        // })
    },
    unmounted() {},
    methods: {
        ...mapActions(['get_opt_mainpage_from_api', 'get_opt_catalog_from_api', 'get_opt_vendors_from_api', 'get_sales_to_api']),
        updatePage(categoryId) {
            this.loading = true;
            this.get_opt_catalog_from_api().then((this.opt_catalog = this.optcatalog));
            this.get_opt_vendors_from_api().then((this.opt_vendors = this.optvendors));
            this.loading = false;
        },
        loadingCheack(num) {
            if (this.loading_elems.length == num) {
                this.loading = false;
            }
        },
        updateBasket() {
            this.$refs.childComponent.updateBasket();
        },
        toOrder() {
            this.show_order = true;
        },
        fromOrder() {
            this.show_order = false;
        },
        actionUpdate() {
            this.get_sales_to_api({
                id: router.currentRoute._value.params.sales_id,
                actionid: router.currentRoute._value.params.action
            });
        }
    },
    computed: {
        ...mapGetters(['mainpage', 'optcatalog', 'optvendors', 'actions']),
        pageCount() {
            return Math.ceil(this.opt_products.total / this.perpage);
        }
    },
    watch: {
        optcatalog: function (newVal, oldVal) {
            this.opt_catalog = newVal;
        },
        optvendors: function (newVal, oldVal) {
            this.opt_vendors = newVal;
        },
        $route() {
            this.updatePage(this.$route.params.category_id);
        }
    }
};
</script>
<style lang="scss">
.promotion {
    display: flex;
    justify-content: center;
    flex-direction: column;
    gap: 40px;
    padding: 24px;

    &__header,
    .header {
        display: flex;
        justify-content: space-between;
        gap: 10px;

        &__content {
            display: flex;
            flex-direction: column;
            gap: 16px;

            // width: 50%;
        }

        &__title-container {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        &__title {
            margin: 0;
        }

        &__img {
            // border-radius: 5px;
            // height: 160px;
            // width: 286px;
            // object-fit: cover;
        }
    }
    &__main,
    .main {
        display: flex;
        flex-direction: column;
        gap: 40px;

        &__card-container {
            display: grid;
            grid-template: auto / repeat(2, 1fr);
            gap: 13px;
        }
    }
}
</style>
