<template>
  <div class="analytics_auth">
    <form class="form-signin" @submit.prevent="formSubmit">
      <Toast />
      <div class="logo text-center">
        <img src="../../assets/images/logo.svg" alt="" width="200">
      </div>
      <input
        type="text"
        name="username"
        class="dart-form-control"
        placeholder="Логин"
        required=""
        v-model="form.email"
      />
      <input
        type="password"
        name="password"
        class="dart-form-control"
        placeholder="Пароль"
        required=""
        v-model="form.password"
      />
      <button class="dart-btn dart-btn-primary dart-btn-block" type="submit">Войти</button>
      <teleport to="body">
        <custom-modal v-model="showForgotModal" @cancel="cancel">
          <template v-slot:title>Восстановление пароля</template>
          <v-forgot />
        </custom-modal>
      </teleport>
      <div class="form-signin__desc">
        <a href="" @click.prevent="showForgotModal = true">Забыли пароль?</a>
      </div>
      <div class="form-signin__copy">
        <span>© MST, {{ getYear }}.</span>
      </div>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import customModal from '../CustomModal.vue'
import vForgot from './v-forgot.vue'
import Toast from 'primevue/toast'

export default {
  name: 'auth-form',
  data () {
    return {
      mode: 'signIn',
      showForgotModal: false,
      form: {
        email: '',
        password: ''
      },
      errors: []
    }
  },
  computed: {
    getYear () {
      return new Date().getFullYear()
    }
  },
  methods: {
    ...mapActions([
      'org_get_from_api',
    ]),
    formSubmit () {
      this.signIn()
    },
    signIn () {
      this.$load(async () => {
        const data = await this.$api.auth.signIn({
          username: this.form.email,
          password: this.form.password
        })
        if (data) {
          if (data === 'technical error') {
            this.$toast.add({ severity: 'info', summary: 'Техническая ошибка', detail: 'Попробуйте позже.', life: 3000 })
          } else {
            localStorage.setItem('user', JSON.stringify(data.data.data))
            this.$store.dispatch('user/setUser', data.data.data)
            // this.$router.push({ name: 'home' })

            // this.$router.push({ name: 'org', params: { id: '48' } })

            const orgs = await this.org_get_from_api({
              action: 'get/orgs'
            })

            if(orgs){
              console.log(orgs.data.data)
              const res = await this.$router.push({ name: 'org', params: { id: orgs.data.data[0].id } })
              location.reload();
            }
            
          }
        } else {
          this.$toast.add({ severity: 'info', summary: 'Вход запрещен', detail: 'Введен некорректный логин или пароль.', life: 3000 })
        }
      })
    },
    cancel (close) {
      close()
    }
  },
  components: {
    customModal,
    vForgot,
    Toast
  }
}
</script>

<style lang="scss">
</style>
