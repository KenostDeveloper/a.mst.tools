<script>
import axios from 'axios';
import Input from './ui/Input.vue';
import SearchInput from './ui/SearchInput.vue';

export default {
    name: 'Autocomplete',
    inheritAttrs: false,
    props: {
        modelValue: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: 'text'
        },
        selectionType: {
            type: String,
            default: 'single'
        },
        selections: {
            type: Array,
            default: []
        },
        inputType: {
            type: String,
            default: 'input',
            validator(value) {
                return ['input', 'search'].includes(value);
            }
        }
    },
    components: {
        Input,
        SearchInput
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
            // console.log("Selection: ", selection);

            if (this.selectionType == 'multiple') {
                this.debounce(() => this.isActive = false, 100);
                this.value = '';
                this.$emit('setSelections', [this.selections, selection]);

                return;
            }

            if (this.selectionType == 'single') {
                this.debounce(() => this.isActive = false, 100);
                this.$emit('setSelection', selection);

                return;
            }
        },
        debounce(func, delay) {
            clearTimeout(this.inputTimer);
            this.inputTimer = setTimeout(func, delay);
        },
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
                if (this.inputType === 'input') this.$emit('update:modelValue', newVal);
            },
            deep: true
        }
    }
};
</script>

<template>
    <template v-if="inputType === 'input'">
        <Input v-bind="$attrs" ref="input" @focus="getData" @blur="debounce(() => isActive = false, 100)"
            @input="getData" v-model="value">
        <ul ref="suggestions" class="d-input__suggestions" :class="{ 'd-input__suggestions--active': isActive }">
            <!-- TODO Когда много букав, они улетают за границы видимого (по настроению) -->
            <li v-for="suggestion in suggestions" @click.stop="addSelection(suggestion)" class="d-input__suggestion">
                {{ suggestion.value }}
            </li>
        </ul>
        </Input>
    </template>

    <template v-if="inputType === 'search'">
        <SearchInput v-bind="$attrs" ref="input" @blur="debounce(() => isActive = false, 100)" v-model="value"
            :onSubmit="getData">

            <ul ref="suggestions" class="d-search__suggestions" :class="{ 'd-search__suggestions--active': isActive }">
                <li v-for="suggestion in suggestions" @click.stop="addSelection(suggestion)"
                    class="d-search__suggestion">
                    {{ suggestion.value }}
                </li>
            </ul>
        </SearchInput>
    </template>


</template>

<style lang="scss" scoped></style>
