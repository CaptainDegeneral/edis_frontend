<script setup>

import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import axios from 'axios'

import Loader from '@/components/LoaderComponent.vue';
import Modal from '@/components/ModalComponent.vue';

const route = useRoute()
const router = useRouter()

const isLoading = ref(true)
const success = ref(false)
const error = ref('')

const BASE_URL = 'https://edis.onrender.com/auth';

onMounted(async () => {
    const token = route.query.token
    if (token) {
        try {
            await axios.get(`${BASE_URL}/verify-email`, { params: { token } })
            success.value = true
            error.value = null
            setTimeout(() => { router.push('/signin') }, 3000)
        } catch (err) {
            error.value = 'Ошибка подтверждения: ' + (err.response?.data?.message || err.message)
            success.value = false
            setTimeout(() => { router.push('/signup') }, 3000)
        } finally {
            isLoading.value = false
            setTimeout(() => { router.push('/signup') }, 3000)
        }
    }
})

</script>

<template>
    <section class="relative bg-gray-50 dark:bg-gray-900">
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <Transition>
                <Modal v-if="isLoading" type="awaiting" :isBlured="false">
                    <h3 class="mb-5 text-lg font-semibold text-gray-700 dark:text-gray-400">
                        Пожалуйста, подождите...
                    </h3>
                    <p class="text-base font-normal mb-5 text-gray-600">
                        Мы завершаем процесс регистрации вашего аккаунта. Это может занять некоторое время, пожалуйста,
                        не закрывайте страницу и оставайтесь на месте. Мы уведомим вас сразу, как только процесс
                        завершится.
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
                <Modal v-if="!isLoading && success && !error" :isBlured="true">
                    <h3 class="mb-5 text-lg font-semibold text-gray-700 dark:text-gray-400">
                        Добро пожаловать!
                    </h3>
                    <p class="text-base font-normal mb-5 text-gray-600">
                        Вы успешно подтвердили свой адрес электронной почты. Спасибо за ваше терпение! Страница
                        авторизации откроется автоматически в ближайшее время.
                    </p>
                </Modal>
            </Transition>
            <Transition>
                <Modal v-if="!isLoading && error" :isBlured="true">
                    <h3 class="mb-5 text-lg font-semibold text-gray-700 dark:text-gray-400">
                        Что-то пошло не так...
                    </h3>
                    <p class="text-base font-normal mb-5 text-gray-600">
                        Кажется, во время подтверждения произошла ошибка. Пожалуйста, попробуйте снова или обратитесь к
                        администратору.
                    </p>
                </Modal>
            </Transition>
        </div>
    </section>
</template>

<style></style>
