<template>
    <div v-if="type === 'normal'" ref="notification" class="std-notification" @click="$emit('delete')">
        <div class="std-notification__header">
            <div class="std-notification__header-content">
                <i class="std_icon std_icon-notification std-notification__icon"></i>
                <span class="std-notification__span">{{ data?.date }}</span>
                <span class="std-notification__span">{{ data?.time }}</span>
            </div>
            <button class="button-none std-notification__close" @click.stop="hide">
                <i class="std_icon std_icon-close"></i>
            </button>
        </div>
        <div class="std-notification__main">
            <h6 class="std-notification__title">{{ data?.title }}</h6>
            <p class="std-notification__text">{{ data?.description }}</p>
            <span class="std-notification__span">
                Просмотреть детали заказа, нажав
                <router-link class="std-notification__link" to="/" @click.stop>здесь</router-link>
            </span>
        </div>
    </div>

    <div v-if="type === 'big'" class="std-notification std-notification--big">
        <div class="std-notification__content">
            <div class="std-notification__header">
                <div class="std-notification__header-content">
                    <i class="std_icon std_icon-notification std-notification__icon"></i>
                    <span class="std-notification__span">{{ data?.date }}</span>
                    <span class="std-notification__span">{{ data?.time }}</span>
                </div>
            </div>
            <div class="std-notification__main">
                <h6 class="std-notification__title">{{ data?.title }}</h6>
                <p class="std-notification__text">{{ data?.description }}</p>
                <span class="std-notification__span">
                    Просмотреть детали заказа, нажав
                    <router-link class="std-notification__link" to="/">сюда</router-link>
                </span>
            </div>
        </div>
        <button class="button-none std-notification__delete" @click="$emit('delete')">
            <!-- <i class="std_icon std_icon-delete"></i> -->
            <i class="std_icon std_icon-trash"></i>
        </button>
    </div>
</template>

<script>
export default {
    name: 'Notification',
    props: {
        type: {
            type: String,
            default: 'normal'
        },
        lifetime: {
            type: Number,
            default: 3000
        },
        data: {
            type: Object,
            default: {
                date: '12.12.2024',
                time: '12:00',
                title: 'Заголовок',
                description: 'Текст'
            }
        }
    },
    data() {
        return {};
    },
    methods: {
        hide() {
            this.$refs.notification.style.opacity = 0;
            this.$refs.notification.style.visibility = 'collapse';
        }
    },
    mounted() {
        if (this.type === 'normal') {
            this.$refs.notification.style.opacity = 1;
            this.$refs.notification.style.visibility = 'visible';

            setTimeout(() => {
                if(!this.$refs.notification) return;
                this.$refs.notification.style.opacity = 0;
                this.$refs.notification.style.visibility = 'collapse';
            }, this.lifetime);
        }
    }
};
</script>

<style lang="scss" scoped></style>
