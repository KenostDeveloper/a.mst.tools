<template>
	<div class="autocomplete">
		<ul class="autocomplete__selections">
			<li v-for="(selection, index) in selections" class="autocomplete__selection">
				<span class="autocomplete__selection-name">{{ selection }}</span>
				<svg
					@click="removeSelection(index)"
					width="14"
					height="14"
					viewBox="0 0 14 14"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					class="autocomplete__remove-icon"
					aria-hidden="true"
					data-pc-section="removetokenicon"
				>
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M7 14C5.61553 14 4.26215 13.5895 3.11101 12.8203C1.95987 12.0511 1.06266 10.9579 0.532846 9.67879C0.00303296 8.3997 -0.13559 6.99224 0.134506 5.63437C0.404603 4.2765 1.07129 3.02922 2.05026 2.05026C3.02922 1.07129 4.2765 0.404603 5.63437 0.134506C6.99224 -0.13559 8.3997 0.00303296 9.67879 0.532846C10.9579 1.06266 12.0511 1.95987 12.8203 3.11101C13.5895 4.26215 14 5.61553 14 7C14 8.85652 13.2625 10.637 11.9497 11.9497C10.637 13.2625 8.85652 14 7 14ZM7 1.16667C5.84628 1.16667 4.71846 1.50879 3.75918 2.14976C2.79989 2.79074 2.05222 3.70178 1.61071 4.76768C1.16919 5.83358 1.05367 7.00647 1.27876 8.13803C1.50384 9.26958 2.05941 10.309 2.87521 11.1248C3.69102 11.9406 4.73042 12.4962 5.86198 12.7212C6.99353 12.9463 8.16642 12.8308 9.23232 12.3893C10.2982 11.9478 11.2093 11.2001 11.8502 10.2408C12.4912 9.28154 12.8333 8.15373 12.8333 7C12.8333 5.45291 12.2188 3.96918 11.1248 2.87521C10.0308 1.78125 8.5471 1.16667 7 1.16667ZM4.66662 9.91668C4.58998 9.91704 4.51404 9.90209 4.44325 9.87271C4.37246 9.84333 4.30826 9.8001 4.2544 9.74557C4.14516 9.6362 4.0838 9.48793 4.0838 9.33335C4.0838 9.17876 4.14516 9.0305 4.2544 8.92113L6.17553 7L4.25443 5.07891C4.15139 4.96832 4.09529 4.82207 4.09796 4.67094C4.10063 4.51982 4.16185 4.37563 4.26872 4.26876C4.3756 4.16188 4.51979 4.10066 4.67091 4.09799C4.82204 4.09532 4.96829 4.15142 5.07887 4.25446L6.99997 6.17556L8.92106 4.25446C9.03164 4.15142 9.1779 4.09532 9.32903 4.09799C9.48015 4.10066 9.62434 4.16188 9.73121 4.26876C9.83809 4.37563 9.89931 4.51982 9.90198 4.67094C9.90464 4.82207 9.84855 4.96832 9.74551 5.07891L7.82441 7L9.74554 8.92113C9.85478 9.0305 9.91614 9.17876 9.91614 9.33335C9.91614 9.48793 9.85478 9.6362 9.74554 9.74557C9.69168 9.8001 9.62748 9.84333 9.55669 9.87271C9.4859 9.90209 9.40996 9.91704 9.33332 9.91668C9.25668 9.91704 9.18073 9.90209 9.10995 9.87271C9.03916 9.84333 8.97495 9.8001 8.9211 9.74557L6.99997 7.82444L5.07884 9.74557C5.02499 9.8001 4.96078 9.84333 4.88999 9.87271C4.81921 9.90209 4.74326 9.91704 4.66662 9.91668Z"
						fill="currentColor"
					></path>
				</svg>
			</li>
		</ul>
		<input
			@focus="getData"
			@blur="this.isActive = false"
			@input="getData"
			v-model="value"
			type="text"
			class="autocomplete__input"
			:placeholder="placeholder"
			:required="required"
		/>

		<ul class="autocomplete__suggestions" :class="{ active: this.isActive }">
			<li v-for="suggestion in suggestions" @click="addSelection(suggestion)" class="autocomplete__suggestion">
				{{ suggestion }}
			</li>
		</ul>
	</div>
</template>

<script>
import axios from "axios";

export default {
	name: "Autocomplete",
	props: {
		type: {
			type: String,
			default: "city",
		},
		placeholder: {
			type: String,
		},
		required: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			inputTimer: null,
            isActive: false,
			value: "",
			selections: [],
			suggestions: [],
		};
	},
	methods: {
		getData() {
			let funcChanged = null;

			switch (this.type) {
				case "city": {
					funcChanged = this.getCities;
				}
			}

			this.debounce(funcChanged, 300);
		},
		async getCities() {
			const citiesSuggestions = await axios.post(
				"http://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address",
				{
					query: this.value,
				},
				{
					headers: {
						Authorization: "Token 34e9caeb5d40781585d9b5cb3b156199fbaca4e2",
					},
				}
			);

			this.suggestions = this.filterCities(citiesSuggestions.data?.suggestions);

			if(this.suggestions.length) {
				this.isActive = true;
			} else {
				this.isActive = false;
			}
		},

		filterCities(cities) {
			return cities?.reduce((filteredCities, city) => {
				const citySplitted = city.value.split(", ");

				citySplitted.forEach(currentCity => {
					if (currentCity.startsWith("г ")) {
						const filteredCity = currentCity.split("г ")[1].trim();
						
						if(!filteredCities?.includes(filteredCity) && !this.selections?.includes(filteredCity)) {						
							filteredCities.push(filteredCity);
						}
					}
				})

				return filteredCities;
			}, []);
		},

		removeSelection(index) {
			this.selections.splice(index, 1);
		},
		addSelection(selection) {
			this.selections.push(selection);

			this.$emit('setSelections', this.selections);
		},
		debounce(func, delay) {
			clearTimeout(this.inputTimer);
			this.inputTimer = setTimeout(func, delay);
		}
	},
	mounted() {
		this.getData();
	},
};
</script>

<style lang="scss" scoped>
@import "../assets/styles/mixins.scss";

.autocomplete {
	@include flex($align: center, $gap: 15px);

	& {
		flex-wrap: wrap;
		max-width: 100%;

		background-color: #fff;
		border: 1px solid #e2e2e2;
		border-radius: 5px;

		color: #282828;
		font-size: 14px;
		font-weight: 400;
		line-height: 1.06;
		letter-spacing: 0.25px;

		height: fit-content;
		width: 100%;
		min-height: 47px;
		padding: 16px;

		position: relative;
	}

	&__selections,
	&__suggestions {
		margin: 0;
		padding: 0;
	}

	&__selections {
		@include flex($align: center, $gap: 8px);

		& {
			flex-wrap: wrap;
		}
	}

	&__selection {
		@include flex($justify: center, $align: center, $gap: 8px);

		& {
			background-color: #dee2e6;
			border-radius: 16px;
			color: #495057;

			padding: 6px 12px;
		}

		svg {
			cursor: pointer;
		}
	}

	&__input {
		flex-basis: 0;
		flex-grow: 1;
		
		border: none;
		outline: none;
		color: #495057;
		font-size: 16px;

		margin: 0;
		padding: 0;

		&::placeholder {
			color: #6c757d;
		}
	}

	&__suggestions {
		@include scrollbar;
		@include flex($direction: column);

		& {
			background-color: #fff;
			border-radius: 5px;
			box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

			width: 100%;
			max-height: 0px;

			overflow-y: auto;

			position: absolute;
			top: calc(100% + 2px);
			left: 0;
			transition-duration: 0.5s;
			z-index: 4;
		}

		&.active {
            max-height: 200px;
			padding-top: 12px;
        }
	}

	&__suggestion {
		@include flex($align: center);

		& {
			cursor: pointer;
			width: 100%;
			padding: 15px 20px;
			transition-duration: 0.3s;
		}

		&:hover {
			background-color: #e9ecef;
		}
	}
}
</style>
