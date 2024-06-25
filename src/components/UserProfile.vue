<script setup>

import { computed, defineProps, onMounted, ref } from 'vue'
import { useVuelidate } from '@vuelidate/core';
import { required, email, minLength, sameAs, helpers } from '@vuelidate/validators';

import InputField from '@/components/InputField.vue';
import Toggler from '@/components/TogglerComponent.vue';
import ValidationsErrorsList from '@/components/ValidationsErrorsList.vue';
import Loader from '@/components/LoaderWithText.vue';
import Modal from '@/components/ModalSecondComponent.vue';

import emitter from '@/modules/eventBus.js';
    
import { api } from '@/modules/axios-config.js';

const alpha = helpers.regex(/^[А-Яа-яЁё]+$/);

const firstNameField = ref('');
const lastNameField = ref('');
const emailField = ref('');
const passwordField = ref('');
const confirmPasswordField = ref('');

const strongPassword = helpers.withMessage(
  "Пароль должен включать заглавные и строчные буквы, цифры и специальные символы (!@#$%^&*(),.?\\':{}|<>-).",
  value => {
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>-]/.test(value);
    return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  }
);

const props = defineProps({
    userInfo: { type: Object, required: true }
})

const isPasswordUpdating = ref(false)
const isStaffUser = ref(props.userInfo.is_staff)
const isVerifiedUser = ref(props.userInfo.is_verified)
const isEditing = ref(false)
const isFieldFocused = ref(false)
const isLoading = ref(false)
const isSuccess = ref(false)
const isSent = ref(false)

const changeEditState = () => {
    isEditing.value = !isEditing.value
    isPasswordUpdating.value = false

    if (!isEditing.value) {
        firstNameField.value = props.userInfo.first_name;
        lastNameField.value = props.userInfo.last_name;
        emailField.value = props.userInfo.email;
        isStaffUser.value = props.userInfo.is_staff;
        isVerifiedUser.value = props.userInfo.is_verified;
    }
}

const userInfo = ref(props.userInfo);

firstNameField.value = userInfo.value.first_name;
lastNameField.value = userInfo.value.last_name;
emailField.value = userInfo.value.email;

const userUpdate = async () => {
    isEditing.value = true;
    isFieldFocused.value = true;

    const payload = {
        email: emailField.value,
        first_name: firstNameField.value,
        last_name: lastNameField.value,
        is_staff: isStaffUser.value,
        is_verified: isVerifiedUser.value
    };

    if (isPasswordUpdating.value) { payload.password = passwordField.value; }

    if (JSON.stringify(payload) !== JSON.stringify(userInfo.value)) {
        try {
            isLoading.value = true;
            
            isSent.value = false;
            
            const response = await api.patch(`/auth/users/update/${props.userInfo.id}`, payload);

            if (props.userInfo.id === userInfo.value.id) { userInfo.value = response.data; }

            changeEditState();
            
            isFieldFocused.value = true;
            isSent.value = true;
            isSuccess.value = response.status === 200;
            
            emitter.emit('userUpdated');
            
            firstNameField.value = response.data.first_name;
            lastNameField.value = response.data.last_name;
            emailField.value = response.data.email;
            isStaffUser.value = response.data.is_staff;
            isVerifiedUser.value = response.data.is_verified;
        } catch (error) {
            console.error(error);
            isLoading.value = false;
            isSuccess.value = false;
        } finally {
            isEditing.value = false;
            isFieldFocused.value = false;
            isLoading.value = false;
        }
    }
}

const rules = computed(() => ({
  firstNameField: {
    required: helpers.withMessage("Укажите имя пользователя.", required),
    alpha: helpers.withMessage("Имя может содержать только буквы.", alpha),
    minLength: helpers.withMessage("Имя должно быть не короче 2 символов.", minLength(2)),
  },
  lastNameField: {
    required: helpers.withMessage("Укажите фамилию пользователя.", required),
    alpha: helpers.withMessage("Фамилия может содержать только буквы.", alpha),
    minLength: helpers.withMessage("Фамилия должна быть не короче 2 символов.", minLength(2)),
  },
  emailField: {
    required: helpers.withMessage("Укажите email пользователя.", required),
    email: helpers.withMessage("Укажите корректный email.", email),
  },
  passwordField: {
    required: helpers.withMessage("Укажите новый пароль.", required),
    minLength: helpers.withMessage("Пароль должен быть не короче 9 символов.", minLength(9)),
    strongPassword,
  },
  confirmPasswordField: {
    required: helpers.withMessage("Подтвердите новый пароль.", required),
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

</script>

<template>
    <Transition>
        <modal v-if="isSuccess && isSent && !isLoading" type="Success"
            title="Обновление завершено!" subtitle="Данные успешно обновлены."
            text="Теперь информация актуальна и сохранена.">
        </modal>
    </Transition>
    <Transition>
        <modal v-if="!isSuccess && isSent && !isLoading" type="Error"
            title="Что-то пошло не так..." subtitle="При обновлении данных произошла ошибка."
            text="Пожалуйста, попробуйте выполнить обновление позже или к администратору.">
        </modal>
    </Transition>
    <transition>
        <loader v-if="isLoading" :fullscreen="true" :shouldCatchFocus="true">
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
    </transition>
    <form @submit.prevent="userUpdate" class="w-full grid grid-cols-2 gap-x-6 gap-y-5 pt-4">
        <input-field
            v-model:value="v$.firstNameField.$model"
            :disabled="!isEditing"
            :value="firstNameField.value"
            @focus="handleFieldFocus"
            type="text"
            name="first-name"
            id="first-name"
            label="Имя:"
        />
        <input-field
            :disabled="!isEditing"
            v-model:value="v$.lastNameField.$model"
            :value="lastNameField.value"
            @focus="handleFieldFocus"
            type="text"
            name="last-name"
            id="last-name"
            label="Фамилия:"
        />
        <div class="col-span-2 items-center">
            <input-field
                :disabled="!isEditing"
                v-model:value="v$.emailField.$model"
                @focus="handleFieldFocus"
                type="email"
                name="email"
                id="email"
                label="Адрес электронной почты:"
                :value="email.value"
            />
        </div>
        <div class="col-span-2 grid grid-cols-3">
          <div v-if="isEditing" class="flex justify-start">
            <Toggler v-model="isPasswordUpdating" label="Обновить пароль"/>
          </div>
          <div class="flex justify-center">
            <Toggler :disabled="!isEditing" v-model="isVerifiedUser" label="Аккаунт подтвержден" :value="props.userInfo.is_staff"/>
          </div>
          <div  class="flex justify-end col-start-3 col-end-4">
            <Toggler :disabled="!isEditing" v-model="isStaffUser" label="Статус персонала" :value="props.userInfo.is_staff"/>
          </div>
        </div>
        <transition>
          <input-field :disabled="!isEditing" v-model:value="v$.passwordField.$model" @focus="handleFieldFocus" type="password"
                       name="password" id="password" v-if="isPasswordUpdating" label="Новый пароль:"></input-field>
        </transition>
        <transition>
          <input-field :disabled="!isEditing" v-model:value="v$.confirmPasswordField.$model" @focus="handleFieldFocus"
                       type="password" name="confirm-password" id="confirm-password" v-if="isPasswordUpdating" label="Повторите новый пароль:"></input-field>
        </transition>
      <div v-if="!isEditing" class="w-full col-span-2 grid grid-cols-12 gap-2">
        <div class="col-span-1">
          <button @click="none" type="button" class="w-full h-full p-2 text-base font-medium text-center inline-flex items-center justify-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            <svg class="w-6 h-6 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
              <use href="/sprite.svg#icon-delete"></use>
            </svg>
          </button>
        </div>
        <div class="col-span-11">
          <button @click="changeEditState" type="button" class="w-full px-5 py-3 text-base font-medium text-center inline-flex items-center justify-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            <svg class="w-6 h-6 text-white me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
              <use href="/sprite.svg#icon-edit"></use>
            </svg>
            Редактировать пользователя
          </button>
        </div>
      </div>
      <div v-if="isEditing">
        <button @click="changeEditState" type="button" class="w-full px-5 py-3 text-base font-medium text-center inline-flex items-center justify-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          <svg class="w-6 h-6 text-white me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
            <use href="/sprite.svg#icon-cancel"></use>
          </svg>
          Отменить редактирование
        </button>
      </div>
      <div v-if="isEditing">
        <button
          :disabled="!(isPasswordUpdating ? v$.$errors.length === 0 : v$.firstNameField.$errors.length === 0 && v$.lastNameField.$errors.length === 0 && v$.emailField.$errors.length === 0)"
          type="submit"
          class="w-full px-5 py-3 text-base font-medium text-center inline-flex items-center justify-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 disabled:bg-gray-400 disabled:cursor-not-allowed dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          <svg class="w-6 h-6 text-white me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
            <use href="/sprite.svg#icon-save"></use>
          </svg>
          Сохранить изменения
        </button>
      </div>
    </form>
    <validations-errors-list
        :errors="v$.$errors.length"
        :firstNameErrors="v$.firstNameField.$errors"
        :lastNameErrors="v$.lastNameField.$errors"
        :emailErrors="v$.emailField.$errors"
        :passwordErrors="v$.passwordField.$errors"
        :confirmPasswordErrors="v$.confirmPasswordField.$errors"
        :isPasswordUpdating="isPasswordUpdating"
    />
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
