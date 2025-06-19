import Axios from 'axios';
import router from '../router';

export default {
    state: {},
    actions: {
        get_organization_by_inn({ commit }, data) {
            return Axios('/rest/front_dadata', {
                method: 'POST',
                data: {
                    ...data,
                    action: 'get_organization/inn'
                },
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            })
                .then((response) => {
                    return response;
                })
                .catch((error) => {});
        },
        suggest({ commit }, data) {
            return Axios('/rest/front_dadata', {
                method: 'POST',
                data: {
                    ...data,
                    action: 'suggest'
                },
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            })
                .then((response) => {
                    return response;
                })
                .catch((error) => {});
        }
    },
    mutations: {},
    getters: {}
};
