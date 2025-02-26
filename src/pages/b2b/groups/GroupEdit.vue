<template>
    <Loading v-if="loading" />
    <form v-else @submit.prevent="formSubmit">
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
                                <RadioButton @change="updateBuild"  v-model="this.type" inputId="type_price-1" name="type_price" value="1" />
                                <label for="type_price-1" class="ml-2 radioLabel">Задать условие</label>
                            </div>
                            <div class="flex align-items-center gap-1 mt-3">
                                <RadioButton @change="updateBuild"  v-model="this.type" inputId="type_price-2" name="type_price" value="2" />
                                <label for="type_price-2" class="ml-2 radioLabel">Загрузить файлом</label>
                            </div>
                            <div class="flex align-items-center gap-1 mt-3">
                                <RadioButton @change="updateBuild"  v-model="this.type" inputId="type_price-3" name="type_price" value="3" />
                                <label for="type_price-3" class="ml-2 radioLabel">Все товары</label>
                            </div>
                        </div>
                    </div>

                    <div v-if="this.type == '1'">
                        <div class="dart-form-group mt-2 mb-4" >
                            <div class="flex align-items-center mt-1">
                                <Checkbox v-model="this.apply" :inputId="'apply'" value="true" />
                                <label :for="'apply'" class="ml-2">Применять условия к новым товарам</label>
                            </div>
                        </div>
                        <div class="kenost-terms dart-form-group" v-for="(item, index) in this.terms" :key="index">
                            <div class="flex align-items-center justify-content-between">
                                <div class="ktitle">— Условие: {{ item.term == "1" ? "Категории" : item.term == "2" ? "Категории системы интеграции" : item.term == "3" ? "Теги" : "Бренды" }}</div>
                                <i class="pi pi-trash cursor-pointer" @click="deleteTerms(index)"></i>
                            </div>

                            <div v-if="item.term == '1'">
                                <div class="dart-form-group mt-3 mb-4">
                                    <TreeSelect :key="this.updateKey" @change="updateBuild" selectionMode="checkbox" v-model="item.catalog_our" :options="this.category_our" placeholder="Выберите категории" />
                                </div>
                            </div>
                            <div v-if="item.term == '2'">
                                <div class="dart-form-group mt-3 mb-4">
                                    <TreeSelect :key="this.updateKey" @change="updateBuild" selectionMode="checkbox" v-model="item.category" :options="this.catalog" placeholder="Выберите категории" />
                                </div>
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
                                        @change="updateBuild"
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
                                        @change="updateBuild"
                                    />
                                </div>
                            </div>
                        </div>
                        <button @click="this.modals.terms = true" type="button" class="dart-btn dart-btn-primary flex gap-1 mt-4">
                            <i class="pi pi-plus"></i><div>Добавить условие</div>
                        </button>
                    </div>
                    <div class="dart-form-group mt-2 mb-4" v-if="this.type == '2'">
                        <div class="kenost-upload-xlsx" v-if="this.file">
                            <div class="kenost-upload-xlsx__file">
                                <img src="../../../../public/images/xslx.svg" alt="">
                                <a targer="_blank" :href="site_url_prefix + 'assets/content/groups/' + file">{{ this.file }}</a>
                            </div>
                            <div v-if="this.file" class="kenost-link-blue mt-2" @click="() => {
                                this.file = null
                                this.updateBuild()
                            }">Загрузить другой файл</div>
                        </div>
                        <DropZone v-if="!this.file" class="kenost-dropzone" :maxFiles="Number(1)"
                            url="/rest/file_upload.php?upload_groups=xlsx" :uploadOnDrop="true" :multipleUpload="true"
                            :acceptedFiles="['xlsx', 'xlsx']" :parallelUpload="1" @sending="parseFile" v-bind="args">
                            <template v-slot:message>
                                <div class="kenost-dropzone__custom">
                                    <i class="pi pi-cloud-upload"></i>
                                    <b>Перетащите файл в эту область</b>
                                    <p>Вы также можете загрузить файл, <span>нажав сюда</span></p>
                                </div>
                            </template>
                        </DropZone>
                        <a v-if="!this.file" :href="site_url_prefix + 'assets/files/files/examples/ExampleGroups.xlsx'" class="kenost-link-blue mt-2" target="_blank">Скачать шаблон файла</a>

                    </div>


                    <TabView class="tab-custom hidden-mobile-l mt-4 kenost-tab-custom">
                        <TabPanel>
                            <template #header>
                                Добавленные товары
                                <Badge class="ml-2" :value="this.total"></Badge>
                            </template>
                            <div class="table-kenost">
                                <p class="table-kenost__title">Таблица добавленных товаров</p>
                                <div class="table-kenost__filters">
                                    <div class="table-kenost__filters-left">
                                        <div class="form_input_group input_pl input-parent required">
                                            <input type="text" id="filter_table" placeholder="Введите артикул или название"
                                                class="dart-form-control" v-model="this.filter.name"
                                                @input="this.setFilter()" />
                                            <label for="product_filter_name" class="s-complex-input__label">Введите артикул или
                                                название</label>
                                            <div class="form_input_group__icon">
                                                <i class="d_icon d_icon-search"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- <div @click="createSet" class="dart-btn dart-btn-primary btn-padding">Создать комплект</div> -->
                                </div>
                                <table class="table-kenost__table">
                                    <thead>
                                        <tr>
                                            <th class="table-kenost__name table-kenost__name-checkbox">
                                                <Checkbox @update:modelValue="kenostTableCheckedAll" v-model="this.kenost_table_all"
                                                    inputId="kenost_table_all" value="1" />
                                            </th>
                                            <th class="table-kenost__name table-kenost__name-product">Товар</th>
                                            <th class="table-kenost__name">Тип добавления</th>
                                            <th class="table-kenost__name">Бренд</th>
                                            <th class="table-kenost__name">Категория</th>
                                            <th class="table-kenost__name">Тег</th>
                                            <th class="table-kenost__name">Действие</th>
                                        </tr>
                                    </thead>
                                    <tbody v-for="item in this.products" :key="item.id">
                                        <tr>
                                            <td class="table-kenost__checkbox">
                                                <Checkbox @change="kenostTableCheckedAllCheck" v-model="this.kenost_table" inputId="kenost_table" :value="item.remain_id" />
                                            </td>
                                            <td class="table-kenost__product">
                                                <img :src="item.image" />
                                                <div class="table-kenost__product-text">
                                                    <p>{{ item.name }}</p>
                                                    <span>{{ item.article }}
                                                        <span class="store-name-b2b" :style="{ background: item.color }">{{item.store}}</span></span>
                                                </div>
                                            </td>
                                            <td><p class="mb-0">{{ item.type }}</p></td>
                                            <td><p class="mb-0">{{ item.brand }}</p></td>
                                            <td><p class="mb-0">{{ item.category }}</p></td>
                                            <td><p class="mb-0">{{ item.tags }}</p></td>
                                            <td>
                                                <div class="kenost-basker-delete">
                                                    <div class="kenost-basker-delete__button" @click="deleteProduct(item)">
                                                        <i class="pi pi-trash"></i>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <paginate :page-count="pagesCountSelect" :click-handler="pagClickCallbackSelect" :prev-text="'Пред'"
                                    :next-text="'След'" :container-class="'pagination justify-content-center'"
                                    :initialPage="this.page_selected" :forcePage="this.page_selected">
                                </paginate>
                                <div class="table-kenost-help">
                                    <div class="table-kenost-help__select">
                                        <span>Отмечено:</span> {{ this.kenost_table.length }} / {{ this.total}}
                                    </div>
                                    <div class="flex align-items-center gap-1">
                                        <Checkbox @change="globalTable" v-model="this.global_kenost_table"
                                            inputId="global_kenost_table-1" name="global_kenost_table-1" value="true" />
                                        <label for="global_kenost_table-1" class="ml-1 mb-0">Все</label>
                                    </div>
                                    <!-- <div v-if="filter.name != ''" class="flex align-items-center gap-1">
                                        <Checkbox @change="filterglobalTable" v-model="this.filter_kenost_table"
                                            inputId="global_kenost_table-2" name="global_kenost_table-2" value="true" />
                                        <label for="global_kenost_table-2" class="ml-1 mb-0">Отметить подходящие по фильтру</label>
                                    </div> -->
                                </div>
                            </div>
                        </TabPanel>
                        <TabPanel>
                            <template #header>
                                Черный список
                                <Badge class="ml-2" :value="Object.keys(this.black_list).length"></Badge>
                            </template>
                            <div class="table-kenost">
                                <div class="flex align-items-center justify-content-between">
                                    <p class="table-kenost__title mb-0">Черный список товаров</p>
                                    <button @click="deleteBlackList()" type="button" class="dart-btn dart-btn-secondary  flex gap-1 align-items-center">
                                        <i class="pi pi-times"></i><div>Очистить черный список</div>
                                    </button>
                                </div>
                                <table class="table-kenost__table">
                                    <thead>
                                        <tr>
                                            <th class="table-kenost__name table-kenost__name-checkbox w-0">
                                                
                                            </th>
                                            <th class="table-kenost__name table-kenost__name-product">Товар</th>
                                            <th class="table-kenost__name">Тип добавления</th>
                                            <th class="table-kenost__name">Бренд</th>
                                            <th class="table-kenost__name">Категория</th>
                                            <th class="table-kenost__name">Тег</th>
                                            <th class="table-kenost__name">Действие</th>
                                        </tr>
                                    </thead>
                                    <tbody v-for="item in this.black_list" :key="item.id">
                                        <tr>
                                            <td class="table-kenost__checkbox w-0">
                                            </td>
                                            <td class="table-kenost__product">
                                                <img :src="item.image" />
                                                <div class="table-kenost__product-text">
                                                    <p>{{ item.name }}</p>
                                                    <span>{{ item.article }}
                                                        <span class="store-name-b2b" :style="{ background: item.color }">{{item.store}}</span></span>
                                                </div>
                                            </td>
                                            <td></td>
                                            <td><p class="mb-0">{{ item.brand }}</p></td>
                                            <td><p class="mb-0">{{ item.category }}</p></td>
                                            <td><p class="mb-0">{{ item.tags }}</p></td>
                                            <td>
                                                <div class="kenost-basker-delete">
                                                    <div class="kenost-basker-delete__button" @click="deleteBack(item)">
                                                        <i class="pi pi-trash"></i>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </TabPanel>
                    </TabView>
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
import TreeSelect from 'primevue/treeselect';
import Paginate from 'vuejs-paginate-next';
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import Badge from 'primevue/badge';
import router from '../../../router';
import Loading from '../../../components/Loading.vue'

export default {
	name: "GroupEdit",
	props: {

	},
	data() {
		return {
            loading: true,
            page: 1,
            perpage: 20,
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
            catalog_our: [],
            catalog: [],
            kenost_table: [],
            products: {},
            selected: {},
            global_kenost_table: [],
            kenost_table_all: [],
            total: 0,
            ids: [],
            terms: [],
            filter: {
                name: ""
            },
            black_list: {},
            updateKey: 0,
		};
	},
	methods: {
		...mapActions([
			'org_get_stores_from_api',
            'set_group_api',
            'get_tags_group_api',
            'get_vendors_group_api',
            'get_opt_catalog_tree_from_api',
            'get_catalog_group_api',
            'build_group_api',
            'get_group_api'
		]),
        formSubmit(){
            this.loading = true
            const data = {
                action: 'set',
                id: this.$route.params.id,
                store_id: this.store_id,
                type: this.type,
                name: this.name,
                description: this.description,
                terms: this.terms,
                black_list: Object.keys(this.black_list),
                file: this.file,
                apply: this.apply.length > 0 ? true : false
            }

            if(this.$route.params.group_id){
                data.group_id = this.$route.params.group_id;
            }

            this.set_group_api(data).then((result) => {
                this.loading = false;
                router.push({ name: 'b2b', params: { id: router.currentRoute._value.params.id } });
            })
            .catch((result) => {
                console.log(result)
            });
        },
        parseFile(files, xhr, formData) {
            const callback = (e) => {
                const res = JSON.parse(e);
                console.log(res)
                if(res.data.files[0].name){
                    this.file = res.data.files[0].name
                    this.updateBuild()
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
                tags: [],
                vendors: [],
                catalog: [],
                catalog_our: [],
            })
            this.modals.terms = false;
            this.term = "1",
            this.apply = []
        },
        deleteTerms(index){
            this.terms.splice(index, 1);
            updateBuild()
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

            this.get_catalog_group_api({
                action: 'get/catalog/warehouse',
                id: this.$route.params.id,
                store_id: this.store_id
            })

            this.updateBuild()
        },
        updateBuild(){
            this.build_group_api({
                action: 'build',
                id: this.$route.params.id,
                store_id: this.store_id,
                terms: this.terms,
                page: this.page,
                perpage: this.perpage,
                filter: this.filter,
                black_list: Object.keys(this.black_list),
                type: this.type,
                file: this.file
            })
        },
        transformToTreeSelectFormat(catalog) {
            return Object.values(catalog).map(item => {
                return {
                    label: item.pagetitle,  // Display name
                    key: item.id,           // Unique ID
                    children: item.children ? this.transformToTreeSelectFormat(item.children) : [] // Recursively process children
                };
            });
        },
        transformToTreeSelectFormatGuid(catalog) {
            return Object.values(catalog).map(item => {
                return {
                    label: item.pagetitle,  // Display name
                    key: item.guid_category,           // Unique ID
                    children: item.children ? this.transformToTreeSelectFormatGuid(item.children) : [] // Recursively process children
                };
            });
        },
        pagClickCallbackSelect(pageNum) {
            this.page = pageNum;
            this.updateBuild();
        },
        setFilter(){
            this.page = 1;
            this.updateBuild();
        },
        kenostTableCheckedAllCheck() {
            let isPageSelect = false;
            if (Object.keys(this.products).length === 0) {
                this.kenost_table_all = [];
                // eslint-disable-next-line no-unused-vars
                isPageSelect = true;
                console.log('t1')
            }

            for (let i = 0; i < Object.keys(this.products).length; i++) {
                if (this.kenost_table.indexOf(this.products[Object.keys(this.products)[i]].remain_id) === -1) {
                    this.kenost_table_all = [];
                    // eslint-disable-next-line no-unused-vars
                    isPageSelect = true;
                    console.log('t2')
                    break;
                }
            }
            if (!isPageSelect) {
                this.kenost_table_all = ['1'];
            }
            if (Object.keys(this.ids).length === this.kenost_table.length) {
                this.global_kenost_table = ['true'];
            } else {
                this.global_kenost_table = [];
            }

            let isPageSelectFilter = false;

            for (let i = 0; i < this.ids_visible.length; i++) {
                if (this.kenost_table.indexOf(this.ids_visible[i]) == -1) {
                    isPageSelectFilter = true;
                    console.log('t2')
                    break
                }
            }

            if (!isPageSelectFilter) {
                this.form.filter_kenost_table = ['true'];
            } else {
                this.form.filter_kenost_table = [];
            }
        },
        kenostTableCheckedAll() {
            if (this.kenost_table_all.length === 0) {
                for (let i = 0; i < Object.keys(this.products).length; i++) {
                    this.kenost_table.push(this.products[Object.keys(this.products)[i]].remain_id);
                }
            } else {
                for (let i = 0; i < Object.keys(this.products).length; i++) {
                    this.kenost_table = this.kenost_table.filter((el) => el !== this.products[Object.keys(this.products)[i]].remain_id);
                }
            }
        },
        filterglobalTable() {
            if (this.filter_kenost_table.length === 0) {
                // this.kenost_table = [];
                this.kenost_table = this.kenost_table.filter(id => !this.ids_visible.includes(id));
            } else {
                this.kenost_table = [...new Set([...this.kenost_table, ...this.ids_visible])];
            }
            this.kenostTableCheckedAllCheck();
        },
        globalTable() {
            if (this.global_kenost_table.length === 0) {
                this.kenost_table = [];
            } else {
                this.kenost_table = this.ids;
            }
            this.kenostTableCheckedAllCheck();
        },
        deleteProduct(item){
            this.black_list[item.remain_id] = item;
            this.updateBuild();
        },
        deleteBack(item){
            if (item && item.remain_id in this.black_list) {
                delete this.black_list[item.remain_id];
                console.log(`Item with remain_id ${item.remain_id} removed.`);
            } else {
                console.log(`Item with remain_id ${item.remain_id} not found.`);
            }
            this.updateBuild();
        },
        deleteBlackList(){
            this.black_list = {}
            this.updateBuild();
        }
	},
	mounted() {
		this.org_get_stores_from_api({
            action: 'get/stores',
            id: this.$route.params.id
        });
        this.get_opt_catalog_tree_from_api()

        if(this.$route.params.group_id){
            this.get_group_api({
                id: this.$route.params.id,
				action: "get",
                group_id: this.$route.params.group_id
            }).then(() => this.loading = false)
        } else {
            this.loading = false
        }
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
        MultiSelect,
        TreeSelect,
        Paginate,
        TabView,
		TabPanel,
        Badge,
        Loading
    },
	computed: {
		...mapGetters([
            'org_stores',
            'group_tags',
            'group_vendors',
            'optcatalogtree',
            'group_catalog',
            'group_build',
            'groups'
        ]),
        pagesCountSelect() {
            let pages = Math.ceil(this.total / this.perpage);
            if (pages === 0) {
                pages = 1;
            }
            return pages;
        },
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
        optcatalogtree: function (newVal, oldVal) {
            this.category_our = this.transformToTreeSelectFormat(newVal);
            this.updateKey = 1;
        },
        group_catalog: function (newVal, oldVal) {
            this.catalog = this.transformToTreeSelectFormatGuid(newVal);
            this.updateKey = 2;
        },
        group_build: function (newVal, oldVal) {
            if(newVal.items){
                this.products = newVal.items;
            } else {
                this.products = [];
            }

            if(newVal.total >= 0){
                this.total = newVal.total;
            } else {
                this.total = 0;
            }

            if(newVal.remain_ids){
                this.ids = newVal.remain_ids
            }
        },
        groups: function (newVal, oldVal) {
            if(newVal.name){
                this.name = newVal.name
            }

            if(newVal.description){
                this.description = newVal.description
            }

            if(newVal.store_id){
                this.store_id = (newVal.store_id).toString()
            }

            if(newVal.file){
                this.file = newVal.file
            }

            if(newVal.update){
                this.apply = ['true']
            }

            if(newVal.properties){
                this.black_list = newVal.properties.black_list
                this.terms = newVal.properties.terms
            }

            if(newVal.type){
                this.type = (newVal.type).toString()
            }

            this.updateStore();
        }
	},
};
</script>

<style lang="scss">

</style>
