<template>
  <div>
    <teleport to="body">
      <custom-modal v-model="show_request_modal" @close="formReset">
        <template v-slot:title>Создание заявки</template>
        <form action="#" @submit.prevent="formSubmit">
          <div class="balance-request-form">
            <div class="dart-form-group" :class="{ error: v$.form.name.$errors.length }">
              <div class="flex flex-column gap-2">
                <label for="balance-request-name">Ваше имя</label>
                <InputText id="balance-request-name" v-model="form.name" aria-describedby="balance-request-name-help" />
                <small id="balance-request-name-help">Укажите имя контактного лица.</small>
                <span class="error_desc" v-for="error of v$.form.name.$errors" :key="error.$uid">
                  {{ error.$message }}
                </span>
              </div>
            </div>
            <div class="dart-form-group" :class="{ error: v$.form.phone.$errors.length }">
              <div class="flex flex-column gap-2">
                <label for="balance-request-name">Ваш телефон</label>
                <InputText id="balance-request-name" v-model="form.phone" aria-describedby="balance-request-name-help" />
                <small id="balance-request-name-help">Укажите телефон контактного лица.</small>
                <span class="error_desc" v-for="error of v$.form.phone.$errors" :key="error.$uid">
                  {{ error.$message }}
                </span>
              </div>
            </div>
            <div class="dart-form-group">
              <div class="flex flex-column gap-2">
                <label for="balance-request-name">Комментарий</label>
                <Textarea  id="balance-request-name" v-model="form.description" aria-describedby="balance-request-name-help" />
                <small id="balance-request-name-help">Укажите комментарий к заявке. Например, удобный промежуток времени для звонка.</small>
              </div>
            </div>
          </div>
          <div class="dart-form-info-block">
            <div class="dart-form-info-block__item">
              <span>Сумма для вывода</span>
              <span class="value">{{ organization.balance }} ₽ </span>
            </div>
          </div>
          <button class="dart-btn dart-btn-primary dart-btn-block dart-mt-1" type="submit" :class="{ 'dart-btn-loading': loading }" :disabled="loading">Создать заявку</button>
        </form>
      </custom-modal>
    </teleport>
    <div class="profile-content__title">
      <div class="text">
        <span class="title">Вывод средств</span>
      </div>
      <a href="#" class="dart-btn dart-btn-primary-outline" @click.prevent="show_request_modal = true">Заявка на вывод средств</a>
    </div>
    <div class="dart-row">
      <div class="d-col-md-6">
        <div class="panel-widget">
          <v-table
            :items_data="balance.items"
            :total="balance.total"
            :pagination_items_per_page="this.pagination_items_per_page"
            :pagination_offset="this.pagination_offset"
            :page="this.page_balance"
            :table_data="this.balance_table_data"
            title="История операций"
          >
          </v-table>
        </div>
      </div>
      <div class="d-col-md-6">
        <div class="panel-widget">
          <v-table
            :items_data="balance_requests.items"
            :total="balance_requests.total"
            :pagination_items_per_page="this.pagination_items_per_page"
            :pagination_offset="this.pagination_offset"
            :page="this.page_balance_requests"
            :table_data="this.balance_request_table_data"
            title="История заявок"
          >
          </v-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import router from '@/router'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import vTable from '@/components/table/v-table'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@/utils/i18n-validators'
import customModal from '@/components/popup/CustomModal'

export default {
  name: 'ProfileBalance',
  props: {
    org: {
      type: Array,
      default: () => {
        return []
      }
    },
    pagination_items_per_page: {
      type: Number,
      default: 25
    },
    pagination_offset: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      loading: false,
      form: {
        name: '',
        phone: '',
        description: ''
      },
      show_request_modal: false,
      page_balance: 1,
      page_balance_requests: 1,
      balance_table_data: {
        date: {
          label: 'Дата',
          type: 'text'
        },
        type: {
          label: 'Тип операции',
          type: 'text'
        },
        value: {
          label: 'Сумма',
          type: 'text'
        },
        description: {
          label: 'Основание',
          type: 'text'
        }
      },
      balance_request_table_data: {
        date: {
          label: 'Дата',
          type: 'text'
        },
        id: {
          label: 'Номер заявки',
          type: 'text'
        },
        value: {
          label: 'Сумма у получению',
          type: 'text'
        },
        status: {
          label: 'Статус',
          type: 'status'
        }
      }
    }
  },
  methods: {
    ...mapActions([
      'set_balance_request_to_api',
      'get_organization_from_api',
      'get_balance_from_api',
      'get_balance_requests_from_api'
    ]),
    paginate_balance (data) {
      this.page_balance = data.page
      this.get_balance_from_api(data)
    },
    paginate_balance_requests (data) {
      this.page_balance_requests = data.page
      this.get_balance_requests_from_api(data)
    },
    async formSubmit (event) {
      const result = await this.v$.$validate()
      if (!result) {
        console.log(result)
      } else {
        this.$load(async () => {
          this.loading = true
          await this.set_balance_request_to_api({
            action: 'set',
            type: 'balance_request',
            id: router.currentRoute._value.params.id,
            form: this.form
          }).then((data) => {
            console.log(data)
            this.show_request_modal = false
            this.loading = false
            this.get_balance_requests_from_api({
              page: 1,
              perpage: this.pagination_items_per_page
            })
            this.formReset()
          })
        })
      }
    },
    formReset () {
      this.form.name = ''
      this.form.phone = ''
      this.form.description = ''
    }
  },
  mounted () {
    this.get_organization_from_api()
    this.get_balance_from_api({
      page: this.page_balance,
      perpage: this.pagination_items_per_page
    })
    this.get_balance_requests_from_api({
      page: this.page_balance_requests,
      perpage: this.pagination_items_per_page
    })
  },
  components: { InputText, vTable, Textarea, customModal },
  setup () {
    return { v$: useVuelidate() }
  },
  validations () {
    return {
      form: {
        name: { required },
        phone: { required }
      }
    }
  },
  computed: {
    ...mapGetters([
      'organization',
      'balance',
      'balance_requests'
    ])
  }
}
</script>

<style lang="scss">
.dart-form-info-block{
  border-top: 1px solid #C5C5C5;
  padding-top: 12px;
  margin-bottom: 24px;
  &__item{
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
    span{
      color: #282828;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 130%;
      letter-spacing: 0.5px;
      &.value{
        font-size: 20px;
        font-weight: 500;
        letter-spacing: 0;
      }
    }
  }
}
</style>
