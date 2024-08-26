<template>
  <Toast />
  <ConfirmDialog></ConfirmDialog>
  <div class="to__up">
    <router-link :to="{ name: 'stores', params: { id: $route.params.id } }">
      <mdicon name="arrow-left" />
      <span>Назад к товарам</span>
    </router-link>
  </div>
  <!-- <div class="profile-content b-wrap"> -->
    <div class="profile-content__title">
      <span class="title">{{ product.pagetitle }} (Артикул: {{ product.article }})</span>
    </div>
    <div class="main-widgets">
      <div class="dart-row">
        <!-- item -->
        <div class="d-col-lg-3">
          <div class="panel_widget panel_widget_number">
            <span class="title">Остаток</span>
            <span class="description">На сегодня</span>
            <span class="value">{{ product.remains }}</span>
          </div>
        </div>
        <!-- / item -->
        <!-- item -->
        <div class="d-col-lg-3">
          <div class="panel_widget panel_widget_number">
            <span class="title">Зарезервировано</span>
            <span class="description">На сегодня</span>
            <span class="value">{{ product.reserved }}</span>
          </div>
        </div>
        <!-- / item -->
        <!-- item -->
        <div class="d-col-lg-3">
          <div class="panel_widget panel_widget_number">
            <span class="title">Доступно</span>
            <span class="description">для продажи</span>
            <span class="value">{{ product.available }}</span>
          </div>
        </div>
        <!-- / item -->
        <!-- item -->
        <div class="d-col-lg-3">
          <div class="panel_widget panel_widget_number">
            <span class="title">Продаж</span>
            <span class="description">за все время</span>
            <span class="value">{{ product.sales }}</span>
          </div>
        </div>
        <!-- / item -->
      </div>
    </div>
    <div class="product_form">
      <div class="dart-row dart-align-items-center">
        <div class="d-col-lg-6" v-if="product.product_id > 0">
          <div class="profile-content__title">
            <span class="title mt-4">Привязка товара</span>
          </div>
          <p class="info-text">Чтобы привязать товар из 1С, найдите этот товар в нашем каталоге. Если товара в каталоге нет, оформите запрос на создание карточки товара. </p>
            <div class="form_input_group">
              <AutoComplete
                v-model="form.selectedProduct"
                :suggestions="form.filteredProduct"
                optionLabel="label"
                :dropdown="true"
                placeholder='Начните вводить наименование товара'
                @complete="searchProduct($event)"
                @change="setProduct($event)"
              >
                  <template #item="slotProps">
                  <img :alt="slotProps.item.label" :src="'http://mst.tools/' + slotProps.item.image" />
                  <div>{{ slotProps.item.label }}</div>
                </template>
              </AutoComplete>
              <a href="#" class="request_alert" @click.prevent="showRequestModal = true" v-if="getrequests.total < 1 && product.product_id == 0">Запросить создание карточки товара</a>
            </div>
          <div class="linked_product mt-4">
            <div class="image">
              <img :src="'http://mst.tools/' + product.image" alt="">
            </div>
            <div class="text">
              <span class="title">{{ product.pagetitle }}</span>
              <span class="desc"><b class="lb">Артикул:</b> {{ product.product_article }}</span>
              <span class="desc"><b class="lb">Артикул производителя:</b> {{ product.vendor_article }}</span>
            </div>
          </div>
        </div>
        <div class="d-col-md-6" v-else>
          <div v-if="getrequests.total > 0">
            <v-table
              :items_data="getrequests.items"
              :total="getrequests.total"
              :pagination_items_per_page="this.pagination_items_per_page"
              :pagination_offset="this.pagination_offset"
              :page="this.page"
              :table_data="this.table_data"
              :filters="this.filters"
              title="Запросы карточек товара"
              @deleteElem="deleteRequest"
            >
              <template v-slot:desc>
                <span class="desc">Ваши запросы на создание карточки товара.</span>
              </template>
            </v-table>
          </div>
        </div>
      </div>
      <div class="product_remains dart-mt-2">
        <div class="profile-content__title">
          <span class="title">История остатков</span>
        </div>
        <div class="dart-row">
          <div class="d-col-lg-6">
            <Calendar
            class="calendar-history"
            is-expanded
            title-position="left"
            :attributes="product.dates"
            :masks="{ weekdays: 'WW' }"/>
          </div>
        </div>
      </div>
    </div>
  <!-- </div> -->
  <teleport to="body">
    <custom-modal v-model="showRequestModal" @cancel="cancelRequest" class="plan-modal">
      <template v-slot:title>Запрос на создание карточки товара</template>
      <form @submit.prevent="onSubmitRequest">
        <div class="dart-row">
          <div class="d-col-md-6">
            <div class="dart-form-group">
              <label for="name">Наименование товара</label>
              <InputText v-model="request.form.name" placeholder="" />
            </div>
          </div>
          <div class="d-col-md-6">
            <div class="dart-form-group">
              <label for="name">Ссылка на товар на другом сайте</label>
              <InputText v-model="request.form.url" placeholder="" />
            </div>
          </div>
          <div class="d-col-md-12">
            <div class="dart-form-group">
              <label for="">Комментарий</label>
              <Textarea v-model="request.form.description" rows="3" cols="30" />
            </div>
          </div>
        </div>
        <button class="dart-btn dart-btn-primary dart-btn-block dart-mt-1" type="submit" :class="{ 'dart-btn-loading': loadingRequest }" :disabled="loadingRequest">Запросить</button>
      </form>
    </custom-modal>
  </teleport>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import router from '../router'
import AutoComplete from 'primevue/autocomplete'
import Axios from 'axios'
import vTable from '../components/table/v-table.vue'
import customModal from '../components/CustomModal.vue'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import ConfirmDialog from 'primevue/confirmdialog'
import Toast from 'primevue/toast'
import { Calendar } from 'v-calendar'
import 'v-calendar/dist/style.css'

export default {
  name: 'ProfileProduct',
  props: {
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
      page: 1,
      showRequestModal: false,
      loadingRequest: false,
      request: {
        form: {
          name: '',
          url: '',
          description: ''
        }
      },
      form: {
        selectedProduct: null,
        filteredProduct: null,
        filter: ''
      },
      table_data: {
        name: {
          label: 'Наименование',
          type: 'text',
          sort: false
        },
        url: {
          label: 'URL',
          type: 'text',
          sort: false
        },
        description: {
          label: 'Описание',
          type: 'text',
          sort: false
        },
        status_name: {
          label: 'Статус',
          type: 'text',
          sort: false
        },
        actions: {
          label: 'Действия',
          type: 'actions',
          sort: false,
          available: {
            delete: {
              icon: 'pi pi-trash',
              label: 'Удалить'
            }
          }
        }
      }
    }
  },
  methods: {
    ...mapActions([
      'get_product_from_api',
      'get_product_requests',
      'set_object_to_api',
      'unset_request'
    ]),
    ...mapMutations([
      'SET_PRODUCT_LINK'
    ]),
    searchProduct (event) {
      this.$load(async () => {
        const data = await this.$api.getProducts.get({
          filter: event.query
        })
        // console.log(data.data.data)
        this.form.filteredProduct = data.data.data.products
        // console.log(this.form.filteredProduct)
      })
    },
    setProduct (event) {
      const target = Object.assign({}, event.value)
      console.log(target)
      this.$load(async () => {
        const data = await this.$api.getProducts.set({
          action: 'set',
          id: router.currentRoute._value.params.id,
          type: router.currentRoute._value.params.type,
          remain_id: this.product.id,
          value: target.value
        })
        this.$store.commit('SET_PRODUCT_LINK', data.data.data)
        // console.log(this.form.filteredProduct)
      })
    },
    deleteRequest (data) {
      console.log(data)
      this.$confirm.require({
        message: 'Вы уверены, что хотите удалить заявку на ' + data.name + '?',
        header: 'Подтверждение',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.unset_request()
          // отправление AJAX
          return Axios('/rest/front_deleteobject', {
            method: 'POST',
            data: {
              id: router.currentRoute._value.params.id,
              type: 'request',
              request_id: data
            },
            headers: {
              'Access-Control-Allow-Origin': '*'
            }
          })
            .then((response) => {
              this.$toast.add({ severity: 'info', summary: 'Удаление', detail: 'Заявка ' + data.name + ' успешно удалена', life: 3000 })
              this.get_product_requests()
            })
            .catch(error => {
              if (error.response.status === 403) {
                this.$toast.add({ severity: 'error', summary: 'Вы не авторизованы', detail: 'Вы будете перенаправлены на страницу авторизации', life: 3000 })
                localStorage.removeItem('user')
                router.push({ name: 'home' })
              } else {
                this.$toast.add({ severity: 'error', summary: 'Произошла ошибка', detail: 'Мы скоро это поправим', life: 3000 })
              }
            })
        },
        reject: () => {
          this.$toast.add({ severity: 'error', summary: 'Удаление', detail: 'Удаление отклонено', life: 3000 })
        }
      })
    },
    onSubmitRequest () {
      this.loadingRequest = true
      this.$load(async () => {
        await this.set_object_to_api({
          action: 'set',
          type: 'request',
          id: router.currentRoute._value.params.id,
          product_id: this.product.id,
          data: this.request.form
        })
          .then((result) => {
            this.loadingRequest = false
            this.showRequestModal = false
            this.get_product_requests({
              page: this.page,
              perpage: this.pagination_items_per_page
            })
          })
          .catch((result) => {
            console.log(result)
          })
      })
    }
  },
  mounted () {
    this.get_product_from_api().then(() => {
      this.get_product_requests()
    })
    this.$load(async () => {
      const data = await this.$api.getProducts.get()
      console.log(data)
      this.form.filteredProduct = data.data.data.products
    })
  },
  components: { customModal, vTable, InputText, Textarea, AutoComplete, Calendar, ConfirmDialog, Toast },
  computed: {
    ...mapGetters([
      'product',
      'getrequests'
    ])
  }
}
</script>

<style lang="scss">
  .calendar-history{
    width: 100%;
    .dart-form-control{
      text-align: center;
    }
    .vc-title-wrapper button{
      background-color: #FFF;
    }
    .vc-header{
      margin-bottom: 16px;
    }
    .vc-weekdays{
      padding: 6px 0 4px 0;
      border-top: 0.5px solid #ADADAD;
      border-bottom: 0.5px solid #ADADAD;
    }
  }
  .request_alert{
    display: inline-block;
    margin-top: 5px;
    text-decoration: none;
    color: #343434;
  }
  .p-autocomplete-panel .p-autocomplete-items .p-autocomplete-item {
    display: flex;
    align-items: center;
    img {
      max-height: 40px;
      max-width: 40px;
      & + div {
        font-size: 14px;
        padding-left: 5px;
        max-width: 200px;
        white-space: normal;
      }
    }
  }
  .profile-content__title{
    margin-bottom: 16px;
    .sub_title{
      display: block;
      width: 100%;
    }
  }
  .p-autocomplete{
    width: 100%;
  }
  .vc-title,
  .vc-weekday {
    text-transform: capitalize;
  }
  .linked_product{
    position: relative;
    .image{
      position: absolute;
      left: 0;
      top: 50%;
      transform: translate(0, -50%);
      width: 100px;
      text-align: center;
      img{
        max-width: 100px;
        max-height: 100px;
      }
    }
    .text{
      padding-left: 115px;
      span{
        display: block;
        &.title{
          font-style: normal;
          font-weight: 500;
          font-size: 16px;
          line-height: 1.3;
          color: #282828;
          margin-bottom: 10px;
        }
        &.desc{
          font-style: normal;
          font-weight: 400;
          font-size: 14px;
          line-height: 1.3;
          letter-spacing: 0.25px;
          color: #282828;
          .lb{
            font-weight: 500;
          }
        }
      }
    }
  }
  .panel_widget {
    background: #FFFFFF;
    padding: 24px;
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 5px;
    margin-bottom: 20px;
    &_number {
      // min-height: 200px;
      position: relative;
      span{
        display: block;
        &.title{
          font-style: normal;
          font-weight: 500;
          font-size: 20px;
          line-height: 1.3;
          margin-bottom: 8px;
          color: #676767;
        }
        &.desc{
          font-style: normal;
          font-weight: 400;
          font-size: 14px;
          line-height: 1.3;
          letter-spacing: 0.25px;
          color: #A0A0A0;
        }
        &.value{
          font-style: normal;
          font-weight: 400;
          font-size: 34px;
          line-height: 1.3;
          letter-spacing: 0.0025em;
          color: #282828;
          margin-top: 20px
          // position: absolute;
          // bottom: 40px;
          // right: 40px;
        }
      }
    }
  }
</style>
