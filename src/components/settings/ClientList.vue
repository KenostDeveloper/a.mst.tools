<template>
    <ul class="client-list">
        <li v-for="(client, index) in clients" v-bind:key="client.id" @click.stop="setIsClientEditing(index)"
            :class="`client-list__item-wrapper ${isClientEditing === index ? 'client-list__item-wrapper--editing' : ''}`">
            <div class="client-list__item">
                <i v-if="client.icon" :class="`${client.icon} client-list__item-icon`"></i>
                <img v-if="client.image" :src="client.image" :alt="client.name" class="client-list__item-img">
                <span class="client-list__item-text">{{ client.name }}</span>
            </div>

            <ClientSuggestions v-if="isClientEditing === index" :suggestions="clients"
                @change="(newClient) => editClient(index, newClient)" />
        </li>
        <div v-if="isClientAdding" class="client-list__input-wrapper">
            <input ref="clientInput" type="text" placeholder="Введите город, регион или клиента"
                class="client-list__input" @click.stop />
            <ClientSuggestions :suggestions="clients" @change="addClient" />
        </div>
        <button class="button-none client-list__add-button" @click.stop="setIsClientAdding(!isClientAdding)">
            <span class="std_icon-plus client-list__add-button-icon"></span>
        </button>
    </ul>
</template>

<script>
import ClientSuggestions from './ClientSuggestions.vue';

export default {
    name: "ClientList",
    props: {
        clients: {
            type: Array,
            default: [],
        }
    },
    components: {
        ClientSuggestions,
    },
    data() {
        return {
            isClientAdding: false,
            isClientEditing: -1,
        }
    },
    methods: {
        setIsClientAdding(value) {
            this.isClientEditing = -1;
            this.isClientAdding = value;
        },
        setIsClientEditing(index) {
            if (this.isClientEditing === index) {
                this.isClientEditing = -1;
                return;
            }

            this.isClientAdding = false;
            this.isClientEditing = index;
        },
        addClient(client) {
            this.clients.push(client);
            this.isClientAdding = false;
            // this.$refs.clientInput.value = '';
            this.$emit('update:clients', this.clients);
        },
        editClient(index, newClient) {
            this.clients[index] = newClient;
            this.isClientEditing = -1;
            this.$emit('update:clients', this.clients);
            // this.$refs.clientInput.value = '';
        }
    },
    mounted() {
        window.addEventListener('click', () => {
            this.isClientEditing = -1;
            this.isClientAdding = false;
            // this.$refs.clientInput.value = '';
        })
    }
}
</script>

<style lang="scss" scoped></style>