<template>
    <button :class="[
        'd-button',
        `d-button-${variant}`,
        size ? `d-button-${size}` : '',
        classes
    ]" v-bind="$attrs" :disabled="disabled || isLoading">
        <i v-if="isLoading" class="pi pi-spin pi-spinner" style="font-size: 14px"></i>
        <slot />
    </button>
</template>

<script>
export default {
    name: 'Button',
    props: {
        disabled: {
            type: Boolean,
            default: false
        },
        variant: {
            type: String,
            default: 'primary',
            validator(value) {
                return ['primary', 'secondary', 'tertiary', 'link'].includes(value)
            }
        },
        size: {
            type: String,
            default: null,
            validator(value) {
                return ['small'].includes(value)
            }
        },
        isLoading: {
            type: Boolean,
            default: false
        },
        classes: {
            type: String,
            default: ''
        }
    }
}
</script>

<style lang="scss"></style>