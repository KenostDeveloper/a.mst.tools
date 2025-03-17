<template>
    <Breadcrumbs class="std-breadcrumbs--margin" />
    

    <div class="flex align-items-center justify-content-space-between">
        <div class="title-h1 mb-3">Мои поставщики</div>
        <button @click="this.modal_add = true" type="button" class="dart-btn dart-btn-primary  flex gap-2 align-items-center">
            <i class="pi pi-plus"></i><div>Добавить поставщика</div>
        </button>
    </div>
	<v-opts
        :items_data="warehouses.items"
        :total="warehouses.total"
        :pagination_items_per_page="this.pagination_items_per_page_dilers_opts"
        :pagination_offset="this.pagination_offset_dilers_opts"
        :page="this.optpage"
        :filters="this.optfilters"
        :title="''"
        @update="optUpdate"
        @filter="optfilter"
        @sort="optfilter"
        @paginate="optpaginate"
        >
        <template v-slot:desc>
            <span class="desc">Отметьте организации, которые являются вашими поставщиками.</span>
        </template>
    </v-opts>

    <Dialog v-model:visible="this.modal_add" header="Добавление поставщика" :style="{ width: '440px' }">
		<div>
            <div class="dart-form-group mt-4 mb-3">
                <label for="name">Введите ИНН или Код поставщика</label>
                <input :disabled="this.loading" v-model="this.code" type="text" name="name" placeholder="ИНН или Код поставщика"
                    class="dart-form-control mt-2" />
            </div>
            <div class="flex justify-content-end">
                <button :disabled="this.loading" @click="addVendor()" type="button" class="dart-btn dart-btn-primary  flex gap-2 align-items-center">
                    <div>{{this.loading? "Загрузка" : "Добавить"}}</div>
                </button>
            </div>
            
        </div>
	</Dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import vOpts from '../components/table/v-opts.vue'
import Breadcrumbs from '../components/Breadcrumbs.vue';
import Dialog from 'primevue/dialog';
import Toast from 'primevue/toast';


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
                our: {
                    name: 'Мои поставщики',
                    placeholder: 'Мои поставщики',
                    type: 'checkbox',
                    values: 1
                }
            },
            modal_add: false,
            code: "",
            loading: false
		};
	},
	methods: {
		...mapActions([
			'get_opts_from_api',
            'org_profile_set_from_api'
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
        },
        addVendor(){
            this.loading = true;
            this.org_profile_set_from_api({
                action: 'add/code/warehouse',
                code: this.code,
                id: this.$route.params.id
            }).then((res) => {
                if(res.data.data.success){
                    this.$toast.add({
                        severity: 'success',
                        summary: 'Успех!',
                        detail: res.data.data.message,
                        life: 3000
                    });
                    this.get_opts_from_api({
                        page: this.optpage,
                        perpage: this.pagination_items_per_page_dilers_opts
                    })
                    this.modal_add = false;
                } else{
                    this.$toast.add({
                        severity: 'error',
                        summary: 'Ошибка',
                        detail: res.data.data.message,
                        life: 3000
                    });
                }
                this.loading = false
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
    components: { vOpts, Breadcrumbs, Dialog, Toast},
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
