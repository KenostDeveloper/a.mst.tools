<template>
  <form class="form-signin" @submit.prevent="formSubmit" v-if="!message">
    <input
      type="text"
      name="username"
      class="dart-form-control"
      placeholder="Логин или email"
      required=""
      v-model="form.email"
    />
    <button class="dart-btn dart-btn-primary dart-btn-block dart-mt-1" type="submit">Восстановить</button>
  </form>
  <div class="message" v-else>
    <p>{{ message }}</p>
  </div>
</template>

<script>
export default {
  name: 'auth-form',
  data () {
    return {
      form: {
        email: '',
        password: ''
      },
      message: ''
    }
  },
  methods: {
    formSubmit () {
      this.forgotPass()
    },
    forgotPass () {
      this.$load(async () => {
        const data = await this.$api.auth.signIn({
          username: this.form.email,
          password: this.form.password
        })
        this.message = data.data.message
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.message{
  font-size: 16px;
  color: #282828;
}
</style>
