<template>
    <ul class="client-suggestions">
        <li v-for="suggestion in suggestions" class="client-suggestions__item" @click.stop="selectClient(suggestion)">
            <i v-if="suggestion.icon" :class="`client-suggestions__item-icon ${suggestion.icon}`"></i>
            <img v-if="suggestion.image" :src="suggestion.image" :alt="suggestion.name" class="client-suggestions__item-img">
            <span class="client-suggestions__item-text">{{ suggestion.name }}</span>
        </li>
    </ul>
</template>

<script>
export default {
    name: "ClientSuggestions",
    props: {
        suggestions: {
            type: Array,
            required: true
        }
    },
    methods: {
        selectClient(suggestion) {
            this.$emit("change", suggestion);
        }
    }
}
</script>

<style lang="scss" scoped></style>