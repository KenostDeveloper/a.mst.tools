<template>
    <Breadcrumbs class="std-breadcrumbs--margin" />
    <div class="mb-3">
        <div class="kenost-profile-name">Пользователь <b>«{{ this.getUser?.profile?.fullname }}»</b></div>
    </div>


    <div class="my-profile">
        <div class="my-profile__title">Настройки</div>
        <div class="my-profile__setting" @click="this.modal.login = true">
            <div class="my-profile__el">
                <div class="my-profile__icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-user-round"><path d="M18 20a6 6 0 0 0-12 0"/><circle cx="12" cy="10" r="4"/><circle cx="12" cy="12" r="10"/></svg>
                </div>
                <div class="my-profile__field">
                    <div class="my-profile__name">Логин</div>
                    <div class="my-profile__desc">{{ this.getUser?.username }}</div>
                </div>
            </div>
            <div class="my-profile__edit">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#65707D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-settings"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
            </div>
        </div>
        <div class="my-profile__setting" @click="this.modal.password = true">
            <div class="my-profile__el">
                <div class="my-profile__icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-key-round"><path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"/><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/></svg>
                </div>
                <div class="my-profile__field">
                    <div class="my-profile__name">Пароль</div>
                    <div class="my-profile__desc">Был изменён 10 месяцев назад</div>
                </div>
            </div>
            <div class="my-profile__edit">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#65707D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-settings"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
            </div>
        </div>
        <div class="my-profile__setting" @click="this.modal.email = true">
            <div class="my-profile__el">
                <div class="my-profile__icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                </div>
                <div class="my-profile__field">
                    <div class="my-profile__name">Почта</div>
                    <div class="my-profile__desc">{{ this.getUser?.profile?.email }}</div>
                </div>
            </div>
            <div class="my-profile__edit">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#65707D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-settings"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
            </div>
        </div>
        <div class="my-profile__setting" @click="this.modal.phone = true">
            <div class="my-profile__el">
                <div class="my-profile__icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-phone"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </div>
                <div class="my-profile__field">
                    <div class="my-profile__name">Телефон</div>
                    <div class="my-profile__desc">{{ this.getUser?.profile?.phone }}</div>
                </div>
            </div>
            <div class="my-profile__edit">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#65707D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-settings"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
            </div>
        </div>
    </div>

    <Dialog v-model:visible="this.modal.login" header=" " :style="{ width: '380px' }">
        <div class="kenost-not-produc">
            <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#ff0000" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-user-round"><path d="M18 20a6 6 0 0 0-12 0"/><circle cx="12" cy="10" r="4"/><circle cx="12" cy="12" r="10"/></svg>
            <b class="text-center">Редактирование логина</b>
            <p>Пожалуйста, введите новый логин. Редактирование нужно будет подтвердить по вашей почте.</p>
            <input v-model="this.login" type="text" name="name" placeholder="Укажите логин" class="dart-form-control mt-2" />
            <div class="a-dart-btn a-dart-btn-primary mt-3" @click="editProfile('login', this.login)">Сохранить</div>
        </div>
    </Dialog>

    <Dialog v-model:visible="this.modal.password" header=" " :style="{ width: '380px' }">
        <div class="kenost-not-produc">
            <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#ff0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-key-round">
                <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"/>
                <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/>
            </svg>
            <b class="text-center">Редактирование пароля</b>
            <p>Пожалуйста, введите новый пароль. Редактирование нужно будет подтвердить по вашей почте.</p>

            <div class="w-full relative mt-2">
                <input :type="showPassword ? 'text' : 'password'" v-model="this.password" placeholder="Введите новый пароль" class="dart-form-control" />
                <svg class="kenost-password-eye" @click="this.togglePasswordVisibility" v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                <svg class="kenost-password-eye" @click="this.togglePasswordVisibility" v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>
            </div>

            <div class="w-full relative mt-2">
                <input :type="showConfirmPassword ? 'text' : 'password'" v-model="this.confirm_password" placeholder="Повторите пароль" class="dart-form-control" />
                <svg class="kenost-password-eye" @click="this.toggleConfirmPasswordVisibility" v-if="!showConfirmPassword" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                <svg class="kenost-password-eye" @click="this.toggleConfirmPasswordVisibility" v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>
            </div>


            <div class="a-dart-btn a-dart-btn-primary mt-3" @click="editProfile('password', {password: this.password, confirm_password: this.confirm_password})">Сохранить</div>
        </div>
    </Dialog>

    <Dialog v-model:visible="this.modal.email" header=" " :style="{ width: '380px' }">
        <div class="kenost-not-produc">
            <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#ff0000" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-user-round"><path d="M18 20a6 6 0 0 0-12 0"/><circle cx="12" cy="10" r="4"/><circle cx="12" cy="12" r="10"/></svg>
            <b class="text-center">Редактирование почты</b>
            <p>Пожалуйста, введите новую почту. Редактирование нужно будет подтвердить по вашей старой почте.</p>
            <input v-model="this.email" type="text" name="name" placeholder="Укажите почту" class="dart-form-control mt-2" />
            <div class="a-dart-btn a-dart-btn-primary mt-3" @click="editProfile('email', this.email)">Сохранить</div>
        </div>
    </Dialog>

    <Dialog v-model:visible="this.modal.phone" header=" " :style="{ width: '380px' }">
        <div class="kenost-not-produc">
            <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#ff0000" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-user-round"><path d="M18 20a6 6 0 0 0-12 0"/><circle cx="12" cy="10" r="4"/><circle cx="12" cy="12" r="10"/></svg>
            <b class="text-center">Редактирование телефона</b>
            <p>Пожалуйста, введите новый телефон. Редактирование нужно будет подтвердить по вашей почте.</p>
            <input v-model="this.phone" type="text" name="name" placeholder="+7 (999) 999-99-99" @input="formatPhone" class="dart-form-control mt-2" />
            <div class="a-dart-btn a-dart-btn-primary mt-3" @click="editProfile('phone', this.phone)">Сохранить</div>
        </div>
    </Dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Breadcrumbs from '../components/Breadcrumbs.vue'
import Dialog from 'primevue/dialog';


export default {
	data() {
		return {
			login: "",
            password: "",
            confirm_password: "",
            email: "",
            phone: "",
            showPassword: false,
            showConfirmPassword: false,
            modal: {
                login: false,
                password: false,
                email: false,
                phone: false
            }
		};
	},
	methods: {
		...mapActions([
			
		]),
        togglePasswordVisibility() {
            this.showPassword = !this.showPassword;
        },
        toggleConfirmPasswordVisibility() {
            this.showConfirmPassword = !this.showConfirmPassword;
        },
        formatPhone(event) {
            let value = event.target.value.replace(/\D/g, ""); // Удаляем все нецифровые символы

            if (value.length > 11) {
                value = value.slice(0, 11); // Ограничиваем ввод до 11 цифр
            }

            // Форматируем номер по маске: +X (XXX) XXX-XX-XX
            let formatted = "+";
            if (value.length > 0) formatted += value[0];
            if (value.length > 1) formatted += " (" + value.substring(1, 4);
            if (value.length > 4) formatted += ") " + value.substring(4, 7);
            if (value.length > 7) formatted += "-" + value.substring(7, 9);
            if (value.length > 9) formatted += "-" + value.substring(9, 11);

            this.phone = formatted;
        },
		editProfile(name, value){
            switch(name){
                case 'login':
                    if (!this.validateLogin(value)) {
                        this.$toast.add({ severity: 'error', summary: 'Ошибка', detail: 'Некорректный логин', life: 3000 });
                        return;
                    } else{
                        this.modal.login = false
                    }
                    break;
                case 'password':
                    if (value.password !== value.confirm_password) {
                        this.$toast.add({ severity: 'error', summary: 'Ошибка', detail: 'Пароли не совпадают', life: 3000 });
                        return;
                    }
                    // Проверка на длину пароля
                    if (value.password < 6) {
                        this.$toast.add({ severity: 'error', summary: 'Ошибка', detail: 'Пароль должен содержать минимум 6 символов', life: 3000 });
                        return;
                    }
                    this.modal.password = false
                    break;
                case 'email':
                    if (!this.validateEmail(value)) {
                        this.$toast.add({ severity: 'error', summary: 'Ошибка', detail: 'Некорректная почта', life: 3000 });
                        return;
                    } else{
                        this.modal.login = false
                    }
                    break;
                case 'phone':
                    if (!this.validatePhone(phone)) {
                        this.$toast.add({ severity: 'error', summary: 'Ошибка', detail: 'Некорректный номер телефона', life: 3000 });
                        return;
                    } else{
                        this.modal.login = false
                    }
                    break;
            }
            
        },
        validateLogin(login) {
            const regex = /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/;
            return regex.test(login);
        },
        validateEmail(email) {
            const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return regex.test(email);
        },
        validatePhone(phone) {
            const regex = /^\+\d{1}\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/;
            return regex.test(phone);
        }
	},
	mounted() {
		
	},
	computed: {
		...mapGetters({
            getUser: "user/getUser",
        })
    },
	components: {
        Breadcrumbs,
        Dialog
    },
	watch: {
		getUser: function (newVal, oldVal) {
            this.login = newVal.username
        }
	}
};
</script>

<style lang="scss"></style>
