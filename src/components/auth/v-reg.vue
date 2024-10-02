<template>
	<div class="analytics_auth">
		<form class="form-signup" @submit.prevent="formSubmit">
			<Toast />
			<div class="logo text-center">
				<img src="../../assets/images/logo.svg" alt="" width="200" />
			</div>

			<div class="std-auth__input-container">
                <input
                    type="text"
                    name="username"
                    class="dart-form-control"
                    placeholder="Логин"
                    required
                    v-model="form.login"
                />
                <input
                    type="password"
                    name="password"
                    class="dart-form-control"
                    placeholder="Пароль"
                    required
                    v-model="form.password"
                />
                <input
                    type="password"
                    name="passwordConfirm"
                    class="dart-form-control"
                    placeholder="Подтвердите пароль"
                    required
                    v-model="form.passwordConfirm"
                />
            </div>


            <div class="std-auth__input-container-wrapper">
                <span class="std-auth__input-label">Данные контактного лица</span>

                <div class="std-auth__input-container">
                    <input
                        type="text"
                        name="login"
                        class="dart-form-control"
                        placeholder="ФИО контактного лица"
                        required
                        v-model="form.login"
                    />
                    <input
                        type="text"
                        name="telephone"
                        class="dart-form-control"
                        placeholder="Телефон"
                        required
                        v-model="form.telephone"
                    />
                    <input
                        type="email"
                        name="email"
                        class="dart-form-control"
                        placeholder="Email"
                        required
                        v-model="form.email"
                    />
                </div>
            </div>

            <div class="std-auth__input-container-wrapper">
                <span class="std-auth__input-label">Данные компании</span>

                <div class="std-auth__input-container">
                    <input
                        type="text"
                        name="org_name"
                        class="dart-form-control"
                        placeholder="Наименование организации"
                        required
                        v-model="form.org_name"
                    />
                    <input
                        type="text"
                        name="inn"
                        class="dart-form-control"
                        placeholder="ИНН"
                        required
                        v-model="form.inn"
                    />
                    <input
                        type="text"
                        name="delivery_address"
                        class="dart-form-control"
                        placeholder="Адрес доставки"
                        required
                        v-model="form.delivery_address"
                    />
                </div>
            </div>

            <div class="std-auth__input-container">
                <input
                    type="text"
                    name="username"
                    class="dart-form-control"
                    placeholder="Логин"
                    required=""
                    v-model="form.login"
                />
                <input
                    type="password"
                    name="password"
                    class="dart-form-control"
                    placeholder="Пароль"
                    required=""
                    v-model="form.password"
                />
            </div>
            
			<div class="std-auth__buttonc-container">
                <button
                    class="dart-btn dart-btn-primary dart-btn-block align-items-center flex justify-content-center"
                    :disabled="this.loading"
                    type="submit"
                >
                    <i v-if="this.loading" class="pi pi-spin pi-spinner" style="font-size: 14px"></i>
                    <span>Войти</span>
                </button>
            </div>

			<div class="form-signin__copy">
				<span>© MST, {{ getYear }}.</span>
			</div>
		</form>
	</div>
</template>
