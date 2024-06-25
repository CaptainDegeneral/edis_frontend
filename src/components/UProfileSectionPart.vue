<script setup>

import { ref, onMounted, computed, defineProps } from 'vue';
import { useUserStore } from '@/store/user-store';
import { api } from '@/modules/axios-config';
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength, sameAs, helpers } from '@vuelidate/validators';

import InputField from '@/components/InputField.vue';
import SectionHeader from '@/components/SectionHeader.vue';
import ButtonComponent from '@/components/ButtonComponent.vue';
import TogglerComponent from '@/components/TogglerComponent.vue'
import ValidationErrors from '@/components/ValidationErrors.vue'
import Loader from '@/components/LoaderWithText.vue';
import Modal from '@/components/ModalSecondComponent.vue';

const props = defineProps({
    user: { type: Object, required: true }
})

const alpha = helpers.regex(/^[А-Яа-яЁё]+$/);

const strongPassword = helpers.withMessage(
    'Пароль должен включать заглавные и строчные буквы, цифры и специальные символы (!@#$%^&*(),.?":{}|<>-).',
    value => {
        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>-]/.test(value);
        return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
    }
);

const userStore = useUserStore();

const isEditing = ref(false);
const isChecked = ref(false);
const isStaff = ref(props.user.is_staff)
const isFieldFocused = ref(false);

const proccess = ref({
    isLoading: false,
    isSent: false,
    isSuccess: false
})

const firstNameField = ref(props.user.first_name)
const lastNameField = ref(props.user.last_name)
const emailField = ref(props.user.email)
const passwordField = ref('')
const confirmPasswordField = ref('')

const rules = computed(() => ({
    firstNameField: {
        required: helpers.withMessage("Укажите ваше имя.", required),
        alpha: helpers.withMessage("Имя может содержать только буквы.", alpha),
        minLength: helpers.withMessage("Имя должно быть не короче 2 символов.", minLength(2)),
    },
    lastNameField: {
        required: helpers.withMessage("Укажите вашу фамилию.", required),
        alpha: helpers.withMessage("Фамилия может содержать только буквы.", alpha),
        minLength: helpers.withMessage("Фамилия должна быть не короче 2 символов.", minLength(2)),
    },
    emailField: {
        required: helpers.withMessage("Укажите ваш email.", required),
        email: helpers.withMessage("Укажите действующий email адрес.", email),
    },
    passwordField: {
        required: helpers.withMessage("Укажите пароль.", required),
        minLength: helpers.withMessage("Пароль должен быть не короче 9 символов.", minLength(9)),
        strongPassword,
    },
    confirmPasswordField: {
        required: helpers.withMessage("Подтвердите ваш пароль.", required),
        sameAs: helpers.withMessage("Пароли не совпадают.", sameAs(passwordField.value)),
    },
}));

const v$ = useVuelidate(rules, {
    firstNameField,
    lastNameField,
    emailField,
    passwordField,
    confirmPasswordField,
});

onMounted(() => { v$.value.$touch(); });

const handleFieldFocus = () => { isFieldFocused.value = true; };

const changeEditState = () => {
    isEditing.value = !isEditing.value;
    isChecked.value = false

    firstNameField.value = props.user.first_name
    lastNameField.value = props.user.last_name
    emailField.value = props.user.email
};

const updateProfile = async () => {
    try {
        proccess.value.isLoading = true;
        proccess.value.isSent = true;

        const payload = {
            email: emailField.value,
            first_name: firstNameField.value,
            last_name: lastNameField.value,
        };

        if (isChecked.value) { payload.password = passwordField.value; }

        if (isStaff.value && props.user.id !== userStore.user.id) { payload.is_staff = isStaff.value; }

        const response = await api.patch(`/auth/users/update/${props.user.id}`, payload);

        if (props.user.id === userStore.user.id) { userStore.setUser(response.data); }

        changeEditState()

        firstNameField.value = response.data.first_name
        lastNameField.value = response.data.last_name
        emailField.value = response.data.email

        proccess.value.isSuccess = true
    } catch (error) {
        proccess.value.isLoading = false;
        proccess.value.isSuccess = false;

        console.error(error);
    }
    finally {
        proccess.value.isLoading = false;
    }
};

</script>

<template>
    <Transition>
        <loader v-if="proccess.isLoading" :fullscreen="true" :should-catch-focus="true">
            <template #default>
                <div class="w-96">
                    <p class="pb-4 text-2xl font-normal text-gray-700">Обновление данных</p>
                    <p class="text-base font-normal text-gray-700">
                        Мы обрабатываем ваш запрос на обновление персональных данных. Это может занять некоторое время.
                        Пожалуйста, подождите немного.
                    </p>
                </div>
            </template>
        </loader>
    </Transition>
    <Transition>
        <modal v-if="proccess.isSuccess && proccess.isSent && !proccess.isLoading" type="Success"
            title="Обновление завершено!" subtitle="Ваши данные успешно обновлены."
            text="Теперь ваша информация актуальна и сохранена."></modal>
    </Transition>
    <Transition>
        <modal v-if="!proccess.isSuccess && proccess.isSent && !proccess.isLoading" type="Error"
            title="Что-то пошло не так..." subtitle="При обновлении данных произошла ошибка."
            text="Пожалуйста, попробуйте выполнить обновление позже или к администратору.">
        </modal>
    </Transition>
    <div class="h-full flex flex-col">
        <section-header icon=" /sprite.svg#icon-profile" title="Профиль">
            <div>
                <div class="w-52 mr-1">
                    <ButtonComponent v-if="!isEditing" :label="'Редактировать'" :icon="'/sprite.svg#icon-edit'"
                        @click="changeEditState">
                    </ButtonComponent>
                </div>
                <div class="w-52 mr-1">
                    <ButtonComponent v-if="isEditing" :label="'Отмена'" :icon="'/sprite.svg#icon-cancel'"
                        @click="changeEditState">
                    </ButtonComponent>
                </div>
            </div>
        </section-header>
        <div class="h-full w-full flex flex-row items-center justify-center gap-6">
            <form class="w-1/2 flex flex-col gap-5" @submit.prevent="updateProfile">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input-field v-model:value="v$.firstNameField.$model" @focus="handleFieldFocus" type="text"
                        name="first-name" id="first-name" label="Имя:" :value="userStore.user.first_name"
                        :disabled="!isEditing" required>
                    </input-field>
                    <input-field v-model:value="v$.lastNameField.$model" @focus="handleFieldFocus" type="text"
                        name="last-name" id="last-name" label="Фамилия:" :value="userStore.user.last_name"
                        :disabled="!isEditing" required>
                    </input-field>
                </div>
                <input-field v-model:value="v$.emailField.$model" @focus="handleFieldFocus" type="email" name="email"
                    id="email" label="Адрес электронной почты:" :value="userStore.user.email" :disabled="!isEditing"
                    required>
                </input-field>
                <div class="flex flex-row items-center justify-between">
                    <Transition>
                        <toggler-component v-if="isEditing" v-model="isChecked"
                            label="Обновить пароль"></toggler-component>
                    </Transition>
                    <Transition>
                        <toggler-component v-if="isEditing && isStaff && props.user.id !== userStore.user.id"
                            label="Статус персонала"></toggler-component>
                    </Transition>
                </div>
                <Transition>
                    <div v-if="isChecked && isEditing" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input-field v-model:value="v$.passwordField.$model" @focus="handleFieldFocus" type="password"
                            name="password" id="password" label="Новый пароль:" placeholder="•••••••••" required>
                        </input-field>
                        <input-field v-model:value="v$.confirmPasswordField.$model" @focus="handleFieldFocus"
                            type="password" name="confirm-password" id="confirm-password" label="Повторите пароль:"
                            placeholder="•••••••••" required>
                        </input-field>
                    </div>
                </Transition>
                <Transition>
                    <button type="submit" v-if="isEditing"
                        :disabled="!(isChecked ? v$.$errors.length === 0 :
                            v$.firstNameField.$errors.length === 0 && v$.lastNameField.$errors.length === 0 && v$.emailField.$errors.length === 0)"
                        class="w-full text-lg text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg px-5 py-2.5 text-center disabled:bg-gray-400 disabled:cursor-not-allowed dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                        Сохранить
                    </button>
                </Transition>
            </form>
            <div v-auto-animate
                class="absolute ml-[76rem] mt-[6.75rem] p-4 inset-0 flex flex-col items-start justify-start">
                <validation-errors :errors="v$.firstNameField.$errors" v-if="v$.firstNameField.$errors.length > 0" />
                <validation-errors :errors="v$.lastNameField.$errors" v-if="v$.lastNameField.$errors.length > 0" />
                <validation-errors :errors="v$.emailField.$errors" v-if="v$.emailField.$errors.length > 0" />
                <div v-auto-animate v-if="isChecked">
                    <validation-errors :errors="v$.passwordField.$errors" v-if="v$.passwordField.$errors.length > 0" />
                    <validation-errors :errors="v$.confirmPasswordField.$errors"
                        v-if="v$.confirmPasswordField.$errors.length > 0" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>