<template>
  <td>
    <div class="cell_value" v-if="cell_data.type == 'image'">
      <div class="img_abs" v-if="value[cell_key]">
        <img v-if="cell_data.baseurl" :src="value[cell_key]" alt=""/>
        <img v-if="!cell_data.baseurl" :src="site_url_prefix + value[cell_key]" alt=""/>
      </div>
      <div class="img_abs" v-else>
        <img :src="site_url_prefix + 'assets/files/img/nopic.png'" alt=""/>
      </div>
    </div>
    <div class="cell_value" v-else-if="cell_data.type == 'editmode' && editMode">
      <Checkbox v-model="check" :binary="true" @input="checkRow"/>
    </div>
    <div class="cell_value" v-else-if="cell_data.type == 'text'">
      {{ value[cell_key] }}
      <div v-if="cell_data.description" class="cell_description">
        <span v-if="cell_data.description.type == 'field'">
          {{ value[cell_data.description.key] }}
        </span>
        <span v-else-if="cell_data.description.type == 'text'">
          {{ value[cell_key].description.text }}
        </span>
      </div>
    </div>
    <div class="cell_value" v-else-if="cell_data.type == 'gist'">
      <Chart type="line" :data="value[cell_key]" :options="chart_options" class="w-full md:w-5rem" />
    </div>
    <div class="cell_value" v-else-if="cell_data.type == 'boolean'">
      <div v-if="value[cell_key] == 0">
        <span class="cell__error" v-if="cell_data.calc == 'positive'">Нет</span>
        <span class="cell__error" v-else>Нет</span>
      </div>
      <div v-else>
        <span class="cell__error" v-if="cell_data.calc == 'negative'">Да</span>
        <span class="cell__success" v-else>Да</span>
      </div>
    </div>
    <div class="cell_value" :class="cell_key == 'name' ? 'name' : ''" v-else-if="cell_data.type == 'link'">
      <router-link :to="{ name: cell_data.link_to, params: linkParams, props: cell_data.link_props}">
        {{ value[cell_key] }}
        <div v-if="cell_data.description" class="cell_description">
          <span v-if="cell_data.description.type == 'field'">
            {{ value[cell_data.description.key] }}
          </span>
          <span v-else-if="cell_data.description.type == 'text'">
            {{ value[cell_key].description.text }}
          </span>
        </div>
      </router-link>
    </div>
    <div class="cell_value" :class="cell_key == 'name' ? 'name' : ''" v-else-if="cell_data.type == 'clickevent'">
      <a href="#" @click.prevent="actionElem('click')">
        {{ value[cell_key] }}
      </a>
    </div>
    <div class="cell_value" :class="cell_key == 'name' ? 'name' : ''" v-else-if="cell_data.type == 'downloadhref'">
      <a :href="value[cell_key]" download target="_blank">
        Скачать
      </a>
    </div>
    <div class="cell_value" :class="cell_key == 'status' ? 'status' : ''" v-else-if="cell_data.type == 'status'">
      <span :style="'font-size: 12px;padding: 3px 5px;border-radius: 3px;white-space: nowrap;color: #fff;background-color: #' + value.status_color">
        {{ value['status_name'] }}
      </span>
    </div>
    <div class="cell_value" :class="cell_key == 'actions' ? 'actions' : ''" v-else-if="cell_data.type == 'actions'">
      <span class="p-buttonset">
        <Button
          class="kenostButton"
          :title="row.label"
          :label="row.label" :icon="row.icon"
          v-for="(row, index) in blank.available"
          :key="index" severity="secondary"
          text
          @click="actionElem(index)"
          >
          <i :class="row.icon"></i>
        </Button>
      </span>
    </div>
    <div class="cell_value" v-else-if="cell_data.type == 'number'">
      <InputNumber
        v-model="numbers[cell_key]"
        :inputId="'input_' + cell_key"
        incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
        @update:modelValue="editValue(numbers[cell_key], cell_key)"
      />
    </div>
  </td>
</template>

<script>
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import InputNumber from 'primevue/inputnumber'
import Chart from 'primevue/chart'

export default {
  name: 'v-table-cell',
  emits: ['deleteElem', 'updateElem', 'editElem', 'clickElem', 'checkElem', 'approveElem', 'disapproveElem', 'editNumber'],
  props: {
    editMode: {
      type: Boolean,
      default: false
    },
    cell_data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    cell_key: {
      type: String,
      default: null
    },
    value: {
      type: Object,
      default: () => {
        return {}
      }
    },
    link_params: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      check: false,
      blank: {},
      numbers: {},
      chart_options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
            display: false
          },
          title: {
            display: false,
            text: 'График'
          }
        }
      }
    }
  },
  computed: {
    linkParams () {
      const linkparams = {}
      if (this.cell_data.type === 'link') {
        for (const key in this.cell_data.link_params) {
          if (this.cell_data.link_params[key] !== 'id' && this.cell_data.link_params[key] !== 'store_id' && this.cell_data.link_params[key] !== 'vendor_id') {
            linkparams[key] = this.cell_data.link_params[key]
          }
          else {
            linkparams[key] = this.value[this.cell_data.link_params[key]]
          }
        }
        // console.log(linkparams)
      }
      return linkparams
    }
  },
  methods: {
    actionElem (action) {
      // console.log(action)
      // console.log(this.value)
      if (action === 'delete') {
        this.$emit('deleteElem', this.value)
      }
      if (action === 'update') {
        this.$emit('updateElem', this.value)
      }
      if (action === 'edit') {
        this.$emit('editElem', this.value)
      }
      if (action === 'click') {
        this.$emit('clickElem', this.value)
      }
      if (action === 'approve') {
        this.$emit('approveElem', this.value)
      }
      if (action === 'disapprove') {
        this.$emit('disapproveElem', this.value)
      }
    },
    editValue (number, name) {
      this.$emit('editNumber', { value: number, id: this.value.id, name: name })
    },
    checkRow (data) {
      const val = this.value
      val.checked = data
      this.$emit('checkElem', val)
    }
  },
  components: {
    Button,
    InputNumber,
    Checkbox,
    Chart
  },
  mounted() {
    this.blank = this.cell_data
    if (this.cell_data.type === 'editmode') {
      if (this.value.checked) {
        this.check = true
      } else {
        this.check = false
      }
    }
    if (this.blank.type === 'actions') {
      for (const key in this.blank.available) {
        if (Object.prototype.hasOwnProperty.call(this.blank.available[key], 'link') && Object.prototype.hasOwnProperty.call(this.blank.available[key], 'link_values')) {
          if (this.blank.available[key].link && this.blank.available[key].link_values) {
            const link = this.blank.available[key].link
            const values = this.blank.available[key].link_values
            if (!values.includes(Number(this.value[link]))) {
              delete this.blank.available[key]
            }
          }
        }
      }
    }
    if (this.cell_data.type === 'number') {
      this.numbers[this.cell_key] = this.value[this.cell_key]
    }
  },
  unmounted() {
    this.numbers[this.cell_key] = this.value[this.cell_key]
  },
  watch: {
    cell_data: function (newVal, oldVal) {
      if (newVal.type === 'editmode') {
        if (this.value.checked) {
          this.check = true
        } else {
          this.check = false
        }
      }
    },
    value: function (newVal, oldVal) {
      if (this.cell_data.type === 'editmode') {
        this.check = newVal.checked
      }
      if (this.cell_data.type === 'number') {
        this.numbers[this.cell_key] = this.value[this.cell_key]
      }
      // console.log('watch value')
    }
  }
}
</script>

<style lang="scss" scoped>
.kenostButton{
  padding: 8px !important;
  background: #F8F8F8 !important;
  box-shadow: 0px 1px 5px 0px #00000033;
  box-shadow: 0px 3px 1px 0px #0000001F;
  box-shadow: 0px 2px 2px 0px #00000024;
  color: #ADADAD;
}
.kenostButton + .kenostButton{
  margin-left: 8px
}
.img_abs{
  img{
    max-width: 100px;
    max-height: 70px;
  }
}
.p-button{
  color: #343434;
  background: transparent;
  border-color: transparent;
  &:enabled:hover{
    background: transparent;
    border-color: transparent;
    color: #343434;
  }
  &:hover{
    color: #343434;
  }
}
.cell__error{
  color: #f00;
}
.cell__success{
  color: #0f0;
}
.name{
  text-align: left;
}
.cell_description{
  display: block;
  padding-top: 5px;
  font-size: 14px;
  letter-spacing: 0.5px;
  font-weight: bold;
  color: #666666;
}
</style>
