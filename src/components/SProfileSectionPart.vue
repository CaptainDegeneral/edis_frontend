<script setup>

import { computed, onMounted, onUnmounted, ref } from 'vue'
import { api } from '@/modules/axios-config.js'
import { useUserStore } from '@/store/user-store.js'
import { useVuelidate } from '@vuelidate/core'
import { email, helpers, minLength, required, sameAs } from '@vuelidate/validators'
import emitter from '@/modules/eventBus.js'

import InputField from '@/components/InputField.vue'
import Toggle from '@/components/TogglerComponent.vue'
import SectionHeader from '@/components/SectionHeader.vue'
import ButtonComponent from '@/components/ButtonComponent.vue'
import UserCourses from '@/components/UserCourses.vue'
import NotFound from '@/components/NotFound.vue'
import Loader from '@/components/LoaderWithText.vue'
import Modal from '@/components/ModalSecondComponent.vue'
import ValidationsErrorsList from '@/components/ValidationsErrorsList.vue'

const props = defineProps({
  user: { type: Object, required: true }
})

const userStore = useUserStore()

const userCoursesData = ref([])

const isLoading = ref(false)
const isSuccess = ref(false)
const isEditing = ref(false)
const isChecked = ref(false)
const isSent = ref(false)

const userData = ref({
  last_name: userStore.user.last_name,
  first_name: userStore.user.first_name,
  email: userStore.user.email,
  password: '',
});

const confirm_password = ref('')

const changeEditState = () => {
  isEditing.value = !isEditing.value;
  isChecked.value = false;

  userData.value.last_name = userStore.user.last_name;
  userData.value.first_name = userStore.user.first_name;
  userData.value.email = userStore.user.email;

  userData.value.password = '';
  confirm_password.value = '';
};

const strongPassword = helpers.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>-])[A-Za-z\d@$!%*?&]{9,}$/);
const russianAlpha = helpers.regex(/^[а-яА-ЯёЁ]*$/);

const rules = computed(() => ({
  userData: {
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
    }
  },
  confirm_password: {
    required: helpers.withMessage("Подтвердите ваш пароль.", required),
    sameAs: helpers.withMessage("Пароли не совпадают.", sameAs(userData.value.password))
  }
}))

const v$ = useVuelidate(rules, { userData, confirm_password });

const fetchCourses = async () => {
  isLoading.value = true
  try {
    const response = await api.get(`/courses/user/${props.user.id}`);
    userCoursesData.value = response.data;
    isSuccess.value = response.status === 200
    isLoading.value = false
  } catch (err) {
    isLoading.value = false
    console.error('Error fetching courses:', err.message);
  } finally {
    isLoading.value = false
    console.log('Fetch courses request completed.');
  }
}

const isUpdating = ref(false)

const updateProfile = async () => {
  try {
    isUpdating.value = true;
    isSent.value = true;

    const payload = {
      email: userData.value.email,
      first_name: userData.value.first_name,
      last_name: userData.value.last_name
    };

    if (isChecked.value) {
      payload.password = userData.value.password
    }

    const response = await api.patch(`/auth/users/update/${userStore.user.id}`, payload);

    userStore.setUser(response.data);

    changeEditState();

    userData.value.first_name = response.data.first_name;
    userData.value.last_name = response.data.last_name;
    userData.value.email = response.data.email;

    isSuccess.value = true;
  } catch (error) {
    isUpdating.value = false;
    isSuccess.value = false;

    console.error(error);
  } finally {
    isUpdating.value = false;
  }
}

onMounted(() => {
  fetchCourses();
  v$.value.$touch();
  emitter.on('newCourseAdded', fetchCourses);
});

onUnmounted(() => {
  emitter.off('newCourseAdded');
})

// Вычисляемое свойство для подсчета непроцессированных курсов
const unprocessedCoursesCount = computed(() => {
  return userCoursesData.value.filter(course => !course.is_processed).length;
});

// Вычисляемое свойство для форматирования результата
const formattedUnprocessedCoursesCount = computed(() => {
  return unprocessedCoursesCount.value > 10 ? '10+' : unprocessedCoursesCount.value;
});

</script>

<template>

  <validations-errors-list
    class="errors-label"
    :errors="v$.userData.$errors.length"
    :first-name-errors="v$.userData.first_name.$errors"
    :last-name-errors="v$.userData.last_name.$errors"
    :email-errors="v$.userData.email.$errors"
    :password-errors="v$.userData.password.$errors"
    :confirm-password-errors="v$.confirm_password.$errors"
    :is-password-updating="isChecked"
  />

  <Transition>
    <loader v-if="isUpdating" :fullscreen="true" :should-catch-focus="true">
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
    <modal v-if="isSuccess && isSent && !isUpdating" type="Success"
           title="Обновление завершено!" subtitle="Ваши данные успешно обновлены."
           text="Теперь ваша информация актуальна и сохранена."></modal>
  </Transition>

  <Transition>
    <modal v-if="!isSuccess && isSent && !isUpdating" type="Error"
           title="Что-то пошло не так..." subtitle="При обновлении данных произошла ошибка."
           text="Пожалуйста, попробуйте выполнить обновление позже или к администратору.">
    </modal>
  </Transition>

  <transition>
    <loader v-if="isLoading" :fullscreen="true" :should-catch-focus="true">
      <template #default>
        <div class="w-96">
          <p class="pb-4 text-2xl font-normal text-gray-700">Загрузка</p>
          <p class="text-base font-normal text-gray-700">
            Загружаем информацию профиля. Это может занять некоторое время.
            Пожалуйста, подождите немного.
          </p>
        </div>
      </template>
    </loader>
  </transition>

  <div v-if="!isLoading" class="w-full h-fit grid grid-rows-[auto,1fr] gap-y-4">
    <div class="h-fit">
      <section-header icon="/sprite.svg#icon-profile" title="Профиль">
        <div>
          <div class="w-52 mr-1">
            <ButtonComponent v-if="!isEditing" label="Редактировать" icon="/sprite.svg#icon-edit"
                             @click="changeEditState">
            </ButtonComponent>
          </div>
          <div class="w-52 mr-1">
            <ButtonComponent v-if="isEditing" label="Отмена" icon="/sprite.svg#icon-cancel"
                             @click="changeEditState">
            </ButtonComponent>
          </div>
        </div>
      </section-header>
    </div>
    <div class="grid grid-cols-3">
      <div class="col-span-1 border-r pr-4">
        <p class="text-3xl text-blue-600 font-medium mb-4">Личная информация</p>
        <form
          @submit.prevent="updateProfile"
          class="grid grid-rows-[1fr,1fr,1fr,auto,1fr,1fr,auto] gap-4">
          <input-field label="Имя:" v-model:value="v$.userData.first_name.$model" :disabled="!isEditing" :value="userStore.user.first_name"></input-field>
          <input-field label="Фамилия:" v-model:value="v$.userData.last_name.$model" :disabled="!isEditing" :value="userStore.user.last_name"></input-field>
          <input-field label="Адрес электронной почты:" v-model:value="v$.userData.email.$model" :disabled="!isEditing" :value="userStore.user.email"></input-field>
          <div v-if="isEditing" class="pl-1 flex items-center">
            <toggle v-model="isChecked" label="Обновить пароль"></toggle>
          </div>
          <input-field v-model:value="v$.userData.password.$model" v-if="isEditing && isChecked" label="Обновить пароль"></input-field>
          <input-field v-model:value="v$.confirm_password.$model" v-if="isEditing && isChecked" label="Повторите пароль:"></input-field>
          <button
            v-if="isEditing"
            type="submit"
            :disabled="!(isChecked ? v$.userData.$errors.length === 0 && v$.userData.password.$errors.length === 0 && v$.confirm_password.$errors.length === 0 :
                          v$.userData.first_name.$errors.length === 0 && v$.userData.last_name.$errors.length === 0 && v$.userData.email.$errors.length === 0)"
            class="w-full h-min text-lg text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg px-5 py-2.5 text-center disabled:bg-gray-400 disabled:cursor-not-allowed dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
            Сохранить
          </button>
        </form>
      </div>
      <div class="col-span-2 pl-4">
        <p class="text-3xl text-blue-600 font-medium flex flex-row items-end">
          Курсы
          <span v-if="unprocessedCoursesCount > 0" class="inline-flex items-center justify-center w-[1.875rem] h-[1.875rem] ms-3 text-sm font-semibold bg-yellow-100 text-yellow-800 rounded-full">
            {{ formattedUnprocessedCoursesCount }}
          </span>
        </p>
        <user-courses
          v-if="userCoursesData.length > 0 && !isLoading" :user-courses="userCoursesData"
          @update-courses-list="fetchCourses"
        />
        <not-found v-else :items="userCoursesData" type="current_courses"></not-found>
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

.errors-label {
  top: -20px;
  right: -20px;
}
</style>