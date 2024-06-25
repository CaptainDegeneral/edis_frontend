<script setup>
import { ref, computed, onMounted } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, email, minLength, sameAs, helpers } from '@vuelidate/validators';

import axios from 'axios';

import InputField from '@/components/InputField.vue';
import DevelopedBy from '@/components/DevelopedBy.vue';
import Logo from '@/components/LogoComponent.vue';
import AuthButton from '@/components/AuthButton.vue';
import DangerAlertsList from '@/components/DangerAlertsList.vue';
import Loader from '@/components/LoaderComponent.vue';
import Modal from '@/components/ModalComponent.vue';

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

const firstNameField = ref('');
const lastNameField = ref('');
const emailField = ref('');
const passwordField = ref('');
const passwordConfirmField = ref('');

const isFieldFocused = ref(false);

const isLoading = ref(false);
const error = ref('');
const success = ref(false);
const isSent = ref(false);

const BASE_URL = 'https://edis.onrender.com/auth';

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
    passwordConfirmField: {
        required: helpers.withMessage("Подтвердите ваш пароль.", required),
        sameAs: helpers.withMessage("Пароли не совпадают.", sameAs(passwordField.value)),
    },
}));

const v$ = useVuelidate(rules, {
    firstNameField,
    lastNameField,
    emailField,
    passwordField,
    passwordConfirmField,
});

onMounted(() => {
    v$.value.$touch();
});

const handleFieldFocus = () => {
    isFieldFocused.value = true;
};

const signUp = async () => {
    const formData = {
        last_name: lastNameField.value,
        first_name: firstNameField.value,
        email: emailField.value,
        password: passwordField.value,
    };

    isSent.value = false;
    success.value = false;
    error.value = '';

    try {
        isLoading.value = true;

        isSent.value = true;

        const response = await axios.post(`${BASE_URL}/signup`, formData);

        if (response.data.success) {
            success.value = true;
            error.value = '';
        } else {
            success.value = false;
            error.value = response.data.error;
        }
    } catch (err) {
        success.value = false;
        error.value = err.response?.data?.error || 'Ошибка регистрации.';
        console.log(error.value.error);
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <section class="relative bg-gray-50 dark:bg-gray-900">
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <Logo />
            <div
                class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-2xl xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1
                        class="text-xl font-bold leading-tight tracking-tight text-center text-gray-900 md:text-2xl dark:text-white">
                        Добро пожаловать!
                    </h1>
                    <form class="space-y-4 md:space-y-6" @submit.prevent="signUp" autocomplete="off">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField v-model:value="v$.firstNameField.$model" @focus="handleFieldFocus" type="text"
                                name="first-name" id="first-name" label="Имя:" placeholder="Иван" required />
                            <InputField v-model:value="v$.lastNameField.$model" @focus="handleFieldFocus" type="text"
                                name="last-name" id="last-name" label="Фамилия:" placeholder="Иванов" required />
                        </div>
                        <InputField v-model:value="v$.emailField.$model" @focus="handleFieldFocus" type="email"
                            name="email" id="email" label="Адрес электронной почты:" placeholder="name@company.com"
                            required />
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField v-model:value="v$.passwordField.$model" @focus="handleFieldFocus"
                                type="password" name="password" id="password" label="Пароль:" placeholder="•••••••••"
                                required />
                            <InputField v-model:value="v$.passwordConfirmField.$model" @focus="handleFieldFocus"
                                type="password" name="confirm-password" id="confirm-password" label="Повторите пароль:"
                                placeholder="•••••••••" required />
                        </div>
                        <AuthButton :hasErrors="v$.$errors" buttonText="Создать аккаунт"
                            loginText="Уже зарегистрированы?" link="/signin" linkText="Войти!" />
                    </form>
                </div>
            </div>
            <DevelopedBy />
            <Transition>
                <DangerAlertsList v-if="isFieldFocused" :errors="v$.$errors" />
            </Transition>
            <Transition>
                <Modal v-if="isLoading" :isBlured="false">
                    <h3 class="mb-5 text-lg font-semibold text-gray-700 dark:text-gray-400">Почти готово! Подождите
                        немного...</h3>
                    <p class="text-base font-normal mb-5 text-gray-600">
                        Мы обрабатываем ваш запрос на регистрацию. Это может занять некоторое время, пожалуйста, не
                        закрывайте страницу и оставайтесь на месте. Мы уведомим вас сразу, как только процесс
                        завершится.
                    </p>
                    <p class="text-base font-normal mb-5 text-gray-600">Спасибо за ваше терпение!</p>
                </Modal>
            </Transition>
            <Transition>
                <Loader v-if="isLoading" :fullscreen="true" :should-catch-focus="true" />
            </Transition>
            <Transition>
                <Modal v-if="isSent && !isLoading && success" :isBlured="true">
                    <h3 class="mb-5 text-lg font-semibold text-gray-700 dark:text-gray-400">
                        Почти готово! Подтвердите регистрацию.
                    </h3>
                    <p class="text-base font-normal mb-5 text-gray-600">
                        Проверьте ваш почтовый ящик и подтвердите регистрацию. Спасибо за ваше терпение!
                    </p>
                </Modal>
            </Transition>
            <Transition>
                <Modal v-if="isSent && !isLoading && !success" :isBlured="true">
                    <h3 class="mb-5 text-lg font-semibold text-gray-700 dark:text-gray-400">
                        Что-то пошло не так...
                    </h3>
                    <p v-if="error.error == 'Пользователь с этим адресом электронной почты уже существует.'"
                        class="text-base font-normal mb-5 text-gray-600">
                        Кажется, пользователь с этим адресом электронной почты уже существует. Попробуйте использовать
                        другой адрес электронной почты или воспользуйтесь функцией
                        <a class="text-primary-600 hover:underline group-hover:underline" href="">
                            сброса пароля
                        </a>.
                        Если у вас возникли другие трудности, пожалуйста, обратитесь к администратору.
                    </p>
                    <p v-else class="text-base font-normal mb-5 text-gray-600">
                        Кажется, во время регистрации произошла ошибка. Пожалуйста, попробуйте снова или обратитесь к
                        администратору.
                    </p>
                </Modal>
            </Transition>
        </div>
    </section>
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
