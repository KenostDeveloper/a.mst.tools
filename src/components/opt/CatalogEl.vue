<template>
    <li class="dart-catalog-menu__category" :class="{'active' : this.active}">
        <div @click="setActive($event)" class="dart-catalog-menu__el">
            <img :src="items.menu_image" :alt="items.pagetitle" v-if="items.menu_image"/>
            <span class="img_blank" v-else></span>
            <span>{{ items.pagetitle }}</span>
        </div>
        <ul class="dart-catalog-menu__list" v-if="$route.params.warehouse_id">
          <!-- <a v-for="item in items.children" v-bind:key="item.id" :href="'purchases/'+item.id" class="dart-catalog-menu__el"><li>{{item.pagetitle}}</li></a> -->
          <RouterLink :to="{ name: 'org_opt_waregouse_category', params: { warehouse_cat_id: item.id }}" v-for="item in items.children" v-bind:key="item.id" class="dart-catalog-menu__el"><li>{{item.pagetitle}}</li></RouterLink>
        </ul>
        <ul class="dart-catalog-menu__list" v-else>
          <!-- <a v-for="item in items.children" v-bind:key="item.id" :href="'purchases/'+item.id" class="dart-catalog-menu__el"><li>{{item.pagetitle}}</li></a> -->
          <RouterLink :to="{ name: 'purchases_catalog', params: { category_id: item.id }}" v-for="item in items.children" v-bind:key="item.id" class="dart-catalog-menu__el"><li>{{item.pagetitle}}</li></RouterLink>
        </ul>
      </li>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'CatalogMenuEl',
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
    }
  },
  data () {
    return {
      loading: true,
      active: false
    }
  },
  methods: {
    ...mapActions([
    ]),
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

</style>
