<template>
    <form @submit.prevent="formSubmit" :class="{ loading: loading }">
        <div class="profile-content__title sticky-element">
            <span class="maintitle">Настройка коллекции</span>
            <div class="buttons_container">
                <RouterLink :to="{ name: 'b2b', params: { id: $route.params.id } }" class="dart-btn dart-btn-secondary btn-padding">Отменить</RouterLink>
                <button type="submit" class="dart-btn dart-btn-primary btn-padding"
                    :class="{ 'dart-btn-loading': loading }" :disabled="loading">
                    Сохранить изменения
                </button>
            </div>
        </div>
        <div>
            <div class="dart-form-group mb-4">
                <span class="ktitle">Наименование коллекции</span>
                <label for="name">Введите наименование, которое будет отражать смысл вашей коллекции.</label>
                <input v-model="this.name" type="text" name="name" placeholder="Укажите название коллекции" class="dart-form-control mt-2" />
            </div>

            <div class="dart-form-group mb-4">
                <span class="ktitle">Описание коллекции</span>
                <input v-model="this.description" type="text" name="name" placeholder="Укажите название коллекции" class="dart-form-control" />
            </div>

            <div class="dart-form-group mt-2 mb-4">
                <span class="ktitle">Склад</span>
                <Dropdown
                    @change="updateStore"
                    v-model="this.store_id"
                    :options="this.stores"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Выберите склад"
                />
            </div>

            <div v-if="this.store_id">
                <div class="dart-form-group mt-2 mb-4">
                    <span class="ktitle">Выберите условие добавления товаров</span>
                    <div class="kenost-method-edit-flex">
                        <div class="flex align-items-center gap-1 mt-3">
                            <RadioButton v-model="this.type" inputId="type_price-1" name="type_price" value="1" />
                            <label for="type_price-1" class="ml-2 radioLabel">Задать условие</label>
                        </div>
                        <div class="flex align-items-center gap-1 mt-3">
                            <RadioButton v-model="this.type" inputId="type_price-2" name="type_price" value="2" />
                            <label for="type_price-2" class="ml-2 radioLabel">Загрузить файлом</label>
                        </div>
                        <div class="flex align-items-center gap-1 mt-3">
                            <RadioButton v-model="this.type" inputId="type_price-3" name="type_price" value="3" />
                            <label for="type_price-3" class="ml-2 radioLabel">Все товары</label>
                        </div>
                    </div>
                </div>

                <div v-if="this.type == '1'">
                    <div class="kenost-terms" v-for="(item, index) in this.terms" :key="index">
                        <div class="ktitle">— Условие: {{ item.term == "1" ? "Категории" : item.term == "2" ? "Категории системы интеграции" : item.term == "3" ? "Теги" : "Бренды" }}</div>
                        <div class="flex align-items-center mt-1">
                            <Checkbox v-model="item.apply" :inputId="'apply' + index" value="true" />
                            <label :for="'apply' + index" class="ml-2">Применять условие к новым товарам</label>
                        </div>

                        <div v-if="item.term == '1'">

                        </div>
                        <div v-if="item.term == '2'">
                            
                        </div>
                        <div v-if="item.term == '3'">
                            <div class="dart-form-group mt-3 mb-4">
                                <MultiSelect 
                                    v-model="item.tags" 
                                    :options="tags" 
                                    option-label="label" 
                                    option-value="value" 
                                    placeholder="Выберите теги" 
                                    filter 
                                    display="chip" 
                                />
                            </div>
                        </div>
                        <div v-if="item.term == '4'">
                            <div class="dart-form-group mt-3 mb-4">
                                <MultiSelect 
                                    v-model="item.vendors" 
                                    :options="vendors" 
                                    option-label="name" 
                                    option-value="id" 
                                    placeholder="Выберите бренды" 
                                    filter 
                                    display="chip" 
                                />
                            </div>
                        </div>
                    </div>
                    <button @click="this.modals.terms = true" type="button" class="dart-btn dart-btn-primary flex gap-1 mt-4">
                        <i class="pi pi-plus"></i><div>Добавить условие</div>
                    </button>
                </div>
                <div class="dart-form-group mt-2 mb-4" v-if="this.type == '2'">
                    <DropZone v-if="!this.upload_product" class="kenost-dropzone" :maxFiles="Number(1)"
                        url="/rest/file_upload.php?upload_products=xlsx" :uploadOnDrop="true" :multipleUpload="true"
                        :acceptedFiles="['xlsx', 'xlsx']" :parallelUpload="1" @sending="parseFile" v-bind="args">
                        <template v-slot:message>
                            <div class="kenost-dropzone__custom">
                                <i class="pi pi-cloud-upload"></i>
                                <b>Перетащите файл в эту область</b>
                                <p>Вы также можете загрузить файл, <span>нажав сюда</span></p>
                            </div>
                        </template>
                    </DropZone>
                    <a :href="site_url_prefix + '/assets/files/files/examples/ExampleLoadingRequirement.xlsx'" class="kenost-link-blue mt-2">Скачать шаблон файла</a>

                </div>
                <div v-if="this.type == '3'">
                    
                </div>
            </div>


            <Dialog v-model:visible="this.modals.terms" header="Выберите тип условия" :style="{ width: '640px' }">
                <div class="flex gap-2">
                    <div class="flex align-items-center gap-1 mt-3">
                        <RadioButton class="hidden" v-model="this.term" inputId="terms-1" name="type_price" value="1" />
                        <label for="terms-1" class="kenost-card-button" :class="{ active: this.term == '1' }">
                            <div>Категории</div>
                        </label>
                    </div>
                    <div class="flex align-items-center gap-1 mt-3">
                        <RadioButton class="hidden" v-model="this.term" inputId="terms-2" name="type_price" value="2" />
                        <label for="terms-2" class="kenost-card-button" :class="{ active: this.term == '2' }">
                            <div>Категории системы интеграции</div>
                        </label>
                    </div>
                    <div class="flex align-items-center gap-1 mt-3">
                        <RadioButton class="hidden" v-model="this.term" inputId="terms-3" name="type_price" value="3" />
                        <label for="terms-3" class="kenost-card-button" :class="{ active: this.term == '3' }">
                            <div>Теги</div>
                        </label>
                    </div>
                    <div class="flex align-items-center gap-1 mt-3">
                        <RadioButton class="hidden" v-model="this.term" inputId="terms-4" name="type_price" value="4" />
                        <label for="terms-4" class="kenost-card-button" :class="{ active: this.term == '4' }">
                            <div>Бренды</div>
                        </label>
                    </div>
                </div>
                <div class="flex align-items-center mt-3">
                    <Checkbox v-model="apply" inputId="ingredient3" value="true" />
                    <label for="ingredient3" class="ml-2">Применять условие к новым товарам</label>
                </div>
                <div class="w-full flex justify-end mt-3">
                    <div class="dart-btn dart-btn-primary btn-padding" @click="addTerms">Добавить</div>
                </div>
            </Dialog>
        </div>

    </form>
</template>

<script>
import Dropdown from 'primevue/dropdown';
import { mapActions, mapGetters } from "vuex";
import RadioButton from 'primevue/radiobutton';
import DropZone from 'dropzone-vue';
import Dialog from 'primevue/dialog';
import ToggleButton from 'primevue/togglebutton';
import Checkbox from 'primevue/checkbox';
import MultiSelect from 'primevue/multiselect';

export default {
	name: "GroupEdit",
	props: {

	},
	data() {
		return {
			stores: [],
            name: "",
            description: "",
            store_id: null,
            type: "1",
            file: null,
            term: '1',
            apply: [],
            modals: {
                terms: false
            },
            tags: [],
            vendors: [],
            terms: [
                {
                    term: '1',
                    apply: []
                },
                {
                    term: '2',
                    apply: []
                },
                {
                    term: '3',
                    apply: []
                },
                {
                    term: '4',
                    apply: []
                }
            ]
		};
	},
	methods: {
		...mapActions([
			'org_get_stores_from_api',
            'set_group_api',
            'get_tags_group_api',
            'get_vendors_group_api'
		]),
        formSubmit(){
            this.set_group_api({
                action: 'set',
                id: this.$route.params.id,
                test: 'test'
            })
        },
        parseFile(files, xhr, formData) {
            const callback = (e) => {
                const res = JSON.parse(e);
                console.log(res)
                if(res.data.files[0].name){
                    this.file = res.data.files[0]
                }                
            };
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    callback(xhr.response);
                }
            };
        },
        addTerms(){
            this.terms.push({
                term: this.term,
                apply: this.apply,
                tags: [],
                vendors: [],
            })
            this.modals.terms = false;
            this.term = "1",
            this.apply = []
        },
        updateStore(){
            this.get_tags_group_api({
                action: 'get/tags',
                id: this.$route.params.id,
                store_id: this.store_id
            })

            this.get_vendors_group_api({
                action: 'get/vendors',
                id: this.$route.params.id
            })
        }
	},
	mounted() {
		this.org_get_stores_from_api({
            action: 'get/stores',
            id: this.$route.params.id
        });
	},
	components: {
		
	},
    components: {
        Dropdown,
        RadioButton,
        DropZone,
        Dialog,
        ToggleButton,
        Checkbox,
        MultiSelect
    },
	computed: {
		...mapGetters([
            'org_stores',
            'group_tags',
            'group_vendors'
        ]),
	},
	watch: {
        org_stores: function (newVal, oldVal) {
            this.stores = [];
            for (let i = 0; i < newVal.items.length; i++) {
                this.stores.push({ label: newVal.items[i].name, value: newVal.items[i].id });
            }
        },
        group_tags: function (newVal, oldVal) {
            this.tags = newVal.map(tag => ({ label: tag, value: tag }));
        },
        group_vendors: function (newVal, oldVal) {
            this.vendors = newVal;
        },
	},
};
</script>

<style lang="scss">

</style>
