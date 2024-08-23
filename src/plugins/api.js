import api from '../api/index'

export default {
  install: (app, options) => {
    app.config.globalProperties.$api = api
    app.provide('api', options)
  }
}
