<script>
export default {
    name: 'SearchInput',
    inheritAttrs: false,
    props: {
        modelValue: {
            default: ''
        },
        onSubmit: {
            type: Function,
            default: () => { }
        }
    },
    data() {
        return {
            value: this.modelValue || '',
        }
    },
    watch: {
        modelValue: {
            handler(newVal) {
                this.value = newVal;
            },
            deep: true
        },
        value: {
            handler(newVal) {
                this.$emit('update:modelValue', newVal);
            },
            deep: true
        }
    }
}
</script>

<template>
    <form class="d-search registration-address__search" @submit.prevent="onSubmit">
        <i class="d-icon-search d-search__icon"></i>
        <input v-bind="$attrs" v-model="value" type="text" placeholder="Найти адрес доставки" class="d-search__field" />
        <button type="submit"
            class="d-button d-button-primary d-button-primary-small box-shadow-none d-search__button">Найти</button>

        <slot></slot>
    </form>
</template>

<style lang="scss" scoped></style>