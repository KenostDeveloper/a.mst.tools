<template>
	<div
		:class="{
			'std-empty-dialog__overlay': true,
			'std-empty-dialog__overlay--active': this.isOpened,
		}"
		@click="$emit('close')"
	>
		<div class="std-empty-dialog" @click.stop>
			<slot></slot>
		</div>
	</div>
</template>

<script>
export default {
    name: "EmptyDialog",
	props: {
		visible: {
			type: Boolean,
			default: false,
		}
	},
    data() {
        return {
            isOpened: false,
        }
    },
	methods: {
		toggleIsOpened(state = !this.isOpened) {
			this.isOpened = state;

			if(this.isOpened)
				document.body.style.overflow = "hidden";
			else
				document.body.style.overflow = "auto";
		},
	},
	watch: {
		visible(state) {
			this.toggleIsOpened(state);
		}
	}
};
</script>

<style lang="scss" scoped>
.std-empty-dialog {
	background-color: #fff;
	border-radius: 7px;
	padding: 48px 55px;

	max-height: 80dvh;
	max-width: 90%;
	
	&__overlay {
		display: flex;
		justify-content: center;
		align-items: center;

		background-color: rgba(0, 0, 0, 0.5);

		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;

		height: 100dvh;
		width: 100vw;

		transition-duration: 0.3s;
		z-index: 1000;

		&:not(.std-empty-dialog__overlay--active) {
			visibility: hidden;
			opacity: 0;
		}
	}
}
</style>
