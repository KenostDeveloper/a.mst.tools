<template>
    <div class="k-quantity" :class="{ mini: mini }">
        <form method="post" class="ms2_form form-inline" role="form">
            <input type="hidden" name="key">
            <div class="k-quantity__btn" @click="onMinus">
                <i class="pi pi-minus"></i>
            </div>
            <!-- <InputNumber class="k-quantity__counter" :step="1" :min="this.d_min" :max="this.d_max" v-model="this.d_value"/> -->
            <input @input="onEmit" type="number" v-model="this.d_value" class="k-quantity__counter" :min="this.d_min" :max="this.d_max" name="count" :value="this.d_value">
            <div class="k-quantity__btn pls" @click="onPlus">
                <i class="pi pi-plus"></i>
            </div>
        </form>
    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
// import InputNumber from 'primevue/inputnumber'

export default {
  name: 'Counter',
  emits: ['ElemCount'],
  props: {
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 999999999
    },
    value: {
      type: Number,
      default: 0
    },
    id: {
      type: Number,
      default: 0
    },
    store_id: {
      type: Number,
      default: 0
    },
    index: {
      type: Number,
      default: 0
    },
    mini: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      loading: true,
      d_min: this.min,
      d_max: this.max,
      d_value: this.value
    }
  },
  methods: {
    ...mapActions([
    ]),
    onMinus () {
      if (this.d_value > this.d_min) {
        this.d_value = this.d_value - 1
      }
      const data = {
        value: this.d_value,
        id: this.id,
        store_id: this.store_id,
        max: this.d_max,
        index: this.index
      }
      this.$emit('ElemCount', data)
    },
    onPlus () {
      if (this.d_value < this.d_max) {
        this.d_value = Number(this.d_value) + 1
      }
      const data = {
        value: this.d_value,
        id: this.id,
        store_id: this.store_id,
        max: this.d_max,
        index: this.index
      }
      this.$emit('ElemCount', data)
    },
    onEmit () {
      const data = {
        value: this.d_value,
        id: this.id,
        store_id: this.store_id,
        max: this.d_max,
        index: this.index
      }
      this.$emit('ElemCount', data)
    }
  },
  mounted () {
  },
  components: {
    // InputNumber
  },
  computed: {
    ...mapGetters([
    ])
  }
}
</script>
<style lang="scss">
    .k-quantity{
        width: 86px;
        height: 34px;

        &.mini{
          width: 64px;
          height: 22px;

          &__counter{
            font-size: 14px;
            font-weight: 500;
          }

          .pi{
            font-size: 14px;
            color: #ACABAB;
          }
        }

        form{
            display: flex;
            align-items: center;
            height: 100%;
            width: 100%;
            background: #F8F7F5;
        }

        &__btn{
            height: 100%;
            width: 33%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        }

        &__counter{
          height: 100%;
          width: 34%;
          text-align: center;
          background: #F8F7F5;
          border: none;
          outline: none;
        }

        &__counter::-webkit-outer-spin-button,
        &__counter::-webkit-inner-spin-button {
          -webkit-appearance: none;
        }
    }
</style>
