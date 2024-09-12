<template>
  <tr>
    <v-table-cell
      v-for="(row, index) in keys"
      :key="index"
      :cell_data="row"
      :cell_key="index"
      :value="row_data"
      :editMode="editMode"
      @deleteElem="deleteElem"
      @updateElem="updateElem"
      @editElem="editElem"
      @clickElem="clickElem"
      @checkElem="checkElem"
      @approveElem="approveElem"
      @disapproveElem="disapproveElem"
      @editNumber="editNumber"
      @click="console.log({ name: link_row.link_to, params: linkParams(row), props: link_row.link_props})"
    />
    <!--       @click.prevent="$router.push({ name: link_row.link_to, params: linkParams(row), props: link_row.link_props})" -->
  </tr>
  <slot name="add_data"></slot>
</template>

<script>
import vTableCell from './v-table-cell.vue'

export default {
  name: 'v-table-row',
  emits: ['deleteElem', 'updateElem', 'editElem', 'clickElem', 'checkElem', 'approveElem', 'disapproveElem', 'editNumber'],
  props: {
    editMode: {
      type: Boolean,
      default: false
    },
    row_data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    keys: {
      type: Object,
      default: () => {
        return {}
      }
    },
    link_row: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      
    }
  },
  computed: {
  },
  methods: {
    deleteElem (data) {
      this.$emit('deleteElem', data)
    },
    updateElem (data) {
      this.$emit('updateElem', data)
    },
    editElem (data) {
      this.$emit('editElem', data)
    },
    clickElem (data) {
      this.$emit('clickElem', data)
    },
    checkElem (data) {
      this.$emit('checkElem', data)
    },
    approveElem (data) {
      this.$emit('approveElem', data)
    },
    disapproveElem (data) {
      this.$emit('disapproveElem', data)
    },
    editNumber (object) {
      this.$emit('editNumber', object)
    },
    linkParams (row) {
      const linkparams = {}
      if (this.link_row != {}) {
        for (const key in this.link_row.link_params) {
          if (this.link_row.link_params[key] !== 'id' && this.link_row.link_params[key] !== 'store_id' && this.link_row.link_params[key] !== 'vendor_id') {
            linkparams[key] = this.link_row.link_params[key]
          }
          else {
            linkparams[key] = this.value[this.link_row.link_params[key]]
          }
        }
        // console.log(linkparams)
      }
      return linkparams
    }
  },
  components: {
    vTableCell
  },
  mounted() {
    // console.log(this.row_data)
  }
}
</script>

<style lang="scss">
.img_abs{
  img{
    max-width: 100px;
    max-height: 70px;
  }
}
.name{
  text-align: left;
}
</style>
