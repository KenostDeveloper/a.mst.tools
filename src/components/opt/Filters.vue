<template>
    <div @click="fromOrder" class="kenost-filter" :class="{ show: show }">
        <div class="kenost-filter-modal" @click.stop>
            <div class="kenost-filter__title">Все фильтры</div>
            <div class="kenost-filter__scroll">
                <div v-for="(filter, index) in filters" :key="index" class="filter-group" :class="{ 'filter-input': filter.type === 'number' }">
                    <template v-if="filter.type === 'checkbox'">
                        <Checkbox v-model="filter.value" :inputId="'input' + index" :value="1" />
                        <label :for="'input' + index" class="ml-2 mb-0">{{ filter.label }}</label>
                    </template>
                    <template v-else-if="filter.type === 'number'">
                        <label :for="'input' + index" class="block">{{ filter.label }}</label>
                        <InputNumber v-model="filter.value" :min="filter.min" :max="filter.max" class="block mt-1" />
                    </template>
                </div>
            </div>
            <div class="kenost-filter__buttons">
                <button type="reset" class="a-dart-btn a-dart-btn-secondary-outline" @click="resetFilters">Сбросить</button>
                <button type="button" class="a-dart-btn a-dart-btn-primary showModalFiltrs" @click="setFilters">Показать товары</button>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, watch } from 'vue';
import Checkbox from 'primevue/checkbox';
import InputNumber from 'primevue/inputnumber';

export default {
    name: "Filters",
    props: {
        show: {
            type: Boolean,
            default: false
        }
    },
    components: {
        Checkbox,
        InputNumber
    },
    emits: ['setShow', 'setFilter'],
    setup(props, { emit }) {
        const filters = ref([
            { type: 'checkbox', key: 'negative', label: 'Отрицательный прогноз остатков', value: false },
            { type: 'number', key: 'days_forecast', label: 'Кол-во дней для прогноза остатков', value: 5, min: 1, max: 30 },
            { type: 'number', key: 'days', label: 'Кол-во дней для расчета', value: 30, min: 1, max: 90 },
            { type: 'checkbox', key: 'only_warehouse', label: 'Только товары склада покупателя', value: false },
            { type: 'checkbox', key: 'only_purchases', label: 'Только товары с продажами', value: false }
        ]);

        const fromOrder = () => {
            emit('setShow');
        };

        const setFilters = () => {
            emit('setFilters', filters.value);
        };

        const resetFilters = () => {
            filters.value.forEach(filter => {
                if (filter.type === 'checkbox') {
                    filter.value = false;
                } else if (filter.type === 'number') {
                    filter.value = filter.value;
                }
            });
        };

        watch(() => props.show, (newVal) => {
            document.body.style.overflow = newVal ? 'hidden' : '';
        });

        return {
            filters,
            fromOrder,
            resetFilters,
            setFilters
        };
    }
};
</script>

<style lang="scss">
.kenost-filter{
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    background: rgba($color: #000000, $alpha: 0);
    transition: all 0.3s ease-in-out;
    pointer-events: none;

    &.show{
        background: rgba($color: #000000, $alpha: 0.5);
        pointer-events: all;

        .kenost-filter-modal{
            transform: translateX(0%);
        }
    }

    &-modal{
        background: #FFF;
        height: 100vh;
        width: 500px;
        padding: 60px 40px;
        transition: all 0.3s ease-in-out;
        transform: translateX(-100%);
    }

    &__title{
        font-size: 20px;
        font-style: normal;
        font-weight: 500;
        line-height: 24px;
        color: var(--secondary-color);
    }

    &__scroll{
        overflow-y: auto;
        padding-top: 30px;
        height: calc(100dvh - 210px);
    }

    &__buttons{
        display: flex;
        gap: 12px;
        position: absolute;
        width: 100%;
        left: 0;
        bottom: 0;
        padding: 20px 40px 60px 40px;

        button{
            width: 100%;
        }
    }

    .filter-group{
		margin-bottom: 30px;
	}

	.filter-input{
		display: flex;
		flex-direction: column;
		gap: 8px;
		align-items: start;
	}
}
</style>
