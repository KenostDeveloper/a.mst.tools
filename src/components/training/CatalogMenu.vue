<template>
    <div class="d-col-menu menuShow" :class="{'active' : this.isMenuActive}">
        <div class="dart-catalog-menu">
            <div class="dart-catalog-menu__title">
                <p>Поддержка МСТ</p>
            </div>
            <CatalogEl :active1="this.active1" :active2="this.active2" @menuIndex="changeMenuEl" v-for="item in items" v-bind:key="item.id" :items="item"/>
        </div>
    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import CatalogEl from './CatalogEl.vue'

export default {
  name: 'TraningCatalogMenu',
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
    active1: {
      type: Number
    },
    active2: {
      type: Number
    }
  },
  data () {
    return {
      loading: true,
      isMenuActive: false
    }
  },
  emits: ['getMenuIndex'],
  methods: {
    ...mapActions([
    ]),
    changeMenuEl (elem) {
      const index1 = elem.index1
      const index2 = elem.index2
      this.$emit('getMenuIndex', { index1, index2 })
    }
  },
  mounted () {
  },
  components: { CatalogEl },
  computed: {
    ...mapGetters([
    ])
  }
}
</script>
<style lang="scss">

    //.d-col-menu.active + .d-col-content{
    //    max-width: calc(100% - calc(64px + 350px));
    //    min-width: calc(100% - calc(64px + 350px));
    //    transition: all 0.4s
    //}

    .d-col-menu{
    //    max-width: 287px;
    //    min-width: 287px;
        height: 100%;
    //    position: sticky;
    //    top: 8px;
    //    transition: all 0.4s
    }

    .d-col-menu.active{
        max-width: 64px;
        min-width: 64px;

        .closemenu{
            p{
                max-width: 0;
            }

            i{
                transform: rotate(180deg);
                left: 6px;
            }
        }

        .dart-catalog-menu{
            padding: 10px;
            // overflow: hidden;
            &__el{
                height: 40px;
                width: 100%;
                span{
                    max-width: 0px;
                    overflow: hidden;
                }
                &.link-no-link::before{
                    display: none;
                }

                &::after{
                    display: none;
                }
            }

        }
    }

    .closemenu{
        height: 48px;
        width: 100%;
        border-radius: 8px;
        background: #FFFFFF;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        color: #4D4D4D;
        cursor: pointer;
        margin-top: 16px;

        p{
            margin: 0;
            max-width: 100px;
            transition: all 0.4s;
            overflow: hidden;
        }

        i{
            transition: all 0.4s;
            position: relative;
            left: 0px;
        }
    }

    .d-col-menu{
        &.menuShow{
            .dart-catalog-menu{
                display: block;
            }

            .dart-menu-category{
                display: flex;
            }

            .menu-catalog-button{
                .d_icon-right-arrow{
                    transform: rotate(90deg);
                }
            }
        }
    }

    //right menu
    .dart-catalog-menu{
        border-radius: 5px;
        padding: 18px;
        background: #F3F3F3;
        margin-bottom: 10px;
        height: 100%;
        width: 230px;
        font-size: 14px;

        &::-webkit-scrollbar {
            width: 4px;
            background-color: #f0f0f0; /* blue */
        }

        &::-webkit-scrollbar-thumb {
            background-color: #b4b4b4; /* green */
            border-radius: 9em;
        }

        &__title{
            display: flex;
            justify-content: center;
            p{
                font-weight: 500;
                font-size: 20px;
                color: #282828;
            }
        }

        ul{
            padding: 0;
            margin: 0;
        }

        &__category{
            list-style: none;
            transition: all 1s;
            padding: 7px 0;

            ul{
                li{
                    list-style: none;
                    cursor: pointer;
                }
                padding-left: 16px;
            }
        }

        &__el{
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 10px;
            transition: all 0.5s;
            transform: scale(1);
            text-decoration: none;
            width: calc(100% - 20px);

            &::after{
                width: 55px;
                content: "";
                height: 100%;
                position: absolute;
                z-index: 1;
                background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(243 243 243) 44%);
                right: -65px;
                transform: translate(-50%, 0);
            }

            &.link-no-link{
                &::before{
                    content: "\e901";
                    font-family: 'primeicons' !important;
                    position: absolute;
                    right: -25px;
                    font-size: 12px;
                    transition: all 0.3s;
                    z-index: 3;
                }
            }

            img{
                width: 40px;
                height: 40px;
                border-radius: 5px;
                background: #F8F7F5;
            }

            &:hover{
                color: #F00;
                img{
                    transform: scale(1.1);
                }

                &::before{
                    color: #282828;
                }
            }

            li{
                padding: 7px 0;
            }
        }

        &__list{
            overflow: hidden;
            max-height: 0;
            // opacity: 0;
            transition: max-height .5s;
            font-size: 14px;
            a{
                color: #282828;
                width: 100%;
                text-decoration: none;
            }
        }

        &__category.active{
            transition: max-height .5s;

            .dart-catalog-menu{
                &__el{
                    &.link-no-link{
                        &::before{
                            content: "\e901";
                            font-family: 'primeicons' !important;
                            position: absolute;
                            right: -25px;
                            font-size: 12px;
                            transform: rotate(90deg);
                            z-index: 3;
                        }
                    }
                }
            }
        }
    }
</style>
