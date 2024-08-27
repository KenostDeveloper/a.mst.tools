<template>
	<v-opts
        :items_data="warehouses.items"
        :total="warehouses.total"
        :pagination_items_per_page="this.pagination_items_per_page_dilers_opts"
        :pagination_offset="this.pagination_offset_dilers_opts"
        :page="this.optpage"
        :filters="this.optfilters"
        title="Доступные поставщики"
        @update="optUpdate"
        @filter="optfilter"
        @sort="optfilter"
        @paginate="optpaginate"
        >
        <template v-slot:desc>
            <span class="desc">Отметьте организации, которые являются вашими поставщиками.</span>
        </template>
    </v-opts>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import vOpts from '../components/table/v-opts.vue'


export default {
	data() {
		return {
			warehouses: {
                items: [],
                total: -1
            },
            optpage: 1,
            pagination_items_per_page_dilers_opts: 25,
            pagination_offset_dilers_opts: 0,
            optfilters: {
                filter: {
                name: 'Наименование, адрес',
                placeholder: 'Введите наименование или адрес',
                type: 'text'
                },
                region: {
                name: 'Регион',
                placeholder: 'Выберите регион',
                type: 'tree',
                values: this.getregions
                },
                our: {
                name: 'Мои поставщики',
                placeholder: 'Мои поставщики',
                type: 'checkbox',
                values: 1
                }
            },
		};
	},
	methods: {
		...mapActions([
			'get_opts_from_api',
		]),
        optfilter (data) {
            this.get_opts_from_api(data)
        },
        optpaginate (data) {
            this.get_opts_from_api(data)
        },
        optUpdate (data) {
            this.get_opts_from_api({
                page: this.optpage,
                perpage: this.pagination_items_per_page_dilers_opts
            })
        }
	},
	mounted() {
		this.get_opts_from_api({
            page: this.optpage,
            perpage: this.pagination_items_per_page_dilers_opts
        })
	},
	computed: {
		...mapGetters([
			'opts'
		])
  	},
    components: { vOpts },
	watch: {
        opts: function (newVal, oldVal) {
            if (typeof newVal === 'object') {
                if (Object.prototype.hasOwnProperty.call(newVal, 'items')) {
                this.warehouses.items = newVal.items
                } else {
                this.warehouses.items = []
                }
                if (Object.prototype.hasOwnProperty.call(newVal, 'total')) {
                this.warehouses.total = newVal.total
                } else {
                this.warehouses.total = 0
                }
            } else {
                this.warehouses.items = []
                this.warehouses.total = 0
            }
        }
    }
};
</script>

<!-- <style lang="scss" scoped></style> -->
