<template>
    <nav aria-label="breadcrumb" v-if="items.value && items.value.length">
        <ol
            class="breadcrumb"
            itemscope=""
            itemtype="http://schema.org/BreadcrumbList"
        >
            <li
                v-for="crumb in items.value" :key="crumb.label"
                class="breadcrumb-item"
                itemprop="itemListElement"
                itemscope=""
                itemtype="http://schema.org/ListItem"
            >
                <span v-if="crumb.current" class="am-breadcrumbs__link am-breadcrumbs__link_current">
                  <span v-if="crumb.link == 'store_id'"> {{ organization.name_short }} </span>
                  <span v-else-if="crumb.link == 'warehouse_id'"> {{ optwarehouse.name_short }} </span>
                  <span v-else>{{ crumb.label }}</span>
                </span>
                <router-link v-else class="am-breadcrumbs__link" :to="crumb._path">
                  <span v-if="crumb.link == 'store_id'"> {{ organization.name_short }} </span>
                  <span v-else-if="crumb.link == 'warehouse_id'"> {{ optwarehouse.name_short }} </span>
                  <span v-else>{{ crumb.label }}</span>
                </router-link>
            </li>
        </ol>
    </nav>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Basket',
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
      loading: true
    }
  },
  methods: {
    ...mapActions([
      'get_organization_from_api',
      'get_opt_warehouse'
    ])
  },
  mounted () {
    this.get_organization_from_api()
    if (this.$route.params.warehouse_id) {
      this.get_opt_warehouse().then(
        this.opt_warehouse = this.optwarehouse
      )
    }
  },
  components: { },
  computed: {
    ...mapGetters([
      'organization',
      'optwarehouse'
    ])
  }
}
</script>
<style lang="scss">
    .breadcrumbs{
        padding-top: 30px;
    }

    .breadcrumb-item{
        color: var(--text-color-dop) !important;
        margin-bottom: 20px !important;
        font-size: 14px;
    }

    .breadcrumb a{
        color: var(--text-color-dop) !important;
        font-size: 14px;
    }

    .breadcrumb{
        margin: 0 !important;
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        overflow-x: auto;
        width: 100%;
        gap: 11px;

        &::-webkit-scrollbar {
            width: 0px;
        }

        li{
            white-space: nowrap;
        }

        a{
            color: var(--bs-secondary-color);
            text-decoration: none;
            &:hover{
                color: var(--secondary-color);
            }
        }
    }

    .breadcrumb-item+.breadcrumb-item{
        padding-left: 0;
        gap: 8px;
        display: flex;
    }

    .breadcrumb-item+.breadcrumb-item::before{
        padding: 0;
    }

</style>
