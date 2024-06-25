<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/store/user-store'

import Logo from '@/components/LogoComponent.vue'
import DevelopedBy from '@/components/SBDevelopedBy.vue'
import ButtonComponent from '@/components/ButtonComponent.vue'
import SectionHeader from '@/components/SectionHeader.vue'
import ProfileSection from '@/components/ProfileSection.vue'
import UsersSection from '@/components/UsersSection.vue'
import { authService } from '@/modules/auth-service.js'
import LoaderWithText from '@/components/LoaderWithText.vue'
import CourseCreateModal from '@/components/CourseCreateModal.vue'
import MyCoursesSection from '@/components/MyCoursesSection.vue'

const userStore = useUserStore()

const isLoggingOut = ref(false)

const logout = async () => {
  isLoggingOut.value = true
  try {
    await authService.logout()
  } catch (error) {
    isLoggingOut.value = false
  } finally {
    isLoggingOut.value = false
  }
}

const selectedSection = ref('profile')

const changeSection = (section) => {
  selectedSection.value = section
}

const isCourseCreated = ref(false)

const showModal = () => {
  isCourseCreated.value = !isCourseCreated.value
}

const closeModal = (e) => {
  isCourseCreated.value = e
}

</script>
<template>
  <transition>
    <loader-with-text v-if="isLoggingOut">
      <p class="text-xl font-medium text-gray-600">Обработка...</p>
    </loader-with-text>
  </transition>
  <transition>
    <course-create-modal v-if="isCourseCreated" @close-modal="closeModal"></course-create-modal>
  </transition>
  <div class="flex">
    <aside class="w-72 bg-white h-screen fixed top-0 left-0 shadow-md flex flex-col">
      <div>
        <div class="bg-white border-r p-5 flex flex-col items-center">
          <logo></logo>
          <div class="w-72 border-b mb-5 border-gray-200"></div>
          <h2 class="text-2xl text-blue-900 font-bold">
            {{ userStore.user.first_name }} {{ userStore.user.last_name }}
          </h2>
          <p class="text-gray-600 pb-6">
            {{ userStore.user.email }}
          </p>
          <ButtonComponent :label="'Новый курс'" :icon="'/sprite.svg#icon-new-course'"
                           @click.prevent="showModal" />
          <ButtonComponent :label="'Выход'" :icon="'/sprite.svg#icon-logout'" @click.prevent="logout" />
        </div>
        <nav
          class="pt-5 space-y-2 border-t overflow-y-auto py-5 px-5 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <ul class="space-y-2">
            <li>
              <ButtonComponent :label="'Профиль'" :icon="'/sprite.svg#icon-profile'"
                               @click="() => changeSection('profile')"
                               :buttonClass="'w-full flex items-center p-2 me-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'"
                               :iconClass="'w-8 h-8 text-gray-400 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'"
                               :labelClass="'ml-3'">
              </ButtonComponent>
            </li>
            <li v-if="!userStore.isAdmin">
              <ButtonComponent :label="'Мои курсы'" :icon="'/sprite.svg#icon-my-courses-1'"
                               @click="() => changeSection('myCourses')"
                               :buttonClass="'w-full flex items-center p-2 me-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'"
                               :iconClass="'flex-shrink-0 w-8 h-8 text-gray-400 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white'"
                               :labelClass="'ml-3'">
              </ButtonComponent>
            </li>
            <li v-if="userStore.isAdmin">
              <ButtonComponent :label="'Пользователи'" :icon="'/sprite.svg#icon-users'"
                               @click="() => changeSection('users')"
                               :buttonClass="'w-full flex items-center p-2 me-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'"
                               :iconClass="'w-8 h-8 text-gray-400 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'"
                               :labelClass="'ml-3'">
              </ButtonComponent>
            </li>
          </ul>
        </nav>
      </div>
      <developed-by></developed-by>
    </aside>
    <main class="ml-72 p-5 w-screen h-screen">
      <section class="w-full h-full overflow-x-hidden">
        <div v-if="selectedSection === 'profile'" class="h-full relative">
          <ProfileSection :user="userStore.user"></ProfileSection>
        </div>
        <div v-else-if="selectedSection === 'myCourses'" class="h-full">
          <my-courses-section></my-courses-section>
        </div>
        <div v-else-if="selectedSection === 'users'" class="h-full">
          <UsersSection></UsersSection>
        </div>
      </section>
    </main>
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