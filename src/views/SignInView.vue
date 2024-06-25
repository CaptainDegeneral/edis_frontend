<script setup>
import { ref, computed, onMounted } from 'vue';
import { useVuelidate } from '@vuelidate/core'
import { required, email, helpers } from '@vuelidate/validators'
import { useRouter } from 'vue-router'
import { authService } from '@/modules/auth-service'

const router = useRouter()

import InputField from '@/components/InputField.vue';
import DevelopedBy from '@/components/DevelopedBy.vue';
import Logo from '@/components/LogoComponent.vue';
import AuthButton from '@/components/AuthButton.vue';
import DangerAlertsList from '@/components/DangerAlertsList.vue'
import Loader from '@/components/LoaderComponent.vue';
import Modal from '@/components/ModalComponent.vue';

const emailField = ref('')
const passwordField = ref('')
const rememberMe = ref(false)

const isFieldFocused = ref(false);

const isLoading = ref(false);
const error = ref('');
const success = ref(false);
const isSent = ref(false);

const rules = computed(() => ({
    emailField: {
        required: helpers.withMessage("Укажите ваш email.", required),
        email: helpers.withMessage("Укажите действующий email адрес.", email)
    },
    passwordField: {
        required: helpers.withMessage("Укажите пароль.", required)
    }
}))

const v$ = useVuelidate(rules, { emailField, passwordField });

onMounted(() => { v$.value.$touch(); });

const handleFieldFocus = () => { isFieldFocused.value = true; };

const signIn = async () => {
    const formData = {
        email: emailField.value,
        password: passwordField.value,
    };

    isSent.value = false;
    success.value = false;
    error.value = '';

    try {
        isLoading.value = true;
        isSent.value = true;
        await authService.login(formData);
        success.value = true;
        error.value = '';

        setTimeout(() => { router.push('/') }, 2000);
    } catch (err) {
        success.value = false;
        error.value = err.message || 'Ошибка регистрации.';
        console.log(error.value);
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
                class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1
                        class="text-center text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        С возвращением!
                    </h1>
                    <form class="space-y-4 md:space-y-6" @submit.prevent="signIn" autocomplete="off">
                        <InputField v-model:value="v$.emailField.$model" @focus="handleFieldFocus" type="email"
                            name="email" id="email" label="Адрес электронной почты:" placeholder="name@company.com"
                            required />
                        <InputField v-model:value="v$.passwordField.$model" @focus="handleFieldFocus" type="password"
                            name="password" id="password" label="Пароль:" placeholder="••••••••" required />
                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <div class="flex items-center h-5">
                                    <input id="remember" aria-describedby="remember" type="checkbox"
                                        class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                                        v-model="rememberMe">
                                </div>
                                <div class="ml-3 text-base">
                                    <label for="remember"
                                        class="text-gray-500 dark:text-gray-300 cursor-pointer">Запомнить
                                        меня</label>
                                </div>
                            </div>
                            <router-link to="/password-reset"
                                class="text-base font-medium text-primary-600 hover:underline dark:text-primary-500">Забыли
                                пароль?</router-link>
                        </div>
                        <AuthButton :hasErrors="v$.$errors" buttonText="Войти" loginText="Ещё не зарегистрированы?"
                            link="/signup" linkText="Создать аккаунт!" />
                    </form>
                </div>
            </div>
            <DevelopedBy />
            <Transition>
                <DangerAlertsList v-if="isFieldFocused" :errors="v$.$errors"></DangerAlertsList>
            </Transition>
            <Transition>
                <Modal v-if="isLoading" :isBlured="false">
                    <h3 class="mb-5 text-lg font-semibold text-gray-700 dark:text-gray-400">Пожалуйста, подождите...
                    </h3>
                    <p class="text-base font-normal mb-5 text-gray-600">Мы проверяем ваши учетные данные. Это может
                        занять некоторое время, пожалуйста, не закрывайте страницу и оставайтесь на месте. Мы уведомим
                        вас сразу, как только процесс завершится.</p>
                    <p class="text-base font-normal mb-5 text-gray-600">Спасибо за ваше терпение!</p>
                </Modal>
            </Transition>
            <Transition>
                <Loader v-if="isLoading" :fullscreen="true" :should-catch-focus="true" />
            </Transition>
            <Transition>
                <Modal v-if="isSent && !isLoading && success" :isBlured="true">
                    <h3 class="mb-5 text-lg font-semibold text-gray-700 dark:text-gray-400">Добро пожаловать!</h3>
                    <p class="text-base font-normal mb-5 text-gray-600">Вы успешно вошли в систему. Спасибо за ваше
                        терпение!</p>
                </Modal>
            </Transition>
            <Transition>
                <Modal v-if="isSent && !isLoading && !success" :isBlured="true">
                    <h3 class="mb-5 text-lg font-semibold text-gray-700 dark:text-gray-400">Что-то пошло не так...</h3>
                    <p v-if="error.error == 'Неверный адрес электронной почты или пароль.'"
                        class="text-base font-normal mb-5 text-gray-600">Кажется, вы указали неверный адрес электронной
                        почты или пароль. Пожалуйста, проверьте введенные данные и попробуйте снова. Если вы забыли свой
                        пароль, воспользуйтесь функцией <a
                            class="text-primary-600 hover:underline group-hover:underline" href="">сброса пароля</a>.
                        Если у вас возникли другие трудности, пожалуйста, обратитесь к администратору.</p>
                    <p v-else class="text-base font-normal mb-5 text-gray-600">Кажется, во время авторизации произошла
                        ошибка. Пожалуйста, попробуйте снова или обратитесь к администратору.</p>
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
