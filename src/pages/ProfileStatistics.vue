<template>
    <div class="copo">
        <h1 class="title-mini"><img class="mst-image-org" :src="org_profile.image" alt="">{{org_profile.name}}</h1>
        <!-- {{org_stores}} -->
        <v-table
            :items_data="org_stores.items"
            :total="org_stores.total"
            :pagination_items_per_page="this.pagination_items_per_page"
            :pagination_offset="this.pagination_offset"
            :page="this.page_modal"
            :table_data="this.table_stores"
            :filters="{}"
            title="Склады"
        >
        </v-table>
   </div>
 </template>
 
 <script>
 import { mapActions, mapGetters } from 'vuex'
 import vTable from '../components/table/v-table.vue'
 import Chart from 'primevue/chart'
 import TabView from 'primevue/tabview'
 import TabPanel from 'primevue/tabpanel'
 import RadioButton from 'primevue/radiobutton'
 import router from '../router'
 
 export default {
   name: 'ProfileProducts',
   props: {
     pagination_items_per_page: {
       type: Number,
       default: 25
     },
     pagination_offset: {
       type: Number,
       default: 0
     },
     org: {
       type: Array,
       default: () => {
         return []
       }
     }
   },
   data () {
     return {
       table_stores: {
         image: {
           label: 'Фото',
           type: 'image',
           baseurl: true
         },
         name_short: {
           label: 'Название',
           type: 'link',
           link_to: 'store',
           link_params: {
             id: this.$route.params.id,
             store_id: 'id'
           }
         },
         active: {
           label: 'Активно',
           type: 'boolean'
         },
         address_short: {
           label: 'Адрес',
           type: 'text'
         }
         // vendor_article: {
         //   label: 'Артикул',
         //   type: 'text',
         //   sort: true
         // },
         // pagetitle: {
         //   label: 'Наименование',
         //   type: 'text',
         //   sort: true
         // },
         // parent_name: {
         //   label: 'Категория',
         //   type: 'text',
         //   sort: true
         // }
       },
     }
   },
   methods: {
     ...mapActions([
       'org_get_stores_from_api',
       'org_profile_from_api'
     ]),
   },
   mounted () {
        this.org_get_stores_from_api({
            action: 'get/stores',
            id: this.$route.params.id
        })
        this.org_profile_from_api({
            action: 'get/org/profile',
            id: router.currentRoute._value.params.id
        })
   },
   components: { vTable, Chart, TabView, TabPanel, RadioButton },
   computed: {
     ...mapGetters([
       'org_stores',
       'org_profile'
     ])
   },
   watch: {
     
   }
 }
 </script>
 
<style lang="scss">

</style>
 