<template>
	<div class="marker" @click="isClicked = !isClicked">
		<img :src="isHovered ? '/images/icons/marker-active.svg' : '/images/icons/marker.svg'" class="marker__icon"
			@mouseenter="isHovered = true" @mouseleave="isHovered = false">
		<div :class="{ 'marker__content': true, 'marker__content--visible': !isClicked }">
			<p class="marker__text">{{ text || "Ничего не найдено :(" }}</p>
		</div>
	</div>
</template>

<script lang="ts">
import { Ref, defineComponent, ref } from "vue";

export default defineComponent({
	setup() {
		let isClicked: Ref<boolean> = ref(false);
		let isHovered: Ref<boolean> = ref(false);

		return {
			isClicked,
			isHovered,
		};
	},
	name: "MapMarker",
	props: {
		text: {
			type: String,
			default: "",
		},
	}
});
</script>

<style lang="scss" scoped>
// .marker {
// 	cursor: pointer;

// 	background: none;
// 	border: none;

// 	position: relative;
// 	translate: -50% -75%;

// 	height: 47.5px;
// 	width: 38px;

// 	&::after {
// 		display: none;
// 	}

// 	&__icon {
// 		position: absolute;
// 		top: 50%;
// 		left: 50%;
// 		translate: -50% -50%;
// 		width: inherit;
// 		height: inherit;
// 	}

// 	&__content {
// 		background-color: var(--color-red);
// 		border-radius: 16px;

// 		position: absolute;
// 		left: 100%;

// 		transition-duration: var(--transition-duration);
// 		overflow: hidden;

// 		padding: 8px;
// 		width: max-content;
// 		max-width: 200px;
// 	}

// 	&__text {
// 		color: var(--color-white);
// 		font-size: 12px;
// 		line-height: normal;
// 		text-align: left;
// 		margin: 0;
// 	}
// }</style>
