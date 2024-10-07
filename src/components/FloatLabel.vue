<template>
    <div ref="floatLabel" class="std-float-label" :class="{ 'std-float-label--active': this.isActive }">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: "FloatLabel",
    data() {
        return {
            isActive: false
        }
    },
    mounted() {
        this.$refs.floatLabel.querySelector('input').addEventListener('focus', () => {
            this.isActive = true
        })
        this.$refs.floatLabel.querySelector('input').addEventListener('input', (e) => {
            if (e.target.value) {
                this.isActive = true
            } else {
                this.isActive = false
            }
        })
    },
}
</script>

<style lang="scss">
.std-float-label {
	position: relative;

	:is(input:focus, .std-float-label--active input) + label {
		top: 0;
		left: 10px !important;
		transform: translate(0, 50%) scale(0.75);
	}

	label {
		position: absolute;
		top: 50%;
		left: 0;
		translate: 0 -50%;
		pointer-events: none;
		transition: all 0.2s ease;
		z-index: 2;
	}
}
</style>