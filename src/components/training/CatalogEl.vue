<template>
    <li class="dart-catalog-menu__category" :class="{'active' : this.active}">
      <!-- @click="clickMenu"  -->
        <div @click="!items.children? clickMenu(items.index, null) : setActive($event)"  class="dart-catalog-menu__el">
            <span :class="{'menuActive' : this.active1 == items.index && this.active2 == null}">{{ items.pagetitle }}</span>
        </div>
        <ul class="dart-catalog-menu__list">
            <li :class="{'menuActive' : this.active1 == items.index && this.active2 == item.id}" @click="clickMenu(items.index, item.id)" v-for="item in items.children" v-bind:key="item.id">{{item.pagetitle}}</li>
          </ul>
        </li>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'TraningCatalogMenuEl',
  props: {
    pagination_items_per_page: {
      type: Number,
      default: 25
    },
    pagination_offset: {
      type: Number,
      default: 0
    },
    items: {
      type: Array
    },
    active1: {
      type: Number
    },
    active2: {
      type: Number
    }
  },
  data () {
    return {
      loading: true,
      active: false
    }
  },
  emits: ['menuIndex'],
  methods: {
    ...mapActions([
    ]),
    clickMenu (index1, index2) {
      console.log(index1, index2)
      this.$emit('menuIndex', { index1, index2 })
    },
    setActive (e) {
      this.active = !this.active
      // console.log(e.target.parentNode.querySelector('.dart-catalog-menu__list'))
      if (e.target.parentNode.parentNode.querySelector('.dart-catalog-menu__list')) {
        if (e.target.parentNode.parentNode.querySelector('.dart-catalog-menu__list').style.maxHeight) {
          e.target.parentNode.parentNode.querySelector('.dart-catalog-menu__list').style.maxHeight = null
        } else {
          e.target.parentNode.parentNode.querySelector('.dart-catalog-menu__list').style.maxHeight = e.target.parentNode.parentNode.querySelector('.dart-catalog-menu__list').scrollHeight + 'px'
        }
      }
    }
  },
  mounted () {
  },
  components: { },
  computed: {
    ...mapGetters([
    ])
  }
}
</script>
<style lang="scss">
  .menuActive{
    font-weight: 600;
  }
</style>
