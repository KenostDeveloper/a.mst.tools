<template>
  <div class="dart-row dart-align-items-center">
    <div class="d-col-md-3" v-for="(item, index) in filters" :key="index">
      <div class="form_input_group input_pl input-parent required" v-if="item.type == 'text'">
          <input
          type="text"
          :id="index"
          :placeholder="item.label"
          :name="index"
          class="dart-form-control"
          v-model="dataFilter[index]"
          @input="setFilter"
          />
          <label for="product_filter_name" class="s-complex-input__label">{{ item.label }}</label>
          <div class="form_input_group__icon">
              <i class="d_icon d_icon-search"></i>
          </div>
      </div>
      <div class="form_input_group required" v-else-if="item.type == 'select'">
        <select :name="index" :id="index" class="dart-form-control" v-model="dataFilter[index]">
          <option value=""></option>
          <option
            :value="option.id"
            v-for="(option, i) in item.data"
            :key="i"
          >
            {{ option.name }}
          </option>
        </select>
      </div>
      <!-- DATE Filter -->
    </div>
  </div>
</template>

<script>
// import { DatePicker } from 'v-calendar'

export default ({
  name: 'tableFilter',
  props: {
    filters: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      dataFilter: {
        from: new Date(),
        to: new Date()
      }
    }
  },
  components: {
    // DatePicker
  }
})
</script>

<style lang="scss">
</style>
