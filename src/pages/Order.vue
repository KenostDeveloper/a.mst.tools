<template>
	<section class="clients order">
		<div class="order__header">
			<div class="std-title__container order__title-container">
				<h1 class="std-title">Заказ № 12345678910</h1>
				<p class="std-title__description">Подготовка заказа к отправке покупателю</p>
			</div>

			<div class="order-confirm">
				<p class="order-confirm__text">
					Провертье наличие и состояние товара в заказе, и упакуйте их для отправки, после чего
					нажимте на кнопку “Подтвердить заказ”
				</p>
				<button
					class="dart-btn dart-btn-primary order-confirm__button"
					@click="this.showShip = true"
				>
					Подтвердить заказ
				</button>
			</div>

			<div class="order-confirm hidden">
				<p class="order-confirm__text">
					Запросите у курьера секретный код. Нажмите на кнопку “Передать курьеру”.В открывшимся окне
					введите секретный код. После сообщения “код принят” - передайте товар курьеру.
				</p>
				<button
					class="dart-btn dart-btn-primary order-confirm__button"
					@click="this.showShip = true"
				>
					Передать курьеру
				</button>
			</div>
		</div>

		<div class="order-info">
			<h2 class="order__title order-info__title">Информация о заказе</h2>

			<div class="order-info__text-container">
				<div class="order-info__col">
					<article class="order-info__row">
						<span class="order-info__label">ФИО покупателя</span>
						<span class="order-info__value">Иван Маркетсович Иванов</span>
					</article>
					<article class="order-info__row">
						<span class="order-info__label">Адрес доставки</span>
						<span class="order-info__value"
							>г. Балашиха., Московская обл., ул. Кандебоберов д. 36., ЛИТ - 4, кв. 34.
						</span>
					</article>
				</div>
				<div class="order-info__col">
					<article class="order-info__row">
						<span class="order-info__label">Номер телефона</span>
						<span class="order-info__value">+7(951) 467-43-29</span>
					</article>
					<article class="order-info__row">
						<span class="order-info__label">Email</span>
						<span class="order-info__value">Kandebober@gmail.com</span>
					</article>
				</div>
				<div class="order-info__col">
					<article class="order-info__row">
						<span class="order-info__label">Транспортная компания</span>
						<span class="order-info__value">СДЕК</span>
					</article>
					<article class="order-info__row">
						<span class="order-info__label">Тип доставки</span>
						<span class="order-info__value">Курьер</span>
					</article>
				</div>
			</div>
		</div>

		<div class="order-structure">
			<h2 class="order__title order-structure__title">Состав заказа</h2>

			<table class="std-table">
				<thead class="std-table__head">
					<tr class="std-table__row">
						<th class="std-table__hcol">Фото</th>
						<th class="std-table__hcol">Наименование</th>
						<th class="std-table__hcol">Артикул</th>
						<th class="std-table__hcol">Кол-во</th>
						<th class="std-table__hcol">Цена</th>
						<th class="std-table__hcol">Сумма</th>
					</tr>
				</thead>
				<tbody class="std-table__body">
					<tr class="std-table__row">
						<td class="std-table__col">
							<img
								src="https://avatars.mds.yandex.net/i?id=f483148e4bcd0673ba3af7080d8b79b6_l-9181195-images-thumbs&n=13"
								alt=""
								class="order-structure__product-img"
							/>
						</td>
						<td class="std-table__col">Измельчитель зерна 300 кг/час (ИЗЭ-14)</td>
						<td class="std-table__col">123456787905</td>
						<td class="std-table__col">1 шт</td>
						<td class="std-table__col">4 060 ₽</td>
						<td class="std-table__col">4 060 ₽</td>
					</tr>
					<tr class="std-table__row">
						<td class="std-table__col">
							<img
								src="https://avatars.mds.yandex.net/i?id=f483148e4bcd0673ba3af7080d8b79b6_l-9181195-images-thumbs&n=13"
								alt=""
								class="order-structure__product-img"
							/>
						</td>
						<td class="std-table__col">Измельчитель зерна 300 кг/час (ИЗЭ-14)</td>
						<td class="std-table__col">123456787905</td>
						<td class="std-table__col">1 шт</td>
						<td class="std-table__col">4 060 ₽</td>
						<td class="std-table__col">4 060 ₽</td>
					</tr>
					<tr class="std-table__row">
						<td class="std-table__col">
							<img
								src="https://avatars.mds.yandex.net/i?id=f483148e4bcd0673ba3af7080d8b79b6_l-9181195-images-thumbs&n=13"
								alt=""
								class="order-structure__product-img"
							/>
						</td>
						<td class="std-table__col">Измельчитель зерна 300 кг/час (ИЗЭ-14)</td>
						<td class="std-table__col">123456787905</td>
						<td class="std-table__col">1 шт</td>
						<td class="std-table__col">4 060 ₽</td>
						<td class="std-table__col">4 060 ₽</td>
					</tr>
					<tr class="std-table__row">
						<td class="std-table__col">
							<img
								src="https://avatars.mds.yandex.net/i?id=f483148e4bcd0673ba3af7080d8b79b6_l-9181195-images-thumbs&n=13"
								alt=""
								class="order-structure__product-img"
							/>
						</td>
						<td class="std-table__col">Измельчитель зерна 300 кг/час (ИЗЭ-14)</td>
						<td class="std-table__col">123456787905</td>
						<td class="std-table__col">1 шт</td>
						<td class="std-table__col">4 060 ₽</td>
						<td class="std-table__col">4 060 ₽</td>
					</tr>
				</tbody>
			</table>
		</div>

		<div class="order-structure order-history">
			<h2 class="order__title order-history__title">История событий</h2>

			<table class="std-table">
				<thead class="std-table__head">
					<tr class="std-table__row">
						<th class="std-table__hcol"></th>
						<th class="std-table__hcol">Время</th>
						<th class="std-table__hcol">Событие</th>
						<th class="std-table__hcol"></th>
					</tr>
				</thead>
				<tbody class="std-table__body">
					<tr class="std-table__row">
						<td class="std-table__col">Система</td>
						<td class="std-table__col">07.11.2022 9:18</td>
						<td class="std-table__col">Обрабатывается</td>
						<td class="std-table__col"></td>
					</tr>
					<tr class="std-table__row">
						<td class="std-table__col">Система</td>
						<td class="std-table__col">07.11.2022 9:18</td>
						<td class="std-table__col">Изменение условий доставки заказа</td>
						<td class="std-table__col"></td>
					</tr>
					<tr class="std-table__row">
						<td class="std-table__col">Система</td>
						<td class="std-table__col">07.11.2022 9:18</td>
						<td class="std-table__col">Не оплачен</td>
						<td class="std-table__col"></td>
					</tr>
					<tr class="std-table__row">
						<td class="std-table__col">Система</td>
						<td class="std-table__col">07.11.2022 9:18</td>
						<td class="std-table__col">Изменение условий доставки заказа</td>
						<td class="std-table__col"></td>
					</tr>
				</tbody>
			</table>
		</div>

		<Dialog
			v-model:visible="this.showShip"
			header="Секретный ключ"
			class="order-dialog"
			:style="{ width: '450px' }"
		>
			<form class="order-secret">
				<input type="text" name="key" id="key" class="order-secret__input" />
				<button type="button" class="dart-btn dart-btn-primary order-secret__button" @click="() => {
                    this.showShip = false;
                    this.showShip2 = true;
                }">Отправить</button>
			</form>
		</Dialog>

		<Dialog
			v-model:visible="this.showShip2"
			header="Секретный ключ"
			class="order-dialog order-dialog--no-close"
			:style="{ width: '450px' }"
		>
			<div class="order-secret">
				<h3 class="order-secret__title">Код принят</h3>
				<img src="../assets/images/icons/check.svg" alt="" class="order-secret__img" />
				<button class="dart-btn dart-btn-primary order-secret__button" @click="() => {
                    this.showShip2 = false;
                    this.showShip3 = true;
                }">Ок</button>
			</div>
		</Dialog>

		<Dialog
			v-model:visible="this.showShip3"
			header="Секретный ключ"
			class="order-dialog order-dialog--no-close"
			:style="{ width: '450px' }"
		>
			<div class="order-secret">
				<h3 class="order-secret__title">Код не принят</h3>
				<img src="../assets/images/icons/not-check.svg" alt="" class="order-secret__img" />
				<button class="dart-btn dart-btn-primary order-secret__button" @click="this.showShip3 = false">Ок</button>
			</div>
		</Dialog>
	</section>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Dropdown from "primevue/dropdown";
import Dialog from "primevue/dialog";

export default {
	data() {
		return {

			showShip: false,
            showShip2: false,
            showShip3: false,
		};
	},
	methods: {
		...mapActions(["get_order_from_api"])
	},
	mounted() {
		this.get_order_from_api()
	},
	computed: {
		...mapGetters(["dilers", "org_stores"]),
	},
	components: { Dropdown, Dialog },
	watch: {
		dilers: function (newVal, oldVal) {
			if (typeof newVal === "object") {
				if (Object.prototype.hasOwnProperty.call(newVal, "items")) {
					this.stores.items = newVal.items;
				} else {
					this.stores.items = [];
				}
				if (Object.prototype.hasOwnProperty.call(newVal, "total")) {
					this.stores.total = newVal.total;
				} else {
					this.stores.total = 0;
				}
			} else {
				this.stores.items = [];
				this.stores.total = 0;
			}
		},
		org_stores: function (newVal, oldVal) {
			this.stores_list = [];
			for (let i = 0; i < newVal.items.length; i++) {
				this.stores_list.push({ label: newVal.items[i].name, value: newVal.items[i].id });
			}
		},
	},
};
</script>

<style lang="scss" scoped></style>
