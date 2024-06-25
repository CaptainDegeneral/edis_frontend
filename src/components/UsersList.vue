<script setup>
import { defineProps, ref, defineEmits } from 'vue';

import { api } from '@/modules/axios-config';

import UserCard from '@/components/UserCard.vue';
import Loader from '@/components/LoaderWithText.vue';
import TabsComponent from '@/components/TabsComponent.vue';
import UserProfile from '@/components/UserProfile.vue';
import UserCourses from '@/components/UserCourses.vue';

const props = defineProps({
  users: {
    type: Array,
    required: true
  },
  page: {
    type: Number,
    required: true,
  },
  pages: {
    type: Number,
    required: true
  }
});

const emit = defineEmits([
  'showMore',
]);

const nextPage = () => {
  if (props.page === props.pages) {
    emit('showMore', props.page);
  }

  emit('showMore', props.page + 1);
};

const selectedUserId = ref(null);
const userInfo = ref(null);
const userCourses = ref(null)

const isLoading = ref(null);

const setUser = async (userId) => {
    selectedUserId.value = userId;
    await fetchUserDetails(userId);
}

const fetchUserDetails = async (userId) => {
    try {
        isLoading.value = true;
        const user_response = await api.get(`/auth/users/${userId}`);
        const courses_response = await api.get(`/courses/user/${userId}`)
        userInfo.value = user_response.data;
        userCourses.value = courses_response.data;
        console.log(courses_response.data)
    } catch (error) {
        isLoading.value = false;
        console.error('Failed to fetch user details:', error);
    } finally {
        isLoading.value = false;
    }
}
</script>

<template>
  <div v-if="props.users.length !== 0" class="h-full w-full grid grid-cols-6 gap-3">
    <div class="col-span-2 overflow-auto pr-4" style="max-height: 80vh;" v-auto-animate>
      <UserCard @getUser="setUser" v-for="user in props.users" :key="user.id" :user="user" />
      <button
        :disabled="page === pages"
        @click.prevent="nextPage"
        type="button"
        class="w-full p-2 text-base font-medium text-center inline-flex items-center justify-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {{ page === pages  ? 'Конец списка' : 'Загрузить ещё' }}
      </button>
    </div>
    <transition>
      <loader v-if="isLoading" :fullscreen="true" :should-catch-focus="true">
        <template #default>
          <div class="w-96">
            <p class="pb-4 text-2xl font-normal text-gray-700">Загрузка</p>
            <p class="text-base font-normal text-gray-700">
              Загружаем информацию о пользователе. Это может занять некоторое время.
              Пожалуйста, подождите немного.
            </p>
          </div>
        </template>
      </loader>
    </transition>
    <div class="w-full col-span-4">
      <transition>
        <div v-if="!selectedUserId" class="h-full flex flex-col items-center justify-center p-40">
          <p class="text-center text-3xl text-gray-500 font-medium pb-8">Здесь будет информация о&nbsp;пользователе</p>
          <p class="text-center text-lg text-gray-400 font-normal">Выберите пользователя из&nbsp;списка слева для просмотра и&nbsp;обновления его персональных данных, а&nbsp;также для получения информации о&nbsp;его курсах.</p>
        </div>
      </transition>
      <transition>
        <div v-if="userInfo && !isLoading" class="h-full w-full flex items-start justify-center px-5">
          <tabs-component>
            <template #profile>
              <user-profile :userInfo="userInfo"></user-profile>
            </template>
            <template #courses>
              <user-courses

                :user-courses="userCourses"
              />
            </template>
          </tabs-component>
        </div>
      </transition>
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
