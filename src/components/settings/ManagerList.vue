<template>
    <ul class="manager-list">
        <li v-for="(manager, indexi) in items" v-bind:key="manager.id" class="manager-list__item">
            <div class="manager-list__header">
                <h2 class="manager-list__title">Менеджер {{ indexi + 1 }}</h2>
                <button class="button-none manager-list__delete-button" @click="deleteItem(indexi)">
                    <i class="std_icon-trash manager-list__delete-button-icon"></i>
                </button>
            </div>

            <div class="manager-list__content">
                <div class="manager-list__input-list">
                    <div v-for="(input) in form.info" class="form_input_group manager-list__input-container">
                        <input v-if="input.type !== 'tel'" :type="input.type" v-model="manager[input.name]"
                            class="dart-form-control manager-list__input" :class="{ error: v$.items }"
                            :name="input.name" :placeholder="input.placeholder" />
                        <input v-else :type="input.type" v-imask="mask" :value="manager[input.name]"
                            class="dart-form-control manager-list__input" :class="{ error: v$.items }"
                            :name="input.name" :placeholder="input.placeholder" @accept="(e) => manager[input.name] = e.detail.unmaskedValue" />

                        <div v-if="v$.items" class="error__desc">
                            <span v-for="error of v$.items">
                                {{ error.$message }}
                            </span>
                        </div>
                    </div>
                </div>

                <div class="manager-list__block manager-list__clients">
                    <h3 class="manager-list__subtitle">Устанавливается ответственным за заказ \ потребность в 1с для клиентов:</h3>
                    <div v-if="canSelectUnlimited(manager)" class="manager-list__checkbox-container">
                        <Checkbox v-model="manager.unlimitied_responsible" :inputId="'responsible-clients-'+manager.id" :binary="true"
                            class="manager-list__checkbox" @change="toggleUnlimited(manager)" />
                        <label class="manager-list__checkbox-label" :for="'responsible-clients-'+manager.id">Неограниченный круг
                            клиентов</label>
                    </div>
                    <CustomTreeSelect v-if="!manager.unlimitied_responsible" :allSelectedKeys="allSelectedClients"
                        v-model="manager.responsible" :options="regions_and_stores_tree" placeholder="Выберите клиентов" />
                </div>

                <div class="manager-list__block manager-list__clients">
                    <h3 class="manager-list__subtitle">Клиенты менеджера:</h3>
                    <div class="manager-list__checkbox-container">
                        <Checkbox v-model="manager.unlimitied_clients" :inputId="'unlimitied-clients-'+manager.id" :binary="true"
                            class="manager-list__checkbox"/>
                        <label class="manager-list__checkbox-label" :for="'unlimitied-clients-'+manager.id">Неограниченный круг
                            клиентов</label>
                    </div>
                    <MultiSelect v-if="!manager.unlimitied_clients" class="w-full md:w-20rem kenost-multiselect mt-2" filter v-model="manager.clients" display="chip"
                        :options="regions_and_stores" optionValue="id" optionLabel="name" placeholder="Выберите клиентов" />
                    <!-- <CustomTreeSelect v-if="!manager.unlimitied_clients" :allSelectedKeys="allSelectedClients"
                        v-model="manager.clients" :options="regions_and_stores" placeholder="Выберите клиентов" /> -->
                </div>

                <div class="manager-list__block manager-list__notifications">
                    <h3 class="manager-list__subtitle">Уведомления на почту:</h3>
                    <div class="manager-list__notification-list">
                        <div v-for="(notification, notificationIndex) in form.notifications"
                            class="manager-list__checkbox-container">
                            <Checkbox v-model="manager.notifications[notification.name]" :inputId="notification.name+'-'+indexi"
                                :binary="true" :value="!!manager.notifications[notification.name]"
                                class="manager-list__checkbox" />
                            <label class="manager-list__checkbox-label" :for="notification.name+'-'+indexi">{{
                                notification.label }}</label>
                        </div>
                    </div>
                </div>
            </div>
        </li>
        <button class="dart-btn dart-btn-primary manager-list__add-button" @click="addItem">
            <i class="mst_icon-plus manager-list__add-button-icon"></i>
            <span>Добавить менеджера</span>
        </button>
    </ul>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Checkbox from 'primevue/checkbox'
import useVuelidate from '@vuelidate/core';
import { IMaskDirective } from 'vue-imask';
import router from "../../router";
import CustomTreeSelect from '../opt/CustomTreeSelect.vue'
import MultiSelect from 'primevue/multiselect'

export default {
    name: 'ManagerList',
    props: {
        items: {
            type: Array,
            default: [],
        },
    },
    components: {
        Checkbox,
        MultiSelect,
        CustomTreeSelect
    },
    directives: {
        imask: IMaskDirective
    },
    setup() {
        return {
            v$: useVuelidate()
        }
    },
    data() {
        return {
            form: {
                info: [
                    { label: "ФИО", name: "name", placeholder: "ФИО", type: "text" },
                    { label: "Номер телефона", name: "phone", placeholder: "+7 (000) 000-00-00", type: "tel" },
                    { label: "Почта", name: "email", placeholder: "example@example.com", type: "email" },
                ],
                notifications: [
                    { name: "order_status_changes", label: "Изменение статуса заказа в маркетплейсе" },
                    { name: "new_opt_order", label: "Поступил новый оптовый заказ" },
                    { name: "company_enabled", label: "Ваша компания отключена" },
                    { name: "company_connected", label: "Ваша компания подключена" },
                    { name: "new_vendor", label: "Появился новый поставщик" },
                    { name: "added_to_my_vendors", label: "Вас добавили в мои поставщики" },
                    { name: "deleted_from_my_vendors", label: "Вас удалили из моих поставщиков" },
                    { name: "info_offer", label: "Информация о предложениях" },
                ],
            },
            mask: { mask: '+{7} (000) 000-00-00' }
        }
    },
    methods: {
        ...mapActions(["get_stores_and_regions", "get_stores_and_regions_tree"]),
        addItem() {
            this.$emit('update:items', [...this.items, {
                id: this.items.length + 1,
                name: '',
                email: '',
                phone: '',
                unlimitied_clients: false, // Новые менеджеры не могут выбрать "Неограниченный круг клиентов"
                clients: [],
                notifications: {
                    order_status_changes: true,
                    new_opt_order: true,
                    company_enabled: true,
                    company_connected: true,
                    new_vendor: true,
                    added_to_my_vendors: true,
                    deleted_from_my_vendors: true,
                    info_offer: true
                },
            }]);
        },
        deleteItem(index) {
            const wasUnlimited = this.items[index].unlimitied_responsible;
            this.$emit('update:items', [...this.items.slice(0, index), ...this.items.slice(index + 1)]);

            // Если удалили менеджера с "Неограниченным кругом клиентов", сбрасываем блокировку
            if (wasUnlimited) {
                this.items.forEach(manager => (manager.unlimitied_responsible = false));
            }
        },
        toggleUnlimited(selectedManager) {
            if (selectedManager.unlimitied_responsible) {
                // Если выбираем "Неограниченный круг клиентов", сбрасываем у всех остальных
                this.items.forEach(manager => {
                    if (manager !== selectedManager) manager.unlimitied_responsible = false;
                });
            }
        }
    },
    computed: {
        ...mapGetters(["regions_and_stores", "regions_and_stores_tree"]),
        allSelectedClients() {
            return [...new Set(this.items.flatMap(manager => manager.responsible))];
        },
        hasUnlimitedClient() {
            return this.items.some(manager => manager.unlimitied_responsible);
        },
        canSelectUnlimited() {
            return (manager) => !this.hasUnlimitedClient || manager.unlimitied_responsible;
        }
    },
    mounted() {
        this.get_stores_and_regions({
            action: "get/regions/stores",
            id: router.currentRoute._value.params.id
        });

        this.get_stores_and_regions_tree({
            action: "get/regions/stores",
            id: router.currentRoute._value.params.id,
            tree: true
        });
    },
}
</script>


<style lang="scss" scoped>
.disabled-tree-table-checkbox {
    opacity: 0.5;
    pointer-events: none;
}
</style>