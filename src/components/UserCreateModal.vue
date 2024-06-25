<script setup>
import { ref, defineEmits, onMounted, computed } from 'vue'
import { required, email, sameAs, helpers, minLength } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'

import { api } from '@/modules/axios-config';

import InputField from '@/components/InputField.vue';
import Toggle from '@/components/TogglerComponent.vue';
import ValidationsErrorsList from '@/components/ValidationsErrorsList.vue';
import Loader from '@/components/LoaderWithText.vue';
import Modal from '@/components/ModalSecondComponent.vue';

import emitter from '@/modules/eventBus.js';

const user = ref({
  last_name: '',
  first_name: '',
  email: '',
  password: '',
  is_staff: false,
});

const passwordConfirm = ref('');

const strongPassword = helpers.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>-])[A-Za-z\d@$!%*?&]{9,}$/);
const russianAlpha = helpers.regex(/^[а-яА-ЯёЁ]*$/);

const rules = computed(() => ({
  user: {
    last_name: {
      required: helpers.withMessage("Укажите ваше имя.", required),
      russianAlpha: helpers.withMessage("Имя может содержать только русские буквы.", russianAlpha),
      minLength: helpers.withMessage("Имя должно быть не короче 2 символов.", minLength(2)),
    },
    first_name: {
      required: helpers.withMessage("Укажите вашу фамилию.", required),
      russianAlpha: helpers.withMessage("Фамилия может содержать только буквы.", russianAlpha),
      minLength: helpers.withMessage("Фамилия должна быть не короче 2 символов.", minLength(2)),
    },
    email: {
      required: helpers.withMessage("Укажите ваш email.", required),
      email: helpers.withMessage("Укажите действующий email адрес.", email),
    },
    password: {
      required: helpers.withMessage("Укажите пароль.", required),
      minLength: helpers.withMessage("Пароль должен быть не короче 9 символов.", minLength(9)),
      strongPassword: helpers.withMessage("Пароль должен включать заглавные и строчные буквы, цифры и специальные символы", strongPassword),
    },
    is_staff: {},
  },
  passwordConfirm: {
    required: helpers.withMessage("Подтвердите ваш пароль.", required),
    sameAs: helpers.withMessage("Пароли не совпадают.", sameAs(user.value.password))
  },
}));

const v$ = useVuelidate(rules, { user, passwordConfirm });

defineEmits([
  'closeModal'
]);

const isLoading = ref(false);
const isSent = ref(false);
const isSuccess = ref(false);

const createUser = async () => {
  isLoading.value = true;
  isSent.value = false;
  isSuccess.value = false;

  try {
    const response = await api.post('/auth/users/new', user.value);
    isSuccess.value = response.status === 201;
    isSent.value = isSuccess.value;

    emitter.emit('userAdded');

    user.value.first_name = '';
    user.value.last_name = '';
    user.value.email = '';
    user.value.is_staff = false;
    user.value.password = '';
    passwordConfirm.value = '';
  } catch (error) {
    console.error('Failed to create user:', error);
    isSuccess.value = false;
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  v$.value.$touch();
});


const isFieldFocused = ref(false);

const handleFieldFocus = () => { isFieldFocused.value = true; };

</script>

<template>
  <ValidationsErrorsList
    v-if="isFieldFocused"
    class="absolute errors-label"
    :password-errors="v$.user.password.$errors"
    :email-errors="v$.user.email.$errors"
    :last-name-errors="v$.user.last_name.$errors"
    :first-name-errors="v$.user.first_name.$errors"
    :confirmPasswordErrors="v$.passwordConfirm.$errors"
    :errors="v$.$errors.length"
  />
  <Transition>
    <modal v-if="isSuccess && isSent && !isLoading" type="Success"
           title="Добавление завершено!" subtitle="Пользователь успешно добавлен."
           text="Теперь информация актуальна и сохранена.">
    </modal>
  </Transition>
  <Transition>
    <modal v-if="!isSuccess && isSent && !isLoading" type="Error"
           title="Что-то пошло не так..." subtitle="При добавлении пользователя произошла ошибка."
           text="Пожалуйста, попробуйте выполнить обновление позже или к администратору.">
    </modal>
  </Transition>
  <transition>
    <loader v-if="isLoading" :fullscreen="true" :shouldCatchFocus="true">
      <template #default>
        <div class="w-96">
          <p class="pb-4 text-2xl font-normal text-gray-700">Обновление данных</p>
          <p class="text-base font-normal text-gray-700">
            Мы обрабатываем ваш запрос на добавление нового пользователя. Это может занять некоторое время.
            Пожалуйста, подождите немного.
          </p>
        </div>
      </template>
    </loader>
  </transition>
  <div class="fixed z-10 inset-0 overflow-y-auto flex flex-col items-center justify-center bg-gray-500 bg-opacity-70">
    <div class="relative w-3/5 p-8 bg-white flex flex-col items-center justify-center rounded-xl">
      <button @click.prevent="$emit('closeModal', false)" class="absolute top-2 right-2 text-blue-600 hover:text-blue-800 focus:outline-none">
        <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 8.586l3.293-3.293a1 1 0 011.414 1.414L11.414 10l3.293 3.293a1 1 0 01-1.414 1.414L10 11.414l-3.293 3.293a1 1 0 01-1.414-1.414L8.586 10 5.293 6.707a1 1 0 011.414-1.414L10 8.586z" clip-rule="evenodd"/>
        </svg>
      </button>
      <form @submit.prevent="createUser" class="w-full grid grid-cols-2 gap-x-6 gap-y-5">
        <div class="col-span-2 pb-5">
          <p class="text-4xl font-bold text-blue-900">Новый пользователь</p>
        </div>
        <input-field v-model:value="v$.user.first_name.$model" @focus="handleFieldFocus" label="Имя:"></input-field>
        <input-field v-model:value="v$.user.last_name.$model" @focus="handleFieldFocus" label="Фамилия:"></input-field>
        <div class="col-span-2 grid grid-cols-12 gap-6">
          <div class="col-span-9">
            <input-field v-model:value="v$.user.email.$model" @focus="handleFieldFocus" label="Адрес электронной почты:" type="email"></input-field>
          </div>
          <div class="col-span-3 pt-8 flex items-center justify-center">
            <toggle v-model="user.is_staff" label="Статус персонала"></toggle>
          </div>
        </div>
        <input-field v-model:value="v$.user.password.$model" @focus="handleFieldFocus" label="Пароль:" type="password"></input-field>
        <input-field v-model:value="v$.passwordConfirm.$model" @focus="handleFieldFocus" label="Повторите пароль:" type="password"></input-field>
        <div>
          <button
            @click.prevent="$emit('closeModal', false)"
            type="button"
            class="w-full px-5 py-3 text-base font-medium text-center inline-flex items-center justify-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 disabled:bg-gray-400 disabled:cursor-not-allowed dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            <svg class="w-6 h-6 text-white me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
              <use href="/sprite.svg#icon-cancel"></use>
            </svg>
            Отменить добавление
          </button>
        </div>
        <div>
          <button
            type="submit"
            :disabled="v$.$errors.length !== 0"
            class="w-full px-5 py-3 text-base font-medium text-center inline-flex items-center justify-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 disabled:bg-gray-400 disabled:cursor-not-allowed dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            <svg class="w-6 h-6 text-white me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
              <use href="/sprite.svg#icon-save"></use>
            </svg>
            Добавить пользователя
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.errors-label {
  top: 0;
  right: 0;
  z-index: 50;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>