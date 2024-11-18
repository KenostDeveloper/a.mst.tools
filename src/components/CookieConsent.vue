<template>
    <div class="cookie_notification" :class="{ show: showNotification }">
      <button class="cookie_notification__close cookie_accept" @click="acceptCookies"></button>
      <p>
        Этот сайт использует файлы cookies и сервисы сбора технических данных посетителей 
        (данные об IP-адресе, местоположении и др.) для обеспечения работоспособности и улучшения 
        качества обслуживания. Продолжая использовать наш сайт, вы автоматически соглашаетесь 
        с использованием данных технологий.
      </p>
      <div class="cookie_notification__buttons_container">
        <button class="cookie_notification__button cookie_accept" @click="acceptCookies">
          Хорошо
        </button>
        <a href="https://mst.tools/politika-konfidenczialnosti.html" class="cookie_notification__button-secondary" target="_blank">
          Политика конфиденциальности
        </a>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'CookieNotification',
    data() {
      return {
        showNotification: false
      };
    },
    methods: {
      checkCookies() {
        const cookieDate = localStorage.getItem('cookieDate');
        const twoWeeksInMilliseconds = 1209600 * 1000;
  
        if (!cookieDate || +cookieDate + twoWeeksInMilliseconds < Date.now()) {
          this.showNotification = true;
        }
      },
      acceptCookies() {
        localStorage.setItem('cookieDate', Date.now());
        this.showNotification = false;
      }
    },
    mounted() {
      this.checkCookies();
    }
  };
  </script>
  
  <style scoped>
  .cookie_notification {
    justify-content: space-between;
    align-items: flex-end;
    position: fixed;
    z-index: 9999;
    left: 50%;
    width: 900px;
    max-width: 85vw;
    transform: translateX(-50%);
    padding: 20px 20px;
    background-color: #FFF;
    border-radius: 4px;
    border: 1px solid #fff;
    box-shadow: 2px 3px 10px rgba(0, 0, 0, 0.4);
    bottom: -200px;
    font-size: 12px;
    transition: all 0.2s ease;
  }
  
  .cookie_notification__close {
    width: 15px;
    height: 15px;
    background: #FFF;
    border-radius: 50%;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 5px;
    right: 5px;
    border: none;
    cursor: pointer;
    text-decoration: none;
    opacity: 0.8;
    transition: all 0.2s ease;
  }
  
  .cookie_notification__close:hover {
    opacity: 1;
  }
  
  .cookie_notification__close::before,
  .cookie_notification__close::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    display: block;
    background: #343434;
    width: 15px;
    height: 1px;
  }
  
  .cookie_notification__close::before {
    transform: translate(-50%, -50%) rotate(45deg);
  }
  
  .cookie_notification__close::after {
    transform: translate(-50%, -50%) rotate(-45deg);
  }
  
  .cookie_notification.show {
    bottom: 5px;
    transition: all 0.2s ease;
  }
  
  .cookie_notification__buttons_container {
    text-align: center;
    display: flex;
    gap: 10px;
    justify-content: center
  }
  
  .cookie_notification__button {
    display: inline-block;
    background-color: #ff0000;
    border: 1px solid #ff0000;
    color: #FFFFFF;
    text-decoration: none;
    padding: 15px 40px;
    white-space: nowrap;
    cursor: pointer;
    border-radius: 4px;
    max-width: 100%;
    transition: all 0.1s linear;
    display: flex;
    align-items: center;
  }
  
  .cookie_notification__button:hover {
    color: #fff;
    opacity: 0.9;
    transition: all 0.1s linear;
  }
  
  .cookie_notification__button-secondary {
    display: inline-block;
    background-color: #FFF;
    border: 1px solid #ff0000;
    color: #ff0000;
    text-decoration: none;
    padding: 15px 40px;
    white-space: nowrap;
    cursor: pointer;
    border-radius: 4px;
    max-width: 100%;
    transition: all 0.1s linear;
    display: flex;
    align-items: center;
  }
  
  .cookie_notification__button-secondary:hover {
    color: #FFF;
    background: #ff0000;
    transition: all 0.1s linear;
  }
  
  p {
    font-size: 12px;
  }
  </style>
  