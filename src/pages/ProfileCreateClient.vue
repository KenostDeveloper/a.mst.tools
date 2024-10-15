<!-- eslint-disable indent -->
<template>
    <div class="std-profile std-create-clients" :class="{ 'loading': loading }">
        <Breadcrumbs class="std-breadcrumbs--margin" />
        <!-- <Toast /> -->
        <div class="profile-content__title sticky-element">
            <!-- <span class="maintitle hidden-mobile-l">Организация {{ this.orgprofile?.name }}</span> -->
            <div class="title-h1 hidden-mobile-l">О клиенте</div>
            <span class="maintitle visible-mobile-l">Карточка клиента</span>
            <div class="buttons_container">
                <div 
                    :class="{ 'dart-btn-loading': loading }"
                    @click="saveProfile()" 
                    class="dart-btn dart-btn-primary btn-padding" 
                    :disabled="this.loading"
                >Сохранить</div>
            </div>
        </div>
        <form action="#" @submit.prevent="formChangeSimple">
            <!-- <div class="dart-alert dart-alert-info">Вы можете изменить только данные контактного лица и логотип организации.</div> -->
            <div class="dart-form-group mb-5 std-create-clients__logo-container">
                <span class="ktitle">Логотип</span>
                <DropZone
                    v-if="!this.orgprofile.image"
                    class="kenost-dropzone"
                    :maxFiles="Number(1)"
                    url="/rest/file_upload.php?upload_org_avatar=avatar"
                    :uploadOnDrop="true"
                    :multipleUpload="true"
                    :acceptedFiles="['image/*']"
                    :parallelUpload="1"
                    @sending="parseFile"
                    v-bind="args">
                    <template v-slot:message>
                        <div class="kenost-dropzone__custom hidden-mobile-l">
                            <i class="pi pi-cloud-upload"></i>
                            <b>Перетащите файл в эту область</b>
                            <p>Вы также можете загрузить файл, <span>нажав сюда</span></p>
                        </div>

                        <div class="kenost-dropzone__custom visible-mobile-l">
                            <i class="pi pi-cloud-upload"></i>
                            <b>Загрузите файл сюда</b>
                            <span class="kenost-dropzone__link">Открыть</span>
                        </div>
                    </template>
                </DropZone>
                <div class="avatar-org" v-if="this.orgprofile.image">
                    <FileUpload
                        name="avatar[]"
                        url="/rest/file_upload.php?upload_org_avatar=avatar"
                        @upload="onUpload"
                        :auto="true"
                        :multiple="false"
                        accept="image/*"
                        :maxFileSize="1000000">
                        <template #header="{ chooseCallback, uploadCallback, clearCallback, files }">
                            <img
                                @click="chooseCallback()"
                                class="org-upload-img"
                                :src="orgprofile.upload_image ? this.orgprofile.image.original_href : this.orgprofile.image"
                                alt="" />
                            <i class="pi pi-upload"></i>
                        </template>
                    </FileUpload>
                </div>
            </div>
            <div class="dart-form-group mb-4 std-create-clients__data-container">
                <span class="ktitle mb-3">Данные контактного лица</span>
                <div class="kenost-form-grid">
                    <div class="dart-form-group w-50" 
                    :class="{
                        error: v$.orgprofile[field.name].$errors.length,
                    }"
                    v-for="(field, index) in form.fields.contacts" :key="index">
                        <!-- <label for="">{{ field.label }}</label> -->
                        <input
                            type="text"
                            v-model="this.orgprofile[field.name]"
                            class="dart-form-control std-create-clients__input"
                            :name="field.name"
                            :placeholder="field.placeholder" />
                        <span
                            class="error_desc"
                            v-for="error of v$.orgprofile[field.name].$errors"
                            :key="error.$uid"
                        >
                            {{ error.$message }}
                        </span>
                    </div>
                </div>
            </div>
            <div class="dart-form-group mb-4 std-create-clients__data">
                <span class="ktitle mb-3">Данные компании</span>
                <div class="kenost-form-grid">
                    <div 
                    class="form_input_group dart-form-group w-50"
                    :class="{
                        error: v$.form.company.data.value.$errors.length,
                    }"
                    >
                        <input type="text" v-model="this.form.company.data.value" class="dart-form-control std-create-clients__input" placeholder="Наименование организации" />
                        <span
                            class="error_desc"
                            v-for="error of v$.form.company.data.value.$errors"
                            :key="error.$uid"
                        >
                            {{ error.$message }}
                        </span>
                    </div>
                    <div class="form_input_group dart-form-group w-50"
                    :class="{
                        error: v$.form.company.inn.$errors.length,
                    }"
                    >
                        <Autocomplete
                            name="inn"
                            class="dart-form-control std-create-clients__input"
                            type="company"
                            selectionType="single"
                            placeholder="ИНН"
                            required
                            v-model="form.company.inn"
                            @setSelection="form.company.data = $event" />
                        <span
                            class="error_desc"
                            v-for="error of v$.form.company.inn.$errors"
                            :key="error.$uid"
                        >
                            {{ error.$message }}
                        </span>
                    </div>
                </div>
                <div class="form_input_group dart-form-group w-50" v-for="(warehouse, index) in this.form.company.warehouses" :key="index"
                :class="{
                    error: v$.form.company.warehouses.$errors.length,
                }"
                >
                    <AddAddress
                        :key="new Date().getMilliseconds() + index"
                        :index="index"
                        :value="this.form.company.warehouses[index].address"
                        v-model="this.form.company.warehouses[index].address"
                        class="std-create-clients__add-address"
                    />
                    <span
                        class="error_desc"
                        v-for="error of v$.form.company.warehouses.$errors"
                        :key="error.$uid"
                    >
                        {{ error.$message }}
                    </span>
                </div>
                <div class="std-auth__actions-container">
                    <button
                        v-if="this.form.company.warehouses.length > 1"
                        class="dart-btn dart-btn-secondary dart-btn-block align-items-center flex justify-content-center std-auth__button std-auth__button--secondary"
                        type="button"
                        @click="() => this.form.company.warehouses.pop()">
                        <span>Удалить</span>
                    </button>
                    <button
                        class="dart-btn dart-btn-secondary dart-btn-block align-items-center flex justify-content-center std-auth__button std-auth__button--secondary"
                        :disabled="this.loading"
                        type="button"
                        @click="() => this.form.company.warehouses.push({ value: '' })">
                        <i v-if="this.loading" class="pi pi-spin pi-spinner" style="font-size: 14px"></i>
                        <span>Добавить адрес</span>
                        <i class="pi pi-plus"></i>
                    </button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { useVuelidate } from "@vuelidate/core";
import { required } from "../utils/i18n-validators";
import { helpers } from "@vuelidate/validators";
import router from '../router';
import FileUpload from 'primevue/fileupload';
import Toast from 'primevue/toast';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Checkbox from 'primevue/checkbox';
import DropZone from 'dropzone-vue';
import Dialog from 'primevue/dialog';
import Accordion from '../components/Accordion.vue';
import Breadcrumbs from '../components/Breadcrumbs.vue';
import AddAddress from '../components/auth/AddAddress.vue';
import Autocomplete from '../components/Autocomplete.vue';

export default {
    name: 'ProfileCreateClient',
    props: {},
    data() {
        return {
            loading: false,
            showFormModal: false,
            typePrice: [],
            orgprofile: [],
            booleanValue: [
                {
                    name: 'Да',
                    value: 1
                },
                {
                    name: 'Нет',
                    value: 0
                }
            ],
            settingsForm: {},
            form: {
                fields: {
                    contacts: [
                        {
                            name: 'contact',
                            label: 'ФИО (контактного лица)',
                            placeholder: 'Иванов Иван Иванович',
                            type: 'text',
                            readonly: 0
                        },
                        {
                            name: 'phone',
                            label: 'Телефон (контактного лица)',
                            placeholder: '+79991234567',
                            type: 'text',
                            readonly: 0
                        },
                        {
                            name: 'email',
                            label: 'E-mail (контактного лица)',
                            placeholder: 'mail@site.ru',
                            type: 'text',
                            readonly: 0
                        }
                    ]
                },
                company: {
                    data: { value: '' },
                    inn: '',
                    warehouses: [{ address: {value: ''} }]
                }
            }
        };
    },
    methods: {
        ...mapActions(['get_organization_from_api', 'set_organization_data', 'org_profile_from_api', 'org_profile_set_from_api']),
        onUpload(data) {
            if (data.xhr.response) {
                const response = JSON.parse(data.xhr.response);
                if (Object.prototype.hasOwnProperty.call(response.data, 'files')) {
                    // перечень загруженныйх файлов

                    if (response.data.files[0].type === 'avatar') {
                        this.orgprofile.image = response.data.files[0];
                        this.orgprofile.upload_image = true;
                    }
                }
            }
            this.$toast.add({
                severity: 'info',
                summary: 'Логотип успешно загружен!',
                detail: 'Не забудьте сохранить изменения',
                life: 3000
            });
        },
        parseFile(files, xhr, formData) {
            const callback = (e) => {
                const res = JSON.parse(e);
                if (res.success) {
                    if (res.data.files[0].type === 'avatar') {
                        this.orgprofile.image = res.data.files[0];
                        this.orgprofile.upload_image = true;
                    }
                }
            };

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    callback(xhr.response);
                }
            };
        },
        async saveProfile() {
            // Валидируем
            // TODO Лоадер шестеренок при отправке формы
			const result = await this.v$.$validate();
			// const result = true;
			if (!result) {
				console.log(result);
			} else {
                this.loading = true
                const data = {
                    action: 'set/org/virtual_profile',
                    id: router.currentRoute._value.params.id,
                    client_id: router.currentRoute._value.params.client_id,
                    data: {
                        contact: this.orgprofile.contact,
                        email: this.orgprofile.email,
                        phone: this.orgprofile.phone,
                        image: this.orgprofile.image,
                        org: {
                            inn: this.form.company.inn,
                            name: this.form.company.data,
                            warehouses: this.form.company.warehouses
                        },
                        upload_image: this.orgprofile.upload_image
                    }
                }                
                this.org_profile_set_from_api(data).then((res) => {
                    if(!res.data.success){
                        this.$toast.add({ severity: 'error', summary: 'Ошибка!', detail: res.data.message, life: 3000 });
                    }else{
                        this.$toast.add({
                            severity: 'info',
                            summary: 'Сохранено!',
                            detail: res.data.message,
                            life: 3000
                        });
                        router.push({ name: 'clients', params: { id: router.currentRoute._value.params.id } });
                    }          
                    this.loading = false          
                });                
            }
        },
        updateAddress (address, index) {
            console.log(address)
            console.log(index)
        }
    },
    mounted() {
        if(router.currentRoute._value.params.client_id){
            this.org_profile_from_api({
                action: 'get/org/profile',
                id: router.currentRoute._value.params.client_id,
                owner_id: router.currentRoute._value.params.id
            });
        }        
    },
    components: {
        Toast,
        TabView,
        TabPanel,
        FileUpload,
        Dialog,
        Checkbox,
        DropZone,
        Accordion,
        Breadcrumbs,
        AddAddress,
        Autocomplete
    },
    computed: {
        ...mapGetters(['org_profile'])
    },
    setup() {
		return { v$: useVuelidate() };
	},
	validations() {
		return {
			orgprofile: {
				contact: {
					required,
				},
				email: {
					required,
				},
                phone: {
					required,
				}
			},
            form: {
                company: {
                    inn: {
                        required
                    },
                    data: {
                        value: {
                            required
                        }
                    },
                    warehouses: {
                        required: helpers.withMessage(
                            "Выберите хотя бы один адрес",
                            () => {
                                return this.form.company.warehouses.length && this.form.company.warehouses[0].address.value != ''
                            }
                        ),
                    },
                }
            }
		};
    },
    watch: {
        org_profile: function (newVal, oldVal) {
            if(!newVal.success){
                this.$toast.add({ severity: 'error', summary: 'Ошибка!', detail: newVal.message, life: 3000 });
                router.push({ name: 'clients', params: { id: router.currentRoute._value.params.id } });
            }else{
                this.orgprofile = newVal;
                this.form.company.inn = newVal.requisites["0"].inn
                this.form.company.data.value = newVal.requisites["0"].name
                if(newVal.warehouses){
                    const array1 = newVal.warehouses
                    array1.forEach((element, index) => {
                        if(index == 0){
                            this.form.company.warehouses[0].address.value = element.address
                            this.form.company.warehouses[0].address.coordinats = element.coordinats
                            this.form.company.warehouses[0].id = element.id
                        }else{
                            const newWarehouse = {
                                address: {
                                    value: element.address,
                                    coordinats: element.coordinats,
                                },                                
                                id: element.id
                            }
                            this.form.company.warehouses.push(newWarehouse)
                        }
                    });
                }
            }            
        }
    }
};
</script>

<style lang="scss">
.std-create-clients{
    padding-bottom: 80px;
}
.m-0 {
    margin: 0;
}
.ml-2 {
    margin-left: 10px;
}
.flex-left {
    display: flex;
    justify-content: flex-start;
}

.kenost-add-button {
    &:hover {
        color: #fff;
    }
    .pi {
        font-size: 16px;
    }
}

.text-m {
    font-weight: 500;
    font-size: 14px;
}

.text-s {
    font-weight: 500;
    font-size: 14px;
}

.cursor-pointer {
    cursor: pointer;
}

.text-sm {
    color: #adadad;
    font-size: 14px;
}

.w-full {
    width: 100%;
}

.justify-between {
    justify-content: space-between;
}

.avatar-org {
    width: 200px !important;
    height: 200px;
    border-radius: 50%;
    overflow: hidden;

    img {
        width: 100% !important;
        height: 100% !important;
        object-fit: cover;
    }
}

.p-accordion-header-link {
    text-decoration: none !important;
}

.kenost-form-for + .kenost-form-for {
    border-top: 1px solid var(--grey-stroke, #e2e2e2);
    margin-top: 20px;
    padding-top: 20px;
}

.name-requisit {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    gap: 12px;

    p {
        margin: 0;
    }

    &-edit {
        width: 30px;
        height: 30px;
        border: 1px solid transparent;
        cursor: pointer;
        background: #f8f8f8 !important;
        box-shadow: rgba(0, 0, 0, 0.14) 0px 2px 2px 0px;
        display: flex;
        border-radius: 5px;
        align-items: center;
        transition: all 0.4s;
        justify-content: center;

        &:hover {
            border: 1px solid #64748b;
        }

        .pi {
            color: #64748b;
            font-size: 12px;
        }
    }

    &-delete {
        margin-left: 8px;
        width: 30px;
        height: 30px;
        border: 1px solid transparent;
        cursor: pointer;
        background: #f8f8f8 !important;
        box-shadow: rgba(0, 0, 0, 0.14) 0px 2px 2px 0px;
        display: flex;
        border-radius: 5px;
        align-items: center;
        transition: all 0.4s;
        justify-content: center;

        &:hover {
            border: 1px solid #64748b;
        }

        .pi {
            color: #64748b;
            font-size: 12px;
        }
    }
}

.kenost-form-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0 16px;

    .w-50 {
        width: calc(50% - 8px) !important;
    }

    input:read-only {
        background: #f4f4f4;
    }
}

.buttons_container {
    .dart-btn + .dart-btn {
        margin-left: 5px;
    }
}
.dart-upload_files .item img {
    max-width: 52px;
    width: 100%;
}
.dart-form-block {
    display: block;
    span.title {
        display: block;
        font-size: 24px;
        line-height: 1.3;
        font-weight: 500;
    }
    &__content {
        padding: 15px 0;
        .dart-form-group {
            padding-top: 15px;
        }
    }
    .p-float-label {
        label {
            margin-top: -0.5rem;
            transform: none;
        }
    }
}
</style>
