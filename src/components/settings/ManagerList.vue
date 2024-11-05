<template>
    <ul class="manager-list">
        <li v-for="(manager, index) in items" v-bind:key="manager.id" class="manager-list__item">
            <div class="manager-list__header">
                <h2 class="manager-list__title">Менеджер {{ index + 1 }}</h2>
                <button class="button-none manager-list__delete-button" @click="deleteItem(index)">
                    <i class="std_icon-trash manager-list__delete-button-icon"></i>
                </button>
            </div>

            <div class="manager-list__content">
                <div class="manager-list__input-list">
                    <div v-for="(input) in form.info" class="form_input_group manager-list__input-container">
                        <input :type="input.type" v-model="manager[input.name]"
                            class="dart-form-control manager-list__input" :class="{ error: v$.items }"
                            :name="input.name" :placeholder="input.placeholder" />

                        <div v-if="v$.items" class="error__desc">
                            <span v-for="error of v$.items">
                                {{ error.$message }}
                            </span>
                        </div>
                    </div>
                </div>

                <div class="manager-list__block manager-list__clients">
                    <h3 class="manager-list__subtitle">Клиенты менеджера:</h3>
                    <div class="manager-list__checkbox-container">
                        <Checkbox v-model="manager.unlimitied_clients" inputId="unlimitied-clients" :binary="true"
                            class="manager-list__checkbox" />
                        <label class="manager-list__checkbox-label" for="unlimitied-clients">Неограниченный круг
                            клиентов</label>
                    </div>
                    <ClientList v-model:clients="manager.clients" />
                </div>

                <div class="manager-list__block manager-list__notifications">
                    <h3 class="manager-list__subtitle">Уведомления на почту:</h3>
                    <div class="manager-list__notification-list">
                        <div v-for="(notification, notificationIndex) in form.notifications"
                            class="manager-list__checkbox-container">
                            <Checkbox v-model="manager.notifications[notification.name]" :inputId="notification.name"
                                :binary="true" :value="!!manager.notifications[notification.name]"
                                class="manager-list__checkbox" />
                            <label class="manager-list__checkbox-label" :for="notification.name">{{
                                notification.label }}</label>
                        </div>
                    </div>
                </div>
            </div>
        </li>
        <button class="dart-btn dart-btn-primary manager-list__add-button" @click="addItem">
            <i class="std_icon-plus manager-list__add-button-icon"></i>
            Добавить менеджера
        </button>
    </ul>
</template>

<script>
import Checkbox from 'primevue/checkbox'
import useVuelidate from '@vuelidate/core';
import ClientList from './ClientList.vue';

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
        ClientList
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
                    {
                        label: "ФИО",
                        name: "name",
                        placeholder: "ФИО",
                        type: "text",
                    },
                    {
                        label: "Номер телефона",
                        name: "phone",
                        placeholder: "+7 (000) 000-00-00",
                        type: "tel",
                    },
                    {
                        label: "Почта",
                        name: "email",
                        placeholder: "example@example.com",
                        type: "email",
                    },
                ],
                notifications: [
                    {
                        name: "order_status_changes",
                        label: "Изменение статуса заказа в маркетплейсе",
                    },
                    {
                        name: "new_opt_order",
                        label: "Поступил новый оптовый заказ",
                    },
                    {
                        name: "company_enabled",
                        label: "Ваш компания отключена",
                    },
                    {
                        name: "company_connected",
                        label: "Ваша компания подключена",
                    },
                    {
                        name: "new_vendor",
                        label: "Появился новый поставщик",
                    },
                    {
                        name: "added_to_my_vendors",
                        label: "Вас добавили в мои поставщики",
                    },
                    {
                        name: "deleted_from_my_vendors",
                        label: "Вас удалили из моих поставщиков",
                    },
                ],
            }
        }
    },
    methods: {
        addItem() {
            this.$emit('update:items', [...this.items, {
                id: 1,
                name: '',
                email: '',
                phone: '',

                unlimitied_clients: true,
                clients: [
                    {
                        name: "МСТ"
                    },
                    {
                        name: "Челябинская область"
                    }
                ],

                notifications: {
                    order_status_changes: true,
                    new_opt_order: true,
                    company_enabled: true,
                    company_connected: true,
                    new_vendor: true,
                    added_to_my_vendors: true,
                    deleted_from_my_vendors: true
                },
            }]);
        },
        deleteItem(index) {
            this.$emit('update:items', [...this.items.slice(0, index), ...this.items.slice(index + 1)]);
        }
    }
}
</script>

<style lang="scss" scoped></style>