<template>
	<div :class="{ 'std-accordion': true, 'std-accordion--expanded': this.isExpanded }">
		<div class="std-accordion__header" @click="toggleExpanded">
			<slot name="header">
				{{ title }}
				<button class="std-accordion__button">
					<img src="../assets/images/icons/arrow.svg" class="std-accordion__img" />
				</button>
			</slot>
		</div>
		<div class="std-accordion__content">
			<slot></slot>
		</div>
	</div>
</template>

<script>
import { ref } from "vue";

export default {
	setup() {
		let isExpanded = ref(false);

		return {
			isExpanded,
		};
	},
	props: {
		title: {
			type: String,
			required: false,
		},
	},
	methods: {
		toggleExpanded() {
			this.isExpanded = !this.isExpanded;
		},
	},
};
</script>

<style lang="scss" scoped>
.std-accordion {
	display: flex;
	flex-direction: column;

	&--expanded {
        & > .std-accordion__header {
            .std-accordion__img {
                rotate: -90deg;
            }
        }

		& > .std-accordion__content {
			height: auto;
		}
	}

	&:not(.std-accordion--expanded) {
		.std-accordion__content {
			overflow: hidden;
		}
	}

	&__header {
		cursor: pointer;

		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 15px;

		width: 100%;
	}

	&__button {
		cursor: pointer;

		background: none;
		border: none;
		outline: none;
	}

	&__img {
		transition-duration: 0.3s;
		rotate: 90deg;
	}

	&__content {
		display: flex;
		flex-direction: column;

		height: 0px;
		transition: height 0.3s ease-in-out;
	}
}
</style>
