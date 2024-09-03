<!-- eslint-disable indent -->
<template>
	<div class="std-profile">
		<Toast />
		<div class="profile-content__title sticky-element">
			<span class="maintitle hidden-mobile-l">Организация {{ this.orgprofile?.name }}</span>
			<span class="maintitle visible-mobile-l">Карточка компании</span>
			<div class="buttons_container">
				<div @click="saveProfile()" class="dart-btn dart-btn-primary btn-padding">
					Сохранить
				</div>
			</div>
		</div>
		<!-- <div class="profile-content b-wrap" :class="{ loading: loading }"> -->
		<TabView class="tab-custom">
			<TabPanel header="О компании">
				<!-- <div class="profile-content__title">
            <span class="title">О компании</span>
            <div class="info info-default">
              <i class="d_icon d_icon-clock"></i>
              <span>Подана заявка на изменение реквизитов</span>
            </div>
          </div> -->
				<form action="#" @submit.prevent="formChangeSimple">
					<!-- <div class="dart-alert dart-alert-info">Вы можете изменить только данные контактного лица и логотип организации.</div> -->
					<div class="dart-form-group mb-5">
						<span class="ktitle">Логотип</span>
						<DropZone
							v-if="!this.orgprofile.image"
							class="kenost-dropzone"
							:maxFiles="Number(1)"
							url="/rest/file_upload.php?upload_org_avatar=avatar"
							:uploadOnDrop="true"
							:multipleUpload="true"
							:acceptedFiles="['image/*']"
							:parallelUpload="1"
							@sending="parseFile"
							v-bind="args"
						>
							<template v-slot:message>
								<div class="kenost-dropzone__custom hidden-mobile-l">
									<i class="pi pi-cloud-upload"></i>
									<b>Перетащите файл в эту область</b>
									<p>Вы также можете загрузить файл, <span>нажав сюда</span></p>
								</div>

								<div class="kenost-dropzone__custom visible-mobile-l">
									<i class="pi pi-cloud-upload"></i>
									<b>Загрузите файл сюда</b>
									<span class="kenost-dropzone__link">Открыть</span>
								</div>
							</template>
						</DropZone>
						<div class="avatar-org" v-if="this.orgprofile.image">
							<FileUpload
								name="avatar[]"
								url="/rest/file_upload.php?upload_org_avatar=avatar"
								@upload="onUpload"
								:auto="true"
								:multiple="false"
								accept="image/*"
								:maxFileSize="1000000"
							>
								<template
									#header="{
										chooseCallback,
										uploadCallback,
										clearCallback,
										files,
									}"
								>
									<img
										@click="chooseCallback()"
										class="org-upload-img"
										:src="
											orgprofile.upload_image
												? this.orgprofile.image.original_href
												: this.orgprofile.image
										"
										alt=""
									/>
									<img class="org-upload-i" src="../assets/images/icons/upload.svg" />
								</template>
							</FileUpload>
						</div>
					</div>
					<div class="dart-form-group mb-4">
						<span class="ktitle mb-3">Данные контактного лица</span>
						<div class="kenost-form-grid">
							<div
								class="form_input_group w-50"
								v-for="(field, index) in form.fields.contacts"
								:key="index"
							>
								<label for="">{{ field.label }}</label>
								<input	
									type="text"
									v-model="this.orgprofile[field.name]"
									class="dart-form-control"
									:name="field.name"
									:placeholder="field.placeholder"
								/>
							</div>
						</div>
					</div>
					<div class="dart-form-group mb-5 requisites">
						<div class="upload-banner mb-3 hidden-mobile-l">
							<div class="upload-banner__text">
								<span class="ktitle">Реквизиты</span>
								<span
									>Вы можете подать запрос на изменение или добавление реквизитов.
									Самостоятельно изменить их нельзя.</span
								>
							</div>
							<!-- <div class="flex align-items-center gap-2"><i class="pi pi-spin pi-cog" style="font-size: 18px"></i> <span>Ваша заявка на рассмотрении</span></div> -->
							<!-- <div class="dart-btn dart-btn-secondary btn-padding">Загрузить</div> -->
							<div
								class="dart-btn dart-btn-secondary btn-padding hidden-mobile-l"
								@click="this.modals.requisit = true"
							>
								Подать запрос
							</div>
						</div>

						<div class="upload-banner mb-3 visible-mobile-l">
							<div class="upload-banner__text">
								<span class="ktitle">Реквизиты</span>
								<div
									class="dart-btn dart-btn-secondary btn-padding visible-mobile-l"
									@click="this.modals.requisit = true"
								>
									<img src="../assets/images/icons/edit.svg" alt="" />
								</div>
							</div>
							<!-- <div class="flex align-items-center gap-2"><i class="pi pi-spin pi-cog" style="font-size: 18px"></i> <span>Ваша заявка на рассмотрении</span></div> -->
							<!-- <div class="dart-btn dart-btn-secondary btn-padding">Загрузить</div> -->
							<span
								>Вы можете подать запрос на изменение или добавление реквизитов.
								Самостоятельно изменить их нельзя.</span
							>
						</div>

						<div
							class="kenost-form-for"
							v-for="(requisit, index) in this.orgprofile.requisites"
							:key="requisit.id"
						>
							<div class="std-display-contents hidden-mobile-l">
								<div class="name-requisit">
									<p class="text-m">Реквизиты {{ requisit.name }}</p>
									<div
										v-if="requisit.send_request == '0'"
										class="name-requisit-edit"
										@click="
											(this.modals.requisitedit = true),
												(this.modals.requisitedit_index = index)
										"
									>
										<i class="pi pi-pencil"></i>
									</div>
									<div
										v-if="requisit.send_request == '1'"
										class="flex align-items-center gap-2"
									>
										<i class="pi pi-spin pi-cog" style="font-size: 18px"></i>
										<span>Ваша заявка на рассмотрении</span>
									</div>
								</div>
								<div class="kenost-form-grid">
									<div
										class="form_input_group w-50"
										v-for="(field, index_field) in this.form.requisit"
										:key="index + '_' + index_field"
									>
										<label for="">{{ field.label }}</label>
										<input
											:readonly="field.readonly"
											type="text"
											v-model="requisit[field.name]"
											class="dart-form-control"
											:name="field.name"
											:placeholder="field.placeholder"
										/>
									</div>
									<div class="flex justify-between align-items-center w-full">
										<div class="flex align-items-center">
											<!-- <img src="../assets/img/icons/cheked.svg" alt="" v-if="requisit.marketplace == '1'"> -->
											<label
												:for="'create-page-action' + index"
												class="ml-2 mb-0"
												v-if="requisit.marketplace == '1'"
											>
												Реквизиты для маркетплейса
											</label>
										</div>
										<div>
											<p
												class="m-0 text-sm cursor-pointer"
												@click="
													requisit.hide == null
														? (requisit.hide = true)
														: (requisit.hide = !requisit.hide)
												"
											>
												{{
													requisit.hide
														? "— Скрыть банковские реквизиты"
														: "— Показать банковские реквизиты"
												}}
											</p>
										</div>
									</div>
									<!-- dart-form-group mt-4 mb-0 -->
									<div class="dart-form-group mt-4 mb-0" v-if="requisit.hide">
										<div v-for="(bank, index) in requisit.banks" :key="index">
											<p class="text-s">Банковские реквизиты ({{ index + 1 }})</p>
											<div class="kenost-form-grid mb-3">
												<div
													class="form_input_group w-50"
													v-for="(field, index_field) in this.form.bank"
													:key="index + '_' + index_field"
												>
													<label for="">{{ field.label }}</label>
													<input
														:readonly="field.readonly"
														type="text"
														v-model="bank[field.name]"
														class="dart-form-control"
														:name="field.name"
														:placeholder="field.placeholder"
													/>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>


							<Accordion class="std-profile__accordion visible-mobile-l" :title="`Реквизиты ${index + 1}`">
								<div class="kenost-form-grid">
									<div
										class="form_input_group w-50"
										v-for="(field, index_field) in this.form.requisit"
										:key="index + '_' + index_field"
									>
										<label for="">{{ field.label }}</label>
										<input
											:readonly="field.readonly"
											type="text"
											v-model="requisit[field.name]"
											class="dart-form-control"
											:name="field.name"
											:placeholder="field.placeholder"
										/>
									</div>
									<div class="std-profile__options flex w-full">
										<div v-if="requisit.marketplace == '1'" class="flex align-items-center">
											<img src="../assets/img/icons/cheked.svg" alt="">
											<label
												:for="'create-page-action' + index"
												class="ml-2 mb-0"
											>
												Реквизиты для маркетплейса
											</label>
										</div>
										<div>
											<p
												class="m-0 text-sm cursor-pointer"
												@click="
													requisit.hide == null
														? (requisit.hide = true)
														: (requisit.hide = !requisit.hide)
												"
											>
												{{
													requisit.hide
														? "— Скрыть банковские реквизиты"
														: "— Показать банковские реквизиты"
												}}
											</p>
										</div>
									</div>
									<!-- dart-form-group mt-4 mb-0 -->
									<div class="std-profile__bank-requisites dart-form-group mt-4 mb-0" v-if="requisit.hide">
										<div v-for="(bank, index) in requisit.banks" :key="index">
											<p class="text-s">Банковские реквизиты ({{ index + 1 }})</p>
											<div class="kenost-form-grid mb-3">
												<div
													class="form_input_group w-50"
													v-for="(field, index_field) in this.form.bank"
													:key="index + '_' + index_field"
												>
													<label for="">{{ field.label }}</label>
													<input
														:readonly="field.readonly"
														type="text"
														v-model="bank[field.name]"
														class="dart-form-control"
														:name="field.name"
														:placeholder="field.placeholder"
													/>
												</div>
											</div>
										</div>
									</div>
								</div>
							</Accordion>
						</div>
					</div>
				</form>
			</TabPanel>
			<!-- <TabPanel header="Настройки" v-if="organization.settings">
        </TabPanel> -->
		</TabView>
		<!-- </div> -->
		<!-- <Dialog v-model:visible="this.modals.bank" header="Запрос на создание банковских реквизитов" :style="{ width: '740px' }">
        <div>
          <div class="kenost-form-grid">
            <div class="form_input_group w-50" v-for="(field, index) in form.bank" :key="index">
              <label for="">{{ field.label }}</label>
              <input type="text" v-model="organization[field.name]" class="dart-form-control" :name="field.name" :placeholder="field.placeholder"/>
            </div>
          </div>
        </div>
        <div class="flex-right mt-2">
          <div class="dart-btn dart-btn-primary btn-padding">Отправить</div>
        </div>
    </Dialog> -->
		<!-- <Dialog v-model:visible="this.modals.bankedit" header="Запрос на изменение банковских реквизитов" :style="{ width: '740px' }">
      <div>
        <div class="kenost-form-grid">
          <div class="form_input_group w-50" v-for="(field, index) in form.bank" :key="index">
            <label for="">{{ field.label }}</label>
            <input type="text" v-model="organization[field.name]" class="dart-form-control" :name="field.name" :placeholder="field.placeholder"/>
          </div>
        </div>
      </div>
      <div class="flex-right mt-2">
        <div class="dart-btn dart-btn-primary btn-padding">Отправить</div>
      </div>
    </Dialog> -->
		<Dialog
			v-model:visible="this.modals.requisit"
			header="Запрос на добавление банковских реквизитов"
			:style="{ width: '740px' }"
		>
			<div>
				<div class="kenost-form-grid">
					<div
						class="form_input_group w-50"
						v-for="(field, index) in form.requisit"
						:key="index"
					>
						<label for="">{{ field.label }}</label>
						<input
							type="text"
							v-model="this.new_requisit[field.name]"
							class="dart-form-control"
							:name="field.name"
							:placeholder="field.placeholder"
						/>
					</div>
				</div>
				<div class="flex align-items-center mb-3 gap-1">
					<Checkbox
						v-model="this.new_requisit.marketplace"
						inputId="new-requisit-market"
						name="new-requisit-market"
						value="1"
					/>
					<label for="new-requisit-market" class="ml-2 mb-0">
						Реквизиты для маркетплейса
					</label>
				</div>
				<div v-for="(bank, index_req) in this.new_requisit.banks" :key="index_req">
					<div class="flex align-items-center">
						<p class="text-s mb-0">Банковские реквизиты ({{ index_req + 1 }})</p>
						<div class="name-requisit-delete" @click="deleteBankRequisit(index_req)">
							<i class="pi pi-trash"></i>
						</div>
					</div>
					<div class="kenost-form-grid mb-3">
						<div
							class="form_input_group w-50"
							v-for="(field, index_field) in this.form.bank"
							:key="index_req + '_' + index_field"
						>
							<label for="">{{ field.label }}</label>
							<input
								type="text"
								v-model="bank[field.name]"
								class="dart-form-control"
								:name="field.name"
								:placeholder="field.placeholder"
							/>
						</div>
					</div>
				</div>
				<div class="flex-left mt-2">
					<div
						class="dart-btn dart-btn-secondary flex align-items-center kenost-add-button"
						@click="addBankRequisit()"
					>
						<i class="pi pi-plus"></i> Добавить банковские реквизиты
					</div>
				</div>
			</div>
			<div class="flex-right mt-2">
				<div class="dart-btn dart-btn-primary btn-padding" @click="addRequisit()">
					Отправить
				</div>
			</div>
		</Dialog>
		<Dialog
			v-model:visible="this.modals.requisitedit"
			header="Запрос на редактирование банковских реквизитов"
			:style="{ width: '740px' }"
		>
			<div>
				<div class="kenost-form-grid">
					<div
						class="form_input_group w-50"
						v-for="(field, index) in form.requisit"
						:key="index"
					>
						<label for="">{{ field.label }}</label>
						<input
							type="text"
							v-model="
								this.orgprofile.requisites[this.modals.requisitedit_index][
									field.name
								]
							"
							class="dart-form-control"
							:name="field.name"
							:placeholder="field.placeholder"
						/>
					</div>
				</div>
				<div class="flex align-items-center mb-3 gap-1">
					<Checkbox
						v-model="
							this.orgprofile.requisites[this.modals.requisitedit_index].marketplace
						"
						inputId="requisit-market"
						name="requisit-market"
						value="1"
					/>
					<label for="requisit-market" class="ml-2 mb-0">
						Реквизиты для маркетплейса
					</label>
				</div>
				<div
					v-for="(bank, index_req) in this.orgprofile.requisites[
						this.modals.requisitedit_index
					].banks"
					:key="index_req"
				>
					<div class="flex align-items-center">
						<p class="text-s mb-0">Банковские реквизиты ({{ index_req + 1 }})</p>
						<div
							class="name-requisit-delete"
							@click="deleteBankRequisitEdit(index_req)"
						>
							<i class="pi pi-trash"></i>
						</div>
					</div>
					<div class="kenost-form-grid mb-3">
						<div
							class="form_input_group w-50"
							v-for="(field, index_field) in this.form.bank"
							:key="index_req + '_' + index_field"
						>
							<label for="">{{ field.label }}</label>
							<input
								type="text"
								v-model="bank[field.name]"
								class="dart-form-control"
								:name="field.name"
								:placeholder="field.placeholder"
							/>
						</div>
					</div>
				</div>
				<div class="flex-left mt-2">
					<div
						class="dart-btn dart-btn-secondary flex align-items-center kenost-add-button"
						@click="addBankRequisitEdit()"
					>
						<i class="pi pi-plus"></i> Добавить банковские реквизиты
					</div>
				</div>
			</div>
			<div class="flex-right mt-2">
				<div class="dart-btn dart-btn-primary btn-padding" @click="editRequisit()">
					Отправить
				</div>
			</div>
		</Dialog>
		<!-- <Dialog v-model:visible="this.modals.requisitedit" header="Запрос на изменение банковских реквизитов" :style="{ width: '740px' }">
      <div>
        <div class="kenost-form-grid">
          <div class="form_input_group w-50" v-for="(field, index) in form.requisit" :key="index">
            <label for="">{{ field.label }}</label>
            <input type="text" v-model="organization[field.name]" class="dart-form-control" :name="field.name" :placeholder="field.placeholder"/>
          </div>
        </div>
      </div>
      <div class="flex-right mt-2">
        <div class="dart-btn dart-btn-primary btn-padding">Отправить</div>
      </div>
    </Dialog> -->
	</div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import router from "../router";
import FileUpload from "primevue/fileupload";
// import FloatLabel from 'primevue/floatlabel'
// import Dropdown from 'primevue/dropdown'
// import customModal from '@/components/popup/CustomModal.vue'
import Toast from "primevue/toast";
// import FileUpload from 'primevue/fileupload'
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
// import InputText from 'primevue/inputtext'
// import InputNumber from 'primevue/inputnumber'
import Checkbox from "primevue/checkbox";
import DropZone from "dropzone-vue";
import Dialog from "primevue/dialog";
import Accordion from "../components/Accordion.vue";
// import Accordion from 'primevue/accordion'
// import AccordionTab from 'primevue/accordiontab'

export default {
	name: "OrgProfile",
	props: {},
	data() {
		return {
			loading: false,
			showFormModal: false,
			typePrice: [],
			orgprofile: [],
			booleanValue: [
				{
					name: "Да",
					value: 1,
				},
				{
					name: "Нет",
					value: 0,
				},
			],
			settingsForm: {},
			modals: {
				requisit: false,
				requisitedit: false,
				requisitedit_index: 0,
				bank: false,
				bankedit: false,
			},
			form: {
				bank: [
					{
						name: "bank_bik",
						label: "БИК",
						placeholder: "12345678",
						type: "text",
						readonly: 1,
					},
					{
						name: "bank_name",
						label: "Банк",
						placeholder: 'ПАО "Сбербанк"',
						type: "text",
						readonly: 1,
					},
					{
						name: "bank_number",
						label: "Расчетный счет",
						placeholder: "7785612544545",
						type: "text",
						readonly: 1,
					},
					{
						name: "bank_knumber",
						label: "Корреспондентский счет",
						placeholder: "7785612544545",
						type: "text",
						readonly: 1,
					},
				],
				requisit: [
					{
						name: "name",
						label: "Наименования юридического лица",
						placeholder: 'ООО "Магазин"',
						type: "text",
						readonly: 1,
					},
					{
						name: "inn",
						label: "ИНН",
						placeholder: "77856974123",
						type: "text",
						readonly: 1,
					},
					{
						name: "ogrn",
						label: "ОГРН",
						placeholder: "77856974123",
						type: "text",
						readonly: 1,
					},
					{
						name: "kpp",
						label: "КПП",
						placeholder: "77856974123",
						type: "text",
						readonly: 1,
					},
					{
						name: "ur_address",
						label: "Адрес",
						placeholder: "г. Москва, Большая Никитская улица, 10",
						type: "text",
						readonly: 1,
					},
					{
						name: "fact_address",
						label: "Фактический адрес",
						placeholder: "г. Москва, Большая Никитская улица, 10",
						type: "text",
						readonly: 1,
					},
				],
				fields: {
					contacts: [
						{
							name: "contact",
							label: "ФИО (контактного лица)",
							placeholder: "Иванов Иван Иванович",
							type: "text",
							readonly: 0,
						},
						{
							name: "phone",
							label: "Телефон (контактного лица)",
							placeholder: "+79991234567",
							type: "text",
							readonly: 0,
						},
						{
							name: "email",
							label: "E-mail (контактного лица)",
							placeholder: "mail@site.ru",
							type: "text",
							readonly: 0,
						},
					],
				},
			},
			new_requisit: {
				name: "",
				inn: "",
				ogrn: "",
				kpp: "",
				ur_address: "",
				fact_address: "",
				marketplace: [],
				banks: [],
			},
		};
	},
	methods: {
		...mapActions([
			"get_organization_from_api",
			"set_organization_data",
			"org_profile_from_api",
			"org_profile_set_from_api",
		]),
		// onUpload (data) {
		//   if (data.xhr.response) {
		//     const response = JSON.parse(data.xhr.response)
		//     if (Object.prototype.hasOwnProperty.call(response.data, 'files')) {
		//       // перечень загруженныйх файлов
		//       this.organization.files = response.data.files
		//     }
		//   }
		//   this.$toast.add({ severity: 'info', summary: 'Файлы загружены', detail: 'Файл был успешно загружен', life: 3000 })
		// },
		onUpload(data) {
			if (data.xhr.response) {
				const response = JSON.parse(data.xhr.response);
				if (Object.prototype.hasOwnProperty.call(response.data, "files")) {
					// перечень загруженныйх файлов

					if (response.data.files[0].type === "avatar") {
						this.orgprofile.image = response.data.files[0];
						this.orgprofile.upload_image = true;
					}
				}
			}
			this.$toast.add({
				severity: "info",
				summary: "Логотип успешно загружен!",
				detail: "Не забудте сохранить изменения",
				life: 3000,
			});
		},
		parseFile(files, xhr, formData) {
			const callback = (e) => {
				const res = JSON.parse(e);
				if (res.success) {
					if (res.data.files[0].type === "avatar") {
						this.orgprofile.image = res.data.files[0];
						this.orgprofile.upload_image = true;
					}
				}
			};

			xhr.onreadystatechange = () => {
				if (xhr.readyState === 4) {
					callback(xhr.response);
				}
			};
		},
		addBankRequisit() {
			this.new_requisit.banks.push({
				bank_bik: "",
				bank_name: "",
				bank_number: "",
				bank_knumber: "",
			});
		},
		addBankRequisitEdit() {
			this.orgprofile.requisites[this.modals.requisitedit_index].banks.push({
				bank_bik: "",
				bank_name: "",
				bank_number: "",
				bank_knumber: "",
			});
		},
		deleteBankRequisit(index) {
			const array = Array.from(this.new_requisit.banks);
			delete array[index];
			const newArray = [];
			for (let i = 0; i < array.length; i++) {
				if (array[i]) {
					newArray.push(array[i]);
				}
			}
			this.new_requisit.banks = newArray;
		},
		deleteBankRequisitEdit(index) {
			const array = Array.from(
				this.orgprofile.requisites[this.modals.requisitedit_index].banks
			);
			delete array[index];
			const newArray = [];
			for (let i = 0; i < array.length; i++) {
				if (array[i]) {
					newArray.push(array[i]);
				}
			}
			this.orgprofile.requisites[this.modals.requisitedit_index].banks = newArray;
		},
		editRequisit() {
			const data = this.orgprofile.requisites[this.modals.requisitedit_index];
			data.org_name = this.orgprofile.name;
			if (data.marketplace.length > 0 && data.marketplace !== false) {
				data.marketplace = true;
			} else {
				data.marketplace = false;
			}
			this.org_profile_set_from_api({
				action: "set/request/profile",
				id: router.currentRoute._value.params.id,
				data: data,
			}).then((res) => {
				if (res.data.data.status) {
					this.modals.requisitedit = false;
					this.org_profile_from_api({
						action: "get/org/profile",
						id: router.currentRoute._value.params.id,
					});
				}
				this.$toast.add({
					severity: "info",
					summary: "Успех!",
					detail: res.data.data.message,
					life: 3000,
				});
			});
		},
		addRequisit() {
			const data = this.new_requisit;
			data.org_name = this.orgprofile.name;
			if (data.marketplace.length > 0) {
				data.marketplace = true;
			} else {
				data.marketplace = false;
			}
			this.org_profile_set_from_api({
				action: "set/request/profile",
				id: router.currentRoute._value.params.id,
				data: data,
			}).then((res) => {
				if (res.data.data.status) {
					this.modals.requisit = false;
					this.new_requisit = {
						name: "",
						inn: "",
						ogrn: "",
						kpp: "",
						ur_address: "",
						fact_address: "",
						marketplace: [],
						banks: [],
					};
				}
				this.$toast.add({
					severity: "info",
					summary: "Успех!",
					detail: res.data.data.message,
					life: 3000,
				});
			});
		},
		saveProfile() {
			this.org_profile_set_from_api({
				action: "set/org/profile",
				id: router.currentRoute._value.params.id,
				data: {
					contact: this.orgprofile.contact,
					email: this.orgprofile.email,
					phone: this.orgprofile.phone,
					image: this.orgprofile.image,
					upload_image: this.orgprofile.upload_image,
				},
			}).then((res) => {
				this.$toast.add({
					severity: "info",
					summary: "Сохранено!",
					detail: res.data.data.message,
					life: 3000,
				});
			});
		},
		// formChangeSimple () {
		//   this.loading = true
		//   this.$load(async () => {
		//     await this.set_organization_data({
		//       action: 'set',
		//       type: 'organization',
		//       id: router.currentRoute._value.params.id,
		//       contact: this.organization.contact,
		//       phone: this.organization.phone,
		//       email: this.organization.email,
		//       description: this.organization.description,
		//       files: this.organization.files
		//     })
		//       .then((result) => {
		//         this.loading = false
		//         this.$toast.add({ severity: 'info', summary: 'Данные изменены', detail: 'Данные были успешно изменены', life: 3000 })
		//         this.get_organization_from_api()
		//       })
		//       .catch((result) => {
		//         console.log(result)
		//       })
		//   })
		// },
		// formChangeSettings () {
		//   this.loading = true
		//   this.$load(async () => {
		//     await this.set_organization_settings({
		//       action: 'set',
		//       type: 'organization',
		//       id: router.currentRoute._value.params.id,
		//       settings: this.settingsForm
		//     })
		//       .then((result) => {
		//         this.loading = false
		//         this.$toast.add({ severity: 'info', summary: 'Данные изменены', detail: 'Данные были успешно изменены', life: 3000 })
		//         this.get_organization_from_api()
		//       })
		//       .catch((result) => {
		//         console.log(result)
		//       })
		//   })
		// }
	},
	mounted() {
		this.org_profile_from_api({
			action: "get/org/profile",
			id: router.currentRoute._value.params.id,
		});
	},
	components: {
		// customModal,
		Toast,
		TabView,
		TabPanel,
		FileUpload,
		// Dropdown,
		// FloatLabel,
		// InputText,
		// InputNumber,
		// Accordion,
		// AccordionTab,
		Dialog,
		Checkbox,
		DropZone,
		Accordion,
	},
	computed: {
		...mapGetters(["org_profile"]),
	},
	watch: {
		org_profile: function (newVal, oldVal) {
			this.orgprofile = newVal;
		},
	},
};
</script>

<style lang="scss">
.flex-left {
	display: flex;
	justify-content: flex-start;
}

.kenost-add-button {
	&:hover {
		color: #fff;
	}
	.pi {
		font-size: 16px;
	}
}

.text-m {
	font-weight: 500;
	font-size: 14px;
}

.text-s {
	font-weight: 500;
	font-size: 14px;
}

.cursor-pointer {
	cursor: pointer;
}

.text-sm {
	color: #adadad;
	font-size: 14px;
}

.w-full {
	width: 100%;
}

.justify-between {
	justify-content: space-between;
}

.avatar-org {
	width: 200px !important;
	height: 200px;
	border-radius: 50%;
	overflow: hidden;

	img {
		width: 100% !important;
		height: 100% !important;
		object-fit: cover;
	}
}

.p-accordion-header-link {
	text-decoration: none !important;
}

.kenost-form-for + .kenost-form-for {
	border-top: 1px solid var(--grey-stroke, #e2e2e2);
	margin-top: 20px;
	padding-top: 20px;
}

.name-requisit {
	display: flex;
	align-items: center;
	margin-bottom: 12px;
	gap: 12px;

	p {
		margin: 0;
	}

	&-edit {
		width: 30px;
		height: 30px;
		border: 1px solid transparent;
		cursor: pointer;
		background: #f8f8f8 !important;
		box-shadow: rgba(0, 0, 0, 0.14) 0px 2px 2px 0px;
		display: flex;
		border-radius: 5px;
		align-items: center;
		transition: all 0.4s;
		justify-content: center;

		&:hover {
			border: 1px solid #64748b;
		}

		.pi {
			color: #64748b;
			font-size: 12px;
		}
	}

	&-delete {
		margin-left: 8px;
		width: 30px;
		height: 30px;
		border: 1px solid transparent;
		cursor: pointer;
		background: #f8f8f8 !important;
		box-shadow: rgba(0, 0, 0, 0.14) 0px 2px 2px 0px;
		display: flex;
		border-radius: 5px;
		align-items: center;
		transition: all 0.4s;
		justify-content: center;

		&:hover {
			border: 1px solid #64748b;
		}

		.pi {
			color: #64748b;
			font-size: 12px;
		}
	}
}

.kenost-form-grid {
	display: flex;
	flex-wrap: wrap;
	gap: 0 16px;

	.w-50 {
		width: calc(50% - 8px) !important;
	}

	input:read-only {
		background: #f4f4f4;
	}
}

.buttons_container {
	.dart-btn + .dart-btn {
		margin-left: 5px;
	}
}
.dart-upload_files .item img {
	max-width: 52px;
	width: 100%;
}
.dart-form-block {
	display: block;
	span.title {
		display: block;
		font-size: 24px;
		line-height: 1.3;
		font-weight: 500;
	}
	&__content {
		padding: 15px 0;
		.dart-form-group {
			padding-top: 15px;
		}
	}
	.p-float-label {
		label {
			margin-top: -0.5rem;
			transform: none;
		}
	}
}
</style>
