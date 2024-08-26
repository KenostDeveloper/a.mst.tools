<template>
    <div class="changeshop" :class="{'show' : this.modalIsActive}">
        <div class="changeshop__menu modal-stores-map__form">
            <div class="changeshop__map" id="changeshop__map"></div>
            <div class="changeshop__list">
                <div class="changeshop__settings">
                <div class="dart-home__title">
                    <span class="h2">Выбор поставщиков</span>
                    <a href="#" class="btn-close link-no-style" @click="modalToggle"></a>

                    <div class="btn-back" @click="modalToggle">
                        <i class="pi pi-times"></i>
                    </div>
                </div>
                <div class="changeshop__shop">
                    <div class="d-col-shop mb-2">
                        <span class="d-col-shop__span">Выбранные поставщики</span>

                        <div class="changeshop__vendors">
                            <div class="d-col-shop__info">
                                <div class="d-col-shop__left">
                                    <span class="h3">МСТ</span>
                                    <p class="mt-1">г. Химки, ул. Ленинградская, д.29</p>
                                </div>
                                <img src="/assets/content/images/shops_logo/mstoldlogo.png" alt="ООО «МСТ», г. Химки, ул. Ленинградская, д.29">
                            </div>
                            <div class="d-col-shop__info">
                                <div class="d-col-shop__left">
                                    <span class="h3">МСТ</span>
                                    <p class="mt-1">г. Химки, ул. Ленинградская, д.29</p>
                                </div>
                                <img src="/assets/content/images/shops_logo/mstoldlogo.png" alt="ООО «МСТ», г. Химки, ул. Ленинградская, д.29">
                            </div>
                            <div class="d-col-shop__info">
                                <div class="d-col-shop__left">
                                    <span class="h3">МСТ</span>
                                    <p class="mt-1">г. Химки, ул. Ленинградская, д.29</p>
                                </div>
                                <img src="/assets/content/images/shops_logo/mstoldlogo.png" alt="ООО «МСТ», г. Химки, ул. Ленинградская, д.29">
                            </div>
                            <div class="d-col-shop__info">
                                <div class="d-col-shop__left">
                                    <span class="h3">МСТ</span>
                                    <p class="mt-1">г. Химки, ул. Ленинградская, д.29</p>
                                </div>
                                <img src="/assets/content/images/shops_logo/mstoldlogo.png" alt="ООО «МСТ», г. Химки, ул. Ленинградская, д.29">
                            </div>
                            <div class="d-col-shop__info">
                                <div class="d-col-shop__left">
                                    <span class="h3">МСТ</span>
                                    <p class="mt-1">г. Химки, ул. Ленинградская, д.29</p>
                                </div>
                                <img src="/assets/content/images/shops_logo/mstoldlogo.png" alt="ООО «МСТ», г. Химки, ул. Ленинградская, д.29">
                            </div>
                            <div class="d-col-shop__info">
                                <div class="d-col-shop__left">
                                    <span class="h3">МСТ</span>
                                    <p class="mt-1">г. Химки, ул. Ленинградская, д.29</p>
                                </div>
                                <img src="/assets/content/images/shops_logo/mstoldlogo.png" alt="ООО «МСТ», г. Химки, ул. Ленинградская, д.29">
                            </div>
                            <div class="d-col-shop__info">
                                <div class="d-col-shop__left">
                                    <span class="h3">МСТ</span>
                                    <p class="mt-1">г. Химки, ул. Ленинградская, д.29</p>
                                </div>
                                <img src="/assets/content/images/shops_logo/mstoldlogo.png" alt="ООО «МСТ», г. Химки, ул. Ленинградская, д.29">
                            </div>
                            <div class="d-col-shop__info">
                                <div class="d-col-shop__left">
                                    <span class="h3">МСТ</span>
                                    <p class="mt-1">г. Химки, ул. Ленинградская, д.29</p>
                                </div>
                                <img src="/assets/content/images/shops_logo/mstoldlogo.png" alt="ООО «МСТ», г. Химки, ул. Ленинградская, д.29">
                            </div>
                            <div class="d-col-shop__info">
                                <div class="d-col-shop__left">
                                    <span class="h3">МСТ</span>
                                    <p class="mt-1">г. Химки, ул. Ленинградская, д.29</p>
                                </div>
                                <img src="/assets/content/images/shops_logo/mstoldlogo.png" alt="ООО «МСТ», г. Химки, ул. Ленинградская, д.29">
                            </div>
                        </div>
                    </div>
                </div>
                <span class="h3">Список подключенных поставщиков</span>
                <div class="a-dart-input a-dart-input-search mt-3 mb-2">
                    <input type="text" class="store_complete" placeholder="Адрес или наименование поставщика" autocomplete="off">
                </div>
                <div class="changeshop__listvendors">
                    <div v-for="item in items.items" v-bind:key="item.id" class="flex align-items-start changevendor">
                        <Checkbox v-model="this.changeVendors" :inputId="'changevendor' + item.id" name="changeVendors" :value="item.id" />
                        <label :for="'changevendor' + item.id" class="changevendor__label">
                            <div class="changevendor__text">
                                <b>{{item.name_short}}</b>
                                <p>{{item.address_short}}</p>
                            </div>
                            <img :src="item.image" :alt="item.name">
                        </label>
                    </div>
                </div>
            </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import Checkbox from 'primevue/checkbox'

export default {
  name: 'ChangeVendorsModal',
  props: {
    items: {
      type: Array
    },
    active: {
      type: Boolean
    },
    setActive: {}
  },
  data () {
    return {
      loading: true,
      changeVendors: null,
      modalIsActive: false
    }
  },
  methods: {
    ...mapActions([
    ])
  },
  mounted () {
    this.modalIsActive = this.modalChangeVendor
  },
  components: { Checkbox },
  computed: {
    ...mapGetters([
    ])
  },
  watch: {
    modalChangeVendor: function (newVal, oldVal) {
      this.modalIsActive = newVal
    }
  }
}
</script>
<style lang="scss">

//changeshop
    .changeshop{
        background: rgba(0, 0, 0, 0);
        pointer-events: none;
        position: fixed;
        z-index: 3;
        width: 100%;
        height: 100dvh;
        transition: all 0.3s;
        top: 0;
        left: 0;

        .h2, .h3{
            margin: 0;
        }

        &__listvendors{
            display: flex;
            flex-direction: column;
            gap: 24px;
            margin-top: 30px;
            height: calc(100% - 400px);
            overflow-y: auto;
            padding-bottom: 50px;

            &::-webkit-scrollbar {
                width: 7px;
                background-color: #e0e0e0; /* blue */
            }

            &::-webkit-scrollbar-thumb {
                background-color: #b4b4b4; /* green */
                border-radius: 9em;
            }
        }

        .changevendor{
            &__label{
                display: flex;
                margin-left: 8px;
                align-items: center;
                justify-content: space-between;
                width: 100%;

                p{
                    margin: 0;
                    font-size: 14px;
                    line-height: 18px;
                }

                b{
                    font-size: 16px;
                    line-height: 16px;
                }
            }

            img{
                width: 40px;
                height: 40px !important;
                border-radius: 50%;
                border: 1px solid var(--border-color);
            }
        }

        &__rating{
            display: none;
            width: 600px;
            padding: 36px 24px 0 24px;
        }

        &__menu{
            height: 100vh;
            background: var(--main-background-windows);
            position: fixed;
            z-index: 2;
            transition: all 0.7s;
            right: 0%;
            width: 1000px;
            transform: translate(100%);
            padding: 24px 16px;
            display: flex;
        }

        &.show{
            pointer-events: all;
            background: rgba(0, 0, 0, 0.50);
            .changeshop__menu{
                transform: translate(0%);
                right: 0%;
            }
        }

        &.showRating{
            .changeshop{
                &__list{
                    display: none;
                }

                &__rating{
                    display: flex;
                }
            }
        }

        &__settings{
            margin-bottom: 40px;
            height: 100%;
            position: relative;
        }

        &__vendors{
            display: flex;
            gap: 16px;
            flex-direction: column;
            margin-top: 12px;
        }

        &__map{
            width: 500px;
            // background: url(../img/home/menumap.png);
            height: 100%;
            background-position: center;
            background-repeat: no-repeat;
            background-size: cover;
            position: relative;
        }

        &__list{
            padding: 10px 24px 0 24px;
            width: 500px;
            position: relative;

            display: flex;
            flex-direction: column;
            // gap: 40px;

            &::before{
                width: 100%;
                position: absolute;
                bottom: 0px;
                z-index: 2;
                display: block;
                height: 100px;
                pointer-events: none;
                content: "";
                background: linear-gradient(180deg,hsla(0,0%,100%,0) 0, #FFF 87.24%);
            }
        }

        &__shops{
            overflow-y: scroll;
            height: 100%;
            padding-bottom: 10px;
            &::-webkit-scrollbar {
                width: 7px;
                background-color: #e0e0e0; /* blue */
            }

            &::-webkit-scrollbar-thumb {
                background-color: #b4b4b4; /* green */
                border-radius: 9em;
            }
        }

        &__mobile{
            display: none;
        }

        &__it-close{
            padding-left: 16px;
        }
        .shop-map__light-text{
            margin-right: 8px;
        }

        &__el{

            display: flex;
            justify-content: space-between;
            transition: all 0.5s;
            cursor: pointer;
            padding: 24px;

            &.active{
                background: var(--btn-secondary-outline-background);
            }

            img{
                transition: all 0.3s;
                transform: scale(1);
            }

            &:hover{
                img{
                    transition: all 0.3s;
                    transform: scale(1.1);
                }

                .h4{
                    text-decoration: underline;
                }
            }
        }

        &__button{
            z-index: 2;
            width: 100%;
            padding-top: 10px;

            .dart-btn-primary{
                width: 100%;
            }
        }

        &__info{
            width: calc(100% - 40px);
        }
    }

    .changeshop{
        &__shop{
            margin: 20px 0;
            background: var(--btn-secondary-outline-background);
            border-radius: 8px;

            .d-col-shop{
                background: transparent;
                box-shadow: unset;
                padding: 12px 20px;
                max-height: 250px;
                overflow-y: auto;

                &::-webkit-scrollbar {
                    width: 7px;
                    background-color: #e0e0e0; /* blue */
                }

                &::-webkit-scrollbar-thumb {
                    background-color: #b4b4b4; /* green */
                    border-radius: 9em;
                }

                &__left{
                    p{
                        margin-bottom: 0;
                        font-size: 14px;
                    }
                    .h3{
                        font-size: 16px;
                    }
                }

                &__info{
                    img{
                        margin-top: 0;
                    }
                }
            }
        }
    }

    .btn-back{
        display: none;
    }

@media (max-width: 991px){
    .changeshop{
        &.showList{
            .changeshop{
                &__list{
                    display: flex;
                }

                &__map{
                    display: none;
                }
            }

            .changeshop__mobile{
                .map{
                    display: inline-flex;
                }

                .list{
                    display: none;
                }

                .close{
                    display: none;
                }
            }
        }

        &.showRating{
            .changeshop{
                &__list{
                    display: none;
                }

                &__rating{
                    display: flex;
                    width: 500px;
                }

                &__map{
                    display: none;
                }

                &__mobile{
                    display: none;
                }
            }
        }

        &__mobile{
            .map{
                display: none;
            }

            .list{
                display: inline-flex;
            }

            .close{
                display: flex;
                align-items: center;
                justify-content: center;
                width: 36px;
                height: 36px;
                font-size: 20px;
                border-radius: 8px;
                background-color: var(--main-background-windows);
                position: absolute;
                left: 16px;
                top: 24px;
                box-shadow: 0px 8px 10px rgba(0, 0, 0, 0.14), 0px 3px 14px rgba(0, 0, 0, 0.12), 0px 5px 5px rgba(0, 0, 0, 0.2);;
                pointer-events: all;
            }
        }

        &__settings{
            .dart-home__title{
                justify-content: center;
                align-items: center;

                .btn-close{
                    display: none;
                }

                .btn-back{
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: absolute;
                    left: 16px;
                    width: 36px;
                    height: 36px;
                    border-radius: 8px;
                    background: var(--main-background-windows);
                    box-shadow: 0px 0px 12px 0px rgba(51, 51, 51, 0.10);
                }
            }
        }

        &__shops{
            padding-bottom: 50px;
        }

        &__button{
            display: none;
        }

        &__menu {
            width: 500px;
            padding: 0;
        }

        &__list{
            display: none;
        }

        &__mobile{
            display: block;
            position: absolute;
            width: 100%;
            height: 100dvh;
            pointer-events: none;

            .dart-btn-primary{
                pointer-events: all;
                position: absolute;
                bottom: 16px;
                right: 16px;
                z-index: 2;
            }
        }
    }
}

</style>
