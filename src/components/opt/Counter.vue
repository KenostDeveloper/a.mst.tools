<template>
	<div class="k-quantity" :class="{ mini: mini }">
		<form class="k-quantity__wrap" @submit.prevent="submit">
			<div class="k-quantity__btn" @click="onMinus">
				<i class="pi pi-minus"></i>
			</div>
			<!-- <InputNumber class="k-quantity__counter" :step="1" :min="this.d_min" :max="this.d_max" v-model="this.d_value"/> -->
			<input
				@input="onEmit"
				type="number"
				v-model="this.d_value"
				class="k-quantity__counter"
				:min="this.d_min"
				name="count"
				:value="this.d_value"
				:step="d_step"
				:max="this.max"
			/>
			<div class="k-quantity__btn pls" @click="onPlus">
				<i class="pi pi-plus"></i>
			</div>
		</form>
	</div>
	<Dialog v-model:visible="this.modal_remain" header=" " :style="{ width: '340px' }">
        <div class="kenost-not-produc">
            <img src="/images/icons_milen/outOfStock2.png" alt="">
            <b>У нас нет столько товаров :(</b>
            <p>Извините, но количество данного товара ограничено</p>
            <div class="a-dart-btn a-dart-btn-primary" @click="this.modal_remain = false">Понятно</div>
        </div>
    </Dialog>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import Dialog from 'primevue/dialog'
// import InputNumber from 'primevue/inputnumber'

export default {
	name: "Counter",
	emits: ["ElemCount"],
	props: {
		min: {
			type: Number,
			default: 0,
		},
		max: {
			type: Number,
			default: 999999999,
		},
		value: {
			type: Number,
			default: 0,
		},
		id: {
			type: Number,
			default: 0,
		},
		store_id: {
			type: Number,
			default: 0,
		},
		index: {
			type: Number,
			default: 0,
		},
		mini: {
			type: Boolean,
			default: false,
		},
		item: {
			type: Object,
			default: {},
		},
		step: {
			type: Number,
			default: 1
		}
	},
	data() {
		return {
			loading: true,
			d_min: this.min,
			d_max: this.max,
			d_value: this.value,
			d_step: this.step,
			modal_remain: false
		};
	},
	methods: {
		...mapActions([]),
		submit(){

		},
		onMinus() {
			// Уменьшаем на шаг
			let newValue = this.d_value - this.d_step;
			if (newValue < this.d_min) {
				newValue = this.d_min;
			}
			if (newValue % this.d_step !== 0) {
				newValue = Math.floor(newValue / this.d_step) * this.d_step;
			}
			this.d_value = newValue;
			this.debouncedSend();
		},
		onPlus() {
			let newValue = Number(this.d_value) + Number(this.d_step);
			if (newValue > this.d_max) {
				newValue = this.d_max;
				this.modal_remain = true
			}
			if (newValue % this.d_step !== 0) {
				newValue = Math.floor(newValue / this.d_step) * this.d_step;
			}
			this.d_value = newValue;
			this.debouncedSend();
		},
		onEmit(e) {
			// Проверяем, что значение не меньше минимального
			if (this.d_value < this.d_min) {
				this.d_value = this.d_min;
			}
			if (this.d_value > this.d_max) {
				this.d_value = this.d_max;
			}
			// Округляем значение до кратности шагу
			if (this.d_value % this.d_step !== 0) {
				this.d_value = Math.floor(this.d_value / this.d_step) * Number(this.d_step);
			}
			this.debouncedSend();
		},
		send(){
			const data = {
				value: this.d_value,
				old_value: this.value,
				id: this.id,
				store_id: this.store_id,
				max: this.d_max,
				min: this.d_min,
				index: this.index,
				item: this.item,
			};
			this.$emit("ElemCount", data);
		}
	},
	mounted() {},
	components: {
		Dialog
	},
	computed: {
		...mapGetters([]),
		debouncedSend: function () {
			return _.debounce(this.send, 500)
		}
	},
	watch: {
		value(newValue) {
			this.d_value = newValue;
		}
	}
};
</script>
<style lang="scss">
.k-quantity {
	width: 86px;
	height: 34px;

	&.mini {
		width: 64px;
		height: 22px;

		&__counter {
			font-size: 14px;
			font-weight: 500;
		}

		.pi {
			font-size: 14px;
			color: #acabab;
		}
	}

	&__wrap {
		display: flex;
		align-items: center;
		height: 100%;
		width: 100%;
		background: #f8f7f5;
	}

	&__btn {
		height: 100%;
		width: 33%;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
	}

	&__counter {
		height: 100%;
		width: 34%;
		text-align: center;
		background: #f8f7f5;
		border: none;
		outline: none;
	}

	&__counter::-webkit-outer-spin-button,
	&__counter::-webkit-inner-spin-button {
		-webkit-appearance: none;
	}
}
</style>
