<script>
import axios from 'axios';

export default {
    name: 'Autocomplete',
    props: {
        modelValue: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: 'city'
        },
        placeholder: {
            type: String
        },
        required: {
            type: Boolean,
            default: false
        },
        selectionType: {
            type: String,
            default: 'multiple'
        },
        selections: {
            type: Array,
            default: []
        },
        autocomplete: {
            type: String,
            default: "off"
        }
    },
    data() {
        return {
            inputTimer: null,
            isActive: false,
            value: this.modelValue,
            suggestions: []
        };
    },
    methods: {
        async getData() {
            let funcChanged = null;
            console.log(this.value);

            switch (this.type) {
                case 'city': {
                    funcChanged = this.getCities;
                    break;
                }
                case 'company': {
                    funcChanged = this.getCompanies;
                    break;
                }
                case 'address': {
                    funcChanged = this.getAddress;
                    break;
                }
                case 'fio': {
                    funcChanged = this.getFio;
                    break;
                }
            }

            this.debounce(await funcChanged, 300);
        },
        async getCities() {
            const citiesSuggestions = await axios.post(
                'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address',
                {
                    query: this.value,
                    from_bound: { value: 'city' },
                    to_bound: { value: 'settlement' }
                },
                {
                    headers: {
                        Authorization: `Token ${import.meta.env.VITE_DADATA_API_KEY}`
                    }
                }
            );

            this.suggestions = this.filterCities(citiesSuggestions.data?.suggestions);

            if (this.suggestions.length) {
                this.isActive = true;
            } else {
                this.isActive = false;
            }
        },
        async getCompanies() {
            const companiesResponse = await axios.post(
                'https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/party',
                {
                    query: this.value
                },
                {
                    headers: {
                        Authorization: `Token ${import.meta.env.VITE_DADATA_API_KEY}`
                    }
                }
            );

            this.suggestions = companiesResponse.data?.suggestions;

            if (this.suggestions.length) {

                this.isActive = true;
            } else {
                this.isActive = false;
            }
        },
        async getAddress() {
            const response = await axios.post(
                'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address',
                {
                    query: this.value
                },
                {
                    headers: {
                        Authorization: `Token ${import.meta.env.VITE_DADATA_API_KEY}`
                    }
                }
            );

            this.suggestions = response.data?.suggestions;

            if (this.suggestions.length) {
                this.isActive = true;
            } else {
                this.isActive = false;
            }
        },
        async getFio() {
            const response = await axios.post(
                'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/fio',
                {
                    query: this.value
                },
                {
                    headers: {
                        Authorization: `Token ${import.meta.env.VITE_DADATA_API_KEY}`
                    }
                }
            );

            this.suggestions = response.data?.suggestions;

            if (this.suggestions.length) {
                this.isActive = true;
            } else {
                this.isActive = false;
            }
        },
        filterCities(cities) {
            return cities?.reduce((filteredCities, city) => {
                const citySplitted = city.value.split(', ');

                citySplitted.forEach((currentCity) => {
                    const filteredCity = this.getAvailableCity(filteredCities, currentCity);

                    if (filteredCity) {
                        filteredCities.push(city);
                    }
                });

                return filteredCities;
            }, []);
        },

        getAvailableCity(filteredCities, city) {
            return city;
        },

        removeSelection(index) {
            const tempSelections = this.selections;
            tempSelections.splice(index, 1);

            this.$emit('setSelections', tempSelections);
        },
        addSelection(selection) {
            if (this.selectionType == 'multiple') {
                const tempSelections = this.selections;

                tempSelections.push(selection);

                this.isActive = false;

                this.value = '';
                this.$emit('setSelections', tempSelections);

                return;
            }

            if (this.selectionType == 'single') {
                this.$emit('setSelection', selection);
                this.isActive = false;

                return;
            }
        },
        debounce(func, delay) {
            clearTimeout(this.inputTimer);
            this.inputTimer = setTimeout(func, delay);
        },
        suggestionsListToInput() {
            const suggestions = this.$refs.suggestions;
            const autocomplete = this.$refs.autocomplete;

            // Позиционирование списка относительно инпута
            suggestions.style.width = autocomplete.clientWidth + 'px';
            suggestions.style.top = autocomplete.offsetTop + autocomplete.clientHeight + 10 + 'px';
            suggestions.style.left = autocomplete.offsetLeft + 'px';
        },

        focus() {
            this.$refs.input.focus();
        }
    },
    mounted() {
        // this.getData();
        // this.suggestionsListToInput();
    },
    watch: {
        modelValue: {
            handler(newVal) {
                this.value = newVal;
            },
            deep: true
        },
        value: {
            handler(newVal) {
                this.$emit('update:modelValue', newVal);
            },
            deep: true
        }
    }
};
</script>

<template>
    <input ref="input" @focus="getData" @blur="this.isActive = false" @input="getData" v-model="value" type="text"
        class="d-input__field" :placeholder="placeholder" :required="required" :autocomplete="autocomplete" />

    <ul ref="suggestions" class="d-input__suggestions" :class="{ 'd-input__suggestions--active': isActive }">
        <!-- TODO Когда много букав, они улетают за границы видимого -->
        <li v-for="suggestion in suggestions" @click="addSelection(suggestion)" class="d-input__suggestion">
            {{ suggestion.value }}
        </li>
    </ul>
</template>

<style lang="scss" scoped></style>
