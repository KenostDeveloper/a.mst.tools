<script>
import { IMaskDirective } from 'vue-imask';

export default {
    name: 'Input',
    inheritAttrs: false,
    props: {
        modelValue: {
            default: ''
        },
        type: {
            type: String,
            default: 'text'
        },
        classes: {
            type: String,
            default: ''
        },
        iconType: {
            type: String,
            default: ''
        },
        errorText: {
            type: String,
            default: ""
        },
        mask: {
            type: Object,
            default: null
        }
    },
    directives: {
        imask: IMaskDirective
    },
    data() {
        return {
            value: this.modelValue,
            showPassword: false,
        };
    },
    methods: {
    },
    computed: {
        inputType() {
            if (this.iconType !== 'password') return this.type;
            return this.showPassword ? 'text' : 'password'
        }
    },
    watch: {
        value: {
            handler(newVal) {
                this.$emit('update:modelValue', newVal);
            },
            deep: true
        }
    }
};
</script>

<template>
    <div class="d-input__wrapper">
        <div :class="{ 'd-input': true, 'd-input--active': value, 'd-input--error': errorText }">
            <!-- Input -->
            <input v-bind="$attrs" v-model="value" v-imask="mask" ref="input" :type="inputType" :class="`d-input__field ${classes}`" />

            <!-- Reset value button -->
            <button v-if="iconType === 'close' && value" type="button" class="d-close d-input__button"
                :class="{ 'd-input__button--active': !!value }" @click="value = ''">
                <i class="d-icon-times d-close__icon"></i>
            </button>

            <!-- Toggle password visibility button -->
            <button v-if="iconType === 'password' && value" type="button"
                :class="`d-input__button ${showPassword ? 'd-show d-input__show' : 'd-show-alt'}`"
                @click="showPassword = !showPassword">
                <i :class="showPassword ? 'd-icon-eye d-show__icon' : 'd-icon-eye d-show-alt__icon'"></i>
            </button>

            <slot></slot>
        </div>

        <!-- Error messages -->
        <div v-if="errorText" class="d-input-error">
            <i class="d-icon-warning d-input-error__icon"></i>
            <span class="d-input-error__text">
                {{ errorText }}
            </span>
        </div>
    </div>
</template>

<style lang="scss"></style>
