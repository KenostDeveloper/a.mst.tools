<script>
export default {
    name: "Modal",
    inheritAttrs: false,
    props: {
        isActive: {
            type: Boolean,
            default: false,
        },
        wrapperClasses: {
            type: String,
            default: '',
        }
    },
    emits: ['close'],
    setup() {
        return {}
    },
    mounted() {
        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.$emit('close');
            }
        })
    }
}
</script>

<template>
    <div class="d-modal__wrapper" @click="$emit('close')">
        <div v-bind="$attrs" class="d-modal" :class="{ 'd-modal--active': isActive }" @click.stop>
            <button class="d-modal__close" @click="$emit('close')">
                <i class="d-icon-times d-modal__icon"></i>
            </button>
            <div class="d-modal__content">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>