<script setup>

import { ref, computed, onMounted } from 'vue';
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, sameAs, helpers } from '@vuelidate/validators'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

import axios from 'axios';

import InputField from '@/components/InputField.vue';
import DevelopedBy from '@/components/DevelopedBy.vue';
import Logo from '@/components/LogoComponent.vue';
import AuthButton from '@/components/AuthButton.vue';
import DangerAlertsList from '@/components/DangerAlertsList.vue'
import Loader from '@/components/LoaderComponent.vue';
import Modal from '@/components/ModalComponent.vue';

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

const passwordField = ref('')
const passwordConfirmField = ref('')

const isFieldFocused = ref(false);

const isLoading = ref(false);
const success = ref(false);
const isSent = ref(false);

const BASE_URL = 'https://edis.onrender.com/auth';

const rules = computed(() => ({
    passwordField: {
        required: helpers.withMessage("Укажите пароль.", required),
        minLength: helpers.withMessage("Пароль должен быть не короче 9 символов.", minLength(9)),
        strongPassword
    },
    passwordConfirmField: {
        required: helpers.withMessage("Подтвердите ваш пароль.", required),
        sameAs: helpers.withMessage("Пароли не совпадают.", sameAs(passwordField.value)),
    },
}))

const v$ = useVuelidate(rules, { passwordField, passwordConfirmField });

onMounted(() => { v$.value.$touch(); });

const handleFieldFocus = () => { isFieldFocused.value = true; };

const passwordReset = async () => {

    isSent.value = false;
    success.value = false;

    try {
        isLoading.value = true;
        isSent.value = true;

        const uidb64 = route.params.uidb64
        const token = route.params.token

        const response = await axios.patch(
            `${BASE_URL}/password-reset-complete`,
            { uidb64, token, password: passwordField.value }
        )

        if (response.data.success) {

            success.value = true;
            setTimeout(() => { router.push('/signin') }, 5000)

        } else { success.value = false; }
    } catch (err) { success.value = false; }
    finally { isLoading.value = false; }
};

</script>

<template>
    <section class="relative bg-gray-50 dark:bg-gray-900">

        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">

            <Logo />

            <div
                class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">

                <div class="p-6 space-y-4 md:space-y-6 sm:p-8">

                    <h1
                        class="text-center text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Почти готово!
                    </h1>

                    <form class="space-y-4 md:space-y-6" @submit.prevent="passwordReset" autocomplete="off">

                        <InputField v-model:value="v$.passwordField.$model" @focus="handleFieldFocus" type="password"
                            name="password" id="password" label="Новый пароль:" placeholder="•••••••••" required />

                        <InputField v-model:value="v$.passwordConfirmField.$model" @focus="handleFieldFocus"
                            type="password" name="confirm-password" id="confirm-password"
                            label="Повторите новый пароль:" placeholder="•••••••••" required />

                        <div class="flex items-center justify-between">

                            <router-link to="/signin"
                                class="text-base font-medium text-primary-600 hover:underline dark:text-primary-500">
                                Вход
                            </router-link>

                            <router-link to="/signup"
                                class="text-base font-medium text-primary-600 hover:underline dark:text-primary-500">
                                Создать аккаунт
                            </router-link>

                        </div>

                        <AuthButton :hasErrors="v$.$errors" buttonText="Сохранить новый пароль" />

                    </form>

                </div>

            </div>

            <DevelopedBy />

            <Transition>
                <DangerAlertsList v-if="isFieldFocused" :errors="v$.$errors"></DangerAlertsList>
            </Transition>

            <Transition>
                <Modal v-if="isLoading" type="awaiting" :isBlured="false">
                    <h3 class="mb-5 text-lg font-semibold text-gray-700 dark:text-gray-400">
                        Пожалуйста, подождите...
                    </h3>
                    <p class="text-base font-normal mb-5 text-gray-600">
                        Пожалуйста, подождите, пока мы обрабатываем ваш запрос на смену пароля. Это может занять
                        некоторое время. Не закрывайте страницу и оставайтесь на месте. Мы уведомим вас сразу, как
                        только процесс будет завершен.
                    </p>
                    <p class="text-base font-normal mb-5 text-gray-600">
                        Спасибо за ваше терпение!
                    </p>
                </Modal>
            </Transition>
            <Transition>
                <Loader v-if="isLoading" :fullscreen="true" :should-catch-focus="true" />
            </Transition>
            <Transition>
                <Modal v-if="isSent && !isLoading && success" :isBlured="true">
                    <h3 class="mb-5 text-lg font-semibold text-gray-700 dark:text-gray-400">
                        Всё готово!
                    </h3>
                    <p class="text-base font-normal mb-5 text-gray-600">
                        Ваш пароль был успешно изменен. Спасибо за ваше терпение! Страница авторизации откроется
                        автоматически в ближайшее время.
                    </p>
                </Modal>
            </Transition>
            <Transition>
                <Modal v-if="isSent && !isLoading && !success" :isBlured="true">
                    <h3 class="mb-5 text-lg font-semibold text-gray-700 dark:text-gray-400">
                        Что-то пошло не так...
                    </h3>
                    <p class="text-base font-normal mb-5 text-gray-600">
                        Кажется, во время смены пароля произошла ошибка. Пожалуйста, попробуйте снова или обратитесь к
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
