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
    />
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
