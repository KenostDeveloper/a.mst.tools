<template>
    <div class="not-found">
        <router-link :to="{ name: 'main' }" class="not-found__link">
            <i class="std_icon std_icon-arrow"></i>
            МСТ Аналитика
        </router-link>
        <img src="/images/logo_alt.svg" alt="" class="not-found__logo" />
        <img src="/images/not-found/404.svg" alt="" class="not-found__image" />
        <h1 class="not-found__title">Not Found</h1>

        <img src="/images/not-found/plug.svg" alt="" class="not-found__plug" />
        <img src="/images/not-found/socket.svg" alt="" class="not-found__socket" />
    </div>
</template>

<script>
export default {
    name: 'notFound'
};
</script>

<style lang="scss" scoped>
.not-found {
    background: url('/images/not-found/not-found-bg.png') no-repeat center / cover, white;

    display: flex;
    flex-direction: column;

    position: relative;

    padding: 20px 40px;

    min-height: 100dvh;
    width: 100vw;

    &__link {
        display: flex;
        align-items: center;
        gap: 22px;

        color: #282828;
        font-size: 20px;
        text-decoration: none;

        margin-bottom: 35px;
    }

    &__logo {
        height: clamp(45px, 10dvh, 100px) !important;
        margin-bottom: 10px;
    }
    &__image {
        height: clamp(300px, 50dvh, 600px) !important;
        margin-bottom: 30px;
    }
    &__title {
        color: #282828;
        font-size: 48px;
        font-weight: 700;
        text-align: center;
        margin: 0;
    }

    &__plug,
    &__socket {
      position: absolute;
      width: 32vw;
    }

    &__plug {
      bottom: 0;
      left: 120px;
    }
    &__socket {
      right: 0;
      top: 250px;
    }
}
</style>
