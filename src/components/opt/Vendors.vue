<template>
    <Toast />

    <!-- <div className="d-col-shop mb-2">
        <div className="d-col-shop__left">
            <span className="d-col-shop__span">Выбранные поставщики</span>
            <span className="h3 btnActiveChangeshopOn" @click.prevent="toggleVendorModal">{{ this.items.selected_count }} из {{ this.items.available_count }}<i className="pi pi-angle-down"></i></span>
        </div>
        <div className="vendors">
            <VendorsSwiper :items="this.items.selected"/>
        </div>
    </div> -->
    <teleport to="body">
      <div class="modalright__loyout" :class="{ active: vendorModal }" @click.prevent="toggleVendorModal"></div>
      <div class="modalright" :class="{ active: vendorModal }">
        <div class="modalright__content" :class="{ loading: loading }">
          <div class="dart-row">
            <div class="d-col-md-6">
              <yandex-map
                v-model="map"
                :settings="mapSettings"
                height="100%"
              >
                <yandex-map-default-features-layer/>
                <yandex-map-default-scheme-layer />
                <yandex-map-clusterer
                  grid-size="64"
                  zoom-on-cluster-click
                >
                  <yandex-map-marker
                    v-for="(item) in items.available"
                    :key="item.id"
                    position="top left-center"
                    :settings="{
                      coordinates: item.mapcoordinates
                    }"
                    @click="checkVendor(item.id)"
                  >
                    <div class="marker">
                      <img :src="item.image" :alt="item.name">
                    </div>
                  </yandex-map-marker>
                </yandex-map-clusterer>
              </yandex-map>
            </div>
            <div class="d-col-md-6">
              <div class="modalright__header">
                <span class="title">Выбор поставщиков</span>
                <a href="#" class="btn-close modalright__close" @click.prevent="toggleVendorModal">
                  <i class="d_icon d_icon-close"></i>
                </a>
              </div>
              <div class="vendors_selected">
                <span class="vendors_selected__label">Выбранные поставщики</span>
                <div class="vendors_selected__rows" v-if="items.selected_count">
                  <div class="vendors_selected__row" v-for="(item) in items.selected" :key="item.id">
                    <a href="#" class="btn btn-close" @click.prevent="changeOpts(item.id, 0)">
                      <i class="d_icon d_icon-close"></i>
                    </a>
                    <div class="vendors_selected__row-text">
                      <span class="name">{{ item.name_short }}</span>
                      <span class="desc">{{ item.address }}</span>
                      <span class="changevendor__description">{{ item.description }}</span>
                      <div class="changevendor__info">
                        <a :href="'tel:' + item.phone" target="_blank">{{ item.phone }}</a>
                        <a :href="'mailto:' + item.email" target="_blank">{{ item.email }}</a>
                        <a :href="item.website" target="_blank">{{ item.website }}</a>
                      </div>
                    </div>
                    <div class="image">
                      <img :src="item.image" :alt="item.name">
                    </div>
                  </div>
                </div>
                <div class="dart-alert dart-alert-info dart-mt-1" v-else>Поставщики еще не выбраны</div>
              </div>
              <div class="vendor_select" v-if="items.selected_count < items.available_count">
                <div class="vendor_select__title">
                  <span>Список подключенных поставщиков</span>
                  <!--
                  <a href="#" class="add_vendor">
                    <i class="d_icon d_icon-close"></i>
                  </a>
                  -->
                </div>
                <div class="dart-form-group search-input">
                  <i class="d-icon d-icon-search"></i>
                  <input type="text" class="dart-form-control" v-model="filter" placeholder="Адрес или наименование поставщика" @input="setFilter('filter')">
                </div>
                <div class="vendor_select__rows" v-if="avLength">
                  <div class="vendor_select__row" v-for="(item) in items.available" :key="item.id">
                    <div class="vendor_select__row-check">
                      <Checkbox @change="changeSelectCheckbox(item.id)" v-model="vendorForm.selected[item.id]" name="0" :binary="true"/>
                    </div>
                    <div class="vendor_select__row-text">
                      <span class="name">{{ item.name_short }}</span>
                      <span class="desc">{{ item.address }}</span>
                      <span class="changevendor__description">{{ item.description }}</span>
                      <div class="changevendor__info">
                        <a :href="'tel:' + item.phone" target="_blank">{{ item.phone }}</a>
                        <a :href="'mailto:' + item.email" target="_blank">{{ item.email }}</a>
                        <a :href="item.website" target="_blank">{{ item.website }}</a>
                      </div>
                    </div>
                    <div class="image">
                      <img :src="item.image" :alt="item.name">
                    </div>
                  </div>
                </div>
                <div class="vendor_select__rows" v-else>
                  <div class="dart-alert dart-alert-info">Ничего не найдено</div>
                </div>
                <div class="vendor_select__actions">
                  <button class="dart-btn dart-btn-primary dart-btn-block" @click.prevent="checkVendors" v-if="avLength">Выбрать</button>
                </div>
              </div>
              <div class="dart-mt-2" v-else>
                <div class="dart-alert dart-alert-info">Вы выбрали всех доступных поставщиков</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </teleport>
</template>
<script>
import { shallowRef } from 'vue'
import { mapActions, mapGetters } from 'vuex'
import router from '@/router'
import Toast from 'primevue/toast'
import { YandexMap, YandexMapDefaultSchemeLayer, YandexMapDefaultFeaturesLayer, YandexMapMarker, YandexMapClusterer } from 'vue-yandex-maps'
import Checkbox from 'primevue/checkbox'

export default {
  name: 'Vendors',
  emits: ['changeActive'],
  props: {
    pagination_items_per_page: {
      type: Number,
      default: 25
    },
    pagination_offset: {
      type: Number,
      default: 0
    },
    items: {
      type: Array
    },
    vendorModal: {
      type: Boolean
    }
  },
  data () {
    return {
      filter: '',
      map: shallowRef(null),
      mapSettings: {
        location: {
          center: [37.420365, 55.903302],
          zoom: 9
        }
      },
      loading: false,
      vendorForm: {
        selected: []
      },
      multisupplier: false
    }
  },
  methods: {
    ...mapActions([
      'set_vendors_to_api',
      'get_opt_vendors_from_api',
      'toggle_opts_visible'
    ]),
    toggleVendorModal () {
      this.$emit('changeActive')
      // emit
      // vendorModal = !this.vendorModal
    },
    checkVendor (id) {
      if (!this.multisupplier) {
        for (let i = 0; i < this.vendorForm.selected.length; i++) {
          // if (i !== id) {
          this.vendorForm.selected[i] = false
          // }
        }
        this.vendorForm.selected[id] = true
      }
    },
    changeSelectCheckbox (id) {
      if (!this.multisupplier) {
        for (let i = 0; i < this.vendorForm.selected.length; i++) {
          this.vendorForm.selected[i] = false
        }
        this.vendorForm.selected[id] = true
      }
    },
    changeOpts (id, action) {
      this.loading = true
      const data = {
        id: id,
        action: action,
        store: router.currentRoute._value.params.id
      }
      this.toggle_opts_visible(data).then(() => {
        this.get_opt_vendors_from_api().then((result) => {
          this.loading = false
          this.$emit('vendorCheck')
        })
      })
    },
    setFilter (type) {
      if (type === 'filter') {
        if (this.filter.length >= 3 || this.filter.length === 0) {
          setTimeout(() => {
            this.loading = true
            this.get_opt_vendors_from_api({
              filter: this.filter
            }).then((result) => {
              this.loading = false
            })
          }, 400)
        }
      }
    },
    checkVendors () {
      let error = true
      this.vendorForm.selected.forEach((element) => {
        if (element) {
          error = false
        }
      })
      if (!error) {
        if (!this.multisupplier) {
          console.log(this.items.selected)
          for (let i = 0; i < this.items.selected.length; i++) {
            const data = {
              id: this.items.selected[i].id,
              action: 0,
              store: router.currentRoute._value.params.id
            }
            this.toggle_opts_visible(data)
          }
        }
        this.loading = true
        this.$load(async () => {
          await this.set_vendors_to_api({
            action: 'set',
            type: 'opts',
            id: router.currentRoute._value.params.id,
            vendors: this.vendorForm.selected
          })
            .then((result) => {
              this.loading = false
              this.get_opt_vendors_from_api()
              this.vendorForm.selected = []
              this.$emit('vendorCheck')
            })
            .catch((result) => {
              console.log(result)
            })
        })
      } else {
        this.$toast.add({ severity: 'error', summary: 'Укажите поставщиков', detail: 'Для того, чтобы выбрать поставщиков, отметьте флажки рядом с ними', life: 3000 })
      }
    }
  },
  mounted () {
  },
  components: { Checkbox, YandexMap, YandexMapDefaultSchemeLayer, YandexMapDefaultFeaturesLayer, YandexMapMarker, YandexMapClusterer, Toast },
  computed: {
    ...mapGetters([
      'optvendors'
    ]),
    avLength () {
      return Object.keys(this.items.available).length
    }
  },
  watch: {
    vendorModal: function () {
      document.body.style.overflow = this.vendorModal ? 'hidden' : ''
    }
  }
}
</script>
<style lang="scss">

  .changevendor__description{
    color: #979797;
    font-size: 12px;
    line-height: 16px;
    margin: 0;
  }

  .vendor_select__row-text span.desc{
    margin-bottom: 6px;
  }

  .changevendor__info{
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    line-height: 16px;
    margin-top: 8px;

    a{
      color: #979797;
      text-decoration: none;
    }
  }
    .marker {
      cursor: pointer;
      position: relative;
      width: 33px;
      height: 33px;
      background: #fff;
      border-radius: 50%;
      border: 2px solid #fff;
      box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.11);
      text-align: center;
      color: #fff;
      font-weight: bold;
      margin-top: -10px;
      &::after{
        content: '';
        position: absolute;
        display: inline-block;
        background: #fff;
        left: 50%;
        margin-left: -2px;
        bottom: -10px;
        height: 12px;
        width: 4px;
        border-radius: 5px;
        box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.11);
      }
      img{
        border: 1px solid #e8e8e8;
        border-radius: 50%;
        display: inline-block;
        max-width: 30px;
        max-height: 30px;
      }
    }
    .vendor_select{
      padding: 16px 32px 64px;
      &__title{
        position: relative;
        margin-bottom: 16px;
        span{
          display: block;
          font-family: var(--font-family);
          font-weight: 500;
          font-size: 20px;
          line-height: 1.3;
          color: #282828;
          padding-right: 32px;
        }
        .add_vendor {
          position: absolute;
          top: 50%;
          right: 0;
          transform: translate(0, -50%);
          cursor: pointer;
          background: #595959;
          opacity: 0.3;
          color: #fff !important;
          width: 24px !important;
          height: 24px !important;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.3s;
          padding: 0;
          text-decoration: none;
          &:hover {
            background: #595959;
            opacity: 0.5;
            color: #fff !important;
          }
          .d_icon {
            font-size: 8px;
            transform: rotate(45deg);
          }
        }
      }
      &__actions{
        position: sticky;
        bottom: 0;
        left: 0;
        padding: 0;
        padding: 32px 0;
        background: #fff;
      }
      &__rows{
        margin-top: 15px;
      }
      &__row{
        position: relative;
        overflow: hidden;
        & + &{
          margin-top: 15px;
        }
        &-check{
          position: absolute;
          left: 0;
          top: 0;
        }
        &-text{
          padding-left: 35px;
          padding-right: 55px;
          transition: all .2s ease;
          span{
            display: block;
            & + span{
              margin-top: 5px;
            }
            &.name{
              font-family: var(--font-family);
              font-weight: 500;
              font-size: 16px;
              line-height: 1.3;
              color: #282828;
            }
            &.desc{
              font-family: var(--font-family);
              font-weight: 400;
              font-size: 14px;
              line-height: 1.3;
              color: #282828;
            }
          }
        }
        .image{
          position: absolute;
          right: 0;
          top: 50%;
          transform: translate(0, -50%);
          border-radius: 50%;
          border: 1px solid #e8e8e8;
          img{
            width: 40px !important;
            height: 40px !important;
            border-radius: 50%;
          }
        }
      }
    }
    .vendors_selected{
      background: #f8f7f5;
      border-radius: 5px;
      padding: 16px 32px;
      &__label{
        font-family: var(--font-family);
        font-weight: 400;
        font-size: 12px;
        line-height: 1.3;
        color: #acabab;
      }
      &__rows{
        margin-top: 15px;
      }
      &__row{
        position: relative;
        overflow: hidden;
        & + &{
          margin-top: 15px;
        }
        &:hover{
          & .btn-close{
            left: 0;
          }
          & .vendors_selected__row-text{
            padding-left: 32px;
            transition: all .2s ease;
          }
        }
        .btn-close{
          position: absolute;
          top: 50%;
          transform: translate(0, -50%);
          left: -60px;
        }
        &-text{
          padding-right: 55px;
          transition: all .2s ease;
          span{
            display: block;
            & + span{
              margin-top: 5px;
            }
            &.name{
              font-family: var(--font-family);
              font-weight: 500;
              font-size: 16px;
              line-height: 1.3;
              color: #282828;
            }
            &.desc{
              font-family: var(--font-family);
              font-weight: 400;
              font-size: 14px;
              line-height: 1.3;
              color: #282828;
            }
          }
        }
        .image{
          position: absolute;
          right: 0;
          top: 50%;
          transform: translate(0, -50%);
          border-radius: 50%;
          border: 1px solid #e8e8e8;
          img{
            width: 40px !important;
            height: 40px !important;
            border-radius: 50%;
          }
        }
      }
    }
    .d-col-shop{
        padding: 20px;
        background: var(--main-background-windows);
        // background: #a6fff0;
        border-radius: 5px;
        box-shadow: 0px 0px 18px 0px rgba(0, 0, 0, 0.06);

        &__left{
            display: flex;
            flex-direction: column;
            .h3{
                cursor: pointer;
                margin: 0;
            }

            span{
                display: flex;
                align-items: center;
            }

            i{
                margin-left: 4px;
            }
        }

        &__span{
            color: var(--text-color-dop);
            font-size: 12px;
        }

        &__info{
            display: flex;
            justify-content: space-between;
            align-items: flex-start;

            img{
                width: 54px;
                height: 54px !important;
                border-radius: 50%;
                border: 1px solid var(--border-color);
                object-fit: cover;
                margin-top: 20px;
            }
        }

        &__chart{
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        &__status{
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 18px;
            color: var(--text-color-dop);
        }
    }
</style>
